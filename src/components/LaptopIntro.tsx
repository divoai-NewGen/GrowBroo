"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import * as THREE from "three";

interface LaptopIntroProps {
  onFinish: () => void;
}

// 0: Closed, 1: Half-Open, 2: Full-Open, 3: Zooming to Home, 4: Done
type IntroStep = 0 | 1 | 2 | 3 | 4;

export default function LaptopIntro({ onFinish }: LaptopIntroProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<IntroStep>(0);
  const stepRef = useRef<IntroStep>(0);

  // Sync ref
  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  // Lock body scroll during intro
  useEffect(() => {
    if (step !== 4) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [step]);

  // Step advancement handlers
  const goToNextStep = useCallback(() => {
    const current = stepRef.current;
    if (current < 3) {
      const next = (current + 1) as IntroStep;
      setStep(next);
      stepRef.current = next;
    }
  }, []);

  const goToPrevStep = useCallback(() => {
    const current = stepRef.current;
    if (current > 0 && current < 3) {
      const prev = (current - 1) as IntroStep;
      setStep(prev);
      stepRef.current = prev;
    }
  }, []);

  const handleSkip = useCallback(() => {
    setStep(4);
    stepRef.current = 4;
    onFinish();
  }, [onFinish]);

  // Keyboard navigation: Space / Enter advances step, Esc skips
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        goToNextStep();
      } else if (e.key === "Escape") {
        handleSkip();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        goToPrevStep();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        goToNextStep();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNextStep, goToPrevStep, handleSkip]);

  // Wheel Scroll Handling with cooldown: 1 scroll tick = 1 step
  useEffect(() => {
    let lastScrollTime = 0;
    let scrollAcc = 0;

    const handleWheel = (e: WheelEvent) => {
      // Prevent browser bounce
      e.preventDefault();
      const now = performance.now();
      if (now - lastScrollTime < 450) return; // 450ms cooldown prevents skipping multiple steps

      scrollAcc += e.deltaY;
      if (scrollAcc > 25) {
        scrollAcc = 0;
        lastScrollTime = now;
        goToNextStep();
      } else if (scrollAcc < -25) {
        scrollAcc = 0;
        lastScrollTime = now;
        goToPrevStep();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [goToNextStep, goToPrevStep]);

  // Three.js Scene Setup & Animation
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#F6FAF6");

    // 2. Camera setup
    const fov = 34;
    const camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 100);

    const updateCameraDistance = () => {
      const aspect = width / height;
      const vFovRad = (fov * Math.PI) / 360;
      const targetWidth = 5.8;
      const targetHeight = 4.8;
      const distFromWidth = targetWidth / (2 * aspect * Math.tan(vFovRad));
      const distFromHeight = targetHeight / (2 * Math.tan(vFovRad));
      const dist = Math.max(distFromWidth, distFromHeight, 6.8);

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
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    container.appendChild(renderer.domElement);

    // 4. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.45);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(5, 9, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 20;
    keyLight.shadow.bias = -0.0008;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xf1f5f9, 1.3);
    fillLight.position.set(-6, 6, 4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.8);
    rimLight.position.set(2, 7, -6);
    scene.add(rimLight);

    // 5. Materials
    const appleSilverMaterial = new THREE.MeshStandardMaterial({
      color: 0xcdd1d5,
      metalness: 0.76,
      roughness: 0.36,
    });

    const darkTrimMaterial = new THREE.MeshStandardMaterial({
      color: 0x141618,
      metalness: 0.25,
      roughness: 0.85,
    });

    const keyMaterial = new THREE.MeshStandardMaterial({
      color: 0x18191b,
      metalness: 0.15,
      roughness: 0.78,
    });

    const trackpadMaterial = new THREE.MeshStandardMaterial({
      color: 0xb5b9be,
      metalness: 0.65,
      roughness: 0.45,
    });

    // Helper: Rounded Rectangle 2D Shape
    function createRoundedRectShape(w: number, h: number, r: number) {
      const shape = new THREE.Shape();
      const x0 = -w / 2;
      const y0 = -h / 2;
      shape.moveTo(x0 + r, y0);
      shape.lineTo(x0 + w - r, y0);
      shape.quadraticCurveTo(x0 + w, y0, x0 + w, y0 + r);
      shape.lineTo(x0 + w, y0 + h - r);
      shape.quadraticCurveTo(x0 + w, y0 + h, x0 + w - r, y0 + h);
      shape.lineTo(x0 + r, y0 + h);
      shape.quadraticCurveTo(x0, y0 + h, x0, y0 + h - r);
      shape.lineTo(x0, y0 + r);
      shape.quadraticCurveTo(x0, y0, x0 + r, y0);
      return shape;
    }

    // 6. Laptop Base Assembly
    const laptopGroup = new THREE.Group();
    scene.add(laptopGroup);

    const baseWidth = 3.2;
    const baseDepth = 2.4;
    const cornerRadius = 0.24;
    const baseThickness = 0.088;
    const bevel = 0.012;

    const baseShape = createRoundedRectShape(
      baseWidth - 2 * bevel,
      baseDepth - 2 * bevel,
      cornerRadius - bevel
    );
    const baseExtrudeSettings = {
      depth: baseThickness,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: bevel,
      bevelThickness: bevel,
    };
    const baseGeo = new THREE.ExtrudeGeometry(baseShape, baseExtrudeSettings);
    baseGeo.rotateX(-Math.PI / 2);
    baseGeo.translate(0, bevel, 0);

    const baseMesh = new THREE.Mesh(baseGeo, appleSilverMaterial);
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    laptopGroup.add(baseMesh);

    const totalBaseHeight = baseThickness + 2 * bevel;

    // Keyboard Well
    const kbWidth = 2.56;
    const kbDepth = 1.08;
    const kbWellShape = createRoundedRectShape(kbWidth, kbDepth, 0.06);
    const kbWellGeo = new THREE.ShapeGeometry(kbWellShape);
    kbWellGeo.rotateX(-Math.PI / 2);
    const kbWellMesh = new THREE.Mesh(kbWellGeo, darkTrimMaterial);
    kbWellMesh.position.set(0, totalBaseHeight + 0.0005, -0.42);
    laptopGroup.add(kbWellMesh);

    // Keyboard Key Grid
    const keyRows = 5;
    const keyCols = 14;
    const keyGap = 0.016;
    const keyH = 0.014;
    const totalKeyAreaW = kbWidth - 0.08;
    const totalKeyAreaD = kbDepth - 0.08;
    const individualKeyW = (totalKeyAreaW - (keyCols - 1) * keyGap) / keyCols;
    const individualKeyD = (totalKeyAreaD - (keyRows - 1) * keyGap) / keyRows;

    const keyInstances = new THREE.InstancedMesh(
      new THREE.BoxGeometry(individualKeyW, keyH, individualKeyD),
      keyMaterial,
      keyRows * keyCols
    );
    keyInstances.castShadow = true;

    const dummy = new THREE.Object3D();
    let keyIdx = 0;
    const startX = -totalKeyAreaW / 2 + individualKeyW / 2;
    const startZ = -0.42 - totalKeyAreaD / 2 + individualKeyD / 2;

    for (let r = 0; r < keyRows; r++) {
      for (let c = 0; c < keyCols; c++) {
        const kx = startX + c * (individualKeyW + keyGap);
        const kz = startZ + r * (individualKeyD + keyGap);
        const ky = totalBaseHeight + keyH / 2 + 0.001;

        if (r === keyRows - 1 && c >= 4 && c <= 9) {
          dummy.position.set(0, -999, 0);
        } else {
          dummy.position.set(kx, ky, kz);
        }
        dummy.updateMatrix();
        keyInstances.setMatrixAt(keyIdx++, dummy.matrix);
      }
    }
    laptopGroup.add(keyInstances);

    // Spacebar Key
    const spacebarW = individualKeyW * 6 + keyGap * 5;
    const spacebarGeo = new THREE.BoxGeometry(spacebarW, keyH, individualKeyD);
    const spacebarMesh = new THREE.Mesh(spacebarGeo, keyMaterial);
    spacebarMesh.position.set(
      0,
      totalBaseHeight + keyH / 2 + 0.001,
      startZ + (keyRows - 1) * (individualKeyD + keyGap)
    );
    spacebarMesh.castShadow = true;
    laptopGroup.add(spacebarMesh);

    // Trackpad
    const tpWidth = 1.05;
    const tpDepth = 0.68;
    const tpRadius = 0.04;

    const tpGrooveShape = createRoundedRectShape(tpWidth + 0.012, tpDepth + 0.012, tpRadius + 0.006);
    const tpGrooveGeo = new THREE.ShapeGeometry(tpGrooveShape);
    tpGrooveGeo.rotateX(-Math.PI / 2);
    const tpGrooveMesh = new THREE.Mesh(tpGrooveGeo, darkTrimMaterial);
    tpGrooveMesh.position.set(0, totalBaseHeight + 0.0008, 0.60);
    laptopGroup.add(tpGrooveMesh);

    const tpShape = createRoundedRectShape(tpWidth, tpDepth, tpRadius);
    const tpGeo = new THREE.ShapeGeometry(tpShape);
    tpGeo.rotateX(-Math.PI / 2);
    const trackpadMesh = new THREE.Mesh(tpGeo, trackpadMaterial);
    trackpadMesh.position.set(0, totalBaseHeight + 0.0015, 0.60);
    laptopGroup.add(trackpadMesh);

    // 7. Hinge & Lid Assembly
    const hingePivot = new THREE.Group();
    hingePivot.position.set(0, totalBaseHeight, -baseDepth / 2);
    laptopGroup.add(hingePivot);

    const hingeGeo = new THREE.CylinderGeometry(0.035, 0.035, 2.1, 16);
    hingeGeo.rotateZ(Math.PI / 2);
    const hingeMesh = new THREE.Mesh(hingeGeo, darkTrimMaterial);
    hingeMesh.position.set(0, 0, 0);
    hingePivot.add(hingeMesh);

    const lidGroup = new THREE.Group();
    hingePivot.add(lidGroup);

    // Lid Casing
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

    const totalLidThickness = lidThickness + 2 * lidBevel;

    // 8. Outer Lid Logo (GrowBroo Official Logo on top of closed lid)
    const logoCanvas = document.createElement("canvas");
    logoCanvas.width = 1024;
    logoCanvas.height = 1024;
    const lCtx = logoCanvas.getContext("2d")!;

    function renderLidLogo(img?: HTMLImageElement) {
      lCtx.clearRect(0, 0, 1024, 1024);
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
    logoGeo.rotateX(-Math.PI / 2);
    const logoMat = new THREE.MeshBasicMaterial({
      map: logoTexture,
      transparent: true,
      depthWrite: false,
    });
    const logoMesh = new THREE.Mesh(logoGeo, logoMat);
    logoMesh.position.set(0, totalLidThickness + 0.002, baseDepth / 2);
    lidGroup.add(logoMesh);

    const lidImg = new window.Image();
    lidImg.src = "/growbroo-logo-light.png";
    lidImg.onload = () => {
      renderLidLogo(lidImg);
      logoTexture.needsUpdate = true;
    };

    // 9. Retina Display Screen Canvas with Animated Brand Reveal
    const screenCanvas = document.createElement("canvas");
    screenCanvas.width = 2048;
    screenCanvas.height = 1360;
    const sCtx = screenCanvas.getContext("2d")!;

    let scrImg: HTMLImageElement | null = null;
    let logoAnimStartTime: number | null = null;

    function renderScreenFrame(progress: number, elapsedMs: number = 0) {
      // 1. Deep forest green chalkboard wallpaper
      const sGrad = sCtx.createRadialGradient(1024, 680, 50, 1024, 680, 1200);
      sGrad.addColorStop(0, "#0e3a20");
      sGrad.addColorStop(0.5, "#0a2a17");
      sGrad.addColorStop(1, "#05180d");
      sCtx.fillStyle = sGrad;
      sCtx.fillRect(0, 0, 2048, 1360);

      // Fine atmospheric grid texture
      sCtx.strokeStyle = "rgba(57, 233, 0, 0.02)";
      sCtx.lineWidth = 1;
      for (let x = 0; x < 2048; x += 120) {
        sCtx.beginPath();
        sCtx.moveTo(x, 0);
        sCtx.lineTo(x, 1360);
        sCtx.stroke();
      }
      for (let y = 0; y < 1360; y += 120) {
        sCtx.beginPath();
        sCtx.moveTo(0, y);
        sCtx.lineTo(2048, y);
        sCtx.stroke();
      }

      if (!scrImg || !scrImg.complete) return;

      // Significantly larger brand size: 1360px wide (was 920px)
      const targetW = 1360;
      const aspect = scrImg.width / scrImg.height;
      const targetH = targetW / aspect;
      const lx = (2048 - targetW) / 2;
      const ly = (1360 - targetH) / 2 - 24;

      // When closed or before full-open trigger:
      if (progress <= 0) return;

      // 2. Animated Ambient Energy Aura in center
      const breathe = Math.sin(elapsedMs * 0.003) * 0.04;
      const glowScale = Math.min(progress / 0.4, 1) + breathe;
      const bgGlow = sCtx.createRadialGradient(1024, 680, 20, 1024, 680, 680 * Math.max(glowScale, 0.2));
      bgGlow.addColorStop(0, "rgba(57, 233, 0, 0.35)");
      bgGlow.addColorStop(0.4, "rgba(57, 233, 0, 0.16)");
      bgGlow.addColorStop(0.75, "rgba(57, 233, 0, 0.04)");
      bgGlow.addColorStop(1, "rgba(57, 233, 0, 0)");
      sCtx.fillStyle = bgGlow;
      sCtx.fillRect(0, 0, 2048, 1360);

      // Subtle ambient glowing particles around the logo
      const numParticles = 8;
      for (let i = 0; i < numParticles; i++) {
        const pAngle = (i / numParticles) * Math.PI * 2 + elapsedMs * 0.0008;
        const pDist = 380 + Math.sin(elapsedMs * 0.002 + i) * 60;
        const px = 1024 + Math.cos(pAngle) * pDist;
        const py = 680 + Math.sin(pAngle) * (pDist * 0.5);
        const pAlpha = (0.2 + 0.15 * Math.sin(elapsedMs * 0.003 + i)) * Math.min(progress * 2, 1);

        const pGrad = sCtx.createRadialGradient(px, py, 1, px, py, 18);
        pGrad.addColorStop(0, `rgba(180, 255, 160, ${pAlpha})`);
        pGrad.addColorStop(0.4, `rgba(57, 233, 0, ${pAlpha * 0.6})`);
        pGrad.addColorStop(1, "rgba(57, 233, 0, 0)");
        sCtx.fillStyle = pGrad;
        sCtx.beginPath();
        sCtx.arc(px, py, 18, 0, Math.PI * 2);
        sCtx.fill();
      }

      // 3. Cinematic Laser-Writing Wipe Reveal
      const wipe = Math.min(Math.max((progress - 0.05) / 0.70, 0), 1);
      const smoothWipe = wipe * wipe * (3 - 2 * wipe);

      // Spring-like scale pop
      const popScale = 0.95 + 0.05 * Math.sin(smoothWipe * Math.PI * 0.5);

      sCtx.save();
      // Clip to revealed portion
      const clipWidth = lx + targetW * smoothWipe;
      sCtx.beginPath();
      sCtx.rect(0, 0, clipWidth, 1360);
      sCtx.clip();

      // Draw Logo
      sCtx.save();
      sCtx.translate(1024, ly + targetH / 2);
      sCtx.scale(popScale, popScale);
      sCtx.translate(-1024, -(ly + targetH / 2));
      sCtx.globalAlpha = Math.min(progress * 2.5, 1);
      sCtx.drawImage(scrImg, lx, ly, targetW, targetH);
      sCtx.restore();

      sCtx.restore();

      // 4. Snake Enters Screen & Slithers Left-to-Right Writing Company Name
      const headX = lx + targetW * smoothWipe;
      const centerY = ly + targetH / 2;
      const waveFreq = 16;
      const waveAmp = 22;
      const headY = centerY + Math.sin(smoothWipe * waveFreq) * waveAmp;

      // Screen entry ripple effect on the left side where the 3D snake plunges in
      if (smoothWipe < 0.22) {
        const rippleScale = smoothWipe / 0.22;
        const rippleRadius = rippleScale * 140;
        const rippleAlpha = (1 - rippleScale) * 0.9;

        // Outer green shockwave ring
        sCtx.strokeStyle = `rgba(57, 233, 0, ${rippleAlpha})`;
        sCtx.lineWidth = 4;
        sCtx.beginPath();
        sCtx.arc(lx, centerY, rippleRadius, 0, Math.PI * 2);
        sCtx.stroke();

        // Inner glowing core
        const entryGlow = sCtx.createRadialGradient(lx, centerY, 2, lx, centerY, 50 * rippleScale);
        entryGlow.addColorStop(0, `rgba(255, 255, 255, ${rippleAlpha})`);
        entryGlow.addColorStop(0.4, `rgba(76, 255, 20, ${rippleAlpha * 0.8})`);
        entryGlow.addColorStop(1, "rgba(57, 233, 0, 0)");
        sCtx.fillStyle = entryGlow;
        sCtx.beginPath();
        sCtx.arc(lx, centerY, 50 * rippleScale, 0, Math.PI * 2);
        sCtx.fill();
      }

      // The 2D Neon Energy Snake slithering across screen from left to right writing company name
      if (smoothWipe > 0.01 && smoothWipe < 0.99) {
        const NUM_SNAKE_SEGS = 20;

        // Draw snake body undulating from tail to head
        for (let i = NUM_SNAKE_SEGS - 1; i >= 0; i--) {
          const segRatio = i / (NUM_SNAKE_SEGS - 1);
          const segX = headX - segRatio * 190;
          if (segX < lx - 60) continue;

          const segWave = Math.sin((smoothWipe - segRatio * 0.16) * waveFreq) * waveAmp;
          const segY = centerY + segWave;
          const segRadius = (1 - Math.pow(segRatio, 1.4) * 0.75) * 22;

          const segGrad = sCtx.createRadialGradient(segX, segY, 1, segX, segY, segRadius);
          if (i === 0) {
            // Radiant Lime Head
            segGrad.addColorStop(0, "rgba(255, 255, 255, 1)");
            segGrad.addColorStop(0.3, "rgba(120, 255, 60, 0.95)");
            segGrad.addColorStop(0.7, "rgba(57, 233, 0, 0.85)");
            segGrad.addColorStop(1, "rgba(57, 233, 0, 0)");
          } else {
            // Emerald Body
            const bodyAlpha = (1 - segRatio) * 0.88;
            segGrad.addColorStop(0, `rgba(90, 255, 50, ${bodyAlpha})`);
            segGrad.addColorStop(0.5, `rgba(57, 233, 0, ${bodyAlpha * 0.75})`);
            segGrad.addColorStop(1, "rgba(57, 233, 0, 0)");
          }

          sCtx.fillStyle = segGrad;
          sCtx.beginPath();
          sCtx.arc(segX, segY, segRadius, 0, Math.PI * 2);
          sCtx.fill();
        }

        // Head glowing halo flare
        const headFlare = sCtx.createRadialGradient(headX, headY, 2, headX, headY, 65);
        headFlare.addColorStop(0, "rgba(255, 255, 255, 1)");
        headFlare.addColorStop(0.3, "rgba(76, 255, 20, 0.85)");
        headFlare.addColorStop(0.7, "rgba(57, 233, 0, 0.4)");
        headFlare.addColorStop(1, "rgba(57, 233, 0, 0)");
        sCtx.fillStyle = headFlare;
        sCtx.beginPath();
        sCtx.arc(headX, headY, 65, 0, Math.PI * 2);
        sCtx.fill();

        // Electric sparks writing and illuminating letters as snake moves
        for (let s = 0; s < 5; s++) {
          const spX = headX - 10 + Math.cos(elapsedMs * 0.04 + s) * 22;
          const spY = headY + Math.sin(elapsedMs * 0.04 + s) * 26;
          sCtx.fillStyle = "#ffffff";
          sCtx.beginPath();
          sCtx.arc(spX, spY, 3, 0, Math.PI * 2);
          sCtx.fill();
        }
      }

      // 5. Specular Sheen / Glass Light Glint sweep (runs from progress 0.65 to 1.0)
      const sheenStart = 0.65;
      if (progress >= sheenStart) {
        const sheenProgress = Math.min((progress - sheenStart) / 0.35, 1);
        const sheenX = lx - 100 + (targetW + 300) * sheenProgress;

        sCtx.save();
        sCtx.beginPath();
        sCtx.rect(lx, ly, targetW, targetH);
        sCtx.clip();

        const sheenGrad = sCtx.createLinearGradient(sheenX - 60, ly, sheenX + 60, ly + targetH);
        sheenGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
        sheenGrad.addColorStop(0.4, "rgba(255, 255, 255, 0.15)");
        sheenGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.45)");
        sheenGrad.addColorStop(0.6, "rgba(255, 255, 255, 0.15)");
        sheenGrad.addColorStop(1, "rgba(255, 255, 255, 0)");

        sCtx.fillStyle = sheenGrad;
        sCtx.fillRect(sheenX - 120, ly - 20, 240, targetH + 40);
        sCtx.restore();
      }

      // 6. High-Tech Emerald Energy Underline (progress 0.5 -> 1.0)
      if (progress >= 0.5) {
        const lineProgress = Math.min((progress - 0.5) / 0.45, 1);
        const smoothLine = lineProgress * lineProgress * (3 - 2 * lineProgress);
        const lineHalfW = (targetW * 0.42) * smoothLine;
        const lineY = ly + targetH + 32;

        const lineGrad = sCtx.createLinearGradient(1024 - lineHalfW, lineY, 1024 + lineHalfW, lineY);
        lineGrad.addColorStop(0, "rgba(57, 233, 0, 0)");
        lineGrad.addColorStop(0.2, "rgba(57, 233, 0, 0.5)");
        lineGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.95)");
        lineGrad.addColorStop(0.8, "rgba(57, 233, 0, 0.5)");
        lineGrad.addColorStop(1, "rgba(57, 233, 0, 0)");

        sCtx.strokeStyle = lineGrad;
        sCtx.lineWidth = 3;
        sCtx.beginPath();
        sCtx.moveTo(1024 - lineHalfW, lineY);
        sCtx.lineTo(1024 + lineHalfW, lineY);
        sCtx.stroke();

        sCtx.fillStyle = "#39e900";
        sCtx.beginPath();
        sCtx.arc(1024 - lineHalfW, lineY, 2.5, 0, Math.PI * 2);
        sCtx.arc(1024 + lineHalfW, lineY, 2.5, 0, Math.PI * 2);
        sCtx.fill();
      }

      // 7. Full Reveal Completed State
      if (progress >= 1) {
        sCtx.globalAlpha = 1;
        sCtx.drawImage(scrImg, lx, ly, targetW, targetH);
      }
    }

    renderScreenFrame(0, 0);

    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    screenTexture.generateMipmaps = true;

    scrImg = new window.Image();
    scrImg.src = "/growbroo-logo-light.png";
    scrImg.onload = () => {
      // If already at or past full open, render
      if (stepRef.current >= 2) {
        renderScreenFrame(1, 2000);
      } else {
        renderScreenFrame(0, 0);
      }
      screenTexture.needsUpdate = true;
    };

    // Edge-to-Edge Black Bezel Glass (Authentic MacBook Pro bezel)
    const bezelShape = createRoundedRectShape(baseWidth, baseDepth, cornerRadius);
    const bezelGeo = new THREE.ShapeGeometry(bezelShape);
    bezelGeo.rotateX(Math.PI / 2);
    const bezelMat = new THREE.MeshBasicMaterial({ color: 0x070809 });
    const bezelMesh = new THREE.Mesh(bezelGeo, bezelMat);
    bezelMesh.position.set(0, -0.001, baseDepth / 2);
    lidGroup.add(bezelMesh);

    // Inner Display Screen Plate
    const screenGeo = new THREE.PlaneGeometry(baseWidth - 0.16, baseDepth - 0.16);
    screenGeo.rotateX(Math.PI / 2);

    const screenMaterial = new THREE.MeshBasicMaterial({
      map: screenTexture,
    });
    const screenMesh = new THREE.Mesh(screenGeo, screenMaterial);
    screenMesh.position.set(0, -0.002, baseDepth / 2);
    lidGroup.add(screenMesh);

    // Discreet Webcam Lens Dot
    const camDotGeo = new THREE.CircleGeometry(0.012, 16);
    camDotGeo.rotateX(Math.PI / 2);
    const camDotMat = new THREE.MeshBasicMaterial({ color: 0x181c22 });
    const camDotMesh = new THREE.Mesh(camDotGeo, camDotMat);
    camDotMesh.position.set(0, -0.003, baseDepth - 0.04);
    lidGroup.add(camDotMesh);

    // 10. Desk Studio Shadow
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

    // Initial state: Lid is closed
    lidGroup.rotation.x = 0;

    // 11. Interactive 360° Drag Rotation Setup
    // User can click and drag to rotate the laptop freely 360 degrees in 3D!
    let isDragging = false;
    let dragDist = 0;
    let lastPointerPos = { x: 0, y: 0 };
    let pointerDownTime = 0;

    let targetRotY = 0;      // Infinite 360° horizontal rotation
    let targetRotX = 0.08;   // Vertical pitch tilt
    let currentRotY = 0;
    let currentRotX = 0.08;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      dragDist = 0;
      lastPointerPos = { x: e.clientX, y: e.clientY };
      pointerDownTime = performance.now();
      container.style.cursor = "grabbing";
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - lastPointerPos.x;
      const dy = e.clientY - lastPointerPos.y;
      dragDist += Math.hypot(dx, dy);

      // Full 360° rotation sensitivity
      targetRotY += dx * 0.0085;
      // Clamped vertical pitch so it doesn't flip upside down
      targetRotX = Math.max(-0.35, Math.min(0.65, targetRotX + dy * 0.006));

      lastPointerPos = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = () => {
      if (!isDragging) return;
      isDragging = false;
      container.style.cursor = "grab";

      // If drag distance was small and fast, treat as a click to advance step!
      if (dragDist < 8 && performance.now() - pointerDownTime < 320) {
        goToNextStep();
      }
    };

    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    // Resize Handler
    const initialCamPos = camera.position.clone();
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

    // 12. 3D Volumetric Glowing Energy Snake Assembly (Whips from behind laptop and strikes screen)
    const snakeGroup = new THREE.Group();
    laptopGroup.add(snakeGroup);

    // 3D Path: starts deep behind laptop hinge, loops wide around left, arcs over top-left, curves down, and dives directly into the LEFT EDGE of the screen!
    const snakeCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.6, 0.3, -2.4),    // deep behind laptop base/lid
      new THREE.Vector3(-2.4, 1.0, -1.8),    // swooping out from behind left
      new THREE.Vector3(-2.8, 2.0, -0.6),    // rising along left edge of screen
      new THREE.Vector3(-1.8, 3.1, 0.4),     // high arc over top-left of screen
      new THREE.Vector3(0.3, 2.7, 0.7),      // slithering across front-top
      new THREE.Vector3(1.3, 2.0, 0.45),     // looping down front-right
      new THREE.Vector3(0.4, 1.4, 0.2),      // swooping back left towards screen left edge
      new THREE.Vector3(-0.95, 1.25, -0.06), // DIRECT ENTRY into the LEFT side of the screen!
    ]);

    // Volumetric glowing body: 36 overlapping luminous spheres matching GrowBroo green theme
    const SNAKE_BALLS = 36;
    const snakeBalls: THREE.Mesh[] = [];
    const snakeBallGroup = new THREE.Group();
    snakeGroup.add(snakeBallGroup);

    const ballGeo = new THREE.SphereGeometry(1, 12, 12);
    for (let i = 0; i < SNAKE_BALLS; i++) {
      const ballMat = new THREE.MeshBasicMaterial({
        color: 0x39e900,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
      });
      const bMesh = new THREE.Mesh(ballGeo, ballMat);
      snakeBallGroup.add(bMesh);
      snakeBalls.push(bMesh);
    }

    // Glowing head halo matching GrowBroo brand green
    const haloGeo = new THREE.SphereGeometry(1, 16, 16);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x39e900,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const snakeHalo = new THREE.Mesh(haloGeo, haloMat);
    snakeGroup.add(snakeHalo);

    // Dynamic light cast by snake onto laptop chassis & screen
    const snakeLight = new THREE.PointLight(0x39e900, 0, 5.5);
    snakeGroup.add(snakeLight);

    // Sparks trailing behind snake
    const NUM_SPARKS = 22;
    const sparksPositions = new Float32Array(NUM_SPARKS * 3);
    const sparksGeo = new THREE.BufferGeometry();
    sparksGeo.setAttribute("position", new THREE.BufferAttribute(sparksPositions, 3));
    const sparksMat = new THREE.PointsMaterial({
      color: 0x39e900,
      size: 0.055,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
    });
    const sparksMesh = new THREE.Points(sparksGeo, sparksMat);
    snakeGroup.add(sparksMesh);

    snakeGroup.visible = false;

    // Web Audio API Sound Synthesizer (Zero external file dependencies)
    let audioCtx: AudioContext | null = null;
    function getAudioContext() {
      if (typeof window === "undefined") return null;
      if (!audioCtx) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
          audioCtx = new AudioContextClass();
        }
      }
      if (audioCtx && audioCtx.state === "suspended") {
        audioCtx.resume().catch(() => {});
      }
      return audioCtx;
    }

    function playSnakeWhoosh(durationMs = 2600) {
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;
        const dur = durationMs / 1000;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = "sine";
        osc.frequency.setValueAtTime(240, now);
        osc.frequency.exponentialRampToValueAtTime(560, now + dur * 0.45);
        osc.frequency.exponentialRampToValueAtTime(340, now + dur * 0.95);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(900, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.06, now + dur * 0.25);
        gain.gain.linearRampToValueAtTime(0.08, now + dur * 0.55);
        gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + dur + 0.1);
      } catch {}
    }

    function playScreenImpact() {
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;

        // Sub bass impact resonance
        const subOsc = ctx.createOscillator();
        const subGain = ctx.createGain();
        subOsc.type = "sine";
        subOsc.frequency.setValueAtTime(140, now);
        subOsc.frequency.exponentialRampToValueAtTime(45, now + 0.65);

        subGain.gain.setValueAtTime(0.12, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

        subOsc.connect(subGain);
        subGain.connect(ctx.destination);
        subOsc.start(now);
        subOsc.stop(now + 0.75);

        // Harmonic chime chord on logo reveal
        const freqs = [523.25, 659.25, 783.99, 1046.50];
        freqs.forEach((f, idx) => {
          const cOsc = ctx.createOscillator();
          const cGain = ctx.createGain();
          cOsc.type = "triangle";
          cOsc.frequency.setValueAtTime(f, now + idx * 0.08);

          cGain.gain.setValueAtTime(0.001, now + idx * 0.08);
          cGain.gain.linearRampToValueAtTime(0.045, now + idx * 0.08 + 0.02);
          cGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.85);

          cOsc.connect(cGain);
          cGain.connect(ctx.destination);
          cOsc.start(now + idx * 0.08);
          cOsc.stop(now + idx * 0.08 + 0.9);
        });
      } catch {}
    }

    // 13. Animation Loop & Multi-step Interpolation
    let animId: number;
    const clock = new THREE.Clock();

    const maxFullOpenAngle = -Math.PI * 0.59; // ~106° full open
    const halfOpenAngle = -Math.PI * 0.28;    // ~50° half open
    let currentLidAngle = 0;

    let zoomStartTime: number | null = null;
    let isFinishedCalled = false;
    let isSnakeSoundPlayed = false;
    let isImpactSoundPlayed = false;

    function animate() {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const currentStep = stepRef.current;

      // 1. Calculate target lid angle based on step
      let targetLidAngle = 0;
      if (currentStep === 1) {
        targetLidAngle = halfOpenAngle;
      } else if (currentStep >= 2) {
        targetLidAngle = maxFullOpenAngle;
      }

      // Smooth lid rotation with spring-like cubic lerp
      currentLidAngle += (targetLidAngle - currentLidAngle) * 0.075;
      lidGroup.rotation.x = currentLidAngle;

      // 2. 360° Cursor Rotation Smoothing
      currentRotY += (targetRotY - currentRotY) * 0.12;
      currentRotX += (targetRotX - currentRotX) * 0.12;

      // Subtle breathing float when not dragging
      const floatY = !isDragging ? Math.sin(elapsed * 1.8) * 0.025 : 0;
      laptopGroup.position.y = floatY;
      shadowMesh.scale.setScalar(1 - floatY * 0.8);

      laptopGroup.rotation.y = currentRotY;
      laptopGroup.rotation.x = currentRotX;

      // 3. 3D Snake Slither & Screen Writing Animation
      if (currentStep >= 2) {
        if (!logoAnimStartTime) {
          logoAnimStartTime = performance.now();
        }
        const animElapsed = performance.now() - logoAnimStartTime;

        // Smooth, slower, majestic flight (2600ms flight time matching GrowBroo theme)
        const snakeDelay = 400;
        const snakeDuration = 2600;
        const snakeElapsed = animElapsed - snakeDelay;

        if (snakeElapsed < 0) {
          // Lid is opening, screen is waiting clean
          snakeGroup.visible = false;
          renderScreenFrame(0, animElapsed);
          screenTexture.needsUpdate = true;
        } else if (snakeElapsed < snakeDuration) {
          // Play whoosh sound once
          if (!isSnakeSoundPlayed) {
            isSnakeSoundPlayed = true;
            playSnakeWhoosh(snakeDuration);
          }

          // Snake is slithering in 3D around the opened laptop!
          snakeGroup.visible = true;
          const snakeProgress = snakeElapsed / snakeDuration;
          const headU = Math.min(Math.pow(snakeProgress, 1.05), 1);

          // Update each volumetric ball along the snake body in GrowBroo green palette
          for (let i = 0; i < SNAKE_BALLS; i++) {
            const segRatio = i / (SNAKE_BALLS - 1);
            const u = Math.max(0, headU - segRatio * 0.35);
            const pt = snakeCurve.getPointAt(Math.max(0, Math.min(u, 1)));
            const b = snakeBalls[i];
            b.position.copy(pt);

            // Taper radius: Head is 0.085, body is 0.07, tail tapers to 0.015
            const size = (1 - Math.pow(segRatio, 1.4) * 0.82) * 0.085;
            b.scale.setScalar(size);

            const mat = b.material as THREE.MeshBasicMaterial;
            if (i === 0) {
              mat.color.setHex(0x4cff14); // radiant GrowBroo lime-green core
            } else if (i < 12) {
              mat.color.setHex(0x39e900); // official GrowBroo green
            } else if (i < 24) {
              mat.color.setHex(0x28ba00); // deep emerald
            } else {
              mat.color.setHex(0x136a00); // forest green tail
            }
            mat.opacity = (1 - segRatio) * 0.95;
          }

          // Head position & halo
          const headPos = snakeCurve.getPointAt(Math.max(0, Math.min(headU, 1)));
          snakeHalo.position.copy(headPos);
          snakeHalo.scale.setScalar(0.20 + Math.sin(animElapsed * 0.015) * 0.04);

          // Dynamic green point light following head
          snakeLight.position.copy(headPos);
          snakeLight.intensity = 1.2 + headU * 4.5;

          // Trailing spark particles
          const sArr = sparksGeo.attributes.position.array as Float32Array;
          for (let s = 0; s < NUM_SPARKS; s++) {
            const su = Math.max(0, headU - (s / NUM_SPARKS) * 0.32);
            const spt = snakeCurve.getPointAt(Math.max(0, su));
            const offset = Math.sin(animElapsed * 0.008 + s) * 0.08;
            sArr[s * 3] = spt.x + offset;
            sArr[s * 3 + 1] = spt.y + offset * 0.7;
            sArr[s * 3 + 2] = spt.z + offset * 0.5;
          }
          sparksGeo.attributes.position.needsUpdate = true;

          // Screen displays clean background until snake strikes
          renderScreenFrame(0, animElapsed);
          screenTexture.needsUpdate = true;
        } else {
          // Play screen impact chime sound once
          if (!isImpactSoundPlayed) {
            isImpactSoundPlayed = true;
            playScreenImpact();
          }

          // Snake plunges into screen!
          snakeGroup.visible = false;
          snakeLight.intensity = 0;

          // Smooth brand writing animation on screen begins immediately
          const writeElapsed = snakeElapsed - snakeDuration;
          const writeDuration = 2000; // 2s smooth writing
          const writeProgress = Math.min(writeElapsed / writeDuration, 1);

          renderScreenFrame(writeProgress, animElapsed);
          screenTexture.needsUpdate = true;
        }
      } else {
        // Reset if user reversed step
        logoAnimStartTime = null;
        snakeGroup.visible = false;
        snakeLight.intensity = 0;
        isSnakeSoundPlayed = false;
        isImpactSoundPlayed = false;
        if (scrImg && scrImg.complete) {
          renderScreenFrame(0, 0);
          screenTexture.needsUpdate = true;
        }
      }

      // 4. Step 3: Zooming to Home Page
      if (currentStep === 3) {
        if (!zoomStartTime) zoomStartTime = performance.now();
        const zoomDuration = 850;
        const zt = Math.min((performance.now() - zoomStartTime) / zoomDuration, 1);
        const zEase = Math.pow(zt, 2.2);

        // Gently face straight forward as we dive in
        targetRotY += (0 - targetRotY) * 0.15;
        targetRotX += (0.02 - targetRotX) * 0.15;

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
          setStep(4);
          stepRef.current = 4;
          onFinish();
        }
      }

      renderer.render(scene, camera);
    }

    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onFinish, goToNextStep]);

  if (step === 4) return null;

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden select-none transition-opacity duration-300 bg-[#F6FAF6] cursor-grab"
      style={{ touchAction: "none" }}
      aria-label="Interactive 3D Laptop Experience"
    >
      {/* Top Branding & Skip Action */}
      <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex items-center justify-between pointer-events-none z-10">
        <Image
          src="/growbroo-logo.png"
          alt="GrowBroo - Scale Your Business Online"
          width={180}
          height={55}
          className="h-8 sm:h-9 w-auto object-contain"
          priority
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleSkip();
          }}
          className="pointer-events-auto px-4 py-1.5 rounded-full bg-black/5 hover:bg-black/10 border border-black/10 text-xs sm:text-sm font-medium text-neutral-700 hover:text-black transition-all flex items-center gap-1.5 backdrop-blur-sm shadow-sm"
        >
          Skip Intro
          <span className="text-sm">→</span>
        </button>
      </div>

      {/* Bottom Professional Welcome & Quote */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-center px-4 max-w-xl pointer-events-none z-10 transition-all duration-500">
        <h3 className="text-sm sm:text-base md:text-lg font-semibold tracking-tight text-neutral-900 leading-snug">
          “Big Ideas. Built for Real Growth.”
        </h3>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1 font-normal tracking-wide">
          Welcome to the future of high-velocity web engineering & scale.
        </p>
      </div>
    </div>
  );
}
