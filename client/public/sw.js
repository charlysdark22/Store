// Service Worker para Tech Store Cuba
// Versión del cache
const CACHE_NAME = 'tech-store-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Instalar Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker instalado');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activar Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker activado');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptar requests
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - devolver respuesta
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Manejar notificaciones push
self.addEventListener('push', event => {
  console.log('Push notification recibida:', event);
  
  let notificationData = {
    title: 'Tech Store Cuba',
    body: 'Nueva notificación',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: 'default',
    data: {
      url: '/'
    }
  };

  if (event.data) {
    try {
      notificationData = { ...notificationData, ...event.data.json() };
    } catch (error) {
      console.error('Error parsing notification data:', error);
    }
  }

  const notificationOptions = {
    body: notificationData.body,
    icon: notificationData.icon,
    badge: notificationData.badge,
    tag: notificationData.tag,
    data: notificationData.data,
    actions: notificationData.actions || [],
    requireInteraction: notificationData.requireInteraction || false,
    silent: notificationData.silent || false,
    vibrate: notificationData.vibrate || [200, 100, 200],
    timestamp: notificationData.timestamp || Date.now(),
    renotify: notificationData.renotify || false
  };

  // Mostrar notificación
  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationOptions)
  );
});

// Manejar clicks en notificaciones
self.addEventListener('notificationclick', event => {
  console.log('Notification click:', event);
  
  event.notification.close();

  const notification = event.notification;
  const action = event.action;
  const data = notification.data || {};

  let url = '/';

  // Manejar acciones específicas
  if (action) {
    switch (action) {
      case 'view_order':
        url = data.url || `/orders/${data.orderId}`;
        break;
      case 'track_order':
        url = data.url || `/orders/${data.orderId}`;
        break;
      case 'view_product':
        url = data.url || `/products/${data.productId}`;
        break;
      case 'add_to_cart':
        url = `/products/${data.productId}`;
        // Enviar mensaje para agregar al carrito
        self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({
              type: 'ADD_TO_CART',
              productId: data.productId
            });
          });
        });
        break;
      case 'view_cart':
        url = '/cart';
        break;
      case 'checkout':
        url = '/checkout';
        break;
      case 'review_products':
        url = data.url || `/orders/${data.orderId}/review`;
        break;
      case 'use_coupon':
        url = '/products';
        // Enviar mensaje para aplicar cupón
        self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({
              type: 'APPLY_COUPON',
              couponCode: data.couponCode
            });
          });
        });
        break;
      default:
        url = data.url || '/';
    }
  } else {
    url = data.url || '/';
  }

  // Abrir ventana o enfocar existente
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(clientList => {
      // Buscar ventana existente
      for (let client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus();
          client.navigate(url);
          return;
        }
      }
      
      // Abrir nueva ventana si no existe
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Manejar cierre de notificaciones
self.addEventListener('notificationclose', event => {
  console.log('Notification closed:', event);
  
  const notification = event.notification;
  const data = notification.data || {};

  // Enviar evento de analytics si es necesario
  if (data.type) {
    fetch('/api/analytics/notification-closed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: data.type,
        notificationId: data.notificationId,
        timestamp: Date.now()
      })
    }).catch(error => {
      console.error('Error sending notification close analytics:', error);
    });
  }
});

// Manejar mensajes del cliente
self.addEventListener('message', event => {
  console.log('Service Worker mensaje recibido:', event.data);

  if (event.data && event.data.type) {
    switch (event.data.type) {
      case 'SKIP_WAITING':
        self.skipWaiting();
        break;
      case 'GET_VERSION':
        event.ports[0].postMessage({ version: CACHE_NAME });
        break;
      case 'CLEAR_CACHE':
        caches.delete(CACHE_NAME).then(() => {
          event.ports[0].postMessage({ success: true });
        });
        break;
    }
  }
});

// Sincronización en segundo plano
self.addEventListener('sync', event => {
  console.log('Background sync:', event.tag);

  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Función para sincronización en segundo plano
async function doBackgroundSync() {
  try {
    // Sincronizar datos offline si los hay
    const offlineData = await getOfflineData();
    
    if (offlineData.length > 0) {
      for (const data of offlineData) {
        await syncData(data);
      }
      await clearOfflineData();
    }
  } catch (error) {
    console.error('Error in background sync:', error);
  }
}

// Obtener datos offline del IndexedDB
async function getOfflineData() {
  // Implementar lógica para obtener datos offline
  return [];
}

// Sincronizar datos con el servidor
async function syncData(data) {
  try {
    const response = await fetch('/api/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error('Sync failed');
    }
  } catch (error) {
    console.error('Error syncing data:', error);
    throw error;
  }
}

// Limpiar datos offline
async function clearOfflineData() {
  // Implementar lógica para limpiar datos sincronizados
}

// Manejar actualizaciones de la app
self.addEventListener('message', event => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

// Notificación de actualización disponible
self.addEventListener('message', event => {
  if (event.data.type === 'CHECK_UPDATE') {
    // Verificar si hay actualizaciones
    event.waitUntil(
      caches.keys().then(cacheNames => {
        const hasUpdate = cacheNames.some(name => name !== CACHE_NAME);
        event.ports[0].postMessage({ hasUpdate });
      })
    );
  }
});

// Estrategias de cache personalizadas
const cacheStrategies = {
  // Cache First - para recursos estáticos
  cacheFirst: async (request) => {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  },

  // Network First - para datos dinámicos
  networkFirst: async (request) => {
    try {
      const networkResponse = await fetch(request);
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    } catch (error) {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
      throw error;
    }
  },

  // Stale While Revalidate - para balance entre velocidad y frescura
  staleWhileRevalidate: async (request) => {
    const cachedResponse = await caches.match(request);
    
    const fetchPromise = fetch(request).then(networkResponse => {
      const cache = caches.open(CACHE_NAME);
      cache.then(c => c.put(request, networkResponse.clone()));
      return networkResponse;
    });

    return cachedResponse || fetchPromise;
  }
};

console.log('Service Worker cargado - Tech Store Cuba v1.0');