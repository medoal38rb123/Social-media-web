import { axiosInterseptore } from "../AxiosInterseptore";
import type { NotificationsResponseType, ReadAllNotifications, UnreadNotificationsCount } from "./Notifications.interface";

export async function getNotifications(page = 1) {
  const res = await axiosInterseptore.get<NotificationsResponseType>(
    `/notifications?unread=false&page=${page}&limit=10`
  );

  return res.data.data.notifications;
}

export async function readNotification(notificationId:string) {
    const res = await axiosInterseptore.patch<NotificationsResponseType>(`/notifications/${notificationId}/read`)

    return res.data.data.notifications
}

export async function readAllNotifications() {
    const res = await axiosInterseptore.patch<ReadAllNotifications>(`/notifications/read-all`)

    return res.data.data.modifiedCount
}

export async function getUnreadNotificationsCount() {
    const res = await axiosInterseptore.get<UnreadNotificationsCount>(`/notifications/unread-count`)

    return res.data.data.unreadCount
}

