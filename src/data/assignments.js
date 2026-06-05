export const assignments = [
  {
    id: "budapest_brugcode",
    day: 1,
    cityId: "budapest",
    title: "De Brugcode",
    locationName: "Kettingbrug en Donaukade",
    intro:
      "Langs de Donau hangen vier metalen plaatjes met symbolen. Elk symbool hoort bij een cijfer. De groep moet de juiste volgorde reconstrueren voordat Gilles de koffer sluit.",
    briefing:
      "Gilles legt uit: vier teams krijgen elk een deel van de route. Elk juist cijfer op de juiste positie levert EUR 500 op. De volledige code levert EUR 3000 extra op. De volledige code moet op het einde worden ingegeven.",
    code: "7462",
    rewardPerCorrectDigit: 500,
    fullCodeBonus: 3000,
    teamRoles: [
      { id: "brug", name: "Team Brug", role: "zoekt metalen plaatjes op de Kettingbrug." },
      { id: "kade", name: "Team Kade", role: "controleert de volgorde van de symbolen langs de Donau." },
      { id: "koffer", name: "Team Koffer", role: "vergelijkt gevonden symbolen met de sloten op een koffer." },
      { id: "controle", name: "Team Controle", role: "legt alle cijfers naast elkaar en bewaakt de tijd." }
    ],
    phases: [
      {
        id: "brug_1",
        digitIndex: 0,
        truth: "7",
        scene: "Aan de brugleuning vindt de groep een plaatje met een maan. Op de achterkant staat duidelijk: maan = 7.",
        choices: [
          { id: "noteer", label: "Zelf het plaatje overschrijven", playerGetsTruth: true, suspicion: 0, text: "Je noteert maan = 7 in je Molboekje." },
          { id: "roep", label: "Het cijfer hardop laten roepen door je team", playerGetsTruth: false, suspicion: 0, text: "Iemand roept het cijfer door, maar door verkeer hoor je het niet perfect." },
          { id: "haast", label: "Doorlopen omdat de klok tikt", playerGetsTruth: false, suspicion: 1, text: "Je wint tijd, maar controleert het eerste cijfer niet zelf." }
        ]
      },
      {
        id: "brug_2",
        digitIndex: 1,
        truth: "4",
        scene: "Bij een lantaarnpaal hangt een tweede symbool: een sleutel. De koffer heeft vier sleutelmarkeringen.",
        choices: [
          { id: "vergelijk", label: "De sleutelmarkeringen tellen", playerGetsTruth: true, suspicion: 0, text: "Je telt vier markeringen. Het tweede cijfer lijkt 4." },
          { id: "laat", label: "Een andere kandidaat laten tellen", playerGetsTruth: false, suspicion: 0, text: "Een kandidaat telt snel en noemt een cijfer, maar je controleert niet mee." },
          { id: "afleiden", label: "De discussie onderbreken en zelf sturen", playerGetsTruth: false, suspicion: 2, text: "Je klinkt zekerder dan je bent. Dat valt op." }
        ]
      },
      {
        id: "brug_3",
        digitIndex: 2,
        truth: "6",
        scene: "Op de Donaukade staan zes vlaggen in dezelfde kleur als het derde slot van de koffer.",
        choices: [
          { id: "tel", label: "De vlaggen rustig tellen", playerGetsTruth: true, suspicion: 0, text: "Je telt zes vlaggen. Het derde cijfer is waarschijnlijk 6." },
          { id: "volg", label: "Meegaan met het snelste antwoord", playerGetsTruth: false, suspicion: 0, text: "De groep versnelt. Jij weet niet zeker of er vijf of zes vlaggen waren." },
          { id: "twijfel", label: "Blijven twijfelen en tijd verliezen", playerGetsTruth: true, suspicion: 1, text: "Je verliest tijd, maar bevestigt wel het cijfer 6." }
        ]
      },
      {
        id: "brug_4",
        digitIndex: 3,
        truth: "2",
        scene: "Aan het laatste slot hangen twee kleine belletjes. Gilles zegt niets, maar de cameraman zoomt opvallend in.",
        choices: [
          { id: "kijk", label: "De belletjes controleren", playerGetsTruth: true, suspicion: 0, text: "Je ziet twee belletjes. Dat moet het vierde cijfer zijn." },
          { id: "vraag", label: "Aan je team vragen wat zij zagen", playerGetsTruth: false, suspicion: 0, text: "Je krijgt twee verschillende antwoorden en moet later kiezen wie je gelooft." },
          { id: "negeer", label: "Het detail negeren", playerGetsTruth: false, suspicion: 1, text: "Je laat een mogelijk belangrijk detail liggen." }
        ]
      }
    ]
  },
  {
    id: "budapest_thermen",
    day: 2,
    cityId: "budapest",
    title: "De Thermenroute",
    locationName: "oude badhuizen van Boedapest",
    intro:
      "In een historisch badhuis liggen tegels met Romeinse cijfers verstopt. De teams moeten badkamers openen, temperaturen vergelijken en de cijfers in volgorde zetten.",
    briefing:
      "Vier correcte cijfers vormen samen de toegangscode van een kluis. Elk juist cijfer levert EUR 500 op. De juiste volledige code levert EUR 3000 extra op.",
    code: "5298",
    rewardPerCorrectDigit: 500,
    fullCodeBonus: 3000,
    teamRoles: [
      { id: "warm", name: "Team Warmwater", role: "controleert warme badkamers en temperatuurkaartjes." },
      { id: "koud", name: "Team Koudwater", role: "zoekt blauwe tegels in de koude gangen." },
      { id: "lockers", name: "Team Lockers", role: "opent lockers met verborgen aanwijzingen." },
      { id: "kluis", name: "Team Kluis", role: "bepaalt de volgorde van de gevonden cijfers." }
    ],
    phases: [
      { id: "therm_1", digitIndex: 0, truth: "5", scene: "In de warmwaterzaal staan vijf koperen bekers exact onder het symbool van de kluis.", choices: [
        { id: "tel", label: "De bekers zelf tellen", playerGetsTruth: true, suspicion: 0, text: "Je telt vijf bekers." },
        { id: "vertrouw", label: "Een teamgenoot laten tellen", playerGetsTruth: false, suspicion: 0, text: "Je vertrouwt op het antwoord van je teamgenoot." },
        { id: "overslaan", label: "De zaal overslaan om tijd te winnen", playerGetsTruth: false, suspicion: 1, text: "Je laat het eerste spoor onzeker achter." }
      ] },
      { id: "therm_2", digitIndex: 1, truth: "2", scene: "In de koude gang liggen twee blauwe tegels los. Onder een tegel zit een markering.", choices: [
        { id: "hef", label: "Beide tegels optillen", playerGetsTruth: true, suspicion: 0, text: "Onder de tweede tegel staat een 2." },
        { id: "een", label: "Slechts één tegel controleren", playerGetsTruth: false, suspicion: 0, text: "Je ziet iets, maar mist de bevestiging." },
        { id: "laat", label: "Iemand anders laten zoeken", playerGetsTruth: false, suspicion: 0, text: "Je hoort later een cijfer, maar zag het niet zelf." }
      ] },
      { id: "therm_3", digitIndex: 2, truth: "9", scene: "Een locker opent met een sleutel waarop negen krasjes staan.", choices: [
        { id: "controleer", label: "De krasjes controleren", playerGetsTruth: true, suspicion: 0, text: "Je telt negen krasjes." },
        { id: "snel", label: "De sleutel meteen doorgeven", playerGetsTruth: false, suspicion: 0, text: "De sleutel verdwijnt snel uit je handen." },
        { id: "verwar", label: "Hardop twijfelen tussen 6 en 9", playerGetsTruth: true, suspicion: 1, text: "Je ziet uiteindelijk dat het 9 is, maar je twijfel maakt anderen onzeker." }
      ] },
      { id: "therm_4", digitIndex: 3, truth: "8", scene: "Rond de kluis staan acht kleine mozaiekstenen in dezelfde vorm als de laatste aanwijzing.", choices: [
        { id: "tel", label: "De mozaiekstenen tellen", playerGetsTruth: true, suspicion: 0, text: "Je telt acht stenen." },
        { id: "stem", label: "De groep laten stemmen", playerGetsTruth: false, suspicion: 0, text: "De stemming eindigt verdeeld." },
        { id: "druk", label: "Aandringen op een snelle keuze", playerGetsTruth: false, suspicion: 2, text: "Je duwt de groep richting snelheid, niet zekerheid." }
      ] }
    ]
  },
  {
    id: "eger_wijnvaten",
    day: 3,
    cityId: "eger",
    title: "De Wijnvaten van Eger",
    locationName: "wijnkelders onder Eger",
    intro: "Diep onder Eger staan tientallen vaten. Vier vaten dragen een verborgen cijfer. De volgorde volgt uit het proefboek van de keldermeester.",
    briefing: "Elk correct cijfer op de juiste positie levert EUR 500 op. De volledige code levert EUR 3000 extra op.",
    code: "6834",
    rewardPerCorrectDigit: 500,
    fullCodeBonus: 3000,
    teamRoles: [
      { id: "kelder", name: "Team Kelder", role: "zoekt naar gemarkeerde vaten." },
      { id: "proef", name: "Team Proefboek", role: "leest het boek van de keldermeester." },
      { id: "routes", name: "Team Routes", role: "controleert welke gang bij welke vatkleur hoort." },
      { id: "slot", name: "Team Slot", role: "zet de gevonden cijfers in volgorde." }
    ],
    phases: [
      { id: "vat_1", digitIndex: 0, truth: "6", scene: "Op een donker vat staat een druiventros met zes pitten.", choices: [
        { id: "pitten", label: "De pitten zelf tellen", playerGetsTruth: true, suspicion: 0, text: "Je telt zes pitten." },
        { id: "vraag", label: "Iemand anders laten kijken", playerGetsTruth: false, suspicion: 0, text: "Je hoort een antwoord, maar ziet het zelf niet." },
        { id: "door", label: "Doorlopen naar het volgende vat", playerGetsTruth: false, suspicion: 1, text: "Je laat het eerste cijfer afhangen van anderen." }
      ] },
      { id: "vat_2", digitIndex: 1, truth: "8", scene: "Het proefboek vermeldt acht flessen bij de tweede keldergang.", choices: [
        { id: "boek", label: "De regel in het proefboek zelf lezen", playerGetsTruth: true, suspicion: 0, text: "Je leest duidelijk acht flessen." },
        { id: "samenvat", label: "Een samenvatting vragen", playerGetsTruth: false, suspicion: 0, text: "Een kandidaat vat snel samen, maar je mist het origineel." },
        { id: "stoor", label: "De lezer onderbreken", playerGetsTruth: false, suspicion: 2, text: "Je onderbreekt de concentratie van de groep." }
      ] },
      { id: "vat_3", digitIndex: 2, truth: "3", scene: "In de derde gang staan drie rode kaarsen naast het juiste vat.", choices: [
        { id: "kaars", label: "De rode kaarsen tellen", playerGetsTruth: true, suspicion: 0, text: "Je telt drie rode kaarsen." },
        { id: "vertrouw", label: "Vertrouwen op de eerste roeper", playerGetsTruth: false, suspicion: 0, text: "Er wordt snel een cijfer geroepen." },
        { id: "verplaats", label: "Een kaars verplaatsen om beter te kijken", playerGetsTruth: true, suspicion: 1, text: "Je ziet drie, maar je actie oogt vreemd." }
      ] },
      { id: "vat_4", digitIndex: 3, truth: "4", scene: "Vier ijzeren ringen hangen aan het laatste vat.", choices: [
        { id: "ringen", label: "De ringen controleren", playerGetsTruth: true, suspicion: 0, text: "Vier ringen. Het laatste cijfer lijkt duidelijk." },
        { id: "twijfel", label: "Twijfelen omdat een ring loshangt", playerGetsTruth: true, suspicion: 1, text: "Je bevestigt uiteindelijk vier ringen." },
        { id: "negeer", label: "De losse ring negeren", playerGetsTruth: false, suspicion: 0, text: "Je weet niet of de losse ring meetelt." }
      ] }
    ]
  },
  {
    id: "balaton_kompas",
    day: 5,
    cityId: "balaton",
    title: "Het Kompas van Balaton",
    locationName: "steiger aan het Balatonmeer",
    intro: "Op het water liggen boeien met cijfers. De teams krijgen kompasrichtingen en moeten de juiste vier boeien in volgorde bepalen.",
    briefing: "Elke juiste boei op de juiste positie levert EUR 500 op. De volledige routecode levert EUR 3000 extra op.",
    code: "9157",
    rewardPerCorrectDigit: 500,
    fullCodeBonus: 3000,
    teamRoles: [
      { id: "noord", name: "Team Noord", role: "volgt noordelijke kompasrichtingen." },
      { id: "oost", name: "Team Oost", role: "controleert boeien aan de oostkant." },
      { id: "steiger", name: "Team Steiger", role: "houdt de routekaart bij." },
      { id: "anker", name: "Team Anker", role: "controleert de eindvolgorde." }
    ],
    phases: [
      { id: "bal_1", digitIndex: 0, truth: "9", scene: "De eerste kompaslijn eindigt bij boei 9.", choices: [
        { id: "kompas", label: "Zelf het kompas volgen", playerGetsTruth: true, suspicion: 0, text: "De lijn wijst naar boei 9." },
        { id: "volg", label: "De stuurder vertrouwen", playerGetsTruth: false, suspicion: 0, text: "Je vertrouwt op de stuurder." },
        { id: "afleid", label: "Hardop een andere richting voorstellen", playerGetsTruth: false, suspicion: 2, text: "Je zaait twijfel over de koers." }
      ] },
      { id: "bal_2", digitIndex: 1, truth: "1", scene: "Bij de tweede stop hangt slechts een vlag aan de steiger.", choices: [
        { id: "vlag", label: "Het aantal vlaggen tellen", playerGetsTruth: true, suspicion: 0, text: "Een vlag. Cijfer 1." },
        { id: "foto", label: "Een foto laten controleren", playerGetsTruth: false, suspicion: 0, text: "Je ziet de foto zelf niet goed." },
        { id: "snel", label: "Snel doorvaren", playerGetsTruth: false, suspicion: 1, text: "Je laat dit fragment onzeker." }
      ] },
      { id: "bal_3", digitIndex: 2, truth: "5", scene: "Vijf houten palen vormen een rij naast de derde boei.", choices: [
        { id: "palen", label: "De palen tellen", playerGetsTruth: true, suspicion: 0, text: "Je telt vijf palen." },
        { id: "groep", label: "De groep laten beslissen", playerGetsTruth: false, suspicion: 0, text: "De groep is niet unaniem." },
        { id: "twijfel", label: "Blijven hertellen", playerGetsTruth: true, suspicion: 1, text: "Je verliest tijd, maar bevestigt vijf." }
      ] },
      { id: "bal_4", digitIndex: 3, truth: "7", scene: "De laatste aanwijzing is een touw met zeven knopen.", choices: [
        { id: "knopen", label: "De knopen zelf tellen", playerGetsTruth: true, suspicion: 0, text: "Zeven knopen." },
        { id: "doorgeef", label: "Het touw doorgeven", playerGetsTruth: false, suspicion: 0, text: "Je hoort later een cijfer." },
        { id: "los", label: "Een knoop losmaken om beter te tellen", playerGetsTruth: true, suspicion: 2, text: "Je bevestigt zeven, maar maakt jezelf verdacht." }
      ] }
    ]
  },
  {
    id: "pecs_mozaiek",
    day: 6,
    cityId: "pecs",
    title: "Het Mozaiek van Pecs",
    locationName: "kunstplein van Pecs",
    intro: "Op het plein ligt een mozaiek waarvan vier kleuren overeenkomen met cijfers. De volgorde wordt bepaald door de route van een gids.",
    briefing: "Vier kleurcodes vormen samen de eindcode. Elk juist cijfer levert EUR 500 op; de volledige code levert EUR 3000 extra op.",
    code: "2486",
    rewardPerCorrectDigit: 500,
    fullCodeBonus: 3000,
    teamRoles: [
      { id: "kleur", name: "Team Kleur", role: "zoekt kleurvlakken op het mozaiek." },
      { id: "gids", name: "Team Gids", role: "onthoudt de route van de gids." },
      { id: "atelier", name: "Team Atelier", role: "vergelijkt schetsen met het plein." },
      { id: "volgorde", name: "Team Volgorde", role: "zet de cijfers in de juiste volgorde." }
    ],
    phases: [
      { id: "pecs_1", digitIndex: 0, truth: "2", scene: "De gids stopt eerst bij twee blauwe stenen.", choices: [
        { id: "tel", label: "Zelf de blauwe stenen tellen", playerGetsTruth: true, suspicion: 0, text: "Twee blauwe stenen." },
        { id: "schets", label: "De schets volgen", playerGetsTruth: false, suspicion: 0, text: "De schets is niet helemaal duidelijk." },
        { id: "praat", label: "Tijdens de uitleg met iemand praten", playerGetsTruth: false, suspicion: 2, text: "Je mist een belangrijk detail." }
      ] },
      { id: "pecs_2", digitIndex: 1, truth: "4", scene: "Daarna wijst hij naar vier witte tegels in een kruis.", choices: [
        { id: "kruis", label: "Het kruis controleren", playerGetsTruth: true, suspicion: 0, text: "Vier witte tegels." },
        { id: "groep", label: "Vragen wat de groep zag", playerGetsTruth: false, suspicion: 0, text: "De antwoorden lopen uiteen." },
        { id: "haast", label: "Aandringen om verder te gaan", playerGetsTruth: false, suspicion: 1, text: "Je versnelt de groep." }
      ] },
      { id: "pecs_3", digitIndex: 2, truth: "8", scene: "In het atelier ligt een schets met acht groene stippen.", choices: [
        { id: "stippen", label: "De stippen tellen", playerGetsTruth: true, suspicion: 0, text: "Acht groene stippen." },
        { id: "laat", label: "Een ander laten lezen", playerGetsTruth: false, suspicion: 0, text: "Je hoort een getal, maar controleert niet." },
        { id: "bedek", label: "Per ongeluk een deel van de schets bedekken", playerGetsTruth: false, suspicion: 2, text: "De groep verliest overzicht." }
      ] },
      { id: "pecs_4", digitIndex: 3, truth: "6", scene: "De laatste tegelgroep bestaat uit zes rode driehoeken.", choices: [
        { id: "driehoek", label: "De driehoeken tellen", playerGetsTruth: true, suspicion: 0, text: "Zes rode driehoeken." },
        { id: "stem", label: "De meerderheid volgen", playerGetsTruth: false, suspicion: 0, text: "Je volgt de meerderheid." },
        { id: "verwarring", label: "Rood en oranje door elkaar halen", playerGetsTruth: false, suspicion: 2, text: "Je verwart de groep." }
      ] }
    ]
  },
  {
    id: "szeged_markt",
    day: 7,
    cityId: "szeged",
    title: "De Markt van Szeged",
    locationName: "overdekte markt van Szeged",
    intro: "Op de markt moeten teams onderhandelen voor vier objecten. Elk object heeft een verborgen cijfer op het prijslabel.",
    briefing: "Vier prijslabels vormen de code. Elk juist cijfer levert EUR 500 op. De volledige code levert EUR 3000 extra op.",
    code: "3719",
    rewardPerCorrectDigit: 500,
    fullCodeBonus: 3000,
    teamRoles: [
      { id: "paprika", name: "Team Paprika", role: "zoekt het kraam met rode paprika's." },
      { id: "textiel", name: "Team Textiel", role: "controleert geweven doeken." },
      { id: "munten", name: "Team Munten", role: "betaalt en bewaakt wisselgeld." },
      { id: "labels", name: "Team Labels", role: "noteert de cijfers op prijslabels." }
    ],
    phases: [
      { id: "szeg_1", digitIndex: 0, truth: "3", scene: "Bij het paprikakraam staan drie rode manden apart.", choices: [
        { id: "mand", label: "De rode manden tellen", playerGetsTruth: true, suspicion: 0, text: "Drie rode manden." },
        { id: "handel", label: "Meteen onderhandelen", playerGetsTruth: false, suspicion: 0, text: "Je mist het cijfer op het label." },
        { id: "afleid", label: "Over de prijs beginnen discussieren", playerGetsTruth: false, suspicion: 1, text: "De groep verliest focus." }
      ] },
      { id: "szeg_2", digitIndex: 1, truth: "7", scene: "Op een doek staan zeven geborduurde bloemen.", choices: [
        { id: "bloem", label: "De bloemen tellen", playerGetsTruth: true, suspicion: 0, text: "Zeven bloemen." },
        { id: "vraag", label: "De verkoper vragen", playerGetsTruth: false, suspicion: 0, text: "De verkoper spreekt snel Hongaars." },
        { id: "lach", label: "De vraag wegwuiven", playerGetsTruth: false, suspicion: 2, text: "Je doet alsof het detail niet belangrijk is." }
      ] },
      { id: "szeg_3", digitIndex: 2, truth: "1", scene: "Bij de munten ligt een enkele gouden munt apart.", choices: [
        { id: "munt", label: "De aparte munt noteren", playerGetsTruth: true, suspicion: 0, text: "Een gouden munt." },
        { id: "wissel", label: "Alleen het wisselgeld controleren", playerGetsTruth: false, suspicion: 0, text: "Je mist de aparte munt." },
        { id: "weg", label: "De munt verplaatsen", playerGetsTruth: true, suspicion: 2, text: "Je ziet het cijfer, maar je handeling valt op." }
      ] },
      { id: "szeg_4", digitIndex: 3, truth: "9", scene: "Het laatste prijslabel heeft negen kleine gaatjes aan de rand.", choices: [
        { id: "gaatjes", label: "De gaatjes tellen", playerGetsTruth: true, suspicion: 0, text: "Negen gaatjes." },
        { id: "scan", label: "Het label snel scannen", playerGetsTruth: false, suspicion: 0, text: "Je ziet het niet scherp." },
        { id: "duw", label: "Aandringen op direct beslissen", playerGetsTruth: false, suspicion: 1, text: "Je maakt de groep onzeker." }
      ] }
    ]
  }
];

export const seasonDays = [
  { day: 1, cityId: "budapest", assignmentId: "budapest_bom_donau", title: "Aankomst in Hongarije" },
  { day: 2, cityId: "budapest", assignmentId: "budapest_bom_donau", title: "De tweede dag in Boedapest" },
  { day: 3, cityId: "eger", assignmentId: "eger_wijnveiling", title: "Naar de wijnstad Eger" },
  { day: 4, cityId: "eger", assignmentId: "eger_wijnveiling", title: "Onder de stad" },
  { day: 5, cityId: "balaton", assignmentId: "balaton_reddingsactie", title: "Aan het Balatonmeer" },
  { day: 6, cityId: "pecs", assignmentId: "pecs_galerij_diefstal", title: "Patronen in Pécs" },
  { day: 7, cityId: "szeged", assignmentId: "szeged_paprika_pakket", title: "De markt van Szeged" },
  { day: 8, cityId: "szeged", assignmentId: "szeged_paprika_pakket", title: "Finale in Szeged" }
];
