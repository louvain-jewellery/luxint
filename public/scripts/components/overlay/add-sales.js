import { closeOverlay, showOverlay } from "./overlay-manager.js";
import { loadSales } from "../../pages/sales-person.js";

export function showAddSalesOverlay() {
  const button = document.querySelector(".js-add-sales-button");
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

export function showEditSalesOverlay(sales) {
  const button = document.querySelector(".js-edit-sales-button");
  const newButton = button.cloneNode(true);
  button.parentNode.replaceChild(newButton, button);

  newButton.addEventListener("click", async () => {
    const overlay = await showOverlay("add-sales");
    renderOverlay(overlay, sales);
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

function renderOverlay(overlay, sales = null) {
  const profileInput = overlay.querySelector("#salesProfileInput");
  const profile = overlay.querySelector(".js-overlay-profile");
  const form = overlay.querySelector("#addSalesForm");
  const title = overlay.querySelector(".js-overlay-title");
  const submitButton = form.querySelector('button[type="submit"]');

  const newForm = form.cloneNode(true);
  form.parentNode.replaceChild(newForm, form);

  const newProfileInput = newForm.querySelector("#salesProfileInput");
  const newProfile = newForm.querySelector(".js-overlay-profile");
  const newTitle = overlay.querySelector(".js-overlay-title");
  const newSubmitButton = newForm.querySelector('button[type="submit"]');

  newProfile.addEventListener("click", () => newProfileInput.click());

  newProfileInput.addEventListener("change", (event) => {
    const image = event.target.files[0];
    if (image) {
      const reader = new FileReader();
      reader.onload = (e) => {
        newProfile.src = e.target.result;
        newProfile.style.padding = "0";
        newProfile.style.filter = "invert(0)";
      };
      reader.readAsDataURL(image);
    }
  });

  if (sales) {
    newTitle.textContent = "Edit Sales";
    newSubmitButton.textContent = "Perbarui";
    newForm.dataset.mode = "edit";
    newForm.dataset.salesId = sales.id;

    newForm.querySelector('[name="name"]').value = sales.name || "";

    if (sales.image) {
      newProfile.src = sales.image;
      newProfile.style.padding = "0";
      newProfile.style.filter = "invert(0)";
    } else {
      newProfile.src =
        "assets/icons/add_2_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
      newProfile.style.padding = "15px";
      newProfile.style.filter = "invert(1)";
    }
  } else {
    newTitle.textContent = "Tambah Sales";
    newSubmitButton.textContent = "Tambah";
    newForm.dataset.mode = "add";
    delete newForm.dataset.salesId;
    newForm.reset();

    newProfile.src =
      "assets/icons/add_2_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
    newProfile.style.padding = "15px";
    newProfile.style.filter = "invert(1)";
  }

  // Add submit listener ONCE to the new form
  newForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const isEditMode = newForm.dataset.mode === "edit";

    if (isEditMode && newForm.dataset.salesId) {
      formData.append("id", newForm.dataset.salesId);
    }

    const submitButton = this.querySelector('button[type="submit"]');

    submitButton.disabled = true;
    submitButton.textContent = isEditMode ? "Memperbarui..." : "Menambah...";

    fetch("/api/sales", {
      method: isEditMode ? "PUT" : "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          alert(
            isEditMode
              ? "Sales berhasil diperbarui"
              : "Sales berhasil ditambah!"
          );
          this.reset();
          closeOverlay("add-sales");
          loadSales();
        } else {
          alert(
            isEditMode ? "Gagal memperbarui sales" : "Gagal menambah sales"
          );
        }
      })
      .catch((error) => {
        alert("Terjadi Kesalahan");
        console.log("Error:", error);
      })
      .finally(() => {
        submitButton.disabled = false;
        submitButton.textContent = isEditMode ? "Perbarui" : "Tambah";
      });
  });
}
