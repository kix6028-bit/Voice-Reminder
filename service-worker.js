const CACHE_NAME = 'voice-reminder-cache-v3'; // Incremented cache version
const APP_SHELL_URLS = [
  './',
  'index.html',
  'index.tsx',
  'App.tsx',
  'types.ts',
  'components/TaskInputForm.tsx',
  'components/TaskList.tsx',
  'components/CompletedTaskList.tsx',
  'components/BottomNav.tsx',
  'services/ttsService.ts',
  'components/EditTaskModal.tsx',
  'manifest.json',
  'icon-192.png',
  'icon-512.png',
  'utils/audioUtils.ts'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache and caching app shell');
      return cache.addAll(APP_SHELL_URLS).catch(error => {
        console.error('Failed to cache app shell:', error);
        // Log which file failed
        APP_SHELL_URLS.forEach(url => {
            fetch(url).catch(() => console.error(`Failed to fetch: ${url}`));
        });
      });
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});