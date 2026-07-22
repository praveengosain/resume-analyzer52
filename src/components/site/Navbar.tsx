import { Link } from "@tanstack/react-router";
import { Moon, Sun, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme";

export function Navbar() {
  const { theme, toggle } = useTheme();
  return (
    <header className="sticky top-0 z-40 glass">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="grid size-8 place-items-center rounded-lg bg-gradient-brand text-white shadow-glow">
            <Sparkles className="size-4" />
          </span>
          <span className="text-lg tracking-tight">MatchMaker<span className="text-gradient-brand">.ai</span></span>
        </Link>
        <nav className="hidden gap-6 text-sm text-muted-foreground md:flex">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <Link to="/pricing" className="hover:text-foreground">Pricing</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
          <Link to="/auth"><Button variant="ghost" size="sm">Sign in</Button></Link>
          <Link to="/dashboard">
            <Button size="sm" className="bg-gradient-brand text-white shadow-glow hover:opacity-90">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
