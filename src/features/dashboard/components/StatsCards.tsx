import React from 'react';
import { Card } from '../../../components/ui/Card';
import { FileText, AlertTriangle, CheckCircle, Sparkles, TrendingUp } from 'lucide-react';
import { DashboardStats } from '../api';

interface StatsCardsProps {
  stats: DashboardStats;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const cards = [
    {
      title: "Total Digitized Records",
      value: stats.totalRecordsDigitized.toLocaleString('en-IN'),
      change: "+12.4% this month",
      icon: FileText,
      color: "bg-blue-50 text-blue-600 border-blue-200",
    },
    {
      title: "Pending Verifications",
      value: stats.pendingVerifications.toString(),
      change: "Requires officer sign-off",
      icon: CheckCircle,
      color: "bg-amber-50 text-amber-600 border-amber-200",
    },
    {
      title: "Discrepancy Flags",
      value: stats.discrepanciesFlagged.toString(),
      change: "3 boundary overlaps",
      icon: AlertTriangle,
      color: "bg-rose-50 text-rose-600 border-rose-200",
    },
    {
      title: "AI OCR Accuracy",
      value: `${stats.averageOcrConfidence}%`,
      change: "Multilingual model v3.2",
      icon: Sparkles,
      color: "bg-emerald-50 text-emerald-600 border-emerald-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <Card key={idx} className="relative overflow-hidden border-slate-200/80">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{card.title}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{card.value}</h3>
              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-medium">
                <TrendingUp className="w-3 h-3 text-emerald-600" />
                {card.change}
              </p>
            </div>
            <div className={`p-3 rounded-xl border ${card.color}`}>
              <card.icon className="w-5 h-5" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
