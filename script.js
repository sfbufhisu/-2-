const heroCanvas = document.querySelector("#heroBg");
const heroCtx = heroCanvas ? heroCanvas.getContext("2d") : null;
const heroState = {
  x: 0,
  y: 0,
  targetX: 0,
  targetY: 0,
  width: 0,
  height: 0,
  dpr: 1
};

function resizeHeroCanvas() {
  if (!heroCanvas || !heroCtx) return;
  const rect = heroCanvas.getBoundingClientRect();
  heroState.dpr = Math.min(window.devicePixelRatio || 1, 2);
  heroState.width = rect.width;
  heroState.height = rect.height;
  heroCanvas.width = Math.max(1, Math.floor(rect.width * heroState.dpr));
  heroCanvas.height = Math.max(1, Math.floor(rect.height * heroState.dpr));
  heroCtx.setTransform(heroState.dpr, 0, 0, heroState.dpr, 0, 0);
}

function drawHeroBackground(now) {
  if (!heroCtx || !heroCanvas) return;

  heroState.x += (heroState.targetX - heroState.x) * 0.06;
  heroState.y += (heroState.targetY - heroState.y) * 0.06;

  const w = heroState.width;
  const h = heroState.height;
  const t = now * 0.00018;
  const mx = w * 0.5 + heroState.x * 42;
  const my = h * 0.38 + heroState.y * 28;

  heroCtx.clearRect(0, 0, w, h);
  heroCtx.fillStyle = "#040507";
  heroCtx.fillRect(0, 0, w, h);

  const base = heroCtx.createRadialGradient(mx, my, 0, mx, my, Math.max(w, h) * 0.85);
  base.addColorStop(0, "rgba(10, 31, 36, 0.95)");
  base.addColorStop(0.35, "rgba(7, 12, 18, 0.72)");
  base.addColorStop(1, "rgba(3, 4, 6, 1)");
  heroCtx.fillStyle = base;
  heroCtx.fillRect(0, 0, w, h);

  heroCtx.save();
  heroCtx.globalCompositeOperation = "lighter";

  const blobs = [
    { x: 0.2, y: 0.28, r: 0.22, c: ["rgba(56,245,255,0.46)", "rgba(56,245,255,0)"] },
    { x: 0.78, y: 0.32, r: 0.18, c: ["rgba(255,107,87,0.28)", "rgba(255,107,87,0)"] },
    { x: 0.62, y: 0.72, r: 0.2, c: ["rgba(168,255,96,0.16)", "rgba(168,255,96,0)"] }
  ];

  blobs.forEach((blob, index) => {
    const driftX = Math.sin(t * (1.8 + index * 0.7) + index) * w * 0.04;
    const driftY = Math.cos(t * (1.4 + index * 0.5) + index * 1.7) * h * 0.03;
    const radius = Math.max(w, h) * blob.r;
    const gradient = heroCtx.createRadialGradient(
      w * blob.x + driftX + heroState.x * 12,
      h * blob.y + driftY + heroState.y * 10,
      radius * 0.04,
      w * blob.x + driftX + heroState.x * 12,
      h * blob.y + driftY + heroState.y * 10,
      radius
    );
    gradient.addColorStop(0, blob.c[0]);
    gradient.addColorStop(1, blob.c[1]);
    heroCtx.fillStyle = gradient;
    heroCtx.beginPath();
    heroCtx.arc(w * blob.x + driftX + heroState.x * 12, h * blob.y + driftY + heroState.y * 10, radius, 0, Math.PI * 2);
    heroCtx.fill();
  });

  heroCtx.globalCompositeOperation = "screen";
  for (let i = 0; i < 8; i += 1) {
    const y = (h / 8) * i + (Math.sin(t * 2 + i) * h * 0.015);
    const alpha = i % 2 === 0 ? 0.04 : 0.02;
    heroCtx.fillStyle = `rgba(255,255,255,${alpha})`;
    heroCtx.fillRect(0, y, w, 1);
  }

  heroCtx.globalAlpha = 0.12;
  heroCtx.strokeStyle = "rgba(120, 220, 255, 0.45)";
  heroCtx.lineWidth = 1;
  const step = 72;
  for (let x = 0; x < w; x += step) {
    heroCtx.beginPath();
    heroCtx.moveTo(x, 0);
    heroCtx.lineTo(x, h);
    heroCtx.stroke();
  }
  for (let y = 0; y < h; y += step) {
    heroCtx.beginPath();
    heroCtx.moveTo(0, y);
    heroCtx.lineTo(w, y);
    heroCtx.stroke();
  }

  heroCtx.globalAlpha = 0.85;
  const beamY = (Math.sin(t * 2.6) * 0.5 + 0.5) * h;
  const beam = heroCtx.createLinearGradient(0, beamY - 120, 0, beamY + 120);
  beam.addColorStop(0, "rgba(56,245,255,0)");
  beam.addColorStop(0.5, "rgba(56,245,255,0.11)");
  beam.addColorStop(1, "rgba(56,245,255,0)");
  heroCtx.fillStyle = beam;
  heroCtx.fillRect(0, beamY - 120, w, 240);

  heroCtx.restore();

  heroCtx.save();
  heroCtx.globalAlpha = 0.55;
  const vignette = heroCtx.createRadialGradient(w * 0.5, h * 0.45, Math.min(w, h) * 0.12, w * 0.5, h * 0.45, Math.max(w, h) * 0.88);
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.75)");
  heroCtx.fillStyle = vignette;
  heroCtx.fillRect(0, 0, w, h);
  heroCtx.restore();

  requestAnimationFrame(drawHeroBackground);
}

