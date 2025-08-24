import { showAddCustomerOverlay } from "../components/overlay/add-customer.js";
import { showMoreOverlay } from "../components/overlay/more.js";
import { adjustBodyMargin, loadHeader } from "../ui/header.js";
import { generateInitials } from "../utils/initials-generator.js";

export async function loadCustomerPage(pageName, parameter) {
  try {
    const response1 = await fetch("/api/customers");
    const response2 = await fetch("/api/sales");
    const response3 = await fetch("/api/items");

    const customersData = await response1.json();
    const salesData = await response2.json();
    const itemsData = await response3.json();

    const sales = salesData.find((sales) => sales.id === parseInt(parameter));

    loadHeader(pageName, sales);
    adjustBodyMargin();
    loadCustomers(parameter, customersData, itemsData);
    showAddCustomerOverlay();
  } catch (error) {
    console.error("failed to load customer page", error);
  }
}
function loadCustomers(salesId, customersData, itemsData) {
  const customerList = document.querySelector(".js-customers-list");
  customerList.innerHTML = "";

  if (!salesId) {
    customerList.innerHTML = "";
    const p = document.createElement("p");
    p.classList.add("customers__warning", "warning");
    p.textContent = "Pilih sales terlebih dahulu";

    customerList.appendChild(p);
    return;
  }

  const customers = customersData.filter(
    (customer) => customer.salesId === salesId
  );
  if (customers.length === 0) {
    customerList.innerHTML = "";
    const p = document.createElement("p");
    p.classList.add("customers__warning", "warning");
    p.textContent = "Tidak ada pelanggan";

    customerList.appendChild(p);
    return;
  }

  customers.forEach((customer) => {
    const items = itemsData.filter((items) => items.customerId === customer.id);
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
      `;

    customerList.appendChild(li);
  });
  showMoreOverlay();

  document.querySelectorAll(".js-customer-link").forEach((button) => {
    button.addEventListener("click", () => {
      const customerId = parseInt(button.dataset.customerId);
      window.location.hash = `purchased-items/${customerId}`;
    });
  });
}
