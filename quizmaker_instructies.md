# Instructie: JSON genereren voor Scientias Spellen

Deze instructie beschrijft hoe je een AI kunt inzetten om JSON-bestanden te genereren
die je direct kunt importeren in de WordPress-plugin **Scientias Spellen**.

Er zijn twee speltypen: **Wetenschapsquiz** en **Feit of Fabel**.

---

## 1. Hoeveel vragen genereren?

Het aantal vragen hangt af van de lengte en informatiedichtheid van het artikel.
Gebruik onderstaande richtlijn als uitgangspunt — de AI past dit automatisch toe
als je de artikeltekst aanlevert, maar je kunt het aantal ook zelf opgeven.

| Artikeltype | Kenmerken | Aantal vragen |
|---|---|---|
| Kort nieuwsbericht | Weinig nieuwe feiten, één kernbevinding | 5–6 |
| Gemiddeld artikel | Meerdere bevindingen, enige context | 8–10 |
| Diepgaand stuk | Veel detail, meerdere deelonderwerpen | 12–15 |

**Vuistregel:** genereer nooit meer vragen dan het artikel feitelijk kan onderbouwen.
Vragen die de AI *aanvult* vanuit algemene kennis (niet uit het artikel zelf) zijn
moeilijker te controleren en verhogen het risico op fouten.

---

## 2. Wetenschapsquiz

### JSON-structuur

```json
[
  {
    "category":    "Naam van het thema",
    "question":    "De vraagtekst",
    "options":     ["Antwoord A", "Antwoord B", "Antwoord C", "Antwoord D"],
    "correct":     1,
    "explanation": "Korte uitleg waarom dit het juiste antwoord is."
  }
]
```

### Velden

| Veld          | Type       | Verplicht | Beschrijving                                                                 |
|---------------|------------|-----------|------------------------------------------------------------------------------|
| `category`    | string     | Nee       | Thema of onderwerp (bijv. "Evolutie", "Sterrenkunde", "Genetica").           |
| `question`    | string     | **Ja**    | De vraag die wordt getoond.                                                  |
| `options`     | string[]   | **Ja**    | Exact 4 antwoordopties. Minimaal 2 zijn vereist, maar gebruik er altijd 4.   |
| `correct`     | number     | **Ja**    | Index (0–3) van het juiste antwoord. 0 = A, 1 = B, 2 = C, 3 = D.            |
| `explanation` | string     | Nee       | Uitleg die na beantwoording wordt getoond. Sterk aanbevolen.                 |

### Prompt voor de AI

> Lees het onderstaande artikel en genereer een Wetenschapsquiz-JSON voor de
> Scientias Spellen WordPress-plugin.
>
> **Bepaal zelf het aantal vragen** op basis van de lengte en informatiedichtheid
> van het artikel:
> - Kort nieuwsbericht (weinig feiten) → 5–6 vragen
> - Gemiddeld artikel → 8–10 vragen
> - Diepgaand stuk → 12–15 vragen
>
> Gebruik dit exacte formaat per vraag:
>
> ```json
> {
>   "category": "[ONDERWERP]",
>   "question": "vraagtekst",
>   "options": ["antwoord A", "antwoord B", "antwoord C", "antwoord D"],
>   "correct": 0,
>   "explanation": "uitleg"
> }
> ```
>
> Regels:
> - Baseer vragen **uitsluitend op informatie uit het artikel**. Voeg geen kennis
>   toe die niet in de tekst staat.
> - Geef exact 4 antwoordopties per vraag.
> - `correct` is de index (0–3) van het juiste antwoord.
> - Elke vraag heeft een korte, informatieve uitleg.
> - Varieer in moeilijkheidsgraad: mix makkelijke, gemiddelde en uitdagende vragen.
> - Vermijd pure feitenvragen (namen, getallen, tijdschriften) als die niet centraal
>   staan in het verhaal — test liever begrip en implicaties.
> - Schrijf in het Nederlands.
> - Geef eerst de JSON-array, dan — na een scheidingslijn (`---`) — een
>   **bronvermelding per vraag** (zie formaat hieronder).
> - Alle `category`-velden hebben dezelfde waarde: "[ONDERWERP]".
>
> **Formaat bronvermelding** (na de JSON):
>
> ```
> Bronvermelding per vraag
> Q1: [korte aanduiding van de passage in het artikel waarop dit gebaseerd is]
> Q2: ...
> ```
>
> [PLAK HIER DE ARTIKELTEKST]

