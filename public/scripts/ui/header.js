import { showCard } from "../components/card.js";
import { generateInitials } from "../utils/initials-generator.js";

export function renderHeader(pageName) {
  const header = document.querySelector(".js-header");

  const headerHome = document.createElement("div");
  headerHome.classList.add("header__home", "js-header-home");
  const img = document.createElement("img");
  img.classList.add("header__logo");
  img.src = "assets/images/logo.png";
  headerHome.appendChild(img);

  const headerTop = document.createElement("div");
  headerTop.classList.add("header__top", "js-header-top");
  headerTop.innerHTML = `
    <button class="btn header__button js-back-button">
      <img
        class="header__icon"
        src="assets/icons/arrow_back_ios_new_24dp_000000_FILL1_wght400_GRAD0_opsz24.svg"
      />
    </button>
    <div class="header__profile">
      <div class="header__picture-wrapper js-header-picture-wrapper"></div>
      <button class="btn header__name header__button js-header-name">
        <p>John Doe</p>
        <img
          class="icon header__name-icon js-header-name-icon"
          src="assets/icons/arrow_back_ios_new_24dp_000000_FILL1_wght400_GRAD0_opsz24.svg"
        />
      </button>
    </div>
    <button class="btn header__button js-add-customer-button">
      <img
        class="header__icon"
        src="assets/icons/add_2_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
      />
    </button>
  `;

  const headerCard = document.createElement("div");
  headerCard.classList.add("card", "js-card");
  headerCard.innerHTML = `
    <div class="card__top">
      <img class="card__logo" src="assets/images/logo2.png"/>
    </div>
    <div class="card__bottom js-card-detail"></div>
  `;

  if (pageName === "home") {
    header.innerHTML = "";
    header.appendChild(headerHome);
  }

  if (pageName === "customers" || pageName === "purchased-items") {
    header.innerHTML = "";
    header.appendChild(headerTop);
    header.appendChild(headerCard);
  }
}

export function loadTitle(data) {
  if (data) {
    const headerTitle = document.querySelector(".js-header-name");
    const pictureWrapper = document.querySelector(".js-header-picture-wrapper");
    headerTitle.textContent = data.name;

    const img = document.createElement("img");
    img.classList.add("icon", "header__name-icon", "js-header-name-icon");
    img.src =
      "assets/icons/arrow_back_ios_new_24dp_000000_FILL1_wght400_GRAD0_opsz24.svg";
    headerTitle.appendChild(img);

    if (!data.image) {
      pictureWrapper.innerHTML = "";
      const p = document.createElement("p");
      p.classList.add("header__picture");
      p.textContent = generateInitials(data.name);
      pictureWrapper.appendChild(p);
      return;
    }

    if (data.image) {
      pictureWrapper.innerHTML = "";
      const img = document.createElement("img");
      img.classList.add("header__picture");
      img.src = data.image;
      pictureWrapper.appendChild(img);
      return;
    }
  }
}

export function adjustBodyMargin() {
  const header = document.querySelector(".js-header");
  const body = document.body;

  body.style.marginTop = header.offsetHeight + "px";
}
