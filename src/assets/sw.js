self.addEventListener("push", function (event) {
  const data = event.data ? event.data.json() : {};
  const options = {
    body: data.body || "Cuerpo de la notificación",
    icon: "assets/icono.png",
    vibrate: [200, 100, 200],
    tag: "alerta-estado-cambio",
    renotify: true,
  };

  event.waitUntil(
    self.registration.showNotification(
      "Cambio de estado de la alerta",
      options,
    ),
  );
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close(); // Cerrar la notificación

  event.waitUntil(
    clients.openWindow("/send-more-info"), // Abre la página cuando el usuario hace clic en la notificación
  );
});
