import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — MatchMaker.ai" },
      { name: "description", content: "Free ATS checks or unlimited AI rewrites, cover letters, and history for $20/mo." },
      { property: "og:title", content: "Simple pricing — MatchMaker.ai" },
      { property: "og:description", content: "Free ATS checks, or Pro with AI rewrites and unlimited history." },
    ],
  }),
  component: Pricing,
});

const PLANS = [
  {
    name: "Free", price: "$0", cta: "Start free", featured: false,
    features: ["1 resume analysis", "Basic ATS score", "Missing keywords", "Formatting checks"],
  },
  {
    name: "Pro", price: "$20", cta: "Upgrade to Pro", featured: true,
    features: ["Unlimited resume checks", "AI resume rewrites", "Full ATS score breakdown", "Cover letter generator", "PDF exports", "Resume history"],
  },
];

function Pricing() {
  return (
    <div className="min-h-screen bg-hero">
      <Navbar />
      <section className="mx-auto max-w-5xl px-6 py-20 text-center">
        <Badge variant="secondary" className="rounded-full gap-1.5"><Sparkles className="size-3.5 text-primary" /> Simple pricing</Badge>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mt-4">Pick your plan</h1>
        <p className="mt-3 text-muted-foreground">Start free. Upgrade when you're ready to unlock AI rewrites.</p>

        <div className="grid md:grid-cols-2 gap-6 mt-12 text-left">
          {PLANS.map((p) => (
            <Card
              key={p.name}
              className={`rounded-3xl p-8 relative ${
                p.featured ? "glass shadow-glow border-primary/40" : "glass"
              }`}
            >
              {p.featured && (
                <Badge className="absolute -top-3 right-6 bg-gradient-brand text-white border-0">Most popular</Badge>
              )}
              <h3 className="text-xl font-semibold">{p.name}</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-bold">{p.price}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="mt-6 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="size-4 text-success" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/dashboard" className="block mt-8">
                <Button className={`w-full rounded-xl ${p.featured ? "bg-gradient-brand text-white shadow-glow" : ""}`}
                        variant={p.featured ? "default" : "outline"}>
                  {p.cta}
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
