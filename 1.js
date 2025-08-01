  const slider = document.getElementById("slider");
  const next = document.getElementById("next");
  const prev = document.getElementById("prev");

  let scrollAmount = 0;
  const scrollPerClick = 280;

  next.addEventListener("click", () => {
    slider.scrollBy({ left: scrollPerClick, behavior: "smooth" });
  });

  prev.addEventListener("click", () => {
    slider.scrollBy({ left: -scrollPerClick, behavior: "smooth" });
  });
