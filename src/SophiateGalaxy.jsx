import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const BRAND_BLUE = 0x6b7ff5;
const BRAND_CYAN = 0x7be0f5;
const BRAND_PURPLE = 0x7b2ff7;
const BRAND_WHITE = 0xffffff;

export default function SophiateGalaxy() {
  const mountRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const scrollRef = useRef(0);
  const [loaded, setLoaded] = useState(false);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, []);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    let w = window.innerWidth;
    let h = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 8000);
    camera.position.set(0, 80, 500);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x020208, 1);
    el.appendChild(renderer.domElement);

    // ======== GALAXY SPIRAL PARTICLES ========
    const galaxyCount = 6000;
    const galaxyGeo = new THREE.BufferGeometry();
    const gPos = new Float32Array(galaxyCount * 3);
    const gCol = new Float32Array(galaxyCount * 3);
    const gSize = new Float32Array(galaxyCount);
    const arms = 4;
    const spiralTightness = 0.7;

    for (let i = 0; i < galaxyCount; i++) {
      const armIndex = i % arms;
      const armAngle = (armIndex / arms) * Math.PI * 2;
      const dist = Math.random() * 800;
      const spiralAngle = dist * 0.003 * spiralTightness + armAngle;
      const scatter = (Math.random() - 0.5) * (40 + dist * 0.15);
      const yScatter = (Math.random() - 0.5) * (15 + dist * 0.04);

      gPos[i * 3] = Math.cos(spiralAngle) * dist + scatter;
      gPos[i * 3 + 1] = yScatter;
      gPos[i * 3 + 2] = Math.sin(spiralAngle) * dist + scatter;

      const t = dist / 800;
      const c = new THREE.Color();
      if (t < 0.3) c.lerpColors(new THREE.Color(0xffffff), new THREE.Color(BRAND_BLUE), t / 0.3);
      else if (t < 0.6) c.lerpColors(new THREE.Color(BRAND_BLUE), new THREE.Color(BRAND_PURPLE), (t - 0.3) / 0.3);
      else c.lerpColors(new THREE.Color(BRAND_PURPLE), new THREE.Color(BRAND_CYAN), (t - 0.6) / 0.4);
      c.multiplyScalar(0.7 + Math.random() * 0.3);

      gCol[i * 3] = c.r;
      gCol[i * 3 + 1] = c.g;
      gCol[i * 3 + 2] = c.b;
      gSize[i] = 1 + Math.random() * 2.5;
    }

    galaxyGeo.setAttribute("position", new THREE.BufferAttribute(gPos, 3));
    galaxyGeo.setAttribute("color", new THREE.BufferAttribute(gCol, 3));
    const galaxyMat = new THREE.PointsMaterial({
      size: 1.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
    });
    const galaxy = new THREE.Points(galaxyGeo, galaxyMat);
    galaxy.rotation.x = Math.PI * 0.15;
    scene.add(galaxy);

    // ======== DISTANT STAR FIELD ========
    const starCount = 3000;
    const starGeo = new THREE.BufferGeometry();
    const sPos = new Float32Array(starCount * 3);
    const sCol = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 1500 + Math.random() * 4000;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      sPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      sPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      sPos[i * 3 + 2] = r * Math.cos(phi);

      const brightness = 0.3 + Math.random() * 0.7;
      sCol[i * 3] = brightness;
      sCol[i * 3 + 1] = brightness;
      sCol[i * 3 + 2] = brightness + Math.random() * 0.1;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(sPos, 3));
    starGeo.setAttribute("color", new THREE.BufferAttribute(sCol, 3));
    const starMat = new THREE.PointsMaterial({
      size: 1.0,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // ======== CORE SPHERE (logo core) ========
    const coreGeo = new THREE.SphereGeometry(18, 64, 64);
    const coreMat = new THREE.MeshPhongMaterial({
      color: BRAND_BLUE,
      emissive: BRAND_BLUE,
      emissiveIntensity: 0.8,
      shininess: 150,
      transparent: true,
      opacity: 0.95,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    // Core glow layers
    const glowLayers = [];
    [24, 32, 45].forEach((radius, i) => {
      const g = new THREE.Mesh(
        new THREE.SphereGeometry(radius, 32, 32),
        new THREE.MeshBasicMaterial({
          color: [BRAND_BLUE, BRAND_CYAN, BRAND_PURPLE][i],
          transparent: true,
          opacity: [0.1, 0.06, 0.03][i],
        })
      );
      scene.add(g);
      glowLayers.push(g);
    });

    // ======== ORBITAL RINGS (atom) ========
    const orbitals = [];
    const orbitData = [
      { rx: Math.PI * 0.35, rz: 0, radius: 50, speed: 1.2 },
      { rx: Math.PI * 0.35, rz: Math.PI * 0.66, radius: 50, speed: 1.5 },
      { rx: Math.PI * 0.35, rz: -Math.PI * 0.66, radius: 50, speed: 1.0 },
    ];
    orbitData.forEach((od) => {
      const ringGeo = new THREE.TorusGeometry(od.radius, 0.5, 16, 120);
      const ringMat = new THREE.MeshBasicMaterial({ color: BRAND_WHITE, transparent: true, opacity: 0.3 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.set(od.rx, 0, od.rz);
      scene.add(ring);

      const eMat = new THREE.MeshBasicMaterial({ color: BRAND_WHITE });
      const eMesh = new THREE.Mesh(new THREE.SphereGeometry(2.5, 16, 16), eMat);
      ring.add(eMesh);

      orbitals.push({ ring, electron: eMesh, ...od });
    });

    // ======== PLANETARY ORBITS (solar system feel) ========
    const planets = [];
    const planetData = [
      { dist: 120, size: 5, color: BRAND_CYAN, speed: 0.3, y: -10 },
      { dist: 180, size: 7, color: BRAND_PURPLE, speed: 0.2, y: 5 },
      { dist: 260, size: 4, color: 0x9b7ff5, speed: 0.15, y: -15 },
      { dist: 350, size: 6, color: BRAND_BLUE, speed: 0.1, y: 8 },
    ];
    planetData.forEach((pd) => {
      // Orbit path ring
      const pathGeo = new THREE.TorusGeometry(pd.dist, 0.3, 8, 180);
      const pathMat = new THREE.MeshBasicMaterial({ color: BRAND_WHITE, transparent: true, opacity: 0.06 });
      const path = new THREE.Mesh(pathGeo, pathMat);
      path.rotation.x = Math.PI * 0.5;
      path.position.y = pd.y;
      scene.add(path);

      // Planet
      const pGeo = new THREE.SphereGeometry(pd.size, 32, 32);
      const pMat = new THREE.MeshPhongMaterial({
        color: pd.color,
        emissive: pd.color,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.9,
      });
      const planet = new THREE.Mesh(pGeo, pMat);
      scene.add(planet);

      // Planet glow
      const pgGeo = new THREE.SphereGeometry(pd.size * 2, 16, 16);
      const pgMat = new THREE.MeshBasicMaterial({ color: pd.color, transparent: true, opacity: 0.1 });
      const pglow = new THREE.Mesh(pgGeo, pgMat);
      scene.add(pglow);

      // Trail particles
      const trailCount = 40;
      const trailPos = new Float32Array(trailCount * 3);
      const trailGeo = new THREE.BufferGeometry();
      trailGeo.setAttribute("position", new THREE.BufferAttribute(trailPos, 3));
      const trailMat = new THREE.PointsMaterial({
        size: pd.size * 0.6,
        color: pd.color,
        transparent: true,
        opacity: 0.25,
      });
      const trail = new THREE.Points(trailGeo, trailMat);
      scene.add(trail);

      planets.push({ ...pd, mesh: planet, glow: pglow, path, trail, trailGeo, trailPositions: [] });
    });

    // ======== NEBULA DUST CLOUDS ========
    const nebulaCount = 800;
    const nebGeo = new THREE.BufferGeometry();
    const nPos = new Float32Array(nebulaCount * 3);
    const nCol = new Float32Array(nebulaCount * 3);
    for (let i = 0; i < nebulaCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 80 + Math.random() * 500;
      nPos[i * 3] = Math.cos(angle) * dist + (Math.random() - 0.5) * 100;
      nPos[i * 3 + 1] = (Math.random() - 0.5) * 60;
      nPos[i * 3 + 2] = Math.sin(angle) * dist + (Math.random() - 0.5) * 100;

      const c = new THREE.Color(Math.random() > 0.5 ? BRAND_PURPLE : BRAND_BLUE);
      c.multiplyScalar(0.5);
      nCol[i * 3] = c.r;
      nCol[i * 3 + 1] = c.g;
      nCol[i * 3 + 2] = c.b;
    }
    nebGeo.setAttribute("position", new THREE.BufferAttribute(nPos, 3));
    nebGeo.setAttribute("color", new THREE.BufferAttribute(nCol, 3));
    const nebMat = new THREE.PointsMaterial({
      size: 4,
      vertexColors: true,
      transparent: true,
      opacity: 0.15,
      sizeAttenuation: true,
    });
    const nebula = new THREE.Points(nebGeo, nebMat);
    scene.add(nebula);

    // ======== SHOOTING STARS ========
    const maxShootingStars = 5;
    const shootingStars = [];

    const createShootingStar = () => {
      // Random origin point in the sky
      const angle = Math.random() * Math.PI * 2;
      const dist = 600 + Math.random() * 1200;
      const startX = Math.cos(angle) * dist;
      const startY = 100 + Math.random() * 400;
      const startZ = Math.sin(angle) * dist * 0.5 - 200;

      // Direction — streaks inward/downward
      const dirX = -startX * 0.4 + (Math.random() - 0.5) * 300;
      const dirY = -startY * 0.6 - Math.random() * 200;
      const dirZ = (Math.random() - 0.5) * 400;
      const dir = new THREE.Vector3(dirX, dirY, dirZ).normalize();

      // Speed & length — faster and longer tail
      const speed = 6 + Math.random() * 8;
      const tailLength = 30 + Math.floor(Math.random() * 30);

      // === BRIGHT TAIL LINE ===
      const positions = new Float32Array(tailLength * 3);
      const colors = new Float32Array(tailLength * 3);
      for (let i = 0; i < tailLength; i++) {
        positions[i * 3] = startX;
        positions[i * 3 + 1] = startY;
        positions[i * 3 + 2] = startZ;
        const fade = 1 - i / tailLength;
        const intensity = fade * fade; // quadratic falloff = brighter head
        colors[i * 3] = 1.0 * intensity;
        colors[i * 3 + 1] = (0.95 + 0.05 * fade) * intensity;
        colors[i * 3 + 2] = (0.8 + 0.2 * (1 - fade)) * intensity;
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      const mat = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 1.0,
        linewidth: 2,
      });
      const line = new THREE.Line(geo, mat);
      scene.add(line);

      // === SECOND WIDER TAIL (glow trail) ===
      const glowPositions = new Float32Array(tailLength * 3);
      const glowColors = new Float32Array(tailLength * 3);
      for (let i = 0; i < tailLength; i++) {
        glowPositions[i * 3] = startX;
        glowPositions[i * 3 + 1] = startY;
        glowPositions[i * 3 + 2] = startZ;
        const fade = Math.pow(1 - i / tailLength, 1.5);
        const gc = new THREE.Color(BRAND_CYAN);
        glowColors[i * 3] = gc.r * fade;
        glowColors[i * 3 + 1] = gc.g * fade;
        glowColors[i * 3 + 2] = gc.b * fade;
      }
      const glowGeo = new THREE.BufferGeometry();
      glowGeo.setAttribute("position", new THREE.BufferAttribute(glowPositions, 3));
      glowGeo.setAttribute("color", new THREE.BufferAttribute(glowColors, 3));
      const glowMat = new THREE.PointsMaterial({
        size: 5,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        sizeAttenuation: true,
      });
      const glowTrail = new THREE.Points(glowGeo, glowMat);
      scene.add(glowTrail);

      // === BRIGHT HEAD CORE ===
      const headGeo = new THREE.SphereGeometry(3, 16, 16);
      const headMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 1.0,
      });
      const head = new THREE.Mesh(headGeo, headMat);
      head.position.set(startX, startY, startZ);
      scene.add(head);

      // === INNER GLOW (bright) ===
      const halo1Geo = new THREE.SphereGeometry(10, 16, 16);
      const halo1Mat = new THREE.MeshBasicMaterial({
        color: BRAND_CYAN,
        transparent: true,
        opacity: 0.5,
      });
      const halo1 = new THREE.Mesh(halo1Geo, halo1Mat);
      halo1.position.set(startX, startY, startZ);
      scene.add(halo1);

      // === OUTER GLOW (wide bloom) ===
      const halo2Geo = new THREE.SphereGeometry(25, 16, 16);
      const halo2Mat = new THREE.MeshBasicMaterial({
        color: BRAND_BLUE,
        transparent: true,
        opacity: 0.2,
      });
      const halo2 = new THREE.Mesh(halo2Geo, halo2Mat);
      halo2.position.set(startX, startY, startZ);
      scene.add(halo2);

      // === ULTRA BLOOM (huge soft glow) ===
      const halo3Geo = new THREE.SphereGeometry(50, 12, 12);
      const halo3Mat = new THREE.MeshBasicMaterial({
        color: BRAND_PURPLE,
        transparent: true,
        opacity: 0.08,
      });
      const halo3 = new THREE.Mesh(halo3Geo, halo3Mat);
      halo3.position.set(startX, startY, startZ);
      scene.add(halo3);

      // === MOVING POINT LIGHT (illuminates nearby particles) ===
      const starLight = new THREE.PointLight(BRAND_CYAN, 4, 300);
      starLight.position.set(startX, startY, startZ);
      scene.add(starLight);

      return {
        line, geo, mat,
        glowTrail, glowGeo, glowMat,
        head, headMat,
        halo1, halo1Mat, halo2, halo2Mat, halo3, halo3Mat,
        starLight,
        pos: new THREE.Vector3(startX, startY, startZ),
        dir, speed, tailLength,
        history: Array.from({ length: tailLength }, () => new THREE.Vector3(startX, startY, startZ)),
        life: 1.0,
        decay: 0.003 + Math.random() * 0.005,
      };
    };

    let shootingStarTimer = 0;
    const shootingStarInterval = 2.5 + Math.random() * 3;

    // ======== LIGHTS ========
    scene.add(new THREE.AmbientLight(0x111133, 0.6));
    const light1 = new THREE.PointLight(BRAND_BLUE, 3, 800);
    light1.position.set(100, 100, 200);
    scene.add(light1);
    const light2 = new THREE.PointLight(BRAND_CYAN, 2, 600);
    light2.position.set(-150, -50, 150);
    scene.add(light2);
    const light3 = new THREE.PointLight(BRAND_PURPLE, 1.5, 500);
    light3.position.set(0, 150, -100);
    scene.add(light3);

    // ======== MOUSE & SCROLL ========
    const onMouse = (e) => {
      mouseRef.current.targetX = (e.clientX / w) * 2 - 1;
      mouseRef.current.targetY = -(e.clientY / h) * 2 + 1;
    };
    const onScroll = () => { scrollRef.current = window.scrollY; };
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("scroll", onScroll);

    // ======== ANIMATION ========
    const clock = new THREE.Clock();
    let frameId;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Smooth mouse
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Camera
      camera.position.x += (mx * 80 - camera.position.x) * 0.015;
      camera.position.y += (80 + my * 50 - camera.position.y) * 0.015;
      camera.lookAt(0, 0, 0);

      // Galaxy rotation
      galaxy.rotation.y += 0.0008;
      nebula.rotation.y += 0.0005;
      stars.rotation.y += 0.0001;

      // Core
      const breathe = 1 + Math.sin(t * 1.5) * 0.06;
      core.scale.set(breathe, breathe, breathe);
      coreMat.emissiveIntensity = 0.7 + Math.sin(t * 2) * 0.2;
      glowLayers.forEach((g, i) => {
        const s = breathe * (1 + (i + 1) * 0.15);
        g.scale.set(s, s, s);
        g.material.opacity = [0.1, 0.06, 0.03][i] + Math.sin(t * (1.5 + i * 0.3)) * 0.02;
      });

      // Atom orbitals
      orbitals.forEach((o) => {
        o.ring.rotation.z += 0.003 * o.speed;
        const angle = t * o.speed;
        o.electron.position.set(Math.cos(angle) * o.radius, Math.sin(angle) * o.radius, 0);
      });

      // Planets
      planets.forEach((p) => {
        const angle = t * p.speed;
        const px = Math.cos(angle) * p.dist;
        const pz = Math.sin(angle) * p.dist;
        p.mesh.position.set(px, p.y, pz);
        p.glow.position.set(px, p.y, pz);

        const ps = 1 + Math.sin(t * 2 + p.dist) * 0.1;
        p.glow.scale.set(ps, ps, ps);

        // Trail
        p.trailPositions.push({ x: px, y: p.y, z: pz });
        if (p.trailPositions.length > 40) p.trailPositions.shift();
        const tArr = p.trailGeo.attributes.position.array;
        for (let i = 0; i < 40; i++) {
          const tp = p.trailPositions[i] || p.trailPositions[p.trailPositions.length - 1] || { x: px, y: p.y, z: pz };
          tArr[i * 3] = tp.x;
          tArr[i * 3 + 1] = tp.y;
          tArr[i * 3 + 2] = tp.z;
        }
        p.trailGeo.attributes.position.needsUpdate = true;
      });

      // Lights
      light1.intensity = 3 + Math.sin(t * 1.2) * 0.5;
      light2.intensity = 2 + Math.cos(t * 0.9) * 0.4;
      light3.intensity = 1.5 + Math.sin(t * 0.7) * 0.3;

      // Shooting stars
      shootingStarTimer += 1 / 60;
      if (shootingStarTimer > shootingStarInterval && shootingStars.length < maxShootingStars) {
        shootingStars.push(createShootingStar());
        shootingStarTimer = Math.random() * -2; // randomize next interval
      }

      for (let si = shootingStars.length - 1; si >= 0; si--) {
        const ss = shootingStars[si];
        // Move head
        ss.pos.addScaledVector(ss.dir, ss.speed);
        ss.life -= ss.decay;

        // Update all head elements
        ss.head.position.copy(ss.pos);
        ss.halo1.position.copy(ss.pos);
        ss.halo2.position.copy(ss.pos);
        ss.halo3.position.copy(ss.pos);
        ss.starLight.position.copy(ss.pos);

        // Pulsating glow
        const pulse = 1 + Math.sin(t * 15) * 0.4;
        ss.halo1.scale.setScalar(pulse);
        ss.halo2.scale.setScalar(1 + Math.sin(t * 8) * 0.25);
        ss.halo3.scale.setScalar(1 + Math.sin(t * 5) * 0.15);
        ss.starLight.intensity = 4 * ss.life * pulse;

        // Shift history forward, newest at index 0
        for (let hi = ss.history.length - 1; hi > 0; hi--) {
          ss.history[hi].copy(ss.history[hi - 1]);
        }
        ss.history[0].copy(ss.pos);

        // Update line positions
        const posArr = ss.geo.attributes.position.array;
        for (let hi = 0; hi < ss.tailLength; hi++) {
          posArr[hi * 3] = ss.history[hi].x;
          posArr[hi * 3 + 1] = ss.history[hi].y;
          posArr[hi * 3 + 2] = ss.history[hi].z;
        }
        ss.geo.attributes.position.needsUpdate = true;

        // Update glow trail positions
        const gArr = ss.glowGeo.attributes.position.array;
        for (let hi = 0; hi < ss.tailLength; hi++) {
          gArr[hi * 3] = ss.history[hi].x;
          gArr[hi * 3 + 1] = ss.history[hi].y;
          gArr[hi * 3 + 2] = ss.history[hi].z;
        }
        ss.glowGeo.attributes.position.needsUpdate = true;

        // Fade out
        ss.mat.opacity = ss.life;
        ss.glowMat.opacity = ss.life * 0.6;
        ss.headMat.opacity = ss.life;
        ss.halo1Mat.opacity = ss.life * 0.5;
        ss.halo2Mat.opacity = ss.life * 0.2;
        ss.halo3Mat.opacity = ss.life * 0.08;

        // Remove when dead
        if (ss.life <= 0) {
          scene.remove(ss.line);
          scene.remove(ss.glowTrail);
          scene.remove(ss.head);
          scene.remove(ss.halo1);
          scene.remove(ss.halo2);
          scene.remove(ss.halo3);
          scene.remove(ss.starLight);
          ss.geo.dispose(); ss.mat.dispose();
          ss.glowGeo.dispose(); ss.glowMat.dispose();
          ss.headMat.dispose();
          ss.halo1Mat.dispose(); ss.halo2Mat.dispose(); ss.halo3Mat.dispose();
          shootingStars.splice(si, 1);
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    // Entrance
    setTimeout(() => setLoaded(true), 400);
    setTimeout(() => setPhase(1), 800);
    setTimeout(() => setPhase(2), 1400);
    setTimeout(() => setPhase(3), 2000);
    setTimeout(() => setPhase(4), 2600);

    const onResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      shootingStars.forEach((ss) => {
        scene.remove(ss.line);
        scene.remove(ss.glowTrail);
        scene.remove(ss.head);
        scene.remove(ss.halo1);
        scene.remove(ss.halo2);
        scene.remove(ss.halo3);
        scene.remove(ss.starLight);
        ss.geo.dispose(); ss.mat.dispose();
        ss.glowGeo.dispose(); ss.glowMat.dispose();
      });
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { overflow-x: hidden; background: #020208; }

        .g-mount canvas {
          position: fixed; top: 0; left: 0;
          width: 100vw; height: 100vh; z-index: 0;
        }

        .g-overlay {
          position: fixed; top: 0; left: 0;
          width: 100vw; height: 100vh; z-index: 10;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          pointer-events: none;
        }

        /* ---- LOGO ---- */
        .g-logo {
          font-family: 'Orbitron', sans-serif;
          font-weight: 900;
          font-size: clamp(32px, 7vw, 78px);
          letter-spacing: 0.18em;
          color: #fff;
          text-shadow:
            0 0 40px rgba(107,127,245,0.5),
            0 0 100px rgba(107,127,245,0.2),
            0 0 200px rgba(123,47,247,0.1);
          opacity: 0;
          transform: translateY(40px) scale(0.85);
          transition: all 1.4s cubic-bezier(0.16,1,0.3,1);
        }
        .g-logo.in {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .g-sub {
          font-family: 'Noto Sans JP', sans-serif;
          font-weight: 300;
          font-size: clamp(10px, 1.8vw, 14px);
          letter-spacing: 0.4em;
          color: rgba(123,224,245,0.7);
          margin-top: 14px;
          opacity: 0;
          transform: translateY(20px);
          transition: all 1s ease 0.3s;
        }
        .g-sub.in { opacity: 1; transform: translateY(0); }

        .g-tagline {
          font-family: 'Noto Sans JP', sans-serif;
          font-weight: 500;
          font-size: clamp(15px, 2.8vw, 24px);
          color: rgba(255,255,255,0.9);
          margin-top: 44px;
          letter-spacing: 0.1em;
          line-height: 1.7;
          text-align: center;
          opacity: 0;
          transform: translateY(25px);
          transition: all 1s ease 0.3s;
        }
        .g-tagline.in { opacity: 1; transform: translateY(0); }

        /* ---- BUTTONS ---- */
        .g-buttons {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          margin-top: 48px;
          pointer-events: auto;
          opacity: 0;
          transform: translateY(30px);
          transition: all 1s ease 0.3s;
        }
        .g-buttons.in { opacity: 1; transform: translateY(0); }

        .g-btn-primary {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 20px 60px;
          font-family: 'Noto Sans JP', sans-serif;
          font-size: 16px;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: #fff;
          background: linear-gradient(135deg, #6b7ff5, #7b2ff7);
          border: none;
          border-radius: 60px;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
          box-shadow:
            0 0 30px rgba(107,127,245,0.4),
            0 0 80px rgba(123,47,247,0.2);
          overflow: hidden;
        }
        .g-btn-primary::before {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 63px;
          background: linear-gradient(135deg, #7be0f5, #6b7ff5, #7b2ff7, #7be0f5);
          background-size: 300% 300%;
          z-index: -1;
          opacity: 0;
          transition: opacity 0.4s;
          animation: shimmer 3s ease infinite;
        }
        .g-btn-primary:hover {
          transform: scale(1.08) translateY(-2px);
          box-shadow:
            0 0 50px rgba(107,127,245,0.6),
            0 0 120px rgba(123,47,247,0.35),
            0 0 200px rgba(107,127,245,0.15);
        }
        .g-btn-primary:hover::before { opacity: 1; }
        .g-btn-primary:active { transform: scale(0.97); }

        @keyframes shimmer {
          0%,100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .g-btn-row {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .g-btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 32px;
          font-family: 'Noto Sans JP', sans-serif;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.08em;
          color: rgba(255,255,255,0.85);
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(107,127,245,0.3);
          border-radius: 50px;
          cursor: pointer;
          text-decoration: none;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          transition: all 0.35s ease;
        }
        .g-btn-ghost:hover {
          background: rgba(107,127,245,0.15);
          border-color: rgba(107,127,245,0.6);
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 0 30px rgba(107,127,245,0.2);
        }
        .g-btn-ghost:active { transform: scale(0.97); }

        .g-btn-icon {
          font-size: 16px;
          line-height: 1;
        }

        /* ---- LINKS BAR ---- */
        .g-links {
          display: flex;
          gap: 10px;
          margin-top: 20px;
          opacity: 0;
          transform: translateY(20px);
          transition: all 1s ease 0.3s;
          pointer-events: auto;
        }
        .g-links.in { opacity: 1; transform: translateY(0); }

        .g-link-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 24px;
          font-family: 'Noto Sans JP', sans-serif;
          font-size: 12px;
          font-weight: 400;
          letter-spacing: 0.06em;
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 30px;
          transition: all 0.3s ease;
        }
        .g-link-pill:hover {
          color: rgba(255,255,255,0.85);
          border-color: rgba(107,127,245,0.4);
          background: rgba(107,127,245,0.08);
        }

        /* ---- FOOTER ---- */
        .g-footer {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          font-family: 'Noto Sans JP', sans-serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          color: rgba(255,255,255,0.15);
          z-index: 10;
        }

        /* ---- Responsive ---- */
        @media (max-width: 640px) {
          .g-btn-primary { padding: 18px 44px; font-size: 14px; }
          .g-btn-ghost { padding: 12px 24px; font-size: 12px; }
          .g-btn-row { flex-direction: column; align-items: center; }
          .g-links { flex-direction: column; align-items: center; }
        }
      `}</style>

      <div ref={mountRef} className="g-mount" />

      <div className="g-overlay">
        <div className={`g-logo ${phase >= 0 && loaded ? "in" : ""}`}>
          SOPHIATE
        </div>
        <div className={`g-sub ${phase >= 1 ? "in" : ""}`}>
          株式会社ソフィエイト
        </div>
        <div className={`g-tagline ${phase >= 2 ? "in" : ""}`}>
          企画から伴走する、プロダクト共創開発。
        </div>

        <div className={`g-buttons ${phase >= 3 ? "in" : ""}`}>
          <a
            href="https://sophiate.co.jp/"
            target="_blank"
            rel="noopener noreferrer"
            className="g-btn-primary"
          >
            HPを見る
          </a>

          <div className="g-btn-row">
            <a
              href="/demos"
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, "", "/demos");
                window.dispatchEvent(new PopStateEvent("popstate"));
              }}
              className="g-btn-ghost"
            >
              <span className="g-btn-icon">&#9728;</span>
              デモギャラリーを見る
            </a>
            <a
              href="https://sophiate.co.jp/business-record/"
              target="_blank"
              rel="noopener noreferrer"
              className="g-btn-ghost"
            >
              <span className="g-btn-icon">&#128188;</span>
              開発事例を見る
            </a>
            <a
              href="https://drive.google.com/file/d/1TwM2yP3b8-BWCczxpKAsohODAGrMt4Am/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="g-btn-ghost"
            >
              <span className="g-btn-icon">&#128196;</span>
              サービス資料
            </a>
          </div>
        </div>

        <div className={`g-links ${phase >= 4 ? "in" : ""}`}>
          <a href="https://sophiate.co.jp/" target="_blank" rel="noopener noreferrer" className="g-link-pill">
            sophiate.co.jp
          </a>
          <a href="mailto:info@sophiate.co.jp" className="g-link-pill">
            &#9993; お問い合わせ
          </a>
          <a
            href="https://reachup.mf-hd.com/link/tnqjctn5wxr"
            target="_blank"
            rel="noopener noreferrer"
            className="g-link-pill"
          >
            &#128101; 決済者直アポ
          </a>
        </div>
      </div>

      <div className="g-footer">© Sophiate Inc.</div>
    </>
  );
}
