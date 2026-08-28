export type DocumentStatus = 'pending' | 'processing' | 'digitized' | 'verified' | 'discrepancy' | 'rejected';

export interface ExtractedField {
  key: string;
  label: string;
  value: string | number;
  confidence: number; // 0 - 100
  boundingPoly?: { x: number; y: number; width: number; height: number };
  isFlagged?: boolean;
}

export interface LandDocument {
  id: string;
  title: string;
  documentType: string;
  documentNumber: string;
  state: string;
  district: string;
  taluka: string;
  village: string;
  surveyNumber: string;
  fileUrl: string;
  fileSize: string;
  uploadedBy: string;
  uploadedAt: string;
  status: DocumentStatus;
  ocrAccuracy: number;
  extractedFields: ExtractedField[];
  discrepancies?: string[];
}
