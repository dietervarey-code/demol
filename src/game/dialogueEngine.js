import {
  markQuestionAsked,
  wasQuestionAsked
} from "./candidateEngine.js";

import { getReportsForCafe } from "./assignmentEngine.js";

function pickRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function formatMaybeKnown(value) {
  return value || "dat weet ik niet";
}

export const dialogueTopics = [
  {
    id: "personal_job",
    label: "Wat doe je in het dagelijks leven?"
  },
  {
    id: "personal_hobby",
    label: "Wat doe je graag buiten het werk?"
  },
  {
    id: "personal_age",
    label: "Hoe oud ben je eigenlijk?"
  },
  {
    id: "personal_notebook",
    label: "Welke kleur heeft je Molboekje?"
  },
  {
    id: "task_own_role",
    label: "Wat heb jij tijdens de opdracht gedaan?"
  },
  {
    id: "task_suspicious",
    label: "Wie vond jij verdacht tijdens de opdracht?"
  },
  {
    id: "task_code",
    label: "Welke codefragmenten heb jij gezien?"
  }
];

export function askCandidate({
  candidate,
  dayId,
  topicId,
  assignmentRun,
  candidates
}) {
  if (wasQuestionAsked(candidate, dayId, topicId)) {
    return {
      repeated: true,
      text: getRepeatedAnswer(candidate)
    };
  }

  markQuestionAsked(candidate, dayId, topicId);

  switch (topicId) {
    case "personal_job":
      candidate.discoveredByPlayer.job = true;
      return {
        repeated: false,
        text: getPersonalAnswer(candidate, "job")
      };

    case "personal_hobby":
      candidate.discoveredByPlayer.hobby = true;
      return {
        repeated: false,
        text: getPersonalAnswer(candidate, "hobby")
      };

    case "personal_age":
      candidate.discoveredByPlayer.age = true;
      return {
        repeated: false,
        text: getAgeAnswer(candidate)
      };

    case "personal_notebook":
      candidate.discoveredByPlayer.notebookColor = true;
      return {
        repeated: false,
        text: getNotebookAnswer(candidate)
      };

    case "task_own_role":
      return {
        repeated: false,
        text: getOwnRoleAnswer(candidate, assignmentRun)
      };

    case "task_suspicious":
      return {
        repeated: false,
        text: getSuspiciousAnswer(candidate, assignmentRun, candidates)
      };

    case "task_code":
      return {
        repeated: false,
        text: getCodeAnswer(candidate, assignmentRun)
      };

    default:
      return {
        repeated: false,
        text: `${candidate.name} kijkt je even aan, maar zegt niets bruikbaars.`
      };
  }
}

function getRepeatedAnswer(candidate) {
  const options = [
    `"Dat heb ik je daarnet al verteld."`,
    `"Ik heb daar eigenlijk niets meer aan toe te voegen."`,
    `"Ik wil mezelf niet blijven herhalen. Schrijf het maar op in je Molboekje."`,
    `"Je vroeg dat al. Of probeer je mij te testen?"`
  ];

  return `${candidate.name}: ${pickRandom(options)}`;
}

function getPersonalAnswer(candidate, field) {
  const value = formatMaybeKnown(candidate[field]);

  const openings = {
    job: [
      `Ik werk als ${value}.`,
      `In het gewone leven ben ik ${value}.`,
      `Mijn job? ${value}. Niet meteen iets dat je hier veel helpt, denk ik.`
    ],
    hobby: [
      `Ik hou mij graag bezig met ${value}.`,
      `Buiten het werk doe ik vooral aan ${value}.`,
      `Mijn hobby is ${value}. Al weet ik niet of dat nu verdacht is.`
    ]
  };

  return `${candidate.name}: "${pickRandom(openings[field])}"`;
}

function getAgeAnswer(candidate) {
  return `${candidate.name}: "Ik ben ${candidate.age}. Waarom? Staat dat ook in je test straks?"`;
}

function getNotebookAnswer(candidate) {
  return `${candidate.name}: "Mijn Molboekje is ${candidate.notebookColor}. Ik probeer er alles in te schrijven, maar vandaag was het nogal chaotisch."`;
}

