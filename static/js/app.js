const { useEffect, useMemo, useState } = React;

const ASPICE = [
  'SWE.2 (Software Architectural Design)',
  'SWE.3 (Software Detailed Design & Unit Construction)',
  'SWE.4 Specifications (Software Unit Verification)',
  'SWE.5 Specifications (Software Integration Verification)',
];
const FUSA = ['HSI (Hardware-Software Interface)', 'FMEA (Failure Mode and Effects Analysis)'];

function Icon({ name, className = 'h-4 w-4' }) {
  return <i data-lucide={name} className={className}></i>;
}

function Sidebar() {
  const items = ['Dashboard', 'Generation Runs', 'Artifacts', 'Standards', 'Settings'];
  return <aside className="hidden lg:flex w-72 border-r border-slate-800 bg-slate-900/60 p-6 flex-col">
    <div>
      <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">Samsung Semiconductor</p>
      <h1 className="text-2xl font-bold mt-3">AutoDoc-UFS</h1>
      <p className="text-sm text-slate-400 mt-2">ASPICE + FuSa document automation</p>
    </div>
    <nav className="mt-8 space-y-2">
      {items.map((item, idx) => <button key={item} className={`w-full px-3 py-2 rounded-lg text-left text-sm transition border ${idx===0 ? 'border-cyan-500/40 text-cyan-300 bg-cyan-500/10':'border-transparent text-slate-300 hover:bg-slate-800/70 hover:text-slate-100'}`}>{item}</button>)}
    </nav>
    <div className="mt-auto rounded-xl border border-slate-700/80 bg-slate-900 p-4 text-xs font-mono text-cyan-300">env: prod/internal/ufs</div>
  </aside>
}

