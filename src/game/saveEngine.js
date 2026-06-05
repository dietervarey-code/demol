const SAVE_KEY = "de-mol-hongarije-v9-save";

export function saveGame(state) {
  try {
    const savePayload = {
      version: "0.9.0",
      savedAt: new Date().toISOString(),
      state
    };

    localStorage.setItem(SAVE_KEY, JSON.stringify(savePayload));

    return {
      ok: true,
      savedAt: savePayload.savedAt
    };
  } catch (error) {
    console.error("Kon spel niet opslaan:", error);

    return {
      ok: false,
      error
    };
  }
}

export function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);

    if (!raw) {
      return null;
    }

    const payload = JSON.parse(raw);

    if (!payload || payload.version !== "0.9.0") {
      return null;
    }

    return payload.state;
  } catch (error) {
    console.error("Kon spel niet laden:", error);
    return null;
  }
}

export function hasSavedGame() {
  return Boolean(localStorage.getItem(SAVE_KEY));
}

export function deleteSaveGame() {
  try {
    localStorage.removeItem(SAVE_KEY);

    return {
      ok: true
    };
  } catch (error) {
    console.error("Kon savegame niet verwijderen:", error);

    return {
      ok: false,
      error
    };
  }
}

export function createInitialNotebook(candidates) {
  const candidateNotes = {};

  for (const candidate of candidates) {
    if (candidate.isPlayer) continue;

    candidateNotes[candidate.id] = {
      suspicion: 0,
      freeText: "",
      discoveredFacts: [],
      rumours: []
    };
  }

  return {
    freeNotes: "",
    candidateNotes
  };
}

export function addNotebookFact(state, candidateId, fact) {
  const notes = state.notebook?.candidateNotes?.[candidateId];

  if (!notes) {
    return;
  }

  if (!notes.discoveredFacts.includes(fact)) {
    notes.discoveredFacts.push(fact);
  }
}

export function addNotebookRumour(state, candidateId, rumour) {
  const notes = state.notebook?.candidateNotes?.[candidateId];

  if (!notes) {
    return;
  }

  if (!notes.rumours.includes(rumour)) {
    notes.rumours.push(rumour);
  }
}

export function updateSuspicion(state, candidateId, amount) {
  const notes = state.notebook?.candidateNotes?.[candidateId];

  if (!notes) {
    return;
  }

  notes.suspicion = Math.max(0, Math.min(100, notes.suspicion + amount));
}

export function setCandidateNote(state, candidateId, text) {
  const notes = state.notebook?.candidateNotes?.[candidateId];

  if (!notes) {
    return;
  }

  notes.freeText = text;
}

export function setFreeNotebookNotes(state, text) {
  if (!state.notebook) {
    return;
  }

  state.notebook.freeNotes = text;
}

export function createEmptyGameState() {
  return {
    phase: "intro",
    dayIndex: 0,
    groupPot: 0,
    player: null,
    candidates: [],
    currentAssignmentRun: null,
    assignmentCompletedToday: false,
    cafeUnlocked: false,
    testCompletedToday: false,
    eliminatedHistory: [],
    notebook: null,
    reunionLog: []
  };
}
