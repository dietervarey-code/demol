import { assignments } from "../data/assignments.js";
import { assignmentTemplates } from "../data/assignmentTemplates.js";
import { getActiveCandidates } from "./candidateEngine.js";

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function pickRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function pickWrongDigit(correctDigit) {
  const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  return shuffle(digits.filter((digit) => digit !== correctDigit))[0];
}

export function getAssignmentById(id) {
  return (
    assignmentTemplates.find((assignment) => assignment.id === id) ||
    assignments.find((assignment) => assignment.id === id)
  );
}

export function getAssignmentsForCity(cityId) {
  return assignmentTemplates.filter((assignment) => assignment.cityId === cityId);
}

export function pickAssignmentForDay({ cityId, activeCandidateCount, usedAssignmentIds = [] }) {
  const cityAssignments = assignmentTemplates.filter((assignment) => {
    const fitsCity = assignment.cityId === cityId;
    const fitsCandidateCount =
      !assignment.minCandidates || activeCandidateCount >= assignment.minCandidates;
    const unused = !usedAssignmentIds.includes(assignment.id);

    return fitsCity && fitsCandidateCount && unused;
  });

  if (cityAssignments.length > 0) {
    return pickRandom(cityAssignments);
  }

  const fallback = assignmentTemplates.filter((assignment) => {
    const fitsCandidateCount =
      !assignment.minCandidates || activeCandidateCount >= assignment.minCandidates;
    return fitsCandidateCount;
  });

  return pickRandom(fallback.length ? fallback : assignments);
}

export function createTeams(candidates, assignment, playerTeamRoleId) {
  const active = getActiveCandidates(candidates);
  const player = active.find((candidate) => candidate.isPlayer);
  const npcs = shuffle(active.filter((candidate) => !candidate.isPlayer));

  const roleSource = assignment.teamModes || assignment.teamRoles || [];
  const maxTeams = assignment.maxTeams || roleSource.length || 2;

  const activeCount = active.length;
  let teamCount = Math.min(roleSource.length, maxTeams, Math.max(1, Math.ceil(activeCount / 3)));

  if (activeCount <= 4) teamCount = Math.min(roleSource.length, 2);
  if (activeCount <= 3) teamCount = 1;

  const selectedRoles = roleSource.slice(0, Math.max(1, teamCount));

  const teams = selectedRoles.map((role) => ({
    ...role,
    members: []
  }));

  const playerTeam =
    teams.find((team) => team.id === playerTeamRoleId) ||
    teams[0];

  if (player) {
    playerTeam.members.push(player);
  }

  let teamIndex = 0;

  for (const npc of npcs) {
    teams[teamIndex % teams.length].members.push(npc);
    teamIndex += 1;
  }

  return teams;
}

export function createAssignmentRun(assignment, candidates, playerTeamRoleId) {
  if (assignment.scenes && assignment.finale) {
    return createTemplateAssignmentRun(assignment, candidates, playerTeamRoleId);
  }

  return createLegacyAssignmentRun(assignment, candidates, playerTeamRoleId);
}

function createLegacyAssignmentRun(assignment, candidates, playerTeamRoleId) {
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
    engineVersion: "legacy-code",
    assignmentId: assignment.id,
    teams,
    phaseReports,
    playerObservations: [],
    finalCodeEntered: "",
    completed: false,
    result: null
  };
}

function createTemplateAssignmentRun(assignment, candidates, playerTeamRoleId) {
  const teams = createTeams(candidates, assignment, playerTeamRoleId);
  const activeNpcs = getActiveCandidates(candidates).filter((candidate) => !candidate.isPlayer);

  const playerTeam = teams.find((team) =>
    team.members.some((member) => member.isPlayer)
  );

  const otherTeams = teams.filter((team) => team.id !== playerTeam?.id);

  const run = {
    engineVersion: "template-v2",
    assignmentId: assignment.id,
    teams,
    playerTeamId: playerTeam?.id || teams[0]?.id,
    timeRemaining: assignment.timeLimit || 10,
    startingTime: assignment.timeLimit || 10,
    playerSuspicion: 0,
    moneyFromPlayerTeam: 0,
    moneyFromOtherTeams: simulateOtherTeamsMoney(otherTeams, assignment, activeNpcs),
    evidenceFound: [],
    revealedLots: [],
    revealedSignals: [],
    revealedPackages: [],
    revealedSuspects: [],
    clearedSuspects: [],
    routeParts: [],
    playerObservations: [],
    candidateMemories: [],
    phaseReports: [],
    finalDecision: null,
    completed: false,
    result: null
  };

  run.candidateMemories = createInitialCandidateMemories({
    assignment,
    candidates: activeNpcs,
    run
  });

  return run;
}

