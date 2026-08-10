const isFigmaCaptureMode = new URLSearchParams(window.location.search).get("figma-export") === "1";
if (isFigmaCaptureMode) document.body.classList.add("is-figma-capture");

const spiralProjectData = [
  {
    id: "project-one",
    number: "001",
    title: "한국소비자원",
    thumbnail: "assets/clone-coding/clone-03.webp",
    cta_url: "https://clonecoding1.vercel.app/",
  },
  {
    id: "project-two",
    number: "002",
    title: "한화케미컬",
    thumbnail: "assets/clone-coding/clone-04.webp",
    cta_url: "https://clonecoding2.vercel.app/",
  },
  {
    id: "project-three",
    number: "003",
    title: "Y Studio",
    thumbnail: "assets/clone-coding/clone-05.webp",
    cta_url: "https://clonecoding3.vercel.app/",
  },
  {
    id: "project-four",
    number: "004",
    title: "Crew À La Mode",
    thumbnail: "assets/clone-coding/clone-06.webp",
    cta_url: "https://clonecoding4.vercel.app/",
  },
  {
    id: "project-five",
    number: "005",
    title: "대방산업",
    thumbnail: "assets/clone-coding/clone-01.webp",
    cta_url: "https://clonecoding5.vercel.app/",
  },
  {
    id: "project-six",
    number: "006",
    title: "Musign",
    thumbnail: "assets/clone-coding/clone-02.webp",
    cta_url: "https://clonecodiing6.vercel.app/",
  },
];

const cursor = document.querySelector(".cursor");
const cursorHint = document.querySelector(".cursor-hint");
const hero = document.querySelector(".hero");
const intro = document.querySelector(".intro");
const heroTitle = document.querySelector(".hero-title");
const heroWords = [...document.querySelectorAll(".hero-word")];
const introHeading = document.querySelector(".section-heading h2");
const introCopy = document.querySelector(".intro-copy");
const introPortraitSlot = document.querySelector(".intro-portrait-slot");
const flipStack = document.querySelector(".flip-stack");
const flipCard = document.querySelector(".flip-card");
const main = document.querySelector("main");
const darkReveal = document.querySelector(".dark-reveal");
const toolContentSection = document.querySelector(".tools-content-section");
const revealContentSection = document.querySelector(".reveal-content-section");
const creamProjectsSection = document.querySelector(".works");
const aboutRevealItems = document.querySelectorAll(".about-text .word, .about-text-image");
const revealTranslationLines = document.querySelectorAll(".reveal-line");
const projectShowcaseSection = document.querySelector(".project-showcase");
const spiralSection = document.querySelector(".spiral-section");
const spiralStage = document.querySelector(".spiral-stage");
const spiralScrollShell = document.querySelector(".spiral-scroll-shell");
const spiralGrid = document.querySelector(".spiral-grid");
const spiralCanvas = document.querySelector(".spiral-webgl");
const spiralProjectCta = document.querySelector(".spiral-project-cta");
const spiralCaptionIndex = document.querySelector("[data-spiral-caption-index]");
const spiralCaptionTitle = document.querySelector("[data-spiral-caption-title]");
const chatbotModal = document.querySelector(".chatbot-modal");

if (spiralProjectCta && spiralProjectCta.parentElement !== document.body) {
  document.body.appendChild(spiralProjectCta);
}

revealTranslationLines.forEach((line) => {
  const englishWords = [...line.querySelectorAll(".reveal-language-en .word")];

  line.addEventListener("pointerenter", () => cursor?.classList.add("is-translating"));
  line.addEventListener("pointerleave", () => cursor?.classList.remove("is-translating"));

  line.addEventListener("pointermove", (event) => {
    const bounds = line.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    line.style.setProperty("--lens-x", `${x.toFixed(1)}px`);
    line.style.setProperty("--lens-y", `${y.toFixed(1)}px`);
    const translated = line.querySelector(".reveal-language-ko");
    translated?.style.setProperty("--lens-x", `${x.toFixed(1)}px`);
    translated?.style.setProperty("--lens-y", `${y.toFixed(1)}px`);

    const radius = 118;
    englishWords.forEach((word) => {
      const rect = word.getBoundingClientRect();
      const dx = rect.left + rect.width / 2 - event.clientX;
      const dy = rect.top + rect.height / 2 - event.clientY;
      const distance = Math.max(Math.hypot(dx, dy), 0.001);
      const strength = Math.max(0, 1 - distance / radius);
      const easedStrength = Math.pow(strength, 1.6);
      const offsetX = (dx / distance) * easedStrength * 34;
      const offsetY = (dy / distance) * easedStrength * 24;
      const rotation = (dx / radius) * easedStrength * 7;
      word.style.transform = `translate3d(${offsetX.toFixed(2)}px, ${offsetY.toFixed(2)}px, 0) rotate(${rotation.toFixed(2)}deg)`;
    });
  });

  line.addEventListener("pointerleave", () => {
    englishWords.forEach((word) => {
      word.style.transform = "translate3d(0, 0, 0) rotate(0deg)";
    });
  });
});

const experienceSection = document.querySelector(".experience-section");
const contactSection = document.querySelector(".contact");
const contactLinksEl = document.querySelector(".contact-links");
const contactSignatureEl = document.querySelector(".contact-signature");
const contactGnbEl = document.querySelector(".contact-gnb");
const contactDividerEl = document.querySelector(".contact-divider");
const contactFooterMetaEl = document.querySelector(".contact-footer-meta");
const contactRevealGroups = [
  [contactLinksEl],
  [contactSignatureEl, contactGnbEl],
  [contactDividerEl, contactFooterMetaEl],
]
  .map((group) => group.filter(Boolean))
  .filter((group) => group.length);
const timelineShell = document.querySelector(".timeline-shell");
const timelineLine = document.querySelector(".timeline-line");
const timelineProgress = document.querySelector(".timeline-progress");
const experienceItems = [...document.querySelectorAll(".experience-item")];
const timelineAmbient = document.querySelector(".timeline-ambient");
const timelineAmbientYear = document.querySelector("[data-timeline-ambient-year]");
let activeTimelineAmbientIndex = -1;
let timelineAmbientTransitionId = 0;

const setTimelineAmbientYear = (label, force = false) => {
  if (!timelineAmbientYear || (!force && timelineAmbientYear.dataset.label === label)) return;
  const transitionId = ++timelineAmbientTransitionId;
  const gsap = window.gsap;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const revealNextYear = () => {
    if (transitionId !== timelineAmbientTransitionId) return;
    timelineAmbientYear.textContent = "";
    timelineAmbientYear.dataset.label = label;
    const nextLetters = [];
    [...label].forEach((character) => {
      const clip = document.createElement("span");
      const letter = document.createElement("span");
      clip.className = "timeline-ambient-letter-clip";
      letter.className = "timeline-ambient-letter";
      letter.textContent = character === " " ? "\u00a0" : character;
      clip.appendChild(letter);
      timelineAmbientYear.appendChild(clip);
      nextLetters.push(letter);
    });

    if (reducedMotion || !gsap) {
      nextLetters.forEach((letter) => {
        letter.style.opacity = "1";
        letter.style.transform = "translateY(0)";
      });
      return;
    }
    gsap.fromTo(
      nextLetters,
      { yPercent: 135, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.72,
        ease: "power3.out",
        stagger: 0.035,
        overwrite: true,
        immediateRender: true,
      }
    );
  };

  if (gsap) gsap.killTweensOf(timelineAmbientYear.querySelectorAll(".timeline-ambient-letter"));
  revealNextYear();
};
const navTitleCurrent = document.querySelector("[data-nav-title-current]");
const navTitleNext = document.querySelector("[data-nav-title-next]");
const navTitleSections = [...document.querySelectorAll("[data-nav-title]")];
const sectionCaption = document.querySelector(".section-caption");
const sectionCaptionIndex = document.querySelector("[data-section-caption-index]");
const sectionCaptionText = document.querySelector("[data-section-caption-text]");
const sectionCaptionSections = [...document.querySelectorAll("[data-section-caption]")];
let activeCaptionSection = null;
const profileTypingTargets = [
  document.querySelector(".section-heading h2"),
  document.querySelector(".profile-summary h3"),
  document.querySelector(".profile-summary p"),
  ...document.querySelectorAll(".profile-details li > span"),
  document.querySelector(".profile-project-link > span:first-child"),
].filter(Boolean);

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const easeOutCubic = (value) => 1 - Math.pow(1 - value, 3);
const lerp = (start, end, progress) => start + (end - start) * progress;
const cubicBezierProgress = (progress, x1, y1, x2, y2) => {
  const x = clamp(progress, 0, 1);
  const sample = (time, point1, point2) => {
    const inverse = 1 - time;
    return 3 * inverse * inverse * time * point1 + 3 * inverse * time * time * point2 + time * time * time;
  };
  const derivative = (time, point1, point2) => (
    3 * (1 - time) * (1 - time) * point1
    + 6 * (1 - time) * time * (point2 - point1)
    + 3 * time * time * (1 - point2)
  );
  let time = x;

  for (let index = 0; index < 6; index += 1) {
    const slope = derivative(time, x1, x2);
    if (Math.abs(slope) < 0.000001) break;
    time = clamp(time - (sample(time, x1, x2) - x) / slope, 0, 1);
  }

  return sample(time, y1, y2);
};

// Keep the card following the scroll instead of snapping to each new target.
// The longer, near-critically damped response mirrors the original hero flip.
const heroCardSpring = { stiffness: 110, damping: 24, mass: 1 };
const heroCardMotion = {
  initialized: false,
  frame: null,
  lastTime: 0,
  current: { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1, metaOpacity: 1 },
  target: { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1, metaOpacity: 1 },
  velocity: { x: 0, y: 0, rotate: 0, scale: 0, opacity: 0, metaOpacity: 0 },
};
let ticking = false;
let spiralExperience = null;
let spiralInitializing = false;
let activeNavTitle = navTitleCurrent?.textContent.trim() || "Haesoo";
let navTitleTimeline = null;
let previousNavScrollY = window.scrollY;
let heroCardDock = null;
let profileTypingStarted = false;

const wait = (duration) => new Promise((resolve) => window.setTimeout(resolve, duration));

