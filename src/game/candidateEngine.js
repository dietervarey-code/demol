import {
  maleNames,
  femaleNames,
  jobs,
  hobbies,
  notebookColors,
  hiddenProfiles
} from "../data/names.js";

function pickRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function takeUnique(source, count) {
  return shuffle(source).slice(0, count);
}

export function createCandidates(playerName, playerGender) {
  const player = {
    id: "player",
    name: playerName || "Speler",
    gender: playerGender,
    isPlayer: true,
    isMole: false,
    eliminated: false,
    job: "onbekend",
    hobby: "onbekend",
    notebookColor: "zwart",
    hiddenProfile: {
      type: "speler",
      honesty: 1,
      memory: 1,
      confidence: 1
    },
    discoveredByPlayer: {
      job: true,
      hobby: true,
      age: true,
      notebookColor: true
    }
  };

  const neededMen = playerGender === "man" ? 4 : 5;
  const neededWomen = playerGender === "vrouw" ? 4 : 5;

  const men = takeUnique(maleNames, neededMen).map((name, index) =>
    createNpc(`m${index}`, name, "man")
  );

  const women = takeUnique(femaleNames, neededWomen).map((name, index) =>
    createNpc(`v${index}`, name, "vrouw")
  );

  const candidates = shuffle([player, ...men, ...women]);

  const possibleMoles = candidates.filter((candidate) => !candidate.isPlayer);
  const mole = pickRandom(possibleMoles);
  mole.isMole = true;
  mole.hiddenProfile = {
    type: "mol",
    honesty: 0.25,
    memory: 0.9,
    confidence: 0.88,
    description: "Probeert de groepspot laag te houden zonder ontmaskerd te worden."
  };

  return candidates;
}

function createNpc(id, name, gender) {
  return {
    id,
    name,
    gender,
    isPlayer: false,
    isMole: false,
    eliminated: false,
    age: 24 + Math.floor(Math.random() * 24),
    job: pickRandom(jobs),
    hobby: pickRandom(hobbies),
    notebookColor: pickRandom(notebookColors),
    hiddenProfile: pickRandom(hiddenProfiles),
    trustInPlayer: Math.random() * 0.5 + 0.25,
    discoveredByPlayer: {
      job: false,
      hobby: false,
      age: false,
      notebookColor: false
    },
    dailyAsked: {}
  };
}

export function getActiveCandidates(candidates) {
  return candidates.filter((candidate) => !candidate.eliminated);
}

export function getMole(candidates) {
  return candidates.find((candidate) => candidate.isMole);
}

export function markQuestionAsked(candidate, dayId, topic) {
  if (!candidate.dailyAsked[dayId]) {
    candidate.dailyAsked[dayId] = {};
  }

  candidate.dailyAsked[dayId][topic] = true;
}

export function wasQuestionAsked(candidate, dayId, topic) {
  return Boolean(candidate.dailyAsked?.[dayId]?.[topic]);
}
