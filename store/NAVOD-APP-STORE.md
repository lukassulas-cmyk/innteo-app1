# Návod: INNTEO do App Store (bez Macu)

Aplikace se sestaví, podepíše a nahraje automaticky na Macu od GitHubu.
Vy potřebujete jen iPhone, prohlížeč a Apple účet vývojáře.

Odhad času: 1 hodina práce + čekání na Apple (registrace 1–14 dní, schválení aplikace 1–3 dny).

---

## Krok 1 – Apple Developer Program (99 USD / rok)

https://developer.apple.com/programs/enroll/

Vyberte jednu z možností:

| | Jako **firma** (INNTEO Sulas s.r.o.) | Jako **fyzická osoba** |
|---|---|---|
| V App Store se zobrazí jako prodejce | INNTEO Sulas s.r.o. | Lukáš Sulas |
| Potřeba | **číslo D-U-N-S** firmy (zdarma, vyřízení až ~2 týdny), web firmy, oprávnění jednat za firmu | jen Apple ID s dvoufázovým ověřením |
| Rychlost | pomalejší | obvykle do 48 h |

Doporučení: pro oficiální firemní aplikaci **firma**. Číslo D-U-N-S zjistíte / požádáte přímo
v průvodci registrací Apple („Look up D-U-N-S Number").

## Krok 2 – Registrace Bundle ID

https://developer.apple.com/account/resources/identifiers/list → **+** → *App IDs* → *App*

- Description: `INNTEO Field Tool`
- Bundle ID: *Explicit* → `cz.innteo.fieldtool`
- Capabilities: nic nezaškrtávat → *Register*

## Krok 3 – Založení aplikace v App Store Connect

https://appstoreconnect.apple.com → *Aplikace* → **+** → *Nová aplikace*

- Platforma: **iOS**
- Název: `INNTEO Field Tool` (musí být v App Store unikátní – kdyby byl obsazený, zkuste `INNTEO HVAC MaR`)
- Primární jazyk: **čeština**
- Bundle ID: `cz.innteo.fieldtool`
- SKU: `innteo-fieldtool`
- Uživatelský přístup: Plný přístup

## Krok 4 – API klíč (aby GitHub mohl nahrávat za vás)

App Store Connect → *Uživatelé a přístup* → *Integrace* → *App Store Connect API* → *Klíče týmu* → **+**

- Název: `GitHub`
- Přístup: **Admin** (nutné – GitHub si sám vytvoří podpisový certifikát)
- **Stáhněte soubor `AuthKey_XXXXXXXXXX.p8`** – jde stáhnout jen jednou, uschovejte ho!
- Opište si **Key ID** (u klíče) a **Issuer ID** (nad tabulkou klíčů)

**Team ID** najdete na https://developer.apple.com/account → *Membership details* (10 znaků).

## Krok 5 – Secrets v GitHubu

https://github.com/lukassulas-cmyk/innteo-app1/settings/secrets/actions → *New repository secret*

| Název | Hodnota |
|---|---|
| `APPSTORE_KEY_ID` | Key ID z kroku 4 |
| `APPSTORE_ISSUER_ID` | Issuer ID z kroku 4 |
| `APPSTORE_KEY_P8` | celý obsah souboru `.p8` (otevřít v Poznámkovém bloku, zkopírovat vše včetně řádků `-----BEGIN…` a `-----END…`) |
| `APPLE_TEAM_ID` | Team ID |

## Krok 6 – Sestavení a nahrání

GitHub → *Actions* → **iOS (App Store)** → *Run workflow* (větev `main`) → *Run workflow*.

Za ~15 minut je hotovo. V App Store Connect → *TestFlight* se build objeví do 5–30 minut
(stav *Zpracovává se*). Apple vám může poslat e-mail s dotazem na šifrování – je to už vyřešené
v aplikaci (používá jen standardní šifrování systému).

## Krok 7 – Vyzkoušení na vlastním iPhonu (TestFlight)

1. Na iPhone nainstalujte aplikaci **TestFlight** z App Store.
2. App Store Connect → *TestFlight* → *Interní testování* → **+** → přidejte sebe (svůj Apple ID e-mail).
3. Přijde pozvánka → otevřít v TestFlightu → *Instalovat*.

Takto můžete aplikaci používat hned, ještě před schválením do App Store.

## Krok 8 – Odeslání ke schválení

App Store Connect → aplikace → záložka *App Store* → verze **4.0.0**:

1. Vyplňte texty ze souboru [`app-store-listing.md`](app-store-listing.md).
2. Nahrajte screenshoty ze složky [`screenshots/`](screenshots/) do *iPhone 6.9" Display*.
3. *Build* → **+** → vyberte nahraný build.
4. *Ochrana soukromí aplikace* → „Data neshromažďujeme".
5. *Cena a dostupnost* → Zdarma, dostupnost např. Česko + Slovensko (nebo všechny země).
6. **Odeslat ke kontrole**.

Schválení obvykle trvá 1–3 dny.

## Nová verze aplikace později

1. Upravit aplikaci, zvýšit verzi (viz README – `npm run check` hlídá 3 místa).
2. Push do `main` → iOS build se sám nahraje do TestFlightu.
3. V App Store Connect → *+ Verze* → vybrat build → odeslat ke kontrole.

---

## Na co si dát pozor

- **Riziko zamítnutí podle pravidla 4.2 (minimální funkčnost).** Apple někdy zamítá aplikace,
  které působí jen jako zabalený web. Naše aplikace funguje offline, obsah má v sobě a používá
  systémové sdílení/Soubory – v poznámkách pro Review je to popsané. Kdyby přesto přišlo
  zamítnutí, obvykle stačí odpovědět v Resolution Center a doplnit nativní funkci
  (např. sken štítku zařízení fotoaparátem, PDF protokol s podpisem) – rád pomůžu.
- **Kontaktní e-mail v zásadách ochrany soukromí** – doplňte firemní e-mail do `www/privacy.html`
  (místo je označené komentářem `KONTAKT`).
- **Minuty GitHub Actions:** build na Macu spotřebuje víc minut než Linux. Na soukromém repozitáři
  je v bezplatném plánu omezený počet – při běžném vydávání verzí to stačí.
- **Tisk protokolu na iPhonu:** protokol se odešle přes *Sdílet* → *Uložit do Souborů* / Mail;
  tisk / PDF pak z náhledu souboru (Sdílet → Tisk).
