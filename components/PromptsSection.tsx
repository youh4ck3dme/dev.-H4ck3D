import React, { forwardRef, useState, useEffect, useRef } from 'react';

interface PromptsSectionProps {
  id: string;
  title: string;
  gradient: string;
  showToast: (message: string, type: 'success' | 'error') => void;
}

const promptsContent = `
# UNIVERZÁLNE PROMPTY – nový projekt & existujúci projekt (vendor‑agnostické)

Plne **neutrálny** balík promptov (bez značky/firmy) použiteľný v **Google AI Studio (Gemini), OpenAI Chat, Claude, GitHub Copilot Chat, Perplexity**, a iných. Všetko pripravené na **copy‑paste**. Dva hlavné režimy: **A) Nový projekt** a **B) Existujúci projekt**.

> 📌 Konvencie placeholderov: nahraď \`[PLACEHOLDER]\` vlastnou hodnotou.

---

## A) MASTER PROMPT – Nový projekt (Greenfield)

\`\`\`prompt
Úloha: Ako top softvérový architekt a lead developer navrhni, vygeneruj a odovzdaj produkčne pripravený projekt.

KONTEKST:
- Názov projektu: [PROJECT_NAME]
- Typ: [WEB_APP|PWA|API|MOBILE|DESKTOP]
- Primárny stack: [STACK] (napr. React/Next/Angular/Vue/Svelte/Astro + Node/Express/Nest + TS strict)
- Dizajn systém: [TOKENS] (farby, typografia, spacing), prístupnosť WCAG 2.2 AA
- Deploy cieľ: [DEPLOY_TARGET] (napr. Vercel/Netlify/Firebase/VPS + Docker)
- Licencia: [LICENSE]

CIELE (výstupy):
1) **Špecifikácia a IA**: architektúra, modulové diagramy, adresárová štruktúra, ADR (Architecture Decision Records).
2) **Kód**: produkčný scaffold s ukážkovými feature modulmi, typovaním, lint/test setupom.
3) **PWA** (ak relevantné): manifest, service worker (offline cache, SW update flow), install prompt.
4) **UI/UX**: komponentová knižnica, theming, dark/light, micro‑interactions (len natívny CSS/JS alebo zvolená knižnica).
5) **Bezpečnosť**: .env handling, headers (CSP, HSTS, X‑Frame‑Options), auth modul (stub), rate‑limit (ak API), základné RBAC.
6) **Dáta**: adapter vrstva ([DB|API]), mock data + seed skript.
7) **Výkon & SEO**: CWV budget (LCP < 1.8s, CLS < 0.1, TBT < 200ms), meta, OG/Twitter, sitemap, robots.txt.
8) **Observabilita**: minimalistický logger, error boundary, zdravie /health, basic analytics hook (bez vendor lock‑in).
9) **Testy**: unit (≥70% lines), e2e happy‑path, accessibility checks.
10) **CI/CD**: YAML pipeline pre build/lint/test, preview deploy, produkčný deploy.
11) **Dokumentácia**: README (quickstart, scripts, architektonické rozhodnutia), CONTRIBUTING, CHANGELOG.

POŽIADAVKY NA DODANIE:
- Vygeneruj **kompletnú adresárovú štruktúru** a **všetky súbory** v blokoch kódu.
- Dodaj **skripty** (npm/yarn/pnpm) + príkazy pre lokálny beh a build.
- Uveď **akceptačné kritériá** (checklist), **performance budget**, a **bezpečnostný checklist**.
- Žiadne proprietárne SDK bez dôvodu. Preferuj štandardy a OSS.

FORMÁT ODPOVEDE:
1) „Project Overview“
2) „Folder Tree“
3) „Files“ (s plným obsahom)
4) „Run & Deploy“ (príkazy)
5) „Tests“ (ukážky)
6) „CI/CD“ (YAML)
7) „Acceptance Criteria + Budgets“
8) „Next Steps“

Na záver validuj: „✅ Ready for prod: [YES/NO] + krátke zdôvodnenie“. Ak NO, uveď presný plan fixov.
\`\`\`

---

## B) MASTER PROMPT – Existujúci projekt (Refactor/Upgrade)

\`\`\`prompt
Úloha: Ako senior opravár/architekt urob „diagnostika → plán → patch → validácia → dokumentácia“ bez prerušenia produkcie.

VSTUPY:
- Repo: [REPO_URL]
- Branch: [BRANCH]
- Stack: [STACK]
- Problémy/požiadavky: [ISSUES]
- Ciele: [GOALS] (výkon, bezpečnosť, UX, SEO, DX, testy, CI/CD)

POSTUP:
1) **Audit**: prehľad modulov, závislostí, CWV, bundle size, dead code, duplicity, bezpečnostné riziká, DB indexy.
2) **Report**: priorizovaný zoznam nálezov (RICE score), návrh riešení, odhad dopadu a rizika.
3) **Refactor**: malé PR s atomic commitmi (conventional commits), migrácie, dekompozícia, typovanie, rozbitie „god“ komponentov.
4) **Výkon**: lazy loading, code‑splitting, caching, prefetch, obrazy (AVIF/WebP), reduce JS.
5) **Bezpečnosť**: CSP, záplaty, audit závislostí, secret scanning, hardening configov.
6) **Testy**: doplnenie unit/e2e, snapshoty, a11y testy.
7) **CI/CD**: pipeline s cache, artefakty, preview deploy, quality gates.
8) **Dokumentácia**: CHANGELOG, MIGRATION.md, aktualizovaný README.

DODANIE:
- Vráť diff bloky (patch), súbory po úpravách, spúšťacie príkazy, výsledky testov (zhrnutie), Lighthouse skóre pred/po.
- Uveď „Rollback plan“ a „Release checklist“.
\`\`\`

---

## C) 10× BOOSTER PROMPTY (iterovateľné, univerzálne)

### 1. Core Optimizer

\`\`\`prompt
Analyzuj projekt a odstráň neefektívny kód, zníž latency, zjednoť error handling a priprav „performance preset“. Iteruj ×5, ponechaj len merateľné zlepšenia.
\`\`\`

### 2. UX Level‑Up

\`\`\`prompt
Optimalizuj UI interakcie, stavy načítania, prístupnosť a čitateľnosť. Navrhni micro‑interactions, ktoré nezvyšujú TBT. Doruč diffs a ukážky.
\`\`\`
`;

