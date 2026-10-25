'use client';

import { Environment, Lightformer, RoundedBox, Stars } from '@react-three/drei';
import { type ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

import { type OrbitSection, sections } from '@/data/portfolio';

import { createGlowTexture, createMiniTextures, createScreenTexture } from './screen-textures';
import { orbitRuntime, saveSphereQuaternion, useOrbitStore } from './store';

/* ------------------------------------------------------------------ */
/*  ثابت‌ها و کمک‌توابع ریاضی                                            */
/* ------------------------------------------------------------------ */

export const SPHERE_R = 2.15;
const MONITOR_FLOAT = 0.36;
const ENTER_DURATION = 1.2; // ثانیه
const RETURN_DURATION = 0.95;
const MAX_TILT = 1.12; // رادیان — سقف کجی محور کره

const easeInOutCubic = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const lerp = THREE.MathUtils.lerp;

const UP = new THREE.Vector3(0, 1, 0);
const X_AXIS = new THREE.Vector3(1, 0, 0);

/** جهت و چارچوب محلی یک مانیتور روی کره از روی طول/عرض جغرافیایی */
function monitorFrame(lonDeg: number, latDeg: number) {
  const lon = THREE.MathUtils.degToRad(lonDeg);
  const lat = THREE.MathUtils.degToRad(latDeg);
  const dir = new THREE.Vector3(
    Math.cos(lat) * Math.sin(lon),
    Math.sin(lat),
    Math.cos(lat) * Math.cos(lon),
  );
  const up = UP.clone().addScaledVector(dir, -dir.y).normalize();
  const xAxis = new THREE.Vector3().crossVectors(up, dir).normalize();
  const matrix = new THREE.Matrix4().makeBasis(xAxis, up, dir);
  const quaternion = new THREE.Quaternion().setFromRotationMatrix(matrix);
  return { dir, quaternion };
}

const SECTION_FRAMES = sections.map((s) => ({ section: s, ...monitorFrame(s.lon, s.lat) }));

function baseDistance(viewportWidth: number) {
  if (viewportWidth < 560) return 9.0;
  if (viewportWidth < 1024) return 7.1;
  return 6.3;
}

/** فاصلهٔ دور در نمای آغازین — گوی باید واقعاً «از دور» دیده شود */
const INTRO_DISTANCE = 13.4;

/* ------------------------------------------------------------------ */
/*  کنترل چرخش گوی: درگ + اینرسی + بیکار + هم‌ترازی هنگام ورود          */
/* ------------------------------------------------------------------ */

function useSphereControls(group: React.RefObject<THREE.Group | null>) {
  const gl = useThree((s) => s.gl);
  const drag = useRef({
    down: false,
    pointerId: -1,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    startAt: 0,
    moved: 0,
    velYaw: 0,
    velPitch: 0,
    pendingYaw: 0,
    pendingPitch: 0,
  });
  const enterAnim = useRef<{
    from: THREE.Quaternion;
    to: THREE.Quaternion;
    /** زمان شروع با ساعت واقعی — روی دستگاه کند هم «مدت» انیمیشن درست می‌ماند
        و با حجاب CSS هم‌گام می‌شود (جمع‌کردن dt کلمپ‌شده روی FPS پایین عقب می‌افتاد) */
    startedAt: number;
    durationMs: number;
    done: boolean;
  } | null>(null);
  const returnStartedAt = useRef<number | null>(null);
  const tmpQ = useRef(new THREE.Quaternion());
  const tmpQ2 = useRef(new THREE.Quaternion());
  const tmpQ3 = useRef(new THREE.Quaternion());
  const tmpV = useRef(new THREE.Vector3());
  const tmpV2 = useRef(new THREE.Vector3());
  /** زاویه‌ای که «بازگشت» باید به آن برگردد؛ با اولین ورود قفل و با چرخش واقعی کاربر آزاد می‌شود */
  const restoreQuat = useRef<THREE.Quaternion | null>(null);

  /* --- رویدادهای اشاره‌گر روی خودِ کانواس --- */
  useEffect(() => {
    const el = gl.domElement;
    const d = drag.current;

    const onDown = (e: PointerEvent) => {
      if (useOrbitStore.getState().phase !== 'INTERACTIVE') return;
      d.down = true;
      d.pointerId = e.pointerId;
      d.startX = d.lastX = e.clientX;
      d.startY = d.lastY = e.clientY;
      d.startAt = performance.now();
      d.moved = 0;
      d.velYaw = 0;
      d.velPitch = 0;
      orbitRuntime.lastInteractionAt = performance.now();
      el.setPointerCapture(e.pointerId);
    };

    const onMove = (e: PointerEvent) => {
      if (!d.down || e.pointerId !== d.pointerId) return;
      const dx = e.clientX - d.lastX;
      const dy = e.clientY - d.lastY;
      d.lastX = e.clientX;
      d.lastY = e.clientY;
      d.moved += Math.abs(dx) + Math.abs(dy);
      const yaw = dx * 0.0052;
      const pitch = dy * 0.0052;
      d.pendingYaw += yaw;
      d.pendingPitch += pitch;
      // سرعت لحظه‌ای برای اینرسی بعد از رهاکردن (هموارسازی نمایی)
      d.velYaw = d.velYaw * 0.7 + yaw * 0.3;
      d.velPitch = d.velPitch * 0.7 + pitch * 0.3;
      orbitRuntime.lastInteractionAt = performance.now();
    };

    const onUp = (e: PointerEvent) => {
      if (!d.down || e.pointerId !== d.pointerId) return;
      d.down = false;
      const dist = Math.hypot(e.clientX - d.startX, e.clientY - d.startY);
      orbitRuntime.lastInteractionAt = performance.now();

      const st = useOrbitStore.getState();
      const g = group.current;

      // تفکیک کلیک/تپ از درگ فقط با «حرکت» انجام می‌شود، نه زمان:
      // روی دستگاه کند، فاصلهٔ تحویل pointerdown تا pointerup به زمان‌بند مرورگر
      // وابسته است و معیار زمانی، تپِ درست را رد می‌کند (در تست خودکار دیده شد).
      // فشردن و نگه‌داشتن روی خودِ یک مانیتور و رهاکردن بدون حرکت = قصد انتخاب.
      // ورود از کانواس فقط با برخورد واقعی اشاره‌گر به سطح مانیتور انجام می‌شود؛
      // هاوری که از فهرست DOM مانده باشد نباید کلیک روی فضای خالی را به ورود تبدیل کند.
      if (dist < 8 && d.moved < 12 && st.phase === 'INTERACTIVE') {
        if (st.hoveredId && !st.hoverFromDom) {
          st.beginEnter(st.hoveredId);
        } else if (st.hoverFromDom) {
          st.setHovered(null);
        }
        return;
      }

      // پایان یک چرخش واقعی → زاویهٔ فعلی برای بازگشت‌های بعدی ذخیره شود
      if (g && dist >= 7) {
        const q = g.quaternion;
        saveSphereQuaternion({ x: q.x, y: q.y, z: q.z, w: q.w });
        // کاربر زاویهٔ تازه‌ای انتخاب کرده؛ قفل زاویهٔ بازگشت قبلی آزاد می‌شود
        restoreQuat.current = null;
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (useOrbitStore.getState().phase !== 'INTERACTIVE') return;
      const step = 0.14;
      if (e.key === 'ArrowLeft') d.pendingYaw += step;
      else if (e.key === 'ArrowRight') d.pendingYaw -= step;
      else if (e.key === 'ArrowUp') d.pendingPitch += step * 0.7;
      else if (e.key === 'ArrowDown') d.pendingPitch -= step * 0.7;
      else return;
      orbitRuntime.lastInteractionAt = performance.now();
      e.preventDefault();
    };

    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
    el.addEventListener('keydown', onKey);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
      el.removeEventListener('keydown', onKey);
    };
  }, [gl, group]);

  /* --- اعمال چرخش در هر فریم --- */
  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const st = useOrbitStore.getState();
    const d = drag.current;
    const dt = Math.min(delta, 0.05);

    if (st.phase === 'ENTERING' && st.targetId) {
      if (!enterAnim.current) {
        const frame = SECTION_FRAMES.find((f) => f.section.id === st.targetId);
        if (frame) {
          // زاویهٔ قبل از ورود ذخیره می‌شود تا بازگشت دقیقاً به همان‌جا برگردد.
          // اگر ورود قبلی با Escape لغو شده و کاربر از آن موقع گوی را نچرخانده،
          // همان زاویهٔ اصلی معتبر می‌ماند (نه وضعیت نیمه‌کارهٔ وسط انیمیشن لغوشده).
          if (!restoreQuat.current) restoreQuat.current = g.quaternion.clone();
          const q = restoreQuat.current;
          saveSphereQuaternion({ x: q.x, y: q.y, z: q.z, w: q.w });
          enterAnim.current = {
            // انیمیشن همیشه از وضعیت بصری فعلی شروع می‌شود (بدون پرش)
            from: g.quaternion.clone(),
            // معکوس چارچوب محلی مانیتور = چرخشی که مانیتور را روبه‌روی دوربین و بدون رول قرار می‌دهد
            to: frame.quaternion.clone().invert(),
            startedAt: performance.now(),
            durationMs: (st.reducedMotion ? 0.35 : ENTER_DURATION) * 1000,
            done: false,
          };
        }
      }
      const anim = enterAnim.current;
      if (anim && !anim.done) {
        const t = clamp01((performance.now() - anim.startedAt) / anim.durationMs);
        orbitRuntime.enterProgress = t;
        // هم‌ترازی مانیتور در ۶۲٪ اول مسیر تمام می‌شود؛ بقیه مخصوص حرکت دوربین است
        const slerpT = easeInOutCubic(clamp01(t / 0.62));
        g.quaternion.slerpQuaternions(anim.from, anim.to, slerpT);
        if (t >= 1) {
          anim.done = true;
          orbitRuntime.onEnterComplete?.();
        }
      }
      return;
    }
    enterAnim.current = null;

    if (st.phase === 'RETURNING') {
      if (returnStartedAt.current === null) returnStartedAt.current = performance.now();
      const t = clamp01((performance.now() - returnStartedAt.current) / (RETURN_DURATION * 1000));
      orbitRuntime.returnProgress = t;
      if (t >= 1) {
        returnStartedAt.current = null;
        orbitRuntime.returnProgress = 0;
        st.setPhase('INTERACTIVE');
      }
      return;
    }

    if (st.phase !== 'INTERACTIVE') {
      // در نمای دور و حین نزدیک‌شدن، گوی خیلی آرام می‌چرخد تا زنده به نظر برسد
      if (!st.reducedMotion) {
        tmpQ.current.setFromAxisAngle(UP, dt * 0.05);
        g.quaternion.premultiply(tmpQ.current);
      }
      return;
    }

    /* INTERACTIVE: درگ / اینرسی / بیکار */
    let yaw = d.pendingYaw;
    let pitch = d.pendingPitch;
    d.pendingYaw = 0;
    d.pendingPitch = 0;

    if (!d.down) {
      // اینرسی با میرایی نمایی (مستقل از نرخ فریم)
      const decay = Math.exp(-dt * 3.2);
      yaw += d.velYaw * (dt * 60);
      pitch += d.velPitch * (dt * 60);
      d.velYaw *= decay;
      d.velPitch *= decay;
      if (Math.abs(d.velYaw) < 0.00005) d.velYaw = 0;
      if (Math.abs(d.velPitch) < 0.00005) d.velPitch = 0;

      // چرخش خودکار بسیار آرام بعد از ۳.۵ ثانیه بیکاری
      const idleFor = performance.now() - orbitRuntime.lastInteractionAt;
      if (!st.reducedMotion && idleFor > 3500 && !st.hoveredId) {
        yaw += dt * 0.045;
      }
    }

    if (yaw !== 0 || pitch !== 0) {
      const qYaw = tmpQ.current.setFromAxisAngle(UP, yaw);
      const qPitch = tmpQ2.current.setFromAxisAngle(X_AXIS, pitch);
      // کجی فعلی محور گوی را بسنج؛ اگر پیچ بیشتر از سقف شد فقط یاو اعمال شود
      const candidate = tmpQ3.current.copy(qYaw).multiply(qPitch).multiply(g.quaternion);
      const tiltedUp = tmpV.current.copy(UP).applyQuaternion(candidate);
      const tilt = Math.acos(THREE.MathUtils.clamp(tiltedUp.y, -1, 1));
      const currentUp = tmpV2.current.copy(UP).applyQuaternion(g.quaternion);
      const currentTilt = Math.acos(THREE.MathUtils.clamp(currentUp.y, -1, 1));

      if (tilt <= MAX_TILT || tilt < currentTilt) {
        g.quaternion.copy(candidate);
      } else {
        g.quaternion.premultiply(qYaw);
      }
    }
  });
}

