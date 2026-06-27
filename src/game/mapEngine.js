// ═══════════════════════════════════════════════════════════════
//  DE MOL — Boedapest Kaartengine
//  Top-down canvas kaart geïnspireerd op GBC RPG stijl
//  Layout: Donau door het midden, Kettingbrug, echt Boedapest
// ═══════════════════════════════════════════════════════════════

const TILE   = 32;
const COLS   = 34;
const ROWS   = 22;

// Donau: kolommen 14-17 (4 breed)
const RIVER_L = 14;
const RIVER_R = 17;

// ── Kleurpalet ──────────────────────────────────────────────────
const C = {
  // Gras
  grass:        '#52a84a',
  grassDark:    '#397a34',
  grassLight:   '#72c85a',
  grassTip:     '#8de070',

  // Kobbelstenen pad
  cobble:       '#b0a890',
  cobbleDark:   '#80786a',
  cobbleSplit:  '#6a6258',
  cobbleLight:  '#d0c8b4',

  // Donau
  water:        '#2460c8',
  waterDeep:    '#163898',
  waterLight:   '#4898e8',
  waterFoam:    '#80c0f8',

  // Algemeen
  black:        '#000000',
  white:        '#f8f8f0',
  outline:      '#101010',
  shadow:       'rgba(0,0,0,0.25)',

  // Café De Mol
  cafeWall:     '#c8a060',
  cafeDark:     '#8a6030',
  cafeRoof:     '#5a2810',
  cafeAwning:   '#c03018',
  cafeSign:     '#3a1808',
  cafeWindow:   '#a0d8f0',
  cafeWood:     '#6a3818',

  // Parlement Budapest
  parlWall:     '#e8dfc4',
  parlDark:     '#c0b090',
  parlDome:     '#2d7050',
  parlDomeShine:'#4a9868',
  parlAccent:   '#b89830',
  parlWindow:   '#607898',
  parlRoof:     '#404040',
  parlSpire:    '#303030',

  // Moltest-gebouw
  testWall:     '#c8ccd8',
  testDark:     '#9098a8',
  testRoof:     '#2c3a50',
  testWindow:   '#6080b0',
  testAccent:   '#4060a0',

  // Opdracht-gebouw
  opdrWall:     '#a07848',
  opdrDark:     '#705030',
  opdrRoof:     '#402010',
  opdrWindow:   '#80c0a0',
  opdrAccent:   '#c08840',

  // Kettingbrug
  bridgeRoad:   '#989080',
  bridgeDark:   '#706858',
  bridgeStone:  '#b0a890',
  bridgeCable:  '#404840',
  bridgePylon:  '#808878',
  bridgeLion:   '#b89840',

  // Natuur
  treeDark:     '#1a5020',
  treeMid:      '#2a7a30',
  treeLight:    '#3aaa40',
  treeTip:      '#50c450',
  treeTrunk:    '#6a4020',
  treeShadow:   '#124018',

  // Bush
  bushGreen:    '#2a7030',
  bushLight:    '#3a9040',

  // Bloemen
  flowerRed:    '#e03020',
  flowerYellow: '#e8c820',
  flowerWhite:  '#f0f0e0',
  flowerPink:   '#e060a0',

  // Lantaarn
  lampPost:     '#303828',
  lampGlow:     '#f0e080',
  lampHalo:     'rgba(240,220,100,0.18)',

  // Vlag
  flagRed:      '#c8302a',
  flagWhite:    '#f0f0e8',
  flagGreen:    '#2a7030',

  // UI paneel (GBC stijl)
  panelBg:      '#f0eedc',
  panelBorder:  '#000000',
  panelInner:   '#b0aa90',
};

// ── Gebouwzones (interactie + collision) ────────────────────────
const buildingZones = [
  {
    id: 'cafe',
    label: 'CAFÉ DE MOL',
    signIcon: '☕',
    x: 1, y: 1, w: 10, h: 7,
    doorX: 6, doorY: 8,
    lockedUntilAssignment: true
  },
  {
    id: 'assignment',
    label: 'OPDRACHT',
    signIcon: '!',
    x: 1, y: 13, w: 10, h: 7,
    doorX: 6, doorY: 12,
    locked: false
  },
  {
    id: 'test',
    label: 'MOL TEST',
    signIcon: '?',
    x: 19, y: 10, w: 11, h: 10,
    doorX: 24, doorY: 9,
    lockedUntilAssignment: true
  },
  {
    id: 'parlement',
    label: 'PARLEMENT',
    x: 18, y: 0, w: 15, h: 10,
    decorativeOnly: true
  },
  {
    id: 'hotel',
    label: 'HOTEL',
    x: 19, y: 0, w: 3, h: 3,
    decorativeOnly: true   // deel van parlement
  }
];

// ── NPC-plekken op paden ────────────────────────────────────────
const npcSpots = [
  { x:  4, y: 10 },
  { x:  8, y: 10 },
  { x: 11, y: 10 },
  { x:  3, y: 15 },
  { x:  9, y: 15 },
  { x: 20, y: 10 },  // rechts van de brug — maar niet in test
  { x: 22, y: 15 },
  { x: 26, y: 15 },
  { x: 30, y: 12 }
];

// ── Decoratie-posities ──────────────────────────────────────────
const decor = {
  trees: [
    // Links-boven
    [0,0],[0,1],[0,2],[1,0],[2,0],
    [11,0],[12,0],[13,0],[12,1],[13,1],
    // Links-onder
    [0,13],[0,14],[0,15],[0,16],[0,17],[0,18],[0,19],[0,20],[0,21],
    [1,20],[2,21],[1,21],[2,20],
    [11,20],[12,19],[12,20],[13,19],[13,20],[13,21],
    // Rechts-boven (rond parlement)
    [33,0],[33,1],[33,2],[33,3],[32,0],[32,1],
    // Rechts-onder
    [18,20],[19,21],[20,20],[30,20],[31,19],[32,20],[33,19],[33,20],[33,21],
    [18,21],[33,18],[33,17],
  ],
  bushes: [
    [3,8],[10,8],[3,12],[10,12],
    [19,9],[30,11],[30,14],
  ],
  lamps: [
    [6,9],[6,11],[20,10],[28,10],
    [12,9],[12,11],
  ],
  flowers: [
    [2,9],[2,11],[4,9],[8,9],[8,11],
    [20,15],[22,20],[28,20],
  ],
};

// ── Hulpfuncties ────────────────────────────────────────────────
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

function isInsideRect(x, y, r) {
  return x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h;
}

function isRiverTile(x, y) {
  return x >= RIVER_L && x <= RIVER_R;
}

function isBridgeTile(x, y) {
  return (y === 10 || y === 11) && x >= RIVER_L - 2 && x <= RIVER_R + 2;
}

