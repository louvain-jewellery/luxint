export function showHeaderName() {
  window.addEventListener("scroll", () => {
    const headerName = document.querySelector(".js-header-name");

    if (window.scrollY > 64) {
      headerName.style.visibility = "visible";
      headerName.style.opacity = "1";
    } else {
      headerName.style.visibility = "hidden";
      headerName.style.opacity = "0";
    }
  });
}
