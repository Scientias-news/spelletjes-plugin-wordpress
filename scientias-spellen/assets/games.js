/* ==========================================
   SCIENTIAS SPELLEN — GAME LOGIC
   ========================================== */

'use strict';

// ==========================================
// DATA
// ==========================================

let QUIZ_QUESTIONS = [
  {
    category: 'Sterrenkunde',
    question: 'Hoe lang doet licht er over om van de zon naar de aarde te reizen?',
    options: ['2 minuten', '8 minuten', '20 minuten', '45 minuten'],
    correct: 1,
    explanation: 'Zonlicht legt de ~150 miljoen km afstand af in ongeveer 8 minuten en 20 seconden.'
  },
  {
    category: 'Scheikunde',
    question: 'Welk element heeft het chemische symbool Au?',
    options: ['Zilver', 'Aluminium', 'Goud', 'Argon'],
    correct: 2,
    explanation: 'Au komt van "aurum", het Latijnse woord voor goud.'
  },
  {
    category: 'Sterrenkunde',
    question: 'Hoeveel planeten telt ons zonnestelsel?',
    options: ['7', '8', '9', '10'],
    correct: 1,
    explanation: 'Na de herclassificatie van Pluto in 2006 telt ons zonnestelsel officieel 8 planeten.'
  },
  {
    category: 'Fysica',
    question: 'Wat is de snelheid van licht in vacuüm (afgerond)?',
    options: ['150.000 km/s', '200.000 km/s', '300.000 km/s', '450.000 km/s'],
    correct: 2,
    explanation: 'De lichtsnelheid bedraagt precies 299.792.458 m/s, afgerond ~300.000 km/s.'
  },
  {
    category: 'Biologie',
    question: 'Uit hoeveel botten bestaat het volwassen menselijk skelet?',
    options: ['106', '156', '206', '256'],
    correct: 2,
    explanation: 'Een volwassen mens heeft 206 botten. Babies worden geboren met ongeveer 300 botjes die later samengroeien.'
  },
  {
    category: 'Sterrenkunde',
    question: 'Welke planeet is het grootst in ons zonnestelsel?',
    options: ['Saturnus', 'Uranus', 'Neptunus', 'Jupiter'],
    correct: 3,
    explanation: 'Jupiter is veruit de grootste planeet. Meer dan 1.300 aarden passen erin.'
  },
  {
    category: 'Scheikunde',
    question: 'Wat is de pH-waarde van puur water bij 25°C?',
    options: ['0', '4', '7', '14'],
    correct: 2,
    explanation: 'Puur water is neutraal en heeft een pH van precies 7. Lager is zuur, hoger is basisch.'
  },
  {
    category: 'Biologie',
    question: 'Welke organellen in de cel produceren energie (ATP)?',
    options: ['Ribosomen', 'Lysosomen', 'Mitochondria', 'Vacuolen'],
    correct: 2,
    explanation: 'Mitochondria worden ook wel de "energiecentrales van de cel" genoemd. Ze zetten suikers om in ATP.'
  },
  {
    category: 'Fysica',
    question: 'Welke wet beschrijft de relatie F = m × a?',
    options: ['Eerste wet van Newton', 'Tweede wet van Newton', 'Derde wet van Newton', 'Wet van Bernoulli'],
    correct: 1,
    explanation: 'De tweede wet van Newton stelt dat kracht gelijk is aan massa maal versnelling (F = m·a).'
  },
  {
    category: 'Sterrenkunde',
    question: 'Hoe oud is het heelal naar schatting?',
    options: ['4,5 miljard jaar', '10 miljard jaar', '13,8 miljard jaar', '20 miljard jaar'],
    correct: 2,
    explanation: 'Op basis van de kosmische achtergrondstraling en de uitdijing van het heelal schatten wetenschappers de leeftijd op 13,8 miljard jaar.'
  },
  {
    category: 'Biologie',
    question: 'Welk orgaan maakt insuline aan?',
    options: ['Lever', 'Nieren', 'Milt', 'Pancreas'],
    correct: 3,
    explanation: 'De alvleesklier (pancreas) produceert insuline in de eilandjes van Langerhans om de bloedsuikerspiegel te reguleren.'
  },
  {
    category: 'Fysica',
    question: 'Welk gas maakt het grootste deel uit van de aardse atmosfeer?',
    options: ['Zuurstof', 'Kooldioxide', 'Stikstof', 'Argon'],
    correct: 2,
    explanation: 'Stikstof (N₂) maakt ~78% van de atmosfeer uit. Zuurstof volgt met ~21%.'
  },
  {
    category: 'Scheikunde',
    question: 'Wat is de halfwaardetijd van koolstof-14, gebruikt bij radiokoolstofdatering?',
    options: ['1.000 jaar', '5.730 jaar', '12.500 jaar', '50.000 jaar'],
    correct: 1,
    explanation: 'De halfwaardetijd van ¹⁴C is 5.730 jaar. Dit maakt het bruikbaar voor datering tot ~50.000 jaar geleden.'
  },
  {
    category: 'Biologie',
    question: 'Hoeveel chromosomenparen heeft een gezonde menselijke cel?',
    options: ['21 paar', '23 paar', '26 paar', '46 paar'],
    correct: 1,
    explanation: 'Menselijke cellen bevatten 23 paar chromosomen = 46 chromosomen in totaal.'
  },
  {
    category: 'Sterrenkunde',
    question: 'Wat is de dichtstbijzijnde ster bij ons zonnestelsel?',
    options: ['Sirius', 'Betelgeuze', 'Proxima Centauri', 'Vega'],
    correct: 2,
    explanation: 'Proxima Centauri ligt op ~4,24 lichtjaar afstand en is de dichtstbijzijnde ster na onze zon.'
  },
  {
    category: 'Scheikunde',
    question: 'Welk element is bij kamertemperatuur het enige vloeibare metaal?',
    options: ['Broom', 'Kwik', 'Gallium', 'Cesium'],
    correct: 1,
    explanation: 'Kwik (Hg) is het enige metaalelement dat bij kamertemperatuur (20°C) vloeibaar is. Het smeltpunt ligt op -39°C.'
  },
  {
    category: 'Biologie',
    question: 'Wat is fotosynthese?',
    options: [
      'Omzetting van licht in elektriciteit',
      'Productie van voedsel door planten via zonlicht',
      'Afbraak van voedsel door bacteriën',
      'Absorptie van UV-straling door de huid'
    ],
    correct: 1,
    explanation: 'Fotosynthese is het proces waarbij planten CO₂ en water omzetten in glucose en zuurstof met behulp van zonlicht.'
  },
  {
    category: 'Fysica',
    question: 'Welk type elektromagnetische straling heeft de kortste golflengte?',
    options: ['Radiogolven', 'Infrarood', 'Röntgenstraling', 'Gammastraling'],
    correct: 3,
    explanation: 'Gammastraling heeft golflengtes kleiner dan 10 picometer en de hoogste energie van alle elektromagnetische straling.'
  },
  {
    category: 'Scheikunde',
    question: 'Wat beschrijft de wet van behoud van energie?',
    options: [
      'Energie neemt altijd toe in een systeem',
      'Energie kan worden gecreëerd maar niet vernietigd',
      'Energie kan niet worden gecreëerd noch vernietigd, alleen omgezet',
      'Energie en materie zijn altijd gescheiden'
    ],
    correct: 2,
    explanation: 'De eerste hoofdwet van de thermodynamica: energie is behouden. Het kan van vorm veranderen, maar nooit ontstaan of verdwijnen.'
  },
  {
    category: 'Biologie',
    question: 'Wat is osmose?',
    options: [
      'Beweging van ionen door een elektrisch veld',
      'Chemische reactie tussen zuren en basen',
      'Diffusie van opgeloste stoffen door een membraan',
      'Netto beweging van water door een halfpermeabele membraan'
    ],
    correct: 3,
    explanation: 'Osmose is de netto stroming van water van een gebied met lage naar hoge oplosconcentratie door een halfpermeabele membraan.'
  },
  {
    category: 'Sterrenkunde',
    question: 'Wat is een zwart gat?',
    options: [
      'Een donkere planeet zonder atmosfeer',
      'Een regio met zo\'n sterke zwaartekracht dat zelfs licht niet kan ontsnappen',
      'Een uitgedoofde witte dwerg',
      'Een donkere nevel in de melkweg'
    ],
    correct: 1,
    explanation: 'Een zwart gat heeft een ontsnappingssnelheid groter dan de lichtsnelheid. Niets — zelfs licht niet — kan aan zijn zwaartekracht ontsnappen.'
  },
  {
    category: 'Fysica',
    question: 'Hoeveel Newton is de valversnelling op aardoppervlak (per kg massa) bij benadering?',
    options: ['5 m/s²', '9,8 m/s²', '12 m/s²', '15,7 m/s²'],
    correct: 1,
    explanation: 'De standaard valversnelling g ≈ 9,81 m/s², ook wel de zwaartekrachtsversnelling op het aardoppervlak genaamd.'
  },
  {
    category: 'Scheikunde',
    question: 'Wat is een isotoop?',
    options: [
      'Een atoom met een andere elektronenconfiguratie',
      'Een molecuul met twee identieke atomen',
      'Een atoom van hetzelfde element met een ander aantal neutronen',
      'Een type chemische binding'
    ],
    correct: 2,
    explanation: 'Isotopen zijn atomen van hetzelfde element (zelfde protonenaantal) maar met een verschillend aantal neutronen.'
  },
  {
    category: 'Biologie',
    question: 'Welke ontdekking wordt beschouwd als het begin van de klassieke genetica?',
    options: [
      'De structuur van DNA door Watson & Crick (1953)',
      'Gregor Mendels erfelijkheidsproeven met erwtenplanten (1865)',
      'De ontdekking van chromosomen door Waldeyer (1888)',
      'Het Humaan Genoomproject (2003)'
    ],
    correct: 1,
    explanation: 'Gregor Mendel legde met zijn erwtenproeven de basis voor de genetica door dominante en recessieve eigenschappen te beschrijven.'
  },
  {
    category: 'Sterrenkunde',
    question: 'Wat is een lichtjaar?',
    options: [
      'De tijd die licht nodig heeft om de aarde te omcirkelen',
      'De afstand die licht in één jaar aflegt',
      'Een maat voor de helderheid van sterren',
      'De levensduur van een gemiddelde ster'
    ],
    correct: 1,
    explanation: 'Een lichtjaar is de afstand die licht in één jaar aflegt: ~9,46 biljoen kilometer. Het is een afstandsmaat, geen tijdmaat.'
  },
  {
    category: 'Fysica',
    question: 'Welke beroemde formule beschrijft de equivalentie van massa en energie?',
    options: ['F = ma', 'E = mc²', 'PV = nRT', 'a² + b² = c²'],
    correct: 1,
    explanation: 'Einsteins formule E = mc² laat zien dat massa en energie uitwisselbaar zijn, waarbij c de lichtsnelheid is.'
  },
  {
    category: 'Biologie',
    question: 'Hoeveel hartklansen maakt een gezond volwassen hart gemiddeld per minuut?',
    options: ['40–50', '60–100', '110–130', '150–170'],
    correct: 1,
    explanation: 'Een normale rustpols ligt tussen de 60 en 100 slagen per minuut. Getrainde sporters kunnen een rustpols van 40–50 hebben.'
  },
  {
    category: 'Scheikunde',
    question: 'Wat is de meest voorkomende verbinding op aarde?',
    options: ['Kooldioxide (CO₂)', 'Water (H₂O)', 'Siliciumoxide (SiO₂)', 'Natriumchloride (NaCl)'],
    correct: 1,
    explanation: 'Water (H₂O) is de meest voorkomende chemische verbinding op aarde, dankzij de oceanen en de waterkringloop.'
  },
  {
    category: 'Sterrenkunde',
    question: 'Op welke planeet duurt een dag (rotatieperiode) langer dan een jaar (omlooptijd)?',
    options: ['Mars', 'Jupiter', 'Venus', 'Uranus'],
    correct: 2,
    explanation: 'Venus roteert zeer langzaam (243 aardse dagen per omwenteling) maar omloopt de zon in slechts 225 aardse dagen.'
  },
  {
    category: 'Fysica',
    question: 'Wat beschrijft de derde wet van Newton?',
    options: [
      'F = m × a',
      'Een object in rust blijft in rust',
      'Op elke kracht staat een gelijke en tegengestelde kracht',
      'Energie kan niet worden vernietigd'
    ],
    correct: 2,
    explanation: '"Actie = reactie": als lichaam A een kracht op B uitoefent, oefent B een even grote maar tegengestelde kracht op A uit.'
  }
];

