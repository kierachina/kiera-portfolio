const year = document.querySelector("[data-year]");
if (year) {
  year.textContent = new Date().getFullYear();
}

const navLinks = [...document.querySelectorAll(".site-nav a")];
const sections = navLinks
  .map((link) => {
    const href = link.getAttribute("href");
    return href && href.startsWith("#") ? document.querySelector(href) : null;
  })
  .filter(Boolean);

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) {
      return;
    }

    navLinks.forEach((link) => {
      link.classList.toggle(
        "is-active",
        link.getAttribute("href") === `#${visible.target.id}`,
      );
    });
  },
  {
    rootMargin: "-25% 0px -55% 0px",
    threshold: [0.1, 0.25, 0.5],
  },
);

sections.forEach((section) => observer.observe(section));

const galleryImages = [...document.querySelectorAll(".case-gallery img")];

if (galleryImages.length) {
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.hidden = true;
  lightbox.innerHTML = `
    <button class="lightbox-close" type="button" aria-label="关闭大图">×</button>
    <figure>
      <img alt="" />
      <figcaption></figcaption>
    </figure>
  `;

  document.body.append(lightbox);

  const lightboxImage = lightbox.querySelector("img");
  const lightboxCaption = lightbox.querySelector("figcaption");
  const lightboxClose = lightbox.querySelector(".lightbox-close");
  let lastFocusedElement = null;

  const closeLightbox = () => {
    lightbox.hidden = true;
    lightboxImage.removeAttribute("src");
    document.body.classList.remove("has-lightbox");
    lastFocusedElement?.focus();
  };

  const openLightbox = (image) => {
    const figure = image.closest("figure");
    const caption = figure?.querySelector("figcaption")?.textContent?.trim();

    lastFocusedElement = document.activeElement;
    lightboxImage.src = image.dataset.full || image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = caption || image.alt;
    lightbox.classList.toggle("is-long", image.dataset.long === "true");
    lightbox.hidden = false;
    document.body.classList.add("has-lightbox");
    lightboxClose.focus();
  };

  galleryImages.forEach((image) => {
    const figure = image.closest("figure");
    const caption = figure?.querySelector("figcaption")?.textContent?.trim();
    const button = document.createElement("button");

    button.className = "image-open";
    button.type = "button";
    button.setAttribute("aria-label", `查看大图：${caption || image.alt}`);
    image.replaceWith(button);
    button.append(image);
    button.addEventListener("click", () => openLightbox(image));
  });

  lightboxClose.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) {
      closeLightbox();
    }
  });
}
