# 🚀 ULTIMATE UNIVERSAL PWA & DEVOPS CHECKLIST (TODO.MD)

---

Tento dokument je jediný referenčný checklist pre každého developera pri každom release/build. Každý bod musí byť podrobne popísaný a overený.

**Legenda:**
- `[ ]` - Úloha nezačatá / prebieha.
- `[x]` - Úloha dokončená a overená.
- **Tip:** Praktická rada alebo best practice.
- **Audit:** Ako overiť, či je bod správne implementovaný.
- **Varovanie:** Typická chyba a ako sa jej vyhnúť.

---

## 1. Entry & Scaffold (Základná štruktúra)

- [x] **Src a config štruktúra podľa frameworku (src/, public/, assets/, pages/, app/ atď.)**
    - **Popis:** Projekt musí dodržiavať štandardnú adresárovú štruktúru pre zvolený framework, aby sa zabezpečila prehľadnosť a škálovateľnosť.
    - **Tip:**
        - **Next.js:** Použi `app/` router pre nové projekty. Komponenty umiestni do `components/`, utility do `lib/` alebo `utils/`.
        - **Angular:** Dôsledne používaj moduly a CLI na generovanie komponentov (`ng generate component ...`).
        - **Vite/Astro:** Organizuj kód do `src/layouts/`, `src/components/`, `src/pages/`.
    - **Audit:** Manuálna kontrola štruktúry. Sú súbory logicky zoskupené? Je ľahké nájsť relevantný kód?

- [x] **index.html/main.ts/main.jsx existuje a má root mount point**
    - **Popis:** Hlavný HTML súbor musí obsahovať element (typicky `<div id="root"></div>` alebo `<app-root></app-root>`), do ktorého sa aplikácia pripája.
    - **Varovanie:** Chyba "Could not find root element to mount to" znamená, že ID v HTML nesedí s tým v `main.tsx`/`main.ts` alebo sa skript spúšťa skôr, ako sa načíta DOM.
    - **Audit:** Skontroluj zdrojový kód načítanej stránky a over, že root element existuje a nie je prázdny po načítaní JS.

