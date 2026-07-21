const TOOL_DATA = {
  planningDesign: [
    {
      name: "Figma",
      icon: "Fi",
      group: "Planning·Design",
      percent: 92,
      usage: "제품 구조부터 인터페이스 프로토타입까지 설계합니다.",
      projectTags: [{ label: "001 SPACE KIDS", target: "#project1" }],
    },
    {
      name: "Framer",
      icon: "Fr",
      group: "Planning·Design",
      percent: 88,
      usage: "인터랙션 중심의 웹 경험을 빠르게 구현합니다.",
      projectTags: [{ label: "002 AQUA PLANET", target: "#project2" }],
    },
    {
      name: "Notion",
      icon: "No",
      group: "Planning·Design",
      percent: 90,
      usage: "리서치와 프로젝트 문서를 한곳에서 관리합니다.",
      projectTags: [{ label: "003 PROJECT ARCHIVE", target: "#project1" }],
    },
    {
      name: "Linear",
      icon: "Li",
      group: "Planning·Design",
      percent: 82,
      usage: "제품 일정과 이슈 흐름을 짧은 주기로 운영합니다.",
      projectTags: [{ label: "004 PRODUCT SYSTEM", target: "#project2" }],
    },
    {
      name: "Spline",
      icon: "Sp",
      group: "Planning·Design",
      percent: 78,
      usage: "웹에 맞는 가벼운 3D 장면을 제작합니다.",
      projectTags: [{ label: "001 SPACE KIDS", target: "#project1" }],
    },
    {
      name: "Webflow",
      icon: "Wf",
      group: "Planning·Design",
      percent: 84,
      usage: "반응형 레이아웃과 CMS 화면을 구축합니다.",
      projectTags: [{ label: "002 AQUA PLANET", target: "#project2" }],
    },
    {
      name: "FigJam",
      icon: "Fj",
      group: "Planning·Design",
      percent: 86,
      usage: "아이디어와 사용자 흐름을 팀과 함께 정리합니다.",
      projectTags: [{ label: "003 PROJECT ARCHIVE", target: "#project1" }],
    },
    {
      name: "Photoshop",
      icon: "Ps",
      group: "Planning·Design",
      percent: 80,
      usage: "키 비주얼과 웹 이미지 에셋을 보정합니다.",
      projectTags: [{ label: "004 PRODUCT SYSTEM", target: "#project2" }],
    },
  ],
  developmentAi: [
    {
      name: "React",
      icon: "Re",
      group: "Development·AI",
      percent: 89,
      usage: "상태 기반의 재사용 가능한 화면을 개발합니다.",
      projectTags: [{ label: "001 SPACE KIDS", target: "#project1" }],
    },
    {
      name: "GSAP",
      icon: "Gs",
      group: "Development·AI",
      percent: 91,
      usage: "스크롤과 제스처에 반응하는 모션을 설계합니다.",
      projectTags: [{ label: "002 AQUA PLANET", target: "#project2" }],
    },
    {
      name: "Next.js",
      icon: "Nx",
      group: "Development·AI",
      percent: 85,
      usage: "빠른 렌더링과 확장 가능한 웹 구조를 만듭니다.",
      projectTags: [{ label: "003 PROJECT ARCHIVE", target: "#project1" }],
    },
    {
      name: "TypeScript",
      icon: "Ts",
      group: "Development·AI",
      percent: 87,
      usage: "명확한 데이터 계약으로 오류를 줄입니다.",
      projectTags: [{ label: "004 PRODUCT SYSTEM", target: "#project2" }],
    },
    {
      name: "GitHub",
      icon: "Gh",
      group: "Development·AI",
      percent: 88,
      usage: "버전과 리뷰 흐름을 일관되게 관리합니다.",
      projectTags: [{ label: "001 SPACE KIDS", target: "#project1" }],
    },
    {
      name: "OpenAI",
      icon: "Ai",
      group: "Development·AI",
      percent: 83,
      usage: "제품 맥락에 맞는 AI 기능을 프로토타이핑합니다.",
      projectTags: [{ label: "002 AQUA PLANET", target: "#project2" }],
    },
    {
      name: "Vercel",
      icon: "Ve",
      group: "Development·AI",
      percent: 86,
      usage: "프리뷰와 배포 단계를 짧고 안정적으로 운영합니다.",
      projectTags: [{ label: "003 PROJECT ARCHIVE", target: "#project1" }],
    },
    {
      name: "VS Code",
      icon: "Vs",
      group: "Development·AI",
      percent: 93,
      usage: "개발과 디버깅의 중심 작업 공간으로 사용합니다.",
      projectTags: [{ label: "004 PRODUCT SYSTEM", target: "#project2" }],
    },
  ],
};

