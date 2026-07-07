/// <reference lib="webworker" />
// Custom service worker (vite-plugin-pwa injectManifest): Workbox precache + the Phase-5 push
// handlers. generateSW can't host push listeners, hence this file. Keep it tiny — it runs on
// tradies' phones with flaky reception.
import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { clientsClaim } from 'workbox-core';

declare let self: ServiceWorkerGlobalScope;

// A field tool should always run the newest code: activate immediately, claim open tabs.
self.skipWaiting();
clientsClaim();

precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// SPA navigation fallback (same behaviour the old generateSW config had).
registerRoute(new NavigationRoute(createHandlerBoundToURL('/index.html')));

// Google Fonts — cache-first, long-lived.
registerRoute(
  ({ url }) => url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com',
  new CacheFirst({
    cacheName: 'google-fonts',
    plugins: [new ExpirationPlugin({ maxEntries: 20, maxAgeSeconds: 31536000 })],
  }),
);

// ── Push (payloads come from _shared/webpush.ts — suburb/category only, never customer contact) ──
type PushData = { title?: string; body?: string; url?: string; tag?: string };

self.addEventListener('push', (event: PushEvent) => {
  let data: PushData = {};
  try { data = (event.data?.json() as PushData) ?? {}; } catch { /* non-JSON push -> generic */ }
  const title = data.title || 'Timeless Jobs';
  event.waitUntil(
    self.registration.showNotification(title, {
      body: data.body || 'Open the app to see what changed.',
      tag: data.tag || 'timeless-jobs',
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      data: { url: data.url || '/' },
    }),
  );
});

self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();
  const url = (event.notification.data as { url?: string } | undefined)?.url || '/';
  event.waitUntil(
    (async () => {
      const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      for (const client of clients) {
        if ('focus' in client) {
          await client.focus();
          if ('navigate' in client && url !== '/') {
            try { await (client as WindowClient).navigate(url); } catch { /* keep focus */ }
          }
          return;
        }
      }
      await self.clients.openWindow(url);
    })(),
  );
});
