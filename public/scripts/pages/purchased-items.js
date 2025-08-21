import { loadCardData } from "../components/card.js";
import { showPurchasedOverlay } from "../components/overlay/items.js";
import { loadTitle } from "../ui/header.js";

export function loadPurchasedItems(customerId) {
  const itemList = document.querySelector(".js-purchased-items-list");
  itemList.innerHTML = "";

  Promise.all([
    fetch("/api/items").then((response) => response.json()),
    fetch("/api/customers").then((response) => response.json()),
  ]).then(([itemsData, customersData]) => {
    const customer = customersData.find(
      (customer) => customer.id === customerId
    );
    loadTitle(customer);
    loadCardData(customer);

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
    showPurchasedOverlay();
  });
}