const prepareProfileTyping = () => {
  if (isFigmaCaptureMode || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  profileTypingTargets.forEach((target) => {
    if (target.dataset.typingReady === "true") return;
    const accessibleLabel = target.textContent.replace(/\s+/g, " ").trim();
    const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    textNodes.forEach((textNode) => {
      const fragment = document.createDocumentFragment();
      [...textNode.nodeValue].forEach((character) => {
        if (/\s/.test(character)) {
          fragment.appendChild(document.createTextNode(character));
          return;
        }
        const characterElement = document.createElement("span");
        characterElement.className = "typing-char";
        characterElement.textContent = character;
        fragment.appendChild(characterElement);
      });
      textNode.replaceWith(fragment);
    });

    target.dataset.typingReady = "true";
    if (accessibleLabel) target.setAttribute("aria-label", accessibleLabel);
    target.closest(".profile-details li, .profile-project-link")?.setAttribute("data-typing-row", "");
  });
};

const getTypingDelay = (character, index, speed = 1) => {
  if (/[,.!?]/.test(character)) return 155 * speed;
  const baseDelay = /[\u3131-\uD79D]/.test(character) ? 65 : 45;
  return Math.max(16, (baseDelay + ((character.codePointAt(0) + index * 7) % 17) - 8) * speed);
};

const typeProfileTarget = async (target, speed = 1) => {
  target.closest("[data-typing-row]")?.classList.add("is-typing-visible");
  const characters = [...target.querySelectorAll(".typing-char")];

  for (let characterIndex = 0; characterIndex < characters.length; characterIndex += 1) {
    target.querySelector(".typing-char.has-caret")?.classList.remove("has-caret");
    const character = characters[characterIndex];
    character.classList.add("is-typed", "has-caret");
    await wait(getTypingDelay(character.textContent, characterIndex, speed));
  }

  characters.at(-1)?.classList.remove("has-caret");
};

const startProfileTyping = async () => {
  if (profileTypingStarted) return;
  profileTypingStarted = true;

  if (isFigmaCaptureMode || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll("[data-typing-row]").forEach((row) => row.classList.add("is-typing-visible"));
    return;
  }

  const helloTarget = profileTypingTargets[0];
  const helloTyping = typeProfileTarget(helloTarget, 0.9);
  await wait(110);

  for (const target of profileTypingTargets.slice(1)) {
    await typeProfileTarget(target, 0.28);
    await wait(35);
  }

  await helloTyping;
};

const typeHeroTitle = async () => {
  const letters = [...document.querySelectorAll(".hero-letter")];
  if (!letters.length) return;

  if (isFigmaCaptureMode || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    letters.forEach((letter) => {
      letter.style.transform = "translate3d(0, 0, 0)";
    });
    return;
  }

  const animations = letters.map((letter, index) => letter.animate(
    [
      { transform: "translate3d(0, 180px, 0)" },
      { transform: "translate3d(0, 0, 0)" },
    ],
    {
      duration: 700,
      delay: index * 35,
      easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      fill: "forwards",
    }
  ));

  await Promise.all(animations.map((animation) => animation.finished.catch(() => {})));
  animations.forEach((animation) => {
    animation.commitStyles?.();
    animation.cancel();
  });
};

let resolveHeroBuddyIntro;
const heroBuddyIntroSignal = new Promise((resolve) => {
  resolveHeroBuddyIntro = resolve;
});
window.setTimeout(() => resolveHeroBuddyIntro(), 1500);

const initLandingEntrance = async () => {
  const root = document.documentElement;
  const gsap = window.gsap;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const compactLanding = window.matchMedia("(max-width: 1279.98px)").matches;

  await heroBuddyIntroSignal;
  const finalState = {
    "--landing-card-opacity": 1,
    "--landing-card-y": "0px",
    "--landing-nav-opacity": 1,
    "--landing-nav-y": "0px",
    "--landing-detail-opacity": 1,
    "--landing-detail-y": "0px",
    "--landing-card-rotate": "0deg",
  };

  if (!gsap || reducedMotion || isFigmaCaptureMode) {
    await typeHeroTitle();
    Object.entries(finalState).forEach(([property, value]) => root.style.setProperty(property, value));
    root.classList.add("hero-title-ready");
    root.classList.add("landing-complete");
    return;
  }

  gsap.set(heroWords, { opacity: 1, filter: "blur(0px)", y: 0 });
  await typeHeroTitle();

  const entrance = gsap.timeline({
    defaults: { duration: 1.6, ease: "expo.out" },
    onComplete: () => root.classList.add("landing-complete"),
  });

  entrance.call(() => root.classList.add("hero-title-ready"), null, 0);

  entrance.to(root, {
    "--landing-card-opacity": 1,
    "--landing-card-y": "0px",
  }, 0.1);

  entrance.to(root, {
    "--landing-nav-opacity": 1,
    "--landing-nav-y": "0px",
    "--landing-detail-opacity": 1,
    "--landing-detail-y": "0px",
  }, 0.3);

  if (compactLanding) {
    entrance.to(root, { "--landing-card-rotate": "0deg" }, 0.6);
  }
};

const initCodeSectionTitles = () => {
  const headings = [...document.querySelectorAll(".code-section-heading[data-code-title]")];
  const standaloneTitles = [...document.querySelectorAll("[data-scroll-title]")];
  if (!headings.length && !standaloneTitles.length) return;

  // The two project showcases (#project1, #project2) keep the chapter title's
  // scale/fade treatment but no longer hijack/hold scroll on entry — only
  // other chapter headings (e.g. History) still settle-lock.
  const scrollLockExemptHeadings = new Set(
    headings.filter((heading) => heading.closest(".project-section"))
  );

  headings.forEach((heading) => {
    if (heading.querySelector(":scope > .code-section-ui")) return;

    const title = (heading.dataset.codeTitle || "").trim();
    const ui = document.createElement("div");
    ui.className = "code-section-ui";
    ui.setAttribute("aria-hidden", "true");

    const displayTitle = document.createElement("div");
    displayTitle.className = "code-display-title";

    title.split(/\s+/).forEach((wordText, wordIndex, words) => {
      const word = document.createElement("span");
      word.className = "code-display-word";
      [...wordText].forEach((character) => {
        const letter = document.createElement("span");
        letter.className = "code-display-letter";
        letter.textContent = character;
        word.appendChild(letter);
      });
      displayTitle.appendChild(word);
      if (wordIndex < words.length - 1) {
        displayTitle.append(heading.classList.contains("section-heading")
          ? document.createElement("br")
          : " ");
      }
    });

    ui.append(displayTitle);
    const titleRow = heading.querySelector(":scope > .code-title-row");
    if (titleRow) titleRow.prepend(ui);
    else heading.prepend(ui);
  });

  standaloneTitles.forEach((title) => {
    if (title.querySelector(":scope > .scroll-title-word")) return;
    const label = title.textContent.trim();
    title.textContent = "";
    title.setAttribute("aria-label", label);

    label.split(/\s+/).forEach((wordText, wordIndex, words) => {
      const word = document.createElement("span");
      word.className = "scroll-title-word";
      word.setAttribute("aria-hidden", "true");
      [...wordText].forEach((character) => {
        const letter = document.createElement("span");
        letter.className = "scroll-title-letter";
        letter.textContent = character;
        word.appendChild(letter);
      });
      title.appendChild(word);
      if (wordIndex < words.length - 1) title.append(" ");
    });
  });

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const gsap = window.gsap;
  // Chapter titles (data-code-title) share the same letter rise-up reveal
  // as standalone titles; only their trigger element differs.
  const titleGroups = [
    ...standaloneTitles.map((title) => ({
      trigger: title,
      letters: [...title.querySelectorAll(".scroll-title-letter")],
    })),
    ...headings.map((heading) => ({
      trigger: heading.querySelector(".code-display-title"),
      letters: [...heading.querySelectorAll(".code-display-letter")],
    })).filter((group) => group.trigger),
  ];

  const revealedTitleGroups = new WeakSet();
  const titleRevealLine = 1.08;
  const revealTitleGroup = (group) => {
    if (revealedTitleGroups.has(group.trigger)) return;
    revealedTitleGroups.add(group.trigger);

    if (reducedMotion || !gsap) {
      group.letters.forEach((letter) => { letter.style.transform = "none"; });
      return;
    }

    gsap.fromTo(group.letters,
      { yPercent: 145 },
      {
        yPercent: 0,
        duration: 0.72,
        ease: "power3.out",
        stagger: 0.028,
        overwrite: true,
      });
  };

  // Re-arms the reveal so scrolling back up past the title (it drops back
  // below the reveal line, which by construction happens just off the
  // bottom edge of the viewport) resets it to replay on the next scroll-down.
  const hideTitleGroup = (group) => {
    if (!revealedTitleGroups.has(group.trigger)) return;
    revealedTitleGroups.delete(group.trigger);

    if (reducedMotion || !gsap) return;
    gsap.set(group.letters, { yPercent: 145, overwrite: true });
  };

  if (reducedMotion || !gsap) {
    titleGroups.forEach(({ letters }) => {
      letters.forEach((letter) => { letter.style.transform = "none"; });
    });
  }

  const lastProgressValues = new WeakMap();
  const setProgressIfChanged = (element, property, value) => {
    if (!element || lastProgressValues.get(element) === value) return;
    lastProgressValues.set(element, value);
    element.style.setProperty(property, value);
  };

  // Chapter zoom is smoothed against a lagging current value rather than
  // snapping straight to the scroll-derived target, so fast/choppy scroll
  // input doesn't read as jumpy motion.
  const chapterState = new WeakMap();
  const chapterSmoothing = 0.16;
  const chapterSettleEpsilon = 0.0008;

  // As soon as a chapter title starts entering, control of the scroll
  // position is taken over: it glides the rest of the way to dead center
  // itself (re-asserting its own eased position every frame, which
  // overrides whatever delta the user's own scroll/trackpad momentum tries
  // to add that frame — momentum can't accumulate if it's overwritten
  // every frame), then locks outright for a beat once centered so the
  // title reads before the page continues into the section content.
  // The hard lock uses overflow (not just preventDefault) because trackpad
  // momentum scrolls the compositor directly, bypassing JS events entirely;
  // overflow is only safe to apply once the glide is done, since it also
  // blocks the programmatic scrollTo the glide itself relies on.
  // Re-arms once the title scrolls back out of the zone.
  const settleHoldMs = 450;
  const settleEaseMinMs = 260;
  const settleEaseMaxMs = 720;
  const settleEaseMsPerPx = 0.55;
  const settledHeadings = new WeakSet();
  let scrollHoldTimer = null;
  let settleEaseFrame = null;

  const lockScroll = () => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    if (scrollHoldTimer !== null) clearTimeout(scrollHoldTimer);
    scrollHoldTimer = window.setTimeout(() => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      scrollHoldTimer = null;
      delete document.documentElement.dataset.chapterGlide;
    }, settleHoldMs);
  };

  // Flags the chapter-title glide/lock as in progress so the global wheel
  // smoothing below yields scroll control back to it instead of fighting
  // over window.scrollTo on the same frame.
  const holdScrollAt = (targetY) => {
    if (reducedMotion) return;
    document.documentElement.dataset.chapterGlide = "";
    if (settleEaseFrame !== null) cancelAnimationFrame(settleEaseFrame);

    const startY = window.scrollY;
    const startTime = performance.now();
    const duration = clamp(Math.abs(targetY - startY) * settleEaseMsPerPx, settleEaseMinMs, settleEaseMaxMs);

    const tick = (now) => {
      const progress = clamp((now - startTime) / duration, 0, 1);
      window.scrollTo({ top: lerp(startY, targetY, easeOutCubic(progress)), behavior: "auto" });
      if (progress < 1) {
        settleEaseFrame = requestAnimationFrame(tick);
      } else {
        settleEaseFrame = null;
        lockScroll();
      }
    };
    settleEaseFrame = requestAnimationFrame(tick);
  };

  const paint = () => {
    titleGroups.forEach((group) => {
      const rect = group.trigger.getBoundingClientRect();
      if (rect.top < window.innerHeight * titleRevealLine) {
        revealTitleGroup(group);
      } else {
        hideTitleGroup(group);
      }
    });

    let unsettled = false;

    headings.forEach((heading) => {
      const rect = heading.getBoundingClientRect();
      if (heading.classList.contains("project-section-title")) {
        const exitProgress = reducedMotion
          ? 0
          : clamp(-rect.top / Math.max(rect.height * 0.52, 1), 0, 1);

        // Settle target is where the title's own vertical center lands on
        // the viewport's vertical center, not where the block's top edge
        // reaches the viewport's top edge (those differ whenever the block
        // is shorter than the viewport, which pulled the settle point up
        // toward the header instead of true screen-center).
        const enterStartTop = window.innerHeight * 0.85;
        const enterSettleTop = (window.innerHeight - rect.height) / 2;
        const enterProgress = reducedMotion
          ? 1
          : clamp((enterStartTop - rect.top) / Math.max(enterStartTop - enterSettleTop, 1), 0, 1);

        if (!reducedMotion && !scrollLockExemptHeadings.has(heading)) {
          if (enterProgress > 0 && !settledHeadings.has(heading)) {
            settledHeadings.add(heading);
            holdScrollAt(window.scrollY + rect.top - enterSettleTop);
          } else if (enterProgress <= 0) {
            settledHeadings.delete(heading);
          }
        }

        // Entrance is handled by the letter rise-up reveal instead; the
        // container itself only shrinks/fades on the way out.
        let targetScale = 1;
        let targetOpacity = 1;
        if (!reducedMotion && rect.top <= 0) {
          targetScale = 1 - exitProgress * 0.08;
          targetOpacity = 1 - exitProgress * 0.72;
        }

        let state = chapterState.get(heading);
        if (!state) {
          state = { scale: targetScale, opacity: targetOpacity };
          chapterState.set(heading, state);
        }

        if (reducedMotion) {
          state.scale = targetScale;
          state.opacity = targetOpacity;
        } else {
          state.scale = lerp(state.scale, targetScale, chapterSmoothing);
          state.opacity = lerp(state.opacity, targetOpacity, chapterSmoothing);
          if (
            Math.abs(state.scale - targetScale) > chapterSettleEpsilon
            || Math.abs(state.opacity - targetOpacity) > chapterSettleEpsilon
          ) {
            unsettled = true;
          }
        }

        const content = heading.nextElementSibling;
        const contentRect = content?.getBoundingClientRect();
        const contentProgress = reducedMotion || !contentRect
          ? 1
          : heading.classList.contains("experience-intro")
            ? clamp((exitProgress - 0.78) / 0.22, 0, 1)
            : clamp(
                (window.innerHeight * 0.96 - contentRect.top) / Math.max(window.innerHeight * 0.34, 1),
                0,
                1
              );

        setProgressIfChanged(heading, "--chapter-exit-progress", exitProgress.toFixed(4));
        setProgressIfChanged(heading, "--chapter-scale", state.scale.toFixed(4));
        setProgressIfChanged(heading, "--chapter-opacity", state.opacity.toFixed(4));
        setProgressIfChanged(content, "--chapter-content-progress", contentProgress.toFixed(4));
      }
    });

    if (unsettled) requestPaint();
  };

  let frame = null;
  const requestPaint = () => {
    if (frame !== null) return;
    frame = requestAnimationFrame(() => {
      frame = null;
      paint();
    });
  };

  window.addEventListener("scroll", requestPaint, { passive: true });
  window.addEventListener("resize", requestPaint);
  paint();
};

const initHeroLetterInteraction = () => {
  const gsap = window.gsap;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (!heroTitle) return;

  const letters = [];

  heroWords.forEach((word) => {
    if (word.dataset.lettersReady === "true") return;

    const fragment = document.createDocumentFragment();
    [...word.textContent].forEach((letter) => {
      const letterElement = document.createElement("span");
      letterElement.className = "hero-letter";
      letterElement.textContent = letter;
      letterElement.setAttribute("aria-hidden", "true");
      fragment.appendChild(letterElement);
      letters.push(letterElement);
    });

    word.textContent = "";
    word.appendChild(fragment);
    word.dataset.lettersReady = "true";
  });

  if (!gsap || reducedMotion || !canHover || isFigmaCaptureMode) return;

  const motions = letters.map((letter) => ({
    letter,
    x: gsap.quickTo(letter, "x", { duration: 0.65, ease: "elastic.out(1, 0.45)" }),
    y: gsap.quickTo(letter, "y", { duration: 0.65, ease: "elastic.out(1, 0.45)" }),
    rotation: gsap.quickTo(letter, "rotation", { duration: 0.65, ease: "elastic.out(1, 0.45)" }),
  }));

  const resetLetters = () => {
    if (!document.documentElement.classList.contains("hero-title-ready")) return;
    motions.forEach((motion) => {
      motion.x(0);
      motion.y(0);
      motion.rotation(0);
    });
  };

  let interactionFrame = null;
  let pointerX = 0;
  let pointerY = 0;

  window.addEventListener("pointermove", (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (interactionFrame !== null) return;

    interactionFrame = requestAnimationFrame(() => {
      interactionFrame = null;

      if (!document.documentElement.classList.contains("hero-title-ready")) return;

      const titleRect = heroTitle.getBoundingClientRect();
      const radius = Math.min(165, Math.max(125, window.innerWidth * 0.105));
      const isNearTitle = (
        pointerX >= titleRect.left - radius
        && pointerX <= titleRect.right + radius
        && pointerY >= titleRect.top - radius
        && pointerY <= titleRect.bottom + radius
      );

      if (!isNearTitle) {
        resetLetters();
        return;
      }

      motions.forEach((motion) => {
        const rect = motion.letter.getBoundingClientRect();
        const dx = rect.left + rect.width / 2 - pointerX;
        const dy = rect.top + rect.height / 2 - pointerY;
        const distance = Math.max(Math.hypot(dx, dy), 0.001);
        const strength = Math.max(0, 1 - distance / radius);
        const easedStrength = Math.pow(strength, 1.6);

        motion.x((dx / distance) * easedStrength * 42);
        motion.y((dy / distance) * easedStrength * 42);
        motion.rotation((dx / radius) * easedStrength * 10);
      });
    });
  }, { passive: true });

  heroTitle.addEventListener("pointerleave", resetLetters);
  window.addEventListener("blur", resetLetters);
};

const initContactLinkInteraction = () => {
  const gsap = window.gsap;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const links = [...document.querySelectorAll(".contact-links a")];
  if (!gsap || reducedMotion || !canHover || !links.length) return;

  links.forEach((link) => {
    const label = link.textContent.trim();
    const fragment = document.createDocumentFragment();
    const letters = [...label].map((character) => {
      const letter = document.createElement("span");
      letter.className = "contact-link-letter";
      letter.textContent = character === " " ? "\u00a0" : character;
      letter.setAttribute("aria-hidden", "true");
      fragment.appendChild(letter);
      return letter;
    });

    link.textContent = "";
    link.setAttribute("aria-label", label);
    link.appendChild(fragment);

    const motions = letters.map((letter) => ({
      letter,
      x: gsap.quickTo(letter, "x", { duration: 0.65, ease: "elastic.out(1, 0.45)" }),
      y: gsap.quickTo(letter, "y", { duration: 0.65, ease: "elastic.out(1, 0.45)" }),
      rotation: gsap.quickTo(letter, "rotation", { duration: 0.65, ease: "elastic.out(1, 0.45)" }),
    }));

    const resetLetters = () => {
      motions.forEach((motion) => {
        motion.x(0);
        motion.y(0);
        motion.rotation(0);
      });
    };

    link.addEventListener("pointermove", (event) => {
      const radius = 58;
      motions.forEach((motion) => {
        const rect = motion.letter.getBoundingClientRect();
        const dx = rect.left + rect.width / 2 - event.clientX;
        const dy = rect.top + rect.height / 2 - event.clientY;
        const distance = Math.max(Math.hypot(dx, dy), 0.001);
        const strength = Math.pow(Math.max(0, 1 - distance / radius), 1.6);
        motion.x((dx / distance) * strength * 15);
        motion.y((dy / distance) * strength * 15);
        motion.rotation((dx / radius) * strength * 7);
      });
    }, { passive: true });

    link.addEventListener("pointerleave", resetLetters);
    link.addEventListener("blur", resetLetters);
  });
};

const prepareTimelineWords = () => {
  const targets = document.querySelectorAll(
    ".experience-intro-text, .timeline-company, .timeline-role, .timeline-description, .timeline-date"
  );

  targets.forEach((target) => {
    if (target.dataset.wordsReady === "true") return;

    const segments = target.innerHTML.split(/<br\s*\/?>/i);
    target.textContent = "";
    segments.forEach((segment, segmentIndex) => {
      const text = segment.replace(/<[^>]+>/g, "").trim();
      text.split(/\s+/).filter(Boolean).forEach((word) => {
        const clip = document.createElement("span");
        const inner = document.createElement("span");
        clip.className = "timeline-word-clip";
        inner.className = "timeline-word";
        inner.textContent = word;
        clip.appendChild(inner);
        target.appendChild(clip);
      });
      if (segmentIndex < segments.length - 1) {
        target.appendChild(document.createElement("br"));
      }
    });
    target.dataset.wordsReady = "true";
  });

};

const updateExperienceTimeline = () => {
  if (!timelineShell || !timelineLine || !timelineProgress || !experienceItems.length) return;

  const viewportHeight = window.innerHeight;
  const contentRevealLine = viewportHeight * 0.72;
  const sectionRect = experienceSection?.getBoundingClientRect();
  const isTimelineVisible = Boolean(
    sectionRect
    && sectionRect.top < viewportHeight * 0.72
    && sectionRect.bottom > viewportHeight * 0.28
  );
  timelineAmbient?.classList.toggle("is-visible", isTimelineVisible);
  if (sectionRect && (sectionRect.bottom < -viewportHeight * 0.25 || sectionRect.top > viewportHeight * 1.25)) {
    return;
  }

  const ambientActivationLine = viewportHeight * 0.55;
  const isIntroAmbient = experienceItems[0].getBoundingClientRect().top > ambientActivationLine;
  if (isIntroAmbient && timelineAmbient && timelineAmbientYear) {
    if (activeTimelineAmbientIndex !== -2) {
      activeTimelineAmbientIndex = -2;
      setTimelineAmbientYear("2004");
      timelineAmbient.classList.remove("is-left");
      timelineAmbient.classList.remove("is-now");
      timelineAmbient.classList.add("is-center", "is-intro");
      timelineAmbient.classList.remove("is-changing");
      void timelineAmbient.offsetWidth;
      timelineAmbient.classList.add("is-changing");
    }
  } else {
    const nowAmbientItem = experienceItems.at(-1);
    const nowAmbientRect = nowAmbientItem?.getBoundingClientRect();
    const isNowStage = Boolean(
      nowAmbientRect
      && nowAmbientRect.top <= ambientActivationLine
      && nowAmbientRect.bottom > 0
    );
    let activeAmbientItem = isNowStage ? nowAmbientItem : experienceItems.find((item) => {
      const rect = item.getBoundingClientRect();
      return rect.top <= ambientActivationLine && rect.bottom > ambientActivationLine;
    });
    if (!activeAmbientItem) {
      activeAmbientItem = [...experienceItems].reverse().find((item) => {
        return item.getBoundingClientRect().top <= ambientActivationLine;
      }) || experienceItems[0];
    }
    const ambientIndex = experienceItems.indexOf(activeAmbientItem);
    if (
      ambientIndex >= 0
      && ambientIndex !== activeTimelineAmbientIndex
      && timelineAmbient
      && timelineAmbientYear
    ) {
      activeTimelineAmbientIndex = ambientIndex;
      const isNowChapter = activeAmbientItem.classList.contains("experience-now");
      timelineAmbient.classList.toggle("is-left", !isNowChapter && ambientIndex % 2 === 1);
      timelineAmbient.classList.remove("is-center");
      timelineAmbient.classList.toggle("is-now", isNowChapter);
      if (!isNowChapter) setTimelineAmbientYear(activeAmbientItem.dataset.timelineYear || "", true);
      timelineAmbient.classList.remove("is-intro");
      timelineAmbient.classList.remove("is-changing");
      void timelineAmbient.offsetWidth;
      timelineAmbient.classList.add("is-changing");
    }
  }

  const shellRect = timelineShell.getBoundingClientRect();
  const timelineEndMarker = timelineShell.querySelector(".experience-now .timeline-dot");
  const markerRect = timelineEndMarker?.getBoundingClientRect();
  const timelineEndY = markerRect
    ? Math.max(markerRect.top + markerRect.height / 2 - shellRect.top, 1)
    : Math.max(shellRect.height, 1);
  timelineShell.style.setProperty("--timeline-end-y", `${timelineEndY.toFixed(2)}px`);

  const timelineProgressValue = clamp(
    (viewportHeight * 0.65 - shellRect.top) / timelineEndY,
    0,
    1
  );

  timelineProgress.style.height = `${(timelineProgressValue * timelineEndY).toFixed(2)}px`;

  const introHeading = experienceSection?.querySelector(".experience-intro-text");
  if (introHeading) {
    const introRect = introHeading.getBoundingClientRect();
    if (introRect.top < contentRevealLine) {
      introHeading.classList.add("is-faded-in");
    }
  }

  experienceItems.forEach((item) => {
    const itemRect = item.getBoundingClientRect();
    const content = item.querySelector(".experience-content");
    const isNow = item.classList.contains("experience-now");

    if (itemRect.top < contentRevealLine) {
      content?.classList.add("is-faded-in");
    }

    if (isNow) {
      const nowScrollableDistance = Math.max(itemRect.height - viewportHeight, 1);
      const nowReveal = clamp(-itemRect.top / nowScrollableDistance, 0, 1);
      const nowRingFill = item.querySelector(".now-progress-ring-fill");
      item.classList.toggle("is-revealed", nowReveal > 0.02);
      item.classList.toggle("is-ring-started", nowReveal > 0.005);
      item.classList.toggle("is-ring-complete", nowReveal > 0.985);
      if (nowRingFill) {
        nowRingFill.style.strokeDashoffset = (100 - nowReveal * 100).toFixed(3);
      }

      return;
    }
  });
};

