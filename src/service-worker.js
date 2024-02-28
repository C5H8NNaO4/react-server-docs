import { precacheAndRoute } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';

console.log('MANI', self.__WB_MANIFEST);
self.skipWaiting();
clientsClaim();
precacheAndRoute(self.__WB_MANIFEST);

let lastNotificationData = {};
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
      lastNotificationData[json.id] = json;
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
  const { token, clientId } = lastNotificationData[id];
  delete lastNotificationData[id];
  const bearer = `Bearer ${token}`;

  if (action === 'complete') {
    try {
      const promise = fetch(
        `https://graphql.state-less.cloud/todos/${id}/toggle`,
        {
          method: 'GET',
          headers: {
            Authorization: bearer,
            'X-Unique-Id': clientId,
          },
        }
      );
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
