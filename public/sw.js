const CACHE_NAME = "luxury-international-v1.0.0";
const STATIC_CACHE = "luxury-static-v1.0.0";
const DYNAMIC_CACHE = "luxury-dynamic-v1.0.0";
const IMAGE_CACHE = "luxury-images-v1.0.0";

// Core files that should always be available offline
const STATIC_ASSETS = [
  "./",
  "./site.webmanifest",

  // Your actual manifest icons
  "./web-app-manifest-192x192.png",
  "./web-app-manifest-512x512.png",
  "./favicon-96x96.png",
  "./apple-touch-icon.png",

  // CSS files
  "./styles/main.css",
  "./styles/header.css",
  "./styles/home.css",
  "./styles/bottom-nav.css",

  // Core images
  "./assets/images/logo.png",
  "./assets/images/logo2.png",

  // Navigation icons
  "./assets/icons/home_24dp_000000_FILL1_wght400_GRAD0_opsz24.svg",
  "./assets/icons/search_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg",
  "./assets/icons/more_horiz_24dp_000000_FILL1_wght400_GRAD0_opsz24.svg",
  "./assets/icons/add_2_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg",
];

// Google Fonts URLs to cache
const FONT_URLS = [
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  "https://fonts.gstatic.com",
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("Luxury International SW: Installing...");

  event.waitUntil(
    Promise.all([
      // Cache static assets (with error handling for missing files)
      caches.open(STATIC_CACHE).then(async (cache) => {
        console.log("Luxury International SW: Caching static assets");
        const cachePromises = STATIC_ASSETS.map(async (url) => {
          try {
            await cache.add(url);
            console.log(`Cached: ${url}`);
          } catch (error) {
            console.warn(`Failed to cache ${url}:`, error.message);
            // Don't fail the entire installation for missing files
          }
        });
        await Promise.all(cachePromises);
      }),
      // Cache Google Fonts
      caches.open("fonts-cache").then(async (cache) => {
        console.log("Luxury International SW: Caching fonts");
        try {
          await cache.addAll(
            FONT_URLS.filter((url) => url.includes("googleapis"))
          );
        } catch (error) {
          console.warn("Failed to cache fonts:", error.message);
        }
      }),
    ])
      .then(() => {
        console.log("Luxury International SW: Installation completed");
        return self.skipWaiting(); // Activate immediately
      })
      .catch((error) => {
        console.error("Luxury International SW: Installation failed:", error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Luxury International SW: Activating...");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete old versions of our caches
            if (
              cacheName.startsWith("luxury-") &&
              cacheName !== STATIC_CACHE &&
              cacheName !== DYNAMIC_CACHE &&
              cacheName !== IMAGE_CACHE
            ) {
              console.log(
                "Luxury International SW: Deleting old cache:",
                cacheName
              );
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log("Luxury International SW: Activated successfully");
        return self.clients.claim(); // Take control of all pages
      })
  );
});

// Fetch event - handle requests with different strategies
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Handle different types of requests
  if (url.origin === self.location.origin) {
    // Same origin requests
    event.respondWith(handleSameOriginRequest(request));
  } else if (
    url.hostname === "fonts.googleapis.com" ||
    url.hostname === "fonts.gstatic.com"
  ) {
    // Google Fonts requests
    event.respondWith(handleFontRequest(request));
  } else {
    // External requests
    event.respondWith(handleExternalRequest(request));
  }
});

// Handle same-origin requests (your app files)
async function handleSameOriginRequest(request) {
  const url = new URL(request.url);

  try {
    // For HTML pages, try network first, fallback to cache
    if (request.headers.get("accept")?.includes("text/html")) {
      return await networkFirstStrategy(request, STATIC_CACHE);
    }

    // For CSS and JS files, try cache first, fallback to network
    if (url.pathname.endsWith(".css") || url.pathname.endsWith(".js")) {
      return await cacheFirstStrategy(request, STATIC_CACHE);
    }

    // For images, try cache first, fallback to network, then cache
    if (
      request.headers.get("accept")?.includes("image") ||
      url.pathname.includes("/assets/images/") ||
      url.pathname.includes("/assets/icons/")
    ) {
      return await cacheFirstStrategy(request, IMAGE_CACHE);
    }

    // For other assets, try cache first
    return await cacheFirstStrategy(request, STATIC_CACHE);
  } catch (error) {
    console.error(
      "Luxury International SW: Error handling same-origin request:",
      error
    );
    return new Response("Offline - Content not available", {
      status: 503,
      statusText: "Service Unavailable",
    });
  }
}

// Handle Google Fonts requests
async function handleFontRequest(request) {
  try {
    return await cacheFirstStrategy(request, "fonts-cache");
  } catch (error) {
    console.error("Luxury International SW: Font request failed:", error);
    return fetch(request);
  }
}

// Handle external requests
async function handleExternalRequest(request) {
  try {
    // Try network first for external resources
    const response = await fetch(request);
    return response;
  } catch (error) {
    console.error("Luxury International SW: External request failed:", error);
    return new Response("External resource unavailable offline", {
      status: 503,
    });
  }
}

// Cache-first strategy: check cache first, fallback to network
async function cacheFirstStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    // Cache successful responses
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error("Luxury International SW: Network request failed:", error);
    throw error;
  }
}

// Network-first strategy: try network first, fallback to cache
async function networkFirstStrategy(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log("Luxury International SW: Network failed, trying cache");
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    throw error;
  }
}

// Handle background sync (if you want to add this feature later)
self.addEventListener("sync", (event) => {
  if (event.tag === "employee-data-sync") {
    event.waitUntil(syncEmployeeData());
  }
});

// Placeholder for syncing employee data when back online
async function syncEmployeeData() {
  console.log("Luxury International SW: Syncing employee data...");
  // Add your sync logic here
}

// Handle push notifications (if you want to add this feature later)
self.addEventListener("push", (event) => {
  const options = {
    body: event.data
      ? event.data.text()
      : "New notification from Luxury International",
    icon: "/favicon-96x96.png",
    badge: "/favicon-96x96.png",
    vibrate: [100, 50, 100],
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
  event.waitUntil(clients.openWindow("/"));
});