if (heroCanvas && heroCtx) {
  resizeHeroCanvas();
  window.addEventListener("resize", resizeHeroCanvas);
  requestAnimationFrame(drawHeroBackground);
}

function initGalaxy(canvas, options = {}) {
  const config = {
    focal: [0.5, 0.5],
    rotation: [1.0, 0.0],
    starSpeed: 0.5,
    density: 1,
    hueShift: 240,
    disableAnimation: false,
    speed: 1.0,
    mouseInteraction: true,
    glowIntensity: 0.45,
    saturation: 0.35,
    mouseRepulsion: true,
    repulsionStrength: 2,
    twinkleIntensity: 0.4,
    rotationSpeed: 0.08,
    autoCenterRepulsion: 0,
    transparent: true,
    ...options
  };

  const ctx = canvas.getContext("2d");
  const state = {
    width: 0,
    height: 0,
    dpr: 1,
    stars: [],
    mouse: { x: 0.5, y: 0.5, active: 0 },
    targetMouse: { x: 0.5, y: 0.5, active: 0 },
    autoRotate: 0
  };

  function createStars() {
    const count = Math.round(1600 * config.density);
    const stars = [];
    const maxRadius = Math.min(state.width, state.height) * 0.72;

    for (let i = 0; i < count; i += 1) {
      const arm = i % 5;
      const progress = Math.pow(Math.random(), 1.55);
      const radius = progress * maxRadius;
      const baseAngle = arm * (Math.PI * 2 / 5) + progress * 5.8;
      const seed = Math.random() * 1000;
      const size = 0.4 + Math.random() * 1.9;
      stars.push({
        arm,
        progress,
        radius,
        baseAngle,
        seed,
        size,
        hue: 190 + Math.random() * 130,
        alpha: 0.28 + Math.random() * 0.6,
        depth: Math.random(),
        speed: 0.45 + Math.random() * 0.9
      });
    }

    state.stars = stars;
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    state.dpr = Math.min(window.devicePixelRatio || 1, 2);
    state.width = rect.width;
    state.height = rect.height;
    canvas.width = Math.max(1, Math.floor(rect.width * state.dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * state.dpr));
    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    createStars();
  }

  function drawNebula(cx, cy, time) {
    const glowSets = [
      { x: cx * 0.78, y: cy * 0.38, r: 0.32, color: "rgba(74, 143, 255, 0.18)" },
      { x: cx * 1.02, y: cy * 0.62, r: 0.28, color: "rgba(255, 102, 153, 0.14)" },
      { x: cx * 0.44, y: cy * 0.28, r: 0.26, color: "rgba(56, 245, 255, 0.14)" }
    ];

    glowSets.forEach((glow, index) => {
      const driftX = Math.sin(time * 0.0002 + index) * state.width * 0.05;
      const driftY = Math.cos(time * 0.00016 + index * 1.7) * state.height * 0.03;
      const radius = Math.max(state.width, state.height) * glow.r;
      const gradient = ctx.createRadialGradient(
        glow.x + driftX,
        glow.y + driftY,
        radius * 0.08,
        glow.x + driftX,
        glow.y + driftY,
        radius
      );
      gradient.addColorStop(0, glow.color);
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(glow.x + driftX, glow.y + driftY, radius, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function render(time) {
    requestAnimationFrame(render);
    if (!config.disableAnimation) {
      state.autoRotate = time * 0.00005 * config.rotationSpeed;
    }

    state.mouse.x += (state.targetMouse.x - state.mouse.x) * 0.07;
    state.mouse.y += (state.targetMouse.y - state.mouse.y) * 0.07;
    state.mouse.active += (state.targetMouse.active - state.mouse.active) * 0.07;

    ctx.clearRect(0, 0, state.width, state.height);

    const centerX = state.width * config.focal[0];
    const centerY = state.height * config.focal[1];
    const mouseOffsetX = (state.mouse.x - 0.5) * state.width * 0.08 * state.mouse.active;
    const mouseOffsetY = (state.mouse.y - 0.5) * state.height * 0.08 * state.mouse.active;
    const mouseX = state.mouse.x * state.width;
    const mouseY = state.mouse.y * state.height;
    const spiralStrength = 5.8;

    drawNebula(centerX, centerY, time);

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const rotationMatrix = config.rotation;
    const rotAngle = state.autoRotate;
    const rotCos = Math.cos(rotAngle);
    const rotSin = Math.sin(rotAngle);

    for (const star of state.stars) {
      const depth = 0.35 + star.depth * 0.75;
      const scaledRadius = star.radius * depth;
      const armAngle = star.baseAngle + scaledRadius * 0.0012 * spiralStrength + rotAngle * 2.2;
      let x = centerX + Math.cos(armAngle) * scaledRadius * rotationMatrix[0];
      let y = centerY + Math.sin(armAngle) * scaledRadius * 0.72;

      const rotatedX = (x - centerX) * rotCos - (y - centerY) * rotSin + centerX;
      const rotatedY = (x - centerX) * rotSin + (y - centerY) * rotCos + centerY;
      x = rotatedX + mouseOffsetX;
      y = rotatedY + mouseOffsetY;

      const dx = x - mouseX;
      const dy = y - mouseY;
      const distance = Math.max(Math.hypot(dx, dy), 0.001);
      const influence = config.mouseRepulsion
        ? Math.max(0, 1 - distance / (Math.min(state.width, state.height) * 0.55))
        : 0;
      const repulse = config.mouseRepulsion ? config.repulsionStrength * influence * influence : 0;
      x += (dx / distance) * repulse * 26;
      y += (dy / distance) * repulse * 26;

      const twinkle = 1 + Math.sin(time * 0.0012 * config.speed * star.speed + star.seed) * config.twinkleIntensity;
      const alpha = Math.max(0.05, star.alpha * twinkle * (0.42 + depth * 0.58));
      const hue = (config.hueShift + star.hue + star.progress * 60) % 360;
      const lightness = 72 - star.depth * 14;
      const radius = star.size * (0.8 + depth * 1.4);
      ctx.shadowBlur = radius * 8 * config.glowIntensity;
      ctx.shadowColor = `hsla(${hue}, ${Math.round(config.saturation * 100)}%, ${lightness}%, ${alpha})`;
      ctx.fillStyle = `hsla(${hue}, ${Math.round(config.saturation * 100)}%, ${lightness}%, ${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    if (config.transparent === false) {
      ctx.save();
      ctx.globalCompositeOperation = "destination-over";
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, state.width, state.height);
      ctx.restore();
    }
  }

  function syncMouse(event) {
    const rect = canvas.getBoundingClientRect();
    state.targetMouse.x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    state.targetMouse.y = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
    state.targetMouse.active = 1;
  }

  function handleLeave() {
    state.targetMouse.active = 0;
  }

  resize();
  window.addEventListener("resize", resize);

  if (config.mouseInteraction) {
    window.addEventListener("pointermove", syncMouse);
    window.addEventListener("pointerleave", handleLeave);
  }

  requestAnimationFrame(render);
}

const galaxyCanvas = document.querySelector("#galaxyCanvas");
if (galaxyCanvas) {
  initGalaxy(galaxyCanvas, {
    density: 1.35,
    hueShift: 242,
    glowIntensity: 0.55,
    saturation: 0.45,
    starSpeed: 0.6,
    speed: 0.9,
    rotationSpeed: 0.06,
    repulsionStrength: 1.9,
    twinkleIntensity: 0.42,
    mouseRepulsion: true
  });
}

const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileMenu = document.querySelector("#mobileMenu");
const menuLinks = document.querySelectorAll("[data-menu-link]");

function setMobileMenuOpen(open) {
  if (!menuToggle || !mobileMenu) return;
  menuToggle.classList.toggle("is-open", open);
  mobileMenu.classList.toggle("is-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  mobileMenu.setAttribute("aria-hidden", String(!open));
  document.body.style.overflow = open ? "hidden" : "";
}

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    setMobileMenuOpen(!mobileMenu.classList.contains("is-open"));
  });
  menuLinks.forEach((link) => {
    link.addEventListener("click", () => setMobileMenuOpen(false));
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMobileMenuOpen(false);
    }
  });
}

const works = [
  {
    title: "耳机详情页",
    category: "detail",
    label: "电商详情页",
    desc: "耳机产品长图详情页，突出功能卖点、氛围场景和购买转化节奏。",
    thumb: "./assets/images/thumbs/detail-earbuds.jpg",
    full: "./assets/images/full/detail-earbuds.jpg"
  },
  {
    title: "筋膜枪详情页",
    category: "detail",
    label: "电商详情页",
    desc: "数码健康类产品详情页，强调性能参数、使用场景和痛点解决。",
    thumb: "./assets/images/thumbs/detail-massage-gun.jpg",
    full: "./assets/images/full/detail-massage-gun.jpg"
  },
  {
    title: "洁颜蜜详情页",
    category: "detail",
    label: "电商详情页",
    desc: "个护清洁类详情页，注重成分信息、质感画面和版式层级。",
    thumb: "./assets/images/thumbs/detail-cleanser.jpg",
    full: "./assets/images/full/detail-cleanser.jpg"
  },
  {
    title: "水杯详情页",
    category: "detail",
    label: "电商详情页",
    desc: "生活方式产品详情页，围绕材质、功能和场景进行卖点包装。",
    thumb: "./assets/images/thumbs/detail-bottle.jpg",
    full: "./assets/images/full/detail-bottle.jpg"
  },
  {
    title: "手机壳详情页",
    category: "detail",
    label: "电商详情页",
    desc: "配件类详情页，突出外观、保护力、材质与适配信息。",
    thumb: "./assets/images/thumbs/detail-phone-case.jpg",
    full: "./assets/images/full/detail-phone-case.jpg"
  },
  {
    title: "头戴式耳机详情页",
    category: "detail",
    label: "电商详情页",
    desc: "头戴耳机页面，结合产品渲染、卖点分区与沉浸式氛围。",
    thumb: "./assets/images/thumbs/detail-headphones.jpg",
    full: "./assets/images/full/detail-headphones.jpg"
  },
  {
    title: "吹风机详情页",
    category: "detail",
    label: "电商详情页",
    desc: "小家电产品详情页，强化功能表达、使用体验和视觉节奏。",
    thumb: "./assets/images/thumbs/detail-hair-dryer.jpg",
    full: "./assets/images/full/detail-hair-dryer.jpg"
  },
  {
    title: "充电宝详情页",
    category: "detail",
    label: "电商详情页",
    desc: "移动电源详情页，结合容量、便携和多场景使用信息。",
    thumb: "./assets/images/thumbs/detail-power-bank.jpg",
    full: "./assets/images/full/detail-power-bank.jpg"
  },
  {
    title: "充电器详情页",
    category: "detail",
    label: "电商详情页",
    desc: "快充类产品详情页，突出功率、安全、兼容和效率卖点。",
    thumb: "./assets/images/thumbs/detail-charger.jpg",
    full: "./assets/images/full/detail-charger.jpg"
  },
  {
    title: "U 盘详情页",
    category: "detail",
    label: "电商详情页",
    desc: "存储产品详情页，围绕容量、速度、材质和办公场景展开。",
    thumb: "./assets/images/thumbs/detail-usb-drive.jpg",
    full: "./assets/images/full/detail-usb-drive.jpg"
  },
  {
    title: "耳机海报",
    category: "poster",
    label: "海报 KV",
    desc: "横版耳机电商海报，适合活动入口与首焦氛围展示。",
    thumb: "./assets/images/thumbs/poster-earbuds.jpg",
    full: "./assets/images/full/poster-earbuds.jpg"
  },
  {
    title: "洗面奶海报",
    category: "poster",
    label: "海报 KV",
    desc: "个护类产品海报，强调洁净感、产品质感和促销信息。",
    thumb: "./assets/images/thumbs/poster-cleanser.jpg",
    full: "./assets/images/full/poster-cleanser.jpg"
  },
  {
    title: "快充头电商海报",
    category: "poster",
    label: "海报 KV",
    desc: "快充头促销海报，强化科技属性和视觉冲击力。",
    thumb: "./assets/images/thumbs/poster-fast-charger.jpg",
    full: "./assets/images/full/poster-fast-charger.jpg"
  },
  {
    title: "产品活动海报",
    category: "poster",
    label: "海报 KV",
    desc: "纵版产品活动视觉，用画面层次组织产品、场景和利益点。",
    thumb: "./assets/images/thumbs/poster-product-campaign.jpg",
    full: "./assets/images/full/poster-product-campaign.jpg"
  },
  {
    title: "美妆活动海报",
    category: "poster",
    label: "海报 KV",
    desc: "美妆护肤类活动海报，注重色彩气质和商品展示。",
    thumb: "./assets/images/thumbs/poster-beauty-campaign.jpg",
    full: "./assets/images/full/poster-beauty-campaign.jpg"
  },
  {
    title: "亚马逊详情页",
    category: "amazon",
    label: "亚马逊 / A+",
    desc: "亚马逊详情页长图，适配跨境电商的信息表达和转化逻辑。",
    thumb: "./assets/images/thumbs/amazon-detail.jpg",
    full: "./assets/images/full/amazon-detail.jpg"
  },
  {
    title: "AI 亚马逊详情页",
    category: "amazon",
    label: "亚马逊 / A+",
    desc: "AI 辅助方向的亚马逊详情页，结合卖点模块和产品展示。",
    thumb: "./assets/images/thumbs/ai-amazon-detail.jpg",
    full: "./assets/images/full/ai-amazon-detail.jpg"
  },
  {
    title: "B+ 详情页",
    category: "amazon",
    label: "亚马逊 / A+",
    desc: "B+ 页面设计，适合更完整的品牌与产品信息承载。",
    thumb: "./assets/images/thumbs/ai-bplus-detail.jpg",
    full: "./assets/images/full/ai-bplus-detail.jpg"
  },
  {
    title: "耳机 AI 主图",
    category: "ai",
    label: "AI 主图",
    desc: "耳机主图与场景表现，聚焦产品形态、材质和商业氛围。",
    thumb: "./assets/images/thumbs/ai-earbuds-main.jpg",
    full: "./assets/images/full/ai-earbuds-main.jpg"
  },
  {
    title: "亚马逊 AI 主图",
    category: "ai",
    label: "AI 主图",
    desc: "跨境电商主图展示，强调清晰产品信息和高识别度构图。",
    thumb: "./assets/images/thumbs/ai-amazon-main.jpg",
    full: "./assets/images/full/ai-amazon-main.jpg"
  },
  {
    title: "B+ AI 主图",
    category: "ai",
    label: "AI 主图",
    desc: "B+ 产品主图视觉，适合品牌页或电商活动入口使用。",
    thumb: "./assets/images/thumbs/ai-bplus-main.jpg",
    full: "./assets/images/full/ai-bplus-main.jpg"
  }
];

const grid = document.querySelector("#workGrid");
const filterButtons = document.querySelectorAll(".filter-btn");
const modal = document.querySelector("#workModal");
const modalImage = document.querySelector("#modalImage");
const modalTitle = document.querySelector("#modalTitle");
const modalDesc = document.querySelector("#modalDesc");
const modalCategory = document.querySelector("#modalCategory");

let driftAnimationId = null;
let driftResizeHandler = null;

function stopDriftWall() {
  if (driftAnimationId) {
    cancelAnimationFrame(driftAnimationId);
    driftAnimationId = null;
  }
  if (driftResizeHandler) {
    window.removeEventListener("resize", driftResizeHandler);
    driftResizeHandler = null;
  }
}

function columnFactor(index, variance) {
  const pseudo = ((index * 0.6180339887 + 0.35) % 1) * 2 - 1;
  return 1 + variance * pseudo;
}

function renderWorks(category = "all") {
  if (!grid) return;

  stopDriftWall();
  grid.innerHTML = "";

  const sourceItems = category === "all" ? works : works.filter((work) => work.category === category);
  const items = sourceItems.map((work) => ({
    ...work,
    originalIndex: works.indexOf(work)
  }));
  const columns = window.innerWidth < 720 ? 3 : window.innerWidth < 1100 ? 4 : 5;
  const tileWidth = window.innerWidth < 720 ? 168 : window.innerWidth < 1100 ? 200 : 230;
  const tileHeight = Math.round(tileWidth * 0.66);
  const gap = window.innerWidth < 720 ? 14 : 18;
  const tilt = window.innerWidth < 720 ? 10 : 16;
  const turn = window.innerWidth < 720 ? -8 : -14;
  const roll = 0;
  const depth = 120;
  const speed = 42;
  const variance = 0.45;
  const parallax = 0.6;
  const lift = window.innerWidth < 720 ? 36 : 64;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  grid.style.setProperty("--dw-tile-w", `${tileWidth}px`);
  grid.style.setProperty("--dw-tile-h", `${tileHeight}px`);
  grid.style.setProperty("--dw-gap", `${gap}px`);
  grid.style.setProperty("--dw-radius", "8px");
  grid.style.setProperty("--dw-lift", `${lift}px`);
  grid.style.setProperty("--dw-dim", "0.55");
  grid.style.setProperty("--dw-gray", "0");
  grid.style.setProperty("--dw-overlay", "#05070d");
  grid.style.setProperty("--dw-edge", "38%");
  grid.style.setProperty("--dw-perspective", "1200px");

  const plane = document.createElement("div");
  plane.className = "drift-wall__plane";
  grid.appendChild(plane);

  const columnItems = Array.from({ length: columns }, () => []);
  items.forEach((item, index) => {
    columnItems[index % columns].push(item);
  });

  const trackRefs = [];
  const offsets = [];
  const velocities = [];
  const copyHeights = [];
  const pointer = { x: 0, y: 0 };
  const pointerDamped = { x: 0, y: 0 };
  let hoveredColumn = -1;
  let wallHovered = false;
  let lastTs = null;

  function activate(tile, colIndex) {
    grid.querySelectorAll(".drift-wall__tile.is-active").forEach((active) => {
      if (active !== tile) active.classList.remove("is-active");
    });
    tile.classList.add("is-active");
    hoveredColumn = colIndex;
  }

  function release(tile) {
    tile.classList.remove("is-active");
    hoveredColumn = -1;
  }

  columnItems.forEach((column, columnIndex) => {
    const safeColumn = column.length ? column : items.slice(0, 1);
    const copyHeight = Math.max(tileHeight + gap, safeColumn.length * (tileHeight + gap));
    const copies = Math.max(3, Math.ceil((grid.clientHeight * 1.7) / copyHeight) + 1);
    copyHeights[columnIndex] = copyHeight;
    offsets[columnIndex] = copyHeight * ((columnIndex * 0.37) % 1);
    velocities[columnIndex] = 0;

    const col = document.createElement("div");
    col.className = "drift-wall__col";
    const track = document.createElement("div");
    track.className = "drift-wall__track";
    trackRefs[columnIndex] = track;

    for (let copyIndex = 0; copyIndex < copies; copyIndex += 1) {
      safeColumn.forEach((work, itemIndex) => {
        const tile = document.createElement("button");
        tile.className = "drift-wall__tile";
        tile.type = "button";
        tile.dataset.tileId = `${columnIndex}-${copyIndex}-${itemIndex}`;
        tile.dataset.col = String(columnIndex);
        tile.dataset.workIndex = String(work.originalIndex);
        tile.setAttribute("aria-label", `${work.title}，点击查看大图`);
        tile.innerHTML = `
          <span class="drift-wall__inner">
            <img src="${work.thumb}" alt="${work.title}" loading="lazy" decoding="async" draggable="false">
            <span class="drift-wall__overlay" aria-hidden="true"></span>
            <span class="drift-wall__caption">${work.title}</span>
          </span>
        `;

        tile.addEventListener("pointerenter", () => activate(tile, columnIndex));
        tile.addEventListener("pointerleave", () => release(tile));
        tile.addEventListener("focus", () => activate(tile, columnIndex));
        tile.addEventListener("blur", () => release(tile));
        tile.addEventListener("click", () => openModal(works[work.originalIndex] || work));
        track.appendChild(tile);
      });
    }

    col.appendChild(track);
    plane.appendChild(col);
  });

  function applyPlaneTransform(px, py) {
    plane.style.transform =
      `translate(-50%, -50%) scale(1.18) ` +
      `rotateX(${tilt + py}deg) rotateY(${turn + px}deg) rotateZ(${roll}deg) ` +
      `translateZ(${-depth}px)`;
  }

  function animate(ts) {
    if (lastTs === null) lastTs = ts;
    const dt = Math.min(0.05, Math.max(0, ts - lastTs) / 1000);
    lastTs = ts;

    const maxTilt = parallax * 8;
    const damp = 1 - Math.exp(-dt / 0.12);
    pointerDamped.x += (pointer.x * maxTilt - pointerDamped.x) * damp;
    pointerDamped.y += (-pointer.y * maxTilt - pointerDamped.y) * damp;
    applyPlaneTransform(pointerDamped.x, pointerDamped.y);

    if (!reduced) {
      trackRefs.forEach((track, columnIndex) => {
        const altSign = columnIndex % 2 === 0 ? 1 : -1;
        const target = hoveredColumn === columnIndex ? 0 : speed * columnFactor(columnIndex, variance) * altSign;
        const ease = 1 - Math.exp(-dt / (target === 0 ? 0.16 : 0.28));
        velocities[columnIndex] += (target - velocities[columnIndex]) * ease;
        let next = (offsets[columnIndex] || 0) + velocities[columnIndex] * dt;
        const copyHeight = copyHeights[columnIndex] || 1;
        next = ((next % copyHeight) + copyHeight) % copyHeight;
        offsets[columnIndex] = next;
        track.style.transform = `translate3d(0, ${-next}px, 0)`;
      });
    }

    driftAnimationId = requestAnimationFrame(animate);
  }

  grid.onpointermove = (event) => {
    const rect = grid.getBoundingClientRect();
    pointer.x = (event.clientX - rect.left) / rect.width - 0.5;
    pointer.y = (event.clientY - rect.top) / rect.height - 0.5;
    wallHovered = true;
  };

  grid.onpointerleave = () => {
    pointer.x = 0;
    pointer.y = 0;
    wallHovered = false;
    hoveredColumn = -1;
    grid.querySelectorAll(".drift-wall__tile.is-active").forEach((tile) => tile.classList.remove("is-active"));
  };

  grid.onclick = (event) => {
    const tile = event.target.closest(".drift-wall__tile");
    if (!tile || !grid.contains(tile)) return;
    const work = works[Number(tile.dataset.workIndex)];
    if (work) openModal(work);
  };

  driftResizeHandler = () => {
    clearTimeout(renderWorks.resizeTimer);
    renderWorks.resizeTimer = setTimeout(() => renderWorks(category), 120);
  };
  window.addEventListener("resize", driftResizeHandler);

  applyPlaneTransform(0, 0);
  driftAnimationId = requestAnimationFrame(animate);
}

function filterWorks(category) {
  renderWorks(category);
}

function openModal(work) {
  modalTitle.textContent = work.title;
  modalDesc.textContent = work.desc;
  modalCategory.textContent = work.label;
  modalImage.src = work.full;
  modalImage.alt = work.title;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  modalImage.removeAttribute("src");
}

function watchReveals() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach((item) => observer.observe(item));
}

renderWorks("all");
watchReveals();

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    filterWorks(button.dataset.filter);
  });
});

modal.addEventListener("click", (event) => {
  if (event.target.hasAttribute("data-close")) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("is-open")) {
    closeModal();
  }
});

document.addEventListener("pointermove", (event) => {
  const offset = ((event.clientX / window.innerWidth) - 0.5) * 120;
  document.body.style.setProperty("--mouse-x", `${offset}px`);
  heroState.targetX = ((event.clientX / window.innerWidth) - 0.5) * 20;
  heroState.targetY = ((event.clientY / window.innerHeight) - 0.5) * 20;
});
