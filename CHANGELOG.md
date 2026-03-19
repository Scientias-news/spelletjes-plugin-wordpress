# Changelog

## 2.0.3

### Eindscherm vereenvoudigd
- Alle verwijzingen naar andere spellen verwijderd van het eindscherm ("Andere spellen", "Meer spellen bij Scientias", willekeurige edities-kaartjes).
- Eindscherm toont nu uitsluitend de knop **Opnieuw spelen**.
- Geen externe links meer → geen risico op 404-pagina's.
- Beveiligingsaudit uitgevoerd: geen kwetsbaarheden aangetroffen.

---

## 2.0.2

Deze update bevat meerdere beveiligings- en hardeningverbeteringen voor de plugin.

### Beveiliging
- Custom post type `scsp_editie` gebruikt nu eigen capabilities in plaats van standaard postrechten.
- Rechten voor het beheren van spel-edities zijn expliciet toegevoegd voor administrators en editors.
- Upgrade-logica toegevoegd zodat bestaande installaties de nieuwe capabilities automatisch krijgen.

### Validatie en invoercontrole
- Server-side limiet toegevoegd van maximaal **5 MB** voor JSON-payloads.
- Server-side limiet toegevoegd van maximaal **100 items** per editie.
- Strengere validatie toegevoegd voor geïmporteerde JSON-structuren.
- Tekstvelden worden nu strikter geschoond en beperkt in lengte.
- Boolean-validatie voor `answer` verbeterd om ongeldige waarden te blokkeren.

### Admin en gebruikersfeedback
- Veiliger afhandeling van admin-feedbackmeldingen zonder directe HTML-injectie.
- Admin-notice toegevoegd voor ongeldige, lege of te grote imports.

### Frontend hardening
- Veiliger rendering van `icon`-waarden door escaping toe te passen in plaats van alleen tags te strippen.
- Extra verdediging toegevoegd tegen ongewenste HTML-inhoud in dynamische output.

### Overig
- Pluginversie verhoogd naar **2.0.2**.
- Codebasis opgeschoond en voorbereid op veiliger beheer in productieomgevingen.
