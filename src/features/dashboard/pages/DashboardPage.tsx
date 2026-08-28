import React from 'react';
import { useAuthStore } from '../../../stores/authStore';
import { StatsCards } from '../components/StatsCards';
import { MapWidget } from '../components/MapWidget';
import { SurveyorDashboard } from '../components/SurveyorDashboard';
import { CitizenDashboard } from '../components/CitizenDashboard';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Link } from 'react-router-dom';
import { FileUp, Sparkles, CheckSquare, FileText, ArrowRight, ShieldCheck, AlertOctagon } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ThreeBackground } from '../../../components/ui/ThreeBackground';
import { TextShadows } from '../../../components/ui/TextShadows';
import { GsapTextAnimation } from '../../../components/ui/GsapTextAnimation';

const chartData = [
  { day: 'Mon', digitized: 120, verified: 110, flagged: 4 },
  { day: 'Tue', digitized: 180, verified: 165, flagged: 8 },
  { day: 'Wed', digitized: 240, verified: 230, flagged: 3 },
  { day: 'Thu', digitized: 310, verified: 295, flagged: 12 },
  { day: 'Fri', digitized: 290, verified: 280, flagged: 5 },
  { day: 'Sat', digitized: 150, verified: 145, flagged: 2 },
];

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();

  const stats = {
    totalRecordsDigitized: 14850,
    pendingVerifications: 42,
    discrepanciesFlagged: 9,
    averageOcrConfidence: 96.4,
    districtAccuracyRate: 98.2,
  };

  const recentDocuments = [
    { id: 'DOC-9021', title: '7/12 Extract - Haveli Plot #142', village: 'Haveli', status: 'verified', confidence: 98.5, time: '10m ago' },
    { id: 'DOC-9022', title: 'Mutation Register Ferfar #88', village: 'Mavli', status: 'discrepancy', confidence: 84.2, time: '25m ago' },
    { id: 'DOC-9023', title: 'Khatauni Title Deed #410', village: 'Hadapsar', status: 'digitized', confidence: 97.1, time: '1h ago' },
    { id: 'DOC-9024', title: 'Cadastral Map #18-B', village: 'Kothrud', status: 'processing', confidence: 92.0, time: '2h ago' },
  ];

  // 1. Land Surveyor Specific Dashboard View
  if (user?.role === 'SURVEYOR') {
    return <SurveyorDashboard />;
  }

  // 2. Citizen / Property Buyer Specific Dashboard View
  if (user?.role === 'CITIZEN') {
    return <CitizenDashboard />;
  }

  // 3. Revenue Officer & Admin Command Center Dashboard View
  return (
    <div className="space-y-6">
      {/* 3D WebGL Animated Hero Banner */}
      <div className="relative bg-slate-950 p-8 rounded-2xl text-white shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 overflow-hidden border border-slate-800">
        <ThreeBackground gridColor="#10b981" particleColor="#3b82f6" />

        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" /> Revenue Officer Command Dashboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex flex-wrap items-center gap-2">
            <TextShadows text="Land Records AI" shadowColor="#10b981" glowIntensity="intense" />
            <GsapTextAnimation text="Digitization Hub" type="split-char" stagger={0.04} />
          </h1>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            <GsapTextAnimation
              text="Real-time optical character recognition, cadastral map vectorization, ownership chain verification, and legal discrepancy detection."
              type="stagger-words"
              stagger={0.02}
            />
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 shrink-0">
          <Link to="/documents/upload">
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold flex items-center gap-2 shadow-lg shadow-emerald-950">
              <FileUp className="w-4 h-4" />
              Upload Land Record
            </Button>
          </Link>
          <Link to="/digitization/extracted-data">
            <Button variant="outline" className="text-white border-slate-700 hover:bg-slate-800/80 flex items-center gap-2 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              AI Extractor
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <StatsCards stats={stats} />

      {/* Main Grid: GIS Map & Processing Trend Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <MapWidget />
        </div>

        <div className="lg:col-span-5">
          <Card className="h-[440px] flex flex-col p-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-3">
              <div>
                <h3 className="font-semibold text-slate-900 text-base">Weekly Digitization Throughput</h3>
                <p className="text-xs text-slate-500">Document records processed vs verified per day</p>
              </div>
              <span className="text-[11px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded">This Week</span>
            </div>
            <div className="flex-1 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  />
                  <Bar dataKey="digitized" fill="#0f172a" radius={[4, 4, 0, 0]} name="Digitized" />
                  <Bar dataKey="verified" fill="#16a34a" radius={[4, 4, 0, 0]} name="Verified" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Activity Table & Action Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-0 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">Recent Record Submissions</h3>
                <p className="text-xs text-slate-500">Latest 7/12, Mutation, & Khatauni extracts uploaded</p>
              </div>
              <Link to="/documents" className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {recentDocuments.map((doc) => (
                <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-slate-100 rounded-lg text-slate-700">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-900">{doc.title}</p>
                      <p className="text-[11px] text-slate-500">{doc.village} Taluka • ID: {doc.id} • {doc.time}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-800">{doc.confidence}%</span>
                      <p className="text-[10px] text-slate-400">OCR Confidence</p>
                    </div>
                    <Badge variant={doc.status as any}>{doc.status}</Badge>
                    <Link to="/documents/viewer">
                      <Button size="sm" variant="outline" className="text-xs py-1 px-2.5">Inspect</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Officer Actions */}
        <div>
          <Card className="space-y-4">
            <h3 className="font-semibold text-slate-900 text-sm pb-2 border-b border-slate-100">Quick Officer Workbench</h3>
            
            <Link to="/documents/upload" className="block">
              <div className="p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all flex items-center gap-3">
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                  <FileUp className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Upload & Scan Document</h4>
                  <p className="text-[11px] text-slate-500">Run multilingual Indic-OCR engine</p>
                </div>
              </div>
            </Link>

            <Link to="/verification" className="block">
              <div className="p-3 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/30 transition-all flex items-center gap-3">
                <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
                  <AlertOctagon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Review Discrepancy Queue</h4>
                  <p className="text-[11px] text-slate-500">9 flagged land records need sign-off</p>
                </div>
              </div>
            </Link>

            <Link to="/validation" className="block">
              <div className="p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 transition-all flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Execute Rule Validator</h4>
                  <p className="text-[11px] text-slate-500">Check encumbrances & ownership limits</p>
                </div>
              </div>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
};
