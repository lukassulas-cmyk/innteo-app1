// Three.js z CDN; pokud CDN není dostupné, zkusí se lokální kopie
const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.min.js')
  .catch(() => import('./three.module.min.js'));

/* =========================================================
   KONTAKT – doplňte a web se sám upraví
   ========================================================= */
const CONTACT = {
  email: '',   // např. 'info@vasedomena.cz'
  phone: '',   // např. '+420 777 123 456'
};

/* =========================================================
   OBSAH – technologie / služby
   ========================================================= */
const ICONS = {
  flame: '<path d="M12 3c.8 3 4.5 5 4.5 9.5a4.5 4.5 0 0 1-9 0c0-2.2 1.1-3.6 2.3-4.6.1 1.8.9 3 2.2 3.3C12.2 8.6 11 6 12 3z"/>',
  pump: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><circle cx="10" cy="12" r="4"/><path d="M10 8.5v7M6.5 12h7M17.5 9v6"/>',
  chip: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2.5V6M15 2.5V6M9 18v3.5M15 18v3.5M2.5 9H6M2.5 15H6M18 9h3.5M18 15h3.5"/><path d="M9.5 14l1.8-3 1.4 2 1.8-3"/>',
  snow: '<path d="M12 2.5v19M4 7l16 10M20 7L4 17M9 4.5l3 2 3-2M9 19.5l3-2 3 2M3.5 10.5l3.3-.6-.9-3.2M20.5 13.5l-3.3.6.9 3.2"/>',
  wind: '<path d="M3 8.5h11a3 3 0 1 0-3-3M3 12.5h15.5a3 3 0 1 1-3 3M3 16.5h7"/>',
};

const STATIONS = [
  {
    key: 'vytapeni', abbr: 'Teplo', name: 'Kotelna', service: 'Vytápění', icon: 'flame',
    color: 0xff6b2c, css: '#ff6b2c', supply: 0xff4d2e, ret: 0x3b82f6, kind: 'pipes',
    eyebrow: 'Vytápění · kotelny',
    title: 'Teplo spolehlivě a bez plýtvání',
    text: 'Navrhujeme, montujeme a modernizujeme plynové kotelny pro bytové domy, firmy i veřejné budovy. Od výměny kotle po kompletní rekonstrukci strojovny.',
    list: ['Kaskády kondenzačních kotlů', 'Rozdělovače, sběrače a hydraulické vyvážení', 'Ekvitermní regulace a příprava TV', 'Revize, servis a nonstop diagnostika'],
    tags: ['Kondenzační kotle', 'Kaskády', 'Ohřev TV'],
    short: 'Nové i modernizované kotelny, kaskády kondenzačních kotlů a ekvitermní regulace.',
  },
  {
    key: 'tc', abbr: 'TČ', name: 'Tepelná čerpadla', service: 'Tepelná čerpadla', icon: 'pump',
    color: 0x22c55e, css: '#22c55e', supply: 0xf59e0b, ret: 0x22c55e, kind: 'pipes',
    eyebrow: 'Obnovitelné zdroje',
    title: 'Tepelná čerpadla navržená na reálný provoz',
    text: 'Správně nadimenzované tepelné čerpadlo s dobrou regulací ušetří roky provozních nákladů. Řešíme samostatné i hybridní systémy s kotlem.',
    list: ['Vzduch–voda a země–voda', 'Hybridní zapojení s plynovým kotlem', 'Akumulace a řízení podle tarifu', 'Napojení na FVE a dálkový dohled'],
    tags: ['Vzduch–voda', 'Země–voda', 'Hybrid'],
    short: 'Samostatná i hybridní tepelná čerpadla s akumulací a chytrým řízením.',
  },
  {
    key: 'mar', abbr: 'MaR', name: 'Řídicí systém', service: 'MaR', icon: 'chip',
    color: 0xf59e0b, css: '#f59e0b', supply: 0xfbbf24, ret: 0xfbbf24, kind: 'cable',
    eyebrow: 'Měření a regulace',
    title: 'Mozek celé budovy',
    text: 'MaR propojuje všechny technologie do jednoho systému. Čidla měří, regulátory rozhodují, akční členy jednají – a vy vidíte celý provoz na jedné obrazovce.',
    list: ['Rozvaděče MaR na míru', 'Programování regulátorů a vizualizace', 'Dálkový dohled, alarmy a trendy', 'Integrace BACnet / Modbus / M-Bus'],
    tags: ['BMS', 'SCADA', 'Dálkový dohled'],
    short: 'Rozvaděče, regulátory, vizualizace a dálkový dohled nad celou technologií.',
  },
  {
    key: 'chlazeni', abbr: 'Klima', name: 'Klimatizace a chlazení', service: 'Klimatizace', icon: 'snow',
    color: 0x38bdf8, css: '#38bdf8', supply: 0x38bdf8, ret: 0x93c5fd, kind: 'pipes',
    eyebrow: 'Klimatizace · VRV/VRF · chlazení',
    title: 'Příjemných 22 °C i v nejparnějším létě',
    text: 'Klimatizace a VRV/VRF systémy pro kanceláře, obchody a úřady, chillery a chladicí centrály pro výrobu a technologie. Navržené tiše, úsporně a s napojením na řízení budovy.',
    list: ['Klimatizace a VRV/VRF pro kanceláře a komerční budovy', 'Chillery, chladicí centrály a free-cooling', 'Rozvody chladu, fancoily, chladicí stropy', 'Servis, kontroly těsnosti a evidence F-plynů'],
    tags: ['VRV/VRF', 'Chillery', 'F-plyny'],
    short: 'Chillery, rozvody chladu a free-cooling pro kanceláře i výrobu.',
  },
  {
    key: 'vzt', abbr: 'VZT', name: 'Rekuperace a VZT', service: 'Rekuperace', icon: 'wind',
    color: 0x2dd4bf, css: '#2dd4bf', supply: 0x99f6e4, ret: 0x99f6e4, kind: 'duct',
    eyebrow: 'Rekuperace · vzduchotechnika',
    title: 'Čerstvý vzduch bez tepelných ztrát',
    text: 'Vzduchotechnické jednotky s rekuperací, rozvody vzduchu a jejich regulace podle CO₂ a obsazenosti. Komfort pro lidi, úspora pro budovu.',
    list: ['VZT jednotky s rekuperací tepla', 'Rozvody, distribuční prvky, protihluk', 'Měření a zaregulování průtoků', 'Řízení podle CO₂ a vlhkosti'],
    tags: ['Rekuperace', 'Regulace CO₂', 'Zaregulování'],
    short: 'Jednotky s rekuperací, rozvody vzduchu a regulace podle CO₂.',
  },
];

