import { getActiveCandidates, getMole } from "./candidateEngine.js";

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function unique(array) {
  return [...new Set(array)];
}

function pickRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getAgeGroup(age) {
  if (age < 30) return "jonger dan 30";
  if (age < 36) return "30 tot en met 35";
  if (age < 42) return "36 tot en met 41";
  return "42 of ouder";
}

function ensureAtLeastThreeAnswers(answers, fallbackAnswers) {
  const merged = [...answers];

  for (const fallback of fallbackAnswers) {
    if (merged.length >= 3) break;

    const alreadyExists = merged.some((answer) => answer.label === fallback.label);
    if (!alreadyExists) {
      merged.push(fallback);
    }
  }

  return merged.slice(0, Math.max(3, merged.length));
}

function createGroupedAnswers({
  id,
  correctValue,
  allValues,
  groupSize = 3,
  fallbackValues = []
}) {
  const values = unique([...allValues, ...fallbackValues]).filter(Boolean);
  const shuffledValues = shuffle(values);

  let groups = [];

  for (let index = 0; index < shuffledValues.length; index += groupSize) {
    groups.push(shuffledValues.slice(index, index + groupSize));
  }

  let correctGroup = groups.find((group) => group.includes(correctValue));

  if (!correctGroup) {
    correctGroup = [correctValue];
    groups.push(correctGroup);
  }

  // Vermijd 1 antwoordoptie. Dat zou kandidaten uitsluiten.
  if (groups.length < 3) {
    const fallbackGroups = [
      ["rood", "groen", "zwart"],
      ["blauw", "geel", "wit"],
      ["paars", "oranje", "bruin"],
      ["jonger dan 30", "30 tot en met 35"],
      ["36 tot en met 41", "42 of ouder"]
    ];

    for (const fallbackGroup of fallbackGroups) {
      if (groups.length >= 3) break;

      const overlaps = fallbackGroup.some((value) =>
        groups.flat().includes(value)
      );

      if (!overlaps) {
        groups.push(fallbackGroup);
      }
    }
  }

  const answers = groups.map((group, index) => ({
    id: `${id}_${index}`,
    label: group.join(" / "),
    values: group,
    correct: group.includes(correctValue)
  }));

  return shuffle(answers);
}

function createGroupedQuestion({
  id,
  text,
  correctValue,
  allValues,
  fallbackValues = []
}) {
  return {
    id,
    text,
    type: "grouped",
    answers: createGroupedAnswers({
      id,
      correctValue,
      allValues,
      fallbackValues
    })
  };
}

function createGenderQuestion(mole) {
  return {
    id: "mole_gender",
    text: "Is De Mol een man of een vrouw?",
    type: "single",
    answers: [
      {
        id: "man",
        label: "Man",
        correct: mole.gender === "man"
      },
      {
        id: "vrouw",
        label: "Vrouw",
        correct: mole.gender === "vrouw"
      },
      {
        id: "onbekend",
        label: "Dat weet ik niet zeker",
        correct: false
      }
    ]
  };
}

function createAgeQuestion(activeCandidates, mole) {
  return createGroupedQuestion({
    id: "mole_age",
    text: "In welke leeftijdsgroep zit De Mol?",
    correctValue: getAgeGroup(mole.age),
    allValues: activeCandidates.map((candidate) => getAgeGroup(candidate.age)),
    fallbackValues: [
      "jonger dan 30",
      "30 tot en met 35",
      "36 tot en met 41",
      "42 of ouder"
    ]
  });
}

function createJobQuestion(activeCandidates, mole) {
  return createGroupedQuestion({
    id: "mole_job",
    text: "In welke beroepsgroep zit De Mol?",
    correctValue: mole.job,
    allValues: activeCandidates.map((candidate) => candidate.job),
    fallbackValues: [
      "architect",
      "leerkracht",
      "verpleegkundige",
      "marketeer",
      "ingenieur",
      "boekhouder",
      "projectleider",
      "fotograaf",
      "kok"
    ]
  });
}

function createHobbyQuestion(activeCandidates, mole) {
  return createGroupedQuestion({
    id: "mole_hobby",
    text: "Welke hobby hoort bij De Mol?",
    correctValue: mole.hobby,
    allValues: activeCandidates.map((candidate) => candidate.hobby),
    fallbackValues: [
      "klimmen",
      "lopen",
      "schaken",
      "fotografie",
      "kajakken",
      "koken",
      "theater",
      "piano",
      "wielrennen"
    ]
  });
}

