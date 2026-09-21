import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Sparkles, CheckCircle2, AlertCircle, Save, ArrowRight, RefreshCw, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ExtractedDataScreenPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    ownerName: 'R. Ananthi',
    surveyNumber: '132/1',
    subDivision: '1',
    areaHectares: '1.20 Acres',
    landType: 'Ryotwari Punja (Agricultural Dry Land)',
    encumbranceDetails: 'Clear Title • Pappireddipatti SRO Registration Deed No. 3463/2003',
    registrationDate: '2003-07-11',
    khataNumber: 'Patta No. 284',
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => {
      navigate('/verification');
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" /> AI OCR Neural Extraction Matrix
          </div>
          <h1 className="text-xl font-bold text-slate-900">Extracted Land Record Data Attributes</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review and correct AI-extracted metadata fields before saving to the central land registry.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="verified" className="px-3 py-1 text-xs">
            Overall Accuracy: 98.2%
          </Badge>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold text-slate-900 text-sm border-b border-slate-100 pb-2">
            Ownership & Cadastral Attributes
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-slate-700">Primary Owner Full Name</label>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">99.2% OCR Match</span>
              </div>
              <input
                type="text"
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-slate-700">Patta / Chitta Passbook Number</label>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">98.4% OCR Match</span>
              </div>
              <input
                type="text"
                value={formData.khataNumber}
                onChange={(e) => setFormData({ ...formData, khataNumber: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-slate-700">Survey / Gut Number</label>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">99.8%</span>
              </div>
              <input
                type="text"
                value={formData.surveyNumber}
                onChange={(e) => setFormData({ ...formData, surveyNumber: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-mono font-bold focus:outline-none"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-slate-700">Sub-Division (Hissa)</label>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">97.0%</span>
              </div>
              <input
                type="text"
                value={formData.subDivision}
                onChange={(e) => setFormData({ ...formData, subDivision: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:outline-none"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-slate-700">Land Area (Hectares)</label>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">98.9%</span>
              </div>
              <input
                type="text"
                value={formData.areaHectares}
                onChange={(e) => setFormData({ ...formData, areaHectares: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-bold focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-slate-700">Encumbrance & Liabilities Record</label>
              <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-bold">95.1% OCR Match</span>
            </div>
            <textarea
              rows={2}
              value={formData.encumbranceDetails}
              onChange={(e) => setFormData({ ...formData, encumbranceDetails: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none"
            />
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/documents/viewer')}
            className="text-xs py-2 px-4"
          >
            Back to Document Viewer
          </Button>

          <Button
            type="submit"
            isLoading={isSaved}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-6 text-xs flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Confirm & Proceed to Cross-Verification</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};