const paintHeroCardMotion = () => {
  const state = heroCardMotion.current;
  const root = document.documentElement;
  root.style.setProperty("--card-x", `${state.x.toFixed(3)}px`);
  root.style.setProperty("--card-y", `${state.y.toFixed(3)}px`);
  root.style.setProperty("--card-rotate", `${state.rotate.toFixed(3)}deg`);
  root.style.setProperty("--card-scale", state.scale.toFixed(4));
  root.style.setProperty("--card-opacity", clamp(state.opacity, 0, 1).toFixed(4));
  root.style.setProperty("--hero-meta-opacity", clamp(state.metaOpacity, 0, 1).toFixed(4));
};

const stepHeroCardMotion = (time) => {
  const motion = heroCardMotion;
  const elapsed = motion.lastTime ? Math.min((time - motion.lastTime) / 1000, 0.05) : 1 / 60;
  motion.lastTime = time;
  let remaining = elapsed;
  const fixedStep = 1 / 120;

  while (remaining > 0) {
    const dt = Math.min(fixedStep, remaining);
    Object.keys(motion.current).forEach((key) => {
      const displacement = motion.target[key] - motion.current[key];
      const acceleration = (
        heroCardSpring.stiffness * displacement - heroCardSpring.damping * motion.velocity[key]
      ) / heroCardSpring.mass;
      motion.velocity[key] += acceleration * dt;
      motion.current[key] += motion.velocity[key] * dt;
    });
    remaining -= dt;
  }

  paintHeroCardMotion();

  const isMoving = Object.keys(motion.current).some((key) => (
    Math.abs(motion.target[key] - motion.current[key]) > (key === "x" || key === "y" ? 0.02 : 0.0002)
    || Math.abs(motion.velocity[key]) > (key === "x" || key === "y" ? 0.02 : 0.0002)
  ));

  if (isMoving) {
    motion.frame = requestAnimationFrame(stepHeroCardMotion);
  } else {
    Object.assign(motion.current, motion.target);
    Object.keys(motion.velocity).forEach((key) => { motion.velocity[key] = 0; });
    paintHeroCardMotion();
    motion.frame = null;
    motion.lastTime = 0;
  }
};

const setHeroCardTarget = (nextTarget) => {
  const motion = heroCardMotion;
  Object.assign(motion.target, nextTarget);

  if (!motion.initialized || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    Object.assign(motion.current, motion.target);
    motion.initialized = true;
    paintHeroCardMotion();
    return;
  }

  if (motion.frame === null) {
    motion.lastTime = 0;
    motion.frame = requestAnimationFrame(stepHeroCardMotion);
  }
};

const updateHeroCard = () => {
  if (!hero || !intro || !heroTitle || !introHeading || !introCopy || !flipStack) return;

  const scrollY = window.scrollY;
  const compact = window.innerWidth <= 840;
  const cardWidth = compact ? 156 : 200;
  const cardHeight = compact ? 184 : 228;
  const copyRect = introCopy.getBoundingClientRect();
  const introTop = intro.offsetTop;
  const introTravelEnd = introTop;
  const dockStart = introTravelEnd;
  const travelStart = 0;
  const rawTravelProgress = clamp((scrollY - travelStart) / Math.max(introTravelEnd - travelStart, 1), 0, 1);
  const travelProgress = cubicBezierProgress(rawTravelProgress, 0.44, 0, 0.56, 1);
  const flipProgress = travelProgress;
  const heroMetaOpacity = 1 - clamp(scrollY / Math.max(introTop * 0.42, 1), 0, 1);

  const startX = window.innerWidth * 0.5;
  const portraitSlotRect = introPortraitSlot?.getBoundingClientRect();
  const introGapCenter = portraitSlotRect
    ? portraitSlotRect.left + portraitSlotRect.width * 0.5
    : window.innerWidth * 0.5;
  const heroDividerTop = window.innerHeight - (compact ? 48 : 80);
  const cardAboveDividerY = heroDividerTop - cardHeight;
  const startY = cardAboveDividerY;
  const heroEndY = cardAboveDividerY;
  const portraitDocumentTop = (portraitSlotRect?.top || copyRect.top) + scrollY;
  const portraitWidth = portraitSlotRect?.width || cardWidth;
  const copyDocumentTop = copyRect.top + scrollY;
  const dockCopyCenterY = copyDocumentTop - dockStart + copyRect.height * (compact ? 0.46 : 0.5);
  const dockScale = portraitWidth / Math.max(cardWidth, 1);
  const dockY = compact
    ? Math.min(
        window.innerHeight - (cardHeight * (1 + dockScale)) / 2 - 32,
        dockCopyCenterY - cardHeight / 2
      )
    : portraitDocumentTop - dockStart + (cardHeight * (dockScale - 1)) / 2;
  const introTargetY = dockY;
  const heroStageY = startY + (heroEndY - startY) * flipProgress;
  let y = heroStageY + (introTargetY - heroStageY) * travelProgress;
  let x = startX + (introGapCenter - startX) * travelProgress;
  let rotate = 180 - 180 * flipProgress;
  const startScale = compact ? 0.78 : 1;
  let scale = startScale + (dockScale - startScale) * flipProgress;

  if (scrollY >= dockStart) {
    document.documentElement.style.setProperty("--hero-meta-opacity", heroMetaOpacity.toFixed(4));
    if (!flipStack.classList.contains("is-docked")) {
      flipStack.classList.add("is-docked");
      introPortraitSlot.appendChild(flipStack);
    }
    startProfileTyping();
    heroCardDock = { x: introGapCenter, y: dockY, rotate: 0, scale: dockScale, compact };
    return;
  }

  if (flipStack.classList.contains("is-docked")) {
    flipStack.classList.remove("is-docked");
    document.body.insertBefore(flipStack, main);
    Object.assign(heroCardMotion.current, {
      x: introGapCenter,
      y: dockY,
      rotate: 0,
      scale: dockScale,
      opacity: 1,
    });
    Object.keys(heroCardMotion.velocity).forEach((key) => { heroCardMotion.velocity[key] = 0; });
  }

  setHeroCardTarget({ x, y, rotate, scale, opacity: 1, metaOpacity: heroMetaOpacity });
};

const updateCreamExitCurve = () => {
  if (!creamProjectsSection) return;

  const rect = creamProjectsSection.getBoundingClientRect();
  if (rect.bottom < -window.innerHeight || rect.top > window.innerHeight * 2) return;

  const reference = [
    { top: 1160, height: 56 },
    { top: 940, height: 50 },
    { top: 640, height: 36 },
    { top: 320, height: 22 },
    { top: 80, height: 14 },
    { top: -160, height: 10 },
  ];
  let height = reference[reference.length - 1].height;

  if (rect.top >= reference[0].top) {
    height = reference[0].height;
  } else {
    for (let index = 0; index < reference.length - 1; index += 1) {
      const current = reference[index];
      const next = reference[index + 1];

      if (rect.top <= current.top && rect.top >= next.top) {
        const progress = (current.top - rect.top) / (current.top - next.top);
        height = current.height + (next.height - current.height) * progress;
        break;
      }
    }
  }

  creamProjectsSection.style.setProperty("--cream-curve-height", `${height.toFixed(2)}vw`);
};

const updateAboutRevealText = () => {
  if (!revealContentSection || !aboutRevealItems.length) return;

  const rect = revealContentSection.getBoundingClientRect();
  if (rect.bottom < -window.innerHeight * 0.25 || rect.top > window.innerHeight * 1.25) return;

  const scrollable = Math.max(rect.height - window.innerHeight, 1);
  const progress = clamp(-rect.top / scrollable, 0, 1);

  aboutRevealItems.forEach((item, index) => {
    const start = index / (aboutRevealItems.length * 1.28);
    const itemProgress = clamp((progress - start) * aboutRevealItems.length * 1.08, 0, 1);

    if (item.classList.contains("about-text-image")) {
      const scale = itemProgress * 1.5;
      const wobbleEnvelope = 1 - itemProgress;
      const wobbleX = Math.sin(itemProgress * Math.PI * 5) * wobbleEnvelope * 9;
      const wobbleY = -Math.abs(Math.sin(itemProgress * Math.PI * 3)) * wobbleEnvelope * 5;
      const wobbleRotate = Math.sin(itemProgress * Math.PI * 6) * wobbleEnvelope * 9;
      item.style.setProperty("--icon-opacity", itemProgress.toFixed(3));
      item.style.setProperty("--icon-scale", scale.toFixed(3));
      item.style.setProperty("--icon-wobble-x", `${wobbleX.toFixed(3)}px`);
      item.style.setProperty("--icon-wobble-y", `${wobbleY.toFixed(3)}px`);
      item.style.setProperty("--icon-wobble-rotate", `${wobbleRotate.toFixed(3)}deg`);
    } else {
      const opacity = 0.5 + itemProgress * 0.5;
      item.style.setProperty("--word-opacity", opacity.toFixed(3));
    }
  });
};

const updateSpiralNavState = () => {
  const darkSections = [toolContentSection, experienceSection].filter(Boolean);
  if (!darkSections.length) return;

  const isActive = darkSections.some((section) => {
    const rect = section.getBoundingClientRect();
    return rect.top < window.innerHeight * 0.36 && rect.bottom > window.innerHeight * 0.36;
  });
  document.body.classList.toggle("is-spiral-active", isActive);
};

const updateContactNavState = () => {
  if (!creamProjectsSection) return;

  const rect = creamProjectsSection.getBoundingClientRect();
  const isInContact = rect.top < window.innerHeight * 0.36;
  document.body.classList.toggle("is-contact-active", isInContact);
};

const updateDarkRevealCurve = () => {
  if (!toolContentSection) return;

  const rect = toolContentSection.getBoundingClientRect();
  if (rect.bottom < -window.innerHeight || rect.top > window.innerHeight * 2) return;

  const reference = [
    { top: 1160, height: 10 },
    { top: 940, height: 16 },
    { top: 640, height: 30 },
    { top: 320, height: 44 },
    { top: 80, height: 52 },
    { top: -160, height: 56 },
  ];
  let height = reference[reference.length - 1].height;

  if (rect.top >= reference[0].top) {
    height = reference[0].height;
  } else {
    for (let index = 0; index < reference.length - 1; index += 1) {
      const current = reference[index];
      const next = reference[index + 1];

      if (rect.top <= current.top && rect.top >= next.top) {
        const progress = (current.top - rect.top) / (current.top - next.top);
        height = current.height + (next.height - current.height) * progress;
        break;
      }
    }
  }

  toolContentSection.style.setProperty("--curve-height", `${height.toFixed(2)}vw`);
};

const CONTACT_REVEAL_OFFSET = 56;

const updateContactReveal = () => {
  if (!contactSection || !contactRevealGroups.length) return;

  const sectionRect = contactSection.getBoundingClientRect();
  if (sectionRect.top > window.innerHeight * 1.25) return;

  const revealLine = window.innerHeight * 0.98;
  contactRevealGroups.forEach((group) => {
    const isRevealed = group.every((el) => {
      const restingTop = el.classList.contains("is-revealed")
        ? el.getBoundingClientRect().top
        : el.getBoundingClientRect().top - CONTACT_REVEAL_OFFSET;
      return restingTop < revealLine;
    });
    if (isRevealed) group.forEach((el) => el.classList.add("is-revealed"));
  });
};

const setNavSectionTitle = (title, direction) => {
  title = "Haesoo";
  if (!title || !navTitleCurrent || !navTitleNext || title === activeNavTitle) return;

  if (navTitleTimeline) {
    const runningTimeline = navTitleTimeline;
    runningTimeline.progress(1);
    runningTimeline.kill();
    navTitleTimeline = null;
  }

  const gsap = window.gsap;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  activeNavTitle = title;

  if (!gsap || reducedMotion) {
    navTitleCurrent.textContent = title;
    navTitleNext.textContent = "";
    return;
  }

  const offset = direction >= 0 ? 100 : -100;
  navTitleNext.textContent = title;
  gsap.set(navTitleNext, { yPercent: offset, opacity: 1 });

  navTitleTimeline = gsap.timeline({
    onComplete: () => {
      navTitleCurrent.textContent = title;
      gsap.set(navTitleCurrent, { yPercent: 0, opacity: 1 });
      gsap.set(navTitleNext, { yPercent: offset, opacity: 1 });
      navTitleNext.textContent = "";
      navTitleTimeline = null;
    },
  });

  navTitleTimeline
    .to(navTitleCurrent, { yPercent: -offset, duration: 0.38, ease: "power3.inOut" }, 0)
    .to(navTitleNext, { yPercent: 0, duration: 0.38, ease: "power3.inOut" }, 0);
};

const updateNavSectionTitle = () => {
  if (!navTitleSections.length) return;

  const activationLine = window.innerHeight * 0.36;
  const direction = window.scrollY >= previousNavScrollY ? 1 : -1;
  const heroFlipTitleThreshold = Math.max((intro?.offsetTop || window.innerHeight) * 0.05, 48);
  const projectStart = projectShowcaseSection?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY;

  if (window.scrollY <= heroFlipTitleThreshold) {
    setNavSectionTitle("Haesoo", direction);
    previousNavScrollY = window.scrollY;
    return;
  }

  if (projectStart > activationLine) {
    setNavSectionTitle("About Me", direction);
    previousNavScrollY = window.scrollY;
    return;
  }

  let activeSection = navTitleSections.find((section) => {
    const rect = section.getBoundingClientRect();
    return rect.top <= activationLine && rect.bottom > activationLine;
  });

  if (!activeSection) {
    activeSection = [...navTitleSections].reverse().find((section) => {
      return section.getBoundingClientRect().top <= activationLine;
    });
  }

  const title = activeSection?.dataset.navTitle;
  setNavSectionTitle(title, direction);
  previousNavScrollY = window.scrollY;
};

const updateSectionCaption = () => {
  if (!sectionCaption || !sectionCaptionIndex || !sectionCaptionText || !sectionCaptionSections.length) return;

  const activationLine = window.innerHeight * 0.62;
  const firstSectionRect = sectionCaptionSections[0].getBoundingClientRect();
  const lastSectionRect = sectionCaptionSections[sectionCaptionSections.length - 1].getBoundingClientRect();

  if (firstSectionRect.top > activationLine || lastSectionRect.bottom <= activationLine) {
    sectionCaption.classList.remove("is-visible", "is-on-dark");
    sectionCaption.setAttribute("aria-hidden", "true");
    activeCaptionSection = null;
    return;
  }

  let activeSection = sectionCaptionSections.find((section) => {
    const rect = section.getBoundingClientRect();
    return rect.top <= activationLine && rect.bottom > activationLine;
  });

  if (!activeSection) {
    activeSection = [...sectionCaptionSections].reverse().find((section) => {
      return section.getBoundingClientRect().top <= activationLine;
    });
  }

  if (!activeSection) return;

  if (activeSection.hasAttribute("data-section-caption-hidden")) {
    sectionCaption.classList.remove("is-visible", "is-on-dark", "is-stacked");
    sectionCaption.setAttribute("aria-hidden", "true");
    activeCaptionSection = activeSection;
    return;
  }

  if (activeSection === activeCaptionSection) return;
  activeCaptionSection = activeSection;
  sectionCaptionIndex.textContent = activeSection.dataset.sectionIndex || "";
  sectionCaptionText.textContent = activeSection.dataset.sectionCaption || "";
  sectionCaption.classList.toggle(
    "is-on-dark",
    activeSection.matches(".dark-reveal, .experience-section")
  );
  sectionCaption.classList.toggle("is-hero", activeSection.matches(".hero"));
  sectionCaption.classList.toggle("is-stacked", activeSection.matches(".spiral-section"));
  sectionCaption.classList.remove("is-changing");
  void sectionCaption.offsetWidth;
  sectionCaption.classList.add("is-visible", "is-changing");
  sectionCaption.setAttribute("aria-hidden", "false");
};

