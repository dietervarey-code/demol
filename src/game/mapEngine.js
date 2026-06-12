const TILE_SIZE = 32;
const MAP_COLS = 30;
const MAP_ROWS = 20;

const COLORS = {
  grass: "#5fbd55",
  grassDark: "#459b43",
  grassLight: "#7ed66d",
  path: "#bfc7bd",
  pathDark: "#8e9a91",
  pathLight: "#d8dfd6",
  water: "#2d95c9",
  waterDark: "#1c6f9b",
  soil: "#c99b68",
  outline: "#102018",
  black: "#020706",
  panel: "rgba(2, 7, 6, 0.88)",
  cyan: "#22ffe6",
  green: "#00ff66",
  white: "#f4fff9",
  roofRed: "#c74b45",
  roofGreen: "#3f9145",
  roofPurple: "#8262c7",
  wall: "#e5dcc7",
  wallShadow: "#b9ad96",
  door: "#8a552e",
  window: "#68d6ff"
};

const buildingZones = [
  {
    id: "assignment",
    label: "OPDRACHT",
    signIcon: "!",
    x: 3,
    y: 1,
    w: 7,
    h: 5,
    doorX: 6,
    doorY: 6,
    roof: COLORS.roofRed,
    locked: false
  },
  {
    id: "cafe",
    label: "CAFE",
    signIcon: "☕",
    x: 12,
    y: 1,
    w: 7,
    h: 5,
    doorX: 15,
    doorY: 6,
    roof: COLORS.roofGreen,
    lockedUntilAssignment: true
  },
  {
    id: "test",
    label: "TEST",
    signIcon: "?",
    x: 21,
    y: 1,
    w: 7,
    h: 5,
    doorX: 24,
    doorY: 6,
    roof: COLORS.roofPurple,
    lockedUntilAssignment: true
  },
  {
    id: "hotel",
    label: "HOTEL",
    signIcon: "H",
    x: 11,
    y: 14,
    w: 8,
    h: 5,
    doorX: 15,
    doorY: 13,
    roof: "#a66a35",
    locked: false,
    decorativeOnly: true
  }
];

const npcSpots = [
  { x: 7, y: 8 },
  { x: 12, y: 8 },
  { x: 18, y: 8 },
  { x: 23, y: 8 },
  { x: 5, y: 13 },
  { x: 10, y: 12 },
  { x: 20, y: 12 },
  { x: 25, y: 13 },
  { x: 15, y: 10 }
];

const decor = {
  trees: [
    [2, 8], [4, 10], [27, 8], [25, 10],
    [3, 17], [26, 17], [9, 16], [20, 16]
  ],
  benches: [
    [4, 12], [23, 12]
  ],
  lamps: [
    [10, 7], [19, 7], [10, 13], [19, 13]
  ],
  flowers: [
    [2, 6], [3, 6], [26, 6], [27, 6],
    [6, 16], [23, 16], [8, 10], [21, 10]
  ]
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function isInsideRect(x, y, rect) {
  return x >= rect.x && x < rect.x + rect.w && y >= rect.y && y < rect.y + rect.h;
}

function drawText(ctx, text, x, y, size = 13, color = COLORS.white, align = "center") {
  ctx.fillStyle = color;
  ctx.font = `700 ${size}px monospace`;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y);
}

function drawTileOutline(ctx, x, y, color = "rgba(0,0,0,.12)") {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 0.5, y + 0.5, TILE_SIZE - 1, TILE_SIZE - 1);
}

function drawGrassTile(ctx, tx, ty) {
  const x = tx * TILE_SIZE;
  const y = ty * TILE_SIZE;

  ctx.fillStyle = COLORS.grass;
  ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

  const variant = (tx * 17 + ty * 31) % 7;

  if (variant === 0) {
    ctx.fillStyle = COLORS.grassLight;
    ctx.fillRect(x + 5, y + 7, 5, 4);
    ctx.fillRect(x + 18, y + 20, 4, 5);
  }

  if (variant === 1) {
    ctx.fillStyle = COLORS.grassDark;
    ctx.fillRect(x + 12, y + 9, 7, 4);
  }
}

function drawPathTile(ctx, tx, ty) {
  const x = tx * TILE_SIZE;
  const y = ty * TILE_SIZE;

  ctx.fillStyle = COLORS.path;
  ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

  ctx.fillStyle = COLORS.pathLight;
  ctx.fillRect(x + 3, y + 4, 10, 8);
  ctx.fillRect(x + 18, y + 17, 9, 7);

  ctx.fillStyle = COLORS.pathDark;
  ctx.fillRect(x + 1, y + 27, 14, 3);
  ctx.fillRect(x + 20, y + 2, 10, 3);

  drawTileOutline(ctx, x, y, "rgba(60,70,65,.18)");
}

