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
  // 클릭 시점에 계산 (ab·worksEl·top 은 아래에서 선언되지만 클릭은 스크립트가 다 실행된 뒤라 문제없음)
  const NAV_STOPS = {
    // About: 원 안에 HELLO·영어 설명이 막 자리 잡은 지점, 회전 시작 직전 (updateAbout 의 ry = 0)
    about: () => top(ab.spacer) - innerHeight,
    // Works: 원형 막이 다 열려 미색 위에 MY WORKS 제목이 보이는 지점 (updateWorks 의 hole 100%)
    works: () => top(worksEl) + innerHeight,
  };
  $$('a[href^="#"]').forEach((a) =>
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      e.preventDefault();
      if (id.length < 2) return;
      const target = $(id);
      if (!target) return;
      // data-stop: 섹션 맨 위가 아니라 콘텐츠가 다 올라온 지점에 멈춤 (GNB·View Project·푸터 링크)
      const stopFn = NAV_STOPS[a.dataset.stop];
      const dest = stopFn ? stopFn() : target.getBoundingClientRect().top + scrollY + Number(a.dataset.offset || 0);
      if (lenis) lenis.scrollTo(dest, { duration: 2, easing: easeInOutQuart });
      else scrollTo({ top: dest, behavior: "smooth" });
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
      // Works는 자기 미색 배경 + 원형 마스크로 열림 → 페이지 배경(메뉴 글자색 기준)은 구멍이 열리는 동안 미색으로
      // (메뉴가 있는 위쪽 모서리는 구멍이 거의 다 열려야 드러나므로 0.9 ~ 1.0 구간에서 전환)
      [worksTop + vh * 0.9, COLOR.warm],
      [worksTop + vh * 1.0, COLOR.paper],
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
  // v1 heroBuddyIntroSignal: 해수봇이 먼저 떨어져 착지(+방향키 풍선)한 뒤 제목이 올라옴. 봇이 안 뜨는 경우 대비 1.5초 뒤엔 무조건 진행
  let botIntroDone;
  const botIntro = new Promise((resolve) => (botIntroDone = resolve));
  setTimeout(() => botIntroDone(), 1500);
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
    const LINES = [
      { en: [["I understand what users feel and turn it into "], ["clear ideas.", 1]], ko: "저는 사용자를 감각으로 읽어내고, 그 감각을 논리로 구현합니다." },
      { en: [["I shape ideas through "], ["design", 1], [" and bring them to life with "], ["code.", 1]], ko: "디자인으로 해석하고, 코드로 해독하는 디자이너." },
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
      // 빈 줄일 땐 캐럿 숨김: 다 지운 뒤 / 새 문장 치기 전 캐럿이 문장 시작점으로 툭 점프하는 게 안 보이게
      caret.classList.toggle("is-empty", count === 0);
      const ref = chars[Math.max(0, count - 1)];
      if (!ref) return;
      const x = count > 0 ? ref.offsetLeft + ref.offsetWidth : ref.offsetLeft;
      const h = ref.offsetHeight;
      caret.style.height = `${h * 0.72}px`;
      caret.style.transform = `translate(${x}px, ${ref.offsetTop + h * 0.14}px)`;
    };
    const total = (tokens) => tokens.reduce((n, [t]) => n + t.length, 0);
    // 다음 문장으로 교체 (문장 옆 아이콘은 삭제함)
    const swapTo = async (line) => {
      textEl.classList.remove("is-ko");
      render(line.en, 0);
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
          const show = () => setEn();
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
    gsap.set(chars, { yPercent: 110 }); // 봇 등장이 끝날 때까지 글자는 아래에 숨겨 둠
    botIntro.then(() => {
      gsap.to(chars, { yPercent: 0, duration: LOGO_DUR, ease: "expo.out", stagger: LOGO_STAGGER, onComplete: startLead });
      gsap.delayedCall((chars.length - 1) * LOGO_STAGGER + LOGO_DUR * 0.6, startLead);
    });
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

  /* ---------- 6. works : Featured Projects ----------
     - 원형 막: bauer U8.draw(ratio.y - 1) → 섹션 윗변이 화면 맨 위에 닿은 뒤 100vh 동안 구멍 반지름 0 → 대각선/2
     - 3D 나선: 예전 클론코딩 섹션 initSpiralExperience 그대로 (three.js). 이미지·이름·링크만 Featured 프로젝트로 바꿈 */
  const worksEl = $(".works");
  const worksMask = $(".works-mask");
  function updateWorks() {
    if (!worksEl) return;
    const vh = innerHeight;
    const r = worksEl.getBoundingClientRect();
    if (r.bottom < 0 || r.top > vh) return;
    worksMask?.style.setProperty("--hole", `${((Math.hypot(innerWidth, vh) / 2) * clamp(-r.top / vh)).toFixed(1)}px`);
    // 예전 chapter-content-progress 그대로: 나선 영역 윗변이 화면 96% → 62% 지점으로 오는 동안 0 → 1
    const content = $(".works-head + .spiral-scroll-shell");
    if (content) {
      const progress = reduced ? 1 : clamp((vh * 0.96 - content.getBoundingClientRect().top) / Math.max(vh * 0.34, 1));
      const value = progress.toFixed(4);
      if (content.style.getPropertyValue("--chapter-content-progress") !== value) content.style.setProperty("--chapter-content-progress", value);
    }
  }

  // 이미지가 아직 없는 프로젝트는 thumbnail 대신 placeholder(제목|부제)로 줄무늬 카드를 그려서 씀
  // meta/desc: 기존 WORKS 섹션 설명 문구 그대로, contribution: 예전 기여도(학원 프로젝트 3개만) — 나선 오른쪽 캡션에 표시
  const spiralProjectData = [
    { id: "aqua-planet", number: "001", title: "AQUA PLANET", thumbnail: "assets/project1/figma/project-left.webp", cta_url: "https://ezen-aquaplanet-project.vercel.app/",
      meta: "K브랜드 웹사이트 리뉴얼 팀프로젝트 · 2026.06 — 07", desc: ["랜딩·마린랩·티켓 페이지 개발과 생물·로고 3D 작업을 맡고,", "전 페이지가 공유하는 인터랙션 시스템을 설계했습니다."], contribution: { 기획: 60, 디자인: 70, 개발: 90 } },
    { id: "layer", number: "002", title: "LAYER", thumbnail: "assets/project1/figma/project-center.webp", cta_url: "https://ezen-layerproject.vercel.app/",
      meta: "AI 챗봇 커뮤니티 프로젝트 · 2026.07", desc: ["온보딩과 홈을 메인으로 개발하고,", "앱 전반의 기능 구현과 더미데이터 설계를 담당했습니다."], contribution: { 기획: 70, 디자인: 70, 개발: 90 } },
    { id: "moa", number: "003", title: "MOA", thumbnail: "assets/project1/figma/project-right.webp", cta_url: "https://moa-app-indol.vercel.app/",
      meta: "선택을 돕는 질문형 결정 도우미 앱 · 2026.03 — 05", desc: ["사용자가 스스로 기준을 찾도록,", "UX 설계부터 디자인·개발까지 전 과정을 직접 담당했습니다."], contribution: { 기획: 100, 디자인: 100, 개발: 100 } },
    { id: "3d-object", number: "004", title: "3D OBJECT", thumbnail: "assets/project1/figma/project-3d.webp", cta_url: "projects/archery-hero-3d/",
      meta: "개인 외주 3D 인트로 작업 · 2026.09", desc: ["컨셉에 맞는 3D 구조물을 제작해,", "스크롤로 움직이는 홈페이지 도입부를 맡았습니다."] },
    { id: "detail-page", number: "005", title: "DETAIL PAGE", thumbnail: "assets/project1/figma/project-detail.webp", cta_url: "https://www.figma.com/design/oo4VfoqKSHEvSa7WHH1yQL/%EC%B5%9C%ED%95%B4%EC%88%98-%EB%94%94%EC%9E%90%EC%9D%B8%EC%9E%90%EB%A3%8C?node-id=256-2&t=NhzBIBgTsLsU2SLI-1",
      meta: "상세페이지 디자인 · 2026.10 — 현재", desc: ["인턴 때 담당했던 상세페이지 작업을", "지금도 외주로 이어가고 있습니다."] },
    { id: "riman-hub", number: "006", title: "RIMAN KOREA", thumbnail: "assets/project1/figma/project-riman.webp", cta_url: "https://about.riman.com/ko",
      meta: "리만코리아 AEO 허브 사이트 · 2026.09 — 11", desc: ["AEO를 위한 허브 홈페이지를 만들고,", "사이트 안의 콘텐츠도 AEO에 맞게 최적화했습니다."] },
  ];
  const drawSpiralPlaceholder = (text) => {
    const [title, sub = ""] = text.split("|");
    const c = document.createElement("canvas");
    c.width = 1600; c.height = 900;
    const x = c.getContext("2d");
    x.fillStyle = "#2c2926"; x.fillRect(0, 0, 1600, 900);
    x.save(); x.strokeStyle = "#33302c"; x.lineWidth = 36;
    for (let k = -900; k < 2600; k += 72) { x.beginPath(); x.moveTo(k, 0); x.lineTo(k - 900, 900); x.stroke(); }
    x.restore();
    x.fillStyle = "#faf7f3"; x.textAlign = "center"; x.textBaseline = "middle";
    x.font = "700 92px 'SUIT Variable', SUIT, sans-serif"; x.fillText(title, 800, 420);
    x.globalAlpha = 0.7; x.font = "500 30px 'SUIT Variable', SUIT, sans-serif"; x.fillText(sub, 800, 510);
    return c;
  };

  const spiralSection = $(".spiral-section");
  const spiralStage = $(".spiral-stage");
  const spiralScrollShell = $(".spiral-scroll-shell");
  const spiralCanvas = $(".spiral-webgl");
  const spiralProjectCta = $(".spiral-project-cta");
  const spiralCaptionIndex = $("[data-spiral-caption-index]");
  const spiralCaptionTitle = $("[data-spiral-caption-title]");
  const spiralCaptionDesc = $("[data-spiral-caption-desc]");
  if (spiralProjectCta && spiralProjectCta.parentElement !== document.body) {
    document.body.appendChild(spiralProjectCta);
  }
  let spiralExperience = null;
  let spiralInitializing = false;

  const initSpiralExperience = async () => {
    if (!spiralCanvas || !spiralStage || !spiralProjectData.length || spiralExperience || spiralInitializing) return;
    spiralInitializing = true;

    try {
      const THREE = await import("./assets/vendor/three.module.min.js");
      await (document.fonts?.ready || Promise.resolve());
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(window.innerWidth < 900 ? 45 : 35, 1, 0.1, 100);
      const renderer = new THREE.WebGLRenderer({ canvas: spiralCanvas, antialias: true, alpha: true, powerPreference: "high-performance" });
      const textureLoader = new THREE.TextureLoader();
      const textures = await Promise.all(spiralProjectData.map((project) => (project.thumbnail
        ? textureLoader.loadAsync(project.thumbnail)
        : Promise.resolve(new THREE.CanvasTexture(drawSpiralPlaceholder(project.placeholder || project.title))))));
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
          // 예전 0.42 어둡기는 보정 전(화면 값) 기준 → 선형 값에선 0.42^2.2 ≈ 0.15 를 곱해야 같은 어둡기
          vec3 overlayColor = mix(color.rgb, color.rgb * 0.15, uHoverDim);
          gl_FragColor = vec4(overlayColor, alpha * uOpacity);
          // 텍스처를 sRGB→선형으로 풀어 샘플링하므로, 출력 직전에 다시 sRGB로 감아 원본 색을 유지
          #include <colorspace_fragment>
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
      let hoveredPlane = null;
      let pointerDown = null;
      let suppressNextClick = false;
      let renderFrameId = null;
      let renderLoopRunning = false;
      let spiralInView = false;
      let spiralScrollStart = 0;
      let spiralScrollDistance = 1;
      const mobileQuery = window.matchMedia("(max-width: 768px)");

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
        const width = Math.max(Math.hypot(corners[1].x - corners[0].x, corners[1].y - corners[0].y), 1);
        const height = Math.max(Math.hypot(corners[3].x - corners[0].x, corners[3].y - corners[0].y), 1);
        return { width, height };
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
        const captionParts = [spiralCaptionIndex, spiralCaptionTitle, spiralCaptionDesc].filter(Boolean);
        captionParts.forEach((el) => el.classList.remove("is-visible"));
        if (!project) return;

        window.setTimeout(() => {
          if (activeCaptionId !== projectId) return;
          spiralCaptionIndex.textContent = project.number;
          spiralCaptionTitle.textContent = project.title;
          // 오른쪽 설명: meta는 " · " 기준으로 나눠 굵게(프로젝트 설명 / 기간), 나머지는 한 줄씩
          if (spiralCaptionDesc) {
            const line = (text, className) => {
              const p = document.createElement("p");
              if (className) p.className = className;
              p.textContent = text;
              return p;
            };
            // 마지막 " · " 뒤가 기간(숫자로 시작)일 때만 두 줄로 나눔 — "Blender · Codex…" 같은 건 한 줄 유지
            const metaText = project.meta || "";
            const cut = metaText.lastIndexOf(" · ");
            const metaLines = cut > 0 && /^\d/.test(metaText.slice(cut + 3)) ? [metaText.slice(0, cut), metaText.slice(cut + 3)] : [metaText].filter(Boolean);
            const parts = [
              ...metaLines.map((text, i) => line(text, i === metaLines.length - 1 ? "spiral-active-caption-meta" : "spiral-active-caption-meta is-lead")),
              ...(project.desc || []).map((text) => line(text)),
            ];
            // 기여도: 항목별 가로 선그래프 (라벨 · 선 · 퍼센트)
            if (project.contribution) {
              const graph = document.createElement("div");
              graph.className = "spiral-contrib";
              Object.entries(project.contribution).forEach(([name, value], rowIndex) => {
                const row = document.createElement("div");
                row.className = "spiral-contrib-row";
                row.innerHTML = `<span class="spiral-contrib-name"></span><span class="spiral-contrib-track"><i></i></span><span class="spiral-contrib-value">${value}%</span>`;
                row.querySelector(".spiral-contrib-name").textContent = name;
                row.style.setProperty("--value", value / 100);
                row.style.setProperty("--row", rowIndex);
                graph.append(row);
                // 숫자도 선과 같은 타이밍으로 0% → 값까지 카운트업 (CSS 지연 260ms + 줄당 120ms, 1100ms)
                if (!reduced) {
                  const valueEl = row.querySelector(".spiral-contrib-value");
                  const start = performance.now() + 260 + rowIndex * 120;
                  valueEl.textContent = "0%";
                  const tick = (now) => {
                    if (!valueEl.isConnected) return;
                    const t = clamp((now - start) / 1100);
                    const eased = 1 - Math.pow(1 - t, 4);
                    valueEl.textContent = `${Math.round(value * eased)}%`;
                    if (t < 1) requestAnimationFrame(tick);
                  };
                  requestAnimationFrame(tick);
                }
              });
              parts.push(graph);
            }
            spiralCaptionDesc.replaceChildren(...parts);
          }
          captionParts.forEach((el) => el.classList.add("is-visible"));
        }, 220);
      };

      const render = () => {
        if (!renderLoopRunning) return;
        const progress = clamp((window.scrollY - spiralScrollStart) / spiralScrollDistance, 0, 1);
        // The ring uses repeated textures to look like a complete loop, but one scroll
        // travels only one lap of the unique projects.
        const targetOffset = progress * spiralProjectData.length;
        currentOffset = lerp(currentOffset, targetOffset, 0.1);
        if (Math.abs(targetOffset - currentOffset) < 0.0005) currentOffset = targetOffset;
        const scrollSpeed = currentOffset - previousOffset;
        previousOffset = currentOffset;
        const centerIndex = Math.floor(planes.length / 2);
        const fadeRange = 1.65;
        let frontZ = -Infinity;

        planes.forEach((plane, index) => {
          // +2: 맨 앞(z 최대) 자리는 relativeIndex 2 — 오프셋 0일 때 001이 그 자리에 오도록 두 칸 밀어줌 (안 밀면 003부터 보임)
          let normalizedIndex = index - currentOffset + 2;
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
          // 캡션은 화면 가운데 가장 앞(카메라에 가장 가까운) 카드 기준 — 예전엔 relativeIndex 0(오른쪽 옆면 카드)이라 어긋났음
          // 고리 반대편 끝(|relativeIndex|≈6)에서 사라지는 카드도 z가 커지므로 보이는 범위 안에서만 고름 — 안 그러면 번호가 앞뒤로 튐
          if (Math.abs(relativeIndex) < 4 && plane.position.z > frontZ) {
            frontZ = plane.position.z;
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
        if (spiralInView) startSpiralLoop();
        else stopSpiralLoop();
      };

      spiralCanvas.addEventListener("pointerdown", (event) => {
        if (mobileQuery.matches) return;
        pointerDown = { x: event.clientX, y: event.clientY };
        suppressNextClick = false;
        spiralCanvas.setPointerCapture?.(event.pointerId);
      });

      spiralCanvas.addEventListener("pointerup", (event) => {
        if (!pointerDown || mobileQuery.matches) return;
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
        if (event.detail === 0 || mobileQuery.matches) return;
        visitProject(getInteractivePlane(event));
      });

      spiralCanvas.addEventListener("pointermove", (event) => {
        if (mobileQuery.matches) return;
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
        if (mobileQuery.matches || !["Enter", " "].includes(event.key)) return;
        event.preventDefault();
        visitProject(hoveredPlane || getCenterPlane());
      });

      resize();
      window.addEventListener("resize", resize);
      ScrollTrigger.addEventListener("refresh", resize); // 위쪽 섹션 높이가 바뀌면 시작 위치 다시 계산
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
      window.addEventListener("scroll", syncSpiralLoop, { passive: true });

      spiralExperience = { renderer, scene, camera, planes, resize };
    } catch (error) {
      console.error("Spiral WebGL failed to initialize", error);
    } finally {
      spiralInitializing = false;
    }
  };
  // 모바일(840px 이하)은 3D 나선 대신 카드 목록 → 3D는 아예 안 띄움 (화면이 넓어지면 그때 띄움)
  const worksListQuery = matchMedia("(max-width: 840px)");
  if (worksListQuery.matches) worksListQuery.addEventListener("change", (e) => { if (!e.matches) initSpiralExperience(); });
  else initSpiralExperience();

  /* 모바일 MY WORKS 카드 목록: spiralProjectData 그대로 (이미지 → 번호·이름 → 굵은 줄(내용·기간) → 설명 → 기여도) */
  (function initWorksList() {
    const list = $("[data-works-list]");
    if (!list) return;
    const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
    list.innerHTML = spiralProjectData.map((p) => {
      const meta = p.meta || "";
      const cut = meta.lastIndexOf(" · ");
      const [lead, period] = cut > 0 && /^\d/.test(meta.slice(cut + 3)) ? [meta.slice(0, cut), meta.slice(cut + 3)] : [meta, ""];
      const linked = p.cta_url && p.cta_url !== "#";
      const tag = linked ? `a href="${esc(p.cta_url)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(p.title)} 사이트 보기 (새 창)"` : "div";
      const contrib = p.contribution
        ? `<div class="works-card-contrib">${Object.entries(p.contribution).map(([k, v]) => `<span class="works-card-contrib-row"><span>${esc(k)}</span><i style="--v:${v / 100}"></i><b>${v}%</b></span>`).join("")}</div>`
        : "";
      return `<li class="works-card">`
        + `<${tag} class="works-card-link"><span class="works-card-media"><img src="${esc(p.thumbnail)}" alt="" loading="lazy" /></span>`
        + `<span class="works-card-head"><span class="works-card-num">${esc(p.number)}</span><span class="works-card-title">${esc(p.title)}</span>${linked ? `<span class="works-card-go" aria-hidden="true">VIEW SITE ↗</span>` : ""}</span>`
        + `</${linked ? "a" : "div"}>`
        + `<p class="works-card-meta">${esc(lead)}${period ? `<span>${esc(period)}</span>` : ""}</p>`
        + `<p class="works-card-desc">${(p.desc || []).map(esc).join(" ")}</p>`
        + contrib
        + `</li>`;
    }).join("");
    // 화면에 들어오면 아래에서 살짝 올라오며 나타남 (한 번만)
    const cards = $$(".works-card", list);
    if (reduced || !("IntersectionObserver" in window)) { cards.forEach((c) => c.classList.add("is-in")); return; }
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
    }), { threshold: 0.15 });
    cards.forEach((c) => io.observe(c));
  })();

  /* ---------- 7. studies strip ---------- */
  const studies = [
    // 이름은 각 배포 사이트의 <title> 기준 (이미지·링크는 원래 맞았고 이름만 어긋나 있었음)
    // 4번째 값 true = 피그마에서 카드 모양(30° 기운 알약)대로 잘라 내보낸 이미지 → CSS .is-cutout으로 카드에 딱 맞춰 얹음
    ["Qude", "assets/clone-coding/qude.webp", "https://clonecode-virid.vercel.app/", true],
    ["한화케미컬", "assets/clone-coding/clone-04.webp", "https://clonecoding2.vercel.app/"],
    ["Y Studio", "assets/clone-coding/ystudio.webp", "https://clonecoding3.vercel.app/", true],
    ["Crew A La mode", "assets/clone-coding/crewalamode.webp", "https://clonecoding4.vercel.app/", true],
    ["대방산업", "assets/clone-coding/daebang.webp", "https://clonecoding5.vercel.app/", true],
    ["Musign", "assets/clone-coding/clone-02.webp", "https://clonecodiing6.vercel.app/"],
  ];
  // bauer-lab About people 카드: 짝수=down(아래에서), 홀수=up(위에서) / 뒷판(이름) → 0.3s 뒤 앞판(이미지)
  const studiesList = $(".studies-row");
  studiesList.innerHTML = studies
    .map(([n, img, url, cutout], i) => `<li class="card-item" data-dir="${i % 2 === 0 ? "down" : "up"}"><a class="card-link" href="${url}" target="_blank" rel="noopener noreferrer" aria-label="${n} 클론코딩 (새 창)">`
      + `<div class="card-img__back"><div class="info-box"><div class="info-box__inner"><span class="name">${n}</span><p class="position"><span>Web Study. 0${i + 1} ↗</span></p></div></div></div>`
      + `<div class="card-img__front"><img${cutout ? ' class="is-cutout"' : ""} src="${img}" alt="" loading="lazy" /></div></a></li>`)
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
      // data-rise-at: 재생 기준(화면 높이 배수). MY WORKS는 원형 마스크가 열린 뒤에야 보여서 0.7 — 기본 1.08이면 가려진 채로 끝남
      return { el, letters: $$(".rise-letter", el), shown: false, at: parseFloat(el.dataset.riseAt) || 1.08 };
    });
    if (reduced || !groups.length) return;
    groups.forEach((g) => gsap.set(g.letters, { yPercent: 145 }));
    const check = () => groups.forEach((g) => {
      if (g.el.getBoundingClientRect().top < innerHeight * g.at) {
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
      [".works-head", ".spiral-scroll-shell"], // MY WORKS도 CLONE CODING과 같게 사라짐
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
    const figmaSec = $(".figma-sec"), figmaPin = $(".figma-pin");
    let figmaShown = false;
    if (figmaPin) figmaPin.inert = true;
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
          // 회전이 끝나고 잠시 머문 뒤(1.3 ~ 1.8) 같은 자리에서 GROWING 페이드아웃 → 피그마 페이드인
          // (피그마 고정 화면은 CSS margin-top -160vh 로 1.2부터 같은 자리에 겹쳐 있음)
          const f = clamp((ry - 1.3) / 0.5);
          const fOut = clamp(f / 0.6), fIn = clamp((f - 0.4) / 0.6);
          if (nowContent) nowContent.style.opacity = `${1 - fOut}`;
          if (figmaPin) {
            figmaPin.style.opacity = `${fIn}`;
            figmaPin.style.transform = `translate3d(0,${((1 - fIn) * 24).toFixed(2)}px,0)`;
            const shown = fIn > 0.5;
            if (shown !== figmaShown) {
              figmaShown = shown;
              figmaSec.classList.toggle("is-shown", shown);
              figmaPin.inert = !shown; // 안 보이는 동안 링크에 탭 포커스가 가지 않게
            }
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
    // 등장은 GROWING 자리에서 페이드인 (initTimeline 에서 스크롤로 제어)

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

  /* ---------- 9-2. contact : v1 푸터 모션 그대로 ----------
     - 등장: [연락처] / [서명 + GNB] / [구분선 + 하단] 묶음이 제자리 기준 화면 98% 선에 닿으면 떠오름 (한 번 켜지면 유지)
     - 연락처 알약: 마우스 근처 글자가 탄성 있게 밀려남 (반경 58px, elastic.out) */
  (function initContact() {
    const section = $(".contact");
    if (!section) return;
    const groups = [
      [$(".contact-links")],
      [$(".contact-signature"), $(".contact-gnb")],
      [$(".contact-divider"), $(".contact-footer-meta")],
    ].map((g) => g.filter(Boolean)).filter((g) => g.length);
    const reveal = () => {
      if (section.getBoundingClientRect().top > innerHeight * 1.25) return;
      const line = innerHeight * 0.98;
      groups.forEach((g) => {
        const ok = g.every((el) => el.getBoundingClientRect().top - (el.classList.contains("is-revealed") ? 0 : 56) < line);
        if (ok) g.forEach((el) => el.classList.add("is-revealed"));
      });
    };
    addEventListener("scroll", reveal, { passive: true });
    addEventListener("resize", reveal);
    reveal();

    if (reduced || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    $$(".contact-links a").forEach((link) => {
      const label = link.textContent.trim();
      if (!link.getAttribute("aria-label")) link.setAttribute("aria-label", label);
      link.textContent = "";
      const motions = [...label].map((ch) => {
        const letter = document.createElement("span");
        letter.className = "contact-link-letter";
        letter.setAttribute("aria-hidden", "true");
        letter.textContent = ch === " " ? "\u00a0" : ch;
        link.append(letter);
        const q = (prop) => gsap.quickTo(letter, prop, { duration: 0.65, ease: "elastic.out(1, 0.45)" });
        return { letter, x: q("x"), y: q("y"), rotation: q("rotation") };
      });
      const resetLetters = () => motions.forEach((m) => { m.x(0); m.y(0); m.rotation(0); });
      link.addEventListener("pointermove", (e) => {
        const radius = 58;
        motions.forEach((m) => {
          const r = m.letter.getBoundingClientRect();
          const dx = r.left + r.width / 2 - e.clientX;
          const dy = r.top + r.height / 2 - e.clientY;
          const dist = Math.max(Math.hypot(dx, dy), 0.001);
          const k = Math.pow(Math.max(0, 1 - dist / radius), 1.6);
          m.x((dx / dist) * k * 15);
          m.y((dy / dist) * k * 15);
          m.rotation((dx / radius) * k * 7);
        });
      }, { passive: true });
      link.addEventListener("pointerleave", resetLetters);
      link.addEventListener("blur", resetLetters);
    });
  })();

  /* ---------- 10. cursor + bot ---------- */
  const dot = $(".cursor-dot");
  const dx = gsap.quickTo(dot, "x", { duration: 0.18, ease: "power3.out" });
  const dy = gsap.quickTo(dot, "y", { duration: 0.18, ease: "power3.out" });
  const pupils = $$(".bot-pupil");
  const hls = $$(".bot-hl");
  const bot = $(".bot");
  let mouseX = innerWidth / 2, mouseY = innerHeight / 2;
  addEventListener("mousemove", (e) => {
    if (!dot.classList.contains("is-on")) { gsap.set(dot, { x: e.clientX, y: e.clientY }); dot.classList.add("is-on"); } // 첫 움직임 전엔 (0,0)에 숨김
    dx(e.clientX);
    dy(e.clientY);
    mouseX = e.clientX;
    mouseY = e.clientY;
    syncTimelineHint();
  });

  // 커서 힌트 (v1 .cursor-hint 그대로): Timeline 영역 안인데 사진 위가 아닐 때 "Hover image !" 민트 알약이 커서를 따라다님
  const cursorHint = $(".cursor-hint");
  const timelineShell = $(".timeline-shell");
  const timelinePhotos = $$(".timeline-photo");
  const figmaSecForHint = $(".figma-sec"); // 피그마 창이 Timeline 위에 떠 있는 동안은 힌트를 끔
  const lastHintItem = $$(".experience-item:not(.experience-now)").pop(); // 힌트는 마지막 경력(Internship)까지만, GROWING에서는 끔
  let hintMoved = false;
  function syncTimelineHint() {
    if (!cursorHint || !timelineShell) return;
    hintMoved = true;
    cursorHint.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(20px, 20px)`;
    const r = timelineShell.getBoundingClientRect();
    const bottom = lastHintItem ? lastHintItem.getBoundingClientRect().bottom : r.bottom;
    const inside = mouseX >= r.left && mouseX <= r.right && mouseY >= r.top && mouseY <= bottom;
    const onPhoto = timelinePhotos.some((p) => {
      const pr = p.getBoundingClientRect();
      return mouseX >= pr.left && mouseX <= pr.right && mouseY >= pr.top && mouseY <= pr.bottom;
    });
    const onFigma = !!figmaSecForHint && figmaSecForHint.classList.contains("is-shown");
    cursorHint.classList.toggle("is-visible", inside && !onPhoto && !onFigma);
  }
  addEventListener("scroll", () => { if (hintMoved) syncTimelineHint(); }, { passive: true }); // 마우스를 가만히 두고 스크롤해도 맞춰 켜고 끔
  // 눈동자: 평소엔 마우스를, 날아가는 중엔 가는 방향을 봄 (해수봇 프레임 루프에서 호출)
  function setGaze(ang) {
    pupils.forEach((p, i) => {
      p.setAttribute("cx", `${(i ? 132 : 66) + Math.cos(ang) * 6}`);
      p.setAttribute("cy", `${108 + Math.sin(ang) * 6}`);
    });
    hls.forEach((p, i) => {
      p.setAttribute("cx", `${(i ? 136.5 : 70.5) + Math.cos(ang) * 6}`);
      p.setAttribute("cy", `${103 + Math.sin(ang) * 6}`);
    });
  }
  document.documentElement.addEventListener("mouseleave", () => dot.classList.remove("is-on"));
  document.addEventListener("mouseover", (e) => {
    dot.classList.toggle("is-link", !!e.target.closest("a, button, .lead-rotator"));
    dot.classList.toggle("is-ink", !!e.target.closest(".chatbot-modal-panel")); // 챗봇 창 위에선 검정 점
  });
  const botLabel = $(".bot-label");
  let sayTimer = 0;
  function botSay(text, ms = 2200) { // 말풍선을 잠깐 펼쳐 메시지 표시
    botLabel.textContent = text;
    bot.classList.add("is-saying");
    clearTimeout(sayTimer);
    sayTimer = setTimeout(() => {
      bot.classList.remove("is-saying");
      setTimeout(() => (botLabel.textContent = "I'm Haesoo Bot!"), 360);
    }, ms);
  }

  /* ---------- 10-1. chatbot : v1 initChatbotModal 그대로 (키워드 답변, 외부 API 없음) ----------
     답변 내용은 v1 기준 + 지금 사이트에 맞게 손봄 (Works 목록, 인턴 경험 추가, Sayout 답변 삭제) */
  const chat = (function initChatbot() {
    const modal = $("[data-chatbot-modal]");
    const closeButton = $("[data-chatbot-close]", modal || document);
    const conversation = $("[data-chat-log]", modal || document);
    const form = $("[data-chat-form]", modal || document);
    const input = $("[data-chat-input]", modal || document);
    const sendButton = $("[data-chat-send]", modal || document);
    const topicsWrapper = $("[data-chat-topics]", modal || document);
    const topicButtons = topicsWrapper ? $$("button", topicsWrapper) : [];
    if (!modal || !closeButton || !conversation || !form || !input || !sendButton) return null;

    const config = {
      greeting: "안녕하세요 ! 저는 최해수입니다. 포트폴리오나 작업 방식 또는 저에 대해 궁금한 점을 물어보세요.",
      suggestions: ["어떤 프로젝트를 했나요?", "가장 자신 있는 기술은?", "함께 일하려면 어떻게 하나요?"],
      qna: [
        { keywords: ["MOA결과", "4.12", "사용자평가", "25명", "984개", "MOA 성과"], answer: "MOA는 25명한테 40문항으로 사용자 평가를 받았어요. 미입력 16개 빼고 984개 응답 기준으로 평균 4.12점(5점 만점) 나왔고, 거기서 발견한 문제들(클릭 표현, 질문 흐름, 홈 화면 구조, 튜토리얼)은 다 개선했어요." },
        { keywords: ["MOA", "모아", "의사결정", "후보추천"], answer: "MOA는 선택지가 너무 많아서 결정이 어렵거나 남 의견에 자꾸 기대게 되는 문제를 풀려고 만든 질문형 결정 도우미 앱이에요. 답변 맥락에 따라 질문을 이어가면서 선택 기준을 정리해주고, 마지막엔 후보 세 개랑 추천 이유를 보여줘요. 2026년 3~5월에 UX 설계부터 디자인·개발까지 전 과정을 제가 직접 했어요." },
        { keywords: ["아쿠아플라넷", "AQUA", "Aqua Planet", "글래스모피즘"], answer: "2026년 6~7월에 한 K브랜드 웹사이트 리뉴얼 팀프로젝트예요. 아쿠아플라넷의 지점, 해양생물, 프로그램을 깊어지는 바다 느낌으로 소개하는 인터랙티브 웹이고, 저는 랜딩·마린랩·티켓 페이지 개발이랑 생물·로고 3D 작업을 맡았어요. 전 페이지가 같이 쓰는 인터랙션 시스템도 설계했고, 대용량 영상·3D 자산 때문에 생기는 성능 문제도 같이 줄여봤어요." },
        { keywords: ["LAYER", "레이어", "향수"], answer: "LAYER는 어렵고 방대한 향수 정보를 취향이랑 상황에 맞게 탐색하게 도와주는 AI 챗봇 커뮤니티 앱이에요(2026년 7월). 향수 성향 진단, 매거진, 후기랑 자유롭게 대화하는 커뮤니티, 사진 보고 어울리는 향 추천해주는 콘텐츠랑 챗봇까지 설계했고, 저는 온보딩이랑 홈을 메인으로 개발하면서 앱 전반의 기능 구현이랑 더미데이터 설계를 맡았어요." },
        { keywords: ["3D 구조물", "3D OBJECT", "3D 오브젝트", "구조물", "인트로", "Blender", "블렌더", "3D"], answer: "2026년 9월에 개인 외주로 맡은 작업이에요. 홈페이지 컨셉에 맞는 3D 구조물을 만들어서, 스크롤하면 움직이는 홈페이지 도입부를 맡았어요. MY WORKS의 004 카드를 누르면 직접 볼 수 있어요!" },
        { keywords: ["상세페이지", "상세 페이지", "DETAIL PAGE", "와디즈", "종근당"], answer: "인턴 때 담당했던 상세페이지 디자인을 지금(2026년 10월~)도 외주로 이어서 하고 있어요. 와디즈, 종근당 상세페이지를 진행했어요." },
        { keywords: ["리만", "RIMAN", "AEO", "허브 사이트", "허브사이트"], answer: "리만코리아 AEO 허브 사이트 작업이에요(2026년 9~11월). AI 검색 답변에 잘 인용되도록(AEO) 허브 홈페이지를 만들고, 사이트 안의 콘텐츠도 AEO에 맞게 최적화했어요. MY WORKS의 006 카드에서 실제 사이트로 갈 수 있어요." },
        { keywords: ["외주", "프리랜서", "freelance"], answer: "지금은 상세페이지 디자인 외주를 이어서 하고 있고(와디즈·종근당), 2026년 9월엔 홈페이지 도입부에 들어가는 3D 구조물 작업도 외주로 맡았어요." },
        { keywords: ["인턴", "Pyro", "파이로", "실무", "경력"], answer: "2026년 9월부터 11월까지 Pyro Creations에서 인턴으로 일했어요. 웹페이지·상세페이지 디자인이랑 SNS 콘텐츠 제작, AEO 최적화를 경험했고, 보기 좋은 화면을 넘어 사람과 AI 모두에게 잘 읽히는 디자인을 배웠어요. 그때 맡았던 상세페이지 작업은 지금도 외주로 이어가고 있어요." },
        { keywords: ["대표 프로젝트", "프로젝트 순서", "무엇부터", "추천 프로젝트"], answer: "UX 문제 정의랑 사용자 검증 과정 보고 싶으면 MOA 먼저 추천해요. 인터랙티브 웹 구현은 아쿠아플라넷, 콘텐츠 구조랑 감각적인 모바일 UI는 LAYER, AEO 작업은 리만코리아 허브 사이트에서 볼 수 있어요." },
        { keywords: ["클론", "clone"], answer: "실제 웹사이트의 구조랑 인터랙션을 분석해서 직접 재현해보는 클론코딩을 6개 했어요(Qude, 한화케미컬, Y Studio, Crew A La mode, 대방산업, Musign). MY WORKS 아래 CLONE CODING에서 카드 누르면 결과물을 바로 볼 수 있어요!" },
        { keywords: ["프로젝트", "작업물", "포트폴리오", "만든", "work"], answer: "MY WORKS에 여섯 개를 정리했어요. 아쿠아플라넷 웹사이트 리뉴얼, 향수 AI 챗봇 커뮤니티 LAYER, 질문형 결정 도우미 앱 MOA, 외주로 맡은 홈페이지 도입부 3D 구조물, 지금도 이어가는 상세페이지 디자인, 리만코리아 AEO 허브 사이트예요. 카드를 누르면 실제 사이트로 갈 수 있어요!" },
        { keywords: ["코딩", "개발", "HTML", "CSS", "React", "GitHub", "기술", "스킬", "skill", "잘하", "자신"], answer: "네, HTML·CSS 기반으로 화면 만들고 React랑 Vite로 프로젝트도 여러 개 진행했어요. Git·GitHub로 협업하고 Vercel로 배포까지 직접 해봤고, 인터랙션이 많이 필요한 프로젝트에선 GSAP·ScrollTrigger·Three.js도 써봤어요. TypeScript·Tailwind도 쓰고, 3D는 Blender로 만들어요." },
        { keywords: ["디자인 도구", "디자인툴", "Figma", "피그마", "프로토타입", "컴포넌트"], answer: "주로 Figma로 와이어프레임, UI, 컴포넌트, 프로토타입까지 다 만들어요. 필요한 이미지나 시각 자산도 다듬고, 인터랙티브 웹으로 옮길 땐 구조를 개발 환경에 맞게 정리해서 써요." },
        { keywords: ["앞으로", "커리어 목표", "미래", "프로덕트 디자이너", "되고 싶", "되고싶"], answer: "사용자 행동이랑 감정을 세밀하게 이해하면서도, 아이디어를 실제 제품·서비스로 구현할 수 있는 디자이너가 되고 싶어요. 디자인이랑 개발 사이의 언어를 같이 이해하면서 팀이랑 잘 협업하고, 사용자가 직접 만지고 반응할 수 있는 경험을 만드는 게 목표예요." },
        { keywords: ["어떤 디자이너", "디자인 철학", "정체성", "지향점", "한 문장"], answer: "저는 사용자를 감각으로 읽고, 그 감각을 논리로 구현하는 디자이너를 지향해요. 보기 좋은 화면 만드는 데서 끝내지 않고, 사용자가 뭘 이해하고 어떤 행동을 하게 될지까지 설계한 다음 인터랙션이랑 코드로 연결하려고 해요." },
        { keywords: ["자기소개", "소개", "지원자", "본인", "누구", "해수", "최해수"], answer: "저는 사용자의 감각이랑 행동을 관찰해서 문제를 찾고, 그걸 논리적인 화면 구조랑 실제 작동하는 인터랙션으로 만드는 디자이너예요. Figma로 기획하고 시각화하는 것부터 HTML·CSS·React로 직접 구현하는 것까지 다 해요." },
        { keywords: ["강점", "장점", "차별점", "실행력"], answer: "제 강점은 아이디어를 제안하는 데서 멈추지 않고, 사용자 흐름이랑 인터랙션을 구체화해서 실제 화면으로 구현하는 실행력이에요. 디자인 의도를 코드랑 직접 연결해볼 수 있어서, 구현하다 생기는 제약도 이해하고 더 현실적인 방법을 찾을 수 있어요." },
        { keywords: ["성격", "성향", "꾸준함", "끈기"], answer: "목표를 정하면 쉽게 안 놓고 될 때까지 방법을 찾는 편이에요. 미대 입시 준비하면서 학업이랑 알바를 같이 했던 경험 덕분에, 시간이 빠듯해도 계획을 조정해가면서 끝까지 해내는 습관이 생겼어요." },
        { keywords: ["디자인 기준", "좋은 디자인", "정보 구조", "인터랙션 목적"], answer: "화면을 보면서 사용자가 뭘 이해하고 다음에 뭘 해야 할지 자연스럽게 드러나는지를 제일 중요하게 봐요. 비주얼이나 인터랙션도 그냥 예뻐 보이려고 넣기보다, 문제랑 브랜드 경험을 더 명확하게 전달하는 방향으로 쓰려고 해요." },
        { keywords: ["프로세스", "작업 과정", "문제 해결", "사용자 흐름"], answer: "먼저 사용자가 겪는 문제랑 목표를 정리하고, 핵심 흐름이랑 정보 구조를 설계해요. 그다음 와이어프레임이랑 비주얼 콘셉트를 구체화해서 실제 화면으로 만들어보고, 테스트나 피드백에서 나온 문제는 우선순위 정해서 다시 고쳐요." },
        { keywords: ["디자인과 개발", "현실성"], answer: "인터랙션이 중요한 프로젝트는 디자인 파일만으로는 경험을 다 설명하기 어렵더라고요. 직접 구현해보면 속도나 반응, 전환 같은 걸 더 구체적으로 볼 수 있고, 개발 제약을 알고 나서 더 현실적인 디자인 결정을 내릴 수 있어요." },
        { keywords: ["인터랙션", "모션", "애니메이션", "스크롤", "스토리텔링"], answer: "인터랙션을 그냥 장식으로 먼저 정하기보다, 콘텐츠 흐름이랑 사용자 시선을 어떻게 연결할지부터 생각해요. 아쿠아플라넷에서는 바다 속으로 들어가는 느낌을 롱스크롤이랑 영상·3D로 표현했고, 이 포트폴리오에서는 달 위를 걷는 저(해수봇)를 방향키로 직접 움직여볼 수 있게 했어요. 위 방향키를 길게 누르면 날 수도 있어요!" },
        { keywords: ["사용자테스트", "사용자 테스트", "피드백", "검증"], answer: "MOA 프로젝트에서 사용자 평가를 해봤는데, 클릭 가능한 요소가 잘 안 보이는 문제, 질문이 반복되는 문제, 홈 화면 정보 우선순위 문제가 나왔어요. 그래서 클릭 가능성을 더 뚜렷하게 표현하고, 질문 흐름이랑 히어로 영역 정리하고, 튜토리얼도 보완했어요." },
        { keywords: ["팀 프로젝트", "Git", "브랜치", "커뮤니케이션"], answer: "팀 프로젝트에서 역할 나누고 Git·GitHub로 브랜치 관리하면서 작업했어요. 아쿠아플라넷 할 때는 페이지랑 자산을 브랜치로 나눠서 작업했고, 충돌이나 배포 문제 생기면 원인 찾아서 정리하면서 해결했어요." },
        { keywords: ["생성형", "AI 활용", "업무활용", "AI"], answer: "AI로 결과물을 대신 결정하게 하기보다, 아이디어 탐색하고 이미지 시안 만들고 문구 정리하는 걸 빠르게 반복하는 용도로 써요. GPT·Codex, Gemini, Claude, Meshy AI 같은 도구를 작업에 맞게 골라 쓰고 있어요." },
        { keywords: ["디자인 계기", "산업디자인", "미대입시", "미대 입시", "진로"], answer: "원래 그림 그리는 걸 좋아했고, 아이디어를 실제 형태로 만들 수 있다는 점에 끌려서 산업디자인 진학을 준비했어요. 그러다 화면 안에서 사용자 경험이랑 인터랙션을 설계하고 실제로 작동하게 만들 수 있는 UX/UI, 웹 디자인으로 관심이 넓어졌어요." },
        { keywords: ["재수", "삼수", "힘들었던", "극복"], answer: "원하는 대학에 못 붙어서 재수, 삼수하면서 공부랑 알바를 같이 했던 시기가 제일 힘들었어요. 입시 비용이랑 생활비를 직접 마련해야 해서 시간도 돈도 빠듯했는데, 상황에 맞춰서 일이랑 공부 시간을 계속 조정하면서 준비했어요." },
        { keywords: ["텍사스로드하우스", "오술차", "알바", "아르바이트", "시간관리", "시간 관리"], answer: "텍사스로드하우스에서 일할 땐 오전 10시부터 오후 4시까지 일하고 나서 공부하고, 주말엔 그림 수업도 들었어요. 오술차에서 일할 땐 낮에 공부하고 저녁부터 새벽까지 일했고요. 환경 탓하기보다 쓸 수 있는 시간을 나누고 우선순위 조정하면서 목표를 계속 이어갔어요." },
        { keywords: ["배운 점", "배운점", "그 경험", "영향을"], answer: "처음 세운 방법이 안 통할 때 목표 자체를 포기하기보다, 원인을 찾고 계획을 다시 조정하는 습관이 생겼어요. 디자인할 때도 처음 만든 시안을 정답으로 안 두고, 사용자 피드백이나 구현 제약, 팀 의견 확인하면서 더 나은 방향으로 계속 고쳐요." },
        { keywords: ["UX/UI 공부", "교육", "UX/UI 과정", "학습"], answer: "UX/UI 웹디자인 과정에서 Figma로 화면 설계하고 HTML·CSS로 웹 구현하는 걸 배웠고, 그다음 React로 확장했어요. 팀 프로젝트랑 개인 프로젝트 하면서 기획부터 UI 디자인, 프로토타이핑, 구현, 배포까지 한 흐름으로 경험해봤어요." },
        { keywords: ["히스토리", "타임라인", "여정", "살아왔", "background", "어떻게 시작", "커리어"], answer: "캐나다에서 어릴 때를 보내서 그런지 그때 감각이 아직도 남아있어요. 미대 입시하면서 관찰하고 그리는 법을 배웠고, 카페에서 라떼아트도 하면서 사람 기쁘게 하는 걸 좋아하게 됐어요. 그러다 보니 자연스럽게 UX/UI로 왔네요." },
        { keywords: ["어디 살", "사는 곳", "거주", "지역", "location"], answer: "용인 살아요!" },
        { keywords: ["취미", "여가", "hobby", "쉴 때", "관심사", "그림", "드로잉"], answer: "그림 그리는 걸 제일 좋아해요. 라떼아트로 커피 위에 그리기도 하고, 시간 날 때 전시 보러 다니거나 여행 다니는 것도 즐겨요." },
        { keywords: ["그림과 디자인", "시각화"], answer: "그림 그리면서 머릿속 아이디어를 눈에 보이는 형태로 옮기는 게 익숙해졌어요. 지금은 그 경험을 가만히 있는 이미지에만 안 쓰고, 사용자가 움직이고 선택하고 반응할 수 있는 화면이랑 인터랙션으로 넓혀서 쓰고 있어요." },
        { keywords: ["함께", "협업", "연락", "컨택", "채용", "일하", "인터뷰", "이메일", "전화"], answer: "010-4212-4970 또는 chs041015@gmail.com으로 편하게 연락 주세요. 프로젝트별 자세한 내용은 MY WORKS 섹션에서 더 볼 수 있어요!" },
      ],
      fallback: "그건 제가 아직 답을 못 드리는 질문이에요. 프로젝트나 기술, 제 얘기, 협업 방법 같은 거 물어봐 주세요!",
    };
    const getAnswer = (message) => {
      const m = message.toLowerCase();
      const hit = config.qna.find(({ keywords }) => keywords.some((w) => m.includes(w.toLowerCase())));
      return hit?.answer ?? config.fallback;
    };

    let isOpen = false, isResponding = false, suggestionsEl = null, lastFocused = null, closeTimer = 0;
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const scrollToBottom = () => { conversation.scrollTop = conversation.scrollHeight; };
    const appendBubble = (sender, message) => {
      const b = document.createElement("div");
      b.className = `chat-bubble is-${sender}`;
      b.textContent = message;
      conversation.append(b);
      scrollToBottom();
      return b;
    };
    const appendLoading = () => {
      const b = document.createElement("div");
      const dots = document.createElement("span");
      b.className = "chat-bubble is-bot is-loading";
      dots.className = "chat-loading-dots";
      dots.setAttribute("aria-label", "입력 중");
      for (let i = 0; i < 3; i++) dots.append(document.createElement("i"));
      b.append(dots);
      conversation.append(b);
      scrollToBottom();
      return b;
    };
    const removeSuggestions = () => {
      suggestionsEl?.remove();
      suggestionsEl = null;
      topicsWrapper?.classList.add("is-visible");
    };
    const setDisabled = (v) => {
      input.disabled = v;
      sendButton.disabled = v;
      conversation.setAttribute("aria-busy", String(v));
      suggestionsEl?.querySelectorAll("button").forEach((b) => { b.disabled = v; });
      topicButtons.forEach((b) => { b.disabled = v; });
    };
    const appendSuggestions = () => {
      suggestionsEl = document.createElement("div");
      suggestionsEl.className = "chat-suggestions";
      suggestionsEl.setAttribute("aria-label", "추천 질문");
      config.suggestions.forEach((label) => {
        const b = document.createElement("button");
        b.className = "chat-suggestion";
        b.type = "button";
        b.textContent = label;
        b.addEventListener("click", () => void sendMessage(label));
        suggestionsEl.append(b);
      });
      conversation.append(suggestionsEl);
      scrollToBottom();
    };
    const typeText = (bubble, text) => new Promise((resolve) => {
      if (reduced) { bubble.textContent = text; scrollToBottom(); resolve(); return; }
      let i = 0;
      const step = () => {
        i += 1;
        bubble.textContent = text.slice(0, i);
        scrollToBottom();
        i < text.length ? setTimeout(step, 20) : resolve();
      };
      step();
    });
    async function sendMessage(raw) {
      const message = raw.trim();
      if (!message || isResponding) return;
      isResponding = true;
      setDisabled(true);
      removeSuggestions();
      appendBubble("user", message);
      input.value = "";
      const loading = appendLoading();
      await wait(700);
      loading.remove();
      await typeText(appendBubble("bot", ""), getAnswer(message));
      isResponding = false;
      setDisabled(false);
      if (isOpen) input.focus({ preventScroll: true });
    }
    const resetConversation = () => {
      conversation.replaceChildren();
      suggestionsEl = null;
      topicsWrapper?.classList.remove("is-visible");
      appendBubble("bot", config.greeting);
      appendSuggestions();
    };
    const open = () => {
      if (isOpen) return;
      clearTimeout(closeTimer);
      isOpen = true;
      lastFocused = document.activeElement;
      if (!conversation.children.length) resetConversation();
      modal.hidden = false;
      modal.setAttribute("aria-hidden", "false");
      bot.classList.add("is-chat-open");
      bot.setAttribute("aria-expanded", "true");
      requestAnimationFrame(() => modal.classList.add("is-open"));
    };
    const close = () => {
      if (!isOpen) return;
      isOpen = false;
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      bot.classList.remove("is-chat-open");
      bot.setAttribute("aria-expanded", "false");
      closeTimer = setTimeout(() => { if (!isOpen) modal.hidden = true; }, 260);
      if (lastFocused instanceof HTMLElement) lastFocused.focus({ preventScroll: true });
    };
    closeButton.addEventListener("click", close);
    document.addEventListener("keydown", (e) => { if (isOpen && e.key === "Escape") close(); });
    document.addEventListener("pointerdown", (e) => {
      if (!isOpen || modal.contains(e.target) || bot.contains(e.target)) return;
      close();
    });
    form.addEventListener("submit", (e) => { e.preventDefault(); void sendMessage(input.value); });
    topicButtons.forEach((b) => b.addEventListener("click", () => void sendMessage(b.dataset.topic)));
    // 대화창 안에서 휠을 굴리면 페이지(Lenis)가 아니라 대화만 스크롤
    conversation.setAttribute("data-lenis-prevent", "");
    return { open, close, toggle: () => (isOpen ? close() : open()), isOpen: () => isOpen };
  })();
  bot.setAttribute("aria-expanded", "false");
  bot.addEventListener("click", () => (chat ? chat.toggle() : botSay("챗봇을 불러오지 못했어요")));

  /* ---------- 10-2. 우주인 해수봇 : Hero·Footer에서 달 위를 걷기 ----------
     - Hero(첫 화면)·Footer(Let's talk 이후)에 들어오면 정박 자리에서 폴짝 뛰어나와 바닥에 내려섬, 벗어나면 정박 자리로 복귀
     - ← → : 걷기 (v1 걷기 그대로 + 달 중력) → 걸음마다 낮게 통통 뜨고, 천천히 출발·미끄러지듯 멈춤
     - ↑ : 짧게 = 둥실 점프 / 길게 누르면 그동안 제트팩 분사(민트 입자)로 계속 떠오름 → 떼면 천천히 내려옴
     - ↓ : 공중에선 빨리 내려오기, 바닥에선 웅크리기 (v1)
     - 착지하면 몸이 찌그러지고(v1 landingImpact) 발밑에서 먼지가 튐
     - 모바일·태블릿: 터치한 곳으로 걸어가고, 위쪽을 터치하면 그 높이까지 날아감
     - Footer: 바닥 = 구분선 위 (v1과 같음), "It's Haesoo ." 근처를 지나가면 글자가 밀려났다 돌아옴
     - 챗봇이 열려 있거나 동작 줄이기 설정이면 정박 */
  (function initSpaceBot() {
    const trail = $(".bot-trail");
    const heroZone = $(".top");
    const footZone = $(".contact");
    const footDivider = $(".contact-divider");
    const BW = 66, BH = 88;
    const FOOT = 228 / 256;                 // SVG에서 발바닥 위치 (v1 footY)
    const G = 900;                          // 달 중력 (v1 지구 중력 3000)
    const WALK = 230, HOP = 210, JUMP = 430, JET = 1500, JET_MAX_UP = 360, FALL_MAX = 620;
    const ARROWS = new Set(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]);
    const touchQuery = matchMedia("(hover: none), (pointer: coarse)");
    const legL = $(".bot-leg-g.is-left", bot), legR = $(".bot-leg-g.is-right", bot);
    const st = {
      x: 0, y: 0, vx: 0, vy: 0, mode: "dock", zone: null, onGround: false, t: 0,
      walkPhase: 0, lean: 0, wob: 0, land: 0, crouch: 0, jetting: false, lastPuff: 0, target: null, big: 0,
      facing: 1, face: 1, entering: false, // facing: 보는 방향(±1) / face: 뒤집히는 중간값 (v1 facingScale) / entering: 첫 등장 낙하 중
    };

    // 눈 깜빡임 (v1 scheduleBlink: 2.4~5초마다 0.14초)
    (function blink() {
      setTimeout(() => {
        bot.classList.add("is-blinking");
        setTimeout(() => bot.classList.remove("is-blinking"), 140);
        blink();
      }, 2400 + Math.random() * 2600);
    })();
    const keys = new Set();
    const hinted = { hero: false, foot: false };

    // 글자 하나를 탄성 있게 밀어내는 핸들 (x·y·회전)
    const pusher = (el) => {
      const q = (prop) => gsap.quickTo(el, prop, { duration: 0.9, ease: "elastic.out(1, 0.4)" });
      return { el, x: q("x"), y: q("y"), r: q("rotation"), pushed: false };
    };
    // 서명 글자 쪼개기 (글자마다 탄성 있게 밀려남)
    const sigLetters = $$(".contact-signature p").flatMap((line) => {
      const text = line.textContent;
      line.textContent = "";
      return [...text].map((ch) => {
        const el = document.createElement("span");
        el.className = "contact-signature-letter";
        el.textContent = ch === " " ? " " : ch;
        line.append(el);
        return pusher(el);
      });
    });
    // Hero 제목(DESIGNER / WHO CODES)도 같은 자기장 효과. 글자(.ch)는 등장 모션용 마스크 안에서 잘리니까 마스크째 밀어냄
    const heroLetters = $$(".top-logo .top-logo-mask").map(pusher);

    const scaleNow = () => (innerWidth < 1024 ? 0.8 : 1);
    // Hero·Footer에선 v1처럼 크게 (v1: 정박 66×88 → 돌아다닐 때 88×120 = 4/3배). st.big 0→1로 부드럽게 커지고 작아짐
    const sizeNow = () => scaleNow() * (1 + st.big / 3);
    const dockPos = () => {
      const s = scaleNow(), mobile = innerWidth < 1024;
      return { x: innerWidth - (mobile ? 30 : 56) - (BW * s) / 2, y: innerHeight - (mobile ? 18 : 22) - (BH * s) / 2 };
    };
    const zoneNow = () => {
      if (reduced || chat?.isOpen()) return null;
      if ((introDone || st.entering) && scrollY < innerHeight * 0.35) return "hero";
      if (footZone && footZone.getBoundingClientRect().top < innerHeight * 0.3) return "foot";
      return null;
    };
    // 바닥·천장·좌우 벽 (y는 몸 중심 기준)
    const bounds = () => {
      const s = sizeNow(), hw = (BW * s) / 2, hh = (BH * s) / 2, m = 16;
      let ground = innerHeight - 24; // Hero: 화면 아래
      let ceil = 84;                 // 메뉴 아래
      if (st.zone === "foot" && footZone) {
        const r = footZone.getBoundingClientRect();
        const line = footDivider ? footDivider.getBoundingClientRect().top : r.bottom;
        ground = Math.min(line, innerHeight - m);
        ceil = Math.max(ceil, r.top + m);
      }
      const footOff = (FOOT - 0.5) * BH * s; // 몸 중심 → 발바닥
      return { minX: m + hw, maxX: innerWidth - m - hw, floor: ground - footOff, top: Math.min(ceil + hh, ground - footOff) };
    };

    // 입자: 제트팩 분사(아래로, 민트) / 착지 먼지(옆으로, 미색)
    const particle = (x, y, vx, vy, star, life = 0.6) => {
      if (!trail) return;
      const dot = document.createElement("i");
      if (star) dot.className = "is-star";
      trail.append(dot);
      gsap.fromTo(dot, { x, y, scale: 1, opacity: 0.95 }, {
        x: x + vx, y: y + vy, scale: 0, opacity: 0, duration: life + Math.random() * 0.3, ease: "power2.out", onComplete: () => dot.remove(),
      });
    };
    const jetPuff = () => {
      const s = sizeNow();
      particle(st.x + (Math.random() - 0.5) * 22 * s, st.y + BH * s * 0.36, (Math.random() - 0.5) * 30, 50 + Math.random() * 45, Math.random() < 0.3);
    };
    const dust = (power) => {
      const s = sizeNow(), fy = st.y + (FOOT - 0.5) * BH * s;
      const n = Math.round(4 + power * 6);
      for (let i = 0; i < n; i++) {
        const dir = i % 2 ? 1 : -1;
        particle(st.x + dir * 14 * s, fy - 2, dir * (30 + Math.random() * 50 * (0.5 + power)), -(6 + Math.random() * 22), true, 0.5);
      }
    };

    // 방향키 생각풍선 (v1 dpad 힌트): 구역에 처음 들어올 때 잠깐 + 마우스를 올릴 때 (v1처럼 방향키 ↔ 챗봇 말풍선 번갈아)
    let keysTimer = 0, nextHover = "keys";
    const showKeys = (ms) => {
      clearTimeout(keysTimer);
      bot.classList.add("is-keys");
      if (ms) keysTimer = setTimeout(() => bot.classList.remove("is-keys"), ms);
    };
    const hideKeys = () => { clearTimeout(keysTimer); bot.classList.remove("is-keys"); };
    bot.addEventListener("pointerenter", (e) => {
      if (e.pointerType !== "mouse" || st.mode !== "walk") return;
      if (nextHover === "keys") showKeys(0);
      nextHover = nextHover === "keys" ? "chat" : "keys";
    });
    bot.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") hideKeys(); });

    // 돌아다닐 땐 말풍선을 띄우지 않음 → 방향키 풍선만 (터치 화면은 방향키가 없어 생략)
    const hint = (zone) => {
      if (hinted[zone]) return;
      hinted[zone] = true;
      if (!touchQuery.matches) showKeys(3600);
    };

    addEventListener("keydown", (e) => {
      if (!ARROWS.has(e.key) || st.mode !== "walk" || e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.target instanceof Element && e.target.closest("input, textarea, select, [contenteditable]")) return;
      e.preventDefault(); // 걷는 동안엔 방향키로 페이지가 스크롤되지 않게
      hideKeys(); // 눌러봤으니 풍선은 닫음
      if (e.key === "ArrowUp" && !e.repeat && st.onGround) { st.vy = -JUMP; st.onGround = false; } // 둥실 점프
      keys.add(e.key);
      st.target = null;
    });
    addEventListener("keyup", (e) => keys.delete(e.key));
    addEventListener("blur", () => keys.clear());
    document.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "mouse" || st.mode !== "walk") return;
      if (e.target instanceof Element && e.target.closest("a, button, input, .chatbot-modal")) return;
      st.target = { x: e.clientX, y: e.clientY };
    });

    const d0 = dockPos();
    st.x = d0.x; st.y = d0.y;
    // 첫 등장 (v1 그대로): Hero에서 시작하면 가운데 스크롤 빛 선(.scroll-cue) 바로 왼쪽, 바닥 110px 위에서 떨어져 착지
    // → 착지하면 방향키 풍선 → 그다음 제목 글자가 올라옴 (제목은 botIntro를 기다림)
    let shutUntil = 0;
    if (!reduced && scrollY < innerHeight * 0.35) {
      st.mode = "walk"; st.zone = "hero"; hinted.hero = true; st.entering = true; st.big = 1;
      st.x = innerWidth / 2 - 120 * scaleNow(); st.y = bounds().floor - 110; st.vx = 0; st.vy = 0; st.onGround = false;
    } else botIntroDone();

    gsap.ticker.add((time, deltaMs) => {
      const dt = Math.min(deltaMs / 1000, 0.05);
      st.t += dt;
      const s = sizeNow();

      // 구역 판정 → 걷기 / 복귀 / 정박
      const z = zoneNow();
      if (z) {
        if (st.mode !== "walk") { st.mode = "walk"; st.onGround = false; st.vx = -140; st.vy = -380; } // 정박 자리에서 폴짝
        if (st.zone !== z) { st.zone = z; st.onGround = false; hint(z); }
      } else if (st.mode === "walk") {
        st.mode = "return"; st.zone = null; st.target = null; keys.clear(); hideKeys();
      }
      bot.classList.toggle("is-floating", st.mode === "walk");
      bot.classList.toggle("is-docked", st.mode === "dock");
      st.big +=((st.mode === "walk" ? 1 : 0) - st.big) * Math.min(1, dt * 6);

      let dir = 0, jet = false;
      if (st.mode === "walk") {
        const b = bounds();
        dir = (keys.has("ArrowRight") ? 1 : 0) - (keys.has("ArrowLeft") ? 1 : 0);
        jet = keys.has("ArrowUp");
        if (st.target) { // 터치: 그 x로 걸어가고, 충분히 위쪽이면 그 높이까지 제트팩
          const tx = st.target.x - st.x;
          dir = Math.abs(tx) > 10 ? Math.sign(tx) : 0;
          jet = st.target.y < st.y - 50;
          if (!dir && !jet) st.target = null;
        }

        // 좌우: 달이라 천천히 붙고 미끄러지듯 멈춤 (공중에선 조금만 조종)
        st.vx += (dir * WALK - st.vx) * Math.min(1, dt * (st.onGround ? 4.5 : 1.6));

        // 위아래: 달 중력 + 제트팩
        if (jet) {
          if (st.onGround) { st.onGround = false; st.vy = Math.min(st.vy, -JUMP * 0.6); }
          st.vy += (G - JET) * dt;
          st.vy = Math.max(st.vy, -JET_MAX_UP);
          if (time - st.lastPuff > 0.03) { st.lastPuff = time; jetPuff(); }
        } else if (!st.onGround) {
          st.vy += (G + (keys.has("ArrowDown") ? G * 2.2 : 0)) * dt;
        }
        st.vy = Math.min(st.vy, FALL_MAX);
        st.jetting = jet;

        // 바닥에서 걸을 땐 걸음마다 낮게 통통 (달 걸음)
        if (st.onGround && dir && Math.abs(st.vx) > 60) { st.vy = -HOP; st.onGround = false; }

        st.x += st.vx * dt;
        st.y += st.vy * dt;

        if (st.x < b.minX) { st.x = b.minX; st.vx = Math.abs(st.vx) * 0.3; }
        if (st.x > b.maxX) { st.x = b.maxX; st.vx = -Math.abs(st.vx) * 0.3; }
        if (st.y < b.top) { st.y = b.top; st.vy = Math.max(st.vy, 0); }
        if (st.y >= b.floor) {
          if (!st.onGround) {
            const impact = clamp(st.vy / FALL_MAX);
            if (st.vy > HOP * 1.3) { st.land = Math.min(1, impact * 1.2); dust(impact); shutUntil = time + 0.28; } // 점프·비행 후 착지: 크게 찌그러지고 먼지, 눈 질끈 (v1 reaction "down")
            else if (st.vy > 60) { st.land = 0.18; if (Math.random() < 0.5) dust(0); }  // 걸음 착지: 살짝 + 가끔 먼지
            if (st.entering) { // 첫 등장 착지 → 방향키 풍선 → 풍선이 다 뜬 뒤(v1 460ms) 제목 시작
              st.entering = false;
              if (!touchQuery.matches) showKeys(3600);
              setTimeout(botIntroDone, 460);
            }
          }
          st.y = b.floor; st.vy = 0; st.onGround = true;
        }
      } else {
        // 정박 자리로 스프링 복귀 (임계 감쇠)
        const d = dockPos();
        if (st.mode === "return") {
          const k = 38, c = 2 * Math.sqrt(k);
          st.vx += ((d.x - st.x) * k - st.vx * c) * dt;
          st.vy += ((d.y - st.y) * k - st.vy * c) * dt;
          st.x += st.vx * dt;
          st.y += st.vy * dt;
          if (Math.hypot(d.x - st.x, d.y - st.y) < 0.6 && Math.hypot(st.vx, st.vy) < 8) st.mode = "dock";
        }
        if (st.mode === "dock") { st.x = d.x; st.y = d.y; st.vx = 0; st.vy = 0; }
      }

      // 자세: 진행 방향으로 기울기(v1 lean 6° → 공중에선 조금 더), 공중에서 살짝 흔들, 착지·웅크리기 찌그러짐(v1)
      const walking = st.mode === "walk";
      const leanTarget = walking ? clamp(st.vx / WALK, -1, 1) * (st.onGround ? 6 : 10) : 0;
      st.lean += (leanTarget - st.lean) * Math.min(1, dt * 8);
      st.wob += ((walking && !st.onGround ? 1 : 0) - st.wob) * Math.min(1, dt * 4);
      const wobble = Math.sin(st.t * 3.1) * 3 * st.wob;
      st.crouch += ((walking && st.onGround && keys.has("ArrowDown") ? 1 : 0) - st.crouch) * Math.min(1, dt * 14);
      st.land += (0 - st.land) * Math.min(1, dt * 7);
      const sx = 1 + st.crouch * 0.12 + st.land * 0.16;
      const sy = 1 - st.crouch * 0.18 - st.land * 0.22;
      // 찌그러질 때 발바닥이 바닥에 붙어 있도록 아래로 보정
      const squashDrop = (1 - sy) * BH * s * (FOOT - 0.5);
      // 보는 방향: 가는 쪽으로 몸 전체가 좌우로 뒤집힘 (v1 facingScale: 1 ↔ -1 사이를 빠르게 지나며 휙 돌아섬). 정박하면 오른쪽
      if (walking) { if (dir) st.facing = dir; else if (Math.abs(st.vx) > 40) st.facing = Math.sign(st.vx); }
      else st.facing = 1;
      st.face += (st.facing - st.face) * Math.min(1, dt * 9);
      const mirror = st.face < 0 ? -1 : 1; // 뒤집힌 상태에선 회전 방향도 반대로 줘야 화면에서 같은 쪽으로 기울어짐
      bot.dataset.facing = mirror < 0 ? "left" : "right";
      bot.classList.toggle("is-eyes-shut", (walking && st.crouch > 0.08) || time < shutUntil);
      bot.style.transform = `translate3d(${(st.x - BW / 2).toFixed(2)}px,${(st.y - BH / 2 + squashDrop).toFixed(2)}px,0) scaleX(${st.face.toFixed(3)}) rotate(${((st.lean + wobble) * mirror).toFixed(2)}deg) scale(${(s * sx).toFixed(3)},${(s * sy).toFixed(3)})`;

      // 다리: 바닥에선 v1 걷기 흔들기(달이라 느리게), 공중에선 벌린 채 둥둥, 제트팩 땐 모음
      if (walking && st.onGround === false && Math.abs(st.vx) > 30) st.walkPhase += Math.abs(st.vx) * dt * 0.03;
      else if (walking && st.onGround && Math.abs(st.vx) > 20) st.walkPhase += Math.abs(st.vx) * dt * 0.045;
      let swing;
      if (!walking) swing = 0;
      else if (st.jetting) swing = 8 + Math.sin(st.t * 14) * 3;
      else if (!st.onGround) swing = Math.abs(st.vx) > 30 ? Math.sin(st.walkPhase) * 24 : 14 + Math.sin(st.t * 2.4) * 6;
      else if (st.crouch > 0.05) swing = 42 * st.crouch;
      else swing = Math.abs(st.vx) > 20 ? Math.sin(st.walkPhase) * 20 : 0;
      if (legL) legL.style.transform = `rotate(${swing.toFixed(2)}deg)`;
      if (legR) legR.style.transform = `rotate(${(-swing).toFixed(2)}deg)`;

      // 눈: 움직일 땐 가는 방향, 아니면 마우스
      const speed = Math.hypot(st.vx, st.vy);
      const gaze = walking && speed > 70 ? Math.atan2(st.vy * 0.6, st.vx) : Math.atan2(mouseY - (st.y - BH * s * 0.08), mouseX - st.x);
      setGaze(mirror < 0 ? Math.PI - gaze : gaze); // 뒤집혀 있으면 눈동자 좌우도 거울로

      // 글자 밀어내기 (자기장): Footer "It's Haesoo ." + Hero "DESIGNER WHO CODES". 봇이 가까이 오면 반대쪽으로 밀려났다 탄성 있게 돌아옴
      const pushAway = (letters, active, R, amt) => letters.forEach((L) => {
        if (!active) { if (L.pushed) { L.pushed = false; L.x(0); L.y(0); L.r(0); } return; }
        const r = L.el.getBoundingClientRect();
        const cx = r.left + r.width / 2 - (gsap.getProperty(L.el, "x") || 0);
        const cy = r.top + r.height / 2 - (gsap.getProperty(L.el, "y") || 0);
        const ddx = cx - st.x, ddy = cy - st.y, dist = Math.max(Math.hypot(ddx, ddy), 0.001);
        const k = Math.pow(Math.max(0, 1 - dist / R), 1.5);
        if (k > 0) {
          L.pushed = true;
          L.x((ddx / dist) * k * amt);
          L.y((ddy / dist) * k * amt - k * 10);
          L.r((ddx / R) * k * 24);
        } else if (L.pushed) { L.pushed = false; L.x(0); L.y(0); L.r(0); }
      });
      pushAway(sigLetters, walking && st.zone === "foot", 170, 46);
      pushAway(heroLetters, walking && st.zone === "hero" && !st.entering, 210, 56); // Hero 글자가 커서 반경·밀리는 거리를 조금 크게
    });
  })();

  /* ---------- frame loop + refresh ---------- */
  function onRefresh() {
    aboutTopY = top($(".about"));
    topWrapBottom = top($(".top-wrap")) + $(".top-wrap").offsetHeight;
    fitLogo();
    measureAbout();
    computeBgKeys();
    computeGroups();
    frame();
  }
  function frame() {
    const s = scrollY;
    updateBg(s);
    updateSky(s);
    updateNav(s);
    updateTop(s);
    updateAbout(s);
    updateWorks();
  }
  ScrollTrigger.addEventListener("refresh", onRefresh);
  gsap.ticker.add(() => {
    frame();
  });
  addEventListener("load", () => ScrollTrigger.refresh());
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  onRefresh();
})();
