import { showAddCustomerOverlay } from "../components/overlay/add-customer.js";
import { showMoreOverlay } from "../components/overlay/more.js";
import { loadTitle } from "../ui/header.js";
import { generateInitials } from "../utils/initials-generator.js";

export function loadCustomers(salesId) {
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
    fetch("/api/customers").then((response) => response.json()),
    fetch("/api/sales").then((response) => response.json()),
    fetch("/api/items").then((response) => response.json()),
  ]).then(([customersData, salesData, itemsData]) => {
    customerList.innerHTML = "";

    const customers = customersData.filter(
      (customer) => customer.salesId === salesId
    );
    const sales = salesData.find((sales) => sales.id === salesId);

    customers.forEach((customer) => {
      const items = itemsData.filter(
        (items) => items.customerId === customer.id
      );
      const li = document.createElement("li");
      li.classList.add("customers__item");

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
            <p class="customers__count">${items.length} Barang</p>
          </div>
        </button>
        <button class="customers__more-button js-more-button" data-customer-id="${
          customer.id
        }">
          <img
            class="customers__more-icon icon"
            src="assets/icons/more_horiz_24dp_000000_FILL1_wght400_GRAD0_opsz24.svg"
          />
        </button>
      `;

      customerList.appendChild(li);
    });

    loadTitle(sales);
    showMoreOverlay();
    showAddCustomerOverlay();

    document.querySelectorAll(".js-customer-link").forEach((button) => {
      button.addEventListener("click", () => {
        const customerId = parseInt(button.dataset.customerId);
        window.location.hash = `purchased-items/${customerId}`;
      });
    });
  });
}
