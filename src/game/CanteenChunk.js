import * as THREE from 'three';
import { GAME_CONFIG } from './Constants.js';
import { TextureGenerator } from './TextureGenerator.js';

/**
 * CanteenChunk: Area Kantin SMA Negeri 1 Pasir Sakti.
 * Indonesian school canteen with food stalls, banners, long wooden tables & benches.
 */
export class CanteenChunk {
  constructor() {
    this.mesh = new THREE.Group();
    this.length = GAME_CONFIG.CHUNK_LENGTH;
    this.obstacles = [];
    this.coins = [];
    this.powerups = [];

    this.buildChunk();
  }

  buildChunk() {
    const bannerTexture = TextureGenerator.createCanteenBannerTexture();
    const signTexture = TextureGenerator.createSignTexture('KANTIN SEKOLAH', 'SMA N 1 PASIR SAKTI', '#b91c1c', '#fef08a');
    const tinRoofTexture = TextureGenerator.createTinRoofTexture();

    // Materials
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xd1d5db, // Concrete canteen floor
      roughness: 0.6
    });

    const pillarMat = new THREE.MeshStandardMaterial({
      color: 0x15803d, // Green canteen pavilion pillars
      roughness: 0.5
    });

    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x854d0e, // Warm canteen wood
      roughness: 0.7
    });

    const roofMat = new THREE.MeshStandardMaterial({
      map: tinRoofTexture,
      roughness: 0.5,
      metalness: 0.3
    });

    const stallMat = new THREE.MeshStandardMaterial({
      color: 0xf3f4f6,
      roughness: 0.7
    });

    const glassMat = new THREE.MeshStandardMaterial({
      color: 0xe0f2fe,
      roughness: 0.1,
      transparent: true,
      opacity: 0.6
    });

    const canteenWidth = 10.0;
    const canteenHeight = 4.8;

    // 1. Concrete Floor
    const floorGeo = new THREE.PlaneGeometry(canteenWidth, this.length);
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, this.length / 2);
    floor.receiveShadow = true;
    this.mesh.add(floor);

    // 2. Sloped Corrugated Tin Canopy Roof
    const roofGeo = new THREE.PlaneGeometry(canteenWidth + 2.0, this.length);
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.rotation.x = Math.PI / 2;
    roof.position.set(0, canteenHeight, this.length / 2);
    this.mesh.add(roof);

    // Entrance Hanging Sign "KANTIN SEKOLAH"
    const signGeo = new THREE.PlaneGeometry(2.8, 1.2);
    const signMat = new THREE.MeshStandardMaterial({ map: signTexture, roughness: 0.3 });
    const sign = new THREE.Mesh(signGeo, signMat);
    sign.position.set(0, canteenHeight - 0.8, 2);
    this.mesh.add(sign);

    // 3. Support Pillars on both sides
    const pillarGeo = new THREE.CylinderGeometry(0.2, 0.2, canteenHeight, 10);
    for (let z = 3; z < this.length; z += 9) {
      const pLeft = new THREE.Mesh(pillarGeo, pillarMat);
      pLeft.position.set(-canteenWidth / 2 + 0.3, canteenHeight / 2, z);
      pLeft.castShadow = true;
      this.mesh.add(pLeft);

      const pRight = new THREE.Mesh(pillarGeo, pillarMat);
      pRight.position.set(canteenWidth / 2 - 0.3, canteenHeight / 2, z);
      pRight.castShadow = true;
      this.mesh.add(pRight);
    }

    // 4. Food Stalls (Warung Kantin) on the Left Side
    const stallZPositions = [8, 24, 38];
    stallZPositions.forEach((z) => {
      const stall = new THREE.Group();
      stall.position.set(-canteenWidth / 2 + 1.2, 0, z);

      // Main stall counter
      const counterGeo = new THREE.BoxGeometry(1.6, 1.1, 4.5);
      const counter = new THREE.Mesh(counterGeo, stallMat);
      counter.position.y = 0.55;
      counter.castShadow = true;
      counter.receiveShadow = true;
      stall.add(counter);

      // Glass food showcase (Etalase Gorengan & Kue)
      const displayGeo = new THREE.BoxGeometry(0.9, 0.7, 2.0);
      const display = new THREE.Mesh(displayGeo, glassMat);
      display.position.set(0.1, 1.45, 0);
      stall.add(display);

      // Colorful Warung Banner
      const bannerGeo = new THREE.PlaneGeometry(4.2, 0.9);
      const bannerMat = new THREE.MeshStandardMaterial({ map: bannerTexture, roughness: 0.4 });
      const banner = new THREE.Mesh(bannerGeo, bannerMat);
      banner.rotation.y = Math.PI / 2;
      banner.position.set(0.85, 2.4, 0);
      stall.add(banner);

      this.mesh.add(stall);
    });

    // 5. Canteen Dining Tables & Benches on the Right Side
    const tableZPositions = [6, 16, 26, 36];
    tableZPositions.forEach((z) => {
      const tableGroup = new THREE.Group();
      tableGroup.position.set(canteenWidth / 2 - 1.8, 0, z);

      // Long wooden table top
      const tableTopGeo = new THREE.BoxGeometry(1.4, 0.08, 3.2);
      const tableTop = new THREE.Mesh(tableTopGeo, woodMat);
      tableTop.position.y = 0.85;
      tableTop.castShadow = true;
      tableGroup.add(tableTop);

      // Table legs
      const legGeo = new THREE.BoxGeometry(0.08, 0.85, 0.08);
      const legOffsets = [
        [-0.6, 0.425, -1.4],
        [0.6, 0.425, -1.4],
        [-0.6, 0.425, 1.4],
        [0.6, 0.425, 1.4]
      ];
      legOffsets.forEach(([lx, ly, lz]) => {
        const leg = new THREE.Mesh(legGeo, woodMat);
        leg.position.set(lx, ly, lz);
        leg.castShadow = true;
        tableGroup.add(leg);
      });

      // Benches on both sides of table
      const benchGeo = new THREE.BoxGeometry(0.35, 0.06, 3.2);
      const benchLeft = new THREE.Mesh(benchGeo, woodMat);
      benchLeft.position.set(-0.9, 0.45, 0);
      benchLeft.castShadow = true;
      tableGroup.add(benchLeft);

      const benchRight = new THREE.Mesh(benchGeo, woodMat);
      benchRight.position.set(0.9, 0.45, 0);
      benchRight.castShadow = true;
      tableGroup.add(benchRight);

      this.mesh.add(tableGroup);
    });
  }

  setPosition(z) {
    this.mesh.position.z = z;
  }
}
