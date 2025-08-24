export function showSearchBar() {
  let searchData = null;

  async function loadSearchData() {
    if (!searchData) {
      const response1 = await fetch("/api/customers");
      const response2 = await fetch("/api/sales");
      const response3 = await fetch("/api/items");

      const customersData = await response1.json();
      const salesData = await response2.json();
      const itemsData = await response3.json();

      searchData = { customersData, salesData, itemsData };
    }
    return searchData;
  }

  function generateInitials(name) {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  }

  const nav = document.querySelector(".js-bottom-nav");
  const button = nav.querySelector(".js-search-button");
  const searchWrapper = nav.querySelector(".js-search-wrapper");
  const searchInput = searchWrapper.querySelector(".js-search-input");

  const newButton = button.cloneNode(true);
  button.parentNode.replaceChild(newButton, button);
  const buttonIcon = newButton.querySelector(".js-search-icon");

  // Create results container
  let resultsContainer = searchWrapper.querySelector(".search-results");
  if (!resultsContainer) {
    resultsContainer = document.createElement("div");
    resultsContainer.className = "search-results";
    resultsContainer.style.cssText = `
      position: absolute;
      bottom: 100%;
      left: 0;
      right: 0;
      padding: 0.7%;
      background: rgba(255, 255, 255, 0.09);
      backdrop-filter: blur(20px) saturate(180%);
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.3),
        inset 0 0 4px 2px rgba(255, 255, 255, 0.045);
      border-radius: 25px;
      margin-bottom: 10px;
      max-height: 300px;
      overflow-y: auto;
      z-index: 1000;
      display: none;
    `;
    searchWrapper.appendChild(resultsContainer);
  }

  const closeSearch = () => {
    searchWrapper.classList.remove("show");
    buttonIcon.src =
      "assets/icons/search_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
    buttonIcon.style.transform = "rotate(0)";
    resultsContainer.style.display = "none";
    searchInput.value = "";
  };

  window.addEventListener("hashchange", () => {
    closeSearch();
  });

  newButton.addEventListener("click", async () => {
    if (!searchWrapper.classList.contains("show")) {
      searchWrapper.classList.add("show");
      buttonIcon.src =
        "assets/icons/arrow_back_ios_new_24dp_000000_FILL1_wght400_GRAD0_opsz24.svg";
      buttonIcon.style.transform = "rotate(270deg)";
      setTimeout(() => {
        searchInput.focus({ preventScroll: true });
      }, 400);

      // Load data when search opens
      await loadSearchData();
    } else {
      closeSearch();
    }
  });

  // Search functionality
  let searchTimeout;
  searchInput.addEventListener("input", async (e) => {
    const query = e.target.value.trim();

    clearTimeout(searchTimeout);

    if (!query) {
      resultsContainer.style.display = "none";
      return;
    }

    searchTimeout = setTimeout(async () => {
      const data = await loadSearchData();
      const results = [];

      // Search customers
      data.customersData.forEach((customer) => {
        if (customer.name.toLowerCase().includes(query.toLowerCase())) {
          const items = data.itemsData.filter(
            (item) => item.customerId === customer.id
          );
          results.push({
            type: "customer",
            data: customer,
            itemsCount: items.length,
          });
        }
      });

      // Search items
      data.itemsData.forEach((item) => {
        if (item.itemName.toLowerCase().includes(query.toLowerCase())) {
          results.push({
            type: "item",
            data: item,
          });
        }
      });

      displayResults(results.slice(0, 10));
    }, 300);
  });

  function displayResults(results) {
    if (results.length === 0) {
      resultsContainer.innerHTML = `
        <div style="padding: 15px">No results found</div>
      `;
      resultsContainer.style.display = "block";
      return;
    }

    resultsContainer.innerHTML = results
      .map((result) => {
        if (result.type === "customer") {
          return `
          <li class="customers__item">
            <button class="customers__link js-customer-link" data-customer-id="${
              result.data.id
            }">
              <div class="customers__icon-wrapper">
                <p class="customers__icon">${generateInitials(
                  result.data.name
                )}</p>
              </div>
              <div class="customers__text">
                <p class="customers__name">${result.data.name}</p>
                <p class="customers__count">${result.itemsCount} Barang</p>
              </div>
            </button>
          </li>
        `;
        } else {
          return `
          <li class="purchased-items__item">
            <button class="purchased-items__link js-purchased-items" data-item-id="${result.data.id}">
              <div class="purchased-items__icon-wrapper">
                <img class="purchased-items__icon" src="${result.data.productImage}" />
              </div>
              <div class="purchased-items__text">
                <p class="purchased-items__name">${result.data.itemName}</p>
                <p class="purchased-items__date">${result.data.date}</p>
              </div>
            </button>
          </li>
        `;
        }
      })
      .join("");

    resultsContainer.style.display = "block";

    // Add click listeners
    resultsContainer
      .querySelectorAll("[data-customer-id]")
      .forEach((element) => {
        element.addEventListener("click", () => {
          const customerId = element.dataset.customerId;
          window.location.hash = `purchased-items/${customerId}`;
          closeSearch();
        });
      });

    resultsContainer.querySelectorAll("[data-item-id]").forEach((element) => {
      element.addEventListener("click", async () => {
        const itemId = element.dataset.itemId;
        const data = await loadSearchData();
        const item = data.itemsData.find(
          (item) => item.id === parseInt(itemId)
        );

        if (item) {
          window.location.hash = `purchased-items/${item.customerId}?item=${item.id}`;
        }

        closeSearch();
      });
    });
  }

  // Hide results when clicking outside
  document.addEventListener("click", (e) => {
    if (!searchWrapper.contains(e.target)) {
      resultsContainer.style.display = "none";
    }
  });
}
