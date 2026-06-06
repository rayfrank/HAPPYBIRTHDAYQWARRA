const canvas = document.getElementById("scene");
const tiltCards = document.querySelectorAll("[data-tilt]");
const photoCards = document.querySelectorAll("[data-photo]");
const modal = document.getElementById("photo-modal");
const modalImage = document.getElementById("photo-modal-image");
const modalTitle = document.getElementById("photo-modal-title");
const modalNote = document.getElementById("photo-modal-note");
const modalCloseButton = document.getElementById("photo-modal-close");
const celebrateButton = document.getElementById("celebrate-button");
const surpriseButton = document.getElementById("surprise-button");
const surpriseMessage = document.getElementById("surprise-message");
const surpriseHint = document.getElementById("surprise-hint");
const surpriseDots = document.querySelectorAll(".surprise-dot");
const cuteQrContainer = document.getElementById("cute-qr");
const downloadQrButton = document.getElementById("download-qr");
const sparkleLayer = document.getElementById("sparkle-layer");
const cursorBloom = document.getElementById("cursor-bloom");
const birthdaySiteUrl = "http://rayfrank.github.io/HAPPYBIRTHDAYQWARRA/";

const surpriseMessages = [
  "May your new year overflow with joy, answered prayers, gentle peace, and the kind of happiness that settles deeply into your heart and stays there.",
  "May every dream you carry find room to bloom bigger and brighter, and may your effort keep meeting favor in beautiful and surprising ways.",
  "May your smile stay loud, your heart stay soft, your confidence keep growing, and your wins become too many to count one by one.",
  "May love follow you everywhere, because you make life sweeter for all of us, and you deserve to feel treasured, celebrated, and deeply seen."
];

let surpriseIndex = 0;

function setupCardTilt() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  tiltCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      const rotateY = (px - 0.5) * 10;
      const rotateX = (0.5 - py) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}

function createSparkleBurst(x, y, count = 18) {
  if (!sparkleLayer) {
    return;
  }

  const palette = [
    ["#efb8aa", "#fff8f4"],
    ["#c3a8ff", "#f4edff"],
    ["#f8dddc", "#fff9f7"]
  ];
  const pieceTypes = ["", "piece-ring", "piece-pill"];

  for (let index = 0; index < count; index += 1) {
    const piece = document.createElement("span");
    const [pieceColor, pieceHighlight] = palette[index % palette.length];
    const type = pieceTypes[index % pieceTypes.length];
    const size = 8 + Math.random() * 14;
    const angle = (Math.PI * 2 * index) / count;
    const distance = 36 + Math.random() * 90;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance - 24;

    piece.className = `sparkle-piece ${type}`.trim();
    piece.style.left = `${x}px`;
    piece.style.top = `${y}px`;
    piece.style.setProperty("--dx", `${dx}px`);
    piece.style.setProperty("--dy", `${dy}px`);
    piece.style.setProperty("--spin", `${(Math.random() - 0.5) * 220}deg`);
    piece.style.setProperty("--piece-color", pieceColor);
    piece.style.setProperty("--piece-highlight", pieceHighlight);
    piece.style.animationDuration = `${900 + Math.random() * 420}ms`;

    if (type === "piece-pill") {
      piece.style.width = `${size * 1.8}px`;
      piece.style.height = `${Math.max(6, size * 0.52)}px`;
    } else {
      piece.style.width = `${size}px`;
      piece.style.height = `${size}px`;
    }

    sparkleLayer.append(piece);

    window.setTimeout(() => {
      piece.remove();
    }, 1500);
  }
}

function burstFromElement(element, count = 18) {
  const rect = element.getBoundingClientRect();
  createSparkleBurst(rect.left + (rect.width / 2), rect.top + (rect.height / 2), count);
}

function updateSurpriseDots(index) {
  surpriseDots.forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === index);
  });
}

function setupSurpriseButton() {
  if (!surpriseButton || !surpriseMessage) {
    return;
  }

  surpriseButton.addEventListener("click", () => {
    surpriseMessage.textContent = surpriseMessages[surpriseIndex];
    surpriseHint.textContent =
      surpriseIndex === surpriseMessages.length - 1
        ? "Tap again and the wishes start over."
        : "Tap again for another little wish.";

    updateSurpriseDots(surpriseIndex);
    burstFromElement(surpriseButton, 24);

    surpriseIndex = (surpriseIndex + 1) % surpriseMessages.length;
  });
}

function openPhotoModal(card) {
  if (!modal || !modalImage || !modalTitle || !modalNote) {
    return;
  }

  const image = card.querySelector("img");
  modalImage.src = card.dataset.photo;
  modalImage.alt = image ? image.alt : "";
  modalTitle.textContent = card.dataset.title || "";
  modalNote.textContent = card.dataset.note || "";

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  burstFromElement(card, 12);
}