const initSpiralExperience = async () => {
  if (!spiralCanvas || !spiralStage || !spiralProjectData.length || spiralExperience || spiralInitializing) return;
  spiralInitializing = true;

  try {
    const THREE = await import("./assets/vendor/three.module.min.js");
    const gsap = window.gsap;
    const imageSources = spiralProjectData.map((project) => project.thumbnail);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(window.innerWidth < 900 ? 45 : 35, 1, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ canvas: spiralCanvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    const textureLoader = new THREE.TextureLoader();
    const textures = await Promise.all(imageSources.map((source) => textureLoader.loadAsync(source)));
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const geometry = new THREE.PlaneGeometry(1, 1, 8, 8);
    const vertexShader = `
      varying vec2 vUv;
      #define PI 3.14159265359
      uniform float uScrollSpeed;
      uniform float uFocusProgress;

      void main() {
        vec3 worldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
        vec3 newPosition = position;
        float distortion = 1.0 - uFocusProgress;
        newPosition.z = sin(uv.x * PI) * 0.2 * distortion;
        vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
        vec4 viewPosition = viewMatrix * modelPosition;
        viewPosition.x += pow(worldPosition.y, 2.0) * 0.1 * distortion;
        viewPosition.x += sin(uv.y * PI) * uScrollSpeed * 2.0 * distortion;
        gl_Position = projectionMatrix * viewPosition;
        vUv = uv;
      }
    `;
    const fragmentShader = `
      uniform sampler2D uTexture;
      uniform vec2 uPlaneSizes;
      uniform vec2 uImageSizes;
      uniform float uFocusProgress;
      uniform float uOpacity;
      uniform float uHoverDim;
      varying vec2 vUv;

      float roundedRectSDF(vec2 uv, vec2 size, float radius) {
        vec2 d = abs(uv - 0.5) - size * 0.5 + radius;
        return length(max(d, 0.0)) - radius;
      }

      void main() {
        vec2 ratio = vec2(
          min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
          min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
        );
        vec2 uv = vec2(
          vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
          vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
        );
        float hoverZoom = mix(1.0, 1.09, uHoverDim);
        uv = (uv - 0.5) / hoverZoom + 0.5;
        vec4 color = texture2D(uTexture, uv);
        float cornerRadius = mix(0.05, 0.025, uFocusProgress);
        float sdf = roundedRectSDF(vUv, vec2(1.0), cornerRadius);
        float alpha = 1.0 - smoothstep(0.0, 0.002, sdf);
        vec3 overlayColor = mix(color.rgb, color.rgb * 0.42, uHoverDim);
        gl_FragColor = vec4(overlayColor, alpha * uOpacity);
      }
    `;

    // Keep the complete spiral inside the stage, including its lowest cards.
    camera.position.set(0, 0, 8.75);
    renderer.setClearColor(0xfaf7f3, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    textures.forEach((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
    });

    const repeatedTextures = [...textures, ...textures];
    const planes = repeatedTextures.map((texture, index) => {
      const image = texture.image;
      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTexture: { value: texture },
          uPlaneSizes: { value: new THREE.Vector2(1.7, 1) },
          uImageSizes: { value: new THREE.Vector2(image.width, image.height) },
          uScrollSpeed: { value: 0 },
          uFocusProgress: { value: 0 },
          uOpacity: { value: 1 },
          uHoverDim: { value: 0 },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const plane = new THREE.Mesh(geometry, material);
      plane.scale.set(1.7, 1, 1);
      plane.userData.projectId = spiralProjectData[index % spiralProjectData.length].id;
      plane.renderOrder = index;
      scene.add(plane);
      return plane;
    });

    let currentOffset = 0;
    let previousOffset = 0;
    let overlayMode = "spiral";
    let isTransitioning = false;
    let hoveredPlane = null;
    let pointerDown = null;
    let suppressNextClick = false;
    let renderFrameId = null;
    let renderLoopRunning = false;
    let spiralInView = isFigmaCaptureMode;
    let spiralScrollStart = 0;
    let spiralScrollDistance = 1;
    const mobileQuery = window.matchMedia("(max-width: 768px)");

    spiralProjectData.forEach((project) => {
      const image = new Image();
      image.src = project.thumbnail;
    });

    const getProjectedPlaneRect = (plane) => {
      const canvasRect = spiralCanvas.getBoundingClientRect();
      plane.updateMatrixWorld(true);
      const corners = [
        new THREE.Vector3(-0.5, -0.5, 0),
        new THREE.Vector3(0.5, -0.5, 0),
        new THREE.Vector3(0.5, 0.5, 0),
        new THREE.Vector3(-0.5, 0.5, 0),
      ].map((corner) => {
        const projected = corner.applyMatrix4(plane.matrixWorld).project(camera);
        return {
          x: canvasRect.left + (projected.x + 1) * 0.5 * canvasRect.width,
          y: canvasRect.top + (1 - projected.y) * 0.5 * canvasRect.height,
        };
      });
      const center = corners.reduce((point, corner) => ({
        x: point.x + corner.x / corners.length,
        y: point.y + corner.y / corners.length,
      }), { x: 0, y: 0 });
      const width = Math.max(Math.hypot(corners[1].x - corners[0].x, corners[1].y - corners[0].y), 1);
      const height = Math.max(Math.hypot(corners[3].x - corners[0].x, corners[3].y - corners[0].y), 1);

      const radiusRatio = THREE.MathUtils.lerp(
        0.05,
        0.025,
        plane.material.uniforms.uFocusProgress.value
      );

      return {
        left: center.x - width * 0.5,
        top: center.y - height * 0.5,
        width,
        height,
        angle: THREE.MathUtils.radToDeg(Math.atan2(corners[1].y - corners[0].y, corners[1].x - corners[0].x)),
        borderRadius: Math.min(18, height * radiusRatio),
      };
    };

    const raycastPlane = (event) => {
      const rect = spiralCanvas.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / Math.max(rect.height, 1)) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      return raycaster.intersectObjects(planes, false)[0]?.object || null;
    };

    const getCenterPlane = () => {
      return planes.reduce((largest, plane) => {
        const rect = getProjectedPlaneRect(plane);
        const visibleOpacity = plane.material.uniforms.uOpacity.value;
        const area = rect.width * rect.height * visibleOpacity;
        return !largest || area > largest.area ? { plane, area } : largest;
      }, null)?.plane || null;
    };

    const getInteractivePlane = (event) => {
      const centerPlane = getCenterPlane();
      if (!centerPlane) return null;
      const rect = spiralCanvas.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / Math.max(rect.height, 1)) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      return raycaster.intersectObject(centerPlane, false).length ? centerPlane : null;
    };

    const setHoveredPlane = (nextPlane) => {
      if (hoveredPlane === nextPlane) return;
      const previousPlane = hoveredPlane;
      hoveredPlane = nextPlane;
      [
        { plane: previousPlane, value: 0 },
        { plane: hoveredPlane, value: 1 },
      ].forEach(({ plane, value }) => {
        const hoverUniform = plane?.material.uniforms.uHoverDim;
        if (!hoverUniform) return;
        gsap.killTweensOf(hoverUniform);
        gsap.to(hoverUniform, {
          value,
          duration: 0.28,
          ease: "power2.out",
          onUpdate: () => renderer.render(scene, camera),
        });
      });
    };

    const updateProjectCta = (plane, event) => {
      if (!spiralProjectCta || !plane) {
        spiralProjectCta?.classList.remove("is-visible");
        return;
      }
      spiralProjectCta.style.left = `${event.clientX}px`;
      spiralProjectCta.style.top = `${event.clientY}px`;
      spiralProjectCta.classList.add("is-visible");
    };

    const visitProject = (plane) => {
      if (!plane) return;
      const project = spiralProjectData.find((item) => item.id === plane.userData.projectId);
      if (!project?.cta_url || project.cta_url === "#") return;
      window.open(project.cta_url, "_blank", "noopener,noreferrer");
    };

    const resize = () => {
      const width = spiralStage.clientWidth;
      const height = spiralStage.clientHeight;
      const scrollShell = spiralScrollShell || spiralSection;
      const shellRect = scrollShell.getBoundingClientRect();
      camera.aspect = width / Math.max(height, 1);
      camera.fov = width < 900 ? 45 : 35;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setSize(width, height, false);
      spiralScrollStart = window.scrollY + shellRect.top;
      spiralScrollDistance = Math.max(scrollShell.offsetHeight - window.innerHeight, 1);
    };

    let closestPlane = null;
    let activeCaptionId = null;

    // Fills the otherwise-empty flanks of the spiral with the number/title
    // of whichever card is currently front-and-center, crossfading between
    // projects instead of scrolling continuously alongside the spiral.
    const updateActiveCaption = (plane) => {
      const projectId = plane?.userData.projectId ?? null;
      if (projectId === activeCaptionId) return;
      activeCaptionId = projectId;
      if (!spiralCaptionIndex || !spiralCaptionTitle) return;

      const project = spiralProjectData.find((item) => item.id === projectId);
      spiralCaptionIndex.classList.remove("is-visible");
      spiralCaptionTitle.classList.remove("is-visible");
      if (!project) return;

      window.setTimeout(() => {
        if (activeCaptionId !== projectId) return;
        const projectPosition = spiralProjectData.findIndex((item) => item.id === projectId) + 1;
        spiralCaptionIndex.textContent = `${String(projectPosition).padStart(2, "0")} / ${String(spiralProjectData.length).padStart(2, "0")}`;
        spiralCaptionTitle.textContent = project.title;
        spiralCaptionIndex.classList.add("is-visible");
        spiralCaptionTitle.classList.add("is-visible");
      }, 220);
    };

    const render = () => {
      if (!renderLoopRunning) return;
      const progress = clamp((window.scrollY - spiralScrollStart) / spiralScrollDistance, 0, 1);
      // Ring geometry needs enough planes (repeated textures) to look like a
      // complete loop, but the scroll itself should only travel one lap of
      // the *unique* projects — otherwise a single top-to-bottom scroll
      // shows every project twice.
      const targetOffset = progress * spiralProjectData.length;
      currentOffset = lerp(currentOffset, targetOffset, 0.1);
      if (Math.abs(targetOffset - currentOffset) < 0.0005) currentOffset = targetOffset;
      const scrollSpeed = currentOffset - previousOffset;
      previousOffset = currentOffset;
      const centerIndex = Math.floor(planes.length / 2);
      const fadeRange = 1.65;
      let closestDistance = Infinity;

      planes.forEach((plane, index) => {
        let normalizedIndex = index - currentOffset;
        normalizedIndex = ((normalizedIndex % planes.length) + planes.length) % planes.length;
        const relativeIndex = normalizedIndex - centerIndex;
        const edgeDistance = centerIndex - Math.abs(relativeIndex);
        const fadeProgress = clamp(edgeDistance / fadeRange, 0, 1);
        const edgeOpacity = fadeProgress * fadeProgress * (3 - 2 * fadeProgress);
        const angle = relativeIndex * 0.85;
        plane.position.set(Math.cos(angle) * 2, relativeIndex * 0.5 - 0.8, Math.sin(angle) * 2);
        plane.rotation.y = -angle + Math.PI / 2;
        plane.renderOrder = Math.round((plane.position.z + 3) * 1000) + index;
        plane.material.uniforms.uScrollSpeed.value = scrollSpeed;
        plane.material.uniforms.uOpacity.value = edgeOpacity;
        if (Math.abs(relativeIndex) < closestDistance) {
          closestDistance = Math.abs(relativeIndex);
          closestPlane = plane;
        }
      });

      updateActiveCaption(closestPlane);
      renderer.render(scene, camera);
      if (Math.abs(targetOffset - currentOffset) > 0.0005 || Math.abs(scrollSpeed) > 0.0001) {
        renderFrameId = requestAnimationFrame(render);
      } else {
        renderLoopRunning = false;
        renderFrameId = null;
      }
    };

    const startSpiralLoop = () => {
      if (renderLoopRunning) return;
      renderLoopRunning = true;
      render();
    };

    const stopSpiralLoop = () => {
      if (!renderLoopRunning) return;
      renderLoopRunning = false;
      if (renderFrameId !== null) cancelAnimationFrame(renderFrameId);
      renderFrameId = null;
    };

    const syncSpiralLoop = () => {
      const shouldRun = spiralInView && overlayMode === "spiral" && !isTransitioning;
      if (shouldRun) startSpiralLoop();
      else stopSpiralLoop();
    };

    spiralCanvas.addEventListener("pointerdown", (event) => {
      if (mobileQuery.matches || overlayMode !== "spiral") return;
      pointerDown = { x: event.clientX, y: event.clientY };
      suppressNextClick = false;
      spiralCanvas.setPointerCapture?.(event.pointerId);
    });

    spiralCanvas.addEventListener("pointerup", (event) => {
      if (!pointerDown || mobileQuery.matches || overlayMode !== "spiral" || isTransitioning) return;
      const distance = Math.hypot(event.clientX - pointerDown.x, event.clientY - pointerDown.y);
      pointerDown = null;
      if (spiralCanvas.hasPointerCapture?.(event.pointerId)) spiralCanvas.releasePointerCapture(event.pointerId);
      suppressNextClick = distance >= 5;
      if (suppressNextClick) return;
      visitProject(getInteractivePlane(event));
    });

    spiralCanvas.addEventListener("pointercancel", (event) => {
      pointerDown = null;
      suppressNextClick = true;
      if (spiralCanvas.hasPointerCapture?.(event.pointerId)) spiralCanvas.releasePointerCapture(event.pointerId);
    });

    spiralCanvas.addEventListener("click", (event) => {
      if (suppressNextClick) {
        suppressNextClick = false;
        return;
      }
      if (event.detail === 0 || mobileQuery.matches || overlayMode !== "spiral" || isTransitioning) return;
      visitProject(getInteractivePlane(event));
    });

    spiralCanvas.addEventListener("pointermove", (event) => {
      if (mobileQuery.matches || overlayMode !== "spiral") return;
      setHoveredPlane(getInteractivePlane(event));
      spiralCanvas.classList.toggle("is-project-hover", Boolean(hoveredPlane));
      updateProjectCta(hoveredPlane, event);
    });

    spiralCanvas.addEventListener("pointerleave", () => {
      pointerDown = null;
      setHoveredPlane(null);
      spiralCanvas.classList.remove("is-project-hover");
      updateProjectCta(null);
    });

    spiralCanvas.addEventListener("keydown", (event) => {
      if (mobileQuery.matches || overlayMode !== "spiral" || !["Enter", " "].includes(event.key)) return;
      event.preventDefault();
      visitProject(hoveredPlane || getCenterPlane());
    });

    resize();
    window.addEventListener("resize", resize);
    if (isFigmaCaptureMode) {
      startSpiralLoop();
    } else {
      const spiralVisibilityTarget = spiralScrollShell || spiralSection || spiralStage;
      const spiralVisibilityObserver = new IntersectionObserver(
        ([entry]) => {
          spiralInView = entry.isIntersecting;
          spiralScrollShell?.classList.toggle("is-scroll-animating", entry.isIntersecting);
          syncSpiralLoop();
        },
        { rootMargin: "35% 0px", threshold: 0 }
      );
      spiralVisibilityObserver.observe(spiralVisibilityTarget);
    }
    window.addEventListener("scroll", syncSpiralLoop, { passive: true });

    spiralExperience = {
      renderer,
      scene,
      camera,
      planes,
      resize,
    };
    if (!gsap) console.error("GSAP failed to initialize; project expansion is unavailable.");
  } catch (error) {
    console.error("Spiral WebGL failed to initialize", error);
  } finally {
    spiralInitializing = false;
  }
};

const requestHeroCardUpdate = () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    updateHeroCard();
    updateCreamExitCurve();
    updateAboutRevealText();
    updateSpiralNavState();
    updateDarkRevealCurve();
    updateContactNavState();
    updateContactReveal();
    updateNavSectionTitle();
    updateSectionCaption();
    updateExperienceTimeline();
    ticking = false;
  });
};

