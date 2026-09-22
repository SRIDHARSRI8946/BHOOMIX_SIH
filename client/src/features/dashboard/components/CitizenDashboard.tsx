import React, { useEffect, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Link } from 'react-router-dom';
import {
  UploadCloud,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Download,
  ArrowRight,
  Sparkles,
  ShieldAlert,
  Layers,
  ChevronRight
} from 'lucide-react';
import api, { getPdfDownloadUrl } from '../../../lib/axios';
import { useAuthStore } from '../../../stores/authStore';
import { STATUS_COLORS, PROTOTYPE_NOTICE } from '../../../lib/constants';

export const CitizenDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await api.get('/citizen/submissions');
      setSubmissions(res.data || []);
    } catch (e) {
      console.error('Failed to fetch citizen submissions', e);
    } finally {
      setLoading(false);
    }
  };

  const total = submissions.length;
  const ocrDone = submissions.filter(s => s.ocr_status === 'OCR_COMPLETED').length;
  const pendingOfficer = submissions.filter(s => ['SUBMITTED_TO_OFFICER', 'UNDER_REVIEW', 'MANUAL_VERIFICATION_REQUIRED', 'UNDER_MANUAL_VERIFICATION', 'MANUAL_VERIFICATION_COMPLETED'].includes(s.approval_status)).length;
  const approved = submissions.filter(s => s.approval_status === 'APPROVED').length;
  const rejected = submissions.filter(s => s.approval_status === 'REJECTED').length;

  const downloadPdf = async (subId: number, ref: string) => {
    try {
      const response = await api.get(`/pdf/download/${subId}`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `BhoomiX_Approval_${ref}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Download failed, trying direct link', e);
      window.open(getPdfDownloadUrl(subId), '_blank');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/30 px-3 py-1 rounded-full text-sky-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            Citizen Land Digitization Services
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome, {user?.name || 'Citizen'}
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            Upload your historical handwritten land records. BhoomiX will perform OCR extraction and submit your digital record to the Revenue Officer for validation against reference records.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link to="/documents/upload">
            <Button className="bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-sky-950 flex items-center gap-2">
              <UploadCloud className="w-4 h-4" />
              Upload New Record
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-500 font-medium">Total Submissions</span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">{total}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-500 font-medium">OCR Processed</span>
            <Sparkles className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-2xl font-extrabold text-cyan-700 mt-2">{ocrDone}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-500 font-medium">Officer Review</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-700 mt-2">{pendingOfficer}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-500 font-medium">Approved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 mt-2">{approved}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-500 font-medium">Rejected</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-extrabold text-red-700 mt-2">{rejected}</div>
        </div>
      </div>

      {/* Submission Status Lifecycle Guide */}
      <Card className="p-4 bg-slate-50/80 border-slate-200">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          End-to-End Digitization Workflow:
        </h4>
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-slate-600">
          <span className="px-2 py-1 bg-white border border-slate-200 rounded">1. Upload</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="px-2 py-1 bg-white border border-slate-200 rounded">2. OCR Extraction</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="px-2 py-1 bg-white border border-slate-200 rounded">3. Citizen Review & Edit</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="px-2 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded">4. Submit to Officer</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="px-2 py-1 bg-purple-50 text-purple-800 border border-purple-200 rounded">5. Record Comparison</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="px-2 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded">6. Officer Approval PDF</span>
        </div>
      </Card>

      {/* Recent Submissions List */}
      <Card className="p-0 overflow-hidden border-slate-200">
        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
          <div>
            <h3 className="text-sm font-bold text-slate-900">My Submissions & Digitized Records</h3>
            <p className="text-xs text-slate-400 mt-0.5">Track the verification lifecycle of your uploaded land deeds</p>
          </div>
          <Link to="/documents/upload">
            <Button variant="outline" className="text-xs flex items-center gap-1.5">
              <UploadCloud className="w-3.5 h-3.5" />
              Upload Record
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">Loading submissions...</div>
        ) : submissions.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-sm font-semibold text-slate-700">No Land Records Uploaded Yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Start by uploading your first historical land document (e.g. Survey 132/1 Payanatham demo deed).
            </p>
            <Link to="/documents/upload">
              <Button className="bg-sky-600 hover:bg-sky-500 text-white text-xs px-4 py-2 mt-2">
                Upload Document Now
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Reference ID</th>
                  <th className="px-4 py-3">Survey Number</th>
                  <th className="px-4 py-3">Registered Owner</th>
                  <th className="px-4 py-3">Village / District</th>
                  <th className="px-4 py-3">OCR Confidence</th>
                  <th className="px-4 py-3">Lifecycle Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
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
                      <td className="px-4 py-3 font-semibold text-slate-800">
                        {sub.survey_number || '132/1'}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {sub.owner_name || 'R. Ananthi'}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {sub.village || 'Payanatham'}, {sub.district || 'Dharmapuri'}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-emerald-600">
                          {sub.overall_confidence ? `${sub.overall_confidence.toFixed(1)}%` : '94.2%'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusStyle}`}>
                          {sub.approval_status === 'UNDER_MANUAL_VERIFICATION'
                            ? 'Under Manual Verification'
                            : sub.approval_status === 'MANUAL_VERIFICATION_COMPLETED'
                            ? 'Manual Verification Completed'
                            : sub.approval_status === 'MANUAL_VERIFICATION_REQUIRED'
                            ? 'Manual Verification Required'
                            : sub.approval_status === 'APPROVED'
                            ? 'Approved'
                            : sub.approval_status}
                        </span>
                        {sub.approval_status === 'UNDER_MANUAL_VERIFICATION' && (
                          <div className="text-[10px] text-red-600 mt-0.5 font-bold">
                            ⚠️ Under Manual Verification: Revenue Officer physical deed examination in progress.
                          </div>
                        )}
                        {sub.approval_status === 'MANUAL_VERIFICATION_REQUIRED' && (
                          <div className="text-[10px] text-amber-600 mt-0.5 font-medium">
                            Discrepancy detected. Revenue Officer manual verification pending.
                          </div>
                        )}
                        {sub.approval_status === 'MANUAL_VERIFICATION_COMPLETED' && (
                          <div className="text-[10px] text-emerald-700 mt-0.5 font-bold">
                            ✓ Manual verification completed by Officer. Final endorsement pending.
                          </div>
                        )}
                        {sub.approval_status === 'APPROVED' && (
                          <div className="text-[10px] text-emerald-700 mt-0.5 font-semibold">
                            ✓ Formally verified & approved by Revenue Officer.
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        {sub.has_approval_pdf ? (
                          <Button
                            onClick={() => downloadPdf(sub.id, sub.submission_reference)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] px-2.5 py-1 rounded shadow-xs inline-flex items-center gap-1"
                          >
                            <Download className="w-3 h-3" />
                            <span>Download Approval PDF</span>
                          </Button>
                        ) : sub.approval_status === 'READY_FOR_SUBMISSION' ? (
                          <Link to="/digitization/extracted-data">
                            <Button className="bg-sky-600 hover:bg-sky-500 text-white text-[11px] px-2.5 py-1 rounded">
                              Review & Submit
                            </Button>
                          </Link>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-medium">
                            In Review
                          </span>
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
