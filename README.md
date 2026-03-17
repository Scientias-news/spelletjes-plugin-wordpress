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
diff --git a/README.md b/README.md
index 85248f1b794b0b84207c4f55b97259a2b4c7ffd7..481994c4a84ff69fe3f9e90b4e9e373510979ae1 100644
--- a/README.md
+++ b/README.md
@@ -1,20 +1,36 @@
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
+
+## Binary (ZIP) voor GitHub Releases
+Voor WordPress-plugins is de "binary" meestal een ZIP met de pluginmap.
+
+### Automatisch via GitHub Actions
+- Workflowbestand: `.github/workflows/release-binary.yml`
+- Trigger op `Release published`
+- Output: `scientias-spellen-<tag>.zip`
+- Bij een echte release wordt de ZIP automatisch als release-asset geüpload.
+
+### Handmatig lokaal bouwen
+```bash
+cd scientias-spellen
+zip -r ../scientias-spellen-v2.0.2.zip .
+```
+Upload daarna de ZIP als asset bij je GitHub Release.
