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
    <div className="flex w-full justify-start md:justify-center bg-slate-50/80 p-1.5 text-slate-700 rounded-xl border border-slate-200 shadow-xs">
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
      className="relative flex h-fit gap-1.5 items-center z-50"
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
      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
        selected === tab
          ? "bg-white text-[#0b2545] font-bold shadow-xs border border-slate-200"
          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
      }`}
    >
      <span>{children}</span>
      <ChevronDown
        className={`w-3.5 h-3.5 transition-transform duration-200 ${
          selected === tab ? "rotate-180 text-emerald-600" : "text-slate-400"
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
      className="absolute left-0 top-[calc(100%_+_12px)] w-96 rounded-xl border border-slate-200 bg-white p-4 shadow-2xl z-50 text-xs text-slate-800"
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
      className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-tl border border-slate-200 bg-white"
    />
  );
};

const AIPipelineContent: React.FC = () => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-emerald-700 font-bold text-xs uppercase tracking-wider">
        <Sparkles className="w-4 h-4" /> AI Neural Processing Suite
      </div>

      <div className="grid grid-cols-1 gap-2">
        <Link
          to="/digitization/extracted-data"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors group"
        >
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-xs">Indic-OCR Extractor</h4>
            <p className="text-[11px] text-slate-500">Extract Tamil & English handwritten deeds</p>
          </div>
        </Link>

        <Link
          to="/verification"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors group"
        >
          <div className="p-2 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
            <FileCheck2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-xs">Discrepancy Checker</h4>
            <p className="text-[11px] text-slate-500">Citizen OCR vs Tamil Nadu Land DB</p>
          </div>
        </Link>

        <Link
          to="/validation"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors group"
        >
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-xs">Statutory Rule Validator</h4>
            <p className="text-[11px] text-slate-500">Tamil Nadu Land Reforms Act rules</p>
          </div>
        </Link>
      </div>

      <Link to="/documents/upload" className="block text-right pt-1">
        <button className="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold hover:underline">
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
      <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-[#0b2545] font-bold text-xs uppercase tracking-wider">
        <MapPin className="w-4 h-4 text-emerald-600" /> Tamil Nadu Land Registry
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <Link
          to="/documents"
          className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-colors border border-slate-200"
        >
          <FileText className="w-5 h-5 text-emerald-600 mb-1" />
          <span className="text-[11px] font-semibold">Patta / Chitta</span>
        </Link>

        <Link
          to="/documents"
          className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-colors border border-slate-200"
        >
          <Layers className="w-5 h-5 text-blue-600 mb-1" />
          <span className="text-[11px] font-semibold">Adangal</span>
        </Link>

        <Link
          to="/land-records"
          className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-colors border border-slate-200"
        >
          <MapPin className="w-5 h-5 text-purple-600 mb-1" />
          <span className="text-[11px] font-semibold">FMB GIS</span>
        </Link>
      </div>

      <Link to="/land-records" className="block text-right pt-1">
        <button className="inline-flex items-center gap-1 text-xs text-[#0b2545] font-semibold hover:underline">
          <span>View Reference Database</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </Link>
    </div>
  );
};

const AnalyticsAuditContent: React.FC = () => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-amber-700 font-bold text-xs uppercase tracking-wider">
        <BarChart3 className="w-4 h-4" /> State Intelligence & Audit
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Link
          to="/analytics"
          className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors block"
        >
          <BarChart3 className="w-5 h-5 text-amber-600 mb-1" />
          <h4 className="text-xs font-bold text-slate-900">38 Districts</h4>
          <p className="text-[10px] text-slate-500">Throughput & Accuracy</p>
        </Link>

        <Link
          to="/audit"
          className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors block"
        >
          <History className="w-5 h-5 text-emerald-600 mb-1" />
          <h4 className="text-xs font-bold text-slate-900">Audit Ledger</h4>
          <p className="text-[10px] text-slate-500">SHA-256 Security Logs</p>
        </Link>
      </div>

      <Link to="/audit" className="block text-right pt-1">
        <button className="inline-flex items-center gap-1 text-xs text-amber-700 font-semibold hover:underline">
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
    title: "Tamil Nadu Registry",
    Component: LandRegistryContent,
  },
  {
    title: "Analytics & Audit",
    Component: AnalyticsAuditContent,
  },
].map((n, idx) => ({ ...n, id: idx + 1 }));

export default ShiftingDropDown;
