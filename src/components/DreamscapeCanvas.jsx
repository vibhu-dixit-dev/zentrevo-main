import React, { useEffect, useRef } from 'react';

export default function DreamscapeCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    const updateDimensions = () => {
      const rect = canvas.getBoundingClientRect();
      width = canvas.width = rect.width || window.innerWidth;
      height = canvas.height = rect.height || window.innerHeight;
    };
    let width = 0;
    let height = 0;
    updateDimensions();

    // Mouse Physics
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      // Normalized from -1 to 1 relative to canvas bounds
      targetMouseX = ((e.clientX - rect.left) / width) * 2 - 1;
      targetMouseY = ((e.clientY - rect.top) / height) * 2 - 1;
    };

    const handleResize = () => {
      updateDimensions();
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize);

    // Stars / Celestial Dust
    const numStars = 85;
    const stars = Array.from({ length: numStars }, () => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.65,
      size: Math.random() * 1.8 + 0.4,
      alpha: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.015 + 0.005,
      phase: Math.random() * Math.PI * 2
    }));

    // Floating Luminous Travel Particles
    const numParticles = 45;
    const particles = Array.from({ length: numParticles }, () => ({
      x: Math.random() * width,
      y: height * 0.5 + Math.random() * (height * 0.5),
      vx: (Math.random() - 0.5) * 0.4,
      vy: -Math.random() * 0.6 - 0.2,
      size: Math.random() * 2.5 + 0.8,
      alpha: Math.random() * 0.6 + 0.3,
      color: Math.random() > 0.4 ? 'rgba(235, 190, 120, ' : 'rgba(120, 225, 235, '
    }));

    // Floating Islands Layer Data
    const islands = [
      {
        baseX: 0.18,
        baseY: 0.52,
        w: 160,
        h: 65,
        parallax: 0.02,
        oscSpeed: 0.0008,
        color: '#071224'
      },
      {
        baseX: 0.82,
        baseY: 0.48,
        w: 220,
        h: 90,
        parallax: 0.035,
        oscSpeed: 0.0012,
        color: '#060f1d'
      },
      {
        baseX: 0.35,
        baseY: 0.58,
        w: 90,
        h: 40,
        parallax: 0.015,
        oscSpeed: 0.0006,
        color: '#091932'
      }
    ];

    let startTime = performance.now();
    let isTabVisible = true;

    const handleVisibility = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // Main Render Loop
    const render = (currentTime) => {
      if (!isTabVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const elapsed = (currentTime - startTime) * 0.001;

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      ctx.clearRect(0, 0, width, height);

      const horizonY = height * 0.62;

      // 1. SKY GRADIENT (Deep Midnight -> Dawn Turquoise -> Gold Horizon)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
      skyGrad.addColorStop(0, '#030712'); // Deep cosmos
      skyGrad.addColorStop(0.35, '#07152d'); // Midnight oceanic indigo
      skyGrad.addColorStop(0.7, '#0d2b45'); // Turquoise twilight
      skyGrad.addColorStop(0.92, '#184252'); // Lavender mist
      skyGrad.addColorStop(1, '#df9857'); // Sunrise molten gold
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, horizonY + 2);

      // 2. STARS & CELESTIAL PARTICLES
      for (let s of stars) {
        const twinkle = Math.sin(elapsed * 2 + s.phase) * 0.3 + 0.7;
        ctx.fillStyle = `rgba(230, 240, 255, ${s.alpha * twinkle})`;
        ctx.beginPath();
        const px = s.x - mouseX * 15;
        const py = s.y - mouseY * 15;
        ctx.arc(px, py, s.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. DISTANT SILHOUETTED MOUNTAINS (Parallax Background)
      ctx.fillStyle = '#061326';
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      const mOffsetX = mouseX * 25;
      for (let x = 0; x <= width; x += 40) {
        const nx = (x + mOffsetX) * 0.004;
        const peak = Math.sin(nx) * 45 + Math.cos(nx * 2.3) * 25 + Math.sin(nx * 0.7) * 35;
        ctx.lineTo(x, horizonY - 40 - peak);
      }
      ctx.lineTo(width, horizonY);
      ctx.closePath();
      ctx.fill();

      // Soft mountain mist layer
      const mistGrad = ctx.createLinearGradient(0, horizonY - 80, 0, horizonY);
      mistGrad.addColorStop(0, 'rgba(223, 152, 87, 0)');
      mistGrad.addColorStop(1, 'rgba(223, 152, 87, 0.45)');
      ctx.fillStyle = mistGrad;
      ctx.fillRect(0, horizonY - 80, width, 80);

      // 4. THE LUMINOUS CELESTIAL PORTAL
      const portalCenterX = width * 0.48 - mouseX * 35;
      const portalCenterY = horizonY - 45 - mouseY * 25;
      const portalRadius = Math.min(width, height) * 0.22;

      // Volumetric Light Rays passing from portal
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      for (let i = 0; i < 7; i++) {
        const rayAngle = -Math.PI / 2 + (i - 3) * 0.28 + Math.sin(elapsed * 0.4 + i) * 0.05;
        const rayLength = portalRadius * 2.8;
        const rGrad = ctx.createRadialGradient(
          portalCenterX, portalCenterY, portalRadius * 0.2,
          portalCenterX + Math.cos(rayAngle) * rayLength,
          portalCenterY + Math.sin(rayAngle) * rayLength,
          rayLength
        );
        rGrad.addColorStop(0, 'rgba(255, 220, 160, 0.22)');
        rGrad.addColorStop(0.5, 'rgba(120, 230, 240, 0.08)');
        rGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = rGrad;
        ctx.beginPath();
        ctx.moveTo(portalCenterX, portalCenterY);
        ctx.arc(portalCenterX, portalCenterY, rayLength, rayAngle - 0.18, rayAngle + 0.18);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // Outer Portal Atmosphere Halo
      const haloGrad = ctx.createRadialGradient(
        portalCenterX, portalCenterY, portalRadius * 0.7,
        portalCenterX, portalCenterY, portalRadius * 1.55
      );
      haloGrad.addColorStop(0, 'rgba(255, 230, 180, 0.55)');
      haloGrad.addColorStop(0.35, 'rgba(78, 205, 215, 0.25)');
      haloGrad.addColorStop(0.75, 'rgba(40, 110, 180, 0.1)');
      haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.arc(portalCenterX, portalCenterY, portalRadius * 1.55, 0, Math.PI * 2);
      ctx.fill();

      // Portal Ring 1 (Gold / Turquoise Outer Rim with breathing pulse)
      const ringPulse = Math.sin(elapsed * 1.5) * 3;
      ctx.strokeStyle = 'rgba(255, 225, 160, 0.85)';
      ctx.lineWidth = 3.5;
      ctx.shadowColor = '#f3c274';
      ctx.shadowBlur = 25;
      ctx.beginPath();
      ctx.arc(portalCenterX, portalCenterY, portalRadius + ringPulse, 0, Math.PI * 2);
      ctx.stroke();

      // Portal Ring 2 (Inner Turquoise shimmer)
      ctx.strokeStyle = 'rgba(100, 240, 255, 0.65)';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#64f0ff';
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(portalCenterX, portalCenterY, portalRadius - 7 + ringPulse * 0.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0; // reset

      // Inside the Portal: Dreamscape Horizon & Dawn Sky
      ctx.save();
      ctx.beginPath();
      ctx.arc(portalCenterX, portalCenterY, portalRadius - 8, 0, Math.PI * 2);
      ctx.clip();

      const innerGrad = ctx.createLinearGradient(
        portalCenterX, portalCenterY - portalRadius,
        portalCenterX, portalCenterY + portalRadius
      );
      innerGrad.addColorStop(0, '#061730');
      innerGrad.addColorStop(0.4, '#154160');
      innerGrad.addColorStop(0.7, '#ffb870');
      innerGrad.addColorStop(1, '#fff5dc');
      ctx.fillStyle = innerGrad;
      ctx.fillRect(
        portalCenterX - portalRadius, portalCenterY - portalRadius,
        portalRadius * 2, portalRadius * 2
      );

      // Inner sun disc
      const sunY = portalCenterY + Math.sin(elapsed * 0.3) * 6;
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffe399';
      ctx.shadowBlur = 35;
      ctx.beginPath();
      ctx.arc(portalCenterX, sunY, portalRadius * 0.32, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Drifting clouds inside portal
      for (let c = 0; c < 3; c++) {
        const cx = portalCenterX - portalRadius + ((elapsed * 18 * (c + 1) + c * 90) % (portalRadius * 2.5));
        const cy = portalCenterY + (c - 1) * 20;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
        ctx.beginPath();
        ctx.ellipse(cx, cy, 35 + c * 10, 12 + c * 3, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 5. FLOATING SURREAL ISLANDS (Layered Parallax)
      for (let island of islands) {
        const floatY = Math.sin(elapsed * 1000 * island.oscSpeed) * 12;
        const ix = width * island.baseX - mouseX * (island.parallax * 800);
        const iy = height * island.baseY + floatY - mouseY * (island.parallax * 400);

        ctx.fillStyle = island.color;
        ctx.beginPath();
        ctx.ellipse(ix, iy, island.w * 0.5, island.h * 0.4, 0, 0, Math.PI);
        // Jagged underside of floating rock
        ctx.lineTo(ix + island.w * 0.5, iy);
        ctx.lineTo(ix + island.w * 0.2, iy + island.h * 0.9);
        ctx.lineTo(ix, iy + island.h * 1.3);
        ctx.lineTo(ix - island.w * 0.25, iy + island.h * 0.85);
        ctx.lineTo(ix - island.w * 0.5, iy);
        ctx.closePath();
        ctx.fill();

        // Lush green/teal foliage rim on island top
        ctx.fillStyle = '#103936';
        ctx.beginPath();
        ctx.ellipse(ix, iy, island.w * 0.48, island.h * 0.18, 0, 0, Math.PI * 2);
        ctx.fill();

        // Silhouette palm tree / foliage spire
        ctx.strokeStyle = '#050c17';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(ix - island.w * 0.15, iy);
        ctx.quadraticCurveTo(ix - island.w * 0.12, iy - 28, ix - island.w * 0.2, iy - 42);
        ctx.stroke();

        // Small waterfall trail drifting into the mist
        const wfGrad = ctx.createLinearGradient(ix, iy, ix, iy + island.h * 1.6);
        wfGrad.addColorStop(0, 'rgba(160, 240, 255, 0.7)');
        wfGrad.addColorStop(1, 'rgba(160, 240, 255, 0)');
        ctx.fillStyle = wfGrad;
        ctx.fillRect(ix + island.w * 0.08, iy + 4, 3.5, island.h * 1.5);
      }

      // 6. ENDLESS PROCEDURAL REFLECTIVE OCEAN
      const oceanHeight = height - horizonY;
      const oceanGrad = ctx.createLinearGradient(0, horizonY, 0, height);
      oceanGrad.addColorStop(0, '#0c2236'); // Twilight turquoise water
      oceanGrad.addColorStop(0.3, '#071626');
      oceanGrad.addColorStop(0.7, '#040d18');
      oceanGrad.addColorStop(1, '#02060b'); // Deep ocean abyss
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(0, horizonY, width, oceanHeight);

      // Portal Golden & Cyan Reflection on Water
      const refX = portalCenterX;
      const refW = portalRadius * 1.4;
      const refGrad = ctx.createLinearGradient(refX - refW, 0, refX + refW, 0);
      refGrad.addColorStop(0, 'rgba(235, 175, 100, 0)');
      refGrad.addColorStop(0.35, 'rgba(120, 220, 240, 0.25)');
      refGrad.addColorStop(0.5, 'rgba(255, 230, 160, 0.6)');
      refGrad.addColorStop(0.65, 'rgba(120, 220, 240, 0.25)');
      refGrad.addColorStop(1, 'rgba(235, 175, 100, 0)');

      // Reflective wave stripes with caustic motion
      ctx.fillStyle = refGrad;
      const numWaves = 38;
      for (let w = 0; w < numWaves; w++) {
        const progress = w / numWaves;
        const wy = horizonY + Math.pow(progress, 1.8) * oceanHeight;
        const waveSpeed = elapsed * (1.2 + progress * 2.5);
        const waveWidth = refW * (1 + progress * 2.8);
        const waveH = 1.2 + progress * 4.5;
        const waveOffset = Math.sin(waveSpeed + w * 0.6) * (15 + progress * 40);

        ctx.fillRect(
          refX - waveWidth * 0.5 + waveOffset,
          wy,
          waveWidth,
          waveH
        );
      }

      // Shimmering water surface highlights
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      for (let i = 0; i < 24; i++) {
        const ry = horizonY + (i / 24) * oceanHeight;
        const rx = ((elapsed * 35 * (1 + i * 0.1) + i * 180) % width);
        ctx.fillRect(rx, ry, 28 + (i % 5) * 12, 1);
      }

      // 7. LUMINOUS TRAVEL PARTICLES (Drifting upward)
      for (let p of particles) {
        p.x += p.vx - mouseX * 0.5;
        p.y += p.vy;

        if (p.y < 0) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.shadowColor = '#64f0ff';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none select-none z-0"
      style={{ display: 'block' }}
    />
  );
}
