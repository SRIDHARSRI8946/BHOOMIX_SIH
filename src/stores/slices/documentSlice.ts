import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LandDocument } from '../../types/document';
import { mockDocuments } from '../../features/documents/api';

interface DocumentState {
  documents: LandDocument[];
  selectedDocument: LandDocument | null;
  isProcessing: boolean;
  filterType: string;
  filterStatus: string;
}

const initialState: DocumentState = {
  documents: mockDocuments,
  selectedDocument: mockDocuments[0] || null,
  isProcessing: false,
  filterType: 'all',
  filterStatus: 'all',
};

export const documentSlice = createSlice({
  name: 'document',
  initialState,
  reducers: {
    setDocuments: (state, action: PayloadAction<LandDocument[]>) => {
      state.documents = action.payload;
    },
    setSelectedDocument: (state, action: PayloadAction<LandDocument | null>) => {
      state.selectedDocument = action.payload;
    },
    addDocument: (state, action: PayloadAction<LandDocument>) => {
      state.documents.unshift(action.payload);
      state.selectedDocument = action.payload;
    },
    updateDocumentStatus: (
      state,
      action: PayloadAction<{ id: string; status: LandDocument['status'] }>
    ) => {
      const doc = state.documents.find((d) => d.id === action.payload.id);
      if (doc) {
        doc.status = action.payload.status;
      }
      if (state.selectedDocument?.id === action.payload.id) {
        state.selectedDocument.status = action.payload.status;
      }
    },
    setIsProcessing: (state, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload;
    },
    setFilterType: (state, action: PayloadAction<string>) => {
      state.filterType = action.payload;
    },
    setFilterStatus: (state, action: PayloadAction<string>) => {
      state.filterStatus = action.payload;
    },
  },
});

export const {
  setDocuments,
  setSelectedDocument,
  addDocument,
  updateDocumentStatus,
  setIsProcessing,
  setFilterType,
  setFilterStatus,
} = documentSlice.actions;

export default documentSlice.reducer;
