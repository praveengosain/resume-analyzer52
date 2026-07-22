import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Upload, PlayCircle, CheckCircle2, Sparkles, FileText, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { ScoreRing } from "@/components/site/ScoreRing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MatchMaker.ai — Increase Your Resume ATS Score" },
      { name: "description", content: "Upload your resume, paste a job description, and instantly get an ATS score with AI-powered suggestions. Beat the applicant tracking system." },
      { property: "og:title", content: "MatchMaker.ai — Increase Your Resume ATS Score" },
      { property: "og:description", content: "Instant AI ATS analysis, keyword matching, and resume rewrites that get callbacks." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-hero">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 pt-20 pb-24 grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <Badge variant="secondary" className="gap-1.5 rounded-full py-1.5 px-3">
            <Sparkles className="size-3.5 text-primary" /> AI-powered ATS optimization
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.05]">
            Increase Your Resume{" "}
            <span className="text-gradient-brand">ATS Score</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl">
            Upload your resume, paste the job description, and instantly receive an ATS score with
            AI-powered suggestions tailored to the role you want.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/dashboard">
              <Button size="lg" className="bg-gradient-brand text-white shadow-glow hover:opacity-90 rounded-xl">
                <Upload className="size-4" /> Upload Resume
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="rounded-xl">
                <PlayCircle className="size-4" /> Try Demo
              </Button>
            </Link>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-success" /> No signup to try</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-success" /> PDF & DOCX</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-success" /> Instant results</span>
          </div>
        </div>

        <SampleScoreCard />
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 grid md:grid-cols-3 gap-6">
        {FEATURES.map((f) => (
          <Card key={f.title} className="glass p-6 rounded-2xl">
            <div className="grid size-10 place-items-center rounded-xl bg-gradient-brand text-white mb-4">
              <f.icon className="size-5" />
            </div>
            <h3 className="font-semibold text-lg">{f.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{f.desc}</p>
          </Card>
        ))}
      </section>

      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Ready to beat the ATS?</h2>
        <p className="mt-3 text-muted-foreground">Get your first analysis in under 30 seconds.</p>
        <Link to="/dashboard">
          <Button size="lg" className="mt-6 bg-gradient-brand text-white shadow-glow rounded-xl">
            Analyze My Resume <ArrowRight className="size-4" />
          </Button>
        </Link>
      </section>

      <Footer />
    </div>
  );
}

const FEATURES = [
  { icon: Target, title: "Keyword matching", desc: "See exactly which JD keywords your resume is missing." },
  { icon: Zap, title: "AI rewrites", desc: "Rewrite bullet points with quantified achievements automatically." },
  { icon: FileText, title: "Cover letters", desc: "Generate a tailored cover letter from your resume and the JD." },
];

function SampleScoreCard() {
  return (
    <Card className="glass rounded-3xl p-8 shadow-card animate-float">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Sample analysis</p>
          <h3 className="text-xl font-semibold mt-1">Senior Full-Stack Engineer</h3>
        </div>
        <Badge className="bg-success/15 text-success border-0">Strong match</Badge>
      </div>

      <div className="mt-6 flex items-center gap-8">
        <ScoreRing score={88} />
        <div className="flex-1 space-y-3">
          {[
            ["Keywords", 32, 40],
            ["Skills", 19, 20],
            ["Experience", 16, 20],
            ["Formatting", 12, 15],
          ].map(([label, v, max]) => (
            <div key={label as string}>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="tabular-nums">{v}/{max}</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-gradient-brand rounded-full" style={{ width: `${(v as number) / (max as number) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-1.5">
        {["React", "TypeScript", "Node.js", "AWS", "Docker"].map((k) => (
          <Badge key={k} variant="secondary" className="rounded-full">{k}</Badge>
        ))}
      </div>
    </Card>
  );
}
