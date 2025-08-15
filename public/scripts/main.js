import { showAddOverlay } from "./components/overlay/add-overlay.js";
import { loadCustomers } from "./pages/customers.js";
import { loadPurchasedItems } from "./pages/purchased-items.js";
import { loadSales } from "./pages/sales-person.js";
import { showHeaderName } from "./ui/header.js";

const pageMain = document.querySelector(".js-page-main");

function loadPage(page) {
  const [pageName, parameter] = page.split("/");

  pageMain.classList.add("page-transitioning");
  document.body.className = `page-${pageName}`;

  fetch(`pages/${pageName}.html`)
    .then((response) => response.text())
    .then((data) => {
      pageMain.innerHTML = data;
      updateNavItem();
      showAddOverlay();

      if (pageName === "home") {
        loadSales();
      }

      if (pageName === "customers") {
        showHeaderName();
        loadCustomers();
        goBack();
      }

      if (pageName === "purchased-items") {
        if (parameter) {
          loadPurchasedItems(parseInt(parameter));
          showHeaderName();
          goBack();
        }
      }
    });
}

function initRouter() {
  const defaultPage = "home";
  let currentPage = location.hash.slice(1) || defaultPage;
  loadPage(currentPage);

  window.addEventListener("hashchange", () => {
    const newPage = location.hash.slice(1) || defaultPage;
    loadPage(newPage);
  });
}

function updateNavItem() {
  const navItems = document.querySelectorAll(".js-bottom-nav-item");
  const currentHash = location.hash || "#home";

  const currentPageName = currentHash.split("/")[0];

  navItems.forEach((item) => {
    const link = item.querySelector("a");
    if (link) {
      const href = link.getAttribute("href");

      if (
        href === currentHash ||
        href === currentPageName ||
        (currentPageName === "#purchased-items" && href === "#customers")
      ) {
        item.classList.add("selected");
      } else {
        item.classList.remove("selected");
      }
    }
  });
}

function goBack() {
  const backButton = document.querySelector(".js-back-button");
  if (backButton) {
    const newBackButton = backButton.cloneNode(true);
    backButton.parentNode.replaceChild(newBackButton, backButton);

    newBackButton.addEventListener("click", () => {
      window.history.back();
    });
  }
}

initRouter();
