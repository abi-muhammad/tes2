import * as THREE from 'three';
import { GAME_CONFIG, LANES } from './Constants.js';
import { Player } from './Player.js';
import { Teacher } from './Teacher.js';
import { EnvironmentManager } from './EnvironmentManager.js';
import { AudioManager } from './AudioManager.js';
import { InputHandler } from './InputHandler.js';
import { UIManager } from './UIManager.js';

/**
 * Game
 * Central game engine orchestrating Three.js rendering, physics, collisions, and state.
 */
export class Game {
  constructor() {
    this.canvas = document.getElementById('game-canvas');

    // State flags
    this.isPlaying = false;
    this.isPaused = false;
    this.isGameOver = false;

    // Progression
    this.score = 0; // Distance in meters
    this.coins = 0;
    this.speed = GAME_CONFIG.INITIAL_SPEED;
    this.lastTime = 0;
    this.cameraShake = 0;

    // Subsystems
    this.audio = new AudioManager();
    this.ui = new UIManager(this);
    this.input = new InputHandler(this);

    this.initThree();
    this.initEntities();
    this.initLifecycle();

    // Start render loop for showcase background
    requestAnimationFrame((t) => this.renderLoop(t));
  }

  initThree() {
    // 1. Scene & Daylight Atmosphere
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xdcecf9); // Tropical Indonesian clear sky
    this.scene.fog = new THREE.FogExp2(0xdcecf9, 0.008);

    // 2. Camera (Third Person Runner view)
    this.camera = new THREE.PerspectiveCamera(
      65,
      window.innerWidth / window.innerHeight,
      0.1,
      120.0
    );
    this.camera.position.set(0, 3.2, -4.8);

