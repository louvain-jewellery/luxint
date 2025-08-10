export function loadPurchasedItems(customerId) {
  const itemList = document.querySelector(".js-purchased-items-list");

  fetch("data/purchased-items.json")
    .then((response) => response.json())
    .then((data) => {
      const items = data.filter((items) => items.customerId === customerId);
      itemList.innerHTML = "";

      items.forEach((item) => {
        const li = document.createElement("li");
        li.classList.add("purchased-items__item");

        li.innerHTML = `
          <button
            class="purchased-items__link js-purchased-items-link"
            data-purchased-id="${item.id}"
          >
            <div class="purchased-items__icon-wrapper">
              <img
                class="purchased-items__icon"
                src="/assets/icons/jewellery/${item.type}.png"
              />
            </div>
            <div class="purchased-items__text">
              <p class="purchased-items__name">${item.itemName}</p>
              <p class="purchased-items__date">${item.date}</p>
            </div>
          </button>
          <button
            class="purchased-items__more-button"
            data-purchased-id="${item.id}"
          >
            <img
              class="purchased-items__more-icon icon"
              src="/assets/icons/more_horiz_24dp_000000_FILL1_wght400_GRAD0_opsz24.svg"
            />
          </button>
        `;

        itemList.appendChild(li);
      });
      loadPurchasedTitle(customerId);
    });
}

export function loadPurchasedTitle(customerId) {
  const headerTitle = document.querySelector(".js-purchased-header-title");
  headerTitle.innerHTML = "";

  const pageTitle = document.querySelector(".js-purchased-page-title");
  pageTitle.innerHTML = "";

  fetch("data/customers.json")
    .then((response) => response.json())
    .then((data) => {
      const customer = data.find((customer) => customer.id === customerId);
      headerTitle.textContent = customer.name;
      pageTitle.textContent = customer.name;
    });
}
