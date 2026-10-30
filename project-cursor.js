(() => {
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

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

  if (!finePointer.matches || document.querySelector(".site-cursor")) return;

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
    cursor.classList.toggle("is-on-light", isLightSurface(target));
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
})();
