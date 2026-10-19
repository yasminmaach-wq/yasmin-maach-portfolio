(() => {
  const heroLayout = document.querySelector(".about-hero-layout");
  const hero = document.querySelector(".about-hero");
  const portrait = document.querySelector(".about-hero .portrait-freelancer-frau");
  const portraitLink = document.querySelector(".about-portrait-link");
  const title = document.querySelector(".about-hero .career-image-title");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!heroLayout || !hero || !portrait || !title || reducedMotion.matches) {
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
    setOffset("--about-title-x", 0);
    setOffset("--about-title-y", 0);
  };

  heroLayout.addEventListener("pointermove", (event) => {
    const bounds = heroLayout.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    setOffset("--about-portrait-x", x * 18);
    setOffset("--about-portrait-y", y * 14);
    setOffset("--about-title-x", x * -7);
    setOffset("--about-title-y", y * -5);
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
