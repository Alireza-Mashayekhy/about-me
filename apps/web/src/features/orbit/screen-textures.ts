import * as THREE from 'three';

import type { OrbitSection } from '@/data/portfolio';

/**
 * محتوای زندهٔ مانیتورها با CanvasTexture ساخته می‌شود:
 * - روی سطح واقعی سه‌بعدی می‌نشیند و با پرسپکتیو هماهنگ است
 * - بدون هزینهٔ همگام‌سازی DOM (برخلاف Html) روی موبایل هم سبک می‌ماند
 * - متن‌های مهم فقط اینجا نیستند؛ همهٔ آن‌ها در DOM صفحه هم هستند (دسترس‌پذیری)
 */

const W = 640;
const H = 400;

const C = {
  bg: '#0B0D12',
  bgSoft: '#10131A',
  ink: '#F1F0EB',
  dim: '#777D88',
  faint: '#2A2E38',
  lime: '#C7FF4A',
  ice: '#9FD8E8',
} as const;

export interface ScreenTexture {
  texture: THREE.CanvasTexture;
  /** بازنقاشی با زمان (ثانیه) و وضعیت هایلایت */
  draw: (t: number, highlighted: boolean) => void;
  dispose: () => void;
}

function baseScene(ctx: CanvasRenderingContext2D, section: OrbitSection, highlighted: boolean) {
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, W, H);

  // شبکهٔ بسیار ظریف پس‌زمینه
  ctx.strokeStyle = 'rgba(241,240,235,0.045)';
  ctx.lineWidth = 1;
  for (let x = 32; x < W; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }

  // نوار بالایی: شاخص بخش + سه نقطهٔ پنجره
  ctx.fillStyle = C.bgSoft;
  ctx.fillRect(0, 0, W, 44);
  ctx.fillStyle = highlighted ? C.lime : C.faint;
  ctx.fillRect(0, 43, W, 1);

  ctx.font = '600 15px ui-monospace, Menlo, monospace';
  ctx.fillStyle = C.dim;
  ctx.textBaseline = 'middle';
  ctx.fillText(`ORBIT / ${section.index}`, 18, 23);

  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(W - 22 - i * 20, 22, 4, 0, Math.PI * 2);
    ctx.fillStyle = i === 0 && highlighted ? C.lime : C.faint;
    ctx.fill();
  }
}

function footer(
  ctx: CanvasRenderingContext2D,
  section: OrbitSection,
  t: number,
  highlighted: boolean,
) {
  // برچسب انگلیسی بزرگ
  ctx.font = '800 44px ui-monospace, Menlo, monospace';
  ctx.fillStyle = C.ink;
  const label = section.labelEn;
  ctx.fillText(label, 26, H - 92);

  // خط لهجه
  ctx.fillStyle = highlighted ? C.lime : C.faint;
  ctx.fillRect(28, H - 62, highlighted ? 150 : 56, 3);

  // برچسب فارسی (چینش راست)
  ctx.direction = 'rtl';
  ctx.font = '700 27px Vazirmatn, Tahoma, sans-serif';
  ctx.fillStyle = highlighted ? C.lime : C.dim;
  ctx.textAlign = 'right';
  ctx.fillText(section.labelFa, W - 26, H - 46);
  ctx.direction = 'ltr';
  ctx.textAlign = 'left';

  // وضعیت زنده: چشمک‌زن
  const blink = Math.sin(t * 2.4) > 0;
  ctx.beginPath();
  ctx.arc(34, H - 34, 4, 0, Math.PI * 2);
  ctx.fillStyle = blink ? C.lime : C.faint;
  ctx.fill();
  ctx.font = '500 13px ui-monospace, Menlo, monospace';
  ctx.fillStyle = C.dim;
  ctx.fillText(highlighted ? 'CLICK TO ENTER_' : 'SIGNAL LIVE', 48, H - 33);
}

/* --- نقاشی اختصاصی هر بخش ------------------------------------------ */

