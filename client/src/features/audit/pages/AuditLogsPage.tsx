import React, { useEffect, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { History, ShieldCheck, Search, RefreshCw, Lock, User, FileText, CheckCircle2 } from 'lucide-react';
import api from '../../../lib/axios';

export const AuditLogsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/audit/logs?limit=50');
      setLogs(res.data || []);
    } catch (e) {
      console.error('Failed to load audit logs', e);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(
    (log) =>
      (log.user_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.action || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.details || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-slate-700 text-xs font-semibold uppercase tracking-wider mb-1">
            <History className="w-4 h-4 text-emerald-600" /> Immutable Security Audit Ledger
          </div>
          <h1 className="text-xl font-bold text-slate-900">Audit Trail & System Activity Logs</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographically tracked log of citizen uploads, OCR extractions, officer verifications, and approvals.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchLogs} className="text-xs flex items-center gap-1">
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </Button>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 font-semibold">
            <ShieldCheck className="w-4 h-4" /> Real-Time Auditing
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="p-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter by Actor, Action Type (e.g. DOCUMENT_UPLOADED, APPROVAL_CREATED), or Reference..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
      </Card>

      {/* Audit Logs Table */}
      <Card className="p-0 overflow-hidden border-slate-200">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading audit records...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">No audit logs matching search criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-white uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="px-4 py-3">Timestamp / Log ID</th>
                  <th className="px-4 py-3">Actor / Role</th>
                  <th className="px-4 py-3">Event Action</th>
                  <th className="px-4 py-3">Entity Type & ID</th>
                  <th className="px-4 py-3">Action Details</th>
                  <th className="px-4 py-3 text-right">IP Origin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono font-bold text-slate-900 block">AUD-{log.id}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-800">{log.user_name}</div>
                      <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-mono">
                        {log.user_role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.action.includes('APPROVED')
                          ? 'bg-emerald-100 text-emerald-800'
                          : log.action.includes('REJECT')
                          ? 'bg-rose-100 text-rose-800'
                          : log.action.includes('DISCREPANCY') || log.action.includes('MANUAL')
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-600">
                      {log.entity_type} #{log.entity_id}
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-[11px] max-w-xs truncate" title={log.details || ''}>
                      {log.details || '—'}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-[10px] text-slate-400">
                      {log.ip_address || '127.0.0.1'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
