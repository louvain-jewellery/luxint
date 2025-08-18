import { loadSelectedSales } from "../../pages/sales-person.js";
import { closeOverlay, showOverlay } from "./overlay-manager.js";

export function showAddOverlay() {
  document
    .querySelector(".js-add-button")
    .addEventListener("click", async () => {
      const overlay = await showOverlay("add-item");
      renderAddOverlay(overlay);

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

async function renderAddOverlay(overlay) {
  const salesId = loadSelectedSales();
  const title = overlay.querySelector(".js-overlay-header-title");
  const customerSelect = overlay.querySelector(".js-overlay-customer-select");
  customerSelect.innerHTML = "";

  if (!salesId) {
    const overlayForm = overlay.querySelector(".js-overlay-form");
    overlayForm.innerHTML = "";
    const p = document.createElement("p");
    p.classList.add("overlay__warning", "warning");
    p.textContent = "Pilih sales terlebih dahulu";

    overlayForm.appendChild(p);
    return;
  }

  await loadCustomerSelectOption(customerSelect, salesId);
  setupImageInput(overlay);

  try {
    const response1 = await fetch("/api/sales");
    const data1 = await response1.json();
    const sales = data1.find((sales) => sales.id === parseInt(salesId));
    title.textContent = `Tambahkan Item: ${sales.name}`;
  } catch (error) {
    console.error("failed to fetch overlay: ", error);
  }
}

async function loadCustomerSelectOption(customerSelect, salesId) {
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
      option.classList.add("js-option-customer");
      option.value = customer.id;
      option.textContent = customer.name;

      customerSelect.appendChild(option);
    });

    const hash = window.location.hash.slice(1);
    const [pageName, parameter] = hash.split("/");
    if (pageName === "purchased-items" && parameter) {
      customerSelect.value = parameter;
    }
  } catch (error) {
    console.error("failed to load customer options: ", error);
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