let cursorFrame = null;
let cursorX = 0;
let cursorY = 0;
window.addEventListener("pointermove", (event) => {
  if (!cursor) return;
  cursorX = event.clientX;
  cursorY = event.clientY;
  if (cursorFrame !== null) return;

  cursorFrame = requestAnimationFrame(() => {
    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
    if (cursorHint) {
      cursorHint.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(20px, 20px)`;
    }
    cursorFrame = null;
  });
});

if (cursorHint && revealContentSection && revealTranslationLines.length) {
  let overRevealLine = false;

  revealContentSection.addEventListener("pointerenter", () => {
    cursorHint.textContent = "Hover to translate !";
    if (!overRevealLine) cursorHint.classList.add("is-visible");
  });
  revealContentSection.addEventListener("pointerleave", () => {
    cursorHint.classList.remove("is-visible");
  });

  revealTranslationLines.forEach((line) => {
    line.addEventListener("pointerenter", () => {
      overRevealLine = true;
      cursorHint.classList.remove("is-visible");
    });
    line.addEventListener("pointerleave", () => {
      overRevealLine = false;
      cursorHint.classList.add("is-visible");
    });
  });
}

const timelineShellHoverArea = document.querySelector(".timeline-shell");
const timelinePhotos = document.querySelectorAll(".timeline-photo");
if (cursorHint && timelineShellHoverArea) {
  timelineShellHoverArea.addEventListener("pointerenter", () => {
    cursorHint.textContent = "Hover image !";
    cursorHint.classList.add("is-visible");
  });
  timelineShellHoverArea.addEventListener("pointerleave", () => {
    cursorHint.classList.remove("is-visible");
  });
}
if (cursorHint && timelinePhotos.length) {
  timelinePhotos.forEach((photo) => {
    photo.addEventListener("pointerenter", () => {
      cursorHint.classList.remove("is-visible");
    });
    photo.addEventListener("pointerleave", () => {
      if (timelineShellHoverArea?.matches(":hover")) {
        cursorHint.classList.add("is-visible");
      }
    });
  });
}

window.addEventListener("scroll", requestHeroCardUpdate, { passive: true });
window.addEventListener("resize", () => {
  heroCardDock = null;
  requestHeroCardUpdate();
});
prepareProfileTyping();
initCodeSectionTitles();
updateHeroCard();
initHeroLetterInteraction();
initContactLinkInteraction();
initLandingEntrance();
updateCreamExitCurve();
updateAboutRevealText();
updateSpiralNavState();
updateDarkRevealCurve();
updateContactNavState();
updateContactReveal();
updateNavSectionTitle();
updateSectionCaption();
prepareTimelineWords();
updateExperienceTimeline();
if (isFigmaCaptureMode) {
  initSpiralExperience();
} else if (spiralSection && "IntersectionObserver" in window) {
  const spiralInitObserver = new IntersectionObserver(
    (entries, observer) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      initSpiralExperience();
    },
    { rootMargin: "1200px 0px", threshold: 0 }
  );
  spiralInitObserver.observe(spiralSection);
} else {
  initSpiralExperience();
}

document.querySelectorAll("a, button, .flip-card").forEach((element) => {
  element.addEventListener("pointerenter", () => cursor?.classList.add("is-active"));
  element.addEventListener("pointerleave", () => cursor?.classList.remove("is-active"));
});

const revealTargets = document.querySelectorAll(".intro, .dark-reveal, .experience-section, .works, .contact");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-inview");
    });
  },
  { threshold: 0.16 }
);

revealTargets.forEach((target) => observer.observe(target));

const playgroundProjects = [
  {
    variant: "aqua",
    captionTitle: "AQUA PLANET",
    captionText: "AN IMMERSIVE AQUARIUM EXPERIENCE, BUILT FOR THE WEB.",
    image: "assets/project1/figma/project-left.webp",
    title: "K브랜드 웹사이트 리뉴얼 팀프로젝트",
    brand: "aqua planet",
    logos: ["assets/project1/logos/aqua.svg", "assets/project1/logos/planet.svg"],
    duration: "2026.06.04 - 2026.07.03",
    built: "랜딩·마린랩·티켓 페이지 개발을 맡고, 전 페이지가 공유하는 인터랙션 시스템을 설계했습니다",
    description: "이 프로젝트에서 프론트엔드 개발자로서 랜딩, 마린랩, 티켓 예매 페이지 구현을 담당했습니다. Three.js 기반 3D 크루 캐러셀과 커스텀 커서, GNB, 버블 인터랙션 등 공통 컴포넌트를 설계하고 성능·QA 작업과 배포까지 완료했습니다.",
    contribution: "기획 60%　디자인 70%　개발 90%",
    website: "https://ezen-aquaplanet-project.vercel.app/",
    proposal: "https://www.figma.com/proto/RNZVS2U4p1upluVvq78tTL/personal?page-id=237%3A398&node-id=237-1640&viewport=612%2C783%2C0.08&t=Y3y3Dgch0k1oZkVg-1&scaling=min-zoom&content-scaling=fixed",
  },
  {
    variant: "layer",
    captionTitle: "LAYER",
    captionText: "A SCENT COMMUNITY WHERE TASTE BECOMES CONVERSATION.",
    image: "assets/project1/figma/project-center.webp",
    title: "AI 챗봇 커뮤니티 프로젝트",
    brand: "Layer",
    logos: ["assets/project1/logos/layer.svg"],
    duration: "2026.07.04 - 2026.07.29",
    built: "온보딩과 홈을 메인으로 개발하고, 앱 전반의 기능 구현과 더미데이터 설계를 담당했습니다",
    description: "React와 Tailwind CSS를 기반으로 앱 전반의 기능을 구현했고, 향수·브랜드·챌린지·매장 서비스의 더미데이터 설계, 이미지 AVIF 변환을 통한 성능 최적화, PC 프레임과 스타일 가이드 제작까지 담당했습니다.",
    contribution: "기획 70%　디자인 70%　개발 90%",
    website: "https://ezen-layerproject.vercel.app/",
    proposal: "https://www.figma.com/proto/RNZVS2U4p1upluVvq78tTL/personal?page-id=237%3A5040&node-id=237-5053&viewport=690%2C571%2C0.03&t=DIbfmwmD9cwUu7El-1&scaling=min-zoom&content-scaling=fixed",
  },
  {
    variant: "moa",
    captionTitle: "MOA",
    captionText: "A FRIENDLY GUIDE FOR BETTER EVERYDAY CHOICES.",
    image: "assets/project1/figma/project-right.webp",
    title: "선택을 돕는 질문형 결정 도우미 앱",
    brand: "모아",
    logos: ["assets/project1/logos/moa.svg"],
    duration: "2026.03.26 - 2026.05.29",
    built: "사용자가 스스로 기준을 찾도록, UX 설계부터 디자인·개발까지 전 과정을 직접 담당했습니다",
    description: "질문에 답하며 스스로 선택 기준을 찾는 서비스를 기획했습니다. 캐릭터와 파스텔 컬러로 친근하게 디자인하고 React와 Vite로 전체 서비스를 개발했으며, PWA 대응과 모바일 뷰포트 최적화까지 1인으로 진행했습니다.",
    contribution: "기획 100%　디자인 100%　개발 100%",
    website: "https://moa-app-indol.vercel.app/",
    proposal: "https://www.figma.com/proto/IYUwIKFuLk3G0BmvlsoH9h/%EC%B5%9C%ED%95%B4%EC%88%98-%EB%AA%A8%EC%95%84?page-id=1159%3A1255&node-id=1159-2682&viewport=1063%2C1162%2C0.03&t=5qcWExPYTwMcfkE4-1&scaling=contain&content-scaling=fixed&starting-point-node-id=1159%3A2682",
  },
];

// Small alternating jitter so the row reads as a hand-pinned strip of photos rather than a rigid grid.
const playgroundRotations = [-4, 2, -3, 5, 1, -4, 3, -2, 0, 4, -2, 3];

const initPlaygroundScroll = () => {
  const track = document.querySelector("#playground-scroll");
  const camera = document.querySelector("#playground-camera");
  const row = document.querySelector("#playground-row");
  if (!track || !camera || !row) return;

  if (cursorHint) {
    camera.addEventListener("pointerenter", () => {
      cursorHint.textContent = "Click!";
      cursorHint.classList.add("is-visible");
    });
    camera.addEventListener("pointerleave", () => {
      cursorHint.classList.remove("is-visible");
    });
  }

  const cardCount = playgroundProjects.length;
  for (let index = 0; index < cardCount; index += 1) {
    const project = playgroundProjects[index % playgroundProjects.length];
    const card = document.createElement("article");
    card.className = "playground-card";
    card.dataset.detailCard = "true";
    card.dataset.projectIndex = String(index % playgroundProjects.length);
    card.dataset.characterVariant = project.variant;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `${project.title} 카드 앞면 보기`);
    card.tabIndex = -1;
    card.dataset.baseRotation = String(playgroundRotations[index % playgroundRotations.length]);
    card.style.setProperty("--playground-rotate", `${playgroundRotations[index % playgroundRotations.length]}deg`);
    card.style.setProperty("--playground-current-rotate", `${playgroundRotations[index % playgroundRotations.length]}deg`);

    const inner = document.createElement("div");
    inner.className = "playground-card-inner";

    const front = document.createElement("div");
    front.className = "playground-card-face playground-card-front";

    const img = document.createElement("img");
    img.src = project.image;
    img.alt = `${project.title} 프로젝트 이미지`;
    img.loading = "lazy";
    img.decoding = "async";

    const back = document.createElement("div");
    back.className = `playground-card-face playground-card-back playground-card-back--${project.variant}`;
    back.setAttribute("aria-hidden", "true");
    const logoMarkup = project.logos
      .map((logo) => `<img src="${logo}" alt="" />`)
      .join("");
    back.innerHTML = `
      <div class="playground-card-backdrop" style="background-image: url('${project.image}')"></div>
      <div class="playground-card-copy">
        <h3>
          <span>${project.title}</span>
          <span class="playground-card-title-divider" aria-hidden="true">|</span>
          <span class="playground-project-logo playground-project-logo--${project.variant}" role="img" aria-label="${project.brand}">${logoMarkup}</span>
        </h3>
        <div class="playground-card-duration"><b>${project.duration}　${project.contribution}</b></div>
        <div class="playground-card-built"><span>WHAT I BUILT</span><b> ${project.built}</b></div>
        <p>${project.description}</p>
        <div class="playground-card-actions" aria-label="프로젝트 링크">
          <a href="${project.website}" target="_blank" rel="noopener noreferrer">WEBSITE ↗</a>
          <a href="${project.proposal}" target="_blank" rel="noopener noreferrer">PROPOSAL ↗</a>
        </div>
      </div>`;

    front.appendChild(img);
    inner.append(front, back);
    card.appendChild(inner);
    row.appendChild(card);

    const toggleFocusedCardFlip = () => {
      if (!card.classList.contains("is-focused")) return;
      const showBack = card.dataset.flipped !== "true";
      card.dataset.flipped = String(showBack);
      card.classList.toggle("is-flipped", showBack);
      card.setAttribute("aria-label", `${project.title} 카드 ${showBack ? "뒷면" : "앞면"} 보기`);
      card.style.setProperty("--playground-flip", showBack ? "180deg" : "0deg");
      front.setAttribute("aria-hidden", String(showBack));
      back.setAttribute("aria-hidden", String(!showBack));
      back.querySelectorAll("a").forEach((link) => { link.tabIndex = showBack ? 0 : -1; });
    };

    card.addEventListener("click", toggleFocusedCardFlip);
    card.addEventListener("keydown", (event) => {
      if (event.target.closest("a")) return;
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      toggleFocusedCardFlip();
    });
    back.querySelectorAll("a").forEach((link) => {
      link.tabIndex = -1;
      link.addEventListener("click", (event) => event.stopPropagation());
    });
  }

  const createDecorativeCard = (project, rotation) => {
    const card = document.createElement("div");
    card.className = "playground-card playground-card--decorative";
    card.setAttribute("aria-hidden", "true");
    card.dataset.baseRotation = String(rotation);
    card.style.setProperty("--playground-rotate", `${rotation}deg`);
    card.style.setProperty("--playground-current-rotate", `${rotation}deg`);
    card.style.setProperty("--playground-focus-scale", "0.88");

    const inner = document.createElement("div");
    inner.className = "playground-card-inner";
    const front = document.createElement("div");
    front.className = "playground-card-face playground-card-front";
    const image = document.createElement("img");
    image.src = project.image;
    image.alt = "";
    image.loading = "lazy";
    image.decoding = "async";
    front.appendChild(image);
    inner.appendChild(front);
    card.appendChild(inner);
    return card;
  };

  row.prepend(createDecorativeCard(playgroundProjects.at(-1), -3));
  row.append(createDecorativeCard(playgroundProjects[0], 3));

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    track.style.height = "100vh";
    return;
  }

  let maxShift = 0;
  let rowStartShift = 0;
  let rowEndShift = 0;
  let scrollTimelineLength = 0;
  let focusStops = [];
  let currentRowShift = 0;
  let targetRowShift = 0;
  let hasMeasuredPlayground = false;
  let ticking = false;
  let pendingCharacterVariant;
  let characterVariantTimer = null;
  let characterVariantFinishTimer = null;
  let activePlaygroundCaptionIndex = -1;
  const getIntroDistance = () => Math.min(window.innerHeight * 0.78, 680);
  const getOutroDistance = () => Math.min(window.innerHeight * 0.72, 620);

  const updatePlaygroundCaption = (card) => {
    if (!card || activeCaptionSection !== projectShowcaseSection || !sectionCaptionIndex || !sectionCaptionText) return;
    const projectIndex = Number(card.dataset.projectIndex);
    const project = playgroundProjects[projectIndex];
    if (!project) return;
    if (
      projectIndex === activePlaygroundCaptionIndex
      && sectionCaptionIndex.textContent === project.captionTitle
      && sectionCaptionText.textContent === project.captionText
    ) return;
    activePlaygroundCaptionIndex = projectIndex;
    sectionCaptionIndex.textContent = project.captionTitle;
    sectionCaptionText.textContent = project.captionText;
    sectionCaption.classList.remove("is-changing", "is-stacked");
    void sectionCaption.offsetWidth;
    sectionCaption.classList.add("is-changing");
  };

  const setCharacterVariant = (buddy, nextVariant) => {
    const currentVariant = buddy.dataset.characterVariant || null;
    if (nextVariant === currentVariant && pendingCharacterVariant === undefined) return;
    if (nextVariant === pendingCharacterVariant) return;

    pendingCharacterVariant = nextVariant;
    window.clearTimeout(characterVariantTimer);
    window.clearTimeout(characterVariantFinishTimer);
    buddy.classList.remove("is-variant-changing");
    void buddy.offsetWidth;
    buddy.classList.add("is-variant-changing");
    characterVariantTimer = window.setTimeout(() => {
      if (pendingCharacterVariant) buddy.dataset.characterVariant = pendingCharacterVariant;
      else delete buddy.dataset.characterVariant;
      pendingCharacterVariant = undefined;
    }, 220);
    characterVariantFinishTimer = window.setTimeout(() => {
      buddy.classList.remove("is-variant-changing");
    }, 560);
  };

  const measure = () => {
    maxShift = Math.max(0, row.scrollWidth - camera.clientWidth);
    const cameraCenter = camera.clientWidth / 2;
    const stopThreshold = 2;
    focusStops = [...row.querySelectorAll('[data-detail-card="true"]')]
      .map((card) => row.offsetLeft + card.offsetLeft + card.offsetWidth / 2 - cameraCenter)
      .filter((shift) => shift >= 0 && shift <= maxShift)
      .filter((shift, index, shifts) => index === 0 || Math.abs(shift - shifts[index - 1]) > stopThreshold);
    rowStartShift = focusStops[0] ?? 0;
    rowEndShift = focusStops.at(-1) ?? maxShift;
    const holdDistance = Math.min(window.innerHeight * 0.72, 620);
    scrollTimelineLength = getIntroDistance()
      + Math.max(0, rowEndShift - rowStartShift)
      + focusStops.length * holdDistance
      + getOutroDistance();
    track.style.height = `${window.innerHeight + scrollTimelineLength}px`;
    if (!hasMeasuredPlayground) {
      currentRowShift = rowStartShift;
      targetRowShift = rowStartShift;
      hasMeasuredPlayground = true;
    }
  };

  const getShiftWithCardHolds = (scrollDistance) => {
    const holdDistance = Math.min(window.innerHeight * 0.72, 620);
    let remaining = clamp(scrollDistance, 0, scrollTimelineLength);
    let currentShift = rowStartShift;

    if (remaining <= getIntroDistance()) return currentShift;
    remaining -= getIntroDistance();

    for (const stopShift of focusStops) {
      const moveDistance = Math.max(0, stopShift - currentShift);
      if (remaining <= moveDistance) return currentShift + remaining;
      remaining -= moveDistance;
      currentShift = stopShift;

      if (remaining <= holdDistance) return currentShift;
      remaining -= holdDistance;
    }

    return Math.min(rowEndShift, currentShift + remaining);
  };

  const applyScroll = () => {
    const trackTop = track.getBoundingClientRect().top + window.scrollY;
    const scrollDistance = window.scrollY - trackTop;
    const introProgress = clamp(scrollDistance / getIntroDistance(), 0, 1);
    targetRowShift = getShiftWithCardHolds(scrollDistance);
    currentRowShift += (targetRowShift - currentRowShift) * 0.105;
    if (Math.abs(targetRowShift - currentRowShift) < 0.08) currentRowShift = targetRowShift;
    row.style.transform = `translate3d(${(-currentRowShift).toFixed(2)}px, 0, 0)`;

    const cameraRect = camera.getBoundingClientRect();
    const cameraCenter = cameraRect.left + cameraRect.width / 2;
    const focusRange = Math.min(cameraRect.width * 0.3, 430);
    let strongestFocus = 0;
    [...row.children].forEach((card) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const distanceFromCenter = cardCenter - cameraCenter;
      const rawFocusProgress = clamp(1 - Math.abs(distanceFromCenter) / focusRange, 0, 1);
      if (card.classList.contains("playground-card--decorative")) {
        card.style.setProperty("--playground-focus-scale", "0.88");
        card.style.setProperty("--playground-focus", "0");
        card.style.zIndex = "1";
        return;
      }
      const focusProgress = rawFocusProgress * introProgress;
      strongestFocus = Math.max(strongestFocus, focusProgress);
      const baseRotation = Number(card.dataset.baseRotation) || 0;
      const isFocused = focusProgress > 0.72;
      let isFlipped = card.dataset.flipped === "true";
      if (isFlipped && focusProgress <= 0.02) {
        delete card.dataset.flipped;
        card.classList.remove("is-flipped");
        isFlipped = false;
      }

      card.style.setProperty("--playground-current-rotate", `${(baseRotation * (1 - focusProgress)).toFixed(3)}deg`);
      const introCenteredScale = rawFocusProgress * (1 - introProgress) * 0.12;
      card.style.setProperty("--playground-focus-scale", (0.88 + focusProgress * 0.47 + introCenteredScale).toFixed(4));
      card.style.setProperty("--playground-flip", isFlipped ? "180deg" : "0deg");
      card.style.setProperty("--playground-focus", focusProgress.toFixed(4));
      card.style.zIndex = String(1 + Math.round(focusProgress * 10));
      card.classList.toggle("is-focused", isFocused);
      card.tabIndex = isFocused ? 0 : -1;
      card.querySelectorAll(".playground-card-actions a").forEach((link) => { link.tabIndex = isFlipped ? 0 : -1; });
    });
    row.classList.toggle("has-focused-card", strongestFocus > 0.72);

    const activeDetailCard = [...row.querySelectorAll('[data-detail-card="true"]')].reduce((nearest, card) => {
      const rect = card.getBoundingClientRect();
      const distance = Math.abs(rect.left + rect.width / 2 - cameraCenter);
      return !nearest || distance < nearest.distance ? { card, distance } : nearest;
    }, null)?.card;
    updatePlaygroundCaption(activeDetailCard);

    const trackRect = track.getBoundingClientRect();
    const buddy = document.querySelector("#hero-buddy");
    if (buddy && trackRect.bottom > 0 && trackRect.top < window.innerHeight) {
      if (activeDetailCard?.dataset.characterVariant) {
        setCharacterVariant(buddy, activeDetailCard.dataset.characterVariant);
      }
    } else if (buddy) {
      setCharacterVariant(buddy, null);
    }

    if (Math.abs(targetRowShift - currentRowShift) > 0.08) {
      requestAnimationFrame(applyScroll);
    } else {
      ticking = false;
    }
  };

  const requestScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(applyScroll);
  };

  const images = [...row.querySelectorAll("img")];
  let loadedCount = 0;
  const onImageSettled = () => {
    loadedCount += 1;
    if (loadedCount === images.length) {
      measure();
      requestScroll();
    }
  };
  images.forEach((img) => {
    if (img.complete) onImageSettled();
    else {
      img.addEventListener("load", onImageSettled, { once: true });
      img.addEventListener("error", onImageSettled, { once: true });
    }
  });

  measure();
  window.addEventListener("scroll", requestScroll, { passive: true });
  window.addEventListener("resize", () => {
    measure();
    requestScroll();
  });
  requestScroll();
};

initPlaygroundScroll();

const initWireframeGenButton = () => {
  const button = document.querySelector("[data-wireframe-gen]");
  const toast = document.querySelector("[data-wireframe-toast]");
  if (!button || !toast) return;

  let hideTimer = 0;
  button.addEventListener("click", () => {
    window.clearTimeout(hideTimer);
    toast.classList.add("is-visible");
    hideTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
  });
};

initWireframeGenButton();

const initChatbotModal = () => {
  const modal = chatbotModal;
  const buddyButton = document.querySelector("#hero-buddy");
  const closeButton = modal?.querySelector("[data-chatbot-close]");
  const conversation = modal?.querySelector("[data-chat-log]");
  const form = modal?.querySelector("[data-chat-form]");
  const input = modal?.querySelector("[data-chat-input]");
  const sendButton = modal?.querySelector("[data-chat-send]");
  const topicsWrapper = modal?.querySelector("[data-chat-topics]");
  const topicButtons = [...(topicsWrapper?.querySelectorAll("button") ?? [])];

  if (!modal || !closeButton || !conversation || !form || !input || !sendButton) {
    return null;
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const config = {
    greeting: "안녕하세요 ! 저는 최해수입니다. 포트폴리오나 작업 방식 또는 저에 대해 궁금한 점을 물어보세요.",
    suggestions: [
      "어떤 프로젝트를 했나요?",
      "가장 자신 있는 기술은?",
      "함께 일하려면 어떻게 하나요?",
    ],
    qna: [
      {
        keywords: ["MOA", "모아", "의사결정", "후보추천"],
        answer: "MOA는 선택지가 너무 많아서 결정이 어렵거나 남 의견에 자꾸 기대게 되는 문제를 풀려고 만든 서비스예요. 답변 맥락에 따라 질문을 이어가면서 선택 기준을 정리해주고, 마지막엔 후보 세 개랑 추천 이유를 보여줘요.",
      },
      {
        keywords: ["MOA결과", "4.12", "사용자평가", "25명", "984개", "MOA 성과"],
        answer: "MOA는 25명한테 40문항으로 사용자 평가를 받았어요. 미입력 16개 빼고 984개 응답 기준으로 평균 4.12점(5점 만점) 나왔고, 거기서 발견한 문제들(클릭 표현, 질문 흐름, 홈 화면 구조, 튜토리얼)은 다 개선했어요.",
      },
      {
        keywords: ["아쿠아플라넷", "Aqua Planet", "글래스모피즘"],
        answer: "아쿠아플라넷의 지점, 해양생물, 프로그램을 깊어지는 바다 느낌으로 소개하는 인터랙티브 웹이에요. 긴 스크롤 배경, 영상, 기포·물결 효과, 3D 생물 모델, 글래스모피즘 UI를 섞어서 수중 공간을 탐색하는 감각을 표현했고, 대용량 영상·3D 자산 때문에 생기는 성능 문제도 같이 줄여봤어요.",
      },
      {
        keywords: ["LAYER", "레이어", "향수"],
        answer: "LAYER는 어렵고 방대한 향수 정보를 취향이랑 상황에 맞게 탐색하게 도와주는 향수 앱이에요. 향수 성향 진단, 매거진, 후기랑 자유롭게 대화하는 커뮤니티, 사진 보고 어울리는 향 추천해주는 콘텐츠랑 챗봇까지 설계했어요.",
      },
      {
        keywords: ["Sayout", "세이아웃", "명령형", "와이어프레임"],
        answer: "Sayout은 원하는 화면을 문장으로 입력하면 Figma 와이어프레임을 만들어주는 도구예요. 반복되는 초기 레이아웃 작업 시간을 줄이고, 구조를 빠르게 비교하고 고칠 수 있게 하는 게 목표예요. 최근엔 이 AI 와이어프레임 기능도 작업했어요! 좌상단 버튼 눌러서 체험해보세요.",
      },
      {
        keywords: ["대표 프로젝트", "프로젝트 순서", "무엇부터", "추천 프로젝트"],
        answer: "UX 문제 정의랑 사용자 검증 과정 보고 싶으면 MOA 먼저 추천해요. 인터랙티브 웹 구현은 아쿠아플라넷, 콘텐츠 구조랑 감각적인 모바일 UI는 LAYER, AI로 새로운 도구 만드는 건 Sayout이랑 이 포트폴리오 챗봇에서 볼 수 있어요.",
      },
      {
        keywords: ["프로젝트", "작업물", "포트폴리오", "만든", "work"],
        answer: "선택을 돕는 AI 서비스 MOA, 아쿠아플라넷의 해양 경험을 담은 인터랙티브 웹, 향수 탐색 앱 LAYER, 문장으로 와이어프레임 만들어주는 Sayout, 그리고 캐릭터형 챗봇을 넣은 이 포트폴리오까지 진행했어요. Works 버튼 누르면 더 자세히 볼 수 있어요!",
      },
      {
        keywords: ["코딩", "개발", "HTML", "CSS", "React", "GitHub", "기술", "스킬", "skill", "잘하", "자신"],
        answer: "네, HTML·CSS 기반으로 화면 만들고 React랑 Vite로 프로젝트도 여러 개 진행했어요. Git·GitHub로 협업하고 Vercel로 배포까지 직접 해봤고, 인터랙션이 많이 필요한 프로젝트에선 GSAP·ScrollTrigger·Three.js도 써봤어요.",
      },
      {
        keywords: ["디자인 도구", "디자인툴", "Figma", "프로토타입", "컴포넌트"],
        answer: "주로 Figma로 와이어프레임, UI, 컴포넌트, 프로토타입까지 다 만들어요. 필요한 이미지나 시각 자산도 다듬고, 인터랙티브 웹으로 옮길 땐 구조를 개발 환경에 맞게 정리해서 써요.",
      },
      {
        keywords: ["앞으로", "커리어 목표", "미래", "프로덕트 디자이너", "되고 싶", "되고싶"],
        answer: "사용자 행동이랑 감정을 세밀하게 이해하면서도, 아이디어를 실제 제품·서비스로 구현할 수 있는 디자이너가 되고 싶어요. 디자인이랑 개발 사이의 언어를 같이 이해하면서 팀이랑 잘 협업하고, 사용자가 직접 만지고 반응할 수 있는 경험을 만드는 게 목표예요.",
      },
      {
        keywords: ["어떤 디자이너", "디자인 철학", "정체성", "지향점", "한 문장"],
        answer: "저는 사용자를 감각으로 읽고, 그 감각을 논리로 구현하는 디자이너를 지향해요. 보기 좋은 화면 만드는 데서 끝내지 않고, 사용자가 뭘 이해하고 어떤 행동을 하게 될지까지 설계한 다음 인터랙션이랑 코드로 연결하려고 해요.",
      },
      {
        keywords: ["자기소개", "소개", "지원자", "본인", "누구", "해수", "최해수"],
        answer: "저는 사용자의 감각이랑 행동을 관찰해서 문제를 찾고, 그걸 논리적인 화면 구조랑 실제 작동하는 인터랙션으로 만드는 디자이너예요. Figma로 기획하고 시각화하는 것부터 HTML·CSS·React로 직접 구현하는 것까지 다 해요.",
      },
      {
        keywords: ["강점", "장점", "차별점", "실행력"],
        answer: "제 강점은 아이디어를 제안하는 데서 멈추지 않고, 사용자 흐름이랑 인터랙션을 구체화해서 실제 화면으로 구현하는 실행력이에요. 디자인 의도를 코드랑 직접 연결해볼 수 있어서, 구현하다 생기는 제약도 이해하고 더 현실적인 방법을 찾을 수 있어요.",
      },
      {
        keywords: ["성격", "성향", "꾸준함", "끈기"],
        answer: "목표를 정하면 쉽게 안 놓고 될 때까지 방법을 찾는 편이에요. 미대 입시 준비하면서 학업이랑 알바를 같이 했던 경험 덕분에, 시간이 빠듯해도 계획을 조정해가면서 끝까지 해내는 습관이 생겼어요.",
      },
      {
        keywords: ["디자인 기준", "좋은 디자인", "정보 구조", "인터랙션 목적"],
        answer: "화면을 보면서 사용자가 뭘 이해하고 다음에 뭘 해야 할지 자연스럽게 드러나는지를 제일 중요하게 봐요. 비주얼이나 인터랙션도 그냥 예뻐 보이려고 넣기보다, 문제랑 브랜드 경험을 더 명확하게 전달하는 방향으로 쓰려고 해요.",
      },
      {
        keywords: ["프로세스", "작업 과정", "문제 해결", "사용자 흐름"],
        answer: "먼저 사용자가 겪는 문제랑 목표를 정리하고, 핵심 흐름이랑 정보 구조를 설계해요. 그다음 와이어프레임이랑 비주얼 콘셉트를 구체화해서 실제 화면으로 만들어보고, 테스트나 피드백에서 나온 문제는 우선순위 정해서 다시 고쳐요.",
      },
      {
        keywords: ["디자인과 개발", "현실성"],
        answer: "인터랙션이 중요한 프로젝트는 디자인 파일만으로는 경험을 다 설명하기 어렵더라고요. 직접 구현해보면 속도나 반응, 전환 같은 걸 더 구체적으로 볼 수 있고, 개발 제약을 알고 나서 더 현실적인 디자인 결정을 내릴 수 있어요.",
      },
      {
        keywords: ["인터랙션", "모션", "애니메이션", "스크롤", "스토리텔링"],
        answer: "인터랙션을 그냥 장식으로 먼저 정하기보다, 콘텐츠 흐름이랑 사용자 시선을 어떻게 연결할지부터 생각해요. 아쿠아플라넷에서는 바다 속으로 들어가는 느낌을 롱스크롤이랑 영상·3D로 표현했고, 제 포트폴리오에서는 캐릭터가 안내하다가 챗봇으로 이어지는 흐름을 짜봤어요.",
      },
      {
        keywords: ["사용자테스트", "사용자 테스트", "피드백", "검증"],
        answer: "MOA 프로젝트에서 사용자 평가를 해봤는데, 클릭 가능한 요소가 잘 안 보이는 문제, 질문이 반복되는 문제, 홈 화면 정보 우선순위 문제가 나왔어요. 그래서 클릭 가능성을 더 뚜렷하게 표현하고, 질문 흐름이랑 히어로 영역 정리하고, 튜토리얼도 보완했어요.",
      },
      {
        keywords: ["팀 프로젝트", "Git", "브랜치", "커뮤니케이션"],
        answer: "팀 프로젝트에서 역할 나누고 Git·GitHub로 브랜치 관리하면서 작업했어요. 아쿠아플라넷 할 때는 페이지랑 자산을 브랜치로 나눠서 작업했고, 충돌이나 배포 문제 생기면 원인 찾아서 정리하면서 해결했어요.",
      },
      {
        keywords: ["생성형", "AI 활용", "업무활용"],
        answer: "AI로 결과물을 대신 결정하게 하기보다, 아이디어 탐색하고 이미지 시안 만들고 문구 정리하는 걸 빠르게 반복하는 용도로 써요. 문장으로 Figma 와이어프레임을 만들어주는 Sayout이나 이 포트폴리오 챗봇처럼, AI 기능 자체를 프로젝트로 만들어보는 것도 재밌어서 하고 있어요.",
      },
      {
        keywords: ["디자인 계기", "산업디자인", "미대입시", "미대 입시", "진로"],
        answer: "원래 그림 그리는 걸 좋아했고, 아이디어를 실제 형태로 만들 수 있다는 점에 끌려서 산업디자인 진학을 준비했어요. 그러다 화면 안에서 사용자 경험이랑 인터랙션을 설계하고 실제로 작동하게 만들 수 있는 UX/UI, 웹 디자인으로 관심이 넓어졌어요.",
      },
      {
        keywords: ["재수", "삼수", "힘들었던", "극복"],
        answer: "원하는 대학에 못 붙어서 재수, 삼수하면서 공부랑 알바를 같이 했던 시기가 제일 힘들었어요. 입시 비용이랑 생활비를 직접 마련해야 해서 시간도 돈도 빠듯했는데, 상황에 맞춰서 일이랑 공부 시간을 계속 조정하면서 준비했어요.",
      },
      {
        keywords: ["텍사스로드하우스", "오술차", "알바", "아르바이트", "시간관리", "시간 관리"],
        answer: "텍사스로드하우스에서 일할 땐 오전 10시부터 오후 4시까지 일하고 나서 공부하고, 주말엔 그림 수업도 들었어요. 오술차에서 일할 땐 낮에 공부하고 저녁부터 새벽까지 일했고요. 환경 탓하기보다 쓸 수 있는 시간을 나누고 우선순위 조정하면서 목표를 계속 이어갔어요.",
      },
      {
        keywords: ["배운 점", "배운점", "그 경험", "영향을"],
        answer: "처음 세운 방법이 안 통할 때 목표 자체를 포기하기보다, 원인을 찾고 계획을 다시 조정하는 습관이 생겼어요. 디자인할 때도 처음 만든 시안을 정답으로 안 두고, 사용자 피드백이나 구현 제약, 팀 의견 확인하면서 더 나은 방향으로 계속 고쳐요.",
      },
      {
        keywords: ["UX/UI 공부", "교육", "UX/UI 과정", "학습"],
        answer: "UX/UI 웹디자인 과정에서 Figma로 화면 설계하고 HTML·CSS로 웹 구현하는 걸 배웠고, 그다음 React로 확장했어요. 팀 프로젝트랑 개인 프로젝트 하면서 기획부터 UI 디자인, 프로토타이핑, 구현, 배포까지 한 흐름으로 경험해봤어요.",
      },
      {
        keywords: ["히스토리", "타임라인", "여정", "살아왔", "background", "어떻게 시작", "커리어"],
        answer: "캐나다에서 어릴 때를 보내서 그런지 그때 감각이 아직도 남아있어요. 미대 입시하면서 관찰하고 그리는 법을 배웠고, 봉사활동 페이스페인팅이랑 카페 라떼아트도 하면서 사람 기쁘게 하는 걸 좋아하게 됐어요. 그러다 보니 자연스럽게 UX/UI로 왔네요.",
      },
      {
        keywords: ["어디 살", "사는 곳", "거주", "지역", "location"],
        answer: "용인 살아요!",
      },
      {
        keywords: ["취미", "여가", "hobby", "쉴 때", "관심사", "그림", "드로잉"],
        answer: "그림 그리는 걸 제일 좋아해요. 라떼아트로 커피 위에 그리기도 하고, 시간 날 때 전시 보러 다니거나 여행 다니는 것도 즐겨요.",
      },
      {
        keywords: ["그림과 디자인", "시각화"],
        answer: "그림 그리면서 머릿속 아이디어를 눈에 보이는 형태로 옮기는 게 익숙해졌어요. 지금은 그 경험을 가만히 있는 이미지에만 안 쓰고, 사용자가 움직이고 선택하고 반응할 수 있는 화면이랑 인터랙션으로 넓혀서 쓰고 있어요.",
      },
      {
        keywords: ["함께", "협업", "연락", "컨택", "채용", "일하", "인터뷰", "이메일"],
        answer: "010-4212-4970 또는 chs041015@gmail.com으로 편하게 연락 주세요. 프로젝트별 자세한 과정은 Works 섹션에서 더 볼 수 있어요!",
      },
    ],
    fallback: "그건 제가 아직 답을 못 드리는 질문이에요. 프로젝트나 기술, 제 얘기, 협업 방법 같은 거 물어봐 주세요!",
  };

  const getAnswer = (message) => {
    const matched = config.qna.find(({ keywords }) => keywords.some((word) => message.includes(word)));
    return matched?.answer ?? config.fallback;
  };

  let isOpen = false;
  let isResponding = false;
  let suggestionsElement = null;
  let lastFocusedElement = null;
  let closeTimer = 0;

  const wait = (duration) => new Promise((resolve) => window.setTimeout(resolve, duration));
  const scrollToBottom = () => { conversation.scrollTop = conversation.scrollHeight; };

  const appendBubble = (sender, message) => {
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble is-${sender}`;
    bubble.textContent = message;
    conversation.appendChild(bubble);
    scrollToBottom();
    return bubble;
  };

  const appendLoadingBubble = () => {
    const bubble = document.createElement("div");
    const dots = document.createElement("span");
    bubble.className = "chat-bubble is-bot is-loading";
    dots.className = "chat-loading-dots";
    dots.setAttribute("aria-label", "입력 중");
    for (let index = 0; index < 3; index += 1) dots.appendChild(document.createElement("i"));
    bubble.appendChild(dots);
    conversation.appendChild(bubble);
    scrollToBottom();
    return bubble;
  };

  const removeSuggestions = () => {
    suggestionsElement?.remove();
    suggestionsElement = null;
    topicsWrapper?.classList.add("is-visible");
  };

  const setControlsDisabled = (disabled) => {
    input.disabled = disabled;
    sendButton.disabled = disabled;
    conversation.setAttribute("aria-busy", String(disabled));
    suggestionsElement?.querySelectorAll("button").forEach((button) => { button.disabled = disabled; });
    topicButtons.forEach((button) => { button.disabled = disabled; });
  };

  const appendSuggestions = () => {
    suggestionsElement = document.createElement("div");
    suggestionsElement.className = "chat-suggestions";
    suggestionsElement.setAttribute("aria-label", "추천 질문");
    config.suggestions.forEach((label) => {
      const button = document.createElement("button");
      button.className = "chat-suggestion";
      button.type = "button";
      button.textContent = label;
      button.addEventListener("click", () => void sendMessage(label));
      suggestionsElement.appendChild(button);
    });
    conversation.appendChild(suggestionsElement);
    scrollToBottom();
  };

  const typeBubbleText = (bubble, text) => new Promise((resolve) => {
    if (reducedMotion) {
      bubble.textContent = text;
      scrollToBottom();
      resolve();
      return;
    }

    let index = 0;
    const step = () => {
      index += 1;
      bubble.textContent = text.slice(0, index);
      scrollToBottom();
      if (index < text.length) {
        window.setTimeout(step, 20);
      } else {
        resolve();
      }
    };
    step();
  });

  const sendMessage = async (rawMessage) => {
    const message = rawMessage.trim();
    if (!message || isResponding) return;

    isResponding = true;
    setControlsDisabled(true);
    removeSuggestions();
    appendBubble("user", message);
    input.value = "";

    const loadingBubble = appendLoadingBubble();
    await wait(700);
    loadingBubble.remove();
    const answerBubble = appendBubble("bot", "");
    await typeBubbleText(answerBubble, getAnswer(message));

    isResponding = false;
    setControlsDisabled(false);
    if (isOpen) input.focus({ preventScroll: true });
  };

  const resetConversation = () => {
    conversation.replaceChildren();
    suggestionsElement = null;
    topicsWrapper?.classList.remove("is-visible");
    appendBubble("bot", config.greeting);
    appendSuggestions();
  };

  const openChatbotModal = () => {
    if (isOpen) return;
    window.clearTimeout(closeTimer);
    isOpen = true;
    lastFocusedElement = document.activeElement;
    if (!conversation.children.length) resetConversation();

    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    buddyButton?.classList.add("is-chat-open");

    requestAnimationFrame(() => modal.classList.add("is-open"));
  };

  const closeChatbotModal = () => {
    if (!isOpen) return;
    isOpen = false;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    buddyButton?.classList.remove("is-chat-open");

    closeTimer = window.setTimeout(() => {
      if (!isOpen) modal.hidden = true;
    }, 260);

    if (lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus({ preventScroll: true });
    }
  };

  const projectQuestions = {
    aqua: "아쿠아플라넷 프로젝트에 대해 알려주세요",
    layer: "LAYER 프로젝트에 대해 알려주세요",
    moa: "MOA 프로젝트에 대해 알려주세요",
  };

  const askAboutProject = (variant) => {
    const question = projectQuestions[variant];
    if (!question) {
      openChatbotModal();
      return;
    }
    openChatbotModal();
    void sendMessage(question);
  };

  closeButton.addEventListener("click", closeChatbotModal);

  document.addEventListener("keydown", (event) => {
    if (!isOpen || event.key !== "Escape") return;
    closeChatbotModal();
  });

  document.addEventListener("pointerdown", (event) => {
    if (!isOpen) return;
    if (modal.contains(event.target) || buddyButton?.contains(event.target)) return;
    closeChatbotModal();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    void sendMessage(input.value);
  });

  input.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" || event.shiftKey) return;
    event.preventDefault();
    form.requestSubmit();
  });

  topicButtons.forEach((button) => {
    button.addEventListener("click", () => void sendMessage(button.dataset.topic));
  });

  return {
    open: openChatbotModal,
    close: closeChatbotModal,
    isOpen: () => isOpen,
    askAboutProject,
  };
};

const chatbotModalApi = initChatbotModal();
const openChatbot = () => chatbotModalApi?.open();
const askChatbotAboutProject = (variant) => {
  if (chatbotModalApi?.askAboutProject) chatbotModalApi.askAboutProject(variant);
  else openChatbot();
};

const initHeroBuddy = () => {
  const buddy = document.querySelector("#hero-buddy");
  const heroSection = document.querySelector("#home");
  const heroDivider = heroSection?.querySelector(".hero-divider");
  const footerSection = document.querySelector("#contact");
  const footerDivider = footerSection?.querySelector(".contact-divider");
  const footerSignatureLines = [...(footerSection?.querySelectorAll(".contact-signature p") ?? [])];
  const legLeft = buddy?.querySelector(".buddy-leg-left");
  const legRight = buddy?.querySelector(".buddy-leg-right");
  const eyePupilLeft = buddy?.querySelector(".buddy-eye-pupil-left");
  const eyePupilRight = buddy?.querySelector(".buddy-eye-pupil-right");
  const eyeHighlightLeft = buddy?.querySelector(".buddy-eye-highlight-left");
  const eyeHighlightRight = buddy?.querySelector(".buddy-eye-highlight-right");
  if (!buddy || !heroSection || !footerSection) {
    resolveHeroBuddyIntro();
    return;
  }

  const footerLetterStates = footerSignatureLines.flatMap((line) => {
    const label = line.textContent;
    const fragment = document.createDocumentFragment();
    const states = [...label].map((character) => {
      const letter = document.createElement("span");
      letter.className = "contact-signature-letter";
      letter.textContent = character === " " ? "\u00a0" : character;
      letter.setAttribute("aria-hidden", "true");
      fragment.appendChild(letter);
      return { letter, lift: 0, rotation: 0 };
    });
    line.textContent = "";
    line.appendChild(fragment);
    return states;
  });

  const ROAM_BUDDY_W = 88;
  const ROAM_BUDDY_H = 120;
  const DOCKED_BUDDY_W = 66;
  const DOCKED_BUDDY_H = 88;
  const buddySize = () => mode === "docked"
    ? { width: DOCKED_BUDDY_W, height: DOCKED_BUDDY_H }
    : { width: ROAM_BUDDY_W, height: ROAM_BUDDY_H };
  const MARGIN = 32;
  const DOCK_MARGIN_X = 72;
  const DOCK_MARGIN_Y = 28;
  const MAX_SPEED = 480; // px/s, cruising speed across long distances
  const DECEL_DISTANCE = 160; // ease out once within this many px of the target
  const KEY_STEP = 46;
  const ROAM_VISIBILITY_THRESHOLD = 0.82;
  const BUDDY_STATE_KEY = "haesoo-portfolio-buddy-state";

  let mode = "hero-roam"; // "hero-roam" | "docked" | "footer-roam"
  let heroVisible = true;
  let footerVisible = false;
  let x = 0;
  let y = 0;
  let targetX = 0;
  let targetY = 0;
  let facing = 1;
  let facingScale = 1;
  let currentSpeed = 0;
  let walkPhase = 0;
  let bob = 0;
  let reactionTimer = null;
  let blinkTimer = null;
  let isJumping = false;
  let jumpOffset = 0;
  let jumpVelocity = 0;
  let crouchProgress = 0;
  let landingImpact = 0;
  let heroDoorPhase = "idle";
  let heroDoorDirection = 0;
  let heroDoorPhaseStartedAt = 0;
  let introHintPending = false;
  let pointerX = window.innerWidth / 2;
  let pointerY = window.innerHeight / 2;
  const pressedArrowKeys = new Set();

  const HINT_BUBBLE_APPEAR_MS = 460; // bubble fade-in (220ms) + last d-pad arrow pop (240ms delay + 200ms)
  const showIntroHint = () => {
    buddy.dataset.hint = "dpad";
    buddy.classList.add("is-intro-hint");
    window.setTimeout(() => buddy.classList.remove("is-intro-hint"), 2200);
  };

  window.addEventListener("pointermove", (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
  }, { passive: true });

  const EYE_GAZE_MAX = 9; // svg user units the pupil may drift from its resting spot
  const clearEyeGaze = () => {
    eyePupilLeft?.style.removeProperty("transform");
    eyePupilRight?.style.removeProperty("transform");
    eyeHighlightLeft?.style.removeProperty("transform");
    eyeHighlightRight?.style.removeProperty("transform");
  };

  const updateEyeGaze = (faceX, faceY, size, facingSign) => {
    const svgScaleX = size.width / 192;
    const svgScaleY = size.height / 256;
    const dx = pointerX - (faceX + 95 * svgScaleX);
    const dy = pointerY - (faceY + 108 * svgScaleY);
    const distance = Math.hypot(dx, dy) || 1;
    const angle = Math.atan2(dy, dx);
    const pull = Math.min(1, distance / 260);
    const mag = EYE_GAZE_MAX * pull;
    const localX = Math.cos(angle) * mag * (facingSign < 0 ? -1 : 1);
    const localY = Math.sin(angle) * mag;
    const transform = `translate(${localX.toFixed(2)}px, ${localY.toFixed(2)}px)`;
    if (eyePupilLeft) eyePupilLeft.style.transform = transform;
    if (eyePupilRight) eyePupilRight.style.transform = transform;
    const highlightTransform = `translate(${(localX * 0.7).toFixed(2)}px, ${(localY * 0.7).toFixed(2)}px)`;
    if (eyeHighlightLeft) eyeHighlightLeft.style.transform = highlightTransform;
    if (eyeHighlightRight) eyeHighlightRight.style.transform = highlightTransform;
  };

  const groundYFor = (rect) => {
    const { height } = buddySize();
    const visibleTop = Math.max(rect.top, 0);
    const visibleBottom = Math.min(rect.bottom, window.innerHeight);
    const ground = visibleBottom - MARGIN - height;
    return Math.max(ground, visibleTop + MARGIN);
  };

  const heroBounds = () => {
    const { width, height } = buddySize();
    const footY = height * (228 / 256);
    const rect = heroSection.getBoundingClientRect();
    const dividerTop = heroDivider?.getBoundingClientRect().top;
    const groundY = Number.isFinite(dividerTop)
      ? dividerTop - footY
      : groundYFor(rect);
    return {
      minX: rect.left + MARGIN,
      maxX: rect.right - MARGIN - width,
      y: Math.max(groundY, Math.max(rect.top, 0) + MARGIN),
    };
  };

  const footerBounds = () => {
    const { width, height } = buddySize();
    const footY = height * (228 / 256);
    const rect = footerSection.getBoundingClientRect();
    const dividerTop = footerDivider?.getBoundingClientRect().top ?? rect.bottom;
    const visibleGround = Math.min(dividerTop, window.innerHeight - MARGIN);

    return {
      minX: rect.left + MARGIN,
      maxX: rect.right - MARGIN - width,
      y: Math.max(visibleGround - footY, Math.max(rect.top, 0) + MARGIN),
    };
  };

  const dockPoint = () => ({
    x: window.innerWidth - DOCK_MARGIN_X - DOCKED_BUDDY_W,
    y: window.innerHeight - DOCK_MARGIN_Y - DOCKED_BUDDY_H,
  });

  const sectionIsVisible = (section) => {
    const rect = section.getBoundingClientRect();
    const visibleHeight = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
    return visibleHeight / Math.max(Math.min(rect.height, window.innerHeight), 1) >= ROAM_VISIBILITY_THRESHOLD;
  };

  const readSavedBuddyState = () => {
    try {
      return JSON.parse(sessionStorage.getItem(BUDDY_STATE_KEY) || "null");
    } catch {
      return null;
    }
  };

  const saveBuddyState = () => {
    try {
      sessionStorage.setItem(BUDDY_STATE_KEY, JSON.stringify({ mode, x, targetX, facing }));
    } catch {
      // Storage can be unavailable in privacy-restricted contexts.
    }
  };

  const resolveMode = () => {
    const next = heroVisible ? "hero-roam" : footerVisible ? "footer-roam" : "docked";
    if (next === mode) return;
    mode = next;
    buddy.dataset.mode = mode;
    if (mode !== "hero-roam" && heroDoorPhase !== "idle") {
      heroDoorPhase = "idle";
      heroDoorDirection = 0;
      buddy.classList.remove("is-behind-hero-card");
      buddy.removeAttribute("data-look-direction");
      flipCard?.classList.remove("is-door-active");
      flipCard?.style.removeProperty("--card-door-rotate");
    }
    if (mode === "docked") {
      isJumping = false;
      jumpOffset = 0;
      jumpVelocity = 0;
    }
    if (mode === "docked") {
      const dock = dockPoint();
      targetX = dock.x;
      targetY = dock.y;
    } else {
      const bounds = mode === "hero-roam" ? heroBounds() : footerBounds();
      targetX = clamp(targetX, bounds.minX, bounds.maxX);
      targetY = bounds.y;
    }
  };

  const triggerReaction = (name) => {
    buddy.dataset.reaction = name;
    window.clearTimeout(reactionTimer);
    reactionTimer = window.setTimeout(() => {
      buddy.dataset.reaction = "";
    }, 280);
  };

  const scheduleBlink = () => {
    window.clearTimeout(blinkTimer);
    blinkTimer = window.setTimeout(() => {
      if (!buddy.dataset.reaction) {
        buddy.classList.add("is-blinking");
        window.setTimeout(() => buddy.classList.remove("is-blinking"), 140);
      }
      scheduleBlink();
    }, 2400 + Math.random() * 2600);
  };

  const autoBubble = buddy.querySelector(".buddy-auto-bubble");
  const autoBubbleText = buddy.querySelector(".buddy-auto-bubble-text");
  const AUTO_BUBBLE_MESSAGES = [
    "방향키로 움직여보세요!",
    "저를 누르면 대화할 수 있어요",
  ];
  let autoBubbleIndex = 0;
  let autoBubbleShowTimer = null;
  let autoBubbleHideTimer = null;
  let buddyHovering = false;

  const hideAutoBubble = () => {
    window.clearTimeout(autoBubbleHideTimer);
    autoBubble?.classList.remove("is-visible");
  };

  const scheduleAutoBubble = () => {
    window.clearTimeout(autoBubbleShowTimer);
    autoBubbleShowTimer = window.setTimeout(() => {
      if (mode !== "docked" && pressedArrowKeys.size === 0 && !buddyHovering) {
        autoBubbleText.textContent = AUTO_BUBBLE_MESSAGES[autoBubbleIndex % AUTO_BUBBLE_MESSAGES.length];
        autoBubbleIndex += 1;
        autoBubble.classList.add("is-visible");
        window.clearTimeout(autoBubbleHideTimer);
        autoBubbleHideTimer = window.setTimeout(() => {
          autoBubble.classList.remove("is-visible");
        }, 3000);
      }
      scheduleAutoBubble();
    }, 8000);
  };

  heroVisible = sectionIsVisible(heroSection);
  footerVisible = sectionIsVisible(footerSection);
  mode = heroVisible ? "hero-roam" : footerVisible ? "footer-roam" : "docked";
  buddy.dataset.mode = mode;
  const savedBuddyState = readSavedBuddyState();
  const initialBounds = mode === "hero-roam" ? heroBounds() : mode === "footer-roam" ? footerBounds() : dockPoint();
  const initialMinX = initialBounds.minX ?? initialBounds.x;
  const initialMaxX = initialBounds.maxX ?? initialBounds.x;
  const centeredInitialX = (initialMinX + initialMaxX) / 2;
  const heroCardRect = mode === "hero-roam" ? flipStack?.getBoundingClientRect() : null;
  const cardRightStartX = heroCardRect ? heroCardRect.right + 28 : centeredInitialX;
  const cardLeftStartX = heroCardRect ? heroCardRect.left - ROAM_BUDDY_W - 28 : centeredInitialX;
  const heroInitialX = cardRightStartX <= initialMaxX
    ? cardRightStartX
    : cardLeftStartX >= initialMinX
      ? cardLeftStartX
      : centeredInitialX;
  const savedX = savedBuddyState?.mode === mode && Number.isFinite(savedBuddyState.x)
    ? savedBuddyState.x
    : mode === "hero-roam" ? heroInitialX : centeredInitialX;
  x = clamp(savedX, initialMinX, initialMaxX);
  targetX = clamp(
    savedBuddyState?.mode === mode && Number.isFinite(savedBuddyState.targetX) ? savedBuddyState.targetX : x,
    initialMinX,
    initialMaxX
  );
  facing = savedBuddyState?.mode === mode && Math.abs(savedBuddyState.facing) === 1 ? savedBuddyState.facing : 1;
  y = targetY = initialBounds.y;
  if (mode === "hero-roam") {
    isJumping = true;
    jumpOffset = -110;
    jumpVelocity = 0;
    introHintPending = true;
  } else {
    resolveHeroBuddyIntro();
  }
  buddy.style.transform = `translate3d(${x}px, ${y + jumpOffset}px, 0) scaleX(${facing})`;
  buddy.dataset.facing = facing < 0 ? "left" : "right";
  scheduleBlink();
  if (autoBubble && autoBubbleText) scheduleAutoBubble();

  const syncBuddySectionVisibility = () => {
    heroVisible = sectionIsVisible(heroSection);
    footerVisible = sectionIsVisible(footerSection);
    resolveMode();
  };

  let visibilityFrame = null;
  const requestBuddyVisibilitySync = () => {
    if (visibilityFrame !== null) return;
    visibilityFrame = requestAnimationFrame(() => {
      visibilityFrame = null;
      syncBuddySectionVisibility();
    });
  };

  window.addEventListener("scroll", requestBuddyVisibilitySync, { passive: true });
  window.addEventListener("resize", requestBuddyVisibilitySync);

  const restoreBuddyInPlace = () => {
    heroVisible = sectionIsVisible(heroSection);
    footerVisible = sectionIsVisible(footerSection);
    mode = heroVisible ? "hero-roam" : footerVisible ? "footer-roam" : "docked";
    buddy.dataset.mode = mode;
    const savedState = readSavedBuddyState();
    const bounds = mode === "hero-roam" ? heroBounds() : mode === "footer-roam" ? footerBounds() : dockPoint();
    const minX = bounds.minX ?? bounds.x;
    const maxX = bounds.maxX ?? bounds.x;
    const restoredX = savedState?.mode === mode && Number.isFinite(savedState.x) ? savedState.x : x;
    x = targetX = clamp(restoredX, minX, maxX);
    y = targetY = bounds.y;
    buddy.style.transform = `translate3d(${x}px, ${y}px, 0) scaleX(${facing})`;
    buddy.dataset.facing = facing < 0 ? "left" : "right";
  };

  const beginHeroDoorPass = (direction) => {
    if (mode !== "hero-roam" || heroDoorPhase !== "idle" || !flipStack || !flipCard) return false;
    const cardRect = flipStack.getBoundingClientRect();
    const buddyTop = y + jumpOffset;
    const buddyBottom = buddyTop + ROAM_BUDDY_H;
    const isActuallyOverlapping = x + ROAM_BUDDY_W >= cardRect.left
      && x <= cardRect.right
      && buddyBottom >= cardRect.top
      && buddyTop <= cardRect.bottom;
    if (!isActuallyOverlapping) return false;

    heroDoorPhase = "opening";
    heroDoorDirection = direction;
    heroDoorPhaseStartedAt = performance.now();
    targetX = direction > 0
      ? cardRect.right + 12
      : cardRect.left - ROAM_BUDDY_W - 12;
    pressedArrowKeys.clear();
    buddy.classList.add("is-behind-hero-card");
    flipCard.classList.add("is-door-active");
    flipCard.style.setProperty("--card-door-rotate", "180deg");
    return true;
  };

  window.addEventListener("pagehide", saveBuddyState);
  window.addEventListener("pageshow", () => requestAnimationFrame(restoreBuddyInPlace));
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) saveBuddyState();
  });

  window.addEventListener("keydown", (event) => {
    if (mode === "docked") return;
    if (chatbotModalApi?.isOpen()) return;
    if (event.key.startsWith("Arrow")) {
      pressedArrowKeys.add(event.key);
      hideAutoBubble();
    }
    if (heroDoorPhase === "opening" || heroDoorPhase === "looking") {
      if (event.key.startsWith("Arrow")) event.preventDefault();
      return;
    }
    const bounds = mode === "hero-roam" ? heroBounds() : footerBounds();

    if (event.key === "ArrowLeft") {
      const desired = targetX - KEY_STEP;
      targetX = clamp(desired, bounds.minX, bounds.maxX);
      facing = -1;
    } else if (event.key === "ArrowRight") {
      const desired = targetX + KEY_STEP;
      targetX = clamp(desired, bounds.minX, bounds.maxX);
      facing = 1;
    } else if (event.key === "ArrowUp") {
      if (!isJumping) {
        isJumping = true;
        jumpVelocity = -820;
      }
      triggerReaction("up");
    } else if (event.key === "ArrowDown") {
      if (isJumping) jumpVelocity += 900;
      triggerReaction("down");
    } else {
      return;
    }
    event.preventDefault();
  });

  window.addEventListener("keyup", (event) => {
    if (event.key.startsWith("Arrow")) pressedArrowKeys.delete(event.key);
  });

  window.addEventListener("blur", () => pressedArrowKeys.clear());

  buddy.addEventListener("click", () => {
    askChatbotAboutProject(buddy.dataset.characterVariant);
  });

  let nextHint = "dpad";
  buddy.addEventListener("pointerenter", () => {
    buddy.dataset.hint = nextHint;
    nextHint = nextHint === "dpad" ? "chat" : "dpad";
    buddyHovering = true;
    hideAutoBubble();
  });
  buddy.addEventListener("pointerleave", () => {
    buddyHovering = false;
  });
  buddy.addEventListener("focus", () => {
    buddyHovering = true;
    hideAutoBubble();
  });
  buddy.addEventListener("blur", () => {
    buddyHovering = false;
  });

  window.addEventListener("resize", resolveMode);

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    resolveHeroBuddyIntro();
    return;
  }

  let lastTime = performance.now();

  const tick = (now) => {
    const dt = Math.min(64, now - lastTime) / 1000;
    lastTime = now;

    if (mode === "hero-roam" && heroDoorPhase === "idle") {
      const travelDirection = Math.sign(targetX - x);
      if (travelDirection !== 0) beginHeroDoorPass(travelDirection);
    }

    if (heroDoorPhase === "opening" && now - heroDoorPhaseStartedAt >= 960) {
      heroDoorPhase = "passing";
      heroDoorPhaseStartedAt = now;
      flipCard?.style.setProperty("--card-door-rotate", "0deg");
      const cardRect = flipStack?.getBoundingClientRect();
      if (cardRect) {
        targetX = heroDoorDirection > 0
          ? cardRect.right + 12
          : cardRect.left - ROAM_BUDDY_W - 12;
      }
    } else if (heroDoorPhase === "passing" && flipStack) {
      const cardRect = flipStack.getBoundingClientRect();
      const clearedCard = heroDoorDirection > 0
        ? x >= cardRect.right + 8
        : x + ROAM_BUDDY_W <= cardRect.left - 8;
      if (clearedCard) {
        heroDoorPhase = "looking";
        heroDoorPhaseStartedAt = now;
        targetX = x;
        pressedArrowKeys.clear();
        buddy.classList.remove("is-behind-hero-card");
        // The whole character is mirrored while facing left, so the local
        // "left" eye offset becomes a screen-right glance on the card's left side.
        buddy.dataset.lookDirection = "left";
      }
    } else if (heroDoorPhase === "looking" && now - heroDoorPhaseStartedAt >= 650) {
      heroDoorPhase = "idle";
      heroDoorDirection = 0;
      buddy.removeAttribute("data-look-direction");
      flipCard?.classList.remove("is-door-active");
      flipCard?.style.removeProperty("--card-door-rotate");
    }

    if (mode !== "docked") {
      const bounds = mode === "hero-roam" ? heroBounds() : footerBounds();
      if (isJumping) {
        const airDirection = Number(pressedArrowKeys.has("ArrowRight")) - Number(pressedArrowKeys.has("ArrowLeft"));
        if (airDirection !== 0) {
          targetX = clamp(targetX + airDirection * 320 * dt, bounds.minX, bounds.maxX);
          facing = airDirection;
        }
      }
      targetY = bounds.y;
      targetX = clamp(targetX, bounds.minX, bounds.maxX);
    }

    const dx = targetX - x;
    const dy = targetY - y;
    const distance = Math.hypot(dx, dy);

    if (distance > 0.5) {
      const desiredSpeed = distance < DECEL_DISTANCE
        ? MAX_SPEED * Math.pow(distance / DECEL_DISTANCE, 0.6)
        : MAX_SPEED;
      currentSpeed += (desiredSpeed - currentSpeed) * Math.min(1, dt * 6);
      const step = Math.min(distance, Math.max(currentSpeed, 12) * dt);
      x += (dx / distance) * step;
      y += (dy / distance) * step;
      if (Math.abs(dx) > 1) facing = dx > 0 ? 1 : -1;
      walkPhase += currentSpeed * dt * 0.045;
      bob = Math.abs(Math.sin(walkPhase)) * 5;
      buddy.classList.add("is-walking");
    } else {
      x = targetX;
      y = targetY;
      currentSpeed = 0;
      walkPhase = 0;
      bob += (0 - bob) * Math.min(1, dt * 8);
      buddy.classList.remove("is-walking");
    }

    facingScale += (facing - facingScale) * Math.min(1, dt * 9);
    const lean = facingScale * Math.min(currentSpeed / MAX_SPEED, 1) * 6;
    const crouchTarget = pressedArrowKeys.has("ArrowDown") && !isJumping ? 1 : 0;
    crouchProgress += (crouchTarget - crouchProgress) * Math.min(1, dt * 14);
    landingImpact += (0 - landingImpact) * Math.min(1, dt * 9);
    buddy.classList.toggle("is-crouching", crouchProgress > 0.08 || landingImpact > 0.08);

    if (legLeft && legRight) {
      const swing = isJumping ? 32 : crouchProgress > 0.05 ? 42 * crouchProgress : Math.sin(walkPhase) * 20;
      legLeft.style.transform = `rotate(${swing.toFixed(2)}deg)`;
      legRight.style.transform = `rotate(${(-swing).toFixed(2)}deg)`;
    }

    const currentBuddySize = buddySize();
    const buddyFootX = x + currentBuddySize.width / 2;
    if (isJumping) {
      jumpVelocity += 3000 * dt;
      jumpOffset += jumpVelocity * dt;
      if (jumpOffset >= 0) {
        jumpOffset = 0;
        jumpVelocity = 0;
        isJumping = false;
        landingImpact = 1;
        triggerReaction("down");
        if (introHintPending) {
          introHintPending = false;
          showIntroHint();
          window.setTimeout(() => resolveHeroBuddyIntro(), HINT_BUBBLE_APPEAR_MS);
        }
      }
    }

    const buddyFootY = y - bob + jumpOffset + currentBuddySize.height * (228 / 256);
    footerLetterStates.forEach((state) => {
      const rect = state.letter.getBoundingClientRect();
      const letterX = rect.left + rect.width / 2;
      const letterY = rect.top + rect.height / 2;
      const distance = Math.hypot(letterX - buddyFootX, letterY - buddyFootY);
      const proximity = mode === "footer-roam" ? Math.max(0, 1 - distance / 170) : 0;
      const targetLift = -18 * proximity;
      const targetRotation = ((letterX - buddyFootX) / 170) * proximity * 7;
      const response = Math.min(1, dt * 10);
      state.lift += (targetLift - state.lift) * response;
      state.rotation += (targetRotation - state.rotation) * response;
      state.letter.style.transform = `translateY(${state.lift.toFixed(2)}px) rotate(${state.rotation.toFixed(2)}deg)`;
    });

    if (mode !== "docked" && heroDoorPhase === "idle") {
      updateEyeGaze(x, y - bob + jumpOffset, currentBuddySize, facingScale);
    } else {
      clearEyeGaze();
    }

    const poseScaleX = 1 + crouchProgress * 0.12 + landingImpact * 0.16;
    const poseScaleY = 1 - crouchProgress * 0.18 - landingImpact * 0.22;
    buddy.style.transform = `translate3d(${x.toFixed(2)}px, ${(y - bob + jumpOffset).toFixed(2)}px, 0) scaleX(${facingScale.toFixed(3)}) rotate(${lean.toFixed(2)}deg) scale(${poseScaleX.toFixed(3)}, ${poseScaleY.toFixed(3)})`;
    buddy.dataset.facing = facingScale < 0 ? "left" : "right";
    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
};

