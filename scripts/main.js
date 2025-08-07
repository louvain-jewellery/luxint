import { showAddOverlay } from "./components/add.js";
import { loadSalesPerson } from "./data/loadSalesPerson.js";
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
        loadSalesPerson();
      }

      if (page === "data") {
        showHeaderName();
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
