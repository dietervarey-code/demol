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

function groupValues(values, groupSize = 3) {
  const shuffled = shuffle(unique(values));
  const groups = [];

  for (let index = 0; index < shuffled.length; index += groupSize) {
    groups.push(shuffled.slice(index, index + groupSize));
  }

  return groups;
}

function formatGroupAnswer(values) {
  return values.join(", ");
}

export function createEliminationTest({ candidates, assignmentRun }) {
  const activeCandidates = getActiveCandidates(candidates);
  const mole = getMole(candidates);

  const questions = [];

  questions.push(createGenderQuestion(activeCandidates, mole));
  questions.push(createAgeQuestion(activeCandidates, mole));
  questions.push(createJobQuestion(activeCandidates, mole));
  questions.push(createHobbyQuestion(activeCandidates, mole));
  questions.push(createNotebookColorQuestion(activeCandidates, mole));

  if (assignmentRun) {
    questions.push(createTeamQuestion(activeCandidates, mole, assignmentRun));
    questions.push(createCodeReportQuestion(activeCandidates, mole, assignmentRun));
    questions.push(createRoleQuestion(activeCandidates, mole, assignmentRun));
  }

  questions.push(createSuspicionStyleQuestion(activeCandidates, mole));
  questions.push(createFinalMoleQuestion(activeCandidates, mole));

  return questions.slice(0, 10);
}

function createGroupedQuestion({ id, text, correctValue, allValues }) {
  const groups = groupValues(allValues, 3);

  let correctGroup = groups.find((group) => group.includes(correctValue));

  if (!correctGroup) {
    correctGroup = [correctValue];
    groups.push(correctGroup);
  }

  const answers = groups.map((group, index) => ({
    id: `${id}_${index}`,
    label: formatGroupAnswer(group),
    values: group,
    correct: group.includes(correctValue)
  }));

  return {
    id,
    text,
    type: "grouped",
    answers: shuffle(answers)
  };
}

function createGenderQuestion(activeCandidates, mole) {
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
      }
    ]
  };
}

function createAgeQuestion(activeCandidates, mole) {
  return createGroupedQuestion({
    id: "mole_age",
    text: "In welke leeftijdsgroep zit De Mol?",
    correctValue: getAgeGroup(mole.age),
    allValues: unique(activeCandidates.map((candidate) => getAgeGroup(candidate.age)))
  });
}

function getAgeGroup(age) {
  if (age < 30) return "jonger dan 30";
  if (age < 36) return "30 tot en met 35";
  if (age < 42) return "36 tot en met 41";
  return "42 of ouder";
}

function createJobQuestion(activeCandidates, mole) {
  return createGroupedQuestion({
    id: "mole_job",
    text: "In welke beroepsgroep zit De Mol?",
    correctValue: mole.job,
    allValues: activeCandidates.map((candidate) => candidate.job)
  });
}

function createHobbyQuestion(activeCandidates, mole) {
  return createGroupedQuestion({
    id: "mole_hobby",
    text: "Welke hobby hoort bij De Mol?",
    correctValue: mole.hobby,
    allValues: activeCandidates.map((candidate) => candidate.hobby)
  });
}

function createNotebookColorQuestion(activeCandidates, mole) {
  return createGroupedQuestion({
    id: "mole_notebook",
    text: "Welke kleur heeft het Molboekje van De Mol?",
    correctValue: mole.notebookColor,
    allValues: activeCandidates.map((candidate) => candidate.notebookColor)
  });
}

function createTeamQuestion(activeCandidates, mole, assignmentRun) {
  const moleTeam = assignmentRun.teams.find((team) =>
    team.members.some((member) => member.id === mole.id)
  );

  return createGroupedQuestion({
    id: "mole_team",
    text: "In welk team zat De Mol tijdens de opdracht?",
    correctValue: moleTeam?.name || "onbekend",
    allValues: assignmentRun.teams.map((team) => team.name)
  });
}

