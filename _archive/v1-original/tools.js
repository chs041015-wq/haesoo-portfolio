const FEATURED_TOOLS = [
  { name: "Figma", icon: "assets/tools/figma.webp", level: "상", fillPercent: 90, desc: "와이어프레임부터 프로토타입까지 전 과정에 사용했습니다" },
  { name: "Three.js", icon: "assets/tools/three-js.webp", level: "중상", fillPercent: 75, desc: "카메라, 조명, 지오메트리를\n다뤄 3D 씬을 구현했습니다" },
  { name: "GSAP", icon: "assets/tools/gsap.webp", level: "중상", fillPercent: 75, desc: "타임라인과 트리거로 정교한 스크롤 연출을 만들었습니다" },
  { name: "React", icon: "assets/tools/react.webp", level: "중상", fillPercent: 75, desc: "재사용 가능한 컴포넌트와\n 상태 관리로 화면을 \n구조화했습니다" },
  { name: "TypeScript", icon: "assets/tools/typescript.webp", level: "중상", fillPercent: 75, desc: "타입을 정의해 재사용 가능한 UI를 구축했습니다" },
  { name: "Anthropic", icon: "assets/tools/anthropic.webp", level: "상", fillPercent: 90, desc: "기획부터 코드까지 효율적인 작업을 진행하였습니다" },
  { name: "Blender", icon: "assets/tools/blender.webp", level: "중", fillPercent: 60, desc: "AI 스크립트를 통해\n 3D 애니메이션을 추가했습니다" },
  { name: "HTML", icon: "assets/tools/html.webp?v=2", level: "상", fillPercent: 90, desc: "시맨틱 마크업으로 접근성\n높은 구조를 만들었습니다" },
  { name: "CSS", icon: "assets/tools/css.webp?v=2", level: "상", fillPercent: 90, desc: "반응형 레이아웃과 스타일로 화면을 구현했습니다" },
];

window.toolData = FEATURED_TOOLS;

