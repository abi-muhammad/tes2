import * as THREE from 'three';
import { GAME_CONFIG } from './Constants.js';
import { TextureGenerator } from './TextureGenerator.js';

/**
 * ParkingChunk: Area Parkiran Motor Siswa SMA Negeri 1 Pasir Sakti.
 * Indonesian school motorcycle parking area with canopy, paving blocks, and parked motorbikes.
 */
export class ParkingChunk {
  constructor() {
    this.mesh = new THREE.Group();
    this.length = GAME_CONFIG.CHUNK_LENGTH;
    this.obstacles = [];
    this.coins = [];
    this.powerups = [];

    this.buildChunk();
  }

  buildChunk() {
    const pavingTexture = TextureGenerator.createPavingTexture();
    const tinRoofTexture = TextureGenerator.createTinRoofTexture();
    const signTexture = TextureGenerator.createSignTexture('PARKIR MOTOR', 'SMA NEGERI 1 PASIR SAKTI', '#1e3a8a', '#facc15');

    // Materials
    const floorMat = new THREE.MeshStandardMaterial({
      map: pavingTexture,
      roughness: 0.8
    });

    const steelMat = new THREE.MeshStandardMaterial({
      color: 0x334155, // Steel canopy frame
      roughness: 0.4,
      metalness: 0.6
    });

    const roofMat = new THREE.MeshStandardMaterial({
      map: tinRoofTexture,
      roughness: 0.5,
      metalness: 0.3
    });

    const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    const parkingWidth = 12.0;
    const canopyHeight = 4.2;

    // 1. Paving Block Floor
    const floorGeo = new THREE.PlaneGeometry(parkingWidth, this.length);
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, this.length / 2);
    floor.receiveShadow = true;
    this.mesh.add(floor);

    // 2. White Painted Parking Lines
    for (let z = 3; z < this.length; z += 3.5) {
      // Left bay line
      const lineGeoL = new THREE.PlaneGeometry(2.4, 0.1);
      const lineL = new THREE.Mesh(lineGeoL, lineMat);
      lineL.rotation.x = -Math.PI / 2;
      lineL.position.set(-parkingWidth / 2 + 1.8, 0.01, z);
      this.mesh.add(lineL);

      // Right bay line
      const lineGeoR = new THREE.PlaneGeometry(2.4, 0.1);
      const lineR = new THREE.Mesh(lineGeoR, lineMat);
      lineR.rotation.x = -Math.PI / 2;
      lineR.position.set(parkingWidth / 2 - 1.8, 0.01, z);
      this.mesh.add(lineR);
    }

    // 3. Canopy Roof
    const roofGeo = new THREE.PlaneGeometry(parkingWidth, this.length);
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.rotation.x = Math.PI / 2;
    roof.position.set(0, canopyHeight, this.length / 2);
    this.mesh.add(roof);

    // Entrance Arch Sign
    const signGeo = new THREE.PlaneGeometry(3.6, 1.2);
    const signMat = new THREE.MeshStandardMaterial({ map: signTexture, roughness: 0.3 });
    const sign = new THREE.Mesh(signGeo, signMat);
    sign.position.set(0, canopyHeight - 0.7, 2);
    this.mesh.add(sign);

    // Canopy Steel Support Columns
    const postGeo = new THREE.CylinderGeometry(0.12, 0.12, canopyHeight, 8);
    for (let z = 2; z < this.length; z += 10) {
      const pLeft = new THREE.Mesh(postGeo, steelMat);
      pLeft.position.set(-parkingWidth / 2 + 0.3, canopyHeight / 2, z);
      pLeft.castShadow = true;
      this.mesh.add(pLeft);

      const pRight = new THREE.Mesh(postGeo, steelMat);
      pRight.position.set(parkingWidth / 2 - 0.3, canopyHeight / 2, z);
      pRight.castShadow = true;
      this.mesh.add(pRight);
    }

    // 4. Rows of Parked Indonesian Motorbikes (Matic/Bebek) on both sides
    const bikeColors = [0xb91c1c, 0x1d4ed8, 0x18181b, 0x059669, 0xd97706, 0x4b5563];
    let colorIdx = 0;

    for (let z = 4; z < this.length - 2; z += 3.6) {
      // Left side parked bike
      const bikeL = this.createMotorbike(bikeColors[colorIdx % bikeColors.length]);
      bikeL.position.set(-parkingWidth / 2 + 1.8, 0, z);
      bikeL.rotation.y = Math.PI / 2 + 0.15; // Parked diagonal
      this.mesh.add(bikeL);
      colorIdx++;

      // Right side parked bike
      const bikeR = this.createMotorbike(bikeColors[colorIdx % bikeColors.length]);
      bikeR.position.set(parkingWidth / 2 - 1.8, 0, z);
      bikeR.rotation.y = -Math.PI / 2 - 0.15;
      this.mesh.add(bikeR);
      colorIdx++;
    }

