import * as THREE from "https://unpkg.com/three@0.162.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.162.0/examples/jsm/controls/OrbitControls.js";

function showBootError(err) {
  console.error(err);
  const el = document.createElement("div");
  el.style.position = "fixed";
  el.style.left = "16px";
  el.style.right = "16px";
  el.style.bottom = "16px";
  el.style.zIndex = "9999";
  el.style.padding = "12px 12px";
  el.style.borderRadius = "14px";
  el.style.border = "1px solid rgba(255,255,255,.15)";
  el.style.background = "rgba(10, 12, 18, .78)";
  el.style.backdropFilter = "blur(10px)";
  el.style.color = "rgba(240,245,255,.92)";
  el.style.fontSize = "12px";
  el.innerHTML =
    "<b>No se pudo iniciar la escena 3D.</b><br/>" +
    "Abre la consola del navegador para ver el error (F12).<br/>" +
    "<span style='opacity:.75'>Suele pasar si WebGL está desactivado o si alguna API no está disponible.</span>";
  document.body.appendChild(el);
}

try {
window.__OFFICETECH_BOOTED__ = true;

const canvas = document.getElementById("c");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setClearColor(new THREE.Color("#05060a"), 1);

const scene = new THREE.Scene();
scene.background = new THREE.Color("#05060a");
scene.fog = new THREE.Fog(new THREE.Color("#05060a"), 8, 24);

const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 80);
camera.position.set(5.6, 3.0, 7.2);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.minDistance = 4.0;
controls.maxDistance = 14.0;
controls.maxPolarAngle = Math.PI * 0.48;
controls.target.set(0, 1.0, 0);
camera.lookAt(controls.target);

// Debug geometry (si esto no se ve, hay un problema de render)
const debugCube = new THREE.Mesh(
  new THREE.BoxGeometry(0.5, 0.5, 0.5),
  new THREE.MeshStandardMaterial({
    color: new THREE.Color("#0a0a0f"),
    emissive: new THREE.Color("#6cf3ff"),
    emissiveIntensity: 2.0,
    roughness: 0.35,
    metalness: 0.25,
  })
);
debugCube.position.set(0, 1.2, 0);
debugCube.castShadow = true;
scene.add(debugCube);

const grid = new THREE.GridHelper(12, 24, new THREE.Color("#233066"), new THREE.Color("#11162a"));
grid.position.y = 0.001;
scene.add(grid);

function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
window.addEventListener("resize", resize, { passive: true });
resize();

// Lights (tech / neon)
scene.add(new THREE.AmbientLight(new THREE.Color("#b7c6ff"), 0.28));

const key = new THREE.DirectionalLight(new THREE.Color("#ffffff"), 0.9);
key.position.set(6, 9, 5);
key.castShadow = true;
key.shadow.mapSize.set(1024, 1024);
key.shadow.camera.near = 0.5;
key.shadow.camera.far = 30;
key.shadow.camera.left = -10;
key.shadow.camera.right = 10;
key.shadow.camera.top = 10;
key.shadow.camera.bottom = -10;
scene.add(key);

const neonA = new THREE.PointLight(new THREE.Color("#6cf3ff"), 0.95, 18, 2);
neonA.position.set(-4.5, 2.6, -2.8);
scene.add(neonA);

const neonB = new THREE.PointLight(new THREE.Color("#a66bff"), 0.75, 18, 2);
neonB.position.set(4.2, 2.2, 2.6);
scene.add(neonB);

const neonC = new THREE.PointLight(new THREE.Color("#22ff99"), 0.38, 14, 2);
neonC.position.set(0.0, 1.4, 4.6);
scene.add(neonC);

// Room
const room = new THREE.Group();
scene.add(room);

const floorMat = new THREE.MeshStandardMaterial({
  color: new THREE.Color("#0b1020"),
  roughness: 0.75,
  metalness: 0.15,
});
const floor = new THREE.Mesh(new THREE.PlaneGeometry(18, 18), floorMat);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
room.add(floor);