(() => {
  const toolsSection = document.querySelector(".tools-content-section");
  const pinShell = toolsSection?.querySelector(".tools-pin-shell");
  const pinStage = toolsSection?.querySelector(".tools-pin-stage");
  if (!toolsSection || !pinShell || !pinStage) return;

  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mobileQuery = window.matchMedia("(max-width: 1100px)");
  const coarsePointerQuery = window.matchMedia("(pointer: coarse)");

  const createToolCard = (tool) => {
    const card = document.createElement("div");
    card.className = "tool-card";
    card.style.setProperty("--fill-percent", tool.fillPercent);

    const inner = document.createElement("div");
    inner.className = "tool-card-inner";

    const front = document.createElement("div");
    front.className = "tool-card-face tool-card-front";

    const iconWrap = document.createElement("span");
    iconWrap.className = "tool-card-icon-wrap";
    const icon = document.createElement("img");
    icon.className = "tool-card-icon";
    icon.src = tool.icon;
    icon.alt = "";
    icon.setAttribute("aria-hidden", "true");
    iconWrap.append(icon);

    const name = document.createElement("span");
    name.className = "tool-card-name";
    name.textContent = tool.name;

    const back = document.createElement("div");
    back.className = "tool-card-face tool-card-back";

    const svgNamespace = "http://www.w3.org/2000/svg";
    const progress = document.createElementNS(svgNamespace, "svg");
    progress.classList.add("tool-progress");
    progress.setAttribute("viewBox", "0 0 110 110");
    progress.setAttribute("aria-hidden", "true");

    const trackCircle = document.createElementNS(svgNamespace, "circle");
    trackCircle.classList.add("tool-progress-track");
    trackCircle.setAttribute("cx", "55");
    trackCircle.setAttribute("cy", "55");
    trackCircle.setAttribute("r", "52.5");
    trackCircle.setAttribute("pathLength", "100");

    const fillCircle = document.createElementNS(svgNamespace, "circle");
    fillCircle.classList.add("tool-progress-fill");
    fillCircle.setAttribute("cx", "55");
    fillCircle.setAttribute("cy", "55");
    fillCircle.setAttribute("r", "52.5");
    fillCircle.setAttribute("pathLength", "100");
    fillCircle.setAttribute("stroke-linecap", "round");

    progress.append(trackCircle, fillCircle);

    const progressWrap = document.createElement("span");
    progressWrap.className = "tool-progress-wrap";
    progressWrap.append(progress, name);

    front.append(progressWrap);

    const level = document.createElement("span");
    level.className = "tool-card-level";
    level.textContent = `LV. ${tool.level}`;

    const desc = document.createElement("span");
    desc.className = "tool-card-desc";
    desc.textContent = tool.desc;

    back.append(iconWrap, desc);

    inner.append(front, back);
    card.append(inner);
    return card;
  };

  const leftRail = toolsSection.querySelector('[data-tool-col="left"]');
  const rightRail = toolsSection.querySelector('[data-tool-col="right"]');
  if (!leftRail || !rightRail) return;

  const leftTools = FEATURED_TOOLS.filter((_, index) => index % 2 === 0);
  const rightTools = FEATURED_TOOLS.filter((_, index) => index % 2 !== 0);

  // Left, right, left, right... one shared turn-taking sequence, so only a
  // single card is "on" at a time and the two sides hand off in order.
  const sequence = [];
  const maxLen = Math.max(leftTools.length, rightTools.length);
  for (let i = 0; i < maxLen; i += 1) {
    if (leftTools[i]) sequence.push({ tool: leftTools[i], side: "left" });
    if (rightTools[i]) sequence.push({ tool: rightTools[i], side: "right" });
  }
  const slotCount = sequence.length;

  const buildRail = (rail, side) => {
    rail.replaceChildren();
    return sequence
      .map((entry, slotIndex) => ({ ...entry, slotIndex }))
      .filter((entry) => entry.side === side)
      .map(({ tool, slotIndex }) => {
        const card = createToolCard(tool);
        const spread = (slotIndex + 0.5) / slotCount;
        const topPercent = Math.min(Math.max(spread * 100, 44.5), 55.5);
        card.style.top = `${topPercent.toFixed(2)}%`;
        rail.append(card);
        const center = Math.min(Math.max(spread, 0.06), 0.94);
        return { card, center, tool };
      });
  };

  const halfWindow = 0.1;

  const leftEntries = buildRail(leftRail, "left");
  const rightEntries = buildRail(rightRail, "right");
  const allEntries = [...leftEntries, ...rightEntries];
  const toolListItems = [...toolsSection.querySelectorAll(".tools-category li")];
  const railHeights = new Map();

  const getListLabel = (toolName) => {
    if (toolName === "HTML" || toolName === "CSS") return "HTML / CSS";
    return toolName;
  };

  const updateActiveToolLabel = (progress) => {
    const activeEntry = allEntries
      .filter(({ center }) => progress > center - halfWindow * 0.35)
      .sort((a, b) => b.center - a.center)[0];
    const activeLabel = activeEntry ? getListLabel(activeEntry.tool.name) : "";

    toolListItems.forEach((item) => {
      item.classList.toggle("is-active-tool", item.textContent.trim() === activeLabel);
    });
  };

  const measureRails = () => {
    // Travel distance needs to clear the rail's own height so a card fully
    // exits off-screen (top or bottom) rather than fading out mid-transit.
    railHeights.set(leftRail, leftRail.getBoundingClientRect().height);
    railHeights.set(rightRail, rightRail.getBoundingClientRect().height);
  };

  const applyMotion = (entries, rail, progress) => {
    const riseDistance = (railHeights.get(rail) || 800) * 0.55;
    entries.forEach(({ card, center }) => {
      const localT = Math.max(Math.min((progress - center) / halfWindow, 1.3), -1.3);
      const lift = -localT * riseDistance;
      const enterOpacity = Math.max(Math.min((localT + 1.3) / 0.85, 1), 0);
      const exitOpacity = Math.max(Math.min((1.16 - localT) / 0.16, 1), 0);
      const opacity = Math.min(enterOpacity, exitOpacity);
      const ringIsActive = localT > -0.35 && opacity > 0;
      card.style.transform = `translateY(${lift.toFixed(2)}px)`;
      card.style.opacity = opacity.toFixed(3);
      card.style.visibility = opacity === 0 ? "hidden" : "visible";
      card.classList.toggle("is-ring-active", ringIsActive);
    });
  };

  const resetCardStyles = () => {
    allEntries.forEach(({ card }) => {
      card.style.transform = "";
      card.style.opacity = "";
      card.style.visibility = "";
      card.classList.toggle("is-ring-active", reducedMotionQuery.matches);
    });
    toolListItems.forEach((item) => item.classList.remove("is-active-tool"));
  };

  let sectionInView = false;
  let frame = null;

  const paint = () => {
    frame = null;
    if (!sectionInView) return;

    if (reducedMotionQuery.matches || mobileQuery.matches) {
      resetCardStyles();
      return;
    }

    const rect = pinShell.getBoundingClientRect();
    const scrollable = Math.max(rect.height - pinStage.offsetHeight, 1);
    const progress = Math.min(Math.max(-rect.top / scrollable, 0), 1);
    applyMotion(leftEntries, leftRail, progress);
    applyMotion(rightEntries, rightRail, progress);
    updateActiveToolLabel(progress);
  };

  const requestPaint = () => {
    if (frame !== null) return;
    frame = requestAnimationFrame(paint);
  };

  measureRails();
  window.addEventListener("resize", () => {
    measureRails();
    requestPaint();
  });
  window.addEventListener("scroll", requestPaint, { passive: true });

  const visibilityObserver = new IntersectionObserver(
    ([entry]) => {
      sectionInView = entry.isIntersecting;
      if (sectionInView) requestPaint();
    },
    { rootMargin: "25% 0px", threshold: 0 }
  );
  visibilityObserver.observe(toolsSection);

  reducedMotionQuery.addEventListener("change", requestPaint);
  mobileQuery.addEventListener("change", requestPaint);

  toolsSection.querySelectorAll(".tool-card").forEach((card) => {
    card.addEventListener("click", () => {
      if (!coarsePointerQuery.matches) return;
      card.classList.toggle("is-flipped");
    });
  });
})();
