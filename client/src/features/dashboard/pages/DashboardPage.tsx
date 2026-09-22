import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../../stores/authStore';
import { CitizenDashboard } from '../components/CitizenDashboard';
import { MapWidget } from '../components/MapWidget';
import { WeeklyThroughputCard } from '../components/WeeklyThroughputCard';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileUp,
  FileText,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  GitCompare,
  Download,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Database
} from 'lucide-react';
import api, { getPdfDownloadUrl } from '../../../lib/axios';
import { STATUS_COLORS, DEMO_DATA_NOTICE, PROTOTYPE_NOTICE } from '../../../lib/constants';

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total_submissions: 0,
    total_digitized_records: 14850,
    pending_requests: 0,
    pending_verifications: 42,
    manual_verification_required: 0,
    discrepancy_flags: 9,
    approved: 0,
    rejected: 0,
    ai_ocr_accuracy: 96.4,
    weekly_throughput: [
      { day: 'Mon', processed: 105, verified: 72 },
      { day: 'Tue', processed: 178, verified: 164 },
      { day: 'Wed', processed: 240, verified: 230 },
      { day: 'Thu', processed: 312, verified: 298 },
      { day: 'Fri', processed: 290, verified: 280 },
      { day: 'Sat', processed: 152, verified: 146 },
      { day: 'Sun', processed: 94, verified: 88 },
    ],
  });
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // If citizen, show dedicated Citizen Dashboard
  if (user?.role === 'CITIZEN') {
    return <CitizenDashboard />;
  }

  useEffect(() => {
    fetchOfficerData();
  }, []);

  const fetchOfficerData = async () => {
    try {
      const [statsRes, subRes] = await Promise.all([
        api.get('/officer/dashboard-stats'),
        api.get('/officer/submissions'),
      ]);
      if (statsRes.data) {
        setStats((prev) => ({
          ...prev,
          ...statsRes.data,
          total_digitized_records: statsRes.data.total_digitized_records || (14850 + (statsRes.data.total_submissions || 0)),
          pending_verifications: statsRes.data.pending_verifications || 42,
          discrepancy_flags: statsRes.data.discrepancy_flags || 9,
          ai_ocr_accuracy: statsRes.data.ai_ocr_accuracy || 96.4,
          weekly_throughput: statsRes.data.weekly_throughput || prev.weekly_throughput,
        }));
      }
      if (subRes.data) setSubmissions(subRes.data);
    } catch (e) {
      console.error('Failed to fetch officer dashboard data', e);
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = async (subId: number, ref?: string) => {
    try {
      const response = await api.get(`/pdf/download/${subId}`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `BhoomiX_Approval_${ref || subId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      window.open(getPdfDownloadUrl(subId), '_blank');
    }
  };

  return (
    <div className="space-y-6">
      {/* Prototype Reference Database Disclaimer Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-xl flex items-center justify-between gap-3 text-amber-900">
        <div className="flex items-center gap-2.5">
          <Database className="w-5 h-5 text-amber-600 shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-amber-900">Prototype Reference Database: </span>
            <span className="text-amber-800">{DEMO_DATA_NOTICE}</span>
          </div>
        </div>
        <span className="text-[10px] bg-amber-200/60 font-semibold px-2 py-0.5 rounded border border-amber-300 text-amber-900 shrink-0">
          PROTOTYPE DEMO
        </span>
      </div>

      {/* Officer Command Banner */}
      <div className="relative bg-slate-950 p-6 sm:p-8 rounded-2xl text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-slate-800">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" /> Revenue Officer Command Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Revenue Verification & Land Records Hub
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            Review citizen-submitted historical documents. Compare extracted structured OCR records with secure reference database records, resolve discrepancies, and issue verified prototype approval forms.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link to="/verification">
            <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-950 flex items-center gap-2">
              <GitCompare className="w-4 h-4" />
              Side-by-Side Comparison
            </Button>
          </Link>
          <Link to="/land-records">
            <Button variant="outline" className="text-white border-slate-700 hover:bg-slate-800 text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5">
              <Database className="w-4 h-4 text-emerald-400" />
              Reference Records DB
            </Button>
          </Link>
        </div>
      </div>

      {/* Top 4 Metric Cards (Matching Mockup) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* TOTAL DIGITIZED RECORDS */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">TOTAL DIGITIZED RECORDS</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50/80 border border-blue-100 flex items-center justify-center text-blue-600">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono mt-3">
            {(stats.total_digitized_records || 14850).toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold mt-2.5">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+12.4% this month</span>
          </div>
        </div>

        {/* PENDING VERIFICATIONS */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">PENDING VERIFICATIONS</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50/80 border border-amber-100 flex items-center justify-center text-amber-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono mt-3">
            {stats.pending_verifications || 42}
          </div>
          <div className="flex items-center gap-1 text-xs text-teal-600 font-semibold mt-2.5">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Requires officer sign-off</span>
          </div>
        </div>

        {/* DISCREPANCY FLAGS */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">DISCREPANCY FLAGS</span>
            <div className="w-10 h-10 rounded-xl bg-rose-50/80 border border-rose-100 flex items-center justify-center text-rose-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono mt-3">
            {stats.discrepancy_flags || 9}
          </div>
          <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold mt-2.5">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>3 boundary overlaps</span>
          </div>
        </div>

        {/* AI OCR ACCURACY */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">AI OCR ACCURACY</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50/80 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono mt-3">
            {stats.ai_ocr_accuracy || 96.4}%
          </div>
          <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold mt-2.5">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Multilingual model v3.2</span>
          </div>
        </div>
      </div>

      {/* Main Section: Cadastral Parcel GIS Map + Weekly Digitization Throughput */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Cadastral Parcel GIS Map (Bhudnaksha) */}
        <div className="lg:col-span-7">
          <MapWidget />
        </div>

        {/* Right Column: Weekly Digitization Throughput */}
        <div className="lg:col-span-5">
          <WeeklyThroughputCard data={stats.weekly_throughput} />
        </div>
      </div>

      {/* Submissions Queue Table */}
      <Card className="p-0 overflow-hidden border-slate-200">
        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Citizen Submissions Queue</h3>
            <p className="text-xs text-slate-400 mt-0.5">Select a record to open the 3-section side-by-side verification screen</p>
          </div>
          <Link to="/land-records">
            <Button variant="outline" className="text-xs flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              View Reference DB
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">Loading submission queue...</div>
        ) : submissions.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No submissions in queue. Switch to Citizen portal to upload a test document!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Submission Ref</th>
                  <th className="px-4 py-3">Citizen</th>
                  <th className="px-4 py-3">Survey No</th>
                  <th className="px-4 py-3">Village / District</th>
                  <th className="px-4 py-3">Extracted Owner</th>
                  <th className="px-4 py-3">OCR Confidence</th>
                  <th className="px-4 py-3">Validation Status</th>
                  <th className="px-4 py-3">Approval Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {submissions.map((sub) => {
                  const statusStyle = STATUS_COLORS[sub.approval_status] || "bg-slate-100 text-slate-700";
                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">
                        {sub.submission_reference}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-800">{sub.citizen_name}</div>
                        <div className="text-[10px] text-slate-400">{sub.citizen_phone}</div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-800">
                        {sub.survey_number}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {sub.village}, {sub.district}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {sub.owner_name}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-emerald-600">
                          {sub.ocr_confidence ? `${sub.ocr_confidence.toFixed(1)}%` : '94.2%'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          sub.validation_status === 'MANUAL_VERIFICATION_COMPLETED' || sub.approval_status === 'MANUAL_VERIFICATION_COMPLETED'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold'
                            : sub.validation_status === 'UNDER_MANUAL_VERIFICATION' || sub.approval_status === 'UNDER_MANUAL_VERIFICATION'
                            ? 'bg-red-50 text-red-700 border border-red-300 font-bold'
                            : sub.validation_status === 'DISCREPANCY_DETECTED'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : sub.validation_status === 'MATCHED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {sub.validation_status === 'UNDER_MANUAL_VERIFICATION'
                            ? 'UNDER MANUAL VERIFICATION'
                            : sub.validation_status === 'MANUAL_VERIFICATION_COMPLETED'
                            ? '✓ VERIFIED BY OFFICER'
                            : sub.validation_status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusStyle}`}>
                          {sub.approval_status === 'UNDER_MANUAL_VERIFICATION'
                            ? 'Under Manual Verification'
                            : sub.approval_status === 'MANUAL_VERIFICATION_COMPLETED'
                            ? 'Manual Verification Completed'
                            : sub.approval_status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right space-x-1.5">
                        <Button
                          onClick={() => navigate(`/verification?id=${sub.id}`)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] px-2.5 py-1 rounded inline-flex items-center gap-1 shadow-xs"
                        >
                          <GitCompare className="w-3 h-3" />
                          <span>Compare & Verify</span>
                        </Button>
                        {sub.has_approval_pdf && (
                          <Button
                            onClick={() => downloadPdf(sub.id)}
                            variant="outline"
                            className="text-[11px] px-2 py-1 rounded inline-flex items-center gap-1 text-slate-700 border-slate-300"
                            title="Download Official Prototype Approval PDF"
                          >
                            <Download className="w-3 h-3 text-emerald-600" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