function isPathTile(x, y) {
  if (isRiverTile(x, y)) return false;
  // Horizontale hoofdroute (brug-niveau)
  if (y === 10 && x >= 0 && x <= COLS - 1) return true;
  if (y === 11 && x >= 0 && x <= COLS - 1) return true;
  // Verticale paden links
  if (x >= 5 && x <= 7 && y >= 8 && y <= 12) return true;
  // Pad rond café (zuidkant)
  if (y === 8 && x >= 1 && x <= 13) return true;
  // Pad rond opdracht (noordkant)
  if (y === 12 && x >= 1 && x <= 13) return true;
  // Verticale paden rechts
  if (x >= 22 && x <= 25 && y >= 9 && y <= 20) return true;
  // Pad rond test (noordkant)
  if (y === 9 && x >= 18 && x <= 33) return true;
  return false;
}

// ── Tekst (pixel-stijl) ─────────────────────────────────────────
function txt(ctx, text, x, y, size = 12, color = C.white, align = 'center') {
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = `700 ${size}px monospace`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y);
  ctx.restore();
}

// ── GBC paneel (wit, dikke zwarte rand) ─────────────────────────
function gbcPanel(ctx, x, y, w, h) {
  ctx.fillStyle = C.panelBg;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = C.panelBorder;
  ctx.fillRect(x, y, w, 3);
  ctx.fillRect(x, y + h - 3, w, 3);
  ctx.fillRect(x, y, 3, h);
  ctx.fillRect(x + w - 3, y, 3, h);
  ctx.fillStyle = C.panelInner;
  ctx.fillRect(x + 5, y + 5, w - 10, 1);
  ctx.fillRect(x + 5, y + h - 6, w - 10, 1);
  ctx.fillRect(x + 5, y + 5, 1, h - 10);
  ctx.fillRect(x + w - 6, y + 5, 1, h - 10);
}

// ═══════════════════════════════════════════════════════════════
//  GRONDTEGELS
// ═══════════════════════════════════════════════════════════════

function drawGrass(ctx, tx, ty) {
  const x = tx * TILE, y = ty * TILE;
  ctx.fillStyle = C.grass;
  ctx.fillRect(x, y, TILE, TILE);
  const v = (tx * 13 + ty * 29) % 6;
  ctx.fillStyle = C.grassDark;
  if (v === 0) { ctx.fillRect(x+4,  y+5,  2, 4); ctx.fillRect(x+20, y+18, 2, 4); }
  if (v === 1) { ctx.fillRect(x+10, y+8,  2, 4); ctx.fillRect(x+24, y+22, 2, 4); }
  if (v === 2) { ctx.fillRect(x+16, y+12, 2, 3); ctx.fillRect(x+6,  y+24, 2, 3); }
  ctx.fillStyle = C.grassLight;
  if (v === 3) { ctx.fillRect(x+8,  y+16, 3, 2); }
}

function drawCobble(ctx, tx, ty) {
  const x = tx * TILE, y = ty * TILE;
  ctx.fillStyle = C.cobble;
  ctx.fillRect(x, y, TILE, TILE);
  // Donkere voegen in raster
  ctx.fillStyle = C.cobbleSplit;
  ctx.fillRect(x,    y+15, TILE, 2);
  ctx.fillRect(x+15, y,    2,    15);
  ctx.fillRect(x+15, y+17, 2,    15);
  // Licht accent
  ctx.fillStyle = C.cobbleLight;
  const s = (tx * 7 + ty * 11) % 3;
  if (s === 0) ctx.fillRect(x+4,  y+3,  6, 4);
  if (s === 1) ctx.fillRect(x+20, y+3,  7, 4);
  if (s === 2) ctx.fillRect(x+4,  y+19, 6, 4);
}

function drawWater(ctx, tx, ty, t = 0) {
  const x = tx * TILE, y = ty * TILE;
  ctx.fillStyle = C.water;
  ctx.fillRect(x, y, TILE, TILE);
  // Diepe kern
  ctx.fillStyle = C.waterDeep;
  ctx.fillRect(x+4, y+4, TILE-8, TILE-8);
  // Golvende strepen (offset per rij)
  const off = ((ty * 5 + t) % 8);
  ctx.fillStyle = C.waterLight;
  ctx.fillRect(x+2,  y + ((off) % TILE),      TILE-4, 3);
  ctx.fillRect(x+2,  y + ((off + 14) % TILE),  TILE-4, 2);
  ctx.fillStyle = C.waterFoam;
  ctx.fillRect(x+6,  y + ((off + 6) % TILE),   TILE-12, 1);
}

// ═══════════════════════════════════════════════════════════════
//  KETTINGBRUG
// ═══════════════════════════════════════════════════════════════

