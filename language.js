(() => {
  const preferenceKey = "maach-studio-language";
  const path = window.location.pathname;
  const isEnglishPage = /\/en(?:\/|$)/.test(path);
  const fileName = path.split("/").filter(Boolean).pop() || "index.html";
  const supportedLanguages = new Set(["de", "en"]);

  const normalizeLanguage = (language) => {
    const normalizedLanguage = String(language || "")
      .trim()
      .toLowerCase()
      .split(/[-_]/)[0];

    return supportedLanguages.has(normalizedLanguage) ? normalizedLanguage : null;
  };

  let savedLanguage = null;
  try {
    savedLanguage = window.localStorage.getItem(preferenceKey);
  } catch (_) {
    savedLanguage = null;
  }

  const browserLanguages = Array.isArray(navigator.languages) && navigator.languages.length
    ? navigator.languages
    : [navigator.language];
  const detectedLanguage = browserLanguages.map(normalizeLanguage).find(Boolean) || "en";
  const preferredLanguage = normalizeLanguage(savedLanguage) || detectedLanguage;

  if (preferredLanguage === "en" && !isEnglishPage) {
    window.location.replace(`en/${fileName}${window.location.search}${window.location.hash}`);
    return;
  }

  if (preferredLanguage === "de" && isEnglishPage) {
    window.location.replace(`../${fileName}${window.location.search}${window.location.hash}`);
    return;
  }

  document.querySelectorAll("[data-language]").forEach((link) => {
    link.addEventListener("click", () => {
      try {
        window.localStorage.setItem(preferenceKey, link.dataset.language);
      } catch (_) {
        // The language link still works if browser storage is unavailable.
      }
    });
  });

  const brandName = document.querySelector(".potrait-img-link > span");
  if (brandName && !brandName.classList.contains("brand-wordmark")) {
    const brandText = brandName.textContent.trim().toUpperCase();
    brandName.classList.add("brand-wordmark");
    brandName.setAttribute("aria-label", brandText);
    brandName.textContent = "";

    Array.from(brandText).forEach((character, index) => {
      const letter = document.createElement("span");
      letter.className = "brand-letter";
      letter.setAttribute("aria-hidden", "true");
      letter.style.setProperty("--letter-index", index);
      letter.textContent = character;
      brandName.append(letter);
    });
  }

  const siteNavigation = document.querySelector(".site-nav");
  const languageSwitcher = siteNavigation?.querySelector(".language-switcher");

  if (siteNavigation && languageSwitcher && !siteNavigation.querySelector(".nav-cta")) {
    const navCta = document.createElement("a");
    navCta.className = "nav-cta";
    navCta.href = "contact.html";
    navCta.textContent = "Get in touch";
    languageSwitcher.before(navCta);
  }

  const navigation = document.querySelector("#main-navigation");
  const navigationToggle = document.querySelector(".site-nav-toggle");

  if (navigation && navigationToggle) {
    const isEnglishNavigation = document.documentElement.lang.toLowerCase().startsWith("en");

    const updateNavigationState = (isOpen) => {
      document.body.classList.toggle("menu-open", isOpen);
      navigationToggle.setAttribute(
        "aria-label",
        isOpen
          ? (isEnglishNavigation ? "Close navigation" : "Navigation schließen")
          : (isEnglishNavigation ? "Open navigation" : "Navigation öffnen"),
      );
    };

    const closeNavigation = () => {
      if (!navigation.classList.contains("show")) return;

      if (window.bootstrap?.Collapse) {
        window.bootstrap.Collapse.getOrCreateInstance(navigation, { toggle: false }).hide();
      } else {
        navigation.classList.remove("show");
        navigationToggle.setAttribute("aria-expanded", "false");
        updateNavigationState(false);
      }
    };

    navigation.addEventListener("show.bs.collapse", () => updateNavigationState(true));
    navigation.addEventListener("hidden.bs.collapse", () => updateNavigationState(false));
    updateNavigationState(navigation.classList.contains("show"));

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeNavigation);
    });

    document.addEventListener("click", (event) => {
      if (!event.target.closest(".site-nav")) closeNavigation();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeNavigation();
        navigationToggle.focus();
      }
    });
  }

  const verticalMessage = document.querySelector(".vertical-message");
  const heroHeading = document.querySelector("body > header.row.g-3 > h1");

  const alignVerticalMessageWithMenu = () => {
    if (!verticalMessage || !navigationToggle) return;

    if (!window.matchMedia("(max-width: 767.98px)").matches) {
      verticalMessage.style.removeProperty("--vertical-message-center");
      return;
    }

    const toggleBounds = navigationToggle.getBoundingClientRect();
    const toggleCenter = toggleBounds.left + toggleBounds.width / 2;
    verticalMessage.style.setProperty("--vertical-message-center", `${toggleCenter}px`);

    const messageBounds = verticalMessage.getBoundingClientRect();
    const messageCenter = messageBounds.left + messageBounds.width / 2;
    verticalMessage.style.setProperty(
      "--vertical-message-center",
      `${toggleCenter + (toggleCenter - messageCenter)}px`,
    );
  };

  window.addEventListener("resize", alignVerticalMessageWithMenu);
  requestAnimationFrame(alignVerticalMessageWithMenu);

  const alignHeroHeadingWithVerticalMessage = () => {
    if (!heroHeading || !verticalMessage) return;

    heroHeading.style.removeProperty("--hero-heading-center-offset");
    const headingBounds = heroHeading.getBoundingClientRect();
    const messageBounds = verticalMessage.getBoundingClientRect();
    const headingCenter = headingBounds.top + headingBounds.height / 2;
    const messageCenter = messageBounds.top + messageBounds.height / 2;

    heroHeading.style.setProperty(
      "--hero-heading-center-offset",
      `${messageCenter - headingCenter}px`,
    );
  };

  window.addEventListener("resize", alignHeroHeadingWithVerticalMessage);
  requestAnimationFrame(alignHeroHeadingWithVerticalMessage);
  document.fonts?.ready.then(alignHeroHeadingWithVerticalMessage);

  document.querySelectorAll(".service-card").forEach((card) => {
    const details = card.querySelector(".service-card-details");
    if (!details) return;

    details.addEventListener("mouseleave", () => {
      details.open = false;
    });
  });

  const createHeroContrastFragment = (text) => {
    const fragment = document.createDocumentFragment();

    text.split(/(\s+)/).forEach((part) => {
      if (!part) return;
      if (/^\s+$/.test(part)) {
        fragment.append(document.createTextNode(part));
        return;
      }

      const word = document.createElement("span");
      word.className = "hero-contrast-word";
      Array.from(part).forEach((character) => {
        const characterSpan = document.createElement("span");
        characterSpan.className = "hero-contrast-char";
        characterSpan.textContent = character;
        word.append(characterSpan);
      });
      fragment.append(word);
    });

    return fragment;
  };

  const renderHeroContrastText = (element, text) => {
    element.replaceChildren(createHeroContrastFragment(text));
  };

  const heroSignatureMeta = document.querySelector(".hero-signature-meta");
  if (heroSignatureMeta) {
    renderHeroContrastText(heroSignatureMeta, heroSignatureMeta.textContent.trim());
  }

  const updateHeroTextContrast = (canvas) => {
    const characters = document.querySelectorAll(".hero-contrast-char");
    if (!canvas || !characters.length || !canvas.width || !canvas.height) return;

    const context = canvas.getContext("2d", { willReadFrequently: true });
    const canvasStyle = getComputedStyle(canvas);
    const canvasBounds = canvas.getBoundingClientRect();
    const localWidth = canvas.offsetWidth || canvasBounds.width;
    const localHeight = canvas.offsetHeight || canvasBounds.height;
    const [originX = localWidth / 2, originY = localHeight / 2] = canvasStyle.transformOrigin
      .split(" ")
      .map(Number.parseFloat);
    const matrix = new DOMMatrixReadOnly(
      canvasStyle.transform === "none" ? undefined : canvasStyle.transform,
    );
    const determinant = matrix.a * matrix.d - matrix.b * matrix.c;

    if (!determinant) return;

    const transformedCorners = [
      [0, 0],
      [localWidth, 0],
      [localWidth, localHeight],
      [0, localHeight],
    ].map(([x, y]) => ({
      x: originX + matrix.a * (x - originX) + matrix.c * (y - originY) + matrix.e,
      y: originY + matrix.b * (x - originX) + matrix.d * (y - originY) + matrix.f,
    }));
    const layoutLeft = canvasBounds.left - Math.min(...transformedCorners.map(({ x }) => x));
    const layoutTop = canvasBounds.top - Math.min(...transformedCorners.map(({ y }) => y));

    let pixels;
    try {
      pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    } catch (_) {
      return;
    }

    const animationCoversPoint = (screenX, screenY) => {
      const transformedX = screenX - layoutLeft - originX - matrix.e;
      const transformedY = screenY - layoutTop - originY - matrix.f;
      const localX = originX + (matrix.d * transformedX - matrix.c * transformedY) / determinant;
      const localY = originY + (-matrix.b * transformedX + matrix.a * transformedY) / determinant;

      if (localX < 0 || localY < 0 || localX >= localWidth || localY >= localHeight) {
        return false;
      }

      const pixelX = Math.min(canvas.width - 1, Math.floor((localX / localWidth) * canvas.width));
      const pixelY = Math.min(canvas.height - 1, Math.floor((localY / localHeight) * canvas.height));
      return pixels[(pixelY * canvas.width + pixelX) * 4 + 3] > 32;
    };

    characters.forEach((character) => {
      const bounds = character.getBoundingClientRect();
      const samplePoints = [
        [0.25, 0.3],
        [0.5, 0.3],
        [0.75, 0.3],
        [0.25, 0.65],
        [0.5, 0.65],
        [0.75, 0.65],
      ];
      const isCovered = samplePoints.some(([x, y]) =>
        animationCoversPoint(bounds.left + bounds.width * x, bounds.top + bounds.height * y),
      );
      character.classList.toggle("is-over-animation", isCovered);
    });
  };

  window.updateHeroTextContrast = updateHeroTextContrast;

  const heroScramble = document.querySelector(".hero-scramble");

  if (heroScramble) {
    let scrambleItems = [heroScramble.textContent.trim()];
    try {
      const parsedItems = JSON.parse(heroScramble.dataset.scrambleItems || "[]");
      if (Array.isArray(parsedItems) && parsedItems.length) {
        scrambleItems = parsedItems.filter((item) => typeof item === "string" && item.trim());
      }
    } catch (_) {
      // The visible fallback text remains available if the data is malformed.
    }

    const scrambleCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%—·";
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let scrambleTimer = null;
    let repeatTimer = null;
    let activeItem = 0;

    const playScramble = ({ duration = 700, delay = 0 } = {}) => {
      window.clearTimeout(scrambleTimer);
      window.clearTimeout(repeatTimer);

      if (reducedMotion.matches) {
        renderHeroContrastText(heroScramble, scrambleItems.join(" "));
        return;
      }

      scrambleTimer = window.setTimeout(() => {
        const targetText = scrambleItems[activeItem];
        const letters = Array.from(targetText);
        const steps = Math.ceil(duration / 35);
        const revealed = new Array(letters.length).fill(false);
        let frame = 0;

        const tick = window.setInterval(() => {
          const progress = frame / steps;
          const renderedText = letters
            .map((character, index) => {
              if (/\s/.test(character)) return character;
              if (!revealed[index] && progress > (index / letters.length) * 0.65) {
                revealed[index] = true;
              }
              return revealed[index]
                ? character
                : scrambleCharacters[Math.floor(Math.random() * scrambleCharacters.length)];
            })
            .join("");
          renderHeroContrastText(heroScramble, renderedText);

          frame += 1;
          if (frame > steps) {
            window.clearInterval(tick);
            renderHeroContrastText(heroScramble, targetText);
            repeatTimer = window.setTimeout(() => {
              activeItem = (activeItem + 1) % scrambleItems.length;
              playScramble();
            }, 3500);
          }
        }, 35);
      }, delay);
    };

    playScramble({ delay: 300 });
    reducedMotion.addEventListener("change", () => playScramble());
  }

  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  if (finePointer.matches && !document.querySelector(".site-cursor")) {
    const cursor = document.createElement("div");
    const interactiveSelector = [
      "a",
      "button",
      "summary",
      "[role='button']",
      "input[type='button']",
      "input[type='submit']",
    ].join(",");

    cursor.className = "site-cursor";
    cursor.setAttribute("aria-hidden", "true");
    document.body.append(cursor);

    const updateCursorState = (target) => {
      const interactiveElement = target instanceof Element ? target.closest(interactiveSelector) : null;
      cursor.classList.toggle("is-active", Boolean(interactiveElement));
    };

    document.addEventListener("pointermove", (event) => {
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
      cursor.classList.add("is-visible");
      updateCursorState(event.target);
    });

    document.addEventListener("pointerover", (event) => updateCursorState(event.target));
    document.addEventListener("pointerout", (event) => updateCursorState(event.relatedTarget));
    document.documentElement.addEventListener("mouseleave", () => cursor.classList.remove("is-visible"));
  }
})();
