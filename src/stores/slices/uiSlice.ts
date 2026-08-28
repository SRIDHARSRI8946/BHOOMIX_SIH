import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}

interface UIState {
  sidebarOpen: boolean;
  activeFilterState: string;
  activeFilterDistrict: string;
  notifications: NotificationItem[];
}

const initialState: UIState = {
  sidebarOpen: true,
  activeFilterState: 'Maharashtra',
  activeFilterDistrict: 'Pune',
  notifications: [
    {
      id: 'n1',
      title: 'Discrepancy Flagged',
      message: 'Plot #142/A boundary discrepancy detected in Haveli Taluka.',
      type: 'warning',
      timestamp: '10 mins ago',
      read: false,
    },
    {
      id: 'n2',
      title: 'OCR Batch Completed',
      message: '15 Saat Bara (7/12) records successfully digitized.',
      type: 'success',
      timestamp: '1 hour ago',
      read: false,
    },
  ],
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setStateFilter: (state, action: PayloadAction<string>) => {
      state.activeFilterState = action.payload;
    },
    setDistrictFilter: (state, action: PayloadAction<string>) => {
      state.activeFilterDistrict = action.payload;
    },
    markNotificationRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find((n) => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    addNotification: (state, action: PayloadAction<Omit<NotificationItem, 'id' | 'read' | 'timestamp'>>) => {
      state.notifications.unshift({
        ...action.payload,
        id: `notif_${Date.now()}`,
        timestamp: 'Just now',
        read: false,
      });
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setStateFilter,
  setDistrictFilter,
  markNotificationRead,
  addNotification,
} = uiSlice.actions;

export default uiSlice.reducer;
