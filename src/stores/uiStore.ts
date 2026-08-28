import { create } from 'zustand';

interface Notification {
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
  notifications: Notification[];
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setStateFilter: (state: string) => void;
  setDistrictFilter: (district: string) => void;
  markNotificationAsRead: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
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
    {
      id: 'n3',
      title: 'Verification Request',
      message: 'Surveyor submitted updated cadastral map for review.',
      type: 'info',
      timestamp: '3 hours ago',
      read: true,
    },
  ],

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setStateFilter: (state) => set({ activeFilterState: state }),
  setDistrictFilter: (district) => set({ activeFilterDistrict: district }),
  markNotificationAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
}));
