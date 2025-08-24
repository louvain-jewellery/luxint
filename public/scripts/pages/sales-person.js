import { showAddSalesOverlay } from "../components/overlay/add-sales.js";
import { loadCardData } from "../components/card.js";
import { adjustBodyMargin, loadHeader } from "../ui/header.js";

export async function loadHomePage(pageName) {
  loadHeader(pageName);
  adjustBodyMargin();
  try {
    const response = await fetch("/api/sales");
    const data = await response.json();

    loadSales(data);
  } catch (error) {
    console.error("failed to load home-page:", error);
  }
}

function loadSales(data) {
  const savedSalesId = loadSelectedSales();
  const selectorList = document.querySelector(".js-selector-list");
  selectorList.innerHTML = "";

  const selected = document.createElement("div");
  selected.classList.add(
    "employee-selector__selected-item",
    "js-selected-item"
  );

  data.forEach((sales) => {
    const selectorItem = document.createElement("li");
    selectorItem.classList.add("employee-selector__item", "js-selector-item");
    selectorItem.dataset.salesId = sales.id;

    const itemImage = document.createElement("img");
    itemImage.classList.add("employee-selector__image");
    itemImage.src = sales.image;
    itemImage.alt = sales.name;
    selectorItem.appendChild(itemImage);

    const itemName = document.createElement("p");
    itemName.classList.add("employee-selector__name");
    itemName.textContent = sales.name;
    selectorItem.appendChild(itemName);

    selectorList.appendChild(selectorItem);
  });

  loadAddSelector();

  selectorList.querySelectorAll(".js-selector-item").forEach((item) => {
    item.addEventListener("click", () => {
      const salesId = parseInt(item.dataset.salesId);

      saveSelectedSales(salesId);
      item.appendChild(selected);
      loadCardData();
    });
  });

  if (!savedSalesId) {
    const cardDetail = document.querySelector(".js-card-detail");
    cardDetail.innerHTML = "";

    const p = document.createElement("p");
    p.classList.add("employee-card__warning", "warning");
    p.textContent = "Pilih sales terlebih dahulu";

    cardDetail.appendChild(p);
    return;
  }

  if (savedSalesId) {
    const savedItem = selectorList.querySelector(
      `[data-sales-id="${savedSalesId}"]`
    );
    if (savedItem) {
      savedItem.appendChild(selected);
      loadCardData();
    }
  }
}

function loadAddSelector() {
  const selectorList = document.querySelector(".js-selector-list");

  const addItem = document.createElement("li");
  addItem.classList.add("employee-selector__item--add", "js-add-sales-button");

  const itemImage = document.createElement("img");
  itemImage.classList.add("employee-selector__image--add", "icon");
  itemImage.src =
    "assets/icons/add_2_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
  addItem.appendChild(itemImage);

  const itemName = document.createElement("p");
  itemName.classList.add("employee-selector__name");
  itemName.textContent = "Tambah sales";
  addItem.appendChild(itemName);

  selectorList.appendChild(addItem);

  showAddSalesOverlay();
}

export function saveSelectedSales(salesId) {
  localStorage.setItem("selectedSales", salesId);
}

export function loadSelectedSales() {
  const saved = localStorage.getItem("selectedSales");
  return saved ? parseInt(saved) : null;
}
