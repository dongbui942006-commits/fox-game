/* ==========================================================================
   ĐẢO XU VÀNG — Isometric 2.5D Adventure Game & UI Controller
   ========================================================================== */

const STORAGE_KEY = 'dao_xu_vang_save_v1';

const LEVELS = {
  1: {
    id: 1,
    name: 'Rừng xanh',
    navLabel: 'MÀN 01  /  RỪNG XANH',
    diff: 'DỄ',
    themeClass: 'theme-forest',
    targetCoins: 50,
    timeLimit: 90,
    goalDesc: 'Đi theo đường xu và<br/>nhảy qua chướng ngại.',
    tip: 'Giữ nhịp di chuyển,<br/>đừng bỏ lỡ đường xu!',
    tipBg: '#dde9cb',
    remainingText: (left) => `Thêm ${left} xu nữa là chiến thắng!`,
    completeTitle: 'GIỎI QUÁ! KHO BÁU ĐÃ ĐẦY.',
    nextUnlockTitle: 'ĐÃ MỞ KHÓA MÀN 02',
    nextUnlockDesc: 'Sa mạc · 75 xu / 100 giây',
    nextBtnText: 'KHÁM PHÁ SA MẠC  →',
    friction: 0.82,
    accel: 1.55,
    maxSpeed: 0.82,
    obstacleCount: 5,
    movingHazards: 1,
    colors: {
      top: '#9ad3a6',
      topInner: '#8ac798',
      trail: '#fff4d4',
      wallLeft: '#206b58',
      wallRight: '#154e40',
      stroke: '#173f37',
      accent: '#ffcd51',
    },
  },
  2: {
    id: 2,
    name: 'Sa mạc',
    navLabel: 'MÀN 02  /  SA MẠC',
    diff: 'VỪA',
    themeClass: 'theme-desert',
    targetCoins: 75,
    timeLimit: 100,
    goalDesc: 'Tránh xương rồng và<br/>cột đá trên đường chạy.',
    tip: 'Canh nhảy sớm để<br/>vượt qua cột đá thấp.',
    tipBg: '#f1daa4',
    remainingText: (left) => `Còn ${left} xu nữa để vượt sa mạc!`,
    completeTitle: 'TUYỆT VỜI! VƯỢT SA MẠC THÀNH CÔNG.',
    nextUnlockTitle: 'ĐÃ MỞ KHÓA MÀN 03',
    nextUnlockDesc: 'Đảo băng · 100 xu / 120 giây',
    nextBtnText: 'KHÁM PHÁ ĐẢO BĂNG  →',
    friction: 0.84,
    accel: 1.75,
    maxSpeed: 0.92,
    obstacleCount: 7,
    movingHazards: 2,
    colors: {
      top: '#edc77c',
      topInner: '#e3b968',
      trail: '#fff3d1',
      wallLeft: '#ba633c',
      wallRight: '#8f4424',
      stroke: '#173f37',
      accent: '#ffcd51',
    },
  },
  3: {
    id: 3,
    name: 'Đảo băng',
    navLabel: 'MÀN 03  /  ĐẢO BĂNG',
    diff: 'KHÓ',
    themeClass: 'theme-ice',
    targetCoins: 100,
    timeLimit: 120,
    goalDesc: 'Tránh tinh thể băng và<br/>giữ thăng bằng khi rẽ.',
    tip: 'Mặt băng rất trơn!<br/>Giảm tốc trước khi rẽ.',
    tipBg: '#cee3e8',
    remainingText: (left) => `Còn ${left} xu nữa để chinh phục đảo băng!`,
    completeTitle: 'XUẤT SẮC! CHINH PHỤC ĐẢO BĂNG.',
    nextUnlockTitle: 'HOÀN TẤT HÀNH TRÌNH',
    nextUnlockDesc: 'Bạn đã chinh phục cả 3 vùng đất!',
    nextBtnText: 'CHƠI LẠI TỪ ĐẦU  →',
    friction: 0.955, // Slippery ice inertia!
    accel: 0.72,
    maxSpeed: 1.04,
    obstacleCount: 8,
    movingHazards: 3,
    colors: {
      top: '#f2fafc',
      topInner: '#dff0f5',
      trail: '#cde7f0',
      wallLeft: '#4e8ca1',
      wallRight: '#316578',
      stroke: '#173f37',
      accent: '#ffcd51',
    },
  },
};

const SHOP_ITEMS = [
  {
    id: 'speed',
    name: 'Giày Gió Nhẹ',
    desc: 'Tăng 18% tốc độ di chuyển của cáo nhỏ trên mọi hòn đảo.',
    price: 80,
    buffLabel: '⚡ Giày Gió (+18% tốc độ)',
  },
  {
    id: 'magnet',
    name: 'Nam Châm Xu Vàng',
    desc: 'Tự động hút các đồng xu ở khoảng cách gần về phía bạn.',
    price: 120,
    buffLabel: '🧲 Nam Châm Xu',
  },
  {
    id: 'heart',
    name: 'Trái Tim Bền Bỉ',
    desc: 'Bắt đầu mỗi màn chơi với 4 lượt sống thay vì 3 lượt.',
    price: 150,
    buffLabel: '❤️ +1 Lượt Sống',
  },
];

// ==================== SAVE DATA ====================
function loadSave() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        wallet: parsed.wallet ?? 0,
        unlockedLevel: parsed.unlockedLevel ?? 1,
        unlockAll: parsed.unlockAll ?? false,
        sfx: parsed.sfx ?? true,
        bestRecords: parsed.bestRecords ?? {},
        upgrades: parsed.upgrades ?? { speed: false, magnet: false, heart: false },
      };
    }
  } catch (e) {
    console.warn('Could not load save:', e);
  }
  return {
    wallet: 0,
    unlockedLevel: 1,
    unlockAll: false,
    sfx: true,
    bestRecords: {},
    upgrades: { speed: false, magnet: false, heart: false },
  };
}

