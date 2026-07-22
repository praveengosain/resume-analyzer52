export function Footer() {
  return (
    <footer className="border-t border-border/60 py-10 mt-24">
      <div className="mx-auto max-w-7xl px-6 text-sm text-muted-foreground flex flex-col md:flex-row justify-between gap-4">
        <p>© {new Date().getFullYear()} MatchMaker.ai — Beat the ATS.</p>
        <p>Built for job seekers who want callbacks, not silence.</p>
      </div>
    </footer>
  );
}
