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
          // New content is available, show update notification
          showUpdateNotification();
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

// Show update notification to user
function showUpdateNotification() {
  // Create a simple notification banner
  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: #2196F3;
    color: white;
    padding: 12px;
    text-align: center;
    z-index: 9999;
    font-family: Inter, sans-serif;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  `;

  notification.innerHTML = `
    <span>App update available!</span>
    <button onclick="updateApp()" style="
      margin-left: 12px;
      background: white;
      color: #2196F3;
      border: none;
      padding: 4px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
    ">Update</button>
    <button onclick="this.parentElement.remove()" style="
      margin-left: 8px;
      background: transparent;
      color: white;
      border: 1px solid white;
      padding: 4px 8px;
      border-radius: 4px;
      cursor: pointer;
    ">Later</button>
  `;

  document.body.appendChild(notification);
}

// Update the app when user clicks update
function updateApp() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistration().then((registration) => {
      if (registration && registration.waiting) {
        // Tell the waiting service worker to skip waiting and become active
        registration.waiting.postMessage({ type: "SKIP_WAITING" });
        // Reload the page to get the new version
        window.location.reload();
      }
    });
  }
}

// Add install prompt functionality
let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {
  console.log("Luxury International: Install prompt available");
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;

  // Show custom install button if you want
  showInstallButton();
});

function showInstallButton() {
  // Create install button (you can style this to match your app)
  const installButton = document.createElement("button");
  installButton.textContent = "Install App";
  installButton.style.cssText = `
    position: fixed;
    bottom: 80px;
    right: 20px;
    background: #2196F3;
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 25px;
    font-family: Inter, sans-serif;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
    z-index: 1000;
  `;

  installButton.addEventListener("click", installApp);
  document.body.appendChild(installButton);

  // Hide after 10 seconds if not clicked
  setTimeout(() => {
    if (installButton.parentElement) {
      installButton.remove();
    }
  }, 10000);
}

async function installApp() {
  if (deferredPrompt) {
    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`Luxury International: Install prompt ${outcome}`);

    // Clear the deferredPrompt variable
    deferredPrompt = null;

    // Remove install button
    const installButton = document.querySelector(
      'button[onclick="installApp()"]'
    );
    if (installButton) {
      installButton.remove();
    }
  }
}

// Listen for app installation
window.addEventListener("appinstalled", (evt) => {
  console.log("Luxury International: App was installed");
  // You can track this event or show a thank you message
});
