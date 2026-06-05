import "./styles/main.css";
import { createMapSession } from "./game/mapEngine.js";

import { cities } from "./data/cities.js";
import { assignments, seasonDays } from "./data/assignments.js";

import {
  createCandidates,
  getActiveCandidates,
  getMole
} from "./game/candidateEngine.js";

import {
  getAssignmentById,
  createAssignmentRun,
  applyPlayerChoice,
  completeAssignment
} from "./game/assignmentEngine.js";

import {
  dialogueTopics,
  askCandidate,
  getCandidatePortraitStyle
} from "./game/dialogueEngine.js";

import {
  createEliminationTest,
  scoreEliminationTest,
  determineEliminatedCandidate,
  createEliminationRevealSequence,
  getRevealScreenStyle
} from "./game/eliminationEngine.js";

import {
  saveGame,
  loadGame,
  hasSavedGame,
  deleteSaveGame,
  createInitialNotebook,
  addNotebookFact,
  addNotebookRumour,
  createEmptyGameState
} from "./game/saveEngine.js";

const app = document.querySelector("#app");

let state = loadGame() || createEmptyGameState();
const audio = {
  theme: null,
  elimination: null,
  started: false
};

function initAudio() {
  if (audio.started) return;

  audio.theme = new Audio("/assets/audio/theme.mp3");
  audio.theme.loop = true;
  audio.theme.volume = 0.35;

  audio.elimination = new Audio("/assets/audio/elimination.mp3");
  audio.elimination.volume = 0.65;

  audio.theme.play().catch(() => {
    // Browser blokkeert audio tot na gebruikersactie. Dat is normaal.
  });

  audio.started = true;
}

function playEliminationMusic() {
  if (!audio.elimination) return;

  audio.elimination.currentTime = 0;
  audio.elimination.play().catch(() => {});
}

let ui = {
  selectedGender: "man",
  playerName: "",
  selectedTeamRoleId: null,
  currentPhaseIndex: 0,
  testQuestions: [],
  testAnswers: {},
  testStartTime: null,
  currentDialogueCandidateId: null,
  lastDialogueText: "",
  currentEliminationSequence: [],
  revealIndex: 0
};

function persist() {
  saveGame(state);
}

function currentSeasonDay() {
  return seasonDays[state.dayIndex] || seasonDays[seasonDays.length - 1];
}

function currentCity() {
  const day = currentSeasonDay();
  return cities.find((city) => city.id === day.cityId) || cities[0];
}

function currentAssignment() {
  const day = currentSeasonDay();
  if (!day.assignmentId) return assignments[0];
  return getAssignmentById(day.assignmentId) || assignments[0];
}

function render() {
  if (state.phase === "intro") return renderIntro();
  if (state.phase === "create-player") return renderCreatePlayer();
  if (state.phase === "day-start") return renderDayStart();
  if (state.phase === "map") return renderMap();
  if (state.phase === "assignment-briefing") return renderAssignmentBriefing();
  if (state.phase === "team-choice") return renderTeamChoice();
  if (state.phase === "assignment-phase") return renderAssignmentPhase();
  if (state.phase === "assignment-code") return renderAssignmentCode();
  if (state.phase === "assignment-result") return renderAssignmentResult();
  if (state.phase === "cafe") return renderCafe();
  if (state.phase === "dialogue") return renderDialogue();
  if (state.phase === "notebook") return renderNotebook();
  if (state.phase === "test") return renderTest();
  if (state.phase === "elimination") return renderElimination();
  if (state.phase === "reunion") return renderReunion();

  return renderIntro();
}

