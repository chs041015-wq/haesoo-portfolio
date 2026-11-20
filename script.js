/* =========================================================
   Haesoo Portfolio — Draft motions
   - bauer-lab   : scroll bg colour, pill nav progress, hero circles,
                   People rotation (same ratio math & values)
   - upleat      : browser windows + checklist window (same timings/easings)
   - v1          : section titles, skills, timeline (same values)
   ========================================================= */
(() => {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const mix = (c1, c2, t) => c1.map((v, i) => Math.round(lerp(v, c2[i], t)));
  const rgb = (c) => `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const easeInOutQuart = (t) => (t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2);

  // cubic-bezier solver + damped spring (same curves as the upleat window)
  const bezier = (x1, y1, x2, y2) => {
    const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
    const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
    const sx = (t) => ((ax * t + bx) * t + cx) * t;
    const sy = (t) => ((ay * t + by) * t + cy) * t;
    const dx = (t) => (3 * ax * t + 2 * bx) * t + cx;
    return (x) => {
      if (x <= 0) return 0;
      if (x >= 1) return 1;
      let t = x;
      for (let i = 0; i < 8; i++) {
        const e = sx(t) - x, d = dx(t);
        if (Math.abs(e) < 1e-5 || !d) break;
        t -= e / d;
      }
      return sy(clamp(t));
    };
  };
  const spring = (e, z = 0.58, w = 13) => {
    if (e <= 0) return 0;
    const wd = w * Math.sqrt(1 - z * z);
    return 1 - Math.exp(-z * w * e) * (Math.cos(wd * e) + ((z * w) / wd) * Math.sin(wd * e));
  };
  const easeOut = bezier(0.16, 1, 0.3, 1);
  const easeInOut = bezier(0.65, 0, 0.35, 1);
  const easeBack = bezier(0.55, -0.28, 0.75, 0.4);
  const easeSoft = bezier(0.2, 0.8, 0.3, 1);
  const seg = (e, start, dur) => clamp((e - start) / dur);
  const pulse = (e, amt) => 1 + Math.sin(Math.PI * e) * amt;

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- smooth scroll (bauer uses Lenis) ---------- */
  let lenis = null;
  if (window.Lenis && !reduced) {
    lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  $$('a[href^="#"]').forEach((a) =>
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      e.preventDefault();
      if (id.length < 2) return;
      const target = $(id);
      if (!target) return;
      if (lenis) lenis.scrollTo(target, { duration: 2, easing: easeInOutQuart });
      else target.scrollIntoView({ behavior: "smooth" });
    })
  );

  /* ---------- 1. page background keyframes (bauer) ---------- */
  const COLOR = { paper: [250, 247, 243], night: [26, 23, 20], warm: [26, 23, 20] }; // 어두운 배경은 전부 Hero 따뜻한 검정 #1A1714
  const pageBg = $(".page-bg");
  const root = document.documentElement;
  let bgKeys = [[0, COLOR.warm]];
  let theme = "";
  const top = (el) => el.getBoundingClientRect().top + scrollY;

  function computeBgKeys() {
    const vh = innerHeight;
    const worksTop = top($(".works"));
    const skTop = top($(".skills"));
    // Hero·About(별 배경) 따뜻한 검정 → Works·Studies 미색 → Skills부터 끝까지 다시 따뜻한 검정(#1A1714)
    bgKeys = [
      [0, COLOR.warm],
      [worksTop - vh * 0.5, COLOR.warm],
      [worksTop - vh * 0.1, COLOR.paper],
      [skTop - vh * 0.75, COLOR.paper],
      [skTop - vh * 0.3, COLOR.night],
    ];
  }
  function bgAt(s) {
    for (let i = 0; i < bgKeys.length - 1; i++) {
      const [a0, c0] = bgKeys[i], [a1, c1] = bgKeys[i + 1];
      if (s <= a1) return mix(c0, c1, a1 === a0 ? 1 : clamp((s - a0) / (a1 - a0)));
    }
    return bgKeys[bgKeys.length - 1][1];
  }
  function updateBg(s) {
    const c = bgAt(s);
    pageBg.style.backgroundColor = rgb(c);
    document.body.style.backgroundColor = rgb(c);
    const lum = (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]) / 255;
    const next = lum < 0.4 ? "dark" : "light";
    if (next !== theme) {
      theme = next;
      root.style.setProperty("--fg", next === "dark" ? "#faf7f3" : "#111111");
      root.style.setProperty("--fg-inv", next === "dark" ? "#111111" : "#faf7f3");
      root.classList.toggle("is-dark", next === "dark");
    }
  }

  /* ---------- 2. nav pill progress (bauer clip-path) ---------- */
  const groups = {
    about: [".about", ".about"],
    works: [".works", ".studies"],
    timeline: [".skills", ".timeline"],
    contact: [".contact", ".contact"],
  };
  let groupRanges = [];
  function computeGroups() {
    const maxScroll = document.documentElement.scrollHeight - innerHeight;
    groupRanges = $$(".pill").map((pill) => {
      const [a, b] = groups[pill.dataset.group];
      const start = top($(a));
      const end = Math.min(top($(b)) + $(b).offsetHeight, maxScroll + innerHeight * 0.5);
      return { pill, start, end };
    });
  }
  function updateNav(s) {
    const probe = s + innerHeight * 0.5;
    groupRanges.forEach(({ pill, start, end }) => {
      pill.style.setProperty("--progress", `${clamp((probe - start) / (end - start)) * 100}%`);
    });
  }

  /* ---------- 3. hero : bauer-lab home "top" (clone study) ----------
     원본: bauer-lab.com 번들의 원 캔버스 클래스(Wz) + 홈 top 스크롤 로직 + 롤링 버튼(Cz/buttonRolling).
     압축 해제만 하고 로직·수치는 원본 그대로. 차이: 개발용 GUI(lil-gui) 제거, 로고 영상 → 텍스트 인트로. */
  class Wz {
    canvasScale = 2;
    mouse = { x: 0, y: 0, cx: 0, cy: 0, r_cx: 0, r_cy: 0 };
    mouseFollowSpeed = 0;
    mouseFollowRange = 0;
    stageSize = { width: 0, height: 0, cx: 0, cy: 0, diagonal: 0 };
    circleSize = 0;
    center = { x: 0, y: 0 };
    scale = { x: 1, y: 1 };
    radius = 0;
    maskProgress = 0;
    radiusScale = 1.5;
    speed = 0.2;
    speedReverse = false;
    rotation = 30;
    zoomSpeed = 0.6;
    opacity = 0.5;
    x = 0;
    y = 0;
    position = { x: 0, y: 0 };
    thickness = 1;
    rad = Math.PI / 180;
    nums = innerWidth >= 1024 ? 30 : 15; // 원본: Tz.isPC ? 30 : 15
    margin = 10;
    color = "#ffffff";
    fillColor = "#131CDE";
    isRender = false;
    circles = [];
    makeTimer = null;
    isMask = false;
    isLineMaking = true;
    followMosue = true;
    isFitContasiner = false;
    constructor(cvs, fillColor = "#131CDE") {
      this.container = cvs.parentNode;
      this.cvs = cvs;
      this.ctx = this.cvs.getContext("2d");
      this.container.append(this.cvs);
      this.mouse.x = this.container.clientWidth * 0.5;
      this.mouse.y = this.container.clientHeight * 0.5;
      this.defineSize();
      this.makeCircles();
      this.draw();
      this.onMouseMove = this.onMouseMove.bind(this);
      this.onResize = this.onResize.bind(this);
      window.addEventListener("mousemove", this.onMouseMove);
      window.addEventListener("resize", this.onResize);
      this.resize();
      this.start();
      this.fillColor = fillColor;
    }
    start() {
      if (!this.isRender) {
        this.isRender = true;
        this.render();
      }
    }
    stop() {
      this.isRender = false;
    }
    defineSize() {
      this.stageSize.width = this.container.clientWidth;
      this.stageSize.height = this.container.clientHeight;
      this.stageSize.cx = this.stageSize.width * 0.5;
      this.stageSize.cy = this.stageSize.height * 0.5;
      this.stageSize.diagonal = Math.sqrt(this.stageSize.width ** 2 + this.stageSize.height ** 2);
    }
    onResize() {
      this.resize();
    }
    resize() {
      this.defineSize();
      this.circleSize = this.stageSize.width < this.stageSize.height ? this.stageSize.width : this.stageSize.height;
      this.cvs.width = this.stageSize.width * this.canvasScale;
      this.cvs.height = this.stageSize.height * this.canvasScale;
      this.cvs.style.width = this.stageSize.width + "px";
      this.cvs.style.height = this.stageSize.height + "px";
      this.ctx.scale(this.canvasScale, this.canvasScale);
      this.center.x = this.stageSize.width * 0.5;
      this.center.y = this.stageSize.height * 0.5;
      this.radius = this.circleSize * 0.5 - 1;
      this.margin = this.radius / this.nums;
      if (this.isFitContasiner) this.radius = this.stageSize.width * 0.5;
      this.makeCircles();
    }
    render() {
      this.draw();
      if (this.isRender) requestAnimationFrame(this.render.bind(this));
    }
    onMouseMove(e) {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      const t = this.stageSize.width * 0.5;
      const n = this.stageSize.height * 0.5;
      this.mouse.cx = this.mouse.x - t;
      this.mouse.cy = this.mouse.y - n;
      this.mouse.r_cx = this.mouse.cx / t;
      this.mouse.r_cy = this.mouse.cy / n;
    }
    translate(x = this.position.x, y = this.position.y) {
      this.position.x = x;
      this.position.y = y;
    }
    makeCircles() {
      this.isLineMaking = true;
      this.circles = [];
      if (this.makeTimer) clearTimeout(this.makeTimer);
      this.makeTimer = setTimeout(() => {
        for (let e = 0; e < this.nums; e++) {
          this.circles.push({ x: this.center.x, y: this.center.y, progress: 0, radius: this.radius - this.margin * e, alpha: 1, reset: false });
          if (e == this.nums - 1) this.isLineMaking = false;
        }
      }, 10);
    }
    draw() {
      if (this.isLineMaking) return;
      this.margin = this.radius / this.nums;
      this.ctx.strokeStyle = this.color;
      this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
      if (this.fillColor == "transparent") {
        this.ctx.fillStyle = "rgba(255,255,255,0)";
      } else {
        this.ctx.fillStyle = this.fillColor;
        this.ctx.fillRect(0, 0, this.cvs.width, this.cvs.height);
      }
      const e = this.stageSize.width * 0.5;
      const t = this.stageSize.height * 0.5;
      const n = this.mouse.r_cx * this.mouseFollowRange * e + e;
      const r = this.mouse.r_cy * this.mouseFollowRange * t + t;
      this.center.x += (n - this.center.x) * this.mouseFollowSpeed;
      this.center.y += (r - this.center.y) * this.mouseFollowSpeed;
      if (this.followMosue) {
        this.x += (this.mouse.r_cx - this.x) * 0.2;
        this.y += (this.mouse.r_cy - this.y) * 0.2;
      }
      for (let k = 0; k < this.circles.length; k++) {
        this.ctx.save();
        this.ctx.beginPath();
        const t2 = this.circles[k].radius / this.radius;
        let n2 = 0.3 + t2 * 0.7;
        if (this.speedReverse) n2 = 0.3 + (1 - t2) * 0.7;
        const r2 = this.center;
        const i = this.circles[k];
        i.x += (r2.x - i.x) * n2 * this.speed;
        i.y += (r2.y - i.y) * n2 * this.speed;
        i.radius += -this.zoomSpeed;
        if (i.radius < 0) {
          i.radius += this.radius;
          i.x = r2.x;
          i.y = r2.y;
          i.alpha = 0;
          i.reset = true;
        }
        if (i.reset) {
          i.alpha += 0.01;
          if (i.alpha > 1) {
            i.alpha = 1;
            i.reset = false;
          }
        }
        this.ctx.globalAlpha = i.alpha * this.opacity;
        this.ctx.lineWidth = this.thickness * t2;
        const a = i.radius;
        let o = i.x;
        let s = i.y;
        o += this.position.x;
        s += this.position.y;
        let c = a - a * (1 - t2) * (1 - this.scale.x);
        let l = a - a * (1 - t2) * (1 - this.scale.y);
        c *= this.radiusScale;
        l *= this.radiusScale;
        const u = o + (1 - t2) * this.x * a;
        const d = s + (1 - t2) * this.y * a;
        let f = t2 + this.rotation * this.rad;
        f = Math.max(0, f);
        this.ctx.ellipse(u, d, c, l, f, 0, Math.PI * 2);
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.restore();
      }
      if (this.isMask) {
        this.ctx.save();
        this.ctx.globalCompositeOperation = "destination-out";
        this.ctx.beginPath();
        this.ctx.arc(this.stageSize.cx, this.stageSize.cy, this.stageSize.diagonal * 0.5 * this.maskProgress, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
      }
    }
  }

  // 원본: new Wz(canvas) 후 isMask = true. 색만 v1 팔레트(미색 배경 + 검정 선)로 지정
  // 채우기는 투명으로 두고(뒤의 별 레이어가 보이도록) 배경은 page-bg의 따뜻한 검정이 맡음. 선은 미색
  // 원 선(동심원) 표시 스위치 — 현재 끔. true로 바꾸면 bauer 원 터널이 다시 나와요
  const SHOW_CIRCLES = false;
  const circleField = SHOW_CIRCLES ? new Wz($(".top-canvas"), "transparent") : null;
  if (circleField) {
    circleField.color = "#faf7f3";
    circleField.isMask = true;
    circleField.opacity = 0;
  } else {
    $(".top-canvas").remove();
  }

  // 별 레이어 : archery.wtf "flight-layer" 별 (본인 제작 코드 이식)
  //  - 원본은 three.js 카메라로 3D 투영. 여기선 같은 수식을 2D 원근 투영으로 옮김
  //  - 별 720개를 3D 상자에 고르게 배치 → 멀리 있는 별은 페이드인되므로 중앙에 뭉치지 않음
  //  - 원본 최종 상태 기준: M(등장)=1, S(속도·꼬리)=1, 화각 58°, 진행방향 오른쪽 0.1 기울기
  // 같은 별 레이어를 Hero(.top-circle)와 Skills(.skills) 두 곳에 붙일 수 있도록 함수로 분리
  // opts: count 개수, brightness 밝기, speed 날아오는 속도 배수, trail 빛꼬리 길이 배수 (기본값 = Hero)
  const createStarField = (box, className, opts = {}) => {
    const STAR_COLOR = "#faf7f3";             // 미색 (원본 "#e3ebfa")
    const TRAIL_RGB = "250,247,243";          // 미색 (원본 "211,228,255")
    const TRAIL_ALPHA = 0.65;                 // 꼬리 진하기 (원본 0.8)
    const BRIGHTNESS = opts.brightness ?? 0.85; // 별 전체 밝기 (원본 1)
    const SPEED = opts.speed ?? 1, TRAIL = opts.trail ?? 1;
    const COUNT = opts.count ?? 480, P = 1, N = 26 * P, U = 0.12 * P, FOV = 58, M = 1, S = 1; // 개수 (원본 720)
    const cvs = document.createElement("canvas");
    cvs.className = className;
    cvs.setAttribute("aria-hidden", "true");
    box.prepend(cvs);
    const ctx2 = cvs.getContext("2d");
    let W = 0, H = 0, last = 0, travel = 0, running = false;
    const st = { opacity: 0, mask: 0, offsetY: 0 };

    // 원본과 같은 LCG 시드(719) → 매번 같은 별 배치
    let seed = 719;
    const rnd = () => (seed = (1664525 * seed + 0x3c6ef35f) >>> 0) / 0x100000000;
    const stars = Array.from({ length: COUNT }, () => ({ x: 2 * rnd() - 1, y: 2 * rnd() - 1, z: rnd(), size: rnd(), alpha: 0.2 + 0.6 * rnd() }));
    const mod = (e, t) => ((e % t) + t) % t;
    const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };

    function resize() {
      const w = box.clientWidth, h = box.clientHeight, dpr = Math.min(devicePixelRatio || 1, 1.75);
      if (w === W && h === H) return;
      W = w; H = h;
      cvs.width = Math.round(W * dpr);
      cvs.height = Math.round(H * dpr);
      cvs.style.width = `${W}px`;
      cvs.style.height = `${H}px`;
      ctx2.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw(now) {
      resize();
      const r = now / 1000;
      const dt = last ? Math.min(0.064, Math.max(0, r - last)) : 0;
      last = r;
      travel += 1.8 * dt * S * SPEED;
      ctx2.clearRect(0, 0, W, H);

      const tanH = Math.tan((FOV * Math.PI) / 360);
      const D = N * tanH * 0.72;              // 세로 퍼짐
      const O = D * (W / H);                  // 가로 퍼짐
      const focal = H / 2 / tanH;
      const cx = W * 0.5 + focal * 0.1;       // 진행 방향을 오른쪽으로 0.1 기울인 소실점
      const cy = H * 0.5 + st.offsetY;
      const proj = (x, y, dist) => [cx + (x / dist) * focal, cy - (y / dist) * focal];

      for (const s of stars) {
        const dist = U + mod(s.z * N - travel * P, N);
        const n = smooth(U, 0.8 * P, dist) * (1 - smooth(0.86 * N, N, dist)); // 너무 가깝거나 멀면 페이드
        if (n < 0.005) continue;
        const X = s.x * O, Y = s.y * D;
        const [a, o] = proj(X, Y, dist);
        if (a < -30 || a > W + 30 || o < -30 || o > H + 30) continue;
        const c = Math.min(2.8, Math.max(0.65, 0.55 + 0.5 * s.size + (0.85 * P) / dist)); // 가까울수록 큼
        const d = 0.5 + 0.5 * Math.sin(r * (1.1 + 1.3 * s.size) + 41 * s.x + 23 * s.y); // 반짝임
        const p = M * n * Math.min(1, s.alpha + S * (0.12 + 0.28 * d * d)) * st.opacity * BRIGHTNESS;
        if (p <= 0) continue;

        // 빛 꼬리 : 진행 방향으로 0.32 앞선 지점과 이어진 선 (최대 32px)
        if (S > 0 && s.size > 0.45) {
          const [bx, by] = proj(X, Y, dist + 0.32 * P * S * TRAIL);
          let ex = bx - a, ey = by - o;
          const len = Math.hypot(ex, ey);
          const k = Math.min(1, 32 / Math.max(1, len));
          ex *= k; ey *= k;
          if (len > 1) {
            const g = ctx2.createLinearGradient(a + ex, o + ey, a, o);
            g.addColorStop(0, `rgba(${TRAIL_RGB},0)`);
            g.addColorStop(1, `rgba(${TRAIL_RGB},${TRAIL_ALPHA})`);
            ctx2.globalAlpha = p;
            ctx2.strokeStyle = g;
            ctx2.lineWidth = Math.min(1.2, 0.7 * c);
            ctx2.beginPath();
            ctx2.moveTo(a + ex, o + ey);
            ctx2.lineTo(a, o);
            ctx2.stroke();
          }
        }
        ctx2.globalAlpha = p;
        ctx2.fillStyle = STAR_COLOR;
        ctx2.fillRect(a, o, c, c);
        if (s.size > 0.94) { // 큰 별 십자 반짝임
          ctx2.globalAlpha = p * S * Math.pow(d, 5) * 0.4;
          ctx2.fillRect(a - 1.5, o + 0.3, 4, 0.6);
          ctx2.fillRect(a + 0.3, o - 1.5, 0.6, 4);
        }
      }
      ctx2.globalAlpha = 1;

      if (st.mask > 0) { // Hero → About 원형 마스크
        ctx2.save();
        ctx2.globalCompositeOperation = "destination-out";
        ctx2.beginPath();
        ctx2.arc(W * 0.5, H * 0.5, Math.hypot(W, H) * 0.5 * st.mask, 0, Math.PI * 2);
        ctx2.fill();
        ctx2.restore();
      }
    }
    const loop = (now) => { if (!running) return; draw(now); requestAnimationFrame(loop); };
    return {
      st,
      start() { if (running || reduced) return; running = true; last = 0; requestAnimationFrame(loop); },
      stop() { running = false; },
      still() { st.opacity = 1; draw(0); },
    };
  };
  const starField = createStarField($(".top-circle"), "top-stars");
  if (reduced) starField.still();

  // 밤하늘 : Skills부터 끝까지 깔리는 Hero와 똑같은 별 (개수·밝기·빛꼬리·속도 모두 동일)
  // 배경이 미색 → 다크로 바뀌는 구간에 맞춰 나타남. 화면 밖이면 그리기 멈춤
  const skyEl = $(".night-sky");
  const nightSky = createStarField(skyEl, "night-stars");
  nightSky.st.opacity = 1;
  let skyStill = false;
  function updateSky(s) {
    if (bgKeys.length < 5) return;
    const t = clamp((s - bgKeys[3][0]) / (bgKeys[4][0] - bgKeys[3][0]));
    skyEl.style.opacity = t.toFixed(3);
    if (t <= 0) return nightSky.stop();
    if (reduced) { if (!skyStill) { skyStill = true; nightSky.still(); } return; }
    nightSky.start();
  }


  // 인트로 (원본: 로고 영상 재생 → onEnded 시 p=true). 영상 대신 글자 순차 등장 후 p=true
  const topSection = $(".top");
  const topLogo = $(".top-logo");
  const navEl = $(".nav");
  const btnScrollBox = $(".btn-scroll-box");
  const btnScroll = $(".scroll-cue");
  const revealPaper = $(".reveal-paper");
  let introDone = false;
  let aboutTopY = 0;
  let topWrapBottom = Infinity;
  let lastScroll = 0;
  let scrollDir = 1;

  // 두 줄 제목(DESIGNER / WHO CODES) — 크기는 CSS(--fs-display)로 고정, 줄마다 글자 단위로 쪼개 인트로에 사용
  function fitLogo() {} // 한 줄 폭 맞춤은 더 이상 쓰지 않음 (onRefresh 호출 호환용)
  $$(".top-logo-line", topLogo).forEach((line) => {
    line.innerHTML = line.textContent
      .split("")
      .map((c) => `<span class="top-logo-mask"><span class="ch">${c === " " ? "&nbsp;" : c}</span></span>`)
      .join("");
  });

  // Hero 원칙 문장 타이핑 순환 (구 Approach). 토큰 단위로 민트 키워드 표시, 호버 시 한국어
  const leadRotator = (() => {
    const box = $(".lead-rotator");
    const textEl = $(".lead-text", box);
    const icon = $(".lead-icon", box);
    // v1 3D 아이콘 (원래 쓰던 이미지)
    const ICONS = Object.fromEntries(["accent-loop", "accent-star", "accent-bolt", "accent-equals"].map((n) => [n, `<img src="assets/reveal/${n}.webp" alt="" draggable="false" />`]));
    const LINES = [
      { icon: "accent-loop", en: [["I understand what users feel and turn it into "], ["clear ideas.", 1]], ko: "저는 사용자를 감각으로 읽어내고, 그 감각을 논리로 구현합니다." },
      { icon: "accent-star", en: [["I shape ideas through "], ["design", 1], [" and bring them to life with "], ["code.", 1]], ko: "디자인으로 해석하고, 코드로 해독하는 디자이너." },
    ];
    const TYPE_MS = 34, ERASE_MS = 14, HOLD_MS = 2800;
    let idx = 0, token = 0, hovering = false;
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const esc = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;");
    // 문장을 처음에 한 글자씩 span으로 한 번만 깔아 두고, 타이핑은 글자를 '보이게'만 바꿈.
    // DOM 구조가 그대로라 자간·줄폭이 변하지 않음 → 가운데 정렬 줄이 흔들리지 않음. 캐럿은 절대 위치로 따라감
    let built = null, chars = [], caret = null;
    const build = (tokens) => {
      let html = "";
      for (const [t, point] of tokens) for (const ch of t) html += `<span class="lc${point ? " -point" : ""}">${esc(ch)}</span>`;
      textEl.innerHTML = html + `<span class="lead-caret" aria-hidden="true"></span>`;
      chars = Array.from(textEl.querySelectorAll(".lc"));
      caret = textEl.querySelector(".lead-caret");
      built = tokens;
    };
    const render = (tokens, count, typing = true) => {
      if (built !== tokens || !caret || !textEl.contains(caret)) build(tokens);
      chars.forEach((el, i) => el.classList.toggle("on", i < count));
      caret.classList.toggle("is-typing", typing);
      const ref = chars[Math.max(0, count - 1)];
      if (!ref) return;
      const x = count > 0 ? ref.offsetLeft + ref.offsetWidth : ref.offsetLeft;
      const h = ref.offsetHeight;
      caret.style.height = `${h * 0.72}px`;
      caret.style.transform = `translate(${x}px, ${ref.offsetTop + h * 0.14}px)`;
    };
    const total = (tokens) => tokens.reduce((n, [t]) => n + t.length, 0);
    // 아이콘이 사라진 사이에 다음 문장 자리를 잡음 → 문장 길이가 바뀌며 생기는 위치 이동이 안 보임
    const swapTo = async (line) => {
      icon.classList.add("is-swap");
      await wait(220);
      icon.innerHTML = ICONS[line.icon];
      textEl.classList.remove("is-ko");
      render(line.en, 0);
      icon.classList.remove("is-swap");
    };
    // 언어 전환은 흐림 교차(0.14s 아웃 → 바로 인)로 빠르고 부드럽게. 연속 호버 시 마지막 요청만 반영
    let langSeq = 0;
    const crossfade = async (apply) => {
      const seq = ++langSeq;
      textEl.classList.add("is-fading");
      await wait(reduced ? 0 : 140);
      if (seq !== langSeq) return;
      apply();
      textEl.classList.remove("is-fading");
    };
    const showKo = () => crossfade(() => { textEl.classList.add("is-ko"); textEl.textContent = LINES[idx].ko; });
    async function run(id) {
      while (id === token) {
        const line = LINES[idx];
        await swapTo(line);
        const n = total(line.en);
        for (let c = 0; c <= n; c++) { if (id !== token) return; if (!hovering) render(line.en, c); await wait(TYPE_MS); }
        if (!hovering) render(line.en, n, false);
        await wait(HOLD_MS);
        while (hovering && id === token) await wait(120); // 호버 중엔 다음 문장으로 넘어가지 않음
        if (id !== token) return;
        for (let c = n; c >= 0; c--) { while (hovering && id === token) await wait(120); if (id !== token) return; render(line.en, c); await wait(ERASE_MS); }
        idx = (idx + 1) % LINES.length;
        await wait(260);
      }
    }
    const setEn = () => { textEl.classList.remove("is-ko"); render(LINES[idx].en, total(LINES[idx].en), false); };
    const showEn = () => crossfade(setEn);
    const touch = matchMedia("(hover: none)").matches;
    if (touch) {
      box.addEventListener("click", () => { hovering = !hovering; hovering ? showKo() : showEn(); });
    } else {
      box.addEventListener("mouseenter", () => { hovering = true; showKo(); });
      box.addEventListener("mouseleave", () => { hovering = false; showEn(); });
    }
    return {
      start() {
        if (reduced) { // 모션 줄이기: 타이핑 없이 4초마다 교체
          const show = () => { icon.innerHTML = ICONS[LINES[idx].icon]; setEn(); };
          show();
          setInterval(() => { if (!hovering) { idx = (idx + 1) % LINES.length; show(); } }, 4000);
          return;
        }
        token++;
        run(token);
      },
    };
  })();

  function finishIntro() {
    if (introDone) return;
    introDone = true;
    gsap.to(starField.st, { opacity: 1, duration: reduced ? 0 : 1.8, ease: "power2.out" }); // 별은 제목과 함께 서서히 켜짐
    topSection.classList.remove("is-intro");
    topLogo.classList.remove("is-intro");
    navEl.classList.remove("is-intro");
    btnScrollBox.classList.add("is-in");
    document.documentElement.style.overflow = "";
    lenis?.start();
  }
  // 아래 원칙 문장 : 제목 모션이 끝난 뒤 등장 + 타이핑 시작
  let leadStarted = false;
  function startLead() {
    if (leadStarted) return;
    leadStarted = true;
    $$(".lead p").forEach((p) => p.classList.add("active"));
    leadRotator.start();
  }
  if (reduced) {
    finishIntro();
    startLead();
  } else {
    navEl.classList.add("is-intro");
    // 제목 글자가 아래에서 올라오는 동안 메뉴·별·스크롤 표시가 함께 켜지고,
    // 마지막 글자가 눈으로 보기에 자리 잡는 시점(expo.out 약 60%)에 원칙 문장 타이핑 시작
    const LOGO_DUR = 1.1, LOGO_STAGGER = 0.035;
    const chars = gsap.utils.toArray(".top-logo .ch");
    gsap.from(chars, { yPercent: 110, duration: LOGO_DUR, ease: "expo.out", stagger: LOGO_STAGGER, onComplete: startLead });
    gsap.delayedCall((chars.length - 1) * LOGO_STAGGER + LOGO_DUR * 0.6, startLead);
    requestAnimationFrame(() => requestAnimationFrame(finishIntro));
  }

  // 원본 홈 top 스크롤 로직 (weare = 다음 섹션 → 여기선 About)
  function updateTop(t) {
    const vh = innerHeight;
    const i = clamp((t - aboutTopY + vh) / vh); // weare.ratio.y
    const o = t / vh;
    let u = vh * 0.5 - t;
    if (u < 0) u = 0;
    if (circleField) {
      circleField.radiusScale = 1.5 + o;
      circleField.opacity = introDone ? 0.6 - clamp(o * 0.8) * 0.6 : 0;
      circleField.maskProgress = i;
      circleField.translate(0, u);
      i >= 1 ? circleField.stop() : circleField.start();
    }
    // 별은 Hero → About 회전 → 프로필까지 고정으로 유지 (원형 미색 전환은 3단계에서 프로필 뒤로 옮길 예정)
    starField.st.mask = 0;
    revealPaper.style.visibility = "hidden";
    root.classList.remove("is-revealing");
    starField.st.offsetY = u * 0.35;
    // 별 캔버스가 들어있는 .top-wrap이 화면을 벗어나면 렌더 중지
    t > topWrapBottom ? starField.stop() : starField.start();

    // 원본 Cz(type: "scroll") — 화면 높이 25%~60% 구간에서 페이드
    if (t !== lastScroll) scrollDir = t > lastScroll ? 1 : -1;
    lastScroll = t;
    const a = vh * 0.25;
    const b = vh * 0.6;
    if (t > a && t < b && scrollDir === 1) {
      btnScroll.style.opacity = `${1 - (t - a) / (b - a)}`;
      btnScroll.style.transform = `translateY(${(40 * (t - a)) / (b - a)}px)`;
    }
    if (t < a && scrollDir === -1) {
      btnScroll.style.opacity = `${(a - t) / a}`;
      btnScroll.style.transform = `translateY(${40 - (40 * (a - t)) / a}px)`;
    }
    if (t >= b) btnScroll.style.opacity = "0";
  }

  /* ---------- 4. about : bauer People rotation ---------- */
  const ab = {
    box: $(".about-title-box"),
    ring: $(".about-ring"),
    content: $(".about-content"),
    h2: $(".about-h2"),
    head: $(".about-head"),
    photo: $(".about-photo"),
    photoImg: $(".about-photo img"),
    desc: $(".about-desc"),
    after: $(".about-after"),
    reveals: $$(".about-reveal"),
    spacer: $(".about-spacer"),
  };
  let spacerTop = 0, headShift = 0, groupShift = 0;
  const measureAbout = () => {
    spacerTop = top(ab.spacer);
    const mobile = innerWidth < 1024;
    const gap = parseFloat(getComputedStyle(ab.content).getPropertyValue("--about-gap")) || 24;
    // 데스크톱: [사진+HELLO] 묶음이 가운데 오도록 HELLO를 오른쪽으로 / 모바일: 사진은 HELLO 위
    headShift = mobile ? 0 : (ab.photo.offsetWidth + gap) / 2;
    // 사진(위로 튀어나온 만큼)~버튼까지 전체가 화면 세로 가운데 오도록
    const above = mobile ? ab.photo.offsetHeight + 14 : Math.max(0, ab.photo.offsetHeight - ab.h2.offsetHeight);
    groupShift = (above - ab.after.offsetHeight) / 2;
  };
  function updateAbout(s) {
    const vh = innerHeight;
    const ry = (s - spacerTop + vh) / vh; // ratio.y
    const yc = clamp(ry); // ratio.yClamp
    const mobile = innerWidth < 1024;
    ab.ring.style.transform = `translate3d(0,0,0) scale(${(mobile ? 0.5 : 0.3) + clamp(ry)})`;
    ab.ring.style.opacity = `${1 - yc}`;
    ab.box.style.color = rgb(mix([250, 247, 243], [111, 242, 198], yc)); // bauer 흰색→파랑 lerp 자리 → 미색→민트(#6FF2C6)
    ab.h2.style.transform = `perspective(1000px) translate3d(0,0,0) rotateY(${360 * yc}deg)`;

    ab.content.style.transform = `translate3d(0,0,0) scale(${clamp(0.4 + yc * 0.6)})`;

    // 2단계 : 회전이 끝나 제자리에 오면 사진 등장 + 한국어로 번역 + 버튼 (스크롤 연동·되감기 가능)
    const p = clamp((ry - 1) / 0.6);
    const ease = (t) => 1 - Math.pow(1 - clamp(t), 3); // easeOutCubic
    const seg = (a, b) => ease((p - a) / (b - a));
    ab.content.style.transform = `translate3d(0,${groupShift * seg(0, 0.6)}px,0) scale(${clamp(0.4 + yc * 0.6)})`;
    ab.head.style.transform = `translate3d(${headShift * seg(0, 0.5)}px,0,0)`;
    const reveal = seg(0.05, 0.55);
    ab.photo.style.clipPath = mobile ? `inset(${(1 - reveal) * 100}% 0 0 0 round 16px)` : `inset(0 0 0 ${(1 - reveal) * 100}% round 16px)`;
    ab.photoImg.style.transform = `scale(${1.25 - 0.25 * reveal})`;
    ab.desc.classList.toggle("is-ko", p > 0.25); // 번역 순간 (CSS 흐림 교차)
    ab.reveals.forEach((el) => {
      const q = seg(0.5, 0.95);
      el.style.opacity = `${q}`;
      el.style.transform = `translate3d(0,${(1 - q) * 16}px,0)`;
      el.style.pointerEvents = q > 0.5 ? "auto" : "none";
    });
  }

  /* ---------- 6. works : 3D concave ring gallery ---------- */
  const projects = [
    {
      tag: "AQUA PLANET", img: "assets/project1/figma/project-left.webp",
      caption: "AN IMMERSIVE AQUARIUM EXPERIENCE, BUILT FOR THE WEB.",
      title: "K브랜드 웹사이트 리뉴얼 팀프로젝트",
      built: "랜딩·마린랩·티켓 페이지 개발을 맡고, 전 페이지가 공유하는 인터랙션 시스템을 설계했습니다.",
      duration: "2026.06.04 — 2026.07.03",
      bars: [["기획", 60], ["디자인", 70], ["개발", 90]],
      links: [["Website", "https://ezen-aquaplanet-project.vercel.app/"], ["Figma", "https://www.figma.com/proto/RNZVS2U4p1upluVvq78tTL/personal?page-id=237%3A398&node-id=237-1640&viewport=612%2C783%2C0.08&t=Y3y3Dgch0k1oZkVg-1&scaling=min-zoom&content-scaling=fixed"]],
    },
    {
      tag: "LAYER", img: "assets/project1/figma/project-center.webp",
      caption: "A SCENT COMMUNITY WHERE TASTE BECOMES CONVERSATION.",
      title: "AI 챗봇 커뮤니티 프로젝트",
      built: "온보딩과 홈을 메인으로 개발하고, 앱 전반의 기능 구현과 더미데이터 설계를 담당했습니다.",
      duration: "2026.07.04 — 2026.07.29",
      bars: [["기획", 70], ["디자인", 70], ["개발", 90]],
      links: [["Website", "https://ezen-layerproject.vercel.app/"], ["Figma", "https://www.figma.com/proto/RNZVS2U4p1upluVvq78tTL/personal?page-id=237%3A5040&node-id=237-5053&viewport=690%2C571%2C0.03&t=DIbfmwmD9cwUu7El-1&scaling=min-zoom&content-scaling=fixed"]],
    },
    {
      tag: "MOA", img: "assets/project1/figma/project-right.webp",
      caption: "A FRIENDLY GUIDE FOR BETTER EVERYDAY CHOICES.",
      title: "선택을 돕는 질문형 결정 도우미 앱",
      built: "사용자가 스스로 기준을 찾도록, UX 설계부터 디자인·개발까지 전 과정을 직접 담당했습니다.",
      duration: "2026.03.26 — 2026.05.29",
      bars: [["기획", 100], ["디자인", 100], ["개발", 100]],
      links: [["Website", "https://moa-app-indol.vercel.app/"], ["Figma", "https://www.figma.com/proto/IYUwIKFuLk3G0BmvlsoH9h/%EC%B5%9C%ED%95%B4%EC%88%98-%EB%AA%A8%EC%95%84?page-id=1159%3A1255&node-id=1159-2682&viewport=1063%2C1162%2C0.03&t=5qcWExPYTwMcfkE4-1&scaling=contain&content-scaling=fixed&starting-point-node-id=1159%3A2682"]],
    },
    {
      tag: "3D OBJECT", img: null,
      ph: ["3D OBJECT", "Blender × Codex — 자료 준비 중"],
      caption: "A 3D STRUCTURE BUILT WITH BLENDER AND CODEX.",
      title: "Blender · Codex로 만든 3D 구조물",
      built: "Blender로 3D 구조물을 모델링하고, Codex(AI 코딩)를 활용해 제작 과정을 자동화했습니다. (자료 받으면 교체)",
      duration: "준비 중",
      bars: null,
      links: [],
    },
    {
      tag: "DETAIL PAGE", img: null,
      ph: ["DETAIL PAGE", "상세페이지 · AEO — 자료 준비 중"],
      caption: "PRODUCT DETAIL PAGE · HTML · AEO",
      title: "상세페이지 HTML 작업 · AEO 최적화",
      built: "상세페이지를 HTML로 직접 구현하고, AI 검색 답변(AEO)에 인용되도록 구조를 최적화했습니다. (자료 받으면 교체)",
      duration: "준비 중",
      bars: null,
      links: [],
    },
  ];
  // 볼록 링 3D 갤러리 (원통 바깥에 카드가 붙은 구조 + 바닥 반사 + PREV/NEXT)
  //  - 프로젝트 5개 × 2 = 10칸, 36° 간격 (레퍼런스와 같은 칸 수) → 정면 1장 + 좌우로 뒤로 물러나며 꺾인 카드
  //  - 카드: rotateY(각도) translateZ(R)  /  링: translateZ(-R) rotateY(-회전)  → 정면 카드가 z=0
  const SLOTS = projects.length * 2;
  const STEP_DEG = 360 / SLOTS;
  const ring = $(".ring");
  const cards = Array.from({ length: SLOTS }, (_, slot) => {
    const p = projects[slot % projects.length];
    const card = document.createElement("button");
    card.type = "button";
    card.className = "ring-card" + (p.img ? "" : " is-placeholder");
    card.setAttribute("aria-label", `${p.tag} 보기`);
    card.innerHTML = p.img
      ? `<img src="${p.img}" alt="" draggable="false" /><span class="rc-tag">${p.tag}</span>`
      : `<div class="ph"><b>${p.ph[0]}</b><span>${p.ph[1]}</span></div><span class="rc-tag">${p.tag}</span>`;
    card.addEventListener("click", () => { if (!dragMoved) goTo(slot + Math.round((rot.deg - slot * STEP_DEG) / 360) * SLOTS); });
    ring.appendChild(card);
    return card;
  });
  const rot = { deg: 0 };
  let ringR = 0, target = 0, activeIndex = -1, dragMoved = false;
  const norm = (a) => ((((a + 180) % 360) + 360) % 360) - 180; // -180~180

  function layoutRing() {
    const w = ring.offsetWidth;
    ringR = Math.round((w / 2 / Math.tan(Math.PI / SLOTS)) * 1.1); // 카드 사이 살짝 틈
    cards.forEach((c, i) => (c.style.transform = `rotateY(${i * STEP_DEG}deg) translateZ(${ringR}px)`));
    renderRing();
  }
  function renderRing() {
    ring.style.transform = `translateZ(${-ringR}px) rotateY(${-rot.deg}deg)`;
    cards.forEach((c, i) => {
      const rel = Math.abs(norm(i * STEP_DEG - rot.deg));
      c.style.visibility = rel > 80 ? "hidden" : "visible"; // 원통 뒤쪽으로 돌아간 카드는 숨김
      c.style.opacity = `${clamp(1 - (rel / STEP_DEG) * 0.3, 0, 1)}`;
      c.classList.toggle("is-front", rel < STEP_DEG / 2);
    });
    const slot = Math.round(rot.deg / STEP_DEG);
    setActive(((slot % projects.length) + projects.length) % projects.length);
  }
  function goTo(slot) {
    target = slot;
    gsap.to(rot, { deg: slot * STEP_DEG, duration: reduced ? 0 : 0.9, ease: "power3.inOut", overwrite: true, onUpdate: renderRing });
  }
  $(".ring-prev").addEventListener("click", () => goTo(target - 1));
  $(".ring-next").addEventListener("click", () => goTo(target + 1));
  addEventListener("keydown", (e) => {
    const r = $(".works").getBoundingClientRect();
    if (r.top > innerHeight * 0.5 || r.bottom < innerHeight * 0.5) return; // Works가 화면 중앙에 있을 때만
    if (e.key === "ArrowLeft") goTo(target - 1);
    if (e.key === "ArrowRight") goTo(target + 1);
  });

  // 드래그·스와이프로 돌리기 (놓으면 가까운 칸으로 스냅)
  const ringViewport = $(".ring-viewport");
  let dragX = 0, dragDeg = 0, dragging = false;
  ringViewport.addEventListener("pointerdown", (e) => {
    dragging = true; dragMoved = false; dragX = e.clientX; dragDeg = rot.deg;
    gsap.killTweensOf(rot);
  });
  addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - dragX;
    if (Math.abs(dx) > 4) dragMoved = true;
    rot.deg = dragDeg - (dx / ring.offsetWidth) * STEP_DEG * 1.2;
    renderRing();
  });
  addEventListener("pointerup", () => {
    if (!dragging) return;
    dragging = false;
    goTo(Math.round(rot.deg / STEP_DEG));
    setTimeout(() => (dragMoved = false), 0);
  });

  const wd = {
    box: $(".works-detail"), idx: $(".wd-index b"), caption: $(".wd-caption"), title: $(".wd-title"),
    built: $(".wd-built"), duration: $(".wd-duration"), bars: $(".wd-bars"), links: $(".wd-links"),
  };
  let swapTimer = 0;
  function setActive(i) {
    if (i === activeIndex) return;
    const first = activeIndex === -1;
    activeIndex = i;
    const p = projects[i];
    const fill = () => {
      wd.idx.textContent = String(i + 1).padStart(2, "0");
      wd.caption.textContent = p.caption;
      wd.title.textContent = p.title;
      wd.built.textContent = p.built;
      wd.duration.textContent = p.duration;
      wd.bars.innerHTML = p.bars
        ? p.bars.map(([k, v]) => `<li><span>${k}</span><span class="bar"><i style="width:${v}%"></i></span><span>${v}%</span></li>`).join("")
        : "";
      wd.links.innerHTML = p.links.length
        ? p.links.map(([k, u]) => `<a href="${u}" target="_blank" rel="noopener noreferrer">${k} ↗</a>`).join("")
        : `<span>자료 준비 중</span>`;
      wd.box.classList.remove("is-swapping");
    };
    clearTimeout(swapTimer);
    if (first) return fill();
    wd.box.classList.add("is-swapping");
    swapTimer = setTimeout(fill, 220);
  }

  /* ---------- 7. studies strip ---------- */
  const studies = [
    // 이름은 각 배포 사이트의 <title> 기준 (이미지·링크는 원래 맞았고 이름만 어긋나 있었음)
    ["Qude", "assets/clone-coding/clone-03.webp", "https://clonecode-virid.vercel.app/"],
    ["한화케미컬", "assets/clone-coding/clone-04.webp", "https://clonecoding2.vercel.app/"],
    ["Y Studio", "assets/clone-coding/clone-05.webp", "https://clonecoding3.vercel.app/"],
    ["Crew A La mode", "assets/clone-coding/clone-06.webp", "https://clonecoding4.vercel.app/"],
    ["대방산업", "assets/clone-coding/clone-01.webp", "https://clonecoding5.vercel.app/"],
    ["Musign", "assets/clone-coding/clone-02.webp", "https://clonecodiing6.vercel.app/"],
  ];
  // bauer-lab About people 카드: 짝수=down(아래에서), 홀수=up(위에서) / 뒷판(이름) → 0.3s 뒤 앞판(이미지)
  const studiesList = $(".studies-row");
  studiesList.innerHTML = studies
    .map(([n, img, url], i) => `<li class="card-item" data-dir="${i % 2 === 0 ? "down" : "up"}"><a class="card-link" href="${url}" target="_blank" rel="noopener noreferrer" aria-label="${n} 클론코딩 (새 창)">`
      + `<div class="card-img__back"><div class="info-box"><div class="info-box__inner"><span class="name">${n}</span><p class="position"><span>Web Study. 0${i + 1} ↗</span></p></div></div></div>`
      + `<div class="card-img__front"><img src="${img}" alt="" loading="lazy" /></div></a></li>`)
    .join("");

  (function initStudyCards() {
    const cards = $$(".card-item", studiesList);
    const trigger = $(".studies-trigger");
    const timers = [];
    const play = () => cards.forEach((c, i) => {
      clearTimeout(timers[i]);
      timers[i] = setTimeout(() => c.classList.add("active"), i * 100);
    });
    const reset = () => cards.forEach((c, i) => {
      clearTimeout(timers[i]);
      c.classList.remove("active");
    });
    if (reduced) return cards.forEach((c) => c.classList.add("active"));

    const mobile = matchMedia("(max-width: 1023px)");
    let io = null;
    const setup = () => {
      io?.disconnect();
      reset();
      if (mobile.matches) {
        // 모바일: 카드마다 개별 관찰 (bauer in-view-from-bottom)
        io = new IntersectionObserver((entries) => entries.forEach((e) => {
          if (e.isIntersecting || e.boundingClientRect.bottom < 0) e.target.classList.add("active");
          else if (e.boundingClientRect.top > innerHeight * 0.5) e.target.classList.remove("active");
        }));
        cards.forEach((c) => io.observe(c));
        return;
      }
      // 데스크톱: 리스트 중앙 트리거가 화면에 들어오면 순차 등장, 리스트가 다시 아래로 빠지면 리셋
      // (원본은 '아래에서 들어올 때'만 재생 → 메뉴 클릭·새로고침으로 점프하면 안 열리는 문제가 있어 방향 조건 제거)
      io = new IntersectionObserver((entries) => entries.forEach((e) => {
        if (e.target === trigger) {
          if (e.isIntersecting && !cards[0].classList.contains("active")) play();
        } else if (!e.isIntersecting && e.boundingClientRect.top > innerHeight * 0.5) reset();
      }));
      io.observe(trigger);
      io.observe(studiesList);
    };
    setup();
    mobile.addEventListener("change", setup);
  })();

  /* ---------- section titles : v1 initCodeSectionTitles 글자 등장 ----------
     글자를 단어 상자 안에서 yPercent 145 → 0 (0.72s power3.out, stagger 0.028).
     제목 윗변이 화면 높이 1.08배 지점보다 위로 오면 재생, 다시 아래로 내려가면 리셋 (v1 수치 그대로) */
  (function initTitleRise() {
    const groups = $$("[data-rise]").map((el) => {
      const label = el.textContent.trim();
      el.setAttribute("aria-label", label);
      el.textContent = "";
      label.split(/\s+/).forEach((w, i, arr) => {
        const word = document.createElement("span");
        word.className = "rise-word";
        word.setAttribute("aria-hidden", "true");
        [...w].forEach((ch) => {
          const l = document.createElement("span");
          l.className = "rise-letter";
          l.textContent = ch;
          word.append(l);
        });
        el.append(word);
        if (i < arr.length - 1) el.append(" ");
      });
      return { el, letters: $$(".rise-letter", el), shown: false };
    });
    if (reduced || !groups.length) return;
    groups.forEach((g) => gsap.set(g.letters, { yPercent: 145 }));
    const check = () => groups.forEach((g) => {
      if (g.el.getBoundingClientRect().top < innerHeight * 1.08) {
        if (g.shown) return;
        g.shown = true;
        // 끝나면 transform 제거: 3D 레이어로 남으면 크롬이 가변폰트 굵기를 잃어 얇게 그림
        gsap.fromTo(g.letters, { yPercent: 145 }, { yPercent: 0, duration: 0.72, ease: "power3.out", stagger: 0.028, overwrite: true, clearProps: "transform" });
      } else if (g.shown) {
        g.shown = false;
        gsap.set(g.letters, { yPercent: 145, overwrite: true });
      }
    });
    addEventListener("scroll", check, { passive: true });
    check();
  })();

  /* 섹션 제목 페이드아웃: 메인 콘텐츠가 화면 가운데로 올라오면 제목(제목+부제)이 스크롤에 맞춰 사라짐.
     기준점 = 콘텐츠 윗변 + min(높이/2, 화면 25%) → 긴 타임라인 목록도 첫 줄 부근이 가운데 올 때 사라짐.
     기준점이 화면 80% → 50% 지점을 지나는 동안 opacity 1 → 0 (위로 스크롤하면 다시 나타남).
     SKILLS(고정 무대 안 목록과 한 덩어리)·Let's talk(제목이 곧 콘텐츠)은 제외 */
  (function initHeadFade() {
    const pairs = [
      [".works .v1-head", ".ring-viewport"],
      [".studies .v1-head", ".studies-row"],
      [".timeline .v1-head", ".timeline-shell"],
    ].map(([h, c]) => ({ head: $(h), content: $(c) })).filter((p) => p.head && p.content);
    if (reduced || !pairs.length) return;
    const paint = () => pairs.forEach(({ head, content }) => {
      const r = content.getBoundingClientRect();
      const anchor = r.top + Math.min(r.height / 2, innerHeight * 0.25);
      const t = clamp((innerHeight * 0.8 - anchor) / (innerHeight * 0.3));
      head.style.opacity = (1 - t * t * (3 - 2 * t)).toFixed(3); // smoothstep
    });
    addEventListener("scroll", paint, { passive: true });
    addEventListener("resize", paint);
    paint();
  })();

  /* 타임라인 부제 페이드인 (v1 .experience-intro-text 그대로):
     윗변이 화면 72% 선을 넘으면 opacity 0 → 1, 1.2s. 한 번 켜지면 유지 */
  (function initSubFade() {
    const subs = $$("[data-fade-in]");
    if (reduced || !subs.length) return;
    subs.forEach((el) => el.classList.add("fade-ready"));
    const check = () => {
      subs.forEach((el) => {
        if (el.getBoundingClientRect().top < innerHeight * 0.72) el.classList.add("is-faded-in");
      });
      if (subs.every((el) => el.classList.contains("is-faded-in"))) removeEventListener("scroll", check);
    };
    addEventListener("scroll", check, { passive: true });
    check();
  })();

  /* ---------- 8. skills : v1 tools.js 그대로 이식 (아이콘 경로만 assets) ----------
     스크롤 고정 구간 진행도에 따라 왼쪽·오른쪽 레일 카드가 번갈아 올라오고, 지나가는 카드의 퍼센트 링이 채워지며
     가운데 목록의 해당 도구가 강조됨. 호버(터치는 탭) 시 카드가 뒤집혀 아이콘·설명. 1100px 이하는 카드 숨김 */
  (function initSkills() {
    const FEATURED_TOOLS = [
      { name: "Figma", icon: "assets/tools/figma.webp", level: "상", fillPercent: 90, desc: "와이어프레임부터 프로토타입까지 전 과정에 사용했습니다" },
      { name: "Three.js", icon: "assets/tools/three-js.webp", level: "중상", fillPercent: 75, desc: "카메라, 조명, 지오메트리를\n다뤄 3D 씬을 구현했습니다" },
      { name: "GSAP", icon: "assets/tools/gsap.webp", level: "중상", fillPercent: 75, desc: "타임라인과 트리거로 정교한 스크롤 연출을 만들었습니다" },
      { name: "React", icon: "assets/tools/react.webp", level: "중상", fillPercent: 75, desc: "재사용 가능한 컴포넌트와\n 상태 관리로 화면을 \n구조화했습니다" },
      { name: "TypeScript", icon: "assets/tools/typescript.webp", level: "중상", fillPercent: 75, desc: "타입을 정의해 재사용 가능한 UI를 구축했습니다" },
      { name: "Claude / Code", icon: "assets/tools/anthropic.webp", level: "상", fillPercent: 90, desc: "기획부터 코드까지 효율적인 작업을 진행하였습니다" },
      { name: "Blender", icon: "assets/tools/blender.webp", level: "중", fillPercent: 60, desc: "AI 스크립트를 통해\n 3D 애니메이션을 추가했습니다" },
      { name: "HTML", icon: "assets/tools/html.webp?v=2", level: "상", fillPercent: 90, desc: "시맨틱 마크업으로 접근성\n높은 구조를 만들었습니다" },
      { name: "CSS", icon: "assets/tools/css.webp?v=2", level: "상", fillPercent: 90, desc: "반응형 레이아웃과 스타일로 화면을 구현했습니다" },
    ];
    const toolsSection = $(".skills");
    const pinShell = $(".tools-pin-shell", toolsSection);
    const pinStage = $(".tools-pin-stage", toolsSection);
    const mobileQuery = matchMedia("(max-width: 1100px)");
    const coarsePointerQuery = matchMedia("(pointer: coarse)");
    const svgNS = "http://www.w3.org/2000/svg";

    const createToolCard = (tool) => {
      const card = document.createElement("div");
      card.className = "tool-card";
      card.style.setProperty("--fill-percent", tool.fillPercent);
      // 상자 없이 퍼센트 링만. 호버(터치는 탭) 시 링 안 이름 → 로고, 링 아래에 한 줄 설명
      card.innerHTML = `<span class="tool-progress-wrap"><img class="tool-card-icon" src="${tool.icon}" alt="" aria-hidden="true" /></span>`
        + `<span class="tool-card-desc"></span>`;
      $(".tool-card-desc", card).textContent = tool.desc;
      const progress = document.createElementNS(svgNS, "svg");
      progress.classList.add("tool-progress");
      progress.setAttribute("viewBox", "0 0 110 110");
      progress.setAttribute("aria-hidden", "true");
      ["tool-progress-track", "tool-progress-fill"].forEach((cls) => {
        const c = document.createElementNS(svgNS, "circle");
        c.classList.add(cls);
        c.setAttribute("cx", "55");
        c.setAttribute("cy", "55");
        c.setAttribute("r", "52.5");
        c.setAttribute("pathLength", "100");
        progress.append(c);
      });
      const name = document.createElement("span");
      name.className = "tool-card-name";
      name.textContent = tool.name;
      $(".tool-progress-wrap", card).append(progress, name);
      return card;
    };

    const leftRail = $('[data-tool-col="left"]', toolsSection);
    const rightRail = $('[data-tool-col="right"]', toolsSection);
    const leftTools = FEATURED_TOOLS.filter((_, i) => i % 2 === 0);
    const rightTools = FEATURED_TOOLS.filter((_, i) => i % 2 !== 0);
    // 왼쪽·오른쪽 번갈아 하나의 순서 → 한 번에 카드 하나만 켜짐
    const sequence = [];
    for (let i = 0; i < Math.max(leftTools.length, rightTools.length); i++) {
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
          card.style.top = `${Math.min(Math.max(spread * 100, 44.5), 55.5).toFixed(2)}%`;
          rail.append(card);
          return { card, center: Math.min(Math.max(spread, 0.06), 0.94), tool };
        });
    };
    const halfWindow = 0.1;
    const leftEntries = buildRail(leftRail, "left");
    const rightEntries = buildRail(rightRail, "right");
    const allEntries = [...leftEntries, ...rightEntries];
    const toolListItems = $$(".tools-category li", toolsSection);
    const railHeights = new Map();
    const getListLabel = (n) => (n === "HTML" || n === "CSS" ? "HTML / CSS" : n);

    const updateActiveToolLabel = (progress) => {
      const activeEntry = allEntries.filter(({ center }) => progress > center - halfWindow * 0.35).sort((a, b) => b.center - a.center)[0];
      const activeLabel = activeEntry ? getListLabel(activeEntry.tool.name) : "";
      toolListItems.forEach((item) => item.classList.toggle("is-active-tool", item.textContent.trim() === activeLabel));
    };
    const measureRails = () => {
      railHeights.set(leftRail, leftRail.getBoundingClientRect().height);
      railHeights.set(rightRail, rightRail.getBoundingClientRect().height);
    };
    const applyMotion = (entries, rail, progress) => {
      const riseDistance = (railHeights.get(rail) || 800) * 0.55;
      entries.forEach(({ card, center }) => {
        const localT = Math.max(Math.min((progress - center) / halfWindow, 1.3), -1.3);
        const enterOpacity = Math.max(Math.min((localT + 1.3) / 0.85, 1), 0);
        const exitOpacity = Math.max(Math.min((1.16 - localT) / 0.16, 1), 0);
        const opacity = Math.min(enterOpacity, exitOpacity);
        card.style.transform = `translateY(${(-localT * riseDistance).toFixed(2)}px)`;
        card.style.opacity = opacity.toFixed(3);
        card.style.visibility = opacity === 0 ? "hidden" : "visible";
        card.classList.toggle("is-ring-active", localT > -0.35 && opacity > 0);
      });
    };
    const resetCardStyles = () => {
      allEntries.forEach(({ card }) => {
        card.style.transform = "";
        card.style.opacity = "";
        card.style.visibility = "";
        card.classList.toggle("is-ring-active", reduced);
      });
      toolListItems.forEach((item) => item.classList.remove("is-active-tool"));
    };

    let sectionInView = false, frame = null;
    const paint = () => {
      frame = null;
      if (!sectionInView) return;
      if (reduced || mobileQuery.matches) return resetCardStyles();
      const rect = pinShell.getBoundingClientRect();
      const scrollable = Math.max(rect.height - pinStage.offsetHeight, 1);
      const progress = Math.min(Math.max(-rect.top / scrollable, 0), 1);
      applyMotion(leftEntries, leftRail, progress);
      applyMotion(rightEntries, rightRail, progress);
      updateActiveToolLabel(progress);
    };
    const requestPaint = () => { if (frame === null) frame = requestAnimationFrame(paint); };

    measureRails();
    addEventListener("resize", () => { measureRails(); requestPaint(); });
    addEventListener("scroll", requestPaint, { passive: true });
    new IntersectionObserver(([entry]) => {
      sectionInView = entry.isIntersecting;
      if (sectionInView) requestPaint();
    }, { rootMargin: "25% 0px", threshold: 0 }).observe(toolsSection);
    mobileQuery.addEventListener("change", requestPaint);
    $$(".tool-card", toolsSection).forEach((card) => card.addEventListener("click", () => {
      if (coarsePointerQuery.matches) card.classList.toggle("is-flipped");
    }));
  })();

  /* ---------- 9. timeline : v1 updateExperienceTimeline 그대로 ----------
     - 가운데 선이 화면 65% 지점 기준으로 NOW 점까지 차오름
     - 항목은 화면 72% 선을 넘으면 아래에서 떠오름(한 번 켜지면 유지), 사진은 0.35s 늦게
     - 배경 큰 연도: 화면 55% 선에 걸린 항목의 연도로 글자별 교체(짝수번째는 왼쪽), 첫 항목 전엔 2004 가운데
     - NOW: 고정된 화면에서 스크롤만큼 링이 차오르고 점이 켜짐 */
  (function initTimeline() {
    const section = $(".timeline");
    const head = $(".timeline .v1-head");
    const shell = $(".timeline-shell");
    const progress = $(".timeline-progress");
    const items = $$(".experience-item");
    const ambient = $(".timeline-ambient");
    const yearEl = $("[data-timeline-ambient-year]");
    const nowItem = $(".experience-now");
    const nowStage = $(".now-stage"), nowRing = $(".now-ring"), nowContent = $(".now-content"), nowTitle = $(".now-title");
    if (!section || !shell || !progress || !items.length || !ambient || !yearEl) return;

    // 연도 교체: 이전 연도는 복제본으로 원래 자리에 남겨 위로 빠져나가게 하고(0.4s),
    // 새 연도는 기다리지 않고 바로 새 자리에서 올라옴 → 빠르게 스크롤해도 연도가 밀리지 않음
    const leaveYear = () => {
      const letters = $$(".timeline-ambient-letter", yearEl);
      if (reduced || !letters.length || !ambient.classList.contains("is-visible")) return;
      gsap.killTweensOf(letters);
      const r = yearEl.getBoundingClientRect();
      const ghost = yearEl.cloneNode(true);
      ghost.removeAttribute("data-timeline-ambient-year");
      ghost.classList.add("is-leaving");
      Object.assign(ghost.style, { left: `${r.left}px`, top: `${r.top}px`, right: "auto", transform: "none" });
      ambient.append(ghost);
      gsap.to($$(".timeline-ambient-letter", ghost), {
        yPercent: -135, opacity: 0, duration: 0.4, ease: "power2.in", stagger: 0.025, onComplete: () => ghost.remove(),
      });
    };
    const setYear = (label, applyPos) => {
      leaveYear();
      const build = () => {
        applyPos?.();
        yearEl.textContent = "";
        yearEl.dataset.label = label;
        const letters = [...label].map((ch) => {
          const clip = document.createElement("span");
          const letter = document.createElement("span");
          clip.className = "timeline-ambient-letter-clip";
          letter.className = "timeline-ambient-letter";
          letter.textContent = ch === " " ? " " : ch;
          clip.append(letter);
          yearEl.append(clip);
          return letter;
        });
        if (reduced) return;
        gsap.fromTo(letters, { yPercent: 135, opacity: 0 }, {
          yPercent: 0, opacity: 1, duration: 0.72, ease: "power3.out", stagger: 0.035,
          overwrite: true, immediateRender: true, clearProps: "transform",
        });
      };
      build();
    };
    // 같은 연도·같은 자리로 되돌아오면(NOW → 인턴 등) 교체하지 않고 글자만 제자리 확인
    const keepYear = () => {
      gsap.to($$(".timeline-ambient-letter", yearEl), { yPercent: 0, opacity: 1, duration: 0.45, ease: "power3.out", overwrite: true, clearProps: "transform" });
    };

    let activeIdx = -1;
    const update = () => {
      const vh = innerHeight;
      const sr = section.getBoundingClientRect();
      // 배경 연도는 섹션 윗변이 아니라 TIMELINE 제목 기준 (위 여백을 늘려서 빈 공간에서 먼저 뜨던 문제)
      const headTop = head ? head.getBoundingClientRect().top : sr.top;
      ambient.classList.toggle("is-visible", headTop < vh * 0.8 && sr.bottom > vh * 0.28);
      if (sr.bottom < -vh * 0.25 || sr.top > vh * 1.25) return;

      // 배경 큰 연도
      const line = vh * 0.55;
      if (items[0].getBoundingClientRect().top > line) {
        if (activeIdx !== -2) {
          activeIdx = -2;
          ambient.classList.remove("is-now");
          if (ambient.classList.contains("is-center") && yearEl.dataset.label === "2004") keepYear();
          else setYear("2004", () => { ambient.classList.remove("is-left"); ambient.classList.add("is-center"); });
        }
      } else {
        const nr = nowItem?.getBoundingClientRect();
        const isNowStage = Boolean(nr && nr.top <= line && nr.bottom > 0);
        let active = isNowStage ? nowItem : items.find((it) => {
          const r = it.getBoundingClientRect();
          return r.top <= line && r.bottom > line;
        });
        if (!active) active = [...items].reverse().find((it) => it.getBoundingClientRect().top <= line) || items[0];
        const idx = items.indexOf(active);
        if (idx >= 0 && idx !== activeIdx) {
          activeIdx = idx;
          const isNow = active === nowItem;
          ambient.classList.toggle("is-now", isNow); // NOW: 레이어 전체가 0.7s 페이드아웃
          if (!isNow) {
            const left = idx % 2 === 1;
            const label = active.dataset.timelineYear || "";
            const samePlace = !ambient.classList.contains("is-center") && ambient.classList.contains("is-left") === left;
            if (samePlace && yearEl.dataset.label === label) keepYear();
            else setYear(label, () => { ambient.classList.toggle("is-left", left); ambient.classList.remove("is-center"); });
          }
        }
      }

      // 가운데 진행선
      const shellR = shell.getBoundingClientRect();
      const marker = $(".experience-now .timeline-dot", shell)?.getBoundingClientRect();
      const endY = marker ? Math.max(marker.top + marker.height / 2 - shellR.top, 1) : Math.max(shellR.height, 1);
      shell.style.setProperty("--timeline-end-y", `${endY.toFixed(2)}px`);
      progress.style.height = `${(clamp((vh * 0.65 - shellR.top) / endY) * endY).toFixed(2)}px`;

      // 항목 등장 + NOW 링
      items.forEach((item) => {
        const r = item.getBoundingClientRect();
        if (r.top < vh * 0.72) $(".experience-content", item)?.classList.add("is-faded-in");
        if (item === nowItem) {
          // About updateAbout 과 같은 값: 고정이 시작된 뒤 100vh 동안 진행 (yc 0 → 1)
          const ry = -r.top / vh;
          const yc = reduced ? 1 : clamp(ry);
          item.classList.toggle("is-revealed", ry > 0.02);
          if (nowRing) {
            nowRing.style.transform = `translate(-50%,-50%) scale(${(innerWidth < 1024 ? 0.5 : 0.3) + yc})`;
            nowRing.style.opacity = `${reduced ? 0 : 1 - yc}`;
            nowStage.style.color = rgb(mix([250, 247, 243], [111, 242, 198], yc)); // 미색 → 민트
            nowTitle.style.transform = `perspective(1000px) rotateY(${360 * yc}deg)`;
            nowContent.style.transform = `scale(${clamp(0.4 + yc * 0.6)})`;
          }
        }
      });
    };

    let raf = 0;
    const request = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => { raf = 0; update(); });
    };
    addEventListener("scroll", request, { passive: true });
    addEventListener("resize", request);
    update();
  })();

  /* ---------- 9-1. figma : 예전 HOW I WORK 창 목업 되살림 ----------
     - 창 등장: 예전 .step 등장값 그대로 (y 70 → 0, opacity 0 → 1, 1s power3.out, 화면 85% 지점)
     - 창 안: 예전 피그마 창의 파란 선택 박스(scale 1.04 → 1, 0.35s power2.out)가
       Haesoo 커서를 따라 작업 화면을 하나씩 선택 → 반복 (화면에 보일 때만 재생) */
  (function initFigma() {
    const win = $(".figma-window");
    if (!win) return;
    win.addEventListener("click", (e) => {
      if (win.getAttribute("href") !== "#") return; // 링크가 들어오면 그대로 새 탭으로 열림
      e.preventDefault();
      botSay("피그마 링크를 받으면 연결할게요!");
    });
    gsap.from(win, {
      y: 70, opacity: 0, duration: 1, ease: "power3.out", clearProps: "transform,opacity", // 끝나면 호버 transform 이 먹도록 정리
      scrollTrigger: { trigger: win, start: "top 85%" },
    });

    const canvas = $(".fg-canvas", win), sel = $(".fg-select", win), label = $("em", sel), cursor = $(".fg-cursor", win);
    const shots = $$(".fg-shot", win);
    if (!canvas || !shots.length) return;
    const box = (s) => ({ left: s.offsetLeft - 4, top: s.offsetTop - 4, width: s.offsetWidth + 8, height: s.offsetHeight + 8 });
    const cursorAt = (b) => ({ x: b.left + b.width * 0.72, y: b.top + b.height * 0.7 });

    if (reduced) {
      const b = box(shots[0]);
      gsap.set(sel, { ...b, opacity: 1 });
      gsap.set(cursor, { ...cursorAt(b), opacity: 1 });
      return;
    }
    let tl = null, visible = false;
    const build = () => {
      tl?.kill();
      const first = cursorAt(box(shots[0]));
      gsap.set(cursor, { x: first.x, y: first.y, opacity: 1 });
      gsap.set(sel, { opacity: 0 });
      tl = gsap.timeline({ repeat: -1, paused: true });
      shots.forEach((s) => {
        const b = box(s);
        tl.to(cursor, { ...cursorAt(b), duration: 0.8, ease: "power3.inOut" })
          .call(() => { label.textContent = s.dataset.name; })
          .set(sel, { ...b, scale: 1.04 })
          .to(sel, { opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" })
          .to({}, { duration: 1 })
          .to(sel, { opacity: 0, duration: 0.25 });
      });
      if (visible) tl.play();
    };
    build();
    new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      visible ? tl.play() : tl.pause();
    }, { threshold: 0.35 }).observe(canvas);
    let rt = 0;
    addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(build, 200); });
  })();

  /* ---------- 10. cursor + bot ---------- */
  const dot = $(".cursor-dot");
  const dx = gsap.quickTo(dot, "x", { duration: 0.18, ease: "power3.out" });
  const dy = gsap.quickTo(dot, "y", { duration: 0.18, ease: "power3.out" });
  const pupils = $$(".bot-pupil");
  const hls = $$(".bot-hl");
  const bot = $(".bot");
  addEventListener("mousemove", (e) => {
    if (!dot.classList.contains("is-on")) { gsap.set(dot, { x: e.clientX, y: e.clientY }); dot.classList.add("is-on"); } // 첫 움직임 전엔 (0,0)에 숨김
    dx(e.clientX);
    dy(e.clientY);
    const r = bot.getBoundingClientRect();
    const ang = Math.atan2(e.clientY - (r.top + r.height * 0.42), e.clientX - (r.left + r.width / 2));
    pupils.forEach((p, i) => {
      const bx = i ? 132 : 66;
      p.setAttribute("cx", `${bx + Math.cos(ang) * 6}`);
      p.setAttribute("cy", `${108 + Math.sin(ang) * 6}`);
    });
    hls.forEach((p, i) => {
      p.setAttribute("cx", `${(i ? 136.5 : 70.5) + Math.cos(ang) * 6}`);
      p.setAttribute("cy", `${103 + Math.sin(ang) * 6}`);
    });
  });
  document.documentElement.addEventListener("mouseleave", () => dot.classList.remove("is-on"));
  document.addEventListener("mouseover", (e) => dot.classList.toggle("is-link", !!e.target.closest("a, button, .lead-rotator")));
  const botLabel = $(".bot-label");
  let sayTimer = 0;
  function botSay(text) { // 말풍선을 잠깐 펼쳐 메시지 표시
    botLabel.textContent = text;
    bot.classList.add("is-saying");
    clearTimeout(sayTimer);
    sayTimer = setTimeout(() => {
      bot.classList.remove("is-saying");
      setTimeout(() => (botLabel.textContent = "I'm Haesoo Bot!"), 360);
    }, 2200);
  }
  bot.addEventListener("click", () => botSay("챗봇은 본 작업에서 연결할게요"));

  /* ---------- frame loop + refresh ---------- */
  function onRefresh() {
    aboutTopY = top($(".about"));
    topWrapBottom = top($(".top-wrap")) + $(".top-wrap").offsetHeight;
    fitLogo();
    measureAbout();
    computeBgKeys();
    computeGroups();
    layoutRing();
    frame();
  }
  function frame() {
    const s = scrollY;
    updateBg(s);
    updateSky(s);
    updateNav(s);
    updateTop(s);
    updateAbout(s);
  }
  ScrollTrigger.addEventListener("refresh", onRefresh);
  gsap.ticker.add(() => {
    frame();
  });
  addEventListener("load", () => ScrollTrigger.refresh());
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  onRefresh();
})();
