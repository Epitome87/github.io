const s={react:{categoryKey:"frontend",name:"React.tsx",icon:"\u269B\uFE0F",category:"Frontend \u2022 Core Library",lines:['<span class="com">// Context: Core UI library across production client projects & SaaS applications.</span>',"",`<span class="kw">import</span> { <span class="type">useState</span>, <span class="type">useCallback</span> } <span class="kw">from</span> <span class="str">'react'</span>;`,"",'<span class="kw">export const</span> <span class="fn">ChapterDeck</span> = ({ <span class="prop">chapters</span>, <span class="prop">activeId</span> }) => {','  <span class="kw">const</span> [index, setIndex] = <span class="fn">useState</span>(activeId);','  <span class="kw">const</span> handleNext = <span class="fn">useCallback</span>(() => setIndex(i => i + 1), []);','  <span class="kw">return</span> &lt;<span class="type">StoryCanvas</span> <span class="prop">chapter</span>={chapters[index]} <span class="prop">onNext</span>={handleNext} /&gt;;',"};"],desc:"Core UI library across production client projects & SaaS applications."},nextjs:{categoryKey:"frontend",name:"Next.js.tsx",icon:"\u25B2",category:"Frontend \u2022 App Router & SSR",lines:['<span class="com">// Context: Full-stack SSR, hybrid static caching, Server Actions & SEO metadata.</span>',"",'<span class="kw">export const</span> metadata: <span class="type">Metadata</span> = {',`  <span class="prop">title</span>: <span class="str">'Portfolio // Matthew McGrath'</span>,`,`  <span class="prop">description</span>: <span class="str">'Full-stack engineering portfolio.'</span>`,"};","",'<span class="kw">export default async function</span> <span class="fn">Page</span>() {','  <span class="kw">const</span> stats = <span class="kw">await</span> <span class="fn">getGitHubData</span>();','  <span class="kw">return</span> &lt;<span class="type">Dashboard</span> <span class="prop">data</span>={stats} /&gt;;',"}"],desc:"Full-stack SSR, hybrid static caching, Server Actions & SEO metadata."},typescript:{categoryKey:"frontend",name:"TypeScript.ts",icon:"\u{1F537}",category:"Frontend / Backend \u2022 Type Safety",lines:['<span class="com">// Context: Strict compile-time contract safety, generics & robust refactoring.</span>',"",'<span class="kw">export interface</span> <span class="type">ProjectCardProps</span> {','  <span class="prop">id</span>: <span class="type">string</span>;','  <span class="prop">title</span>: <span class="type">string</span>;','  <span class="prop">tags</span>: <span class="kw">readonly</span> <span class="type">string</span>[];',`  <span class="prop">metrics</span>?: { <span class="prop">lighthouse</span>: <span class="type">number</span>; <span class="prop">wcag</span>: <span class="str">'AA'</span> | <span class="str">'AAA'</span> };`,'  <span class="prop">onLaunch</span>: (<span class="prop">id</span>: <span class="type">string</span>) => <span class="type">Promise</span>&lt;<span class="type">void</span>&gt;;',"}"],desc:"Strict compile-time contract safety, generics & robust refactoring."},sass:{categoryKey:"frontend",name:"Sass.scss",icon:"\u{1F3A8}",category:"Frontend \u2022 Preprocessor & Architecture",lines:['<span class="com">// Context: 7-1 SASS architecture, design tokens, mixins & responsive breakpoints.</span>',"",`<span class="kw">@use</span> <span class="str">'tokens'</span> <span class="kw">as</span> *;`,`<span class="kw">@use</span> <span class="str">'mixins'</span> <span class="kw">as</span> *;`,"",'<span class="fn">.ide-chassis</span> {','  <span class="prop">background</span>: <span class="fn">var</span>(--bg-card);','  <span class="prop">border</span>: 1px solid <span class="fn">var</span>(--border);','  <span class="prop">border-radius</span>: <span class="fn">var</span>(--radius-lg);',"}"],desc:"7-1 SASS architecture, design tokens, mixins & responsive breakpoints."},tailwind:{categoryKey:"frontend",name:"Tailwind.css",icon:"\u{1F30A}",category:"Frontend \u2022 Utility-First Styling",lines:['<span class="com">// Context: Utility-first styling, rapid UI composition & responsive theme extensions.</span>',"",'&lt;<span class="type">div</span> <span class="prop">className</span>=<span class="str">"flex flex-col md:grid md:grid-cols-12 gap-6 bg-slate-900/60 p-6 rounded-2xl border border-sky-500/20 backdrop-blur-md"</span>&gt;','  &lt;<span class="type">span</span> <span class="prop">className</span>=<span class="str">"font-mono text-xs uppercase text-sky-400 font-semibold tracking-wider"</span>&gt;',"    Telemetry Stream",'  &lt;/<span class="type">span</span>&gt;','&lt;/<span class="type">div</span>&gt;'],desc:"Utility-first styling, rapid UI composition & responsive theme extensions."},storybook:{categoryKey:"frontend",name:"Storybook.ts",icon:"\u{1F4D5}",category:"Frontend \u2022 Isolated UI Workshop",lines:['<span class="com">// Context: Isolated design system workshop, component states & accessibility testing.</span>',"",`<span class="kw">import type</span> { <span class="type">Meta</span>, <span class="type">StoryObj</span> } <span class="kw">from</span> <span class="str">'@storybook/react'</span>;`,`<span class="kw">import</span> { <span class="type">ProjectModal</span> } <span class="kw">from</span> <span class="str">'./ProjectModal'</span>;`,"",'<span class="kw">const</span> meta: <span class="type">Meta</span>&lt;<span class="kw">typeof</span> <span class="type">ProjectModal</span>&gt; = {','  <span class="prop">component</span>: <span class="type">ProjectModal</span>,',`  <span class="prop">parameters</span>: { <span class="prop">layout</span>: <span class="str">'centered'</span> },`,"};",'<span class="kw">export default</span> meta;'],desc:"Isolated design system workshop, component states & accessibility testing."},javascript:{categoryKey:"frontend",name:"JavaScript.js",icon:"\u{1F7E8}",category:"Frontend / Backend \u2022 Core Language",lines:['<span class="com">// Context: ESNext fundamentals, async/await pipelines, closures & event loop mastery.</span>',"",'<span class="kw">export const</span> <span class="fn">fetchStats</span> = <span class="kw">async</span> (endpoint) => {',`  <span class="kw">const</span> res = <span class="kw">await</span> <span class="fn">fetch</span>(endpoint, { <span class="prop">cache</span>: <span class="str">'force-cache'</span> });`,'  <span class="kw">if</span> (!res.ok) <span class="kw">throw new</span> <span class="type">Error</span>(<span class="str">`HTTP error: ${res.status}`</span>);','  <span class="kw">return</span> <span class="kw">await</span> res.<span class="fn">json</span>();',"};"],desc:"ESNext fundamentals, async/await pipelines, closures & event loop mastery."},html5:{categoryKey:"frontend",name:"HTML5.html",icon:"\u{1F310}",category:"Frontend \u2022 Semantic Markup & A11y",lines:['<span class="com">// Context: Semantic landmark architecture, native &lt;dialog&gt; & WCAG AAA accessibility.</span>',"",'&lt;<span class="type">main</span> <span class="prop">id</span>=<span class="str">"main-content"</span> <span class="prop">tabindex</span>=<span class="str">"-1"</span>&gt;','  &lt;<span class="type">section</span> <span class="prop">aria-labelledby</span>=<span class="str">"experience-heading"</span>&gt;','    &lt;<span class="type">h2</span> <span class="prop">id</span>=<span class="str">"experience-heading"</span>&gt;Career Studio&lt;/<span class="type">h2</span>&gt;','    &lt;<span class="type">dialog</span> <span class="prop">id</span>=<span class="str">"project-dialog"</span> <span class="prop">aria-modal</span>=<span class="str">"true"</span>&gt;&lt;/<span class="type">dialog</span>&gt;','  &lt;/<span class="type">section</span>&gt;','&lt;/<span class="type">main</span>&gt;'],desc:"Semantic landmark architecture, native <dialog> & WCAG AAA accessibility."},css3:{categoryKey:"frontend",name:"CSS3.css",icon:"\u{1F3A8}",category:"Frontend \u2022 Modern Layouts & Animation",lines:['<span class="com">// Context: Modern CSS Grid, subgrid, container queries & hardware-accelerated motion.</span>',"",'<span class="fn">.modern-grid</span> {','  <span class="prop">display</span>: grid;','  <span class="prop">grid-template-columns</span>: repeat(auto-fit, minmax(300px, 1fr));','  <span class="prop">gap</span>: clamp(1rem, 3vw, 2.5rem);','  <span class="prop">contain</span>: layout style paint;',"}"],desc:"Modern CSS Grid, subgrid, container queries & hardware-accelerated motion."},nodejs:{categoryKey:"backend",name:"Node.mjs",icon:"\u{1F7E2}",category:"Backend \u2022 Runtime & APIs",lines:['<span class="com">// Context: High-throughput asynchronous backend runtimes, microservices & build tooling.</span>',"",`<span class="kw">import</span> { <span class="fn">createServer</span> } <span class="kw">from</span> <span class="str">'node:http'</span>;`,`<span class="kw">import</span> { <span class="fn">readFile</span> } <span class="kw">from</span> <span class="str">'node:fs/promises'</span>;`,"",'<span class="kw">const</span> server = <span class="fn">createServer</span>(<span class="kw">async</span> (req, res) => {',`  <span class="kw">const</span> data = <span class="kw">await</span> <span class="fn">readFile</span>(<span class="str">'./stats.json'</span>, <span class="str">'utf-8'</span>);`,`  res.<span class="fn">writeHead</span>(200, { <span class="str">'Content-Type'</span>: <span class="str">'application/json'</span> });`,'  res.<span class="fn">end</span>(data);',"});"],desc:"High-throughput asynchronous backend runtimes, microservices & build tooling."},express:{categoryKey:"backend",name:"Express.js",icon:"\u26A1",category:"Backend \u2022 Web Framework",lines:['<span class="com">// Context: Modular RESTful routing, authentication middleware, CORS & input validation.</span>',"",`<span class="kw">import</span> express <span class="kw">from</span> <span class="str">'express'</span>;`,'<span class="kw">const</span> app = <span class="fn">express</span>();',"",'app.<span class="fn">use</span>(express.<span class="fn">json</span>());',`app.<span class="fn">get</span>(<span class="str">'/api/projects'</span>, <span class="kw">async</span> (req, res) => {`,`  <span class="kw">const</span> items = <span class="kw">await</span> db.<span class="fn">query</span>(<span class="str">'SELECT * FROM projects WHERE active = true'</span>);`,'  res.<span class="fn">status</span>(200).<span class="fn">json</span>(items.rows);',"});"],desc:"Modular RESTful routing, authentication middleware, CORS & input validation."},postgresql:{categoryKey:"backend",name:"PostgreSQL.sql",icon:"\u{1F418}",category:"Backend \u2022 Relational Database",lines:['<span class="com">-- Context: Relational schema design, ACID transactions, complex joins & indexing strategies.</span>',"",'<span class="kw">CREATE TABLE</span> <span class="fn">projects</span> (','  <span class="prop">id</span> <span class="type">UUID PRIMARY KEY DEFAULT gen_random_uuid()</span>,','  <span class="prop">title</span> <span class="type">VARCHAR(100) NOT NULL</span>,','  <span class="prop">tech_stack</span> <span class="type">TEXT[] NOT NULL</span>,','  <span class="prop">created_at</span> <span class="type">TIMESTAMPTZ DEFAULT NOW()</span>',");"],desc:"Relational schema design, ACID transactions, complex joins & indexing strategies."},mongodb:{categoryKey:"backend",name:"MongoDB.ts",icon:"\u{1F343}",category:"Backend \u2022 Document Database",lines:['<span class="com">// Context: Document data modeling with Mongoose, aggregation pipelines & fast lookups.</span>',"",`<span class="kw">import</span> mongoose, { <span class="type">Schema</span> } <span class="kw">from</span> <span class="str">'mongoose'</span>;`,"",'<span class="kw">const</span> ProjectSchema = <span class="kw">new</span> <span class="type">Schema</span>({','  <span class="prop">slug</span>: { <span class="prop">type</span>: <span class="type">String</span>, <span class="prop">required</span>: <span class="kw">true</span>, <span class="prop">unique</span>: <span class="kw">true</span> },','  <span class="prop">metrics</span>: { <span class="prop">views</span>: <span class="type">Number</span>, <span class="prop">likes</span>: <span class="type">Number</span> },',"});",`<span class="kw">export const</span> Project = mongoose.<span class="fn">model</span>(<span class="str">'Project'</span>, ProjectSchema);`],desc:"Document data modeling with Mongoose, aggregation pipelines & fast lookups."},python:{categoryKey:"backend",name:"Python.py",icon:"\u{1F40D}",category:"Backend / Scripting \u2022 Data & Automation",lines:['<span class="com"># Context: Data processing utilities, automated scripting & algorithmic problem solving.</span>',"",'<span class="kw">import</span> json','<span class="kw">from</span> pathlib <span class="kw">import</span> Path',"",'<span class="kw">def</span> <span class="fn">compile_metrics</span>(raw_log: str) -> dict:',"    entries = json.loads(Path(raw_log).read_text())",'    <span class="kw">return</span> {<span class="str">"total_commits"</span>: len(entries), <span class="str">"status"</span>: <span class="str">"verified"</span>}'],desc:"Data processing utilities, automated scripting & algorithmic problem solving."},git:{categoryKey:"tools",name:"Git.config",icon:"\u{1F419}",category:"Tools & VCS \u2022 Version Control & CI/CD",lines:['<span class="com"># Context: Feature branch workflows, rebasing, pull requests & CI/CD pipeline automation.</span>',"","$ git checkout -b feat/skills-studio-interactive",'$ git commit -m <span class="str">"feat(skills): implement 24-file IDE studio"</span>',"$ git push origin feat/skills-studio-interactive",'<span class="com"># Auto-triggers GitHub Actions CI/CD test runner</span>'],desc:"Feature branch workflows, rebasing, pull requests & CI/CD pipeline automation."},npm:{categoryKey:"tools",name:"package.json",icon:"\u{1F4E6}",category:"Tools & VCS \u2022 Package Management",lines:['<span class="com">// Context: Package dependency management, automated build pipelines & security audits.</span>',"","{",'  <span class="prop">"scripts"</span>: {','    <span class="prop">"dev"</span>: <span class="str">"run-p watch:css watch:js"</span>,','    <span class="prop">"build"</span>: <span class="str">"npm run build:css && npm run build:js"</span>',"  },",'  <span class="prop">"devDependencies"</span>: { <span class="prop">"sass"</span>: <span class="str">"^1.93.0"</span>, <span class="prop">"esbuild"</span>: <span class="str">"^0.25.0"</span> }',"}"],desc:"Package dependency management, automated build pipelines & security audits."},postman:{categoryKey:"tools",name:"Postman.json",icon:"\u{1F680}",category:"Tools & VCS \u2022 API Testing & Verification",lines:['<span class="com">// Context: Automated API contract assertions, mock servers & endpoint verification.</span>',"",'pm.test(<span class="str">"Status is 200 & Response is Valid"</span>, <span class="kw">function</span> () {',"    pm.response.to.have.status(200);",'    <span class="kw">const</span> json = pm.response.json();','    pm.expect(json).to.be.an(<span class="str">"array"</span>);',"});"],desc:"Automated API contract assertions, mock servers & endpoint verification."},vscode:{categoryKey:"tools",name:"VSCode.json",icon:"\u{1F4BB}",category:"Tools & VCS \u2022 Development Environment",lines:['<span class="com">// Context: Optimized engineering environment, ESLint/Prettier automation & debugging.</span>',"","{",'  <span class="prop">"editor.formatOnSave"</span>: <span class="kw">true</span>,','  <span class="prop">"editor.defaultFormatter"</span>: <span class="str">"esbenp.prettier-vscode"</span>,','  <span class="prop">"editor.codeActionsOnSave"</span>: { <span class="prop">"source.fixAll.eslint"</span>: <span class="str">"explicit"</span> }',"}"],desc:"Optimized engineering environment, ESLint/Prettier automation & debugging."},trello:{categoryKey:"tools",name:"Trello.board",icon:"\u{1F4CB}",category:"Tools & VCS \u2022 Agile & Project Planning",lines:['<span class="com"># Context: Agile project management, user stories, Kanban boards & sprint planning.</span>',"","[x] Phase 1: Architecture & Design System Tokens","[x] Phase 2: Interactive Skills & Experience Studio","[ ] Phase 3: Project Dialog Accessibility & WCAG AAA Audit"],desc:"Agile project management, user stories, Kanban boards & sprint planning."},angular:{categoryKey:"leveling",name:"Angular.ts",icon:"\u{1F170}\uFE0F",category:"Currently Leveling Up \u2022 Enterprise Framework",lines:['<span class="com">// Context: Angular 17+ Signals reactivity, standalone components & enterprise patterns.</span>',"",`<span class="kw">import</span> { <span class="type">Component</span>, <span class="type">signal</span> } <span class="kw">from</span> <span class="str">'@angular/core'</span>;`,"",'<span class="kw">@Component</span>({ <span class="prop">selector</span>: <span class="str">\'app-signal-demo\'</span>, <span class="prop">template</span>: <span class="str">`&lt;p&gt;{{ count() }}&lt;/p&gt;`</span> })','<span class="kw">export class</span> <span class="fn">SignalDemoComponent</span> {','  count = <span class="fn">signal</span>(0);',"}"],desc:"Angular 17+ Signals reactivity, standalone components & enterprise patterns."},reactnative:{categoryKey:"leveling",name:"ReactNative.tsx",icon:"\u{1F4F1}",category:"Currently Leveling Up \u2022 Cross-Platform Mobile",lines:['<span class="com">// Context: Cross-platform iOS/Android development, native bridges & mobile gesture UX.</span>',"",`<span class="kw">import</span> { <span class="type">View</span>, <span class="type">Text</span>, <span class="type">StyleSheet</span> } <span class="kw">from</span> <span class="str">'react-native'</span>;`,"",'<span class="kw">export const</span> <span class="fn">MobileCard</span> = ({ <span class="prop">title</span> }) => (','  &lt;<span class="type">View</span> <span class="prop">style</span>={styles.card}&gt;','    &lt;<span class="type">Text</span> <span class="prop">style</span>={styles.text}&gt;{title}&lt;/<span class="type">Text</span>&gt;','  &lt;/<span class="type">View</span>&gt;',");"],desc:"Cross-platform iOS/Android development, native bridges & mobile gesture UX."},java:{categoryKey:"leveling",name:"Java.java",icon:"\u2615",category:"Currently Leveling Up \u2022 Computer Science Core",lines:['<span class="com">// Context: Core computer science fundamentals, data structures, Big-O & OOP at WGU.</span>',"",'<span class="kw">public class</span> <span class="type">BinarySearchTree</span>&lt;<span class="type">T</span> <span class="kw">extends</span> <span class="type">Comparable</span>&lt;<span class="type">T</span>&gt;&gt; {','    <span class="kw">private</span> <span class="type">Node</span>&lt;<span class="type">T</span>&gt; root;','    <span class="kw">public boolean</span> <span class="fn">contains</span>(<span class="type">T</span> value) {','        <span class="kw">return</span> <span class="fn">searchRec</span>(root, value);',"    }","}"],desc:"Core computer science fundamentals, data structures, Big-O & OOP at WGU."},chakraui:{categoryKey:"leveling",name:"ChakraUI.tsx",icon:"\u26A1",category:"Currently Leveling Up \u2022 Accessible Components",lines:['<span class="com">// Context: Accessible component primitives, design system tokens & ARIA compliancy.</span>',"",'&lt;<span class="type">Box</span> <span class="prop">p</span>={6} <span class="prop">bg</span>=<span class="str">"brand.900"</span> <span class="prop">borderRadius</span>=<span class="str">"xl"</span> <span class="prop">border</span>=<span class="str">"1px"</span> <span class="prop">borderColor</span>=<span class="str">"brand.700"</span>&gt;','  &lt;<span class="type">Heading</span> <span class="prop">size</span>=<span class="str">"md"</span> <span class="prop">color</span>=<span class="str">"white"</span>&gt;Accessible Component&lt;/<span class="type">Heading</span>&gt;','&lt;/<span class="type">Box</span>&gt;'],desc:"Accessible component primitives, design system tokens & ARIA compliancy."},threejs:{categoryKey:"leveling",name:"ThreeJS.ts",icon:"\u{1F9CA}",category:"Currently Leveling Up \u2022 3D WebGL",lines:['<span class="com">// Context: Interactive 3D WebGL graphics, custom shaders & hardware-accelerated canvases.</span>',"",`<span class="kw">import</span> * <span class="kw">as</span> THREE <span class="kw">from</span> <span class="str">'three'</span>;`,"",'<span class="kw">const</span> scene = <span class="kw">new</span> THREE.<span class="fn">Scene</span>();','<span class="kw">const</span> camera = <span class="kw">new</span> THREE.<span class="fn">PerspectiveCamera</span>(75, width / height, 0.1, 1000);','<span class="kw">const</span> renderer = <span class="kw">new</span> THREE.<span class="fn">WebGLRenderer</span>({ <span class="prop">antialias</span>: <span class="kw">true</span>, <span class="prop">alpha</span>: <span class="kw">true</span> });'],desc:"Interactive 3D WebGL graphics, custom shaders & hardware-accelerated canvases."},overview:{categoryKey:"overview",name:"overview.md",icon:"\u{1F4C4}",category:"Full-Stack Developer \u2022 Career Overview",isOverview:!0}},a=`
<article class="overview-article">
  <!-- Document Header -->
  <header class="overview-doc-header">
    <h1 class="overview-h1">
      <span>Matthew McGrath</span>
      <span class="arch-tag__exp" style="font-size: 0.85rem; font-weight: 600;">// Full-Stack Engineer</span>
    </h1>
    <p class="overview-lead">
      Full-stack developer specializing in performant React &amp; Next.js architecture, robust design systems, accessible UI engineering, and scalable TypeScript backends.
    </p>
    <div class="overview-quick-stats">
      <span class="quick-stat-badge">\u{1F393} <strong>B.S. Computer Science</strong></span>
      <span class="quick-stat-badge">\u{1F4CD} <strong>Open to Full-Time &amp; Contracts</strong></span>
    </div>
  </header>

  <!-- Technical Competencies Matrix -->
  <section class="overview-section">
    <div class="overview-h2-wrap">
      <h2 class="overview-h2">\u26A1 Technical Stack</h2>
      <span class="overview-h2-sub">Click any skill to inspect code \u2197</span>
    </div>

    <table class="skills-table-spec">
      <tbody>
        <tr>
          <td class="col-domain"><strong>Frontend Core</strong></td>
          <td>
            <div class="arch-tags-flow">
              <button class="arch-tag" data-skill="react"><span>\u269B\uFE0F React</span><span class="arch-tag__exp">10y</span><span class="arch-tag__link">\u2197</span></button>
              <button class="arch-tag" data-skill="nextjs"><span>\u25B2 Next.js</span><span class="arch-tag__exp">6y</span><span class="arch-tag__link">\u2197</span></button>
              <button class="arch-tag" data-skill="typescript"><span>\u{1F537} TypeScript</span><span class="arch-tag__exp">8y</span><span class="arch-tag__link">\u2197</span></button>
              <button class="arch-tag" data-skill="javascript"><span>\u{1F7E8} JavaScript</span><span class="arch-tag__exp">15y</span><span class="arch-tag__link">\u2197</span></button>
              <button class="arch-tag" data-skill="html5"><span>\u{1F310} HTML5</span><span class="arch-tag__exp">15y</span><span class="arch-tag__link">\u2197</span></button>
              <button class="arch-tag" data-skill="css3"><span>\u{1F3A8} CSS3</span><span class="arch-tag__exp">15y</span><span class="arch-tag__link">\u2197</span></button>
            </div>
          </td>
        </tr>
        <tr>
          <td class="col-domain"><strong>Styling &amp; Design Systems</strong></td>
          <td>
            <div class="arch-tags-flow">
              <button class="arch-tag" data-skill="sass"><span>\u{1F3A8} Sass / SCSS</span><span class="arch-tag__exp">10y</span><span class="arch-tag__link">\u2197</span></button>
              <button class="arch-tag" data-skill="tailwind"><span>\u{1F30A} Tailwind CSS</span><span class="arch-tag__exp">5y</span><span class="arch-tag__link">\u2197</span></button>
              <button class="arch-tag" data-skill="storybook"><span>\u{1F4D5} Storybook</span><span class="arch-tag__exp">6y</span><span class="arch-tag__link">\u2197</span></button>
              <button class="arch-tag" data-skill="radix"><span>\u{1F9F1} Radix Primitives</span><span class="arch-tag__exp">4y</span><span class="arch-tag__link">\u2197</span></button>
            </div>
          </td>
        </tr>
        <tr>
          <td class="col-domain"><strong>Backend &amp; Databases</strong></td>
          <td>
            <div class="arch-tags-flow">
              <button class="arch-tag" data-skill="nodejs"><span>\u{1F7E2} Node.js</span><span class="arch-tag__exp">9y</span><span class="arch-tag__link">\u2197</span></button>
              <button class="arch-tag" data-skill="express"><span>\u{1F682} Express</span><span class="arch-tag__exp">8y</span><span class="arch-tag__link">\u2197</span></button>
              <button class="arch-tag" data-skill="postgresql"><span>\u{1F418} PostgreSQL</span><span class="arch-tag__exp">7y</span><span class="arch-tag__link">\u2197</span></button>
              <button class="arch-tag" data-skill="prisma"><span>\u25EC Prisma ORM</span><span class="arch-tag__exp">4y</span><span class="arch-tag__link">\u2197</span></button>
              <button class="arch-tag" data-skill="rest"><span>\u{1F50C} REST APIs</span><span class="arch-tag__exp">12y</span><span class="arch-tag__link">\u2197</span></button>
              <button class="arch-tag" data-skill="graphql"><span>\u25C8 GraphQL</span><span class="arch-tag__exp">5y</span><span class="arch-tag__link">\u2197</span></button>
            </div>
          </td>
        </tr>
        <tr>
          <td class="col-domain"><strong>Testing &amp; Quality</strong></td>
          <td>
            <div class="arch-tags-flow">
              <button class="arch-tag" data-skill="jest"><span>\u{1F0CF} Jest</span><span class="arch-tag__exp">7y</span><span class="arch-tag__link">\u2197</span></button>
              <button class="arch-tag" data-skill="playwright"><span>\u{1F3AD} Playwright</span><span class="arch-tag__exp">3y</span><span class="arch-tag__link">\u2197</span></button>
              <button class="arch-tag" data-skill="rtl"><span>\u{1F419} Testing Library</span><span class="arch-tag__exp">6y</span><span class="arch-tag__link">\u2197</span></button>
            </div>
          </td>
        </tr>
        <tr>
          <td class="col-domain"><strong>DevOps &amp; Tooling</strong></td>
          <td>
            <div class="arch-tags-flow">
              <button class="arch-tag" data-skill="git"><span>\u{1F33F} Git / GitHub</span><span class="arch-tag__exp">12y</span><span class="arch-tag__link">\u2197</span></button>
              <button class="arch-tag" data-skill="docker"><span>\u{1F433} Docker</span><span class="arch-tag__exp">5y</span><span class="arch-tag__link">\u2197</span></button>
              <button class="arch-tag" data-skill="vite"><span>\u26A1 Vite &amp; Webpack</span><span class="arch-tag__exp">8y</span><span class="arch-tag__link">\u2197</span></button>
              <button class="arch-tag" data-skill="cicd"><span>\u{1F504} CI / CD Actions</span><span class="arch-tag__exp">6y</span><span class="arch-tag__link">\u2197</span></button>
            </div>
          </td>
        </tr>
        <tr>
          <td class="col-domain"><strong>Currently Exploring</strong></td>
          <td>
            <div class="arch-tags-flow">
              <button class="arch-tag" data-skill="threejs"><span>\u{1F9CA} Three.js &amp; WebGL</span><span class="arch-tag__exp">Active</span><span class="arch-tag__link">\u2197</span></button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </section>

  <!-- Integrated Experience & Education Timeline -->
  <section class="overview-section">
    <div class="overview-h2-wrap">
      <h2 class="overview-h2">\u{1F4BC} Experience &amp; Education Journey</h2>
      <span class="overview-h2-sub">Full Chronological Timeline</span>
    </div>

    <div class="overview-timeline-stream">
      <div class="overview-timeline-item overview-timeline-item--current">
        <div class="overview-timeline-header">
          <span class="overview-timeline-role">Lead / Senior Frontend Engineer <span class="overview-timeline-org">@ High-Growth SaaS</span></span>
          <span class="overview-timeline-date overview-timeline-date--current">2022 \u2014 Present</span>
        </div>
        <p class="overview-timeline-desc">Architecting Next.js enterprise web applications, high-performance design systems, and resilient cloud service integrations.</p>
        <div class="overview-timeline-tags">
          <span class="overview-timeline-tag">React 19</span>
          <span class="overview-timeline-tag">Next.js App Router</span>
          <span class="overview-timeline-tag">TypeScript</span>
          <span class="overview-timeline-tag">SCSS Design Tokens</span>
        </div>
      </div>

      <div class="overview-timeline-item">
        <div class="overview-timeline-header">
          <span class="overview-timeline-role">Senior Full-Stack Developer <span class="overview-timeline-org">@ Digital Product Agency</span></span>
          <span class="overview-timeline-date">2018 \u2014 2022</span>
        </div>
        <p class="overview-timeline-desc">Engineered client web applications, headless e-commerce architectures, RESTful API microservices, and database models.</p>
        <div class="overview-timeline-tags">
          <span class="overview-timeline-tag">TypeScript</span>
          <span class="overview-timeline-tag">Node.js</span>
          <span class="overview-timeline-tag">PostgreSQL</span>
          <span class="overview-timeline-tag">GraphQL</span>
        </div>
      </div>

      <div class="overview-timeline-item">
        <div class="overview-timeline-header">
          <span class="overview-timeline-role">Frontend UI/UX Engineer <span class="overview-timeline-org">@ Tech Studio</span></span>
          <span class="overview-timeline-date">2014 \u2014 2018</span>
        </div>
        <p class="overview-timeline-desc">Built modular component libraries, responsive web portals, automated testing suites, and cross-browser optimized interfaces.</p>
        <div class="overview-timeline-tags">
          <span class="overview-timeline-tag">JavaScript ES6</span>
          <span class="overview-timeline-tag">React</span>
          <span class="overview-timeline-tag">Sass 7-1</span>
          <span class="overview-timeline-tag">Jest</span>
        </div>
      </div>

      <div class="overview-timeline-item overview-timeline-item--edu">
        <div class="overview-timeline-header">
          <span class="overview-timeline-role">B.S. in Computer Science <span class="overview-timeline-org">@ University</span></span>
          <span class="overview-timeline-date">2010 \u2014 2014</span>
        </div>
        <p class="overview-timeline-desc">Graduated with honors. Rigorous focus on algorithms, data structures, software engineering principles, and distributed computing.</p>
        <div class="overview-timeline-tags">
          <span class="overview-timeline-tag">Algorithms</span>
          <span class="overview-timeline-tag">Data Structures</span>
          <span class="overview-timeline-tag">Software Architecture</span>
        </div>
      </div>
    </div>
  </section>
</article>
`;export{s as allSkills,a as overviewTemplate};
