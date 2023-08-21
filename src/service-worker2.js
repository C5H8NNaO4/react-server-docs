let lastNotificationData = null;
self.addEventListener('push', function (event) {
  if (event.data) {
    try {
      const json = JSON.parse(event.data.text());
      const options = {};
      if (json.actions.includes('complete')) {
        Object.assign(options, {
          actions: [
            {
              action: `complete:${json.id}`,
              type: 'button',
              title: 'Complete',
            },
          ],
        });
      }
      lastNotificationData = json;
      showLocalNotification(json.title, json.body, self.registration, options);
    } catch (error) {
      showLocalNotification('Error', event.data.text(), self.registration);
    }
  } else {
    console.log('Push event but no data');
  }
});

self.addEventListener('notificationclick', (event) => {
  const clickedNotification = event.notification;
  clickedNotification.close();
  const [action, id] = event.action.split(':');
  const { token, clientId } = lastNotificationData;
  const bearer = `Bearer ${token}`;
  // Do something as the result of the notification click
  console.log('Headers', id, {
    Authorization: bearer,
    'X-Unique-Id': clientId,
  });
  if (action === 'complete') {
    try {
        const promise = fetch(`http://backend.state-less.cloud/todos/${id}/toggle`, {
        method: 'GET',
        headers: {
          Authorization: bearer,
          'X-Unique-Id': clientId,
        },
      });
      event.waitUntil(promise);
    } catch (e) {
      console.log('SW: error completing', e);
    }
  }
});

const showLocalNotification = (title, body, swRegistration, opt = {}) => {
  const options = {
    body,
    ...opt,
    // here you can add more properties like icon, image, vibrate, etc.
  };
  swRegistration.showNotification(title, options);
};
