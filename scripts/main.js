import { showAddOverlay } from "./components/add.js";
import { showMoreOverlay } from "./components/more.js";
import { loadCustomers } from "./pages/customers.js";
import { loadPurchasedItems } from "./pages/purchased-items.js";
import { loadSales } from "./pages/sales-person.js";
import { showHeaderName } from "./ui/header.js";

const pageMain = document.querySelector(".js-page-main");
let navigationHistory = [];

function loadPage(page) {
  const [pageName, parameter] = page.split("/");

  const currentPage = getCurrentPage();
  if (currentPage && currentPage !== page) {
    navigationHistory.push(currentPage);
  }

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
        setupBackButton();
      }

      if (pageName === "purchased-items") {
        if (parameter) {
          loadPurchasedItems(parameter);
          showHeaderName();
          setupBackButton();
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

  navItems.forEach((item) => {
    const link = item.querySelector("a");
    if (link) {
      const href = link.getAttribute("href");

      if (href === currentHash) {
        item.classList.add("selected");
      } else {
        item.classList.remove("selected");
      }
    }
  });
}

function setupBackButton() {
  const backButton = document.querySelector(".js-back-button");
  if (backButton) {
    backButton.onclick = goBack;
  }
}

function goBack() {
  if (navigationHistory.length > 0) {
    const previousPage = navigationHistory.pop();
    loadPage(previousPage);
  } else {
    loadPage("home");
  }
}

function getCurrentPage() {
  const bodyClass = document.body.className;
  const match = bodyClass.match(/page-(\w+)/);
  return match ? match[1] : "home";
}

initRouter();