function drawWaterTile(ctx, tx, ty) {
  const x = tx * TILE_SIZE;
  const y = ty * TILE_SIZE;

  ctx.fillStyle = COLORS.water;
  ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

  ctx.fillStyle = ty % 2 === 0 ? COLORS.waterDark : "#47b9e7";
  ctx.fillRect(x + 3, y + 8, 22, 4);
  ctx.fillRect(x + 8, y + 22, 18, 3);
}

function isPathTile(x, y) {
  return (
    x === 15 ||
    y === 7 ||
    y === 11 ||
    (x >= 5 && x <= 24 && y >= 8 && y <= 10) ||
    (x >= 13 && x <= 17 && y >= 12 && y <= 13)
  );
}

function isWaterTile(x, y) {
  return x <= 1 || (x === 2 && y >= 15);
}

function drawGround(ctx) {
  for (let y = 0; y < MAP_ROWS; y += 1) {
    for (let x = 0; x < MAP_COLS; x += 1) {
      if (isWaterTile(x, y)) drawWaterTile(ctx, x, y);
      else if (isPathTile(x, y)) drawPathTile(ctx, x, y);
      else drawGrassTile(ctx, x, y);
    }
  }

  // brug over water
  ctx.fillStyle = "#9b6a3d";
  ctx.fillRect(0, 11 * TILE_SIZE + 6, 3 * TILE_SIZE, 18);
  ctx.fillStyle = "#714a2d";
  ctx.fillRect(0, 11 * TILE_SIZE + 4, 3 * TILE_SIZE, 3);
  ctx.fillRect(0, 11 * TILE_SIZE + 24, 3 * TILE_SIZE, 3);
}

function drawHouse(ctx, building, assignmentDone) {
  const x = building.x * TILE_SIZE;
  const y = building.y * TILE_SIZE;
  const w = building.w * TILE_SIZE;
  const h = building.h * TILE_SIZE;

  const locked = building.lockedUntilAssignment && !assignmentDone;

  // shadow
  ctx.fillStyle = "rgba(0,0,0,.25)";
  ctx.fillRect(x + 8, y + 12, w, h);

  // roof
  ctx.fillStyle = locked ? "#40504a" : building.roof;
  ctx.fillRect(x, y, w, 34);

  // roof stripes
  ctx.fillStyle = "rgba(0,0,0,.14)";
  for (let sx = x + 8; sx < x + w; sx += 18) {
    ctx.fillRect(sx, y, 3, 34);
  }

  // roof lip
  ctx.fillStyle = COLORS.outline;
  ctx.fillRect(x - 4, y + 30, w + 8, 6);

  // walls
  ctx.fillStyle = locked ? "#8a958d" : COLORS.wall;
  ctx.fillRect(x + 8, y + 36, w - 16, h - 36);

  ctx.fillStyle = locked ? "#6b766f" : COLORS.wallShadow;
  ctx.fillRect(x + 8, y + h - 12, w - 16, 12);

  ctx.strokeStyle = COLORS.outline;
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 8, y + 36, w - 16, h - 36);

  // door
  const doorPx = building.doorX * TILE_SIZE + 6;
  const doorPy = building.doorY * TILE_SIZE - 18;
  ctx.fillStyle = locked ? "#4a514d" : COLORS.door;
  ctx.fillRect(doorPx, doorPy, 20, 34);
  ctx.strokeStyle = COLORS.outline;
  ctx.strokeRect(doorPx, doorPy, 20, 34);

  ctx.fillStyle = "#f8da6a";
  ctx.fillRect(doorPx + 14, doorPy + 17, 3, 3);

  // windows
  drawWindow(ctx, x + 22, y + 58, locked);
  drawWindow(ctx, x + w - 48, y + 58, locked);

  // sign
  ctx.fillStyle = locked ? "#d8dfd6" : "#f4fff9";
  ctx.fillRect(x + w / 2 - 20, y + 40, 40, 26);
  ctx.strokeStyle = COLORS.outline;
  ctx.strokeRect(x + w / 2 - 20, y + 40, 40, 26);

  drawText(ctx, building.signIcon, x + w / 2, y + 53, 16, locked ? "#6b766f" : COLORS.outline);

  // label
  ctx.fillStyle = COLORS.panel;
  ctx.fillRect(x + w / 2 - 50, y + h - 4, 100, 24);
  ctx.strokeStyle = COLORS.cyan;
  ctx.strokeRect(x + w / 2 - 50, y + h - 4, 100, 24);
  drawText(ctx, building.label, x + w / 2, y + h + 8, 11, locked ? "#88a39b" : COLORS.white);
}

