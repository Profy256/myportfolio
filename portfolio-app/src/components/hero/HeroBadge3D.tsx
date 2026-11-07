"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Float, RoundedBox, useCursor } from "@react-three/drei";
import * as THREE from "three";

const CARD_W = 1.16;
const CARD_H = 1.56;
const CARD_D = 0.07;

const TEX_W = 680;
const TEX_H = 910;

const ACCENT = "#d6ff3f";

/* ------------------------------------------------------------------ */
/* canvas-drawn card face (photo + typography baked into a texture)    */
/* ------------------------------------------------------------------ */

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function tracked(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  y: number,
  spacing: number
) {
  const total =
    text.split("").reduce((acc, ch) => acc + ctx.measureText(ch).width + spacing, 0) - spacing;
  let x = cx - total / 2;
  for (const ch of text) {
    ctx.fillText(ch, x, y);
    x += ctx.measureText(ch).width + spacing;
  }
}

function resolveFontStack(variable: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  return value ? `${value}, ${fallback}` : fallback;
}

/** Draws an image into a rect with `object-fit: cover` behaviour. */
function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
  anchorX = 0.47,
  anchorY = 0.36,
  zoom = 0.72
) {
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  if (!iw || !ih) return;

  const destAspect = dw / dh;
  let sw: number;
  let sh: number;
  if (iw / ih > destAspect) {
    sh = ih * zoom;
    sw = sh * destAspect;
  } else {
    sw = iw * zoom;
    sh = sw / destAspect;
  }
  const sx = Math.max(0, Math.min(iw - sw, iw * anchorX - sw / 2));
  const sy = Math.max(0, Math.min(ih - sh, ih * anchorY - sh / 2));
  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
}

