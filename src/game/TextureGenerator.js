import * as THREE from 'three';

/**
 * TextureGenerator
 * Generates custom procedural textures matching the Indonesian school references.
 */
export class TextureGenerator {
  /**
   * Reference Photo 1: Maroon batik shirt with white and golden-yellow motifs.
   */
  static createBatikTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Maroon base
    ctx.fillStyle = '#7a111a';
    ctx.fillRect(0, 0, 512, 512);

    // Subtle fabric weave texture
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    for (let y = 0; y < 512; y += 4) {
      ctx.fillRect(0, y, 512, 1.5);
    }
    for (let x = 0; x < 512; x += 4) {
      ctx.fillRect(x, 0, 1.5, 512);
    }

    // Traditional Batik Parang & Floral geometry (Maroon, White, Gold)
    const gold = '#e6b325';
    const softGold = '#ffd666';
    const white = '#f8fafc';
    const darkMaroon = '#560b12';

    // Repeating diagonal parang patterns
    for (let offset = -512; offset < 1024; offset += 64) {
      ctx.strokeStyle = darkMaroon;
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(offset, 0);
      ctx.lineTo(offset + 512, 512);
      ctx.stroke();

      ctx.strokeStyle = gold;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(offset + 10, 0);
      ctx.lineTo(offset + 522, 512);
      ctx.stroke();

      ctx.strokeStyle = white;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(offset + 22, 0);
      ctx.lineTo(offset + 534, 512);
      ctx.stroke();
    }

    // Batik floral & diamond rosettes
    const step = 64;
    for (let x = 0; x <= 512; x += step) {
      for (let y = 0; y <= 512; y += step) {
        const cx = x + ((y / step) % 2 === 0 ? 0 : step / 2);
        const cy = y;

        // Gold outer petal ring
        ctx.fillStyle = gold;
        ctx.beginPath();
        ctx.arc(cx, cy, 10, 0, Math.PI * 2);
        ctx.fill();

        // White floral petals
        ctx.fillStyle = white;
        for (let a = 0; a < 4; a++) {
          const angle = (a * Math.PI) / 2 + Math.PI / 4;
          const px = cx + Math.cos(angle) * 12;
          const py = cy + Math.sin(angle) * 12;
          ctx.beginPath();
          ctx.arc(px, py, 4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Center dot
        ctx.fillStyle = softGold;
        ctx.beginPath();
        ctx.arc(cx, cy, 4, 0, Math.PI * 2);
        ctx.fill();

        // Delicate white dots around
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.fillRect(cx - 18, cy, 2.5, 2.5);
        ctx.fillRect(cx + 18, cy, 2.5, 2.5);
        ctx.fillRect(cx, cy - 18, 2.5, 2.5);
        ctx.fillRect(cx, cy + 18, 2.5, 2.5);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    return texture;
  }

  /**
   * Reference Photo 2: Shiny white glossy ceramic floor tiles with nat lines.
   */
  static createFloorTileTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Polished white ceramic tile base
    ctx.fillStyle = '#f4f6f8';
    ctx.fillRect(0, 0, 512, 512);

    const tileSize = 128; // 4x4 tiles in 512px
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#c8ced6'; // Grout line

    for (let x = 0; x < 512; x += tileSize) {
      for (let y = 0; y < 512; y += tileSize) {
        // Tile subtle inner gradient for realistic curvature
        const grad = ctx.createLinearGradient(x, y, x + tileSize, y + tileSize);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.5, '#f6f8fa');
        grad.addColorStop(1, '#e8ecef');
        ctx.fillStyle = grad;
        ctx.fillRect(x + 2, y + 2, tileSize - 4, tileSize - 4);

        // Nat / grout border
        ctx.strokeRect(x + 1.5, y + 1.5, tileSize - 3, tileSize - 3);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 6);
    return texture;
  }

  /**
   * Reference Photo 2: Split wall (Upper dark green, lower ivory/cream ceramic tiles with trim).
   */
  static createSchoolWallTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Split at height: 0 to 240 is Green Top Wall; 240 to 512 is Cream Tile Lower Wall
    // 1. Top Green Wall
    const greenGrad = ctx.createLinearGradient(0, 0, 0, 240);
    greenGrad.addColorStop(0, '#1c5e37');
    greenGrad.addColorStop(1, '#174f2e');
    ctx.fillStyle = greenGrad;
    ctx.fillRect(0, 0, 512, 240);

    // Subtle stucco texture on top green
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    for (let i = 0; i < 1500; i++) {
      const rx = Math.random() * 512;
      const ry = Math.random() * 240;
      ctx.fillRect(rx, ry, 2, 2);
    }

    // Dark trim line divider
    ctx.fillStyle = '#0f381f';
    ctx.fillRect(0, 236, 512, 10);
    ctx.fillStyle = '#dcd4c3';
    ctx.fillRect(0, 246, 512, 4);

    // 2. Bottom Ivory/Cream Ceramic Tiles
    const tileSizeX = 64;
    const tileSizeY = 64;
    for (let y = 250; y < 512; y += tileSizeY) {
      for (let x = 0; x < 512; x += tileSizeX) {
        const tileGrad = ctx.createLinearGradient(x, y, x + tileSizeX, y + tileSizeY);
        tileGrad.addColorStop(0, '#f9f6f0');
        tileGrad.addColorStop(0.7, '#ede6da');
        tileGrad.addColorStop(1, '#e2dacb');
        ctx.fillStyle = tileGrad;
        ctx.fillRect(x + 1, y + 1, tileSizeX - 2, tileSizeY - 2);

        ctx.strokeStyle = '#c7bca7';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x + 0.5, y + 0.5, tileSizeX - 1, tileSizeY - 1);
      }
    }

    // Baseboard skirt at bottom
    ctx.fillStyle = '#174f2e';
    ctx.fillRect(0, 498, 512, 14);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.repeat.set(3, 1);
    return texture;
  }

