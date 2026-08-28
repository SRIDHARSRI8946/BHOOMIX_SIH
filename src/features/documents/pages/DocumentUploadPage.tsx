import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { UploadCloud, FileText, CheckCircle2, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DOCUMENT_TYPES = [
  { id: '7_12_EXTRACT', name: '7/12 Land Record Extract', desc: 'Record of Rights, Landowner Names, Area & Encumbrances' },
  { id: 'FERFAR_MUTATION', name: 'Mutation Register (Ferfar)', desc: 'Ownership Change, Sale Deeds, Inheritances & Legal Transfers' },
  { id: 'KHATAUNI', name: 'Khatauni / Land Index II', desc: 'Consolidated Holding Accounts & Government Revenue Assessment' },
  { id: 'CADASTRAL_MAP', name: 'Cadastral Bhudnaksha Map', desc: 'Land Plot Coordinates, Boundaries & Vector Maps' },
];

export const DocumentUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState('7_12_EXTRACT');
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleStartProcessing = () => {
    setIsUploading(true);
    setTimeout(() => {
      navigate('/documents/processing');
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Upload & Scan Land Record</h1>
        <p className="text-xs text-slate-500">
          Upload 7/12 extracts, mutation registers, or cadastral maps for AI OCR feature extraction.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Drag & Drop Container */}
        <div className="md:col-span-7">
          <Card className="p-6 h-full flex flex-col justify-between">
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all flex flex-col items-center justify-center min-h-[260px] ${
                dragActive
                  ? 'border-emerald-500 bg-emerald-50/50 scale-[0.99]'
                  : 'border-slate-300 hover:border-emerald-400 bg-slate-50/50'
              }`}
            >
              <div className="p-4 bg-emerald-100 text-emerald-700 rounded-full mb-3 shadow-inner">
                <UploadCloud className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">
                Drag & Drop Land Record PDF / Image
              </h3>
              <p className="text-xs text-slate-500 mb-4 max-w-xs">
                Supports PDF, High-Res PNG, JPG, and TIFF scanned documents up to 50MB.
              </p>

              <label className="cursor-pointer">
                <input type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg,.tiff" onChange={handleFileChange} />
                <span className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-2 rounded-lg text-xs transition-colors shadow-sm">
                  Browse Local Files
                </span>
              </label>

              {selectedFile ? (
                <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center justify-between w-full">
                  <span className="font-medium truncate max-w-[200px]">{selectedFile.name}</span>
                  <span className="font-bold">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 mt-4">Sample document pre-loaded by default for demonstration</p>
              )}
            </div>

            <div className="pt-4 border-t border-slate-200/60 text-[11px] text-slate-500 flex justify-between items-center mt-4">
              <span>English AI OCR Pipeline v3.2</span>
              <span>English Processing Standard</span>
            </div>
          </Card>
        </div>

        {/* Right Metadata Pre-fill */}
        <div className="md:col-span-5">
          <Card className="space-y-4">
            <h3 className="font-semibold text-slate-900 text-sm pb-2 border-b border-slate-100">Document Metadata Specs</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Document Category</label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800 focus:outline-none"
              >
                {DOCUMENT_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">District / Jurisdiction</label>
              <input
                type="text"
                value="Pune Region - Haveli Sub-District"
                readOnly
                className="w-full bg-slate-100 border border-slate-200 rounded-lg p-2 text-xs text-slate-600 font-semibold cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">AI Pipeline Operations</label>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Image Contrast & Deskew Correction
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Bounding Box Text Recognition
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Land Registry Database Rule Validation
                </div>
              </div>
            </div>

            <Button
              onClick={handleStartProcessing}
              disabled={isUploading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 text-xs flex items-center justify-center gap-2 shadow-md mt-4"
            >
              {isUploading ? (
                <span>Initializing Pipeline...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Start AI Extraction Pipeline
                </>
              )}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
