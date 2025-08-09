import { showAddOverlay } from "./components/add.js";
import { loadCustomers } from "./data/customers.js";
import { loadSales } from "./data/sales-person.js";
import { showHeaderName } from "./ui/header.js";

const pageMain = document.querySelector(".js-page-main");

function loadPage(page) {
  fetch(`pages/${page}.html`)
    .then((response) => response.text())
    .then((data) => {
      pageMain.innerHTML = data;
      updateNavItem();
      showAddOverlay();

      if (page === "home") {
        loadSales();
      }

      if (page === "data") {
        showHeaderName();
        loadCustomers();
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

initRouter();
