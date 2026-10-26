import * as THREE from 'three';
import { GAME_CONFIG, LANE_INDICES } from './Constants.js';
import { CorridorChunk } from './CorridorChunk.js';
import { CanteenChunk } from './CanteenChunk.js';
import { ParkingChunk } from './ParkingChunk.js';
import { ObstacleFactory } from './ObstacleFactory.js';

/**
 * EnvironmentManager
 * Manages the seamless endless stream of school chunks (Corridor -> Canteen -> Parking),
 * obstacle placement, collectible coins, and power-ups.
 */
export class EnvironmentManager {
  constructor(scene) {
    this.scene = scene;
    this.obstacleFactory = new ObstacleFactory();

    this.activeChunks = [];
    this.activeObstacles = [];
    this.activeCoins = [];
    this.activePowerups = [];

    this.nextChunkZ = 0;
    this.chunkCount = 0;
    this.currentZone = GAME_CONFIG.ZONES.CORRIDOR;

    this.initPool();
  }

  initPool() {
    // Initial spawn of chunks ahead of player
    for (let i = 0; i < GAME_CONFIG.VISIBLE_CHUNKS; i++) {
      this.spawnNextChunk(i === 0); // First chunk has no obstacles for a clean start
    }
  }

  determineZone() {
    const zoneIndex = Math.floor(this.chunkCount / GAME_CONFIG.ZONE_DURATION_CHUNKS) % 3;
    if (zoneIndex === 0) return GAME_CONFIG.ZONES.CORRIDOR;
    if (zoneIndex === 1) return GAME_CONFIG.ZONES.CANTEEN;
    return GAME_CONFIG.ZONES.PARKING;
  }

  spawnNextChunk(isEmptyStart = false) {
    this.currentZone = this.determineZone();

    let chunk;
    if (this.currentZone === GAME_CONFIG.ZONES.CORRIDOR) {
      chunk = new CorridorChunk();
    } else if (this.currentZone === GAME_CONFIG.ZONES.CANTEEN) {
      chunk = new CanteenChunk();
    } else {
      chunk = new ParkingChunk();
    }

    chunk.setPosition(this.nextChunkZ);
    this.scene.add(chunk.mesh);
    this.activeChunks.push(chunk);

    if (!isEmptyStart) {
      this.populateChunk(chunk, this.nextChunkZ);
    }

    this.nextChunkZ += GAME_CONFIG.CHUNK_LENGTH;
    this.chunkCount++;
  }

  populateChunk(chunk, baseZ) {
    // Generate 3 to 4 obstacle waves per chunk
    const waveCount = 3;
    const waveSpacing = GAME_CONFIG.CHUNK_LENGTH / (waveCount + 1);

    for (let w = 1; w <= waveCount; w++) {
      const waveZ = baseZ + w * waveSpacing;
      this.spawnObstacleWave(waveZ);
    }

    // Spawn coin lines or arcs between obstacles
    for (let c = 0; c < 2; c++) {
      const coinZ = baseZ + (c + 0.5) * (GAME_CONFIG.CHUNK_LENGTH / 2);
      this.spawnCoinPattern(coinZ);
    }

    // Occasional power-up spawn (every ~2 chunks)
    if (Math.random() < 0.45 && this.chunkCount > 1) {
      this.spawnRandomPowerup(baseZ + GAME_CONFIG.CHUNK_LENGTH * 0.5);
    }
  }