### Volledig voorbeeld (2 vragen)

```json
[
  {
    "category": "Evolutie",
    "question": "Wie publiceerde in 1859 'On the Origin of Species'?",
    "options": ["Gregor Mendel", "Charles Darwin", "Alfred Wallace", "Thomas Huxley"],
    "correct": 1,
    "explanation": "Charles Darwin legde hiermee de basis voor de moderne evolutietheorie."
  },
  {
    "category": "Evolutie",
    "question": "Hoe oud is de aarde naar huidige schatting?",
    "options": ["2,5 miljard jaar", "4,5 miljard jaar", "6 miljard jaar", "10 miljard jaar"],
    "correct": 1,
    "explanation": "Radiometrische datering wijst op een leeftijd van circa 4,54 miljard jaar."
  }
]

---

Bronvermelding per vraag
Q1: Alinea 1 — vermelding van de publicatie van Darwin
Q2: Alinea 3 — passage over ouderdom van de aarde
```

---

## 3. Feit of Fabel

### JSON-structuur

```json
[
  {
    "icon":        "🦎",
    "statement":   "De uitspraak die beoordeeld moet worden.",
    "answer":      true,
    "explanation": "Uitleg waarom dit feit of fabel is."
  }
]
```

### Velden

| Veld          | Type    | Verplicht | Beschrijving                                                              |
|---------------|---------|-----------|---------------------------------------------------------------------------|
| `icon`        | string  | Nee       | Emoji die bij de uitspraak past (standaard: "🔬").                        |
| `statement`   | string  | **Ja**    | De stelling die de speler als feit of fabel moet beoordelen.              |
| `answer`      | boolean | **Ja**    | `true` als het een feit is, `false` als het een fabel is.                 |
| `explanation` | string  | Nee       | Uitleg die na beantwoording wordt getoond. Sterk aanbevolen.              |

### Prompt voor de AI

> Lees het onderstaande artikel en genereer een Feit-of-Fabel-JSON voor de
> Scientias Spellen WordPress-plugin.
>
> **Bepaal zelf het aantal uitspraken** op basis van de lengte en informatiedichtheid
> van het artikel:
> - Kort nieuwsbericht (weinig feiten) → 5–6 uitspraken
> - Gemiddeld artikel → 8–10 uitspraken
> - Diepgaand stuk → 12–15 uitspraken
>
> Gebruik dit exacte formaat per uitspraak:
>
> ```json
> {
>   "icon": "emoji",
>   "statement": "de uitspraak",
>   "answer": true,
>   "explanation": "uitleg"
> }
> ```
>
> Regels:
> - Baseer uitspraken **uitsluitend op informatie uit het artikel**. Voeg geen kennis
>   toe die niet in de tekst staat.
> - `answer` is `true` als de uitspraak een feit is, `false` als het een fabel is.
> - Zorg voor een goede mix: ongeveer de helft feit, de helft fabel.
> - Formuleer fabels zo dat ze geloofwaardig klinken — niet te voor de hand liggend.
>   De beste fabels zijn omgekeerde versies van een feit uit het artikel.
> - Kies een passende emoji per uitspraak.
> - Elke uitspraak heeft een korte, informatieve uitleg.
> - Schrijf in het Nederlands.
> - Geef eerst de JSON-array, dan — na een scheidingslijn (`---`) — een
>   **bronvermelding per uitspraak** (zie formaat hieronder).
>
> **Formaat bronvermelding** (na de JSON):
>
> ```
> Bronvermelding per uitspraak
> S1: [korte aanduiding van de passage in het artikel waarop dit gebaseerd is]
> S2: ...
> ```
>
> [PLAK HIER DE ARTIKELTEKST]