const wallMat = new THREE.MeshStandardMaterial({
  color: new THREE.Color("#070a14"),
  roughness: 0.95,
  metalness: 0.05,
});
function wall(w, h, d, x, y, z, ry = 0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), wallMat);
  m.position.set(x, y, z);
  m.rotation.y = ry;
  m.receiveShadow = true;
  room.add(m);
  return m;
}
wall(18, 5.4, 0.2, 0, 2.7, -9);
wall(18, 5.4, 0.2, 0, 2.7, 9);
wall(0.2, 5.4, 18, -9, 2.7, 0);
wall(0.2, 5.4, 18, 9, 2.7, 0);

// Neon strips
function neonStrip(color, x, y, z, w, h, ry = 0) {
  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#0a0a0f"),
    roughness: 0.2,
    metalness: 0.5,
    emissive: new THREE.Color(color),
    emissiveIntensity: 2.2,
  });
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.12), mat);
  mesh.position.set(x, y, z);
  mesh.rotation.y = ry;
  room.add(mesh);
  return mesh;
}
neonStrip("#6cf3ff", -8.6, 3.7, -3.5, 0.25, 2.0, 0);
neonStrip("#a66bff", 8.6, 3.2, 2.6, 0.25, 1.8, 0);
neonStrip("#22ff99", 0.0, 4.7, 8.6, 7.5, 0.16, 0);

// Desk setup helpers
const metalMat = new THREE.MeshStandardMaterial({
  color: new THREE.Color("#11162a"),
  roughness: 0.35,
  metalness: 0.65,
});
const deskTopMat = new THREE.MeshStandardMaterial({
  color: new THREE.Color("#0d1224"),
  roughness: 0.55,
  metalness: 0.25,
});

function addDesk({ x, z, rotY = 0, accent = "#6cf3ff" }) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  g.rotation.y = rotY;
  room.add(g);

  const top = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.14, 1.2), deskTopMat);
  top.position.set(0, 0.82, 0);
  top.castShadow = true;
  top.receiveShadow = true;
  g.add(top);

  const legGeo = new THREE.BoxGeometry(0.14, 0.8, 0.14);
  const legPos = [
    [-1.45, 0.4, -0.5],
    [1.45, 0.4, -0.5],
    [-1.45, 0.4, 0.5],
    [1.45, 0.4, 0.5],
  ];
  for (const [lx, ly, lz] of legPos) {
    const leg = new THREE.Mesh(legGeo, metalMat);
    leg.position.set(lx, ly, lz);
    leg.castShadow = true;
    g.add(leg);
  }

  // Keyboard
  const keyboard = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.05, 0.28),
    new THREE.MeshStandardMaterial({ color: new THREE.Color("#0a0f1f"), roughness: 0.8, metalness: 0.2 })
  );
  keyboard.position.set(0, 0.89, 0.15);
  keyboard.castShadow = true;
  g.add(keyboard);

  // Mouse
  // NOTE: CapsuleGeometry no está disponible en todas las builds; usamos una esfera escalada.
  const mouse = new THREE.Mesh(
    new THREE.SphereGeometry(0.09, 18, 12),
    new THREE.MeshStandardMaterial({ color: new THREE.Color("#0a0f1f"), roughness: 0.65, metalness: 0.25 })
  );
  mouse.scale.set(1.15, 0.65, 1.6);
  mouse.position.set(0.62, 0.90, 0.18);
  mouse.castShadow = true;
  g.add(mouse);

  // Monitor stand
  const stand = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.35, 0.2), metalMat);
  stand.position.set(0, 1.02, -0.25);
  stand.castShadow = true;
  g.add(stand);

  const base = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.05, 0.35), metalMat);
  base.position.set(0, 0.85, -0.25);
  base.castShadow = true;
  g.add(base);

  // Screen (clickable)
  const screenMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#0b0f1d"),
    roughness: 0.2,
    metalness: 0.1,
    emissive: new THREE.Color(accent),
    emissiveIntensity: 0.85,
  });
  const bezelMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#0a0d16"),
    roughness: 0.65,
    metalness: 0.35,
  });

  const bezel = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.95, 0.08), bezelMat);
  bezel.position.set(0, 1.62, -0.25);
  bezel.castShadow = true;
  g.add(bezel);

  const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.45, 0.82), screenMat);
  screen.position.set(0, 1.62, -0.21);
  g.add(screen);

  const glow = new THREE.PointLight(new THREE.Color(accent), 0.35, 3.2, 2);
  glow.position.set(0, 1.6, 0.15);
  g.add(glow);

  return { group: g, screen };
}

