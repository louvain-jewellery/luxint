import { reloadPage } from "../../main.js";
import {
  loadSelectedSales,
  saveSelectedSales,
} from "../../pages/sales-person.js";
import { formatWithDots } from "../../utils/number.js";
import { closeOverlay, showOverlay } from "./overlay-manager.js";

export function showAddItemOverlay() {
  const button = document.querySelector(".js-add-item-button");

  const newButton = button.cloneNode(true);
  button.parentNode.replaceChild(newButton, button);

  newButton.addEventListener("click", async () => {
    const overlay = await showOverlay("add-item");
    renderOverlay(overlay);

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

export function showEditItemOverlay(item) {
  const button = document.querySelector(".js-edit-item-button");

  const newButton = button.cloneNode(true);
  button.parentNode.replaceChild(newButton, button);

  newButton.addEventListener("click", async () => {
    closeOverlay("purchased-item");
    const overlay = await showOverlay("add-item");
    renderOverlay(overlay, item);

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

async function renderOverlay(overlay, item = null) {
  await loadSalesOption(overlay);
  await loadCustomerOption(overlay);
  setupImageInput(overlay);
  const title = overlay.querySelector(".js-overlay-title");
  const form = overlay.querySelector("#addItemForm");
  const submitButton = form.querySelector('button[type="submit"]');
  const priceInput = form.querySelector("#itemPriceInput");

  priceInput.addEventListener("input", function (e) {
    const rawValue = e.target.value.replace(/\D/g, "");
    if (rawValue) {
      const numericValue = parseInt(rawValue);
      e.target.value = formatWithDots(numericValue);
    } else {
      e.target.value = "";
    }
  });

  if (item) {
    title.textContent = "Edit Item";
    submitButton.textContent = "Perbarui";
    form.dataset.mode = "edit";
    form.dataset.itemId = item.id;

    document.querySelector('[name="customerId"]').value = item.customerId;
    document.querySelector('[name="type"]').value = item.type;
    document.querySelector('[name="itemName"]').value = item.itemName;
    document.querySelector('[name="weight"]').value = item.weight;
    document.querySelector('[name="date"]').value = item.date;
    document.querySelector('[name="goldPurity"]').value = item.goldPurity;
    document.querySelector('[name="sellingPrice"]').value = item.sellingPrice;
    document.querySelector('[name="productImage"]').value = item.productImage;
  } else {
    title.textContent = "Item Baru";
    submitButton.textContent = "Tambah";
    form.dataset.mode = "add";
    delete form.dataset.itemId;
    form.reset();
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const rawPrice = priceInput.value.replace(/\D/g, "");
    priceInput.value = rawPrice || "0";

    const formData = new FormData(this);
    const isEditMode = form.dataset.mode === "edit";

    if (isEditMode && form.dataset.itemId) {
      formData.append("id", form.dataset.itemId);
    }

    const submitButton = this.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = isEditMode ? "Memperbarui..." : "Menambah...";

    fetch("/api/items", {
      method: isEditMode ? "PUT" : "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          alert(
            isEditMode
              ? "Barang berhasil diperbarui!"
              : "Barang berhasil ditambah!"
          );
          this.reset();
          closeOverlay("add-item");
          reloadPage();
        } else {
          alert(
            isEditMode ? "Gagal memperbarui barang" : "Gagal menambah barang"
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

        priceInput.value = "";
      });
  });
}

async function loadCustomerOption(overlay) {
  const salesId = loadSelectedSales();
  const customerSelect = overlay.querySelector(".js-overlay-customer-select");
  customerSelect.innerHTML = "";
  const option = document.createElement("option");
  option.selected = true;
  option.disabled = true;
  option.textContent = "Pilih";
  customerSelect.appendChild(option);

  try {
    const response = await fetch("/api/customers");
    const data = await response.json();
    const customers = data.filter(
      (customers) => customers.salesId === parseInt(salesId)
    );
    customers.forEach((customer) => {
      const option = document.createElement("option");
      option.value = customer.id;
      option.textContent = customer.name;

      customerSelect.appendChild(option);
    });
  } catch (error) {
    console.error("failed to load customer options: ", error);
  }

  const hash = window.location.hash.slice(1);
  const [pageName, parameter] = hash.split("/");
  if (pageName === "purchased-items" && parameter) {
    customerSelect.value = parameter;
  }
}

export async function loadSalesOption(overlay) {
  const salesId = loadSelectedSales();
  const salesSelect = overlay.querySelector(".js-overlay-sales-select");
  salesSelect.innerHTML = "";
  const option = document.createElement("option");
  option.selected = true;
  option.disabled = true;
  option.textContent = "Sales";
  salesSelect.appendChild(option);

  try {
    const response = await fetch("/api/sales");
    const data = await response.json();

    data.forEach((sales) => {
      const option = document.createElement("option");
      option.value = sales.id;
      option.textContent = sales.name;

      salesSelect.appendChild(option);
    });
  } catch (error) {
    console.error("failed to load sales options:", error);
  }

  if (salesId) {
    salesSelect.value = salesId.toString();
  }

  salesSelect.addEventListener("change", function () {
    const salesId = parseInt(this.value);
    saveSelectedSales(salesId);
    loadCustomerOption(overlay);
    reloadPage();
  });
}

function setupImageInput(overlay) {
  const imageInput = overlay.querySelector(".js-item-image-input");
  const imageInputButton = overlay.querySelector(".js-image-input-button");
  imageInputButton.addEventListener("click", () => imageInput.click());
  imageInput.addEventListener("change", (event) => {
    const image = event.target.files[0];
    if (image) {
      const imageName = image.name;
      if (imageName.length > 15) {
        imageInputButton.textContent = imageName.slice(0, 15) + "...";
      } else {
        imageInputButton.textContent = imageName;
      }
    }
  });
}
