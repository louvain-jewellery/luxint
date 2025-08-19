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
  const title = overlay.querySelector(".js-overlay-title");
  const wrapper = overlay.querySelector(".js-overlay-wrapper");

  if (!salesId) {
    wrapper.innerHTML = "";
    const p = document.createElement("p");
    p.classList.add("overlay__warning", "warning");
    p.textContent = "Pilih sales terlebih dahulu";

    overlayForm.appendChild(p);
    return;
  }

  try {
    const response = await fetch("/api/sales");
    const data = await response.json();
    const sales = data.find((sales) => sales.id === parseInt(salesId));

    title.textContent = `Pelanggan Baru: ${sales.name}`;
  } catch (error) {
    console.error("failed to fetch overlay:", error);
  }
}
