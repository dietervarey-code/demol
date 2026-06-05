export const assignments = [
  {
    id: "eger_vaten_code",
    day: 1,
    cityId: "budapest",
    title: "De Vier Vaten",
    locationName: "ondergrondse proefkelder",
    intro:
      "In een verborgen proefkelder liggen vier verzegelde vaten. Elk vat bevat één cijfer van een code. De groep moet bepalen welke vier cijfers samen de juiste code vormen.",
    briefing:
      "Gilles legt uit: vier teams krijgen elk een andere taak. Elk juist cijfer levert €500 op. Wie op het einde de volledige code correct ingeeft, verdient daarbovenop €3000. Maar let op: bij een foutieve volledige code blijft enkel het bedrag van de afzonderlijk correct gevonden cijfers over.",
    code: "6834",
    rewardPerCorrectDigit: 500,
    fullCodeBonus: 3000,
    teamRoles: [
      {
        id: "kelder",
        name: "Team Kelder",
        role:
          "zoekt in de wijnkelder naar vaten met ingekerfde symbolen en cijfers."
      },
      {
        id: "archief",
        name: "Team Archief",
        role:
          "leest oude bestelboeken om te achterhalen welke vaten historisch belangrijk waren."
      },
      {
        id: "markt",
        name: "Team Marktplein",
        role:
          "ondervraagt figuranten op het marktplein over vatnummers en symbolen."
      },
      {
        id: "controle",
        name: "Team Controle",
        role:
          "vergelijkt alle gevonden informatie en probeert tegenstrijdigheden te herkennen."
      }
    ],
    phases: [
      {
        id: "digit_1",
        digitIndex: 0,
        truth: "6",
        scene:
          "In de kelder wordt een vat gevonden met een verweerd symbool van een druiventros. Naast het symbool staat vaag een cijfer gekrast.",
        choices: [
          {
            id: "check_self",
            label: "Zelf dichterbij gaan kijken",
            playerGetsTruth: true,
            suspicion: 0,
            text:
              "Je veegt stof van het hout. Heel vaag zie je een 6. Niet glashelder, maar sterk genoeg om te noteren."
          },
          {
            id: "trust_teammate",
            label: "Een teamgenoot laten lezen",
            playerGetsTruth: false,
            suspicion: 0,
            text:
              "Je vraagt een teamgenoot om het cijfer te lezen. Die zegt overtuigd iets te zien, maar jij ziet het zelf niet goed."
          },
          {
            id: "rush",
            label: "Snel doorlopen om tijd te winnen",
            playerGetsTruth: false,
            suspicion: 1,
            text:
              "Je besluit dat de groep tijd verliest en loopt door. Het cijfer wordt niet zorgvuldig gecontroleerd."
          }
        ]
      },
      {
        id: "digit_2",
        digitIndex: 1,
        truth: "8",
        scene:
          "In het archief ligt een vergeeld bestelformulier. Eén regel is omcirkeld, maar er zit een koffievlek over het laatste cijfer.",
        choices: [
          {
            id: "compare_dates",
            label: "De datums vergelijken met het vatregister",
            playerGetsTruth: true,
            suspicion: 0,
            text:
              "Door de datums naast elkaar te leggen merk je dat het om vat 8 moet gaan."
          },
          {
            id: "ask_group",
            label: "De groep laten stemmen",
            playerGetsTruth: false,
            suspicion: 0,
            text:
              "Iedereen roept door elkaar. Er lijken twee mogelijke cijfers over te blijven."
          },
          {
            id: "pretend_sure",
            label: "Doen alsof je zeker bent om tijd te winnen",
            playerGetsTruth: false,
            suspicion: 2,
            text:
              "Je klinkt overtuigend, maar je bent helemaal niet zeker. Een paar kandidaten kijken je vreemd aan."
          }
        ]
      },
      {
        id: "digit_3",
        digitIndex: 2,
        truth: "3",
        scene:
          "Op het marktplein krijgt de groep drie enveloppen. Slechts één envelop bevat een echte aanwijzing; de andere twee zijn afleiders.",
        choices: [
          {
            id: "question_vendor",
            label: "De marktkoopman rustig ondervragen",
            playerGetsTruth: true,
            suspicion: 0,
            text:
              "De marktkoopman herhaalt subtiel dat de derde envelop de enige echte aanwijzing bevat. Je noteert 3."
          },
          {
            id: "open_fast",
            label: "Meteen een envelop kiezen",
            playerGetsTruth: false,
            suspicion: 1,
            text:
              "Je kiest snel. De aanwijzing lijkt bruikbaar, maar je weet niet of ze echt is."
          },
          {
            id: "let_other_choose",
            label: "Een andere kandidaat laten kiezen",
            playerGetsTruth: false,
            suspicion: 0,
            text:
              "Een andere kandidaat neemt de beslissing. Jij weet niet zeker of die keuze juist was."
          }
        ]
      },
      {
        id: "digit_4",
        digitIndex: 3,
        truth: "4",
        scene:
          "In de controlekamer hangen vier sleutels aan de muur. Onder elke sleutel staat een Hongaarse spreuk. Eén spreuk kwam eerder ook op een vat voor.",
        choices: [
          {
            id: "match_symbol",
            label: "De spreuk vergelijken met je eerdere notities",
            playerGetsTruth: true,
            suspicion: 0,
            text:
              "Je herkent de spreuk. Ze hoort bij sleutel 4. Dit lijkt het laatste cijfer."
          },
          {
            id: "follow_loud_voice",
            label: "Meegaan met de luidste kandidaat",
            playerGetsTruth: false,
            suspicion: 0,
            text:
              "Een kandidaat dringt aan op een keuze. Je volgt mee, maar weet niet of dat verstandig was."
          },
          {
            id: "delay",
            label: "Nog extra blijven twijfelen",
            playerGetsTruth: true,
            suspicion: 1,
            text:
              "Je verliest tijd, maar door langer te kijken herken je uiteindelijk sleutel 4."
          }
        ]
      }
    ]
  }
];

export const seasonDays = [
  {
    day: 1,
    cityId: "budapest",
    assignmentId: "eger_vaten_code",
    title: "Aankomst in Hongarije"
  },
  {
    day: 2,
    cityId: "budapest",
    assignmentId: null,
    title: "De tweede dag in Boedapest"
  },
  {
    day: 3,
    cityId: "eger",
    assignmentId: null,
    title: "Naar de wijnstad Eger"
  },
  {
    day: 4,
    cityId: "eger",
    assignmentId: null,
    title: "Onder de stad"
  },
  {
    day: 5,
    cityId: "balaton",
    assignmentId: null,
    title: "Aan het Balatonmeer"
  },
  {
    day: 6,
    cityId: "pecs",
    assignmentId: null,
    title: "Patronen in Pécs"
  },
  {
    day: 7,
    cityId: "szeged",
    assignmentId: null,
    title: "De markt van Szeged"
  },
  {
    day: 8,
    cityId: "szeged",
    assignmentId: null,
    title: "Finale"
  }
];
