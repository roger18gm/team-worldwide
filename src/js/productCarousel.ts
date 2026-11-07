const gallery = document.querySelector<HTMLElement>("[data-product-gallery]");

if (gallery) {
  const image = gallery.querySelector<HTMLImageElement>("[data-gallery-image]");
  const options = Array.from(
    gallery.querySelectorAll<HTMLButtonElement>("[data-gallery-option]"),
  );
  const previous = gallery.querySelector<HTMLButtonElement>("[data-gallery-previous]");
  const next = gallery.querySelector<HTMLButtonElement>("[data-gallery-next]");

  let selectedIndex = 0;

  const showImage = (index: number) => {
    selectedIndex = (index + options.length) % options.length;
    const selected = options[selectedIndex];

    if (!image || !selected) return;

    image.src = selected.dataset.imageSrc ?? image.src;
    image.alt = selected.dataset.imageAlt ?? image.alt;

    options.forEach((option, optionIndex) => {
      const isSelected = optionIndex === selectedIndex;
      option.classList.toggle("product-gallery__option--active", isSelected);
      if (isSelected) {
        option.setAttribute("aria-current", "true");
      } else {
        option.removeAttribute("aria-current");
      }
    });
  };

  options.forEach((option, index) => {
    option.addEventListener("click", () => showImage(index));
  });
  previous?.addEventListener("click", () => showImage(selectedIndex - 1));
  next?.addEventListener("click", () => showImage(selectedIndex + 1));
}
