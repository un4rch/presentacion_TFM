(function () {
  if (typeof Reveal === "undefined") {
    return;
  }

  Reveal.initialize({
    hash: true,
    controls: false,
    progress: true,
    slideNumber: "c/t",
    showSlideNumber: "all",
    center: false,
    transition: "convex",
    backgroundTransition: "fade",
    viewDistance: 6,
    width: 1600,
    height: 900,
    margin: 0.04,
    minScale: 0.2,
    maxScale: 2.0,
    autoAnimateEasing: "ease",
    autoAnimateDuration: 0.9,
    autoAnimateUnmatched: false,
    fragmentInURL: false,
    plugins: [RevealNotes, RevealHighlight]
  });
})();
