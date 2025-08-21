export function loadTitle(data) {
  if (data) {
    const headerTitle = document.querySelector(".js-header-title");
    headerTitle.textContent = data.name;
  }
}
