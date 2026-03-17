# Scientias Spellen

Interactieve wetenschapsspellen voor WordPress.

## Inhoud
- `scientias-spellen/` pluginbroncode
- `scientias-spellen_hardened.patch` patchbestand met de hardening-wijzigingen
- `CHANGELOG.md` overzicht van versie 2.0.2
- `RELEASE_NOTES.md` korte release-notes
- `COMMIT_MESSAGE.txt` voorgestelde committekst

## Versie
Huidige pluginversie: `2.0.2`

## Belangrijkste wijzigingen in 2.0.2
- eigen CPT-capabilities voor `scsp_editie`
- capability-upgradepad voor bestaande installaties
- server-side limieten op importgrootte en aantal items
- strengere validatie en sanitatie van JSON-imports
- veiligere admin-feedback en frontend-rendering

## Binary (ZIP) voor GitHub Releases
Voor WordPress-plugins is de distributiebundle meestal een ZIP met de pluginmap.

### Automatisch via GitHub Actions
- Workflowbestand: `.github/workflows/release-binary.yml`
- Trigger op `Release published`
- Output: `scientias-spellen-<tag>.zip`
- Bij een echte release wordt de ZIP automatisch als release-asset geüpload.

### Handmatig lokaal bouwen
```bash
cd scientias-spellen
zip -r ../scientias-spellen-v2.0.2.zip .