/* ------------------------------------------------------------------ */
/*  ریگ دوربین — تنها مالک دوربین در کل صحنه                              */
/* ------------------------------------------------------------------ */

function CameraRig() {
  const pos = useRef(new THREE.Vector3(0, 1.6, INTRO_DISTANCE));
  const lookTarget = useRef(new THREE.Vector3(0, 0.05, 0));
  const inited = useRef(false);

  useFrame((state, delta) => {
    // دوربین عمداً به‌صورت دستوری (imperative) در حلقهٔ فریم کنترل می‌شود؛
    // در R3F این الگوی استاندارد انیمیشن دوربین است و از state خودِ فریم خوانده می‌شود.
    const camera = state.camera as THREE.PerspectiveCamera;
    const st = useOrbitStore.getState();
    const dt = Math.min(delta, 0.05);
    const base = baseDistance(state.size.width);

    // نقطهٔ شروع دوربین به فاز آغازین بستگی دارد:
    // در بازگشت باید از «داخل مانیتور» (نزدیک) شروع کنیم و عقب بنشینیم، نه از دوردست.
    if (!inited.current) {
      inited.current = true;
      if (st.phase === 'RETURNING') pos.current.set(0, 0, 3.4);
      else if (st.phase === 'INTERACTIVE') pos.current.set(0, 0.35, base);
      camera.position.copy(pos.current);
    }

    let targetDist = base;
    let targetY = 0.35;
    let targetFov = 42;
    let targetZ: number | null = null;

    switch (st.phase) {
      case 'INTRO':
      case 'APPROACH': {
        const p = easeOutCubic(clamp01(orbitRuntime.scrollProgress));
        targetDist = lerp(INTRO_DISTANCE, base, p);
        targetY = lerp(1.6, 0.35, p);
        targetFov = lerp(46, 42, p);
        break;
      }
      case 'INTERACTIVE':
        targetDist = base;
        break;
      case 'RETURNING': {
        const p = easeOutCubic(clamp01(orbitRuntime.returnProgress));
        targetDist = lerp(3.4, base, p);
        targetY = lerp(0, 0.35, p);
        break;
      }
      case 'ENTERING': {
        const t = clamp01(orbitRuntime.enterProgress);
        // فاز A: کمی نزدیک‌تر شدن حین هم‌ترازی — فاز B: شیرجه به داخل مانیتور
        const diveT = easeInOutCubic(clamp01((t - 0.38) / 0.62));
        const monitorZ = SPHERE_R + MONITOR_FLOAT; // بعد از هم‌ترازی، مانیتور روی محور +Z است
        targetZ = lerp(base, monitorZ + 0.52, diveT);
        targetY = lerp(0.35, 0, diveT);
        targetFov = lerp(42, 50, diveT);
        break;
      }
    }

    // پارالاکس ملایم نشانگر فقط در فازهای آرام
    const parallax =
      (st.phase === 'INTRO' || st.phase === 'APPROACH') && !st.reducedMotion ? state.pointer : null;
    const px = parallax ? parallax.x * 0.45 : 0;
    const py = parallax ? parallax.y * 0.25 : 0;

    const desired = new THREE.Vector3(px, targetY + py, targetZ ?? targetDist);
    const speed = st.phase === 'ENTERING' ? 14 : 4.2;
    pos.current.lerp(desired, 1 - Math.exp(-dt * speed));
    camera.position.copy(pos.current);
    camera.lookAt(lookTarget.current);

    if (Math.abs(camera.fov - targetFov) > 0.05) {
      camera.fov = lerp(camera.fov, targetFov, 1 - Math.exp(-dt * 6));
      camera.updateProjectionMatrix();
    }
  });

  return null;
}

