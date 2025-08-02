export function showSearchBar() {
  const searchBarWrapper = document.querySelector(".js-search-bar-wrapper");
  const searchbar = searchBarWrapper.querySelector(".js-search-bar");

  document.querySelector(".js-search-button").addEventListener("click", () => {
    searchBarWrapper.classList.toggle("visible");
    setTimeout(() => {
      searchbar.focus();
    }, 300);
  });
}
