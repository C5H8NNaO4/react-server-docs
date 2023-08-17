self.addEventListener('push', function (event) {
  if (event.data) {
    try {
      const json = JSON.parse(event.data.text());
      showLocalNotification(json.title, json.body, self.registration);
    } catch (error) {
      showLocalNotification('Error', event.data.text(), self.registration);
    }
  } else {
    console.log('Push event but no data');
  }
});

const showLocalNotification = (title, body, swRegistration) => {
  const options = {
    body,
    // here you can add more properties like icon, image, vibrate, etc.
  };
  swRegistration.showNotification(title, options);
};
