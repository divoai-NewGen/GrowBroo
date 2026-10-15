"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import * as THREE from "three";

interface LaptopIntroProps {
  onFinish: () => void;
}

export default function LaptopIntro({ onFinish }: LaptopIntroProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState<"closed" | "opening" | "open" | "zooming" | "done">("closed");
  const stageRef = useRef<"closed" | "opening" | "open" | "zooming" | "done">("closed");

  // Keep ref in sync
  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  // Lock body scroll during intro
  useEffect(() => {
    if (stage !== "done") {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [stage]);

  const handleOpen = useCallback(() => {
    if (stageRef.current === "closed") {
      setStage("opening");
    } else if (stageRef.current === "open") {
      setStage("zooming");
    }
  }, []);

  const handleSkip = useCallback(() => {
    setStage("done");
    onFinish();
  }, [onFinish]);

  // Keyboard controls: Enter / Space to open / enter, Esc to skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "Enter" || e.key === " ") && (stageRef.current === "closed" || stageRef.current === "open")) {
        e.preventDefault();
        handleOpen();
      } else if (e.key === "Escape") {
        handleSkip();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleOpen, handleSkip]);

  // Scroll & Wheel controls: user halka scroll bhi kare to laptop open ho jaye
  useEffect(() => {
    let touchStartY = 0;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 2 || Math.abs(e.deltaX) > 2) {
        if (stageRef.current === "closed") {
          setStage("opening");
        } else if (stageRef.current === "open") {
          setStage("zooming");
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const diffY = touchStartY - e.touches[0].clientY;
      if (Math.abs(diffY) > 6) {
        if (stageRef.current === "closed") {
          setStage("opening");
        } else if (stageRef.current === "open") {
          setStage("zooming");
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#F6FAF6");

    // 2. Camera setup with professional responsive distance calculation
    const fov = 34;
    const camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 100);

    const updateCameraDistance = () => {
      const aspect = width / height;
      const vFovRad = (fov * Math.PI) / 360;
      // Generous framing so the open laptop (height 2.1) has ample padding above and below
      const targetWidth = 5.8;
      const targetHeight = 4.8;
      const distFromWidth = targetWidth / (2 * aspect * Math.tan(vFovRad));
      const distFromHeight = targetHeight / (2 * Math.tan(vFovRad));
      const dist = Math.max(distFromWidth, distFromHeight, 6.8);

      // Elevated 3/4 studio perspective centered on the opened laptop height (Y = 0.65)
      camera.position.set(0, dist * 0.44, dist * 0.88);
      camera.lookAt(0, 0.65, 0);
    };

    updateCameraDistance();

    // 3. Renderer with high quality anti-aliasing & ACES tone mapping
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    container.appendChild(renderer.domElement);

    // 4. Studio Lighting (Clean, neutral white for authentic Apple Silver aluminum)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.45);
    scene.add(ambientLight);

    // Main Studio Key Light (soft white directional from top-right)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(5, 9, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 20;
    keyLight.shadow.bias = -0.0008;
    scene.add(keyLight);

    // Fill Light (soft clean fill from top-left)
    const fillLight = new THREE.DirectionalLight(0xf1f5f9, 1.3);
    fillLight.position.set(-6, 6, 4);
    scene.add(fillLight);

    // Specular Rim Light (creates crisp aluminum edge reflections along curved corners)
    const rimLight = new THREE.DirectionalLight(0xffffff, 1.8);
    rimLight.position.set(2, 7, -6);
    scene.add(rimLight);

    // Screen Glow Light (illuminates keyboard deck when lid opens)
    const screenGlowLight = new THREE.PointLight(0x39e900, 0, 5);
    screenGlowLight.position.set(0, 1.3, -0.3);
    scene.add(screenGlowLight);

    // 5. Materials (Exact Apple Silver Aluminum matching the Home page 3D MacBook)
    const appleSilverMaterial = new THREE.MeshStandardMaterial({
      color: 0xcdd1d5, // Bright satin silver aluminum
      metalness: 0.76,
      roughness: 0.36,
    });

    const darkTrimMaterial = new THREE.MeshStandardMaterial({
      color: 0x141618,
      metalness: 0.25,
      roughness: 0.85,
    });

    const keyCapMaterial = new THREE.MeshStandardMaterial({
      color: 0x1c1e21, // Apple matte black chiclet keys
      metalness: 0.3,
      roughness: 0.65,
    });

    const trackpadMaterial = new THREE.MeshStandardMaterial({
      color: 0xc8cdd2, // Matches Apple MacBook satin aluminum glass trackpad
      metalness: 0.72,
      roughness: 0.38,
    });

    // Helper: Rounded Rectangle Shape Generator
    function createRoundedRectShape(w: number, d: number, r: number) {
      const shape = new THREE.Shape();
      const x = -w / 2;
      const y = -d / 2;
      shape.moveTo(x + r, y);
      shape.lineTo(x + w - r, y);
      shape.quadraticCurveTo(x + w, y, x + w, y + r);
      shape.lineTo(x + w, y + d - r);
      shape.quadraticCurveTo(x + w, y + d, x + w - r, y + d);
      shape.lineTo(x + r, y + d);
      shape.quadraticCurveTo(x, y + d, x, y + d - r);
      shape.lineTo(x, y + r);
      shape.quadraticCurveTo(x, y, x + r, y);
      return shape;
    }

    // 6. Laptop Base (Chassis with Rounded Corners)
    const laptopGroup = new THREE.Group();
    scene.add(laptopGroup);

    const baseWidth = 3.2;
    const baseDepth = 2.15;
    const cornerRadius = 0.15;
    const baseThickness = 0.065;
    const baseBevel = 0.008;

    // Extruded rounded base unibody
    const baseShape = createRoundedRectShape(
      baseWidth - 2 * baseBevel,
      baseDepth - 2 * baseBevel,
      cornerRadius - baseBevel
    );
    const baseExtrudeSettings = {
      depth: baseThickness,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: baseBevel,
      bevelThickness: baseBevel,
    };
    const baseGeo = new THREE.ExtrudeGeometry(baseShape, baseExtrudeSettings);
    // Rotate so shape lies in XZ plane and thickness extends along +Y
    baseGeo.rotateX(-Math.PI / 2);
    baseGeo.translate(0, baseBevel, 0);

    const baseMesh = new THREE.Mesh(baseGeo, appleSilverMaterial);
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    laptopGroup.add(baseMesh);

    const totalBaseHeight = baseThickness + 2 * baseBevel; // ~0.081

    // Front opening thumb notch (groove at front edge)
    const notchGeo = new THREE.BoxGeometry(0.55, 0.02, 0.03);
    const notchMat = new THREE.MeshBasicMaterial({ color: 0x9ca1a6 });
    const notchMesh = new THREE.Mesh(notchGeo, notchMat);
    notchMesh.position.set(0, totalBaseHeight - 0.01, baseDepth / 2 + 0.002);
    laptopGroup.add(notchMesh);

    // Side Thunderbolt / USB-C oval ports (matching 2nd screenshot!)
    const portGeo = new THREE.BoxGeometry(0.012, 0.016, 0.04);
    const portMat = new THREE.MeshBasicMaterial({ color: 0x1c1e21 });
    const port1 = new THREE.Mesh(portGeo, portMat);
    port1.position.set(-baseWidth / 2 - 0.001, totalBaseHeight / 2, -0.45);
    laptopGroup.add(port1);

    const port2 = new THREE.Mesh(portGeo, portMat);
    port2.position.set(-baseWidth / 2 - 0.001, totalBaseHeight / 2, -0.32);
    laptopGroup.add(port2);

    // Audio headphone jack dot
    const jackGeo = new THREE.CylinderGeometry(0.009, 0.009, 0.01, 16);
    jackGeo.rotateZ(Math.PI / 2);
    const jackMesh = new THREE.Mesh(jackGeo, portMat);
    jackMesh.position.set(-baseWidth / 2 - 0.001, totalBaseHeight / 2, -0.18);
    laptopGroup.add(jackMesh);

    // Keyboard Well (recessed matte black tray in the silver palm rest)
    const wellGeo = new THREE.BoxGeometry(2.82, 0.004, 1.28);
    const wellMesh = new THREE.Mesh(wellGeo, darkTrimMaterial);
    wellMesh.position.set(0, totalBaseHeight + 0.001, -0.22);
    laptopGroup.add(wellMesh);

    // Chiclet Key deck (all keys unified in sleek Apple matte black)
    const keyRows = 5;
    const keyCols = 14;
    const keyGroup = new THREE.Group();
    keyGroup.position.set(-1.28, totalBaseHeight + 0.006, -0.78);

    for (let r = 0; r < keyRows; r++) {
      for (let c = 0; c < keyCols; c++) {
        const isSpacebar = r === 4 && c >= 4 && c <= 8;
        if (isSpacebar && c > 4) continue; // single wide spacebar

        const kw = isSpacebar ? 1.08 : 0.165;
        const kd = 0.165;
        const kGeo = new THREE.BoxGeometry(kw, 0.016, kd);
        const keyMesh = new THREE.Mesh(kGeo, keyCapMaterial);
        keyMesh.position.set(
          isSpacebar ? c * 0.198 + 0.42 : c * 0.198,
          0,
          r * 0.252
        );
        keyGroup.add(keyMesh);
      }
    }
    laptopGroup.add(keyGroup);

    // Apple Precision Glass Trackpad (rounded corners, subtle hairline perimeter gap)
    const tpWidth = 1.12;
    const tpDepth = 0.68;
    const tpRadius = 0.035;

    // Subtle recessed perimeter groove
    const tpGrooveShape = createRoundedRectShape(
      tpWidth + 0.012,
      tpDepth + 0.012,
      tpRadius + 0.006
    );
    const tpGrooveGeo = new THREE.ShapeGeometry(tpGrooveShape);
    tpGrooveGeo.rotateX(-Math.PI / 2);
    const tpGrooveMat = new THREE.MeshBasicMaterial({ color: 0x9da3a9 });
    const tpGrooveMesh = new THREE.Mesh(tpGrooveGeo, tpGrooveMat);
    tpGrooveMesh.position.set(0, totalBaseHeight + 0.001, 0.60);
    laptopGroup.add(tpGrooveMesh);

    // Trackpad Surface (rounded rect matching Apple anodized finish)
    const tpShape = createRoundedRectShape(tpWidth, tpDepth, tpRadius);
    const tpGeo = new THREE.ShapeGeometry(tpShape);
    tpGeo.rotateX(-Math.PI / 2);
    const trackpadMesh = new THREE.Mesh(tpGeo, trackpadMaterial);
    trackpadMesh.position.set(0, totalBaseHeight + 0.0015, 0.60);
    laptopGroup.add(trackpadMesh);

    // 7. Hinge & Lid Assembly
    // Hinge is at the BACK edge of the laptop: z = -baseDepth / 2, y = totalBaseHeight
    const hingePivot = new THREE.Group();
    hingePivot.position.set(0, totalBaseHeight, -baseDepth / 2);
    laptopGroup.add(hingePivot);

    // Hinge cylinder bar (matte dark trim)
    const hingeGeo = new THREE.CylinderGeometry(0.035, 0.035, 2.1, 16);
    hingeGeo.rotateZ(Math.PI / 2);
    const hingeMesh = new THREE.Mesh(hingeGeo, darkTrimMaterial);
    hingeMesh.position.set(0, 0, 0);
    hingePivot.add(hingeMesh);

    // Lid rotating group (anchored at hinge pivot 0, 0, 0)
    const lidGroup = new THREE.Group();
    hingePivot.add(lidGroup);

    // Lid Casing: Rounded Extruded Shape (matching 2nd screenshot with curved top corners!)
    const lidThickness = 0.032;
    const lidBevel = 0.006;
    const lidShape = createRoundedRectShape(
      baseWidth - 2 * lidBevel,
      baseDepth - 2 * lidBevel,
      cornerRadius - lidBevel
    );
    const lidExtrudeSettings = {
      depth: lidThickness,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: lidBevel,
      bevelThickness: lidBevel,
    };
    const lidGeo = new THREE.ExtrudeGeometry(lidShape, lidExtrudeSettings);
    lidGeo.rotateX(-Math.PI / 2);
    lidGeo.translate(0, lidBevel, baseDepth / 2);

    const lidMesh = new THREE.Mesh(lidGeo, appleSilverMaterial);
    lidMesh.castShadow = true;
    lidGroup.add(lidMesh);

    const totalLidThickness = lidThickness + 2 * lidBevel; // ~0.044

    // 8. Outer Lid Logo (GrowBroo Official Logo on top of closed lid: +Y)
    const logoCanvas = document.createElement("canvas");
    logoCanvas.width = 1024;
    logoCanvas.height = 1024;
    const lCtx = logoCanvas.getContext("2d")!;

    function renderLidLogo(img?: HTMLImageElement) {
      lCtx.clearRect(0, 0, 1024, 1024);

      // Radiant emerald glow backdrop
      const radGlow = lCtx.createRadialGradient(512, 512, 20, 512, 512, 450);
      radGlow.addColorStop(0, "rgba(57, 233, 0, 0.45)");
      radGlow.addColorStop(0.35, "rgba(57, 233, 0, 0.15)");
      radGlow.addColorStop(1, "rgba(57, 233, 0, 0)");
      lCtx.fillStyle = radGlow;
      lCtx.fillRect(0, 0, 1024, 1024);

      if (img && img.complete) {
        const aspect = img.width / img.height;
        const targetW = 660;
        const targetH = targetW / aspect;
        lCtx.drawImage(
          img,
          (1024 - targetW) / 2,
          (1024 - targetH) / 2,
          targetW,
          targetH
        );
      }
    }

    renderLidLogo();

    const logoTexture = new THREE.CanvasTexture(logoCanvas);
    const logoGeo = new THREE.PlaneGeometry(1.25, 1.25);
    logoGeo.rotateX(-Math.PI / 2); // Faces +Y (upward when closed)
    const logoMat = new THREE.MeshBasicMaterial({
      map: logoTexture,
      transparent: true,
      depthWrite: false,
    });
    const logoMesh = new THREE.Mesh(logoGeo, logoMat);
    logoMesh.position.set(0, totalLidThickness + 0.002, baseDepth / 2);
    lidGroup.add(logoMesh);

    // Load official GrowBroo light logo for outer lid
    const lidImg = new window.Image();
    lidImg.src = "/growbroo-logo-light.png";
    lidImg.onload = () => {
      renderLidLogo(lidImg);
      logoTexture.needsUpdate = true;
    };

    // 9. Retina Display Screen Canvas (High Resolution 2048 x 1360 matching Hero MacBook)
    const screenCanvas = document.createElement("canvas");
    screenCanvas.width = 2048;
    screenCanvas.height = 1360;
    const sCtx = screenCanvas.getContext("2d")!;

    function renderScreen(logoImg?: HTMLImageElement) {
      // Authentic Forest Green Wallpaper Gradient (matching Home Hero Laptop)
      const sGrad = sCtx.createRadialGradient(1024, 680, 100, 1024, 680, 1100);
      sGrad.addColorStop(0, "#0e2918");
      sGrad.addColorStop(0.6, "#0a1e12");
      sGrad.addColorStop(1, "#051109");
      sCtx.fillStyle = sGrad;
      sCtx.fillRect(0, 0, 2048, 1360);

      // Subtle atmospheric grid
      sCtx.strokeStyle = "rgba(57, 233, 0, 0.04)";
      sCtx.lineWidth = 1;
      for (let x = 0; x < 2048; x += 90) {
        sCtx.beginPath();
        sCtx.moveTo(x, 0);
        sCtx.lineTo(x, 1360);
        sCtx.stroke();
      }
      for (let y = 0; y < 1360; y += 90) {
        sCtx.beginPath();
        sCtx.moveTo(0, y);
        sCtx.lineTo(2048, y);
        sCtx.stroke();
      }

      // Top Status Bar (macOS / GrowBroo Studio Bar)
      sCtx.fillStyle = "rgba(7, 18, 11, 0.9)";
      sCtx.fillRect(0, 0, 2048, 76);
      sCtx.fillStyle = "#ffffff";
      sCtx.font = "bold 28px sans-serif";
      sCtx.textAlign = "left";
      sCtx.fillText("GROWBROO OS 2.0  •  SCALE YOUR BUSINESS ONLINE", 50, 48);

      // Status pill right
      sCtx.fillStyle = "rgba(57, 233, 0, 0.15)";
      sCtx.beginPath();
      sCtx.roundRect(1620, 15, 380, 46, 23);
      sCtx.fill();
      sCtx.strokeStyle = "#39E900";
      sCtx.lineWidth = 2;
      sCtx.stroke();

      sCtx.fillStyle = "#39E900";
      sCtx.beginPath();
      sCtx.arc(1650, 38, 7, 0, Math.PI * 2);
      sCtx.fill();

      sCtx.fillStyle = "#ffffff";
      sCtx.font = "bold 22px monospace";
      sCtx.fillText("STUDIO ENGINE 100%", 1675, 46);

      // Floating Cloud/Spheres Cluster (matching Home Page Hero Laptop)
      const spheres = [
        { x: 1024, y: 640, r: 120 },
        { x: 920, y: 620, r: 90 },
        { x: 1130, y: 630, r: 95 },
        { x: 840, y: 660, r: 75 },
        { x: 1210, y: 650, r: 70 },
        { x: 980, y: 560, r: 70 },
        { x: 1080, y: 550, r: 65 },
        { x: 960, y: 720, r: 60 },
        { x: 1090, y: 710, r: 55 },
      ];

      spheres.forEach((s) => {
        const sg = sCtx.createRadialGradient(
          s.x - s.r * 0.3,
          s.y - s.r * 0.3,
          s.r * 0.1,
          s.x,
          s.y,
          s.r
        );
        sg.addColorStop(0, "rgba(255, 255, 255, 0.95)");
        sg.addColorStop(0.6, "rgba(225, 240, 230, 0.75)");
        sg.addColorStop(1, "rgba(180, 210, 190, 0.1)");
        sCtx.fillStyle = sg;
        sCtx.beginPath();
        sCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        sCtx.fill();
      });

      // Prominent GrowBroo Logo in Center
      if (logoImg && logoImg.complete) {
        const targetW = 920;
        const aspect = logoImg.width / logoImg.height;
        const targetH = targetW / aspect;
        const lx = (2048 - targetW) / 2;
        const ly = 640 - targetH / 2;

        // Soft backlight glow behind logo
        const bgGlow = sCtx.createRadialGradient(1024, 640, 50, 1024, 640, 500);
        bgGlow.addColorStop(0, "rgba(57, 233, 0, 0.3)");
        bgGlow.addColorStop(1, "rgba(57, 233, 0, 0)");
        sCtx.fillStyle = bgGlow;
        sCtx.fillRect(0, 300, 2048, 700);

        sCtx.drawImage(logoImg, lx, ly, targetW, targetH);
      }

      // Feature Metric Cards at bottom
      const cards = [
        { label: "< 0.8s Load", sub: "Ultra-Fast Edge" },
        { label: "High Growth", sub: "Engineered to Scale" },
        { label: "100% Vitals", sub: "Production Grade" },
      ];

      cards.forEach((c, idx) => {
        const cx = 564 + idx * 460;
        const cy = 990;
        sCtx.fillStyle = "rgba(255, 255, 255, 0.05)";
        sCtx.beginPath();
        sCtx.roundRect(cx - 200, cy - 50, 400, 100, 20);
        sCtx.fill();
        sCtx.strokeStyle = "rgba(57, 233, 0, 0.35)";
        sCtx.lineWidth = 1.5;
        sCtx.stroke();

        sCtx.fillStyle = "#39E900";
        sCtx.font = "bold 34px sans-serif";
        sCtx.textAlign = "center";
        sCtx.fillText(c.label, cx, cy - 5);

        sCtx.fillStyle = "rgba(255, 255, 255, 0.7)";
        sCtx.font = "20px sans-serif";
        sCtx.fillText(c.sub, cx, cy + 30);
      });

      // Bottom Dock
      sCtx.fillStyle = "rgba(7, 16, 10, 0.88)";
      sCtx.beginPath();
      sCtx.roundRect(724, 1220, 600, 95, 32);
      sCtx.fill();
      sCtx.strokeStyle = "rgba(255, 255, 255, 0.12)";
      sCtx.lineWidth = 1.5;
      sCtx.stroke();

      const apps = ["#006B21", "#39E900", "#ffffff", "#22c55e", "#10b981"];
      apps.forEach((col, idx) => {
        sCtx.fillStyle = col;
        sCtx.beginPath();
        sCtx.roundRect(794 + idx * 105, 1240, 52, 52, 16);
        sCtx.fill();
      });
    }

    renderScreen();

    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    screenTexture.generateMipmaps = true;

    // Load official GrowBroo light logo for retina screen
    const scrImg = new window.Image();
    scrImg.src = "/growbroo-logo-light.png";
    scrImg.onload = () => {
      renderScreen(scrImg);
      screenTexture.needsUpdate = true;
    };

    // Display Bezel with Rounded Top Corners (matching 2nd screenshot!)
    const bezelShape = createRoundedRectShape(baseWidth - 0.10, baseDepth - 0.10, cornerRadius - 0.03);
    const bezelGeo = new THREE.ShapeGeometry(bezelShape);
    bezelGeo.rotateX(Math.PI / 2); // Faces -Y when closed, faces FORWARD when opened
    const bezelMat = new THREE.MeshBasicMaterial({ color: 0x0c0e10 });
    const bezelMesh = new THREE.Mesh(bezelGeo, bezelMat);
    bezelMesh.position.set(0, -0.001, baseDepth / 2);
    lidGroup.add(bezelMesh);

    // Inner Display Screen Plate: Faces DOWN toward keyboard when closed, faces FORWARD when opened
    const screenGeo = new THREE.PlaneGeometry(baseWidth - 0.22, baseDepth - 0.22);
    screenGeo.rotateX(Math.PI / 2); // Faces -Y when closed

    const screenMaterial = new THREE.MeshStandardMaterial({
      map: screenTexture,
      emissiveMap: screenTexture,
      emissive: 0xffffff,
      emissiveIntensity: 0.2, // Starts subtle, ramps to full OLED brightness on open
      roughness: 0.1,
      metalness: 0.05,
    });
    const screenMesh = new THREE.Mesh(screenGeo, screenMaterial);
    screenMesh.position.set(0, -0.002, baseDepth / 2);
    lidGroup.add(screenMesh);

    // Webcam Dot (centered at top bezel near front lip)
    const camDotGeo = new THREE.CircleGeometry(0.016, 16);
    camDotGeo.rotateX(Math.PI / 2);
    const camDotMat = new THREE.MeshBasicMaterial({ color: 0x39e900 });
    const camDotMesh = new THREE.Mesh(camDotGeo, camDotMat);
    camDotMesh.position.set(0, -0.003, baseDepth - 0.055);
    lidGroup.add(camDotMesh);

    // 10. Soft Studio Shadow on Desk (Directly under laptop chassis)
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 512;
    shadowCanvas.height = 512;
    const shCtx = shadowCanvas.getContext("2d")!;
    const shGrad = shCtx.createRadialGradient(256, 256, 30, 256, 256, 235);
    shGrad.addColorStop(0, "rgba(0, 0, 0, 0.45)");
    shGrad.addColorStop(0.4, "rgba(0, 0, 0, 0.18)");
    shGrad.addColorStop(0.85, "rgba(0, 0, 0, 0.03)");
    shGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    shCtx.fillStyle = shGrad;
    shCtx.fillRect(0, 0, 512, 512);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowPlaneGeo = new THREE.PlaneGeometry(5.4, 4.2);
    shadowPlaneGeo.rotateX(-Math.PI / 2);
    const shadowPlaneMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.82,
    });
    const shadowMesh = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowMesh.position.set(0, -0.002, 0.1);
    scene.add(shadowMesh);

    // Initial state: Lid is closed (rotation = 0)
    lidGroup.rotation.x = 0;

    // 11. Physics & Animation Setup
    // Opening angle: -106 degrees so front lip lifts UP and swings BACK toward hinge!
    const targetOpenAngle = -Math.PI * 0.59;
    const baseAngleY = -0.40; // 3/4 isometric perspective matching home page hero laptop
    const baseAngleX = 0.10;  // 3/4 isometric perspective pitch
    laptopGroup.rotation.y = baseAngleY;
    laptopGroup.rotation.x = baseAngleX;

    let openStartTime: number | null = null;
    let zoomStartTime: number | null = null;
    let isFinishedCalled = false;
    const initialCamPos = camera.position.clone();

    // Mouse Parallax for subtle interactive feel
    const targetRotation = { x: 0, y: 0 };
    const onMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      targetRotation.y = nx * 0.08;
      targetRotation.x = ny * 0.05;
    };
    window.addEventListener("mousemove", onMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      updateCameraDistance();
      initialCamPos.copy(camera.position);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    function animate() {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Idle state: Subtle breathing floating motion at 3/4 perspective
      if (stageRef.current === "closed") {
        laptopGroup.position.y = Math.sin(elapsed * 1.8) * 0.03;
        shadowMesh.scale.setScalar(1 - Math.sin(elapsed * 1.8) * 0.03);
        laptopGroup.rotation.y += (baseAngleY + targetRotation.y - laptopGroup.rotation.y) * 0.05;
        laptopGroup.rotation.x += (baseAngleX + targetRotation.x - laptopGroup.rotation.x) * 0.05;
      }

      // Opening state: Front lip lifts UP from front and rotates backward around hinge
      if (stageRef.current === "opening") {
        if (!openStartTime) openStartTime = performance.now();
        const duration = 1200; // 1.2s realistic opening
        const t = Math.min((performance.now() - openStartTime) / duration, 1);

        // Smooth cubic ease-out
        const ease = 1 - Math.pow(1 - t, 3);
        // Negative rotation: front lip goes UP (+Y) and BACK (-Z)!
        lidGroup.rotation.x = ease * targetOpenAngle;

        // Preserve 3/4 perspective matching home page hero laptop
        laptopGroup.rotation.y = THREE.MathUtils.lerp(baseAngleY, -0.34, ease);
        laptopGroup.rotation.x = THREE.MathUtils.lerp(baseAngleX, 0.08, ease);
        laptopGroup.position.y = THREE.MathUtils.lerp(laptopGroup.position.y, 0, ease);

        // Dynamic screen emissive ramp up & glow
        screenMaterial.emissiveIntensity = 0.06 + ease * 0.88;
        screenGlowLight.intensity = ease * 2.5;

        if (t >= 1) {
          setStage("open");
          // Hold open state so user can admire the opened laptop; clicks to enter or auto-advances after 20s
          setTimeout(() => {
            if (stageRef.current === "open") {
              setStage("zooming");
            }
          }, 20000);
        }
      }

      // Zooming state: Camera dives directly into the Retina screen
      if (stageRef.current === "zooming") {
        if (!zoomStartTime) zoomStartTime = performance.now();
        const zoomDuration = 850;
        const zt = Math.min((performance.now() - zoomStartTime) / zoomDuration, 1);
        const zEase = Math.pow(zt, 2.2);

        // Target: Center of Retina Display in 3/4 perspective
        const targetCamPos = new THREE.Vector3(Math.sin(-0.34) * 0.6, 1.22, -0.2);
        camera.position.lerpVectors(initialCamPos, targetCamPos, zEase);

        const initialLookAt = new THREE.Vector3(0, 0.65, 0);
        const targetLookAt = new THREE.Vector3(Math.sin(-0.34) * 0.3, 1.18, -0.85);
        camera.lookAt(new THREE.Vector3().lerpVectors(initialLookAt, targetLookAt, zEase));

        if (container) {
          container.style.opacity = `${1 - zEase * 1.05}`;
        }

        if (zt >= 1 && !isFinishedCalled) {
          isFinishedCalled = true;
          setStage("done");
          onFinish();
        }
      }

      renderer.render(scene, camera);
    }

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onFinish]);

  if (stage === "done") return null;

  return (
    <div
      ref={mountRef}
      onClick={handleOpen}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden cursor-pointer select-none transition-opacity duration-300 bg-[#F6FAF6]"
      style={{ touchAction: "manipulation" }}
      aria-label="Interactive 3D Laptop Experience"
    >
      {/* Top Branding */}
      <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex items-center justify-between pointer-events-none z-10">
        <Image
          src="/growbroo-logo.png"
          alt="GrowBroo - Scale Your Business Online"
          width={180}
          height={55}
          className="h-8 sm:h-9 w-auto object-contain"
          priority
        />
      </div>
    </div>
  );
}
