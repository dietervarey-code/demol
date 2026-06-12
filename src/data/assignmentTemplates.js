export const assignmentTemplates = [
  {
    id: "budapest_bom_donau",
    cityId: "budapest",
    title: "De Bom aan de Donau",
    locationName: "verlaten tramremise aan de Donau",
    type: "timed_final_choice",
    minCandidates: 5,
    maxTeams: 3,
    timeLimit: 12,
    money: {
      max: 5000,
      partial: true
    },
    intro:
      "In een oude tramremise tikt een bomkoffer. Vier draden, drie teams en één laatste beslissing. De groep kan geld verdienen door de juiste informatie te verzamelen, maar één verkeerde knip kan alles doen ontploffen.",
    briefing:
      "Gilles: 'In deze opdracht verzamelen jullie informatie over vier draden. Elk correct bewezen draadkenmerk levert €750 op. Knippen jullie op het einde de juiste draad, dan komt daar €2000 bovenop. Knippen jullie fout, dan blijft enkel het bewezen geld over.'",
    teamModes: [
      {
        id: "bomteam",
        name: "Team Bom",
        idealSize: 2,
        role: "blijft bij de bomkoffer en noteert de volgorde van de draden."
      },
      {
        id: "archiefteam",
        name: "Team Archief",
        idealSize: 3,
        role: "zoekt in oude tramplannen naar welke draad veilig is."
      },
      {
        id: "radioteam",
        name: "Team Radio",
        idealSize: 3,
        role: "communiceert tussen teams en controleert tegenstrijdigheden."
      }
    ],
    evidence: [
      {
        key: "red_is_decoy",
        truth: true,
        label: "De rode draad is een afleider."
      },
      {
        key: "blue_has_current",
        truth: true,
        label: "De blauwe draad staat onder stroom."
      },
      {
        key: "green_is_safe",
        truth: true,
        label: "De groene draad is veilig."
      },
      {
        key: "yellow_is_timer",
        truth: true,
        label: "De gele draad versnelt de timer."
      }
    ],
    scenes: [
      {
        id: "tram_plan",
        title: "Het tramplan",
        timeCost: {
          careful: 2,
          normal: 1,
          sabotage: 0
        },
        text:
          "In een metalen kast ligt een oud tramplan. De kleuren op het plan zijn vervaagd, maar er staat bij één spoor: 'veilig circuit'.",
        choices: [
          {
            id: "careful_check",
            label: "Rustig controleren met het UV-lampje",
            moneyImpact: 750,
            suspicionImpact: -1,
            givesEvidence: ["green_is_safe"],
            playerLooksSuspicious: false,
            text:
              "Je neemt extra tijd. Onder UV-licht wordt duidelijk dat het veilige circuit groen is."
          },
          {
            id: "trust_candidate",
            label: "Een kandidaat het plan laten interpreteren",
            moneyImpact: 0,
            suspicionImpact: 0,
            givesEvidence: [],
            dependsOnCandidate: true,
            text:
              "Je laat iemand anders lezen. Dat kan nuttig zijn, maar je weet niet zeker of die kandidaat alles correct doorgeeft."
          },
          {
            id: "rush_plan",
            label: "Zeggen dat dit spoor te lang duurt",
            moneyImpact: 0,
            suspicionImpact: 2,
            givesEvidence: [],
            playerLooksSuspicious: true,
            text:
              "Je wint tijd, maar het belangrijkste spoor blijft onzeker. Enkele kandidaten kijken je vreemd aan."
          }
        ]
      },
      {
        id: "radio_noise",
        title: "Ruis op de radio",
        timeCost: {
          careful: 2,
          normal: 1,
          sabotage: 0
        },
        text:
          "Het radioteam hoort een storing. Tussen de ruis klinkt: 'blauw... stroom... niet aanraken'.",
        choices: [
          {
            id: "ask_repeat",
            label: "Vragen om de boodschap te herhalen",
            moneyImpact: 750,
            suspicionImpact: 0,
            givesEvidence: ["blue_has_current"],
            text:
              "De boodschap wordt herhaald. Blauw staat onder stroom. Dat lijkt duidelijk."
          },
          {
            id: "assume_enough",
            label: "Aannemen dat je genoeg hoorde",
            moneyImpact: 250,
            suspicionImpact: 0,
            givesEvidence: [],
            text:
              "Je noteert iets over blauw, maar zonder zekerheid. Gilles zal dit maar gedeeltelijk aanvaarden."
          },
          {
            id: "talk_over_radio",
            label: "Door de radio praten terwijl iemand luistert",
            moneyImpact: 0,
            suspicionImpact: 2,
            givesEvidence: [],
            text:
              "Je stoort de communicatie. Het fragment gaat verloren."
          }
        ]
      },
      {
        id: "timer_room",
        title: "De timerkamer",
        timeCost: {
          careful: 2,
          normal: 1,
          sabotage: 1
        },
        text:
          "Naast de bom hangt een timerkast. Een geel waarschuwingslabel is half losgetrokken.",
        choices: [
          {
            id: "repair_label",
            label: "Het label terugplaatsen en lezen",
            moneyImpact: 750,
            suspicionImpact: -1,
            givesEvidence: ["yellow_is_timer"],
            text:
              "Je ziet de tekst volledig: geel versnelt de timer."
          },
          {
            id: "ask_fast",
            label: "Snel vragen wat anderen zien",
            moneyImpact: 0,
            suspicionImpact: 0,
            givesEvidence: [],
            dependsOnCandidate: true,
            text:
              "Je krijgt snel een antwoord, maar het label blijft half verborgen."
          },
          {
            id: "pull_label",
            label: "Het label lostrekken om beter te kijken",
            moneyImpact: 0,
            suspicionImpact: 3,
            givesEvidence: [],
            text:
              "Het label scheurt. Niemand kan de waarschuwing nog lezen. Dat ziet er bijzonder verdacht uit."
          }
        ]
      },
      {
        id: "red_box",
        title: "Het rode kastje",
        timeCost: {
          careful: 1,
          normal: 1,
          sabotage: 0
        },
        text:
          "In een rood kastje ligt een briefje: 'de opvallendste draad is niet altijd de gevaarlijkste'.",
        choices: [
          {
            id: "connect_hint",
            label: "De hint koppelen aan de rode draad",
            moneyImpact: 750,
            suspicionImpact: 0,
            givesEvidence: ["red_is_decoy"],
            text:
              "Je besluit dat rood vooral bedoeld is om aandacht te trekken. Dat lijkt een afleider."
          },
          {
            id: "ignore_hint",
            label: "De hint te vaag vinden",
            moneyImpact: 0,
            suspicionImpact: 0,
            givesEvidence: [],
            text:
              "Je noteert de hint niet. Misschien was hij belangrijker dan hij leek."
          },
          {
            id: "push_red",
            label: "Aandringen dat rood sowieso gevaarlijk is",
            moneyImpact: 0,
            suspicionImpact: 2,
            givesEvidence: [],
            text:
              "Je stuurt de groep richting rood, maar zonder bewijs."
          }
        ]
      }
    ],
    finale: {
      type: "wire_choice",
      prompt: "Welke draad knipt de groep door?",
      options: [
        {
          id: "red",
          label: "Rode draad",
          correct: false,
          result:
            "De rode draad was een afleider. De bom stopt niet volledig en de bonus gaat verloren."
        },
        {
          id: "blue",
          label: "Blauwe draad",
          correct: false,
          result:
            "De blauwe draad stond onder stroom. De bom slaat op tilt. De bonus gaat verloren."
        },
        {
          id: "green",
          label: "Groene draad",
          correct: true,
          bonus: 2000,
          result:
            "De groene draad was veilig. De timer stopt. De groep verdient de bonus."
        },
        {
          id: "yellow",
          label: "Gele draad",
          correct: false,
          result:
            "De gele draad versnelt de timer. De bonus gaat verloren."
        }
      ]
    },
    candidateReactionTemplates: {
      truthful:
        "{name} zegt: 'Ik ben vrij zeker dat {evidence} klopt. Ik heb dat zelf gezien.'",
      mistaken:
        "{name} zegt: 'Ik dacht dat {wrongEvidence} klopte, maar het ging allemaal zo snel.'",
      deceptive:
        "{name} zegt opvallend rustig: 'Volgens mij moeten we vooral naar {wrongEvidence} kijken.'",
      suspiciousAboutPlayer:
        "{name} fluistert later: 'Jij wilde opvallend snel verder bij {scene}. Dat vond ik raar.'"
    },
    cafeHooks: [
      "Wie duwde richting een snelle knip?",
      "Wie verstoorde de radio?",
      "Wie las het tramplan zelf?",
      "Wie was opvallend zeker zonder bewijs?"
    ]
  },

  {
    id: "eger_wijnveiling",
    cityId: "eger",
    title: "De Wijnveiling",
    locationName: "veilingkelder van Eger",
    type: "auction_memory",
    minCandidates: 6,
    maxTeams: 3,
    timeLimit: 10,
    money: {
      max: 4500,
      partial: true
    },
    intro:
      "In een wijnkelder worden flessen geveild. Sommige flessen zijn geld waard, andere kosten geld. De kandidaten moeten onthouden welke lotnummers betrouwbaar zijn.",
    briefing:
      "Gilles: 'Jullie krijgen biedfiches. Elk juist gekocht lot levert geld op. Elk fout lot kost geld. De Mol weet vooraf welke twee loten waardeloos zijn.'",
    teamModes: [
      {
        id: "bieders",
        name: "Team Bieders",
        idealSize: 2,
        role: "brengt de biedingen uit."
      },
      {
        id: "proevers",
        name: "Team Proevers",
        idealSize: 3,
        role: "proeft en onthoudt welke flessen echt zijn."
      },
      {
        id: "boekhouding",
        name: "Team Boekhouding",
        idealSize: 3,
        role: "noteert lotnummers, prijzen en risico's."
      }
    ],
    lots: [
      { id: "lot_12", label: "Lot 12 - Bikaver 1998", value: 1000, real: true },
      { id: "lot_18", label: "Lot 18 - Tokaji Aszu", value: 1200, real: true },
      { id: "lot_21", label: "Lot 21 - Egri Cuvee", value: -700, real: false },
      { id: "lot_27", label: "Lot 27 - Kelderreserve", value: 900, real: true },
      { id: "lot_31", label: "Lot 31 - Privécollectie", value: -900, real: false },
      { id: "lot_36", label: "Lot 36 - Zeldzame Merlot", value: 1400, real: true }
    ],
    scenes: [
      {
        id: "first_tasting",
        title: "De eerste proeverij",
        text:
          "De proevers krijgen drie glazen. Eén glas is duidelijk aangelengd met water.",
        choices: [
          {
            id: "smell",
            label: "Rustig ruiken en vergelijken",
            moneyImpact: 600,
            suspicionImpact: -1,
            revealsLots: ["lot_12", "lot_18"],
            text:
              "Je herkent twee betrouwbare loten. Dat geeft de bieders nuttige informatie."
          },
          {
            id: "follow_loudest",
            label: "De luidste kandidaat volgen",
            moneyImpact: 0,
            suspicionImpact: 0,
            dependsOnCandidate: true,
            text:
              "Je volgt een overtuigende stem, maar weet niet of die persoon juist zit."
          },
          {
            id: "fake_confidence",
            label: "Doen alsof je zeker bent",
            moneyImpact: -300,
            suspicionImpact: 2,
            text:
              "Je klinkt zelfzeker, maar je redenering klopt niet helemaal. Dat kan geld kosten."
          }
        ]
      },
      {
        id: "auction_pressure",
        title: "Bieddruk",
        text:
          "De veilingmeester versnelt. De bieders moeten nu snel kiezen tussen twee loten.",
        choices: [
          {
            id: "slow_down",
            label: "De veiling kort stilleggen voor overleg",
            moneyImpact: 400,
            suspicionImpact: 0,
            timePenalty: 2,
            revealsLots: ["lot_27"],
            text:
              "Het kost tijd, maar de groep vermijdt een impulsief bod."
          },
          {
            id: "bid_fast",
            label: "Meteen bieden",
            moneyImpact: 0,
            suspicionImpact: 1,
            dependsOnCandidate: true,
            text:
              "Je bod is snel. Of het slim was, zal pas bij Gilles blijken."
          },
          {
            id: "confuse_prices",
            label: "Lotnummers en prijzen door elkaar halen",
            moneyImpact: -500,
            suspicionImpact: 3,
            text:
              "De boekhouding raakt in de war. Een verkeerd lot komt plots weer in beeld."
          }
        ]
      },
      {
        id: "last_lot",
        title: "Het laatste lot",
        text:
          "Er blijft één duur lot over. De Mol zou hier makkelijk geld kunnen weggooien.",
        choices: [
          {
            id: "check_notes",
            label: "Alle notities naast elkaar leggen",
            moneyImpact: 700,
            suspicionImpact: -1,
            revealsLots: ["lot_36"],
            text:
              "De notities wijzen naar Lot 36 als veiligste keuze."
          },
          {
            id: "trust_bidder",
            label: "De bieder volledig vertrouwen",
            moneyImpact: 0,
            suspicionImpact: 0,
            dependsOnCandidate: true,
            text:
              "Je legt de beslissing bij iemand anders. Dat kan goed of slecht aflopen."
          },
          {
            id: "push_bad_lot",
            label: "Aandringen op het opvallendste lot",
            moneyImpact: -700,
            suspicionImpact: 2,
            text:
              "Je kiest voor uitstraling boven bewijs. Dat lijkt verdacht."
          }
        ]
      }
    ],
    finale: {
      type: "multi_select",
      prompt: "Welke drie loten koopt de groep definitief?",
      maxSelections: 3,
      scoring:
        "Echte loten leveren hun waarde op. Valse loten kosten geld.",
      options: [
        { id: "lot_12", label: "Lot 12", value: 1000, correct: true },
        { id: "lot_18", label: "Lot 18", value: 1200, correct: true },
        { id: "lot_21", label: "Lot 21", value: -700, correct: false },
        { id: "lot_27", label: "Lot 27", value: 900, correct: true },
        { id: "lot_31", label: "Lot 31", value: -900, correct: false },
        { id: "lot_36", label: "Lot 36", value: 1400, correct: true }
      ]
    },
    candidateReactionTemplates: {
      truthful:
        "{name} zegt: 'Ik had {lot} genoteerd als betrouwbaar. Dat stond ook in mijn boekje.'",
      mistaken:
        "{name} fronst: 'Ik dacht dat {lot} goed was, maar ik kan lotnummer en prijs door elkaar halen.'",
      deceptive:
        "{name} zegt: 'Ik zou {badLot} zeker niet uitsluiten. Dat voelde net heel echt.'",
      suspiciousAboutPlayer:
        "{name} zegt: 'Jij was plots wel erg zeker tijdens de veiling. Waarom eigenlijk?'"
    },
    cafeHooks: [
      "Wie duwde een fout lot naar voren?",
      "Wie verwisselde lotnummers?",
      "Wie bleef kalm onder bieddruk?",
      "Wie wilde geen overleg?"
    ]
  },

  {
    id: "balaton_reddingsactie",
    cityId: "balaton",
    title: "Reddingsactie op het Balatonmeer",
    locationName: "reddingspost aan het meer",
    type: "route_rescue",
    minCandidates: 5,
    maxTeams: 3,
    timeLimit: 14,
    money: {
      max: 6000,
      partial: true
    },
    intro:
      "Op het Balatonmeer liggen drie noodsignalen. De groep moet bepalen welke signalen echt zijn en in welke volgorde ze moeten worden bereikt.",
    briefing:
      "Gilles: 'Elk echt noodsignaal dat jullie op tijd bereiken levert €1500 op. Een vals signaal kost tijd. De juiste eindroute levert €1500 bonus op.'",
    teamModes: [
      {
        id: "boot",
        name: "Team Boot",
        idealSize: 2,
        role: "vaart naar de gekozen signalen."
      },
      {
        id: "kaart",
        name: "Team Kaart",
        idealSize: 3,
        role: "leest windrichting en waterkaart."
      },
      {
        id: "post",
        name: "Team Reddingspost",
        idealSize: 3,
        role: "luistert naar radio-oproepen."
      }
    ],
    signals: [
      { id: "north", label: "Noordboei", real: true, value: 1500 },
      { id: "east", label: "Oostboei", real: false, value: 0 },
      { id: "south", label: "Zuidboei", real: true, value: 1500 },
      { id: "west", label: "Westboei", real: true, value: 1500 }
    ],
    correctRoute: ["north", "south", "west"],
    scenes: [
      {
        id: "radio_call",
        title: "De radio-oproep",
        text:
          "Door de radio klinkt: '...noord... echt... oost... oefening...'. Daarna valt de verbinding weg.",
        choices: [
          {
            id: "repeat",
            label: "De oproep laten herhalen",
            moneyImpact: 500,
            suspicionImpact: 0,
            timePenalty: 2,
            revealsSignals: ["north", "east"],
            text:
              "De herhaling bevestigt: noord is echt, oost is een oefening."
          },
          {
            id: "act_now",
            label: "Meteen vertrekken naar het dichtste signaal",
            moneyImpact: 0,
            suspicionImpact: 1,
            dependsOnCandidate: true,
            text:
              "Je wint tijd, maar het dichtste signaal is niet per se echt."
          },
          {
            id: "talk_noise",
            label: "Door de radio praten",
            moneyImpact: -500,
            suspicionImpact: 3,
            text:
              "De herhaling gaat verloren. Dat lijkt erg ongelukkig... of verdacht."
          }
        ]
      },
      {
        id: "wind_map",
        title: "De windkaart",
        text:
          "De wind blaast de boot sneller naar het zuiden, maar terugkeren kost extra tijd.",
        choices: [
          {
            id: "calculate",
            label: "De route rustig berekenen",
            moneyImpact: 700,
            suspicionImpact: -1,
            revealsRoutePart: ["south"],
            text:
              "De kaart toont dat zuid logisch is als tweede stop."
          },
          {
            id: "follow_boat",
            label: "Team Boot laten kiezen",
            moneyImpact: 0,
            suspicionImpact: 0,
            dependsOnCandidate: true,
            text:
              "De beslissing ligt bij de boot. Jij ziet enkel het resultaat."
          },
          {
            id: "wrong_wind",
            label: "De windrichting verkeerd interpreteren",
            moneyImpact: -500,
            suspicionImpact: 2,
            text:
              "Je stuurt de groep bijna de verkeerde kant uit."
          }
        ]
      },
      {
        id: "flare",
        title: "Het lichtsignaal",
        text:
          "Aan de westkant flikkert een lichtsignaal drie keer. Een figurant zegt dat oefensignalen altijd twee keer flikkeren.",
        choices: [
          {
            id: "trust_flare",
            label: "Het lichtsignaal vertrouwen",
            moneyImpact: 700,
            suspicionImpact: 0,
            revealsSignals: ["west"],
            text:
              "Drie flikkeringen: west lijkt echt."
          },
          {
            id: "doubt",
            label: "Twijfelen en extra controleren",
            moneyImpact: 300,
            suspicionImpact: 0,
            timePenalty: 2,
            revealsSignals: ["west"],
            text:
              "Je verliest tijd, maar bevestigt west."
          },
          {
            id: "dismiss",
            label: "Het lichtsignaal negeren",
            moneyImpact: -700,
            suspicionImpact: 2,
            text:
              "Je negeert een sterke aanwijzing. Dat kan duur worden."
          }
        ]
      }
    ],
    finale: {
      type: "route_choice",
      prompt: "Welke route vaart de boot?",
      options: [
        {
          id: "north_south_west",
          label: "Noord → Zuid → West",
          route: ["north", "south", "west"],
          correct: true,
          bonus: 1500
        },
        {
          id: "north_east_west",
          label: "Noord → Oost → West",
          route: ["north", "east", "west"],
          correct: false
        },
        {
          id: "east_south_west",
          label: "Oost → Zuid → West",
          route: ["east", "south", "west"],
          correct: false
        },
        {
          id: "south_north_east",
          label: "Zuid → Noord → Oost",
          route: ["south", "north", "east"],
          correct: false
        }
      ]
    },
    candidateReactionTemplates: {
      truthful:
        "{name} zegt: 'Ik hoorde duidelijk dat {signal} echt was.'",
      mistaken:
        "{name} zegt onzeker: 'Ik dacht {signal}, maar de radio kraakte enorm.'",
      deceptive:
        "{name} zegt: 'Oost voelde voor mij niet vals. Misschien moeten we dat toch doen.'",
      suspiciousAboutPlayer:
        "{name} zegt: 'Jij praatte net op het moment dat de radio iets belangrijks zei.'"
    },
    cafeHooks: [
      "Wie verstoorde de radio?",
      "Wie duwde richting oost?",
      "Wie wilde extra controleren?",
      "Wie had de windkaart vast?"
    ]
  },

  {
    id: "pecs_galerij_diefstal",
    cityId: "pecs",
    title: "De Galerijdiefstal",
    locationName: "kunstgalerij in Pécs",
    type: "deduction_suspect",
    minCandidates: 5,
    maxTeams: 3,
    timeLimit: 13,
    money: {
      max: 5000,
      partial: true
    },
    intro:
      "In een galerij is een kunstwerk verdwenen. De groep krijgt vijf verdachten, vier aanwijzingen en één kans om de juiste dader aan te wijzen.",
    briefing:
      "Gilles: 'Elke correct geïnterpreteerde aanwijzing levert €700 op. Wijzen jullie op het einde de juiste dader aan, dan verdienen jullie €2200 extra.'",
    culprit: "restaurateur",
    suspects: [
      { id: "bewaker", label: "De bewaker", guilty: false },
      { id: "restaurateur", label: "De restaurateur", guilty: true },
      { id: "verzamelaar", label: "De verzamelaar", guilty: false },
      { id: "gids", label: "De gids", guilty: false },
      { id: "student", label: "De kunststudent", guilty: false }
    ],
    teamModes: [
      {
        id: "sporen",
        name: "Team Sporen",
        idealSize: 3,
        role: "zoekt fysieke aanwijzingen in de galerij."
      },
      {
        id: "verhoor",
        name: "Team Verhoor",
        idealSize: 2,
        role: "ondervraagt verdachten."
      },
      {
        id: "tijdlijn",
        name: "Team Tijdlijn",
        idealSize: 3,
        role: "legt de volgorde van gebeurtenissen vast."
      }
    ],
    scenes: [
      {
        id: "paint",
        title: "De verfvlek",
        text:
          "Naast de lege lijst ligt een blauwe verfvlek. Alleen de restaurateur werkte vandaag met blauwe verf.",
        choices: [
          {
            id: "sample",
            label: "Een staal nemen van de verf",
            moneyImpact: 700,
            suspicionImpact: -1,
            revealsSuspect: "restaurateur",
            text:
              "De verf komt overeen met het restauratieatelier."
          },
          {
            id: "ask_guard",
            label: "De bewaker vragen wat hij zag",
            moneyImpact: 0,
            suspicionImpact: 0,
            dependsOnCandidate: true,
            text:
              "De bewaker is zenuwachtig en wijst naar iemand anders."
          },
          {
            id: "wipe",
            label: "De vlek per ongeluk uitvegen",
            moneyImpact: -700,
            suspicionImpact: 3,
            text:
              "De vlek is onbruikbaar. Dat maakt jou erg verdacht."
          }
        ]
      },
      {
        id: "camera",
        title: "De camera",
        text:
          "De camera viel uit om 14:08. De gids beweert dat hij toen met de groep op het plein stond.",
        choices: [
          {
            id: "timeline",
            label: "De tijdlijn controleren",
            moneyImpact: 700,
            suspicionImpact: 0,
            clearsSuspect: "gids",
            text:
              "De gids stond inderdaad buiten. Hij lijkt onschuldig."
          },
          {
            id: "guess",
            label: "Afgaan op buikgevoel",
            moneyImpact: 0,
            suspicionImpact: 1,
            text:
              "Je beschuldigt bijna iemand zonder bewijs."
          },
          {
            id: "ignore_time",
            label: "De tijdlijn onbelangrijk noemen",
            moneyImpact: -500,
            suspicionImpact: 2,
            text:
              "Een belangrijke aanwijzing wordt minder bruikbaar."
          }
        ]
      },
      {
        id: "key",
        title: "De sleutelbos",
        text:
          "Een sleutel van het restauratieatelier ontbreekt. De verzamelaar had geen toegang tot dat atelier.",
        choices: [
          {
            id: "check_keys",
            label: "De sleutelbos controleren",
            moneyImpact: 700,
            suspicionImpact: 0,
            revealsSuspect: "restaurateur",
            text:
              "De ontbrekende sleutel wijst opnieuw naar het atelier."
          },
          {
            id: "trust_collector",
            label: "De verzamelaar blijven verdenken",
            moneyImpact: 0,
            suspicionImpact: 1,
            text:
              "Je blijft hangen bij een verdachte die weinig toegang had."
          },
          {
            id: "hide_key",
            label: "De sleutelbos te laat doorgeven",
            moneyImpact: -600,
            suspicionImpact: 3,
            text:
              "De groep verliest tijd omdat jij de sleutelbos bijhoudt."
          }
        ]
      },
      {
        id: "receipt",
        title: "Het ontvangstbewijs",
        text:
          "Een ontvangstbewijs toont dat de kunststudent al voor de diefstal vertrok.",
        choices: [
          {
            id: "read_receipt",
            label: "Het ontvangstbewijs lezen",
            moneyImpact: 700,
            suspicionImpact: 0,
            clearsSuspect: "student",
            text:
              "De student lijkt niet de dader."
          },
          {
            id: "ask_other",
            label: "Een andere kandidaat laten lezen",
            moneyImpact: 0,
            suspicionImpact: 0,
            dependsOnCandidate: true,
            text:
              "Je hoort een samenvatting, maar controleert de tijd niet zelf."
          },
          {
            id: "fold",
            label: "Het papier dubbelvouwen en de tijd bedekken",
            moneyImpact: -400,
            suspicionImpact: 2,
            text:
              "Door jouw handeling ziet niemand het vertrekuur nog duidelijk."
          }
        ]
      }
    ],
    finale: {
      type: "suspect_choice",
      prompt: "Wie wijst de groep aan als dader?",
      options: [
        { id: "bewaker", label: "De bewaker", correct: false },
        { id: "restaurateur", label: "De restaurateur", correct: true, bonus: 2200 },
        { id: "verzamelaar", label: "De verzamelaar", correct: false },
        { id: "gids", label: "De gids", correct: false },
        { id: "student", label: "De kunststudent", correct: false }
      ]
    },
    candidateReactionTemplates: {
      truthful:
        "{name} zegt: 'De aanwijzing bij {scene} wees volgens mij echt naar de restaurateur.'",
      mistaken:
        "{name} zegt: 'Ik bleef aan de bewaker denken, maar misschien zat ik vast op het verkeerde spoor.'",
      deceptive:
        "{name} zegt: 'Ik vond de verzamelaar veel verdachter dan de restaurateur.'",
      suspiciousAboutPlayer:
        "{name} zegt: 'Jij maakte wel net die aanwijzing onduidelijk. Dat vergeet ik niet.'"
    },
    cafeHooks: [
      "Wie veegde bewijs weg?",
      "Wie bleef de verkeerde verdachte pushen?",
      "Wie controleerde de tijdlijn?",
      "Wie had de sleutelbos vast?"
    ]
  },

  {
    id: "szeged_paprika_pakket",
    cityId: "szeged",
    title: "Het Paprikapakket",
    locationName: "markt van Szeged",
    type: "delivery_risk",
    minCandidates: 4,
    maxTeams: 2,
    timeLimit: 9,
    money: {
      max: 4000,
      partial: true
    },
    intro:
      "De groep moet pakketten afleveren op de markt. Sommige pakketten bevatten geld, andere bevatten lege paprika's. Niemand ziet de inhoud vooraf.",
    briefing:
      "Gilles: 'Elke juiste levering levert €1000 op. Een foute levering kost €500. Onderweg kunnen jullie pakketten controleren, maar dat kost tijd.'",
    teamModes: [
      {
        id: "lopers",
        name: "Team Lopers",
        idealSize: 2,
        role: "brengt pakketten naar de juiste kraampjes."
      },
      {
        id: "controle",
        name: "Team Controle",
        idealSize: 3,
        role: "controleert labels, adressen en gewicht."
      }
    ],
    packages: [
      { id: "A", label: "Pakket A", correctStall: "kraam 3", value: 1000, real: true },
      { id: "B", label: "Pakket B", correctStall: "kraam 7", value: -500, real: false },
      { id: "C", label: "Pakket C", correctStall: "kraam 1", value: 1000, real: true },
      { id: "D", label: "Pakket D", correctStall: "kraam 5", value: 1000, real: true }
    ],
    scenes: [
      {
        id: "weigh",
        title: "De weegschaal",
        text:
          "Pakket B voelt lichter dan de rest. Een kraamhouder zegt dat lege pakketten vaak te licht zijn.",
        choices: [
          {
            id: "weigh_all",
            label: "Alle pakketten wegen",
            moneyImpact: 700,
            suspicionImpact: -1,
            timePenalty: 2,
            revealsPackages: ["B"],
            text:
              "Pakket B is opvallend licht. Dat lijkt riskant."
          },
          {
            id: "trust_feel",
            label: "Op gevoel beslissen",
            moneyImpact: 0,
            suspicionImpact: 0,
            dependsOnCandidate: true,
            text:
              "Je vertrouwt op het gevoel van de groep."
          },
          {
            id: "skip_weight",
            label: "Zeggen dat wegen tijdverlies is",
            moneyImpact: -400,
            suspicionImpact: 2,
            text:
              "Je bespaart tijd maar mist een nuttige controle."
          }
        ]
      },
      {
        id: "labels",
        title: "De labels",
        text:
          "Op pakket C staat een bijna onleesbaar label. Onder het stof staat kraam 1.",
        choices: [
          {
            id: "clean",
            label: "Het label schoonmaken",
            moneyImpact: 700,
            suspicionImpact: 0,
            revealsPackages: ["C"],
            text:
              "Pakket C hoort bij kraam 1."
          },
          {
            id: "guess",
            label: "Het label gokken",
            moneyImpact: -300,
            suspicionImpact: 1,
            text:
              "Je gok kan goed uitvallen, maar is niet onderbouwd."
          },
          {
            id: "hand_other",
            label: "Het pakket doorgeven zonder te controleren",
            moneyImpact: 0,
            suspicionImpact: 1,
            dependsOnCandidate: true,
            text:
              "Iemand anders krijgt de verantwoordelijkheid."
          }
        ]
      },
      {
        id: "rush_delivery",
        title: "De laatste levering",
        text:
          "De tijd loopt bijna af. Pakket A en D moeten nog geleverd worden.",
        choices: [
          {
            id: "split",
            label: "De lopers opsplitsen",
            moneyImpact: 900,
            suspicionImpact: 0,
            text:
              "De kans stijgt dat beide pakketten op tijd aankomen."
          },
          {
            id: "together",
            label: "Samenblijven voor zekerheid",
            moneyImpact: 400,
            suspicionImpact: 0,
            timePenalty: 2,
            text:
              "Veilig, maar traag."
          },
          {
            id: "delay",
            label: "Blijven discussiëren over de volgorde",
            moneyImpact: -500,
            suspicionImpact: 3,
            text:
              "De groep verliest kostbare tijd door jouw discussie."
          }
        ]
      }
    ],
    finale: {
      type: "delivery_choice",
      prompt: "Welke pakketten worden definitief geleverd?",
      maxSelections: 3,
      options: [
        { id: "A", label: "Pakket A naar kraam 3", correct: true, value: 1000 },
        { id: "B", label: "Pakket B naar kraam 7", correct: false, value: -500 },
        { id: "C", label: "Pakket C naar kraam 1", correct: true, value: 1000 },
        { id: "D", label: "Pakket D naar kraam 5", correct: true, value: 1000 }
      ]
    },
    candidateReactionTemplates: {
      truthful:
        "{name} zegt: 'Pakket {packageId} voelde volgens mij juist betrouwbaar.'",
      mistaken:
        "{name} zegt: 'Ik dacht dat pakket {packageId} goed was, maar ik heb het label niet zelf gelezen.'",
      deceptive:
        "{name} zegt: 'Ik zou pakket B toch meenemen. Te licht betekent niet altijd fout.'",
      suspiciousAboutPlayer:
        "{name} zegt: 'Jij wilde opvallend snel stoppen met controleren.'"
    },
    cafeHooks: [
      "Wie vond wegen tijdverlies?",
      "Wie wilde pakket B toch leveren?",
      "Wie las het label van pakket C?",
      "Wie zorgde voor tijdverlies?"
    ]
  },

  // ── NIEUWE OPDRACHT 1 ──────────────────────────────────────────────────────
  {
    id: "balaton_stormroute",
    cityId: "balaton",
    title: "De Stormroute",
    locationName: "Balatonmeer – aanlegsteiger",
    type: "route_risk",
    minCandidates: 4,
    maxTeams: 3,
    timeLimit: 11,
    money: { max: 5500, partial: true },
    uiHint: "route_map",
    intro:
      "Een plotse storm hangt boven het Balatonmeer. De groep moet een verborgen datastick ophalen van een boei midden op het meer — maar er zijn vier routes. Sommige routes snijden door gevaarlijke zones. Elke minuut telt.",
    briefing:
      "Gilles: 'Er zijn vier routesegmenten. Elk segment kan je informatie opleveren of je in gevaar brengen. Aan het einde kiezen jullie één volledige route. De route met de meeste veilige segmenten én de datastick levert €2500 op. Maar haast je — de storm trekt over 11 minuten over het meer.'",
    teamModes: [
      { id: "noordteam",  name: "Team Noord",  idealSize: 2, role: "verkent het noordelijke vaarwater." },
      { id: "zuidteam",   name: "Team Zuid",   idealSize: 2, role: "verkent het zuidelijke vaarwater." },
      { id: "basisteam",  name: "Team Basis",  idealSize: 3, role: "coördineert op de steiger en analyseert kaarten." }
    ],
    signals: [
      { id: "seg_N1", label: "Segment Noord-1 (rustig water)", real: true,  value: 600 },
      { id: "seg_N2", label: "Segment Noord-2 (ondiepe geul)", real: false, value: -400 },
      { id: "seg_Z1", label: "Segment Zuid-1 (windluwe zone)", real: true,  value: 600 },
      { id: "seg_Z2", label: "Segment Zuid-2 (stromingszone)", real: false, value: -300 }
    ],
    scenes: [
      {
        id: "kaartlezing",
        title: "De kaartlezing",
        timeCost: { careful: 2, normal: 1, sabotage: 0 },
        text:
          "Op de steiger liggen twee vaarkaarten. Eén kaart is van vorig jaar — en de ander is ouder en mogelijk achterhaald. Een kandidaat houdt de nieuwste kaart omhoog.",
        molHint: "De Mol legt de verkeerde kaart prominenter neer.",
        candidateInteraction: {
          prompt: "Welke kaart bespreek je samen?",
          options: [
            { id: "new_map",  label: "De nieuwste kaart analyseert de groep samen",  candidateEffect: "trust" },
            { id: "old_map",  label: "Iemand overtuigt de groep voor de oude kaart", candidateEffect: "distrust" }
          ]
        },
        choices: [
          {
            id: "careful_read",
            label: "Rustig de nieuwste kaart analyseren met de groep",
            moneyImpact: 700,
            suspicionImpact: -1,
            timePenalty: 2,
            revealsSignals: ["seg_N1", "seg_Z1"],
            text: "De groep identificeert twee veilige segmenten. Segment Noord-1 en Zuid-1 zijn de rustigste routes.",
            candidateReaction: "Iemand knikt goedkeurend. Maar één kandidaat pakt heimelijk de oude kaart op."
          },
          {
            id: "trust_loudest",
            label: "Meegaan met de kandidaat die het hardst praat",
            moneyImpact: 0,
            suspicionImpact: 0,
            dependsOnCandidate: true,
            text: "De groep volgt de luidste stem. Of die persoon de juiste kaart heeft, is onduidelijk.",
            candidateReaction: "Twee kandidaten wisselen een blik. Ze geloven de redenering niet helemaal."
          },
          {
            id: "rush_no_map",
            label: "Zeggen dat kaarten tijdverlies zijn bij storm",
            moneyImpact: -500,
            suspicionImpact: 3,
            text: "De groep vertrekt zonder goede oriëntatie. Dat kost geld en wekt argwaan.",
            candidateReaction: "Drie kandidaten kijken je met open mond aan. 'Zonder kaart naar buiten?'"
          }
        ]
      },
      {
        id: "getuige_visser",
        title: "De oude visser",
        timeCost: { careful: 2, normal: 1, sabotage: 0 },
        text:
          "Aan de steiger staat een oude visser. Hij kent het meer als zijn broekzak en wijst naar het zuiden: 'Gisteren was de geul in het noorden ondiep. Ik zou er niet op rekenen.'",
        molHint: "De Mol kan de visser onderbreken of zijn advies wegwuiven.",
        candidateInteraction: {
          prompt: "Wat doe je met het advies van de visser?",
          options: [
            { id: "listen",  label: "Iedereen luistert samen", candidateEffect: "informed" },
            { id: "dismiss", label: "Een kandidaat wuift het weg", candidateEffect: "uninformed" }
          ]
        },
        choices: [
          {
            id: "ask_details",
            label: "Doorvragen over welk deel van Noord ondiep is",
            moneyImpact: 600,
            suspicionImpact: 0,
            timePenalty: 2,
            revealsSignals: ["seg_N2"],
            text: "De visser wijst Noord-2 aan als gevaarlijk. Dat is nuttige informatie voor de routekeuze.",
            candidateReaction: "'Goed gedaan,' fluistert een kandidaat. Maar de Mol-kandidaat lijkt gefrustreerd."
          },
          {
            id: "nod_move_on",
            label: "Knikken en meteen vertrekken",
            moneyImpact: 200,
            suspicionImpact: 0,
            text: "Je neemt de tip gedeeltelijk mee, maar zonder doorvragen blijft het vaag.",
            candidateReaction: "De visser kijkt jullie na. Hij tikt op zijn hoofd."
          },
          {
            id: "contradict_fisher",
            label: "Zeggen dat de visser overdrijft en doorlopen",
            moneyImpact: 0,
            suspicionImpact: 2,
            text: "Je discrediteert een betrouwbare bron. Dat valt op bij de groep.",
            candidateReaction: "'Waarom zou hij liegen?' vraagt een kandidaat hardop."
          }
        ]
      },
      {
        id: "radiostoring",
        title: "Radiostoring op het water",
        timeCost: { careful: 1, normal: 1, sabotage: 0 },
        text:
          "Het basisteam hoort via de radio: '...zuidelijk segment... let op stroming...' De verbinding valt weg. Een kandidaat beweert dat hij de rest ook hoorde.",
        molHint: "De Mol kan de rest van de boodschap verzinnen.",
        choices: [
          {
            id: "wait_repeat",
            label: "Wachten op een herhaling van de melding",
            moneyImpact: 500,
            suspicionImpact: -1,
            timePenalty: 2,
            revealsSignals: ["seg_Z2"],
            text: "De herhaling bevestigt: stromingszone Zuid-2 is gevaarlijk bij storm.",
            candidateReaction: "Goed. Iedereen is op dezelfde pagina — behalve één kandidaat die wegkijkt."
          },
          {
            id: "trust_candidate_radio",
            label: "De versie van de kandidaat geloven",
            moneyImpact: 0,
            suspicionImpact: 0,
            dependsOnCandidate: true,
            text: "Je vertrouwt op wat de kandidaat zegt. Of dat juist is, hangt van hem of haar af.",
            candidateReaction: "De kandidaat herhaalt de boodschap iets anders dan wat jij hoorde."
          },
          {
            id: "push_z2_safe",
            label: "Beweren dat Zuid-2 veilig is en de groep overtuigen",
            moneyImpact: -400,
            suspicionImpact: 3,
            text: "Je zet de groep op een vals spoor. Dat is een gevaarlijke keuze.",
            candidateReaction: "'Wacht, dat hoorde ik net niet zo.' Een kandidaat fronst."
          }
        ]
      },
      {
        id: "datastick_moment",
        title: "De datastick-boei",
        timeCost: { careful: 1, normal: 1, sabotage: 1 },
        text:
          "Via verrekijker ziet het basisteam dat de datastick op boei 7 ligt — exact op de grens van Noord-1 en Zuid-1. Eén persoon kan hem ophalen als de boot snel genoeg is.",
        molHint: "De Mol kan beweren dat de datastick er niet meer ligt.",
        choices: [
          {
            id: "send_fastest",
            label: "De snelste zwemmer sturen op de goede boot",
            moneyImpact: 800,
            suspicionImpact: 0,
            text: "De datastick wordt opgehaald. Dat levert extra waarde op bij de eindbeslissing.",
            candidateReaction: "Iedereen juicht. Eén kandidaat applaudisseert iets te laat."
          },
          {
            id: "hesitate_send",
            label: "Twijfelen over wie gaat — tijdverlies",
            moneyImpact: 300,
            suspicionImpact: 1,
            timePenalty: 2,
            text: "De datastick wordt opgehaald maar met vertraging. Er blijft weinig tijd over.",
            candidateReaction: "De groep moppert over het tijdverlies."
          },
          {
            id: "claim_not_there",
            label: "Beweren dat de boei leeg is en de moeite niet waard",
            moneyImpact: -600,
            suspicionImpact: 4,
            text: "Twee kandidaten kijken zelf door de verrekijker. Ze zien de datastick duidelijk.",
            candidateReaction: "'Die ligt er gewoon. Hoe kon je dat missen?' Een kandidaat stapt naar voren."
          }
        ]
      }
    ],
    finale: {
      type: "route_choice",
      prompt: "Welke route kiest de groep voor de boot?",
      scoring: "Elke veilig segment levert geld op. De datastick geeft een bonus als de route correct is.",
      options: [
        {
          id: "route_NN",
          label: "Volledig via het noorden (N1 + N2)",
          correct: false,
          route: ["seg_N1", "seg_N2"],
          bonus: 0,
          result: "Noord-2 was te ondiep. De boot raakt vast. De bonus gaat verloren."
        },
        {
          id: "route_NZ",
          label: "Noord-1 dan Zuid-1 (de veilige boog)",
          correct: true,
          route: ["seg_N1", "seg_Z1"],
          bonus: 2500,
          result: "Perfecte route. De datastick werd opgehaald en de route was veilig. Bonus verdiend."
        },
        {
          id: "route_ZZ",
          label: "Volledig via het zuiden (Z1 + Z2)",
          correct: false,
          route: ["seg_Z1", "seg_Z2"],
          bonus: 0,
          result: "Zuid-2 had sterke stroming bij storm. De route kostte te veel tijd."
        },
        {
          id: "route_ZN",
          label: "Zuid-1 dan Noord-2 (snelste pad)",
          correct: false,
          route: ["seg_Z1", "seg_N2"],
          bonus: 0,
          result: "Noord-2 was te ondiep. Snelste pad bleek een doodlopende steeg."
        }
      ]
    },
    candidateReactionTemplates: {
      truthful:   "{name} zegt: 'Segment {signal} zag er veilig uit vanuit mijn positie.'",
      mistaken:   "{name} zegt: 'Ik dacht dat {signal} oké was, maar ik had de verrekijker niet.'",
      deceptive:  "{name} zegt opvallend zeker: 'De visser overdreef. {signal} is gewoon veilig.'",
      suspiciousAboutPlayer: "{name} fluistert later: 'Jij wou opvallend snel de kaartlezing overslaan.'"
    },
    cafeHooks: [
      "Wie wou geen kaart raadplegen?",
      "Wie wou de visser niet geloven?",
      "Wie beweerde de datastick niet te zien?",
      "Wie overtuigde de groep voor de verkeerde route?"
    ]
  },

  // ── NIEUWE OPDRACHT 2 ──────────────────────────────────────────────────────
  {
    id: "pecs_mozaiek_puzzel",
    cityId: "pecs",
    title: "Het Mozaïek van de Basiliek",
    locationName: "Pécs – binnenhof van de Basiliek",
    type: "mosaic_puzzle",
    minCandidates: 4,
    maxTeams: 3,
    timeLimit: 10,
    money: { max: 5000, partial: true },
    uiHint: "mosaic_grid",
    intro:
      "In het binnenhof van de Basiliek van Pécs ligt een oud mozaïek met ontbrekende tegels. Elke ontbrekende tegel toont een getal of symbool dat deel uitmaakt van een code. De Mol weet welke tegels vals zijn — maar wie is de Mol?",
    briefing:
      "Gilles: 'Het mozaïek heeft negen posities. Drie posities zijn vals — die bevatten foute informatie geplant door de Mol. Jullie taak: bepaal welke posities betrouwbaar zijn en reconstrueer de correcte volgorde. Elke correcte positie levert €500 op. Als jullie ook de valse posities kunnen aanwijzen, komt er €1500 bovenop.'",
    teamModes: [
      { id: "speurders",  name: "Team Speurders",  idealSize: 2, role: "onderzoekt de vloertegels." },
      { id: "historici",  name: "Team Historici",  idealSize: 3, role: "vergelijkt tegels met archiefmateriaal." },
      { id: "fotografen", name: "Team Fotografen", idealSize: 2, role: "documenteert de posities en legt inconsistenties vast." }
    ],
    tileGrid: [
      { pos: 0, symbol: "●", value: 3, real: true,  hint: "De ronde tegel is origineel." },
      { pos: 1, symbol: "▲", value: 7, real: false, hint: "Het driehoekje is later toegevoegd." },
      { pos: 2, symbol: "■", value: 1, real: true,  hint: "De vierkante tegel is van Romeins marmer." },
      { pos: 3, symbol: "◆", value: 9, real: true,  hint: "De diamantvorm staat ook op het archief." },
      { pos: 4, symbol: "★", value: 5, real: false, hint: "De ster is een moderne kopie." },
      { pos: 5, symbol: "✦", value: 2, real: true,  hint: "Het kleine kruisje is authentiek." },
      { pos: 6, symbol: "⬟", value: 8, real: true,  hint: "De zeshoek staat op de originele tekening." },
      { pos: 7, symbol: "⬡", value: 4, real: false, hint: "Deze tegel is duidelijk nieuwer dan de rest." },
      { pos: 8, symbol: "⬤", value: 6, real: true,  hint: "De grote cirkel is het middelpunt." }
    ],
    scenes: [
      {
        id: "archief_vergelijking",
        title: "Het archief",
        timeCost: { careful: 2, normal: 1, sabotage: 0 },
        text:
          "In een archiefdoos vinden de historici een pentekening van het mozaïek uit 1887. Sommige posities zijn anders dan vandaag. Een kandidaat bladert snel door de tekening en legt hem meteen weg.",
        molHint: "De Mol legt de archief-tekening zodanig neer dat positie 1 en 4 niet goed zichtbaar zijn.",
        choices: [
          {
            id: "study_archive",
            label: "De tekening grondig vergelijken met de vloer",
            moneyImpact: 800,
            suspicionImpact: -1,
            timePenalty: 2,
            revealsSignals: ["tile_1_false", "tile_4_false"],
            text: "Je ziet duidelijk dat posities 1 (▲) en 4 (★) niet op de originele tekening staan. Die zijn later toegevoegd.",
            candidateReaction: "De historicus knikt. 'Dat dacht ik ook. Goed gezien.'"
          },
          {
            id: "photograph_only",
            label: "Alleen foto's nemen en verder gaan",
            moneyImpact: 300,
            suspicionImpact: 0,
            text: "Je hebt beelden, maar de analyse zal later meer tijd kosten.",
            candidateReaction: "Een kandidaat rolt zijn ogen. 'We hebben nu tijd om te kijken, toch?'"
          },
          {
            id: "flip_archive",
            label: "De tekening ondersteboven leggen zodat niemand hem goed kan lezen",
            moneyImpact: -400,
            suspicionImpact: 4,
            text: "Drie kandidaten zien je de tekening verdraaien. Dat is niet subtiel.",
            candidateReaction: "'Wat doe je nu?' vraagt iemand luid. De camera zoomt in."
          }
        ]
      },
      {
        id: "materiaal_test",
        title: "De materiaaltest",
        timeCost: { careful: 2, normal: 1, sabotage: 0 },
        text:
          "Een conservator biedt een UV-lamp aan. Origineel mozaïekmateriaal gloeit blauw op. Een kandidaat heeft de lamp al een tijdje bij zich maar zegt er niets over.",
        molHint: "De Mol hield de UV-lamp achter — of wees hem bewust verkeerd.",
        choices: [
          {
            id: "use_uv",
            label: "De UV-lamp systematisch over elke tegel houden",
            moneyImpact: 700,
            suspicionImpact: 0,
            timePenalty: 2,
            revealsSignals: ["tile_7_false"],
            text: "Positie 7 (⬡) gloeit niet op. Die tegel is duidelijk modern.",
            candidateReaction: "De conservator beaamt het. De kandidaat met de lamp knijpt zijn ogen samen."
          },
          {
            id: "spot_check",
            label: "Alleen de twijfelachtige tegels testen",
            moneyImpact: 400,
            suspicionImpact: 0,
            dependsOnCandidate: true,
            text: "Je test enkele tegels, maar de resultaten hangen af van welke de groep twijfelachtig vindt.",
            candidateReaction: "Twee kandidaten zijn het niet eens over welke tegels verdacht zijn."
          },
          {
            id: "claim_lamp_broken",
            label: "Zeggen dat de lamp defect is en hem wegleggen",
            moneyImpact: -500,
            suspicionImpact: 3,
            text: "De conservator test de lamp zelf en die werkt perfect. Je verliest geloofwaardigheid.",
            candidateReaction: "'De lamp werkt gewoon,' zegt de conservator droogjes."
          }
        ]
      },
      {
        id: "kandidaat_getuigenis",
        title: "De getuigenis",
        timeCost: { careful: 1, normal: 1, sabotage: 0 },
        text:
          "Een lokale gids heeft het mozaïek zien restaureren. Ze zegt: 'Ze hebben drie tegels vervangen. Een driehoek, een ster en een zeshoek.' Een kandidaat fluistert je toe dat ze ongelijk heeft over de zeshoek.",
        molHint: "De Mol fluistert foute correcties in.",
        choices: [
          {
            id: "trust_guide",
            label: "De gids geloven — drie valse tegels: ▲, ★ en ⬡",
            moneyImpact: 500,
            suspicionImpact: 0,
            revealsSignals: ["tile_1_false", "tile_4_false", "tile_7_false"],
            text: "De gids heeft gelijk. Alle drie de valse tegels zijn geïdentificeerd.",
            candidateReaction: "'Ik vertrouw die gids niet blind,' mompelt een kandidaat. Maar de feiten kloppen."
          },
          {
            id: "trust_whisper",
            label: "De kandidaat geloven — ⬟ (positie 6) is ook vals",
            moneyImpact: -300,
            suspicionImpact: 1,
            text: "Je volgt het fluisteren. Maar positie 6 is authentiek — je hebt je laten misleiden.",
            candidateReaction: "De gids kijkt verbaasd. 'Nee, de zeshoek is origineel.'"
          },
          {
            id: "ask_proof",
            label: "Vragen of de gids bewijs heeft van de restauratie",
            moneyImpact: 600,
            suspicionImpact: -1,
            timePenalty: 1,
            revealsSignals: ["tile_1_false", "tile_4_false"],
            text: "De gids toont een restauratierapport. Twee valse tegels worden bevestigd.",
            candidateReaction: "Slim gevraagd. De kandidaat die fluisterde kijkt weg."
          }
        ]
      }
    ],
    finale: {
      type: "multi_select",
      prompt: "Welke posities zijn VALS (door de Mol toegevoegd)?",
      maxSelections: 3,
      scoring: "Elke correct aangewezen valse positie levert €500 op. Bonus van €1500 als alle drie correct zijn.",
      options: [
        { id: "tile_0", label: "Positie 0: ● (ronde tegel)",   correct: false, value: -300 },
        { id: "tile_1", label: "Positie 1: ▲ (driehoek)",      correct: true,  value: 500  },
        { id: "tile_2", label: "Positie 2: ■ (vierkant)",       correct: false, value: -300 },
        { id: "tile_3", label: "Positie 3: ◆ (diamant)",        correct: false, value: -300 },
        { id: "tile_4", label: "Positie 4: ★ (ster)",           correct: true,  value: 500  },
        { id: "tile_5", label: "Positie 5: ✦ (kruis)",          correct: false, value: -300 },
        { id: "tile_6", label: "Positie 6: ⬟ (zeshoek)",        correct: false, value: -300 },
        { id: "tile_7", label: "Positie 7: ⬡ (kleine zeshoek)", correct: true,  value: 500  },
        { id: "tile_8", label: "Positie 8: ⬤ (grote cirkel)",   correct: false, value: -300 }
      ]
    },
    candidateReactionTemplates: {
      truthful:   "{name} zegt: 'Positie {pos} zag er echt anders uit dan de rest. Ik vertrouwde dat niet.'",
      mistaken:   "{name} zegt: 'Ik dacht dat {pos} echt was, maar ik had de UV-lamp niet zelf.'",
      deceptive:  "{name} zegt kalm: 'De gids vergist zich. Positie 6 is duidelijk ook modern.'",
      suspiciousAboutPlayer: "{name} zegt later: 'Jij was erg snel bij het wegleggen van de archief-tekening.'"
    },
    cafeHooks: [
      "Wie legde de archief-tekening weg?",
      "Wie beweerde dat de UV-lamp defect was?",
      "Wie volgde het fluisteren in plaats van de gids?",
      "Wie wees bewust de verkeerde tegels aan?"
    ]
  },

  // ── NIEUWE OPDRACHT 3 ──────────────────────────────────────────────────────
  {
    id: "szeged_verrader_markt",
    cityId: "szeged",
    title: "De Verrader op de Markt",
    locationName: "Grote Markt van Szeged",
    type: "social_deduction",
    minCandidates: 5,
    maxTeams: 3,
    timeLimit: 12,
    money: { max: 6000, partial: true },
    uiHint: "market_social",
    intro:
      "Op de drukke markt van Szeged heeft iemand een geheime boodschap achtergelaten bij vijf kraampjes. Maar één van de marktverkopers is een handlanger van de Mol — die verspreidt foute informatie. De groep moet bepalen wie de handlanger is én de echte boodschap reconstrueren.",
    briefing:
      "Gilles: 'Vijf verkopers, vijf boodschapjes. Vier zijn echt. Eén verkoper liegt in opdracht van de Mol. Als jullie de handlanger correct identificeren én de echte code reconstrueren, verdienen jullie €3000 plus €500 per correct boodschapje. Identificeer je de handlanger verkeerd, dan gaat de bonus verloren.'",
    teamModes: [
      { id: "marktteam",    name: "Team Markt",    idealSize: 2, role: "praat met de verkopers en noteert hun boodschappen." },
      { id: "observatieteam", name: "Team Observatie", idealSize: 2, role: "observeert de verkopers van op afstand op verdacht gedrag." },
      { id: "analyseteam",  name: "Team Analyse",  idealSize: 3, role: "vergelijkt de boodschappen en zoekt tegenstrijdigheden." }
    ],
    vendors: [
      { id: "spice",  name: "Kruid-Anna",    stall: "Kruidenkraam",    message: "B", real: true,  tell: "Ze snijdt kruiden zonder op te kijken en fluistert de letter nonchalant." },
      { id: "bread",  name: "Bram de bakker", stall: "Broodkraam",     message: "E", real: true,  tell: "Hij stopt de boodschap in een broodrolletje en knipoogt." },
      { id: "pepper", name: "Piroska",        stall: "Paprikakraam",   message: "F", real: false, tell: "Ze is overdreven vriendelijk en herhaalt de boodschap te vaak." },
      { id: "cloth",  name: "Tibor de kleermaker", stall: "Kledingkraam", message: "L", real: true, tell: "Hij naait terwijl hij praat en verbergt de boodschap in een zoom." },
      { id: "honey",  name: "Honey-Éva",      stall: "Honingkraam",   message: "T", real: true,  tell: "Ze tikt de boodschap in morse op het potje terwijl ze praat." }
    ],
    scenes: [
      {
        id: "eerste_ronde",
        title: "De eerste bezoekronde",
        timeCost: { careful: 2, normal: 1, sabotage: 0 },
        text:
          "De eerste verkopers worden bezocht. Kruid-Anna fluistert 'B'. Bram stopt een papiertje in een brood. Piroska herhaalt haar boodschap drie keer terwijl ze je strak aankijkt.",
        molHint: "De Mol kan proberen Piroska te vermijden of haar boodschap als betrouwbaar te bestempelen.",
        choices: [
          {
            id: "observe_carefully",
            label: "Alle drie verkopers aandachtig observeren op lichaamstaal",
            moneyImpact: 600,
            suspicionImpact: -1,
            timePenalty: 2,
            revealsSignals: ["vendor_pepper_suspicious"],
            text: "Piroska's overdreven herhaling en oogcontact vallen op. Ze lijkt het te goed te spelen.",
            candidateReaction: "'Die paprikadame is raar,' zegt een kandidaat zacht."
          },
          {
            id: "rush_collect",
            label: "Snel alle boodschappen verzamelen zonder analyse",
            moneyImpact: 200,
            suspicionImpact: 0,
            text: "Je hebt de boodschappen maar geen aanwijzingen over wie liegt.",
            candidateReaction: "Een kandidaat pakt jouw notitieblok en begint zelf te analyseren."
          },
          {
            id: "skip_piroska",
            label: "Piroska overslaan — 'die heeft niets nuttigs'",
            moneyImpact: 0,
            suspicionImpact: 3,
            text: "Je slaat precies de verdachte verkoper over. Toeval of niet?",
            candidateReaction: "'Waarom die kraam overslaan?' vraagt een kandidaat luid. Drie anderen draaien zich om."
          }
        ]
      },
      {
        id: "kruisverhoor_kandidaat",
        title: "Het kruisverhoor",
        timeCost: { careful: 2, normal: 1, sabotage: 0 },
        text:
          "Terug bij het analyseteam ontstaat discussie. Een kandidaat beweert dat Piroska de meest betrouwbare was. Een andere kandidaat zegt dat Tibor raar deed. Jij moet kiezen wie je gelooft.",
        molHint: "De Mol verdedigt Piroska actief en beschuldigt een echte verkoper.",
        candidateInteraction: {
          prompt: "Wie steun je in de discussie?",
          options: [
            { id: "defend_piroska",  label: "De kandidaat die Piroska verdedigt", candidateEffect: "mole_ally" },
            { id: "question_piroska", label: "De kandidaat die Piroska verdacht vindt", candidateEffect: "truth_seeker" }
          ]
        },
        choices: [
          {
            id: "side_with_skeptic",
            label: "De sceptische kandidaat steunen — Piroska is verdacht",
            moneyImpact: 700,
            suspicionImpact: 0,
            revealsSignals: ["vendor_pepper_suspicious", "vendor_tibor_clear"],
            text: "De analyse convergeert op Piroska. Tibor's boodschap (L) lijkt betrouwbaar.",
            candidateReaction: "De kandidaat die Piroska verdedigde zwijgt plots. Dat valt op."
          },
          {
            id: "stay_neutral",
            label: "Neutraal blijven en meer bewijs vragen",
            moneyImpact: 300,
            suspicionImpact: 0,
            timePenalty: 1,
            text: "Je vraagt de groep het bewijs van elke verkoper te herhalen. Dat kost tijd maar levert structuur.",
            candidateReaction: "De groep zucht, maar een kandidaat knikt goedkeurend."
          },
          {
            id: "defend_piroska_mol",
            label: "Piroska verdedigen — 'ze was gewoon enthousiast'",
            moneyImpact: -400,
            suspicionImpact: 3,
            revealsSuspect: "player_defends_mole",
            text: "Je verdedigt actief de leugenaar. De groep herinnert dit bij de eindvraag.",
            candidateReaction: "'Merkwaardig dat jij haar meteen verdedigt,' zegt een kandidaat."
          }
        ]
      },
      {
        id: "honingkraam_visit",
        title: "Honey-Éva en de morseboodschap",
        timeCost: { careful: 1, normal: 1, sabotage: 0 },
        text:
          "Honey-Éva tikt een ritmisch patroon op een honingpot: kort-lang-kort. Een kandidaat zegt dat hij 'T' herkent in morsetaal. Een andere kandidaat beweert dat het gewoon een tic is.",
        molHint: "De Mol kan de morse-boodschap in twijfel trekken.",
        choices: [
          {
            id: "decode_morse",
            label: "Zelf de morse proberen te herkennen",
            moneyImpact: 500,
            suspicionImpact: 0,
            revealsSignals: ["vendor_honey_real"],
            text: "Kort-lang-kort is inderdaad de letter T in morsetaal. Eva's boodschap is echt.",
            candidateReaction: "'Zie je wel!' zegt de kandidaat die het herkende. De twijfelaar haalt zijn schouders op."
          },
          {
            id: "trust_morse_candidate",
            label: "De kandidaat vertrouwen die morse kent",
            moneyImpact: 400,
            suspicionImpact: 0,
            dependsOnCandidate: true,
            text: "Je vertrouwt op de morsekennis van de kandidaat.",
            candidateReaction: "Die kandidaat lacht tevreden. Of dat gegrond is, zie je later."
          },
          {
            id: "dismiss_morse",
            label: "Zeggen dat morse onzin is in deze context",
            moneyImpact: -300,
            suspicionImpact: 2,
            text: "Eva's boodschap wordt twijfelachtig. De groep verliest een zekere bron.",
            candidateReaction: "Eva kijkt je aan en tikt opnieuw, nadrukkelijker deze keer."
          }
        ]
      },
      {
        id: "finale_confrontatie",
        title: "De confrontatie",
        timeCost: { careful: 1, normal: 1, sabotage: 0 },
        text:
          "Het analyseteam heeft alles bij elkaar gelegd. Vier boodschappen lijken consistent: B, L, T en E. Eén boodschap — F van Piroska — past niet. Maar een kandidaat eist dat de groep F meeneemt en een van de anderen laat vallen.",
        molHint: "De Mol oefent druk uit om F in de finale-set te houden.",
        choices: [
          {
            id: "drop_f",
            label: "F weggooien — de analyse klopt en Piroska liegt",
            moneyImpact: 900,
            suspicionImpact: -1,
            revealsSignals: ["vendor_pepper_confirmed_false"],
            text: "De groep is eensgezind: F valt weg. De echte boodschapjes zijn B, L, T, E.",
            candidateReaction: "Een kandidaat is zichtbaar geïrriteerd maar zwijgt. Je hebt de handlanger gevonden."
          },
          {
            id: "include_f_pressure",
            label: "Mee gaan in de druk en F meenemen",
            moneyImpact: -500,
            suspicionImpact: 2,
            text: "Je gaat mee met de druk. F haalt de finale-set — maar klopt niet.",
            candidateReaction: "Gilles kijkt peinzend. 'Interessant beslissingsmoment.'"
          },
          {
            id: "ask_vote",
            label: "Een stemming houden over wie de groep vertrouwt",
            moneyImpact: 400,
            suspicionImpact: 0,
            timePenalty: 2,
            text: "De stemming eindigt 3-2 voor het weggooien van F. Dat geeft structuur maar kost tijd.",
            candidateReaction: "De twee tegenstemmers kijken elkaar aan."
          }
        ]
      }
    ],
    finale: {
      type: "suspect_choice",
      prompt: "Wie is de handlanger van de Mol op de markt?",
      scoring: "Correcte identificatie levert €3000 op. Fout kost de helft van het opgespaarde geld.",
      options: [
        { id: "spice",   label: "Kruid-Anna (kruidenkraam)",          correct: false, bonus: 0, result: "Kruid-Anna gaf jullie de echte boodschap. De echte handlanger lacht." },
        { id: "bread",   label: "Bram de bakker (broodkraam)",         correct: false, bonus: 0, result: "Bram's broodrolletje bevatte de echte boodschap." },
        { id: "pepper",  label: "Piroska (paprikakraam)",              correct: true,  bonus: 3000, result: "Correct! Piroska was de handlanger. Haar F was een afleidingsmanoeuvre." },
        { id: "cloth",   label: "Tibor de kleermaker (kledingkraam)", correct: false, bonus: 0, result: "Tibors zoom-boodschap was echt." },
        { id: "honey",   label: "Honey-Éva (honingkraam)",            correct: false, bonus: 0, result: "Eva's morse was geen tic — het was de echte boodschap T." }
      ]
    },
    candidateReactionTemplates: {
      truthful:   "{name} zegt: 'Ik heb {vendor} geobserveerd en die gedroeg zich normaal.'",
      mistaken:   "{name} zegt: 'Ik dacht dat Piroska betrouwbaar was. Maar ik let niet op lichaamstaal.'",
      deceptive:  "{name} zegt nadrukkelijk: 'Piroska was de meest open verkoper van allemaal.'",
      suspiciousAboutPlayer: "{name} zegt: 'Jij wou Piroska overslaan. Dat vond ik opvallend.'"
    },
    cafeHooks: [
      "Wie verdedigde Piroska zonder bewijs?",
      "Wie wou F in de finale-set houden?",
      "Wie herkende de morse van Honey-Éva?",
      "Wie oefende druk uit bij de confrontatie?"
    ]
  }
];
