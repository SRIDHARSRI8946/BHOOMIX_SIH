import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import {
  GitCompare,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCw,
  ShieldCheck,
  ShieldAlert,
  Send,
  Database,
  ArrowRight,
  Info,
  UserCheck,
  Calendar,
  Layers,
  Check,
  X,
  RefreshCw,
  Clock
} from 'lucide-react';
import api, { getPdfDownloadUrl } from '../../../lib/axios';
import { useAuthStore } from '../../../stores/authStore';
import { MATCH_STATUS_COLORS, DEMO_DATA_NOTICE, PROTOTYPE_NOTICE } from '../../../lib/constants';

export const VerificationScreenPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const submissionIdParam = searchParams.get('id');

  const [submissionsList, setSubmissionsList] = useState<any[]>([]);
  const [selectedSubId, setSelectedSubId] = useState<number | null>(
    submissionIdParam ? parseInt(submissionIdParam, 10) : null
  );
  const [comparisonData, setComparisonData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(100);

  // Manual verification modal state
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualDecision, setManualDecision] = useState<string>('MANUAL_VERIFICATION_COMPLETED');
  const [manualRemarks, setManualRemarks] = useState('');
  const [supportingNotes, setSupportingNotes] = useState('');
  const [isSubmittingManual, setIsSubmittingManual] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Approve dialog
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [approvalRemarks, setApprovalRemarks] = useState('All attributes cross-checked and verified against physical scanned documentation.');
  const [isApproving, setIsApproving] = useState(false);

  // Rejection dialog
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('Significant mismatch with reference records');
  const [rejectRemarks, setRejectRemarks] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  useEffect(() => {
    fetchSubmissionsQueue();
  }, []);

  useEffect(() => {
    if (selectedSubId) {
      loadComparison(selectedSubId);
    }
  }, [selectedSubId]);

  const fetchSubmissionsQueue = async () => {
    try {
      const res = await api.get('/officer/submissions');
      const list = res.data || [];
      setSubmissionsList(list);
      if (!selectedSubId && list.length > 0) {
        setSelectedSubId(list[0].id);
      }
    } catch (e) {
      console.error('Failed to load queue', e);
    } finally {
      setLoading(false);
    }
  };

  const loadComparison = async (subId: number) => {
    setLoading(true);
    setActionSuccessMsg(null);
    try {
      const res = await api.get(`/officer/submissions/${subId}/comparison`);
      setComparisonData(res.data);
      if (res.data?.discrepancy_message) {
        setManualRemarks(
          "Examined original historical deed. Source notation 0.97.5 confirmed against surveyed 1.20 Acres. Discrepancy reconciled."
        );
      }
    } catch (e) {
      console.error('Failed to load comparison', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSetUnderProgress = async () => {
    if (!selectedSubId) return;
    setIsSubmittingManual(true);
    try {
      const res = await api.post(`/officer/submissions/${selectedSubId}/manual-verification`, {
        decision: 'UNDER_PROGRESS',
        remarks: manualRemarks.trim() || 'Officer manual verification is under progress. Physical deed examination ongoing.',
        supporting_notes: supportingNotes,
      });
      setActionSuccessMsg('Status updated: Under Manual Verification (Under Progress)');
      setShowManualModal(false);
      loadComparison(selectedSubId);
      fetchSubmissionsQueue();
    } catch (e: any) {
      alert(e.response?.data?.detail || 'Failed to update verification status.');
    } finally {
      setIsSubmittingManual(false);
    }
  };

  const handleCompleteManualVerification = async () => {
    if (!selectedSubId) return;
    setIsSubmittingManual(true);
    try {
      const res = await api.post(`/officer/submissions/${selectedSubId}/manual-verification`, {
        decision: 'MANUAL_VERIFICATION_COMPLETED',
        remarks: manualRemarks.trim() || 'Examined original historical deed. Source notation confirmed against surveyed 1.20 Acres. Discrepancy reconciled.',
        supporting_notes: supportingNotes,
      });
      setActionSuccessMsg('✓ Manual verification completed. Field matrix re-validated and ready for approval.');
      setShowManualModal(false);
      loadComparison(selectedSubId);
      fetchSubmissionsQueue();
    } catch (e: any) {
      alert(e.response?.data?.detail || 'Failed to complete manual verification.');
    } finally {
      setIsSubmittingManual(false);
    }
  };

  const handleManualVerificationSubmit = async () => {
    if (!selectedSubId || !manualRemarks.trim()) return;
    setIsSubmittingManual(true);
    try {
      const res = await api.post(`/officer/submissions/${selectedSubId}/manual-verification`, {
        decision: manualDecision,
        remarks: manualRemarks,
        supporting_notes: supportingNotes,
      });
      setActionSuccessMsg(`Verification action saved: ${res.data.status}`);
      setShowManualModal(false);
      loadComparison(selectedSubId);
      fetchSubmissionsQueue();
    } catch (e: any) {
      alert(e.response?.data?.detail || "Failed to submit manual verification.");
    } finally {
      setIsSubmittingManual(false);
    }
  };

  const handleApproveSubmit = async () => {
    if (!selectedSubId || !approvalRemarks.trim()) return;
    setIsApproving(true);
    try {
      const res = await api.post(`/officer/submissions/${selectedSubId}/approve`, {
        remarks: approvalRemarks,
      });
      setActionSuccessMsg(`Record formally approved. Reference: ${res.data.approval_reference}`);
      setShowApproveModal(false);
      loadComparison(selectedSubId);
      fetchSubmissionsQueue();
    } catch (e: any) {
      alert(e.response?.data?.detail || "Failed to approve record.");
    } finally {
      setIsApproving(false);
    }
  };

  const handleRejectSubmit = async () => {
    if (!selectedSubId || !rejectRemarks.trim()) return;
    setIsRejecting(true);
    try {
      await api.post(`/officer/submissions/${selectedSubId}/reject`, {
        reason: rejectReason,
        remarks: rejectRemarks,
      });
      setActionSuccessMsg("Submission rejected.");
      setShowRejectModal(false);
      loadComparison(selectedSubId);
      fetchSubmissionsQueue();
    } catch (e: any) {
      alert(e.response?.data?.detail || "Failed to reject submission.");
    } finally {
      setIsRejecting(false);
    }
  };

  const downloadPdf = (subId: number) => {
    window.open(getPdfDownloadUrl(subId), '_blank');
  };

  const isApproved = comparisonData?.approval_status === 'APPROVED';
  const isRejected = comparisonData?.approval_status === 'REJECTED';
  const isManualCompleted = comparisonData?.approval_status === 'MANUAL_VERIFICATION_COMPLETED' || comparisonData?.validation_status === 'MANUAL_VERIFICATION_COMPLETED';
  const isUnderProgress = comparisonData?.approval_status === 'UNDER_MANUAL_VERIFICATION' || comparisonData?.validation_status === 'UNDER_MANUAL_VERIFICATION';
  const hasDiscrepancy = (comparisonData?.status === 'DISCREPANCY_DETECTED' || comparisonData?.requires_manual_verification || comparisonData?.approval_status === 'MANUAL_VERIFICATION_REQUIRED') && !isManualCompleted && !isApproved;

  return (
    <div className="space-y-6">
      {/* Top Header & Queue Selector */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-semibold uppercase tracking-wider mb-1">
            <GitCompare className="w-4 h-4" /> Three-Section Revenue Verification Engine
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Citizen OCR Record vs Reference Land Database
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cross-referencing historical scanned deed against simulated reference records
          </p>
        </div>

        {/* Record Selection Dropdown */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="font-semibold whitespace-nowrap">Submission:</span>
            <select
              value={selectedSubId || ''}
              onChange={(e) => setSelectedSubId(parseInt(e.target.value, 10))}
              className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 font-semibold text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
            >
              {submissionsList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.submission_reference} — Survey {s.survey_number} ({s.owner_name})
                </option>
              ))}
            </select>
          </div>

          <Button
            variant="outline"
            onClick={() => selectedSubId && loadComparison(selectedSubId)}
            className="text-xs p-2"
            title="Refresh record comparison"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {actionSuccessMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">{actionSuccessMsg}</span>
          </div>
          {isApproved && (
            <Button
              onClick={() => selectedSubId && downloadPdf(selectedSubId)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-1.5 flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              Download Approval PDF
            </Button>
          )}
        </div>
      )}

      {/* 1. DISCREPANCY DETECTED BANNER (Before Manual Verification) */}
      {hasDiscrepancy && !isUnderProgress && !isApproved && !isManualCompleted && (
        <div className="bg-rose-50 border-2 border-rose-300 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-rose-100 text-rose-700 rounded-xl shrink-0 mt-0.5">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase px-2 py-0.5 rounded bg-rose-600 text-white tracking-wider">
                  DISCREPANCY DETECTED
                </span>
                <span className="text-xs font-semibold text-rose-900">
                  Revenue Officer verification required
                </span>
              </div>
              <p className="text-xs text-rose-800 mt-1 font-medium leading-relaxed">
                {comparisonData?.discrepancy_message || "Land extent / source notation differs from the reference record."}
              </p>
            </div>
          </div>

          <Button
            onClick={() => setShowManualModal(true)}
            className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-rose-950/20 shrink-0 flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>START MANUAL VERIFICATION</span>
          </Button>
        </div>
      )}

      {/* 2. UNDER PROGRESS IN RED BOX (Officer selected Under Process) */}
      {isUnderProgress && !isManualCompleted && !isApproved && (
        <div className="bg-red-50 border-2 border-red-500 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm animate-in fade-in">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-red-100 text-red-700 rounded-xl shrink-0 mt-0.5 border border-red-200">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase px-2.5 py-1 rounded bg-red-600 text-white tracking-wider">
                  UNDER MANUAL VERIFICATION
                </span>
                <span className="text-xs font-bold text-red-900">
                  (Under Progress)
                </span>
              </div>
              <p className="text-xs text-red-800 mt-1 font-medium leading-relaxed">
                Officer examination of deed particulars and source notation is actively ongoing. This status is actively shown on both the Revenue Officer Dashboard and Citizen Portal.
              </p>
            </div>
          </div>

          <Button
            onClick={handleCompleteManualVerification}
            disabled={isSubmittingManual}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md shrink-0 flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSubmittingManual ? 'Processing...' : 'Complete Manual Verification'}</span>
          </Button>
        </div>
      )}

      {/* 3. MANUAL VERIFICATION COMPLETED IN GREEN BOX */}
      {isManualCompleted && !isApproved && (
        <div className="bg-emerald-50 border-2 border-emerald-500 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm animate-in fade-in">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl shrink-0 mt-0.5 border border-emerald-200">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase px-2.5 py-1 rounded bg-emerald-700 text-white tracking-wider">
                  MANUAL VERIFICATION COMPLETED
                </span>
                <span className="text-xs font-bold text-emerald-900">
                  Field Matrix Re-Validated & Reconciled
                </span>
              </div>
              <p className="text-xs text-emerald-800 mt-1 font-medium leading-relaxed">
                Source notation and historical deed examined by Revenue Officer. All 8 field-by-field verification matrix attributes are verified. Click Approve Record below to issue the official Approval PDF.
              </p>
            </div>
          </div>

          <Button
            onClick={() => setShowApproveModal(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-emerald-950/20 shrink-0 flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>APPROVE RECORD & ISSUE PDF</span>
          </Button>
        </div>
      )}

      {/* 4. OFFICIALLY APPROVED BANNER */}
      {isApproved && (
        <div className="bg-emerald-50 border-2 border-emerald-600 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm animate-in fade-in">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl shrink-0 mt-0.5 border border-emerald-300">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase px-2.5 py-1 rounded bg-emerald-800 text-white tracking-wider">
                  OFFICIALLY APPROVED
                </span>
                <span className="text-xs font-bold text-emerald-900">
                  Approval Ref: {comparisonData?.approval_record?.approval_reference || 'APV-2026'}
                </span>
              </div>
              <p className="text-xs text-emerald-800 mt-1 font-medium leading-relaxed">
                Record successfully verified and approved. The official Prototype Approval Certificate is available for download below.
              </p>
            </div>
          </div>

          <Button
            onClick={() => selectedSubId && downloadPdf(selectedSubId)}
            className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md shrink-0 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>DOWNLOAD APPROVAL PDF</span>
          </Button>
        </div>
      )}

      {/* THREE-SECTION LAYOUT: SECTION A, SECTION B, SECTION C */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* SECTION A: ORIGINAL CITIZEN DOCUMENT */}
        <div className="lg:col-span-4">
          <Card className="p-4 space-y-3 h-full flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    SECTION A: ORIGINAL CITIZEN DOCUMENT
                  </h3>
                </div>
                {/* Zoom Controls */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setZoomLevel(prev => Math.max(70, prev - 15))}
                    className="p-1 text-slate-500 hover:bg-slate-100 rounded"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-mono font-semibold text-slate-500 px-1">{zoomLevel}%</span>
                  <button
                    onClick={() => setZoomLevel(prev => Math.min(160, prev + 15))}
                    className="p-1 text-slate-500 hover:bg-slate-100 rounded"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Physical Scanned Document Viewer Simulation */}
              <div className="mt-3 bg-slate-950 rounded-xl p-4 overflow-auto max-h-[380px] min-h-[340px] border border-slate-800 shadow-inner">
                <div
                  style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left' }}
                  className="transition-transform duration-150 p-4 bg-amber-50/95 text-slate-900 rounded-lg shadow font-mono text-[11px] leading-relaxed border border-amber-200 space-y-2 select-text"
                >
                  <div className="text-center pb-2 border-b border-amber-300/80 font-bold uppercase text-slate-800 text-xs">
                    GOVERNMENT OF TAMIL NADU — REGISTRATION DEPT
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-700">
                    <span>Doc No: <b>3463 / 2003</b></span>
                    <span>Date: <b>11-07-2003</b></span>
                  </div>
                  <div className="text-[10px] text-slate-700">
                    Sub-Registrar Office: <b>Pappireddipatti</b>
                  </div>
                  <div className="text-[10px] text-slate-700">
                    Village: <b>Payanatham</b> | Taluk: <b>Pappireddipatti</b>
                  </div>
                  <div className="p-2 bg-amber-100/70 rounded border border-amber-300 my-1">
                    <div>Survey / Gut Number: <b className="text-slate-900 text-xs">132/1</b></div>
                    <div>Registered Owner: <b className="text-slate-900 text-xs">R. Ananthi</b></div>
                    <div>Land Extent (Scanned): <b className="text-rose-700 text-xs">1.20 Acres</b></div>
                    <div className="text-[10px] text-slate-600 mt-0.5">Classification: Ryotwari Punja</div>
                  </div>
                  <div className="text-[9px] text-slate-500 italic pt-1 border-t border-amber-200">
                    File: {comparisonData?.original_filename || "Deed_3463_Survey_132_1.pdf"}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-400 flex justify-between">
              <span>Citizen: <b>{comparisonData?.citizen?.name}</b></span>
              <span>SHA-256 Verified</span>
            </div>
          </Card>
        </div>

        {/* SECTION B: OCR DIGITAL RECORD */}
        <div className="lg:col-span-4">
          <Card className="p-4 space-y-3 h-full flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    SECTION B: OCR DIGITAL RECORD
                  </h3>
                </div>
                <Badge variant="digitized" className="text-[10px]">
                  Conf: {comparisonData?.citizen_record?.overall_confidence?.toFixed(1) || 94.2}%
                </Badge>
              </div>

              <div className="mt-3 space-y-2.5 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
                  <span className="text-slate-500">Registered Owner:</span>
                  <span className="font-bold text-slate-900">{comparisonData?.citizen_record?.owner_name || 'R. Ananthi'}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
                  <span className="text-slate-500">Survey Number:</span>
                  <span className="font-bold text-slate-900">{comparisonData?.citizen_record?.survey_number || '132/1'}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
                  <span className="text-slate-500">Submitted Land Extent:</span>
                  <span className="font-bold text-sky-700">{comparisonData?.citizen_record?.area || '1.20 Acres'}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
                  <span className="text-slate-500">Village / Taluk:</span>
                  <span className="font-bold text-slate-900">{comparisonData?.citizen_record?.village || 'Payanatham'} / {comparisonData?.citizen_record?.taluk || 'Pappireddipatti'}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
                  <span className="text-slate-500">Registration District:</span>
                  <span className="font-bold text-slate-900">{comparisonData?.citizen_record?.district || 'Dharmapuri'}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
                  <span className="text-slate-500">Document No & Date:</span>
                  <span className="font-bold text-slate-900">{comparisonData?.citizen_record?.document_number || '3463'} ({comparisonData?.citizen_record?.document_date || '2003-07-11'})</span>
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-sky-50 border border-sky-200 rounded-lg text-[10px] text-sky-800">
              ℹ️ Extracted using Indic-OCR parsing pipeline from uploaded image/PDF.
            </div>
          </Card>
        </div>

        {/* SECTION C: EXISTING LAND RECORD */}
        <div className="lg:col-span-4">
          <Card className="p-4 space-y-3 h-full flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    SECTION C: EXISTING REFERENCE RECORD
                  </h3>
                </div>
                <Badge variant="outline" className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border-emerald-300">
                  {comparisonData?.reference_record?.record_id || 'ER-001'}
                </Badge>
              </div>

              {comparisonData?.reference_record ? (
                <div className="mt-3 space-y-2.5 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
                    <span className="text-slate-500">Registered Owner:</span>
                    <span className="font-bold text-slate-900">{comparisonData.reference_record.owner_name}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
                    <span className="text-slate-500">Survey Number:</span>
                    <span className="font-bold text-slate-900">{comparisonData.reference_record.survey_number}</span>
                  </div>
                  <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-lg flex justify-between">
                    <span className="text-amber-800 font-semibold">Reference Land Extent:</span>
                    <span className="font-bold text-amber-900">
                      {comparisonData.reference_record.land_extent_text}
                      <span className="text-[10px] block text-amber-700">({comparisonData.reference_record.land_extent_unit})</span>
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
                    <span className="text-slate-500">Village / Taluk:</span>
                    <span className="font-bold text-slate-900">{comparisonData.reference_record.village} / {comparisonData.reference_record.taluk}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
                    <span className="text-slate-500">Registration District:</span>
                    <span className="font-bold text-slate-900">{comparisonData.reference_record.registration_district}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
                    <span className="text-slate-500">Document No & Date:</span>
                    <span className="font-bold text-slate-900">{comparisonData.reference_record.document_number} ({comparisonData.reference_record.document_date})</span>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-rose-600 space-y-2">
                  <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto" />
                  <p className="font-semibold">No Reference Record Found</p>
                  <p className="text-[11px] text-slate-500">Manual verification required by Revenue Officer.</p>
                </div>
              )}
            </div>

            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-[10px] text-amber-800">
              ⚠️ {DEMO_DATA_NOTICE}
            </div>
          </Card>
        </div>
      </div>

      {/* FIELD-BY-FIELD COMPARISON TABLE (Section 10 & 14) */}
      <Card className="p-0 overflow-hidden border-slate-200">
        <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-50/60">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Field-by-Field Discrepancy & Validation Matrix</h3>
            <p className="text-xs text-slate-500">Transparent comparison of submitted OCR fields against reference land database</p>
          </div>

          <div className="flex items-center gap-2">
            {!isApproved && (
              <>
                <Button
                  onClick={() => setShowManualModal(true)}
                  variant="outline"
                  className="text-xs border-amber-300 text-amber-800 hover:bg-amber-50 flex items-center gap-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Manual Verification
                </Button>
                <Button
                  onClick={() => {
                    if (hasDiscrepancy && !isManualCompleted) {
                      alert("This record has detected discrepancies. Please complete manual verification before issuing formal approval.");
                      setShowManualModal(true);
                      return;
                    }
                    setShowApproveModal(true);
                  }}
                  className={`${
                    isManualCompleted
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  } text-xs px-3.5 py-1.5 font-semibold flex items-center gap-1.5 shadow-xs`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Approve Record
                </Button>
                <Button
                  onClick={() => setShowRejectModal(true)}
                  variant="outline"
                  className="text-xs border-rose-300 text-rose-700 hover:bg-rose-50 flex items-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5" />
                  Reject
                </Button>
              </>
            )}

            {isApproved && (
              <Button
                onClick={() => selectedSubId && downloadPdf(selectedSubId)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-4 py-2 font-semibold flex items-center gap-2 shadow-md shadow-emerald-950/20"
              >
                <Download className="w-4 h-4" />
                <span>Download Official Prototype Approval PDF</span>
              </Button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-white uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="px-4 py-3">Field Attribute</th>
                <th className="px-4 py-3">Citizen OCR Submitted</th>
                <th className="px-4 py-3">Existing Reference Record</th>
                <th className="px-4 py-3">Match Status</th>
                <th className="px-4 py-3">Discrepancy / Validation Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {comparisonData?.validation_results?.map((row: any, idx: number) => {
                const isFieldVerified = row.match_status === 'MANUAL_VERIFICATION_COMPLETED' || row.match_status === 'VERIFIED_BY_OFFICER';
                const isFieldUnderProgress = row.match_status === 'UNDER_MANUAL_VERIFICATION';
                const style = MATCH_STATUS_COLORS[row.match_status] || {
                  bg: "bg-slate-50",
                  text: "text-slate-700",
                  border: "border-slate-200",
                };
                return (
                  <tr
                    key={idx}
                    className={`transition-colors ${
                      isFieldVerified
                        ? 'bg-emerald-50/50'
                        : isFieldUnderProgress
                        ? 'bg-red-50/50'
                        : row.match_status === 'MANUAL_VERIFICATION_REQUIRED'
                        ? 'bg-amber-50/50'
                        : row.match_status === 'MISMATCH'
                        ? 'bg-rose-50/50'
                        : 'hover:bg-slate-50/60'
                    }`}
                  >
                    <td className="px-4 py-3 font-bold text-slate-800">
                      {row.field_name}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {row.ocr_value || '—'}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {row.existing_value || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${style.bg} ${style.text} ${style.border}`}>
                        {isFieldVerified ? '✓ OFFICER VERIFIED' : row.match_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-[11px]">
                      {row.reason}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* MANUAL VERIFICATION MODAL */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">Revenue Officer Manual Verification</h3>
              </div>
              <button
                onClick={() => setShowManualModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Resolve detected discrepancies through physical deed inspection and authoritative revenue officer sign-off.
            </p>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-1 text-amber-900">
              <div className="font-bold">Detected Field Discrepancy:</div>
              <div><b>Land Extent:</b> Submitted <b>1.20 Acres</b> vs Reference <b>0.97.5 (SOURCE_NOTATION_REQUIRES_CONFIRMATION)</b></div>
              <div className="text-[11px] text-amber-800">Source notation requires Revenue Officer confirmation against physical deed before approval.</div>
            </div>

            <div className="space-y-3 pt-1">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Verification Option:
              </div>

              {/* Option 1: RED BOX - Under Progress */}
              <div className="p-4 rounded-xl border-2 border-red-500 bg-red-50/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-red-600 text-white rounded text-[10px] font-extrabold uppercase">
                      Option 1
                    </span>
                    <span className="font-bold text-red-950 text-sm">Under Progress</span>
                  </div>
                  <span className="text-[11px] font-semibold text-red-700 bg-red-100 px-2.5 py-0.5 rounded-full border border-red-200">
                    Status: Under Manual Verification
                  </span>
                </div>
                <p className="text-xs text-red-900 leading-relaxed">
                  Mark this record as actively being investigated. The status will immediately update to <b>"Under Manual Verification"</b> in both the Revenue Officer Dashboard and Citizen Portal.
                </p>
                <div className="pt-1">
                  <Button
                    onClick={handleSetUnderProgress}
                    disabled={isSubmittingManual}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-2 shadow-xs"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>{isSubmittingManual ? 'Updating...' : 'Set as Under Progress'}</span>
                  </Button>
                </div>
              </div>

              {/* Option 2: GREEN BOX - Manual Verification Completed */}
              <div className="p-4 rounded-xl border-2 border-emerald-500 bg-emerald-50/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-emerald-700 text-white rounded text-[10px] font-extrabold uppercase">
                      Option 2
                    </span>
                    <span className="font-bold text-emerald-950 text-sm">Manual Verification Completed</span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Re-Validates Matrix & Unlocks Approval
                  </span>
                </div>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  Confirms that the deed particulars have been inspected and discrepancy reconciled. Re-validates the field-by-field matrix with green checkmarks and unlocks formal approval.
                </p>

                <div>
                  <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                    Officer Verification Remarks:
                  </label>
                  <textarea
                    rows={2}
                    value={manualRemarks}
                    onChange={(e) => setManualRemarks(e.target.value)}
                    placeholder="Enter justification and deed inspection notes..."
                    className="w-full bg-white border border-emerald-300 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="pt-1">
                  <Button
                    onClick={handleCompleteManualVerification}
                    disabled={isSubmittingManual || !manualRemarks.trim()}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-2 shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isSubmittingManual ? 'Processing...' : 'Complete Manual Verification'}</span>
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <Button
                variant="outline"
                onClick={() => setShowManualModal(false)}
                className="text-xs py-1.5 px-4"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* APPROVE RECORD MODAL (Section 17) */}
      {showApproveModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">Confirm Land Record Approval</h3>
              <p className="text-xs text-slate-500">
                "Confirm that you have reviewed the submitted record and existing record."
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Officer Endorsement Remarks
              </label>
              <textarea
                rows={2}
                required
                value={approvalRemarks}
                onChange={(e) => setApprovalRemarks(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="p-2.5 bg-slate-50 rounded-lg text-[11px] text-slate-500 border border-slate-200">
              Approved record will generate an official Prototype Approval PDF containing verified particulars and a non-sensitive verification QR code.
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <Button
                variant="outline"
                onClick={() => setShowApproveModal(false)}
                className="text-xs py-2"
              >
                Cancel
              </Button>
              <Button
                onClick={handleApproveSubmit}
                disabled={isApproving || !approvalRemarks.trim()}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs py-2 font-semibold"
              >
                {isApproving ? 'Generating PDF...' : 'Approve & Issue PDF'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* REJECT SUBMISSION MODAL (Section 19) */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <X className="w-5 h-5 text-rose-600" />
              <h3 className="text-base font-bold text-slate-900">Reject Land Record Submission</h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Rejection Reason
              </label>
              <select
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-rose-500"
              >
                <option value="Significant mismatch">Significant mismatch</option>
                <option value="Insufficient information">Insufficient information</option>
                <option value="Existing record unavailable">Existing record unavailable</option>
                <option value="Document quality insufficient">Document quality insufficient</option>
                <option value="Manual verification unsuccessful">Manual verification unsuccessful</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Officer Remarks (Provided to Citizen)
              </label>
              <textarea
                rows={3}
                required
                value={rejectRemarks}
                onChange={(e) => setRejectRemarks(e.target.value)}
                placeholder="Explain the specific reasons for rejection..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <Button
                variant="outline"
                onClick={() => setShowRejectModal(false)}
                className="text-xs py-2"
              >
                Cancel
              </Button>
              <Button
                onClick={handleRejectSubmit}
                disabled={isRejecting || !rejectRemarks.trim()}
                className="bg-rose-600 hover:bg-rose-500 text-white text-xs py-2 font-semibold"
              >
                {isRejecting ? 'Rejecting...' : 'Confirm Rejection'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
