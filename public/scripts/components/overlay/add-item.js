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
  try {
    const response = await fetch("/api/sales");
    const data = await response.json();
    const sales = data.find((sales) => sales.id === parseInt(salesId));

    title.textContent = `Tambahkan Item: ${sales.name}`;

    if (!salesId) {
      const overlayForm = overlay.querySelector(".js-overlay-form");
      overlayForm.innerHTML = "";
      const p = document.createElement("p");
      p.classList.add("overlay__warning", "warning");
      p.textContent = "Pilih sales terlebih dahulu";

      overlayForm.appendChild(p);
      return;
    }
  } catch (error) {
    console.error("failed to fetch overlay: ", error);
  }
}
