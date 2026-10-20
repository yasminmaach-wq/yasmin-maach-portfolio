document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".contact-form");
  if (!form) return;

  const subject = form.querySelector("#contact-subject");
  const projectType = form.querySelector("#contact-project-type");
  const chips = [...form.querySelectorAll("[data-project-type]")];
  const status = form.querySelector(".form-status");
  const submitButton = form.querySelector('button[type="submit"]');
  const defaultButtonLabel = submitButton.textContent;

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const type = chip.dataset.projectType;
      const isSelected = chip.classList.toggle("is-selected");

      chips.filter((item) => item !== chip).forEach((item) => item.classList.remove("is-selected"));
      subject.value = isSelected ? `Projektanfrage: ${type}` : "";
      projectType.value = isSelected ? type : "";
      subject.focus();
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    submitButton.disabled = true;
    submitButton.textContent = "Wird gesendet …";
    status.hidden = true;
    status.classList.remove("is-error");

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error("Message delivery failed");
      }

      form.reset();
      chips.forEach((chip) => chip.classList.remove("is-selected"));
      status.textContent = "Danke, ich melde mich bald bei dir.";
      status.hidden = false;
    } catch (_) {
      status.textContent = "Das Senden hat gerade nicht geklappt. Bitte versuche es noch einmal oder schreibe mir direkt eine E-Mail.";
      status.classList.add("is-error");
      status.hidden = false;
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = defaultButtonLabel;
    }
  });
});
