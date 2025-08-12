export function showAddOverlay() {
  const addButton = document.querySelector(".js-add-button");
  const addOverlay = document.querySelector(".js-add-overlay");
  const closeButton = addOverlay.querySelector(".js-close-button");

  function openOverlay() {
    addOverlay.classList.add("visible");
    document.body.style.overflow = "hidden";
  }

  function closeOverlay() {
    addOverlay.classList.remove("visible");
    document.body.style.overflow = "auto";
  }

  addButton.addEventListener("click", openOverlay);
  closeButton.addEventListener("click", closeOverlay);
  addOverlay.addEventListener("click", (e) => {
    if (!e.target.closest(".js-add-overlay-wrapper")) {
      closeOverlay();
    }
  });
}