let saveData = loadSave();
function persistSave() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
  } catch (e) {
    // ignore storage errors
  }
}

// ==================== WEB AUDIO SFX ====================
class SoundFX {
  constructor() {
    this.ctx = null;
  }
  ensure() {
    if (!saveData.sfx) return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }
  tone(freq, dur, type = 'sine', gainVal = 0.12, delay = 0) {
    const ctx = this.ensure();
    if (!ctx) return;
    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(gainVal, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + dur);
  }
  coin(bonus = false) {
    this.tone(bonus ? 1046 : 880, 0.08, 'triangle', 0.14, 0);
    this.tone(bonus ? 1568 : 1318, 0.14, 'triangle', 0.14, 0.06);
  }
  jump() {
    const ctx = this.ensure();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(520, now + 0.14);
    gain.gain.setValueAtTime(0.11, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.16);
  }
  hit() {
    this.tone(180, 0.16, 'sawtooth', 0.14, 0);
    this.tone(110, 0.22, 'sawtooth', 0.12, 0.08);
  }
  win() {
    [523, 659, 784, 1046].forEach((f, i) => this.tone(f, 0.22, 'triangle', 0.14, i * 0.09));
  }
  lose() {
    [392, 349, 311, 261].forEach((f, i) => this.tone(f, 0.2, 'sine', 0.12, i * 0.11));
  }
  click() {
    this.tone(600, 0.05, 'sine', 0.06, 0);
  }
}
const sfx = new SoundFX();

// ==================== ASSET PRELOADER FOR CANVAS ====================
function loadImg(src) {
  const img = new Image();
  img.src = src;
  return img;
}

const canvasSprites = {
  foxNormal: loadImg('assets/forest/imgFox-7889a.svg'),
  foxIce: loadImg('assets/ice/imgFoxAdventurer-0f9f6.svg'),
  coin: loadImg('assets/forest/imgCoin1-536d5.svg'),
  tree1: loadImg('assets/forest/imgTreeBackLeft-e6726.svg'),
  tree2: loadImg('assets/forest/imgTreeRight-97ab2.svg'),
  cactus: loadImg('assets/desert/imgCactusLeft-1517c.svg'),
  pillar: loadImg('assets/desert/imgSandstonePillarBack-e9ff8.svg'),
  desertRock: loadImg('assets/desert/imgRocksLeft-9e10e.svg'),
  pine: loadImg('assets/ice/imgRearPine-b7dbf.svg'),
  iceCrystal: loadImg('assets/ice/imgIceCrystalLeft-d382f.svg'),
  heartSvg: 'assets/forest/imgGroup5-2830c.svg',
};

// ==================== DOM REFERENCES ====================
const screens = {
  home: document.getElementById('screen-home'),
  select: document.getElementById('screen-select'),
  shop: document.getElementById('screen-shop'),
  leaderboard: document.getElementById('screen-leaderboard'),
  play: document.getElementById('screen-play'),
  complete: document.getElementById('screen-complete'),
};

const mainNavbar = document.getElementById('main-navbar');
const playNavbar = document.getElementById('play-navbar');
const navTabs = document.querySelectorAll('.nav-tab');

// ==================== NAVIGATION ====================
let currentScreen = 'home';
let activeGame = null;

function formatNum(n) {
  return n.toLocaleString('vi-VN');
}

function formatTime(sec) {
  const s = Math.max(0, Math.floor(sec));
  const m = String(Math.floor(s / 60)).padStart(2, '0');
  const r = String(s % 60).padStart(2, '0');
  return `${m}:${r}`;
}

function showScreen(name) {
  if (currentScreen === 'play' && name !== 'play' && activeGame) {
    activeGame.stop();
  }
  currentScreen = name;

  Object.entries(screens).forEach(([key, el]) => {
    el.classList.toggle('hidden', key !== name);
  });

  const isPlay = name === 'play';
  mainNavbar.classList.toggle('hidden', isPlay);
  playNavbar.classList.toggle('hidden', !isPlay);

  navTabs.forEach((tab) => {
    const target = tab.dataset.nav;
    const isActive = target === name || (name === 'complete' && target === 'home');
    tab.classList.toggle('active', isActive);
  });

  refreshUI();
}

function refreshUI() {
  // Wallet
  document.getElementById('wallet-balance').textContent = formatNum(saveData.wallet);

  // Home stats
  const bestCoins = Math.max(0, ...Object.values(saveData.bestRecords).map((r) => r.coins || 0));
  document.getElementById('home-best-record').textContent = `${bestCoins} xu`;
  const completedCount = Object.keys(saveData.bestRecords).length;
  document.getElementById('home-player-level').textContent = String(1 + completedCount).padStart(2, '0');

  // Level Select unlock states
  const maxUnlocked = saveData.unlockAll ? 3 : saveData.unlockedLevel;
  [2, 3].forEach((lvl) => {
    const btn = document.getElementById(`btn-level-${lvl}`);
    const card = document.querySelector(`.level-card[data-level="${lvl}"]`);
    const unlocked = maxUnlocked >= lvl;
    card.classList.toggle('is-unlocked', unlocked);
    if (unlocked) {
      btn.classList.remove('locked');
      btn.classList.add('unlocked');
      btn.textContent = `CHƠI MÀN 0${lvl}`;
    } else {
      btn.classList.add('locked');
      btn.classList.remove('unlocked');
      btn.textContent = `Hoàn thành màn 0${lvl - 1} để mở`;
    }
  });

  if (currentScreen === 'shop') renderShop();
  if (currentScreen === 'leaderboard') renderLeaderboard();
}

