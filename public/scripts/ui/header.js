import { generateInitials } from "../utils/initials-generator.js";

export function loadTitle(data) {
  if (data) {
    const headerTitle = document.querySelector(".js-header-name");
    const pictureWrapper = document.querySelector(".js-header-picture-wrapper");
    headerTitle.textContent = data.name;

    const img = document.createElement("img");
    img.classList.add("icon", "header__name-icon");
    img.src =
      "assets/icons/arrow_back_ios_new_24dp_000000_FILL1_wght400_GRAD0_opsz24.svg";
    headerTitle.appendChild(img);

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
