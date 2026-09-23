import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  ArrowRight,
  Eye,
  Trash2,
  Send,
  Edit3,
  ShieldCheck,
  Info,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../../lib/axios';
import { OCR_DISCLAIMER, PROTOTYPE_NOTICE } from '../../../lib/constants';

export const DocumentUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submissionData, setSubmissionData] = useState<any | null>(null);
  const [editedFields, setEditedFields] = useState<any>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmittingToOfficer, setIsSubmittingToOfficer] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const pipelineSteps = [
    "Document Uploaded & Hashed",
    "Image Preprocessing & Denoising",
    "Multilingual OCR Processing",
    "Text Tokenization & Parsing",
    "Structured Field Extraction",
    "Confidence Score Calculation",
    "Digital Record Created",
  ];

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

  const handleLoadDemoDocument = () => {
    // Create a mock File object representing the demo deed
    const demoContent = "TAMIL NADU REGISTRATION DEPARTMENT\nSub-Registrar Office: Pappireddipatti\nDoc 3463 / 2003 Date: 11-07-2003\nVillage: Payanatham Taluk: Pappireddipatti District: Dharmapuri\nSurvey No: 132/1 Land Extent: 1.20 Acres\nOwner: R. Ananthi";
    const blob = new Blob([demoContent], { type: 'application/pdf' });
    const file = new File([blob], "Deed_3463_Survey_132_1_Payanatham.pdf", { type: 'application/pdf' });
    setSelectedFile(file);
    setErrorMsg(null);
  };

  const handleStartUploadAndOCR = async () => {
    if (!selectedFile) {
      setErrorMsg("Please choose a document to upload.");
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);
    setCurrentStepIndex(0);

    // Simulated visual step progression
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < pipelineSteps.length - 1) return prev + 1;
        return prev;
      });
    }, 450);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const res = await api.post('/api/citizen/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
          }
        },
      });

      clearInterval(interval);
      setCurrentStepIndex(pipelineSteps.length - 1);
      setSubmissionData(res.data);
      setEditedFields(res.data.ocr_result);
    } catch (err: any) {
      clearInterval(interval);
      setErrorMsg(err.response?.data?.detail || "Upload or OCR extraction failed. Please try again.");
      setIsProcessing(false);
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setEditedFields((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitToOfficer = async () => {
    if (!submissionData) return;
    setIsSubmittingToOfficer(true);
    setErrorMsg(null);

    try {
      // 1. Save any citizen field edits first
      await api.put(`/api/citizen/submissions/${submissionData.submission_id}/ocr-review`, {
        extracted_owner_name: editedFields.owner_name,
        extracted_survey_number: editedFields.survey_number,
        extracted_area: editedFields.area,
        extracted_village: editedFields.village,
        extracted_taluk: editedFields.taluk,
        extracted_district: editedFields.district,
        extracted_document_number: editedFields.document_number,
        extracted_document_date: editedFields.document_date,
        extracted_sub_registrar_office: editedFields.sub_registrar_office,
      });

      // 2. Submit to Revenue Officer
      const res = await api.post(`/citizen/submissions/${submissionData.submission_id}/submit`);
      setSubmittedRef(res.data.submission_reference);
      setShowConfirmModal(false);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || "Failed to submit document to officer.");
    } finally {
      setIsSubmittingToOfficer(false);
    }
  };

  // SUCCESS SUBMISSION VIEW
  if (submittedRef) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <Card className="p-8 text-center space-y-5 border-emerald-200 bg-emerald-50/20">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Submission Successful</span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">Submitted to Revenue Officer</h2>
            <p className="text-xs text-slate-600 mt-1">
              Your digitized historical land record has been securely submitted for formal cross-verification against existing reference records.
            </p>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl max-w-md mx-auto text-left space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Submission Reference:</span>
              <span className="font-mono font-bold text-slate-900">{submittedRef}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Status:</span>
              <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                SUBMITTED_TO_OFFICER
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Next Action:</span>
              <span className="text-slate-700">Revenue Officer Verification & Approval</span>
            </div>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 text-left">
            ℹ️ As a citizen, you do not approve records. The designated Revenue Officer will inspect the scanned deed against reference land records in the database.
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <Button
              onClick={() => navigate('/documents')}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs px-5 py-2.5"
            >
              Track in My Submissions
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSubmittedRef(null);
                setSubmissionData(null);
                setSelectedFile(null);
                setIsProcessing(false);
              }}
              className="text-xs px-4 py-2.5"
            >
              Upload Another Record
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Upload Historical Land Record</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Convert old physical deeds into structured digital records with AI OCR extraction
          </p>
        </div>
        <Button
          onClick={handleLoadDemoDocument}
          variant="outline"
          className="text-xs border-sky-300 text-sky-700 hover:bg-sky-50 flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
          Load Demo Deed (Survey 132/1 Payanatham)
        </Button>
      </div>

      {errorMsg && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* PHASE 1: UPLOAD BOX (shown if not yet extracted) */}
      {!submissionData && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8">
            <Card className="p-6">
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all flex flex-col items-center justify-center min-h-[260px] ${
                  dragActive
                    ? 'border-sky-500 bg-sky-50/50 scale-[0.99]'
                    : 'border-slate-300 hover:border-sky-400 bg-slate-50/50'
                }`}
              >
                <div className="p-4 bg-sky-100 text-sky-700 rounded-full mb-3 shadow-inner">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">
                  Drag & Drop Historical Land Record
                </h3>
                <p className="text-xs text-slate-500 mb-4 max-w-sm">
                  Accepted formats: <b>JPG, JPEG, PNG, PDF</b> (Max 15MB). Document will be encrypted and hashed on server.
                </p>

                <label className="cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileChange}
                  />
                  <span className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-2 rounded-lg text-xs transition-colors shadow-sm">
                    Browse File
                  </span>
                </label>

                {selectedFile && (
                  <div className="mt-4 p-3 bg-white border border-sky-200 text-slate-800 rounded-lg text-xs flex items-center justify-between w-full max-w-md shadow-xs">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-sky-600 shrink-0" />
                      <span className="font-medium truncate">{selectedFile.name}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-slate-400">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                        }}
                        className="text-slate-400 hover:text-rose-500"
                        title="Remove file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Start Extraction Button */}
              <div className="mt-5 flex justify-end">
                <Button
                  onClick={handleStartUploadAndOCR}
                  disabled={!selectedFile || isProcessing}
                  className="bg-sky-600 hover:bg-sky-500 text-white text-xs px-5 py-2.5 font-semibold flex items-center gap-2 shadow-md shadow-sky-950/20"
                >
                  {isProcessing ? 'Processing OCR Pipeline...' : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Upload & Extract Structured Data</span>
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Info Box */}
          <div className="md:col-span-4 space-y-4">
            <Card className="p-4 bg-slate-50 border-slate-200 text-xs space-y-3">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Secure File Ingestion</span>
              </div>
              <ul className="space-y-2 text-slate-600 text-[11px] leading-relaxed list-disc list-inside">
                <li>MIME type and extension verified before storage</li>
                <li>Cryptographic SHA-256 integrity hash generated</li>
                <li>Stored in isolated private filesystem outside public access</li>
                <li>Citizen personal data protected under strict RBAC controls</li>
              </ul>
            </Card>

            <Card className="p-4 bg-amber-50/70 border-amber-200 text-[11px] text-amber-900 space-y-1.5">
              <div className="font-bold flex items-center gap-1.5 text-amber-800">
                <Info className="w-4 h-4" />
                <span>Notice on Demo Deed #3463</span>
              </div>
              <p className="leading-relaxed">
                Clicking <b>"Load Demo Deed"</b> loads the sample document for Survey <b>132/1</b> in Payanatham, Dharmapuri. This enables you to test the complete discrepancy verification workflow!
              </p>
            </Card>
          </div>
        </div>
      )}

      {/* PHASE 2: OCR PIPELINE ANIMATION (shown during processing) */}
      {isProcessing && !submissionData && (
        <Card className="p-8 text-center space-y-6">
          <div>
            <Sparkles className="w-10 h-10 text-sky-500 animate-spin mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-900">AI Land Record Extraction Engine</h3>
            <p className="text-xs text-slate-500">Processing optical character recognition and field structuring</p>
          </div>

          <div className="max-w-md mx-auto space-y-2 text-left">
            {pipelineSteps.map((step, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-lg text-xs flex items-center justify-between border transition-all ${
                  idx < currentStepIndex
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-medium'
                    : idx === currentStepIndex
                    ? 'bg-sky-50 border-sky-300 text-sky-800 font-bold animate-pulse'
                    : 'bg-slate-50 border-slate-100 text-slate-400'
                }`}
              >
                <span>{step}</span>
                {idx < currentStepIndex && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                {idx === currentStepIndex && <Clock className="w-4 h-4 text-sky-600 animate-spin" />}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* PHASE 3: SIDE-BY-SIDE REVIEW & SUBMISSION */}
      {submissionData && (
        <div className="space-y-6">
          {/* Top Legal Disclaimer Notice */}
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-900 text-xs flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-950">AI Confidence & Legal Notice:</p>
              <p className="text-amber-800 leading-relaxed mt-0.5">{OCR_DISCLAIMER}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Side: Original Document Preview */}
            <div className="lg:col-span-5">
              <Card className="p-4 space-y-3 h-full flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-800">Original Document Preview</span>
                    <Badge variant="outline" className="text-[10px] font-mono">
                      {submissionData.submission_reference}
                    </Badge>
                  </div>
                  <div className="mt-3 p-4 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] leading-relaxed whitespace-pre-line min-h-[320px] max-h-[420px] overflow-y-auto border border-slate-800 shadow-inner">
                    {submissionData.ocr_result.raw_text || "Document text content extracted"}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
                  <span>File: {selectedFile?.name || "Uploaded Document"}</span>
                  <span className="text-emerald-600 font-semibold">
                    Overall OCR: {submissionData.ocr_result.overall_confidence.toFixed(1)}%
                  </span>
                </div>
              </Card>
            </div>

            {/* Right Side: Extracted Structured Data (Editable) */}
            <div className="lg:col-span-7">
              <Card className="p-5 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Extracted Structured Fields
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      You may correct obvious OCR transcription errors prior to submitting to the officer.
                    </p>
                  </div>
                  <Badge variant="digitized" className="text-[10px]">
                    OCR Completed
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="font-semibold text-slate-700">Survey / Gut Number</label>
                      <span className="text-[10px] font-bold text-emerald-600">
                        {submissionData.ocr_result.field_confidences?.survey_number || 97}%
                      </span>
                    </div>
                    <input
                      type="text"
                      value={editedFields.survey_number || ''}
                      onChange={(e) => handleFieldChange('survey_number', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="font-semibold text-slate-700">Registered Owner Name</label>
                      <span className="text-[10px] font-bold text-emerald-600">
                        {submissionData.ocr_result.field_confidences?.owner_name || 96}%
                      </span>
                    </div>
                    <input
                      type="text"
                      value={editedFields.owner_name || ''}
                      onChange={(e) => handleFieldChange('owner_name', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="font-semibold text-slate-700">Land Area / Extent</label>
                      <span className="text-[10px] font-bold text-emerald-600">
                        {submissionData.ocr_result.field_confidences?.area || 91}%
                      </span>
                    </div>
                    <input
                      type="text"
                      value={editedFields.area || ''}
                      onChange={(e) => handleFieldChange('area', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="font-semibold text-slate-700">Village</label>
                      <span className="text-[10px] font-bold text-emerald-600">
                        {submissionData.ocr_result.field_confidences?.village || 95}%
                      </span>
                    </div>
                    <input
                      type="text"
                      value={editedFields.village || ''}
                      onChange={(e) => handleFieldChange('village', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="font-semibold text-slate-700">Taluk</label>
                      <span className="text-[10px] font-bold text-emerald-600">
                        {submissionData.ocr_result.field_confidences?.taluk || 93}%
                      </span>
                    </div>
                    <input
                      type="text"
                      value={editedFields.taluk || ''}
                      onChange={(e) => handleFieldChange('taluk', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="font-semibold text-slate-700">District</label>
                      <span className="text-[10px] font-bold text-emerald-600">
                        {submissionData.ocr_result.field_confidences?.district || 98}%
                      </span>
                    </div>
                    <input
                      type="text"
                      value={editedFields.district || ''}
                      onChange={(e) => handleFieldChange('district', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="font-semibold text-slate-700">Document / Deed Number</label>
                      <span className="text-[10px] font-bold text-emerald-600">
                        {submissionData.ocr_result.field_confidences?.document_number || 94}%
                      </span>
                    </div>
                    <input
                      type="text"
                      value={editedFields.document_number || ''}
                      onChange={(e) => handleFieldChange('document_number', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="font-semibold text-slate-700">Document Date</label>
                      <span className="text-[10px] font-bold text-emerald-600">
                        {submissionData.ocr_result.field_confidences?.document_date || 92}%
                      </span>
                    </div>
                    <input
                      type="text"
                      value={editedFields.document_date || ''}
                      onChange={(e) => handleFieldChange('document_date', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-[11px] text-slate-500">
                    Reference: <b className="font-mono text-slate-800">{submissionData.submission_reference}</b>
                  </span>
                  <Button
                    onClick={() => setShowConfirmModal(true)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-5 py-2.5 font-semibold flex items-center gap-2 shadow-md shadow-emerald-950/20"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit to Revenue Officer</span>
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center mx-auto">
              <Send className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1.5">
              <h3 className="text-base font-bold text-slate-900">Confirm Officer Submission</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                "Your digitized land record will be submitted to a Revenue Officer for validation against existing records."
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 border border-slate-200 text-slate-700">
              <div><b>Survey Number:</b> {editedFields.survey_number}</div>
              <div><b>Owner Name:</b> {editedFields.owner_name}</div>
              <div><b>Land Area:</b> {editedFields.area}</div>
              <div><b>Village / District:</b> {editedFields.village}, {editedFields.district}</div>
            </div>

            <p className="text-[11px] text-slate-400 text-center">
              Once submitted, the record is locked for Revenue Officer review and cannot be edited.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setShowConfirmModal(false)}
                className="text-xs py-2"
              >
                Back to Review
              </Button>
              <Button
                onClick={handleSubmitToOfficer}
                disabled={isSubmittingToOfficer}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs py-2 font-semibold"
              >
                {isSubmittingToOfficer ? 'Submitting...' : 'Confirm Submission'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
