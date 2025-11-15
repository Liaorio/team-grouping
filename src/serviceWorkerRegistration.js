/* eslint-disable no-console */
// 这是一个可选的第三方库，用于注册 Service Worker
// 对于生产环境，我们使用未注册版本，保持简单

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/,
    ),
);

export function register(config) {
  if ('serviceWorker' in navigator) {
    const publicUrl = new URL(
      process.env.PUBLIC_URL || '',
      window.location.href,
    );
    if (publicUrl.origin !== window.location.origin) return;

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) checkValidServiceWorker(swUrl, config);
      else registerValidSW(swUrl, config);
    });
  }
}

function registerValidSW(swUrl) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker === null) return;

        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller)
              console.log('新的内容可用于缓存，刷新页面即可查看最新版本。');
            else console.log('内容已缓存供离线使用。');
          }
        };
      };
    })
    .catch((error) => {
      console.error('Service Worker 注册失败:', error);
    });
}

function checkValidServiceWorker(swUrl, config) {
  fetch(swUrl, { headers: { 'Service-Worker': 'script' } })
    .then((response) => {
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType !== null && contentType.indexOf('javascript') === -1)
      ) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else registerValidSW(swUrl, config);
    })
    .catch(() => {
      console.log('没有网络连接。应用运行在离线模式。');
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}
