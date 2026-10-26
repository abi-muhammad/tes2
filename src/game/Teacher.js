import * as THREE from 'three';
import { GAME_CONFIG } from './Constants.js';
import { TextureGenerator } from './TextureGenerator.js';

/**
 * Teacher: Pak Wahid, the stern but comical Indonesian school teacher.
 * Wearing plain white short-sleeved shirt, black trousers, black shoes.
 */
export class Teacher {
  constructor() {
    this.mesh = new THREE.Group();
    this.distance = GAME_CONFIG.TEACHER_INITIAL_DIST;
    this.currentX = 0;
    this.animTime = 0;
    this.isReachingOut = false;

    this.buildCharacterModel();
  }

  buildCharacterModel() {
    const faceTexture = TextureGenerator.createTeacherFaceTexture();

    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xcb986c,
      roughness: 0.65,
      metalness: 0.05
    });

    const shirtMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc, // Plain white formal shirt
      roughness: 0.7,
      metalness: 0.02
    });

    const pantsMat = new THREE.MeshStandardMaterial({
      color: 0x18181b, // Black formal trousers
      roughness: 0.8
    });

    const beltMat = new THREE.MeshStandardMaterial({
      color: 0x09090b,
      roughness: 0.4
    });

    const buckleMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37, // Gold belt buckle
      metalness: 0.8,
      roughness: 0.2
    });

    const shoeMat = new THREE.MeshStandardMaterial({
      color: 0x09090b, // Black formal leather shoes
      roughness: 0.35,
      metalness: 0.2
    });

    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x0f0f10,
      roughness: 0.9
    });

    const faceMat = new THREE.MeshStandardMaterial({
      map: faceTexture,
      roughness: 0.65
    });

    // Root anchor (slightly bulkier scale: 1.1x)
    this.modelRoot = new THREE.Group();
    this.mesh.add(this.modelRoot);

    // 1. Pelvis / Hips (Stouter build)
    this.hips = new THREE.Group();
    this.hips.position.y = 1.0;
    this.modelRoot.add(this.hips);

    const pelvisGeo = new THREE.CylinderGeometry(0.32, 0.28, 0.22, 12);
    const pelvis = new THREE.Mesh(pelvisGeo, pantsMat);
    pelvis.castShadow = true;
    this.hips.add(pelvis);

    // Leather belt with gold buckle
    const beltGeo = new THREE.CylinderGeometry(0.325, 0.325, 0.05, 12);
    const belt = new THREE.Mesh(beltGeo, beltMat);
    belt.position.y = 0.08;
    this.hips.add(belt);

    const buckleGeo = new THREE.BoxGeometry(0.08, 0.06, 0.04);
    const buckle = new THREE.Mesh(buckleGeo, buckleMat);
    buckle.position.set(0, 0.08, 0.32);
    this.hips.add(buckle);

    // 2. Torso (Heavier belly and white shirt)
    this.torsoGroup = new THREE.Group();
    this.hips.add(this.torsoGroup);

    // Slightly pot-bellied torso
    const torsoGeo = new THREE.CylinderGeometry(0.33, 0.35, 0.62, 12);
    const torso = new THREE.Mesh(torsoGeo, shirtMat);
    torso.position.set(0, 0.4, 0.03); // Slight belly offset forward
    torso.castShadow = true;
    this.torsoGroup.add(torso);

    // White Shirt Collar
    const collarGeo = new THREE.TorusGeometry(0.16, 0.04, 8, 16);
    const collar = new THREE.Mesh(collarGeo, shirtMat);
    collar.position.set(0, 0.72, 0.05);
    collar.rotation.x = Math.PI / 2.3;
    this.torsoGroup.add(collar);

    // Teacher chest pocket and PNS ID badge pin
    const pocketGeo = new THREE.BoxGeometry(0.12, 0.12, 0.02);
    const pocket = new THREE.Mesh(pocketGeo, shirtMat);
    pocket.position.set(-0.16, 0.52, 0.34);
    this.torsoGroup.add(pocket);

    const badgeGeo = new THREE.BoxGeometry(0.06, 0.04, 0.01);
    const badge = new THREE.Mesh(badgeGeo, buckleMat);
    badge.position.set(-0.16, 0.6, 0.35);
    this.torsoGroup.add(badge);

    // 3. Head & Hair
    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, 0.78, 0);
    this.torsoGroup.add(this.headGroup);

    // Neck (thick adult neck)
    const neckGeo = new THREE.CylinderGeometry(0.13, 0.14, 0.14, 10);
    const neck = new THREE.Mesh(neckGeo, skinMat);
    neck.position.y = 0.05;
    this.headGroup.add(neck);

    // Head with Pak Wahid face texture
    const headGeo = new THREE.SphereGeometry(0.24, 16, 16);
    const head = new THREE.Mesh(headGeo, [
      skinMat, skinMat, skinMat, skinMat, faceMat, skinMat
    ]);
    head.position.y = 0.24;
    head.castShadow = true;
    this.headGroup.add(head);

    // Neat black adult hair
    const hairGeo = new THREE.SphereGeometry(0.255, 14, 14, 0, Math.PI * 2, 0, Math.PI / 1.7);
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.set(0, 0.26, -0.02);
    hair.rotation.x = -0.1;
    this.headGroup.add(hair);

    // 4. Arms (White sleeves, robust arms)
    this.leftArm = this.createArm(skinMat, shirtMat, -1);
    this.leftArm.position.set(-0.4, 0.6, 0);
    this.torsoGroup.add(this.leftArm);

    this.rightArm = this.createArm(skinMat, shirtMat, 1);
    this.rightArm.position.set(0.4, 0.6, 0);
    this.torsoGroup.add(this.rightArm);

    // 5. Legs (Black formal pants and dress shoes)
    this.leftLeg = this.createLeg(pantsMat, shoeMat);
    this.leftLeg.position.set(-0.18, -0.06, 0);
    this.hips.add(this.leftLeg);

    this.rightLeg = this.createLeg(pantsMat, shoeMat);
    this.rightLeg.position.set(0.18, -0.06, 0);
    this.hips.add(this.rightLeg);

    // Enable shadows
    this.mesh.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
      }
    });
  }

  createArm(skinMat, shirtMat, side) {
    const armRoot = new THREE.Group();

    // White short sleeve
    const sleeveGeo = new THREE.CylinderGeometry(0.12, 0.11, 0.2, 10);
    const sleeve = new THREE.Mesh(sleeveGeo, shirtMat);
    sleeve.position.y = -0.09;
    armRoot.add(sleeve);

    // Upper arm (skin)
    const upperGeo = new THREE.CylinderGeometry(0.09, 0.085, 0.22, 8);
    const upper = new THREE.Mesh(upperGeo, skinMat);
    upper.position.y = -0.24;
    armRoot.add(upper);

    // Forearm & Hand
    const forearmGroup = new THREE.Group();
    forearmGroup.position.y = -0.34;
    armRoot.add(forearmGroup);

    const lowerGeo = new THREE.CylinderGeometry(0.085, 0.08, 0.24, 8);
    const lower = new THREE.Mesh(lowerGeo, skinMat);
    lower.position.y = -0.12;
    forearmGroup.add(lower);

    // Clenched/grasping hand
    const handGeo = new THREE.BoxGeometry(0.12, 0.12, 0.1);
    const hand = new THREE.Mesh(handGeo, skinMat);
    hand.position.y = -0.28;
    forearmGroup.add(hand);

    armRoot.userData.forearm = forearmGroup;
    return armRoot;
  }

  createLeg(pantsMat, shoeMat) {
    const legRoot = new THREE.Group();

    // Thigh
    const thighGeo = new THREE.CylinderGeometry(0.15, 0.13, 0.46, 10);
    const thigh = new THREE.Mesh(thighGeo, pantsMat);
    thigh.position.y = -0.23;
    legRoot.add(thigh);

    // Shin group
    const shinGroup = new THREE.Group();
    shinGroup.position.y = -0.46;
    legRoot.add(shinGroup);

    const shinGeo = new THREE.CylinderGeometry(0.13, 0.11, 0.46, 10);
    const shin = new THREE.Mesh(shinGeo, pantsMat);
    shin.position.y = -0.23;
    shinGroup.add(shin);

    // Black formal shoes
    const shoeGeo = new THREE.BoxGeometry(0.19, 0.12, 0.34);
    const shoe = new THREE.Mesh(shoeGeo, shoeMat);
    shoe.position.set(0, -0.5, 0.06);
    shoe.castShadow = true;
    shinGroup.add(shoe);

    legRoot.userData.shin = shinGroup;
    return legRoot;
  }

  update(dt, playerX, playerZ, speed, isCleanRunning) {
    // 1. Recover distance if player runs cleanly, or keep pace
    if (isCleanRunning) {
      this.distance = Math.min(
        GAME_CONFIG.TEACHER_MAX_DIST,
        this.distance + GAME_CONFIG.TEACHER_RECOVERY_RATE * dt
      );
    }

    // 2. Position Pak Wahid behind player
    const targetZ = playerZ - this.distance;
    this.mesh.position.z = targetZ;

    // Smoothly track player's X lane with slight delay
    this.currentX += (playerX - this.currentX) * Math.min(1.0, 6.0 * dt);
    this.mesh.position.x = this.currentX;

    // Check if reaching out to catch player (distance < 3.5m)
    this.isReachingOut = this.distance < 3.5;

    // 3. Animation cycle
    this.animate(dt, speed);
  }

  animate(dt, speed) {
    const runFreq = speed * 0.72;
    this.animTime += dt * runFreq;

    const legCycle = Math.sin(this.animTime);
    const armCycle = -legCycle;

    // Body sway & heavy step bob
    this.hips.position.y = 1.0 + Math.abs(Math.sin(this.animTime * 2)) * 0.09;
    this.modelRoot.rotation.x = 0.16; // Chasing posture forward lean
    this.modelRoot.rotation.z = Math.sin(this.animTime) * 0.05;

    // Legs swing
    this.leftLeg.rotation.x = legCycle * 0.8;
    this.leftLeg.userData.shin.rotation.x = Math.max(0, -legCycle * 1.2);

    this.rightLeg.rotation.x = -legCycle * 0.8;
    this.rightLeg.userData.shin.rotation.x = Math.max(0, legCycle * 1.2);

    if (this.isReachingOut) {
      // Reaching out hands forward to grab student!
      this.leftArm.rotation.x = -1.5;
      this.leftArm.userData.forearm.rotation.x = 0.2;
      this.rightArm.rotation.x = -1.4;
      this.rightArm.userData.forearm.rotation.x = 0.2;
      this.headGroup.rotation.x = -0.2;
    } else {
      // Vigorous swinging teacher sprint
      this.leftArm.rotation.x = armCycle * 0.9;
      this.leftArm.userData.forearm.rotation.x = 0.7 + Math.abs(armCycle) * 0.4;

      this.rightArm.rotation.x = -armCycle * 0.9;
      this.rightArm.userData.forearm.rotation.x = 0.7 + Math.abs(armCycle) * 0.4;
    }
  }

  penalize() {
    // Player hit an obstacle: Pak Wahid charges closer!
    this.distance = Math.max(GAME_CONFIG.TEACHER_MIN_DIST + 0.5, this.distance - GAME_CONFIG.TEACHER_PENALTY_DIST);
  }

  pushBack(distance = 6.0) {
    // Mode Kabur power-up pushes teacher further back
    this.distance = Math.min(GAME_CONFIG.TEACHER_MAX_DIST, this.distance + distance);
  }

  isCaught() {
    return this.distance <= GAME_CONFIG.TEACHER_MIN_DIST;
  }

  reset() {
    this.distance = GAME_CONFIG.TEACHER_INITIAL_DIST;
    this.currentX = 0;
    this.mesh.position.set(0, 0, -GAME_CONFIG.TEACHER_INITIAL_DIST);
    this.isReachingOut = false;
  }
}
