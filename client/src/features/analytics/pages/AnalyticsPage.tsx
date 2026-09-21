import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';
import { BarChart3, TrendingUp, Sparkles, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

const districtData = [
  { district: 'Pune', digitized: 4200, verified: 4050 },
  { district: 'Nagpur', digitized: 3100, verified: 2950 },
  { district: 'Nashik', digitized: 2800, verified: 2700 },
  { district: 'Thane', digitized: 2400, verified: 2320 },
  { district: 'Satara', digitized: 1900, verified: 1840 },
];

const accuracyTrendData = [
  { month: 'Jan', ocrAccuracy: 88.5, validationRate: 91.2 },
  { month: 'Feb', ocrAccuracy: 91.0, validationRate: 93.0 },
  { month: 'Mar', ocrAccuracy: 93.4, validationRate: 94.8 },
  { month: 'Apr', ocrAccuracy: 95.2, validationRate: 96.5 },
  { month: 'May', ocrAccuracy: 96.8, validationRate: 97.9 },
  { month: 'Jun', ocrAccuracy: 98.2, validationRate: 98.6 },
];

const discrepancyPieData = [
  { name: 'Name Spelling Mismatch', value: 45, color: '#f59e0b' },
  { name: 'Boundary Spatial Overlap', value: 25, color: '#ef4444' },
  { name: 'Unrecorded Mortgage Charge', value: 18, color: '#8b5cf6' },
  { name: 'Area Variation (>0.01 Ha)', value: 12, color: '#3b82f6' },
];

export const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-semibold uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" /> State Revenue Analytics & AI Intelligence
          </div>
          <h1 className="text-xl font-bold text-slate-900">Land Record Digitization Analytics</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            District-wise processing throughput, AI OCR accuracy progression, and discrepancy distribution.
          </p>
        </div>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-4 border-slate-200">
          <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Current AI Model Accuracy</p>
            <h3 className="text-2xl font-bold text-slate-900">98.2%</h3>
            <p className="text-[11px] text-emerald-600 font-semibold">+6.8% since Indic-OCR v3</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4 border-slate-200">
          <div className="p-3 bg-blue-100 text-blue-700 rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Avg Processing Speed</p>
            <h3 className="text-2xl font-bold text-slate-900">1.8 Seconds</h3>
            <p className="text-[11px] text-slate-500 font-semibold">Per 7/12 & Mutation page</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4 border-slate-200">
          <div className="p-3 bg-amber-100 text-amber-700 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Discrepancy Auto-Detection</p>
            <h3 className="text-2xl font-bold text-slate-900">100% Flagged</h3>
            <p className="text-[11px] text-slate-500 font-semibold">Zero missed title conflicts</p>
          </div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* District Throughput Bar Chart */}
        <div className="lg:col-span-7">
          <Card className="h-[380px] p-4 flex flex-col">
            <div className="pb-3 border-b border-slate-100 mb-2">
              <h3 className="font-semibold text-slate-900 text-sm">District-Wise Digitization Volume</h3>
              <p className="text-xs text-slate-500">Digitized records vs Officer Verified records</p>
            </div>
            <div className="flex-1 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={districtData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="district" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                  <Bar dataKey="digitized" fill="#0f172a" radius={[4, 4, 0, 0]} name="Digitized" />
                  <Bar dataKey="verified" fill="#16a34a" radius={[4, 4, 0, 0]} name="Verified" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* AI Accuracy Area Chart */}
        <div className="lg:col-span-5">
          <Card className="h-[380px] p-4 flex flex-col">
            <div className="pb-3 border-b border-slate-100 mb-2">
              <h3 className="font-semibold text-slate-900 text-sm">AI Accuracy Progression Rate</h3>
              <p className="text-xs text-slate-500">Monthly OCR & Legal Validation success curve</p>
            </div>
            <div className="flex-1 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={accuracyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis domain={[80, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="ocrAccuracy" stroke="#16a34a" fill="#dcfce7" name="OCR Accuracy %" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
