import { generateInitials } from "../utils/initials-generator.js";

export function loadTitle(data) {
  if (data) {
    const headerTitle = document.querySelector(".js-header-name");
    const pictureWrapper = document.querySelector(".js-header-picture-wrapper");
    const headerPicture = pictureWrapper.querySelector(".js-header-picture");
    headerTitle.textContent = data.name;
    if (!headerPicture) {
      headerPicture.src = data.image;
    } else {
      pictureWrapper.innerHTML = "";
      pictureWrapper.innerHTML = `
        <div class="customers__icon-wrapper">
          <p class="customers__icon">${generateInitials(data.name)}</p>
      `;
    }
  }
}
