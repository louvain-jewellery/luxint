import { showAddSalesOverlay } from "../components/overlay/add-sales.js";
import { formatSalesId } from "../utils/format-id.js";

export function loadSales() {
  const selected = document.createElement("div");
  selected.classList.add(
    "employee-selector__selected-item",
    "js-selected-item"
  );

  fetch("/api/sales")
    .then((response) => response.json())
    .then((data) => {
      const selectorList = document.querySelector(".js-selector-list");
      selectorList.innerHTML = "";

      const savedSalesId = loadSelectedSales();

      data.forEach((sales) => {
        const selectorItem = document.createElement("li");
        selectorItem.classList.add(
          "employee-selector__item",
          "js-selector-item"
        );
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

      loadAddItem();

      selectorList.querySelectorAll(".js-selector-item").forEach((item) => {
        item.addEventListener("click", () => {
          const salesId = parseInt(item.dataset.salesId);

          saveSelectedSales(salesId);
          history.replaceState(null, null, "#home/1");

          saveSelectedSales(salesId);
          item.appendChild(selected);
          loadCardData(salesId);
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

          loadCardData(savedSalesId);
        }
      }
    });
}

export function loadCardData(salesId) {
  const cardDetail = document.querySelector(".js-card-detail");
  cardDetail.innerHTML = "";

  fetch("/api/sales")
    .then((response) => response.json())
    .then((data) => {
      const sales = data.find((sales) => sales.id === salesId);

      cardDetail.innerHTML = `
          <div class="employee-card__detail">
            <div class="employee-card__row">
              <p class="employee-card__title">ID</p>
              <p class="employee-card__content js-card-id">: ${formatSalesId(
                sales.id
              )}</p>
            </div>
            <div class="employee-card__row">
              <p class="employee-card__title">Nama</p>
              <p class="employee-card__content js-card-name">: ${sales.name}</p>
            </div>
            <div class="employee-card__row">
              <p class="employee-card__title">Pelanggan</p>
              <p class="employee-card__content js-card-customer-count">: ??
              orang</p>
            </div>
          </div>
          <div class="employee-card__image-wrapper">
            <img class="employee-card__image js-card-image" src=${
              sales.image
            } alt="card pfp" />
          </div>
        `;
    });
}

export function loadAddItem() {
  const selectorList = document.querySelector(".js-selector-list");

  const addItem = document.createElement("li");
  addItem.classList.add("employee-selector__item--add", "js-selector-add");

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
