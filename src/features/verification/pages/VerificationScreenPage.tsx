import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { GitCompare, CheckCircle2, AlertTriangle, ShieldAlert, ArrowRight, Check, X, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const VerificationScreenPage: React.FC = () => {
  const navigate = useNavigate();
  const [verificationDone, setVerificationDone] = useState(false);

  const comparisonRows = [
    {
      field: 'Primary Owner Name',
      ocrData: 'Rameshwar Mahadev Patil',
      legacyDbData: 'Rameshwar Mahadev Patil',
      match: true,
      status: 'Verified Match',
    },
    {
      field: 'Survey / Gut Number',
      ocrData: '142/A',
      legacyDbData: '142/A',
      match: true,
      status: 'Verified Match',
    },
    {
      field: 'Total Land Area',
      ocrData: '1.4500 Hectares',
      legacyDbData: '1.4000 Hectares',
      match: false,
      status: 'Area Discrepancy (0.05 Ha Variation)',
      severity: 'warning',
    },
    {
      field: 'Encumbrance / Mortgage',
      ocrData: 'State Bank of India Rs. 4,50,000',
      legacyDbData: 'Clear / No Mortgage Registered',
      match: false,
      status: 'Unregistered Mortgage Discrepancy',
      severity: 'critical',
    },
    {
      field: 'Land Classification',
      ocrData: 'Jirayat Agricultural',
      legacyDbData: 'Jirayat Agricultural',
      match: true,
      status: 'Verified Match',
    },
  ];

  const handleApprove = () => {
    setVerificationDone(true);
    setTimeout(() => {
      navigate('/validation');
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-600 text-xs font-semibold uppercase tracking-wider mb-1">
            <GitCompare className="w-4 h-4" /> Side-by-Side Verification Engine
          </div>
          <h1 className="text-xl font-bold text-slate-900">OCR Extracted Data vs Legacy Revenue Database</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cross-referencing physical scanned document #142/A against Mahabhulekh / State Revenue Portal records.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="discrepancy" className="px-3 py-1 text-xs">
            2 Discrepancies Flagged
          </Badge>
        </div>
      </div>

      {/* Comparison Grid */}
      <Card className="p-0 overflow-hidden border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-white uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="px-4 py-3">Attribute Name</th>
                <th className="px-4 py-3">Scanned Document OCR Output</th>
                <th className="px-4 py-3">Legacy Govt Revenue DB Record</th>
                <th className="px-4 py-3">Discrepancy Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {comparisonRows.map((row, idx) => (
                <tr
                  key={idx}
                  className={`transition-colors ${
                    !row.match
                      ? row.severity === 'critical'
                        ? 'bg-rose-50/60 hover:bg-rose-50'
                        : 'bg-amber-50/60 hover:bg-amber-50'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <td className="px-4 py-3.5 font-bold text-slate-900">{row.field}</td>
                  <td className="px-4 py-3.5 font-medium text-slate-800 bg-slate-50/50">{row.ocrData}</td>
                  <td className="px-4 py-3.5 font-medium text-slate-800">{row.legacyDbData}</td>
                  <td className="px-4 py-3.5">
                    {row.match ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-bold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {row.status}
                      </span>
                    ) : (
                      <span className={`inline-flex items-center gap-1 font-bold text-[11px] px-2 py-0.5 rounded ${
                        row.severity === 'critical' ? 'text-rose-700 bg-rose-100' : 'text-amber-700 bg-amber-100'
                      }`}>
                        <AlertTriangle className="w-3.5 h-3.5" /> {row.status}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    {!row.match ? (
                      <Button size="sm" variant="outline" className="text-xs py-0.5 px-2 bg-white text-slate-800 border-slate-300">
                        Resolve Diff
                      </Button>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Auto-Passed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Discrepancy Resolution Card */}
      <Card className="bg-gradient-to-r from-amber-500/10 via-slate-50 to-emerald-500/10 border-amber-200 p-5 space-y-3">
        <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
          <ShieldAlert className="w-5 h-5 text-amber-600" />
          <span>Revenue Officer Discrepancy Adjudication</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          AI detected 1 Bank Mortgage encumbrance present on physical Saat Bara but omitted in legacy database. Officer sign-off is required to issue automated mutation notice to Talathi.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button
            onClick={handleApprove}
            isLoading={verificationDone}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2 px-5 flex items-center gap-2"
          >
            <Check className="w-4 h-4" /> Approve Document & Proceed to Legal Validation
          </Button>

          <Button
            variant="danger"
            onClick={() => alert('Discrepancy Dispute Escalated to District Collector.')}
            className="text-xs py-2 px-4 flex items-center gap-1"
          >
            <X className="w-4 h-4" /> Reject & Flag Legal Dispute
          </Button>
        </div>
      </Card>
    </div>
  );
};