function drawWindow(ctx, x, y, locked) {
  ctx.fillStyle = locked ? "#222" : COLORS.window;
  ctx.fillRect(x, y, 22, 28);

  ctx.fillStyle = locked ? "#444" : "#d7fbff";
  ctx.fillRect(x + 4, y + 4, 7, 20);

  ctx.strokeStyle = COLORS.outline;
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, 22, 28);
}

function drawTree(ctx, tx, ty) {
  const x = tx * TILE_SIZE;
  const y = ty * TILE_SIZE;

  ctx.fillStyle = "#6a4425";
  ctx.fillRect(x + 13, y + 18, 8, 16);

  ctx.fillStyle = "#1f7f3c";
  ctx.fillRect(x + 5, y + 9, 24, 18);

  ctx.fillStyle = "#2ea64d";
  ctx.fillRect(x + 9, y + 2, 17, 14);
  ctx.fillRect(x + 1, y + 15, 15, 12);
  ctx.fillRect(x + 18, y + 15, 15, 12);

  ctx.fillStyle = "#7ed66d";
  ctx.fillRect(x + 12, y + 5, 5, 4);
}

function drawBench(ctx, tx, ty) {
  const x = tx * TILE_SIZE;
  const y = ty * TILE_SIZE;

  ctx.fillStyle = "#6a4425";
  ctx.fillRect(x + 2, y + 10, 28, 5);
  ctx.fillRect(x + 2, y + 18, 28, 5);

  ctx.fillStyle = "#3a2415";
  ctx.fillRect(x + 6, y + 23, 4, 8);
  ctx.fillRect(x + 22, y + 23, 4, 8);
}

function drawLamp(ctx, tx, ty) {
  const x = tx * TILE_SIZE;
  const y = ty * TILE_SIZE;

  ctx.fillStyle = "#1b1b1b";
  ctx.fillRect(x + 14, y + 10, 4, 21);

  ctx.fillStyle = "#f8f0a0";
  ctx.fillRect(x + 9, y + 2, 14, 10);

  ctx.strokeStyle = COLORS.outline;
  ctx.strokeRect(x + 9, y + 2, 14, 10);
}

function drawFlowers(ctx, tx, ty) {
  const x = tx * TILE_SIZE;
  const y = ty * TILE_SIZE;

  const colors = ["#ff5ea8", "#fff06a", "#22ffe6", "#f4fff9"];

  for (let i = 0; i < 5; i += 1) {
    ctx.fillStyle = colors[(tx + ty + i) % colors.length];
    ctx.fillRect(x + 5 + i * 5, y + 8 + (i % 2) * 7, 4, 4);
  }
}

function drawDecor(ctx) {
  for (const [x, y] of decor.trees) drawTree(ctx, x, y);
  for (const [x, y] of decor.benches) drawBench(ctx, x, y);
  for (const [x, y] of decor.lamps) drawLamp(ctx, x, y);
  for (const [x, y] of decor.flowers) drawFlowers(ctx, x, y);
}

function paletteForCandidate(candidate, index = 0) {
  const male = [
    { shirt: "#2f80ed", hair: "#3b2418" },
    { shirt: "#27ae60", hair: "#151515" },
    { shirt: "#f2994a", hair: "#7a4b25" },
    { shirt: "#56ccf2", hair: "#d6a13b" },
    { shirt: "#9b51e0", hair: "#111111" }
  ];

  const female = [
    { shirt: "#eb5757", hair: "#3b2418" },
    { shirt: "#bb6bd9", hair: "#d6a13b" },
    { shirt: "#f2c94c", hair: "#7a4b25" },
    { shirt: "#2d9cdb", hair: "#111111" },
    { shirt: "#f78fb3", hair: "#d6a13b" }
  ];

  const set = candidate?.gender === "vrouw" ? female : male;
  return set[index % set.length];
}

