export function renderBottomNav() {
  document.querySelector(".js-bottom-nav").innerHTML = `
    <ul class="bottom-nav__list">
      <li class="bottom-nav__item selected">
        <a class="bottom-nav__item-link" href="index.html">
          <img
            class="icon nav-icon"
            src="assets/icons/person_24dp_000000_FILL1_wght400_GRAD0_opsz24.svg"
            alt=""
          />
          <p class="bottom-nav__item-name">Home</p>
        </a>
      </li>
      <li class="bottom-nav__item">
        <a class="bottom-nav__item-link" href="data.html">
          <img
            class="icon nav-icon"
            src="assets/icons/folder_24dp_000000_FILL1_wght400_GRAD0_opsz24.svg"
            alt=""
          />
          <p class="bottom-nav__item-name">Data</p>
        </a>
      </li>
      <li class="bottom-nav__item">
        <button class="bottom-nav__item-link js-add-button">
          <img
            class="icon nav-icon"
            src="assets/icons/add_2_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
            alt=""
          />
          <p class="bottom-nav__item-name">Add</p>
        </button>
      </li>
    </ul>
  `;
}
