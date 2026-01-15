import { Check } from 'lucide-react';
import type { Notification } from '../../App';
import { Button } from '../ui/Button';

interface NotificationsPanelProps {
  notifications: Notification[];
  onClose: () => void;
  onNotificationsUpdate: (notifications: Notification[]) => void;
}

export function NotificationsPanel({ notifications, onClose, onNotificationsUpdate }: NotificationsPanelProps) {
  const markAsRead = (id: string) => {
    onNotificationsUpdate(
      notifications.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    onNotificationsUpdate(
      notifications.map(n => ({ ...n, read: true }))
    );
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-neutral-200 z-50">
        <div className="px-4 py-3 border-b border-neutral-200 flex items-center justify-between">
          <h3 className="text-sm text-neutral-900">Notifications</h3>
          {notifications.some(n => !n.read) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs"
            >
              Mark all as read
            </Button>
          )}
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-neutral-500">
              No notifications
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`px-4 py-3 border-b border-neutral-100 hover:bg-neutral-50 transition-colors ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <p className="text-sm text-neutral-900">{notification.message}</p>
                    <p className="text-xs text-neutral-500 mt-1">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="text-blue-600 hover:text-blue-700"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
