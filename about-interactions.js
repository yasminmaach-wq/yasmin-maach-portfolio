(() => {
  const heroLayout = document.querySelector(".about-hero-layout");
  const hero = document.querySelector(".about-hero");
  const portrait = document.querySelector(".about-hero .portrait-freelancer-frau");
  const portraitLink = document.querySelector(".about-portrait-link");
  const portraitFrame = document.querySelector(".about-hero .introduction-container.portrait-only");
  const breadcrumb = document.querySelector(".about-hero .page-breadcrumb");
  const desktopLayout = window.matchMedia("(min-width: 992px)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const alignPortraitWithBreadcrumb = () => {
    if (!hero || !portraitFrame || !breadcrumb) {
      return;
    }

    if (!desktopLayout.matches) {
      portraitFrame.style.removeProperty("--about-portrait-top");
      return;
    }

    const heroTop = hero.getBoundingClientRect().top;
    const breadcrumbTop = breadcrumb.getBoundingClientRect().top;
    portraitFrame.style.setProperty("--about-portrait-top", `${(breadcrumbTop - heroTop).toFixed(2)}px`);
  };

  alignPortraitWithBreadcrumb();
  window.addEventListener("resize", alignPortraitWithBreadcrumb, { passive: true });

  if (!heroLayout || !hero || !portrait || reducedMotion.matches) {
    return;
  }

  const revealHero = () => {
    hero.classList.add("has-scroll-reveal");
    window.requestAnimationFrame(() => hero.classList.add("is-revealed"));
  };

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          revealHero();
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    revealObserver.observe(hero);
  } else {
    revealHero();
  }

  if (!finePointer.matches) {
    return;
  }

  const setOffset = (property, value) => {
    heroLayout.style.setProperty(property, `${value.toFixed(2)}px`);
  };

  const resetOffset = () => {
    setOffset("--about-portrait-x", 0);
    setOffset("--about-portrait-y", 0);
  };

  heroLayout.addEventListener("pointermove", (event) => {
    const bounds = heroLayout.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    setOffset("--about-portrait-x", x * 18);
    setOffset("--about-portrait-y", y * 14);
  });

  heroLayout.addEventListener("pointerleave", resetOffset);

  portraitLink?.addEventListener("pointermove", (event) => {
    const bounds = portraitLink.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;

    portraitLink.style.setProperty("--about-spotlight-x", `${x.toFixed(1)}%`);
    portraitLink.style.setProperty("--about-spotlight-y", `${y.toFixed(1)}%`);
  });
})();
