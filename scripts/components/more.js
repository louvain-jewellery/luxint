import { generateInitials } from "../utils/initials-generator.js";

export function showMoreOverlay() {
  const moreOverlay = document.querySelector(".js-more-overlay");
  const moreButton = document.querySelectorAll(".js-more-button");

  moreButton.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      const { customerId } = button.dataset;
      moreOverlay.classList.add("active");

      Promise.all([
        fetch("data/customers.json").then((response) => response.json()),
        fetch("data/purchased-items.json").then((response) => response.json()),
      ]).then(([customersData, itemsData]) => {
        const customer = customersData.find(
          (customer) => customer.id === customerId
        );

        const itemCountMap = {};
        itemsData.forEach((item) => {
          if (itemCountMap[item.customerId]) {
            itemCountMap[item.customerId]++;
          } else {
            itemCountMap[item.customerId] = 1;
          }
        });

        const itemCount = itemCountMap[customer.id] || 0;
        const itemText = itemCount <= 1 ? "item" : "items";

        moreOverlay.innerHTML = `
          <div class="overlay__selected-item js-selected-item">
            <div class="overlay__icon-wrapper">
              <p class="overlay__icon">${generateInitials(customer.name)}</p>
            </div>
            <div class="overlay__text">
              <p class="overlay__name">${customer.name}</p>
              <p class="overlay__count">${itemCount} ${itemText}</p>
            </div>
          </div>
        `;

        const div = document.createElement("div");
        div.classList.add("menu");

        div.innerHTML = `
          <div class="menu__item">
            <img
              class="menu-icon icon"
              src="/assets/icons/edit_24dp_000000_FILL1_wght400_GRAD0_opsz24.svg"
            />
            <p class="menu__label">Ganti nama</p>
          </div>
          <div class="menu__item">
            <img
              class="menu__icon menu__icon--danger icon"
              src="/assets/icons/delete_24dp_000000_FILL1_wght400_GRAD0_opsz24.svg"
            />
            <p class="menu__label menu__label--danger">Hapus</p>
          </div>
        `;

        moreOverlay.appendChild(div);
      });
    });
  });

  moreOverlay.addEventListener("click", (e) => {
    if (!e.target.closest(".js-selected-item") && !e.target.closest(".menu")) {
      moreOverlay.classList.remove("active");
    }
  });
}
