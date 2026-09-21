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
  activeFilterState: 'Tamil Nadu',
  activeFilterDistrict: 'Dharmapuri',
  notifications: [
    {
      id: 'n1',
      title: 'Discrepancy Detected',
      message: 'Survey #132/1 Payanatham Village flagged for Land Extent source notation verification.',
      type: 'warning',
      timestamp: 'Just now',
      read: false,
    },
    {
      id: 'n2',
      title: 'Tamil Nadu Land Registry Online',
      message: 'Dharmapuri District Revenue Division reference database synchronized.',
      type: 'success',
      timestamp: '15 mins ago',
      read: false,
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
