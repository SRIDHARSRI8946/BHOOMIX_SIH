import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  FileText,
  MapPin,
  BarChart3,
  History,
  Layers,
  CheckCircle2,
  FileCheck2,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";

export const ShiftingDropDown: React.FC = () => {
  return (
    <div className="flex w-full justify-start md:justify-center bg-slate-900 p-3 text-slate-200 rounded-xl border border-slate-800 shadow-xl">
      <Tabs />
    </div>
  );
};

const Tabs: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [dir, setDir] = useState<"r" | "l" | null>(null);

  const handleSetSelected = (val: number | null) => {
    if (typeof selected === "number" && typeof val === "number") {
      setDir(selected > val ? "r" : "l");
    } else if (val === null) {
      setDir(null);
    }

    setSelected(val);
  };

  return (
    <div
      onMouseLeave={() => handleSetSelected(null)}
      className="relative flex h-fit gap-2 items-center z-50"
    >
      {TABS.map((t) => {
        return (
          <Tab
            key={t.id}
            selected={selected}
            handleSetSelected={handleSetSelected}
            tab={t.id}
          >
            {t.title}
          </Tab>
        );
      })}

      <AnimatePresence>
        {selected !== null && <Content dir={dir} selected={selected} />}
      </AnimatePresence>
    </div>
  );
};

interface TabProps {
  children: React.ReactNode;
  tab: number;
  handleSetSelected: (val: number | null) => void;
  selected: number | null;
}