function shell(content, options = {}) {
  const city = currentCity();
  const active = state.candidates?.length ? getActiveCandidates(state.candidates) : [];

  app.innerHTML = `
    <div class="game-shell">
      <header class="topbar">
        <div>
          <div class="logo-mark">DE MOL</div>
          <div class="subtitle">Hongarije</div>
        </div>
        <div class="topbar-info">
          <span>Dag ${state.dayIndex + 1}</span>
          <span>${city.name}</span>
          <span>Pot: €${state.groupPot || 0}</span>
        </div>
      </header>

      <main class="layout ${options.wide ? "layout-wide" : ""}">
        <section class="main-panel">
          ${content}
        </section>

        <aside class="side-panel">
          <h3>Kandidaten</h3>
          <div class="candidate-list">
            ${
              active.length
                ? active
                    .map(
                      (candidate) => `
                        <div class="candidate-row ${candidate.isPlayer ? "is-player" : ""}">
                          <span>${candidate.name}</span>
                          <small>${candidate.isPlayer ? "jij" : candidate.gender}</small>
                        </div>
                      `
                    )
                    .join("")
                : `<p class="muted">Nog geen kandidaten.</p>`
            }
          </div>

          <button data-action="notebook" class="secondary full">Molboekje</button>
          <button data-action="save" class="secondary full">Opslaan</button>
        </aside>
      </main>
    </div>
  `;

  bindGlobalButtons();
}

function bindGlobalButtons() {
  const notebookButton = document.querySelector('[data-action="notebook"]');
  if (notebookButton) {
    notebookButton.addEventListener("click", () => {
      state.previousPhase = state.phase;
      state.phase = "notebook";
      render();
    });
  }

  const saveButton = document.querySelector('[data-action="save"]');
  if (saveButton) {
    saveButton.addEventListener("click", () => {
      persist();
      alert("Spel opgeslagen.");
    });
  }
}

function renderIntro() {
  const continueButton = hasSavedGame()
    ? `<button data-action="continue" class="secondary">Verder spelen</button>`
    : "";

  app.innerHTML = `
    <div class="intro-screen">
      <div class="intro-card">
        <div class="logo-wrap">
          <img src="/assets/logo/logo.png" alt="De Mol logo" onerror="this.style.display='none'" />
          <div class="logo-mark big">DE MOL</div>
        </div>
        <h1>Hongarije</h1>

        <p>Al jaren proberen kandidaten één vraag te beantwoorden.</p>
        <p><strong>Wie is De Mol?</strong></p>
        <p>Dit jaar trekt een groep onbekenden door Hongarije. Tussen oude bruggen, wijnkelders, markten en donkere cafés probeert één kandidaat de groepspot zo laag mogelijk te houden.</p>
        <p>Negen kandidaten willen geld verdienen. Eén kandidaat wil dat verhinderen.</p>

        <div class="button-row">
          <button data-action="new">Nieuw spel</button>
          ${continueButton}
        </div>
      </div>
    </div>
  `;

  document.querySelector('[data-action="new"]').addEventListener("click", () => {
    initAudio();
    deleteSaveGame();
    state = createEmptyGameState();
    state.phase = "create-player";
    render();
  });

  const continueEl = document.querySelector('[data-action="continue"]');
  if (continueEl) {
    continueEl.addEventListener("click", () => {
      initAudio();
      state = loadGame() || createEmptyGameState();
      render();
    });
  }
}

function renderCreatePlayer() {
  app.innerHTML = `
    <div class="intro-screen">
      <div class="intro-card">
        <h1>Jij bent kandidaat</h1>
        <p>Voor de reis begint, wil Gilles weten wie jij bent.</p>

        <label class="form-label">
          Naam
          <input id="player-name" value="${ui.playerName}" placeholder="Vul je naam in" />
        </label>

        <div class="choice-grid two">
          <button data-gender="man" class="${ui.selectedGender === "man" ? "selected" : ""}">Man</button>
          <button data-gender="vrouw" class="${ui.selectedGender === "vrouw" ? "selected" : ""}">Vrouw</button>
        </div>

        <button data-action="start-season" class="primary full">Start het avontuur</button>
      </div>
    </div>
  `;

  document.querySelectorAll("[data-gender]").forEach((button) => {
    button.addEventListener("click", () => {
      ui.selectedGender = button.dataset.gender;
      ui.playerName = document.querySelector("#player-name").value;
      renderCreatePlayer();
    });
  });

  document.querySelector("#player-name").addEventListener("input", (event) => {
    ui.playerName = event.target.value;
  });

  document.querySelector('[data-action="start-season"]').addEventListener("click", () => {
    const name = document.querySelector("#player-name").value.trim();

    if (!name) {
      alert("Vul eerst je naam in.");
      return;
    }

    state.player = {
      name,
      gender: ui.selectedGender
    };
    state.candidates = createCandidates(name, ui.selectedGender);
    state.notebook = createInitialNotebook(state.candidates);
    state.dayIndex = 0;
    state.groupPot = 0;
    state.phase = "day-start";
    persist();
    render();
  });
}

