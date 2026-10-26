import { Game } from './game/Game.js';

window.addEventListener('DOMContentLoaded', () => {
  const checkWebGL = () => {
    try {
      const canvas = document.createElement('canvas');
      return !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
    } catch (e) {
      return false;
    }
  };

  if (!checkWebGL()) {
    const errorEl = document.createElement('div');
    errorEl.className = 'webgl-error-card';
    errorEl.innerHTML = `
      <h2>WebGL Tidak Didukung</h2>
      <p>Browser atau perangkat Anda tidak mendukung akselerasi grafis WebGL 3D yang dibutuhkan untuk menjalankan game ini.</p>
      <p>Silakan gunakan Chrome / Firefox / Edge terbaru dengan akselerasi hardware aktif.</p>
    `;
    document.body.appendChild(errorEl);
    return;
  }

  const game = new Game();

  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('./sw.js').catch((err) => {
      console.log('SW registration skipped:', err);
    });
  }
});
