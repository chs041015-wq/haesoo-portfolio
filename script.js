const isFigmaCaptureMode = new URLSearchParams(window.location.search).get("figma-export") === "1";
if (isFigmaCaptureMode) document.body.classList.add("is-figma-capture");

const spiralProjectData = [
  {
    id: "project-one",
    number: "001",
    title: "Project One",
    oneLiner: "프로젝트 한 줄 설명이 들어가는 자리입니다",
    role: "Creative Developer",
    year: "2026",
    keywords: ["WebGL", "Interaction", "Direction"],
    thumbnail: "assets/clone-coding/clone-01.png",
    cta_url: "#",
  },
  {
    id: "project-two",
    number: "002",
    title: "Project Two",
    oneLiner: "브랜드의 움직임을 디지털 경험으로 확장한 프로젝트입니다",
    role: "Art Direction",
    year: "2026",
    keywords: ["Identity", "Motion", "Web"],
    thumbnail: "assets/clone-coding/clone-02.png",
    cta_url: "#",
  },
  {
    id: "project-three",
    number: "003",
    title: "Project Three",
    oneLiner: "복잡한 제품 흐름을 선명한 인터페이스로 정리했습니다",
    role: "Product Designer",
    year: "2025",
    keywords: ["Product", "System", "Prototype"],
    thumbnail: "assets/clone-coding/clone-03.png",
    cta_url: "#",
  },
  {
    id: "project-four",
    number: "004",
    title: "Project Four",
    oneLiner: "이미지와 타이포그래피가 반응하는 몰입형 웹 경험입니다",
    role: "Frontend Developer",
    year: "2025",
    keywords: ["Creative Code", "3D", "Typography"],
    thumbnail: "assets/clone-coding/clone-04.png",
    cta_url: "#",
  },
  {
    id: "project-five",
    number: "005",
    title: "Project Five",
    oneLiner: "콘텐츠 탐색을 새로운 리듬으로 설계한 포트폴리오입니다",
    role: "Design Engineer",
    year: "2024",
    keywords: ["Editorial", "Animation", "Experience"],
    thumbnail: "assets/clone-coding/clone-05.png",
    cta_url: "#",
  },
  {
    id: "project-six",
    number: "006",
    title: "Project Six",
    oneLiner: "기존 웹 경험을 분석하고 인터랙션과 레이아웃을 재구현했습니다",
    role: "Clone Coding",
    year: "2024",
    keywords: ["Rebuild", "Interaction", "Frontend"],
    thumbnail: "assets/clone-coding/clone-06.png",
    cta_url: "#",
  },
];

const cursor = document.querySelector(".cursor");
const hero = document.querySelector(".hero");
const intro = document.querySelector(".intro");
const heroTitle = document.querySelector(".hero-title");
const heroWords = [...document.querySelectorAll(".hero-word")];
const introHeading = document.querySelector(".section-heading h2");
const introCopy = document.querySelector(".intro-copy");
const introPortraitSlot = document.querySelector(".intro-portrait-slot");
const flipStack = document.querySelector(".flip-stack");
const main = document.querySelector("main");
const darkReveal = document.querySelector(".dark-reveal");
const toolContentSection = document.querySelector(".tools-content-section");
const revealContentSection = document.querySelector(".reveal-content-section");
const creamProjectsSection = document.querySelector(".works");
const aboutRevealItems = document.querySelectorAll(".about-text .word, .about-text-image");
const projectShowcaseSection = document.querySelector(".project-showcase");
const spiralSection = document.querySelector(".spiral-section");
const spiralStage = document.querySelector(".spiral-stage");
const spiralScrollShell = document.querySelector(".spiral-scroll-shell");
const spiralGrid = document.querySelector(".spiral-grid");
const spiralCanvas = document.querySelector(".spiral-webgl");
const spiralProjectCta = document.querySelector(".spiral-project-cta");
const projectOverlay = document.querySelector(".project-overlay");
const projectOverlayShade = document.querySelector(".project-overlay-shade");
const projectOverlayClose = document.querySelector(".project-overlay-close");
const projectOverlayPrev = document.querySelector(".project-overlay-prev");
const projectOverlayNext = document.querySelector(".project-overlay-next");
const projectOverlayNumber = document.querySelector(".project-overlay-number");
const projectOverlayTitle = document.querySelector(".project-overlay-title");
const projectOverlayOneLiner = document.querySelector(".project-overlay-oneliner");
const projectOverlayRole = document.querySelector(".project-overlay-role");
const projectOverlayYear = document.querySelector(".project-overlay-year");
const projectOverlayKeywords = document.querySelector(".project-overlay-keywords");
const projectOverlayCta = document.querySelector(".project-overlay-cta");
const projectOverlayRevealItems = [...document.querySelectorAll("[data-overlay-reveal]")];
const projectOverlayChrome = [projectOverlayClose, document.querySelector(".project-overlay-navigation")].filter(Boolean);
const experienceSection = document.querySelector(".experience-section");
const timelineShell = document.querySelector(".timeline-shell");
const timelineLine = document.querySelector(".timeline-line");
const timelineProgress = document.querySelector(".timeline-progress");
const experienceItems = [...document.querySelectorAll(".experience-item")];
const navTitleCurrent = document.querySelector("[data-nav-title-current]");
const navTitleNext = document.querySelector("[data-nav-title-next]");
const navTitleSections = [...document.querySelectorAll("[data-nav-title]")];
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

