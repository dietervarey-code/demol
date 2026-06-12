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
  }
];
