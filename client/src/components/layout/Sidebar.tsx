import React from 'react';
import { NavLink } from 'react-router-dom';
import { useUIStore } from '../../stores/uiStore';
import { useAuthStore } from '../../stores/authStore';
import {
  LayoutDashboard,
  FileText,
  UploadCloud,
  GitCompare,
  ShieldCheck,
  Database,
  History,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { APP_NAME } from '../../lib/constants';

export const Sidebar: React.FC = () => {
  const { sidebarOpen } = useUIStore();
  const { user } = useAuthStore();

  const isCitizen = user?.role === 'CITIZEN';

  const citizenNav = [
    {
      title: "Citizen Portal",
      items: [
        { name: "My Dashboard", path: "/dashboard", icon: LayoutDashboard },
        { name: "Upload Land Record", path: "/documents/upload", icon: UploadCloud },
        { name: "My Submissions & Status", path: "/documents", icon: FileText },
      ]
    },
    {
      title: "AI Extraction Preview",
      items: [
        { name: "OCR Extractor Review", path: "/digitization/extracted-data", icon: Sparkles },
      ]
    }
  ];

  const officerNav = [
    {
      title: "Revenue Command",
      items: [
        { name: "Officer Dashboard", path: "/dashboard", icon: LayoutDashboard },
        { name: "Submission Queue", path: "/documents", icon: FileText },
      ]
    },
    {
      title: "Verification & Validation",
      items: [
        { name: "Side-by-Side Comparison", path: "/verification", icon: GitCompare },
        { name: "Validation Engine", path: "/validation", icon: ShieldCheck },
      ]
    },
    {
      title: "Reference Registry & Audit",
      items: [
        { name: "Reference Records DB", path: "/land-records", icon: Database },
        { name: "Audit Trail Logs", path: "/audit", icon: History },
      ]
    }
  ];

  const navGroups = isCitizen ? citizenNav : officerNav;

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
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-semibold px-1.5 py-0.5 rounded border border-emerald-500/30">SIH</span>
          </h1>
          <p className="text-[11px] text-slate-400 font-medium">
            {isCitizen ? "Citizen Service Portal" : "Revenue Officer Portal"}
          </p>
        </div>
      </div>

      {/* Role Banner */}
      <div className="mx-3 mt-3 p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isCitizen ? 'bg-sky-400' : 'bg-emerald-400'} animate-pulse`} />
          <span className="text-[11px] font-semibold text-slate-200">
            {isCitizen ? "Role: Citizen" : "Role: Revenue Officer"}
          </span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">
          {user?.officer_code || "USER"}
        </span>
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

      {/* Prototype Reference DB Disclaimer Box */}
      <div className="p-3 m-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 mb-1">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Prototype System</span>
        </div>
        <p className="text-[10px] text-slate-400 leading-tight">
          Demo data only – not connected to live government land records.
        </p>
      </div>
    </aside>
  );
};