const initLandingEntrance = () => {
  const root = document.documentElement;
  const gsap = window.gsap;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const compactLanding = window.matchMedia("(max-width: 1279.98px)").matches;
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
    Object.entries(finalState).forEach(([property, value]) => root.style.setProperty(property, value));
    root.classList.add("landing-complete");
    return;
  }

  const entrance = gsap.timeline({
    defaults: { duration: 1.6, ease: "expo.out" },
    onComplete: () => root.classList.add("landing-complete"),
  });

  entrance.to(heroWords, {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    duration: 2.8,
    stagger: 0.25,
    ease: "expo.out",
  }, 0);

  entrance.to(root, {
    "--landing-card-opacity": 1,
    "--landing-card-y": "0px",
  }, 1);

  entrance.to(root, {
    "--landing-nav-opacity": 1,
    "--landing-nav-y": "0px",
    "--landing-detail-opacity": 1,
    "--landing-detail-y": "0px",
  }, 1.4);

  if (compactLanding) {
    entrance.to(root, { "--landing-card-rotate": "0deg" }, 2);
  }
};

const prepareTimelineWords = () => {
  const targets = document.querySelectorAll(
    ".experience-intro-text, .timeline-company, .timeline-role, .timeline-description, .timeline-date"
  );

  targets.forEach((target) => {
    if (target.dataset.wordsReady === "true") return;

    const words = target.textContent.trim().split(/\s+/);
    target.textContent = "";
    words.forEach((word) => {
      const clip = document.createElement("span");
      const inner = document.createElement("span");
      clip.className = "timeline-word-clip";
      inner.className = "timeline-word";
      inner.textContent = word;
      clip.appendChild(inner);
      target.appendChild(clip);
    });
    target.dataset.wordsReady = "true";
  });

};

