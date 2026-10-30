(() => {
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!finePointer.matches || reducedMotion.matches) return;

  const isLightSurface = (target) => {
    let element = target instanceof Element ? target : document.body;

    while (element) {
      const values = window.getComputedStyle(element).backgroundColor.match(/[\d.]+/g)?.map(Number);
      if (values && values.length >= 3 && (values[3] ?? 1) > 0.05) {
        const brightness = values[0] * 0.299 + values[1] * 0.587 + values[2] * 0.114;
        return brightness > 150;
      }
      element = element.parentElement;
    }

    return false;
  };

  const trailLength = 9;
  const trail = [];
  const interactiveSelector = "a, button, summary, [role='button'], input[type='button'], input[type='submit']";
  let pointerX = 0;
  let pointerY = 0;
  let hasPointerPosition = false;
  let animationFrame;

  for (let index = 0; index < trailLength; index += 1) {
    const dot = document.createElement("span");
    dot.className = "cursor-trail-dot";
    dot.setAttribute("aria-hidden", "true");
    dot.style.setProperty("--cursor-trail-scale", String(1 - index * 0.085));
    dot.style.setProperty("--cursor-trail-opacity", String(0.64 - index * 0.06));
    document.body.append(dot);
    trail.push({ element: dot, x: 0, y: 0 });
  }

  const renderTrail = () => {
    if (hasPointerPosition) {
      trail.forEach((dot, index) => {
        const target = index === 0 ? { x: pointerX, y: pointerY } : trail[index - 1];
        const ease = Math.max(0.12, 0.34 - index * 0.022);
        dot.x += (target.x - dot.x) * ease;
        dot.y += (target.y - dot.y) * ease;
        dot.element.style.left = `${dot.x}px`;
        dot.element.style.top = `${dot.y}px`;
      });
    }

    animationFrame = window.requestAnimationFrame(renderTrail);
  };

  window.addEventListener("pointermove", (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    const isInteractive = event.target instanceof Element && Boolean(event.target.closest(interactiveSelector));
    const isOnLightSurface = isLightSurface(event.target);

    trail.forEach((dot) => {
      dot.element.classList.toggle("is-suppressed", isInteractive);
      dot.element.classList.toggle("is-on-light", isOnLightSurface);
    });

    if (!hasPointerPosition) {
      trail.forEach((dot) => {
        dot.x = pointerX;
        dot.y = pointerY;
        dot.element.classList.add("is-visible");
      });
      hasPointerPosition = true;
    }
  }, { passive: true });

  document.documentElement.addEventListener("mouseleave", () => {
    trail.forEach((dot) => dot.element.classList.remove("is-visible"));
  });

  document.documentElement.addEventListener("mouseenter", () => {
    if (hasPointerPosition) trail.forEach((dot) => dot.element.classList.add("is-visible"));
  });

  window.addEventListener("beforeunload", () => window.cancelAnimationFrame(animationFrame), { once: true });
  renderTrail();
})();
