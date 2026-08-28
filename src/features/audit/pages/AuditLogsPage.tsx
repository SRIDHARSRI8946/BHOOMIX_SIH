import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { History, ShieldCheck, Search, Filter, Lock, User, FileText, CheckCircle2 } from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const auditLogs = [
    {
      id: 'AUD-8801',
      timestamp: '2026-08-28 12:45:10',
      user: 'Rajesh Sharma (Revenue Officer)',
      role: 'REVENUE_OFFICER',
      action: 'RECORD_VERIFIED_APPROVED',
      details: 'Approved 7/12 Extract #142/A with 1 cleared encumbrance note.',
      ipAddress: '10.240.12.88',
      hash: '0x7f8a9b2c3d4e5f6a1b2c',
    },
    {
      id: 'AUD-8802',
      timestamp: '2026-08-28 11:30:22',
      user: 'AI Neural OCR Engine',
      role: 'SYSTEM_BOT',
      action: 'OCR_BATCH_EXTRACTION_SUCCESS',
      details: 'Extracted 5 key attributes for Mutation Register #88 with 84.2% confidence.',
      ipAddress: '172.16.0.4',
      hash: '0x1a2b3c4d5e6f7a8b9c0d',
    },
    {
      id: 'AUD-8803',
      timestamp: '2026-08-28 10:15:00',
      user: 'Suresh Deshmukh (Land Surveyor)',
      role: 'SURVEYOR',
      action: 'CADASTRAL_MAP_UPLOAD',
      details: 'Uploaded updated Bhudnaksha polygon coordinates for Plot #143/B.',
      ipAddress: '10.240.14.92',
      hash: '0x9a8b7c6d5e4f3a2b1c0d',
    },
    {
      id: 'AUD-8804',
      timestamp: '2026-08-27 16:50:18',
      user: 'System Auditor',
      role: 'ADMIN',
      action: 'DISCREPANCY_FLAG_RAISED',
      details: 'Flagged spatial boundary overlap between Survey #142/A and #143/B.',
      ipAddress: '10.240.10.1',
      hash: '0x3c4d5e6f7a8b9c0d1e2f',
    },
  ];

  const filteredLogs = auditLogs.filter(
    (log) =>
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-slate-700 text-xs font-semibold uppercase tracking-wider mb-1">
            <History className="w-4 h-4 text-emerald-600" /> Immutable Governance Security Log
          </div>
          <h1 className="text-xl font-bold text-slate-900">Audit Trail & System Activity Logs</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographically hashed record of officer approvals, AI OCR extractions, and land registry mutations.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 font-semibold">
          <ShieldCheck className="w-4 h-4" /> SHA-256 Ledger Sealed
        </div>
      </div>

      {/* Search Bar */}
      <Card className="p-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter by Officer Name, Action Type, or Hash..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
      </Card>

      {/* Audit Logs Table */}
      <Card className="p-0 overflow-hidden border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-white uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="px-4 py-3">Audit ID / Timestamp</th>
                <th className="px-4 py-3">User / Actor</th>
                <th className="px-4 py-3">Event Action</th>
                <th className="px-4 py-3">Activity Description</th>
                <th className="px-4 py-3">Ledger Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3.5">
                    <p className="font-bold text-slate-900 font-mono">{log.id}</p>
                    <p className="text-[10px] text-slate-400">{log.timestamp}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="font-semibold text-slate-800">{log.user}</p>
                    <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono uppercase">
                      {log.role}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-mono text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-700 font-medium max-w-xs">{log.details}</td>
                  <td className="px-4 py-3.5 font-mono text-[10px] text-slate-400">{log.hash}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
