// Service Worker básico
// Este es un punto de partida. Necesitarás expandirlo para el cacheo de activos.

const CACHE_NAME = 'numerix-cache-v1';
const urlsToCache = [
  '/',
  // Aquí deberías listar los activos principales de tu aplicación:
  // CSS, JS, imágenes de la UI, etc.
  // Por ejemplo: '/_next/static/css/main.css', '/_next/static/chunks/main-app.js'
  // '/icons/icon-192x192.png', '/icons/icon-512x512.png',
  // '/avatars/Pfp_Boy1.png', ... etc.
  // Y las rutas de tus páginas principales que quieras offline.
  '/dashboard',
  '/profiles',
  // ¡Asegúrate de que estas rutas existan y sean correctas!
];

self.addEventListener('install', (event) => {
  console.log('Service Worker: Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Cache abierto, añadiendo URLs principales.');
        // Es importante que estas URLs sean correctas y accesibles
        // Si una falla, la instalación del SW fallará.
        // Por ahora, cachearemos solo lo básico para evitar errores si los archivos no existen.
        return cache.addAll([
          '/',
          '/manifest.json', 
          // Puedes añadir gradualmente más URLs aquí a medida que confirmas su existencia
        ]);
      })
      .then(() => {
        console.log('Service Worker: URLs principales cacheadas con éxito.');
        return self.skipWaiting(); // Activa el SW inmediatamente
      })
      .catch(error => {
        console.error('Service Worker: Falló el cacheo de URLs principales durante la instalación:', error);
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activando...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Eliminando caché antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activado y caches antiguos limpiados.');
      return self.clients.claim(); // Toma control de los clientes no controlados
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Estrategia: Cache first, then network
  // Puedes cambiar esto a network first, o stale-while-revalidate según tus necesidades.
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          // console.log('Service Worker: Sirviendo desde caché:', event.request.url);
          return response;
        }
        // console.log('Service Worker: Solicitando a la red:', event.request.url);
        return fetch(event.request).then(
          (networkResponse) => {
            // Si quieres cachear nuevas solicitudes dinámicamente:
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            // Es una buena práctica clonar la respuesta antes de cachearla.
            // const responseToCache = networkResponse.clone();
            // caches.open(CACHE_NAME)
            //   .then(cache => {
            //     cache.put(event.request, responseToCache);
            //   });
            return networkResponse;
          }
        ).catch(error => {
          console.error('Service Worker: Error de fetch y no está en caché:', event.request.url, error);
          // Aquí podrías devolver una página offline genérica si la tienes.
        });
      })
  );
});