const svgIcon = (k) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[k]}</svg>`;
const $ = (s) => document.querySelector(s);
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* =========================================================
   UI – dock, karty, kontakt
   ========================================================= */
const dock = $('#dock');
const cards = $('#cards');
STATIONS.forEach((s, i) => {
  const b = document.createElement('button');
  b.style.setProperty('--c', s.css);
  b.innerHTML = svgIcon(s.icon) + `<span class="full">${s.service}</span><span class="short">${s.abbr}</span>`;
  b.setAttribute('aria-label', `Proletět k: ${s.name}`);
  b.addEventListener('click', () => goTo(i));
  dock.appendChild(b);
  s.dockBtn = b;

});
// statické karty služeb v HTML (kvůli SEO) – jen připojíme přelet ke stanici
document.querySelectorAll('[data-card]').forEach((c) => {
  const i = +c.dataset.card;
  c.querySelector('.go').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    setTimeout(() => goTo(i), reduceMotion ? 0 : 650);
  });
  c.addEventListener('pointermove', (e) => {
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
  });
});
document.querySelectorAll('[data-fly]').forEach((el) => el.addEventListener('click', () => goTo(+el.dataset.fly)));

const contact = $('#contact');
if (CONTACT.email || CONTACT.phone) {
  if (CONTACT.email) contact.insertAdjacentHTML('beforeend', `<a class="btn btn-primary" href="mailto:${CONTACT.email}">✉ ${CONTACT.email}</a>`);
  if (CONTACT.phone) contact.insertAdjacentHTML('beforeend', `<a class="btn btn-ghost" href="tel:${CONTACT.phone.replace(/\s/g, '')}">☎ ${CONTACT.phone}</a>`);
} else {
  contact.innerHTML = '<span class="note">Kontaktní údaje doplníme.</span>';
}
$('#year').textContent = new Date().getFullYear();

/* top bar, reveal, steps progress, live temperature */
const topbar = $('#topbar');
const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
const steps = $('#steps');
function onScroll() {
  topbar.classList.toggle('solid', scrollY > 40);
  const r = steps.getBoundingClientRect();
  const vertical = innerWidth <= 980;
  const p = THREE.MathUtils.clamp((innerHeight * 0.75 - r.top) / (r.height * (vertical ? 1 : 0.6)), 0, 1);
  steps.style.setProperty('--p', `${p * 100}%`);
  const lis = steps.children;
  for (let k = 0; k < lis.length; k++) lis[k].classList.toggle('lit', p >= k / (lis.length - 1) - 0.02);
}
addEventListener('scroll', onScroll, { passive: true });
onScroll();
const liveT = $('#liveT');
let tv = 21;
setInterval(() => { tv += (21 - tv) * 0.3 + (Math.random() - 0.5) * 0.25; liveT.textContent = tv.toFixed(1); }, 1400);

/* =========================================================
   3D SCÉNA
   ========================================================= */
const canvas = $('#scene');
const loader = $('#loader');
let renderer = null;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
} catch (e) { renderer = null; }

const panel = $('#panel');
let current = -1;      // -1 = přehled
let busy = false;

function fillPanel(i) {
  const s = STATIONS[i];
  panel.style.setProperty('--c', s.css);
  $('#pEyebrow').textContent = s.eyebrow;
  $('#pTitle').textContent = s.title;
  $('#pText').textContent = s.text;
  $('#pList').innerHTML = s.list.map((x) => `<li>${x}</li>`).join('');
  $('#pTags').innerHTML = s.tags.map((x) => `<span>${x}</span>`).join('');
  $('#pNext').textContent = `${STATIONS[(i + 1) % STATIONS.length].service} ›`;
}
function setActive(i) {
  STATIONS.forEach((s, k) => s.dockBtn.classList.toggle('active', k === i));
  document.body.classList.toggle('away', i >= 0 || busy);
}
function openPanel(i) { fillPanel(i); panel.classList.add('open'); panel.setAttribute('aria-hidden', 'false'); }
function closePanel() { panel.classList.remove('open'); panel.setAttribute('aria-hidden', 'true'); }
$('#panelClose').addEventListener('click', () => goTo(-1));
$('#pBack').addEventListener('click', () => goTo(-1));
$('#pNext').addEventListener('click', () => goTo((current + 1) % STATIONS.length));
addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && current >= 0) goTo(-1);
  if (current >= 0 && e.key === 'ArrowRight') goTo((current + 1) % STATIONS.length);
  if (current >= 0 && e.key === 'ArrowLeft') goTo((current + STATIONS.length - 1) % STATIONS.length);
});

let goTo = (i) => { // fallback bez WebGL
  current = i; setActive(i);
  if (i >= 0) openPanel(i); else closePanel();
};

if (!renderer) {
  document.body.classList.add('no-webgl');
  loader.classList.add('done');
} else {
  initScene();
}

function initScene() {
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  const lerp = THREE.MathUtils.lerp;
  const smooth = (a, b, x) => { const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  const scene = new THREE.Scene();
  const BG = 0x070a12;
  scene.background = new THREE.Color(BG);
  scene.fog = new THREE.FogExp2(BG, 0.0125);

  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 500);

  scene.add(new THREE.HemisphereLight(0x8fb4ff, 0x1a1208, 0.55));
  const sun = new THREE.DirectionalLight(0xffffff, 1.4);
  sun.position.set(25, 50, 30);
  scene.add(sun);
  const rim = new THREE.DirectionalLight(0x6aa8ff, 0.6);
  rim.position.set(-30, 20, -40);
  scene.add(rim);

  /* --- podlaha a mřížka --- */
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), new THREE.MeshStandardMaterial({ color: 0x0a0e17, roughness: 0.95, metalness: 0.1 }));
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);
  const grid = new THREE.GridHelper(240, 120, 0x3a2a0c, 0x151c2a);
  grid.material.transparent = true; grid.material.opacity = 0.55;
  grid.position.y = 0.01;
  scene.add(grid);

  /* --- pomocné materiály --- */
  const mat = (color, o = {}) => new THREE.MeshStandardMaterial({ color, metalness: 0.55, roughness: 0.38, ...o });
  const glowTex = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 128;
    const g = c.getContext('2d'); const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.25, 'rgba(255,255,255,.45)'); r.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = r; g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  })();
  const glow = (color, size, opacity = 0.6) => {
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false }));
    sp.scale.set(size, size, 1); return sp;
  };
  const box = (w, h, d, m) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
  const cyl = (rt, rb, h, m, seg = 24) => new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), m);
  const pad = (w, d) => { const p = box(w, 0.3, d, mat(0x161c28, { metalness: 0.1, roughness: 0.9 })); p.position.y = 0.15; return p; };

  function fan(r, bladeColor = 0x2b3340) {
    const g = new THREE.Group();
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r, r * 0.08, 8, 40), mat(0x1f2630));
    g.add(ring);
    const grill = new THREE.Mesh(new THREE.CircleGeometry(r, 32), mat(0x0b0f16, { metalness: 0.2, roughness: 0.8 }));
    grill.position.z = -0.02; g.add(grill);
    const blades = new THREE.Group();
    for (let k = 0; k < 5; k++) {
      const b = box(r * 0.28, r * 0.9, 0.03, mat(bladeColor, { metalness: 0.7 }));
      b.position.y = r * 0.47; const holder = new THREE.Group(); holder.add(b); holder.rotation.z = (k / 5) * Math.PI * 2; b.rotation.y = 0.5;
      blades.add(holder);
    }
    blades.add(cyl(r * 0.14, r * 0.14, 0.08, mat(0x9aa4b2)).rotateX(Math.PI / 2));
    blades.position.z = 0.03;
    g.add(blades);
    return { group: g, blades };
  }

  /* --- stavitelé stanic (lokální +Z míří k rozdělovači) --- */
  const updaters = [];
  const builders = {
    vytapeni(g, s) {
      g.add(pad(11, 8));
      const shell = mat(0xdfe3e8, { metalness: 0.25, roughness: 0.45 });
      [-1.9, 1.9].forEach((x, k) => {
        const b = box(2.3, 3.4, 1.8, shell); b.position.set(x, 0.3 + 1.7, 0); g.add(b);
        const top = box(2.3, 0.25, 1.8, mat(0x2b313b)); top.position.set(x, 3.83, 0); g.add(top);
        const disp = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.35), new THREE.MeshBasicMaterial({ color: 0x67e8f9, toneMapped: false }));
        disp.position.set(x, 3.0, 0.91); g.add(disp);
        const win = new THREE.Mesh(new THREE.PlaneGeometry(0.75, 0.55), new THREE.MeshBasicMaterial({ color: 0xff7a2f, toneMapped: false, transparent: true }));
        win.position.set(x, 1.7, 0.91); g.add(win);
        const fl = cyl(0.28, 0.28, 2.8, mat(0x9ca3af, { metalness: 0.8 })); fl.position.set(x, 5.3, -0.3); g.add(fl);
        updaters.push((t) => { win.material.opacity = 0.65 + 0.35 * Math.abs(Math.sin(t * 9 + k * 2) * Math.sin(t * 3.7 + k)); });
      });
      const coll = cyl(0.34, 0.34, 6.2, mat(0x9ca3af, { metalness: 0.8 })); coll.rotation.z = Math.PI / 2; coll.position.set(0, 6.8, -0.3); g.add(coll);
      const chim = cyl(0.45, 0.45, 5, mat(0x6b7280, { metalness: 0.8 })); chim.position.set(3.4, 8.8, -0.3); g.add(chim);
      const exp = cyl(0.65, 0.65, 1.9, mat(0xdc2626, { metalness: 0.3 })); exp.position.set(4.3, 1.25, 1.6); g.add(exp);
      [-0.9, 0.9].forEach((x) => { const p = cyl(0.3, 0.3, 0.6, mat(0x16a34a)); p.rotation.x = Math.PI / 2; p.position.set(x, 1.6, 2.4); g.add(p); });
      const light = new THREE.PointLight(s.color, 40, 22, 1.6); light.position.set(0, 2.2, 2.8); g.add(light);
      updaters.push((t) => { light.intensity = 34 + Math.sin(t * 13) * 4 + Math.sin(t * 7.3) * 4; });
    },
    tc(g, s) {
      g.add(pad(10, 7));
      const unit = box(4.6, 2.6, 1.4, mat(0xe5e7eb, { metalness: 0.2, roughness: 0.5 })); unit.position.set(-1.6, 1.6, 0); g.add(unit);
      [-2.75, -0.45].forEach((x) => {
        const f = fan(0.85); f.group.position.set(x, 1.6, 0.71); g.add(f.group);
        updaters.push((t, dt, a) => { f.blades.rotation.z -= dt * (a ? 9 : 4); });
      });
      const tank = cyl(0.95, 0.95, 3.2, mat(0xf3f4f6, { metalness: 0.15, roughness: 0.4 }), 32); tank.position.set(3, 1.9, -0.4); g.add(tank);
      const band = cyl(0.97, 0.97, 0.18, mat(0x22c55e, { metalness: 0.3 }), 32); band.position.set(3, 2.8, -0.4); g.add(band);
      const light = new THREE.PointLight(s.color, 30, 20, 1.6); light.position.set(0, 2.5, 3); g.add(light);
    },
    mar(g, s) {
      g.add(pad(11, 7));
      const cab = mat(0x2a303b, { metalness: 0.5 });
      const leds = [];
      [-3.4, -1.6].forEach((x) => {
        const c = box(1.7, 3.4, 0.8, cab); c.position.set(x, 2.0, 0); g.add(c);
        const handle = box(0.06, 0.5, 0.06, mat(0xd1d5db)); handle.position.set(x + 0.7, 2.1, 0.43); g.add(handle);
        for (let r = 0; r < 9; r++) for (let q = 0; q < 6; q++) leds.push(V(x - 0.55 + q * 0.22, 1.0 + r * 0.26, 0.42));
      });
      const ledMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(0.09, 0.09, 0.03), new THREE.MeshBasicMaterial({ toneMapped: false }), leds.length);
      const m4 = new THREE.Matrix4(); const col = new THREE.Color();
      const palette = [0x22c55e, 0x22c55e, 0x22c55e, 0xf59e0b, 0x0f172a, 0x38bdf8];
      leds.forEach((p, k) => { m4.makeTranslation(p.x, p.y, p.z); ledMesh.setMatrixAt(k, m4); ledMesh.setColorAt(k, col.set(palette[k % palette.length])); });
      g.add(ledMesh);
      let acc = 0;
      updaters.push((t, dt) => {
        acc += dt; if (acc < 0.12) return; acc = 0;
        for (let n = 0; n < 6; n++) ledMesh.setColorAt((Math.random() * leds.length) | 0, col.set(palette[(Math.random() * palette.length) | 0]));
        ledMesh.instanceColor.needsUpdate = true;
      });
      // obrazovka s vizualizací
      const sc = document.createElement('canvas'); sc.width = 640; sc.height = 400;
      const ctx = sc.getContext('2d');
      const tex = new THREE.CanvasTexture(sc); tex.colorSpace = THREE.SRGBColorSpace;
      const frame = box(4.6, 2.9, 0.18, mat(0x111827)); frame.position.set(2.3, 2.9, 0); g.add(frame);
      const screen = new THREE.Mesh(new THREE.PlaneGeometry(4.3, 2.65), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }));
      screen.position.set(2.3, 2.9, 0.1); g.add(screen);
      const stand = box(0.2, 1.4, 0.2, mat(0x374151)); stand.position.set(2.3, 0.9, 0); g.add(stand);
      const series = [[], [], []]; const N = 60;
      for (let k = 0; k < N; k++) { series[0].push(55 + Math.sin(k / 6) * 3); series[1].push(42 + Math.sin(k / 7) * 2); series[2].push(4 + Math.sin(k / 9) * 3); }
      let sacc = 1;
      updaters.push((t, dt) => {
        sacc += dt; if (sacc < 0.25) return; sacc = 0;
        series[0].push(55 + Math.sin(t / 2) * 3 + (Math.random() - 0.5)); series[1].push(42 + Math.sin(t / 2.6) * 2 + (Math.random() - 0.5) * 0.6); series[2].push(4 + Math.sin(t / 5) * 3);
        series.forEach((a) => a.length > N && a.shift());
        ctx.fillStyle = '#0b1220'; ctx.fillRect(0, 0, 640, 400);
        ctx.fillStyle = '#f59e0b'; ctx.font = 'bold 26px Arial'; ctx.fillText('INNTEO BMS', 24, 42);
        ctx.fillStyle = '#22c55e'; ctx.beginPath(); ctx.arc(600, 34, 8, 0, 7); ctx.fill();
        ctx.fillStyle = '#64748b'; ctx.font = '18px Arial'; ctx.fillText('ONLINE', 510, 41);
        ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1;
        for (let y = 90; y <= 290; y += 50) { ctx.beginPath(); ctx.moveTo(24, y); ctx.lineTo(616, y); ctx.stroke(); }
        const cols = ['#ff6b2c', '#38bdf8', '#22c55e'];
        series.forEach((a, si) => {
          ctx.strokeStyle = cols[si]; ctx.lineWidth = 3; ctx.beginPath();
          a.forEach((v, k) => { const x = 24 + (k / (N - 1)) * 592; const y = 300 - (v / 70) * 210; k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
          ctx.stroke();
        });
        const labels = [['Přívod', series[0].at(-1), '#ff6b2c'], ['Zpátečka', series[1].at(-1), '#38bdf8'], ['Venku', series[2].at(-1), '#22c55e']];
        labels.forEach(([l, v, c], k) => {
          const x = 24 + k * 200; ctx.fillStyle = '#111c30'; ctx.fillRect(x, 318, 184, 62);
          ctx.fillStyle = '#94a3b8'; ctx.font = '16px Arial'; ctx.fillText(l, x + 12, 340);
          ctx.fillStyle = c; ctx.font = 'bold 26px Arial'; ctx.fillText(`${v.toFixed(1)} °C`, x + 12, 370);
        });
        tex.needsUpdate = true;
      });
      const light = new THREE.PointLight(s.color, 30, 20, 1.6); light.position.set(0, 3, 3.2); g.add(light);
    },
    chlazeni(g, s) {
      g.add(pad(12, 7));
      const body = box(7.6, 2.5, 3, mat(0xa9b4c2, { metalness: 0.45 })); body.position.set(0, 1.55, -0.3); g.add(body);
      for (let k = 0; k < 8; k++) { const fin = box(0.05, 1.9, 0.02, mat(0x475569)); fin.position.set(-3.4 + k * 0.97, 1.5, 1.21); g.add(fin); }
      [-2.85, -0.95, 0.95, 2.85].forEach((x, k) => {
        const f = fan(0.78, 0x334155); f.group.rotation.x = -Math.PI / 2; f.group.position.set(x, 2.82, -0.3); g.add(f.group);
        updaters.push((t, dt, a) => { f.blades.rotation.z += dt * (a ? 10 : 4.5) * (1 + k * 0.05); });
      });
      const tank = cyl(0.8, 0.8, 2.6, mat(0x1e3a8a, { metalness: 0.3 })); tank.position.set(4.8, 1.6, 1.2); g.add(tank);
      [-1.2, 1.2].forEach((x) => { const p = cyl(0.32, 0.32, 0.7, mat(0x2563eb)); p.rotation.x = Math.PI / 2; p.position.set(x, 1.6, 2.4); g.add(p); });
      const light = new THREE.PointLight(s.color, 36, 22, 1.6); light.position.set(0, 3.2, 3.2); g.add(light);
      const frost = glow(0x7dd3fc, 9, 0.25); frost.position.set(0, 3.4, -0.3); g.add(frost);
    },
    vzt(g, s) {
      g.add(pad(12, 7));
      const shell = mat(0xcfd6de, { metalness: 0.35, roughness: 0.4 });
      const ahu = box(9.4, 2.7, 2.4, shell); ahu.position.set(0, 1.65, -0.2); g.add(ahu);
      [-2.4, 0, 2.4].forEach((x) => { const seam = box(0.06, 2.72, 2.42, mat(0x4b5563)); seam.position.set(x, 1.65, -0.2); g.add(seam); });
      // rotační rekuperátor
      const wc = document.createElement('canvas'); wc.width = wc.height = 256;
      const w = wc.getContext('2d');
      w.fillStyle = '#1f2937'; w.beginPath(); w.arc(128, 128, 126, 0, 7); w.fill();
      w.strokeStyle = '#2dd4bf'; w.lineWidth = 2;
      for (let r = 20; r < 126; r += 9) { w.beginPath(); w.arc(128, 128, r, 0, 7); w.stroke(); }
      w.lineWidth = 6; w.strokeStyle = '#94a3b8';
      for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; w.beginPath(); w.moveTo(128, 128); w.lineTo(128 + Math.cos(a) * 126, 128 + Math.sin(a) * 126); w.stroke(); }
      const wheelTex = new THREE.CanvasTexture(wc); wheelTex.colorSpace = THREE.SRGBColorSpace;
      const wheel = new THREE.Mesh(new THREE.CircleGeometry(1.05, 48), new THREE.MeshStandardMaterial({ map: wheelTex, emissive: 0x0f766e, emissiveIntensity: 0.4, metalness: 0.4, roughness: 0.5 }));
      wheel.position.set(-1.2, 1.65, 1.01); g.add(wheel);
      const f = fan(0.85); f.group.position.set(3.4, 1.65, 1.01); g.add(f.group);
      updaters.push((t, dt, a) => { wheel.rotation.z -= dt * (a ? 1.4 : 0.6); f.blades.rotation.z -= dt * (a ? 11 : 5); });
      const duct = mat(0xb6c0cb, { metalness: 0.85, roughness: 0.3 });
      [-3.8, 3.8].forEach((x) => {
        const up = box(1.4, 4.2, 1.1, duct); up.position.set(x, 5.1, -0.6); g.add(up);
        const back = box(1.4, 1.1, 8, duct); back.position.set(x, 6.65, -4.1); g.add(back);
      });
      const light = new THREE.PointLight(s.color, 32, 22, 1.6); light.position.set(0, 3, 3.2); g.add(light);
    },
  };

  /* --- rozmístění stanic --- */
  const R = 30, HEADER_Z = 10, H = 5.2;
  STATIONS.forEach((s, i) => {
    const a = lerp(-0.95, 0.95, i / (STATIONS.length - 1));
    s.pos = V(Math.sin(a) * R, 0, -Math.cos(a) * R + 4);
    s.hx = (i - 2) * 5;
    s.toHub = V(s.hx - s.pos.x, 0, HEADER_Z - s.pos.z).normalize();
    const g = new THREE.Group();
    g.position.copy(s.pos);
    g.lookAt(V(s.hx, 0, HEADER_Z));
    builders[s.key](g, s);
    const halo = glow(s.color, 18, 0.18); halo.position.set(0, 0.4, 0); g.add(halo);
    const ringFloor = new THREE.Mesh(new THREE.RingGeometry(7.4, 7.6, 64), new THREE.MeshBasicMaterial({ color: s.color, transparent: true, opacity: 0.35, toneMapped: false }));
    ringFloor.rotation.x = -Math.PI / 2; ringFloor.position.y = 0.03; g.add(ringFloor);
    s.ring = ringFloor;
    scene.add(g);
    s.group = g;
  });

  /* --- rozdělovač --- */
  const header = cyl(0.75, 0.75, 28, mat(0xb45309, { metalness: 0.6, roughness: 0.35 }), 32);
  header.rotation.z = Math.PI / 2; header.position.set(0, 1.4, HEADER_Z); scene.add(header);
  [-14, 14].forEach((x) => { const cap = new THREE.Mesh(new THREE.SphereGeometry(0.75, 24, 12), header.material); cap.position.set(x, 1.4, HEADER_Z); scene.add(cap); });
  for (let x = -12; x <= 12; x += 6) { const leg = box(0.25, 0.7, 0.25, mat(0x374151)); leg.position.set(x, 0.35, HEADER_Z); scene.add(leg); }
  const headerGlow = glow(0xf59e0b, 30, 0.12); headerGlow.position.set(0, 1.5, HEADER_Z); scene.add(headerGlow);

  /* --- potrubní trasy + proudění --- */
  const flows = [];
  const flangeGeo = new THREE.TorusGeometry(1, 0.12, 6, 20);
  const flangeMat = mat(0x6b7280, { metalness: 0.8 });
  const up = V(0, 1, 0);
  STATIONS.forEach((s, i) => {
    const inlet = s.pos.clone().addScaledVector(s.toHub, 6.2);
    const end = s.pos.clone().addScaledVector(s.toHub, 2.2);
    const mid = V(lerp(s.hx, inlet.x, 0.5), H, lerp(HEADER_Z - 4, inlet.z, 0.5));
    const pts = [V(s.hx, 1.4, HEADER_Z), V(s.hx, H, HEADER_Z), V(s.hx, H, HEADER_Z - 4), mid, V(inlet.x, H, inlet.z), V(inlet.x, 1.7, inlet.z), V(end.x, 1.7, end.z)];
    s.route = pts;
    const perp = V(-s.toHub.z, 0, s.toHub.x);
    const lines = s.kind === 'pipes' ? [{ off: 0.5, color: s.supply, dir: 1 }, { off: -0.5, color: s.ret, dir: -1 }]
      : [{ off: 0, color: s.supply, dir: 1 }];
    const radius = s.kind === 'duct' ? 0.6 : s.kind === 'cable' ? 0.2 : 0.3;
    const radial = s.kind === 'duct' ? 4 : 14;
    s.flows = [];
    lines.forEach((ln) => {
      const p2 = pts.map((p) => p.clone().addScaledVector(perp, ln.off));
      const curve = new THREE.CatmullRomCurve3(p2, false, 'catmullrom', 0.08);
      const len = curve.getLength();
      const tubeMat = new THREE.MeshPhysicalMaterial({ color: ln.color, metalness: 0.1, roughness: 0.15, transparent: true, opacity: 0.22, depthWrite: false, emissive: ln.color, emissiveIntensity: 0.15 });
      const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 220, radius, radial, false), tubeMat);
      scene.add(tube);
      // jádro – tenká svítící linka
      const core = new THREE.Mesh(new THREE.TubeGeometry(curve, 220, radius * 0.12, 6, false), new THREE.MeshBasicMaterial({ color: ln.color, transparent: true, opacity: 0.35, toneMapped: false }));
      scene.add(core);
      // příruby
      if (s.kind !== 'cable') {
        const nF = Math.floor(len / 3.2);
        const fl = new THREE.InstancedMesh(flangeGeo, flangeMat, nF);
        const q = new THREE.Quaternion(); const m4 = new THREE.Matrix4(); const sc = V(radius * 1.12, radius * 1.12, radius * 1.12);
        for (let k = 0; k < nF; k++) {
          const t = (k + 0.5) / nF; const p = curve.getPointAt(t); const tg = curve.getTangentAt(t);
          q.setFromUnitVectors(V(0, 0, 1), tg); m4.compose(p, q, sc); fl.setMatrixAt(k, m4);
        }
        scene.add(fl);
      }
      // proudící částice
      const count = Math.max(24, Math.round(len * (s.kind === 'cable' ? 0.8 : 1.3)));
      const pr = s.kind === 'duct' ? 0.2 : s.kind === 'cable' ? 0.16 : 0.15;
      const pm = new THREE.InstancedMesh(new THREE.SphereGeometry(pr, 10, 8), new THREE.MeshBasicMaterial({ color: ln.color, toneMapped: false }), count);
      scene.add(pm);
      const f = { curve, len, count, mesh: pm, dir: ln.dir, tubeMat, core, seed: Math.random(), cable: s.kind === 'cable' };
      flows.push(f); s.flows.push(f);
    });
    // podpěry
    [1, 2, 4].forEach((k) => {
      const p = pts[k]; const post = box(0.2, p.y, 0.2, mat(0x374151)); post.position.set(p.x, p.y / 2, p.z); scene.add(post);
    });
  });

  /* --- poletující prach v prostoru --- */
  const dustN = 600;
  const dustGeo = new THREE.BufferGeometry();
  const dp = new Float32Array(dustN * 3);
  for (let k = 0; k < dustN; k++) { dp[k * 3] = (Math.random() - 0.5) * 120; dp[k * 3 + 1] = Math.random() * 22; dp[k * 3 + 2] = (Math.random() - 0.5) * 100 - 6; }
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dp, 3));
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0x8fa3c0, size: 0.09, transparent: true, opacity: 0.5, depthWrite: false }));
  scene.add(dust);

  /* --- HTML štítky nad stanicemi --- */
  const labelsEl = $('#labels');
  STATIONS.forEach((s, i) => {
    const l = document.createElement('button');
    l.className = 'label'; l.style.setProperty('--c', s.css);
    l.innerHTML = `<i></i>${s.name}`;
    l.addEventListener('click', () => goTo(i));
    labelsEl.appendChild(l); s.label = l;
  });

  /* --- kamera: přehled + trasy letu --- */
  const overview = { pos: V(0, 27, 46), look: V(0, 0, -9) };
  function layoutOverview() {
    const a = camera.aspect;
    const k = a < 1 ? 1.75 : a < 1.4 ? 1.25 : 1;
    overview.pos.set(0, 27 * k, 46 * k);
    // na širokém displeji posunout scénu doprava od textu, na mobilu nahoru nad text
    overview.look.set(a > 1.3 ? -13 : 0, a < 1 ? -9 : 0, -9);
  }
  function camRoute(s, i) {
    const view = s.pos.clone().addScaledVector(s.toHub.clone().applyAxisAngle(up, i % 2 ? -0.75 : 0.75), 16); view.y = 7.2;
    const r = s.route;
    return [V(s.hx, 9, HEADER_Z + 9), V(s.hx, H + 1.9, HEADER_Z + 1), V(s.hx, H + 1.9, HEADER_Z - 4),
      r[3].clone().setY(H + 1.9), view];
  }
  STATIONS.forEach((s, i) => { s.cam = camRoute(s, i); s.focus = s.pos.clone().add(V(0, 2, 0)); s.view = s.cam.at(-1); });

  const cam = { pos: overview.pos.clone(), look: overview.look.clone() };
  let flight = null;
  const flightEl = $('#flight'), flightBar = $('#flightBar'), flightName = $('#flightName');

  // cíl pohledu u stanice: posunutý tak, aby stanici nezakrýval informační panel
  function stationLook(s) {
    const L = s.focus.clone();
    const fwd = L.clone().sub(s.view).setY(0).normalize();
    if (camera.aspect > 1.1) L.addScaledVector(V(-fwd.z, 0, fwd.x), 5);
    else L.y -= 5.5;
    return L;
  }

  function buildPath(from, to) {
    let pts = [cam.pos.clone()];
    if (from >= 0) pts.push(...STATIONS[from].cam.slice(0, -1).reverse());
    if (to >= 0) pts.push(...STATIONS[to].cam);
    else pts.push(overview.pos.clone());
    // odstranit body příliš blízko sebe
    pts = pts.filter((p, k) => k === 0 || p.distanceTo(pts[k - 1]) > 0.5);
    if (pts.length < 2) pts.push(pts[0].clone().add(V(0, 0.01, 0)));
    return new THREE.CatmullRomCurve3(pts, false, 'centripetal');
  }

  goTo = function (i) {
    if (busy || i === current) { if (i === current && i >= 0) openPanel(i); return; }
    const from = current;
    const curve = buildPath(from, i);
    const len = curve.getLength();
    const dur = reduceMotion ? 0.6 : THREE.MathUtils.clamp(len / 20, 2.2, 4.6);
    const target = i >= 0 ? STATIONS[i] : null;
    flight = { curve, t: 0, dur, from, to: i, startLook: cam.look.clone(), endLook: target ? stationLook(target) : overview.look };
    busy = true;
    closePanel();
    current = i;
    document.body.classList.add('flying');
    setActive(i);
    flightName.textContent = target ? target.name : 'Přehled strojovny';
    flightEl.style.setProperty('--fc', target ? target.css : '#F59E0B');
  };

  function endFlight() {
    const f = flight; flight = null; busy = false;
    document.body.classList.remove('flying');
    setActive(current);
    if (f.to >= 0) openPanel(f.to);
  }

  /* --- interakce myší --- */
  const mouse = { x: 0, y: 0, sx: 0, sy: 0 };
  addEventListener('pointermove', (e) => { mouse.x = (e.clientX / innerWidth) * 2 - 1; mouse.y = (e.clientY / innerHeight) * 2 - 1; }, { passive: true });
  const ray = new THREE.Raycaster(); const ndc = new THREE.Vector2();
  canvas.addEventListener('click', (e) => {
    if (busy) return;
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(STATIONS.map((s) => s.group), true)[0];
    if (!hit) return;
    let o = hit.object; while (o && !STATIONS.some((s) => s.group === o)) o = o.parent;
    const idx = STATIONS.findIndex((s) => s.group === o);
    if (idx >= 0) goTo(idx);
  });

  /* --- velikost a viditelnost --- */
  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    layoutOverview();
    if (current < 0 && !flight) cam.pos.copy(overview.pos), cam.look.copy(overview.look);
  }
  addEventListener('resize', resize);
  resize();
  let heroVisible = true;
  new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; }, { threshold: 0 }).observe($('.hero'));

  /* --- smyčka --- */
  const clock = new THREE.Clock();
  const m4 = new THREE.Matrix4(); const tmp = V(0, 0, 0); const lookTmp = V(0, 0, 0);
  const idQ = new THREE.Quaternion(); const one = V(1, 1, 1);
  let elapsed = 0, firstFrame = true;

  function frame() {
    requestAnimationFrame(frame);
    const rawDt = Math.min(clock.getDelta(), 0.25);
    const dt = Math.min(rawDt, 0.05);
    if (!heroVisible && !firstFrame) return;
    elapsed += dt;
    const t = elapsed;

    // let kamery
    let fovBoost = 0;
    if (flight) {
      flight.t = Math.min(1, flight.t + rawDt / flight.dur);
      const e = ease(flight.t);
      flight.curve.getPointAt(e, cam.pos);
      flight.curve.getPointAt(Math.min(1, e + 0.035), lookTmp);
      const toEnd = smooth(0.55, 1, flight.t);
      const fromStart = smooth(0, 0.18, flight.t);
      tmp.copy(flight.startLook).lerp(lookTmp, fromStart).lerp(flight.endLook, toEnd);
      cam.look.copy(tmp);
      fovBoost = Math.sin(Math.PI * flight.t) * (reduceMotion ? 0 : 16);
      flightBar.style.width = `${flight.t * 100}%`;
      if (flight.t >= 1) endFlight();
    }

    // jemné pohupování + paralaxa
    mouse.sx += (mouse.x - mouse.sx) * 0.04; mouse.sy += (mouse.y - mouse.sy) * 0.04;
    camera.position.copy(cam.pos);
    if (!flight && !reduceMotion) {
      const amp = current < 0 ? 1 : 0.35;
      const scrollK = current < 0 ? Math.min(scrollY / innerHeight, 1) : 0;
      camera.position.x += (Math.sin(t * 0.12) * 3 + mouse.sx * 4) * amp;
      camera.position.y += (Math.sin(t * 0.17) * 0.8 - mouse.sy * 2) * amp + scrollK * 12;
      camera.position.z += scrollK * 10;
    }
    camera.lookAt(cam.look);
    camera.fov = 50 + fovBoost; camera.updateProjectionMatrix();

    // proudění v trubkách
    flows.forEach((f) => {
      const owner = STATIONS.find((s) => s.flows.includes(f));
      const active = owner && STATIONS.indexOf(owner) === current;
      const speed = (active ? 9 : 3.2) + (flight ? 6 : 0);
      f.tubeMat.opacity += ((active ? 0.38 : 0.2) - f.tubeMat.opacity) * 0.08;
      for (let k = 0; k < f.count; k++) {
        let u = (k / f.count + (t * speed) / f.len + f.seed) % 1;
        if (f.dir < 0) u = 1 - u;
        f.curve.getPointAt(u, tmp);
        const s = f.cable ? (Math.sin(k * 1.7 + t * 6) > 0.2 ? 1 : 0.35) : 1;
        m4.compose(tmp, idQ, one.set(s, s, s));
        f.mesh.setMatrixAt(k, m4);
      }
      f.mesh.instanceMatrix.needsUpdate = true;
    });

    STATIONS.forEach((s, i) => {
      const a = i === current;
      s.ring.material.opacity += ((a ? 0.8 : 0.3) - s.ring.material.opacity) * 0.08;
      s.ring.scale.setScalar(1 + (a ? Math.sin(t * 3) * 0.02 : 0));
    });
    updaters.forEach((u, k) => u(t, dt, true));
    dust.rotation.y = t * 0.01;
    dust.position.y = Math.sin(t * 0.2) * 0.4;

    // štítky
    const w = canvas.clientWidth, h = canvas.clientHeight;
    STATIONS.forEach((s) => {
      tmp.copy(s.pos).add(V(0, 7.5, 0)).project(camera);
      const vis = tmp.z < 1 && current < 0 && !flight;
      s.label.style.transform = `translate(${(tmp.x * 0.5 + 0.5) * w}px, ${(-tmp.y * 0.5 + 0.5) * h}px) translate(-50%,-100%)`;
      s.label.style.opacity = vis ? '1' : '0';
      s.label.style.pointerEvents = vis ? 'auto' : 'none';
    });

    renderer.render(scene, camera);
    if (firstFrame) { firstFrame = false; setTimeout(() => loader.classList.add('done'), 250); }
  }
  frame();
}