function renderDayStart() {
  const day = currentSeasonDay();
  const city = currentCity();

  shell(`
    <div class="city-intro">
      <h1>Dag ${state.dayIndex + 1}: ${day.title}</h1>
      <h2>${city.name}</h2>
      <p>${city.description}</p>
      <div class="pixel-panorama ${city.mapTheme}">
        <div class="pixel-sun"></div>
        <div class="pixel-water"></div>
        <div class="pixel-buildings"></div>
      </div>
      <p class="gilles-line">Gilles: "Welkom in ${city.name}. Vandaag begint een nieuwe kans om geld te verdienen... of om het te verliezen."</p>
      <button data-action="to-map" class="primary">Naar de locatie</button>
    </div>
  `);

  document.querySelector('[data-action="to-map"]').addEventListener("click", () => {
    state.phase = "map";
    persist();
    render();
  });
}

function renderMap() {
  const city = currentCity();
  const assignmentDone = state.assignmentCompletedToday;

  shell(`
    <div class="map-wrap">
      <div id="canvas-map" class="canvas-map-shell"></div>

      <div class="text-box">
        <strong>${city.name}</strong>
        <p>Beweeg met pijltjes of WASD. Druk op E of Enter om met kandidaten, gebouwen of Gilles te interageren.</p>
        ${
          assignmentDone
            ? `<p>De opdracht is gespeeld. Je kan nu kandidaten ondervragen in het café of op de kaart.</p>`
            : `<p>Je kan pas met kandidaten praten na de opdracht.</p>`
        }
      </div>
    </div>
  `, { wide: true });

  const container = document.querySelector("#canvas-map");

  createMapSession({
    container,
    candidates: state.candidates,
    assignmentDone,
    onInteract(action) {
      if (action.locked) {
        alert("Dit is pas beschikbaar na de opdracht.");
        return;
      }

      if (action.type === "building" && action.id === "assignment") {
        if (state.assignmentCompletedToday) {
          alert("De opdracht van vandaag is al gespeeld.");
          return;
        }

        state.phase = "assignment-briefing";
        render();
        return;
      }

      if (action.type === "building" && action.id === "cafe") {
        state.phase = "cafe";
        render();
        return;
      }

      if (action.type === "building" && action.id === "test") {
        ui.testQuestions = createEliminationTest({
          candidates: state.candidates,
          assignmentRun: state.currentAssignmentRun
        });
        ui.testAnswers = {};
        ui.testStartTime = Date.now();
        state.phase = "test";
        render();
        return;
      }

      if (action.type === "candidate") {
        ui.currentDialogueCandidateId = action.id;
        ui.lastDialogueText = "";
        state.phase = "dialogue";
        render();
      }
    }
  });
}

function renderAssignmentBriefing() {
  const assignment = currentAssignment();

  shell(`
    <div class="story-card">
      <h1>${assignment.title}</h1>
      <p class="location-label">${assignment.locationName}</p>
      <p>${assignment.intro}</p>
      <p class="gilles-line">${assignment.briefing}</p>
      <button data-action="choose-team" class="primary">Teams verdelen</button>
    </div>
  `);

  document.querySelector('[data-action="choose-team"]').addEventListener("click", () => {
    state.phase = "team-choice";
    render();
  });
}

