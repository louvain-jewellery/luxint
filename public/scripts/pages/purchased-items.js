import { showPurchasedOverlay } from "../components/overlay/items.js";
import { adjustBodyMargin, loadHeader } from "../ui/header.js";

export async function loadItemPage(pageName, parameter) {
  try {
    const response1 = await fetch("/api/items");
    const response2 = await fetch("/api/customers");
    const itemsData = await response1.json();
    const customersData = await response2.json();

    const customer = customersData.find(
      (customer) => customer.id === parseInt(parameter)
    );

    loadHeader(pageName, customer);
    adjustBodyMargin();
    loadPurchasedItems(parameter, itemsData, customersData);
    showPurchasedOverlay(itemsData);
  } catch (error) {
    console.error("failed to load items page:", error);
  }
}

export function loadPurchasedItems(customerId, itemsData, customersData) {
  const itemList = document.querySelector(".js-purchased-items-list");
  itemList.innerHTML = "";
  const customer = customersData.find((customer) => customer.id === customerId);

  const items = itemsData.filter((items) => items.customerId === customerId);
  if (items.length === 0) {
    itemList.innerHTML = "";
    const p = document.createElement("p");
    p.classList.add("customers__warning", "warning");
    p.textContent = "Tidak ada barang";

    itemList.appendChild(p);
    return;
  }

  items.forEach((item) => {
    const li = document.createElement("li");
    li.classList.add("purchased-items__item");

    li.innerHTML = `
          <button
            class="purchased-items__link js-purchased-items"
            data-item-id="${item.id}"
          >
            <div class="purchased-items__icon-wrapper">
              <img
                class="purchased-items__icon"
                src="${item.productImage}"
              />
            </div>
            <div class="purchased-items__text">
              <p class="purchased-items__name">${item.itemName}</p>
              <p class="purchased-items__date">${item.date}</p>
            </div>
          </button>
        `;

    itemList.appendChild(li);
  });

  const urlParams = new URLSearchParams(window.location.hash.split("?")[1]);
  const targetItemId = urlParams.get("item");

  if (targetItemId) {
    requestAnimationFrame(() => {
      const targetEl = document.querySelector(
        `[data-item-id="${targetItemId}"]`
      );
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }
}