function drawCharacter(ctx, px, py, candidate, options = {}) {
  const { isPlayer = false, isGilles = false, index = 0 } = options;

  const gender = candidate?.gender || "man";
  const name = candidate?.name || "?";
  const palette = paletteForCandidate(candidate, index);

  const shirt = isGilles ? "#191919" : isPlayer ? COLORS.cyan : palette.shirt;
  const hair = isGilles ? "#bfc7bd" : palette.hair;
  const skin = "#f0b37e";

  ctx.save();
  ctx.translate(px, py);

  // shadow
  ctx.fillStyle = "rgba(0,0,0,.30)";
  ctx.fillRect(6, 28, 21, 5);

  // legs
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(9, 24, 5, 8);
  ctx.fillRect(19, 24, 5, 8);

  // body
  ctx.fillStyle = shirt;
  ctx.fillRect(8, 13, 18, 14);
  ctx.strokeStyle = COLORS.outline;
  ctx.strokeRect(8, 13, 18, 14);

  // arms
  ctx.fillStyle = skin;
  ctx.fillRect(4, 15, 5, 10);
  ctx.fillRect(25, 15, 5, 10);

  // head
  ctx.fillStyle = skin;
  ctx.fillRect(8, 4, 18, 13);
  ctx.strokeStyle = COLORS.outline;
  ctx.strokeRect(8, 4, 18, 13);

  // hair
  ctx.fillStyle = hair;
  ctx.fillRect(7, 2, 20, 6);

  if (gender === "vrouw" && !isGilles) {
    ctx.fillRect(6, 7, 5, 12);
    ctx.fillRect(23, 7, 5, 12);
  }

  if (isGilles) {
    ctx.fillStyle = "#808a86";
    ctx.fillRect(7, 2, 20, 5);
    ctx.fillRect(6, 6, 4, 6);
    ctx.fillRect(24, 6, 4, 6);
  }

  // eyes
  ctx.fillStyle = COLORS.black;
  ctx.fillRect(12, 10, 2, 2);
  ctx.fillRect(20, 10, 2, 2);

  if (isPlayer) {
    ctx.strokeStyle = COLORS.green;
    ctx.lineWidth = 2;
    ctx.strokeRect(4, 0, 26, 33);
  }

  ctx.restore();

  const label = isPlayer ? "JIJ" : isGilles ? "GILLES" : name;

  ctx.fillStyle = COLORS.panel;
  ctx.fillRect(px - 6, py - 16, Math.max(44, label.length * 8), 14);
  ctx.strokeStyle = isPlayer ? COLORS.green : COLORS.cyan;
  ctx.strokeRect(px - 6, py - 16, Math.max(44, label.length * 8), 14);

  drawText(ctx, label, px - 2 + Math.max(44, label.length * 8) / 2, py - 9, 9, COLORS.white);
}

function drawSpeechBubble(ctx, text, x, y) {
  const width = Math.min(520, Math.max(220, text.length * 8));
  const height = 34;
  const bx = clamp(x - width / 2, 10, MAP_COLS * TILE_SIZE - width - 10);
  const by = clamp(y - 58, 10, MAP_ROWS * TILE_SIZE - 80);

  ctx.fillStyle = "rgba(244,255,249,.96)";
  ctx.fillRect(bx, by, width, height);
  ctx.strokeStyle = COLORS.outline;
  ctx.lineWidth = 2;
  ctx.strokeRect(bx, by, width, height);

  ctx.fillStyle = COLORS.outline;
  ctx.beginPath();
  ctx.moveTo(x - 8, by + height);
  ctx.lineTo(x + 8, by + height);
  ctx.lineTo(x, by + height + 8);
  ctx.closePath();
  ctx.fill();

  drawText(ctx, text, bx + width / 2, by + 17, 12, COLORS.outline);
}

function createInitialPlayerPosition() {
  return { x: 15, y: 10 };
}

