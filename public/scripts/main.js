import { showAddItemOverlay } from "./components/overlay/add-item.js";
import { showSearchBar } from "./components/search.js";
import { loadCustomerPage } from "./pages/customers.js";
import { loadItemPage } from "./pages/purchased-items.js";
import { loadHomePage, loadSelectedSales } from "./pages/sales-person.js";

const pageMain = document.querySelector(".js-page-main");

function loadPage(page) {
  const [pageName, parameter] = page.split("/");
  document.body.className = `page-${pageName}`;

  fetch(`pages/${pageName}.html`)
    .then((response) => response.text())
    .then((data) => {
      window.scrollTo(0, 0);
      pageMain.innerHTML = data;

      if (pageName === "home") {
        loadHomePage(pageName);
      }

      if (pageName === "customers") {
        loadCustomerPage(pageName, parseInt(parameter));
      }

      if (pageName === "purchased-items") {
        loadItemPage(pageName, parseInt(parameter));
      }

      updateNavItem();
      updateCustomersNavigation();
      showSearchBar();
      showAddItemOverlay();
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

export function goBack() {
  const backButton = document.querySelector(".js-back-button");
  if (backButton) {
    const newBackButton = backButton.cloneNode(true);
    backButton.parentNode.replaceChild(newBackButton, backButton);

    newBackButton.addEventListener("click", () => {
      window.history.back();
    });
  }
}

export function updateCustomersNavigation() {
  document.querySelectorAll(".js-nav-customers").forEach((customersNavLink) => {
    if (customersNavLink) {
      customersNavLink.addEventListener("click", (e) => {
        e.preventDefault();

        const selectedSales = loadSelectedSales();
        window.location.hash = `customers/${selectedSales}`;
      });
    }
  });
}

export function reloadPage() {
  const hash = window.location.hash.slice(1);
  const [pageName, parameter] = hash.split("/");
  if (pageName === "home") {
    loadHomePage(pageName);
  }

  if (pageName === "customers") {
    loadCustomerPage(pageName, parseInt(parameter));
  }

  if (pageName === "purchased-items") {
    loadItemPage(pageName, parseInt(parameter));
  }
}

initRouter();
