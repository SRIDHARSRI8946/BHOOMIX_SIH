import React from 'react';
import { NavLink } from 'react-router-dom';
import { useUIStore } from '../../stores/uiStore';
import {
  LayoutDashboard,
  FileText,
  UploadCloud,
  GitCompare,
  ShieldCheck,
  MapPin,
  BarChart3,
  History,
  Sparkles,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { APP_NAME } from '../../lib/constants';

export const Sidebar: React.FC = () => {
  const { sidebarOpen } = useUIStore();

  const navGroups = [
    {
      title: "Core Platform",
      items: [
        { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
        { name: "Document Records", path: "/documents", icon: FileText },
        { name: "Upload Document", path: "/documents/upload", icon: UploadCloud },
      ]
    },
    {
      title: "AI Processing Pipeline",
      items: [
        { name: "AI Extraction (OCR)", path: "/digitization/extracted-data", icon: Sparkles },
        { name: "Verification Screen", path: "/verification", icon: GitCompare },
        { name: "Validation Engine", path: "/validation", icon: ShieldCheck },
      ]
    },
    {
      title: "Registry & Analytics",
      items: [
        { name: "Land Cadastral Maps", path: "/land-records", icon: MapPin },
        { name: "Analytics & Trends", path: "/analytics", icon: BarChart3 },
        { name: "Audit Trail Logs", path: "/audit", icon: History },
      ]
    }
  ];

  if (!sidebarOpen) {
    return null;
  }

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shrink-0 min-h-[calc(100vh-4rem)] transition-all duration-200">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
          <Layers className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-white text-lg tracking-tight flex items-center gap-1.5">
            {APP_NAME}
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-semibold px-1.5 py-0.5 rounded border border-emerald-500/30">SIH '24</span>
          </h1>
          <p className="text-[11px] text-slate-400 font-medium">Land Records AI Suite</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        {navGroups.map((group, idx) => (
          <div key={idx}>
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              {group.title}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all group",
                      isActive
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/30 font-semibold"
                        : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                    )
                  }
                >
                  <item.icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Info Box */}
      <div className="p-3 m-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>AI Models Active</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-tight">
          Multilingual OCR (Indic-OCR) & Geo-Boundary Graph Neural Net running.
        </p>
      </div>
    </aside>
  );
};
