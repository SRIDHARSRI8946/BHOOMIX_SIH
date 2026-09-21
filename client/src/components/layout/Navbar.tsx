import React, { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';
import { Bell, Search, Menu, LogOut, ShieldCheck, ChevronDown, CheckCircle } from 'lucide-react';
import { STATES_DISTRICTS } from '../../lib/constants';
import { ShiftingDropDown } from '../ui/ShiftingDropDown';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { toggleSidebar, activeFilterState, activeFilterDistrict, setStateFilter, setDistrictFilter, notifications, markNotificationAsRead } = useUIStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 h-16 px-4 sm:px-6 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg focus:outline-none"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* State & District Selector Bar */}
        <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs">
          <span className="text-slate-500 font-medium">Jurisdiction:</span>
          <span className="bg-[#0b2545] text-white px-2 py-0.5 rounded text-[11px] font-bold tracking-wide">
            Tamil Nadu
          </span>
          <span className="text-slate-300">/</span>
          <select
            value={activeFilterDistrict}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="bg-transparent text-slate-800 font-bold focus:outline-none cursor-pointer"
          >
            {STATES_DISTRICTS["Tamil Nadu"]?.map((d) => (
              <option key={d} value={d}>{d} District</option>
            ))}
          </select>
        </div>
      </div>

      {/* Global Shifting Dropdown & Search Bar */}
      <div className="flex-1 max-w-xl mx-4 hidden lg:flex items-center gap-4">
        <ShiftingDropDown />
      </div>

      {/* Right User Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                <h4 className="font-semibold text-sm text-slate-900">Notifications</h4>
                <span className="text-xs text-slate-500">{unreadCount} unread</span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationAsRead(n.id)}
                    className={`p-3 text-xs cursor-pointer transition-colors hover:bg-slate-50 ${!n.read ? 'bg-blue-50/40' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-slate-800">{n.title}</span>
                      <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                    </div>
                    <p className="text-slate-600 leading-snug">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <img
              src={user?.avatarUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150"}
              alt="Avatar"
              className="w-8 h-8 rounded-full border border-slate-200 object-cover"
            />
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-slate-900 leading-none">{user?.name || "Officer User"}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{user?.role?.replace('_', ' ')}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                <div className={`mt-1 flex items-center gap-1 text-[10px] px-2 py-0.5 rounded w-max ${
                  user?.role === 'CITIZEN' ? 'text-sky-700 bg-sky-50' : 'text-emerald-700 bg-emerald-50'
                }`}>
                  <ShieldCheck className="w-3 h-3" />
                  <span>{user?.role === 'CITIZEN' ? 'Registered Citizen' : 'Revenue Officer'}</span>
                </div>
              </div>
              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
