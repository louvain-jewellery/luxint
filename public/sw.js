const CACHE_NAME = "luxury-international-v1.0.0";

self.addEventListener("install", (event) => {
  console.log("Luxury International SW: Installing (PWA online-only mode)...");
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  console.log("Luxury International SW: Activating (PWA online-only mode)...");

  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            console.log("Clearing cache:", cacheName);
            return caches.delete(cacheName);
          })
        );
      }),
      self.clients.claim(),
    ]).then(() => {
      console.log(
        "Service Worker activated - PWA installable but requires internet"
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET") {
    return;
  }

  event.respondWith(
    fetch(request).catch((error) => {
      console.log("Network failed:", url.href, error.message);

      if (request.headers.get("accept")?.includes("text/html")) {
        return createOfflineHtmlResponse();
      } else if (request.headers.get("accept")?.includes("application/json")) {
        return createOfflineJsonResponse();
      } else {
        return createOfflineResponse();
      }
    })
  );
});

function createOfflineHtmlResponse() {
  return new Response(
    `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Internet Connection Required - Luxury International</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }
        
        .offline-container {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          text-align: center;
          max-width: 500px;
          width: 100%;
        }
        
        .icon {
          font-size: 64px;
          margin-bottom: 20px;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        h1 {
          color: #2c3e50;
          margin-bottom: 16px;
          font-size: 28px;
          font-weight: 600;
        }
        
        p {
          color: #7f8c8d;
          line-height: 1.6;
          margin-bottom: 30px;
          font-size: 16px;
        }
        
        .retry-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 14px 28px;
          border-radius: 50px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 500;
          transition: all 0.3s ease;
          margin: 0 10px 10px;
        }
        
        .retry-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }
        
        .status {
          margin-top: 20px;
          padding: 12px;
          border-radius: 10px;
          font-size: 14px;
        }
        
        .online {
          background: #d4edda;
          color: #155724;
        }
        
        .offline {
          background: #f8d7da;
          color: #721c24;
        }
      </style>
    </head>
    <body>
      <div class="offline-container">
        <div class="icon">🌐</div>
        <h1>Internet Connection Required</h1>
        <p>Luxury International requires an active internet connection to function properly. Please check your network connection and try again.</p>
        
        <button class="retry-btn" onclick="window.location.reload()">
          🔄 Try Again
        </button>
        
        <div id="connectionStatus" class="status offline">
          📡 Currently Offline
        </div>
      </div>
      
      <script>
        // Monitor connection status
        function updateConnectionStatus() {
          const status = document.getElementById('connectionStatus');
          if (navigator.onLine) {
            status.textContent = '✅ Connected - Refreshing...';
            status.className = 'status online';
            setTimeout(() => window.location.reload(), 1000);
          } else {
            status.textContent = '📡 Currently Offline';
            status.className = 'status offline';
          }
        }
        
        // Check connection status periodically
        setInterval(updateConnectionStatus, 2000);
        
        // Listen for online/offline events
        window.addEventListener('online', updateConnectionStatus);
        window.addEventListener('offline', updateConnectionStatus);
        
        // Initial check
        updateConnectionStatus();
      </script>
    </body>
    </html>
    `,
    {
      status: 503,
      statusText: "Service Unavailable - Internet Required",
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    }
  );
}

// Create offline JSON response for API requests
function createOfflineJsonResponse() {
  return new Response(
    JSON.stringify({
      error: "Internet connection required",
      message: "This application requires an active internet connection",
      code: "OFFLINE_ERROR",
      timestamp: new Date().toISOString(),
    }),
    {
      status: 503,
      statusText: "Service Unavailable",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    }
  );
}

// Create generic offline response
function createOfflineResponse() {
  return new Response("Internet connection required", {
    status: 503,
    statusText: "Service Unavailable - Internet Required",
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}

// Handle background sync - prevent offline sync
self.addEventListener("sync", (event) => {
  console.log("Background sync blocked - online-only mode");
  // Don't wait for anything - just log and exit
});

// Handle push notifications (only when online)
self.addEventListener("push", (event) => {
  // Check if we can reasonably assume we're online
  const options = {
    body: event.data
      ? event.data.text()
      : "New notification from Luxury International",
    icon: "/favicon-96x96.png",
    badge: "/favicon-96x96.png",
    vibrate: [100, 50, 100],
    tag: "luxury-notification",
    requireInteraction: false,
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
  };

  event.waitUntil(
    self.registration.showNotification("Luxury International", options)
  );
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      // If a window/tab is already open, focus it
      for (const client of clientList) {
        if (client.url === self.registration.scope && "focus" in client) {
          return client.focus();
        }
      }
      // Otherwise open a new window/tab
      if (clients.openWindow) {
        return clients.openWindow("/");
      }
    })
  );
});

// Message handling for communication with main app
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data && event.data.type === "GET_VERSION") {
    event.ports[0].postMessage({
      version: CACHE_NAME,
      mode: "online-only",
    });
  }
});