### Volledig voorbeeld (2 uitspraken)

```json
[
  {
    "icon": "🦎",
    "statement": "Vogels zijn directe afstammelingen van dinosauriers.",
    "answer": true,
    "explanation": "Vogels evolueerden uit theropode dinosauriers; ze zijn in feite levende dino's."
  },
  {
    "icon": "🧠",
    "statement": "We gebruiken slechts 10% van onze hersenen.",
    "answer": false,
    "explanation": "Dit is een hardnekkige mythe. Hersenscans tonen aan dat we vrijwel alle hersengebieden gebruiken."
  }
]

---

Bronvermelding per uitspraak
S1: Alinea 2 — passage over de evolutionaire herkomst van vogels
S2: Alinea 4 — weerlegging van de 10%-mythe
```

---

## 4. Controlestap voor de redacteur

Voer deze check uit **voordat** je de JSON importeert in WordPress.
De bronvermeldingen die de AI aanlevert zijn je belangrijkste hulpmiddel.

### Wat altijd controleren

- **`correct`-index** — dit is de meest voorkomende fout. Tel de opties na:
  0 = eerste optie, 1 = tweede, 2 = derde, 3 = vierde.
- **Fabels die als feit zijn gemarkeerd (of omgekeerd)** — controleer elke
  `"answer": false` uitspraak: klopt het dat dit onjuist is?
- **Vragen buiten het artikel** — check de bronvermelding. Staat er geen duidelijke
  verwijzing naar een passage? Dan voegt de AI kennis toe van buiten het artikel.
  Verwijder of herschrijf die vraag.

### Wat je kunt vertrouwen

- Vragen of uitspraken die de AI direct baseert op een genoemde passage, met een
  heldere bronverwijzing, zijn doorgaans correct — die hoef je niet diepgaand
  na te zoeken als jij het artikel zelf hebt geschreven of geredigeerd.

### Tijdsinschatting

Een controle van 8–10 vragen kost bij een artikel dat je zelf kent circa
**2–3 minuten**. Alleen bij twijfel over een specifiek feit is extra verificatie
nodig.

---

## 5. Importeren in WordPress

1. Ga in WordPress naar **Spellen > Nieuwe editie**.
2. Geef de editie een titel (bijv. "Naalden en priemen — steentijd").
3. Kies het juiste **Speltype**: "Wetenschapsquiz" of "Feit of Fabel".
4. Klik op **Importeer JSON** en selecteer het gegenereerde bestand.
5. Controleer de geïmporteerde vragen in de visuele builder.
6. Klik op **Publiceren**.
7. Kopieer de shortcode (bijv. `[scientias_spellen editie="naalden-priemen-steentijd"]`)
   en plak deze in het artikel.

---

## 6. Overige tips

- **Speltype kiezen**: Feit of Fabel werkt het best bij artikelen die een aanname
  doorbreken of een contra-intuïtief resultaat presenteren. De Wetenschapsquiz
  werkt beter bij artikelen met meerdere afzonderlijke feiten of deelonderwerpen.
- **Validatie**: De plugin controleert bij import of verplichte velden aanwezig zijn.
  Ontbrekende velden worden gemeld.
- **Toevoegen vs. vervangen**: Als er al vragen in de editie staan, vraagt de plugin
  of je de nieuwe vragen wilt toevoegen of de bestaande wilt vervangen.
- **Exporteren**: Bestaande vragen zijn te exporteren als JSON via de
  **Exporteer JSON**-knop — handig voor hergebruik of aanpassingen.
