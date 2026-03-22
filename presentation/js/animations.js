(function () {
  var MARKET_TICKERS = [
    { label: "BTC/USDT", sources: ["BTC-USD"], base: 64202.1, decimals: 2, prefix: "$" },
    { label: "ETH/USDT", sources: ["ETH-USD"], base: 3420.5, decimals: 2, prefix: "$" },
    { label: "XRP/USDT", sources: ["XRP-USD"], base: 0.62, decimals: 4, prefix: "$" },
    { label: "SOL/USDT", sources: ["SOL-USD"], base: 145.2, decimals: 2, prefix: "$" },
    { label: "BNB/USDT", sources: ["BNB-USD"], base: 598.3, decimals: 2, prefix: "$" },
    { label: "ADA/USDT", sources: ["ADA-USD"], base: 0.71, decimals: 4, prefix: "$" },
    { label: "SPY/USD", sources: ["SPY"], base: 510.2, decimals: 2, prefix: "$" },
    { label: "QQQ/USD", sources: ["QQQ"], base: 435.4, decimals: 2, prefix: "$" },
    { label: "DAX/EUR", sources: ["^GDAXI"], base: 18622.0, decimals: 2, prefix: "" },
    { label: "IBEX/EUR", sources: ["^IBEX"], base: 11524.0, decimals: 2, prefix: "" },
    { label: "EUR/USD", sources: ["EURUSD=X"], base: 1.0824, decimals: 4, prefix: "" },
    { label: "XAU/USD", sources: ["GC=F"], base: 2164.2, decimals: 2, prefix: "$" },
    { label: "WTI/USD", sources: ["CL=F"], base: 79.2, decimals: 2, prefix: "$" },
    { label: "US10Y", sources: ["^TNX"], base: 4.2, decimals: 3, prefix: "" }
  ];
  var tickerSnapshot = [];

  function formatTickerPrice(value, cfg) {
    var decimals = typeof cfg.decimals === "number" ? cfg.decimals : 2;
    var formatter = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
    var rendered = formatter.format(value);
    return (cfg.prefix || "") + rendered;
  }

  function fetchWithTimeout(url, timeoutMs) {
    return new Promise(function (resolve, reject) {
      var timer = window.setTimeout(function () {
        reject(new Error("timeout"));
      }, timeoutMs);

      fetch(url)
        .then(function (response) {
          window.clearTimeout(timer);
          resolve(response);
        })
        .catch(function (error) {
          window.clearTimeout(timer);
          reject(error);
        });
    });
  }

  function parseYahooPayload(payload) {
    if (!payload || !payload.chart || !payload.chart.result || !payload.chart.result.length) {
      return null;
    }

    var result = payload.chart.result[0];
    if (!result || !result.meta) {
      return null;
    }

    var meta = result.meta;
    var price = Number(meta.regularMarketPrice);
    var prevClose = Number(meta.chartPreviousClose);

    if (!Number.isFinite(price) && result.indicators && result.indicators.quote && result.indicators.quote[0] && result.indicators.quote[0].close) {
      var closes = result.indicators.quote[0].close;
      for (var i = closes.length - 1; i >= 0; i -= 1) {
        var candidate = Number(closes[i]);
        if (Number.isFinite(candidate)) {
          price = candidate;
          break;
        }
      }
    }

    var changePct = Number(meta.regularMarketChangePercent);
    if (!Number.isFinite(changePct) && Number.isFinite(price) && Number.isFinite(prevClose) && prevClose !== 0) {
      changePct = ((price - prevClose) / prevClose) * 100;
    }

    if (!Number.isFinite(price) || !Number.isFinite(changePct)) {
      return null;
    }

    return {
      price: price,
      changePct: changePct,
      isLive: true
    };
  }

  function simulateTicker(cfg, previous) {
    var basePrice = previous && Number.isFinite(previous.price) ? previous.price : cfg.base;
    var prevChange = previous && Number.isFinite(previous.changePct) ? previous.changePct : (Math.random() - 0.5) * 1.5;
    var drift = prevChange * 0.56 + (Math.random() - 0.5) * 1.8;
    var bounded = Math.max(-4.9, Math.min(4.9, drift));
    var nextPrice = Math.max(basePrice * (1 + bounded / 100), 0.0001);

    return {
      price: nextPrice,
      changePct: bounded,
      isLive: false
    };
  }

  function renderTickerStrip(snapshot) {
    var track = document.getElementById("ticker-track");
    if (!track || !snapshot.length) {
      return;
    }

    function renderItem(item) {
      var change = item.changePct;
      var changeText = (change >= 0 ? "+" : "") + change.toFixed(2) + "%";
      var toneClass = change >= 0 ? "pos" : "neg";
      var valueText = formatTickerPrice(item.price, item.cfg) + " " + changeText;

      return '<span class="ticker-item"><span class="ticker-symbol">' +
        item.cfg.label +
        '</span><span class="ticker-value ' +
        toneClass +
        '">' +
        valueText +
        "</span></span>";
    }

    var lane = snapshot.map(renderItem).join("");
    track.innerHTML = lane + lane;
  }

  function resolveTickerLive(cfg) {
    var symbols = cfg.sources || [];
    var index = 0;

    function next() {
      if (index >= symbols.length) {
        return Promise.resolve(null);
      }

      var symbol = symbols[index];
      index += 1;
      var url = "https://query1.finance.yahoo.com/v8/finance/chart/" + encodeURIComponent(symbol) + "?interval=1m&range=1d";

      return fetchWithTimeout(url, 4500)
        .then(function (response) {
          if (!response.ok) {
            return null;
          }

          return response.json();
        })
        .then(function (payload) {
          var parsed = parseYahooPayload(payload);
          if (parsed) {
            return parsed;
          }

          return next();
        })
        .catch(function () {
          return next();
        });
    }

    return next();
  }

  function refreshTickerStrip() {
    var previousByLabel = {};
    tickerSnapshot.forEach(function (entry) {
      previousByLabel[entry.cfg.label] = entry;
    });

    var jobs = MARKET_TICKERS.map(function (cfg) {
      return resolveTickerLive(cfg).then(function (live) {
        if (live) {
          return { cfg: cfg, price: live.price, changePct: live.changePct, isLive: true };
        }

        var simulated = simulateTicker(cfg, previousByLabel[cfg.label]);
        return { cfg: cfg, price: simulated.price, changePct: simulated.changePct, isLive: false };
      });
    });

    return Promise.all(jobs).then(function (items) {
      tickerSnapshot = items;
      renderTickerStrip(items);
    });
  }

  function initLiveTickerStrip() {
    var track = document.getElementById("ticker-track");
    if (!track) {
      return;
    }

    refreshTickerStrip();
    window.setInterval(refreshTickerStrip, 5000);
    window.setInterval(function () {
      if (!tickerSnapshot.length) {
        return;
      }

      tickerSnapshot = tickerSnapshot.map(function (entry) {
        if (entry.isLive) {
          return entry;
        }

        var sim = simulateTicker(entry.cfg, entry);
        return { cfg: entry.cfg, price: sim.price, changePct: sim.changePct, isLive: false };
      });

      renderTickerStrip(tickerSnapshot);
    }, 2200);
  }

  function initHoverZoomPreview() {
    if (!window.matchMedia || !window.matchMedia("(hover: hover)").matches) {
      return null;
    }

    var layer = document.getElementById("hover-zoom-preview");
    if (!layer) {
      return null;
    }

    var layerImage = layer.querySelector("img");
    if (!layerImage) {
      return null;
    }

    var hideTimer = null;

    function show(sourceImage) {
      if (!sourceImage || !sourceImage.src) {
        return;
      }

      if (hideTimer) {
        window.clearTimeout(hideTimer);
        hideTimer = null;
      }

      layerImage.src = sourceImage.currentSrc || sourceImage.src;
      layerImage.alt = sourceImage.alt || "Imagen ampliada";
      layer.classList.add("is-visible");
    }

    function hide() {
      if (hideTimer) {
        window.clearTimeout(hideTimer);
      }

      hideTimer = window.setTimeout(function () {
        layer.classList.remove("is-visible");
      }, 50);
    }

    var targets = document.querySelectorAll(".slide-pad img:not(.no-hover-zoom)");
    targets.forEach(function (img) {
      if (img.dataset.hoverZoomBound === "true") {
        return;
      }

      img.dataset.hoverZoomBound = "true";
      img.addEventListener("mouseenter", function () {
        show(img);
      });
      img.addEventListener("mouseleave", hide);
    });

    return { hide: hide };
  }

  function initContentSwaps() {
    var objectiveSwap = document.querySelector(".objectives-swap");

    function sync(slide) {
      if (!objectiveSwap) {
        return;
      }

      var holderSlide = objectiveSwap.closest("section");
      if (slide && holderSlide !== slide) {
        return;
      }

      var trigger = objectiveSwap.querySelector('.swap-trigger[data-swap-target="objectives"]');
      var showCompetencies = Boolean(trigger && trigger.classList.contains("visible"));
      objectiveSwap.classList.toggle("is-competencies", showCompetencies);
    }

    var initialSwapSlide = typeof Reveal !== "undefined" && Reveal.getCurrentSlide ? Reveal.getCurrentSlide() : null;
    if (initialSwapSlide) {
      sync(initialSwapSlide);
    }
    return { sync: sync };
  }

  function initContextPremiumSequence() {
    var slides = Array.prototype.slice.call(document.querySelectorAll(".context-premium-slide"));

    if (!slides.length) {
      return null;
    }

    function sync(slide) {
      var targetSlides = slide ? slides : [];

      if (slide) {
        if (slide.classList && slide.classList.contains("context-premium-slide")) {
          targetSlides = [slide];
        } else if (slide.querySelectorAll) {
          var nestedSlides = Array.prototype.slice.call(slide.querySelectorAll(".context-premium-slide"));
          if (nestedSlides.length) {
            targetSlides = nestedSlides;
          }
        }
      }

      targetSlides.forEach(function (candidate) {
        if (!candidate || !candidate.classList || !candidate.classList.contains("context-premium-slide")) {
          return;
        }

        var triggers = Array.prototype.slice.call(candidate.querySelectorAll(".context-step-trigger"));
        var activeStep = -1;

        triggers.forEach(function (trigger) {
          if (!trigger.classList.contains("visible")) {
            return;
          }

          var step = Number(trigger.getAttribute("data-context-step"));
          if (Number.isFinite(step) && step > activeStep) {
            activeStep = step;
          }
        });

        var targets = candidate.querySelectorAll("[data-context-card]");
        targets.forEach(function (node) {
          var cardIndex = Number(node.getAttribute("data-context-card"));
          var isActive = Number.isFinite(cardIndex) && cardIndex === activeStep;
          node.classList.toggle("is-active", isActive);
        });
      });
    }

    var initialContextSlide = typeof Reveal !== "undefined" && Reveal.getCurrentSlide ? Reveal.getCurrentSlide() : null;
    if (initialContextSlide) {
      sync(initialContextSlide);
    }
    return { sync: sync };
  }

  function initObjectivesFocusSequence() {
    var swaps = Array.prototype.slice.call(document.querySelectorAll(".objectives-swap"));

    if (!swaps.length) {
      return null;
    }

    function sync(slide) {
      var targetSwaps = swaps;

      if (slide) {
        if (slide.classList && slide.classList.contains("objectives-swap")) {
          targetSwaps = [slide];
        } else if (slide.querySelectorAll) {
          var nested = Array.prototype.slice.call(slide.querySelectorAll(".objectives-swap"));
          if (nested.length) {
            targetSwaps = nested;
          }
        }
      }

      targetSwaps.forEach(function (swap) {
        var objectiveStep = -1;
        var objectiveTriggers = swap.querySelectorAll(".objective-step-trigger");
        objectiveTriggers.forEach(function (trigger) {
          if (!trigger.classList.contains("visible")) {
            return;
          }

          var step = Number(trigger.getAttribute("data-objective-step"));
          if (Number.isFinite(step) && step > objectiveStep) {
            objectiveStep = step;
          }
        });

        var objectiveTargets = swap.querySelectorAll("[data-objective-focus]");
        objectiveTargets.forEach(function (node) {
          var nodeStep = Number(node.getAttribute("data-objective-focus"));
          node.classList.toggle("is-active", Number.isFinite(nodeStep) && nodeStep === objectiveStep);
        });

        var competencyStep = -1;
        var competencyTriggers = swap.querySelectorAll(".competency-step-trigger");
        competencyTriggers.forEach(function (trigger) {
          if (!trigger.classList.contains("visible")) {
            return;
          }

          var step = Number(trigger.getAttribute("data-competency-step"));
          if (Number.isFinite(step) && step > competencyStep) {
            competencyStep = step;
          }
        });

        var competencyTargets = swap.querySelectorAll("[data-competency-focus]");
        competencyTargets.forEach(function (node) {
          var nodeStep = Number(node.getAttribute("data-competency-focus"));
          node.classList.toggle("is-active", Number.isFinite(nodeStep) && nodeStep === competencyStep);
        });
      });
    }

    var initialObjectivesSlide = typeof Reveal !== "undefined" && Reveal.getCurrentSlide ? Reveal.getCurrentSlide() : null;
    if (initialObjectivesSlide) {
      sync(initialObjectivesSlide);
    }
    return { sync: sync };
  }

  function initPlanningFocusSequence() {
    var slides = Array.prototype.slice.call(document.querySelectorAll(".planning-premium-slide"));

    if (!slides.length) {
      return null;
    }

    function sync(slide) {
      var targetSlides = slides;

      if (slide) {
        if (slide.classList && slide.classList.contains("planning-premium-slide")) {
          targetSlides = [slide];
        } else if (slide.querySelectorAll) {
          var nested = Array.prototype.slice.call(slide.querySelectorAll(".planning-premium-slide"));
          if (nested.length) {
            targetSlides = nested;
          }
        }
      }

      targetSlides.forEach(function (target) {
        var activeStep = -1;
        var triggers = target.querySelectorAll(".plan-step-trigger");
        triggers.forEach(function (trigger) {
          if (!trigger.classList.contains("visible")) {
            return;
          }

          var step = Number(trigger.getAttribute("data-plan-step"));
          if (Number.isFinite(step) && step > activeStep) {
            activeStep = step;
          }
        });

        var focusNodes = target.querySelectorAll("[data-plan-focus]");
        focusNodes.forEach(function (node) {
          var nodeStep = Number(node.getAttribute("data-plan-focus"));
          node.classList.toggle("is-active", Number.isFinite(nodeStep) && nodeStep === activeStep);
        });
      });
    }

    var initialPlanningSlide = typeof Reveal !== "undefined" && Reveal.getCurrentSlide ? Reveal.getCurrentSlide() : null;
    if (initialPlanningSlide) {
      sync(initialPlanningSlide);
    }
    return { sync: sync };
  }

  function initMlopsSequence() {
    var slides = Array.prototype.slice.call(document.querySelectorAll(".mlops-sequence-slide"));

    if (!slides.length) {
      return null;
    }

    function syncSequenceHeight(target, activeStage) {
      var sequence = target ? target.querySelector(".mlops-sequence") : null;
      if (!sequence) {
        return;
      }

      sequence.classList.add("mlops-sequence-auto-height");

      sequence.style.removeProperty("height");
      if (!activeStage) {
        return;
      }
    }

    function sync(slide) {
      var targetSlides = slides;

      if (slide) {
        if (slide.classList && slide.classList.contains("mlops-sequence-slide")) {
          targetSlides = [slide];
        } else if (slide.querySelectorAll) {
          var nested = Array.prototype.slice.call(slide.querySelectorAll(".mlops-sequence-slide"));
          if (nested.length) {
            targetSlides = nested;
          }
        }
      } else if (typeof Reveal !== "undefined" && Reveal.getCurrentSlide) {
        var currentSlide = Reveal.getCurrentSlide();
        if (currentSlide) {
          var currentMlops = currentSlide.classList && currentSlide.classList.contains("mlops-sequence-slide")
            ? currentSlide
            : currentSlide.querySelector && currentSlide.querySelector(".mlops-sequence-slide");
          if (currentMlops) {
            targetSlides = [currentMlops];
          }
        }
      }

      if (!targetSlides.length) {
        return;
      }

      targetSlides = targetSlides.filter(function (target) {
        var owner = target && target.closest ? target.closest("section") : null;
        return !owner || owner.classList.contains("present");
      });

      if (!targetSlides.length) {
        return;
      }

      targetSlides.forEach(function (target) {
        var activeStep = -1;
        var triggers = target.querySelectorAll(".mlops-step-trigger");
        var activeStage = null;

        triggers.forEach(function (trigger) {
          if (!trigger.classList.contains("visible")) {
            return;
          }

          var step = Number(trigger.getAttribute("data-mlops-step"));
          if (Number.isFinite(step) && step > activeStep) {
            activeStep = step;
          }
        });

        if (activeStep < 0) {
          activeStep = 0;
        }

        var stages = target.querySelectorAll("[data-mlops-focus]");
        stages.forEach(function (stage) {
          var stageIndex = Number(stage.getAttribute("data-mlops-focus"));
          var isActive = Number.isFinite(stageIndex) && stageIndex === activeStep;
          stage.classList.toggle("is-active", isActive);
          if (isActive) {
            activeStage = stage;
          }
        });

        var practiceExpanded = false;
        var practiceTriggers = target.querySelectorAll(".mlops-practice-expand-trigger");
        practiceTriggers.forEach(function (trigger) {
          if (trigger.classList.contains("visible")) {
            practiceExpanded = true;
          }
        });

        var practiceStage = target.querySelector(".mlops-stage-practices");
        if (practiceStage) {
          var practiceStep = Number(practiceStage.getAttribute("data-mlops-focus"));
          var shouldExpand = Number.isFinite(practiceStep) && activeStep === practiceStep && practiceExpanded;
          practiceStage.classList.toggle("is-expanded", shouldExpand);
        }

        syncSequenceHeight(target, activeStage);

      });
    }

    slides.forEach(function (slideNode) {
      var sequence = slideNode.querySelector(".mlops-sequence");
      if (sequence) {
        sequence.classList.add("mlops-sequence-auto-height");
      }

      var imgs = Array.prototype.slice.call(slideNode.querySelectorAll(".mlops-stage img"));
      imgs.forEach(function (img) {
        if (img.getAttribute("data-mlops-height-bound") === "1") {
          return;
        }

        img.setAttribute("data-mlops-height-bound", "1");
        img.addEventListener("load", function () {
          sync(slideNode);
        });
      });
    });

    if (document.fonts && document.fonts.ready && typeof document.fonts.ready.then === "function") {
      document.fonts.ready.then(function () {
        if (typeof Reveal !== "undefined" && Reveal.getCurrentSlide) {
          sync(Reveal.getCurrentSlide());
          return;
        }

        sync();
      });
    }

    var initialMlopsSlide = typeof Reveal !== "undefined" && Reveal.getCurrentSlide ? Reveal.getCurrentSlide() : null;
    if (initialMlopsSlide) {
      sync(initialMlopsSlide);
    }
    return { sync: sync };
  }

  function initMlopsFlowPulse() {
    var flows = Array.prototype.slice.call(document.querySelectorAll(".mlops-sequence-slide .mlops-stage-flow .mlops-flow"));

    if (!flows.length) {
      return null;
    }

    var stateClasses = ["is-flow-head", "is-flow-trail-1", "is-flow-trail-2"];

    function clearClasses(flow) {
      var blocks = flow.querySelectorAll(".node, .arrow");
      blocks.forEach(function (block) {
        stateClasses.forEach(function (className) {
          block.classList.remove(className);
        });
      });
    }

    function isFlowActive(flow) {
      var stage = flow.closest(".mlops-stage-flow");
      if (!stage || !stage.classList.contains("is-active")) {
        return false;
      }

      var section = stage.closest("section");
      return Boolean(section && section.classList.contains("present"));
    }

    function applyState(flow, headIndex) {
      var nodes = Array.prototype.slice.call(flow.querySelectorAll(".node"));
      var arrows = Array.prototype.slice.call(flow.querySelectorAll(".arrow"));

      if (!nodes.length) {
        return;
      }

      clearClasses(flow);

      var safeHead = ((headIndex % nodes.length) + nodes.length) % nodes.length;

      stateClasses.forEach(function (className, trailOffset) {
        var nodeIndex = (safeHead - trailOffset + nodes.length) % nodes.length;
        nodes[nodeIndex].classList.add(className);

        if (!arrows.length) {
          return;
        }

        var arrowIndex = (nodeIndex - 1 + arrows.length) % arrows.length;
        arrows[arrowIndex].classList.add(className);
      });
    }

    function advance(flow, reset) {
      var nodes = flow.querySelectorAll(".node");
      if (!nodes.length) {
        clearClasses(flow);
        return;
      }

      var cursor = Number(flow.getAttribute("data-flow-cursor"));
      if (!Number.isFinite(cursor) || reset) {
        cursor = 0;
      } else {
        cursor = (cursor + 1) % nodes.length;
      }

      flow.setAttribute("data-flow-cursor", String(cursor));
      applyState(flow, cursor);
    }

    function sync(slide) {
      var targetFlows = flows;

      if (slide) {
        if (slide.classList && slide.classList.contains("mlops-sequence-slide")) {
          targetFlows = Array.prototype.slice.call(slide.querySelectorAll(".mlops-stage-flow .mlops-flow"));
        } else if (slide.querySelectorAll) {
          var nested = Array.prototype.slice.call(slide.querySelectorAll(".mlops-sequence-slide .mlops-stage-flow .mlops-flow"));
          if (nested.length) {
            targetFlows = nested;
          }
        }
      }

      targetFlows.forEach(function (flow) {
        if (isFlowActive(flow)) {
          if (flow.getAttribute("data-flow-active") !== "1") {
            flow.setAttribute("data-flow-active", "1");
            advance(flow, true);
          }
          return;
        }

        flow.setAttribute("data-flow-active", "0");
        flow.removeAttribute("data-flow-cursor");
        clearClasses(flow);
      });
    }

    window.setInterval(function () {
      flows.forEach(function (flow) {
        if (!isFlowActive(flow)) {
          flow.setAttribute("data-flow-active", "0");
          flow.removeAttribute("data-flow-cursor");
          clearClasses(flow);
          return;
        }

        if (flow.getAttribute("data-flow-active") !== "1") {
          flow.setAttribute("data-flow-active", "1");
          advance(flow, true);
          return;
        }

        advance(flow, false);
      });
    }, 1200);

    var initialGovernSlide = typeof Reveal !== "undefined" && Reveal.getCurrentSlide ? Reveal.getCurrentSlide() : null;
    if (initialGovernSlide) {
      sync(initialGovernSlide);
    }
    return { sync: sync };
  }

  function initStorySequences() {
    var slides = Array.prototype.slice.call(document.querySelectorAll(".story-sequence-slide"));

    if (!slides.length) {
      return null;
    }

    function syncSequenceHeight(target, activeStage) {
      var sequence = target ? target.querySelector(".story-sequence") : null;
      if (!sequence) {
        return;
      }

      sequence.style.removeProperty("height");
      if (!activeStage) {
        return;
      }
    }

    function sync(slide) {
      var targetSlides = slide ? slides : [];

      if (slide) {
        if (slide.classList && slide.classList.contains("story-sequence-slide")) {
          targetSlides = [slide];
        } else if (slide.querySelectorAll) {
          var nested = Array.prototype.slice.call(slide.querySelectorAll(".story-sequence-slide"));
          if (nested.length) {
            targetSlides = nested;
          }
        }
      } else if (typeof Reveal !== "undefined" && Reveal.getCurrentSlide) {
        var currentSlide = Reveal.getCurrentSlide();
        if (currentSlide) {
          var currentStory = currentSlide.classList && currentSlide.classList.contains("story-sequence-slide")
            ? currentSlide
            : currentSlide.querySelector && currentSlide.querySelector(".story-sequence-slide");
          if (currentStory) {
            targetSlides = [currentStory];
          }
        }
      }

      if (!targetSlides.length) {
        return;
      }

      targetSlides = targetSlides.filter(function (target) {
        var owner = target && target.closest ? target.closest("section") : null;
        return !owner || owner.classList.contains("present");
      });

      if (!targetSlides.length) {
        return;
      }

      targetSlides.forEach(function (target) {
        var activeStep = -1;
        var triggers = target.querySelectorAll(".story-step-trigger");
        var activeStage = null;

        triggers.forEach(function (trigger) {
          if (!trigger.classList.contains("visible")) {
            return;
          }

          var step = Number(trigger.getAttribute("data-story-step"));
          if (Number.isFinite(step) && step > activeStep) {
            activeStep = step;
          }
        });

        if (activeStep < 0) {
          activeStep = 0;
        }

        var stages = target.querySelectorAll("[data-story-focus]");
        stages.forEach(function (stage) {
          var stageIndex = Number(stage.getAttribute("data-story-focus"));
          var isActive = Number.isFinite(stageIndex) && stageIndex === activeStep;
          stage.classList.toggle("is-active", isActive);
          if (isActive) {
            activeStage = stage;
          }
        });

        syncSequenceHeight(target, activeStage);

      });
    }

    slides.forEach(function (slideNode) {
      var sequence = slideNode.querySelector(".story-sequence");
      if (sequence) {
        sequence.classList.add("story-sequence-auto-height");
      }

      var imgs = Array.prototype.slice.call(slideNode.querySelectorAll(".story-stage img"));
      imgs.forEach(function (img) {
        if (img.getAttribute("data-story-height-bound") === "1") {
          return;
        }

        img.setAttribute("data-story-height-bound", "1");
        img.addEventListener("load", function () {
          sync(slideNode);
        });
      });
    });

    if (document.fonts && document.fonts.ready && typeof document.fonts.ready.then === "function") {
      document.fonts.ready.then(function () {
        if (typeof Reveal !== "undefined" && Reveal.getCurrentSlide) {
          sync(Reveal.getCurrentSlide());
          return;
        }

        sync();
      });
    }

    var initialStorySlide = typeof Reveal !== "undefined" && Reveal.getCurrentSlide ? Reveal.getCurrentSlide() : null;
    if (initialStorySlide) {
      sync(initialStorySlide);
    }
    return { sync: sync };
  }

  function initGovernanceSequence() {
    var slides = Array.prototype.slice.call(document.querySelectorAll(".governance-sequence-slide"));

    if (!slides.length) {
      return null;
    }

    function sync(slide) {
      var targetSlides = slide ? slides : [];

      if (slide) {
        if (slide.classList && slide.classList.contains("governance-sequence-slide")) {
          targetSlides = [slide];
        } else if (slide.querySelectorAll) {
          var nested = Array.prototype.slice.call(slide.querySelectorAll(".governance-sequence-slide"));
          if (nested.length) {
            targetSlides = nested;
          }
        }
      } else if (typeof Reveal !== "undefined" && Reveal.getCurrentSlide) {
        var currentSlide = Reveal.getCurrentSlide();
        if (currentSlide) {
          var currentGovern = currentSlide.classList && currentSlide.classList.contains("governance-sequence-slide")
            ? currentSlide
            : currentSlide.querySelector && currentSlide.querySelector(".governance-sequence-slide");
          if (currentGovern) {
            targetSlides = [currentGovern];
          }
        }
      }

      if (!targetSlides.length) {
        return;
      }

      targetSlides = targetSlides.filter(function (target) {
        var owner = target && target.closest ? target.closest("section") : null;
        return !owner || owner.classList.contains("present");
      });

      if (!targetSlides.length) {
        return;
      }

      targetSlides.forEach(function (target) {
        var activeStep = -1;
        var triggers = target.querySelectorAll(".govern-step-trigger");

        triggers.forEach(function (trigger) {
          if (!trigger.classList.contains("visible")) {
            return;
          }

          var step = Number(trigger.getAttribute("data-govern-step"));
          if (Number.isFinite(step) && step > activeStep) {
            activeStep = step;
          }
        });

        if (activeStep < 0) {
          activeStep = 0;
        }

        var items = target.querySelectorAll("[data-govern-focus]");
        items.forEach(function (item) {
          var idx = Number(item.getAttribute("data-govern-focus"));
          item.classList.toggle("is-active", Number.isFinite(idx) && idx === activeStep);
        });

        var panels = target.querySelectorAll("[data-govern-panel]");
        panels.forEach(function (panel) {
          var idx = Number(panel.getAttribute("data-govern-panel"));
          panel.classList.toggle("is-active", Number.isFinite(idx) && idx === activeStep);
        });

        var leftTerminal = target.querySelector(".govern-left");
        var rightTerminal = target.querySelector(".govern-right");
        if (leftTerminal) {
          leftTerminal.classList.add("is-active");
        }
        if (rightTerminal) {
          rightTerminal.classList.add("is-active");
        }
      });
    }

    sync();
    return { sync: sync };
  }

  function initSlideAutoFit() {
    var sections = Array.prototype.slice.call(document.querySelectorAll(".reveal .slides > section"));

    if (!sections.length) {
      return null;
    }

    function getDirectPad(section) {
      if (!section || !section.children || !section.children.length) {
        return null;
      }

      for (var i = 0; i < section.children.length; i += 1) {
        var child = section.children[i];
        if (child && child.classList && child.classList.contains("slide-pad")) {
          return child;
        }
      }

      return null;
    }

    function getTargetSections(slide) {
      if (!slide) {
        if (typeof Reveal !== "undefined" && Reveal.getCurrentSlide) {
          var current = Reveal.getCurrentSlide();
          if (current) {
            return [current];
          }
        }

        return [];
      }

      if (slide.classList && slide.classList.contains("present")) {
        return [slide];
      }

      var owner = slide.closest ? slide.closest("section") : null;
      if (owner) {
        return [owner];
      }

      return sections;
    }

    function getInternalOverflow(pad) {
      if (!pad) {
        return 0;
      }

      var maxOverflow = 0;
      var activeSelectors = [
        ".story-stage.is-active",
        ".mlops-stage.is-active",
        ".govern-detail-stage.is-active"
      ];

      activeSelectors.forEach(function (selector) {
        var nodes = Array.prototype.slice.call(pad.querySelectorAll(selector));
        nodes.forEach(function (node) {
          if (!node || !node.clientHeight) {
            return;
          }

          var hidden = Math.ceil(node.scrollHeight - node.clientHeight);
          if (hidden <= 6) {
            return;
          }

          if (hidden > maxOverflow) {
            maxOverflow = hidden;
          }
        });
      });

      return Math.max(0, maxOverflow);
    }

    function measureOverflow(section, pad) {
      if (!section || !pad) {
        return 0;
      }

      var sectionRect = section.getBoundingClientRect();
      var padRect = pad.getBoundingClientRect();
      var overflowBottom = Math.ceil(padRect.bottom - sectionRect.bottom);
      var overflowTop = Math.ceil(sectionRect.top - padRect.top);
      var internal = getInternalOverflow(pad);
      var padOverflow = Math.ceil(Math.max(0, pad.scrollHeight - pad.clientHeight));

      return Math.max(0, overflowBottom, overflowTop, internal, padOverflow);
    }

    function resetFit(pad) {
      if (!pad) {
        return;
      }

      pad.classList.remove("fit-tight", "fit-compact");
    }

    function fitSection(section) {
      var pad = getDirectPad(section);
      if (!pad) {
        return;
      }

      resetFit(pad);

      var overflow = measureOverflow(section, pad);
      if (overflow <= 6) {
        return;
      }

      pad.classList.add("fit-tight");
      overflow = measureOverflow(section, pad);
      if (overflow <= 6) {
        return;
      }

      pad.classList.add("fit-compact");
    }

    function sync(slide) {
      var targetSections = getTargetSections(slide);
      targetSections.forEach(function (section) {
        fitSection(section);
      });
    }

    var initialFitSlide = typeof Reveal !== "undefined" && Reveal.getCurrentSlide ? Reveal.getCurrentSlide() : null;
    if (initialFitSlide) {
      sync(initialFitSlide);
    }
    return { sync: sync };
  }

  function initSlideCounters() {
    var counters = Array.prototype.slice.call(document.querySelectorAll("[data-slide-counter]"));
    if (!counters.length) {
      return null;
    }

    var sections = Array.prototype.slice.call(document.querySelectorAll(".reveal .slides > section"));
    if (!sections.length) {
      return null;
    }

    function formatIndex(index) {
      var number = Math.max(1, index + 1);
      return String(number).padStart(2, "0") + ".";
    }

    function sync() {
      counters.forEach(function (node) {
        var owner = node.closest("section");
        var index = sections.indexOf(owner);
        node.textContent = formatIndex(index);
      });
    }

    sync();
    return { sync: sync };
  }

  function initUnifiedSlideHeads() {
    var pads = Array.prototype.slice.call(document.querySelectorAll(".slide-pad"));

    pads.forEach(function (pad) {
      if (!pad || pad.classList.contains("hero") || pad.classList.contains("closing") || pad.classList.contains("context-premium-slide")) {
        return;
      }

      var h2 = null;
      for (var i = 0; i < pad.children.length; i += 1) {
        if (pad.children[i].tagName === "H2") {
          h2 = pad.children[i];
          break;
        }
      }

      if (!h2 || (h2.parentElement && h2.parentElement.classList.contains("slide-head"))) {
        return;
      }

      var cleanTitle = h2.textContent.replace(/^\s*\d+\.\s*/, "").trim();
      h2.textContent = cleanTitle;

      var wrapper = document.createElement("div");
      wrapper.className = "slide-head";

      var counter = document.createElement("span");
      counter.className = "slide-counter";
      counter.setAttribute("data-slide-counter", "");
      counter.textContent = "--.";

      h2.parentElement.insertBefore(wrapper, h2);
      wrapper.appendChild(counter);
      wrapper.appendChild(h2);
    });
  }

  function initIndexNeonReveal() {
    var items = Array.prototype.slice.call(document.querySelectorAll(".index-column .clean-list li.fragment"));

    if (!items.length) {
      return null;
    }

    function build(item) {
      if (item.querySelector(".index-item-shell")) {
        return;
      }

      var text = item.textContent.trim();
      item.textContent = "";

      var shell = document.createElement("span");
      shell.className = "index-item-shell";

      var base = document.createElement("span");
      base.className = "index-text-base";
      base.textContent = text;

      var neon = document.createElement("span");
      neon.className = "index-text-neon";
      neon.setAttribute("aria-hidden", "true");
      neon.textContent = text;

      var ray = document.createElement("span");
      ray.className = "index-ray";
      ray.setAttribute("aria-hidden", "true");

      shell.appendChild(base);
      shell.appendChild(neon);
      shell.appendChild(ray);
      item.appendChild(shell);
    }

    function reset(item) {
      var shell = item.querySelector(".index-item-shell");
      var neon = item.querySelector(".index-text-neon");
      var ray = item.querySelector(".index-ray");

      if (!shell || !neon || !ray) {
        return;
      }

      if (item._indexNeonRaf) {
        window.cancelAnimationFrame(item._indexNeonRaf);
      }

      shell.style.clipPath = "inset(0 100% 0 0)";
      neon.style.opacity = "0";
      ray.style.left = "0%";
      ray.style.opacity = "0";
      item._indexNeonRaf = null;
    }

    function setVisibleStatic(item) {
      var shell = item.querySelector(".index-item-shell");
      var neon = item.querySelector(".index-text-neon");
      var ray = item.querySelector(".index-ray");

      if (!shell || !neon || !ray) {
        return;
      }

      shell.style.clipPath = "inset(0 0% 0 0)";
      neon.style.opacity = "0";
      ray.style.opacity = "0";
    }

    function animate(item) {
      var shell = item.querySelector(".index-item-shell");
      var neon = item.querySelector(".index-text-neon");
      var ray = item.querySelector(".index-ray");

      if (!shell || !neon || !ray) {
        return;
      }

      if (item._indexNeonRaf) {
        window.cancelAnimationFrame(item._indexNeonRaf);
      }

      var speedPxPerSec = 540;
      var widthPx = Math.max(shell.getBoundingClientRect().width, 1);
      var edgePx = Math.min(22, widthPx * 0.12);
      var start = null;

      function step(ts) {
        if (!start) {
          start = ts;
        }

        var elapsed = ts - start;
        var distancePx = Math.min((elapsed / 1000) * speedPxPerSec, widthPx);
        var progress = distancePx / widthPx;
        var percentage = progress * 100;

        shell.style.clipPath = "inset(0 " + (100 - percentage).toFixed(2) + "% 0 0)";
        ray.style.left = percentage.toFixed(2) + "%";
        neon.style.opacity = "1";

        if (distancePx < edgePx) {
          ray.style.opacity = String(distancePx / edgePx);
        } else if (widthPx - distancePx < edgePx) {
          ray.style.opacity = String((widthPx - distancePx) / edgePx);
        } else {
          ray.style.opacity = "1";
        }

        if (progress < 1) {
          item._indexNeonRaf = window.requestAnimationFrame(step);
          return;
        }

        neon.style.opacity = "0";
        ray.style.opacity = "0";
        item._indexNeonRaf = null;
      }

      item._indexNeonRaf = window.requestAnimationFrame(step);
    }

    function sync(slide) {
      if (!slide) {
        return;
      }

      var localItems = slide.querySelectorAll(".index-column .clean-list li.fragment");
      localItems.forEach(function (item) {
        if (item.classList.contains("visible")) {
          setVisibleStatic(item);
        } else {
          reset(item);
        }
      });
    }

    items.forEach(function (item) {
      build(item);
      reset(item);
    });

    return {
      sync: sync,
      onShown: animate,
      onHidden: reset
    };
  }

  function initMarketBackground() {
    var chart = document.getElementById("bg-chart-container");
    var priceLine = document.getElementById("bg-price-line");
    var priceDot = document.getElementById("bg-price-dot");

    if (!chart || !priceLine || !priceDot || chart.dataset.ready === "true") {
      return;
    }

    var currentY = 50;
    var liveCandle = null;
    var ticks = 0;
    var maxTicks = 6;
    var maxCandles = 60;
    var anchorRatio = 0.75;
    var layout = {
      step: 16,
      candleWidth: 10,
      anchorIndex: 20,
      anchorX: 0,
      maxCandles: 60
    };
    var openY = 50;
    var highY = 50;
    var lowY = 50;

    function createCandleDOM() {
      var wrapper = document.createElement("div");
      wrapper.className = "market-candle-wrapper";

      var wick = document.createElement("div");
      wick.style.position = "absolute";
      wick.style.width = "1px";

      var body = document.createElement("div");
      body.style.position = "absolute";
      body.style.width = "100%";
      body.style.borderRadius = "1px";
      body.style.minHeight = "1px";

      wrapper.appendChild(wick);
      wrapper.appendChild(body);
      return { wrapper: wrapper, wick: wick, body: body };
    }

    function getLayoutMetrics() {
      var chartStyle = window.getComputedStyle(chart);
      var gap = parseFloat(chartStyle.gap || chartStyle.columnGap || "0") || 0;
      var probe = chart.querySelector(".market-candle-wrapper");
      var candleWidth = probe ? probe.getBoundingClientRect().width : 0;

      if (!candleWidth) {
        candleWidth = 10;
      }

      var step = Math.max(candleWidth + gap, 1);
      var slots = Math.max(24, Math.floor(chart.clientWidth / step));
      var anchorIndex = Math.max(12, Math.floor(slots * anchorRatio));
      var maxWindow = Math.max(anchorIndex + 16, slots + 20);

      return {
        step: step,
        candleWidth: candleWidth,
        anchorIndex: anchorIndex,
        anchorX: anchorIndex * step + candleWidth / 2,
        maxCandles: maxWindow
      };
    }

    function updateScrollPosition(animated) {
      if (!chart.children.length) {
        return;
      }

      var latestIndex = chart.children.length - 1;
      var latestCenter = latestIndex * layout.step + layout.candleWidth / 2;
      var offsetX = layout.anchorX - latestCenter;

      chart.style.transition = animated ? "transform 600ms ease-out" : "none";
      chart.style.transform = "translateX(" + offsetX + "px)";
    }

    function refreshLayout() {
      layout = getLayoutMetrics();
      maxCandles = layout.maxCandles;

      while (chart.children.length > maxCandles) {
        chart.removeChild(chart.firstChild);
      }

      updateScrollPosition(false);
    }

    function applyStyles(elements, isBullish, open, current, high, low, isLive) {
      var bodyColor = isBullish ? "rgba(52, 211, 153, 0.85)" : "rgba(251, 113, 133, 0.82)";
      var wickColor = isBullish ? "rgba(16, 185, 129, 0.56)" : "rgba(244, 63, 94, 0.56)";
      var shadow = isBullish ? "0 0 10px rgba(52, 211, 153, 0.25)" : "0 0 10px rgba(251, 113, 133, 0.25)";

      elements.body.style.background = bodyColor;
      elements.body.style.boxShadow = shadow;
      elements.body.style.opacity = isLive ? "1" : "0.5";
      elements.body.style.transition = isLive ? "all 600ms ease-out" : "none";

      elements.wick.style.background = wickColor;
      elements.wick.style.transition = "none";

      var bodyTop = Math.min(open, current);
      var bodyHeight = Math.abs(open - current);

      elements.body.style.top = bodyTop + "%";
      elements.body.style.height = bodyHeight + "%";

      elements.wick.style.top = high + "%";
      elements.wick.style.height = low - high + "%";
    }

    function updateLiveVisuals() {
      var isBullish = currentY <= openY;
      applyStyles(liveCandle, isBullish, openY, currentY, highY, lowY, true);

      priceLine.style.top = currentY + "%";
      if (isBullish) {
        priceLine.style.borderTopColor = "rgba(16, 185, 129, 0.5)";
        priceDot.style.backgroundColor = "#10b981";
        priceDot.style.boxShadow = "0 0 12px rgba(16, 185, 129, 0.9)";
      } else {
        priceLine.style.borderTopColor = "rgba(244, 63, 94, 0.5)";
        priceDot.style.backgroundColor = "#f43f5e";
        priceDot.style.boxShadow = "0 0 12px rgba(244, 63, 94, 0.9)";
      }
    }

    function startNewCandle() {
      if (liveCandle) {
        applyStyles(liveCandle, currentY <= openY, openY, currentY, highY, lowY, false);
      }

      openY = currentY;
      highY = currentY;
      lowY = currentY;
      ticks = 0;

      liveCandle = createCandleDOM();
      chart.appendChild(liveCandle.wrapper);

      while (chart.children.length > maxCandles) {
        chart.removeChild(chart.firstChild);
      }

      updateScrollPosition(true);
      updateLiveVisuals();
    }

    function tick() {
      if (ticks >= maxTicks) {
        startNewCandle();
        window.setTimeout(tick, 1000);
        return;
      }

      var delta = (Math.random() - 0.5) * 8;
      if (currentY < 20) {
        delta += 3;
      }
      if (currentY > 80) {
        delta -= 3;
      }

      currentY += delta;
      if (currentY < highY) {
        highY = currentY;
      }
      if (currentY > lowY) {
        lowY = currentY;
      }

      updateLiveVisuals();
      ticks += 1;
      window.setTimeout(tick, 800);
    }

    var pastY = 50;
    refreshLayout();
    var initialCandles = layout.anchorIndex + 1;

    for (var i = 0; i < initialCandles; i += 1) {
      var pOpen = pastY;
      var pDelta = (Math.random() - 0.5) * 8;
      if (pastY < 25) {
        pDelta += 2.5;
      }
      if (pastY > 75) {
        pDelta -= 2.5;
      }
      var pClose = pastY + pDelta;
      var pHigh = Math.min(pOpen, pClose) - Math.random() * 5;
      var pLow = Math.max(pOpen, pClose) + Math.random() * 5;

      var cDom = createCandleDOM();
      applyStyles(cDom, pClose <= pOpen, pOpen, pClose, pHigh, pLow, false);
      chart.appendChild(cDom.wrapper);
      pastY = pClose;
    }

    updateScrollPosition(false);

    currentY = pastY;
    startNewCandle();
    window.setTimeout(tick, 1000);
    window.addEventListener("resize", refreshLayout);
    chart.dataset.ready = "true";
  }

  function initGlobalMeteors() {
    var layer = document.getElementById("global-meteor-layer");

    if (!layer || layer.dataset.ready === "true") {
      return null;
    }

    var targetCount = 60;
    for (var i = 0; i < targetCount; i += 1) {
      var meteor = document.createElement("span");
      meteor.className = "meteor";
      layer.appendChild(meteor);
    }

    var meteors = layer.querySelectorAll(".meteor");
    meteors.forEach(function (meteor) {
      var top = -20 + Math.random() * 124;
      var left = -38 + Math.random() * 130;
      var width = 140 + Math.random() * 320;
      var duration = 5.2 + Math.random() * 5.8;
      var delay = -1 * (Math.random() * 11);
      var opacity = 0.42 + Math.random() * 0.5;
      var height = 1 + Math.random() * 1.4;

      meteor.style.setProperty("--meteor-top", top.toFixed(2) + "%");
      meteor.style.setProperty("--meteor-left", left.toFixed(2) + "%");
      meteor.style.setProperty("--meteor-width", width.toFixed(0) + "px");
      meteor.style.setProperty("--meteor-duration", duration.toFixed(2) + "s");
      meteor.style.setProperty("--meteor-delay", delay.toFixed(2) + "s");
      meteor.style.setProperty("--meteor-opacity", opacity.toFixed(2));
      meteor.style.setProperty("--meteor-height", height.toFixed(2) + "px");
    });

    layer.dataset.ready = "true";

    function sync(slide) {
      var revealRoot = document.querySelector(".reveal");
      if (!revealRoot) {
        return;
      }

      var isPremium = Boolean(slide && slide.classList && slide.classList.contains("premium-meteor-slide"));
      revealRoot.classList.toggle("has-premium-meteors", isPremium);
    }

    sync(document.querySelector(".reveal .slides section.present"));
    return { sync: sync };
  }

  function animateCounters(scope) {
    var counters = (scope || document).querySelectorAll("[data-counter]");

    counters.forEach(function (counter) {
      if (counter.dataset.counterAnimated === "true") {
        return;
      }

      var target = Number(counter.getAttribute("data-counter"));
      if (!Number.isFinite(target) || target <= 0) {
        return;
      }

      var duration = 900;
      var start = performance.now();

      function tick(now) {
        var elapsed = now - start;
        var progress = Math.min(elapsed / duration, 1);
        counter.textContent = String(Math.round(target * progress));

        if (progress < 1) {
          requestAnimationFrame(tick);
          return;
        }

        counter.dataset.counterAnimated = "true";
      }

      requestAnimationFrame(tick);
    });
  }

  function pulseFinanceCharts() {
    var charts = document.querySelectorAll(".finance-grid");

    charts.forEach(function (chart) {
      chart.classList.remove("is-pulsing");
      window.requestAnimationFrame(function () {
        chart.classList.add("is-pulsing");
      });
    });
  }

  function initIndexRail() {
    var items = Array.prototype.slice.call(document.querySelectorAll(".rail-item[data-nav]"));
    var windowIndexNodes = Array.prototype.slice.call(document.querySelectorAll(".window-current-index"));

    if (!items.length) {
      return null;
    }

    function findActiveItem(indexH) {
      var safeIndex = Number(indexH);
      var exactMatch = null;
      var closestMatch = null;
      var closestSlide = -Infinity;

      if (!Number.isFinite(safeIndex)) {
        safeIndex = 0;
      }

      items.forEach(function (item) {
        var slideIndex = Number(item.getAttribute("data-slide"));
        if (!Number.isFinite(slideIndex)) {
          return;
        }

        if (slideIndex === safeIndex) {
          exactMatch = item;
          return;
        }

        if (slideIndex <= safeIndex && slideIndex > closestSlide) {
          closestSlide = slideIndex;
          closestMatch = item;
        }
      });

      return exactMatch || closestMatch || items[0];
    }

    function setActive(indexH) {
      var activeItem = findActiveItem(indexH);
      var activeTitle = activeItem.getAttribute("aria-label") || activeItem.textContent || "PORTADA";

      items.forEach(function (item) {
        var isActive = item === activeItem;
        item.classList.toggle("is-active", isActive);
      });

      windowIndexNodes.forEach(function (node) {
        node.textContent = activeTitle;
      });
    }

    items.forEach(function (item) {
      item.addEventListener("click", function () {
        if (typeof Reveal === "undefined") {
          return;
        }

        var target = Number(item.getAttribute("data-slide"));
        if (!Number.isFinite(target)) {
          return;
        }

        Reveal.slide(target);
      });
    });

    setActive(0);
    return { setActive: setActive };
  }

  function initWindowHeaders() {
    var pads = document.querySelectorAll(".slide-pad");

    pads.forEach(function (pad) {
      if (pad.querySelector(".window-header")) {
        return;
      }

      var header = document.createElement("div");
      header.className = "window-header";

      header.innerHTML =
        '<div class="window-header-left">' +
        '<span class="window-dot red"></span>' +
        '<span class="window-dot amber"></span>' +
        '<span class="window-dot green"></span>' +
        "</div>" +
        '<div class="window-header-center"><i class="fa-solid fa-lock" aria-hidden="true"></i><span class="window-current-index">PORTADA</span></div>' +
        '<div class="window-header-right"><span class="window-utc-time">00:00:00 UTC</span></div>';

      pad.prepend(header);
    });
  }

  function initUtcClock() {
    var timeNodes = Array.prototype.slice.call(document.querySelectorAll(".window-utc-time"));

    if (!timeNodes.length) {
      return;
    }

    function renderUtcTime() {
      var now = new Date();
      var hh = String(now.getUTCHours()).padStart(2, "0");
      var mm = String(now.getUTCMinutes()).padStart(2, "0");
      var ss = String(now.getUTCSeconds()).padStart(2, "0");
      var value = hh + ":" + mm + ":" + ss + " UTC";

      timeNodes.forEach(function (node) {
        node.textContent = value;
      });
    }

    renderUtcTime();
    window.setInterval(renderUtcTime, 1000);
  }

  function initTerminalPanel() {
    var panel = document.querySelector(".market-terminal");

    if (!panel) {
      return null;
    }

    function shouldShowForSlide(slide) {
      if (!slide) {
        return false;
      }

      if (slide.dataset.showTerminal === "true") {
        return true;
      }

      if (slide.dataset.showTerminal === "false") {
        return false;
      }

      return Boolean(slide.querySelector("pre code, pre"));
    }

    function sync(slide) {
      panel.classList.toggle("is-visible", shouldShowForSlide(slide));
    }

    sync(document.querySelector(".reveal .slides section.present"));
    return { sync: sync };
  }

  function initContextIconPalette() {
    var sections = Array.prototype.slice.call(document.querySelectorAll(".reveal .slides section"));

    if (!sections.length) {
      return;
    }

    var toneClassNames = ["icon-tone-green", "icon-tone-red", "icon-tone-blue", "icon-tone-amber", "icon-tone-cyan"];
    var palette = [
      { key: "green", border: "rgba(16, 185, 129, 0.3)", background: "rgba(16, 185, 129, 0.1)", color: "#34d399" },
      { key: "blue", border: "rgba(59, 130, 246, 0.32)", background: "rgba(59, 130, 246, 0.1)", color: "#60a5fa" },
      { key: "amber", border: "rgba(245, 158, 11, 0.32)", background: "rgba(245, 158, 11, 0.1)", color: "#fbbf24" },
      { key: "red", border: "rgba(244, 63, 94, 0.3)", background: "rgba(244, 63, 94, 0.1)", color: "#fb7185" },
      { key: "cyan", border: "rgba(34, 211, 238, 0.34)", background: "rgba(34, 211, 238, 0.1)", color: "#67e8f9" },
      { key: "violet", border: "rgba(167, 139, 250, 0.34)", background: "rgba(167, 139, 250, 0.1)", color: "#c4b5fd" },
      { key: "orange", border: "rgba(251, 146, 60, 0.34)", background: "rgba(251, 146, 60, 0.1)", color: "#fdba74" },
      { key: "pink", border: "rgba(244, 114, 182, 0.34)", background: "rgba(244, 114, 182, 0.1)", color: "#f9a8d4" },
      { key: "lime", border: "rgba(163, 230, 53, 0.34)", background: "rgba(163, 230, 53, 0.1)", color: "#bef264" },
      { key: "sky", border: "rgba(56, 189, 248, 0.34)", background: "rgba(56, 189, 248, 0.1)", color: "#7dd3fc" }
    ];

    function getManualTone(node) {
      for (var i = 0; i < toneClassNames.length; i += 1) {
        var className = toneClassNames[i];
        if (node.classList.contains(className)) {
          return className.replace("icon-tone-", "");
        }
      }
      return null;
    }

    function clearInlineTone(node) {
      node.style.borderColor = "";
      node.style.background = "";
      node.style.color = "";
      node.style.boxShadow = "";
    }

    function applyInlineTone(node, tone) {
      node.style.borderColor = tone.border;
      node.style.background = tone.background;
      node.style.color = tone.color;
      node.style.boxShadow = "none";
    }

    sections.forEach(function (section) {
      var used = new Set();
      var icons = Array.prototype.slice.call(section.querySelectorAll(".context-icon"));

      icons.forEach(function (node) {
        if (!node || node.closest(".index-rail")) {
          return;
        }

        var manualTone = getManualTone(node);

        if (manualTone) {
          clearInlineTone(node);
          used.add(manualTone);
          return;
        }

        if (node.closest(".context-premium-card.tone-green")) {
          clearInlineTone(node);
          used.add("green");
          return;
        }

        if (node.closest(".context-premium-card.tone-red")) {
          clearInlineTone(node);
          used.add("red");
          return;
        }

        if (node.closest(".context-premium-card.tone-blue")) {
          clearInlineTone(node);
          used.add("blue");
          return;
        }

        var choice = null;
        for (var i = 0; i < palette.length; i += 1) {
          if (!used.has(palette[i].key)) {
            choice = palette[i];
            break;
          }
        }

        if (!choice) {
          choice = palette[used.size % palette.length];
        }

        applyInlineTone(node, choice);
        used.add(choice.key);
      });
    });
  }

  function syncHeroMatteBackground(indexH) {
    var revealRoot = document.querySelector(".reveal");
    if (!revealRoot) {
      return;
    }

    revealRoot.classList.toggle("hero-matte-bg", Number(indexH) === 0);
  }

  initMarketBackground();
  initLiveTickerStrip();
  initUnifiedSlideHeads();
  var hoverZoom = initHoverZoomPreview();
  var contentSwaps = initContentSwaps();
  var contextPremium = initContextPremiumSequence();
  var objectivesFocus = initObjectivesFocusSequence();
  var planningFocus = initPlanningFocusSequence();
  var mlopsSequence = initMlopsSequence();
  var mlopsFlowPulse = initMlopsFlowPulse();
  var storySequences = initStorySequences();
  var governanceSequence = initGovernanceSequence();
  var slideAutoFit = null;
  var slideCounters = initSlideCounters();
  var indexNeon = initIndexNeonReveal();
  var globalMeteors = initGlobalMeteors();
  initWindowHeaders();
  initContextIconPalette();
  var rail = initIndexRail();
  initUtcClock();
  var terminalPanel = initTerminalPanel();
  var storyResizeTimer = null;

  if (document.fonts && document.fonts.ready && typeof document.fonts.ready.then === "function") {
    document.fonts.ready.then(function () {
      var currentSlide = null;
      if (typeof Reveal !== "undefined" && Reveal.getCurrentSlide) {
        currentSlide = Reveal.getCurrentSlide();
      }

      if (storySequences) {
        storySequences.sync(currentSlide || null);
      }

      if (mlopsSequence) {
        mlopsSequence.sync(currentSlide || null);
      }

      if (governanceSequence) {
        governanceSequence.sync(currentSlide || null);
      }

      if (slideAutoFit) {
        slideAutoFit.sync(currentSlide || null);
      }
    });
  }

  window.addEventListener("resize", function () {
    if (!storySequences && !mlopsSequence && !governanceSequence && !slideAutoFit) {
      return;
    }

    window.clearTimeout(storyResizeTimer);
    storyResizeTimer = window.setTimeout(function () {
      var currentSlide = null;
      if (typeof Reveal !== "undefined" && Reveal.getCurrentSlide) {
        currentSlide = Reveal.getCurrentSlide();
      }

      if (storySequences) {
        storySequences.sync(currentSlide || null);
      }

      if (mlopsSequence) {
        mlopsSequence.sync(currentSlide || null);
      }

      if (governanceSequence) {
        governanceSequence.sync(currentSlide || null);
      }

      if (slideAutoFit) {
        slideAutoFit.sync(currentSlide || null);
      }
    }, 120);
  });

  if (typeof Reveal !== "undefined") {
    Reveal.on("ready", function (event) {
      animateCounters(event.currentSlide || document);
      pulseFinanceCharts();
      syncHeroMatteBackground(event.indexh || 0);

      if (rail) {
        rail.setActive(event.indexh || 0);
      }

      if (terminalPanel) {
        terminalPanel.sync(event.currentSlide);
      }

      if (globalMeteors) {
        globalMeteors.sync(event.currentSlide);
      }

      if (hoverZoom) {
        hoverZoom.hide();
      }

      if (contentSwaps) {
        contentSwaps.sync(event.currentSlide);
      }

      if (contextPremium) {
        contextPremium.sync(event.currentSlide);
      }

      if (objectivesFocus) {
        objectivesFocus.sync(event.currentSlide);
      }

      if (planningFocus) {
        planningFocus.sync(event.currentSlide);
      }

      if (mlopsSequence) {
        mlopsSequence.sync(event.currentSlide);
      }

      if (mlopsFlowPulse) {
        mlopsFlowPulse.sync(event.currentSlide);
      }

      if (storySequences) {
        storySequences.sync(event.currentSlide);
      }

      if (governanceSequence) {
        governanceSequence.sync(event.currentSlide);
      }

      if (slideAutoFit) {
        slideAutoFit.sync(event.currentSlide);
      }

      if (slideCounters) {
        slideCounters.sync();
      }

      if (indexNeon) {
        indexNeon.sync(event.currentSlide);
      }
    });

    Reveal.on("slidechanged", function (event) {
      animateCounters(event.currentSlide || document);
      pulseFinanceCharts();
      syncHeroMatteBackground(event.indexh || 0);

      if (rail) {
        rail.setActive(event.indexh || 0);
      }

      if (terminalPanel) {
        terminalPanel.sync(event.currentSlide);
      }

      if (globalMeteors) {
        globalMeteors.sync(event.currentSlide);
      }

      if (hoverZoom) {
        hoverZoom.hide();
      }

      if (contentSwaps) {
        contentSwaps.sync(event.currentSlide);
      }

      if (contextPremium) {
        contextPremium.sync(event.currentSlide);
      }

      if (objectivesFocus) {
        objectivesFocus.sync(event.currentSlide);
      }

      if (planningFocus) {
        planningFocus.sync(event.currentSlide);
      }

      if (mlopsSequence) {
        mlopsSequence.sync(event.currentSlide);
      }

      if (mlopsFlowPulse) {
        mlopsFlowPulse.sync(event.currentSlide);
      }

      if (storySequences) {
        storySequences.sync(event.currentSlide);
      }

      if (governanceSequence) {
        governanceSequence.sync(event.currentSlide);
      }

      if (slideAutoFit) {
        slideAutoFit.sync(event.currentSlide);
      }

      if (slideCounters) {
        slideCounters.sync();
      }

      if (indexNeon) {
        indexNeon.sync(event.currentSlide);
      }
    });

    Reveal.on("fragmentshown", function (event) {
      if (contentSwaps) {
        contentSwaps.sync(event.fragment ? event.fragment.closest("section") : null);
      }

      if (contextPremium) {
        contextPremium.sync(event.fragment ? event.fragment.closest("section") : null);
      }

      if (objectivesFocus) {
        objectivesFocus.sync(event.fragment ? event.fragment.closest("section") : null);
      }

      if (planningFocus) {
        planningFocus.sync(event.fragment ? event.fragment.closest("section") : null);
      }

      if (mlopsSequence) {
        mlopsSequence.sync(event.fragment ? event.fragment.closest("section") : null);
      }

      if (mlopsFlowPulse) {
        mlopsFlowPulse.sync(event.fragment ? event.fragment.closest("section") : null);
      }

      if (storySequences) {
        storySequences.sync(event.fragment ? event.fragment.closest("section") : null);
      }

      if (governanceSequence) {
        governanceSequence.sync(event.fragment ? event.fragment.closest("section") : null);
      }

      if (slideAutoFit) {
        slideAutoFit.sync(event.fragment ? event.fragment.closest("section") : null);
      }

      if (indexNeon && event.fragment && event.fragment.matches(".index-column .clean-list li.fragment")) {
        indexNeon.onShown(event.fragment);
      }
    });

    Reveal.on("fragmenthidden", function (event) {
      if (contentSwaps) {
        contentSwaps.sync(event.fragment ? event.fragment.closest("section") : null);
      }

      if (contextPremium) {
        contextPremium.sync(event.fragment ? event.fragment.closest("section") : null);
      }

      if (objectivesFocus) {
        objectivesFocus.sync(event.fragment ? event.fragment.closest("section") : null);
      }

      if (planningFocus) {
        planningFocus.sync(event.fragment ? event.fragment.closest("section") : null);
      }

      if (mlopsSequence) {
        mlopsSequence.sync(event.fragment ? event.fragment.closest("section") : null);
      }

      if (mlopsFlowPulse) {
        mlopsFlowPulse.sync(event.fragment ? event.fragment.closest("section") : null);
      }

      if (storySequences) {
        storySequences.sync(event.fragment ? event.fragment.closest("section") : null);
      }

      if (governanceSequence) {
        governanceSequence.sync(event.fragment ? event.fragment.closest("section") : null);
      }

      if (slideAutoFit) {
        slideAutoFit.sync(event.fragment ? event.fragment.closest("section") : null);
      }

      if (indexNeon && event.fragment && event.fragment.matches(".index-column .clean-list li.fragment")) {
        indexNeon.onHidden(event.fragment);
      }
    });
  }
})();