const ADMIN_PASSWORD = "23513900"; // Same as admin login

interface PromptBlockProps {
  content: string;
  showToast: (message: string, type: 'success' | 'error') => void;
}

const PromptBlock: React.FC<PromptBlockProps> = ({ content, showToast }) => {
  const [copied, setCopied] = useState(false);
  const textRef = useRef<HTMLPreElement>(null);

  const handleCopy = async () => {
    if (textRef.current) {
      try {
        await navigator.clipboard.writeText(textRef.current.innerText);
        showToast('Prompt copied to clipboard!', 'success');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        showToast('Failed to copy prompt.', 'error');
        console.error('Failed to copy text: ', err);
      }
    }
  };

  return (
    <div className="relative my-4">
      <pre ref={textRef} className="bg-gray-900/70 border border-gray-700 rounded-lg p-4 text-sm text-gray-300 font-mono overflow-x-auto">
        <code>{content.trim()}</code>
      </pre>
      <button
        onClick={handleCopy}
        aria-label="Copy prompt to clipboard"
        className="absolute top-2 right-2 px-3 py-1 text-xs font-semibold text-black bg-white rounded-md hover:bg-gray-200 transition-colors"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
};

const FormattedPrompts: React.FC<{ content: string, showToast: PromptsSectionProps['showToast'] }> = ({ content, showToast }) => {
  const parts = content.split(/(\`\`\`prompt[\s\S]*?\`\`\`)/g).filter(Boolean);

  const renderText = (text: string) => {
    return text.split('\n').map((line, index) => {
      // Bold text
      line = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>');
      // Inline code
      line = line.replace(/\`(.*?)\`/g, '<code class="bg-gray-700 text-cyan-300 px-1 py-0.5 rounded-sm text-sm">$1</code>');

      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-3xl font-bold text-white mt-8 mb-4">{line.substring(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-semibold text-gray-200 mt-6 mb-3">{line.substring(4)}</h3>;
      }
       if (line.startsWith('# ')) {
        return <h1 key={index} className="text-4xl font-extrabold text-white mt-4 mb-6 tracking-tight">{line.substring(2)}</h1>;
      }
      if (line.startsWith('> ')) {
        return <blockquote key={index} className="border-l-4 border-cyan-500 pl-4 my-4 text-gray-400 italic">{line.substring(2)}</blockquote>;
      }
      if (line.trim() === '---') {
        return <hr key={index} className="my-10 border-gray-700" />;
      }
      return <p key={index} className="my-2 text-gray-300" dangerouslySetInnerHTML={{ __html: line }} />;
    });
  };

  return (
    <div>
      {parts.map((part, index) => {
        if (part.startsWith('```prompt')) {
          const code = part.replace('```prompt', '').replace('```', '');
          return <PromptBlock key={index} content={code} showToast={showToast} />;
        }
        return <div key={index}>{renderText(part)}</div>;
      })}
    </div>
  );
};


