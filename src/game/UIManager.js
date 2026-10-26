/**
 * UIManager
 * Controls DOM menus, HUD, game over screen, popups, and high scores.
 */
export class UIManager {
  constructor(game) {
    this.game = game;

    // DOM Elements
    this.mainMenu = document.getElementById('main-menu');
    this.hud = document.getElementById('game-hud');
    this.pauseMenu = document.getElementById('pause-menu');
    this.gameOverMenu = document.getElementById('game-over-menu');
    this.instructionsModal = document.getElementById('instructions-modal');
    this.settingsModal = document.getElementById('settings-modal');

    // HUD values
    this.scoreVal = document.getElementById('hud-score');
    this.coinVal = document.getElementById('hud-coins');
    this.distVal = document.getElementById('hud-dist-text');
    this.distBar = document.getElementById('hud-dist-bar');
    this.teacherAvatar = document.getElementById('hud-teacher-avatar');
    this.powerupContainer = document.getElementById('hud-powerups');
    this.dialogueBubble = document.getElementById('hud-dialogue');

    // Game Over values
    this.finalScore = document.getElementById('go-score');
    this.finalCoins = document.getElementById('go-coins');
    this.highScore = document.getElementById('go-highscore');
    this.goReason = document.getElementById('go-reason');
    this.menuHighScore = document.getElementById('menu-highscore');

    this.detentionReasons = [
      'Tertangkap basah sedang nongkrong di lorong belakang saat jam pelajaran!',
      'Terpeleset meja kantin saat mencoba kabur dari kejaran Pak Wahid!',
      'Kena razia di parkiran motor SMA Negeri 1 Pasir Sakti!',
      'Sepatu lepas saat melompati tempat sampah sekolah!',
      'Pak Wahid ternyata mantan atlet lari maraton, larimu kalah cepat!'
    ];

    this.initEventListeners();
    this.updateHighScoreDisplay();
  }

  initEventListeners() {
    // Main Menu Buttons
    document.getElementById('btn-play')?.addEventListener('click', () => {
      this.game.audio.initContext();
      this.game.start();
    });

    document.getElementById('btn-instructions')?.addEventListener('click', () => {
      this.instructionsModal.classList.remove('hidden');
    });

    document.getElementById('btn-close-instructions')?.addEventListener('click', () => {
      this.instructionsModal.classList.add('hidden');
    });

    document.getElementById('btn-settings')?.addEventListener('click', () => {
      this.settingsModal.classList.remove('hidden');
    });

    document.getElementById('btn-close-settings')?.addEventListener('click', () => {
      this.settingsModal.classList.add('hidden');
    });

    // In-game HUD
    document.getElementById('btn-pause-hud')?.addEventListener('click', () => {
      this.game.togglePause();
    });

    document.getElementById('btn-mute-hud')?.addEventListener('click', (e) => {
      const isMuted = this.game.audio.toggleMute();
      e.target.innerText = isMuted ? '🔇' : '🔊';
    });

    // Pause Menu
    document.getElementById('btn-resume')?.addEventListener('click', () => {
      this.game.togglePause();
    });

    document.getElementById('btn-restart-pause')?.addEventListener('click', () => {
      this.game.restart();
    });

    document.getElementById('btn-menu-pause')?.addEventListener('click', () => {
      this.game.returnToMenu();
    });

    // Game Over Menu
    document.getElementById('btn-restart')?.addEventListener('click', () => {
      this.game.restart();
    });

    document.getElementById('btn-menu')?.addEventListener('click', () => {
      this.game.returnToMenu();
    });

    // Quality Selector
    const qualitySelect = document.getElementById('setting-quality');
    if (qualitySelect) {
      qualitySelect.addEventListener('change', (e) => {
        this.game.setQuality(e.target.value);
      });
    }

    // Virtual Buttons toggle
    const touchToggle = document.getElementById('setting-touch');
    if (touchToggle) {
      touchToggle.addEventListener('change', (e) => {
        const controls = document.getElementById('touch-controls');
        if (controls) {
          controls.style.display = e.target.checked ? 'flex' : 'none';
        }
      });
    }
  }

