import React, { useEffect, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Database, Search, Layers, FileText, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';
import api from '../../../lib/axios';
import { DEMO_DATA_NOTICE, PROTOTYPE_NOTICE } from '../../../lib/constants';

export const LandRecordListPage: React.FC = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [searchSurvey, setSearchSurvey] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async (query = '') => {
    setLoading(true);
    try {
      const url = query ? `/existing-records/search?survey_number=${encodeURIComponent(query)}` : '/existing-records/search';
      const res = await api.get(url);
      setRecords(res.data || []);
    } catch (e) {
      console.error('Failed to load reference records', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRecords(searchSurvey.trim());
  };

  return (
    <div className="space-y-6">
      {/* Header & Prototype Notice */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-semibold uppercase tracking-wider mb-1">
            <Database className="w-4 h-4" /> Prototype Reference Database
          </div>
          <h1 className="text-xl font-bold text-slate-900">Existing Land Records Ledger</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Reference database used by BhoomiX validation engine to cross-check citizen OCR records.
          </p>
        </div>

        <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-800 max-w-sm">
          ⚠️ <b>Notice:</b> {DEMO_DATA_NOTICE}
        </div>
      </div>

      {/* Search Bar */}
      <Card className="p-4">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchSurvey}
              onChange={(e) => setSearchSurvey(e.target.value)}
              placeholder="Search by Survey Number (e.g. 132/1, 132/1A, 132/2)..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <Button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white text-xs px-4 py-2">
            Search
          </Button>
          {searchSurvey && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSearchSurvey('');
                fetchRecords('');
              }}
              className="text-xs px-3 py-2"
            >
              Clear
            </Button>
          )}
        </form>
      </Card>

      {/* Records Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">Loading reference records...</div>
      ) : records.length === 0 ? (
        <div className="p-12 text-center text-xs text-slate-500">No records found matching query.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {records.map((rec) => (
            <Card key={rec.id} className="p-5 border-slate-200 hover:shadow-md transition-all space-y-3 bg-white">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {rec.record_id}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1.5">
                    Survey No: {rec.survey_number}
                  </h3>
                  <p className="text-xs text-slate-500">{rec.village}, {rec.taluk}</p>
                  <p className="text-[11px] text-slate-400">District: {rec.registration_district}</p>
                </div>
                <Badge variant={rec.status === 'ACTIVE' ? 'digitized' : 'outline'}>
                  {rec.status}
                </Badge>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg text-xs space-y-1.5 border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-500">Registered Owner:</span>
                  <span className="font-bold text-slate-900">{rec.owner_name}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-slate-500">Land Extent:</span>
                  <div className="text-right">
                    <span className="font-bold text-slate-900">{rec.land_extent_text}</span>
                    <span className="text-[9px] block text-amber-700 font-semibold">{rec.land_extent_unit}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Document No:</span>
                  <span className="font-medium text-slate-700">{rec.document_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Document Date:</span>
                  <span className="font-medium text-slate-700">{rec.document_date || 'N/A'}</span>
                </div>
              </div>

              <div className="pt-1 flex justify-between items-center text-[10px] text-slate-400">
                <span>Source: {rec.source_type}</span>
                <span className="font-mono">{rec.sub_registrar_office}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
