// Register event listener for the 'push' event.
self.addEventListener('push', function(event) {
  // Keep the service worker alive until the notification is created.
  event.waitUntil(
    // There are many other possible options, for an exhaustive list see the specs:
    //   https://notifications.spec.whatwg.org/
    self.registration.showNotification('Push TEST', {
      lang: 'ja',
      body: '……きこえますか…きこえますか…Push通知のテストです…今…あなたの…心に…直接…Pushしています…Pushができるのは…Chromeだけでは…ありません…Firefoxを…使うのです…',
      tag: 'notification',
      icon: 'caesar.jpg',
      vibrate: [500, 100, 500]
    })
  );
});
