// Service Worker Registration for Luxury International App
// Add this to your main.js file or create a separate file and include it

// Check if service workers are supported
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    registerServiceWorker();
  });
} else {
  console.log("Service Worker not supported in this browser");
}

async function registerServiceWorker() {
  try {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/", // This service worker will control all pages under the root
    });

    console.log(
      "Luxury International SW: Registration successful",
      registration
    );

    // Handle service worker updates
    registration.addEventListener("updatefound", () => {
      const newWorker = registration.installing;
      console.log("Luxury International SW: New service worker found");

      newWorker.addEventListener("statechange", () => {
        if (
          newWorker.state === "installed" &&
          navigator.serviceWorker.controller
        ) {
          console.log("Luxury International SW: New version available");
          // Just log - no UI elements
        }
      });
    });

    // Listen for messages from the service worker
    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data && event.data.type === "CACHE_UPDATED") {
        console.log("Luxury International SW: Cache updated");
      }
    });
  } catch (error) {
    console.error("Luxury International SW: Registration failed", error);
  }
}
