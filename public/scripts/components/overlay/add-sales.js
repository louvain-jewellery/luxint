import { closeOverlay, showOverlay } from "./overlay-manager.js";

export function showAddSalesOverlay() {
  document
    .querySelector(".js-selector-add")
    .addEventListener("click", async () => {
      const overlay = await showOverlay("add-sales");
      renderOverlay(overlay);
      overlay
        .querySelector(".js-cancel-button")
        .addEventListener("click", closeOverlay);

      overlay.addEventListener("click", (e) => {
        if (!e.target.closest(".js-overlay-wrapper")) {
          closeOverlay("add-sales");
        }
      });
    });
}

function renderOverlay(overlay) {
  const profileInput = overlay.querySelector("#salesProfileInput");
  const profile = overlay.querySelector(".js-overlay-profile");
  const nameInput = overlay.querySelector("#salesNameInput");

  profile.addEventListener("click", () => profileInput.click());

  profileInput.addEventListener("change", (event) => {
    const image = event.target.files[0];
    if (image) {
      const reader = new FileReader();
      reader.onload = (e) => {
        profile.src = e.target.result;
        profile.style.padding = "0";
        profile.style.filter = "invert(0)";
      };
      reader.readAsDataURL(image);
    }
  });
}
