"use client";

import { useEffect, useRef } from "react";

/**
 * A deliberately quiet, generative field: contour ribbons, a floating monolith,
 * and a few orbital arcs. It is intentionally not a particle network.
 */
export default function SignalField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = { x: 0.5, y: 0.5 };
    let width = 0;
    let height = 0;
    let devicePixelRatio = 1;
    let frame = 0;
    let running = !motionQuery.matches;
    let inViewport = true;
    const startedAt = performance.now();

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * devicePixelRatio);
      canvas.height = Math.round(height * devicePixelRatio);
      context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      draw(performance.now());
    };

    const draw = (now: number) => {
      const time = (now - startedAt) / 1000;
      const scale = Math.min(width, height);
      const centerX = width * 0.52 + (pointer.x - 0.5) * scale * 0.045;
      const centerY = height * 0.5 + (pointer.y - 0.5) * scale * 0.035;

      context.clearRect(0, 0, width, height);
      context.save();
      context.globalCompositeOperation = "screen";

      const atmosphere = context.createRadialGradient(
        centerX,
        centerY,
        scale * 0.02,
        centerX,
        centerY,
        scale * 0.62,
      );
      atmosphere.addColorStop(0, "rgba(215, 250, 95, 0.13)");
      atmosphere.addColorStop(0.32, "rgba(165, 156, 255, 0.07)");
      atmosphere.addColorStop(0.68, "rgba(255, 118, 87, 0.025)");
      atmosphere.addColorStop(1, "rgba(13, 14, 12, 0)");
      context.fillStyle = atmosphere;
      context.fillRect(0, 0, width, height);

      // Slow topographic ribbons. These are the primary motion, not a web of points.
      context.lineWidth = Math.max(0.7, scale * 0.0012);
      for (let ribbon = 0; ribbon < 7; ribbon += 1) {
        const baseline = height * (0.22 + ribbon * 0.095);
        context.beginPath();
        for (let point = 0; point <= 80; point += 1) {
          const x = (point / 80) * width;
          const wave =
            Math.sin(point * 0.18 + time * (0.12 + ribbon * 0.012) + ribbon) *
            scale *
            0.022;
          const secondary =
            Math.cos(point * 0.07 - time * 0.08 + ribbon * 0.8) * scale * 0.012;
          const y = baseline + wave + secondary;
          if (point === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.strokeStyle = `rgba(215, 250, 95, ${0.045 + (6 - ribbon) * 0.006})`;
        context.stroke();
      }

      context.save();
      context.translate(centerX, centerY);
      context.rotate(-0.18 + Math.sin(time * 0.16) * 0.025);

      // Orbital arcs with different depths.
      const orbitColors = [
        "rgba(215, 250, 95, 0.6)",
        "rgba(165, 156, 255, 0.5)",
        "rgba(255, 118, 87, 0.42)",
        "rgba(239, 238, 232, 0.2)",
      ];
      for (let orbit = 0; orbit < 4; orbit += 1) {
        const radiusX = scale * (0.19 + orbit * 0.052);
        const radiusY = scale * (0.075 + orbit * 0.018);
        const rotation = -0.4 + orbit * 0.28;
        context.beginPath();
        context.ellipse(0, 0, radiusX, radiusY, rotation, 0, Math.PI * 2);
        context.strokeStyle = orbitColors[orbit];
        context.lineWidth = orbit === 0 ? 1.25 : 0.8;
        context.setLineDash(orbit === 1 ? [scale * 0.055, scale * 0.025] : []);
        context.stroke();
        context.setLineDash([]);

        const angle = time * (0.18 + orbit * 0.035) + orbit * 1.7;
        const arcX = Math.cos(angle) * radiusX;
        const arcY = Math.sin(angle) * radiusY;
        context.save();
        context.translate(arcX, arcY);
        context.rotate(rotation);
        context.fillStyle = orbitColors[orbit];
        context.fillRect(-scale * 0.009, -scale * 0.003, scale * 0.018, scale * 0.006);
        context.restore();
      }

      // A small, floating architectural slab gives the field a tangible center.
      const slabWidth = scale * 0.2;
      const slabHeight = scale * 0.34;
      const slabGradient = context.createLinearGradient(
        -slabWidth,
        -slabHeight,
        slabWidth,
        slabHeight,
      );
      slabGradient.addColorStop(0, "rgba(239, 238, 232, 0.19)");
      slabGradient.addColorStop(0.42, "rgba(215, 250, 95, 0.08)");
      slabGradient.addColorStop(1, "rgba(165, 156, 255, 0.2)");
      context.beginPath();
      context.moveTo(-slabWidth * 0.55, -slabHeight);
      context.lineTo(slabWidth * 0.46, -slabHeight * 0.82);
      context.lineTo(slabWidth, slabHeight * 0.82);
      context.lineTo(-slabWidth, slabHeight);
      context.closePath();
      context.fillStyle = slabGradient;
      context.fill();
      context.strokeStyle = "rgba(239, 238, 232, 0.3)";
      context.lineWidth = 0.75;
      context.stroke();

      context.beginPath();
      context.moveTo(-slabWidth * 0.18, -slabHeight * 0.88);
      context.lineTo(-slabWidth * 0.18, slabHeight * 0.84);
      context.strokeStyle = "rgba(215, 250, 95, 0.52)";
      context.lineWidth = 1.2;
      context.stroke();

      context.beginPath();
      context.moveTo(slabWidth * 0.26, -slabHeight * 0.73);
      context.lineTo(slabWidth * 0.26, slabHeight * 0.65);
      context.strokeStyle = "rgba(165, 156, 255, 0.5)";
      context.lineWidth = 0.8;
      context.stroke();

      // A few precise crosshairs, like registration marks in a technical drawing.
      context.strokeStyle = "rgba(239, 238, 232, 0.32)";
      context.lineWidth = 0.65;
      context.beginPath();
      context.moveTo(-scale * 0.29, 0);
      context.lineTo(-scale * 0.24, 0);
      context.moveTo(scale * 0.24, 0);
      context.lineTo(scale * 0.29, 0);
      context.moveTo(0, -scale * 0.28);
      context.lineTo(0, -scale * 0.23);
      context.moveTo(0, scale * 0.23);
      context.lineTo(0, scale * 0.28);
      context.stroke();
      context.restore();

      // A broad, low-opacity sweep gives the object a slow pulse without flashing.
      const sweep = context.createLinearGradient(
        centerX - scale * 0.45,
        centerY - scale * 0.45,
        centerX + scale * 0.45,
        centerY + scale * 0.45,
      );
      sweep.addColorStop(0, "rgba(215, 250, 95, 0)");
      sweep.addColorStop(0.48, `rgba(215, 250, 95, ${0.035 + Math.sin(time * 0.7) * 0.015})`);
      sweep.addColorStop(1, "rgba(215, 250, 95, 0)");
      context.strokeStyle = sweep;
      context.lineWidth = 1;
      context.beginPath();
      context.arc(centerX, centerY, scale * 0.3, time * 0.15, time * 0.15 + Math.PI * 0.65);
      context.stroke();

      context.restore();
    };

    const tick = (now: number) => {
      draw(now);
      if (running && inViewport && !document.hidden) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    const stopFrame = () => {
      window.cancelAnimationFrame(frame);
      frame = 0;
    };

    const startFrame = () => {
      stopFrame();
      if (running && inViewport && !document.hidden) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointer.x = (event.clientX - bounds.left) / bounds.width;
      pointer.y = (event.clientY - bounds.top) / bounds.height;
    };

    const onMotionChange = (event: MediaQueryListEvent) => {
      running = !event.matches;
      stopFrame();
      draw(performance.now());
      startFrame();
    };

    const onVisibilityChange = () => {
      if (document.hidden) stopFrame();
      else startFrame();
    };

    const onViewportChange = (entries: IntersectionObserverEntry[]) => {
      inViewport = entries[0]?.isIntersecting ?? true;
      if (inViewport) startFrame();
      else stopFrame();
    };

    const observer = new ResizeObserver(resize);
    const viewportObserver = new IntersectionObserver(onViewportChange, { threshold: 0.01 });
    observer.observe(canvas);
    viewportObserver.observe(canvas);
    canvas.addEventListener("pointermove", onPointerMove, { passive: true });
    motionQuery.addEventListener("change", onMotionChange);
    document.addEventListener("visibilitychange", onVisibilityChange);
    resize();
    startFrame();

    return () => {
      stopFrame();
      observer.disconnect();
      viewportObserver.disconnect();
      canvas.removeEventListener("pointermove", onPointerMove);
      motionQuery.removeEventListener("change", onMotionChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return (
    <div className="signal-field" aria-hidden="true">
      <canvas ref={canvasRef} className="signal-field__canvas" />
      <div className="signal-field__label signal-field__label--top">FIELD / 01</div>
      <div className="signal-field__label signal-field__label--side">VECTOR / 02</div>
      <div className="signal-field__label signal-field__label--bottom">EKABEKTI—SYSTEMS</div>
      <div className="signal-field__bracket signal-field__bracket--one" />
      <div className="signal-field__bracket signal-field__bracket--two" />
    </div>
  );
}
