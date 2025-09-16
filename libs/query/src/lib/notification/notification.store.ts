import { localStore, zustandStore } from '@rumsan/react-query';
import { StoreApi, UseBoundStore } from 'zustand';

interface Notification {
  id: number;
  title: string;
  createdAt: string;
  description?: string;
  notify: boolean;
  group: string;
  projectId: string | null;
}

const initialStore = {
  notifications: [],
  meta: {},
};

type NotificationState = {
  notifications: Notification[];
  meta: any;
};

type NotificationStateAction = {
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  updateNotification: (id: number, updates: Partial<Notification>) => void;
  removeNotification: (id: number) => void;
  setMeta: (meta: any) => void;
};

type NotificationStore = NotificationState & NotificationStateAction;

export const useNotificationStore: UseBoundStore<StoreApi<NotificationStore>> =
  zustandStore<NotificationStore>(
    (set) => ({
      ...initialStore,
      setNotifications: (notifications) => set({ notifications }),
      addNotification: (notification) =>
        set((state) => ({
          notifications: [...state.notifications, notification],
        })),
      updateNotification: (id, updates) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, ...updates } : n,
          ),
        })),
      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),
      setMeta: (meta) => set({ meta }),
    }),
    {
      devtoolsEnabled: true,
      persistOptions: {
        name: 'aaNotificationStore',
        storage: localStore,
      },
    },
  );