function simulateOtherTeamsMoney(otherTeams, assignment, activeNpcs) {
  if (!otherTeams.length) return 0;

  const max = assignment.money?.max || 4000;
  const maxOtherTeamContribution = Math.round(max * 0.45);
  let total = 0;

  for (const team of otherTeams) {
    const teamQuality =
      team.members.reduce((sum, member) => {
        if (member.isMole) return sum + 0.18;
        return sum + (member.hiddenProfile?.memory || 0.5) * 0.45 + (member.hiddenProfile?.honesty || 0.5) * 0.35;
      }, 0) / Math.max(1, team.members.length);

    const teamShare = Math.round((maxOtherTeamContribution / otherTeams.length) * teamQuality);
    total += teamShare;
  }

  const molePenalty = otherTeams.some((team) =>
    team.members.some((member) => member.isMole)
  )
    ? Math.round(max * (0.08 + Math.random() * 0.12))
    : 0;

  return Math.max(0, total - molePenalty);
}

function createInitialCandidateMemories({ assignment, candidates }) {
  return candidates.map((candidate) => {
    const profile = candidate.hiddenProfile || {};
    const isMole = candidate.isMole;

    const honesty = isMole ? 0.25 : profile.honesty ?? 0.65;
    const memory = isMole ? 0.85 : profile.memory ?? 0.6;

    return {
      candidateId: candidate.id,
      candidateName: candidate.name,
      isMole,
      honesty,
      memory,
      suspicionOfPlayer: 0,
      statements: [],
      knows: []
    };
  });
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
    statement: buildLegacyStatement(candidate, reportedDigit, tellsTruth)
  };
}

function buildLegacyStatement(candidate, reportedDigit, tellsTruth) {
  const opening = candidate.isMole
    ? `${candidate.name} zegt kalm`
    : `${candidate.name} zegt`;

  if (tellsTruth) {
    return `${opening}: "Ik ben vrij zeker dat ik bij dit deel ${reportedDigit} heb gezien."`;
  }

  return `${opening}: "Volgens mij was het ${reportedDigit}, maar het ging allemaal snel."`;
}

export function applyPlayerChoice(run, phaseOrScene, choice) {
  if (run.engineVersion === "template-v2") {
    return applyTemplatePlayerChoice(run, phaseOrScene, choice);
  }

  return applyLegacyPlayerChoice(run, phaseOrScene, choice);
}

