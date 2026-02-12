
import React from 'react';
import { Notification } from '../types';

interface NotificationSystemProps {
  notifications: Notification[];
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({ notifications }) => {
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`px-4 py-3 rounded-lg shadow-lg border text-sm font-medium animate-slide-in
            ${notif.type === 'success' ? 'bg-emerald-900/90 border-emerald-500 text-emerald-100' : ''}
            ${notif.type === 'error' ? 'bg-red-900/90 border-red-500 text-red-100' : ''}
            ${notif.type === 'warning' ? 'bg-amber-900/90 border-amber-500 text-amber-100' : ''}
            ${notif.type === 'info' ? 'bg-slate-800/90 border-slate-500 text-slate-100' : ''}
          `}
        >
          {notif.message}
        </div>
      ))}
    </div>
  );
};

export default NotificationSystem;
