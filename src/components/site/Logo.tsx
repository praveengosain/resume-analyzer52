import { type ComponentPropsWithoutRef } from "react";

interface LogoProps extends ComponentPropsWithoutRef<"div"> {
  compact?: boolean;
}

export function Logo({ compact = false, className = "", ...props }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`} {...props}>
      <div className="grid h-11 w-11 place-items-center rounded-3xl bg-gradient-to-br from-sky-500 to-violet-500 text-white shadow-lg shadow-sky-500/20 ring-1 ring-white/20">
        <span className="text-lg font-black tracking-tight">PG</span>
      </div>
      {!compact ? (
        <div className="hidden sm:flex flex-col leading-tight">
          <span className="text-base font-semibold">PG Tech Help</span>
          <span className="text-xs text-muted-foreground">Resume & ATS optimization</span>
        </div>
      ) : null}
    </div>
  );
}
