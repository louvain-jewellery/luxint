import { showAddItemOverlay } from "./components/overlay/add-item.js";
import { loadCustomers } from "./pages/customers.js";
import { loadPurchasedItems } from "./pages/purchased-items.js";
import { loadSales, loadSelectedSales } from "./pages/sales-person.js";

const pageMain = document.querySelector(".js-page-main");

function loadPage(page) {
  const [pageName, parameter] = page.split("/");

  document.body.className = `page-${pageName}`;

  fetch(`pages/${pageName}.html`)
    .then((response) => response.text())
    .then((data) => {
      window.scrollTo(0, 0);
      pageMain.innerHTML = data;
      updateNavItem();
      updateCustomersNavigation();
      showAddItemOverlay();

      if (pageName === "home") {
        loadSales();
      }

      if (pageName === "customers") {
        loadCustomers(parseInt(parameter));
        goBack();
      }

      if (pageName === "purchased-items") {
        if (parameter) {
          loadPurchasedItems(parseInt(parameter));
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

function updateCustomersNavigation() {
  const customersNavLink = document.querySelector('a[href="#customers"]');

  if (customersNavLink) {
    customersNavLink.addEventListener("click", (e) => {
      e.preventDefault();

      const selectedSales = loadSelectedSales();
      window.location.hash = `customers/${selectedSales}`;
    });
  }
}

export function reloadPage() {
  const salesId = loadSelectedSales();
  const hash = window.location.hash.slice(1);
  const [pageName, parameter] = hash.split("/");
  if (pageName === "home") {
    loadSales();
  }

  if (pageName === "customers") {
    loadCustomers(salesId);
  }

  if (pageName === "purchased-items") {
    loadPurchasedItems(parameter);
  }
}

initRouter();