function drawBridge(ctx) {
  const bx = RIVER_L * TILE - 2 * TILE;   // start x (2 tiles voor de rivier)
  const bw = (RIVER_R - RIVER_L + 5) * TILE; // totale breedte
  const by = 10 * TILE;
  const bh = 2 * TILE;

  // ── Wegdek ─────────────────────────────────────────────────
  ctx.fillStyle = C.bridgeRoad;
  ctx.fillRect(bx, by, bw, bh);

  // Rijstrooklijnen
  ctx.fillStyle = C.bridgeDark;
  ctx.fillRect(bx, by + bh/2 - 1, bw, 2);
  for (let i = 0; i < bw; i += 20) {
    ctx.fillRect(bx + i, by + 2, 12, 3);
    ctx.fillRect(bx + i + 6, by + bh - 5, 12, 3);
  }

  // ── Stenen leuningen ────────────────────────────────────────
  ctx.fillStyle = C.bridgeStone;
  ctx.fillRect(bx, by - 12, bw, 12);        // noord balustrade
  ctx.fillRect(bx, by + bh, bw, 12);        // zuid balustrade
  ctx.fillStyle = C.bridgeDark;
  ctx.fillRect(bx, by - 12, bw, 3);         // donkere rand boven
  ctx.fillRect(bx, by + bh + 9, bw, 3);    // donkere rand onder

  // Balustrade-pijlers
  for (let i = bx + 8; i < bx + bw - 8; i += 16) {
    ctx.fillStyle = C.bridgeStone;
    ctx.fillRect(i, by - 14, 6, 16);
    ctx.fillRect(i, by + bh, 6, 16);
    ctx.fillStyle = C.bridgeDark;
    ctx.fillRect(i, by - 14, 6, 3);
    ctx.fillRect(i, by + bh + 13, 6, 3);
  }

  // ── Pylonen (2 grote torens) ────────────────────────────────
  const pylon1X = (RIVER_L - 1) * TILE + 4;
  const pylon2X = (RIVER_R + 1) * TILE - 20;
  [pylon1X, pylon2X].forEach(px => {
    const pylonH = 5 * TILE;
    const pylonY = by - pylonH + bh;
    const pylonW = 24;

    // Pyloon body
    ctx.fillStyle = C.bridgePylon;
    ctx.fillRect(px, pylonY, pylonW, pylonH + 12);

    // Banden / architectuurdetails
    ctx.fillStyle = C.bridgeDark;
    for (let b = 0; b < pylonH; b += 20) {
      ctx.fillRect(px, pylonY + b, pylonW, 3);
    }

    // Top van pyloon
    ctx.fillStyle = C.bridgeDark;
    ctx.fillRect(px - 4, pylonY, pylonW + 8, 8);
    ctx.fillRect(px + 4, pylonY - 10, pylonW - 8, 12);
    ctx.fillRect(px + 8, pylonY - 20, pylonW - 16, 12);

    // Boog onder brug
    ctx.fillStyle = C.bridgeStone;
    ctx.fillRect(px + 2, by, pylonW - 4, bh);
  });

  // ── Kabels ─────────────────────────────────────────────────
  ctx.strokeStyle = C.bridgeCable;
  ctx.lineWidth = 2;
  const p1Top = { x: pylon1X + 12, y: 10 * TILE - 4 * TILE };
  const p2Top = { x: pylon2X + 12, y: 10 * TILE - 4 * TILE };

  // Hoofd-kabel links
  ctx.beginPath();
  ctx.moveTo(bx, by);
  ctx.quadraticCurveTo(p1Top.x, p1Top.y + 40, p1Top.x, p1Top.y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(bx, by + bh);
  ctx.quadraticCurveTo(p1Top.x, p1Top.y + 40, p1Top.x, p1Top.y);
  ctx.stroke();

  // Hoofd-kabel rechts
  ctx.beginPath();
  ctx.moveTo(bx + bw, by);
  ctx.quadraticCurveTo(p2Top.x, p2Top.y + 40, p2Top.x, p2Top.y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(bx + bw, by + bh);
  ctx.quadraticCurveTo(p2Top.x, p2Top.y + 40, p2Top.x, p2Top.y);
  ctx.stroke();

  // Verbindingskabel tussen pylonen
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(p1Top.x, p1Top.y);
  ctx.lineTo(p2Top.x, p2Top.y);
  ctx.stroke();

  // Hangdraden
  ctx.lineWidth = 1;
  for (let hx = bx; hx <= bx + bw; hx += 18) {
    const progress = (hx - bx) / bw;
    const pylonX = progress < 0.5 ? p1Top.x : p2Top.x;
    const pylonY = p1Top.y;
    const cableY = pylonY + Math.abs(progress - (progress < 0.5 ? 0 : 1)) * 80;
    ctx.beginPath();
    ctx.moveTo(hx, by - 2);
    ctx.lineTo(hx, Math.min(cableY + 8, by - 2));
    ctx.stroke();
  }

  // ── Leeuwbeelden op brugeinden ──────────────────────────────
  [[bx - 12, by - 8], [bx + bw, by - 8],
   [bx - 12, by + bh - 8], [bx + bw, by + bh - 8]].forEach(([lx, ly]) => {
    ctx.fillStyle = C.bridgeLion;
    ctx.fillRect(lx, ly, 14, 14);
    ctx.fillStyle = C.bridgeDark;
    ctx.strokeStyle = C.bridgeDark;
    ctx.lineWidth = 1;
    ctx.strokeRect(lx, ly, 14, 14);
    ctx.fillRect(lx + 3, ly + 2, 6, 4); // hoofd
    ctx.fillRect(lx + 2, ly + 6, 10, 6); // lijf
  });
}

// ═══════════════════════════════════════════════════════════════
//  GEBOUWEN
// ═══════════════════════════════════════════════════════════════

// ── Café De Mol ─────────────────────────────────────────────────
function drawCafe(ctx, locked) {
  const bz = buildingZones.find(b => b.id === 'cafe');
  const x = bz.x * TILE, y = bz.y * TILE;
  const w = bz.w * TILE, h = bz.h * TILE;

  // Schaduw
  ctx.fillStyle = C.shadow;
  ctx.fillRect(x + 8, y + 10, w + 4, h + 4);

  // Hoofdmuur
  ctx.fillStyle = locked ? '#907050' : C.cafeWall;
  ctx.fillRect(x, y + 28, w, h - 28);

  // Donkere onderkant (diepte)
  ctx.fillStyle = C.cafeDark;
  ctx.fillRect(x, y + h - 14, w, 14);

  // Dak (mansardedak)
  ctx.fillStyle = locked ? '#3a1a08' : C.cafeRoof;
  ctx.fillRect(x, y, w, 32);
  ctx.fillStyle = locked ? '#2a1205' : '#7a3818';
  ctx.fillRect(x + 6, y + 4, w - 12, 6); // dakrand lijn
  // Dakpannen
  if (!locked) {
    ctx.fillStyle = '#4a1808';
    for (let rx = x + 4; rx < x + w; rx += 18) {
      ctx.fillRect(rx, y + 8, 12, 20);
    }
    ctx.fillStyle = '#7a3818';
    for (let rx = x + 10; rx < x + w; rx += 18) {
      ctx.fillRect(rx, y + 10, 4, 18);
    }
  }

  // Daklijst
  ctx.fillStyle = C.cafeDark;
  ctx.fillRect(x - 4, y + 28, w + 8, 6);
  ctx.fillStyle = C.cafeWood;
  ctx.fillRect(x - 4, y + 28, w + 8, 3);

  // Luifel
  ctx.fillStyle = locked ? '#803010' : C.cafeAwning;
  ctx.fillRect(x + 8, y + 48, w - 16, 14);
  ctx.fillStyle = locked ? '#601808' : '#a02010';
  for (let rx = x + 8; rx < x + w - 16; rx += 12) {
    ctx.fillRect(rx, y + 48, 6, 14);
  }
  ctx.fillStyle = C.cafeWood;
  ctx.fillRect(x + 6, y + 48, w - 12, 4);

  // Ramen (groot, met details)
  const winColor = locked ? '#222' : C.cafeWindow;
  const winFrame = locked ? '#4a3020' : C.cafeWood;
  [[x+12, y+36], [x+w-52, y+36], [x+12, y+100], [x+w-52, y+100]].forEach(([wx, wy]) => {
    ctx.fillStyle = winFrame;
    ctx.fillRect(wx - 3, wy - 3, 34, 40);
    ctx.fillStyle = winColor;
    ctx.fillRect(wx, wy, 28, 34);
    if (!locked) {
      ctx.fillStyle = '#c8f0ff';
      ctx.fillRect(wx + 2, wy + 2, 11, 14);
      ctx.fillRect(wx + 2, wy + 18, 11, 12);
    }
    ctx.fillStyle = winFrame;
    ctx.fillRect(wx + 13, wy, 2, 34);
    ctx.fillRect(wx, wy + 16, 28, 2);
  });

  // Deur (hoog, gebogen)
  const doorX = x + w / 2 - 18;
  const doorY = y + h - 42;
  ctx.fillStyle = C.cafeWood;
  ctx.fillRect(doorX, doorY, 36, 42);
  ctx.fillStyle = locked ? '#1a1a1a' : '#2a1008';
  ctx.fillRect(doorX + 4, doorY + 4, 28, 38);
  // Boogvorm boven deur
  ctx.fillStyle = C.cafeWood;
  ctx.fillRect(doorX + 4, doorY, 28, 10);
  if (!locked) {
    ctx.fillStyle = '#6090a0';
    ctx.fillRect(doorX + 6, doorY + 6, 10, 24);
    ctx.fillRect(doorX + 18, doorY + 6, 10, 24);
  }
  // Deurklink
  ctx.fillStyle = '#e0c040';
  ctx.fillRect(doorX + 26, doorY + 22, 4, 4);

  // CAFÉ bord
  ctx.fillStyle = C.cafeSign;
  ctx.fillRect(x + w/2 - 44, y + 32, 88, 22);
  ctx.fillStyle = '#e0c060';
  ctx.fillRect(x + w/2 - 42, y + 34, 84, 18);
  txt(ctx, 'CAFÉ DE MOL', x + w/2, y + 44, 9, C.cafeSign);

  // Buitentafels (als niet locked)
  if (!locked) {
    [[x + 12, y + h + 8], [x + w - 38, y + h + 8]].forEach(([tx2, ty2]) => {
      ctx.fillStyle = '#c8a060';
      ctx.fillRect(tx2, ty2, 26, 4);
      ctx.fillStyle = '#6a3818';
      ctx.fillRect(tx2 + 11, ty2 + 4, 4, 12);
      ctx.fillStyle = '#c8a060';
      ctx.fillRect(tx2 - 4, ty2 + 14, 34, 4);
    });
  }

  // Outline
  ctx.strokeStyle = C.outline;
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, w, h);
}

// ── Parlement van Boedapest ─────────────────────────────────────
function drawParlement(ctx) {
  const bz = buildingZones.find(b => b.id === 'parlement');
  const x = bz.x * TILE, y = bz.y * TILE;
  const w = bz.w * TILE, h = bz.h * TILE;
  const cx = x + w / 2;

  // Schaduw
  ctx.fillStyle = C.shadow;
  ctx.fillRect(x + 10, y + 14, w + 6, h + 6);

  // ── Vleugels (symmetrisch) ──────────────────────────────────
  [x, x + w - 80].forEach(wingX => {
    ctx.fillStyle = C.parlDark;
    ctx.fillRect(wingX, y + h - 100, 80, 100);
    ctx.fillStyle = C.parlWall;
    ctx.fillRect(wingX + 4, y + h - 96, 72, 92);
    // Ramen vleugel
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        ctx.fillStyle = C.parlWindow;
        ctx.fillRect(wingX + 8 + col * 22, y + h - 90 + row * 28, 14, 20);
        ctx.fillStyle = '#80a0c0';
        ctx.fillRect(wingX + 9 + col * 22, y + h - 89 + row * 28, 12, 18);
      }
    }
    // Dakrand vleugel
    ctx.fillStyle = C.parlDark;
    ctx.fillRect(wingX, y + h - 102, 80, 6);
    ctx.fillStyle = C.parlAccent;
    ctx.fillRect(wingX + 4, y + h - 100, 72, 2);
  });

  // ── Hoofdlichaam ────────────────────────────────────────────
  const mainX = x + 80, mainW = w - 160;
  ctx.fillStyle = C.parlDark;
  ctx.fillRect(mainX, y + 40, mainW, h - 40);
  ctx.fillStyle = C.parlWall;
  ctx.fillRect(mainX + 6, y + 46, mainW - 12, h - 50);

  // Ramen hoofdlichaam
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 8; col++) {
      const rwx = mainX + 10 + col * (mainW - 20) / 8;
      const rwy = y + 50 + row * 50;
      ctx.fillStyle = C.parlWindow;
      ctx.fillRect(rwx, rwy, 16, 24);
      ctx.fillStyle = '#7090b0';
      ctx.fillRect(rwx + 1, rwy + 1, 14, 22);
      ctx.fillStyle = C.parlWall;
      ctx.fillRect(rwx + 7, rwy, 2, 24);
      ctx.fillRect(rwx, rwy + 12, 16, 2);
    }
  }

  // ── Kolommen voorgevel ──────────────────────────────────────
  ctx.fillStyle = C.parlDark;
  ctx.fillRect(mainX, y + 40, mainW, 8);
  ctx.fillStyle = C.parlAccent;
  ctx.fillRect(mainX + 4, y + 42, mainW - 8, 2);
  for (let col = 0; col <= 6; col++) {
    const colX = mainX + 12 + col * (mainW - 24) / 6;
    ctx.fillStyle = C.parlDark;
    ctx.fillRect(colX, y + 48, 8, h - 52);
    ctx.fillStyle = C.parlWall;
    ctx.fillRect(colX + 2, y + 50, 4, h - 54);
  }

  // ── Centrale koppeltoren ────────────────────────────────────
  const towerW = 90, towerX = cx - towerW / 2;
  ctx.fillStyle = C.parlDark;
  ctx.fillRect(towerX, y + 20, towerW, h - 20);
  ctx.fillStyle = C.parlWall;
  ctx.fillRect(towerX + 5, y + 25, towerW - 10, h - 28);

  // Ramen toren
  for (let row = 0; row < 5; row++) {
    ctx.fillStyle = C.parlWindow;
    ctx.fillRect(cx - 14, y + 28 + row * 36, 12, 24);
    ctx.fillRect(cx + 2,  y + 28 + row * 36, 12, 24);
    ctx.fillStyle = '#6080a0';
    ctx.fillRect(cx - 13, y + 29 + row * 36, 10, 22);
    ctx.fillRect(cx + 3,  y + 29 + row * 36, 10, 22);
  }

  // ── Koepel ──────────────────────────────────────────────────
  const domeR = 38, domeCX = cx, domeCY = y + 20;

  ctx.fillStyle = C.parlDark;
  ctx.fillRect(cx - domeR - 6, domeCY - 10, (domeR + 6) * 2, 14);

  // Koepelring
  ctx.fillStyle = C.parlDome;
  for (let i = -domeR; i <= domeR; i += 1) {
    const h2 = Math.sqrt(Math.max(0, domeR * domeR - i * i));
    ctx.fillRect(domeCX + i, domeCY - Math.round(h2), 1, Math.round(h2) + 2);
  }
  // Lichtglinstering op koepel
  ctx.fillStyle = C.parlDomeShine;
  for (let i = -domeR + 8; i <= -domeR + 30; i += 1) {
    const h2 = Math.sqrt(Math.max(0, (domeR - 4) * (domeR - 4) - i * i));
    ctx.fillRect(domeCX + i, domeCY - Math.round(h2) + 4, 1, Math.max(1, Math.round(h2) - 8));
  }

  // Koepelribben
  ctx.strokeStyle = C.parlDark;
  ctx.lineWidth = 1;
  for (let angle = -70; angle <= 70; angle += 14) {
    const rad = angle * Math.PI / 180;
    ctx.beginPath();
    ctx.moveTo(domeCX, domeCY + 2);
    ctx.lineTo(domeCX + Math.sin(rad) * domeR, domeCY - Math.cos(rad) * domeR);
    ctx.stroke();
  }

  // Koepelknop
  ctx.fillStyle = C.parlAccent;
  ctx.fillRect(cx - 3, domeCY - domeR - 14, 6, 14);
  ctx.fillRect(cx - 6, domeCY - domeR - 6, 12, 8);

  // ── Zijspitsen ──────────────────────────────────────────────
  [[cx - 130, y + 10], [cx + 110, y + 10],
   [cx - 90,  y + 30], [cx + 70,  y + 30]].forEach(([sx, sy]) => {
    ctx.fillStyle = C.parlDark;
    ctx.fillRect(sx - 8, sy, 16, h - sy + y);
    ctx.fillStyle = C.parlWall;
    ctx.fillRect(sx - 5, sy + 4, 10, h - sy + y - 6);
    // Spits
    ctx.fillStyle = C.parlDark;
    ctx.fillRect(sx - 3, sy - 18, 6, 20);
    ctx.fillRect(sx - 5, sy - 10, 10, 8);
    ctx.fillRect(sx - 2, sy - 26, 4, 10);
    ctx.fillStyle = C.parlAccent;
    ctx.fillRect(sx - 1, sy - 30, 2, 6);
  });

  // ── Hongaarse vlag ──────────────────────────────────────────
  ctx.fillStyle = C.parlAccent;
  ctx.fillRect(cx + 1, domeCY - domeR - 28, 2, 24);
  ctx.fillStyle = C.flagRed;
  ctx.fillRect(cx + 3, domeCY - domeR - 26, 20, 7);
  ctx.fillStyle = C.flagWhite;
  ctx.fillRect(cx + 3, domeCY - domeR - 19, 20, 7);
  ctx.fillStyle = C.flagGreen;
  ctx.fillRect(cx + 3, domeCY - domeR - 12, 20, 7);

  // ── Sokkel / trappen ────────────────────────────────────────
  ctx.fillStyle = C.parlDark;
  ctx.fillRect(x - 4, y + h, w + 8, 8);
  ctx.fillStyle = C.parlWall;
  ctx.fillRect(x, y + h + 2, w, 4);

  // Outline
  ctx.strokeStyle = C.outline;
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, w, h);
}