function drawCard(img: HTMLImageElement | null): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = TEX_W;
  canvas.height = TEX_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const W = TEX_W;
  const H = TEX_H;
  const ui = resolveFontStack("--font-sans", "system-ui, sans-serif");
  const mono = resolveFontStack("--font-mono", "ui-monospace, monospace");

  ctx.clearRect(0, 0, W, H);

  // card silhouette
  roundRect(ctx, 0, 0, W, H, 48);
  ctx.save();
  ctx.clip();

  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#1b2233");
  bg.addColorStop(0.45, "#0b0e16");
  bg.addColorStop(1, "#101a2c");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const violetGlow = ctx.createRadialGradient(60, H - 30, 10, 60, H - 30, 420);
  violetGlow.addColorStop(0, "rgba(167,139,250,0.32)");
  violetGlow.addColorStop(1, "rgba(167,139,250,0)");
  ctx.fillStyle = violetGlow;
  ctx.fillRect(0, 0, W, H);

  const limeGlow = ctx.createRadialGradient(W - 20, 20, 10, W - 20, 20, 360);
  limeGlow.addColorStop(0, "rgba(214,255,63,0.22)");
  limeGlow.addColorStop(1, "rgba(214,255,63,0)");
  ctx.fillStyle = limeGlow;
  ctx.fillRect(0, 0, W, H);

  // accent strip along the top edge
  ctx.fillStyle = ACCENT;
  ctx.fillRect(0, 0, W, 11);
  ctx.restore();

  // inner hairline
  roundRect(ctx, 18, 18, W - 36, H - 36, 36);
  ctx.strokeStyle = "rgba(255,255,255,0.10)";
  ctx.lineWidth = 2;
  ctx.stroke();

  // header microcopy
  ctx.font = `500 15px ${mono}`;
  ctx.fillStyle = "rgba(244,246,250,0.45)";
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  ctx.fillText("KP · ID 0256", 46, 70);
  ctx.textAlign = "right";
  ctx.fillText("KAMPALA · UG", W - 46, 70);

  // ---- photo panel ----
  const pw = 386;
  const ph = 452;
  const px = (W - pw) / 2;
  const py = 104;
  const pr = 24;

  ctx.save();
  roundRect(ctx, px, py, pw, ph, pr);
  ctx.clip();
  ctx.fillStyle = "#151b28";
  ctx.fillRect(px, py, pw, ph);
  if (img) drawCover(ctx, img, px, py, pw, ph, 0.53, 0.29, 0.44);
  // keep the bottom of the photo readable
  const shade = ctx.createLinearGradient(0, py + ph - 120, 0, py + ph);
  shade.addColorStop(0, "rgba(8,10,16,0)");
  shade.addColorStop(1, "rgba(8,10,16,0.55)");
  ctx.fillStyle = shade;
  ctx.fillRect(px, py + ph - 120, pw, 120);
  ctx.restore();

  roundRect(ctx, px, py, pw, ph, pr);
  ctx.strokeStyle = "rgba(214,255,63,0.55)";
  ctx.lineWidth = 3;
  ctx.stroke();

  // ---- name + role ----
  ctx.textAlign = "center";
  ctx.fillStyle = "#f4f6fa";
  ctx.font = `700 46px ${ui}`;
  ctx.fillText("KAFEERO PROFERIOUS", W / 2, 642);

  ctx.fillStyle = ACCENT;
  ctx.font = `500 18px ${mono}`;
  tracked(ctx, "SOFTWARE ENGINEER", W / 2, 686, 5);

  // dashed divider
  ctx.setLineDash([7, 9]);
  ctx.beginPath();
  ctx.moveTo(52, 722);
  ctx.lineTo(W - 52, 722);
  ctx.strokeStyle = "rgba(255,255,255,0.16)";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.setLineDash([]);

  // stack chips
  const chips = ["GO", "TS", "NEXT", "PG"];
  ctx.font = `500 16px ${mono}`;
  const gap = 12;
  const widths = chips.map((c) => ctx.measureText(c).width + 40);
  const rowWidth = widths.reduce((a, b) => a + b, 0) + gap * (chips.length - 1);
  let chipX = W / 2 - rowWidth / 2;
  const chipY = 752;
  chips.forEach((label, i) => {
    const w = widths[i];
    roundRect(ctx, chipX, chipY, w, 44, 22);
    ctx.fillStyle = i === 0 ? ACCENT : "rgba(255,255,255,0.06)";
    ctx.fill();
    ctx.strokeStyle = i === 0 ? ACCENT : "rgba(255,255,255,0.16)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = i === 0 ? "#0a0b10" : "rgba(244,246,250,0.72)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, chipX + w / 2, chipY + 23);
    ctx.textBaseline = "alphabetic";
    chipX += w + gap;
  });

  // footer: signature + barcode
  ctx.textAlign = "left";
  ctx.font = `500 14px ${mono}`;
  ctx.fillStyle = "rgba(244,246,250,0.40)";
  ctx.fillText("FULL-STACK · AI · 3D WEB", 46, 866);

  let barX = W - 214;
  for (let i = 0; i < 28; i++) {
    const barW = i % 4 === 0 ? 5 : 2;
    ctx.fillStyle = i % 6 === 0 ? "rgba(214,255,63,0.85)" : "rgba(244,246,250,0.32)";
    ctx.fillRect(barX, 838, barW, 36);
    barX += barW + 4;
  }

  return canvas;
}

/* ------------------------------------------------------------------ */
/* 3d badge                                                            */
/* ------------------------------------------------------------------ */

type Pointer = React.MutableRefObject<{ x: number; y: number }>;

