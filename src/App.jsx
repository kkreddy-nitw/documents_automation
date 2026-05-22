import { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Circle,
  FolderSearch,
  LoaderCircle,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

const frameworkOptions = [
  {
    id: 'aspice',
    title: 'ASPICE Framework',
    subtitle: 'SWE.2 to SWE.5 compliance workflow'
  },
  {
    id: 'fusa',
    title: 'FuSa (Functional Safety)',
    subtitle: 'HSI and FMEA documentation tracks'
  }
];

const optionsByFramework = {
  aspice: [
    {
      id: 'swe2',
      title: 'SWE.2',
      description: 'Software Architectural Design'
    },
    {
      id: 'swe3',
      title: 'SWE.3',
      description: 'Software Detailed Design'
    },
    {
      id: 'swe4',
      title: 'SWE.4 Specifications',
      description: 'Unit Verification'
    },
    {
      id: 'swe5',
      title: 'SWE.5 Specifications',
      description: 'Integration Verification'
    }
  ],
  fusa: [
    {
      id: 'hsi',
      title: 'HSI',
      description: 'Hardware-Software Interface'
    },
    {
      id: 'fmea',
      title: 'FMEA',
      description: 'Failure Mode & Effects Analysis'
    }
  ]
};

const phases = ['Repository Scan', 'Dependency Mapping', 'Compliance Structuring', 'Markdown Packaging'];

function App() {
  const [repoPath, setRepoPath] = useState('/repos/ufs-automotive-fw');
  const [framework, setFramework] = useState('aspice');
  const [selectedOptions, setSelectedOptions] = useState(['swe2']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(-1);

  const currentOptions = optionsByFramework[framework];

  const previewContent = useMemo(() => {
    const selected = currentOptions.filter((item) => selectedOptions.includes(item.id));
    const selectedTitles = selected.map((item) => item.title).join(', ') || 'No options selected';

    return `# AutoDoc-UFS Output\n\nRepository: ${repoPath}\nFramework: ${framework.toUpperCase()}\nSections: ${selectedTitles}\n\n## Generated Structure\n- Executive Summary\n- Traceability Matrix\n- Compliance Evidence\n- Verification Logs\n\n## Notes\nThis is a mock preview of generated compliance markdown.`;
  }, [currentOptions, framework, repoPath, selectedOptions]);

  const toggleOption = (id) => {
    setSelectedOptions((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const switchFramework = (nextFramework) => {
    setFramework(nextFramework);
    setSelectedOptions(optionsByFramework[nextFramework].slice(0, 1).map((option) => option.id));
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setPhaseIndex(0);

    phases.forEach((_, index) => {
      setTimeout(() => {
        setPhaseIndex(index);
        if (index === phases.length - 1) {
          setTimeout(() => {
            setIsGenerating(false);
            setPhaseIndex(-1);
          }, 600);
        }
      }, index * 850);
    });
  };

  return (
    <div className="min-h-screen bg-page">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 md:px-8">
          <div className="text-xl font-extrabold tracking-tight text-slate-900">AutoDoc-UFS</div>
          <div className="relative mx-auto hidden w-full max-w-xl items-center sm:flex">
            <FolderSearch className="pointer-events-none absolute left-3 h-4 w-4 text-slate-400" />
            <input
              value={repoPath}
              onChange={(e) => setRepoPath(e.target.value)}
              className="w-full rounded-full border border-slate-200 bg-slate-100 py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none ring-accent transition focus:ring-2"
              placeholder="Enter Repository Path"
            />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600 sm:inline-flex">
              <ShieldCheck className="h-3.5 w-3.5" /> System Healthy
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">SS</div>
          </div>
        </div>
        <div className="px-4 pb-3 sm:hidden">
          <div className="relative mx-auto flex w-full items-center">
            <FolderSearch className="pointer-events-none absolute left-3 h-4 w-4 text-slate-400" />
            <input
              value={repoPath}
              onChange={(e) => setRepoPath(e.target.value)}
              className="w-full rounded-full border border-slate-200 bg-slate-100 py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none ring-accent transition focus:ring-2"
              placeholder="Enter Repository Path"
            />
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:grid-cols-[280px_1fr] md:px-8">
        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <p className="text-xs font-extrabold tracking-[0.14em] text-slate-500">SELECT COMPLIANCE FORMAT</p>
          <div className="mt-4 space-y-3">
            {frameworkOptions.map((item) => {
              const active = framework === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => switchFramework(item.id)}
                  className={`w-full rounded-xl border p-4 text-left transition ${
                    active
                      ? 'border-accent bg-accentSoft shadow-soft'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <p className="text-sm font-bold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-xs text-slate-600">{item.subtitle}</p>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
            <h2 className="text-lg font-extrabold text-slate-900">Documentation Options</h2>
            <p className="mt-1 text-sm text-slate-500">Choose deliverables for {framework.toUpperCase()} generation.</p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {currentOptions.map((item) => {
                const checked = selectedOptions.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleOption(item.id)}
                    className={`rounded-xl border p-4 text-left transition ${
                      checked
                        ? 'border-accent bg-accentSoft/70 ring-1 ring-accent'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{item.title}</p>
                        <p className="mt-1 text-xs text-slate-600">{item.description}</p>
                      </div>
                      {checked ? (
                        <CheckCircle2 className="h-5 w-5 text-accent" />
                      ) : (
                        <Circle className="h-5 w-5 text-slate-400" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <button
                onClick={handleGenerate}
                disabled={isGenerating || selectedOptions.length === 0}
                className="w-full rounded-xl bg-accent px-5 py-3 text-sm font-extrabold tracking-wide text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                GENERATE DOCUMENTATION
              </button>

              {isGenerating && (
                <div className="mt-4 flex items-center gap-3 rounded-lg bg-white p-3">
                  <LoaderCircle className="h-5 w-5 animate-spin text-accent" />
                  <div>
                    <p className="text-xs font-semibold text-slate-800">Processing Checkout-Style Workflow</p>
                    <p className="text-xs text-slate-500">
                      {phaseIndex >= 0 ? phases[phaseIndex] : 'Initializing...'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700">
              <Sparkles className="h-3.5 w-3.5" /> Document Preview
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <pre className="overflow-x-auto whitespace-pre-wrap text-xs leading-6 text-slate-700">{previewContent}</pre>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