let FEIT_FABEL = [
  {
    icon: '⚡',
    statement: 'Een bliksemschicht is heter dan het oppervlak van de zon.',
    answer: true,
    explanation: 'Een bliksem bereikt ~30.000°C, terwijl het zonoppervlak ~5.500°C heet is. Bijzonder maar waar!'
  },
  {
    icon: '🦠',
    statement: 'Het menselijk lichaam bevat meer bacteriëncellen dan menselijke cellen.',
    answer: true,
    explanation: 'Recente schattingen liggen op een verhouding van ~1,3:1 bacteriën tot menselijke cellen. We zijn net zoveel microbe als mens.'
  },
  {
    icon: '💎',
    statement: 'Diamant is de hardste bekende stof.',
    answer: false,
    explanation: 'Wurtziet boron nitride en lonsdaleiet zijn zelfs harder dan diamant, hoewel diamant nog steeds de hardste veel voorkomende natuurlijke stof is.'
  },
  {
    icon: '🐙',
    statement: 'Octopussen hebben drie harten.',
    answer: true,
    explanation: 'Een octopus heeft twee kieuwenharten (die bloed door de kieuwen pompen) en één systeemhart (dat bloed door het lichaam pompt).'
  },
  {
    icon: '🧠',
    statement: 'Mensen gebruiken slechts 10% van hun hersenen.',
    answer: false,
    explanation: 'Dit is een hardnekkige mythe. Hersenscans laten zien dat we vrijwel alle hersengebieden gebruiken, ook al niet altijd tegelijk.'
  },
  {
    icon: '🌊',
    statement: 'Geluid reist sneller door water dan door lucht.',
    answer: true,
    explanation: 'Geluid reist ~1.480 m/s door water tegenover ~343 m/s door lucht. Door vloeistoffen reist geluid sneller vanwege de hogere dichtheid.'
  },
  {
    icon: '🧬',
    statement: 'DNA kan worden gebruikt om digitale data op te slaan.',
    answer: true,
    explanation: 'Wetenschappers hebben al megabytes aan data opgeslagen in synthetisch DNA. Één gram DNA kan theoretisch 215 petabyte aan data bevatten.'
  },
  {
    icon: '🌙',
    statement: 'De maan heeft een eigen magnetisch veld, net als de aarde.',
    answer: false,
    explanation: 'De maan heeft geen actief globaal magnetisch veld. Er is een zwak overblijfsel van een oud veld in de korst, maar geen dynamo-effect.'
  },
  {
    icon: '🐘',
    statement: 'Olifanten zijn de enige dieren die zichzelf in een spiegel herkennen.',
    answer: false,
    explanation: 'Naast olifanten herkennen ook grote mensapen, dolfijnen en sommige vogels (eksters) zichzelf in een spiegel. Dit is zeldzaam maar niet uniek.'
  },
  {
    icon: '🌡️',
    statement: 'Absoluut nulpunt (0 Kelvin) is de koudste temperatuur die mogelijk is.',
    answer: true,
    explanation: '0 Kelvin (−273,15°C) is de theoretische ondergrens van temperatuur, waarbij deeltjes nauwelijks nog bewegingsenergie hebben.'
  },
  {
    icon: '🌍',
    statement: 'De aarde is een perfecte bol.',
    answer: false,
    explanation: 'De aarde is een afgeplatte sferoid: door de rotatie is ze bij de evenaar dikker (~43 km) dan van pool tot pool.'
  },
  {
    icon: '🪨',
    statement: 'Meteoroïden branden volledig op in de atmosfeer en bereiken nooit het aardoppervlak.',
    answer: false,
    explanation: 'Sommige meteoroïden bereiken het aardoppervlak; dan heten ze meteorieten. Jaarlijks landen duizenden kilo\'s aan meteorietmateriaal op aarde.'
  },
  {
    icon: '🌿',
    statement: 'Planten groeien grotendeels vanuit de lucht, niet uit de grond.',
    answer: true,
    explanation: 'Circa 95% van de droge massa van planten is afkomstig van CO₂ uit de lucht via fotosynthese. Slechts een klein deel komt uit de bodem.'
  },
  {
    icon: '🔬',
    statement: 'Virussen zijn levende organismen.',
    answer: false,
    explanation: 'Virussen voldoen niet aan alle criteria voor leven: ze hebben geen eigen metabolisme en kunnen zich alleen vermenigvuldigen binnen een gastheercel.'
  },
  {
    icon: '🌊',
    statement: 'Meer dan 80% van de oceanen is nog niet in kaart gebracht.',
    answer: true,
    explanation: 'We kennen de maan en Mars beter dan de oceaanbodem. Slechts een klein deel is gedetailleerd gekarteerd met sonar.'
  }
];

