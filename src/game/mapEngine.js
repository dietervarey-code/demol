const TILE_SIZE = 32;
const MAP_COLS = 28;
const MAP_ROWS = 18;

const buildingZones = [
  {
    id: "assignment",
    label: "OPDRACHT",
    x: 3,
    y: 2,
    w: 7,
    h: 4,
    doorX: 6,
    doorY: 6,
    locked: false
  },
  {
    id: "cafe",
    label: "CAFE",
    x: 17,
    y: 2,
    w: 6,
    h: 4,
    doorX: 20,
    doorY: 6,
    lockedUntilAssignment: true
  },
  {
    id: "test",
    label: "TEST",
    x: 10,
    y: 12,
    w: 7,
    h: 4,
    doorX: 13,
    doorY: 11,
    lockedUntilAssignment: true
  }
];

const npcSpots = [
  { x: 13, y: 9 },
  { x: 7, y: 9 },
  { x: 18, y: 9 },
  { x: 22, y: 10 },
  { x: 6, y: 14 },
  { x: 19, y: 14 },
  { x: 4, y: 9 },
  { x: 23, y: 13 },
  { x: 14, y: 14 }
];

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function isInsideRect(x, y, rect) {
  return x >= rect.x && x < rect.x + rect.w && y >= rect.y && y < rect.y + rect.h;
}

function drawRect(ctx, x, y, w, h, fill, stroke = "#06110f") {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 1, y + 1, w - 2, h - 2);
}

function drawText(ctx, text, x, y, size = 13, color = "#f4fff9", align = "center") {
  ctx.fillStyle = color;
  ctx.font = `700 ${size}px monospace`;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y);
}

