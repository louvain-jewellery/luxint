export function loadTitle(data) {
  if (data) {
    const headerTitle = document.querySelector(".js-header-name");
    const headerPicture = document.querySelector(".js-header-picture");
    headerTitle.textContent = data.name;
    headerPicture.src = data.src;
  }
}
