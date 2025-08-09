import { generateInitials } from "../utils/initials-generator.js";
import { loadSelectedSales } from "./sales-person.js";

export function loadCustomers() {
  fetch("data/customers.json")
    .then((response) => response.json())
    .then((data) => {
      const salesId = loadSelectedSales();
      const customerList = document.querySelector(".js-customers-list");
      customerList.innerHTML = "";

      const customers = data.filter((customer) => customer.salesId === salesId);
      customers.forEach((customer) => {
        const li = document.createElement("li");
        li.classList.add("customer-data__item");
        li.dataset.customerId = customer.id;

        li.innerHTML = `
        <a class="customer-data__link" href="#customers?id=${customer.id}">
          <div class="customer-data__icon-wrapper">
            <p class="customer-data__-icon">${generateInitials(
              customer.name
            )}</p>
          </div>
          <div class="customer-data__text">
            <p class="customer-data__name">${customer.name}</p>
            <p class="customer-data__count">?? Items</p>
          </div>
        </a>
        <button class="customer-data__more-button" data-customer-id="${
          customer.id
        }">
          <img
            class="customer-data__more-icon icon"
            src="/assets/icons/more_horiz_24dp_000000_FILL1_wght400_GRAD0_opsz24.svg"
          />
        </button>
      `;

        customerList.appendChild(li);
      });
      loadCustomersTitle();
    });
}

export function loadCustomersTitle() {
  const headerTitle = document.querySelector(".js-customer-header-title");
  headerTitle.innerHTML = "";

  const pageTitle = document.querySelector(".js-customer-page-title");
  pageTitle.innerHTML = "";

  const salesId = loadSelectedSales();

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
