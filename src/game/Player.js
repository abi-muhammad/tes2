import * as THREE from 'three';
import { LANES, GAME_CONFIG } from './Constants.js';
import { TextureGenerator } from './TextureGenerator.js';

/**
 * Player: The Indonesian high school student in maroon batik shirt and backpack.
 */
export class Player {
  constructor() {
    this.mesh = new THREE.Group();
    this.currentLane = 1; // 0 = Left, 1 = Center, 2 = Right
    this.targetX = LANES.CENTER;
    this.currentX = LANES.CENTER;
    
    // Jump & Slide Physics State
    this.y = 0;
    this.vy = 0;
    this.isJumping = false;
    this.isGrounded = true;
    this.isSliding = false;
    this.slideTimer = 0;

    // Active power-up buffs
    this.activePowerups = new Map();
    this.shieldMesh = null;
    this.speedTrail = [];

    // Animation time
    this.animTime = 0;

    // Hitbox bounding box
    this.box = new THREE.Box3();
    this.hitboxSize = new THREE.Vector3(0.9, 1.7, 0.8);
    this.slideHitboxSize = new THREE.Vector3(0.9, 0.8, 1.4);

    this.buildCharacterModel();
  }

  buildCharacterModel() {
    // Shared materials
    const batikTexture = TextureGenerator.createBatikTexture();
    const faceTexture = TextureGenerator.createStudentFaceTexture();

    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xdca67a,
      roughness: 0.6,
      metalness: 0.05
    });

    const batikMat = new THREE.MeshStandardMaterial({
      map: batikTexture,
      roughness: 0.75,
      metalness: 0.05
    });

    const pantsMat = new THREE.MeshStandardMaterial({
      color: 0x334155, // Dark grey school trousers
      roughness: 0.8,
      metalness: 0.05
    });

    const shoeMat = new THREE.MeshStandardMaterial({
      color: 0x111827, // Black school sneakers
      roughness: 0.5,
      metalness: 0.1
    });

    const soleMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0, // White sneaker sole
      roughness: 0.4
    });

    const backpackMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b, // Dark navy/black backpack
      roughness: 0.7
    });

    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.9
    });

    const faceMat = new THREE.MeshStandardMaterial({
      map: faceTexture,
      roughness: 0.6
    });

    // Root model anchor
    this.modelRoot = new THREE.Group();
    this.mesh.add(this.modelRoot);

    // 1. Pelvis / Hips
    this.hips = new THREE.Group();
    this.hips.position.y = 0.95;
    this.modelRoot.add(this.hips);

    const pelvisGeo = new THREE.CylinderGeometry(0.24, 0.22, 0.2, 12);
    const pelvis = new THREE.Mesh(pelvisGeo, pantsMat);
    pelvis.castShadow = true;
    this.hips.add(pelvis);

    // 2. Spine & Torso (Batik Shirt)
    this.torsoGroup = new THREE.Group();
    this.hips.add(this.torsoGroup);

    const torsoGeo = new THREE.CylinderGeometry(0.28, 0.24, 0.55, 12);
    const torso = new THREE.Mesh(torsoGeo, batikMat);
    torso.position.y = 0.35;
    torso.castShadow = true;
    this.torsoGroup.add(torso);

    // Batik Shirt Collar
    const collarGeo = new THREE.TorusGeometry(0.14, 0.035, 8, 16);
    const collar = new THREE.Mesh(collarGeo, batikMat);
    collar.position.set(0, 0.62, 0.04);
    collar.rotation.x = Math.PI / 2.3;
    this.torsoGroup.add(collar);

    // School Backpack
    const backpackGeo = new THREE.BoxGeometry(0.36, 0.46, 0.22);
    const backpack = new THREE.Mesh(backpackGeo, backpackMat);
    backpack.position.set(0, 0.36, -0.2);
    backpack.castShadow = true;
    this.torsoGroup.add(backpack);

    // Backpack front pocket
    const pocketGeo = new THREE.BoxGeometry(0.28, 0.24, 0.08);
    const pocket = new THREE.Mesh(pocketGeo, backpackMat);
    pocket.position.set(0, 0.28, -0.32);
    this.torsoGroup.add(pocket);

    // Backpack Straps
    const strapGeo = new THREE.BoxGeometry(0.06, 0.45, 0.02);
    const leftStrap = new THREE.Mesh(strapGeo, backpackMat);
    leftStrap.position.set(-0.16, 0.36, 0.12);
    leftStrap.rotation.x = -0.2;
    this.torsoGroup.add(leftStrap);

    const rightStrap = new THREE.Mesh(strapGeo, backpackMat);
    rightStrap.position.set(0.16, 0.36, 0.12);
    rightStrap.rotation.x = -0.2;
    this.torsoGroup.add(rightStrap);

    // 3. Head & Hair
    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, 0.68, 0);
    this.torsoGroup.add(this.headGroup);

    // Neck
    const neckGeo = new THREE.CylinderGeometry(0.1, 0.11, 0.12, 10);
    const neck = new THREE.Mesh(neckGeo, skinMat);
    neck.position.y = 0.04;
    this.headGroup.add(neck);

    // Head sphere with face map
    const headGeo = new THREE.SphereGeometry(0.22, 16, 16);
    // Orient materials: Face on front (+Z)
    const head = new THREE.Mesh(headGeo, [
      skinMat, skinMat, skinMat, skinMat, faceMat, skinMat
    ]);
    head.position.y = 0.22;
    head.castShadow = true;
    this.headGroup.add(head);

    // Hair
    const hairGeo = new THREE.SphereGeometry(0.24, 14, 14, 0, Math.PI * 2, 0, Math.PI / 1.7);
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.set(0, 0.24, -0.02);
    hair.rotation.x = -0.15;
    this.headGroup.add(hair);

    // Front fringe hair bangs
    const fringeGeo = new THREE.BoxGeometry(0.28, 0.08, 0.1);
    const fringe = new THREE.Mesh(fringeGeo, hairMat);
    fringe.position.set(0, 0.36, 0.17);
    fringe.rotation.x = 0.3;
    this.headGroup.add(fringe);

    // 4. Arms (Left & Right with Batik Sleeves)
    this.leftArm = this.createArm(skinMat, batikMat, -1);
    this.leftArm.position.set(-0.34, 0.55, 0);
    this.torsoGroup.add(this.leftArm);

    this.rightArm = this.createArm(skinMat, batikMat, 1);
    this.rightArm.position.set(0.34, 0.55, 0);
    this.torsoGroup.add(this.rightArm);

    // 5. Legs (Left & Right with School Trousers and Sneakers)
    this.leftLeg = this.createLeg(pantsMat, shoeMat, soleMat, skinMat);
    this.leftLeg.position.set(-0.16, -0.05, 0);
    this.hips.add(this.leftLeg);

    this.rightLeg = this.createLeg(pantsMat, shoeMat, soleMat, skinMat);
    this.rightLeg.position.set(0.16, -0.05, 0);
    this.hips.add(this.rightLeg);

    // 6. Shield Bubble Visual (for Protection Book powerup)
    const shieldGeo = new THREE.SphereGeometry(1.2, 16, 16);
    const shieldMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35,
      wireframe: true
    });
    this.shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
    this.shieldMesh.position.y = 1.0;
    this.shieldMesh.visible = false;
    this.mesh.add(this.shieldMesh);

    // Enable shadows
    this.mesh.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = false;
      }
    });
  }

  createArm(skinMat, batikMat, side) {
    const armRoot = new THREE.Group();

    // Shoulder sleeve (Batik)
    const sleeveGeo = new THREE.CylinderGeometry(0.1, 0.09, 0.18, 10);
    const sleeve = new THREE.Mesh(sleeveGeo, batikMat);
    sleeve.position.y = -0.08;
    armRoot.add(sleeve);

    // Upper arm (skin)
    const upperGeo = new THREE.CylinderGeometry(0.075, 0.07, 0.22, 8);
    const upper = new THREE.Mesh(upperGeo, skinMat);
    upper.position.y = -0.22;
    armRoot.add(upper);

    // Forearm & Hand
    const forearmGroup = new THREE.Group();
    forearmGroup.position.y = -0.32;
    armRoot.add(forearmGroup);

    const lowerGeo = new THREE.CylinderGeometry(0.07, 0.065, 0.24, 8);
    const lower = new THREE.Mesh(lowerGeo, skinMat);
    lower.position.y = -0.12;
    forearmGroup.add(lower);

    // Clenched fist
    const fistGeo = new THREE.SphereGeometry(0.07, 8, 8);
    const fist = new THREE.Mesh(fistGeo, skinMat);
    fist.position.y = -0.26;
    forearmGroup.add(fist);

    armRoot.userData.forearm = forearmGroup;
    return armRoot;
  }

  createLeg(pantsMat, shoeMat, soleMat, skinMat) {
    const legRoot = new THREE.Group();

    // Thigh (Pants)
    const thighGeo = new THREE.CylinderGeometry(0.12, 0.1, 0.44, 10);
    const thigh = new THREE.Mesh(thighGeo, pantsMat);
    thigh.position.y = -0.22;
    thigh.castShadow = true;
    legRoot.add(thigh);

    // Knee joint / Shin group
    const shinGroup = new THREE.Group();
    shinGroup.position.y = -0.44;
    legRoot.add(shinGroup);

    // Calf / Shin (Pants)
    const shinGeo = new THREE.CylinderGeometry(0.1, 0.085, 0.44, 10);
    const shin = new THREE.Mesh(shinGeo, pantsMat);
    shin.position.y = -0.22;
    shin.castShadow = true;
    shinGroup.add(shin);

    // Ankle / Sock
    const sockGeo = new THREE.CylinderGeometry(0.085, 0.08, 0.08, 8);
    const sock = new THREE.Mesh(sockGeo, skinMat);
    sock.position.y = -0.46;
    shinGroup.add(sock);

    // Sneaker Foot
    const footGroup = new THREE.Group();
    footGroup.position.set(0, -0.48, 0.05);
    shinGroup.add(footGroup);

    // Black sneaker body
    const footGeo = new THREE.BoxGeometry(0.16, 0.11, 0.32);
    const foot = new THREE.Mesh(footGeo, shoeMat);
    foot.position.set(0, 0, 0.05);
    foot.castShadow = true;
    footGroup.add(foot);

    // White sole
    const soleGeo = new THREE.BoxGeometry(0.17, 0.035, 0.33);
    const sole = new THREE.Mesh(soleGeo, soleMat);
    sole.position.set(0, -0.05, 0.05);
    footGroup.add(sole);

    legRoot.userData.shin = shinGroup;
    return legRoot;
  }

  changeLane(direction) {
    if (direction === 'left' && this.currentLane > 0) {
      this.currentLane--;
    } else if (direction === 'right' && this.currentLane < 2) {
      this.currentLane++;
    }
    this.targetX = (this.currentLane === 0) ? LANES.LEFT : ((this.currentLane === 1) ? LANES.CENTER : LANES.RIGHT);
  }

  jump() {
    if (this.isGrounded && !this.isSliding) {
      this.vy = GAME_CONFIG.JUMP_FORCE;
      this.isGrounded = false;
      this.isJumping = true;
      return true;
    }
    return false;
  }

  slide() {
    if (this.isGrounded && !this.isSliding) {
      this.isSliding = true;
      this.slideTimer = GAME_CONFIG.SLIDE_DURATION;
      return true;
    } else if (this.isJumping) {
      // Fast fall down
      this.vy = -GAME_CONFIG.JUMP_FORCE * 1.5;
      return true;
    }
    return false;
  }

  update(dt, speed) {
    // 1. Lane Smooth Transition
    const dx = this.targetX - this.currentX;
    this.currentX += dx * Math.min(1.0, GAME_CONFIG.LANE_SWITCH_SPEED * dt);
    this.mesh.position.x = this.currentX;

    // Body roll / tilt when switching lanes
    const rollAngle = -dx * 0.15;
    this.modelRoot.rotation.z = rollAngle;

    // 2. Vertical Jump Physics
    if (!this.isGrounded) {
      this.vy -= GAME_CONFIG.GRAVITY * dt;
      this.y += this.vy * dt;

      if (this.y <= 0) {
        this.y = 0;
        this.vy = 0;
        this.isGrounded = true;
        this.isJumping = false;
      }
    }
    this.mesh.position.y = this.y;

    // 3. Slide Timer
    if (this.isSliding) {
      this.slideTimer -= dt;
      if (this.slideTimer <= 0) {
        this.isSliding = false;
      }
    }

    // 4. Powerup Timer Updates
    for (const [key, pow] of this.activePowerups.entries()) {
      if (pow.duration > 0) {
        pow.duration -= dt;
        if (pow.duration <= 0) {
          this.activePowerups.delete(key);
        }
      }
    }

    // Shield visibility
    this.shieldMesh.visible = this.hasPowerup('shield');
    if (this.shieldMesh.visible) {
      this.shieldMesh.rotation.y += dt * 3;
    }

    // 5. Skeletal Animations
    this.animate(dt, speed);

    // 6. Update Hitbox Bounding Box
    const currentHitbox = this.isSliding ? this.slideHitboxSize : this.hitboxSize;
    const center = new THREE.Vector3(
      this.mesh.position.x,
      this.mesh.position.y + (this.isSliding ? 0.45 : 0.85),
      this.mesh.position.z
    );
    this.box.setFromCenterAndSize(center, currentHitbox);
  }

  animate(dt, speed) {
    if (this.isSliding) {
      // Slide pose: Recline back, one leg straight forward
      this.modelRoot.position.y = -0.55;
      this.modelRoot.rotation.x = -Math.PI / 3.2;
      this.torsoGroup.rotation.x = -0.2;

      this.leftLeg.rotation.x = -Math.PI / 2.5;
      this.leftLeg.userData.shin.rotation.x = 0.2;

      this.rightLeg.rotation.x = -0.2;
      this.rightLeg.userData.shin.rotation.x = 1.6;

      this.leftArm.rotation.x = 0.8;
      this.rightArm.rotation.x = 0.8;
    } else if (this.isJumping) {
      // Jump pose: Tuck knees and raise arms
      this.modelRoot.position.y = 0;
      this.modelRoot.rotation.x = 0.15;
      this.torsoGroup.rotation.x = 0.1;

      this.leftLeg.rotation.x = 0.8;
      this.leftLeg.userData.shin.rotation.x = 1.2;

      this.rightLeg.rotation.x = 0.5;
      this.rightLeg.userData.shin.rotation.x = 1.0;

      this.leftArm.rotation.x = -1.2;
      this.rightArm.rotation.x = -1.2;
      this.headGroup.rotation.x = -0.2;
    } else {
      // Natural Running Sprint Cycle
      this.modelRoot.position.y = 0;
      this.modelRoot.rotation.x = 0.12; // Slight forward lean

      const runFreq = speed * 0.75;
      this.animTime += dt * runFreq;

      const legCycle = Math.sin(this.animTime);
      const armCycle = -legCycle;

      // Hips vertical bounce
      this.hips.position.y = 0.95 + Math.abs(Math.sin(this.animTime * 2)) * 0.08;

      // Legs swing
      this.leftLeg.rotation.x = legCycle * 0.85;
      this.leftLeg.userData.shin.rotation.x = Math.max(0, -legCycle * 1.3);

      this.rightLeg.rotation.x = -legCycle * 0.85;
      this.rightLeg.userData.shin.rotation.x = Math.max(0, legCycle * 1.3);

      // Arms swing
      this.leftArm.rotation.x = armCycle * 0.95;
      this.leftArm.userData.forearm.rotation.x = 0.6 + Math.abs(armCycle) * 0.5;

      this.rightArm.rotation.x = -armCycle * 0.95;
      this.rightArm.userData.forearm.rotation.x = 0.6 + Math.abs(armCycle) * 0.5;

      // Torso & Head slight counter-swivel
      this.torsoGroup.rotation.y = legCycle * 0.1;
      this.headGroup.rotation.y = -legCycle * 0.08;
    }
  }

  addPowerup(powerup) {
    this.activePowerups.set(powerup.id, { ...powerup });
  }

  hasPowerup(id) {
    return this.activePowerups.has(id);
  }

  reset() {
    this.currentLane = 1;
    this.targetX = LANES.CENTER;
    this.currentX = LANES.CENTER;
    this.mesh.position.set(0, 0, 0);
    this.y = 0;
    this.vy = 0;
    this.isJumping = false;
    this.isGrounded = true;
    this.isSliding = false;
    this.slideTimer = 0;
    this.activePowerups.clear();
    this.shieldMesh.visible = false;
  }
}
