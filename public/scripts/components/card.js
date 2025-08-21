import { formatSalesId } from "../utils/format-id.js";

export function loadCardData(data) {
  const card = document.querySelector(".js-card");
  const hash = window.location.hash.slice(1);
  
  const [pageName, parameter] = hash.split("/");
  if (pageName === "home") {
  }

  if (pageName === "home" || pageName === "customers") {
    card.classList.add("card--employee");
    renderSalesCard(card, data);
    return;
  }

  if (pageName === "purchasedItems") {
    card.classList.add("card--customer");
    renderCustomerCard(card, data);
  }
}

async function renderSalesCard(card, sales) {
  const cardDetail = card.querySelector(".js-card-detail");
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

function renderCustomerCard(card, customer) {
  const cardDetail = card.querySelector(".js-card-detail");
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
