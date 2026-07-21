const TOOL_DATA = {
  planningDesign: [
    { name: "Figma", icon: "Fi", percent: 92 },
    { name: "Framer", icon: "Fr", percent: 88 },
    { name: "Notion", icon: "No", percent: 90 },
    { name: "Linear", icon: "Li", percent: 82 },
    { name: "Spline", icon: "Sp", percent: 78 },
    { name: "Webflow", icon: "Wf", percent: 84 },
    { name: "FigJam", icon: "Fj", percent: 86 },
    { name: "Photoshop", icon: "Ps", percent: 80 },
  ],
  developmentAi: [
    { name: "React", icon: "Re", percent: 89 },
    { name: "GSAP", icon: "Gs", percent: 91 },
    { name: "Next.js", icon: "Nx", percent: 85 },
    { name: "TypeScript", icon: "Ts", percent: 87 },
    { name: "GitHub", icon: "Gh", percent: 88 },
    { name: "OpenAI", icon: "Ai", percent: 83 },
    { name: "Vercel", icon: "Ve", percent: 86 },
    { name: "VS Code", icon: "Vs", percent: 93 },
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
  const rowControllers = new Map();
  let toolsInView = false;
  let activeTouchItem = null;

  const createToolItem = (tool, isClone) => {
    const item = document.createElement("button");
    item.className = "tool-item";
    item.type = "button";
    item.dataset.percent = String(tool.percent);
    item.tabIndex = isClone ? -1 : 0;
    item.setAttribute("aria-label", `${tool.name}, 숙련도 ${tool.percent}%`);
    item.setAttribute("aria-pressed", "false");

    const content = document.createElement("span");
    content.className = "tool-item-content";

    const name = document.createElement("span");
    name.className = "tool-item-face tool-item-name";
    name.append(document.createTextNode(tool.name));

    const icon = document.createElement("span");
    icon.className = "tool-item-icon";
    icon.textContent = tool.icon;
    icon.setAttribute("aria-hidden", "true");
    name.append(icon);

    const level = document.createElement("span");
    level.className = "tool-item-face tool-item-level";
    level.textContent = `${tool.percent}%`;
    level.setAttribute("aria-hidden", "true");

    content.append(name, level);
    item.append(content);
    return item;
  };

  const createToolSet = (tools, isClone) => {
    const set = document.createElement("div");
    set.className = "tool-set";
    if (isClone) set.setAttribute("aria-hidden", "true");
    tools.forEach((tool) => set.append(createToolItem(tool, isClone)));
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
    gsap.set(track, { xPercent: isReverse ? -50 : 0, force3D: true });

    const timeline = gsap.timeline({ repeat: -1, paused: true }).to(track, {
      xPercent: isReverse ? 0 : -50,
      duration: isReverse ? 38 : 34,
      ease: "none",
      force3D: true,
    });

    timeline.timeScale(getBaseTimeScale());
    rowControllers.set(row, { timeline });
  });

  const syncMarqueeVisibility = () => {
    const speed = getBaseTimeScale();
    rowControllers.forEach(({ timeline }) => {
      gsap.killTweensOf(timeline);
      timeline.timeScale(speed);
      if (toolsInView && speed > 0) timeline.resume();
      else timeline.pause();
    });
  };

  const tweenRowSpeed = (row, shouldStop) => {
    const controller = rowControllers.get(row);
    if (!controller) return;
    gsap.to(controller.timeline, {
      timeScale: shouldStop ? 0 : getBaseTimeScale(),
      duration: reducedMotionQuery.matches ? 0 : shouldStop ? 0.3 : 0.55,
      ease: "power2.out",
      overwrite: true,
    });
  };

  const setItemActive = (item, active) => {
    item.classList.toggle("is-active", active);
    item.setAttribute("aria-pressed", String(active));
  };

  const usesTouchInteraction = () => mobileQuery.matches || coarsePointerQuery.matches;

  toolsSection.querySelectorAll(".tool-item").forEach((item) => {
    const row = item.closest(".tool-row");

    item.addEventListener("pointerenter", () => {
      if (usesTouchInteraction()) return;
      setItemActive(item, true);
      tweenRowSpeed(row, true);
    });

    item.addEventListener("pointerleave", () => {
      if (usesTouchInteraction()) return;
      setItemActive(item, false);
      tweenRowSpeed(row, false);
    });

    item.addEventListener("focus", () => {
      if (usesTouchInteraction()) return;
      setItemActive(item, true);
      tweenRowSpeed(row, true);
    });

    item.addEventListener("blur", () => {
      if (usesTouchInteraction()) return;
      setItemActive(item, false);
      tweenRowSpeed(row, false);
    });

    item.addEventListener("click", () => {
      if (!usesTouchInteraction()) return;
      if (activeTouchItem && activeTouchItem !== item) {
        setItemActive(activeTouchItem, false);
        tweenRowSpeed(activeTouchItem.closest(".tool-row"), false);
      }
      const nextState = !item.classList.contains("is-active");
      setItemActive(item, nextState);
      tweenRowSpeed(row, nextState);
      activeTouchItem = nextState ? item : null;
    });
  });

  const visibilityObserver = new IntersectionObserver(
    ([entry]) => {
      toolsInView = entry.isIntersecting;
      syncMarqueeVisibility();
    },
    { rootMargin: "25% 0px", threshold: 0 }
  );
  visibilityObserver.observe(toolsSection);

  const syncMotionMode = () => {
    toolsSection.querySelectorAll(".tool-item.is-active").forEach((item) => setItemActive(item, false));
    activeTouchItem = null;
    syncMarqueeVisibility();
  };

  reducedMotionQuery.addEventListener("change", syncMotionMode);
  mobileQuery.addEventListener("change", syncMotionMode);

  window.toolMarqueeController = {
    data: TOOL_DATA,
    pause: () => rowControllers.forEach(({ timeline }) => timeline.pause()),
    resume: () => {
      toolsInView = true;
      syncMarqueeVisibility();
    },
  };
})();
