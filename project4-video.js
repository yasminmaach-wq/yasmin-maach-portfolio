(() => {
  const playbackRate = 0.6;
  const crossfadeSeconds = 2.6;
  const fadeHeadroomSeconds = 0.15;

  const stage = document.querySelector(".case-peak-video-stage");
  if (!stage) return;

  const videos = Array.from(stage.querySelectorAll(".case-peak-hero-video"));
  if (videos.length !== 2) return;

  videos.forEach((video) => {
    video.defaultPlaybackRate = playbackRate;
    video.playbackRate = playbackRate;
  });

  let activeIndex = 0;
  let isCrossfading = false;
  let animationFrame = 0;
  let fadeTimer;
  let disposed = false;

  const revealFirstVideo = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!disposed) videos[0].classList.add("is-visible", "is-traversing");
      });
    });
  };

  videos[0].addEventListener("playing", revealFirstVideo, { once: true });

  const crossfade = async () => {
    if (isCrossfading || disposed) return;
    isCrossfading = true;

    const currentVideo = videos[activeIndex];
    const nextIndex = activeIndex === 0 ? 1 : 0;
    const nextVideo = videos[nextIndex];

    nextVideo.currentTime = 0;

    try {
      await nextVideo.play();
    } catch {
      isCrossfading = false;
      return;
    }

    if (disposed) return;

    nextVideo.classList.remove("is-traversing");
    void nextVideo.offsetWidth;
    nextVideo.classList.add("is-traversing", "is-visible");
    currentVideo.classList.remove("is-visible");

    fadeTimer = window.setTimeout(() => {
      currentVideo.pause();
      currentVideo.currentTime = 0;
      currentVideo.classList.remove("is-traversing");
      activeIndex = nextIndex;
      isCrossfading = false;
    }, crossfadeSeconds * 1000);
  };

  const monitorPlayback = () => {
    const currentVideo = videos[activeIndex];
    const fadeStart = currentVideo.duration - crossfadeSeconds * playbackRate - fadeHeadroomSeconds;

    if (Number.isFinite(currentVideo.duration) && currentVideo.currentTime >= fadeStart) {
      void crossfade();
    }

    animationFrame = requestAnimationFrame(monitorPlayback);
  };

  void videos[0].play().then(revealFirstVideo).catch(() => undefined);
  animationFrame = requestAnimationFrame(monitorPlayback);

  window.addEventListener(
    "pagehide",
    () => {
      disposed = true;
      cancelAnimationFrame(animationFrame);
      if (fadeTimer) clearTimeout(fadeTimer);
      videos[0].removeEventListener("playing", revealFirstVideo);
      videos.forEach((video) => video.pause());
    },
    { once: true },
  );
})();
