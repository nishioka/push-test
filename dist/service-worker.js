// Register event listener for the 'push' event.
self.addEventListener('push', function(event) {
  // Keep the service worker alive until the notification is created.
  event.waitUntil(
    // There are many other possible options, for an exhaustive list see the specs:
    //   https://notifications.spec.whatwg.org/
    self.registration.showNotification('Pushテスト', {
      lang: 'ja',
      body: '……きこえますか…きこえますか…Push通知のテストです…今…あなたの心に…直接…Pushしています…Pushができるのは…Chromeだけでは…ありません…Firefoxを…使うのです…',
      tag: 'push-notification-tag',
      icon: 'icon256.png',
      vibrate: [500, 100, 500]
    })
  );
});