function getOwnRoleAnswer(candidate, assignmentRun) {
  if (!assignmentRun) {
    return `${candidate.name}: "Er is nog geen opdracht geweest vandaag."`;
  }

  const team = assignmentRun.teams.find((teamItem) =>
    teamItem.members.some((member) => member.id === candidate.id)
  );

  if (!team) {
    return `${candidate.name}: "Ik weet niet goed waar ik vandaag zat. Raar eigenlijk."`;
  }

  const reports = getReportsForCafe(assignmentRun, candidate.id);

  if (reports.length === 0) {
    return `${candidate.name}: "Ik zat in ${team.name}. Onze taak was: ${team.role} Ik heb vooral meegezocht, maar ik heb zelf geen hard codefragment gezien."`;
  }

  const report = reports[0];

  return `${candidate.name}: "Ik zat in ${team.name}. Onze taak was: ${team.role} Bij één moment dacht ik ${report.reportedDigit} gezien te hebben. Ik ben daar ${report.tone} over."`;
}

function getSuspiciousAnswer(candidate, assignmentRun, candidates) {
  if (!assignmentRun) {
    return `${candidate.name}: "Zonder opdracht valt er nog weinig te verdenken."`;
  }

  const activeOthers = candidates.filter(
    (other) => !other.eliminated && other.id !== candidate.id && !other.isPlayer
  );

  const reports = assignmentRun.phaseReports.flatMap((phase) => phase.witnesses);
  const falseReports = reports.filter((report) => !report.tellsTruth);

  let target = null;

  if (falseReports.length > 0 && Math.random() < candidate.hiddenProfile.memory) {
    const suspiciousReport = pickRandom(falseReports);
    target = candidates.find((person) => person.id === suspiciousReport.candidateId);
  }

  if (!target) {
    target = pickRandom(activeOthers);
  }

  const cautiousLines = [
    `Ik wil niemand beschuldigen, maar ${target.name} kwam vandaag niet helemaal helder over.`,
    `${target.name} zei iets dat volgens mij niet volledig klopte. Maar misschien heb ik het verkeerd begrepen.`,
    `Ik kreeg even een vreemd gevoel bij ${target.name}. Niet genoeg om zeker te zijn, maar toch.`
  ];

  const boldLines = [
    `${target.name}. Zonder twijfel. Die zat volgens mij dingen mooier voor te stellen dan ze waren.`,
    `Ik zou ${target.name} in het oog houden. Daar klopte iets niet.`,
    `${target.name} was vandaag volgens mij veel te stellig. Dat vind ik verdacht.`
  ];

  const profile = candidate.hiddenProfile.type;
  const lines =
    profile === "bedrieglijk" || profile === "strategisch"
      ? boldLines
      : cautiousLines;

  return `${candidate.name}: "${pickRandom(lines)}"`;
}

function getCodeAnswer(candidate, assignmentRun) {
  if (!assignmentRun) {
    return `${candidate.name}: "Ik heb vandaag nog geen codefragment gezien."`;
  }

  const reports = getReportsForCafe(assignmentRun, candidate.id);

  if (reports.length === 0) {
    return `${candidate.name}: "Ik heb zelf geen cijfer duidelijk gezien. Ik hoorde wel anderen discussiëren, maar daar vertrouw ik niet blind op."`;
  }

  const fragments = reports
    .map((report) => `positie ${report.phaseNumber + 1}: ${report.reportedDigit}`)
    .join(", ");

  const certainty =
    candidate.hiddenProfile.confidence > 0.75
      ? "Ik ben daar vrij zeker van."
      : candidate.hiddenProfile.memory < 0.55
        ? "Maar eerlijk: het ging snel, dus pin mij er niet op vast."
        : "Ik denk dat dat klopt.";

  return `${candidate.name}: "Wat ik zelf onthouden heb: ${fragments}. ${certainty}"`;
}

export function getCandidatePortraitStyle(candidate) {
  const colors = {
    man: ["#345995", "#2f3061", "#247ba0", "#50514f"],
    vrouw: ["#b23a48", "#7d5ba6", "#da627d", "#9a348e"]
  };

  const palette = colors[candidate.gender] || ["#777"];
  const color = palette[Math.abs(hashCode(candidate.id)) % palette.length];

  return {
    background: color,
    initials: candidate.name.slice(0, 2).toUpperCase()
  };
}

function hashCode(input) {
  return String(input)
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
}
