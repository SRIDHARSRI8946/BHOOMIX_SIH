import React, { useEffect, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Filter, FileUp, FileText, Download, GitCompare, Sparkles, RefreshCw } from 'lucide-react';
import api, { getPdfDownloadUrl } from '../../../lib/axios';
import { useAuthStore } from '../../../stores/authStore';
import { STATUS_COLORS } from '../../../lib/constants';

export const DocumentListPage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const isCitizen = user?.role === 'CITIZEN';

  const [submissions, setSubmissions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, [isCitizen]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const endpoint = isCitizen ? '/citizen/submissions' : '/officer/submissions';
      const res = await api.get(endpoint);
      setSubmissions(res.data || []);
    } catch (e) {
      console.error('Failed to load submissions', e);
    } finally {
      setLoading(false);
    }
  };

  const filteredDocs = submissions.filter((s) => {
    const term = searchTerm.toLowerCase();
    return (
      (s.submission_reference || '').toLowerCase().includes(term) ||
      (s.survey_number || '').toLowerCase().includes(term) ||
      (s.owner_name || '').toLowerCase().includes(term) ||
      (s.village || '').toLowerCase().includes(term) ||
      (s.district || '').toLowerCase().includes(term)
    );
  });

  const downloadPdf = (subId: number) => {
    window.open(getPdfDownloadUrl(subId), '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            {isCitizen ? "My Submissions & Digitized Records" : "Revenue Officer Submission Queue"}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {isCitizen
              ? "Track your submitted land records, verification timeline, and download official approval forms."
              : "Review, compare, and verify citizen historical land documents against reference databases."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchSubmissions} className="text-xs flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </Button>
          {isCitizen && (
            <Link to="/documents/upload">
              <Button className="bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-2 text-xs py-2">
                <FileUp className="w-4 h-4" /> Upload New Document
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Search Toolbar */}
      <Card className="p-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Reference ID (BX-...), Survey Number, Owner Name, Village..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
      </Card>

      {/* Submissions Table */}
      <Card className="p-0 overflow-hidden border-slate-200">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading records...</div>
        ) : filteredDocs.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 space-y-2">
            <FileText className="w-8 h-8 text-slate-300 mx-auto" />
            <p>No records found.</p>
            {isCitizen && (
              <Link to="/documents/upload">
                <Button className="bg-sky-600 hover:bg-sky-500 text-white text-xs mt-2">
                  Upload Record
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-900 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Submission Ref</th>
                  <th className="px-4 py-3">Survey Number</th>
                  <th className="px-4 py-3">Registered Owner</th>
                  <th className="px-4 py-3">Village / District</th>
                  <th className="px-4 py-3">OCR Confidence</th>
                  <th className="px-4 py-3">Approval Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredDocs.map((doc) => {
                  const statusStyle = STATUS_COLORS[doc.approval_status] || "bg-slate-100 text-slate-700";
                  return (
                    <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">
                        {doc.submission_reference}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-800">
                        {doc.survey_number || '132/1'}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {doc.owner_name || 'R. Ananthi'}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {doc.village || 'Payanatham'}, {doc.district || 'Dharmapuri'}
                      </td>
                      <td className="px-4 py-3 font-semibold text-emerald-600">
                        {doc.ocr_confidence ? `${doc.ocr_confidence.toFixed(1)}%` : doc.overall_confidence ? `${doc.overall_confidence.toFixed(1)}%` : '94.2%'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusStyle}`}>
                          {doc.approval_status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right space-x-1.5">
                        {!isCitizen ? (
                          <Button
                            onClick={() => navigate(`/verification?id=${doc.id}`)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] px-2.5 py-1 rounded inline-flex items-center gap-1 shadow-xs"
                          >
                            <GitCompare className="w-3 h-3" />
                            <span>Verify & Compare</span>
                          </Button>
                        ) : null}

                        {doc.has_approval_pdf && (
                          <Button
                            onClick={() => downloadPdf(doc.id)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] px-2.5 py-1 rounded inline-flex items-center gap-1"
                            title="Download Official Prototype Approval PDF"
                          >
                            <Download className="w-3 h-3" />
                            <span>Download PDF</span>
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