  spawnObstacleWave(z) {
    // Always leave at least one lane completely clear or jumpable!
    const lanes = [0, 1, 2];
    const occupiedCount = Math.random() < 0.6 ? 2 : 1; // 1 or 2 obstacles in wave

    // Shuffle lanes
    lanes.sort(() => Math.random() - 0.5);

    for (let i = 0; i < occupiedCount; i++) {
      const laneIdx = lanes[i];
      const posX = LANE_INDICES[laneIdx];

      let obstacle;
      if (this.currentZone === GAME_CONFIG.ZONES.CORRIDOR) {
        const r = Math.random();
        if (r < 0.4) {
          obstacle = this.obstacleFactory.createSchoolDesk();
        } else if (r < 0.7) {
          obstacle = this.obstacleFactory.createSchoolChair();
        } else if (r < 0.85) {
          obstacle = this.obstacleFactory.createTrashCan();
        } else {
          obstacle = this.obstacleFactory.createDroppedBackpack();
        }
      } else if (this.currentZone === GAME_CONFIG.ZONES.CANTEEN) {
        const r = Math.random();
        if (r < 0.5) {
          obstacle = this.obstacleFactory.createCardboardBoxes();
        } else if (r < 0.8) {
          obstacle = this.obstacleFactory.createTrashCan();
        } else {
          obstacle = this.obstacleFactory.createSchoolChair();
        }
      } else {
        // Parking Zone
        const r = Math.random();
        if (r < 0.45) {
          // Slide barrier!
          obstacle = this.obstacleFactory.createParkingBarrier();
        } else if (r < 0.8) {
          obstacle = this.obstacleFactory.createCardboardBoxes();
        } else {
          obstacle = this.obstacleFactory.createTrashCan();
        }
      }

      obstacle.position.set(posX, 0, z);
      this.scene.add(obstacle);
      this.activeObstacles.push(obstacle);
    }
  }

  spawnCoinPattern(startZ) {
    const laneIdx = Math.floor(Math.random() * 3);
    const posX = LANE_INDICES[laneIdx];
    const count = 4;
    const spacing = 1.8;

    for (let i = 0; i < count; i++) {
      const coin = this.obstacleFactory.createCoin();
      coin.position.set(posX, 0.8, startZ + i * spacing);
      this.scene.add(coin);
      this.activeCoins.push(coin);
    }
  }

  spawnRandomPowerup(z) {
    const keys = Object.keys(GAME_CONFIG.POWERUPS);
    const selectedKey = keys[Math.floor(Math.random() * keys.length)];
    const def = GAME_CONFIG.POWERUPS[selectedKey];

    const laneIdx = Math.floor(Math.random() * 3);
    const posX = LANE_INDICES[laneIdx];

    const powerup = this.obstacleFactory.createPowerup(def);
    powerup.position.set(posX, 1.1, z);
    this.scene.add(powerup);
    this.activePowerups.push(powerup);
  }

  update(dt, playerZ) {
    // 1. Recycle chunks that are far behind player
    if (this.activeChunks.length > 0) {
      const firstChunk = this.activeChunks[0];
      if (firstChunk.mesh.position.z + GAME_CONFIG.CHUNK_LENGTH < playerZ - 20) {
        this.scene.remove(firstChunk.mesh);
        this.activeChunks.shift();
        this.spawnNextChunk();
      }
    }

    // 2. Animate coins (spin & hover)
    for (let i = this.activeCoins.length - 1; i >= 0; i--) {
      const coin = this.activeCoins[i];
      if (coin.position.z < playerZ - 10) {
        this.scene.remove(coin);
        this.activeCoins.splice(i, 1);
        continue;
      }
      coin.rotation.y += dt * 4.0;
      coin.position.y = 0.8 + Math.sin(Date.now() * 0.005 + coin.position.z) * 0.12;
    }

    // 3. Animate power-ups
    for (let i = this.activePowerups.length - 1; i >= 0; i--) {
      const pow = this.activePowerups[i];
      if (pow.position.z < playerZ - 10) {
        this.scene.remove(pow);
        this.activePowerups.splice(i, 1);
        continue;
      }
      pow.rotation.y += dt * 3.0;
      pow.position.y = 1.1 + Math.sin(Date.now() * 0.006 + pow.position.z) * 0.15;
    }

    // 4. Clean up obstacles passed
    for (let i = this.activeObstacles.length - 1; i >= 0; i--) {
      const obs = this.activeObstacles[i];
      if (obs.position.z < playerZ - 15) {
        this.scene.remove(obs);
        this.activeObstacles.splice(i, 1);
      }
    }
  }

  reset() {
    // Clear all chunks, obstacles, coins, powerups
    this.activeChunks.forEach((c) => this.scene.remove(c.mesh));
    this.activeObstacles.forEach((o) => this.scene.remove(o));
    this.activeCoins.forEach((c) => this.scene.remove(c));
    this.activePowerups.forEach((p) => this.scene.remove(p));

    this.activeChunks = [];
    this.activeObstacles = [];
    this.activeCoins = [];
    this.activePowerups = [];

    this.nextChunkZ = 0;
    this.chunkCount = 0;
    this.currentZone = GAME_CONFIG.ZONES.CORRIDOR;

    this.initPool();
  }
}