function drawAbout(ctx: CanvasRenderingContext2D, t: number) {
  // مونوگرام
  ctx.strokeStyle = C.faint;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(92, 128, 44, 0, Math.PI * 2);
  ctx.stroke();
  ctx.font = '800 36px ui-monospace, Menlo, monospace';
  ctx.fillStyle = C.ink;
  ctx.fillText('AM', 62, 130);

  ctx.font = '700 21px ui-monospace, Menlo, monospace';
  ctx.fillText('ALIREZA MASHAYEKHY', 168, 108);
  ctx.font = '500 15px ui-monospace, Menlo, monospace';
  ctx.fillStyle = C.dim;
  ctx.fillText('FULL-STACK WEB DEVELOPER', 168, 134);
  ctx.fillText('~6 YEARS OF EXPERIENCE', 168, 158);

  // خطوط شبه‌کد
  const lines = [300, 240, 330, 180];
  lines.forEach((len, i) => {
    const y = 208 + i * 22;
    ctx.fillStyle = i === Math.floor(t * 0.7) % 4 ? 'rgba(199,255,74,0.5)' : C.faint;
    ctx.fillRect(28, y, 14, 5);
    ctx.fillStyle = C.faint;
    ctx.fillRect(52, y, len, 5);
  });
}

function drawSkills(ctx: CanvasRenderingContext2D, t: number) {
  const rows: ReadonlyArray<readonly [string, number]> = [
    ['FRONTEND', 9],
    ['BACKEND', 7],
    ['DATA / STATE', 6],
    ['SEO / TOOLS', 5],
  ];
  rows.forEach(([label, ticks], r) => {
    const y = 96 + r * 48;
    ctx.font = '600 16px ui-monospace, Menlo, monospace';
    ctx.fillStyle = C.dim;
    ctx.fillText(label, 28, y);
    const active = (Math.floor(t * 1.4) + r) % 10;
    for (let i = 0; i < 10; i++) {
      ctx.fillStyle = i < ticks ? (i === active ? C.lime : 'rgba(241,240,235,0.55)') : C.faint;
      ctx.fillRect(250 + i * 34, y - 6, 24, 10);
    }
  });
}

function drawWork(ctx: CanvasRenderingContext2D, t: number) {
  const tiles = ['EK', 'ZP', 'DM', 'TB'] as const;
  const domains = ['ekosesin.com', 'zoppinico.com', 'darmind.ir', 'tabeshedu.ir'] as const;
  tiles.forEach((mark, i) => {
    const x = 28 + (i % 2) * 300;
    const y = 72 + Math.floor(i / 2) * 108;
    const hot = Math.floor(t * 0.8) % 4 === i;
    ctx.fillStyle = C.bgSoft;
    ctx.fillRect(x, y, 284, 92);
    ctx.strokeStyle = hot ? C.lime : C.faint;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, 284, 92);
    ctx.font = '800 30px ui-monospace, Menlo, monospace';
    ctx.fillStyle = hot ? C.lime : C.ink;
    ctx.fillText(mark, x + 18, y + 38);
    ctx.font = '500 14px ui-monospace, Menlo, monospace';
    ctx.fillStyle = C.dim;
    ctx.fillText(domains[i]!, x + 18, y + 66);
  });
}

function drawApproach(ctx: CanvasRenderingContext2D, t: number) {
  const steps = ['01', '02', '03', '04'];
  const y = 150;
  const x0 = 70;
  const dx = 165;
  ctx.strokeStyle = C.faint;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x0, y);
  ctx.lineTo(x0 + dx * 3, y);
  ctx.stroke();
  // پالس جاری روی خط
  const px = x0 + ((t * 60) % (dx * 3));
  ctx.beginPath();
  ctx.arc(px, y, 4, 0, Math.PI * 2);
  ctx.fillStyle = C.lime;
  ctx.fill();
  steps.forEach((s, i) => {
    const x = x0 + i * dx;
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fillStyle = C.bg;
    ctx.fill();
    ctx.strokeStyle = px >= x - 4 ? C.lime : C.faint;
    ctx.stroke();
    ctx.font = '700 17px ui-monospace, Menlo, monospace';
    ctx.fillStyle = C.ink;
    ctx.fillText(s, x - 10, y + 1);
  });
  ctx.font = '500 15px ui-monospace, Menlo, monospace';
  ctx.fillStyle = C.dim;
  ctx.fillText('DISCOVER → BUILD → VERIFY → EVOLVE', 28, 222);
}

function drawExpertise(ctx: CanvasRenderingContext2D, t: number) {
  const chips = ['REACT', 'NEXT.JS', 'VUE', 'NODE', 'NESTJS', 'API', 'SEO', 'DOCKER'] as const;
  chips.forEach((chip, i) => {
    const x = 28 + (i % 4) * 152;
    const y = 84 + Math.floor(i / 4) * 64;
    const hot = Math.floor(t * 1.2) % 8 === i;
    ctx.strokeStyle = hot ? C.lime : C.faint;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, 134, 46);
    ctx.font = '700 17px ui-monospace, Menlo, monospace';
    ctx.fillStyle = hot ? C.lime : C.ink;
    ctx.fillText(chip, x + 14, y + 24);
  });
  ctx.font = '500 15px ui-monospace, Menlo, monospace';
  ctx.fillStyle = C.dim;
  ctx.fillText('FRONTEND × BACKEND × PRODUCT', 28, 240);
}