function renderTeamChoice() {
  const assignment = currentAssignment();

  shell(`
    <h1>Kies je team</h1>
    <p>Je kiest waar je zelf meedoet. De overige kandidaten worden verdeeld over de andere rollen.</p>

    <div class="choice-grid">
      ${assignment.teamRoles
        .map(
          (role) => `
            <button data-team="${role.id}" class="${ui.selectedTeamRoleId === role.id ? "selected" : ""}">
              <strong>${role.name}</strong>
              <span>${role.role}</span>
            </button>
          `
        )
        .join("")}
    </div>

    <button data-action="start-assignment" class="primary full">Start de opdracht</button>
  `);

  document.querySelectorAll("[data-team]").forEach((button) => {
    button.addEventListener("click", () => {
      ui.selectedTeamRoleId = button.dataset.team;
      renderTeamChoice();
    });
  });

  document.querySelector('[data-action="start-assignment"]').addEventListener("click", () => {
    const selected = ui.selectedTeamRoleId || assignment.teamRoles[0].id;
    state.currentAssignmentRun = createAssignmentRun(
      assignment,
      state.candidates,
      selected
    );
    ui.currentPhaseIndex = 0;
    state.phase = "assignment-phase";
    persist();
    render();
  });
}

function renderAssignmentPhase() {
  const assignment = currentAssignment();
  const phase = assignment.phases[ui.currentPhaseIndex];

  if (!phase) {
    state.phase = "assignment-code";
    render();
    return;
  }

  const run = state.currentAssignmentRun;
  const phaseReport = run.phaseReports.find((report) => report.phaseId === phase.id);

  shell(`
    <div class="story-card">
      <p class="location-label">Fase ${ui.currentPhaseIndex + 1} van ${assignment.phases.length}</p>
      <h1>${assignment.title}</h1>
      <p>${phase.scene}</p>

      <div class="npc-reactions">
        ${phaseReport.witnesses
          .slice(0, 2)
          .map((witness) => `<p>${witness.statement}</p>`)
          .join("")}
      </div>

      <h3>Wat doe jij?</h3>
      <div class="choice-grid">
        ${phase.choices
          .map(
            (choice) => `
              <button data-choice="${choice.id}">
                ${choice.label}
              </button>
            `
          )
          .join("")}
      </div>
    </div>
  `);

  document.querySelectorAll("[data-choice]").forEach((button) => {
    button.addEventListener("click", () => {
      const choice = phase.choices.find((item) => item.id === button.dataset.choice);
      const observation = applyPlayerChoice(state.currentAssignmentRun, phase, choice);

      if (observation.playerSawDigit) {
        addNotebookFact(
          state,
          "assignment",
          `Fase ${ui.currentPhaseIndex + 1}: je zag zelf ${observation.playerSawDigit}`
        );
      }

      ui.currentPhaseIndex += 1;
      persist();
      renderAssignmentPhase();
    });
  });
}

function renderAssignmentCode() {
  const assignment = currentAssignment();

  shell(`
    <div class="story-card">
      <h1>Eindantwoord</h1>
      <p>De groep moet nu één definitieve code ingeven. Denk terug aan wat je zelf zag en wat kandidaten vertelden.</p>
      <p>Per juist cijfer op de juiste positie verdient de groep €${assignment.rewardPerCorrectDigit}. De volledige code levert nog eens €${assignment.fullCodeBonus} extra op.</p>

      <label class="form-label">
        Code
        <input id="final-code" maxlength="4" placeholder="Bijv. XXXX" inputmode="numeric" />
      </label>

      <button data-action="submit-code" class="primary full">Code bevestigen</button>
    </div>
  `);

  document.querySelector('[data-action="submit-code"]').addEventListener("click", () => {
    const code = document.querySelector("#final-code").value;
    const result = completeAssignment(assignment, state.currentAssignmentRun, code);
    state.groupPot += result.totalReward;
    state.assignmentCompletedToday = true;
    state.cafeUnlocked = true;
    state.phase = "assignment-result";
    persist();
    render();
  });
}

function renderAssignmentResult() {
  const result = state.currentAssignmentRun.result;

  shell(`
    <div class="story-card">
      <h1>Verslag door Gilles</h1>
      ${result.gillesBreakdown.map((line) => `<p class="gilles-line">${line}</p>`).join("")}
      <button data-action="to-cafe" class="primary">Naar het café</button>
      <button data-action="to-map" class="secondary">Terug naar kaart</button>
    </div>
  `);

  document.querySelector('[data-action="to-cafe"]').addEventListener("click", () => {
    state.phase = "cafe";
    render();
  });

  document.querySelector('[data-action="to-map"]').addEventListener("click", () => {
    state.phase = "map";
    render();
  });
}