// ── Moltest-gebouw ──────────────────────────────────────────────
function drawTestBuilding(ctx, locked) {
  const bz = buildingZones.find(b => b.id === 'test');
  const x = bz.x * TILE, y = bz.y * TILE;
  const w = bz.w * TILE, h = bz.h * TILE;

  // Schaduw
  ctx.fillStyle = C.shadow;
  ctx.fillRect(x + 8, y + 12, w + 4, h + 4);

  // Dak
  ctx.fillStyle = locked ? '#1a2030' : C.testRoof;
  ctx.fillRect(x, y, w, 36);
  ctx.fillStyle = locked ? '#101828' : '#1a2840';
  for (let rx = x + 6; rx < x + w; rx += 22) {
    ctx.fillRect(rx, y + 4, 16, 28);
  }
  ctx.fillStyle = locked ? '#252f42' : '#3a5070';
  for (let rx = x + 12; rx < x + w; rx += 22) {
    ctx.fillRect(rx, y + 6, 6, 26);
  }

  // Dakrand
  ctx.fillStyle = C.testDark;
  ctx.fillRect(x - 4, y + 32, w + 8, 6);

  // Hoofd muur
  ctx.fillStyle = locked ? '#808898' : C.testWall;
  ctx.fillRect(x, y + 38, w, h - 38);
  ctx.fillStyle = locked ? '#606070' : C.testDark;
  ctx.fillRect(x, y + h - 16, w, 16);

  // Pilaren
  ctx.fillStyle = locked ? '#9098a8' : '#d8dce8';
  for (let px = x + 10; px < x + w - 10; px += 34) {
    ctx.fillRect(px, y + 38, 10, h - 38);
    ctx.fillStyle = locked ? '#707888' : C.testDark;
    ctx.fillRect(px, y + 38, 10, 4);
    ctx.fillRect(px, y + h - 18, 10, 4);
    ctx.fillStyle = locked ? '#9098a8' : '#d8dce8';
  }

  // Ramen (groot grid)
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 4; col++) {
      const rwx = x + 16 + col * (w - 32) / 4;
      const rwy = y + 50 + row * 52;
      ctx.fillStyle = locked ? '#1a2030' : C.testAccent;
      ctx.fillRect(rwx - 3, rwy - 3, 32, 38);
      ctx.fillStyle = locked ? '#080c14' : C.testWindow;
      ctx.fillRect(rwx, rwy, 26, 32);
      if (!locked) {
        ctx.fillStyle = '#90b0e0';
        ctx.fillRect(rwx + 1, rwy + 1, 11, 14);
        ctx.fillRect(rwx + 14, rwy + 1, 11, 14);
        ctx.fillRect(rwx + 1, rwy + 17, 11, 13);
        ctx.fillRect(rwx + 14, rwy + 17, 11, 13);
        ctx.fillStyle = C.testAccent;
        ctx.fillRect(rwx + 12, rwy, 2, 32);
        ctx.fillRect(rwx, rwy + 15, 26, 2);
      }
    }
  }

  // Ingang
  const doorX2 = x + w / 2 - 22;
  const doorY2 = y + h - 52;
  ctx.fillStyle = C.testDark;
  ctx.fillRect(doorX2 - 4, doorY2 - 4, 52, 56);
  ctx.fillStyle = locked ? '#101828' : '#1a2840';
  ctx.fillRect(doorX2, doorY2, 44, 52);
  if (!locked) {
    ctx.fillStyle = C.testWindow;
    ctx.fillRect(doorX2 + 4, doorY2 + 4, 16, 44);
    ctx.fillRect(doorX2 + 24, doorY2 + 4, 16, 44);
  }
  ctx.fillStyle = '#c0c840';
  ctx.fillRect(doorX2 + 36, doorY2 + 26, 4, 4);

  // Bord
  ctx.fillStyle = locked ? '#1a2030' : C.testRoof;
  ctx.fillRect(x + w/2 - 48, y + 6, 96, 24);
  ctx.fillStyle = locked ? '#404858' : C.testAccent;
  ctx.fillRect(x + w/2 - 46, y + 8, 92, 20);
  txt(ctx, 'MOL TEST', x + w / 2, y + 18, 9, locked ? '#4060a0' : '#c0d8ff');

  ctx.strokeStyle = C.outline;
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, w, h);
}