export function createMapSession({ container, candidates, assignmentDone, onInteract }) {
  const canvas = document.createElement("canvas");
  canvas.width = MAP_COLS * TILE_SIZE;
  canvas.height = MAP_ROWS * TILE_SIZE;
  canvas.className = "game-canvas";
  canvas.tabIndex = 0;

  container.innerHTML = "";
  container.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  const player = createInitialPlayerPosition();

  const activeCandidates = candidates.filter((candidate) => !candidate.eliminated);
  const playerCandidate = activeCandidates.find((candidate) => candidate.isPlayer);

  const npcs = activeCandidates
    .filter((candidate) => !candidate.isPlayer)
    .slice(0, npcSpots.length)
    .map((candidate, index) => ({
      ...candidate,
      ...npcSpots[index],
      spriteIndex: index
    }));

  function blocked(x, y) {
    if (x < 0 || y < 0 || x >= MAP_COLS || y >= MAP_ROWS) return true;
    if (isWaterTile(x, y)) return true;

    for (const building of buildingZones) {
      if (building.decorativeOnly) continue;
      if (isInsideRect(x, y, building)) return true;
    }

    for (const building of buildingZones.filter((building) => building.decorativeOnly)) {
      if (isInsideRect(x, y, building)) return true;
    }

    for (const npc of npcs) {
      if (npc.x === x && npc.y === y) return true;
    }

    return false;
  }

  function nearAction() {
    for (const building of buildingZones) {
      if (building.decorativeOnly) continue;

      const nearDoor = Math.abs(player.x - building.doorX) + Math.abs(player.y - building.doorY) <= 1;

      if (nearDoor) {
        const locked = building.lockedUntilAssignment && !assignmentDone;
        return {
          type: "building",
          id: building.id,
          label: building.label,
          locked
        };
      }
    }

    for (const npc of npcs) {
      if (Math.abs(player.x - npc.x) + Math.abs(player.y - npc.y) <= 1) {
        return {
          type: "candidate",
          id: npc.id,
          label: npc.name,
          locked: !assignmentDone
        };
      }
    }

    const gilles = { x: 15, y: 8 };
    if (Math.abs(player.x - gilles.x) + Math.abs(player.y - gilles.y) <= 1) {
      return {
        type: "gilles",
        id: "gilles",
        label: "Gilles",
        locked: false
      };
    }

    return null;
  }

  function move(dx, dy) {
    const nx = clamp(player.x + dx, 0, MAP_COLS - 1);
    const ny = clamp(player.y + dy, 0, MAP_ROWS - 1);

    if (!blocked(nx, ny)) {
      player.x = nx;
      player.y = ny;
      render();
    }
  }

  function handleKeyDown(event) {
    const key = event.key.toLowerCase();

    if (
      ["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d", "enter", "e"].includes(key)
    ) {
      event.preventDefault();
    }

    if (key === "arrowup" || key === "w") move(0, -1);
    if (key === "arrowdown" || key === "s") move(0, 1);
    if (key === "arrowleft" || key === "a") move(-1, 0);
    if (key === "arrowright" || key === "d") move(1, 0);

    if (key === "enter" || key === "e") {
      const action = nearAction();

      if (action) {
        onInteract(action);
      }
    }
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGround(ctx);

    // buildings behind characters
    for (const building of buildingZones) {
      drawHouse(ctx, building, assignmentDone);
    }

    drawDecor(ctx);

    // characters
    for (const npc of npcs) {
      drawCharacter(ctx, npc.x * TILE_SIZE, npc.y * TILE_SIZE, npc, {
        index: npc.spriteIndex
      });
    }

    drawCharacter(
      ctx,
      15 * TILE_SIZE,
      8 * TILE_SIZE,
      { name: "Gilles", gender: "man" },
      {
        isGilles: true
      }
    );

    drawCharacter(ctx, player.x * TILE_SIZE, player.y * TILE_SIZE, playerCandidate, {
      isPlayer: true
    });

    const action = nearAction();

    if (action) {
      const targetX =
        action.type === "candidate"
          ? npcs.find((npc) => npc.id === action.id)?.x * TILE_SIZE + 16
          : player.x * TILE_SIZE + 16;

      const targetY =
        action.type === "candidate"
          ? npcs.find((npc) => npc.id === action.id)?.y * TILE_SIZE
          : player.y * TILE_SIZE;

      const message = action.locked
        ? `${action.label}: beschikbaar na de opdracht`
        : `E/Enter: ${action.label}`;

      drawSpeechBubble(ctx, message, targetX, targetY);
    }

    // bottom panel
    ctx.fillStyle = COLORS.panel;
    ctx.fillRect(8, canvas.height - 56, canvas.width - 16, 48);

    ctx.strokeStyle = COLORS.cyan;
    ctx.lineWidth = 2;
    ctx.strokeRect(8, canvas.height - 56, canvas.width - 16, 48);

    const instruction = action
      ? action.locked
        ? `${action.label} is nog gesloten. Speel eerst de opdracht.`
        : `Druk E of Enter om te interageren met ${action.label}.`
      : "Beweeg met pijltjes of WASD. Ga naast een kandidaat of gebouw staan en druk E/Enter.";

    drawText(ctx, instruction, 22, canvas.height - 32, 13, COLORS.white, "left");
  }

  canvas.addEventListener("keydown", handleKeyDown);

  setTimeout(() => {
    canvas.focus();
  }, 0);

  render();

  return {
    destroy() {
      canvas.removeEventListener("keydown", handleKeyDown);
    }
  };
}
