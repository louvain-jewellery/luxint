export function loadTitle(data) {
  if (data) {
    const headerTitle = document.querySelector(".js-header-name");
    headerTitle.textContent = data.name;
  }
}
