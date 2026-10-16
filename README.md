# INNTEO Sulas – HVAC / MaR Field Tool

Terénní aplikace servisního technika HVAC a MaR: servisní protokoly, checklisty,
chybové kódy, diagnostika, kalkulačky, P-T tabulky, F-Gas evidence, klienti,
MaR veličiny, CODESYS a přehled chladiv.

Jedna aplikace, více podob:

| Podoba | Jak se k ní dostat |
|---|---|
| **iPhone – App Store** | Nativní aplikace, sestavení a nahrání automaticky – viz [`store/NAVOD-APP-STORE.md`](store/NAVOD-APP-STORE.md) |
| **iPhone – bez App Store** | V **Safari** otevřít web → Sdílet ⬆️ → „Přidat na plochu" |
| **Web / PWA** (Android, PC) | Otevřít web v Chrome/Edge → „Nainstalovat aplikaci" |
| **Android aplikace (APK)** | GitHub → Actions → *Android APK* → poslední běh → Artifacts → stáhnout a nainstalovat |

Funguje **offline** – po prvním načtení se vše uloží v zařízení.

## Co aplikace umí (v4.0)

- Servisní protokol s **automatickým ukládáním rozpracovaného formuláře** a **archivem protokolů**
- Export protokolu (HTML → tisk / PDF), v Android aplikaci přes systémové *Sdílet* (e-mail, WhatsApp, Disk…)
- F-Gas evidence s mazáním záznamů a **exportem do CSV pro Excel** (včetně t CO₂e)
- Záložka **⚙️ Data**: záloha všech dat do souboru, obnova ze zálohy (sloučit / nahradit), přehled
- Upozornění na novou verzi (PWA) a kontrola aktualizací
- Zkratky z ikony aplikace (Protokol, F-Gas, Kalkulačky, P-T)
- Vlastní název firmy a kontakt na protokolu (⚙️ Data → Firma)
- iOS aplikace pro App Store (Capacitor), Android APK

> ⚠️ Data (klienti, protokoly, F-Gas) jsou uložena **jen v daném zařízení**.
> Pravidelně používejte *⚙️ Data → Zálohovat*.

## Struktura

```
www/                 webová aplikace (to, co se nasazuje)
  index.html         celá aplikace
  manifest.json      PWA manifest
  sw.js              service worker (offline)
  icons/             ikony
resources/           zdroje ikon a úvodní obrazovky (iOS + Android)
store/               texty, screenshoty a návod pro App Store
scripts/check.mjs    kontrola před vydáním
capacitor.config.json
.github/workflows/   automatické nasazení webu a build APK
```

## Vydání nové verze

1. Upravte `www/index.html`.
2. Zvyšte verzi na **třech** místech (kontrola to hlídá):
   `APP_VERSION` v `www/index.html`, `VERSION` v `www/sw.js`, `version` v `package.json`.
3. `npm run check`
4. Push do `main` → web se nasadí sám (GitHub Pages z větve), APK se sestaví a iOS build se nahraje do TestFlightu.
5. Pro oficiální vydání vytvořte tag, např. `v4.0.0` → vznikne GitHub Release s APK ke stažení.

## Jednorázové nastavení

**Web (GitHub Pages):** adresa je `https://lukassulas-cmyk.github.io/innteo-app1/`.
Pages nasazuje přímo z větve `main` (root); kořenový `index.html` přesměruje do `www/`.

**iPhone:** soubory (protokol, záloha, F-Gas CSV) se ukládají přes systémové *Sdílet*
→ „Uložit do Souborů", Mail, WhatsApp… Data instalované aplikace iOS nemaže,
v samotném Safari (bez přidání na plochu) je může po delší nečinnosti smazat.

**Podepsané APK / Google Play (volitelné):** bez podpisu vzniká *debug* APK, které jde
nainstalovat přímo do telefonu (povolit „instalaci z neznámých zdrojů").
Pro Google Play je potřeba vlastní podpisový klíč:

```bash
keytool -genkey -v -keystore innteo.keystore -alias innteo -keyalg RSA -keysize 2048 -validity 10000
base64 -w0 innteo.keystore   # výstup vložit do secretu ANDROID_KEYSTORE_BASE64
```

Settings → Secrets and variables → Actions → přidat:
`ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`.
Pak build vytvoří i podepsané `.apk` a `.aab` (pro Google Play Console).
Klíč si bezpečně uschovejte – bez něj nejde vydat aktualizace na Google Play.

## Lokální vývoj

```bash
npm install
npm run serve            # web na http://localhost:8080
npm run check            # kontrola

# Android (vyžaduje Android Studio)
npx cap add android
npm run android:icons
npx cap sync android
npx cap open android
```
