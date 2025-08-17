import { showAddOverlay } from "./components/overlay/add-item.js";
import { loadCustomers } from "./pages/customers.js";
import { loadPurchasedItems } from "./pages/purchased-items.js";
import { loadSales, loadSelectedSales } from "./pages/sales-person.js";
import { showHeaderName } from "./ui/header.js";

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
      updateNavigation("pageName");
      showAddOverlay();

      if (pageName === "home") {
        loadSales(parseInt(parameter));
      }

      if (pageName === "customers") {
        showHeaderName();
        loadCustomers(parseInt(parameter));
        goBack();
      }

      if (pageName === "purchased-items") {
        showHeaderName();
        loadPurchasedItems(parseInt(parameter));
        goBack();
      }
    });
}

function initRouter() {
  const defaultPage = `home/${loadSelectedSales()}`;
  let currentPage = location.hash.slice(1) || defaultPage;
  loadPage(currentPage);

  window.addEventListener("hashchange", () => {
    const newPage = location.hash.slice(1) || defaultPage;
    loadPage(newPage);
  });
}

function updateNavItem() {
  const navItems = document.querySelectorAll(".js-bottom-nav-item");
  const currentHash = location.hash || `#home/${loadSelectedSales()}`;

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

function updateNavigation(pageName) {
  const navLink = document.querySelector(`a[href="#${pageName}"]`);

  if (navLink) {
    navLink.addEventListener("click", (e) => {
      e.preventDefault();

      const selectedSales = loadSelectedSales();
      window.location.hash = `${pageName}/${selectedSales}`;
    });
  }
}

initRouter();