// ── Opdracht-gebouw ─────────────────────────────────────────────
function drawOpdracht(ctx, locked) {
  const bz = buildingZones.find(b => b.id === 'assignment');
  const x = bz.x * TILE, y = bz.y * TILE;
  const w = bz.w * TILE, h = bz.h * TILE;

  // Schaduw
  ctx.fillStyle = C.shadow;
  ctx.fillRect(x + 8, y + 12, w + 4, h + 4);

  // Dak (aflopend, avontuurlijk)
  ctx.fillStyle = locked ? '#2a1a08' : C.opdrRoof;
  ctx.fillRect(x, y, w, 30);
  // Dakpannen
  if (!locked) {
    ctx.fillStyle = '#601808';
    for (let rx = x + 4; rx < x + w; rx += 16) {
      ctx.fillRect(rx, y + 4, 10, 22);
    }
    ctx.fillStyle = '#8a3010';
    for (let rx = x + 10; rx < x + w; rx += 16) {
      ctx.fillRect(rx, y + 6, 4, 20);
    }
  }
  ctx.fillStyle = C.opdrDark;
  ctx.fillRect(x - 4, y + 26, w + 8, 6);

  // Hoofd muur
  ctx.fillStyle = locked ? '#706040' : C.opdrWall;
  ctx.fillRect(x, y + 32, w, h - 32);
  ctx.fillStyle = locked ? '#504828' : C.opdrDark;
  ctx.fillRect(x, y + h - 12, w, 12);

  // Ruwe stenen textuur (horizontale lijnen)
  ctx.fillStyle = locked ? '#604e30' : '#b08858';
  for (let sy = y + 36; sy < y + h - 12; sy += 14) {
    ctx.fillRect(x + 2, sy, w - 4, 2);
  }

  // Ramen (rond, adventurous look)
  [[x + 10, y + 40], [x + w - 58, y + 40],
   [x + 10, y + 90], [x + w - 58, y + 90]].forEach(([wx, wy]) => {
    ctx.fillStyle = locked ? '#3a2a10' : C.opdrDark;
    ctx.fillRect(wx - 3, wy - 3, 46, 40);
    ctx.fillStyle = locked ? '#1a0800' : C.opdrWindow;
    ctx.fillRect(wx, wy, 40, 34);
    if (!locked) {
      ctx.fillStyle = '#c0f0d0';
      ctx.fillRect(wx + 2, wy + 2, 16, 14);
      ctx.fillRect(wx + 2, wy + 18, 16, 14);
      ctx.fillRect(wx + 20, wy + 2, 18, 14);
      ctx.fillRect(wx + 20, wy + 18, 18, 14);
    }
    ctx.fillStyle = locked ? '#3a2a10' : C.opdrDark;
    ctx.fillRect(wx + 18, wy, 4, 34);
    ctx.fillRect(wx, wy + 16, 40, 4);
  });

  // Ingang (dubbele deur)
  const doorX3 = x + w / 2 - 20;
  const doorY3 = y + h - 52;
  ctx.fillStyle = C.opdrDark;
  ctx.fillRect(doorX3 - 4, doorY3 - 4, 50, 56);
  ctx.fillStyle = locked ? '#1a0800' : '#3a1808';
  ctx.fillRect(doorX3, doorY3, 42, 52);
  if (!locked) {
    ctx.fillStyle = '#80b070';
    ctx.fillRect(doorX3 + 4, doorY3 + 6, 15, 44);
    ctx.fillRect(doorX3 + 23, doorY3 + 6, 15, 44);
  }
  ctx.fillStyle = locked ? '#c0a050' : C.opdrAccent;
  ctx.fillRect(doorX3 + 18, doorY3 + 24, 6, 6);

  // Uitroepteken bord
  ctx.fillStyle = C.opdrAccent;
  ctx.fillRect(x + w/2 - 24, y + 4, 48, 28);
  ctx.fillStyle = C.opdrDark;
  ctx.fillRect(x + w/2 - 22, y + 6, 44, 24);
  txt(ctx, 'OPDRACHT', x + w / 2, y + 18, 8, C.opdrAccent);

  ctx.strokeStyle = C.outline;
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, w, h);
}

