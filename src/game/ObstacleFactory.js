import * as THREE from 'three';
import { GAME_CONFIG, LANE_INDICES } from './Constants.js';
import { TextureGenerator } from './TextureGenerator.js';

/**
 * ObstacleFactory
 * Creates 3D interactive obstacle models, collectible coins, and power-up crates.
 */
export class ObstacleFactory {
  constructor() {
    this.woodMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.7 });
    this.chairMat = new THREE.MeshStandardMaterial({ color: 0xa16207, roughness: 0.7 });
    this.metalMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4, metalness: 0.6 });
    this.trashMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.5 }); // Blue school bin
    this.trashLidMat = new THREE.MeshStandardMaterial({ color: 0x0369a1, roughness: 0.4 });
    this.cardboardMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.9 });
    this.backpackMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.8 });
    this.stripeMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });

    // Coin & Powerup Materials
    this.coinMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      metalness: 0.85,
      roughness: 0.2
    });

    this.coinEmbossMat = new THREE.MeshBasicMaterial({ color: 0xfffbeb });
  }

  /**
   * School Desk (Meja Siswa) - Can be jumped over or avoided.
   */
  createSchoolDesk() {
    const group = new THREE.Group();
    group.userData.type = 'desk';
    group.userData.canJump = true;
    group.userData.canSlide = false;
    group.userData.box = new THREE.Box3();
    group.userData.size = new THREE.Vector3(1.4, 0.9, 0.9);

    // Desktop
    const topGeo = new THREE.BoxGeometry(1.4, 0.08, 0.9);
    const top = new THREE.Mesh(topGeo, this.woodMat);
    top.position.y = 0.85;
    top.castShadow = true;
    group.add(top);

    // Shelf under desk (kolong meja)
    const shelfGeo = new THREE.BoxGeometry(1.3, 0.04, 0.8);
    const shelf = new THREE.Mesh(shelfGeo, this.woodMat);
    shelf.position.y = 0.65;
    group.add(shelf);

    // Desk legs
    const legGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.85, 8);
    const legOffsets = [
      [-0.6, 0.425, -0.38],
      [0.6, 0.425, -0.38],
      [-0.6, 0.425, 0.38],
      [0.6, 0.425, 0.38]
    ];
    legOffsets.forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(legGeo, this.metalMat);
      leg.position.set(lx, ly, lz);
      leg.castShadow = true;
      group.add(leg);
    });

    return group;
  }

  /**
   * School Chair (Kursi Siswa) - Low obstacle, easily jumped over.
   */
  createSchoolChair() {
    const group = new THREE.Group();
    group.userData.type = 'chair';
    group.userData.canJump = true;
    group.userData.canSlide = false;
    group.userData.box = new THREE.Box3();
    group.userData.size = new THREE.Vector3(0.9, 0.75, 0.8);

    // Seat
    const seatGeo = new THREE.BoxGeometry(0.7, 0.06, 0.65);
    const seat = new THREE.Mesh(seatGeo, this.chairMat);
    seat.position.y = 0.5;
    seat.castShadow = true;
    group.add(seat);

    // Backrest
    const backGeo = new THREE.BoxGeometry(0.7, 0.3, 0.05);
    const back = new THREE.Mesh(backGeo, this.chairMat);
    back.position.set(0, 0.85, -0.3);
    back.castShadow = true;
    group.add(back);

    // Legs
    const legGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.5, 8);
    [[-0.3, 0.25, -0.28], [0.3, 0.25, -0.28], [-0.3, 0.25, 0.28], [0.3, 0.25, 0.28]].forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(legGeo, this.metalMat);
      leg.position.set(lx, ly, lz);
      group.add(leg);
    });

    return group;
  }

  /**
   * School Trash Can (Tempat Sampah Sekolah)
   */
  createTrashCan() {
    const group = new THREE.Group();
    group.userData.type = 'trash';
    group.userData.canJump = true;
    group.userData.canSlide = false;
    group.userData.box = new THREE.Box3();
    group.userData.size = new THREE.Vector3(0.8, 1.0, 0.8);

    // Bin body
    const binGeo = new THREE.CylinderGeometry(0.38, 0.3, 0.9, 12);
    const bin = new THREE.Mesh(binGeo, this.trashMat);
    bin.position.y = 0.45;
    bin.castShadow = true;
    group.add(bin);

    // Lid with swing flap
    const lidGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.12, 12);
    const lid = new THREE.Mesh(lidGeo, this.trashLidMat);
    lid.position.y = 0.95;
    group.add(lid);

    return group;
  }

  /**
   * Dropped Backpack (Tas Sekolah di Lantai)
   */
  createDroppedBackpack() {
    const group = new THREE.Group();
    group.userData.type = 'backpack';
    group.userData.canJump = true;
    group.userData.canSlide = false;
    group.userData.box = new THREE.Box3();
    group.userData.size = new THREE.Vector3(0.8, 0.5, 0.8);

    const packGeo = new THREE.BoxGeometry(0.7, 0.35, 0.6);
    const pack = new THREE.Mesh(packGeo, this.backpackMat);
    pack.position.y = 0.18;
    pack.rotation.y = 0.4;
    pack.castShadow = true;
    group.add(pack);

    return group;
  }

  /**
   * Canteen Stacked Cardboard Snack Boxes (Kardus Kantin)
   */
  createCardboardBoxes() {
    const group = new THREE.Group();
    group.userData.type = 'boxes';
    group.userData.canJump = true;
    group.userData.canSlide = false;
    group.userData.box = new THREE.Box3();
    group.userData.size = new THREE.Vector3(1.1, 1.1, 1.1);

    const b1 = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.6, 0.9), this.cardboardMat);
    b1.position.y = 0.3;
    b1.castShadow = true;
    group.add(b1);

    const b2 = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.5, 0.75), this.cardboardMat);
    b2.position.set(0.05, 0.85, 0.02);
    b2.rotation.y = 0.2;
    b2.castShadow = true;
    group.add(b2);

    return group;
  }

  /**
   * Parking Barrier Gate (Palang Parkir) - HIGH OBSTACLE: Must slide under!
   */
  createParkingBarrier() {
    const group = new THREE.Group();
    group.userData.type = 'barrier';
    group.userData.canJump = false;
    group.userData.canSlide = true; // MUST SLIDE UNDER!
    group.userData.box = new THREE.Box3();
    group.userData.size = new THREE.Vector3(2.0, 1.8, 0.6);

    // Left and right support posts
    const postGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.0, 8);
    const postL = new THREE.Mesh(postGeo, this.metalMat);
    postL.position.set(-1.0, 1.0, 0);
    postL.castShadow = true;
    group.add(postL);

    const postR = new THREE.Mesh(postGeo, this.metalMat);
    postR.position.set(1.0, 1.0, 0);
    postR.castShadow = true;
    group.add(postR);

    // High horizontal barrier pole (Height = 1.4m off ground, player slides underneath)
    const poleGeo = new THREE.CylinderGeometry(0.09, 0.09, 2.2, 10);
    const pole = new THREE.Mesh(poleGeo, this.stripeMat);
    pole.rotation.z = Math.PI / 2;
    pole.position.set(0, 1.4, 0);
    pole.castShadow = true;
    group.add(pole);

    // Black stripes on barrier
    for (let x = -0.8; x <= 0.8; x += 0.4) {
      const stripeGeo = new THREE.CylinderGeometry(0.095, 0.095, 0.15, 10);
      const stripe = new THREE.Mesh(stripeGeo, this.metalMat);
      stripe.rotation.z = Math.PI / 2;
      stripe.position.set(x, 1.4, 0);
      group.add(stripe);
    }

    return group;
  }

  /**
   * 3D Spinning Gold Coin
   */
  createCoin() {
    const group = new THREE.Group();
    group.userData.type = 'coin';
    group.userData.collected = false;

    // Outer coin disc
    const coinGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.08, 16);
    const coin = new THREE.Mesh(coinGeo, this.coinMat);
    coin.rotation.x = Math.PI / 2;
    coin.castShadow = true;
    group.add(coin);

    // Star / flower relief in center
    const starGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.09, 5);
    const star = new THREE.Mesh(starGeo, this.coinEmbossMat);
    star.rotation.x = Math.PI / 2;
    group.add(star);

    group.position.y = 0.8;
    return group;
  }

  /**
   * 3D Glowing Powerup Pickup Item
   */
  createPowerup(powerupDef) {
    const group = new THREE.Group();
    group.userData.type = 'powerup';
    group.userData.powerupDef = powerupDef;
    group.userData.collected = false;

    // Glowing aura wireframe sphere
    const auraGeo = new THREE.SphereGeometry(0.65, 12, 12);
    const auraMat = new THREE.MeshBasicMaterial({
      color: powerupDef.color,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });
    const aura = new THREE.Mesh(auraGeo, auraMat);
    group.add(aura);

    // Powerup Core Geometry based on type
    let core;
    const coreMat = new THREE.MeshStandardMaterial({
      color: powerupDef.color,
      metalness: 0.6,
      roughness: 0.3,
      emissive: powerupDef.color,
      emissiveIntensity: 0.4
    });

    if (powerupDef.id === 'speed_boots') {
      // Sneaker shape
      core = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.5), coreMat);
    } else if (powerupDef.id === 'shield') {
      // School Protection Book shape
      core = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.5, 0.15), coreMat);
    } else if (powerupDef.id === 'score_bell') {
      // School Bell shape
      core = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.45, 12), coreMat);
    } else {
      // Gem / Crate diamond
      core = new THREE.Mesh(new THREE.OctahedronGeometry(0.35), coreMat);
    }

    core.castShadow = true;
    group.add(core);

    group.position.y = 1.1;
    return group;
  }
}
