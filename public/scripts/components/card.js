import { formatSalesId } from "../utils/format-id.js";

export function showCard() {
  const header = document.querySelector(".js-header");
  const button = header.querySelector(".js-header-name");
  const card = document.createElement("div");
  card.classList.add("card", "js-card");
  card.innerHTML = `
  <div class="card__top">
  <img class="card__logo" src="assets/images/logo2.png"/>
  </div>
  <div class="card__bottom js-card-detail"></div>
  `;

  if (button) {
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
    const buttonIcon = newButton.querySelector(".js-header-name-icon");

    newButton.addEventListener("click", () => {
      const cardInHeader = header.contains(card);

      if (!cardInHeader) {
        header.appendChild(card);
        buttonIcon.style.transform = "rotate(90deg)";
        header.style.gap = "15px";
        card.classList.toggle("show");
      } else {
        buttonIcon.style.transform = "rotate(270deg)";
        card.classList.remove("show");
        header.removeChild(card);
        setTimeout(() => {
          header.style.gap = "0";
        }, 300);
      }
    });
  }
}

export function loadCardData(data) {
  const card = document.querySelector(".js-card");
  const hash = window.location.hash.slice(1);
  const [pageName, parameter] = hash.split("/");

  if (pageName === "home" || pageName === "customers") {
    card.classList.remove("card--customer");
    card.classList.add("card--employee");
    renderSalesCard(data);
    return;
  }

  if (pageName === "purchased-items") {
    card.classList.remove("card--employee");
    card.classList.add("card--customer");
    renderCustomerCard(data);
    return;
  }
}

async function renderSalesCard(sales) {
  const cardDetail = document.querySelector(".js-card-detail");
  cardDetail.innerHTML = "";
  try {
    const response = await fetch("/api/customers");
    const customersData = await response.json();
    const customers = customersData.filter(
      (customer) => customer.salesId === sales.id
    );

    cardDetail.innerHTML = `
    <div class="card__detail">
      <div class="card__row">
        <p class="card__title">ID</p>
        <p class="card__content">${formatSalesId(sales.id)}</p>
      </div>
      <div class="card__row">
        <p class="card__title">Nama</p>
        <p class="card__content">${sales.name}</p>
      </div>
      <div class="card__row">
        <p class="card__title">Pelanggan</p>
        <p class="card__content">${customers.length}
        orang</p>
      </div>
    </div>
    <div class="card__image-wrapper">
      <img class="card__image" src=${sales.image} alt="card pfp" />
    </div>
  `;
  } catch (error) {
    console.error("failed to load card-data:", error);
  }
}

function renderCustomerCard(customer) {
  const cardDetail = document.querySelector(".js-card-detail");
  cardDetail.innerHTML = "";
  cardDetail.innerHTML = `
    <div class="card__detail">
      <div class="card__row">
        <p class="card__title">Nama</p>
        <p class="card__content js-card-name">${customer.name}</p>
      </div>
      <div class="card__row">
        <p class="card__title">Nomor Hp</p>
        <p class="card__content">${customer.phone}</p>
      </div>
      <div class="card__row">
        <p class="card__title">Ukuran Cincin</p>
        <p class="card__content">${customer.ringSize}</p>
      </div>
      <div class="card__row">
        <p class="card__title">Ukuran Gelang</p>
        <p class="card__content">${customer.braceletSize}</p>
      </div>
      <div class="card__row">
        <p class="card__title">Alamat</p>
        <p class="card__content">${customer.address}</p>
      </div>
      <div class="card__row">
        <p class="card__title">Pekerjaan</p>
        <p class="card__content">${customer.job}</p>
      </div>
      <div class="card__row">
        <p class="card__title">Selera Perhiasan</p>
        <p class="card__content">${customer.favorite}</p>
      </div>
    </div>
  `;
}
