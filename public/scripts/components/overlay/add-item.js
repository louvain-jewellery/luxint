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

  const newForm = form.cloneNode(true);
  form.parentNode.replaceChild(newForm, form);

  const newTitle = overlay.querySelector(".js-overlay-title");
  const newSubmitButton = newForm.querySelector('button[type="submit"]');
  const newPriceInput = newForm.querySelector("#itemPriceInput");

  newPriceInput.addEventListener("input", function (e) {
    const rawValue = e.target.value.replace(/\D/g, "");
    if (rawValue) {
      const numericValue = parseInt(rawValue);
      e.target.value = formatWithDots(numericValue);
    } else {
      e.target.value = "";
    }
  });

  if (item) {
    newTitle.textContent = "Edit Item";
    newSubmitButton.textContent = "Perbarui";
    newForm.dataset.mode = "edit";
    newForm.dataset.itemId = item.id;

    newForm.querySelector('[name="customerId"]').value = item.customerId;
    newForm.querySelector('[name="type"]').value = item.type;
    newForm.querySelector('[name="itemName"]').value = item.itemName;
    newForm.querySelector('[name="weight"]').value = item.weight;
    newForm.querySelector('[name="date"]').value = item.date;
    newForm.querySelector('[name="goldPurity"]').value = item.goldPurity;
    newForm.querySelector('[name="sellingPrice"]').value = item.sellingPrice;
    newForm.querySelector('[name="productImage"]').value = item.productImage;
  } else {
    newTitle.textContent = "Item Baru";
    newSubmitButton.textContent = "Tambah";
    newForm.dataset.mode = "add";
    delete newForm.dataset.itemId;
    newForm.reset();
  }

  newForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const currentPriceInput = this.querySelector("#itemPriceInput");
    const rawPrice = currentPriceInput.value.replace(/\D/g, "");
    currentPriceInput.value = rawPrice || "0";

    const formData = new FormData(this);
    const isEditMode = newForm.dataset.mode === "edit";

    if (isEditMode && newForm.dataset.itemId) {
      formData.append("id", newForm.dataset.itemId);
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

        currentPriceInput.value = "";
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

  const newSalesSelect = salesSelect.cloneNode(true);
  salesSelect.parentNode.replaceChild(newSalesSelect, salesSelect);

  newSalesSelect.innerHTML = "";
  const option = document.createElement("option");
  option.selected = true;
  option.disabled = true;
  option.textContent = "Sales";
  newSalesSelect.appendChild(option);

  try {
    const response = await fetch("/api/sales");
    const data = await response.json();

    data.forEach((sales) => {
      const option = document.createElement("option");
      option.value = sales.id;
      option.textContent = sales.name;

      newSalesSelect.appendChild(option);
    });
  } catch (error) {
    console.error("failed to load sales options:", error);
  }

  if (salesId) {
    newSalesSelect.value = salesId.toString();
  }

  newSalesSelect.addEventListener("change", function () {
    const salesId = parseInt(this.value);
    saveSelectedSales(salesId);
    loadCustomerOption(overlay);
    reloadPage();
  });
}

function setupImageInput(overlay) {
  const imageInput = overlay.querySelector(".js-item-image-input");
  const imageInputButton = overlay.querySelector(".js-image-input-button");

  const newImageInputButton = imageInputButton.cloneNode(true);
  imageInputButton.parentNode.replaceChild(
    newImageInputButton,
    imageInputButton
  );

  const newImageInput = imageInput.cloneNode(true);
  imageInput.parentNode.replaceChild(newImageInput, imageInput);

  newImageInputButton.addEventListener("click", () => newImageInput.click());
  newImageInput.addEventListener("change", (event) => {
    const image = event.target.files[0];
    if (image) {
      const imageName = image.name;
      if (imageName.length > 15) {
        newImageInputButton.textContent = imageName.slice(0, 15) + "...";
      } else {
        newImageInputButton.textContent = imageName;
      }
    }
  });
}