function renderShop() {
  const grid = document.getElementById('shop-grid');
  grid.innerHTML = '';
  SHOP_ITEMS.forEach((item) => {
    const owned = saveData.upgrades[item.id];
    const canAfford = saveData.wallet >= item.price;
    const card = document.createElement('div');
    card.className = 'shop-card';
    card.innerHTML = `
      <div>
        <h3>${item.name}</h3>
        <p>${item.desc}</p>
      </div>
      <div>
        <div class="shop-price">${owned ? 'Đã sở hữu ✓' : `${item.price} xu`}</div>
      </div>
      <button class="${owned ? 'card-btn locked' : canAfford ? 'card-btn unlocked' : 'card-btn locked'}" ${owned || !canAfford ? 'disabled' : ''}>
        ${owned ? 'ĐANG TRANG BỊ' : canAfford ? 'MUA NGAY' : `Cần thêm ${item.price - saveData.wallet} xu`}
      </button>
    `;
    const btn = card.querySelector('button');
    if (!owned && canAfford) {
      btn.addEventListener('click', () => {
        saveData.wallet -= item.price;
        saveData.upgrades[item.id] = true;
        persistSave();
        sfx.win();
        refreshUI();
      });
    }
    grid.appendChild(card);
  });
}

function renderLeaderboard() {
  const grid = document.getElementById('leaderboard-grid');
  grid.innerHTML = '';
  [1, 2, 3].forEach((id) => {
    const cfg = LEVELS[id];
    const rec = saveData.bestRecords[id];
    const card = document.createElement('div');
    card.className = 'lb-card';
    card.innerHTML = `
      <h3>Màn 0${id} · ${cfg.name}</h3>
      <div class="lb-stat"><span>Mục tiêu</span><strong>${cfg.targetCoins} xu</strong></div>
      <div class="lb-stat"><span>Xu nhiều nhất</span><strong>${rec ? `${rec.coins} xu` : 'Chưa có'}</strong></div>
      <div class="lb-stat"><span>Thời gian nhanh nhất</span><strong>${rec ? formatTime(rec.bestTime) : '--:--'}</strong></div>
      <div class="lb-stat"><span>Trạng thái</span><strong>${rec ? 'Đã hoàn thành ✓' : (saveData.unlockAll || saveData.unlockedLevel >= id ? 'Đã mở khóa' : 'Chưa mở')}</strong></div>
    `;
    grid.appendChild(card);
  });
}

// ==================== GAMEPLAY ENGINE ====================
class IslandGame {
  constructor(levelId) {
    this.levelId = levelId;
    this.cfg = LEVELS[levelId];
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.popupsEl = document.getElementById('floating-popups');

    // Game state
    this.coinsCollected = 0;
    this.maxLives = saveData.upgrades.heart ? 4 : 3;
    this.lives = this.maxLives;
    this.timeLeft = this.cfg.timeLimit;
    this.elapsed = 0;
    this.paused = false;
    this.ended = false;
    this.rafId = null;
    this.lastTs = 0;

    // Player in normalized island coords u, v in [-0.88, 0.88]
    this.player = {
      u: -0.35,
      v: 0.35,
      vu: 0,
      vv: 0,
      z: 0,
      vz: 0,
      facingRight: true,
      invuln: 0,
      walkPhase: 0,
    };

    // Input state
    this.keys = {};

    // Entities
    this.coins = [];
    this.obstacles = [];
    this.hazards = [];
    this.particles = [];
    this.decor = this.buildDecor();
    this.snowflakes = Array.from({ length: 18 }, () => ({
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      r: 2 + Math.random() * 2.5,
      speed: 20 + Math.random() * 35,
      drift: Math.random() * Math.PI * 2,
    }));

    this.spawnObstacles();
    this.spawnCoins(10);
    this.setupHUD();
  }

  // Project normalized (u, v, z) -> canvas (x, y)
  iso(u, v, z = 0) {
    const cx = this.canvas.width / 2;
    const cy = this.canvas.height / 2 + 12;
    const scaleX = 225;
    const scaleY = 128;
    const scaleZ = 95;
    return {
      x: cx + (u - v) * scaleX,
      y: cy + (u + v) * scaleY - z * scaleZ,
    };
  }

  buildDecor() {
    // Perimeter trees/cacti/pines outside main play inner zone
    if (this.levelId === 1) {
      return [
        { u: -0.82, v: -0.55, img: canvasSprites.tree1, w: 64, h: 98 },
        { u: 0.72, v: -0.72, img: canvasSprites.tree2, w: 68, h: 102 },
        { u: -0.78, v: 0.65, img: canvasSprites.tree1, w: 56, h: 86 },
      ];
    }
    if (this.levelId === 2) {
      return [
        { u: -0.84, v: -0.45, img: canvasSprites.cactus, w: 48, h: 78 },
        { u: 0.78, v: -0.68, img: canvasSprites.cactus, w: 46, h: 74 },
        { u: 0.8, v: 0.55, img: canvasSprites.cactus, w: 50, h: 80 },
      ];
    }
    return [
      { u: -0.8, v: -0.65, img: canvasSprites.pine, w: 58, h: 92 },
      { u: 0.76, v: -0.7, img: canvasSprites.pine, w: 56, h: 88 },
      { u: -0.76, v: 0.68, img: canvasSprites.pine, w: 54, h: 84 },
    ];
  }

