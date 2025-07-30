export const unreadNotificationsFunc = (notifications) => {
    return notifications.filter((n) => n.isRead === false)   // filter will return an array
}