// ═══════════════════════════════════════════════════════════════
//  DECOR
// ═══════════════════════════════════════════════════════════════

function drawTree(ctx, tx, ty) {
  const x = tx * TILE, y = ty * TILE;

  // Schaduw
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.fillRect(x + 8, y + 24, 20, 10);

  // Stam
  ctx.fillStyle = C.treeTrunk;
  ctx.fillRect(x + 13, y + 22, 7, 12);
  ctx.fillStyle = '#3a1808';
  ctx.fillRect(x + 15, y + 22, 3, 12);

  // Donker blad (achterste laag)
  ctx.fillStyle = C.treeDark;
  ctx.fillRect(x + 3,  y + 12, 27, 14);
  ctx.fillRect(x + 7,  y + 4,  20, 12);
  ctx.fillRect(x + 11, y + 0,  11, 8);

  // Middel blad
  ctx.fillStyle = C.treeMid;
  ctx.fillRect(x + 5,  y + 14, 23, 10);
  ctx.fillRect(x + 9,  y + 6,  15, 10);
  ctx.fillRect(x + 12, y + 2,  8,  6);

  // Licht top
  ctx.fillStyle = C.treeLight;
  ctx.fillRect(x + 8,  y + 15, 10, 6);
  ctx.fillRect(x + 11, y + 8,  8,  5);

  // Glinstering
  ctx.fillStyle = C.treeTip;
  ctx.fillRect(x + 13, y + 4,  4,  3);
  ctx.fillRect(x + 10, y + 13, 4,  2);

  // Outline
  ctx.strokeStyle = C.treeShadow;
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 3, y, 27, 22);
}

function drawBush(ctx, tx, ty) {
  const x = tx * TILE, y = ty * TILE + 12;
  ctx.fillStyle = C.treeDark;
  ctx.fillRect(x + 2, y + 6, 28, 12);
  ctx.fillStyle = C.bushGreen;
  ctx.fillRect(x + 4, y + 4, 26, 12);
  ctx.fillRect(x + 8, y + 0, 18, 8);
  ctx.fillStyle = C.bushLight;
  ctx.fillRect(x + 8, y + 2, 10, 6);
  ctx.fillRect(x + 20, y + 6, 6, 4);
}

function drawLamp(ctx, tx, ty) {
  const x = tx * TILE + 12, y = ty * TILE;

  // Halo
  ctx.fillStyle = C.lampHalo;
  ctx.beginPath();
  ctx.arc(x + 4, y + 4, 24, 0, Math.PI * 2);
  ctx.fill();

  // Paal
  ctx.fillStyle = C.lampPost;
  ctx.fillRect(x + 2, y + 8, 5, TILE - 8);

  // Arm
  ctx.fillRect(x - 4, y + 6, 12, 4);
  ctx.fillRect(x - 4, y + 2, 4, 6);

  // Lamp
  ctx.fillStyle = C.lampGlow;
  ctx.fillRect(x - 8, y - 2, 12, 8);
  ctx.fillStyle = '#fffff0';
  ctx.fillRect(x - 6, y, 8, 5);

  // Lantaarn frame
  ctx.strokeStyle = C.lampPost;
  ctx.lineWidth = 1;
  ctx.strokeRect(x - 8, y - 2, 12, 8);
}

function drawFlowers(ctx, tx, ty) {
  const x = tx * TILE, y = ty * TILE + 14;
  const colors = [C.flowerRed, C.flowerYellow, C.flowerPink, C.flowerWhite];
  for (let i = 0; i < 6; i++) {
    const fx = x + 3 + i * 5;
    const fy = y + (i % 2) * 5;
    ctx.fillStyle = C.grassLight;
    ctx.fillRect(fx + 1, fy + 4, 2, 6);
    ctx.fillStyle = colors[(tx + ty + i) % colors.length];
    ctx.fillRect(fx, fy, 4, 4);
  }
}