const ELEMENTEN = [
  { symbol: 'H',  number: 1,   mass: '1,008',  name: 'Waterstof',  wrong: ['Helium', 'Hafnium', 'Holmium'] },
  { symbol: 'He', number: 2,   mass: '4,003',  name: 'Helium',     wrong: ['Hafnium', 'Holmium', 'Waterstof'] },
  { symbol: 'Li', number: 3,   mass: '6,941',  name: 'Lithium',    wrong: ['Lood', 'Lanthaan', 'Lutetium'] },
  { symbol: 'C',  number: 6,   mass: '12,011', name: 'Koolstof',   wrong: ['Calcium', 'Chloor', 'Kobalt'] },
  { symbol: 'N',  number: 7,   mass: '14,007', name: 'Stikstof',   wrong: ['Natrium', 'Nikkel', 'Nobium'] },
  { symbol: 'O',  number: 8,   mass: '15,999', name: 'Zuurstof',   wrong: ['Osmium', 'Zink', 'Zilver'] },
  { symbol: 'Na', number: 11,  mass: '22,990', name: 'Natrium',    wrong: ['Stikstof', 'Neon', 'Nikkel'] },
  { symbol: 'Mg', number: 12,  mass: '24,305', name: 'Magnesium',  wrong: ['Mangaan', 'Molybdeen', 'Mercury'] },
  { symbol: 'Al', number: 13,  mass: '26,982', name: 'Aluminium',  wrong: ['Argon', 'Actinium', 'Arseen'] },
  { symbol: 'Si', number: 14,  mass: '28,086', name: 'Silicium',   wrong: ['Zwavel', 'Seleen', 'Scandium'] },
  { symbol: 'Fe', number: 26,  mass: '55,845', name: 'IJzer',      wrong: ['Fermium', 'Fluorine', 'Fosfor'] },
  { symbol: 'Cu', number: 29,  mass: '63,546', name: 'Koper',      wrong: ['Curium', 'Calcium', 'Kobalt'] },
  { symbol: 'Ag', number: 47,  mass: '107,87', name: 'Zilver',     wrong: ['Zwavel', 'Zuurstof', 'Argon'] },
  { symbol: 'Au', number: 79,  mass: '196,97', name: 'Goud',       wrong: ['Argon', 'Aluminium', 'Arseen'] },
  { symbol: 'Hg', number: 80,  mass: '200,59', name: 'Kwik',       wrong: ['Helium', 'Hafnium', 'Holmium'] },
  { symbol: 'Pb', number: 82,  mass: '207,2',  name: 'Lood',       wrong: ['Lithium', 'Lanthaan', 'Lutetium'] },
  { symbol: 'Pt', number: 78,  mass: '195,08', name: 'Platina',    wrong: ['Fosfor', 'Fermium', 'Polonium'] },
  { symbol: 'K',  number: 19,  mass: '39,098', name: 'Kalium',     wrong: ['Krypton', 'Koper', 'Koolstof'] },
  { symbol: 'Ca', number: 20,  mass: '40,078', name: 'Calcium',    wrong: ['Koolstof', 'Koper', 'Chloor'] },
  { symbol: 'Cl', number: 17,  mass: '35,453', name: 'Chloor',     wrong: ['Calcium', 'Chroom', 'Kobalt'] },
  { symbol: 'Ne', number: 10,  mass: '20,180', name: 'Neon',       wrong: ['Nikkel', 'Natrium', 'Niobium'] },
  { symbol: 'S',  number: 16,  mass: '32,065', name: 'Zwavel',     wrong: ['Silicium', 'Seleen', 'Scandium'] },
  { symbol: 'P',  number: 15,  mass: '30,974', name: 'Fosfor',     wrong: ['Platina', 'Palladium', 'Potassium'] },
  { symbol: 'Zn', number: 30,  mass: '65,38',  name: 'Zink',       wrong: ['Zuurstof', 'Zwavel', 'Zirkonium'] },
  { symbol: 'W',  number: 74,  mass: '183,84', name: 'Wolfraam',   wrong: ['Waterstof', 'Osmium', 'Xenon'] }
];