const PromptsSection = forwardRef<HTMLElement, PromptsSectionProps>(({ id, title, gradient, showToast }, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const targetRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1 });

    const currentTarget = targetRef.current;
    if (currentTarget) observer.observe(currentTarget);
    return () => { if (currentTarget) observer.unobserve(currentTarget); };
  }, []);
  
  useEffect(() => {
    try {
      const sessionAuth = sessionStorage.getItem('isPromptAuthenticated');
      if (sessionAuth === 'true') setIsAuthenticated(true);
    } catch (e) {
      console.error("Could not access session storage.", e);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      try {
        sessionStorage.setItem('isPromptAuthenticated', 'true');
        setIsAuthenticated(true);
        setError('');
      } catch (e) {
        setError("Could not save session. Please check browser settings.");
      }
    } else {
      setError('Incorrect password.');
    }
    setPassword('');
  };

  return (
    <section
      id={id}
      ref={(el) => {
        targetRef.current = el;
        if (typeof ref === 'function') ref(el);
        else if (ref) ref.current = el;
      }}
      className={`min-h-screen w-full flex items-center justify-center p-4 sm:p-8 lg:p-12 bg-gradient-to-br ${gradient} transition-opacity duration-1000 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="text-center max-w-4xl w-full mx-auto">
        <h1 className="text-4xl font-black text-white uppercase opacity-90 sm:text-6xl md:text-8xl lg:text-9xl tracking-tighter">{title}</h1>
        <div className="mt-12 text-left">
          {!isAuthenticated ? (
            <div className="max-w-md mx-auto p-8 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg">
              <h2 className="text-2xl font-bold text-center text-white">Access Protected Content</h2>
              <p className="text-center text-gray-400 mt-2">Enter the password to view the AI prompts.</p>
              <form onSubmit={handleLogin} className="space-y-4 mt-6">
                <div>
                  <label htmlFor="prompt-password-input" className="sr-only">Password</label>
                  <input
                    id="prompt-password-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                {error && <p className="text-sm text-center text-red-400">{error}</p>}
                <button
                  type="submit"
                  className="w-full px-4 py-2 font-semibold text-black transition-transform duration-200 bg-white rounded-md hover:bg-gray-200 active:scale-95"
                >
                  Unlock
                </button>
              </form>
            </div>
          ) : (
             <div className="p-4 sm:p-6 bg-black/20 rounded-lg border border-gray-800 backdrop-blur-sm">
                <FormattedPrompts content={promptsContent} showToast={showToast} />
             </div>
          )}
        </div>
      </div>
    </section>
  );
});

PromptsSection.displayName = 'PromptsSection';

export default PromptsSection;