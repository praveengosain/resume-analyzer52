import { useEffect, useState } from "react";

export function ScoreRing({ score, size = 180 }: { score: number; size?: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const dur = 900;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setDisplay(Math.round(p * score));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (display / 100) * c;
  const color =
    score >= 80 ? "var(--color-success)" : score >= 60 ? "var(--color-warning)" : "var(--color-destructive)";

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--brand)" />
            <stop offset="100%" stopColor="var(--brand-2)" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--color-muted)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          stroke={score >= 80 ? "url(#ring-grad)" : color}
          strokeWidth={stroke} fill="none" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.2s linear" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="text-4xl font-bold tabular-nums">{display}<span className="text-lg text-muted-foreground">/100</span></div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">ATS Score</div>
        </div>
      </div>
    </div>
  );
}
