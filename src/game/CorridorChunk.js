import * as THREE from 'three';
import { GAME_CONFIG } from './Constants.js';
import { TextureGenerator } from './TextureGenerator.js';

/**
 * CorridorChunk
 * Exact 3D recreation of Reference Photo 2:
 * School corridor of SMA Negeri 1 Pasir Sakti with dark green pillars,
 * cream lower ceramic tile wall, dark green upper wall, and shiny white ceramic floor.
 */
export class CorridorChunk {
  constructor() {
    this.mesh = new THREE.Group();
    this.length = GAME_CONFIG.CHUNK_LENGTH;
    this.obstacles = [];
    this.coins = [];
    this.powerups = [];

    this.buildChunk();
  }

  buildChunk() {
    // Shared materials
    const floorTexture = TextureGenerator.createFloorTileTexture();
    const wallTexture = TextureGenerator.createSchoolWallTexture();
    const doorTexture = TextureGenerator.createDoorTexture();
    const windowTexture = TextureGenerator.createWindowTexture();
    const signXIA1 = TextureGenerator.createSignTexture('XI A1', 'KELAS SEBELAS');
    const signXIA2 = TextureGenerator.createSignTexture('XI A2', 'KELAS SEBELAS');

    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTexture,
      roughness: 0.15, // Shiny reflective gloss matching photo 2!
      metalness: 0.05
    });

    const wallMat = new THREE.MeshStandardMaterial({
      map: wallTexture,
      roughness: 0.6
    });

    const pillarMat = new THREE.MeshStandardMaterial({
      color: 0x144326, // Reference photo 2 dark green pillar
      roughness: 0.45
    });

    const ceilingMat = new THREE.MeshStandardMaterial({
      color: 0xecf0f1,
      roughness: 0.8
    });

    const doorMat = new THREE.MeshStandardMaterial({
      map: doorTexture,
      roughness: 0.5
    });

    const windowMat = new THREE.MeshStandardMaterial({
      map: windowTexture,
      roughness: 0.2,
      metalness: 0.1
    });

    const grassMat = new THREE.MeshStandardMaterial({
      color: 0x2d6a4f,
      roughness: 0.9
    });

    const corridorWidth = 8.0;
    const corridorHeight = 4.2;

    // 1. Polished White Ceramic Floor
    const floorGeo = new THREE.PlaneGeometry(corridorWidth, this.length);
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, this.length / 2);
    floor.receiveShadow = true;
    this.mesh.add(floor);

    // 2. Ceiling / Plafond
    const ceilingGeo = new THREE.PlaneGeometry(corridorWidth, this.length);
    const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, corridorHeight, this.length / 2);
    this.mesh.add(ceiling);

    // Ceiling fluorescent lights
    const lightGeo = new THREE.BoxGeometry(0.4, 0.1, 2.5);
    const lightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    for (let z = 6; z < this.length; z += 12) {
      const lamp = new THREE.Mesh(lightGeo, lightMat);
      lamp.position.set(0, corridorHeight - 0.06, z);
      this.mesh.add(lamp);
    }

    // 3. Left Wall (Classrooms side: Green top, Cream tile bottom)
    const wallGeo = new THREE.PlaneGeometry(this.length, corridorHeight);
    const leftWall = new THREE.Mesh(wallGeo, wallMat);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-corridorWidth / 2, corridorHeight / 2, this.length / 2);
    leftWall.receiveShadow = true;
    this.mesh.add(leftWall);

    // Classroom Doors along the left wall
    const doorGeo = new THREE.PlaneGeometry(1.8, 3.2);
    const door1 = new THREE.Mesh(doorGeo, doorMat);
    door1.rotation.y = Math.PI / 2;
    door1.position.set(-corridorWidth / 2 + 0.02, 1.6, 10);
    this.mesh.add(door1);

    const door2 = new THREE.Mesh(doorGeo, doorMat);
    door2.rotation.y = Math.PI / 2;
    door2.position.set(-corridorWidth / 2 + 0.02, 1.6, 32);
    this.mesh.add(door2);

    // Class nameplates above doors ("XI A1" and "XI A2")
    const signGeo = new THREE.PlaneGeometry(1.0, 0.5);
    const signMat1 = new THREE.MeshStandardMaterial({ map: signXIA1, roughness: 0.3 });
    const signMat2 = new THREE.MeshStandardMaterial({ map: signXIA2, roughness: 0.3 });

    const signMesh1 = new THREE.Mesh(signGeo, signMat1);
    signMesh1.rotation.y = Math.PI / 2;
    signMesh1.position.set(-corridorWidth / 2 + 0.05, 3.4, 10);
    this.mesh.add(signMesh1);

    const signMesh2 = new THREE.Mesh(signGeo, signMat2);
    signMesh2.rotation.y = Math.PI / 2;
    signMesh2.position.set(-corridorWidth / 2 + 0.05, 3.4, 32);
    this.mesh.add(signMesh2);

    // Classroom Windows along left wall
    const winGeo = new THREE.PlaneGeometry(2.4, 1.6);
    const winPositions = [18, 24, 40];
    winPositions.forEach((z) => {
      const win = new THREE.Mesh(winGeo, windowMat);
      win.rotation.y = Math.PI / 2;
      win.position.set(-corridorWidth / 2 + 0.02, 2.2, z);
      this.mesh.add(win);
    });

    // 4. Pillars / Columns (Signature Dark Green on both sides, matching Photo 2)
    const pillarGeo = new THREE.BoxGeometry(0.45, corridorHeight, 0.45);
    for (let z = 2; z < this.length; z += 9) {
      // Left pillar against wall
      const pLeft = new THREE.Mesh(pillarGeo, pillarMat);
      pLeft.position.set(-corridorWidth / 2 + 0.22, corridorHeight / 2, z);
      pLeft.castShadow = true;
      pLeft.receiveShadow = true;
      this.mesh.add(pLeft);

      // Right pillar (open garden side)
      const pRight = new THREE.Mesh(pillarGeo, pillarMat);
      pRight.position.set(corridorWidth / 2 - 0.22, corridorHeight / 2, z);
      pRight.castShadow = true;
      pRight.receiveShadow = true;
      this.mesh.add(pRight);
    }

    // 5. Right Open Side: Low balustrade / railing & open view to school garden
    const railMat = new THREE.MeshStandardMaterial({ color: 0x144326, roughness: 0.5 });
    const railGeo = new THREE.BoxGeometry(0.15, 0.9, this.length);
    const rail = new THREE.Mesh(railGeo, railMat);
    rail.position.set(corridorWidth / 2 - 0.1, 0.45, this.length / 2);
    rail.castShadow = true;
    this.mesh.add(rail);

    // Outside grass & garden
    const gardenGeo = new THREE.PlaneGeometry(16, this.length);
    const garden = new THREE.Mesh(gardenGeo, grassMat);
    garden.rotation.x = -Math.PI / 2;
    garden.position.set(corridorWidth / 2 + 8, -0.1, this.length / 2);
    this.mesh.add(garden);

    // School trees and bushes outside
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a2e18, roughness: 0.9 });
    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x228b22, roughness: 0.8 });

    for (let z = 5; z < this.length; z += 12) {
      const tree = new THREE.Group();
      tree.position.set(corridorWidth / 2 + 3.5, 0, z);

      const trunkGeo = new THREE.CylinderGeometry(0.2, 0.25, 3.5, 8);
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 1.75;
      trunk.castShadow = true;
      tree.add(trunk);

      const crownGeo = new THREE.SphereGeometry(1.4, 8, 8);
      const crown = new THREE.Mesh(crownGeo, foliageMat);
      crown.position.y = 3.6;
      crown.castShadow = true;
      tree.add(crown);

      this.mesh.add(tree);
    }
  }

  setPosition(z) {
    this.mesh.position.z = z;
  }
}
