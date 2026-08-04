const isFigmaCaptureMode = new URLSearchParams(window.location.search).get("figma-export") === "1";
if (isFigmaCaptureMode) document.body.classList.add("is-figma-capture");

const spiralProjectData = [
  {
    id: "project-one",
    number: "001",
    title: "Project One",
    oneLiner: "기획 단계부터 참여해 WebGL 기반의 인터랙션과 디렉션을 완성했습니다.",
    role: "Creative Developer",
    year: "2026",
    keywords: ["WebGL", "Interaction", "Direction"],
    thumbnail: "assets/clone-coding/clone-01.png",
    cta_url: "https://clonecoding1.vercel.app/",
  },
  {
    id: "project-two",
    number: "002",
    title: "Project Two",
    oneLiner: "브랜드의 정체성을 모션과 웹 경험으로 확장한 프로젝트입니다.",
    role: "Art Direction",
    year: "2026",
    keywords: ["Identity", "Motion", "Web"],
    thumbnail: "assets/clone-coding/clone-02.png",
    cta_url: "https://clonecoding2.vercel.app/",
  },
  {
    id: "project-three",
    number: "003",
    title: "Project Three",
    oneLiner: "복잡한 제품 흐름을 직관적인 인터페이스로 정리했습니다.",
    role: "Product Designer",
    year: "2025",
    keywords: ["Product", "System", "Prototype"],
    thumbnail: "assets/clone-coding/clone-03.png",
    cta_url: "https://clonecoding3.vercel.app/",
  },
  {
    id: "project-four",
    number: "004",
    title: "Project Four",
    oneLiner: "이미지와 타이포그래피가 반응하는 몰입형 웹 경험입니다.",
    role: "Frontend Developer",
    year: "2025",
    keywords: ["Creative Code", "3D", "Typography"],
    thumbnail: "assets/clone-coding/clone-04.png",
    cta_url: "https://clonecoding4.vercel.app/",
  },
  {
    id: "project-five",
    number: "005",
    title: "Project Five",
    oneLiner: "콘텐츠의 흐름을 애니메이션 기반 인터랙션으로 설계했습니다.",
    role: "Design Engineer",
    year: "2024",
    keywords: ["Editorial", "Animation", "Experience"],
    thumbnail: "assets/clone-coding/clone-05.png",
    cta_url: "https://clonecoding5.vercel.app/",
  },
  {
    id: "project-six",
    number: "006",
    title: "Project Six",
    oneLiner: "기존 사이트의 구조와 인터랙션을 분석하고 다시 구현했습니다.",
    role: "Clone Coding",
    year: "2024",
    keywords: ["Rebuild", "Interaction", "Frontend"],
    thumbnail: "assets/clone-coding/clone-06.png",
    cta_url: "https://clonecodiing6.vercel.app/",
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
const projectOverlay = document.querySelector(".project-overlay");

if (spiralProjectCta && spiralProjectCta.parentElement !== document.body) {
  document.body.appendChild(spiralProjectCta);
}

revealTranslationLines.forEach((line) => {
  const englishWords = [...line.querySelectorAll(".reveal-language-en .word")];

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

const initLandingEntrance = async () => {
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
    heading.prepend(ui);
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
  const titleGroups = [
    ...headings.map((heading) => ({
      trigger: heading,
      letters: [...heading.querySelectorAll(".code-display-letter")],
    })),
    ...standaloneTitles.map((title) => ({
      trigger: title,
      letters: [...title.querySelectorAll(".scroll-title-letter")],
    })),
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

  if (reducedMotion || !gsap) {
    titleGroups.forEach(({ letters }) => {
      letters.forEach((letter) => { letter.style.transform = "none"; });
    });
  }

  const paint = () => {
    titleGroups.forEach((group) => {
      const rect = group.trigger.getBoundingClientRect();
      if (rect.top < window.innerHeight * titleRevealLine) {
        revealTitleGroup(group);
      }
    });

    headings.forEach((heading) => {
      const rect = heading.getBoundingClientRect();
      if (heading.classList.contains("project-section-title")) {
        const exitProgress = reducedMotion
          ? 0
          : clamp(-rect.top / Math.max(rect.height * 0.52, 1), 0, 1);
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

        heading.style.setProperty("--chapter-exit-progress", exitProgress.toFixed(4));
        content?.style.setProperty("--chapter-content-progress", contentProgress.toFixed(4));
      }
    });
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

      if (!document.documentElement.classList.contains("hero-title-ready")) {
        resetLetters();
        return;
      }

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
initCodeSectionTitles();
updateHeroCard();
initHeroLetterInteraction();
initContactLinkInteraction();
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

const playgroundProjects = [
  {
    variant: "aqua",
    image: "assets/project1/figma/project-left.png",
    title: "K브랜드 웹사이트 리뉴얼 팀프로젝트",
    brand: "aqua planet",
    logos: ["assets/project1/logos/aqua.svg", "assets/project1/logos/planet.svg"],
    duration: "2026.06.04 - 2026.07.03",
    built: "랜딩·마린랩·티켓 페이지 개발을 맡고, 전 페이지가 공유하는 인터랙션 시스템을 설계했습니다",
    description: "이 프로젝트에서 프론트엔드 개발자로서 랜딩, 마린랩, 티켓 예매 페이지 구현을 담당했습니다. Three.js 기반 3D 크루 캐러셀과 커스텀 커서, GNB, 버블 인터랙션 등 공통 컴포넌트를 설계하고 성능·QA 작업과 배포까지 완료했습니다.",
    contribution: "기획 60%　 디자인 70%　 개발 90%",
    website: "https://ezen-aquaplanet-project.vercel.app/",
    proposal: "https://www.figma.com/proto/RNZVS2U4p1upluVvq78tTL/personal?page-id=237%3A398&node-id=237-1640&viewport=612%2C783%2C0.08&t=Y3y3Dgch0k1oZkVg-1&scaling=min-zoom&content-scaling=fixed",
  },
  {
    variant: "layer",
    image: "assets/project1/figma/project-center.png",
    title: "AI 챗봇 커뮤니티 프로젝트",
    brand: "Layer",
    logos: ["assets/project1/logos/layer.svg"],
    duration: "2026.07.04 - 2026.07.29",
    built: "온보딩과 홈을 메인으로 개발하고, 앱 전반의 기능 구현과 더미데이터 설계를 담당했습니다",
    description: "React와 Tailwind CSS를 기반으로 앱 전반의 기능을 구현했고, 향수·브랜드·챌린지·매장 서비스의 더미데이터 설계, 이미지 AVIF 변환을 통한 성능 최적화, PC 프레임과 스타일 가이드 제작까지 담당했습니다.",
    contribution: "기획 70%　 디자인 70%　 개발 90%",
    website: "https://ezen-layerproject.vercel.app/",
    proposal: "https://www.figma.com/proto/RNZVS2U4p1upluVvq78tTL/personal?page-id=237%3A5040&node-id=237-5053&viewport=690%2C571%2C0.03&t=DIbfmwmD9cwUu7El-1&scaling=min-zoom&content-scaling=fixed",
  },
  {
    variant: "moa",
    image: "assets/project1/figma/project-right.png",
    title: "선택을 돕는 질문형 결정 도우미 앱",
    brand: "모아",
    logos: ["assets/project1/logos/moa.svg"],
    duration: "2026.03.26 - 2026.05.29",
    built: "사용자가 스스로 기준을 찾도록, UX 설계부터 디자인·개발까지 전 과정을 직접 담당했습니다",
    description: "질문에 답하며 스스로 선택 기준을 찾는 서비스를 기획했습니다. 캐릭터와 파스텔 컬러로 친근하게 디자인하고 React와 Vite로 전체 서비스를 개발했으며, PWA 대응과 모바일 뷰포트 최적화까지 1인으로 진행했습니다.",
    contribution: "기획 100%　 디자인 100%　 개발 100%",
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

  const cardCount = playgroundProjects.length;
  for (let index = 0; index < cardCount; index += 1) {
    const project = playgroundProjects[index % playgroundProjects.length];
    const card = document.createElement("article");
    card.className = "playground-card";
    card.dataset.detailCard = "true";
    card.dataset.characterVariant = project.variant;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `${project.title} 카드 앞면 보기`);
    card.setAttribute("aria-pressed", "false");
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
        <div class="playground-card-duration"><span>DURATION</span><b>${project.duration}</b></div>
        <div class="playground-card-built"><span>WHAT I BUILT</span><b>“ ${project.built} ”</b></div>
        <p>${project.description}</p>
        <div class="playground-card-contribution">${project.contribution}</div>
        <div class="playground-card-actions" aria-label="프로젝트 링크">
          <a href="${project.website}" target="_blank" rel="noopener noreferrer">WEBSITE ↗</a>
          <a href="${project.proposal}" target="_blank" rel="noopener noreferrer">PROPOSAL ↗</a>
        </div>
      </div>`;

    front.appendChild(img);
    inner.append(front, back);
    card.appendChild(inner);
    row.appendChild(card);

    const toggleFocusedCardFace = () => {
      if (!card.classList.contains("is-focused")) return;
      const showFront = card.dataset.manualFront !== "true";
      card.dataset.manualFront = String(showFront);
      card.classList.toggle("is-manual-front", showFront);
      card.setAttribute("aria-pressed", String(showFront));
      card.setAttribute("aria-label", `${project.title} 카드 ${showFront ? "뒷면" : "앞면"} 보기`);
      card.style.setProperty("--playground-flip", showFront ? "360deg" : "180deg");
      front.setAttribute("aria-hidden", String(!showFront));
      back.setAttribute("aria-hidden", String(showFront));
      back.querySelectorAll("a").forEach((link) => { link.tabIndex = showFront ? -1 : 0; });
    };

    card.addEventListener("click", toggleFocusedCardFace);
    card.addEventListener("keydown", (event) => {
      if (event.target.closest("a")) return;
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      toggleFocusedCardFace();
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
  const getIntroDistance = () => Math.min(window.innerHeight * 0.78, 680);
  const getOutroDistance = () => Math.min(window.innerHeight * 0.72, 620);

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
    const outroStart = scrollTimelineLength - getOutroDistance();
    const outroProgress = clamp((scrollDistance - outroStart) / getOutroDistance(), 0, 1);
    targetRowShift = getShiftWithCardHolds(scrollDistance);
    currentRowShift += (targetRowShift - currentRowShift) * 0.105;
    if (Math.abs(targetRowShift - currentRowShift) < 0.08) currentRowShift = targetRowShift;
    row.style.transform = `translate3d(${(-currentRowShift).toFixed(2)}px, 0, 0)`;

    const cameraRect = camera.getBoundingClientRect();
    const cameraCenter = cameraRect.left + cameraRect.width / 2;
    const flipRange = Math.min(cameraRect.width * 0.3, 430);
    let strongestFocus = 0;
    [...row.children].forEach((card) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const distanceFromCenter = cardCenter - cameraCenter;
      const rawFlipProgress = clamp((flipRange - distanceFromCenter) / (flipRange * 2), 0, 1);
      const rawFocusProgress = clamp(1 - Math.abs(distanceFromCenter) / flipRange, 0, 1);
      if (card.classList.contains("playground-card--decorative")) {
        card.style.setProperty("--playground-focus-scale", "0.88");
        card.style.setProperty("--playground-flip", "0deg");
        card.style.setProperty("--playground-focus", "0");
        card.style.zIndex = "1";
        return;
      }
      let flipProgress = rawFlipProgress * introProgress;
      const focusProgress = rawFocusProgress * introProgress;
      const isLastDetailCard = card === row.querySelector('[data-detail-card="true"]:last-of-type');
      if (isLastDetailCard && outroProgress > 0) {
        const outroFlipProgress = clamp(outroProgress / 0.72, 0, 1);
        flipProgress = 0.5 + outroFlipProgress * 0.5;
      }
      strongestFocus = Math.max(strongestFocus, focusProgress);
      const baseRotation = Number(card.dataset.baseRotation) || 0;
      const isFocused = focusProgress > 0.72;
      let isManuallyFront = card.dataset.manualFront === "true";
      if (isManuallyFront && focusProgress <= 0.02) {
        delete card.dataset.manualFront;
        card.classList.remove("is-manual-front");
        card.setAttribute("aria-pressed", "false");
        isManuallyFront = false;
      }
      const flipRotation = isManuallyFront ? 360 : flipProgress * 360;
      const isBackVisible = !isManuallyFront && flipProgress > 0.25 && flipProgress < 0.75;

      card.style.setProperty("--playground-current-rotate", `${(baseRotation * (1 - focusProgress)).toFixed(3)}deg`);
      const introCenteredScale = rawFocusProgress * (1 - introProgress) * 0.12;
      card.style.setProperty("--playground-focus-scale", (0.88 + focusProgress * 0.32 + introCenteredScale).toFixed(4));
      card.style.setProperty("--playground-flip", `${flipRotation.toFixed(2)}deg`);
      card.style.setProperty("--playground-focus", focusProgress.toFixed(4));
      card.style.zIndex = String(1 + Math.round(focusProgress * 10));
      card.classList.toggle("is-focused", isFocused);
      card.tabIndex = isFocused ? 0 : -1;
      card.querySelector(".playground-card-front")?.setAttribute("aria-hidden", String(isBackVisible));
      card.querySelector(".playground-card-back")?.setAttribute("aria-hidden", String(!isBackVisible));
      card.querySelectorAll(".playground-card-actions a").forEach((link) => { link.tabIndex = isBackVisible ? 0 : -1; });
    });
    row.classList.toggle("has-focused-card", strongestFocus > 0.72);

    const trackRect = track.getBoundingClientRect();
    const buddy = document.querySelector("#hero-buddy");
    if (buddy && trackRect.bottom > 0 && trackRect.top < window.innerHeight) {
      const activeCard = [...row.children].reduce((nearest, card) => {
        const rect = card.getBoundingClientRect();
        const distance = Math.abs(rect.left + rect.width / 2 - cameraCenter);
        return !nearest || distance < nearest.distance ? { card, distance } : nearest;
      }, null)?.card;
      if (activeCard?.dataset.characterVariant) {
        setCharacterVariant(buddy, activeCard.dataset.characterVariant);
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

const openChatbot = () => {
  // Stub — wire up the real chat panel later.
  console.log("open chatbot");
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
  if (!buddy || !heroSection || !footerSection) return;

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
  const pressedArrowKeys = new Set();

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
  }
  buddy.style.transform = `translate3d(${x}px, ${y + jumpOffset}px, 0) scaleX(${facing})`;
  buddy.dataset.facing = facing < 0 ? "left" : "right";
  scheduleBlink();

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
    if (event.key.startsWith("Arrow")) pressedArrowKeys.add(event.key);
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

  buddy.addEventListener("click", openChatbot);

  let nextHint = "dpad";
  buddy.addEventListener("pointerenter", () => {
    buddy.dataset.hint = nextHint;
    nextHint = nextHint === "dpad" ? "chat" : "dpad";
  });

  window.addEventListener("resize", resolveMode);

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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
      flipCard?.classList.remove("is-door-active");
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

    const poseScaleX = 1 + crouchProgress * 0.12 + landingImpact * 0.16;
    const poseScaleY = 1 - crouchProgress * 0.18 - landingImpact * 0.22;
    buddy.style.transform = `translate3d(${x.toFixed(2)}px, ${(y - bob + jumpOffset).toFixed(2)}px, 0) scaleX(${facingScale.toFixed(3)}) rotate(${lean.toFixed(2)}deg) scale(${poseScaleX.toFixed(3)}, ${poseScaleY.toFixed(3)})`;
    buddy.dataset.facing = facingScale < 0 ? "left" : "right";
    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
};

initHeroBuddy();

