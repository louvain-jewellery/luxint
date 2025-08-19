import { loadSelectedSales } from "../../pages/sales-person.js";
import { closeOverlay, showOverlay } from "./overlay-manager.js";

export function showAddCustomerOverlay() {
  const button = document.querySelector(".js-add-customer-button");

  const newButton = button.cloneNode(true);
  button.parentNode.replaceChild(newButton, button);

  newButton.addEventListener("click", async () => {
    const overlay = await showOverlay("add-customer");
    renderOverlay(overlay);

    overlay
      .querySelector(".js-close-button")
      .addEventListener("click", () => closeOverlay("add-customer"));

    overlay.addEventListener("click", (e) => {
      if (!e.target.closest(".js-overlay-wrapper")) {
        closeOverlay("add-customer");
      }
    });
  });
}

async function renderOverlay(overlay) {
  const salesId = loadSelectedSales();
  const form = overlay.querySelector("#addCustomerForm");
  const salesSelect = form.querySelector("#customerSalesSelect");

  if (!salesId) {
    form.innerHTML = "";
    const p = document.createElement("p");
    p.classList.add("overlay__warning", "warning");
    p.textContent = "Pilih sales terlebih dahulu";

    form.appendChild(p);
    return;
  }

  loadSalesSelect(salesSelect);
}

async function loadSalesSelect(salesSelect) {
  salesSelect.innerHTML = "";
  const option = document.createElement("option");
  option.selected = true;
  option.disabled = true;
  option.textContent = "Pilih";
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
    console.error("failed to fetch overlay:", error);
  }

  const hash = window.location.hash.slice(1);
  const [pageName, parameter] = hash.split("/");
  if (parameter) {
    salesSelect.value = parameter;
  }
}
