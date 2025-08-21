import { generateInitials } from "../utils/initials-generator.js";

export function loadTitle(data) {
  if (data) {
    const headerTitle = document.querySelector(".js-header-name");
    const pictureWrapper = document.querySelector(".js-header-picture-wrapper");
    headerTitle.textContent = data.name;

    if (!data.image) {
      pictureWrapper.innerHTML = "";
      const p = document.createElement("p");
      p.classList.add("header__picture");
      p.textContent = generateInitials(data.name);
      pictureWrapper.appendChild(p);
      return;
    }

    if (data.image) {
      pictureWrapper.innerHTML = "";
      const img = document.createElement("img");
      img.classList.add("header__picture");
      img.src = data.image;
      pictureWrapper.appendChild(img);
      return;
    }
  }
}
