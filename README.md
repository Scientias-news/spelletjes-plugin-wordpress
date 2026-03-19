# Scientias Spellen

Interactieve wetenschapsspellen voor WordPress.

## Inhoud
- `scientias-spellen/` — pluginbroncode
- `CHANGELOG.md` — overzicht van alle versies
- `RELEASE_NOTES.md` — korte release-notes

## Versie
Huidige pluginversie: `2.0.3`

## Belangrijkste wijzigingen in 2.0.3
- Eindscherm toont alleen nog **Opnieuw spelen** — alle verwijzingen naar andere spellen zijn verwijderd
- Vereenvoudigd eindscherm: geen externe links, geen 404-risico
- Beveiligingsaudit uitgevoerd: geen kwetsbaarheden aangetroffen

## Belangrijkste wijzigingen in 2.0.2
- Eigen CPT-capabilities voor `scsp_editie`
- Capability-upgradepad voor bestaande installaties
- Server-side limieten op importgrootte en aantal items
- Strengere validatie en sanitatie van JSON-imports
- Veiligere admin-feedback en frontend-rendering

## Speltypen
- **🧪 Wetenschapsquiz** — meerkeuze, instelbaar aantal vragen
- **🔬 Feit of Fabel** — waar/onwaar-uitspraken

## Shortcode
```
[scientias_spellen editie="slug-van-de-editie"]
```

Elke editie is een Custom Post Type (`scsp_editie`). De slug is terug te vinden in de beheerpagina onder **Spellen → Alle edities** in de kolom *Shortcode*.

## Binary (ZIP) voor GitHub Releases
Voor WordPress-plugins is de distributiebundle een ZIP met de pluginmap.

### Automatisch via GitHub Actions
- Workflowbestand: `.github/workflows/release-binary.yml`
- Trigger op `Release published`
- Output: `scientias-spellen-<tag>.zip`
- De ZIP wordt automatisch als release-asset geüpload.

### Handmatig lokaal bouwen
```bash
cd scientias-spellen
zip -r ../scientias-spellen-v2.0.3.zip .
```

## Installatie
1. Download de `.zip` via GitHub Releases
2. Ga in WordPress naar **Plugins → Nieuwe plugin → Uploaden**
3. Upload de ZIP en activeer
4. Maak edities aan via **Spellen → Nieuwe editie**
5. Plak de shortcode in een artikel
