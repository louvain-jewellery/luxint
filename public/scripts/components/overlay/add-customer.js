import { loadCustomers } from "../../pages/customers.js";
import { loadSelectedSales } from "../../pages/sales-person.js";
import { loadSalesOption } from "./add-item.js";
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

export function showEditCustomerOverlay(customer) {
  const button = document.querySelector(".js-edit-customer-button");

  const newButton = button.cloneNode(true);
  button.parentNode.replaceChild(newButton, button);

  newButton.addEventListener("click", async () => {
    const overlay = await showOverlay("add-customer");
    renderOverlay(overlay, customer);

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

async function renderOverlay(overlay, customer = null) {
  await loadSalesOption(overlay);
  const salesId = loadSelectedSales();
  const form = overlay.querySelector("#addCustomerForm");
  const title = overlay.querySelector(".js-overlay-title");
  const submitButton = form.querySelector('button[type="submit"]');

  if (customer) {
    title.textContent = "Edit Pelanggan";
    submitButton.textContent = "Perbarui";
    form.dataset.mode = "edit";
    form.dataset.customerId = customer.id;

    form.querySelector('[name="salesId"]').value = customer.salesId || "";
    form.querySelector('[name="name"]').value = customer.name || "";
    form.querySelector('[name="phone"]').value = customer.phone || "";
    form.querySelector('[name="ringSize"]').value = customer.ringSize || "";
    form.querySelector('[name="braceletSize"]').value =
      customer.braceletSize || "";
    form.querySelector('[name="address"]').value = customer.address || "";
    form.querySelector('[name="job"]').value = customer.job || "";
    form.querySelector('[name="favorite"]').value = customer.favorite || "";
  } else {
    title.textContent = "Pelanggan Baru";
    submitButton.textContent = "Tambah";
    form.dataset.mode = "add";
    delete form.dataset.customerId;
    form.reset();
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const isEditMode = this.dataset.mode === "edit";

    if (isEditMode && this.dataset.customerId) {
      formData.append("id", this.dataset.customerId);
    }

    const submitButton = this.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = isEditMode ? "Memperbarui..." : "Menambah...";

    fetch("/api/customers", {
      method: isEditMode ? "PUT" : "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          alert(
            isEditMode
              ? "Pelanggan berhasil diperbarui!"
              : "Pelanggan berhasil ditambah!"
          );
          this.reset();
          closeOverlay("add-customer");
          loadCustomers(salesId);
        } else {
          alert(
            isEditMode
              ? "Gagal memperbarui pelanggan"
              : "Gagal menambah pelanggan"
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