const clickables = [];

// Back desks (3 stations)
clickables.push(
  addDesk({ x: -3.6, z: -4.3, rotY: Math.PI, accent: "#6cf3ff" })
);
clickables.push(
  addDesk({ x: 0.0, z: -4.3, rotY: Math.PI, accent: "#a66bff" })
);
clickables.push(
  addDesk({ x: 3.6, z: -4.3, rotY: Math.PI, accent: "#22ff99" })
);

// Side desk
clickables.push(addDesk({ x: -5.4, z: 1.2, rotY: Math.PI / 2, accent: "#6cf3ff" }));

// Decorative: server rack
const rack = new THREE.Group();
rack.position.set(6.6, 0, -1.8);
room.add(rack);

const rackBody = new THREE.Mesh(
  new THREE.BoxGeometry(1.0, 2.2, 0.9),
  new THREE.MeshStandardMaterial({ color: new THREE.Color("#070a12"), roughness: 0.75, metalness: 0.25 })
);
rackBody.position.set(0, 1.1, 0);
rackBody.castShadow = true;
rackBody.receiveShadow = true;
rack.add(rackBody);

const rackDoor = new THREE.Mesh(
  new THREE.PlaneGeometry(0.86, 1.98),
  new THREE.MeshStandardMaterial({
    color: new THREE.Color("#05070d"),
    roughness: 0.2,
    metalness: 0.4,
    emissive: new THREE.Color("#6cf3ff"),
    emissiveIntensity: 0.18,
    transparent: true,
    opacity: 0.72,
  })
);
rackDoor.position.set(0, 1.1, 0.46);
rack.add(rackDoor);

for (let i = 0; i < 6; i++) {
  const led = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 0.06, 0.02),
    new THREE.MeshStandardMaterial({
      color: new THREE.Color("#0a0a0f"),
      emissive: new THREE.Color(i % 2 === 0 ? "#22ff99" : "#a66bff"),
      emissiveIntensity: 1.6,
    })
  );
  led.position.set(-0.36 + i * 0.12, 1.85 - i * 0.23, 0.47);
  rack.add(led);
}

// Interaction: clicking screens opens links
const screenLinks = [
  { label: "Proyecto: To-Do App", url: "https://github.com/vickysape" },
  { label: "LinkedIn", url: "https://www.linkedin.com/" },
  { label: "Portfolio", url: "https://github.com/vickysape" },
  { label: "Contacto", url: "mailto:tu-email@ejemplo.com" },
];

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function getIntersections(ev) {
  const rect = renderer.domElement.getBoundingClientRect();
  const x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
  const y = -(((ev.clientY - rect.top) / rect.height) * 2 - 1);
  pointer.set(x, y);
  raycaster.setFromCamera(pointer, camera);
  const screens = clickables.map((c) => c.screen);
  return raycaster.intersectObjects(screens, false);
}

function setCursor(isPointer) {
  renderer.domElement.style.cursor = isPointer ? "pointer" : "grab";
}
setCursor(false);

renderer.domElement.addEventListener(
  "pointermove",
  (ev) => {
    const hits = getIntersections(ev);
    setCursor(hits.length > 0);
  },
  { passive: true }
);

renderer.domElement.addEventListener("pointerdown", () => setCursor(false), { passive: true });

renderer.domElement.addEventListener("click", (ev) => {
  const hits = getIntersections(ev);
  if (!hits.length) return;

  const idx = clickables.findIndex((c) => c.screen === hits[0].object);
  const link = screenLinks[idx] ?? screenLinks[0];
  window.open(link.url, "_blank", "noreferrer");
});

// Subtle animation
const clock = new THREE.Clock();

function animate() {
  const t = clock.getElapsedTime();

  neonA.intensity = 0.8 + Math.sin(t * 1.2) * 0.15;
  neonB.intensity = 0.65 + Math.sin(t * 1.1 + 1.8) * 0.12;
  neonC.intensity = 0.35 + Math.sin(t * 0.9 + 2.7) * 0.08;

  // Floating rack door shimmer
  rackDoor.material.emissiveIntensity = 0.12 + (Math.sin(t * 2.0) * 0.05 + 0.05);

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

} catch (err) {
  showBootError(err);
}