function FrameworkSwitch({ framework, setFramework }) {
  return <div className="inline-flex rounded-xl p-1 border border-slate-700 bg-slate-800/80">
    {['ASPICE', 'FuSa'].map((f) => <button key={f} onClick={() => setFramework(f)} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${framework===f?'bg-cyan-500 text-slate-950':'text-slate-300 hover:text-white'}`}>
      {f === 'ASPICE' ? 'ASPICE Framework' : 'FuSa (Functional Safety)'}
    </button>)}
  </div>
}

function App() {
  const [sourcePath, setSourcePath] = useState('/workspace/ufs_automotive_firmware');
  const [framework, setFramework] = useState('ASPICE');
  const [selected, setSelected] = useState([]);
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState('Awaiting configuration');
  const [logs, setLogs] = useState(['[boot] AutoDoc-UFS runtime initialized.', '[ready] Select source and framework to start.']);
  const [activeTab, setActiveTab] = useState('preview');

  const options = framework === 'ASPICE' ? ASPICE : FUSA;
  useEffect(() => setSelected([]), [framework]);
  useEffect(() => lucide.createIcons(), [framework, selected, activeTab, busy, progress]);

  const canRun = sourcePath.trim() && selected.length && !busy;

  const markdown = useMemo(() => `# AutoDoc-UFS Compliance Report

- **Source**: `${sourcePath}`
- **Framework**: **${framework}**
- **Selected Scopes**: ${selected.length ? selected.join(', ') : 'N/A'}

## Generation Summary
The selected repository was analyzed to produce engineering evidence for compliance and safety reviews.

## Key Outputs
1. Architecture and interface trace matrix.
2. Requirement → implementation → verification linkage.
3. Review-ready package with markdown + export metadata.
`, [sourcePath, framework, selected]);

  const toggle = (item) => setSelected((prev) => prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]);

  async function runGeneration() {
    if (!canRun) return;
    setBusy(true);
    setProgress(0);
    setActiveTab('console');
    const resp = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sourcePath, framework, modules: selected }),
    });
    const data = await resp.json();
    if (!resp.ok) {
      setLogs((v) => [...v, `[error] ${data.error || 'Unknown API error'}`]);
      setBusy(false);
      return;
    }

    setLogs((v) => [...v, `[queue] ${data.runId} accepted at ${data.acceptedAt}`, `[scope] ${data.modules.join(' | ')}`]);
    const steps = data.pipeline;
    for (let i = 0; i < steps.length; i += 1) {
      await new Promise((r) => setTimeout(r, 650));
      const pct = Math.round(((i + 1) / steps.length) * 100);
      setProgress(pct);
      setStage(steps[i]);
      setLogs((v) => [...v, `[${String(pct).padStart(3, ' ')}%] ${steps[i]}`]);
    }
    setLogs((v) => [...v, '[done] Documentation package generated successfully.']);
    setActiveTab('preview');
    setBusy(false);
  }

  return <div className="min-h-screen flex">
    <Sidebar />
    <main className="flex-1 p-6 lg:p-8 space-y-6">
      <header className="rounded-2xl border border-slate-800 bg-slate-900/70 shadow-glass p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">Pipeline Configuration</p>
            <h2 className="text-2xl font-semibold mt-2">Generate ASPICE / FuSa Documentation</h2>
          </div>
          <button onClick={runGeneration} disabled={!canRun} className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 disabled:bg-slate-700 disabled:text-slate-300 hover:bg-cyan-400 active:scale-[0.99] transition">
            <Icon name="file-cog" className="h-4 w-4" />
            {busy ? 'Generating...' : 'Generate Documentation'}
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-5 mt-6">
          <section className="rounded-xl border border-slate-700 bg-slate-900 p-4">
            <p className="text-sm font-medium">1) Source Selection</p>
            <div className="mt-3 rounded-xl border border-dashed border-slate-600 bg-slate-800/50 p-4 hover:border-cyan-500 transition">
              <label className="text-xs text-slate-400">UFS Firmware Source Code Repository/Path</label>
              <div className="relative mt-2">
                <Icon name="folder-git-2" className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                <input value={sourcePath} onChange={(e) => setSourcePath(e.target.value)} className="w-full rounded-lg bg-slate-900 border border-slate-700 pl-10 pr-3 py-2 font-mono text-sm outline-none focus:ring-2 ring-cyan-500/40" />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-700 bg-slate-900 p-4">
            <p className="text-sm font-medium">2) Framework Selection</p>
            <div className="mt-3"><FrameworkSwitch framework={framework} setFramework={setFramework} /></div>
            <p className="text-xs text-slate-400 mt-4">3) Dynamic Sub-Selection</p>
            <div className="mt-2 grid gap-2">
              {options.map((op) => {
                const on = selected.includes(op);
                return <button key={op} onClick={() => toggle(op)} className={`rounded-lg border px-3 py-2 text-sm text-left transition ${on ? 'border-cyan-500 bg-cyan-500/10 text-cyan-200':'border-slate-700 bg-slate-800/60 text-slate-300 hover:bg-slate-800'}`}>{op}</button>;
              })}
            </div>
          </section>
        </div>

        <div className="mt-6">
          <div className="text-xs text-slate-400 flex justify-between mb-2"><span>{stage}</span><span>{progress}%</span></div>
          <div className="h-2 rounded-full bg-slate-800 overflow-hidden"><div style={{width: `${progress}%`}} className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all duration-500"></div></div>
        </div>
      </header>

      <section className="grid metric-grid gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4"><p className="text-xs text-slate-400">Repository Health</p><p className="text-xl font-semibold mt-1">92.4%</p></div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4"><p className="text-xs text-slate-400">Trace Links</p><p className="text-xl font-semibold mt-1">4,283</p></div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4"><p className="text-xs text-slate-400">Open Risks</p><p className="text-xl font-semibold mt-1">7</p></div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <div className="flex gap-2 mb-4">
          {['preview', 'console'].map((t) => <button key={t} onClick={() => setActiveTab(t)} className={`px-3 py-1.5 rounded-lg text-sm border transition ${activeTab===t?'border-cyan-500/50 bg-cyan-500/10 text-cyan-300':'border-slate-700 text-slate-300 hover:text-white'}`}>{t === 'preview' ? 'Markdown Preview' : 'Console'}</button>)}
        </div>

        {activeTab === 'console' ? <div className="h-80 rounded-xl border border-slate-700 bg-black/50 p-4 overflow-auto font-mono text-xs text-emerald-300 space-y-1">{logs.map((log, i) => <div key={`${i}-${log}`}>{log}</div>)}</div> : <pre className="h-80 rounded-xl border border-slate-700 bg-slate-950 p-4 overflow-auto font-mono text-xs leading-6 whitespace-pre-wrap">{markdown}</pre>}
      </section>
    </main>
  </div>
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