  /**
   * Reference Photo 2: White classroom door with inset panels and ventilation grill.
   */
  static createDoorTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Door background (white wood)
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, 256, 512);

    // Green door frame border
    ctx.strokeStyle = '#1b5e37';
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, 248, 504);

    // Upper louver / vent grill (typical Indonesian school ventilation above door)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(24, 24, 208, 64);
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    for (let y = 32; y < 84; y += 8) {
      ctx.beginPath();
      ctx.moveTo(28, y);
      ctx.lineTo(228, y);
      ctx.stroke();
    }

    // Top inset panel
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(32, 110, 192, 150);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 4;
    ctx.strokeRect(32, 110, 192, 150);

    // Bottom inset panel
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(32, 280, 192, 180);
    ctx.strokeRect(32, 280, 192, 180);

    // Silver door handle & keyhole
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(190, 260, 24, 10);
    ctx.beginPath();
    ctx.arc(202, 265, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#cbd5e1';
    ctx.fill();
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(200, 280, 4, 10);

    return new THREE.CanvasTexture(canvas);
  }

  /**
   * Classroom Window Texture with green frame and translucent panes.
   */
  static createWindowTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Frame
    ctx.fillStyle = '#1b5e37';
    ctx.fillRect(0, 0, 256, 256);

    // 4 glass panes
    const paneSize = 104;
    const offsets = [
      [16, 16],
      [136, 16],
      [16, 136],
      [136, 136]
    ];

    offsets.forEach(([px, py]) => {
      const grad = ctx.createLinearGradient(px, py, px + paneSize, py + paneSize);
      grad.addColorStop(0, 'rgba(186, 230, 253, 0.7)');
      grad.addColorStop(0.5, 'rgba(224, 242, 254, 0.4)');
      grad.addColorStop(1, 'rgba(125, 211, 252, 0.6)');
      ctx.fillStyle = grad;
      ctx.fillRect(px, py, paneSize, paneSize);

      // Reflection streak
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(px + 20, py + paneSize - 10);
      ctx.lineTo(px + paneSize - 10, py + 20);
      ctx.stroke();
    });

    return new THREE.CanvasTexture(canvas);
  }

  /**
   * Indonesian School Nameplates: "XI A1", "XI A2", "KANTIN", "PARKIR MOTOR"
   */
  static createSignTexture(title, subtitle = 'SMA N 1 PASIR SAKTI', bgColor = '#0f381f', textColor = '#facc15') {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Sign background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, 512, 256);

    // Frame
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 10;
    ctx.strokeRect(10, 10, 492, 236);

    ctx.strokeStyle = textColor;
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, 472, 216);

    // Title
    ctx.fillStyle = textColor;
    ctx.font = 'bold 64px "Arial Black", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(title, 256, 105);

    // Subtitle
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px "Segoe UI", sans-serif';
    ctx.fillText(subtitle, 256, 175);

    return new THREE.CanvasTexture(canvas);
  }

  /**
   * Canteen Banner Texture: "KANTIN BU SITI - MIE AYAM & ES TEH"
   */
  static createCanteenBannerTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    // Indonesian bright warung banner
    const grad = ctx.createLinearGradient(0, 0, 512, 0);
    grad.addColorStop(0, '#e11d48');
    grad.addColorStop(0.5, '#f59e0b');
    grad.addColorStop(1, '#059669');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 128);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 40px "Impact", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 6;
    ctx.fillText('KANTIN SMA NEGERI 1', 256, 45);

    ctx.font = 'bold 22px "Arial Black", sans-serif';
    ctx.fillStyle = '#fef08a';
    ctx.fillText('ANEKA SNACK • ES TEH MANIS • GORENGAN', 256, 90);

    return new THREE.CanvasTexture(canvas);
  }

  /**
   * Paving Block Texture for Parking Area
   */
  static createPavingTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(0, 0, 512, 512);

    const pw = 64;
    const ph = 32;
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 3;

    for (let y = 0; y < 512; y += ph) {
      const offsetX = (y / ph) % 2 === 0 ? 0 : pw / 2;
      for (let x = -pw; x < 512 + pw; x += pw) {
        const px = x + offsetX;
        ctx.fillStyle = Math.random() > 0.5 ? '#9ca3af' : '#8c95a3';
        ctx.fillRect(px + 1, y + 1, pw - 2, ph - 2);
        ctx.strokeRect(px + 1, y + 1, pw - 2, ph - 2);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 8);
    return texture;
  }

  /**
   * Student Face Texture: expressive panic, wide eyes, Indonesian teen skin tone.
   */
  static createStudentFaceTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Natural Indonesian skin tone
    ctx.fillStyle = '#dca67a';
    ctx.fillRect(0, 0, 256, 256);

    // Cheeks blushing / flushed from running
    ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
    ctx.beginPath();
    ctx.arc(60, 150, 30, 0, Math.PI * 2);
    ctx.arc(196, 150, 30, 0, Math.PI * 2);
    ctx.fill();

    // Panicked wide open eyes
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(75, 110, 24, 20, 0, 0, Math.PI * 2);
    ctx.ellipse(181, 110, 24, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    // Dark brown irises looking back / terrified
    ctx.fillStyle = '#26170d';
    ctx.beginPath();
    ctx.arc(70, 110, 12, 0, Math.PI * 2);
    ctx.arc(176, 110, 12, 0, Math.PI * 2);
    ctx.fill();

    // Highlights
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(67, 106, 5, 0, Math.PI * 2);
    ctx.arc(173, 106, 5, 0, Math.PI * 2);
    ctx.fill();

    // Raised anxious eyebrows
    ctx.strokeStyle = '#1e1b18';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(50, 85);
    ctx.quadraticCurveTo(75, 65, 105, 80);
    ctx.moveTo(151, 80);
    ctx.quadraticCurveTo(181, 65, 206, 85);
    ctx.stroke();

    // Open gasping mouth
    ctx.fillStyle = '#541515';
    ctx.beginPath();
    ctx.ellipse(128, 185, 24, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(116, 172, 24, 8); // Upper teeth

    // Sweat drop on forehead
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(215, 60);
    ctx.quadraticCurveTo(225, 75, 220, 85);
    ctx.arc(215, 85, 6, 0, Math.PI);
    ctx.quadraticCurveTo(205, 75, 215, 60);
    ctx.fill();

    return new THREE.CanvasTexture(canvas);
  }

  /**
   * Pak Wahid Face Texture: Authoritative Indonesian teacher with neat mustache.
   */
  static createTeacherFaceTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Natural mature Indonesian skin tone
    ctx.fillStyle = '#cb986c';
    ctx.fillRect(0, 0, 256, 256);

    // Focused, stern eyes
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(75, 115, 20, 14, 0, 0, Math.PI * 2);
    ctx.ellipse(181, 115, 20, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#110b06';
    ctx.beginPath();
    ctx.arc(77, 115, 9, 0, Math.PI * 2);
    ctx.arc(179, 115, 9, 0, Math.PI * 2);
    ctx.fill();

    // Stern furrowed eyebrows
    ctx.strokeStyle = '#0f0e0c';
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(50, 95);
    ctx.lineTo(100, 108);
    ctx.moveTo(206, 95);
    ctx.lineTo(156, 108);
    ctx.stroke();

    // Signature thick Indonesian teacher mustache!
    ctx.fillStyle = '#171717';
    ctx.beginPath();
    ctx.moveTo(75, 175);
    ctx.quadraticCurveTo(128, 155, 181, 175);
    ctx.quadraticCurveTo(128, 195, 75, 175);
    ctx.fill();

    // Shouting mouth under mustache
    ctx.fillStyle = '#450a0a';
    ctx.beginPath();
    ctx.ellipse(128, 195, 22, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Wrinkles of concentration
    ctx.strokeStyle = '#9c6e49';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(118, 95);
    ctx.lineTo(118, 115);
    ctx.moveTo(138, 95);
    ctx.lineTo(138, 115);
    ctx.stroke();

    return new THREE.CanvasTexture(canvas);
  }

  /**
   * Motorbike License Plate: Lampung plate "BE 2026 PS"
   */
  static createLicensePlateTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#18181b';
    ctx.fillRect(0, 0, 256, 128);

    ctx.strokeStyle = '#f4f4f5';
    ctx.lineWidth = 6;
    ctx.strokeRect(6, 6, 244, 116);

    ctx.fillStyle = '#f4f4f5';
    ctx.font = 'bold 44px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('BE 2026 PS', 128, 55);

    ctx.font = 'bold 18px monospace';
    ctx.fillText('10 • 28', 128, 95);

    return new THREE.CanvasTexture(canvas);
  }

  /**
   * Corrugated tin roof texture for canteen and parking canopy.
   */
  static createTinRoofTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 256, 0);
    for (let i = 0; i < 256; i += 32) {
      grad.addColorStop((i) / 256, '#64748b');
      grad.addColorStop((i + 16) / 256, '#cbd5e1');
      grad.addColorStop((i + 32) / 256, '#475569');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(6, 12);
    return texture;
  }
}
