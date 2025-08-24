import { closeOverlay, showOverlay } from "./overlay-manager.js";
import { loadHomePage, loadSales } from "../../pages/sales-person.js";
import { reloadPage } from "../../main.js";

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

  if (sales) {
    title.textContent = "Edit Sales";
    submitButton.textContent = "Perbarui";
    form.dataset.mode = "edit";
    form.dataset.salesId = sales.id;

    form.querySelector('[name="name"]').value = sales.name || "";

    if (sales.image) {
      profile.src = sales.image;
      profile.style.padding = "0";
      profile.style.filter = "invert(0)";
    } else {
      profile.src =
        "assets/icons/add_2_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
      profile.style.padding = "15px";
      profile.style.filter = "invert(1)";
    }
  } else {
    title.textContent = "Tambah Sales";
    submitButton.textContent = "Tambah";
    form.dataset.mode = "add";
    delete form.dataset.salesId;
    form.reset();

    profile.src =
      "assets/icons/add_2_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
    profile.style.padding = "15px";
    profile.style.filter = "invert(1)";
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const isEditMode = form.dataset.mode === "edit";

    if (isEditMode && form.dataset.salesId) {
      formData.append("id", form.dataset.salesId);
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
          reloadPage();
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