    // 3. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    // 4. Realistic Daytime Sun & Ambient Lighting (10.00 - 13.00 midday sun)
    const ambientLight = new THREE.AmbientLight(0xfffaed, 0.65);
    this.scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x14532d, 0.5);
    this.scene.add(hemiLight);

    this.dirLight = new THREE.DirectionalLight(0xfff7ed, 1.25);
    this.dirLight.position.set(12, 22, 10);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 2048;
    this.dirLight.shadow.mapSize.height = 2048;
    this.dirLight.shadow.camera.near = 0.5;
    this.dirLight.shadow.camera.far = 60;
    this.dirLight.shadow.camera.left = -16;
    this.dirLight.shadow.camera.right = 16;
    this.dirLight.shadow.camera.top = 25;
    this.dirLight.shadow.camera.bottom = -10;
    this.scene.add(this.dirLight);
    this.scene.add(this.dirLight.target);
  }

  initEntities() {
    // 1. Student Player
    this.player = new Player();
    this.scene.add(this.player.mesh);

    // 2. Teacher Pak Wahid
    this.teacher = new Teacher();
    this.scene.add(this.teacher.mesh);

    // 3. Environment Manager
    this.environment = new EnvironmentManager(this.scene);
  }

  initLifecycle() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.isPlaying && !this.isGameOver && !this.isPaused) {
        this.togglePause();
      }
    });
  }

  setQuality(level) {
    if (level === 'low') {
      this.renderer.shadowMap.enabled = false;
      this.renderer.setPixelRatio(1.0);
    } else if (level === 'medium') {
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.BasicShadowMap;
      this.renderer.setPixelRatio(1.0);
    } else {
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
    }
  }

  start() {
    this.reset();
    this.isPlaying = true;
    this.ui.showInGameHUD();
    this.audio.startBGM();

    // Teacher initial shout!
    this.audio.shoutTeacher('Hei! Kamu! Jangan lari!');
    this.ui.showTeacherShout('Hei! Jangan lari kamu!');
  }

  togglePause() {
    if (!this.isPlaying || this.isGameOver) return;
    this.isPaused = !this.isPaused;
    this.ui.showPauseMenu(this.isPaused);

    if (this.isPaused) {
      this.audio.stopBGM();
    } else {
      this.audio.startBGM();
      this.lastTime = performance.now();
    }
  }

  restart() {
    this.start();
  }

  returnToMenu() {
    this.isPlaying = false;
    this.isPaused = false;
    this.isGameOver = false;
    this.reset();
    this.ui.showMainMenu();
    this.audio.stopBGM();
  }

  reset() {
    this.isGameOver = false;
    this.score = 0;
    this.coins = 0;
    this.speed = GAME_CONFIG.INITIAL_SPEED;
    this.player.reset();
    this.teacher.reset();
    this.environment.reset();
    this.cameraShake = 0;
  }

  renderLoop(time) {
    requestAnimationFrame((t) => this.renderLoop(t));

    if (!this.lastTime) this.lastTime = time;
    let dt = (time - this.lastTime) / 1000;
    this.lastTime = time;

    // Cap delta time to prevent physics explosions on tab switch
    dt = Math.min(dt, 0.1);

    if (this.isPlaying && !this.isPaused && !this.isGameOver) {
      this.update(dt);
    }

    // Always update camera & render scene
    this.updateCamera(dt);
    this.renderer.render(this.scene, this.camera);
  }

  update(dt) {
    // 1. Forward movement & speed progression
    let currentSpeed = this.speed;
    if (this.player.hasPowerup('speed_boots')) {
      currentSpeed *= 1.45;
    }

    const forwardDistance = currentSpeed * dt;
    this.player.mesh.position.z += forwardDistance;

    // Score accumulation (meters)
    let scoreMultiplier = 1.0;
    if (this.player.hasPowerup('score_bell')) {
      scoreMultiplier = 2.0;
    }
    this.score += forwardDistance * scoreMultiplier;

    // Progressive speed increase
    this.speed = Math.min(
      GAME_CONFIG.MAX_SPEED,
      GAME_CONFIG.INITIAL_SPEED + (this.score / 100) * GAME_CONFIG.ACCELERATION
    );

    // 2. Update player & teacher
    this.player.update(dt, currentSpeed);

    const isCleanRunning = !this.player.hasPowerup('speed_boots');
    this.teacher.update(
      dt,
      this.player.mesh.position.x,
      this.player.mesh.position.z,
      currentSpeed,
      isCleanRunning
    );

    // 3. Update environment chunks, obstacles, and items
    this.environment.update(dt, this.player.mesh.position.z);

    // 4. Collision Detection
    this.checkCollisions();

    // 5. Coin Attraction (Coin Magnet Powerup)
    if (this.player.hasPowerup('coin_magnet')) {
      this.magnetizeCoins(dt);
    }

    // 6. Check if Teacher Caught the Student!
    if (this.teacher.isCaught()) {
      this.triggerGameOver();
      return;
    }

    // 7. Update HUD
    this.ui.updateHUD(this.score, this.coins, this.teacher.distance);
  }

  checkCollisions() {
    const playerZ = this.player.mesh.position.z;

    // 1. Obstacle collisions
    for (let i = 0; i < this.environment.activeObstacles.length; i++) {
      const obs = this.environment.activeObstacles[i];
      const obsZ = obs.position.z;

      // Only check obstacles in close Z proximity
      if (Math.abs(obsZ - playerZ) > 1.8) continue;

      // Update obstacle AABB
      obs.userData.box.setFromCenterAndSize(
        new THREE.Vector3(obs.position.x, obs.userData.size.y / 2, obs.position.z),
        obs.userData.size
      );

      if (this.player.box.intersectsBox(obs.userData.box)) {
        // Can obstacle be cleared with jump?
        if (obs.userData.canJump && this.player.y > 0.65) {
          continue; // Cleared by jumping over!
        }

        // Can obstacle be cleared with slide?
        if (obs.userData.canSlide && this.player.isSliding) {
          continue; // Cleared by sliding underneath!
        }

        // Collision Occurred!
        this.handleObstacleHit(obs);
        break;
      }
    }

    // 2. Coin collection
    for (let i = this.environment.activeCoins.length - 1; i >= 0; i--) {
      const coin = this.environment.activeCoins[i];
      const dist = this.player.mesh.position.distanceTo(coin.position);

      if (dist < 1.3 && !coin.userData.collected) {
        coin.userData.collected = true;
        this.scene.remove(coin);
        this.environment.activeCoins.splice(i, 1);
        this.coins++;
        this.audio.playCoinSound();
      }
    }

    // 3. Powerup collection
    for (let i = this.environment.activePowerups.length - 1; i >= 0; i--) {
      const pow = this.environment.activePowerups[i];
      const dist = this.player.mesh.position.distanceTo(pow.position);

      if (dist < 1.4 && !pow.userData.collected) {
        pow.userData.collected = true;
        this.scene.remove(pow);
        this.environment.activePowerups.splice(i, 1);

        const def = pow.userData.powerupDef;
        this.applyPowerup(def);
      }
    }
  }

  handleObstacleHit(obs) {
    // If invulnerable via Speed Boots
    if (this.player.hasPowerup('speed_boots')) {
      // Smash through obstacle
      this.audio.playHitSound();
      this.cameraShake = 0.25;
      this.scene.remove(obs);
      return;
    }

    // If protected by Shield (Buku Perlindungan)
    if (this.player.hasPowerup('shield')) {
      this.player.activePowerups.delete('shield');
      this.audio.playHitSound();
      this.cameraShake = 0.35;
      this.ui.showTeacherShout('Awas bukumu jatuh!');
      this.scene.remove(obs);
      return;
    }

    // Stumble penalty!
    this.audio.playHitSound();
    this.cameraShake = 0.5;
    this.teacher.penalize();

    // Teacher comedic shout
    const shouts = [
      'Kena kamu!',
      'Mau lari ke mana lagi?!',
      'Jangan sok ngebut!',
      'Berhenti di situ!'
    ];
    const shout = shouts[Math.floor(Math.random() * shouts.length)];
    this.audio.shoutTeacher(shout);
    this.ui.showTeacherShout(shout);

    // Remove collided obstacle so player doesn't get stuck in loop
    this.scene.remove(obs);
  }

  applyPowerup(def) {
    this.audio.playPowerupSound();

    if (def.id === 'escape_run') {
      // Instantly pushes Pak Wahid back
      this.teacher.pushBack(7.0);
      this.audio.shoutTeacher('Hei! Larinya kencang sekali!');
      this.ui.showTeacherShout('Larimu kencang sekali!');
    } else {
      this.player.addPowerup(def);
    }
  }

  magnetizeCoins(dt) {
    const playerPos = this.player.mesh.position;
    for (const coin of this.environment.activeCoins) {
      const dist = playerPos.distanceTo(coin.position);
      if (dist < 7.5) {
        coin.position.lerp(playerPos, dt * 7.0);
      }
    }
  }

  triggerGameOver() {
    this.isGameOver = true;
    this.audio.stopBGM();
    this.audio.playGameOverSound();
    this.audio.shoutTeacher('Ketangkap kamu! Ikut saya ke ruang guru!');
    this.ui.showGameOver(this.score, this.coins);
  }

  updateCamera(dt) {
    const targetX = this.player.mesh.position.x * 0.65;
    const targetY = this.player.mesh.position.y * 0.4 + 2.8;
    const targetZ = this.player.mesh.position.z - 4.6;

    // Smooth camera follow
    this.camera.position.x += (targetX - this.camera.position.x) * Math.min(1.0, 10.0 * dt);
    this.camera.position.y += (targetY - this.camera.position.y) * Math.min(1.0, 8.0 * dt);
    this.camera.position.z = targetZ;

    // Directional sunlight follow
    this.dirLight.position.set(
      this.player.mesh.position.x + 12,
      22,
      this.player.mesh.position.z + 10
    );
    this.dirLight.target.position.set(
      this.player.mesh.position.x,
      0,
      this.player.mesh.position.z + 15
    );

    // Camera look target
    const lookTarget = new THREE.Vector3(
      this.player.mesh.position.x * 0.25,
      this.player.mesh.position.y * 0.3 + 1.3,
      this.player.mesh.position.z + 6.0
    );

    // Camera Shake
    if (this.cameraShake > 0) {
      this.camera.position.x += (Math.random() - 0.5) * this.cameraShake;
      this.camera.position.y += (Math.random() - 0.5) * this.cameraShake;
      this.cameraShake = Math.max(0, this.cameraShake - dt * 2.0);
    }

    this.camera.lookAt(lookTarget);

    // Dynamic FOV for Speed Boost
    const targetFOV = this.player.hasPowerup('speed_boots') ? 78 : 65;
    this.camera.fov += (targetFOV - this.camera.fov) * Math.min(1.0, 6.0 * dt);
    this.camera.updateProjectionMatrix();
  }
}
