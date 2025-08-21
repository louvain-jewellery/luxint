import { generateInitials } from "../utils/initials-generator.js";

export function loadTitle(data) {
  if (data) {
    const headerTitle = document.querySelector(".js-header-name");
    headerTitle.textContent = data.name;

    const pictureWrapper = document.querySelector(".js-header-picture-wrapper");
    picture.src = data.image;
    if (!data.image) {
      pictureWrapper.innerHTML = "";
      const p = document.createElement("p");
      p.classList.add("header__picture");
      p.textContent = generateInitials(data.name);
      return;
    }

    if (data.image) {
      pictureWrapper.innerHTML = "";
      const img = document.createElement("img");
      img.classList.add("header__picture");
      img.src = data.image;
      pictureWrapper.appendChild(picture);
      return;
    }
  }
}
