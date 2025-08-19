import { closeOverlay, showOverlay } from "./overlay-manager.js";

export function showAddSalesOverlay() {
  const button = document.querySelector(".js-selector-add");
  const newButton = button.cloneNode(true);
  button.parentNode.replaceChild(newButton, button);

  newButton.addEventListener("click", async () => {
    const overlay = await showOverlay("add-sales");
    renderOverlay(overlay);
    overlay
      .querySelector(".js-cancel-button")
      .addEventListener("click", () => closeOverlay("add-sales"));

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
  const form = overlay.querySelector("#addSalesForm");

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

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formEl = e.currentTarget;
    const formData = new FormData(formEl);
    const submitButton = formEl.querySelector('button[type="submit"]');

    submitButton.disabled = true;
    submitButton.textContent = "Menambah...";

    fetch("/api/sales", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          alert("Sales berhasil ditambah!");
          formEl.reset();
          closeOverlay("add-sales");
        } else {
          alert("Gagal menambah sales");
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