function renderCafe() {
  const npcs = getActiveCandidates(state.candidates).filter((candidate) => !candidate.isPlayer);

  shell(`
    <div class="cafe-scene">
      <h1>Café</h1>
      <p>Na de opdracht praten de kandidaten na. Iedereen heeft zijn eigen versie van wat er gebeurde.</p>

      <div class="cafe-room">
        <div class="bar-counter"></div>
        ${npcs
          .map(
            (candidate, index) => `
              <button class="cafe-candidate c${index}" data-candidate="${candidate.id}">
                ${candidate.name}
              </button>
            `
          )
          .join("")}
      </div>

      <button data-action="to-map" class="secondary">Terug naar kaart</button>
    </div>
  `);

  document.querySelectorAll("[data-candidate]").forEach((button) => {
    button.addEventListener("click", () => {
      ui.currentDialogueCandidateId = button.dataset.candidate;
      ui.lastDialogueText = "";
      state.phase = "dialogue";
      render();
    });
  });

  document.querySelector('[data-action="to-map"]').addEventListener("click", () => {
    state.phase = "map";
    render();
  });
}

function renderDialogue() {
  const candidate = state.candidates.find(
    (item) => item.id === ui.currentDialogueCandidateId
  );
  const portrait = getCandidatePortraitStyle(candidate);
  const dayId = `day_${state.dayIndex + 1}`;

  shell(`
    <div class="dialogue-screen">
      <div class="portrait" style="background:${portrait.background}">
        ${portrait.initials}
      </div>

      <div class="dialogue-content">
        <h1>${candidate.name}</h1>
        <p class="muted">Kies wat je wil vragen. Elke vraag kan vandaag maar één keer echt beantwoord worden.</p>

        <div class="dialogue-answer">
          ${ui.lastDialogueText || `${candidate.name} kijkt je afwachtend aan.`}
        </div>

        <div class="choice-grid">
          ${dialogueTopics
            .map(
              (topic) => `
                <button data-topic="${topic.id}">
                  ${topic.label}
                </button>
              `
            )
            .join("")}
        </div>

        <button data-action="back-cafe" class="secondary full">Terug naar café</button>
      </div>
    </div>
  `, { wide: true });

  document.querySelectorAll("[data-topic]").forEach((button) => {
    button.addEventListener("click", () => {
      const response = askCandidate({
        candidate,
        dayId,
        topicId: button.dataset.topic,
        assignmentRun: state.currentAssignmentRun,
        candidates: state.candidates
      });

      ui.lastDialogueText = response.text;

      if (!response.repeated) {
        if (button.dataset.topic === "personal_job") {
          addNotebookFact(state, candidate.id, `Beroep: ${candidate.job}`);
        }
        if (button.dataset.topic === "personal_hobby") {
          addNotebookFact(state, candidate.id, `Hobby: ${candidate.hobby}`);
        }
        if (button.dataset.topic === "personal_age") {
          addNotebookFact(state, candidate.id, `Leeftijd: ${candidate.age}`);
        }
        if (button.dataset.topic === "personal_notebook") {
          addNotebookFact(state, candidate.id, `Molboekje: ${candidate.notebookColor}`);
        }
        if (button.dataset.topic.startsWith("task_")) {
          addNotebookRumour(state, candidate.id, response.text);
        }
      }

      persist();
      renderDialogue();
    });
  });

  document.querySelector('[data-action="back-cafe"]').addEventListener("click", () => {
    state.phase = "cafe";
    render();
  });
}

