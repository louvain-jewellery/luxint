// Service Worker Registration for Luxury International App (Online-Only PWA)
// Add this to your main.js file or create a separate file and include it

// Check if service workers are supported
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    registerServiceWorker();
  });
} else {
  console.log("Service Worker not supported in this browser");
  // Fallback: You could show a message that PWA features won't be available
}

async function registerServiceWorker() {
  try {
    const registration = await navigator.serviceWorker.register("./sw.js", {
      scope: "./", // Explicitly set scope
    });

    console.log(
      "Luxury International SW: Registration successful",
      registration
    );

    // Handle service worker updates
    registration.addEventListener("updatefound", () => {
      const newWorker = registration.installing;
      console.log("Luxury International SW: New service worker found");

      if (newWorker) {
        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed") {
            if (navigator.serviceWorker.controller) {
              // New version available - in online-only mode, we can auto-update
              console.log(
                "Luxury International SW: New version available - auto-updating"
              );
              newWorker.postMessage({ type: "SKIP_WAITING" });
            } else {
              // First time installation
              console.log(
                "Luxury International SW: Ready for offline (online-only mode)"
              );
            }
          }
        });
      }
    });

    // Listen for controlling service worker changes
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      console.log(
        "Luxury International SW: Controller changed - reloading page"
      );
      // Reload the page to ensure we're running the latest version
      window.location.reload();
    });

    // Listen for messages from the service worker
    navigator.serviceWorker.addEventListener("message", (event) => {
      const { data } = event;

      if (data && data.type === "CACHE_UPDATED") {
        console.log("Luxury International SW: Cache updated");
      }

      if (data && data.type === "VERSION_INFO") {
        console.log(
          "Luxury International SW Version:",
          data.version,
          "Mode:",
          data.mode
        );
      }
    });

    // Check for updates periodically (every 30 minutes)
    setInterval(() => {
      registration.update();
    }, 30 * 60 * 1000);

    // Get version info from service worker
    if (registration.active) {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        console.log("SW Info:", event.data);
      };
      registration.active.postMessage({ type: "GET_VERSION" }, [
        messageChannel.port2,
      ]);
    }
  } catch (error) {
    console.error("Luxury International SW: Registration failed", error);
  }
}

// Optional: Add connection monitoring for better UX
function setupConnectionMonitoring() {
  // Monitor online/offline status
  window.addEventListener("online", () => {
    console.log("Luxury International: Back online");
    // You could show a toast notification here
  });

  window.addEventListener("offline", () => {
    console.log("Luxury International: Gone offline");
    // You could show an offline warning here
  });

  // Initial connection check
  if (!navigator.onLine) {
    console.log("Luxury International: Currently offline");
  }
}

// Optional: Setup PWA install prompt handling
function setupPWAInstallPrompt() {
  let deferredPrompt;

  window.addEventListener("beforeinstallprompt", (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;

    console.log("Luxury International: PWA install prompt available");

    // You could show your own install button here
    // showInstallButton();
  });

  window.addEventListener("appinstalled", () => {
    console.log("Luxury International: PWA installed successfully");
    deferredPrompt = null;
  });

  // Function to trigger install prompt (call this when user clicks your install button)
  window.showInstallPrompt = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`Luxury International: User ${outcome} the install prompt`);
      deferredPrompt = null;
    }
  };
}

// Initialize additional features
document.addEventListener("DOMContentLoaded", () => {
  setupConnectionMonitoring();
  setupPWAInstallPrompt();
});

// Utility function to check if app is running as PWA
function isPWA() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

// Log PWA status
console.log("Luxury International: Running as PWA:", isPWA());