function createCodeReportQuestion(activeCandidates, mole, assignmentRun) {
  const moleReports = assignmentRun.phaseReports
    .flatMap((phase) => phase.witnesses)
    .filter((report) => report.candidateId === mole.id);

  const reportedPositions = moleReports.map(
    (report) => `positie ${report.phaseNumber + 1}: ${report.reportedDigit}`
  );

  const correctValue =
    reportedPositions.length > 0
      ? pickRandom(reportedPositions)
      : "De Mol gaf geen duidelijk codefragment door";

  const allValues = assignmentRun.phaseReports
    .flatMap((phase) =>
      phase.witnesses.map(
        (report) => `positie ${report.phaseNumber + 1}: ${report.reportedDigit}`
      )
    )
    .concat(["De Mol gaf geen duidelijk codefragment door"]);

  return createGroupedQuestion({
    id: "mole_code_report",
    text: "Welk codefragment werd door De Mol genoemd of bevestigd?",
    correctValue,
    allValues
  });
}

function createRoleQuestion(activeCandidates, mole, assignmentRun) {
  const moleTeam = assignmentRun.teams.find((team) =>
    team.members.some((member) => member.id === mole.id)
  );

  return createGroupedQuestion({
    id: "mole_role",
    text: "Welke rol had het team van De Mol tijdens de opdracht?",
    correctValue: moleTeam?.role || "onbekend",
    allValues: assignmentRun.teams.map((team) => team.role)
  });
}

function createSuspicionStyleQuestion(activeCandidates, mole) {
  return createGroupedQuestion({
    id: "mole_profile_hint",
    text: "Welk gedragstype past het best bij De Mol?",
    correctValue: mole.hiddenProfile.type,
    allValues: activeCandidates.map((candidate) => candidate.hiddenProfile.type)
  });
}

function createFinalMoleQuestion(activeCandidates, mole) {
  return {
    id: "final_mole",
    text: "Wie is De Mol?",
    type: "final",
    answers: activeCandidates
      .filter((candidate) => !candidate.isPlayer)
      .map((candidate) => ({
        id: candidate.id,
        label: candidate.name,
        correct: candidate.id === mole.id
      }))
  };
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

export function simulateNpcTestScores({ candidates, questions, playerScore }) {
  const activeNpcs = getActiveCandidates(candidates).filter(
    (candidate) => !candidate.isPlayer
  );

  return activeNpcs.map((candidate) => {
    const baseKnowledge = candidate.isMole
      ? 1
      : candidate.hiddenProfile.memory * 0.45 +
        candidate.hiddenProfile.confidence * 0.25 +
        Math.random() * 0.3;

    const score = candidate.isMole
      ? questions.length
      : Math.max(
          0,
          Math.min(
            questions.length,
            Math.round(baseKnowledge * questions.length)
          )
        );

    return {
      candidateId: candidate.id,
      candidateName: candidate.name,
      score,
      timeSeconds: 60 + Math.floor(Math.random() * 240)
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
    questions,
    playerScore
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
  const letters = [];
  let current = "";

  for (const character of name.toUpperCase()) {
    current += character;
    letters.push(current);
  }

  return letters;
}

export function createEliminationRevealSequence({
  candidates,
  eliminatedCandidate
}) {
  const activeCandidates = getActiveCandidates(candidates);
  const candidatesToReveal = shuffle(
    activeCandidates.filter((candidate) => !candidate.isMole)
  );

  if (!candidatesToReveal.some((candidate) => candidate.id === eliminatedCandidate.id)) {
    candidatesToReveal.push(eliminatedCandidate);
  }

  const ordered = candidatesToReveal.map((candidate) => ({
    candidateId: candidate.id,
    name: candidate.name,
    typingFrames: createNameTypingFrames(candidate.name),
    color: candidate.id === eliminatedCandidate.id ? "red" : "green",
    label: candidate.id === eliminatedCandidate.id ? "ROOD" : "GROEN"
  }));

  const redIndex = ordered.findIndex(
    (item) => item.candidateId === eliminatedCandidate.id
  );

  if (redIndex > 2) {
    return ordered.slice(0, redIndex + 1);
  }

  return ordered;
}

export function getRevealScreenStyle(color) {
  if (color === "red") {
    return {
      background: "#7a0011",
      border: "#ff4055",
      label: "ROOD SCHERM"
    };
  }

  return {
    background: "#0b6b35",
    border: "#43d17a",
    label: "GROEN SCHERM"
  };
}