function closePhotoModal() {
  if (!modal || !modalImage) {
    return;
  }

  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  modalImage.src = "";
  document.body.classList.remove("modal-open");
}

function setupPhotoModal() {
  if (!photoCards.length || !modal) {
    return;
  }

  photoCards.forEach((card) => {
    card.addEventListener("click", () => {
      openPhotoModal(card);
    });
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closePhotoModal();
    }
  });

  if (modalCloseButton) {
    modalCloseButton.addEventListener("click", closePhotoModal);
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closePhotoModal();
    }
  });
}

function setupCelebrateButton() {
  if (!celebrateButton) {
    return;
  }

  celebrateButton.addEventListener("click", () => {
    burstFromElement(celebrateButton, 30);

    const surpriseSection = document.getElementById("surprise");

    if (surpriseSection) {
      surpriseSection.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start"
      });
    }
  });
}

function setupCursorBloom() {
  if (!cursorBloom || window.matchMedia("(pointer: coarse)").matches) {
    return;
  }

  document.body.classList.add("has-pointer-bloom");

  window.addEventListener("pointermove", (event) => {
    cursorBloom.style.left = `${event.clientX}px`;
    cursorBloom.style.top = `${event.clientY}px`;
  });

  window.addEventListener("blur", () => {
    document.body.classList.remove("has-pointer-bloom");
  });

  window.addEventListener("focus", () => {
    document.body.classList.add("has-pointer-bloom");
  });
}

function initCuteQr() {
  if (!cuteQrContainer) {
    return;
  }

  if (!window.QRCodeStyling) {
    document.body.classList.add("no-qr-lib");
    cuteQrContainer.innerHTML = `<a href="${birthdaySiteUrl}" target="_blank" rel="noreferrer">${birthdaySiteUrl}</a>`;

    if (downloadQrButton) {
      downloadQrButton.disabled = true;
      downloadQrButton.textContent = "QR download unavailable";
    }

    return;
  }

  const qrCode = new QRCodeStyling({
    width: 320,
    height: 320,
    type: "canvas",
    data: birthdaySiteUrl,
    margin: 0,
    image: "5.jpeg",
    qrOptions: {
      errorCorrectionLevel: "H"
    },
    dotsOptions: {
      type: "rounded",
      gradient: {
        type: "linear",
        rotation: Math.PI / 3,
        colorStops: [
          { offset: 0, color: "#efb8aa" },
          { offset: 1, color: "#b592ff" }
        ]
      }
    },
    cornersSquareOptions: {
      type: "extra-rounded",
      color: "#8b6bd1"
    },
    cornersDotOptions: {
      type: "dot",
      color: "#d79f90"
    },
    backgroundOptions: {
      color: "#fffafc"
    },
    imageOptions: {
      crossOrigin: "anonymous",
      margin: 10,
      imageSize: 0.26,
      hideBackgroundDots: true
    }
  });

  qrCode.append(cuteQrContainer);

  if (downloadQrButton) {
    downloadQrButton.addEventListener("click", () => {
      qrCode.download({
        name: "qwarra-birthday-cute-qr",
        extension: "png"
      });
      burstFromElement(downloadQrButton, 22);
    });
  }
}

function createHeartShape() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.3);
  shape.bezierCurveTo(0, 0.8, -0.7, 0.95, -0.9, 0.35);
  shape.bezierCurveTo(-1.1, -0.15, -0.6, -0.55, 0, -1.05);
  shape.bezierCurveTo(0.6, -0.55, 1.1, -0.15, 0.9, 0.35);
  shape.bezierCurveTo(0.7, 0.95, 0, 0.8, 0, 0.3);
  return shape;
}

function addPawPrint(group, position, scale, color) {
  const material = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.64,
    metalness: 0.12
  });
  const pad = new THREE.Mesh(new THREE.SphereGeometry(0.26, 18, 18), material);
  pad.scale.set(1.2, 0.9, 0.5);
  group.add(pad);

  const toeOffsets = [
    [-0.26, 0.34, 0],
    [-0.08, 0.48, 0],
    [0.1, 0.48, 0],
    [0.28, 0.34, 0]
  ];

  toeOffsets.forEach(([x, y, z]) => {
    const toe = new THREE.Mesh(new THREE.SphereGeometry(0.11, 18, 18), material);
    toe.scale.set(1, 1.25, 0.6);
    toe.position.set(x, y, z);
    group.add(toe);
  });

  group.position.copy(position);
  group.scale.setScalar(scale);
}