initHeroBuddy();

// Subtle whole-page scroll smoothing: wheel/trackpad input eases the real
// scroll position toward its target over a few frames instead of jumping
// straight to it, so section-to-section scrolling glides slightly rather
// than stepping in raw wheel increments. Kept light (high catch-up rate)
// and yields to the chapter-title glide/lock above via the shared
// data-chapter-glide flag so the two never fight over window.scrollTo.
(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (reducedMotion || !canHover) return;

  const nestedScrollSelector = ".chat-conversation-frame";
  const smoothing = 0.14;
  const settleEpsilon = 0.5;

  const maxScrollY = () => document.documentElement.scrollHeight - window.innerHeight;
  const isGlideLocked = () => "chapterGlide" in document.documentElement.dataset;

  let targetY = window.scrollY;
  let rafId = null;

  const tick = () => {
    if (isGlideLocked()) {
      rafId = null;
      return;
    }
    const current = window.scrollY;
    const next = lerp(current, targetY, smoothing);
    if (Math.abs(targetY - next) < settleEpsilon) {
      window.scrollTo({ top: targetY, behavior: "instant" });
      rafId = null;
      return;
    }
    window.scrollTo({ top: next, behavior: "instant" });
    rafId = requestAnimationFrame(tick);
  };

  window.addEventListener("wheel", (event) => {
    if (event.ctrlKey || isGlideLocked()) return;
    if (event.target.closest && event.target.closest(nestedScrollSelector)) return;

    let delta = event.deltaY;
    if (event.deltaMode === 1) delta *= 16;
    else if (event.deltaMode === 2) delta *= window.innerHeight;

    event.preventDefault();
    targetY = clamp(targetY + delta, 0, maxScrollY());
    if (rafId === null) rafId = requestAnimationFrame(tick);
  }, { passive: false });

  window.addEventListener("scroll", () => {
    if (rafId === null) targetY = window.scrollY;
  }, { passive: true });

  window.addEventListener("resize", () => {
    targetY = clamp(targetY, 0, maxScrollY());
  });

  // A stray wheel/trackpad tick right before an in-page link is clicked can
  // leave this loop chasing a stale targetY, which then fights the browser's
  // native jump to the section and cancels it outright. Release the loop on
  // anchor clicks so the native scroll isn't overridden the next frame.
  document.addEventListener("click", (event) => {
    if (!event.target.closest || !event.target.closest('a[href^="#"]')) return;
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }, true);
})();

