import { Button } from '../../ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../../ui/sheet';
import { CheckCheck, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { IconNotification } from '@tabler/icons-react';
import { fetchWithAuth } from '../../../utils/fetch-with-auth';

export function NotificationSheet() {
  const [notifications, setNotifications] = useState<
    {
      is_read: boolean | number;
      id: string;
      message: string;
      createdAt: Date;
    }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const getNotifications = async () => {
    const response = await fetchWithAuth('/admin-api/ledger/notifications/');
    if (!response?.ok) throw new Error('Failed to fetch notifications');
    return response?.json();
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetchWithAuth(`/admin-api/ledger/notifications/${notificationId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_read: true }),
      });

      if (!response?.ok) throw new Error('Failed to update notification status');
      setNotifications(prevNotifications =>
        prevNotifications
          .map(notification =>
            notification.id === notificationId ? { ...notification, is_read: true } : notification,
          )
          .sort((a, b) => Number(a.is_read) - Number(b.is_read)),
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();
        setNotifications(
          data.sort(
            (a: { is_read: boolean; id: string }, b: { is_read: boolean; id: string }) =>
              Number(a.is_read) - Number(b.is_read),
          ),
        );
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          iconPlacement="right"
          size="sm"
          Icon={IconNotification}
          className="text-white bg-primary hover:bg-primary/90"
        >
          Notifications{' '}
          <span className="m-auto ml-2 text-xs rounded-full bg-white/10 size-4">
            {notifications.length}
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="top"
        className="flex flex-col min-h-40 max-h-[30rem] overflow-y-scroll border-none [background:linear-gradient(269.75deg,_#011049,_#19112f_25.75%,_#251431_51.79%,_#301941_64.24%,_#6e3050)]"
      >
        <SheetHeader className="pl-5">
          <SheetTitle className="text-2xl text-neutral-200">Notifications</SheetTitle>
          <SheetDescription className="text-sm text-neutral-400">
            All your notifications in one place
          </SheetDescription>
        </SheetHeader>
        <div className="p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-20">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : notifications.length > 0 ? (
            notifications.map(notification => (
              <div
                key={notification.id}
                className="grid grid-cols-[7fr_1fr] p-5 mb-4 rounded-lg bg-white/10"
              >
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-neutral-200">{notification.message}</p>
                  <p className="text-xs text-neutral-400">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                  <p className="px-2 text-xs rounded-full text-neutral-50 bg-white/20 max-w-max">
                    {notification.is_read ? 'Read' : 'Unread'}
                  </p>
                </div>
                {!notification.is_read && (
                  <Button
                    onClick={() => markAsRead(notification.id)}
                    className="mt-2 ml-auto text-white rounded-lg bg-primary hover:bg-primary/90 animation"
                    size="sm"
                  >
                    <CheckCheck className="m-auto size-5" strokeWidth={2} />
                  </Button>
                )}
              </div>
            ))
          ) : (
            <p className="text-neutral-400">No notifications available.</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