function addYarnBall(scene, position, scale, color) {
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.52, 22, 22),
    new THREE.MeshStandardMaterial({
      color,
      roughness: 0.9,
      metalness: 0.08
    })
  );
  sphere.position.copy(position);
  sphere.scale.setScalar(scale);

  const wrapMaterial = new THREE.MeshStandardMaterial({
    color: 0xfff6f5,
    roughness: 0.32,
    metalness: 0.04
  });
  const wrap = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.02, 8, 48), wrapMaterial);
  wrap.rotation.set(Math.PI / 2.8, 0.3, 0.1);
  sphere.add(wrap);

  const wrapTwo = wrap.clone();
  wrapTwo.rotation.set(0.35, Math.PI / 2.2, 0.8);
  sphere.add(wrapTwo);

  const wrapThree = wrap.clone();
  wrapThree.rotation.set(1.1, 0.45, 1.2);
  sphere.add(wrapThree);

  scene.add(sphere);
  return sphere;
}

function addCatConstellation(scene) {
  const points = [
    [-1.3, 0.3, 0],
    [-0.9, 0.82, 0],
    [-0.58, 0.2, 0],
    [0, 0.6, 0],
    [0.58, 0.2, 0],
    [0.9, 0.82, 0],
    [1.3, 0.3, 0],
    [1.08, -0.2, 0],
    [0.48, -0.48, 0],
    [0, -0.62, 0],
    [-0.48, -0.48, 0],
    [-1.08, -0.2, 0],
    [-1.3, 0.3, 0]
  ].map(([x, y, z]) => new THREE.Vector3(x, y, z));

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(
    geometry,
    new THREE.LineBasicMaterial({
      color: 0xf6d9d8,
      transparent: true,
      opacity: 0.9
    })
  );

  const whiskerGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-0.32, -0.02, 0),
    new THREE.Vector3(-0.95, -0.08, 0),
    new THREE.Vector3(-0.3, 0.06, 0),
    new THREE.Vector3(-0.95, 0.12, 0),
    new THREE.Vector3(0.32, -0.02, 0),
    new THREE.Vector3(0.95, -0.08, 0),
    new THREE.Vector3(0.3, 0.06, 0),
    new THREE.Vector3(0.95, 0.12, 0)
  ]);

  const whiskers = new THREE.LineSegments(
    whiskerGeometry,
    new THREE.LineBasicMaterial({
      color: 0xf4eeff,
      transparent: true,
      opacity: 0.82
    })
  );

  const leftEye = new THREE.Mesh(
    new THREE.SphereGeometry(0.06, 14, 14),
    new THREE.MeshBasicMaterial({ color: 0xc3a8ff })
  );
  leftEye.position.set(-0.28, 0.05, 0);

  const rightEye = leftEye.clone();
  rightEye.position.x = 0.28;

  const nose = new THREE.Mesh(
    new THREE.ConeGeometry(0.06, 0.1, 3),
    new THREE.MeshBasicMaterial({ color: 0xefb8aa })
  );
  nose.position.set(0, -0.1, 0);
  nose.rotation.z = Math.PI;

  const group = new THREE.Group();
  group.add(line, whiskers, leftEye, rightEye, nose);
  group.position.set(0, 1.55, -3.8);
  group.scale.setScalar(0.72);

  scene.add(group);
  return group;
}