function renderNotebook() {
  const npcs = state.candidates.filter((candidate) => !candidate.isPlayer);
  const previous = state.previousPhase || "map";

  shell(`
    <h1>Molboekje</h1>
    <p>Noteer wat je ontdekt. Feiten zijn niet altijd hetzelfde als geruchten.</p>

    <label class="form-label">
      Vrije notities
      <textarea id="free-notes" rows="5">${state.notebook?.freeNotes || ""}</textarea>
    </label>

    <div class="notebook-grid">
      ${npcs
        .map((candidate) => {
          const notes = state.notebook?.candidateNotes?.[candidate.id];
          return `
            <article class="notebook-card">
              <h3>${candidate.name}</h3>
              <p><strong>Verdacht:</strong> ${notes?.suspicion || 0}/100</p>
              <p><strong>Feiten:</strong></p>
              <ul>${(notes?.discoveredFacts || []).map((fact) => `<li>${fact}</li>`).join("") || "<li>Nog niets zeker.</li>"}</ul>
              <p><strong>Geruchten:</strong></p>
              <ul>${(notes?.rumours || []).slice(-3).map((rumour) => `<li>${rumour}</li>`).join("") || "<li>Nog geen.</li>"}</ul>
            </article>
          `;
        })
        .join("")}
    </div>

    <button data-action="back" class="primary">Terug</button>
  `, { wide: true });

  document.querySelector("#free-notes").addEventListener("input", (event) => {
    state.notebook.freeNotes = event.target.value;
    persist();
  });

  document.querySelector('[data-action="back"]').addEventListener("click", () => {
    state.phase = previous;
    state.previousPhase = null;
    render();
  });
}

function renderTest() {
  const questionIndex = Object.keys(ui.testAnswers).length;
  const question = ui.testQuestions[questionIndex];

  if (!question) {
    const playerScore = scoreEliminationTest(ui.testQuestions, ui.testAnswers);
    const elapsed = Math.round((Date.now() - ui.testStartTime) / 1000);

    const result = determineEliminatedCandidate({
      candidates: state.candidates,
      questions: ui.testQuestions,
      playerScore,
      playerTimeSeconds: elapsed
    });

    state.eliminatedHistory.push({
      day: state.dayIndex + 1,
      candidateName: result.eliminatedCandidate.name,
      playerEliminated: result.playerEliminated
    });

    state.reunionLog.push({
      day: state.dayIndex + 1,
      city: currentCity().name,
      assignment: currentAssignment().title,
      assignmentResult: state.currentAssignmentRun?.result,
      mole: getMole(state.candidates).name,
      eliminated: result.eliminatedCandidate.name,
      playerScore
    });

    ui.currentEliminationSequence = createEliminationRevealSequence({
      candidates: state.candidates,
      eliminatedCandidate: result.eliminatedCandidate
    });
    ui.revealIndex = 0;
    state.phase = "elimination";
    persist();
    render();
    return;
  }

  shell(`
    <div class="test-screen">
      <p class="location-label">Vraag ${questionIndex + 1} van ${ui.testQuestions.length}</p>
      <h1>${question.text}</h1>

      <div class="choice-grid">
        ${question.answers
          .map(
            (answer) => `
              <button data-answer="${answer.id}">
                ${answer.label}
              </button>
            `
          )
          .join("")}
      </div>
    </div>
  `);

  document.querySelectorAll("[data-answer]").forEach((button) => {
    button.addEventListener("click", () => {
      ui.testAnswers[question.id] = button.dataset.answer;
      renderTest();
    });
  });
}

function renderElimination() {
  if (ui.revealIndex === 0) {
  playEliminationMusic();
  }
  const item = ui.currentEliminationSequence[ui.revealIndex];

  if (!item) {
    const lastElimination = state.eliminatedHistory[state.eliminatedHistory.length - 1];

    shell(`
      <div class="story-card">
        <h1>De eliminatie is voorbij</h1>
        <p>${lastElimination.candidateName} verlaat het spel.</p>
        ${
          lastElimination.playerEliminated
            ? `<p class="danger">Jouw avontuur eindigt hier.</p><button data-action="reunion" class="primary">Enkele weken later...</button>`
            : `<button data-action="next-day" class="primary">Naar de volgende dag</button>`
        }
      </div>
    `);

    const next = document.querySelector('[data-action="next-day"]');
    if (next) {
      next.addEventListener("click", () => {
        goToNextDay();
      });
    }

    const reunion = document.querySelector('[data-action="reunion"]');
    if (reunion) {
      reunion.addEventListener("click", () => {
        state.phase = "reunion";
        render();
      });
    }

    return;
  }

  const finalFrame = item.typingFrames[item.typingFrames.length - 1];
  const style = getRevealScreenStyle(item.color);

  shell(`
    <div class="elimination-stage">
      <h1>Eliminatie</h1>
      <p>Gilles typt de naam in...</p>

      <div class="name-screen" id="name-screen"></div>
      <div class="color-screen hidden" id="color-screen" style="background:${style.background}; border-color:${style.border};">
        ${style.label}
      </div>

      <button data-action="start-reveal" class="primary">Toon scherm</button>
    </div>
  `);

  document.querySelector('[data-action="start-reveal"]').addEventListener("click", () => {
    animateNameReveal(item, finalFrame);
  });
}

