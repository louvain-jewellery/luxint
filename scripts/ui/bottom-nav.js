import { showSearchBar } from "../components/search.js";

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
        <a class="bottom-nav__item-link" href="add.html">
          <img
            class="icon nav-icon"
            src="assets/icons/add_2_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
            alt=""
          />
          <p class="bottom-nav__item-name">Add</p>
        </a>
      </li>
    </ul>
    <ul class="bottom-nav__list--right">
      <li class="bottom-nav__item--right js-search-button">
        <img
          class="icon nav-icon bottom-nav__search-icon js-search-icon"
          src="assets/icons/search_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
          alt=""
        />
        <!-- <p class="bottom-nav__item-name">Search</p> -->
      </li>
    </ul>
    <div class="bottom-nav__search-bar js-search-bar-wrapper">
      <input
        class="bottom-nav__search-bar-input js-search-bar"
        type="text"
        name="bro"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
        placeholder="Search..."
      />
      <img
        class="icon nav-icon bottom-nav__search-bar-icon"
        src="assets/icons/search_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
        alt=""
      />
    </div>
  `;

  showSearchBar();
}
