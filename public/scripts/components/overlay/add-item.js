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
  const customerSelect = overlay.querySelector("js-overlay-customer-select");

  if (!salesId) {
    const overlayForm = overlay.querySelector(".js-overlay-form");
    overlayForm.innerHTML = "";
    const p = document.createElement("p");
    p.classList.add("overlay__warning", "warning");
    p.textContent = "Pilih sales terlebih dahulu";

    overlayForm.appendChild(p);
    return;
  }

  const imageInput = overlay.querySelector("js-item-image-input");
  const imageInputButton = overlay.querySelector(".js-image-input-button");
  imageInputButton.addEventListener("click", () => imageInput.click());
  imageInput.addEventListener("change", (event) => {
    const image = event.target.files[0];
    if (image) {
      const imageName = file.name;

      imageInputButton.textContent = imageName;
    }
  });

  try {
    const response1 = await fetch("/api/sales");
    const data1 = await response1.json();
    const response2 = await fetch("/api/customers");
    const data2 = await response2.json();
    const response3 = await fetch("/api/items");
    const data3 = await response3.json();

    const sales = data1.find((sales) => sales.id === parseInt(salesId));
    const customers = data2.filter(
      (customers) => customers.salesId === sales.id
    );

    customers.forEach((customer) => {
      const option = document.createElement("option");
      option.value = customer.id;
      option.textContent = customer.name;

      customerSelect.appendChild(option);
    });

    title.textContent = `Tambahkan Item: ${sales.name}`;
  } catch (error) {
    console.error("failed to fetch overlay: ", error);
  }
}