function animateNameReveal(item) {
  const nameScreen = document.querySelector("#name-screen");
  const colorScreen = document.querySelector("#color-screen");
  const button = document.querySelector('[data-action="start-reveal"]');
  button.disabled = true;

  let index = 0;

  const interval = setInterval(() => {
    nameScreen.textContent = item.typingFrames[index];
    index += 1;

    if (index >= item.typingFrames.length) {
      clearInterval(interval);

      setTimeout(() => {
        colorScreen.classList.remove("hidden");

        setTimeout(() => {
          ui.revealIndex += 1;
          renderElimination();
        }, 1300);
      }, 500);
    }
  }, 180);
}

function goToNextDay() {
  state.dayIndex += 1;

  if (state.dayIndex >= seasonDays.length) {
    state.phase = "reunion";
  } else {
    state.currentAssignmentRun = null;
    state.assignmentCompletedToday = false;
    state.cafeUnlocked = false;
    state.testCompletedToday = false;
    ui.selectedTeamRoleId = null;
    ui.currentPhaseIndex = 0;
    state.phase = "day-start";
  }

  persist();
  render();
}

function renderReunion() {
  const mole = getMole(state.candidates);
  const finalPot = state.groupPot;

  shell(`
    <div class="story-card reunion">
      <p class="location-label">Enkele weken later...</p>
      <h1>De reünie</h1>

      <p>De kandidaten zitten opnieuw samen. Geen opdrachten meer. Geen test. Alleen nog de waarheid.</p>

      <p class="gilles-line">Gilles: "De Mol van dit seizoen was... <strong>${mole.name}</strong>."</p>

      <p>De groep eindigde met een pot van <strong>€${finalPot}</strong>.</p>

      <h2>Wat gebeurde er onderweg?</h2>

      ${
        state.reunionLog.length
          ? state.reunionLog
              .map(
                (log) => `
                  <article class="reunion-day">
                    <h3>Dag ${log.day} — ${log.city}</h3>
                    <p>In ${log.assignment} koos de groep voor code ${log.assignmentResult?.enteredCode || "onbekend"}.</p>
                    <p>De juiste code was ${log.assignmentResult?.correctCode || "onbekend"}. De opdracht bracht €${log.assignmentResult?.totalReward || 0} op.</p>
                    <p>${log.eliminated} moest die avond het spel verlaten.</p>
                  </article>
                `
              )
              .join("")
          : `<p>Er zijn nog geen gespeelde opdrachten om te bespreken.</p>`
      }

      <p class="gilles-line">Gilles: "Soms lag de waarheid gewoon op tafel. Maar zoals altijd bij De Mol: je moest durven kijken."</p>

      <button data-action="restart" class="primary">Nieuw spel</button>
    </div>
  `, { wide: true });

  document.querySelector('[data-action="restart"]').addEventListener("click", () => {
    deleteSaveGame();
    state = createEmptyGameState();
    ui = {
      selectedGender: "man",
      playerName: "",
      selectedTeamRoleId: null,
      currentPhaseIndex: 0,
      testQuestions: [],
      testAnswers: {},
      testStartTime: null,
      currentDialogueCandidateId: null,
      lastDialogueText: "",
      currentEliminationSequence: [],
      revealIndex: 0
    };
    render();
  });
}

render();