    // 5. School Perimeter Fence and Trees in Background
    const fenceMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.5 });
    const fenceGeo = new THREE.BoxGeometry(0.1, 2.0, this.length);
    const fenceL = new THREE.Mesh(fenceGeo, fenceMat);
    fenceL.position.set(-parkingWidth / 2 - 0.5, 1.0, this.length / 2);
    this.mesh.add(fenceL);

    const fenceR = new THREE.Mesh(fenceGeo, fenceMat);
    fenceR.position.set(parkingWidth / 2 + 0.5, 1.0, this.length / 2);
    this.mesh.add(fenceR);
  }

  createMotorbike(bodyColor = 0xb91c1c) {
    const bike = new THREE.Group();
    const plateTexture = TextureGenerator.createLicensePlateTexture();

    const bodyMat = new THREE.MeshStandardMaterial({
      color: bodyColor,
      roughness: 0.3,
      metalness: 0.4
    });

    const tireMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.8
    });

    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xd1d5db,
      metalness: 0.8,
      roughness: 0.2
    });

    const seatMat = new THREE.MeshStandardMaterial({
      color: 0x09090b,
      roughness: 0.9
    });

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.9,
      roughness: 0.1
    });

    // Wheels (Front & Rear)
    const wheelGeo = new THREE.TorusGeometry(0.28, 0.08, 8, 16);
    const rimGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.04, 12);

    const frontWheel = new THREE.Mesh(wheelGeo, tireMat);
    frontWheel.position.set(0, 0.32, 0.75);
    frontWheel.castShadow = true;
    bike.add(frontWheel);

    const frontRim = new THREE.Mesh(rimGeo, rimMat);
    frontRim.rotation.z = Math.PI / 2;
    frontWheel.add(frontRim);

    const rearWheel = new THREE.Mesh(wheelGeo, tireMat);
    rearWheel.position.set(0, 0.32, -0.65);
    rearWheel.castShadow = true;
    bike.add(rearWheel);

    const rearRim = new THREE.Mesh(rimGeo, rimMat);
    rearRim.rotation.z = Math.PI / 2;
    rearWheel.add(rearRim);

    // Chassis / Body (Indonesian Matic Scooter style)
    const bodyGeo = new THREE.BoxGeometry(0.42, 0.45, 0.9);
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.set(0, 0.55, 0);
    body.castShadow = true;
    bike.add(body);

    // Front Fairing
    const fairingGeo = new THREE.BoxGeometry(0.38, 0.5, 0.45);
    const fairing = new THREE.Mesh(fairingGeo, bodyMat);
    fairing.position.set(0, 0.75, 0.55);
    fairing.rotation.x = -0.3;
    fairing.castShadow = true;
    bike.add(fairing);

    // Headlight
    const headlightGeo = new THREE.BoxGeometry(0.24, 0.14, 0.04);
    const headlightMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const headlight = new THREE.Mesh(headlightGeo, headlightMat);
    headlight.position.set(0, 0.8, 0.78);
    bike.add(headlight);

    // Handlebars
    const barGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.65, 8);
    const handlebar = new THREE.Mesh(barGeo, chromeMat);
    handlebar.rotation.z = Math.PI / 2;
    handlebar.position.set(0, 1.05, 0.5);
    bike.add(handlebar);

    // Rearview Mirrors (Spion)
    const mirrorGeo = new THREE.SphereGeometry(0.05, 8, 8);
    const mirrorL = new THREE.Mesh(mirrorGeo, tireMat);
    mirrorL.position.set(-0.32, 1.18, 0.5);
    bike.add(mirrorL);

    const mirrorR = new THREE.Mesh(mirrorGeo, tireMat);
    mirrorR.position.set(0.32, 1.18, 0.5);
    bike.add(mirrorR);

    // Black Seat (Jok Motor)
    const seatGeo = new THREE.BoxGeometry(0.36, 0.12, 0.75);
    const seat = new THREE.Mesh(seatGeo, seatMat);
    seat.position.set(0, 0.82, -0.15);
    seat.castShadow = true;
    bike.add(seat);

    // Exhaust Pipe (Knalpot)
    const exhaustGeo = new THREE.CylinderGeometry(0.05, 0.06, 0.6, 8);
    const exhaust = new THREE.Mesh(exhaustGeo, chromeMat);
    exhaust.rotation.x = Math.PI / 2;
    exhaust.position.set(0.24, 0.28, -0.45);
    bike.add(exhaust);

    // Lampung License Plate "BE 2026 PS"
    const plateGeo = new THREE.PlaneGeometry(0.28, 0.14);
    const plateMat = new THREE.MeshStandardMaterial({ map: plateTexture, roughness: 0.5 });
    const plate = new THREE.Mesh(plateGeo, plateMat);
    plate.rotation.y = Math.PI;
    plate.position.set(0, 0.5, -0.85);
    bike.add(plate);

    return bike;
  }

  setPosition(z) {
    this.mesh.position.z = z;
  }
}
