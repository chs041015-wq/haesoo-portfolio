const TOOL_DATA = {
  planningDesign: [
    { name: "Figma", icon: "assets/tools/figma.png", level: "상", fillPercent: 90, desc: "와이어프레임부터 프로토타입까지 전 과정에 사용했습니다" },
    { name: "Blender", icon: "assets/tools/blender.png", level: "중", fillPercent: 60, desc: "AI 스크립트를 통해\n 3D 애니메이션을 추가했습니다" },
    { name: "HTML", icon: "assets/tools/html.png?v=2", level: "상", fillPercent: 90, desc: "시맨틱 마크업으로 접근성\n높은 구조를 만들었습니다" },
    { name: "CSS", icon: "assets/tools/css.png?v=2", level: "상", fillPercent: 90, desc: "반응형 레이아웃과 스타일로 화면을 구현했습니다" },
    { name: "Vanilla JS", icon: "assets/tools/vanilla-js.png", level: "상", fillPercent: 90, desc: "DOM API로 인터랙션 로직을 직접 설계했습니다" },
    { name: "Three.js", icon: "assets/tools/three-js.png", level: "중상", fillPercent: 75, desc: "카메라, 조명, 지오메트리를\n다뤄 3D 씬을 구현했습니다" },
    { name: "GSAP", icon: "assets/tools/gsap.png", level: "중상", fillPercent: 75, desc: "타임라인과 트리거로 정교한 스크롤 연출을 만들었습니다" },
    { name: "jQuery", icon: "assets/tools/jquery.png", level: "중상", fillPercent: 75, desc: "셀렉터 기반으로 DOM을\n빠르게 제어했습니다" },
    { name: "React", icon: "assets/tools/react.png", level: "중상", fillPercent: 75, desc: "재사용 가능한 컴포넌트와\n 상태 관리로 화면을 \n구조화했습니다" },
  ],
  developmentAi: [
    { name: "TypeScript", icon: "assets/tools/typescript.png", level: "중상", fillPercent: 75, desc: "타입을 정의해 재사용 가능한 UI를 구축했습니다" },
    { name: "Tailwind", icon: "assets/tools/tailwind.png", level: "중상", fillPercent: 75, desc: "디자인 토큰을 유틸리티 클래스로 빠르게 구현했습니다" },
    { name: "Git/GitHub", icon: "assets/tools/git-github.png", level: "상", fillPercent: 90, desc: "브랜치 작업으로 팀 프로젝트를 \n효율적으로 진행하였습니다" },
    { name: "Vercel", icon: "assets/tools/vercel.png", level: "상", fillPercent: 90, desc: "개인프로젝트, 팀프로젝트의 배포를 담당하였습니다" },
    { name: "OpenAI", icon: "assets/tools/openai.png", level: "상", fillPercent: 90, desc: "기획, 코드 리뷰, 이미지 생성에 활용하였습니다" },
    { name: "Gemini", icon: "assets/tools/gemini.png", level: "중", fillPercent: 60, desc: "리서치와 브레인스토밍을 \n그려나갑니다" },
    { name: "Anthropic", icon: "assets/tools/anthropic.png", level: "상", fillPercent: 90, desc: "기획부터 코드까지 효율적인 작업을 진행하였습니다" },
    { name: "Meshy AI", icon: "assets/tools/meshy-ai.png", level: "중", fillPercent: 60, desc: "3D 모델 생성으로 프로젝트 \n디자인에 가담했습니다" },
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
    item.tabIndex = isClone ? -1 : 0;
    item.dataset.level = tool.level;
    item.dataset.fillPercent = String(tool.fillPercent);
    item.dataset.desc = tool.desc;
    item.style.setProperty("--fill-percent", tool.fillPercent);
    item.setAttribute("aria-label", `${tool.name}. 숙련도 ${tool.level}. ${tool.desc}`);
    item.setAttribute("aria-pressed", "false");

    const visual = document.createElement("span");
    visual.className = "tool-item-visual";

    const icon = document.createElement("img");
    icon.className = "tool-item-icon";
    icon.src = tool.icon;
    icon.alt = "";
    icon.setAttribute("aria-hidden", "true");

    const svgNamespace = "http://www.w3.org/2000/svg";
    const progress = document.createElementNS(svgNamespace, "svg");
    progress.classList.add("tool-progress");
    progress.setAttribute("viewBox", "0 0 104 104");
    progress.setAttribute("aria-hidden", "true");

    const trackCircle = document.createElementNS(svgNamespace, "circle");
    trackCircle.classList.add("tool-progress-track");
    trackCircle.setAttribute("cx", "52");
    trackCircle.setAttribute("cy", "52");
    trackCircle.setAttribute("r", "46");
    trackCircle.setAttribute("pathLength", "100");

    const fillCircle = document.createElementNS(svgNamespace, "circle");
    fillCircle.classList.add("tool-progress-fill");
    fillCircle.setAttribute("cx", "52");
    fillCircle.setAttribute("cy", "52");
    fillCircle.setAttribute("r", "46");
    fillCircle.setAttribute("pathLength", "100");
    fillCircle.setAttribute("stroke-linecap", "round");

    progress.append(trackCircle, fillCircle);
    visual.append(icon, progress);

    const copy = document.createElement("span");
    copy.className = "tool-item-copy";

    const name = document.createElement("span");
    name.className = "tool-item-name";
    if (tool.name.length > 12) name.classList.add("is-long");
    name.textContent = tool.name;

    const description = document.createElement("span");
    description.className = "tool-item-desc";
    description.textContent = tool.desc;

    copy.append(name, description);
    item.append(visual, copy);
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
    const originalSet = createToolSet(tools, false);
    const cloneSet = createToolSet(tools, true);
    track.replaceChildren(originalSet, cloneSet);

    // Keep each half wider than the viewport so the looping seam never enters view.
    const minimumSetWidth = window.innerWidth + 160;
    let repetition = 1;
    while (originalSet.getBoundingClientRect().width < minimumSetWidth && repetition < 8) {
      tools.forEach((tool) => {
        originalSet.append(createToolItem(tool, true));
        cloneSet.append(createToolItem(tool, true));
      });
      repetition += 1;
    }
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
      duration: reducedMotionQuery.matches ? 0 : shouldStop ? 0.22 : 0.42,
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
      tweenRowSpeed(row, true);
    });

    item.addEventListener("pointerleave", () => {
      if (usesTouchInteraction()) return;
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
