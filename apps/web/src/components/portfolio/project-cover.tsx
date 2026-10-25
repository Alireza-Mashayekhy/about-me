import type { Project } from '@/data/portfolio';

/**
 * کاور رویه‌ای پروژه‌ها — به‌جای اسکرین‌شات جعلی.
 * برای هر پروژه از روی slug یک ترکیب‌بندی قطعی ساخته می‌شود:
 * شبکه، مدار، گونه‌های هندسی و تایپوگرافی دامنه.
 * هر وقت اسکرین‌شات واقعی آماده شد، می‌توان آن را جایگزین این کامپوننت کرد.
 */
export function ProjectCover({ project, large = false }: { project: Project; large?: boolean }) {
  const seed = [...project.slug].reduce((a, c) => a + c.charCodeAt(0), 0);
  const bars = Array.from({ length: 7 }, (_, i) => 18 + ((seed * (i + 3)) % 64));
  const orbitR = 52 + (seed % 30);
  const cx = 300 + (seed % 160);
  const cy = 92 + (seed % 40);

  return (
    <svg
      viewBox="0 0 640 400"
      role="img"
      aria-label={`کاور تصویری پروژه ${project.titleFa}`}
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="640" height="400" fill="#0B0D12" />

      {/* شبکه */}
      {Array.from({ length: 19 }, (_, i) => (
        <line
          key={`v${i}`}
          x1={i * 34}
          y1="0"
          x2={i * 34}
          y2="400"
          stroke="rgba(241,240,235,0.045)"
        />
      ))}
      {Array.from({ length: 12 }, (_, i) => (
        <line
          key={`h${i}`}
          x1="0"
          y1={i * 34}
          x2="640"
          y2={i * 34}
          stroke="rgba(241,240,235,0.045)"
        />
      ))}

      {/* مدار و هسته */}
      <circle
        cx={cx}
        cy={cy}
        r={orbitR}
        fill="none"
        stroke={project.accent}
        strokeOpacity="0.35"
        strokeDasharray="3 7"
      />
      <circle cx={cx} cy={cy} r={orbitR * 0.55} fill="none" stroke="rgba(241,240,235,0.16)" />
      <circle cx={cx} cy={cy} r="5" fill={project.accent} />
      <circle cx={cx + orbitR} cy={cy} r="3.5" fill="#F1F0EB" />

      {/* میله‌های داده */}
      {bars.map((h, i) => (
        <rect
          key={i}
          x={36 + i * 26}
          y={196 - h}
          width="13"
          height={h}
          fill={i === seed % 7 ? project.accent : 'rgba(119,125,136,0.5)'}
        />
      ))}

      {/* پنجرهٔ مرورگر انتزاعی */}
      <g opacity="0.9">
        <rect
          x="36"
          y="236"
          width="330"
          height="118"
          rx="8"
          fill="#111319"
          stroke="rgba(241,240,235,0.12)"
        />
        <rect x="36" y="236" width="330" height="26" rx="8" fill="#171B23" />
        <circle cx="54" cy="249" r="4" fill="rgba(241,240,235,0.25)" />
        <circle cx="70" cy="249" r="4" fill="rgba(241,240,235,0.25)" />
        <circle cx="86" cy="249" r="4" fill={project.accent} />
        <rect x="56" y="282" width="190" height="9" rx="4" fill="rgba(241,240,235,0.5)" />
        <rect x="56" y="303" width="260" height="7" rx="3" fill="rgba(119,125,136,0.45)" />
        <rect x="56" y="320" width="220" height="7" rx="3" fill="rgba(119,125,136,0.35)" />
      </g>

      {/* تایپوگرافی */}
      <text
        x="604"
        y="330"
        textAnchor="end"
        fontFamily="ui-monospace, Menlo, monospace"
        fontSize={large ? 30 : 24}
        fontWeight="800"
        fill="#F1F0EB"
      >
        {project.titleEn.toUpperCase()}
      </text>
      <text
        x="604"
        y="356"
        textAnchor="end"
        fontFamily="ui-monospace, Menlo, monospace"
        fontSize="14"
        fill={project.accent}
      >
        {project.domain}
      </text>
      <text
        x="36"
        y="48"
        fontFamily="ui-monospace, Menlo, monospace"
        fontSize="12"
        letterSpacing="3"
        fill="rgba(119,125,136,0.9)"
      >
        {project.categoryEn}
      </text>
    </svg>
  );
}