function drawCharacter(ctx, px, py, candidate, isPlayer = false, isGilles = false) {
  const gender = candidate?.gender || "man";
  const name = candidate?.name || "?";

  const shirt = isGilles
    ? "#101010"
    : isPlayer
      ? "#22ffe6"
      : gender === "vrouw"
        ? "#b84cff"
        : "#2fb6ff";

  const hair = isGilles ? "#111" : gender === "vrouw" ? "#d6a13b" : "#5a3118";
  const skin = "#f0b37e";

  ctx.save();
  ctx.translate(px, py);

  ctx.fillStyle = "rgba(0,0,0,.28)";
  ctx.fillRect(7, 27, 18, 5);

  drawRect(ctx, 10, 12, 12, 14, shirt, "#06110f");
  drawRect(ctx, 9, 3, 14, 12, skin, "#06110f");

  ctx.fillStyle = hair;
  ctx.fillRect(8, 2, 16, 5);

  if (gender === "vrouw" && !isGilles) {
    ctx.fillRect(6, 6, 4, 12);
    ctx.fillRect(22, 6, 4, 12);
  }

  ctx.fillStyle = "#07100d";
  ctx.fillRect(12, 8, 2, 2);
  ctx.fillRect(18, 8, 2, 2);

  ctx.fillStyle = "#06110f";
  ctx.fillRect(9, 25, 5, 7);
  ctx.fillRect(18, 25, 5, 7);

  if (isPlayer) {
    ctx.strokeStyle = "#22ffe6";
    ctx.lineWidth = 2;
    ctx.strokeRect(5, 0, 22, 32);
  }

  ctx.restore();

  drawText(ctx, isPlayer ? "JIJ" : isGilles ? "GILLES" : name, px + 16, py - 8, 10, "#f4fff9");
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
  const player = { x: 13, y: 10 };

  const npcs = candidates
    .filter((candidate) => !candidate.isPlayer && !candidate.eliminated)
    .slice(0, npcSpots.length)
    .map((candidate, index) => ({ ...candidate, ...npcSpots[index] }));

  function blocked(x, y) {
    if (x < 0 || y < 0 || x >= MAP_COLS || y >= MAP_ROWS) return true;
    if (x <= 1) return true;
    if (y === 8 || x === 13) return false;

    for (const building of buildingZones) {
      if (isInsideRect(x, y, building)) return true;
    }

    return false;
  }

  function nearAction() {
    for (const building of buildingZones) {
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

  function drawGround() {
    ctx.fillStyle = "#2d6a3f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#135e76";
    ctx.fillRect(0, 0, TILE_SIZE * 2, canvas.height);

    for (let y = 0; y < MAP_ROWS; y += 1) {
      ctx.fillStyle = y % 2 ? "#1f8aa8" : "#166f8b";
      ctx.fillRect(0, y * TILE_SIZE + 8, TILE_SIZE * 2, 6);
    }

    ctx.fillStyle = "#b7a06f";
    ctx.fillRect(2 * TILE_SIZE, 8 * TILE_SIZE, TILE_SIZE * 25, TILE_SIZE);
    ctx.fillRect(13 * TILE_SIZE, 0, TILE_SIZE, TILE_SIZE * 18);

    for (let x = 0; x < MAP_COLS; x += 1) {
      for (let y = 0; y < MAP_ROWS; y += 1) {
        if ((x * 7 + y * 11) % 13 === 0) {
          ctx.fillStyle = "rgba(244,255,249,.08)";
          ctx.fillRect(x * TILE_SIZE + 7, y * TILE_SIZE + 7, 5, 5);
        }
      }
    }
  }

  function drawTreesAndDecor() {
    const trees = [
      [4, 3],
      [8, 5],
      [24, 4],
      [5, 11],
      [23, 8],
      [8, 14],
      [21, 15],
      [3, 15],
      [25, 13]
    ];

    for (const [x, y] of trees) {
      ctx.fillStyle = "#123d22";
      ctx.fillRect(x * TILE_SIZE + 9, y * TILE_SIZE + 18, 12, 12);

      ctx.fillStyle = "#1e8a46";
      ctx.fillRect(x * TILE_SIZE + 4, y * TILE_SIZE + 4, 24, 20);

      ctx.fillStyle = "#31b967";
      ctx.fillRect(x * TILE_SIZE + 10, y * TILE_SIZE, 15, 12);
    }
  }

  function drawBuildings() {
    for (const building of buildingZones) {
      const x = building.x * TILE_SIZE;
      const y = building.y * TILE_SIZE;
      const w = building.w * TILE_SIZE;
      const h = building.h * TILE_SIZE;
      const locked = building.lockedUntilAssignment && !assignmentDone;

      drawRect(ctx, x, y, w, h, locked ? "#27332f" : "#173d35", "#22ffe6");

      ctx.fillStyle = locked ? "#43524d" : "#0b211d";
      ctx.fillRect(x + 10, y + 10, w - 20, 18);

      drawText(ctx, building.label, x + w / 2, y + 19, 12, locked ? "#88a39b" : "#22ffe6");

      ctx.fillStyle = "#06110f";
      ctx.fillRect(building.doorX * TILE_SIZE + 8, building.doorY * TILE_SIZE - 10, 16, 22);
    }
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGround();
    drawBuildings();
    drawTreesAndDecor();

    for (const npc of npcs) {
      drawCharacter(ctx, npc.x * TILE_SIZE, npc.y * TILE_SIZE, npc, false, false);
    }

    drawCharacter(
      ctx,
      15 * TILE_SIZE,
      9 * TILE_SIZE,
      { name: "Gilles", gender: "man" },
      false,
      true
    );

    drawCharacter(
      ctx,
      player.x * TILE_SIZE,
      player.y * TILE_SIZE,
      candidates.find((candidate) => candidate.isPlayer),
      true,
      false
    );

    const action = nearAction();

    ctx.fillStyle = "rgba(2, 7, 6, .88)";
    ctx.fillRect(10, canvas.height - 58, canvas.width - 20, 48);

    ctx.strokeStyle = "#22ffe6";
    ctx.strokeRect(10, canvas.height - 58, canvas.width - 20, 48);

    const instruction = action
      ? action.locked
        ? `${action.label}: beschikbaar na de opdracht`
        : `Druk E/Enter voor ${action.label}`
      : "Beweeg met pijltjes of WASD. Druk E/Enter bij kandidaten of gebouwen.";

    drawText(ctx, instruction, 24, canvas.height - 33, 14, "#f4fff9", "left");
  }

  canvas.addEventListener("keydown", handleKeyDown);
  setTimeout(() => canvas.focus(), 0);

  render();

  return {
    destroy() {
      canvas.removeEventListener("keydown", handleKeyDown);
    }
  };
}
