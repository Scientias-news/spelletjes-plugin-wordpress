# Instructie: JSON genereren voor Scientias Spellen

Deze instructie beschrijft hoe je een AI (bijv. Claude of ChatGPT) kunt inzetten om
JSON-bestanden te genereren die je direct kunt importeren in de WordPress-plugin
**Scientias Spellen**.

Er zijn twee speltypen: **Wetenschapsquiz** en **Feit of Fabel**.

---

## 1. Wetenschapsquiz

### JSON-structuur

Het bestand is een JSON-array van vraag-objecten:

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
| `correct`     | number     | **Ja**    | Index (0-3) van het juiste antwoord. 0 = A, 1 = B, 2 = C, 3 = D.            |
| `explanation` | string     | Nee       | Uitleg die na beantwoording wordt getoond. Sterk aanbevolen.                 |

### Voorbeeld-prompt voor AI

> Genereer een JSON-bestand met 10 wetenschapsquizvragen over **[ONDERWERP]**.
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
> - Geef exact 4 antwoordopties per vraag.
> - `correct` is de index (0-3) van het juiste antwoord.
> - Elke vraag heeft een korte, informatieve uitleg.
> - De vragen zijn wetenschappelijk correct en geschikt voor een breed publiek
>   dat geinteresseerd is in wetenschap (lezers van Scientias.nl).
> - Varieer in moeilijkheidsgraad: mix makkelijke, gemiddelde en uitdagende vragen.
> - Schrijf in het Nederlands.
> - Geef alleen de JSON-array als output, geen extra tekst.
> - Alle `category`-velden hebben dezelfde waarde: "[ONDERWERP]".

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
```

---

## 2. Feit of Fabel

### JSON-structuur

Het bestand is een JSON-array van uitspraak-objecten:

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

### Voorbeeld-prompt voor AI

> Genereer een JSON-bestand met 10 feit-of-fabel-uitspraken over **[ONDERWERP]**.
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
> - `answer` is `true` als de uitspraak een feit is, `false` als het een fabel is.
> - Zorg voor een goede mix: ongeveer de helft feit, de helft fabel.
> - Kies een passende emoji per uitspraak (bijv. 🧬, 🌍, 🧪, 🔭, 🦠, 🧠, 🌊).
> - Elke uitspraak heeft een korte, informatieve uitleg.
> - De uitspraken zijn wetenschappelijk correct en geschikt voor een breed publiek
>   dat geinteresseerd is in wetenschap (lezers van Scientias.nl).
> - Formuleer fabels zo dat ze geloofwaardig klinken (niet te voor de hand liggend).
> - Schrijf in het Nederlands.
> - Geef alleen de JSON-array als output, geen extra tekst.

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
```

---

## 3. Importeren in WordPress

1. Ga in WordPress naar **Spellen > Nieuwe editie**.
2. Geef de editie een titel (bijv. "Evolutiequiz maart 2026").
3. Kies het juiste **Speltype**: "Wetenschapsquiz" of "Feit of Fabel".
4. Klik op **Importeer JSON** en selecteer het gegenereerde bestand.
5. Controleer de geimporteerde vragen in de visuele builder.
6. Klik op **Publiceren**.
7. Kopieer de shortcode (bijv. `[scientias_spellen editie="evolutiequiz-maart-2026"]`)
   en plak deze in het gewenste artikel.

---

## 4. Tips

- **Aantal vragen**: 10-15 vragen/uitspraken per editie werkt het best voor de spelervaring.
- **Categorie**: Bij een quiz kun je alle vragen dezelfde categorie geven, of meerdere
  categorieen mixen voor variatie.
- **Validatie**: De plugin controleert bij import of verplichte velden aanwezig zijn.
  Ontbrekende velden worden gemeld.
- **Toevoegen vs. vervangen**: Als er al vragen in de editie staan, vraagt de plugin
  of je de nieuwe vragen wilt toevoegen of de bestaande wilt vervangen.
- **Exporteren**: Je kunt bestaande vragen ook exporteren als JSON via de
  **Exporteer JSON**-knop om ze later te hergebruiken of aan te passen.
