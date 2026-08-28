import React, { useState } from 'react';
import { mockDocuments } from '../api';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Link } from 'react-router-dom';
import { Search, Filter, FileUp, FileText, Eye, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';
import { DOCUMENT_TYPES } from '../../../lib/constants';

export const DocumentListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredDocs = mockDocuments.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.surveyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || doc.documentType === selectedType;
    const matchesStatus = selectedStatus === 'all' || doc.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            Land Record Document Repository
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse, inspect, and manage digitized 7/12 Extracts, Khatauni, Ferfar Mutation records, and Cadastral Maps.
          </p>
        </div>
        <Link to="/documents/upload">
          <Button className="bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-2 text-xs py-2">
            <FileUp className="w-4 h-4" /> Upload New Document
          </Button>
        </Link>
      </div>

      {/* Filter Toolbar */}
      <Card className="p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Title, Survey No, District..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none"
            >
              <option value="all">All Document Types</option>
              {DOCUMENT_TYPES.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none"
            >
              <option value="all">All Processing Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="digitized">Digitized (AI Complete)</option>
              <option value="verified">Verified (Officer Approved)</option>
              <option value="discrepancy">Discrepancy Flagged</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Document List Table */}
      <Card className="p-0 overflow-hidden border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-900 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Document Title / ID</th>
                <th className="px-4 py-3">Location / Jurisdiction</th>
                <th className="px-4 py-3">Survey / Gut No</th>
                <th className="px-4 py-3">OCR Accuracy</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Uploaded Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{doc.title}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{doc.documentNumber}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">{doc.village}, {doc.taluka}</p>
                    <p className="text-[10px] text-slate-500">{doc.district}, {doc.state}</p>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{doc.surveyNumber}</td>
                  <td className="px-4 py-3">
                    <span className={`font-bold ${doc.ocrAccuracy > 90 ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {doc.ocrAccuracy}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={doc.status as any}>{doc.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{doc.uploadedAt}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <Link to="/documents/viewer">
                      <Button size="sm" variant="outline" className="text-xs py-1 px-2.5 inline-flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" /> View Split OCR
                      </Button>
                    </Link>
                    <Link to="/digitization/extracted-data">
                      <Button size="sm" variant="secondary" className="text-xs py-1 px-2.5">Data</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
