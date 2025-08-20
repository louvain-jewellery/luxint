import { loadSelectedSales } from "../../pages/sales-person.js";
import { closeOverlay, showOverlay } from "./overlay-manager.js";

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
  const salesId = loadSelectedSales();
  const customerSelect = overlay.querySelector(".js-overlay-customer-select");
  const salesSelect = overlay.querySelector(".js-overlay-sales-select");

  await loadSalesOption(salesSelect, salesId);
  await loadCustomerOption(customerSelect, salesId);
  setupImageInput(overlay);
}

async function loadCustomerOption(customerSelect, salesId) {
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

async function loadSalesOption(salesSelect, salesId) {
  salesSelect.innerHTML = "";
  const option = document.createElement("option");
  option.selected = true;
  option.disabled = true;
  option.textContent = "Pilih sales";
  salesSelect.appendChild(option);

  try {
    const response = await fetch("/api/sales");
    const data = await response.json();

    data.forEach((sales) => {
      const option = document.querySelector("option");
      option.value = sales.id;
      option.textContent = sales.name;

      salesSelect.appendChild(option);
    });
  } catch (error) {
    console.error("failed to load sales options:", error);
  }

  if (salesId) {
    salesSelect.value = salesId;
  }
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