function drawDecor(ctx) {
  for (const [x, y] of decor.trees)   drawTree(ctx, x, y);
  for (const [x, y] of decor.bushes)  drawBush(ctx, x, y);
  for (const [x, y] of decor.lamps)   drawLamp(ctx, x, y);
  for (const [x, y] of decor.flowers) drawFlowers(ctx, x, y);
}

// ═══════════════════════════════════════════════════════════════
//  KARAKTER-SPRITES
// ═══════════════════════════════════════════════════════════════

const PALETTES_M = [
  { shirt: '#2060c0', pants: '#183060', hair: '#3a2010', skin: '#f8b870' },
  { shirt: '#20a040', pants: '#104020', hair: '#101010', skin: '#f8b870' },
  { shirt: '#c05020', pants: '#602010', hair: '#806030', skin: '#f8b870' },
  { shirt: '#8030b0', pants: '#401060', hair: '#101010', skin: '#f0a870' },
  { shirt: '#20a0b0', pants: '#0a5060', hair: '#c09020', skin: '#f8b870' },
];
const PALETTES_V = [
  { shirt: '#c02040', pants: '#601020', hair: '#3a2010', skin: '#f8b870' },
  { shirt: '#9030a0', pants: '#481060', hair: '#d0a020', skin: '#f8b870' },
  { shirt: '#e0a820', pants: '#705010', hair: '#801010', skin: '#f0a870' },
  { shirt: '#2080c0', pants: '#103060', hair: '#101010', skin: '#f8b870' },
  { shirt: '#d06090', pants: '#681840', hair: '#d0a020', skin: '#f8b870' },
];

function drawCharacter(ctx, px, py, candidate, options = {}) {
  const { isPlayer = false, isGilles = false, index = 0 } = options;
  const gender = candidate?.gender || 'man';
  const name   = candidate?.name   || '?';

  const pal = isGilles
    ? { shirt: '#1a1a1a', pants: '#282828', hair: '#d0c890', skin: '#f0c090' }
    : (gender === 'vrouw' ? PALETTES_V : PALETTES_M)[index % 5];

  const shirtColor = isPlayer ? '#3060e0' : pal.shirt;
  const { pants, hair, skin } = pal;

  ctx.save();
  ctx.translate(px + 2, py);

  // Schaduw
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  ctx.fillRect(4, 30, 20, 5);

  // Schoenen
  ctx.fillStyle = '#101010';
  ctx.fillRect(7, 28, 6, 4);
  ctx.fillRect(16, 28, 6, 4);

  // Broek
  ctx.fillStyle = pants;
  ctx.fillRect(8, 20, 5, 10);
  ctx.fillRect(17, 20, 5, 10);

  // Lijf
  ctx.fillStyle = shirtColor;
  ctx.fillRect(7, 10, 16, 12);
  ctx.strokeStyle = C.outline;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(7, 10, 16, 12);

  // Armen
  ctx.fillStyle = shirtColor;
  ctx.fillRect(2, 11, 6, 8);
  ctx.fillRect(22, 11, 6, 8);
  ctx.fillStyle = skin;
  ctx.fillRect(2, 17, 6, 4);
  ctx.fillRect(22, 17, 6, 4);

  // Hoofd
  ctx.fillStyle = skin;
  ctx.fillRect(7, 2, 16, 10);
  ctx.strokeStyle = C.outline;
  ctx.strokeRect(7, 2, 16, 10);

  // Haar
  ctx.fillStyle = isGilles ? '#d0c890' : hair;
  ctx.fillRect(6, 1, 18, 5);
  ctx.fillRect(6, 4, 3, 7);
  if (gender === 'vrouw' && !isGilles) {
    ctx.fillRect(21, 4, 3, 12);
    ctx.fillRect(6, 4, 3, 12);
  } else {
    ctx.fillRect(21, 4, 3, 5);
  }

  // Gilles: grijs haar + bril
  if (isGilles) {
    ctx.fillStyle = '#e8e0c0';
    ctx.fillRect(8, 1, 6, 3);
    ctx.fillStyle = '#303030';
    ctx.fillRect(9, 6, 4, 2);
    ctx.fillRect(17, 6, 4, 2);
    ctx.fillRect(13, 7, 4, 1);
  }

  // Ogen
  ctx.fillStyle = C.outline;
  ctx.fillRect(10, 7, 2, 2);
  ctx.fillRect(18, 7, 2, 2);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(10, 7, 1, 1);

  // Speler-kader (geel)
  if (isPlayer) {
    ctx.strokeStyle = '#f8e820';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, -1, 28, 34);
  }

  ctx.restore();

  // Naamlabel (GBC paneel stijl)
  const label = isPlayer ? 'JIJ' : isGilles ? 'GILLES' : name.split(' ')[0].toUpperCase();
  const lw = Math.max(28, label.length * 7 + 10);
  const lx = px + 16 - lw / 2;
  const ly = py - 15;

  ctx.fillStyle = C.white;
  ctx.fillRect(lx, ly, lw, 13);
  ctx.fillStyle = C.outline;
  ctx.fillRect(lx, ly, lw, 2);
  ctx.fillRect(lx, ly + 11, lw, 2);
  ctx.fillRect(lx, ly, 2, 13);
  ctx.fillRect(lx + lw - 2, ly, 2, 13);
  txt(ctx, label, lx + lw / 2, ly + 7, 7, C.outline);
}

// ── Spraakballon (GBC stijl) ─────────────────────────────────────
function drawSpeechBubble(ctx, text, x, y) {
  const ww = clamp(text.length * 7 + 24, 180, 480);
  const hh = 36;
  const bx = clamp(x - ww / 2, 8, COLS * TILE - ww - 8);
  const by = clamp(y - 60, 8, ROWS * TILE - 90);

  gbcPanel(ctx, bx, by, ww, hh);

  // Pijltje
  ctx.fillStyle = C.panelBg;
  ctx.fillRect(x - 4, by + hh, 8, 6);
  ctx.fillStyle = C.panelBorder;
  ctx.fillRect(x - 4, by + hh, 8, 3);

  txt(ctx, text, bx + ww / 2, by + 18, 11, C.outline);
}

// ═══════════════════════════════════════════════════════════════
//  GROND RENDEREN
// ═══════════════════════════════════════════════════════════════

function drawGround(ctx, tick) {
  for (let ty = 0; ty < ROWS; ty++) {
    for (let tx = 0; tx < COLS; tx++) {
      if (isRiverTile(tx, ty) && !isBridgeTile(tx, ty)) {
        drawWater(ctx, tx, ty, tick);
      } else if (isPathTile(tx, ty) || isBridgeTile(tx, ty)) {
        drawCobble(ctx, tx, ty);
      } else {
        drawGrass(ctx, tx, ty);
      }
    }
  }
}

