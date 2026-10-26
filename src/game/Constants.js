/**
 * KEJARAN PAK WAHID!
 * Global Game Constants and Configuration
 */

export const LANES = {
  LEFT: -2.3,
  CENTER: 0.0,
  RIGHT: 2.3
};

export const LANE_INDICES = [-2.3, 0.0, 2.3];

export const GAME_CONFIG = {
  INITIAL_SPEED: 18.0,
  MAX_SPEED: 32.0,
  ACCELERATION: 0.15, // Speed increment per 100 meters
  LANE_SWITCH_SPEED: 14.0, // Lerp speed for lane transition
  
  // Jump & Slide Physics
  JUMP_FORCE: 9.8,
  GRAVITY: 28.0,
  SLIDE_DURATION: 0.75, // Seconds
  
  // Teacher Distance Mechanics
  TEACHER_INITIAL_DIST: 9.0,
  TEACHER_MAX_DIST: 14.0,
  TEACHER_MIN_DIST: 1.2, // Caught threshold
  TEACHER_RECOVERY_RATE: 0.5, // Meters gained per second when running cleanly
  TEACHER_PENALTY_DIST: 3.8, // Penalty when hitting an obstacle without shield
  
  // Chunk and Environment
  CHUNK_LENGTH: 45.0,
  VISIBLE_CHUNKS: 5,
  ZONE_DURATION_CHUNKS: 6, // Number of chunks before transitioning to next zone (Corridor -> Canteen -> Parking)
  
  // Zone Enums
  ZONES: {
    CORRIDOR: 'corridor',
    CANTEEN: 'canteen',
    PARKING: 'parking'
  },
  
  // Powerups
  POWERUPS: {
    SPEED_BOOTS: { id: 'speed_boots', name: 'Sepatu Kecepatan', duration: 6.0, color: 0x38bdf8 },
    SHIELD: { id: 'shield', name: 'Buku Perlindungan', duration: 15.0, color: 0xef4444 },
    COIN_MAGNET: { id: 'coin_magnet', name: 'Koin Kantin', duration: 7.0, color: 0xfacc15 },
    SCORE_BELL: { id: 'score_bell', name: 'Bel Sekolah 2X', duration: 8.0, color: 0xf59e0b },
    ESCAPE_RUN: { id: 'escape_run', name: 'Mode Kabur', duration: 0.0, color: 0x10b981 }
  }
};