/* ------------------------------------------------------------------ */
/*  یک مانیتور اصلی قابل‌انتخاب                                          */
/* ------------------------------------------------------------------ */

interface MonitorProps {
  section: OrbitSection;
  dir: THREE.Vector3;
  quaternion: THREE.Quaternion;
  screen: ReturnType<typeof createScreenTexture>;
  glowTexture: THREE.CanvasTexture;
}

function Monitor({ section, dir, quaternion, screen, glowTexture }: MonitorProps) {
  const root = useRef<THREE.Group>(null);
  const screenMat = useRef<THREE.MeshBasicMaterial>(null);
  const glowMat = useRef<THREE.MeshBasicMaterial>(null);
  const frameMat = useRef<THREE.MeshStandardMaterial>(null);
  const hoverBlend = useRef(0);
  // فاز شناوری قطعی از روی شناسهٔ بخش — رندر باید خالص و قابل تکرار باشد
  const bobPhase = useMemo(
    () => ([...section.id].reduce((a, c) => a + c.charCodeAt(0), 0) % 628) / 100,
    [section.id],
  );

  const neckQuaternion = useMemo(() => new THREE.Quaternion().setFromUnitVectors(UP, dir), [dir]);
  const neckPos = useMemo(() => dir.clone().multiplyScalar(SPHERE_R + MONITOR_FLOAT / 2), [dir]);
  const basePos = useMemo(() => dir.clone().multiplyScalar(SPHERE_R + MONITOR_FLOAT), [dir]);

  const onPointerHit = (e: ThreeEvent<PointerEvent>) => {
    const st = useOrbitStore.getState();
    if (st.phase !== 'INTERACTIVE') return;
    // فقط نزدیک‌ترین برخورد واقعی به سطح مانیتور معتبر است
    e.stopPropagation();
    st.setHovered(section.id, false);
    document.body.style.cursor = 'pointer';
  };

  const onPointerOut = () => {
    const st = useOrbitStore.getState();
    if (st.hoveredId === section.id) st.setHovered(null);
    document.body.style.cursor = '';
  };

  useFrame((state, delta) => {
    const g = root.current;
    if (!g) return;
    const st = useOrbitStore.getState();
    const isHovered = st.hoveredId === section.id && st.phase === 'INTERACTIVE';
    const isTarget = st.targetId === section.id && st.phase === 'ENTERING';
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;

    const target = isHovered || isTarget ? 1 : 0;
    hoverBlend.current = lerp(hoverBlend.current, target, 1 - Math.exp(-dt * 10));
    const hb = hoverBlend.current;

    // شناوری ملایم + بیرون‌آمدن مانیتور انتخاب‌شده به سمت دوربین
    const bob = st.reducedMotion ? 0 : Math.sin(t * 0.9 + bobPhase) * 0.018;
    const lift = hb * 0.09;
    g.position.copy(dir).multiplyScalar(SPHERE_R + MONITOR_FLOAT + bob + lift);
    const s = 1 + hb * 0.07;
    g.scale.setScalar(s);

    // هنگام ورود، بقیهٔ مانیتورها محو و تاریک می‌شوند
    const enteringOther = st.phase === 'ENTERING' && !isTarget;
    const dim = enteringOther ? 1 - easeInOutCubic(clamp01(orbitRuntime.enterProgress)) * 0.88 : 1;

    if (screenMat.current) {
      const boost = 1 + hb * 0.35;
      screenMat.current.color.setScalar(boost * dim);
      screenMat.current.opacity = 0.35 + 0.65 * dim;
    }
    if (frameMat.current) {
      frameMat.current.emissiveIntensity = hb * 0.55 * dim;
      frameMat.current.opacity = 0.3 + 0.7 * dim;
    }
    if (glowMat.current) {
      // بافت شعاعی خودش آلفای پایینی دارد؛ ضریب کلی بزرگ‌تر است تا هاله دیده شود
      glowMat.current.opacity = (0.55 + hb * 1.9) * dim;
    }
  });

  return (
    <>
      {/* گردن اتصال مانیتور به بدنهٔ کره */}
      <mesh position={neckPos} quaternion={neckQuaternion} raycast={() => null}>
        <cylinderGeometry args={[0.035, 0.055, MONITOR_FLOAT + 0.06, 10]} />
        <meshStandardMaterial color="#1a1d24" metalness={0.85} roughness={0.35} />
      </mesh>

      <group ref={root} position={basePos} quaternion={quaternion}>
        {/* قاب */}
        <RoundedBox
          args={[1.26, 0.82, 0.07]}
          radius={0.035}
          smoothness={4}
          castShadow
          onPointerMove={onPointerHit}
          onPointerDown={onPointerHit}
          onPointerOut={onPointerOut}
        >
          <meshStandardMaterial
            ref={frameMat}
            color="#14161d"
            metalness={0.75}
            roughness={0.32}
            emissive="#C7FF4A"
            emissiveIntensity={0}
            transparent
          />
        </RoundedBox>

        {/* صفحهٔ زنده */}
        <mesh
          position={[0, 0, 0.042]}
          onPointerMove={onPointerHit}
          onPointerDown={onPointerHit}
          onPointerOut={onPointerOut}
        >
          <planeGeometry args={[1.14, 0.71]} />
          <meshBasicMaterial ref={screenMat} map={screen.texture} toneMapped={false} transparent />
        </mesh>

        {/* هالهٔ نور صفحه — با بافت شعاعی تا لبهٔ مربعی دیده نشود */}
        <mesh position={[0, 0, 0.09]} raycast={() => null}>
          <planeGeometry args={[2.1, 1.45]} />
          <meshBasicMaterial
            ref={glowMat}
            map={glowTexture}
            color="#C7FF4A"
            transparent
            opacity={0.05}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>

        {/* نوار نور زیر قاب */}
        <mesh position={[0, -0.45, 0]} raycast={() => null}>
          <boxGeometry args={[0.5, 0.018, 0.02]} />
          <meshBasicMaterial color="#C7FF4A" toneMapped={false} transparent opacity={0.55} />
        </mesh>
      </group>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  مینی‌مانیتورهای تزئینی — حس «کرهٔ پوشیده از صفحه»                    */
/* ------------------------------------------------------------------ */

function MiniMonitors({ textures }: { textures: THREE.CanvasTexture[] }) {
  const items = useMemo(() => {
    const result: Array<{
      pos: THREE.Vector3;
      quat: THREE.Quaternion;
      w: number;
      tex: number;
    }> = [];
    const N = 26;
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = golden * i;
      const dir = new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r);
      // نزدیک مانیتورهای اصلی چیزی نگذار تا خوانایی آن‌ها خراب نشود
      const tooClose = SECTION_FRAMES.some((f) => f.dir.angleTo(dir) < 0.52);
      if (tooClose || Math.abs(dir.y) > 0.86) continue;
      const up = UP.clone().addScaledVector(dir, -dir.y).normalize();
      const xA = new THREE.Vector3().crossVectors(up, dir).normalize();
      const quat = new THREE.Quaternion().setFromRotationMatrix(
        new THREE.Matrix4().makeBasis(xA, up, dir),
      );
      result.push({
        pos: dir.clone().multiplyScalar(SPHERE_R + 0.13 + (i % 3) * 0.05),
        quat,
        w: 0.3 + (i % 4) * 0.045,
        tex: i % 3,
      });
    }
    return result;
  }, []);

  return (
    <group>
      {items.map((it, i) => (
        <group key={i} position={it.pos} quaternion={it.quat}>
          <mesh raycast={() => null}>
            <boxGeometry args={[it.w + 0.03, it.w * 0.66 + 0.03, 0.03]} />
            <meshStandardMaterial color="#101218" metalness={0.7} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0, 0.018]} raycast={() => null}>
            <planeGeometry args={[it.w, it.w * 0.66]} />
            <meshBasicMaterial
              map={textures[it.tex]}
              toneMapped={false}
              transparent
              opacity={0.8}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  تزئینات فضایی: حلقه‌های مدار، قطعات شناور، هاله                       */
/* ------------------------------------------------------------------ */

function OrbitDecor() {
  const rings = useRef<THREE.Group>(null);
  const shards = useRef<THREE.Group>(null);
  const glowTex = useMemo(() => createGlowTexture(), []);
  useEffect(() => () => glowTex.dispose(), [glowTex]);

  const shardData = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2 + 0.35;
        const rad = 3.35 + (i % 4) * 0.3;
        return {
          pos: new THREE.Vector3(Math.cos(a) * rad, Math.sin(i * 2.3) * 0.95, Math.sin(a) * rad),
          scale: 0.035 + (i % 3) * 0.018,
          rot: new THREE.Euler(i * 0.7, i * 1.1, i * 0.4),
        };
      }),
    [],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const reduced = useOrbitStore.getState().reducedMotion;
    if (reduced) return;
    if (rings.current) {
      rings.current.rotation.y = t * 0.03;
      rings.current.rotation.z = Math.sin(t * 0.1) * 0.04;
    }
    if (shards.current) {
      shards.current.rotation.y = -t * 0.02;
      shards.current.position.y = Math.sin(t * 0.4) * 0.05;
    }
  });

  return (
    <>
      {/* هالهٔ نوری پشت کره */}
      <sprite scale={[8.4, 8.4, 1]} position={[0, 0.2, -1.6]}>
        <spriteMaterial
          map={glowTex}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>

      <group ref={rings}>
        <mesh rotation={[Math.PI / 2.25, 0, 0.35]} raycast={() => null}>
          <torusGeometry args={[3.25, 0.0045, 8, 220]} />
          <meshBasicMaterial color="#3d434f" transparent opacity={0.65} toneMapped={false} />
        </mesh>
        <mesh rotation={[Math.PI / 1.78, 0.3, -0.2]} raycast={() => null}>
          <torusGeometry args={[3.62, 0.0035, 8, 220]} />
          <meshBasicMaterial color="#C7FF4A" transparent opacity={0.16} toneMapped={false} />
        </mesh>
        {/* گره‌های نوری روی مدار */}
        {[0.4, 2.4, 4.4].map((a) => (
          <mesh
            key={a}
            position={[Math.cos(a) * 3.25, Math.sin(a * 2) * 0.72, Math.sin(a) * 3.25]}
            raycast={() => null}
          >
            <sphereGeometry args={[0.022, 10, 10]} />
            <meshBasicMaterial color="#C7FF4A" toneMapped={false} />
          </mesh>
        ))}
      </group>

      <group ref={shards}>
        {shardData.map((s, i) => (
          <mesh key={i} position={s.pos} rotation={s.rot} scale={s.scale} raycast={() => null}>
            <tetrahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color="#454e5e"
              metalness={0.85}
              roughness={0.35}
              envMapIntensity={1.6}
              flatShading
              transparent
              opacity={0.85}
            />
          </mesh>
        ))}
      </group>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  صحنهٔ کامل                                                           */
/* ------------------------------------------------------------------ */

export interface OrbitSceneProps {
  initialQuaternion: { x: number; y: number; z: number; w: number } | null;
  lowPower: boolean;
}

export function OrbitScene({ initialQuaternion, lowPower }: OrbitSceneProps) {
  const group = useRef<THREE.Group>(null);
  const coreMat = useRef<THREE.MeshPhysicalMaterial>(null);
  const lastRedraw = useRef(0);

  const screens = useMemo(() => new Map(sections.map((s) => [s.id, createScreenTexture(s)])), []);
  const miniTextures = useMemo(() => createMiniTextures(), []);
  const glowTexture = useMemo(() => createGlowTexture(), []);

  useEffect(() => {
    if (group.current && initialQuaternion) {
      group.current.quaternion.set(
        initialQuaternion.x,
        initialQuaternion.y,
        initialQuaternion.z,
        initialQuaternion.w,
      );
    }
    orbitRuntime.lastInteractionAt = performance.now();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(
    () => () => {
      screens.forEach((s) => s.dispose());
      miniTextures.forEach((t) => t.dispose());
      glowTexture.dispose();
      // اگر موقع خروج نشانگر روی مانیتور بوده، سبک نشانگر جهانی را پس بده
      document.body.style.cursor = '';
    },
    [screens, miniTextures, glowTexture],
  );

  useSphereControls(group);

  // بازنقاشی صفحه‌های مانیتور با نرخ محدود (محتوای زنده ولی ارزان)
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (t - lastRedraw.current < 0.14) return;
    lastRedraw.current = t;
    const st = useOrbitStore.getState();
    screens.forEach((screen, id) => {
      screen.draw(t, st.hoveredId === id || st.targetId === id);
    });

    // هنگام ورود هستهٔ گوی تاریک‌تر می‌شود تا تمرکز روی مانیتور هدف بماند
    if (coreMat.current) {
      const entering = st.phase === 'ENTERING';
      const p = entering ? easeInOutCubic(clamp01(orbitRuntime.enterProgress)) : 0;
      coreMat.current.envMapIntensity = lerp(coreMat.current.envMapIntensity, 1.25 - p * 0.9, 0.12);
    }
  });

  return (
    <>
      <fog attach="fog" args={['#07080B', 11, 34]} />
      <ambientLight intensity={0.26} />
      {/* برق ملایم روبه‌رو تا حجم کره در مرکز قاب هم خوانده شود */}
      <pointLight position={[0, 1.4, 9]} intensity={7} color="#dfe6ee" distance={28} decay={2} />
      <directionalLight
        position={[5, 4, 5]}
        intensity={1.6}
        color="#fff4e0"
        castShadow={!lowPower}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-bias={-0.0004}
      />
      <directionalLight position={[-6, -2, -3]} intensity={0.5} color="#9FD8E8" />
      {/* نور زیرین لایم — ملایم؛ شدت بالا روی بدنه لکهٔ سبز می‌ساخت */}
      <pointLight
        position={[0, -4.2, 2.2]}
        intensity={2.4}
        color="#C7FF4A"
        distance={11}
        decay={2}
      />

      {/* نور محیطی سینمایی بدون هیچ فایل خارجی (صحنهٔ مجازی نورسازها) */}
      <Environment resolution={256} frames={1}>
        <group rotation={[-Math.PI / 3, 0, 0]}>
          <Lightformer form="circle" intensity={3.2} position={[0, 5, -9]} scale={1.6} />
          <Lightformer intensity={1.8} position={[-5, 1, -1]} scale={[2.6, 0.7]} color="#9FD8E8" />
          <Lightformer intensity={1.3} position={[5, 0, 0]} scale={[2.4, 0.6]} color="#C7FF4A" />
          <Lightformer intensity={1.2} position={[0, -5, 2]} scale={[4, 1]} color="#F1F0EB" />
        </group>
      </Environment>

      <Stars
        radius={55}
        depth={35}
        count={lowPower ? 1200 : 2600}
        factor={3.2}
        saturation={0}
        fade
        speed={0.6}
      />

      <CameraRig />
      <OrbitDecor />

      <group ref={group}>
        {/* هستهٔ کره — فلز تیرهٔ براق؛ انعکاس محیطی شخصیت اصلی آن را می‌سازد */}
        <mesh receiveShadow raycast={() => null}>
          <sphereGeometry args={[SPHERE_R, 64, 64]} />
          <meshPhysicalMaterial
            ref={coreMat}
            color="#0d1016"
            metalness={0.95}
            roughness={0.27}
            clearcoat={0.7}
            clearcoatRoughness={0.32}
            envMapIntensity={1.25}
          />
        </mesh>
        {/* شبکهٔ هندسی بسیار ظریف — فقط یک لایه، درشت و کم‌رنگ
            تا کره «هولوگرام وایرفریم» به نظر نرسد */}
        <mesh raycast={() => null}>
          <icosahedronGeometry args={[SPHERE_R + 0.03, 2]} />
          <meshBasicMaterial
            color="#8a93a5"
            wireframe
            transparent
            opacity={0.045}
            toneMapped={false}
          />
        </mesh>

        <MiniMonitors textures={miniTextures} />

        {SECTION_FRAMES.map(({ section, dir, quaternion }) => (
          <Monitor
            key={section.id}
            section={section}
            dir={dir}
            quaternion={quaternion}
            screen={screens.get(section.id)!}
            glowTexture={glowTexture}
          />
        ))}
      </group>
    </>
  );
}