const Tab: React.FC<TabProps> = ({ children, tab, handleSetSelected, selected }) => {
  return (
    <button
      id={`shift-tab-${tab}`}
      onMouseEnter={() => handleSetSelected(tab)}
      onClick={() => handleSetSelected(tab)}
      className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
        selected === tab
          ? "bg-slate-800 text-emerald-400 font-semibold shadow-xs"
          : "text-slate-400 hover:text-slate-100"
      }`}
    >
      <span>{children}</span>
      <ChevronDown
        className={`w-3.5 h-3.5 transition-transform duration-200 ${
          selected === tab ? "rotate-180 text-emerald-400" : "text-slate-400"
        }`}
      />
    </button>
  );
};

interface ContentProps {
  selected: number;
  dir: "r" | "l" | null;
}

const Content: React.FC<ContentProps> = ({ selected, dir }) => {
  return (
    <motion.div
      id="overlay-content"
      initial={{
        opacity: 0,
        y: 8,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: 8,
      }}
      className="absolute left-0 top-[calc(100%_+_12px)] w-96 rounded-xl border border-slate-700 bg-slate-900 p-4 shadow-2xl z-50 text-xs"
    >
      <Bridge />
      <Nub selected={selected} />

      {TABS.map((t) => {
        return (
          <div className="overflow-hidden" key={t.id}>
            {selected === t.id && (
              <motion.div
                initial={{
                  opacity: 0,
                  x: dir === "l" ? 100 : dir === "r" ? -100 : 0,
                }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <t.Component />
              </motion.div>
            )}
          </div>
        );
      })}
    </motion.div>
  );
};

const Bridge: React.FC = () => (
  <div className="absolute -top-[12px] left-0 right-0 h-[12px]" />
);

const Nub: React.FC<{ selected: number }> = ({ selected }) => {
  const [left, setLeft] = useState(0);

  useEffect(() => {
    moveNub();
  }, [selected]);

  const moveNub = () => {
    if (selected) {
      const hoveredTab = document.getElementById(`shift-tab-${selected}`);
      const overlayContent = document.getElementById("overlay-content");

      if (!hoveredTab || !overlayContent) return;

      const tabRect = hoveredTab.getBoundingClientRect();
      const { left: contentLeft } = overlayContent.getBoundingClientRect();

      const tabCenter = tabRect.left + tabRect.width / 2 - contentLeft;

      setLeft(tabCenter);
    }
  };

  return (
    <motion.span
      style={{
        clipPath: "polygon(0 0, 100% 0, 50% 50%, 0% 100%)",
      }}
      animate={{ left }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-tl border border-slate-700 bg-slate-900"
    />
  );
};

const AIPipelineContent: React.FC = () => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-emerald-400 font-bold text-xs uppercase tracking-wider">
        <Sparkles className="w-4 h-4" /> AI Neural Processing Suite
      </div>

      <div className="grid grid-cols-1 gap-2">
        <Link
          to="/digitization/extracted-data"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/80 transition-colors group"
        >
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg group-hover:bg-emerald-500 group-hover:text-white transition-colors">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-slate-100 text-xs">Indic-OCR Extractor</h4>
            <p className="text-[11px] text-slate-400">Extract Devanagari text & key metrics</p>
          </div>
        </Link>

        <Link
          to="/verification"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/80 transition-colors group"
        >
          <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg group-hover:bg-purple-500 group-hover:text-white transition-colors">
            <FileCheck2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-slate-100 text-xs">Discrepancy Checker</h4>
            <p className="text-[11px] text-slate-400">OCR Output vs Legacy Govt DB</p>
          </div>
        </Link>

        <Link
          to="/validation"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/80 transition-colors group"
        >
          <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg group-hover:bg-blue-500 group-hover:text-white transition-colors">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-slate-100 text-xs">Statutory Rule Validator</h4>
            <p className="text-[11px] text-slate-400">Land ceiling & encumbrance check</p>
          </div>
        </Link>
      </div>

      <Link to="/documents/upload" className="block text-right pt-1">
        <button className="inline-flex items-center gap-1 text-xs text-emerald-400 font-semibold hover:underline">
          <span>Upload Document</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </Link>
    </div>
  );
};

const LandRegistryContent: React.FC = () => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-blue-400 font-bold text-xs uppercase tracking-wider">
        <MapPin className="w-4 h-4" /> Land Parcel Registry
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <Link
          to="/documents"
          className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
        >
          <FileText className="w-5 h-5 text-emerald-400 mb-1" />
          <span className="text-[11px] font-semibold">7/12 Extract</span>
        </Link>

        <Link
          to="/documents"
          className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
        >
          <Layers className="w-5 h-5 text-blue-400 mb-1" />
          <span className="text-[11px] font-semibold">Ferfar Register</span>
        </Link>

        <Link
          to="/land-records"
          className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
        >
          <MapPin className="w-5 h-5 text-purple-400 mb-1" />
          <span className="text-[11px] font-semibold">GIS Bhudnaksha</span>
        </Link>
      </div>

      <Link to="/land-records" className="block text-right pt-1">
        <button className="inline-flex items-center gap-1 text-xs text-blue-400 font-semibold hover:underline">
          <span>View GIS Parcel Map</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </Link>
    </div>
  );
};

const AnalyticsAuditContent: React.FC = () => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-amber-400 font-bold text-xs uppercase tracking-wider">
        <BarChart3 className="w-4 h-4" /> State Intelligence & Audit
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Link
          to="/analytics"
          className="p-2.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors block"
        >
          <BarChart3 className="w-5 h-5 text-amber-400 mb-1" />
          <h4 className="text-xs font-bold text-slate-100">District Analytics</h4>
          <p className="text-[10px] text-slate-400">Throughput & AI Accuracy</p>
        </Link>

        <Link
          to="/audit"
          className="p-2.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors block"
        >
          <History className="w-5 h-5 text-emerald-400 mb-1" />
          <h4 className="text-xs font-bold text-slate-100">Audit Ledger</h4>
          <p className="text-[10px] text-slate-400">SHA-256 Security Logs</p>
        </Link>
      </div>

      <Link to="/audit" className="block text-right pt-1">
        <button className="inline-flex items-center gap-1 text-xs text-amber-400 font-semibold hover:underline">
          <span>Inspect Security Trail</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </Link>
    </div>
  );
};

const TABS = [
  {
    title: "AI Pipeline",
    Component: AIPipelineContent,
  },
  {
    title: "Land Registry",
    Component: LandRegistryContent,
  },
  {
    title: "Analytics & Audit",
    Component: AnalyticsAuditContent,
  },
].map((n, idx) => ({ ...n, id: idx + 1 }));

export default ShiftingDropDown;