  spawnObstacles() {
    const count = this.cfg.obstacleCount;
    for (let i = 0; i < count; i++) {
      let u, v, ok;
      let tries = 0;
      do {
        u = (Math.random() * 1.3 - 0.65);
        v = (Math.random() * 1.3 - 0.65);
        const distPlayer = Math.hypot(u - this.player.u, v - this.player.v);
        const distOthers = this.obstacles.every((o) => Math.hypot(u - o.u, v - o.v) > 0.34);
        ok = distPlayer > 0.42 && distOthers;
        tries++;
      } while (!ok && tries < 30);

      this.obstacles.push({
        u,
        v,
        radius: 0.13,
        kind: this.levelId === 1 ? 'rock' : this.levelId === 2 ? 'pillar' : 'crystal',
      });
    }

    // Moving hazards
    for (let i = 0; i < this.cfg.movingHazards; i++) {
      const axis = i % 2 === 0 ? 'u' : 'v';
      const fixed = (i - 0.5) * 0.45;
      this.hazards.push({
        u: axis === 'u' ? -0.7 : fixed,
        v: axis === 'v' ? -0.7 : fixed,
        axis,
        dir: i % 2 === 0 ? 1 : -1,
        speed: 0.42 + this.levelId * 0.12,
        radius: 0.11,
      });
    }
  }