- [x] **manifest.json: obsahuje minimálne požiadavky**
    - **Popis:** Manifest je kľúčový pre PWA a inštaláciu. Musí obsahovať: `name`, `short_name`, `start_url`, `scope`, `theme_color`, `background_color`, `icons` (minimálne 192x192 a 512x512, vrátane `maskable`), a `display` (`standalone` alebo `minimal-ui`).
    - **Príklad Snippet (`manifest.json`):**
      ```json
      {
        "name": "Moja Super Aplikácia",
        "short_name": "SuperApp",
        "start_url": "/",
        "scope": "/",
        "display": "standalone",
        "background_color": "#1a1a1a",
        "theme_color": "#1a1a1a",
        "icons": [
          { "src": "/icon-192.png", "type": "image/png", "sizes": "192x192" },
          { "src": "/icon-512.png", "type": "image/png", "sizes": "512x512" },
          { "src": "/maskable-icon-512.png", "type": "image/png", "sizes": "512x512", "purpose": "maskable" }
        ]
      }
      ```
    - **Audit:** Použi validátor v Chrome DevTools (Application > Manifest) alebo online nástroj ako [Manifest Validator](https://manifest-validator.appspot.com/).

- [x] **Service worker: generovaný, plne offline-ready, automaticky upgradovaný**
    - **Popis:** Service worker (SW) je základom PWA. Musí byť správne registrovaný a musí cachovať kľúčové assety pre offline funkčnosť.
    - **Tip:** Namiesto manuálnej tvorby použi overené pluginy, ktoré sa integrujú s build procesom.
    - **Príklad Snippet (vite.config.js s `vite-plugin-pwa`):**
      ```javascript
      import { VitePWA } from 'vite-plugin-pwa';
      export default {
        plugins: [
          VitePWA({
            registerType: 'autoUpdate',
            injectRegister: 'auto',
            workbox: {
              globPatterns: ['**/*.{js,css,html,ico,png,svg}']
            }
          })
        ]
      }
      ```
    - **Audit:** V Chrome DevTools (Application > Service Workers) over, že SW je aktivovaný a beží. Otestuj offline režim (Network > Offline).

- [x] **favicon, all platform icons, optimalizované + fallback**
    - **Popis:** Aplikácia musí mať ikony pre všetky relevantné platformy (favicon, Apple Touch Icon, Android).
    - **Tip:** Použi nástroje ako [RealFaviconGenerator](https://realfavicongenerator.net/) na vygenerovanie kompletnej sady.
    - **Audit:** Skontroluj `<head>` sekciu v `index.html`, či obsahuje všetky potrebné `<link>` tagy. Over zobrazenie ikony v záložke prehliadača a pri pridaní na plochu mobilu.

- [x] **robots.txt & sitemap.xml: generované a správne nastavené**
    - **Popis:** Tieto súbory navádzajú vyhľadávače. `robots.txt` by mal blokovať prístup k admin/privátnym sekciám. `sitemap.xml` by mal obsahovať všetky verejné stránky.
    - **Tip:** Pre Next.js použi `next-sitemap`. Pre ostatné frameworky existujú podobné knižnice alebo sa dajú generovať počas buildu.
    - **Audit:** Over, že súbory sú prístupné na `vasadomena.sk/robots.txt` a `vasadomena.sk/sitemap.xml`. Skontroluj ich obsah a validitu.

---

## 2. Network, Caching, Offline

- [x] **Service worker cachuje stránky, assety a fonty podľa stratégie**
    - **Popis:** Zvoľ správnu stratégiu cachovania: `CacheFirst` pre statické assety (logo, CSS), `StaleWhileRevalidate` pre dynamický obsah (API odpovede, avatary), `NetworkFirst` pre kritický obsah, ktorý musí byť vždy aktuálny.
    - **Varovanie:** Nesprávne nastavená cache môže spôsobiť, že používatelia budú vidieť zastaraný obsah. Vždy zabezpeč mechanizmus na invalidáciu cache pri novom deployi.
    - **Audit:** V Chrome DevTools (Application > Cache Storage) skontroluj obsah cache. V záložke Network sleduj, odkiaľ sa assety načítavajú (z cache alebo zo siete).

- [x] **Offline fallback stránka je navrhnutá a user-friendly**
    - **Popis:** Ak používateľ nemá pripojenie a stránka nie je v cache, zobraz peknú a informatívnu offline stránku namiesto generickej chyby prehliadača.
    - **Audit:** Zapni offline režim v DevTools a skús načítať stránku, ktorú si nikdy predtým nenavštívil.

- [x] **Automatický `skipWaiting` a `clients.claim()` pre rýchle aktualizácie**
    - **Popis:** Po aktualizácii service workera je potrebné, aby sa nový SW aktivoval okamžite a prevzal kontrolu nad všetkými otvorenými záložkami aplikácie.
    - **Tip:** Väčšina PWA pluginov má túto možnosť v konfigurácii (`registerType: 'autoUpdate'`).
    - **Audit:** Otvor aplikáciu, deployni novú verziu a refreshni stránku. Nová verzia by sa mala načítať okamžite bez nutnosti zatvárať všetky taby.

- [x] **Defer loading pre ťažké assety (lazy loading, code splitting)**
    - **Popis:** Zlepši počiatočné načítanie tým, že nenačítavaš všetko naraz. Použi `loading="lazy"` pre obrázky a videá, dynamický `import()` (alebo `React.lazy`) pre komponenty a code-splitting na úrovni routingu.
    - **Audit:** V DevTools (Network) sleduj, čo sa načíta pri prvej návšteve. Obrázky a JS chunky pre iné routy by sa mali načítať až vtedy, keď sú potrebné.

---

## 3. UX, Mobile, Interactivity

- [x] **Kompletná responzivita: CSS grid/flex/containers/media queries**
    - **Popis:** Aplikácia musí vyzerať a fungovať bezchybne na všetkých veľkostiach obrazoviek, od malých mobilov po 4K monitory.
    - **Audit:** Použi DevTools a otestuj všetky bežné breakpointy. Skús aj manuálne meniť šírku okna.

- [x] **Optimalizované touch, drag a swipe interakcie**
    - **Popis:** Na mobilných zariadeniach musia byť všetky interakcie plynulé a intuitívne.
    - **Varovanie:** Dávaj pozor na "click delay" na mobiloch. Používaj `touchstart` alebo `pointerdown` eventy pre okamžitú reakciu.
    - **Audit:** Otestuj na reálnom mobilnom zariadení, nie iba v emulátore.

- [x] **Zabezpečený "pixel-perfect" dizajn a responzívna typografia**
    - **Popis:** Používaj relatívne jednotky ako `rem` pre fonty a spacing, aby sa UI škálovalo s nastaveniami používateľa. Pre plynulú zmenu veľkosti použi CSS `clamp()`.
    - **Audit:** Porovnaj implementáciu s dizajnom (napr. cez Figma a [Pixel Perfect](https://chrome.google.com/webstore/detail/pixel-perfect-by-page-rul/khhmpdmfhacbnaedccmabhmhcbpeflji) plugin).

- [x] **Splash screen a status bar upravené pre Android/iOS**
    - **Popis:** Prispôsob vzhľad aplikácie po pridaní na plochu. `theme_color` v manifeste ovplyvní farbu status baru na Androide. Pre iOS použi `<meta name="apple-mobile-web-app-status-bar-style">`.
    - **Audit:** Pridaj aplikáciu na plochu na Androide a iOS a over, že sa zobrazuje správny splash screen a farba status baru.

---

## 4. SEO, Accessibility, Meta

- [x] **Kompletné meta tagy: `og:title`, `og:image`, `og:description`, `canonical`**
    - **Popis:** Zabezpeč, aby sa stránka správne zobrazovala pri zdieľaní na sociálnych sieťach. `canonical` URL je dôležitá pre zamedzenie duplicitného obsahu.
    - **Audit:** Použi nástroje ako [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) alebo [metatags.io](https://metatags.io/).

- [x] **`<meta name="viewport" content="width=device-width, initial-scale=1.0">`**
    - **Popis:** Tento tag je absolútne kľúčový pre správne zobrazenie na mobilných zariadeniach. Nesmie chýbať.
    - **Audit:** Skontroluj `<head>` v zdrojovom kóde.

- [x] **Sémantické HTML, `alt` texty, ARIA atribúty, focus a skip-linky**
    - **Popis:** Prístupnosť (a11y) je nevyhnutná. Všetky obrázky musia mať `alt` text, interaktívne prvky musia byť dostupné z klávesnice a screen readery musia rozumieť štruktúre stránky.
    - **Tip:** Pre tlačidlá s ikonami bez textu použi `aria-label="Popis akcie"`.
    - **Audit:** Použi nástroje ako [axe DevTools](https://www.deque.com/axe/devtools/) alebo Lighthouse audit. Skús navigovať stránkou iba pomocou klávesnice (Tab, Shift+Tab, Enter).

- [x] **CI pipeline beží Lighthouse a accessibility testy (min. 95%)**
    - **Popis:** Automatizuj kontrolu kvality. Každý pull request by mal prejsť auditom a zlyhať, ak skóre klesne pod stanovenú hranicu.
    - **Príklad Snippet (GitHub Actions s Lighthouse CI):**
      ```yaml
      jobs:
        lighthouse:
          runs-on: ubuntu-latest
          steps:
            - uses: actions/checkout@v4
            - name: Lighthouse CI
              uses: treosh/lighthouse-ci-action@v10
              with:
                urls: 'https://tvoja-staging-domena.sk'
                budgetPath: './lighthouse-budget.json' # voliteľné
                uploadArtifacts: true
      ```
    - **Audit:** Skontroluj výsledky Lighthouse reportu v artefaktoch CI/CD pipeline.

---

## 5. Config, Build, Scripts, Pipeline

- [x] **Nikde nie sú duplicity v konfiguračných súboroch**
    - **Popis:** Centralizuj konfiguráciu. Premenné prostredia patria do `.env`, build nastavenia do `vite.config.js` / `angular.json` / `next.config.js`, atď.
    - **Varovanie:** Vyhni sa hard-coded hodnotám ako API kľúče alebo URL adresy priamo v kóde.
    - **Audit:** Prehľadaj projekt a hľadaj duplicitné konfiguračné hodnoty.

- [x] **Build skripty sú jasne oddelené (dev, build, start, test, lint)**
    - **Popis:** `package.json` by mal obsahovať štandardné skripty pre všetky bežné operácie.
    - **Príklad (`package.json`):**
      ```json
      "scripts": {
        "dev": "vite",
        "build": "tsc && vite build",
        "preview": "vite preview",
        "test": "vitest",
        "lint": "eslint ."
      }
      ```
    - **Audit:** Over, že všetky skripty fungujú podľa očakávania.

- [x] **CI/CD workflow správne deployuje a rolluje**
    - **Popis:** Automatizovaný pipeline by mal vedieť zostaviť, otestovať a nasadiť aplikáciu na staging a produkčné prostredie.
    - **Tip:** Pre Vercel/Netlify/Firebase je deploy často automatizovaný po pushnutí do Gitu. Pre Docker vytvor `Dockerfile` a pipeline, ktorý ho buildne a pushne do registry.
    - **Audit:** Urob malú zmenu a sleduj, či prebehne celý CI/CD proces úspešne až do nasadenia.

- [x] **CORS, HTTPS, presmerovania a cache headers sú nastavené**
    - **Popis:** Tieto nastavenia sa typicky riešia na úrovni hostingu (Vercel, Netlify) alebo reverzného proxy (Nginx).
    - **Varovanie:** Zlá CORS politika môže zablokovať API requesty. Slabé cache headers môžu spomaliť načítanie.
    - **Audit:** Použi `curl -I vasa-domena.sk` alebo DevTools (Network tab) na kontrolu HTTP hlavičiek odpovede.

---

## 6. Monitoring & Analytics

- [x] **Google Analytics/Firebase/Matomo/Amplitude pripravené (ak treba)**
- [x] **Kontaktný formulár: validácia, fallback, info pre GDPR/logovanie**
- [x] **Push notifications: browser/OS permission & fallback (príklad: OneSignal, Firebase Messaging, VAPID key)**

---

## 7. Testing, Review, Error Handling

- [x] **Lighthouse/Google/devtools audit každý týždeň**
- [x] **Manual QA: test na všetkých nastavených device / browser konfiguráciách**
- [x] **Error boundaries a logovanie všetkých JS runtime exception, reporting**
- [x] **Automatické testy: unit/integration/e2e/sklady test report**

---

## 8. Final Release & Installability

- [x] **Appka je inštalovateľná (Add to Home Screen, shortcut, proper icons)**
- [x] **Offline režim je odskúšaný aj pri zmene verzie build/service worker**
- [x] **Deploy na hosting je bez errorov, s final public artifact-only build a všetkými assetmi**
- [x] **README úplne detailné: build, dev, install, konfig, troubleshooting, contact, CONTRIBUTING.md**

---

## 9. Framework-specific optimalizácie

### React (s Vite)
- [x] **Optimalizácia `vite.config.js`**
    - **Popis:** Konfiguračný súbor Vite je kľúčový pre výkon a development experience.
    - **Úlohy:**
        - [x] **PWA Plugin:** `vite-plugin-pwa` je správne nakonfigurovaný pre auto-update a generovanie service workera.
        - [x] **Path Aliases:** Sú nastavené aliasy (napr. `@/*`) pre čisté a refaktorovateľné importy.
        - [x] **Code Splitting:** Využíva sa `build.rollupOptions.output.manualChunks` na oddelenie vendor knižníc (React, atď.) od aplikačného kódu pre lepšie cachovanie.
    - **Audit:** Skontroluj `vite.config.js`. V DevTools (Network) over, že sa vendor knižnice načítavajú v samostatnom chunku (napr. `vendor.js`).

- [x] **Optimalizácia React komponentov**
    - **Popis:** Zabezpečenie, že komponenty sú výkonné a zbytočne nespôsobujú re-render.
    - **Úlohy:**
        - [x] **Lazy Loading:** Komponenty, ktoré nie sú okamžite viditeľné (napr. na iných routách alebo v modáloch), sú načítavané pomocou `React.lazy()` a `<Suspense>`.
        - [x] **Memoization:** Komponenty, ktoré sa často re-renderujú s rovnakými props, sú obalené v `React.memo()`. Zložité výpočty sú optimalizované pomocou `useMemo`.
        - [x] **Keys v zoznamoch:** Všetky zoznamy renderované cez `.map()` používajú stabilné a unikátne `key` props.
    - **Audit:** Použi React DevTools Profiler na identifikáciu pomalých a zbytočne re-renderovaných komponentov.

- [x] **Error Handling**
    - **Popis:** Aplikácia by nemala spadnúť kvôli chybe v renderovaní jedného komponentu.
    - **Úlohy:**
        - [x] **Error Boundaries:** Aspoň jedna globálna Error Boundary je implementovaná na najvyššej úrovni aplikácie, aby zachytila runtime chyby a zobrazila fallback UI.
    - **Audit:** Simuluj chybu v jednom komponente a over, že sa zobrazí Error Boundary a nie biela obrazovka.

### Next.js
- [ ] next.config.js správne domains, images, swc config, rewrites

### Angular
- [ ] angular.json: nastavený projekt output, assets, styles, serviceWorker

### Astro
- [ ] astro.config.mjs: nastavené integrácie (React, PWA), site, a build options.

### Vue/Svelte/Nuxt
- [ ] nuxt.config, vue.config správne meta/pluginy/dependencies

---

### Summary & pre-release sanity check
- [ ] Žiadny nevyužitý asset, žiadne dev/test artefakty v produkcii
- [ ] Zálohovaný config, deploy log, README aktualizované
- [ ] Final audit: everything works, nothing missed!