function applyLegacyPlayerChoice(run, phase, choice) {
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

function applyTemplatePlayerChoice(run, scene, choice) {
  const timeCost = getChoiceTimeCost(scene, choice);
  run.timeRemaining = Math.max(0, run.timeRemaining - timeCost);

  const moneyImpact = choice.moneyImpact || 0;
  run.moneyFromPlayerTeam = Math.max(0, run.moneyFromPlayerTeam + moneyImpact);

  const suspicionImpact = choice.suspicionImpact || 0;
  run.playerSuspicion = clamp(run.playerSuspicion + suspicionImpact, 0, 100);

  addUniqueArrayValues(run.evidenceFound, choice.givesEvidence || []);
  addUniqueArrayValues(run.revealedLots, choice.revealsLots || []);
  addUniqueArrayValues(run.revealedSignals, choice.revealsSignals || []);
  addUniqueArrayValues(run.revealedPackages, choice.revealsPackages || []);
  addUniqueArrayValues(run.routeParts, choice.revealsRoutePart || []);

  if (choice.revealsSuspect) {
    addUniqueArrayValues(run.revealedSuspects, [choice.revealsSuspect]);
  }

  if (choice.clearsSuspect) {
    addUniqueArrayValues(run.clearedSuspects, [choice.clearsSuspect]);
  }

  const observation = {
    sceneId: scene.id,
    sceneTitle: scene.title,
    choiceId: choice.id,
    label: choice.label,
    text: choice.text,
    moneyImpact,
    suspicionImpact,
    timeCost,
    timeRemaining: run.timeRemaining,
    evidenceFound: [...run.evidenceFound],
    playerLooksSuspicious: choice.playerLooksSuspicious || suspicionImpact > 1
  };

  run.playerObservations.push(observation);
  updateCandidateMemoriesAfterChoice(run, scene, choice, observation);

  return observation;
}

function getChoiceTimeCost(scene, choice) {
  if (typeof choice.timePenalty === "number") return choice.timePenalty;

  if (!scene.timeCost) return 1;

  if (choice.suspicionImpact >= 2) return scene.timeCost.sabotage ?? 1;
  if (choice.moneyImpact > 0) return scene.timeCost.careful ?? 2;

  return scene.timeCost.normal ?? 1;
}

function addUniqueArrayValues(target, values) {
  for (const value of values) {
    if (!target.includes(value)) {
      target.push(value);
    }
  }
}

function updateCandidateMemoriesAfterChoice(run, scene, choice, observation) {
  for (const memory of run.candidateMemories) {
    const noticed = Math.random() < (memory.memory || 0.5);

    if (!noticed) continue;

    let statement = "";

    if (choice.suspicionImpact >= 2) {
      memory.suspicionOfPlayer += choice.suspicionImpact;
      statement = `${memory.candidateName} merkte dat jij bij '${scene.title}' voor '${choice.label}' koos. Dat kwam verdacht over.`;
    } else if (choice.moneyImpact > 0) {
      statement = `${memory.candidateName} onthield dat jij bij '${scene.title}' nuttige informatie opleverde.`;
    } else {
      statement = `${memory.candidateName} twijfelt over jouw keuze bij '${scene.title}'.`;
    }

    memory.statements.push(statement);
  }
}

export function completeAssignment(assignment, run, finalInput) {
  if (run.engineVersion === "template-v2") {
    return completeTemplateAssignment(assignment, run, finalInput);
  }

  return completeLegacyAssignment(assignment, run, finalInput);
}

function completeLegacyAssignment(assignment, run, enteredCode) {
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
    playerSuspicion: 0,
    gillesBreakdown: buildLegacyGillesBreakdown(
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

function completeTemplateAssignment(assignment, run, finalInput) {
  const finale = assignment.finale;
  const decision = normalizeFinalInput(finalInput);
  run.finalDecision = decision;

  const finaleResult = scoreFinale(assignment, run, decision);

  const timePenalty = run.timeRemaining <= 0
    ? Math.round((assignment.money?.max || 4000) * 0.15)
    : 0;

  const playerMoney = Math.max(0, run.moneyFromPlayerTeam - timePenalty);
  const otherMoney = run.moneyFromOtherTeams;
  const totalReward = Math.max(0, playerMoney + otherMoney + finaleResult.bonus + finaleResult.value);

  run.completed = true;
  run.result = {
    finalDecision: decision,
    finaleType: finale.type,
    finaleCorrect: finaleResult.correct,
    finaleLabel: finaleResult.label,
    finaleExplanation: finaleResult.explanation,
    moneyFromPlayerTeam: playerMoney,
    moneyFromOtherTeams: otherMoney,
    finaleBonus: finaleResult.bonus,
    finaleValue: finaleResult.value,
    timeRemaining: run.timeRemaining,
    timePenalty,
    playerSuspicion: run.playerSuspicion,
    evidenceFound: [...run.evidenceFound],
    totalReward,
    gillesBreakdown: buildTemplateGillesBreakdown({
      assignment,
      run,
      finaleResult,
      playerMoney,
      otherMoney,
      timePenalty,
      totalReward
    })
  };

  return run.result;
}

function normalizeFinalInput(finalInput) {
  if (Array.isArray(finalInput)) return finalInput;
  if (typeof finalInput === "string") return finalInput;
  if (finalInput && typeof finalInput === "object") return finalInput;
  return "";
}

function scoreFinale(assignment, run, decision) {
  const finale = assignment.finale;

  if (finale.type === "wire_choice") {
    const selected = finale.options.find((option) => option.id === decision);
    return {
      correct: Boolean(selected?.correct),
      label: selected?.label || "geen keuze",
      bonus: selected?.correct ? selected.bonus || 0 : 0,
      value: 0,
      explanation: selected?.result || "Er werd geen geldige draad gekozen."
    };
  }

  if (finale.type === "suspect_choice") {
    const selected = finale.options.find((option) => option.id === decision);
    return {
      correct: Boolean(selected?.correct),
      label: selected?.label || "geen keuze",
      bonus: selected?.correct ? selected.bonus || 0 : 0,
      value: 0,
      explanation: selected?.correct
        ? `De groep wees ${selected.label} correct aan.`
        : `${selected?.label || "De keuze"} was niet de juiste dader.`
    };
  }

  if (finale.type === "route_choice") {
    const selected = finale.options.find((option) => option.id === decision);
    let signalValue = 0;

    if (selected?.route && assignment.signals) {
      for (const signalId of selected.route) {
        const signal = assignment.signals.find((item) => item.id === signalId);
        if (signal?.real) signalValue += signal.value || 0;
      }
    }

    return {
      correct: Boolean(selected?.correct),
      label: selected?.label || "geen route",
      bonus: selected?.correct ? selected.bonus || 0 : 0,
      value: signalValue,
      explanation: selected?.correct
        ? "De route was juist en leverde de bonus op."
        : "De route bevatte minstens één fout of vals signaal."
    };
  }

  if (finale.type === "multi_select" || finale.type === "delivery_choice") {
    const selectedIds = Array.isArray(decision) ? decision : [];
    const selectedOptions = finale.options.filter((option) =>
      selectedIds.includes(option.id)
    );

    const value = selectedOptions.reduce((sum, option) => sum + (option.value || 0), 0);
    const correct = selectedOptions.length > 0 && selectedOptions.every((option) => option.correct);

    return {
      correct,
      label: selectedOptions.map((option) => option.label).join(", ") || "geen selectie",
      bonus: 0,
      value,
      explanation: selectedOptions.length
        ? `De groep koos: ${selectedOptions.map((option) => option.label).join(", ")}.`
        : "Er werd niets gekozen."
    };
  }

  return {
    correct: false,
    label: "onbekend",
    bonus: 0,
    value: 0,
    explanation: "Deze finale wordt nog niet ondersteund."
  };
}

function buildLegacyGillesBreakdown(
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

function buildTemplateGillesBreakdown({
  assignment,
  run,
  finaleResult,
  playerMoney,
  otherMoney,
  timePenalty,
  totalReward
}) {
  const lines = [];

  lines.push(`Jullie speelden: ${assignment.title}.`);
  lines.push(`Jouw team bracht voorlopig €${playerMoney} binnen.`);
  lines.push(`De andere teams brachten samen €${otherMoney} binnen.`);

  if (timePenalty > 0) {
    lines.push(`Omdat jullie te laat waren, ging er €${timePenalty} verloren.`);
  } else {
    lines.push(`Jullie eindigden met nog ${run.timeRemaining} minuut/minuten op de klok.`);
  }

  if (run.evidenceFound.length) {
    lines.push(`Jullie bewezen ${run.evidenceFound.length} belangrijke aanwijzing(en).`);
  }

  lines.push(finaleResult.explanation);

  if (finaleResult.bonus > 0) {
    lines.push(`De eindbeslissing leverde €${finaleResult.bonus} bonus op.`);
  }

  if (finaleResult.value !== 0) {
    lines.push(`De gekozen finale-opties leverden netto €${finaleResult.value} op.`);
  }

  if (run.playerSuspicion >= 5) {
    lines.push(`Opvallend: jouw keuzes maakten je vandaag behoorlijk verdacht bij de groep.`);
  } else if (run.playerSuspicion >= 2) {
    lines.push(`Enkele kandidaten zullen jouw keuzes vandaag wellicht onthouden.`);
  } else {
    lines.push(`Je kwam vandaag niet bijzonder verdacht over.`);
  }

  lines.push(`Deze opdracht brengt dus €${totalReward} op voor de groepspot.`);

  return lines;
}

export function getReportsForCafe(run, candidateId) {
  if (run.engineVersion === "template-v2") {
    return getTemplateReportsForCafe(run, candidateId);
  }

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

function getTemplateReportsForCafe(run, candidateId) {
  const memory = run.candidateMemories.find((item) => item.candidateId === candidateId);

  if (!memory) return [];

  const reports = [];

  for (const statement of memory.statements.slice(-3)) {
    reports.push({
      candidateId,
      candidateName: memory.candidateName,
      phaseNumber: 0,
      reportedDigit: "",
      tellsTruth: !memory.isMole && Math.random() < memory.honesty,
      tone: memory.isMole ? "rustig maar ontwijkend" : "persoonlijk",
      statement
    });
  }

  if (reports.length === 0) {
    reports.push({
      candidateId,
      candidateName: memory.candidateName,
      phaseNumber: 0,
      reportedDigit: "",
      tellsTruth: !memory.isMole,
      tone: "algemeen",
      statement: `${memory.candidateName} zegt: "Ik heb vooral op de groep gelet. Niet alles was even logisch vandaag."`
    });
  }

  return reports;
}

export function getTemplateFinaleOptions(assignment) {
  if (!assignment.finale) return [];

  return assignment.finale.options || [];
}

export function isTemplateAssignment(assignment) {
  return Boolean(assignment?.scenes && assignment?.finale);
}