function createNotebookColorQuestion(activeCandidates, mole) {
  return createGroupedQuestion({
    id: "mole_notebook",
    text: "Welke kleur heeft het Molboekje van De Mol?",
    correctValue: mole.notebookColor,
    allValues: activeCandidates.map((candidate) => candidate.notebookColor),
    fallbackValues: [
      "rood",
      "groen",
      "zwart",
      "blauw",
      "geel",
      "wit",
      "paars",
      "oranje",
      "bruin"
    ]
  });
}

function createTeamQuestion(mole, assignmentRun) {
  const moleTeam = assignmentRun.teams.find((team) =>
    team.members.some((member) => member.id === mole.id)
  );

  return createGroupedQuestion({
    id: "mole_team",
    text: "In welk team zat De Mol tijdens de opdracht?",
    correctValue: moleTeam?.name || "onbekend",
    allValues: assignmentRun.teams.map((team) => team.name),
    fallbackValues: [
      "Team Controle",
      "Team Koffer",
      "Team Markt",
      "Team Route",
      "Team Archief",
      "Team Kluis"
    ]
  });
}

function createRoleQuestion(mole, assignmentRun) {
  const moleTeam = assignmentRun.teams.find((team) =>
    team.members.some((member) => member.id === mole.id)
  );

  return createGroupedQuestion({
    id: "mole_role",
    text: "Welke rol had het team van De Mol tijdens de opdracht?",
    correctValue: moleTeam?.role || "onbekend",
    allValues: assignmentRun.teams.map((team) => team.role),
    fallbackValues: [
      "zocht naar fysieke aanwijzingen",
      "controleerde de volgorde",
      "bewaakte de tijd",
      "las documenten",
      "ondervroeg figuranten",
      "vergeleek symbolen"
    ]
  });
}

function createCodeReportQuestion(mole, assignmentRun) {
  const moleReports = assignmentRun.phaseReports
    .flatMap((phase) => phase.witnesses)
    .filter((report) => report.candidateId === mole.id);

  const allReports = assignmentRun.phaseReports.flatMap((phase) =>
    phase.witnesses.map(
      (report) => `positie ${report.phaseNumber + 1}: ${report.reportedDigit}`
    )
  );

  const correctValue =
    moleReports.length > 0
      ? pickRandom(
          moleReports.map(
            (report) => `positie ${report.phaseNumber + 1}: ${report.reportedDigit}`
          )
        )
      : "De Mol gaf geen duidelijk codefragment door";

  return createGroupedQuestion({
    id: "mole_code_report",
    text: "Welk codefragment werd door De Mol genoemd of bevestigd?",
    correctValue,
    allValues: [
      ...allReports,
      "De Mol gaf geen duidelijk codefragment door"
    ],
    fallbackValues: [
      "positie 1: 1",
      "positie 1: 2",
      "positie 2: 3",
      "positie 2: 4",
      "positie 3: 5",
      "positie 3: 6",
      "positie 4: 7",
      "positie 4: 8"
    ]
  });
}

function createCandidateBehaviourQuestion(activeCandidates, mole) {
  return createGroupedQuestion({
    id: "mole_profile_hint",
    text: "Welk gedragstype past het best bij De Mol?",
    correctValue: mole.hiddenProfile.type,
    allValues: activeCandidates.map((candidate) => candidate.hiddenProfile.type),
    fallbackValues: [
      "eerlijk",
      "observator",
      "verward",
      "strategisch",
      "bedrieglijk",
      "stresskip",
      "mol"
    ]
  });
}

function createFinalMoleQuestion(activeCandidates, mole) {
  return {
    id: "final_mole",
    text: "Wie is De Mol?",
    type: "final",
    answers: shuffle(
      activeCandidates
        .filter((candidate) => !candidate.isPlayer)
        .map((candidate) => ({
          id: candidate.id,
          label: candidate.name,
          correct: candidate.id === mole.id
        }))
    )
  };
}

export function createEliminationTest({ candidates, assignmentRun }) {
  const activeCandidates = getActiveCandidates(candidates);
  const mole = getMole(candidates);

  const questionPool = [
    createGenderQuestion(mole),
    createAgeQuestion(activeCandidates, mole),
    createJobQuestion(activeCandidates, mole),
    createHobbyQuestion(activeCandidates, mole),
    createNotebookColorQuestion(activeCandidates, mole),
    createCandidateBehaviourQuestion(activeCandidates, mole)
  ];

  if (assignmentRun) {
    questionPool.push(createTeamQuestion(mole, assignmentRun));
    questionPool.push(createRoleQuestion(mole, assignmentRun));
    questionPool.push(createCodeReportQuestion(mole, assignmentRun));
  }

  const nonFinalQuestions = shuffle(questionPool)
    .filter((question) => question.answers && question.answers.length >= 3)
    .slice(0, 9);

  return [...nonFinalQuestions, createFinalMoleQuestion(activeCandidates, mole)];
}

