import { loadCustomers } from "../../pages/customers.js";
import {
  loadSales,
  loadSelectedSales,
  saveSelectedSales,
} from "../../pages/sales-person.js";
import { closeOverlay, showOverlay } from "./overlay-manager.js";
import { loadPurchasedItems } from "../../pages/purchased-items.js";

export function showAddItemOverlay() {
  const button = document.querySelector(".js-add-button");

  const newButton = button.cloneNode(true);
  button.parentNode.replaceChild(newButton, button);

  newButton.addEventListener("click", async () => {
    const overlay = await showOverlay("add-item");
    renderOverlay(overlay);

    overlay
      .querySelector(".js-close-button")
      .addEventListener("click", () => closeOverlay("add-item"));

    overlay.addEventListener("click", (e) => {
      if (!e.target.closest(".js-overlay-wrapper")) {
        closeOverlay("add-item");
      }
    });
  });
}

async function renderOverlay(overlay) {
  await loadSalesOption(overlay);
  await loadCustomerOption(overlay);
  setupImageInput(overlay);
  const salesId = loadSelectedSales();
  const form = overlay.querySelector("#addItemForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const submitButton = this.querySelector('button[type="submit"]');

    submitButton.disabled = true;
    submitButton.textContent = "Menambah...";

    fetch("/api/items", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          alert("Barang berhasil ditambah!");
          this.reset();
          closeOverlay("add-item");
          loadPurchasedItems(salesId);
        } else {
          alert("Gagal menambah barang");
        }
      })
      .catch((error) => {
        alert("Terjadi Kesalahan");
        console.log("Error:", error);
      })
      .finally(() => {
        submitButton.disabled = false;
        submitButton.textContent = "Tambah";
      });
  });
}

async function loadCustomerOption(overlay) {
  const salesId = loadSelectedSales();
  const customerSelect = overlay.querySelector(".js-overlay-customer-select");
  customerSelect.innerHTML = "";
  const option = document.createElement("option");
  option.selected = true;
  option.disabled = true;
  option.textContent = "Pilih";
  customerSelect.appendChild(option);

  try {
    const response = await fetch("/api/customers");
    const data = await response.json();
    const customers = data.filter(
      (customers) => customers.salesId === parseInt(salesId)
    );
    customers.forEach((customer) => {
      const option = document.createElement("option");
      option.value = customer.id;
      option.textContent = customer.name;

      customerSelect.appendChild(option);
    });
  } catch (error) {
    console.error("failed to load customer options: ", error);
  }

  const hash = window.location.hash.slice(1);
  const [pageName, parameter] = hash.split("/");
  if (pageName === "purchased-items" && parameter) {
    customerSelect.value = parameter;
  }
}

export async function loadSalesOption(overlay) {
  const salesId = loadSelectedSales();
  const salesSelect = overlay.querySelector(".js-overlay-sales-select");
  salesSelect.innerHTML = "";
  const option = document.createElement("option");
  option.selected = true;
  option.disabled = true;
  option.textContent = "Sales";
  salesSelect.appendChild(option);

  try {
    const response = await fetch("/api/sales");
    const data = await response.json();

    data.forEach((sales) => {
      const option = document.createElement("option");
      option.value = sales.id;
      option.textContent = sales.name;

      salesSelect.appendChild(option);
    });
  } catch (error) {
    console.error("failed to load sales options:", error);
  }

  if (salesId) {
    salesSelect.value = salesId.toString();
  }

  salesSelect.addEventListener("change", function () {
    const salesId = parseInt(this.value);
    saveSelectedSales(salesId);
    loadCustomerOption(overlay);

    const hash = window.location.hash.slice(1);
    const [pageName, parameter] = hash.split("/");
    if (pageName === "home") {
      loadSales();
    }

    if (pageName === "customers") {
      loadCustomers(salesId);
    }
  });
}

function setupImageInput(overlay) {
  const imageInput = overlay.querySelector(".js-item-image-input");
  const imageInputButton = overlay.querySelector(".js-image-input-button");
  imageInputButton.addEventListener("click", () => imageInput.click());
  imageInput.addEventListener("change", (event) => {
    const image = event.target.files[0];
    if (image) {
      const imageName = image.name;
      if (imageName.length > 15) {
        imageInputButton.textContent = imageName.slice(0, 15) + "...";
      } else {
        imageInputButton.textContent = imageName;
      }
    }
  });
}