// ==========================================
// UTILITIES
// ==========================================

function escHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick(arr, n) {
  return shuffle(arr).slice(0, n);
}

function getEl(id) { return document.getElementById(id); }

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = getEl('screen-' + id);
  if (el) el.classList.add('active');
  window.scrollTo(0, 0);
}

// ==========================================
// HIGH SCORE STORAGE
// ==========================================

const HS_KEY = 'scientias_hs';

function loadScores() {
  try {
    const raw = JSON.parse(localStorage.getItem(HS_KEY));
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
    const valid = {};
    for (const game of ['quiz', 'feit', 'elementen']) {
      if (!Array.isArray(raw[game])) continue;
      valid[game] = raw[game]
        .filter(s => s && typeof s === 'object'
          && typeof s.score === 'number' && isFinite(s.score)
          && typeof s.max   === 'number' && isFinite(s.max)
          && typeof s.date  === 'string')
        .slice(0, 5);
    }
    return valid;
  } catch { return {}; }
}

function saveScore(game, score, max) {
  const scores = loadScores();
  if (!scores[game]) scores[game] = [];
  scores[game].unshift({ score, max, date: new Date().toLocaleDateString('nl-NL') });
  scores[game] = scores[game].slice(0, 5); // keep top 5
  localStorage.setItem(HS_KEY, JSON.stringify(scores));
  return scores[game][0].score >= Math.max(...scores[game].map(s => s.score));
}

