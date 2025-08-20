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

async function renderOverlay(overlay) {
  await loadSalesOption(overlay);
  const salesId = loadSelectedSales();
  const form = overlay.querySelector("#addCustomerForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const submitButton = this.querySelector('button[type="submit"]');

    submitButton.disabled = true;
    submitButton.textContent = "Menambah...";

    fetch("/api/customers", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          alert("Pelanggan berhasil ditambah!");
          this.reset();
          closeOverlay("add-customer");
          loadCustomers(salesId);
        } else {
          alert("Gagal menambah pelanggan");
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