function initThreeScene() {
  if (!window.THREE || !canvas) {
    document.body.classList.add("no-three");
    return;
  }

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x1a1022, 0.058);

  const camera = new THREE.PerspectiveCamera(
    52,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 0.1, 8.7);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const ambient = new THREE.AmbientLight(0xfff3f6, 1.42);
  scene.add(ambient);

  const keyLight = new THREE.PointLight(0xefb8aa, 2.9, 30);
  keyLight.position.set(5, 5, 7);
  scene.add(keyLight);

  const rimLight = new THREE.PointLight(0xc3a8ff, 2.1, 28);
  rimLight.position.set(-7, -2, 5);
  scene.add(rimLight);

  const pearlGroup = new THREE.Group();
  pearlGroup.position.set(-4.1, 2.5, -7);

  const pearl = new THREE.Mesh(
    new THREE.SphereGeometry(1.18, 36, 36),
    new THREE.MeshStandardMaterial({
      color: 0xf8dddc,
      emissive: 0xc9b0ff,
      emissiveIntensity: 0.14,
      roughness: 0.68,
      metalness: 0.14
    })
  );
  pearlGroup.add(pearl);

  const haloOne = new THREE.Mesh(
    new THREE.TorusGeometry(1.65, 0.04, 12, 64),
    new THREE.MeshStandardMaterial({
      color: 0xefb8aa,
      roughness: 0.36,
      metalness: 0.24
    })
  );
  haloOne.rotation.set(Math.PI / 2.2, 0.2, 0.3);
  pearlGroup.add(haloOne);

  const haloTwo = new THREE.Mesh(
    new THREE.TorusGeometry(2.05, 0.025, 10, 72),
    new THREE.MeshStandardMaterial({
      color: 0xc3a8ff,
      roughness: 0.28,
      metalness: 0.2
    })
  );
  haloTwo.rotation.set(0.6, Math.PI / 2.5, 0.1);
  pearlGroup.add(haloTwo);

  const pearlGlow = new THREE.Mesh(
    new THREE.SphereGeometry(1.8, 24, 24),
    new THREE.MeshBasicMaterial({
      color: 0xf2d2f8,
      transparent: true,
      opacity: 0.09
    })
  );
  pearlGroup.add(pearlGlow);
  scene.add(pearlGroup);

  const starGeometry = new THREE.BufferGeometry();
  const starCount = 320;
  const starPositions = new Float32Array(starCount * 3);

  for (let index = 0; index < starCount; index += 1) {
    const stride = index * 3;
    starPositions[stride] = (Math.random() - 0.5) * 20;
    starPositions[stride + 1] = (Math.random() - 0.2) * 15;
    starPositions[stride + 2] = -Math.random() * 14;
  }

  starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));

  const stars = new THREE.Points(
    starGeometry,
    new THREE.PointsMaterial({
      color: 0xfff6fa,
      size: 0.055,
      transparent: true,
      opacity: 0.88
    })
  );
  scene.add(stars);

  const accentObjects = [];
  const colors = [0xefb8aa, 0xc3a8ff, 0xf8dddc, 0xe3ccff];
  const pawColors = [0xf2c7bb, 0xe2d3ff, 0xf5dede, 0xcdb7ff];

  for (let index = 0; index < 6; index += 1) {
    const yarnBall = addYarnBall(
      scene,
      new THREE.Vector3(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 7,
        -1.5 - Math.random() * 8
      ),
      0.42 + Math.random() * 0.55,
      colors[index % colors.length]
    );
    accentObjects.push(yarnBall);
  }

  const heartShape = createHeartShape();
  const heartGeometry = new THREE.ExtrudeGeometry(heartShape, {
    depth: 0.12,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.03,
    bevelThickness: 0.03
  });

  for (let index = 0; index < 6; index += 1) {
    const heart = new THREE.Mesh(
      heartGeometry,
      new THREE.MeshStandardMaterial({
        color: index % 2 === 0 ? 0xefb8aa : 0xe0caff,
        roughness: 0.4,
        metalness: 0.12
      })
    );
    heart.position.set(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 7,
      -2 - Math.random() * 8
    );
    heart.scale.setScalar(0.18 + Math.random() * 0.12);
    scene.add(heart);
    accentObjects.push(heart);
  }

  for (let index = 0; index < 5; index += 1) {
    const pawGroup = new THREE.Group();
    addPawPrint(
      pawGroup,
      new THREE.Vector3(
        (Math.random() - 0.5) * 11,
        (Math.random() - 0.5) * 7,
        -1.5 - Math.random() * 8
      ),
      0.5 + Math.random() * 0.4,
      pawColors[index % pawColors.length]
    );
    pawGroup.rotation.z = Math.random() * Math.PI;
    scene.add(pawGroup);
    accentObjects.push(pawGroup);
  }

  const catConstellation = addCatConstellation(scene);

  const pointer = { x: 0, y: 0 };
  let scrollOffset = 0;

  window.addEventListener("pointermove", (event) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
  });

  window.addEventListener("scroll", () => {
    scrollOffset = window.scrollY * 0.0013;
  });

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const clock = new THREE.Clock();

  function animate() {
    const elapsed = clock.getElapsedTime();

    camera.position.x += ((pointer.x * 0.45) - camera.position.x) * 0.03;
    camera.position.y += ((-pointer.y * 0.25) - camera.position.y) * 0.03;
    camera.lookAt(0, 0, -2);

    stars.rotation.y = elapsed * 0.018;
    stars.rotation.x = Math.sin(elapsed * 0.08) * 0.035;

    pearlGroup.position.y = 2.5 + Math.sin(elapsed * 0.32) * 0.2;
    pearlGroup.rotation.y += 0.003;
    haloOne.rotation.z += 0.004;
    haloTwo.rotation.x += 0.003;

    catConstellation.rotation.y = Math.sin(elapsed * 0.42) * 0.24;
    catConstellation.position.y = 1.55 + Math.sin(elapsed * 0.85) * 0.08;

    accentObjects.forEach((object, index) => {
      const speed = 0.22 + index * 0.013;
      object.rotation.x += 0.002 + index * 0.00008;
      object.rotation.y += 0.003 + index * 0.00012;
      object.position.y += Math.sin(elapsed * speed + index) * 0.0017;
      object.position.x += Math.cos(elapsed * speed * 0.7 + index) * 0.0012;
    });

    scene.rotation.z = scrollOffset * 0.05;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();
}

setupCardTilt();
setupPhotoModal();
setupCelebrateButton();
setupSurpriseButton();
setupCursorBloom();
initCuteQr();
initThreeScene();
