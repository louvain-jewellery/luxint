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

function renderAddOverlay(overlay) {
  const parameter = getCurrentSalesId();
  if (!parameter) {
    const overlayForm = overlay.querySelector(".js-overlay-form");
    overlayForm.innerHTML = "";
    const p = document.createElement("p");
    p.classList.add("overlay__warning", "warning");
    p.textContent = "Pilih sales terlebih dahulu";

    overlayForm.appendChild(p);
    return;
  }

  const title = overlay.querySelector(".js-overlay-header-title");
  title.textContent = `Tambahkan Item: ${getCurrentSalesId()}`;
}