  updateHighScoreDisplay() {
    const saved = localStorage.getItem('kejaran_pak_wahid_highscore') || 0;
    if (this.menuHighScore) {
      this.menuHighScore.innerText = `${Math.floor(saved)} m`;
    }
  }

  showMainMenu() {
    this.mainMenu.classList.remove('hidden');
    this.hud.classList.add('hidden');
    this.pauseMenu.classList.add('hidden');
    this.gameOverMenu.classList.add('hidden');
    this.updateHighScoreDisplay();
  }

  showInGameHUD() {
    this.mainMenu.classList.add('hidden');
    this.hud.classList.remove('hidden');
    this.pauseMenu.classList.add('hidden');
    this.gameOverMenu.classList.add('hidden');
  }

  showPauseMenu(isPaused) {
    if (isPaused) {
      this.pauseMenu.classList.remove('hidden');
    } else {
      this.pauseMenu.classList.add('hidden');
    }
  }

  showGameOver(score, coins) {
    this.hud.classList.add('hidden');
    this.pauseMenu.classList.add('hidden');
    this.gameOverMenu.classList.remove('hidden');

    const formattedScore = Math.floor(score);
    this.finalScore.innerText = `${formattedScore} m`;
    this.finalCoins.innerText = coins;

    let high = parseInt(localStorage.getItem('kejaran_pak_wahid_highscore') || '0', 10);
    const newRecordElem = document.getElementById('go-new-record');

    if (formattedScore > high) {
      high = formattedScore;
      localStorage.setItem('kejaran_pak_wahid_highscore', high.toString());
      if (newRecordElem) newRecordElem.classList.remove('hidden');
    } else {
      if (newRecordElem) newRecordElem.classList.add('hidden');
    }

    this.highScore.innerText = `${high} m`;

    // Random funny reason
    const reason = this.detentionReasons[Math.floor(Math.random() * this.detentionReasons.length)];
    this.goReason.innerText = reason;
  }

  updateHUD(score, coins, teacherDist) {
    this.scoreVal.innerText = `${Math.floor(score)} m`;
    this.coinVal.innerText = coins;

    // Pak Wahid Distance Bar (1.2m min to 14.0m max)
    const clampedDist = Math.max(1.2, Math.min(14.0, teacherDist));
    const percent = Math.min(100, Math.max(0, ((clampedDist - 1.2) / 12.8) * 100));

    this.distBar.style.width = `${percent}%`;
    this.distVal.innerText = `${clampedDist.toFixed(1)} m`;

    // Color gradient based on urgency
    if (clampedDist < 3.5) {
      this.distBar.style.backgroundColor = '#ef4444'; // Red danger!
      this.teacherAvatar.style.borderColor = '#ef4444';
      this.teacherAvatar.classList.add('avatar-pulse');
    } else if (clampedDist < 6.5) {
      this.distBar.style.backgroundColor = '#f59e0b'; // Amber caution
      this.teacherAvatar.style.borderColor = '#f59e0b';
      this.teacherAvatar.classList.remove('avatar-pulse');
    } else {
      this.distBar.style.backgroundColor = '#10b981'; // Green safe
      this.teacherAvatar.style.borderColor = '#10b981';
      this.teacherAvatar.classList.remove('avatar-pulse');
    }

    // Render active power-up badges
    this.renderPowerups();
  }

  renderPowerups() {
    if (!this.powerupContainer) return;

    let html = '';
    for (const [id, pow] of this.game.player.activePowerups.entries()) {
      const dur = Math.max(0, pow.duration).toFixed(1);
      html += `
        <div class="powerup-badge" style="border-color: #${pow.color.toString(16)}">
          <span class="powerup-name">${pow.name}</span>
          <span class="powerup-timer">${dur}s</span>
        </div>
      `;
    }
    this.powerupContainer.innerHTML = html;
  }

  showTeacherShout(text) {
    if (!this.dialogueBubble) return;
    this.dialogueBubble.innerText = `Pak Wahid: "${text}"`;
    this.dialogueBubble.classList.remove('hidden');

    clearTimeout(this.dialogueTimer);
    this.dialogueTimer = setTimeout(() => {
      this.dialogueBubble.classList.add('hidden');
    }, 2500);
  }
}
