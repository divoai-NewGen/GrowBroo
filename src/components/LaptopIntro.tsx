"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
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

      // Elevated 3D studio perspective centered on the opened laptop height (Y = 0.65)
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
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 4. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    // Main Studio Key Light (soft directional from top right)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(4, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 20;
    keyLight.shadow.bias = -0.0008;
    scene.add(keyLight);

    // Fill Light (soft mint-tinted fill from top left)
    const fillLight = new THREE.DirectionalLight(0xe8f5e9, 1.2);
    fillLight.position.set(-5, 6, 4);
    scene.add(fillLight);

    // Rim Light (creates aluminum highlights along back edge)
    const rimLight = new THREE.DirectionalLight(0xffffff, 1.6);
    rimLight.position.set(0, 6, -5);
    scene.add(rimLight);

    // Screen Glow Light (illuminates keyboard deck when lid opens)
    const screenGlowLight = new THREE.PointLight(0x39e900, 0, 5);
    screenGlowLight.position.set(0, 1.3, -0.3);
    scene.add(screenGlowLight);

    // 5. Materials (Apple Space Gray Aluminum Finish)
    const spaceGrayMaterial = new THREE.MeshStandardMaterial({
      color: 0x484b4f,
      metalness: 0.82,
      roughness: 0.28,
    });

    const darkTrimMaterial = new THREE.MeshStandardMaterial({
      color: 0x16181a,
      metalness: 0.2,
      roughness: 0.8,
    });

    const keyCapMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e2023,
      metalness: 0.35,
      roughness: 0.6,
    });

    const trackpadMaterial = new THREE.MeshStandardMaterial({
      color: 0x36393d,
      metalness: 0.65,
      roughness: 0.35,
    });

    // 6. Laptop Base (Chassis)
    const laptopGroup = new THREE.Group();
    scene.add(laptopGroup);

    const baseWidth = 3.2;
    const baseHeight = 0.08;
    const baseDepth = 2.1;

    // Base body box
    const baseGeo = new THREE.BoxGeometry(baseWidth, baseHeight, baseDepth);
    const baseMesh = new THREE.Mesh(baseGeo, spaceGrayMaterial);
    baseMesh.position.set(0, baseHeight / 2, 0);
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    laptopGroup.add(baseMesh);

    // Front opening thumb notch (groove at front edge)
    const notchGeo = new THREE.BoxGeometry(0.55, 0.025, 0.03);
    const notchMat = new THREE.MeshBasicMaterial({ color: 0x181a1c });
    const notchMesh = new THREE.Mesh(notchGeo, notchMat);
    notchMesh.position.set(0, baseHeight - 0.012, baseDepth / 2 + 0.002);
    laptopGroup.add(notchMesh);

    // Keyboard Well (recessed matte black tray)
    const wellGeo = new THREE.BoxGeometry(2.8, 0.005, 1.25);
    const wellMesh = new THREE.Mesh(wellGeo, darkTrimMaterial);
    wellMesh.position.set(0, baseHeight + 0.001, -0.22);
    laptopGroup.add(wellMesh);

    // Chiclet Key deck
    const keyRows = 5;
    const keyCols = 14;
    const keyGroup = new THREE.Group();
    keyGroup.position.set(-1.26, baseHeight + 0.008, -0.76);

    for (let r = 0; r < keyRows; r++) {
      for (let c = 0; c < keyCols; c++) {
        const isSpacebar = r === 4 && c >= 4 && c <= 8;
        if (isSpacebar && c > 4) continue; // single wide spacebar

        const kw = isSpacebar ? 1.05 : 0.16;
        const kd = 0.16;
        const kGeo = new THREE.BoxGeometry(kw, 0.016, kd);
        const kMat = isSpacebar
          ? new THREE.MeshStandardMaterial({
              color: 0x223627,
              emissive: 0x39e900,
              emissiveIntensity: 0.22,
              roughness: 0.4,
            })
          : keyCapMaterial;

        const keyMesh = new THREE.Mesh(kGeo, kMat);
        keyMesh.position.set(
          isSpacebar ? c * 0.195 + 0.42 : c * 0.195,
          0,
          r * 0.245
        );
        keyGroup.add(keyMesh);
      }
    }
    laptopGroup.add(keyGroup);

    // Trackpad (centered in front half)
    const trackpadGeo = new THREE.BoxGeometry(1.05, 0.005, 0.58);
    const trackpadMesh = new THREE.Mesh(trackpadGeo, trackpadMaterial);
    trackpadMesh.position.set(0, baseHeight + 0.002, 0.62);
    laptopGroup.add(trackpadMesh);

    // 7. Hinge & Lid Assembly
    // Hinge is at the BACK edge: z = -baseDepth / 2, y = baseHeight
    const hingePivot = new THREE.Group();
    hingePivot.position.set(0, baseHeight, -baseDepth / 2);
    laptopGroup.add(hingePivot);

    // Hinge cylinder bar
    const hingeGeo = new THREE.CylinderGeometry(0.035, 0.035, 2.0, 16);
    hingeGeo.rotateZ(Math.PI / 2);
    const hingeMesh = new THREE.Mesh(hingeGeo, darkTrimMaterial);
    hingeMesh.position.set(0, 0, 0);
    hingePivot.add(hingeMesh);

    // Lid rotating group (anchored at hinge pivot 0, 0, 0)
    const lidGroup = new THREE.Group();
    hingePivot.add(lidGroup);

    // Lid Casing (aluminum outer shell)
    const lidThickness = 0.04;
    const lidBackGeo = new THREE.BoxGeometry(baseWidth, lidThickness, baseDepth);
    const lidBackMesh = new THREE.Mesh(lidBackGeo, spaceGrayMaterial);
    // Extends forward from hinge (0 to baseDepth)
    lidBackMesh.position.set(0, lidThickness / 2 + 0.008, baseDepth / 2);
    lidBackMesh.castShadow = true;
    lidGroup.add(lidBackMesh);

    // 8. Outer Lid Logo (Faces UP when closed: +Y)
    const logoCanvas = document.createElement("canvas");
    logoCanvas.width = 1024;
    logoCanvas.height = 1024;
    const lCtx = logoCanvas.getContext("2d")!;
    lCtx.clearRect(0, 0, 1024, 1024);

    // Radiant emerald glow backdrop
    const radGlow = lCtx.createRadialGradient(512, 512, 50, 512, 512, 420);
    radGlow.addColorStop(0, "rgba(57, 233, 0, 0.5)");
    radGlow.addColorStop(0.5, "rgba(57, 233, 0, 0.15)");
    radGlow.addColorStop(1, "rgba(57, 233, 0, 0)");
    lCtx.fillStyle = radGlow;
    lCtx.fillRect(0, 0, 1024, 1024);

    // Hexagon Emblem
    lCtx.save();
    lCtx.translate(512, 450);
    lCtx.fillStyle = "#006B21";
    lCtx.beginPath();
    lCtx.roundRect(-130, -130, 260, 260, 64);
    lCtx.fill();
    lCtx.lineWidth = 10;
    lCtx.strokeStyle = "#39E900";
    lCtx.stroke();

    lCtx.beginPath();
    const lr = 76;
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3;
      const x = lr * Math.cos(a);
      const y = lr * Math.sin(a);
      if (i === 0) lCtx.moveTo(x, y);
      else lCtx.lineTo(x, y);
    }
    lCtx.closePath();
    lCtx.fillStyle = "rgba(57, 233, 0, 0.45)";
    lCtx.fill();
    lCtx.lineWidth = 6;
    lCtx.stroke();
    lCtx.restore();

    // Wordmark
    lCtx.fillStyle = "#ffffff";
    lCtx.font = "bold 64px sans-serif";
    lCtx.textAlign = "center";
    lCtx.fillText("GrowBroo.", 512, 700);

    const logoTexture = new THREE.CanvasTexture(logoCanvas);
    const logoGeo = new THREE.PlaneGeometry(1.2, 1.2);
    logoGeo.rotateX(-Math.PI / 2); // Faces +Y (upward when closed)
    const logoMat = new THREE.MeshBasicMaterial({
      map: logoTexture,
      transparent: true,
      depthWrite: false,
    });
    const logoMesh = new THREE.Mesh(logoGeo, logoMat);
    // Placed right on the top outer face of the lid
    logoMesh.position.set(0, lidThickness + 0.01, baseDepth / 2);
    lidGroup.add(logoMesh);

    // 9. Retina Display Screen Canvas (High Resolution 2048 x 1360)
    const screenCanvas = document.createElement("canvas");
    screenCanvas.width = 2048;
    screenCanvas.height = 1360;
    const sCtx = screenCanvas.getContext("2d")!;

    function renderScreen() {
      // Sleek Dark Mode Background
      const sGrad = sCtx.createLinearGradient(0, 0, 2048, 1360);
      sGrad.addColorStop(0, "#080c09");
      sGrad.addColorStop(0.5, "#0d1710");
      sGrad.addColorStop(1, "#070c08");
      sCtx.fillStyle = sGrad;
      sCtx.fillRect(0, 0, 2048, 1360);

      // Subtle geometric grid
      sCtx.strokeStyle = "rgba(57, 233, 0, 0.06)";
      sCtx.lineWidth = 1;
      for (let x = 0; x < 2048; x += 80) {
        sCtx.beginPath();
        sCtx.moveTo(x, 0);
        sCtx.lineTo(x, 1360);
        sCtx.stroke();
      }
      for (let y = 0; y < 1360; y += 80) {
        sCtx.beginPath();
        sCtx.moveTo(0, y);
        sCtx.lineTo(2048, y);
        sCtx.stroke();
      }

      // Top Status Bar (macOS / Studio Bar)
      sCtx.fillStyle = "rgba(10, 15, 11, 0.9)";
      sCtx.fillRect(0, 0, 2048, 80);
      sCtx.fillStyle = "#ffffff";
      sCtx.font = "bold 32px sans-serif";
      sCtx.textAlign = "left";
      sCtx.fillText("GROWBROO OS 2.0  •  VERDANT DIGITAL", 50, 52);

      // Status pill right
      sCtx.fillStyle = "rgba(57, 233, 0, 0.15)";
      sCtx.beginPath();
      sCtx.roundRect(1620, 18, 380, 46, 23);
      sCtx.fill();
      sCtx.strokeStyle = "#39E900";
      sCtx.lineWidth = 2;
      sCtx.stroke();

      sCtx.fillStyle = "#39E900";
      sCtx.beginPath();
      sCtx.arc(1650, 41, 7, 0, Math.PI * 2);
      sCtx.fill();

      sCtx.fillStyle = "#ffffff";
      sCtx.font = "bold 24px monospace";
      sCtx.fillText("SYSTEM 100% OPERATIONAL", 1675, 49);

      // Hero Center Section: Hexagon Brand Icon
      sCtx.save();
      sCtx.translate(1024, 480);
      sCtx.fillStyle = "#006B21";
      sCtx.beginPath();
      sCtx.roundRect(-100, -100, 200, 200, 48);
      sCtx.fill();
      sCtx.lineWidth = 6;
      sCtx.strokeStyle = "#39E900";
      sCtx.stroke();

      sCtx.beginPath();
      const hr = 60;
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3;
        const x = hr * Math.cos(a);
        const y = hr * Math.sin(a);
        if (i === 0) sCtx.moveTo(x, y);
        else sCtx.lineTo(x, y);
      }
      sCtx.closePath();
      sCtx.fillStyle = "rgba(57, 233, 0, 0.4)";
      sCtx.fill();
      sCtx.lineWidth = 5;
      sCtx.stroke();
      sCtx.restore();

      // Main Headline
      sCtx.textAlign = "center";
      sCtx.fillStyle = "#ffffff";
      sCtx.font = "bold 82px sans-serif";
      sCtx.fillText("Verdant. Digital Studio", 1024, 720);

      sCtx.fillStyle = "#39E900";
      sCtx.font = "bold 38px sans-serif";
      sCtx.fillText("High-Growth Web Engineering & Digital Systems", 1024, 800);

      // Feature Metric Cards
      const cards = [
        { label: "< 0.8s Load", sub: "Ultra-Fast Edge" },
        { label: "Next.js 16", sub: "Turbopack Powered" },
        { label: "100% Vitals", sub: "Production Grade" },
      ];

      cards.forEach((c, idx) => {
        const cx = 564 + idx * 460;
        const cy = 930;
        sCtx.fillStyle = "rgba(255, 255, 255, 0.05)";
        sCtx.beginPath();
        sCtx.roundRect(cx - 200, cy - 60, 400, 120, 24);
        sCtx.fill();
        sCtx.strokeStyle = "rgba(57, 233, 0, 0.35)";
        sCtx.lineWidth = 2;
        sCtx.stroke();

        sCtx.fillStyle = "#39E900";
        sCtx.font = "bold 40px sans-serif";
        sCtx.fillText(c.label, cx, cy - 5);

        sCtx.fillStyle = "rgba(255, 255, 255, 0.65)";
        sCtx.font = "24px sans-serif";
        sCtx.fillText(c.sub, cx, cy + 35);
      });

      // Bottom Dock
      sCtx.fillStyle = "rgba(10, 14, 11, 0.85)";
      sCtx.beginPath();
      sCtx.roundRect(724, 1190, 600, 110, 36);
      sCtx.fill();
      sCtx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      sCtx.lineWidth = 2;
      sCtx.stroke();

      const apps = ["#006B21", "#39E900", "#ffffff", "#22c55e", "#10b981"];
      apps.forEach((col, idx) => {
        sCtx.fillStyle = col;
        sCtx.beginPath();
        sCtx.roundRect(794 + idx * 105, 1215, 60, 60, 18);
        sCtx.fill();
      });
    }

    renderScreen();

    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    screenTexture.generateMipmaps = true;

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
    // Placed slightly below the inner face of lid casing (facing down toward keyboard)
    screenMesh.position.set(0, 0.005, baseDepth / 2);
    lidGroup.add(screenMesh);

    // Inner Bezel (black frame around screen)
    const bezelGeo = new THREE.PlaneGeometry(baseWidth - 0.04, baseDepth - 0.04);
    bezelGeo.rotateX(Math.PI / 2);
    const bezelMat = new THREE.MeshBasicMaterial({ color: 0x0c0e10 });
    const bezelMesh = new THREE.Mesh(bezelGeo, bezelMat);
    bezelMesh.position.set(0, 0.006, baseDepth / 2);
    lidGroup.add(bezelMesh);

    // Webcam Dot (centered at top bezel near front lip)
    const camDotGeo = new THREE.CircleGeometry(0.016, 16);
    camDotGeo.rotateX(Math.PI / 2);
    const camDotMat = new THREE.MeshBasicMaterial({ color: 0x39e900 });
    const camDotMesh = new THREE.Mesh(camDotGeo, camDotMat);
    camDotMesh.position.set(0, 0.004, baseDepth - 0.06);
    lidGroup.add(camDotMesh);

    // 10. Soft Studio Shadow on Desk (Directly under laptop chassis)
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 512;
    shadowCanvas.height = 512;
    const shCtx = shadowCanvas.getContext("2d")!;
    const shGrad = shCtx.createRadialGradient(256, 256, 30, 256, 256, 235);
    shGrad.addColorStop(0, "rgba(0, 0, 0, 0.55)");
    shGrad.addColorStop(0.4, "rgba(0, 0, 0, 0.22)");
    shGrad.addColorStop(0.85, "rgba(0, 0, 0, 0.04)");
    shGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    shCtx.fillStyle = shGrad;
    shCtx.fillRect(0, 0, 512, 512);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowPlaneGeo = new THREE.PlaneGeometry(5.2, 4.0);
    shadowPlaneGeo.rotateX(-Math.PI / 2);
    const shadowPlaneMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.85,
    });
    const shadowMesh = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowMesh.position.set(0, -0.002, 0.1);
    scene.add(shadowMesh);

    // Initial state: Lid is closed (rotation = 0)
    lidGroup.rotation.x = 0;

    // 11. Physics & Animation Setup
    // Opening angle: -106 degrees so front lip lifts UP and swings BACK toward hinge!
    const targetOpenAngle = -Math.PI * 0.59;
    const baseAngleY = -0.25; // 3D perspective yaw
    const baseAngleX = 0.12;  // 3D perspective pitch
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

        // Smoothly square up the laptop to face camera directly as it opens
        laptopGroup.rotation.y = THREE.MathUtils.lerp(baseAngleY, 0, ease);
        laptopGroup.rotation.x = THREE.MathUtils.lerp(baseAngleX, 0.02, ease);
        laptopGroup.position.y = THREE.MathUtils.lerp(laptopGroup.position.y, 0, ease);

        // Dynamic screen emissive ramp up & glow
        screenMaterial.emissiveIntensity = 0.06 + ease * 0.55;
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

        // Target: Center of Retina Display (facing viewer)
        const targetCamPos = new THREE.Vector3(0, 1.25, -0.35);
        camera.position.lerpVectors(initialCamPos, targetCamPos, zEase);

        const initialLookAt = new THREE.Vector3(0, 0.65, 0);
        const targetLookAt = new THREE.Vector3(0, 1.18, -1.0);
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
      {/* Top Header Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#006B21] flex items-center justify-center text-white font-bold text-sm shadow-md shadow-[#006B21]/20">
            GB
          </div>
          <div>
            <span className="font-bold text-gray-900 tracking-tight block text-base sm:text-lg">
              GrowBroo<span className="text-[#39E900]">.</span>
            </span>
            <span className="text-xs uppercase tracking-widest text-gray-700 block font-semibold">
              Digital Studio
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleSkip();
          }}
          className="pointer-events-auto px-4 py-2 rounded-full bg-white/90 hover:bg-white text-gray-900 text-xs sm:text-sm font-semibold tracking-wide border border-gray-200/80 shadow-sm hover:shadow transition-all duration-200 flex items-center gap-2"
        >
          <span>SKIP INTRO</span>
          <span className="text-base leading-none">→</span>
        </button>
      </div>

      {/* Bottom Floating Interactive Call-To-Action */}
      <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 pointer-events-none text-center">
        {stage === "closed" && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleOpen();
              }}
              className="pointer-events-auto px-7 py-3.5 rounded-full bg-[#006B21] hover:bg-[#00551a] text-white text-sm sm:text-base font-bold shadow-xl shadow-[#006B21]/30 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-3 group"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#39E900] animate-pulse" />
              <span>CLICK TO OPEN LAPTOP</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <p className="text-xs sm:text-sm font-medium text-gray-700 drop-shadow-sm">
              Interactive 3D Showcase • Press Space or Click Anywhere
            </p>
          </>
        )}

        {stage === "opening" && (
          <div className="px-6 py-2.5 rounded-full bg-black/80 backdrop-blur-md text-white text-xs sm:text-sm font-semibold tracking-wide flex items-center gap-2 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[#39E900] animate-ping" />
            <span>OPENING RETINA DISPLAY...</span>
          </div>
        )}

        {(stage === "open" || stage === "zooming") && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleSkip();
            }}
            className="pointer-events-auto px-7 py-3 rounded-full bg-[#006B21] hover:bg-[#00551a] text-white text-xs sm:text-sm font-bold tracking-wide flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all"
          >
            <span className="w-2 h-2 rounded-full bg-[#39E900]" />
            <span>ENTER STUDIO NOW →</span>
          </button>
        )}
      </div>
    </div>
  );
}
