/**
 * InputHandler
 * Handles Keyboard controls (A/D/W/S, Arrow Keys, Space, Esc, P)
 * and Touch Gestures (Swipe Left/Right/Up/Down, On-Screen Virtual Buttons).
 * Prevents default page scroll & pinch-zoom on mobile devices.
 */
export class InputHandler {
  constructor(game) {
    this.game = game;
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.minSwipeDistance = 30; // Min px to trigger swipe

    this.bindKeyboard();
    this.bindTouch();
    this.bindVirtualButtons();
  }

  bindKeyboard() {
    window.addEventListener('keydown', (e) => {
      if (this.game.isGameOver) return;

      const code = e.code;

      if (code === 'Escape' || code === 'KeyP') {
        this.game.togglePause();
        return;
      }

      if (this.game.isPaused || !this.game.isPlaying) return;

      if (code === 'ArrowLeft' || code === 'KeyA') {
        this.game.player.changeLane('left');
      } else if (code === 'ArrowRight' || code === 'KeyD') {
        this.game.player.changeLane('right');
      } else if (code === 'ArrowUp' || code === 'KeyW' || code === 'Space') {
        if (this.game.player.jump()) {
          this.game.audio.playJumpSound();
        }
      } else if (code === 'ArrowDown' || code === 'KeyS') {
        if (this.game.player.slide()) {
          this.game.audio.playSlideSound();
        }
      }
    });
  }

  bindTouch() {
    const canvas = document.getElementById('game-canvas');
    if (!canvas) return;

    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
      }
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
      // Prevent browser default pull-to-refresh and pinch-zoom
      e.preventDefault();
    }, { passive: false });

    canvas.addEventListener('touchend', (e) => {
      if (this.game.isGameOver || this.game.isPaused || !this.game.isPlaying) return;
      if (e.changedTouches.length === 0) return;

      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;

      const dx = touchEndX - this.touchStartX;
      const dy = touchEndY - this.touchStartY;

      if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal swipe
        if (Math.abs(dx) >= this.minSwipeDistance) {
          if (dx > 0) {
            this.game.player.changeLane('right');
          } else {
            this.game.player.changeLane('left');
          }
        }
      } else {
        // Vertical swipe
        if (Math.abs(dy) >= this.minSwipeDistance) {
          if (dy < 0) {
            // Swipe Up: Jump
            if (this.game.player.jump()) {
              this.game.audio.playJumpSound();
            }
          } else {
            // Swipe Down: Slide
            if (this.game.player.slide()) {
              this.game.audio.playSlideSound();
            }
          }
        }
      }
    }, { passive: false });
  }

  bindVirtualButtons() {
    const btnLeft = document.getElementById('btn-left');
    const btnRight = document.getElementById('btn-right');
    const btnJump = document.getElementById('btn-jump');
    const btnSlide = document.getElementById('btn-slide');

    const handlePress = (action) => {
      if (this.game.isGameOver || this.game.isPaused || !this.game.isPlaying) return;

      if (action === 'left') {
        this.game.player.changeLane('left');
      } else if (action === 'right') {
        this.game.player.changeLane('right');
      } else if (action === 'jump') {
        if (this.game.player.jump()) {
          this.game.audio.playJumpSound();
        }
      } else if (action === 'slide') {
        if (this.game.player.slide()) {
          this.game.audio.playSlideSound();
        }
      }
    };

    const attach = (btn, action) => {
      if (!btn) return;
      btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handlePress(action);
      }, { passive: false });
      btn.addEventListener('mousedown', (e) => {
        e.preventDefault();
        handlePress(action);
      });
    };

    attach(btnLeft, 'left');
    attach(btnRight, 'right');
    attach(btnJump, 'jump');
    attach(btnSlide, 'slide');
  }
}
