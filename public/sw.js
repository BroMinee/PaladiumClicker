self.addEventListener("notificationclick", (event) => {
    event.notification.close(); // Ferme la notification
    const targetUrl = event.notification.data?.url;
    event.waitUntil(clients.openWindow(targetUrl));
});