const updateExperienceTimeline = () => {
  if (!timelineShell || !timelineLine || !timelineProgress || !experienceItems.length) return;

  const viewportHeight = window.innerHeight;
  const sectionRect = experienceSection?.getBoundingClientRect();
  if (sectionRect && (sectionRect.bottom < -viewportHeight * 0.25 || sectionRect.top > viewportHeight * 1.25)) {
    return;
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
    const introReveal = clamp(
      (viewportHeight * 0.9 - introRect.top) / Math.max(viewportHeight * 0.25, 1),
      0,
      1
    );
    const introWords = [...introHeading.querySelectorAll(".timeline-word")];
    const maximumIntroStagger = Math.min(introWords.length * 0.025, 0.3);

    introWords.forEach((word, index) => {
      const wordProgress = clamp(
        (introReveal - index * 0.025) / Math.max(1 - maximumIntroStagger, 0.01),
        0,
        1
      );
      const eased = easeOutCubic(wordProgress);
      word.style.opacity = eased.toFixed(4);
      word.style.transform = `translateY(${((1 - eased) * 100).toFixed(3)}%) rotateX(${((1 - eased) * -15).toFixed(3)}deg)`;
    });
  }

  experienceItems.forEach((item) => {
    const itemRect = item.getBoundingClientRect();
    const rawReveal = clamp(
      (viewportHeight * 0.82 - itemRect.top) / Math.max(viewportHeight * 0.18, 1),
      0,
      1
    );
    const content = item.querySelector(".experience-content");
    const words = [...item.querySelectorAll(".timeline-word")];
    const isNow = item.classList.contains("experience-now");
    const easedOpacity = easeOutCubic(rawReveal);

    if (isNow) {
      const nowScrollableDistance = Math.max(itemRect.height - viewportHeight, 1);
      const nowReveal = clamp(-itemRect.top / nowScrollableDistance, 0, 1);
      const maximumNowStagger = Math.min(words.length * 0.045, 0.55);
      const nowRingFill = item.querySelector(".now-progress-ring-fill");
      if (content) content.style.opacity = "1";
      item.classList.toggle("is-revealed", nowReveal > 0.02);
      item.classList.toggle("is-ring-started", nowReveal > 0.005);
      item.classList.toggle("is-ring-complete", nowReveal > 0.985);
      if (nowRingFill) {
        nowRingFill.style.strokeDashoffset = (100 - nowReveal * 100).toFixed(3);
      }

      words.forEach((word, index) => {
        const wordProgress = clamp(
          (nowReveal - index * 0.045) / Math.max(1 - maximumNowStagger, 0.01),
          0,
          1
        );
        const eased = easeOutCubic(wordProgress);
        word.style.opacity = (0.12 + eased * 0.88).toFixed(4);
        word.style.transform = `translateY(${((1 - eased) * 18).toFixed(3)}px) rotateX(0deg)`;
      });
      return;
    }

    if (content) content.style.opacity = easedOpacity.toFixed(4);

    const maximumStagger = Math.min(words.length * 0.018, 0.35);
    words.forEach((word, index) => {
      const wordProgress = clamp(
        (rawReveal - index * 0.018) / Math.max(1 - maximumStagger, 0.01),
        0,
        1
      );
      const eased = easeOutCubic(wordProgress);
      word.style.opacity = eased.toFixed(4);
      word.style.transform = `translateY(${((1 - eased) * 100).toFixed(3)}%) rotateX(${((1 - eased) * -15).toFixed(3)}deg)`;
    });
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
  const titleRect = heroTitle.getBoundingClientRect();
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
  const belowTitleY = titleRect.bottom + (compact ? 22 : 16);
  const startY = compact ? belowTitleY : window.innerHeight - cardHeight - 20;
  const heroEndY = compact ? window.innerHeight * 0.62 : window.innerHeight - cardHeight - 20;
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

const updateDarkRevealCurve = () => {
  if (!projectShowcaseSection) return;

  const rect = projectShowcaseSection.getBoundingClientRect();
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

  projectShowcaseSection.style.setProperty("--curve-height", `${height.toFixed(2)}vw`);
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
  const darkSections = [projectShowcaseSection, spiralSection, toolContentSection, experienceSection].filter(Boolean);
  if (!darkSections.length) return;

  const isActive = darkSections.some((section) => {
    const rect = section.getBoundingClientRect();
    return rect.top < window.innerHeight * 0.36 && rect.bottom > window.innerHeight * 0.36;
  });
  document.body.classList.toggle("is-spiral-active", isActive);
};

const setNavSectionTitle = (title, direction) => {
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

const initSpiralExperience = async () => {
  if (!spiralCanvas || !spiralStage || !spiralProjectData.length || spiralExperience || spiralInitializing) return;
  spiralInitializing = true;

  try {
    const THREE = await import("https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js");
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
        uv.y *= 0.91;
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
    renderer.setClearColor(0x0a0a0a, 0);
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
    let spiralLocked = false;
    let overlayMode = "spiral";
    let isTransitioning = false;
    let activeProjectIndex = 0;
    let activePlane = null;
    let hoveredPlane = null;
    let pointerDown = null;
    let suppressNextClick = false;
    let lockedScrollY = 0;
    let ghostElement = null;
    let ghostImage = null;
    let ghostDim = null;
    let ghostBaseRect = null;
    let spiralPoseSnapshots = null;
    let activeFlatPose = null;
    let activeFlatRect = null;
    let bodyLockSnapshot = null;
    let scrollLockController = null;
    let activeTransitionTimeline = null;
    let scrollAudit = {};
    let renderFrameId = null;
    let renderLoopRunning = false;
    let spiralInView = isFigmaCaptureMode;
    let spiralScrollStart = 0;
    let spiralScrollDistance = 1;
    let lastFocusedElement = null;
    const mobileQuery = window.matchMedia("(max-width: 768px)");
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    spiralProjectData.forEach((project) => {
      const image = new Image();
      image.src = project.thumbnail;
    });

    const renderOverlayProject = (projectId) => {
      const resolvedIndex = spiralProjectData.findIndex((project) => project.id === projectId);
      const project = spiralProjectData[resolvedIndex];
      if (!project || !projectOverlay) return null;

      activeProjectIndex = resolvedIndex;
      projectOverlay.dataset.projectId = project.id;
      projectOverlayNumber.textContent = project.number;
      projectOverlayTitle.textContent = project.title;
      projectOverlayOneLiner.textContent = project.oneLiner;
      projectOverlayRole.textContent = project.role;
      projectOverlayYear.textContent = project.year;
      projectOverlayCta.href = project.cta_url;
      if (ghostImage) ghostImage.src = project.thumbnail;
      projectOverlayKeywords.replaceChildren(
        ...project.keywords.map((keyword) => {
          const item = document.createElement("li");
          item.textContent = keyword;
          return item;
        })
      );
      return project;
    };

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

    const capturePlanePose = (plane) => ({
      position: plane.position.clone(),
      rotation: plane.rotation.clone(),
      scale: plane.scale.clone(),
      focusProgress: plane.material.uniforms.uFocusProgress.value,
      opacity: plane.material.uniforms.uOpacity.value,
      scrollSpeed: plane.material.uniforms.uScrollSpeed.value,
      renderOrder: plane.renderOrder,
      visible: plane.visible,
    });

    const applyPlanePose = (plane, pose) => {
      if (!plane || !pose) return;
      plane.position.copy(pose.position);
      plane.rotation.copy(pose.rotation);
      plane.scale.copy(pose.scale);
      plane.material.uniforms.uFocusProgress.value = pose.focusProgress;
      plane.material.uniforms.uOpacity.value = pose.opacity;
      plane.material.uniforms.uScrollSpeed.value = pose.scrollSpeed;
      plane.renderOrder = pose.renderOrder;
      plane.visible = pose.visible;
      plane.updateMatrixWorld(true);
    };

    const makeFlatPose = (plane) => {
      const sourcePose = spiralPoseSnapshots?.get(plane) || capturePlanePose(plane);
      return {
        position: new THREE.Vector3(0, 0, 5.1),
        rotation: new THREE.Euler(0, 0, 0, sourcePose.rotation.order),
        scale: sourcePose.scale.clone().multiplyScalar(1.12),
        focusProgress: 1,
        opacity: 1,
        scrollSpeed: 0,
        renderOrder: 100000,
        visible: true,
      };
    };

    const measurePoseRect = (plane, pose) => {
      const currentPose = capturePlanePose(plane);
      applyPlanePose(plane, pose);
      const rect = getProjectedPlaneRect(plane);
      applyPlanePose(plane, currentPose);
      return { ...rect, angle: 0 };
    };

    const setPlaneToBackgroundState = (plane) => {
      const pose = spiralPoseSnapshots?.get(plane);
      if (!pose) return;
      applyPlanePose(plane, {
        ...pose,
        position: pose.position.clone().setZ(pose.position.z - 1.25),
        scale: pose.scale.clone().multiplyScalar(0.9),
        opacity: 0,
        visible: true,
      });
    };

    const getGhostFullscreenTransform = (rect) => {
      const scale = Math.max(window.innerWidth / rect.width, window.innerHeight / rect.height);
      return {
        x: window.innerWidth * 0.5 - (rect.left + rect.width * 0.5),
        y: window.innerHeight * 0.5 - (rect.top + rect.height * 0.5),
        scale,
      };
    };

    const getGhostRectTransform = (baseRect, targetRect) => ({
      x: targetRect.left + targetRect.width * 0.5 - (baseRect.left + baseRect.width * 0.5),
      y: targetRect.top + targetRect.height * 0.5 - (baseRect.top + baseRect.height * 0.5),
      scaleX: targetRect.width / Math.max(baseRect.width, 1),
      scaleY: targetRect.height / Math.max(baseRect.height, 1),
      rotation: targetRect.angle,
      borderRadius: targetRect.borderRadius,
    });

    const setGhostBaseRect = (rect, fullscreen = false) => {
      if (!ghostElement || !rect) return;
      ghostBaseRect = rect;
      gsap.set(ghostElement, {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        transformOrigin: "50% 50%",
      });

      if (fullscreen) {
        const target = getGhostFullscreenTransform(rect);
        gsap.set(ghostElement, {
          x: target.x,
          y: target.y,
          scale: target.scale,
          rotation: 0,
          borderRadius: 0,
        });
      } else {
        gsap.set(ghostElement, {
          x: 0,
          y: 0,
          scale: 1,
          rotation: rect.angle,
          borderRadius: rect.borderRadius,
        });
      }
    };

    const prepareGhost = (project, rect) => {
      ghostDim = document.createElement("div");
      ghostDim.className = "project-transition-dim";
      ghostDim.setAttribute("aria-hidden", "true");
      ghostElement = document.createElement("div");
      ghostElement.className = "project-transition-ghost";
      ghostElement.setAttribute("aria-hidden", "true");
      ghostImage = document.createElement("img");
      ghostImage.alt = "";
      ghostImage.draggable = false;
      ghostImage.src = project.thumbnail;
      ghostElement.append(ghostImage);
      document.body.append(ghostDim);
      gsap.set(ghostDim, { opacity: 0 });
      setGhostBaseRect(rect);
      gsap.set(ghostElement, { visibility: "hidden" });
    };

    const mountGhostOverPlane = () => {
      if (!ghostElement || !activePlane) return;
      document.body.append(ghostElement);
      gsap.set(ghostElement, { visibility: "visible" });
      activePlane.visible = false;
      renderer.render(scene, camera);
    };

    const removeGhost = () => {
      if (ghostElement) gsap.killTweensOf([ghostElement, ghostImage]);
      if (ghostDim) gsap.killTweensOf(ghostDim);
      ghostElement?.remove();
      ghostDim?.remove();
      ghostElement = null;
      ghostImage = null;
      ghostDim = null;
      ghostBaseRect = null;
    };

    const getBestPlaneForProject = (projectId) => {
      let bestPlane = null;
      let bestScore = Number.POSITIVE_INFINITY;

      planes.forEach((plane) => {
        if (plane.userData.projectId !== projectId) return;
        const projected = plane.position.clone().project(camera);
        const outsidePenalty = Math.abs(projected.x) > 1.15 || Math.abs(projected.y) > 1.15 ? 100 : 0;
        const score = outsidePenalty + Math.abs(projected.x) * 0.8 + Math.abs(projected.y) + projected.z * 0.15;
        if (score < bestScore) {
          bestScore = score;
          bestPlane = plane;
        }
      });

      return bestPlane || planes.find((plane) => plane.userData.projectId === projectId);
    };

    const lockPage = () => {
      if (bodyLockSnapshot) return;

      const body = document.body;
      lockedScrollY = window.scrollY;
      scrollAudit = { beforeLock: lockedScrollY };
      bodyLockSnapshot = { scrollY: lockedScrollY };
      body.dataset.scrollY = String(lockedScrollY);
      scrollLockController = new AbortController();
      const listenerOptions = { passive: false, signal: scrollLockController.signal };
      const preventScroll = (event) => event.preventDefault();
      const preventScrollKey = (event) => {
        if (!["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) return;
        if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
        event.preventDefault();
      };
      window.addEventListener("wheel", preventScroll, listenerOptions);
      window.addEventListener("touchmove", preventScroll, listenerOptions);
      document.addEventListener("keydown", preventScrollKey, { signal: scrollLockController.signal });
      document.documentElement.classList.add("is-project-open");
      document.body.classList.add("is-project-open");
      scrollAudit.afterLock = window.scrollY;
      console.debug("[project-transition] scroll lock", { ...scrollAudit });
    };

    const unlockPage = () => {
      if (!bodyLockSnapshot) return;

      const body = document.body;
      const restoreY = Number(body.dataset.scrollY || lockedScrollY);
      scrollAudit.beforeUnlock = window.scrollY;
      scrollLockController?.abort();
      scrollLockController = null;
      document.documentElement.classList.remove("is-project-open");
      body.classList.remove("is-project-open");
      delete body.dataset.scrollY;
      if (Math.abs(window.scrollY - restoreY) > 0.5) {
        const root = document.documentElement;
        const previousScrollBehavior = root.style.scrollBehavior;
        root.style.scrollBehavior = "auto";
        window.scrollTo({ top: restoreY, left: 0, behavior: "instant" });
        root.style.scrollBehavior = previousScrollBehavior;
      }
      bodyLockSnapshot = null;
      scrollAudit.afterUnlock = window.scrollY;
      console.debug("[project-transition] scroll unlock", { ...scrollAudit });
    };

    const setOverlayInteractive = (interactive) => {
      projectOverlay?.classList.toggle("is-interactive", interactive);
      projectOverlay?.setAttribute("aria-busy", String(!interactive));
    };

    const finishOpening = () => {
      overlayMode = "open";
      activeTransitionTimeline = null;
      const reducedMotion = reducedMotionQuery.matches;

      isTransitioning = false;
      setOverlayInteractive(true);
      projectOverlayClose?.focus({ preventScroll: true });

      gsap.to(projectOverlayRevealItems, {
        opacity: 1,
        y: 0,
        duration: reducedMotion ? 0.18 : 0.48,
        stagger: reducedMotion ? 0.03 : 0.1,
        ease: "power3.out",
      });
    };

    const addPlanePoseTween = (timeline, plane, pose, start, duration, ease) => {
      timeline.to(plane.position, {
        x: pose.position.x,
        y: pose.position.y,
        z: pose.position.z,
        duration,
        ease,
      }, start);
      timeline.to(plane.rotation, {
        x: pose.rotation.x,
        y: pose.rotation.y,
        z: pose.rotation.z,
        duration,
        ease,
      }, start);
      timeline.to(plane.scale, {
        x: pose.scale.x,
        y: pose.scale.y,
        z: pose.scale.z,
        duration,
        ease,
      }, start);
      timeline.to(plane.material.uniforms.uFocusProgress, {
        value: pose.focusProgress,
        duration,
        ease,
      }, start);
      timeline.to(plane.material.uniforms.uOpacity, {
        value: pose.opacity,
        duration,
        ease,
      }, start);
      timeline.to(plane.material.uniforms.uScrollSpeed, {
        value: pose.scrollSpeed,
        duration,
        ease,
      }, start);
    };

    const openProject = (plane) => {
      if (!gsap || !plane || mobileQuery.matches || overlayMode !== "spiral" || isTransitioning) return;

      const reducedMotion = reducedMotionQuery.matches;
      const project = renderOverlayProject(plane.userData.projectId);
      if (!project) return;
      isTransitioning = true;
      overlayMode = "opening";
      spiralLocked = true;
      activePlane = plane;
      lastFocusedElement = document.activeElement;
      stopSpiralLoop();
      spiralPoseSnapshots = new Map(planes.map((item) => [item, capturePlanePose(item)]));
      activeFlatPose = makeFlatPose(activePlane);
      activeFlatRect = measurePoseRect(activePlane, activeFlatPose);
      prepareGhost(project, activeFlatRect);
      lockPage();

      projectOverlay.classList.add("is-visible");
      projectOverlay.setAttribute("aria-hidden", "false");
      setOverlayInteractive(false);
      gsap.killTweensOf([
        projectOverlay,
        projectOverlayShade,
        ...projectOverlayRevealItems,
        ...projectOverlayChrome,
      ]);
      gsap.set(projectOverlay, { opacity: 1 });
      gsap.set(projectOverlayShade, { opacity: 0 });
      gsap.set(projectOverlayRevealItems, { opacity: 0, y: reducedMotion ? 0 : 24 });
      gsap.set(projectOverlayChrome, { opacity: 0 });

      activePlane.renderOrder = activeFlatPose.renderOrder;
      const timeline = gsap.timeline({ onComplete: finishOpening });
      activeTransitionTimeline = timeline;
      timeline.eventCallback("onUpdate", () => renderer.render(scene, camera));
      timeline.to(ghostDim, { opacity: 0.6, duration: reducedMotion ? 0.24 : 0.95, ease: "power2.inOut" }, 0);
      if (spiralGrid) timeline.to(spiralGrid, {
        opacity: 0.08,
        scale: 0.94,
        duration: reducedMotion ? 0.24 : 0.72,
        ease: "power2.inOut",
      }, 0);

      if (reducedMotion) {
        const target = getGhostFullscreenTransform(ghostBaseRect);
        mountGhostOverPlane();
        gsap.set(ghostElement, {
          x: target.x,
          y: target.y,
          scale: target.scale,
          rotation: 0,
          borderRadius: 0,
          opacity: 0,
        });
        timeline.to(ghostElement, { opacity: 1, duration: 0.24 }, 0);
      } else {
        planes.forEach((item) => {
          if (item === activePlane) return;
          const pose = spiralPoseSnapshots.get(item);
          const backgroundPose = {
            ...pose,
            position: pose.position.clone().setZ(pose.position.z - 1.25),
            scale: pose.scale.clone().multiplyScalar(0.9),
            opacity: 0,
          };
          addPlanePoseTween(timeline, item, backgroundPose, 0, 0.58, "power2.inOut");
        });
        addPlanePoseTween(timeline, activePlane, activeFlatPose, 0, 0.42, "power2.inOut");

        const target = getGhostFullscreenTransform(ghostBaseRect);
        timeline.add(mountGhostOverPlane, 0.42);
        timeline.to(ghostElement, {
          x: target.x,
          y: target.y,
          scale: target.scale,
          rotation: 0,
          borderRadius: 0,
          duration: 0.53,
          ease: "power3.out",
        }, 0.42);
      }
      timeline.to(projectOverlayShade, { opacity: 1, duration: reducedMotion ? 0.2 : 0.2 }, reducedMotion ? 0.04 : 0.75);
      timeline.to(projectOverlayChrome, { opacity: 1, duration: 0.2, stagger: 0.04 }, reducedMotion ? 0.04 : 0.76);
    };

    const selectActivePlane = (projectId) => {
      if (activePlane) setPlaneToBackgroundState(activePlane);
      activePlane = getBestPlaneForProject(projectId);
      if (!activePlane) return;
      activeFlatPose = makeFlatPose(activePlane);
      activeFlatRect = measurePoseRect(activePlane, activeFlatPose);
      setPlaneToBackgroundState(activePlane);
      activePlane.visible = false;
      setGhostBaseRect(activeFlatRect, true);
      renderer.render(scene, camera);
    };

    const navigateProject = (direction) => {
      if (!gsap || overlayMode !== "open" || isTransitioning) return;

      const reducedMotion = reducedMotionQuery.matches;
      const nextIndex = (activeProjectIndex + direction + spiralProjectData.length) % spiralProjectData.length;
      const nextProject = spiralProjectData[nextIndex];
      isTransitioning = true;
      setOverlayInteractive(false);

      gsap.timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: () => {
          isTransitioning = false;
          setOverlayInteractive(true);
        },
      })
        .to(projectOverlayRevealItems, {
          opacity: 0,
          y: reducedMotion ? 0 : -16,
          duration: reducedMotion ? 0.16 : 0.25,
          stagger: 0.025,
        }, 0)
        .to(ghostImage, { opacity: 0, scale: 1.02, duration: reducedMotion ? 0.18 : 0.3 }, 0)
        .add(() => {
          selectActivePlane(nextProject.id);
          renderOverlayProject(nextProject.id);
          gsap.set(ghostImage, { opacity: 0, scale: 1.02 });
          gsap.set(projectOverlayRevealItems, { opacity: 0, y: reducedMotion ? 0 : 24 });
        }, reducedMotion ? 0.18 : 0.3)
        .to(ghostImage, { opacity: 1, scale: 1, duration: reducedMotion ? 0.2 : 0.4 }, reducedMotion ? 0.18 : 0.3)
        .to(projectOverlayRevealItems, {
          opacity: 1,
          y: 0,
          duration: reducedMotion ? 0.18 : 0.42,
          stagger: reducedMotion ? 0.025 : 0.1,
          ease: "power3.out",
        }, reducedMotion ? 0.22 : 0.4);
    };

    const resetOverlay = () => {
      activeTransitionTimeline?.kill();
      activeTransitionTimeline = null;
      spiralPoseSnapshots?.forEach((pose, plane) => applyPlanePose(plane, pose));
      if (spiralGrid) gsap.set(spiralGrid, { clearProps: "opacity,transform" });
      gsap.set(projectOverlay, { opacity: 0 });
      gsap.set(projectOverlayShade, { opacity: 0 });
      gsap.set(projectOverlayRevealItems, { opacity: 0, y: 24 });
      gsap.set(projectOverlayChrome, { opacity: 0 });
      projectOverlay.classList.remove("is-visible", "is-interactive");
      projectOverlay.setAttribute("aria-hidden", "true");
      projectOverlay.removeAttribute("aria-busy");
      overlayMode = "spiral";
      isTransitioning = false;
      spiralLocked = false;
      hoveredPlane = null;
      spiralCanvas.classList.remove("is-project-hover");
      renderer.render(scene, camera);
      removeGhost();
      unlockPage();
      spiralPoseSnapshots = null;
      activeFlatPose = null;
      activeFlatRect = null;
      activePlane = null;
      syncSpiralLoop();
      requestHeroCardUpdate();
      (lastFocusedElement instanceof HTMLElement ? lastFocusedElement : spiralCanvas).focus({ preventScroll: true });
    };

    const closeProject = () => {
      if (!gsap || overlayMode !== "open" || isTransitioning) return;

      const reducedMotion = reducedMotionQuery.matches;
      const returnPose = activePlane ? spiralPoseSnapshots?.get(activePlane) : null;
      const returnRect = activePlane && returnPose ? measurePoseRect(activePlane, returnPose) : null;
      isTransitioning = true;
      overlayMode = "closing";
      setOverlayInteractive(false);
      gsap.killTweensOf(projectOverlayRevealItems);

      const timeline = gsap.timeline({
        onComplete: resetOverlay,
      });
      activeTransitionTimeline = timeline;
      timeline.eventCallback("onUpdate", () => renderer.render(scene, camera));

      timeline.to(projectOverlayRevealItems, {
        opacity: 0,
        duration: reducedMotion ? 0.14 : 0.22,
        stagger: 0.02,
      }, 0);
      timeline.to(projectOverlayChrome, { opacity: 0, duration: 0.16 }, 0);
      timeline.to(projectOverlayShade, { opacity: 0, duration: 0.18 }, 0);
      timeline.to(ghostDim, { opacity: 0, duration: reducedMotion ? 0.24 : 0.95, ease: "power2.inOut" }, 0);
      if (spiralGrid) timeline.to(spiralGrid, {
        opacity: 0.42,
        scale: 1,
        duration: reducedMotion ? 0.24 : 0.72,
        ease: "power2.inOut",
      }, reducedMotion ? 0 : 0.23);

      if (reducedMotion || !returnRect || !returnPose || !ghostBaseRect) {
        timeline.to(ghostElement, { opacity: 0, duration: 0.24 }, 0);
      } else {
        const returnTransform = getGhostRectTransform(ghostBaseRect, returnRect);
        timeline.to(ghostElement, {
          ...returnTransform,
          duration: 0.95,
          ease: "power3.inOut",
        }, 0);
        timeline.add(() => {
          applyPlanePose(activePlane, returnPose);
          renderer.render(scene, camera);
          gsap.set(ghostElement, { visibility: "hidden" });
        }, 0.95);

        planes.forEach((item) => {
          if (item === activePlane) return;
          const pose = spiralPoseSnapshots.get(item);
          addPlanePoseTween(timeline, item, pose, 0.2, 0.75, "power3.out");
        });
      }
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

      if (activePlane && ghostElement && overlayMode === "open") {
        setGhostBaseRect(getProjectedPlaneRect(activePlane), true);
        renderer.render(scene, camera);
      }
    };

    const render = () => {
      if (!renderLoopRunning) return;
      const progress = clamp((window.scrollY - spiralScrollStart) / spiralScrollDistance, 0, 1);
      const targetOffset = progress * planes.length;
      currentOffset = lerp(currentOffset, targetOffset, 0.1);
      if (Math.abs(targetOffset - currentOffset) < 0.0005) currentOffset = targetOffset;
      const scrollSpeed = currentOffset - previousOffset;
      previousOffset = currentOffset;
      const centerIndex = Math.floor(planes.length / 2);
      const fadeRange = 1.65;

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
      });

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

    projectOverlayClose?.addEventListener("click", closeProject);
    projectOverlayPrev?.addEventListener("click", () => navigateProject(-1));
    projectOverlayNext?.addEventListener("click", () => navigateProject(1));
    projectOverlayCta?.addEventListener("click", (event) => {
      if (projectOverlayCta.getAttribute("href") === "#") event.preventDefault();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeProject();
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
      openProjectById: (projectId) => openProject(getBestPlaneForProject(projectId)),
      closeProject,
      navigateProject,
      getState: () => ({
        overlayMode,
        isTransitioning,
        activeProjectIndex,
        spiralLocked,
        lockedScrollY,
        scrollAudit: { ...scrollAudit },
      }),
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
    updateDarkRevealCurve();
    updateCreamExitCurve();
    updateAboutRevealText();
    updateSpiralNavState();
    updateNavSectionTitle();
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
    cursorFrame = null;
  });
});

window.addEventListener("scroll", requestHeroCardUpdate, { passive: true });
window.addEventListener("resize", () => {
  heroCardDock = null;
  requestHeroCardUpdate();
});
prepareProfileTyping();
updateHeroCard();
initLandingEntrance();
updateDarkRevealCurve();
updateCreamExitCurve();
updateAboutRevealText();
updateSpiralNavState();
updateNavSectionTitle();
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
