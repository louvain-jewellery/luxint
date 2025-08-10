import { showMoreOverlay } from "../components/more.js";
import { generateInitials } from "../utils/initials-generator.js";
import { loadSelectedSales } from "./sales-person.js";

export function loadCustomers() {
  const salesId = loadSelectedSales();
  const customerList = document.querySelector(".js-customers-list");

  if (!salesId) {
    customerList.innerHTML = "";
    const p = document.createElement("p");
    p.classList.add("customers__warning", "warning");
    p.textContent = "Pilih sales terlebih dahulu";

    customerList.appendChild(p);
    return;
  }

  Promise.all([
    fetch("data/customers.json").then((response) => response.json()),
    fetch("data/purchased-items.json").then((response) => response.json()),
  ]).then(([customersData, itemsData]) => {
    customerList.innerHTML = "";

    const customers = customersData.filter(
      (customer) => customer.salesId === salesId
    );

    const itemCountMap = {};
    itemsData.forEach((item) => {
      if (itemCountMap[item.customerId]) {
        itemCountMap[item.customerId]++;
      } else {
        itemCountMap[item.customerId] = 1;
      }
    });

    customers.forEach((customer) => {
      const li = document.createElement("li");
      li.classList.add("customers__item");

      const itemCount = itemCountMap[customer.id] || 0;
      const itemText = itemCount <= 1 ? "item" : "items";

      li.innerHTML = `
        <button
          class="customers__link js-customer-link"
          data-customer-id="${customer.id}"
        >
          <div class="customers__icon-wrapper">
            <p class="customers__icon">${generateInitials(customer.name)}</p>
          </div>
          <div class="customers__text">
            <p class="customers__name">${customer.name}</p>
            <p class="customers__count">${itemCount} ${itemText}</p>
          </div>
        </button>
        <button class="customers__more-button js-more-button" data-customer-id="${
          customer.id
        }">
          <img
            class="customers__more-icon icon"
            src="/assets/icons/more_horiz_24dp_000000_FILL1_wght400_GRAD0_opsz24.svg"
          />
        </button>
      `;

      customerList.appendChild(li);
    });
    showMoreOverlay();
    loadCustomersTitle(salesId);
    
    document.querySelectorAll(".js-customer-link").forEach((button) => {
      button.addEventListener("click", () => {
        const customerId = button.dataset.customerId;
        window.location.hash = `purchased-items/${customerId}`;
      });
    });
  });
}

export function loadCustomersTitle(salesId) {
  const headerTitle = document.querySelector(".js-customer-header-title");
  headerTitle.innerHTML = "";

  const pageTitle = document.querySelector(".js-customer-page-title");
  pageTitle.innerHTML = "";

  fetch("data/sales.json")
    .then((response) => response.json())
    .then((data) => {
      const sales = data.find((sales) => sales.id === salesId);
      if (sales) {
        headerTitle.textContent = sales.name;
        pageTitle.textContent = sales.name;
      }
    });
}