function drawContact(ctx: CanvasRenderingContext2D, t: number) {
  // پاکت نامهٔ خطی
  const x = 60;
  const y = 84;
  const w = 180;
  const h = 116;
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 2.5;
  ctx.strokeRect(x, y, w, h);
  ctx.beginPath();
  ctx.moveTo(x, y + 6);
  ctx.lineTo(x + w / 2, y + h * 0.62);
  ctx.lineTo(x + w, y + 6);
  ctx.stroke();
  // موج سیگنال
  for (let i = 0; i < 3; i++) {
    const r = 26 + i * 26 + Math.sin(t * 2 + i) * 3;
    ctx.beginPath();
    ctx.arc(x + w + 110, y + h / 2, r, -0.8, 0.8);
    ctx.strokeStyle = i === Math.floor(t * 1.5) % 3 ? C.lime : C.faint;
    ctx.lineWidth = 3;
    ctx.stroke();
  }
  ctx.font = '500 16px ui-monospace, Menlo, monospace';
  ctx.fillStyle = C.dim;
  ctx.fillText('OPEN CHANNEL — SAY HELLO', 28, 244);
}

const painters: Record<OrbitSection['id'], (ctx: CanvasRenderingContext2D, t: number) => void> = {
  about: drawAbout,
  skills: drawSkills,
  work: drawWork,
  approach: drawApproach,
  expertise: drawExpertise,
  contact: drawContact,
};

export function createScreenTexture(section: OrbitSection): ScreenTexture {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;

  const draw = (t: number, highlighted: boolean) => {
    baseScene(ctx, section, highlighted);
    painters[section.id](ctx, t);
    footer(ctx, section, t, highlighted);
    texture.needsUpdate = true;
  };

  draw(0, false);

  return {
    texture,
    draw,
    dispose: () => texture.dispose(),
  };
}

/* --- بافت‌های مینی‌مانیتورهای تزئینی (استاتیک، اشتراکی) ---------------- */

export function createMiniTextures(): THREE.CanvasTexture[] {
  const kinds = ['code', 'chart', 'grid'] as const;
  return kinds.map((kind) => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 160;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#0C0E13';
    ctx.fillRect(0, 0, 256, 160);
    ctx.fillStyle = C.faint;
    ctx.fillRect(0, 0, 256, 18);

    if (kind === 'code') {
      for (let i = 0; i < 7; i++) {
        const w = 60 + ((i * 47) % 140);
        ctx.fillStyle = i % 3 === 0 ? 'rgba(199,255,74,0.45)' : 'rgba(119,125,136,0.6)';
        ctx.fillRect(14 + (i % 2) * 12, 34 + i * 16, w, 5);
      }
    } else if (kind === 'chart') {
      ctx.strokeStyle = 'rgba(159,216,232,0.8)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x <= 228; x += 12) {
        const y = 110 - Math.sin(x * 0.05) * 26 - x * 0.18;
        if (x === 0) ctx.moveTo(14, y);
        else ctx.lineTo(14 + x, y);
      }
      ctx.stroke();
      ctx.fillStyle = 'rgba(241,240,235,0.25)';
      for (let i = 0; i < 6; i++) ctx.fillRect(14 + i * 38, 130, 22, 4);
    } else {
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 6; c++) {
          ctx.fillStyle = (r * 6 + c) % 5 === 0 ? 'rgba(199,255,74,0.5)' : 'rgba(119,125,136,0.35)';
          ctx.fillRect(14 + c * 38, 32 + r * 28, 28, 18);
        }
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  });
}

/** بافت شعاعی نرم برای هالهٔ نور اطراف گوی */
export function createGlowTexture(): THREE.CanvasTexture {
  const s = 256;
  const canvas = document.createElement('canvas');
  canvas.width = s;
  canvas.height = s;
  const ctx = canvas.getContext('2d')!;
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, 'rgba(241,240,235,0.20)');
  g.addColorStop(0.35, 'rgba(199,255,74,0.07)');
  g.addColorStop(0.7, 'rgba(159,216,232,0.03)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