function getBestScore(game) {
  const scores = loadScores();
  if (!scores[game] || !scores[game].length) return null;
  return Math.max(...scores[game].map(s => s.score));
}

function updateHomeBadges() {
  ['quiz', 'feit', 'elementen'].forEach(game => {
    const best = getBestScore(game);
    const el = getEl('hs-' + game);
    if (el) el.textContent = best !== null ? `Beste: ${best} pt` : '';
  });
}

// ==========================================
// STARS BACKGROUND
// ==========================================

function createStars() {
  const container = getEl('stars');
  const count = 120;
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 2.5 + 0.5;
    star.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      --dur: ${(Math.random() * 4 + 2).toFixed(1)}s;
      --delay: ${(Math.random() * 5).toFixed(1)}s;
      --brightness: ${(Math.random() * 0.5 + 0.3).toFixed(2)};
    `;
    container.appendChild(star);
  }
}

// ==========================================
// RESULTS SCREEN
// ==========================================

function showResults(game, score, max, details) {
  const pct = score / max;
  const isNew = saveScore(game, score, max);
  updateHomeBadges();

  const msgs = {
    quiz: [
      [0.0, 'Geen nood — lees nog wat Scientias-artikelen en probeer het opnieuw!'],
      [0.4, 'Goede start! Er valt nog veel te ontdekken in de wetenschap.'],
      [0.7, 'Indrukwekkend! Je wetenschappelijke kennis zit zeker snor.'],
      [0.9, 'Fantastisch! Je bent een echte wetenschapsenthousiasteling!'],
      [1.0, '🎉 Perfecte score! Heb je stiekem je boeken opgezocht? 😄']
    ],
    feit: [
      [0.0, 'De wetenschap staat vol verrassingen. Probeer het nog een keer!'],
      [0.4, 'Niet slecht! Feit en fabel scheiden is lastiger dan het lijkt.'],
      [0.7, 'Je laat je moeilijk misleiden — goede wetenschappelijke houding!'],
      [0.9, 'Uitstekend! Jij bent immuun voor pseudowetenschap.'],
      [1.0, '🎉 Perfect! Alleen ware wetenschappers scoren dit hoog!']
    ],
    elementen: [
      [0.0, 'Het periodiek systeem is niet makkelijk. Zeker herkansen!'],
      [0.4, 'Je kent al een paar elementen. Oefen ze allemaal!'],
      [0.7, 'Knap! Je chemiekennis is zeker boven gemiddeld.'],
      [0.9, 'Bijna een meester-chemicus! Nog even oefenen.'],
      [1.0, '🎉 Meester van het periodiek systeem! Mendelejev zou trots zijn!']
    ]
  };

  const msgList = msgs[game] || msgs.quiz;
  let msg = msgList[0][1];
  for (const [threshold, text] of msgList) {
    if (pct >= threshold) msg = text;
  }

  const emojis = pct >= 0.9 ? '🏆' : pct >= 0.7 ? '🎯' : pct >= 0.4 ? '🔬' : '📚';
  const titles = pct >= 0.9 ? 'Uitstekend!' : pct >= 0.7 ? 'Goed gedaan!' : pct >= 0.4 ? 'Aardig begin!' : 'Blijf leren!';

  const color = { quiz: '#06b6d4', feit: '#8b5cf6', elementen: '#10b981' }[game];
  const r = 52;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;

  const gameNames = { quiz: '🧪 Wetenschapsquiz', feit: '🔬 Feit of Fabel', elementen: '⚗️ Elementen Match' };
  const correctCount = details ? details.filter(d => d.correct).length : score;
  const wrongCount   = details ? details.filter(d => !d.correct).length : (max - score);

  getEl('results-content').innerHTML = `
    <div class="results-emoji">${emojis}</div>
    <div class="results-title">${titles}</div>

    <div class="results-score-ring">
      <svg class="ring-svg" width="140" height="140" viewBox="0 0 140 140">
        <circle class="ring-bg" cx="70" cy="70" r="${r}"/>
        <circle class="ring-fill"
          cx="70" cy="70" r="${r}"
          stroke="${color}"
          stroke-dasharray="${circ}"
          stroke-dashoffset="${circ - dash}"
        />
      </svg>
      <div class="ring-label">
        <span class="ring-number" style="color:${color}">${score}</span>
        <span class="ring-total">van ${max} pt</span>
      </div>
    </div>

    ${isNew ? '<div class="results-newhs">🏅 Nieuw persoonlijk record!</div>' : ''}

    <div class="results-stats">
      <div class="stat-box">
        <div class="stat-value" style="color:#10b981">${correctCount}</div>
        <div class="stat-label">Goed</div>
      </div>
      <div class="stat-box">
        <div class="stat-value" style="color:#ef4444">${wrongCount}</div>
        <div class="stat-label">Fout</div>
      </div>
    </div>

    <p class="results-message">${msg}</p>

    <div class="results-actions">
      <button class="btn-results primary" id="results-replay-btn">Opnieuw spelen</button>
      <button class="btn-results secondary" id="results-home-btn">Andere spellen</button>
    </div>
  `;

  getEl('results-replay-btn').addEventListener('click', () => startGame(game));
  getEl('results-home-btn').addEventListener('click', goHome);

  showScreen('results');
}

// ==========================================
// GAME 1: WETENSCHAPSQUIZ
// ==========================================

let quizState = {};

function initQuiz() {
  const questions = pick(QUIZ_QUESTIONS, 10);
  quizState = {
    questions,
    current: 0,
    score: 0,
    details: []
  };
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const { questions, current, score } = quizState;
  const q = questions[current];
  const total = questions.length;
  const pct = (current / total) * 100;

  getEl('quiz-bar').style.width = pct + '%';
  getEl('quiz-progress').textContent = `${current + 1} / ${total}`;
  getEl('quiz-score').textContent = score;

  const letters = ['A', 'B', 'C', 'D'];

  getEl('quiz-content').innerHTML = `
    <div class="question-card">
      <div class="question-category">${escHtml(q.category)}</div>
      <div class="question-text">${escHtml(q.question)}</div>
    </div>
    <div class="options-grid">
      ${q.options.map((opt, i) => `
        <button class="option-btn" id="opt-${i}" onclick="answerQuiz(${i})">
          <span class="option-letter">${letters[i]}</span>
          ${escHtml(opt)}
        </button>
      `).join('')}
    </div>
    <div id="quiz-feedback"></div>
  `;
}

function answerQuiz(chosen) {
  const { questions, current } = quizState;
  const q = questions[current];
  const correct = chosen === q.correct;

  if (correct) quizState.score += 10;
  quizState.details.push({ correct });

  // Disable all buttons
  document.querySelectorAll('.option-btn').forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correct) btn.classList.add('correct');
    else if (i === chosen && !correct) btn.classList.add('wrong');
  });

  // Show feedback
  getEl('quiz-feedback').innerHTML = `
    <div class="feedback-panel ${correct ? 'correct' : 'wrong'}">
      <span class="feedback-label">${correct ? '✓ Correct!' : '✗ Helaas!'}</span>
      <span>${escHtml(q.explanation)}</span>
    </div>
    <button class="btn-next cyan" onclick="nextQuizQuestion()">
      ${quizState.current + 1 < quizState.questions.length ? 'Volgende vraag →' : 'Bekijk resultaat →'}
    </button>
  `;

  // Update score display
  getEl('quiz-score').textContent = quizState.score;
}

function nextQuizQuestion() {
  quizState.current++;
  if (quizState.current < quizState.questions.length) {
    renderQuizQuestion();
  } else {
    showResults('quiz', quizState.score, quizState.questions.length * 10, quizState.details);
  }
}

// ==========================================
// GAME 2: FEIT OF FABEL
// ==========================================

let feitState = {};

function initFeit() {
  const items = pick(FEIT_FABEL, 15);
  feitState = {
    items,
    current: 0,
    score: 0,
    details: []
  };
  renderFeitQuestion();
}

function renderFeitQuestion() {
  const { items, current, score } = feitState;
  const item = items[current];
  const total = items.length;
  const pct = (current / total) * 100;

  getEl('feit-bar').style.width = pct + '%';
  getEl('feit-progress').textContent = `${current + 1} / ${total}`;
  getEl('feit-score').textContent = score;

  getEl('feit-content').innerHTML = `
    <div class="statement-card">
      <div class="statement-icon">${escHtml(item.icon || '🔬')}</div>
      <div class="statement-text">"${escHtml(item.statement)}"</div>
    </div>
    <div class="feit-fabel-buttons">
      <button class="btn-feit" id="btn-feit" onclick="answerFeit(true)">
        <span>✓</span>
        <span>Feit</span>
      </button>
      <button class="btn-fabel" id="btn-fabel" onclick="answerFeit(false)">
        <span>✗</span>
        <span>Fabel</span>
      </button>
    </div>
    <div id="feit-feedback"></div>
  `;
}

function answerFeit(answered) {
  const { items, current } = feitState;
  const item = items[current];
  const correct = answered === item.answer;

  if (correct) feitState.score += 10;
  feitState.details.push({ correct });

  getEl('btn-feit').disabled = true;
  getEl('btn-fabel').disabled = true;

  if (item.answer === true)  getEl('btn-feit').classList.add('correct');
  if (item.answer === false) getEl('btn-fabel').classList.add('correct');

  getEl('feit-feedback').innerHTML = `
    <div class="feedback-panel ${correct ? 'correct' : 'wrong'}">
      <span class="feedback-label">
        ${correct ? '✓ Juist!' : '✗ Onjuist!'}
        Dit is een <strong>${item.answer ? 'feit' : 'fabel'}</strong>.
      </span>
      <span>${escHtml(item.explanation)}</span>
    </div>
    <button class="btn-next purple" onclick="nextFeitQuestion()">
      ${feitState.current + 1 < feitState.items.length ? 'Volgende uitspraak →' : 'Bekijk resultaat →'}
    </button>
  `;

  getEl('feit-score').textContent = feitState.score;
}

function nextFeitQuestion() {
  feitState.current++;
  if (feitState.current < feitState.items.length) {
    renderFeitQuestion();
  } else {
    showResults('feit', feitState.score, feitState.items.length * 10, feitState.details);
  }
}

// ==========================================
// GAME 3: ELEMENTEN MATCH
// ==========================================

let elementenState = {};

function initElementen() {
  const items = pick(ELEMENTEN, 15);
  elementenState = {
    items,
    current: 0,
    score: 0,
    details: []
  };
  renderElementQuestion();
}

function renderElementQuestion() {
  const { items, current, score } = elementenState;
  const el = items[current];
  const total = items.length;
  const pct = (current / total) * 100;

  getEl('elementen-bar').style.width = pct + '%';
  getEl('elementen-progress').textContent = `${current + 1} / ${total}`;
  getEl('elementen-score').textContent = score;

  // Build 4 answer options: correct + 3 wrong
  const options = shuffle([el.name, ...el.wrong.slice(0, 3)]);
  const correctIndex = options.indexOf(el.name);
  const letters = ['A', 'B', 'C', 'D'];

  getEl('elementen-content').innerHTML = `
    <div class="element-display">
      <div class="element-tile">
        <span class="element-number">${escHtml(el.number)}</span>
        <span class="element-symbol">${escHtml(el.symbol)}</span>
        <span class="element-mass">${escHtml(el.mass)}</span>
      </div>
      <p class="element-question">Welk element hoort bij dit symbool?</p>
    </div>
    <div class="options-grid">
      ${options.map((opt, i) => `
        <button class="option-btn" id="eopt-${i}" onclick="answerElement(${i}, ${correctIndex})">
          <span class="option-letter">${letters[i]}</span>
          ${escHtml(opt)}
        </button>
      `).join('')}
    </div>
    <div id="elementen-feedback"></div>
  `;
}

function answerElement(chosen, correctIndex) {
  const { items, current } = elementenState;
  const el = items[current];
  const correct = chosen === correctIndex;

  if (correct) elementenState.score += 10;
  elementenState.details.push({ correct });

  document.querySelectorAll('.option-btn').forEach((btn, i) => {
    btn.disabled = true;
    if (i === correctIndex) btn.classList.add('correct');
    else if (i === chosen && !correct) btn.classList.add('wrong');
  });

  getEl('elementen-feedback').innerHTML = `
    <div class="feedback-panel ${correct ? 'correct' : 'wrong'}">
      <span class="feedback-label">${correct ? '✓ Correct!' : `✗ Fout! Het juiste antwoord is ${escHtml(el.name)}.`}</span>
      <span>
        <strong>${escHtml(el.symbol)}</strong> staat voor <strong>${escHtml(el.name)}</strong> —
        atoomnummer ${escHtml(el.number)}, atoommassa ${escHtml(el.mass)} u.
      </span>
    </div>
    <button class="btn-next green" onclick="nextElementQuestion()">
      ${elementenState.current + 1 < elementenState.items.length ? 'Volgend element →' : 'Bekijk resultaat →'}
    </button>
  `;

  getEl('elementen-score').textContent = elementenState.score;
}

function nextElementQuestion() {
  elementenState.current++;
  if (elementenState.current < elementenState.items.length) {
    renderElementQuestion();
  } else {
    showResults('elementen', elementenState.score, elementenState.items.length * 10, elementenState.details);
  }
}

// ==========================================
// HIGH SCORES SCREEN
// ==========================================

function showHighScores() {
  const scores = loadScores();
  const games = [
    { id: 'quiz',      label: '🧪 Wetenschapsquiz', color: 'cyan' },
    { id: 'feit',      label: '🔬 Feit of Fabel',   color: 'purple' },
    { id: 'elementen', label: '⚗️ Elementen Match',  color: 'green' }
  ];

  getEl('hs-table').innerHTML = games.map(g => {
    const list = scores[g.id] || [];
    const rows = list.length
      ? list.map((s, i) => `
          <div class="hs-row">
            <span class="hs-rank">${i + 1}</span>
            <span class="hs-date">${escHtml(s.date)}</span>
            <span class="hs-pts ${g.color}">${parseInt(s.score,10) || 0} / ${parseInt(s.max,10) || 0} pt</span>
          </div>
        `).join('')
      : '<p class="hs-empty">Nog geen scores</p>';

    return `
      <div class="hs-game">
        <h3 style="color:var(--${g.color})">${g.label}</h3>
        ${rows}
      </div>
    `;
  }).join('');

  showScreen('highscores');
}

// ==========================================
// NAVIGATION
// ==========================================

function startGame(game) {
  showScreen(game);
  if (game === 'quiz')      initQuiz();
  else if (game === 'feit') initFeit();
  else if (game === 'elementen') initElementen();
}

function goHome() {
  updateHomeBadges();
  showScreen('home');
}

// ==========================================
// INIT
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  createStars();
  applyEditionData();
  updateHomeBadges();
});

// ==========================================
// EDITION DATA INJECTION
// Injects custom questions/statements from a WordPress Spel Editie CPT.
// Set window.scspEditionData before this script loads (via wp_add_inline_script).
// ==========================================

function validateEditionQuestions(questions, type) {
  if (!Array.isArray(questions) || questions.length === 0) return false;
  return questions.every(q => {
    if (!q || typeof q !== 'object') return false;
    if (type === 'quiz') {
      return typeof q.question === 'string' && Array.isArray(q.options) && q.options.length >= 2;
    }
    return typeof q.statement === 'string' && q.statement.length > 0;
  });
}

function applyEditionData() {
  const ed = window.scspEditionData;
  if ( ! ed || ! ed.questions || ! ed.questions.length ) return;

  // Override built-in data with edition questions — validate structure first
  if ( ed.type === 'quiz' && validateEditionQuestions( ed.questions, 'quiz' ) ) {
    QUIZ_QUESTIONS = ed.questions;
  } else if ( ed.type === 'feit' && validateEditionQuestions( ed.questions, 'feit' ) ) {
    FEIT_FABEL = ed.questions;
  }

  // Update home screen title and subtitle to reflect edition topic
  const title    = getEl( 'scsp-main-title' );
  const subtitle = getEl( 'scsp-main-subtitle' );
  if ( title && ed.title ) {
    title.textContent = ed.title;
    title.style.fontSize = 'clamp(1.4rem,4vw,2.2rem)';
  }
  if ( subtitle && ed.subtitle ) {
    subtitle.textContent = ed.subtitle;
  }

  // Show how many questions are in this edition on the relevant game card
  const card = document.querySelector( '.game-card[data-game="' + ed.type + '"]' );
  if ( card ) {
    const metaTag = card.querySelector( '.tag:last-of-type' );
    if ( metaTag ) {
      const count = ed.questions.length;
      const label = ed.type === 'quiz'
        ? count + ( count === 1 ? ' vraag' : ' vragen' )
        : count + ( count === 1 ? ' uitspraak' : ' uitspraken' );
      metaTag.textContent = '❓ ' + label;
    }
  }
}
