import { assignments } from "../data/assignments.js";
import { getActiveCandidates } from "./candidateEngine.js";

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function pickWrongDigit(correctDigit) {
  const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  return shuffle(digits.filter((digit) => digit !== correctDigit))[0];
}

export function getAssignmentById(id) {
  return assignments.find((assignment) => assignment.id === id);
}

export function createTeams(candidates, assignment, playerTeamRoleId) {
  const active = getActiveCandidates(candidates);
  const player = active.find((candidate) => candidate.isPlayer);
  const npcs = shuffle(active.filter((candidate) => !candidate.isPlayer));

  const teams = assignment.teamRoles.map((role) => ({
    ...role,
    members: []
  }));

  const playerTeam = teams.find((team) => team.id === playerTeamRoleId) || teams[0];
  playerTeam.members.push(player);

  let teamIndex = 0;
  for (const npc of npcs) {
    teams[teamIndex % teams.length].members.push(npc);
    teamIndex += 1;
  }

  return teams;
}

export function createAssignmentRun(assignment, candidates, playerTeamRoleId) {
  const teams = createTeams(candidates, assignment, playerTeamRoleId);
  const activeNpcs = getActiveCandidates(candidates).filter((candidate) => !candidate.isPlayer);

  const phaseReports = assignment.phases.map((phase, index) => {
    const witnesses = shuffle(activeNpcs).slice(0, 3);
    const reports = witnesses.map((candidate) =>
      createCandidatePhaseReport(candidate, phase, index)
    );

    return {
      phaseId: phase.id,
      digitIndex: phase.digitIndex,
      truth: phase.truth,
      witnesses: reports
    };
  });

  return {
    assignmentId: assignment.id,
    teams,
    phaseReports,
    playerObservations: [],
    finalCodeEntered: "",
    completed: false,
    result: null
  };
}

function createCandidatePhaseReport(candidate, phase, phaseNumber) {
  const profile = candidate.hiddenProfile;
  const correctChance = candidate.isMole
    ? 0.28
    : Math.min(0.95, profile.honesty * 0.6 + profile.memory * 0.4);

  const tellsTruth = Math.random() < correctChance;
  const reportedDigit = tellsTruth ? phase.truth : pickWrongDigit(phase.truth);

  let tone = "twijfelend";
  if (candidate.isMole) tone = "rustig maar misleidend";
  else if (profile.type === "observator") tone = "precies";
  else if (profile.type === "verward") tone = "onzeker";
  else if (profile.type === "bedrieglijk") tone = "zelfzeker maar verdacht";
  else if (profile.type === "stresskip") tone = "nerveus";
  else if (profile.type === "strategisch") tone = "voorzichtig";

  return {
    candidateId: candidate.id,
    candidateName: candidate.name,
    phaseNumber,
    reportedDigit,
    tellsTruth,
    tone,
    statement: buildStatement(candidate, phase, reportedDigit, tellsTruth)
  };
}

function buildStatement(candidate, phase, reportedDigit, tellsTruth) {
  const opening = candidate.isMole
    ? `${candidate.name} zegt kalm`
    : `${candidate.name} zegt`;

  if (tellsTruth) {
    return `${opening}: "Ik ben vrij zeker dat ik bij dit deel ${reportedDigit} heb gezien."`;
  }

  return `${opening}: "Volgens mij was het ${reportedDigit}, maar het ging allemaal snel."`;
}

export function applyPlayerChoice(run, phase, choice) {
  const observation = {
    phaseId: phase.id,
    digitIndex: phase.digitIndex,
    truth: phase.truth,
    choiceId: choice.id,
    label: choice.label,
    text: choice.text,
    playerSawDigit: choice.playerGetsTruth ? phase.truth : null,
    suspicion: choice.suspicion
  };

  run.playerObservations.push(observation);
  return observation;
}

export function completeAssignment(assignment, run, enteredCode) {
  const normalized = String(enteredCode || "").replace(/\D/g, "").slice(0, 4);
  run.finalCodeEntered = normalized;

  let correctDigits = 0;

  for (let index = 0; index < assignment.code.length; index += 1) {
    if (normalized[index] === assignment.code[index]) {
      correctDigits += 1;
    }
  }

  const digitReward = correctDigits * assignment.rewardPerCorrectDigit;
  const fullBonus = normalized === assignment.code ? assignment.fullCodeBonus : 0;
  const totalReward = digitReward + fullBonus;

  run.completed = true;
  run.result = {
    enteredCode: normalized,
    correctCode: assignment.code,
    correctDigits,
    digitReward,
    fullBonus,
    totalReward,
    gillesBreakdown: buildGillesBreakdown(
      assignment,
      normalized,
      correctDigits,
      digitReward,
      fullBonus,
      totalReward
    )
  };

  return run.result;
}

function buildGillesBreakdown(
  assignment,
  enteredCode,
  correctDigits,
  digitReward,
  fullBonus,
  totalReward
) {
  const codeText = enteredCode || "geen geldige code";

  return [
    `Jullie kozen uiteindelijk voor de code ${codeText}.`,
    `De juiste code was ${assignment.code}.`,
    `Per juist cijfer was er €${assignment.rewardPerCorrectDigit} te verdienen.`,
    `Jullie hadden ${correctDigits} cijfer(s) op de juiste positie. Dat levert €${digitReward} op.`,
    fullBonus > 0
      ? `Omdat de volledige code juist was, komt daar nog €${assignment.fullCodeBonus} bovenop.`
      : `De volledige code was niet juist. De bonus van €${assignment.fullCodeBonus} gaat verloren.`,
    `Deze opdracht brengt dus €${totalReward} op voor de groepspot.`
  ];
}

export function getReportsForCafe(run, candidateId) {
  const reports = [];

  for (const phaseReport of run.phaseReports) {
    const report = phaseReport.witnesses.find(
      (witness) => witness.candidateId === candidateId
    );

    if (report) {
      reports.push(report);
    }
  }

  return reports;
}
