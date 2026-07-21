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
const introHeading = document.querySelector(".section-heading h2");
const introCopy = document.querySelector(".intro-copy");
const introPortraitSlot = document.querySelector(".intro-portrait-slot");
const flipStack = document.querySelector(".flip-stack");
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
const timelineProgress = document.querySelector(".timeline-progress");
const experienceItems = [...document.querySelectorAll(".experience-item")];
const navTitleCurrent = document.querySelector("[data-nav-title-current]");
const navTitleNext = document.querySelector("[data-nav-title-next]");
const navTitleSections = [...document.querySelectorAll("[data-nav-title]")];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const easeOutCubic = (value) => 1 - Math.pow(1 - value, 3);
const lerp = (start, end, progress) => start + (end - start) * progress;
let ticking = false;
let spiralExperience = null;
let spiralInitializing = false;
let activeNavTitle = navTitleCurrent?.textContent.trim() || "Haesoo";
let navTitleTimeline = null;
let previousNavScrollY = window.scrollY;

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
  if (!timelineShell || !timelineProgress || !experienceItems.length) return;

  const viewportHeight = window.innerHeight;
  const sectionRect = experienceSection?.getBoundingClientRect();
  if (sectionRect && (sectionRect.bottom < -viewportHeight * 0.25 || sectionRect.top > viewportHeight * 1.25)) {
    return;
  }

  const shellRect = timelineShell.getBoundingClientRect();
  const timelineProgressValue = clamp(
    (viewportHeight * 0.65 - shellRect.top) / Math.max(shellRect.height, 1),
    0,
    1
  );

  timelineProgress.style.height = `${(timelineProgressValue * 100).toFixed(4)}%`;

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
    const easedOpacity = easeOutCubic(rawReveal);

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

const updateHeroCard = () => {
  if (!hero || !intro || !heroTitle || !introHeading || !introCopy || !flipStack) return;

  const scrollY = window.scrollY;
  if (scrollY > intro.offsetTop + intro.offsetHeight + window.innerHeight * 0.5) {
    document.documentElement.style.setProperty("--card-opacity", "0");
    document.documentElement.style.setProperty("--hero-meta-opacity", "0");
    return;
  }

  const cardHeight = flipStack.offsetHeight;
  const compact = window.innerWidth <= 840;
  const titleRect = heroTitle.getBoundingClientRect();
  const copyRect = introCopy.getBoundingClientRect();
  const heroFlipEnd = Math.max(intro.offsetTop * 0.78, 1);
  const introTop = intro.offsetTop;
  const introTravelEnd = introTop + window.innerHeight * (compact ? 0.24 : 0.2);
  const travelStart = compact ? 0 : window.innerHeight * 0.65;
  const flipProgress = compact ? easeOutCubic(clamp(scrollY / heroFlipEnd, 0, 1)) : clamp(scrollY / heroFlipEnd, 0, 1);
  const travelProgress = easeOutCubic(clamp((scrollY - travelStart) / Math.max(introTravelEnd - travelStart, 1), 0, 1));
  const desktopFade = clamp((scrollY - (introTop + window.innerHeight * 0.62)) / (window.innerHeight * 0.24), 0, 1);
  const mobileFade = clamp((scrollY - (introTop - window.innerHeight * 0.72)) / (window.innerHeight * 0.18), 0, 1);
  const fadeProgress = compact ? mobileFade : desktopFade;
  const heroMetaOpacity = 1 - clamp(scrollY / Math.max(introTop * 0.42, 1), 0, 1);

  const startX = window.innerWidth * 0.5;
  const introGapCenter = window.innerWidth * 0.5;
  const belowTitleY = titleRect.bottom + (compact ? 22 : 16);
  const startY = compact ? belowTitleY : window.innerHeight - cardHeight - 20;
  const endScale = compact ? 1.08 : 2.5;
  const heroEndY = compact ? window.innerHeight * 0.62 : window.innerHeight - cardHeight - 20;
  const textCenterY = compact ? copyRect.top + copyRect.height * 0.46 : copyRect.top + copyRect.height * 0.5;
  const portraitSlotRect = introPortraitSlot?.getBoundingClientRect();
  const introTargetY = compact
    ? Math.min(window.innerHeight - (cardHeight * (1 + endScale)) / 2 - 32, textCenterY - cardHeight / 2)
    : (portraitSlotRect?.top || copyRect.top) + (cardHeight * (endScale - 1)) / 2;
  const heroStageY = startY + (heroEndY - startY) * flipProgress;
  const y = heroStageY + (introTargetY - heroStageY) * travelProgress;
  const x = startX + (introGapCenter - startX) * travelProgress;
  const rotate = 180 - 180 * flipProgress;
  const startScale = compact ? 0.78 : 1;
  const scale = startScale + (endScale - startScale) * flipProgress;
  const opacity = 1 - fadeProgress;

  document.documentElement.style.setProperty("--card-x", `${x}px`);
  document.documentElement.style.setProperty("--card-y", `${y}px`);
  document.documentElement.style.setProperty("--card-rotate", `${rotate}deg`);
  document.documentElement.style.setProperty("--card-scale", scale.toFixed(3));
  document.documentElement.style.setProperty("--card-opacity", opacity.toFixed(3));
  document.documentElement.style.setProperty("--hero-meta-opacity", heroMetaOpacity.toFixed(3));
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
      item.style.setProperty("--icon-opacity", itemProgress.toFixed(3));
      item.style.setProperty("--icon-scale", scale.toFixed(3));
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
        vec4 color = texture2D(uTexture, uv);
        float cornerRadius = mix(0.05, 0.025, uFocusProgress);
        float sdf = roundedRectSDF(vUv, vec2(1.0), cornerRadius);
        float alpha = 1.0 - smoothstep(0.0, 0.002, sdf);
        gl_FragColor = vec4(color.rgb, alpha * uOpacity);
      }
    `;

    camera.position.set(0, 0, 8);
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

      planes.forEach((plane, index) => {
        let normalizedIndex = index - currentOffset;
        normalizedIndex = ((normalizedIndex % planes.length) + planes.length) % planes.length;
        const relativeIndex = normalizedIndex - centerIndex;
        const angle = relativeIndex * 0.85;
        plane.position.set(Math.cos(angle) * 2, relativeIndex * 0.5 - 0.8, Math.sin(angle) * 2);
        plane.rotation.y = -angle + Math.PI / 2;
        plane.renderOrder = Math.round((plane.position.z + 3) * 1000) + index;
        plane.material.uniforms.uScrollSpeed.value = scrollSpeed;
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
      openProject(raycastPlane(event));
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
      openProject(raycastPlane(event));
    });

    spiralCanvas.addEventListener("pointermove", (event) => {
      if (mobileQuery.matches || overlayMode !== "spiral") return;
      hoveredPlane = raycastPlane(event);
      spiralCanvas.classList.toggle("is-project-hover", Boolean(hoveredPlane));
    });

    spiralCanvas.addEventListener("pointerleave", () => {
      pointerDown = null;
      hoveredPlane = null;
      spiralCanvas.classList.remove("is-project-hover");
    });

    spiralCanvas.addEventListener("keydown", (event) => {
      if (mobileQuery.matches || overlayMode !== "spiral" || !["Enter", " "].includes(event.key)) return;
      event.preventDefault();
      openProject(hoveredPlane || getBestPlaneForProject(spiralProjectData[0].id));
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
window.addEventListener("resize", requestHeroCardUpdate);
updateHeroCard();
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