function Badge({
  hover,
  setHover,
  pointer,
}: {
  hover: boolean;
  setHover: (v: boolean) => void;
  pointer: Pointer;
}) {
  const photo = useLoader(THREE.TextureLoader, "/portrait.jpg");
  const swingRef = useRef<THREE.Group>(null);
  const tiltRef = useRef<THREE.Group>(null);
  const [face, setFace] = useState<HTMLCanvasElement | null>(null);

  useCursor(hover);

  useEffect(() => {
    const img = photo.image as HTMLImageElement | undefined;
    if (!img || typeof document === "undefined") return;
    let cancelled = false;

    const build = () => {
      if (cancelled) return;
      setFace(drawCard(img));
    };

    if (img.complete) build();
    else img.addEventListener("load", build, { once: true });

    // redraw once webfonts are ready so the baked type matches the page
    document.fonts?.ready.then(build).catch(() => {});

    return () => {
      cancelled = true;
      img.removeEventListener("load", build);
    };
  }, [photo]);

  const map = useMemo(() => {
    if (!face) return null;
    const texture = new THREE.CanvasTexture(face);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    return texture;
  }, [face]);

  // Force an upload. Never dispose here: React StrictMode runs cleanup between
  // the double-invoked effects, which would kill the texture the memo reuses.
  // Intentionally no dispose-on-change: React StrictMode's double-invoked effects
  // would tear down the texture the memoised map still points at.

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const k = Math.min(1, delta * 6);

    if (swingRef.current) {
      swingRef.current.rotation.z = Math.sin(t * 0.65) * 0.05;
      swingRef.current.rotation.x = Math.sin(t * 0.5 + 0.7) * 0.028;
    }
    if (tiltRef.current) {
      const ty = pointer.current.x * 0.42;
      const tx = -pointer.current.y * 0.24;
      tiltRef.current.rotation.y += (ty - tiltRef.current.rotation.y) * k;
      tiltRef.current.rotation.x += (tx - tiltRef.current.rotation.x) * k;
    }
  });

  return (
    <group position={[0, 1.42, 0]}>
      <group ref={swingRef}>
        <group ref={tiltRef}>
          <group position={[0, -1.28, 0]}>
            {/* lanyard straps */}
            {[-1, 1].map((side) => (
              <mesh key={side} position={[side * 0.3, 0.82, -0.02]} rotation={[0, 0, side * -0.24]}>
                <boxGeometry args={[0.075, 1.28, 0.022]} />
                <meshStandardMaterial
                  color={hover ? "#d6ff3f" : "#8b7cf6"}
                  emissive={hover ? "#d6ff3f" : "#6d5bd0"}
                  emissiveIntensity={hover ? 0.6 : 0.28}
                  roughness={0.45}
                  metalness={0.15}
                />
              </mesh>
            ))}

            {/* clip */}
            <mesh position={[0, 0.2, 0]}>
              <boxGeometry args={[0.26, 0.13, 0.07]} />
              <meshStandardMaterial color="#cfd6e4" metalness={0.92} roughness={0.22} />
            </mesh>

            {/* card body */}
            <RoundedBox
              args={[CARD_W, CARD_H, CARD_D]}
              radius={0.055}
              smoothness={4}
              position={[0, -0.6, 0]}
            >
              <meshStandardMaterial
                color="#0b0e16"
                metalness={0.35}
                roughness={0.48}
                emissive={hover ? "#1c2a12" : "#0a0d14"}
                emissiveIntensity={hover ? 0.9 : 0.5}
              />
            </RoundedBox>

            {/* printed face — mounted only once the texture exists so the material
                compiles with USE_MAP from the start (a later map prop is not recompiled) */}
            {map && (
              <mesh key={map.uuid} position={[0, -0.6, CARD_D / 2 + 0.002]}>
                <planeGeometry args={[CARD_W * 0.985, CARD_H * 0.988]} />
                <meshBasicMaterial map={map} transparent toneMapped={false} />
              </mesh>
            )}

            {/* hover hit area */}
            <mesh
              position={[0, -0.6, CARD_D / 2 + 0.02]}
              onPointerOver={(e) => {
                e.stopPropagation();
                setHover(true);
              }}
              onPointerOut={() => setHover(false)}
            >
              <planeGeometry args={[CARD_W, CARD_H]} />
              <meshBasicMaterial transparent opacity={0} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

function Scene({ pointer }: { pointer: Pointer }) {
  const [hover, setHover] = useState(false);

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[3.2, 3.4, 4.6]} intensity={1.5} />
      <pointLight position={[-3, 1.4, 2.6]} intensity={2.2} color="#a78bfa" distance={9} />
      <pointLight position={[2.6, -1.8, 2.2]} intensity={1.3} color="#d6ff3f" distance={8} />
      <Float speed={1.4} rotationIntensity={0.05} floatIntensity={0.22}>
        <Badge hover={hover} setHover={setHover} pointer={pointer} />
      </Float>
    </>
  );
}

export function HeroBadge3D() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const update = (clientX: number, clientY: number) => {
      const rect = el.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((clientY - rect.top) / rect.height) * 2 - 1);
      pointer.current = {
        x: Math.max(-1, Math.min(1, x)),
        y: Math.max(-1, Math.min(1, y)),
      };
    };

    const onMove = (e: MouseEvent) => update(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      if (e.touches.length) update(e.touches[0].clientX, e.touches[0].clientY);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("touchmove", onTouch, { passive: true });
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("touchmove", onTouch);
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative h-full w-full">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0.02, 3.62], fov: 38 }}
        gl={{ alpha: true, antialias: true, stencil: false }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Scene pointer={pointer} />
        </Suspense>
      </Canvas>
    </div>
  );
}