// ── Rivier-oevers (getrapte randen) ─────────────────────────────
function drawRiverBanks(ctx) {
  for (let ty = 0; ty < ROWS; ty++) {
    // Westelijke oever
    const wx = (RIVER_L - 1) * TILE;
    const wy = ty * TILE;
    ctx.fillStyle = C.cobbleDark;
    ctx.fillRect(wx + 26, wy, 6, TILE);
    ctx.fillStyle = C.cobble;
    ctx.fillRect(wx + 28, wy, 4, TILE);

    // Oostelijke oever
    const ex = RIVER_R * TILE + TILE;
    const ey = ty * TILE;
    ctx.fillStyle = C.cobbleDark;
    ctx.fillRect(ex, ey, 6, TILE);
    ctx.fillStyle = C.cobble;
    ctx.fillRect(ex, ey, 4, TILE);
  }
}

// ═══════════════════════════════════════════════════════════════
//  SESSIE AANMAKEN
// ═══════════════════════════════════════════════════════════════

export function createMapSession({ container, candidates, assignmentDone, onInteract }) {
  const canvas = document.createElement('canvas');
  canvas.width  = COLS * TILE;
  canvas.height = ROWS * TILE;
  canvas.className = 'game-canvas';
  canvas.tabIndex = 0;
  container.innerHTML = '';
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  const player = { x: 7, y: 10 };
  let tick = 0;

  const active = candidates.filter(c => !c.eliminated);
  const playerCandidate = active.find(c => c.isPlayer);

  const npcs = active
    .filter(c => !c.isPlayer)
    .slice(0, npcSpots.length)
    .map((c, i) => ({ ...c, ...npcSpots[i], spriteIndex: i }));

  // ── Collision ────────────────────────────────────────────────
  function blocked(x, y) {
    if (x < 0 || y < 0 || x >= COLS || y >= ROWS) return true;
    if (isRiverTile(x, y) && !isBridgeTile(x, y)) return true;

    for (const bz of buildingZones) {
      if (isInsideRect(x, y, bz)) return true;
    }
    for (const npc of npcs) {
      if (npc.x === x && npc.y === y) return true;
    }
    return false;
  }

  // ── Interactie ───────────────────────────────────────────────
  function nearAction() {
    for (const bz of buildingZones) {
      if (bz.decorativeOnly) continue;
      if (Math.abs(player.x - bz.doorX) + Math.abs(player.y - bz.doorY) <= 1) {
        return {
          type: 'building',
          id: bz.id,
          label: bz.label,
          locked: !!(bz.lockedUntilAssignment && !assignmentDone)
        };
      }
    }
    for (const npc of npcs) {
      if (Math.abs(player.x - npc.x) + Math.abs(player.y - npc.y) <= 1) {
        return {
          type: 'candidate',
          id: npc.id,
          label: npc.name,
          locked: !assignmentDone
        };
      }
    }
    // Gilles staat altijd in het midden op de brug
    const gilles = { x: RIVER_L, y: 10 };
    if (Math.abs(player.x - gilles.x) + Math.abs(player.y - gilles.y) <= 1) {
      return { type: 'gilles', id: 'gilles', label: 'Gilles', locked: false };
    }
    return null;
  }

  // ── Bewegen ──────────────────────────────────────────────────
  function move(dx, dy) {
    const nx = clamp(player.x + dx, 0, COLS - 1);
    const ny = clamp(player.y + dy, 0, ROWS - 1);
    if (!blocked(nx, ny)) { player.x = nx; player.y = ny; render(); }
  }

  function handleKeyDown(e) {
    const k = e.key.toLowerCase();
    if (['arrowup','arrowdown','arrowleft','arrowright','w','a','s','d','e','enter'].includes(k)) {
      e.preventDefault();
    }
    if (k === 'arrowup'    || k === 'w') move(0, -1);
    if (k === 'arrowdown'  || k === 's') move(0,  1);
    if (k === 'arrowleft'  || k === 'a') move(-1, 0);
    if (k === 'arrowright' || k === 'd') move(1,  0);
    if (k === 'e' || k === 'enter') {
      const action = nearAction();
      if (action) onInteract(action);
    }
  }

  // ── Render ───────────────────────────────────────────────────
  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Grond
    drawGround(ctx, tick);
    drawRiverBanks(ctx);

    // 2. Brug (onder de gebouwen)
    drawBridge(ctx);

    // 3. Gebouwen
    drawCafe(ctx, !!(buildingZones.find(b => b.id === 'cafe')?.lockedUntilAssignment && !assignmentDone));
    drawOpdracht(ctx, false);
    drawParlement(ctx);
    drawTestBuilding(ctx, !!(buildingZones.find(b => b.id === 'test')?.lockedUntilAssignment && !assignmentDone));

    // 4. Decoratie
    drawDecor(ctx);

    // 5. NPCs
    for (const npc of npcs) {
      drawCharacter(ctx, npc.x * TILE, npc.y * TILE, npc, { index: npc.spriteIndex });
    }

    // 6. Gilles (op de brug)
    drawCharacter(ctx, RIVER_L * TILE - 8, 10 * TILE - 4, { name: 'Gilles', gender: 'man' }, { isGilles: true });

    // 7. Speler
    drawCharacter(ctx, player.x * TILE, player.y * TILE, playerCandidate, { isPlayer: true });

    // 8. Interactie-ballon
    const action = nearAction();
    if (action) {
      let bx = player.x * TILE + 16;
      let by = player.y * TILE;
      if (action.type === 'candidate') {
        const npc = npcs.find(n => n.id === action.id);
        if (npc) { bx = npc.x * TILE + 16; by = npc.y * TILE; }
      }
      const msg = action.locked
        ? `${action.label}: beschikbaar na opdracht`
        : `[E] ${action.label}`;
      drawSpeechBubble(ctx, msg, bx, by);
    }

    // 9. HUD-paneel onderaan (GBC stijl)
    const hudH = 46;
    const hudY = canvas.height - hudH - 6;
    gbcPanel(ctx, 8, hudY, canvas.width - 16, hudH);

    const hint = action
      ? action.locked
        ? `${action.label} is vergrendeld. Speel eerst de opdracht.`
        : `Druk E of Enter om te interageren.`
      : 'Pijltjes / WASD om te bewegen     E = interageer';

    txt(ctx, hint, 22, hudY + hudH / 2, 11, C.outline, 'left');

    tick = (tick + 1) % 60;
  }

  canvas.addEventListener('keydown', handleKeyDown);
  setTimeout(() => canvas.focus(), 0);

  // Animatielus (water beweegt)
  let animHandle = setInterval(() => {
    tick = (tick + 1) % 60;
    // Herteken water-tegels
    for (let tx2 = RIVER_L; tx2 <= RIVER_R; tx2++) {
      for (let ty2 = 0; ty2 < ROWS; ty2++) {
        if (!isBridgeTile(tx2, ty2)) drawWater(ctx, tx2, ty2, tick);
      }
    }
    drawRiverBanks(ctx);
  }, 200);

  render();

  return {
    destroy() {
      canvas.removeEventListener('keydown', handleKeyDown);
      clearInterval(animHandle);
    }
  };
}
