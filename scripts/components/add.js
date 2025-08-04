export function renderAddOverlay() {
  document.querySelector(".js-add-overlay").innerHTML = `
    <div class="add-overlay__top">
        <h2 class="add-overlay__title-text">Tambahkan Item</h2>
        <button class="add-overlay__close-button js-close-button">
          &#10005;
        </button>
      </div>

      <form class="add-form" action="/submit" method="POST">
        <div class="add-form__item-wrapper">
          <div class="add-form__item">
            <label class="add-form__item-name" for="name">Nama :</label>
            <input class="add-form__item-input" type="text" name="name" />
          </div>
          <div class="add-form__item">
            <label class="add-form__item-name" for="weight">Berat :</label>
            <input class="add-form__item-input" type="text" name="weight" />
          </div>
          <div class="add-form__item">
            <label class="add-form__item-name" for="gold">Kadar Emas :</label>
            <input class="add-form__item-input" type="text" name="gold" />
          </div>
          <div class="add-form__item">
            <label class="add-form__item-name" for="price">Harga Jual :</label>
            <input class="add-form__item-input" type="text" name="price" />
          </div>
        </div>

        <button class="add-overlay__submit-button">Submit</button>
      </form>
  `;

  showAddOverlay();
}

export function showAddOverlay() {
  const addButton = document.querySelector(".js-add-button");
  const addOverlay = document.querySelector(".js-add-overlay");
  const closeButton = document.querySelector(".js-close-button");

  addButton.addEventListener("click", () => {
    addOverlay.classList.toggle("visible");
  });

  closeButton.addEventListener("click", () => {
    addOverlay.classList.toggle("visible");
  });
}