window.toolData = TOOL_DATA;

(() => {
  const toolsSection = document.querySelector(".tools-content-section");
  const gsap = window.gsap;

  if (!toolsSection || !gsap) return;

  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mobileQuery = window.matchMedia("(max-width: 768px)");
  const coarsePointerQuery = window.matchMedia("(pointer: coarse)");
  const ringRadius = 44;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const svgNamespace = "http://www.w3.org/2000/svg";
  const rowControllers = new Map();
  let openMobileCard = null;
  let toolsInView = false;

  const createElement = (tagName, className, textContent) => {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (textContent !== undefined) element.textContent = textContent;
    return element;
  };

  const createRing = (percent) => {
    const ring = createElement("div", "tool-progress");
    const svg = document.createElementNS(svgNamespace, "svg");
    const track = document.createElementNS(svgNamespace, "circle");
    const value = document.createElementNS(svgNamespace, "circle");
    const label = createElement("span", "tool-progress-value", "0%");

    svg.setAttribute("viewBox", "0 0 120 120");
    svg.setAttribute("aria-hidden", "true");

    [track, value].forEach((circle) => {
      circle.setAttribute("cx", "60");
      circle.setAttribute("cy", "60");
      circle.setAttribute("r", String(ringRadius));
      circle.setAttribute("fill", "none");
    });

    track.setAttribute("class", "tool-progress-track");
    value.setAttribute("class", "tool-progress-ring");
    value.setAttribute("stroke-dasharray", String(ringCircumference));
    value.setAttribute("stroke-dashoffset", String(ringCircumference));
    value.dataset.percent = String(percent);

    svg.append(track, value);
    ring.append(svg, label);
    return ring;
  };

  const createToolCard = (tool, isClone) => {
    const card = createElement("article", "tool-card");
    const inner = createElement("div", "tool-card-inner");
    const front = createElement("div", "tool-card-face tool-card-front");
    const back = createElement("div", "tool-card-face tool-card-back");
    const frontTop = createElement("div", "tool-card-front-top");
    const icon = createElement("span", "tool-icon", tool.icon);
    const group = createElement("span", "tool-group");
    const groupDot = createElement("i", "tool-group-dot");
    const name = createElement("h3", "tool-name", tool.name);
    const usage = createElement("p", "tool-usage", tool.usage);
    const tags = createElement("div", "tool-project-tags");

    card.dataset.toolName = tool.name;
    card.dataset.percent = String(tool.percent);
    card.tabIndex = isClone ? -1 : 0;
    card.setAttribute("aria-label", `${tool.name}, ${tool.percent}% 활용도`);
    card.setAttribute("aria-pressed", "false");

    if (tool.group === "Development·AI") groupDot.classList.add("is-outline");
    group.append(groupDot, document.createTextNode(tool.group));
    frontTop.append(icon, group);
    front.append(frontTop, name);

    tool.projectTags.forEach((projectTag) => {
      const link = createElement("a", "tool-project-tag", projectTag.label);
      link.href = projectTag.target;
      if (isClone) link.tabIndex = -1;
      tags.append(link);
    });

    back.append(createRing(tool.percent), usage, tags);
    inner.append(front, back);
    card.append(inner);
    return card;
  };

  const createToolSet = (tools, isClone) => {
    const set = createElement("div", "tool-set");
    if (isClone) set.setAttribute("aria-hidden", "true");
    tools.forEach((tool) => set.append(createToolCard(tool, isClone)));
    return set;
  };

  const renderTrack = (track, tools) => {
    track.replaceChildren(createToolSet(tools, false), createToolSet(tools, true));
  };

  const planningTrack = toolsSection.querySelector('[data-tool-row="planning-design"] [data-tool-track]');
  const developmentTrack = toolsSection.querySelector('[data-tool-row="development-ai"] [data-tool-track]');

  if (!planningTrack || !developmentTrack) return;

  renderTrack(planningTrack, TOOL_DATA.planningDesign);
  renderTrack(developmentTrack, TOOL_DATA.developmentAi);

  const getBaseTimeScale = () => {
    if (reducedMotionQuery.matches) return 0;
    return mobileQuery.matches ? 0.52 : 1;
  };

  toolsSection.querySelectorAll("[data-tool-track]").forEach((track) => {
    const row = track.closest(".tool-row");
    const isReverse = track.dataset.direction === "reverse";
    const duration = isReverse ? 38 : 34;
    const fromX = isReverse ? -50 : 0;
    const toX = isReverse ? 0 : -50;

    gsap.set(track, { xPercent: fromX, force3D: true });
    const timeline = gsap.timeline({ repeat: -1, paused: true }).to(track, {
      xPercent: toX,
      duration,
      ease: "none",
      force3D: true,
    });

    timeline.timeScale(getBaseTimeScale());
    rowControllers.set(row, { timeline });
  });

  const syncMarqueeVisibility = () => {
    const baseTimeScale = getBaseTimeScale();
    rowControllers.forEach(({ timeline }) => {
      gsap.killTweensOf(timeline);
      timeline.timeScale(baseTimeScale);
      if (toolsInView && baseTimeScale > 0) timeline.resume();
      else timeline.pause();
    });
  };

  const toolsVisibilityObserver = new IntersectionObserver(
    ([entry]) => {
      toolsInView = entry.isIntersecting;
      syncMarqueeVisibility();
    },
    { rootMargin: "25% 0px", threshold: 0 }
  );
  toolsVisibilityObserver.observe(toolsSection);

  const tweenRowSpeed = (row, shouldStop) => {
    const controller = rowControllers.get(row);
    if (!controller) return;

    gsap.to(controller.timeline, {
      timeScale: shouldStop ? 0 : getBaseTimeScale(),
      duration: reducedMotionQuery.matches ? 0 : shouldStop ? 0.45 : 0.7,
      ease: "power2.out",
      overwrite: true,
    });
  };

  const resetRing = (card) => {
    const ring = card.querySelector(".tool-progress-ring");
    const label = card.querySelector(".tool-progress-value");
    if (!ring || !label) return;

    gsap.killTweensOf(ring);
    if (card._ringCounter) gsap.killTweensOf(card._ringCounter);
    gsap.set(ring, { strokeDashoffset: ringCircumference });
    label.textContent = "0%";
  };

  const fillRing = (card) => {
    const ring = card.querySelector(".tool-progress-ring");
    const label = card.querySelector(".tool-progress-value");
    const percent = Number(card.dataset.percent);
    if (!ring || !label || !Number.isFinite(percent)) return;

    const targetOffset = ringCircumference * (1 - percent / 100);
    if (reducedMotionQuery.matches) {
      gsap.set(ring, { strokeDashoffset: targetOffset });
      label.textContent = `${percent}%`;
      return;
    }

    const counter = { value: 0 };
    card._ringCounter = counter;
    gsap.to(ring, {
      strokeDashoffset: targetOffset,
      duration: 0.72,
      ease: "power2.out",
      overwrite: true,
    });
    gsap.to(counter, {
      value: percent,
      duration: 0.72,
      ease: "power2.out",
      overwrite: true,
      onUpdate: () => {
        label.textContent = `${Math.round(counter.value)}%`;
      },
    });
  };

  const showBack = (card) => {
    if (card.classList.contains("is-flipped")) return;

    const inner = card.querySelector(".tool-card-inner");
    const front = card.querySelector(".tool-card-front");
    const back = card.querySelector(".tool-card-back");
    card.classList.add("is-flipped");
    card.setAttribute("aria-pressed", "true");

    if (reducedMotionQuery.matches) {
      card.classList.add("uses-fade");
      gsap.set(front, { opacity: 0 });
      gsap.set(back, { opacity: 1 });
      fillRing(card);
      return;
    }

    gsap.to(inner, {
      rotationY: 180,
      duration: 0.4,
      ease: "power2.inOut",
      overwrite: true,
      onComplete: () => fillRing(card),
    });
  };

  const showFront = (card) => {
    if (!card.classList.contains("is-flipped")) return;

    const inner = card.querySelector(".tool-card-inner");
    const front = card.querySelector(".tool-card-front");
    const back = card.querySelector(".tool-card-back");
    card.classList.remove("is-flipped");
    card.setAttribute("aria-pressed", "false");
    resetRing(card);

    if (reducedMotionQuery.matches) {
      gsap.set(front, { opacity: 1 });
      gsap.set(back, { opacity: 0 });
      return;
    }

    gsap.to(inner, {
      rotationY: 0,
      duration: 0.34,
      ease: "power2.inOut",
      overwrite: true,
    });
  };

  const resetMagnet = (card) => {
    gsap.to(card, {
      "--magnet-x": "0px",
      "--magnet-y": "0px",
      duration: 0.45,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  const handleMagnet = (event, card) => {
    if (mobileQuery.matches || coarsePointerQuery.matches || reducedMotionQuery.matches) return;

    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = event.clientX - centerX;
    const deltaY = event.clientY - centerY;
    const distance = Math.hypot(deltaX, deltaY);
    const radius = Math.max(rect.width, rect.height) * 0.72;

    if (distance > radius) {
      resetMagnet(card);
      return;
    }

    const strength = (1 - distance / radius) * 0.14;
    gsap.to(card, {
      "--magnet-x": `${deltaX * strength}px`,
      "--magnet-y": `${deltaY * strength}px`,
      duration: 0.22,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const cards = [...toolsSection.querySelectorAll(".tool-card")];

  cards.forEach((card) => {
    resetRing(card);
    const row = card.closest(".tool-row");

    card.addEventListener("pointerenter", () => {
      if (mobileQuery.matches || coarsePointerQuery.matches) return;
      tweenRowSpeed(row, true);
      showBack(card);
    });

    card.addEventListener("pointermove", (event) => handleMagnet(event, card));

    card.addEventListener("pointerleave", () => {
      if (mobileQuery.matches || coarsePointerQuery.matches) return;
      showFront(card);
      resetMagnet(card);
      tweenRowSpeed(row, false);
    });

    card.addEventListener("click", (event) => {
      if (event.target.closest(".tool-project-tag")) return;
      if (!mobileQuery.matches && !coarsePointerQuery.matches) return;

      if (openMobileCard && openMobileCard !== card) {
        const previousRow = openMobileCard.closest(".tool-row");
        showFront(openMobileCard);
        resetMagnet(openMobileCard);
        tweenRowSpeed(previousRow, false);
      }

      if (card.classList.contains("is-flipped")) {
        showFront(card);
        tweenRowSpeed(row, false);
        openMobileCard = null;
      } else {
        showBack(card);
        tweenRowSpeed(row, true);
        openMobileCard = card;
      }
    });

    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      if (event.target.closest(".tool-project-tag")) return;
      event.preventDefault();

      if (card.classList.contains("is-flipped")) {
        showFront(card);
        tweenRowSpeed(row, false);
      } else {
        showBack(card);
        tweenRowSpeed(row, true);
      }
    });
  });

  toolsSection.querySelectorAll(".tool-row").forEach((row) => {
    row.addEventListener("pointerleave", () => {
      if (mobileQuery.matches || coarsePointerQuery.matches) return;
      row.querySelectorAll(".tool-card.is-flipped").forEach(showFront);
      tweenRowSpeed(row, false);
    });
  });

  toolsSection.querySelectorAll(".tool-project-tag").forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      event.stopPropagation();

      const card = link.closest(".tool-card");
      const row = link.closest(".tool-row");
      if (card) showFront(card);
      if (row) tweenRowSpeed(row, false);
      if (openMobileCard === card) openMobileCard = null;

      window.scrollTo({
        top: target.offsetTop,
        behavior: reducedMotionQuery.matches ? "auto" : "smooth",
      });
    });
  });

  const syncMotionMode = () => {
    toolsSection.classList.toggle("uses-reduced-motion", reducedMotionQuery.matches);
    cards.forEach((card) => {
      showFront(card);
      resetMagnet(card);
    });
    openMobileCard = null;
    rowControllers.forEach(({ timeline }) => {
      gsap.killTweensOf(timeline);
      timeline.timeScale(getBaseTimeScale());
    });
    syncMarqueeVisibility();
  };

  reducedMotionQuery.addEventListener("change", syncMotionMode);
  mobileQuery.addEventListener("change", syncMotionMode);
  syncMotionMode();

  window.toolMarqueeController = {
    data: TOOL_DATA,
    pause: () => rowControllers.forEach(({ timeline }) => timeline.pause()),
    resume: () => {
      toolsInView = true;
      syncMarqueeVisibility();
    },
  };
})();
