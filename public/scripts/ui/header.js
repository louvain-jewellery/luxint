export function showHeaderName() {
  window.addEventListener("scroll", () => {
    const headerName = document.querySelector(".js-header-title");

    if (window.scrollY > 64) {
      headerName.style.visibility = "visible";
      headerName.style.opacity = "1";
    } else {
      headerName.style.visibility = "hidden";
      headerName.style.opacity = "0";
    }
  });
}

export function loadTitle(data) {
  const headerTitle = document.querySelector(".js-header-title");
  const pageTitle = document.querySelector(".js-page-title");

  headerTitle.textContent = data.name;
  pageTitle.textContent = data.name;
}
