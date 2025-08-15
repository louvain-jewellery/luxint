import { showPurchasedOverlay } from "../components/overlay/purchased-overlay.js";
import { loadTitle } from "../ui/header.js";

export function loadPurchasedItems(customerId) {
  const itemList = document.querySelector(".js-purchased-items-list");

  Promise.all([
    fetch("/api/items").then((response) => response.json()),
    fetch("/api/customers").then((response) => response.json()),
  ]).then(([itemsData, customersData]) => {
    const items = itemsData.filter(
      (items) => items.customerId === parseInt(customerId)
    );

    console.log(items.customerId);
    console.log(customerId);
    itemList.innerHTML = "";
    const customer = customersData.find(
      (customer) => customer.id === parseInt(customerId)
    );

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

    loadTitle(customer);
    showPurchasedOverlay();
  });
}