export function scoreEliminationTest(questions, selectedAnswerIds) {
  let score = 0;

  for (const question of questions) {
    const selectedId = selectedAnswerIds[question.id];
    const answer = question.answers.find((option) => option.id === selectedId);

    if (answer?.correct) {
      score += 1;
    }
  }

  return score;
}

export function simulateNpcTestScores({ candidates, questions }) {
  const activeNpcs = getActiveCandidates(candidates).filter(
    (candidate) => !candidate.isPlayer
  );

  return activeNpcs.map((candidate) => {
    if (candidate.isMole) {
      return {
        candidateId: candidate.id,
        candidateName: candidate.name,
        score: questions.length,
        timeSeconds: 45 + Math.floor(Math.random() * 60)
      };
    }

    const knowledge =
      candidate.hiddenProfile.memory * 0.35 +
      candidate.hiddenProfile.confidence * 0.2 +
      Math.random() * 0.45;

    const score = Math.max(
      0,
      Math.min(questions.length, Math.round(knowledge * questions.length))
    );

    return {
      candidateId: candidate.id,
      candidateName: candidate.name,
      score,
      timeSeconds: 70 + Math.floor(Math.random() * 260)
    };
  });
}

export function determineEliminatedCandidate({
  candidates,
  questions,
  playerScore,
  playerTimeSeconds
}) {
  const activeCandidates = getActiveCandidates(candidates);

  const npcScores = simulateNpcTestScores({
    candidates,
    questions
  });

  const player = activeCandidates.find((candidate) => candidate.isPlayer);

  const allResults = [
    ...npcScores,
    {
      candidateId: player.id,
      candidateName: player.name,
      score: playerScore,
      timeSeconds: playerTimeSeconds
    }
  ];

  const nonMoleResults = allResults.filter((result) => {
    const candidate = candidates.find((item) => item.id === result.candidateId);
    return candidate && !candidate.isMole;
  });

  nonMoleResults.sort((a, b) => {
    if (a.score !== b.score) return a.score - b.score;
    return b.timeSeconds - a.timeSeconds;
  });

  const eliminated = nonMoleResults[0];

  const eliminatedCandidate = candidates.find(
    (candidate) => candidate.id === eliminated.candidateId
  );

  eliminatedCandidate.eliminated = true;

  return {
    eliminatedCandidate,
    allResults,
    playerEliminated: eliminatedCandidate.isPlayer
  };
}

export function createNameTypingFrames(name) {
  const frames = [];
  let current = "";

  for (const character of name.toUpperCase()) {
    current += character;
    frames.push(current);
  }

  return frames;
}

export function createEliminationRevealSequence({
  candidates,
  eliminatedCandidate
}) {
  const activeCandidates = getActiveCandidates(candidates);

  const revealable = activeCandidates.filter((candidate) => {
    // De Mol mag zeker ook groen krijgen.
    // De afvaller moet ook in de pool zitten.
    return true;
  });

  const shuffled = shuffle(revealable);

  let ordered = [];

  for (const candidate of shuffled) {
    ordered.push(candidate);

    if (candidate.id === eliminatedCandidate.id) {
      break;
    }
  }

  // Als de afvaller toevallig niet in het stuk zat, voegen we hem alsnog in.
  if (!ordered.some((candidate) => candidate.id === eliminatedCandidate.id)) {
    const insertIndex = Math.floor(Math.random() * (ordered.length + 1));
    ordered.splice(insertIndex, 0, eliminatedCandidate);
    ordered = ordered.slice(0, insertIndex + 1);
  }

  return ordered.map((candidate) => ({
    candidateId: candidate.id,
    name: candidate.name,
    typingFrames: createNameTypingFrames(candidate.name),
    color: candidate.id === eliminatedCandidate.id ? "red" : "green",
    label: candidate.id === eliminatedCandidate.id ? "ROOD" : "GROEN"
  }));
}

export function getRevealScreenStyle(color) {
  if (color === "red") {
    return {
      background: "#640014",
      border: "#ff335c",
      label: "ROOD SCHERM"
    };
  }

  return {
    background: "#003d22",
    border: "#00ff66",
    label: "GROEN SCHERM"
  };
}