  spawnCoins(targetCount) {
    while (this.coins.length < targetCount) {
      let u, v, ok;
      let tries = 0;
      do {
        u = Math.random() * 1.5 - 0.75;
        v = Math.random() * 1.5 - 0.75;
        const clearObs = this.obstacles.every((o) => Math.hypot(u - o.u, v - o.v) > 0.22);
        const clearCoins = this.coins.every((c) => Math.hypot(u - c.u, v - c.v) > 0.18);
        ok = clearObs && clearCoins;
        tries++;
      } while (!ok && tries < 25);

      const isMega = Math.random() < 0.12;
      this.coins.push({
        u,
        v,
        value: isMega ? 3 : 1,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  setupHUD() {
    screens.play.className = `screen screen-play ${this.cfg.themeClass}`;
    document.getElementById('play-level-label').textContent = this.cfg.navLabel;
    document.getElementById('hud-goal-title').textContent = `${this.cfg.targetCoins} xu trong ${this.cfg.timeLimit} giây`;
    document.getElementById('hud-goal-desc').innerHTML = this.cfg.goalDesc;
    document.getElementById('hud-world-name').textContent = `${this.cfg.name} · ${this.cfg.diff}`;
    document.getElementById('hud-tip-text').innerHTML = this.cfg.tip;
    this.popupsEl.innerHTML = '';

    // Adventure steps 01 -> 02 -> 03
    document.querySelectorAll('#hud-world-steps .step-box').forEach((el) => {
      const s = Number(el.dataset.step);
      el.classList.remove('active', 'done');
      if (s === this.levelId) {
        el.classList.add('active');
        el.textContent = `0${s}`;
      } else if (s < this.levelId || saveData.bestRecords[s]) {
        el.classList.add('done');
        el.textContent = '✓';
      } else {
        el.textContent = `0${s}`;
      }
    });

    // Buffs indicator
    const buffs = SHOP_ITEMS.filter((it) => saveData.upgrades[it.id]);
    const buffsBox = document.getElementById('hud-buffs');
    const buffsList = document.getElementById('hud-buffs-list');
    if (buffs.length > 0) {
      buffsBox.classList.remove('hidden');
      buffsList.innerHTML = buffs.map((b) => `<span>${b.buffLabel}</span>`).join('');
    } else {
      buffsBox.classList.add('hidden');
    }

    this.updateHUD();
  }

  updateHUD() {
    document.getElementById('hud-coin-text').textContent = `${this.coinsCollected} / ${this.cfg.targetCoins}`;
    const pct = Math.min(100, (this.coinsCollected / this.cfg.targetCoins) * 100);
    document.getElementById('hud-coin-bar').style.width = `${pct}%`;

    const heartsEl = document.getElementById('hud-hearts');
    heartsEl.innerHTML = '';
    for (let i = 0; i < this.maxLives; i++) {
      const img = document.createElement('img');
      img.src = canvasSprites.heartSvg;
      img.alt = 'Tim';
      img.className = `heart-icon ${i >= this.lives ? 'lost' : ''}`;
      heartsEl.appendChild(img);
    }
    document.getElementById('hud-hearts-text').textContent = `${this.lives} / ${this.maxLives}`;

    const timerEl = document.getElementById('hud-timer');
    timerEl.textContent = formatTime(Math.ceil(this.timeLeft));
    document.getElementById('timer-pill').classList.toggle('urgent', this.timeLeft <= 15);

    const remaining = Math.max(0, this.cfg.targetCoins - this.coinsCollected);
    document.getElementById('hud-remaining').textContent = this.cfg.remainingText(remaining);
  }

  addPopup(u, v, z, text, isDamage = false) {
    const pos = this.iso(u, v, z + 0.5);
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = rect.width / this.canvas.width;
    const scaleY = rect.height / this.canvas.height;
    const el = document.createElement('div');
    el.className = `coin-popup ${isDamage ? 'damage' : ''}`;
    el.textContent = text;
    el.style.left = `${pos.x * scaleX}px`;
    el.style.top = `${pos.y * scaleY}px`;
    this.popupsEl.appendChild(el);
    setTimeout(() => el.remove(), 850);
  }

  start() {
    this.lastTs = performance.now();
    const loop = (ts) => {
      const dt = Math.min(0.05, (ts - this.lastTs) / 1000);
      this.lastTs = ts;
      if (!this.paused && !this.ended) {
        this.update(dt);
      }
      this.render(ts / 1000);
      if (!this.ended) {
        this.rafId = requestAnimationFrame(loop);
      }
    };
    this.rafId = requestAnimationFrame(loop);
  }

  stop() {
    this.ended = true;
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }

  togglePause() {
    if (this.ended) return;
    this.paused = !this.paused;
    document.getElementById('modal-pause').classList.toggle('hidden', !this.paused);
    sfx.click();
  }

  jump() {
    if (this.paused || this.ended) return;
    if (this.player.z <= 0.01) {
      this.player.vz = 2.65;
      sfx.jump();
    }
  }

  update(dt) {
    // Timer
    this.timeLeft -= dt;
    this.elapsed += dt;
    if (this.timeLeft <= 0) {
      this.timeLeft = 0;
      this.updateHUD();
      this.triggerGameOver('HẾT GIỜ RỒI!', 'Cáo nhỏ chưa kịp gom đủ số xu trước khi hết thời gian.');
      return;
    }

    // Screen-space input -> isometric (u, v) direction
    let sx = 0;
    let sy = 0;
    if (this.keys['KeyW'] || this.keys['ArrowUp']) sy -= 1;
    if (this.keys['KeyS'] || this.keys['ArrowDown']) sy += 1;
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) sx -= 1;
    if (this.keys['KeyD'] || this.keys['ArrowRight']) sx += 1;

    if (sx !== 0 || sy !== 0) {
      const len = Math.hypot(sx, sy);
      sx /= len;
      sy /= len;
      if (sx > 0.1) this.player.facingRight = true;
      if (sx < -0.1) this.player.facingRight = false;
    }

    // Convert screen vector (sx, sy) to isometric (du, dv)
    // Since x ~ (u - v), y ~ (u + v) => u ~ (x + y), v ~ (y - x)
    const du = (sx * 0.7 + sy * 1.15);
    const dv = (sy * 1.15 - sx * 0.7);
    const dLen = Math.hypot(du, dv) || 1;
    const nu = (sx === 0 && sy === 0) ? 0 : du / dLen;
    const nv = (sx === 0 && sy === 0) ? 0 : dv / dLen;

    const speedBoost = saveData.upgrades.speed ? 1.18 : 1.0;
    const accel = this.cfg.accel * speedBoost;
    this.player.vu += nu * accel * dt * 6;
    this.player.vv += nv * accel * dt * 6;

    // Friction
    const f = Math.pow(this.cfg.friction, dt * 60);
    this.player.vu *= f;
    this.player.vv *= f;

    // Clamp max speed
    const curSpeed = Math.hypot(this.player.vu, this.player.vv);
    const maxS = this.cfg.maxSpeed * speedBoost;
    if (curSpeed > maxS) {
      this.player.vu = (this.player.vu / curSpeed) * maxS;
      this.player.vv = (this.player.vv / curSpeed) * maxS;
    }

    this.player.u += this.player.vu * dt;
    this.player.v += this.player.vv * dt;

    // Clamp inside island bounds
    const bound = 0.85;
    if (this.player.u < -bound) { this.player.u = -bound; this.player.vu *= -0.3; }
    if (this.player.u > bound) { this.player.u = bound; this.player.vu *= -0.3; }
    if (this.player.v < -bound) { this.player.v = -bound; this.player.vv *= -0.3; }
    if (this.player.v > bound) { this.player.v = bound; this.player.vv *= -0.3; }

    // Jump physics
    if (this.player.z > 0 || this.player.vz > 0) {
      this.player.z += this.player.vz * dt;
      this.player.vz -= 7.8 * dt;
      if (this.player.z <= 0) {
        this.player.z = 0;
        this.player.vz = 0;
      }
    }

    if (curSpeed > 0.12 && this.player.z === 0) {
      this.player.walkPhase += dt * 12;
      if (Math.random() < 0.35) {
        this.particles.push({
          u: this.player.u,
          v: this.player.v,
          z: 0.02,
          life: 0.45,
          maxLife: 0.45,
          color: this.levelId === 3 ? '#ffffff' : 'rgba(255,248,230,0.85)',
        });
      }
    }

    if (this.player.invuln > 0) {
      this.player.invuln -= dt;
    }

    // Update particles
    this.particles = this.particles.filter((p) => {
      p.life -= dt;
      p.z += dt * 0.25;
      return p.life > 0;
    });

    // Update moving hazards
    this.hazards.forEach((h) => {
      h[h.axis] += h.dir * h.speed * dt;
      if (h[h.axis] > 0.78) { h[h.axis] = 0.78; h.dir = -1; }
      if (h[h.axis] < -0.78) { h[h.axis] = -0.78; h.dir = 1; }
    });

    // Coin collection (with optional magnet)
    const magnetRange = saveData.upgrades.magnet ? 0.35 : 0.17;
    for (let i = this.coins.length - 1; i >= 0; i--) {
      const c = this.coins[i];
      const dist = Math.hypot(c.u - this.player.u, c.v - this.player.v);
      if (saveData.upgrades.magnet && dist < magnetRange && dist > 0.05) {
        c.u += ((this.player.u - c.u) / dist) * dt * 1.4;
        c.v += ((this.player.v - c.v) / dist) * dt * 1.4;
      }
      if (dist < 0.16 && this.player.z < 0.55) {
        this.coinsCollected = Math.min(this.cfg.targetCoins, this.coinsCollected + c.value);
        sfx.coin(c.value > 1);
        this.addPopup(c.u, c.v, 0.2, `+${c.value} XU`);
        this.coins.splice(i, 1);
        this.spawnCoins(10);

        if (this.coinsCollected >= this.cfg.targetCoins) {
          this.updateHUD();
          this.triggerWin();
          return;
        }
      }
    }

    // Obstacle & Hazard collisions (jump over when z > 0.26!)
    if (this.player.invuln <= 0 && this.player.z < 0.26) {
      const hitStatic = this.obstacles.some(
        (o) => Math.hypot(o.u - this.player.u, o.v - this.player.v) < o.radius + 0.08
      );
      const hitHazard = this.hazards.some(
        (h) => Math.hypot(h.u - this.player.u, h.v - this.player.v) < h.radius + 0.08
      );
      if (hitStatic || hitHazard) {
        this.lives -= 1;
        this.player.invuln = 1.4;
        this.player.vz = 1.4; // knockback hop
        sfx.hit();
        this.addPopup(this.player.u, this.player.v, 0.35, '-1 ♥', true);
        if (this.lives <= 0) {
          this.updateHUD();
          this.triggerGameOver('HẾT LƯỢT SỐNG!', 'Cáo nhỏ đã va phải chướng ngại vật quá nhiều lần.');
          return;
        }
      }
    }

    this.updateHUD();
  }

  triggerWin() {
    this.stop();
    sfx.win();

    const earned = this.coinsCollected;
    saveData.wallet += earned;
    if (this.levelId >= saveData.unlockedLevel && this.levelId < 3) {
      saveData.unlockedLevel = this.levelId + 1;
    }

    const prev = saveData.bestRecords[this.levelId];
    const isNewRecord = !prev || this.elapsed < prev.bestTime;
    if (!prev) {
      saveData.bestRecords[this.levelId] = { coins: earned, bestTime: this.elapsed };
    } else {
      saveData.bestRecords[this.levelId] = {
        coins: Math.max(prev.coins, earned),
        bestTime: Math.min(prev.bestTime, this.elapsed),
      };
    }
    persistSave();

    // Populate Complete screen
    document.getElementById('complete-title').textContent = this.cfg.completeTitle;
    document.getElementById('complete-subtitle').textContent = `Màn 0${this.levelId} · ${this.cfg.name}  /  Hoàn thành`;
    document.getElementById('complete-record-badge').classList.toggle('hidden', !isNewRecord);
    document.getElementById('complete-reward').textContent = `+${earned} xu`;
    document.getElementById('comp-coins').textContent = `${earned} / ${this.cfg.targetCoins}`;
    document.getElementById('comp-time').textContent = formatTime(this.elapsed);
    document.getElementById('comp-wallet').textContent = formatNum(saveData.wallet);
    document.getElementById('comp-unlock-label').textContent = this.cfg.nextUnlockTitle;
    document.getElementById('comp-unlock-desc').textContent = this.cfg.nextUnlockDesc;

    const nextBtn = document.getElementById('btn-next-level');
    nextBtn.textContent = this.cfg.nextBtnText;
    nextBtn.dataset.nextLevel = this.levelId < 3 ? String(this.levelId + 1) : '1';

    showScreen('complete');
  }

  triggerGameOver(title, desc) {
    this.stop();
    sfx.lose();
    document.getElementById('gameover-title').textContent = title;
    document.getElementById('gameover-desc').textContent = desc;
    document.getElementById('go-coins').textContent = `${this.coinsCollected} / ${this.cfg.targetCoins}`;
    document.getElementById('modal-gameover').classList.remove('hidden');
  }

  render(t) {
    const ctx = this.ctx;
    const W = this.canvas.width;
    const H = this.canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Floating background clouds or snowflakes
    if (this.levelId === 3) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      this.snowflakes.forEach((s) => {
        s.y = (s.y + s.speed * 0.016) % H;
        const sx = s.x + Math.sin(t * 1.5 + s.drift) * 12;
        ctx.beginPath();
        ctx.arc(sx, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });
    } else {
      ctx.fillStyle = 'rgba(255, 252, 238, 0.65)';
      [[110 + Math.sin(t * 0.4) * 14, 95, 36], [640 - Math.sin(t * 0.3) * 12, 115, 32]].forEach(([cx, cy, r]) => {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.arc(cx + r * 0.7, cy + 4, r * 0.75, 0, Math.PI * 2);
        ctx.arc(cx - r * 0.7, cy + 6, r * 0.65, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // Draw Isometric Island Base
    this.drawIsland(ctx);

    // Collect depth-sorted drawables (u + v)
    const drawList = [];

    // Decor
    this.decor.forEach((d) => {
      drawList.push({
        depth: d.u + d.v,
        draw: () => {
          const p = this.iso(d.u, d.v, 0);
          if (d.img.complete) {
            ctx.drawImage(d.img, p.x - d.w / 2, p.y - d.h + 10, d.w, d.h);
          }
        },
      });
    });

    // Obstacles
    this.obstacles.forEach((o) => {
      drawList.push({
        depth: o.u + o.v,
        draw: () => this.drawObstacle(ctx, o),
      });
    });

    // Moving hazards
    this.hazards.forEach((h) => {
      drawList.push({
        depth: h.u + h.v,
        draw: () => this.drawHazard(ctx, h, t),
      });
    });

    // Coins
    this.coins.forEach((c) => {
      drawList.push({
        depth: c.u + c.v,
        draw: () => this.drawCoin(ctx, c, t),
      });
    });

    // Particles
    this.particles.forEach((pt) => {
      drawList.push({
        depth: pt.u + pt.v - 0.05,
        draw: () => {
          const pos = this.iso(pt.u, pt.v, pt.z);
          ctx.globalAlpha = pt.life / pt.maxLife;
          ctx.fillStyle = pt.color;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        },
      });
    });

    // Player
    drawList.push({
      depth: this.player.u + this.player.v,
      draw: () => this.drawPlayer(ctx),
    });

    drawList.sort((a, b) => a.depth - b.depth);
    drawList.forEach((item) => item.draw());
  }

  drawIsland(ctx) {
    const c = this.cfg.colors;
    const pTop = this.iso(-1, -1, 0);
    const pRight = this.iso(1, -1, 0);
    const pBot = this.iso(1, 1, 0);
    const pLeft = this.iso(-1, 1, 0);
    const depth = 52;

    // Drop shadow
    ctx.fillStyle = 'rgba(23, 63, 55, 0.12)';
    ctx.beginPath();
    ctx.moveTo(pTop.x, pTop.y + depth + 16);
    ctx.lineTo(pRight.x + 8, pRight.y + depth + 16);
    ctx.lineTo(pBot.x, pBot.y + depth + 24);
    ctx.lineTo(pLeft.x - 8, pLeft.y + depth + 16);
    ctx.closePath();
    ctx.fill();

    // Left cliff wall
    ctx.fillStyle = c.wallLeft;
    ctx.strokeStyle = c.stroke;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(pLeft.x, pLeft.y);
    ctx.lineTo(pBot.x, pBot.y);
    ctx.lineTo(pBot.x, pBot.y + depth);
    ctx.lineTo(pLeft.x, pLeft.y + depth);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Right cliff wall
    ctx.fillStyle = c.wallRight;
    ctx.beginPath();
    ctx.moveTo(pBot.x, pBot.y);
    ctx.lineTo(pRight.x, pRight.y);
    ctx.lineTo(pRight.x, pRight.y + depth);
    ctx.lineTo(pBot.x, pBot.y + depth);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Top face
    ctx.fillStyle = c.top;
    ctx.beginPath();
    ctx.moveTo(pTop.x, pTop.y);
    ctx.lineTo(pRight.x, pRight.y);
    ctx.lineTo(pBot.x, pBot.y);
    ctx.lineTo(pLeft.x, pLeft.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Winding loop path on island
    ctx.strokeStyle = c.trail;
    ctx.lineWidth = 28;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const pathPts = [
      this.iso(-0.55, 0.55, 0),
      this.iso(-0.55, -0.45, 0),
      this.iso(0.45, -0.45, 0),
      this.iso(0.45, 0.55, 0),
      this.iso(-0.55, 0.55, 0),
    ];
    ctx.beginPath();
    ctx.moveTo(pathPts[0].x, pathPts[0].y);
    for (let i = 1; i < pathPts.length; i++) {
      ctx.lineTo(pathPts[i].x, pathPts[i].y);
    }
    ctx.stroke();
  }

  drawObstacle(ctx, o) {
    const p = this.iso(o.u, o.v, 0);
    ctx.fillStyle = 'rgba(23, 63, 55, 0.2)';
    ctx.beginPath();
    ctx.ellipse(p.x, p.y + 4, 20, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    if (o.kind === 'pillar' && canvasSprites.pillar.complete) {
      ctx.drawImage(canvasSprites.pillar, p.x - 22, p.y - 54, 44, 60);
    } else if (o.kind === 'crystal' && canvasSprites.iceCrystal.complete) {
      ctx.drawImage(canvasSprites.iceCrystal, p.x - 22, p.y - 52, 44, 58);
    } else if (canvasSprites.desertRock.complete && this.levelId === 1) {
      // Stylized mossy forest boulder
      ctx.fillStyle = '#587166';
      ctx.strokeStyle = '#173f37';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y - 10, 20, 15, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#73b87e';
      ctx.beginPath();
      ctx.ellipse(p.x - 4, p.y - 17, 11, 6, -0.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawHazard(ctx, h, t) {
    const p = this.iso(h.u, h.v, 0);
    ctx.fillStyle = 'rgba(23, 63, 55, 0.2)';
    ctx.beginPath();
    ctx.ellipse(p.x, p.y + 4, 16, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(p.x, p.y - 14);
    ctx.rotate(t * 5 * h.dir);
    ctx.fillStyle = this.levelId === 3 ? '#9cd3e8' : this.levelId === 2 ? '#d96b38' : '#7a5132';
    ctx.strokeStyle = '#173f37';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-8, -4);
    ctx.lineTo(8, 4);
    ctx.moveTo(-4, 8);
    ctx.lineTo(4, -8);
    ctx.stroke();
    ctx.restore();
  }

  drawCoin(ctx, c, t) {
    const bob = Math.sin(t * 4.5 + c.phase) * 0.06;
    const pShadow = this.iso(c.u, c.v, 0);
    const pCoin = this.iso(c.u, c.v, 0.14 + bob);

    ctx.fillStyle = 'rgba(23, 63, 55, 0.16)';
    ctx.beginPath();
    ctx.ellipse(pShadow.x, pShadow.y + 2, 10, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    const size = c.value > 1 ? 34 : 26;
    if (canvasSprites.coin.complete) {
      ctx.drawImage(canvasSprites.coin, pCoin.x - size / 2, pCoin.y - size / 2, size, size);
    } else {
      ctx.fillStyle = '#ffcd51';
      ctx.beginPath();
      ctx.arc(pCoin.x, pCoin.y, size / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawPlayer(ctx) {
    const pShadow = this.iso(this.player.u, this.player.v, 0);
    const pFox = this.iso(this.player.u, this.player.v, this.player.z);

    // Shadow shrinks when jumping
    const shadowScale = Math.max(0.45, 1 - this.player.z * 0.7);
    ctx.fillStyle = 'rgba(23, 63, 55, 0.25)';
    ctx.beginPath();
    ctx.ellipse(pShadow.x, pShadow.y + 4, 24 * shadowScale, 11 * shadowScale, 0, 0, Math.PI * 2);
    ctx.fill();

    // Blink during invulnerability
    if (this.player.invuln > 0 && Math.floor(this.player.invuln * 14) % 2 === 0) {
      ctx.globalAlpha = 0.45;
    }

    const bob = this.player.z === 0 ? Math.abs(Math.sin(this.player.walkPhase)) * 5 : 0;
    const sprite = this.levelId === 3 ? canvasSprites.foxIce : canvasSprites.foxNormal;
    const w = 78;
    const h = 78;

    ctx.save();
    ctx.translate(pFox.x, pFox.y - bob);
    if (!this.player.facingRight) {
      ctx.scale(-1, 1);
    }
    if (sprite.complete) {
      ctx.drawImage(sprite, -w / 2, -h + 14, w, h);
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
}

function startLevel(levelId) {
  const maxUnlocked = saveData.unlockAll ? 3 : saveData.unlockedLevel;
  if (levelId > maxUnlocked) return;

  if (activeGame) activeGame.stop();
  document.getElementById('modal-pause').classList.add('hidden');
  document.getElementById('modal-gameover').classList.add('hidden');

  showScreen('play');
  activeGame = new IslandGame(levelId);
  activeGame.start();
}

// ==================== EVENT LISTENERS ====================
document.querySelectorAll('[data-nav]').forEach((el) => {
  el.addEventListener('click', () => {
    sfx.click();
    showScreen(el.dataset.nav);
  });
});

document.getElementById('btn-play-now').addEventListener('click', () => {
  sfx.click();
  const target = saveData.unlockAll ? 1 : Math.min(3, saveData.unlockedLevel);
  startLevel(target);
});

document.getElementById('btn-go-select').addEventListener('click', () => {
  sfx.click();
  showScreen('select');
});

document.querySelectorAll('[data-play-level]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const lvl = Number(btn.dataset.playLevel);
    sfx.click();
    startLevel(lvl);
  });
});

document.getElementById('btn-back-select').addEventListener('click', () => {
  sfx.click();
  showScreen('select');
});

document.getElementById('btn-pause').addEventListener('click', () => {
  if (activeGame) activeGame.togglePause();
});

document.getElementById('btn-resume').addEventListener('click', () => {
  if (activeGame) activeGame.togglePause();
});

document.getElementById('btn-pause-restart').addEventListener('click', () => {
  if (activeGame) startLevel(activeGame.levelId);
});

document.getElementById('btn-pause-select').addEventListener('click', () => {
  document.getElementById('modal-pause').classList.add('hidden');
  showScreen('select');
});

document.getElementById('btn-go-retry').addEventListener('click', () => {
  if (activeGame) startLevel(activeGame.levelId);
});

document.getElementById('btn-go-select').addEventListener('click', () => {
  document.getElementById('modal-gameover').classList.add('hidden');
  showScreen('select');
});

document.getElementById('btn-next-level').addEventListener('click', (e) => {
  sfx.click();
  startLevel(Number(e.currentTarget.dataset.nextLevel || 1));
});

document.getElementById('btn-replay').addEventListener('click', () => {
  sfx.click();
  if (activeGame) startLevel(activeGame.levelId);
});

document.getElementById('btn-to-select').addEventListener('click', () => {
  sfx.click();
  showScreen('select');
});

// Settings modal
const modalSettings = document.getElementById('modal-settings');
const toggleSfx = document.getElementById('toggle-sfx');
const toggleUnlockAll = document.getElementById('toggle-unlock-all');

document.getElementById('btn-settings').addEventListener('click', () => {
  sfx.click();
  toggleSfx.checked = saveData.sfx;
  toggleUnlockAll.checked = saveData.unlockAll;
  modalSettings.classList.remove('hidden');
});

document.getElementById('btn-close-settings').addEventListener('click', () => {
  sfx.click();
  modalSettings.classList.add('hidden');
});

toggleSfx.addEventListener('change', () => {
  saveData.sfx = toggleSfx.checked;
  persistSave();
});

toggleUnlockAll.addEventListener('change', () => {
  saveData.unlockAll = toggleUnlockAll.checked;
  persistSave();
  refreshUI();
});

document.getElementById('btn-reset-save').addEventListener('click', () => {
  saveData = {
    wallet: 0,
    unlockedLevel: 1,
    unlockAll: false,
    sfx: true,
    bestRecords: {},
    upgrades: { speed: false, magnet: false, heart: false },
  };
  persistSave();
  toggleSfx.checked = true;
  toggleUnlockAll.checked = false;
  refreshUI();
  modalSettings.classList.add('hidden');
});

// Fullscreen toggle
document.getElementById('btn-fullscreen').addEventListener('click', () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen?.();
  } else {
    document.exitFullscreen?.();
  }
});

// Keyboard handling + footer keycap animation
window.addEventListener('keydown', (e) => {
  const keycap = document.querySelector(`.keycap[data-key="${e.code}"]`);
  if (keycap) keycap.classList.add('pressed');

  if (currentScreen === 'play' && activeGame) {
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
      e.preventDefault();
    }
    activeGame.keys[e.code] = true;
    if (e.code === 'Space') activeGame.jump();
    if (e.code === 'Escape') activeGame.togglePause();
  }
});

window.addEventListener('keyup', (e) => {
  const keycap = document.querySelector(`.keycap[data-key="${e.code}"]`);
  if (keycap) keycap.classList.remove('pressed');

  if (activeGame) {
    activeGame.keys[e.code] = false;
  }
});

// Initialize
refreshUI();
