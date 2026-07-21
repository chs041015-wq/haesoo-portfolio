(() => {
  const canvas = document.querySelector(".project-showcase .canvas__wr canvas");
  const canvasWrapper = document.querySelector(".project-showcase .canvas__wr");
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  const isFigmaCaptureMode = new URLSearchParams(window.location.search).get("figma-export") === "1";

  if (!canvas || !canvasWrapper || !gsap || !ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  const ctx = canvas.getContext("2d");
  const images = [];
  const animationState = { index: 0 };
  const imageUrls = [
    "assets/project1/project-01.png",
    "images/plan-az/project-02.jpg",
    "images/plan-az/project-03.jpg",
    "images/plan-az/project-04.jpg",
  ];
  const imagesPerGroup = 1;
  const groups = [];
  const totalGroups = imageUrls.length;
  const framesPerCardTransition = 3;
  const introFrames = 3;
  const introHoldFrames = 0.8;
  const maxAnimationIndex = introFrames + introHoldFrames + (totalGroups - 1) * framesPerCardTransition;
  const radius = 40;
  const maxRotate = 0.16;
  const parallaxScaleFactor = 1;
  const scrollEnd = "+=520%";

  let loadedCount = 0;
  let isLoaded = false;
  let viewportWidth = 0;
  let viewportHeight = 0;
  let scrollTween = null;
  let imagesStarted = false;

  for (let index = 0; index < imageUrls.length; index += imagesPerGroup) {
    groups.push(imageUrls.slice(index, index + imagesPerGroup));
  }

  const lerpValue = (start, end, progress) => start * (1 - progress) + end * progress;
  const easeInOutCubic = (progress) => progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
  const parallaxDistance = () => viewportHeight * 0.18;
  const getGroupTiltDirection = (index) => (index % 2 === 0 ? 1 : -1);

  const drawImageCover = (image, x, y, width, height, cropTop = 0) => {
    if (!image || !image.complete || image.naturalWidth === 0) return;

    const sourceY = image.naturalHeight * cropTop;
    const sourceHeight = image.naturalHeight - sourceY;
    const imageRatio = image.naturalWidth / sourceHeight;
    const screenRatio = width / height;
    let drawWidth;
    let drawHeight;
    let drawX;
    let drawY;

    if (imageRatio > screenRatio) {
      drawHeight = height;
      drawWidth = height * imageRatio;
      drawX = x + (width - drawWidth) / 2;
      drawY = y;
    } else {
      drawWidth = width;
      drawHeight = width / imageRatio;
      drawX = x;
      drawY = y + (height - drawHeight) / 2;
    }

    ctx.drawImage(
      image,
      0,
      sourceY,
      image.naturalWidth,
      sourceHeight,
      drawX,
      drawY,
      drawWidth,
      drawHeight
    );
  };

  const drawImageCoverMove = (image, x, y, width, height, offsetY, cropTop = 0) => {
    drawImageCover(image, x, y + offsetY, width, height, cropTop);
  };

  const drawExpandedRoundedRect = (x, y, width, height, cornerRadius, padding = 10) => {
    const safeRadius = Math.max(0, cornerRadius);
    const expandedX = x - padding;
    const expandedY = y - padding;
    const expandedWidth = width + padding * 2;
    const expandedHeight = height + padding * 2;

    ctx.beginPath();
    ctx.moveTo(expandedX + safeRadius, expandedY);
    ctx.lineTo(expandedX + expandedWidth - safeRadius, expandedY);
    ctx.quadraticCurveTo(
      expandedX + expandedWidth,
      expandedY,
      expandedX + expandedWidth,
      expandedY + safeRadius
    );
    ctx.lineTo(expandedX + expandedWidth, expandedY + expandedHeight - safeRadius);
    ctx.quadraticCurveTo(
      expandedX + expandedWidth,
      expandedY + expandedHeight,
      expandedX + expandedWidth - safeRadius,
      expandedY + expandedHeight
    );
    ctx.lineTo(expandedX + safeRadius, expandedY + expandedHeight);
    ctx.quadraticCurveTo(
      expandedX,
      expandedY + expandedHeight,
      expandedX,
      expandedY + expandedHeight - safeRadius
    );
    ctx.lineTo(expandedX, expandedY + safeRadius);
    ctx.quadraticCurveTo(expandedX, expandedY, expandedX + safeRadius, expandedY);
    ctx.closePath();
  };

  const drawGroup = (groupIndex, progress, direction) => {
    for (let index = groups[groupIndex].length - 1; index >= 0; index -= 1) {
      const imageIndex = groupIndex * imagesPerGroup + index;
      const image = images[imageIndex];
      const entering = direction === "enter";
      const scale = entering
        ? lerpValue(0.5, parallaxScaleFactor, progress)
        : lerpValue(parallaxScaleFactor, 0.5, progress);
      const y = entering
        ? lerpValue(viewportHeight * 1.1, 0, progress)
        : lerpValue(0, -viewportHeight * 1.1, progress);
      const width = viewportWidth * scale;
      const height = viewportHeight * scale;
      const xPosition = (viewportWidth - width) / 2;
      const yPosition = y + (viewportHeight - height) / 2;
      let rotation;

      if (entering) {
        rotation = lerpValue(maxRotate, 0, progress);
      } else {
        const wobble = groupIndex === 0
          ? lerpValue(0, (maxRotate / 8) * getGroupTiltDirection(groupIndex), Math.sin(progress * Math.PI))
          : 0;
        rotation = lerpValue(0, -maxRotate, progress) + wobble;
      }

      ctx.save();
      ctx.translate(viewportWidth / 2, viewportHeight / 2);
      ctx.rotate(rotation);

      const centeredX = xPosition - viewportWidth / 2;
      const centeredY = yPosition - viewportHeight / 2;
      drawExpandedRoundedRect(centeredX, centeredY, width, height, radius);
      ctx.clip();

      const imageOffsetY = entering
        ? lerpValue(parallaxDistance(), 0, progress)
        : lerpValue(0, -parallaxDistance(), progress);
      drawImageCoverMove(
        image,
        -viewportWidth / 2,
        -viewportHeight / 2,
        viewportWidth,
        viewportHeight,
        imageOffsetY,
        imageIndex === 0 ? 0.093 : 0
      );
      ctx.restore();
    }
  };

  const drawIntroCard = (rawProgress) => {
    const image = images[0];
    const progress = easeInOutCubic(rawProgress);
    const startScale = viewportWidth <= 768 ? 0.72 : 0.62;
    const scale = lerpValue(startScale, 1, progress);
    const width = viewportWidth * scale;
    const height = viewportHeight * scale;
    const cornerRadius = lerpValue(radius, 0, progress);
    const rotation = lerpValue(maxRotate * 0.22, 0, progress);
    const imageOffsetY = lerpValue(parallaxDistance() * 0.45, 0, progress);

    ctx.save();
    ctx.translate(viewportWidth / 2, viewportHeight / 2);
    ctx.rotate(rotation);
    drawExpandedRoundedRect(-width / 2, -height / 2, width, height, cornerRadius, 0);
    ctx.clip();
    drawImageCoverMove(
      image,
      -viewportWidth / 2,
      -viewportHeight / 2,
      viewportWidth,
      viewportHeight,
      imageOffsetY,
      0.093
    );
    ctx.restore();
  };

  const render = () => {
    ctx.clearRect(0, 0, viewportWidth, viewportHeight);

    if (animationState.index <= introFrames) {
      const introProgress = Math.min(animationState.index / introFrames, 1);
      canvas.dataset.introProgress = introProgress.toFixed(4);
      drawIntroCard(introProgress);
      return;
    }

    if (animationState.index <= introFrames + introHoldFrames) {
      canvas.dataset.introProgress = "1.0000";
      drawIntroCard(1);
      return;
    }

    canvas.dataset.introProgress = "1.0000";
    const groupFloatIndex = (animationState.index - introFrames - introHoldFrames) / framesPerCardTransition;
    const currentIndex = Math.floor(groupFloatIndex);
    const nextIndex = Math.min(currentIndex + 1, totalGroups - 1);
    const localProgress = groupFloatIndex - currentIndex;

    if (currentIndex === totalGroups - 1) {
      const image = images[currentIndex * imagesPerGroup];
      ctx.save();
      ctx.translate(viewportWidth / 2, viewportHeight / 2);
      drawExpandedRoundedRect(
        -viewportWidth / 2,
        -viewportHeight / 2,
        viewportWidth,
        viewportHeight,
        radius
      );
      ctx.clip();
      drawImageCover(
        image,
        -viewportWidth / 2,
        -viewportHeight / 2,
        viewportWidth,
        viewportHeight
      );
      ctx.restore();
      return;
    }

    drawGroup(currentIndex, localProgress, "leave");
    drawGroup(nextIndex, localProgress, "enter");
  };

  const resize = () => {
    viewportWidth = window.innerWidth;
    viewportHeight = window.innerHeight;
    const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);

    canvas.width = viewportWidth * devicePixelRatio;
    canvas.height = viewportHeight * devicePixelRatio;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(devicePixelRatio, devicePixelRatio);

    if (isLoaded) render();
  };

  const setupScrollAnimation = () => {
    if (scrollTween) return;
    render();
    scrollTween = gsap.to(animationState, {
      index: maxAnimationIndex,
      ease: "none",
      scrollTrigger: {
        trigger: canvasWrapper,
        start: "top top",
        end: scrollEnd,
        pin: true,
        scrub: 0,
        invalidateOnRefresh: true,
        id: "project-showcase-canvas-pin",
        refreshPriority: 1,
        onUpdate: render,
      },
    });
  };

  const checkLoadComplete = () => {
    if (loadedCount !== imageUrls.length || isLoaded) return;
    isLoaded = true;
    render();
  };

  const loadImages = () => {
    if (imagesStarted) return;
    imagesStarted = true;

    imageUrls.forEach((url, index) => {
      const image = new Image();
      image.src = url;
      image.onload = () => {
        loadedCount += 1;
        checkLoadComplete();
      };
      image.onerror = () => {
        loadedCount += 1;
        checkLoadComplete();
      };
      images[index] = image;
    });
  };

  const scheduleImageLoad = () => {
    if (!("IntersectionObserver" in window)) {
      loadImages();
      return;
    }

    const initObserver = new IntersectionObserver(
      (entries, observer) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        loadImages();
      },
      { rootMargin: "1600px 0px", threshold: 0 }
    );
    initObserver.observe(canvasWrapper);
  };

  resize();
  window.addEventListener("resize", resize);
  setupScrollAnimation();
  if (isFigmaCaptureMode) loadImages();
  else scheduleImageLoad();
})();
