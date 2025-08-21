export function loadTitle(data) {
  if (data) {
    const headerTitle = document.querySelector(".js-header-title");
    const pageTitle = document.querySelector(".js-page-title");

    headerTitle.textContent = data.name;
    pageTitle.textContent = data.name;
  }
}
