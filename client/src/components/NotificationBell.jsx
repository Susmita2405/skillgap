import { useEffect, useState } from "react";

import {
  Bell,
  Check
} from "lucide-react";

import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead
} from "../services/notificationService";

export default function NotificationBell() {
  const [open, setOpen] =
    useState(false);

  const [notifications, setNotifications] =
    useState([]);

  const [unread, setUnread] =
    useState(0);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications =
    async () => {
      try {
        const response =
          await getNotifications();

        setNotifications(
          response.data.notifications || []
        );

        setUnread(
          response.data.unread || 0
        );
      } catch (error) {
        console.error(error);
      }
    };

  const readNotification =
    async (id) => {
      try {
        await markNotificationRead(id);

        await loadNotifications();
      } catch (error) {
        console.error(error);
      }
    };

  const readAll =
    async () => {
      try {
        await markAllNotificationsRead();

        await loadNotifications();
      } catch (error) {
        console.error(error);
      }
    };

  return (
    <div className="relative">

      <button
        onClick={() =>
          setOpen(!open)
        }
        className="relative p-3 rounded-xl hover:bg-slate-800"
      >
        <Bell size={20} />

        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-500 text-xs flex items-center justify-center">
            {unread > 9
              ? "9+"
              : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-96 max-w-[90vw] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50">

          <div className="p-4 border-b border-slate-800 flex justify-between">

            <h3 className="font-semibold">
              Notifications
            </h3>

            {unread > 0 && (
              <button
                onClick={readAll}
                className="text-xs text-blue-400"
              >
                Mark all read
              </button>
            )}

          </div>

          <div className="max-h-96 overflow-y-auto">

            {notifications.length === 0 ? (
              <p className="p-6 text-center text-slate-500">
                No notifications.
              </p>
            ) : (
              notifications.map(
                (notification) => (
                  <button
                    key={notification._id}
                    onClick={() =>
                      readNotification(
                        notification._id
                      )
                    }
                    className={`w-full text-left p-4 border-b border-slate-800 hover:bg-slate-800 ${
                      !notification.read
                        ? "bg-blue-500/5"
                        : ""
                    }`}
                  >

                    <div className="flex gap-3">

                      <div className="mt-1">
                        {notification.read ? (
                          <Check
                            size={16}
                            className="text-green-400"
                          />
                        ) : (
                          <Bell
                            size={16}
                            className="text-blue-400"
                          />
                        )}
                      </div>

                      <div>
                        <p className="font-medium">
                          {notification.title}
                        </p>

                        <p className="text-sm text-slate-400 mt-1">
                          {notification.message}
                        </p>

                        <p className="text-xs text-slate-600 mt-2">
                          {new Date(
                            notification.createdAt
                          ).toLocaleString()}
                        </p>
                      </div>

                    </div>

                  </button>
                )
              )
            )}

          </div>

        </div>
      )}

    </div>
  );
}