import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { ZoomIn, ZoomOut, RotateCw, Download, CheckCircle, FileText, AlertTriangle, Eye, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DocumentViewerPage: React.FC = () => {
  const [zoom, setZoom] = useState(100);
  const [activeHighlight, setActiveHighlight] = useState<string | null>('owner_name');

  const mockFields = [
    { key: 'owner_name', label: 'Primary Land Owner', value: 'Rameshwar Mahadev Patil', confidence: 99.2, box: 'Top Left' },
    { key: 'survey_no', label: 'Survey / Gut Number', value: '142/A', confidence: 99.8, box: 'Top Right' },
    { key: 'total_area', label: 'Total Area (Hectares)', value: '1.4500 Ha (3.58 Acres)', confidence: 98.9, box: 'Center' },
    { key: 'land_category', label: 'Land Classification', value: 'Agricultural Unirrigated', confidence: 97.4, box: 'Center Left' },
    { key: 'encumbrances', label: 'Encumbrance / Bank Loan', value: 'State Bank of India Rs. 4,50,000', confidence: 95.1, box: 'Bottom Right' },
  ];

  return (
    <div className="space-y-4">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-900 text-white rounded-lg">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 flex items-center gap-2">
              7/12 Land Record Extract #142/A
              <Badge variant="verified">Verified</Badge>
            </h1>
            <p className="text-xs text-slate-500">Haveli District, Pune Region • Document ID: DOC-1001</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/digitization/extracted-data">
            <Button size="sm" variant="outline" className="text-xs">Edit OCR Data</Button>
          </Link>
          <Link to="/verification">
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Launch Discrepancy Checker
            </Button>
          </Link>
        </div>
      </div>

      {/* Split Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Document Canvas */}
        <div className="lg:col-span-7 space-y-2">
          <div className="bg-slate-800 text-white p-2.5 rounded-t-xl flex justify-between items-center text-xs">
            <span className="font-semibold flex items-center gap-1">
              <Eye className="w-4 h-4 text-emerald-400" /> Scanned Document Record
            </span>
            <div className="flex items-center gap-2">
              <button onClick={() => setZoom(Math.max(50, zoom - 25))} className="p-1 hover:bg-slate-700 rounded"><ZoomOut className="w-4 h-4" /></button>
              <span className="font-mono text-[11px]">{zoom}%</span>
              <button onClick={() => setZoom(Math.min(200, zoom + 25))} className="p-1 hover:bg-slate-700 rounded"><ZoomIn className="w-4 h-4" /></button>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-b-xl h-[560px] overflow-auto p-4 flex items-center justify-center relative">
            {/* Document Graphic Mockup with OCR Bounding Box overlays */}
            <div
              className="bg-white text-slate-900 p-8 rounded shadow-2xl relative transition-all duration-200 border-4 border-slate-300"
              style={{ width: `${zoom}%`, minWidth: '420px' }}
            >
              <div className="border-b-2 border-slate-900 pb-3 mb-4 text-center">
                <h3 className="font-bold text-lg tracking-wider font-serif uppercase">VILLAGE FORM NO. 7 (7/12 EXTRACT) RECORD OF RIGHTS</h3>
                <p className="text-xs text-slate-600">Government Land Revenue Department - Haveli Sub-District, Pune Region</p>
              </div>

              {/* Simulated Bounding Poly Box 1 */}
              <div
                onClick={() => setActiveHighlight('owner_name')}
                className={`p-2 my-2 rounded border-2 cursor-pointer transition-all ${
                  activeHighlight === 'owner_name'
                    ? 'border-emerald-500 bg-emerald-100/50 shadow-md scale-[1.01]'
                    : 'border-blue-300 bg-blue-50/30 hover:border-blue-500'
                }`}
              >
                <span className="text-[10px] bg-blue-600 text-white font-bold px-1 rounded absolute -mt-4 -ml-1">OCR Box #1</span>
                <p className="text-xs font-bold text-slate-800">Primary Landowner Name: Rameshwar Mahadev Patil</p>
              </div>

              {/* Simulated Bounding Poly Box 2 */}
              <div
                onClick={() => setActiveHighlight('survey_no')}
                className={`p-2 my-2 rounded border-2 cursor-pointer transition-all ${
                  activeHighlight === 'survey_no'
                    ? 'border-emerald-500 bg-emerald-100/50 shadow-md scale-[1.01]'
                    : 'border-blue-300 bg-blue-50/30 hover:border-blue-500'
                }`}
              >
                <span className="text-[10px] bg-blue-600 text-white font-bold px-1 rounded absolute -mt-4 -ml-1">OCR Box #2</span>
                <p className="text-xs font-bold text-slate-800">Survey / Gut Plot Number: 142/A</p>
              </div>

              {/* Simulated Bounding Poly Box 3 */}
              <div
                onClick={() => setActiveHighlight('total_area')}
                className={`p-2 my-2 rounded border-2 cursor-pointer transition-all ${
                  activeHighlight === 'total_area'
                    ? 'border-emerald-500 bg-emerald-100/50 shadow-md scale-[1.01]'
                    : 'border-blue-300 bg-blue-50/30 hover:border-blue-500'
                }`}
              >
                <span className="text-[10px] bg-blue-600 text-white font-bold px-1 rounded absolute -mt-4 -ml-1">OCR Box #3</span>
                <p className="text-xs font-bold text-slate-800">Total Land Area: 1.4500 Hectares (3.58 Acres)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Extracted Fields Inspection Panel */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-4 space-y-3">
            <h3 className="font-semibold text-slate-900 text-sm pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>Extracted Key-Value Attributes</span>
              <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">Avg OCR: 98.5%</span>
            </h3>

            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {mockFields.map((field) => (
                <div
                  key={field.key}
                  onClick={() => setActiveHighlight(field.key)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    activeHighlight === field.key
                      ? 'bg-emerald-50/70 border-emerald-500 shadow-sm'
                      : 'bg-slate-50/50 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{field.label}</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                      {field.confidence}% Match
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-900">{field.value}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
