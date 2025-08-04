export function showSearchBar() {
  const searchBarWrapper = document.querySelector(".js-search-bar-wrapper");
  const searchbar = searchBarWrapper.querySelector(".js-search-bar");
  const searchIcon = document.querySelector(".js-search-icon");

  document.querySelector(".js-search-button").addEventListener("click", () => {
    searchBarWrapper.classList.toggle("visible");
    setTimeout(() => {
      searchbar.focus();
    }, 400);
    if (searchBarWrapper.classList.contains("visible")) {
      searchIcon.src =
        "assets/icons/arrow_back_ios_new_24dp_000000_FILL1_wght400_GRAD0_opsz24.svg";
      searchIcon.style.transform = "rotate(270deg)";
    } else {
      searchIcon.src =
        "assets/icons/search_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
      searchIcon.style.transform = "rotate(0deg)";
    }
  });
}
