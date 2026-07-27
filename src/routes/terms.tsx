import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms and Conditions — MatchMaker.ai" },
      { name: "description", content: "Read the terms and conditions for using MatchMaker.ai." },
      { property: "og:title", content: "Terms and Conditions — MatchMaker.ai" },
      { property: "og:description", content: "Review the terms and conditions for using MatchMaker.ai." },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <div className="min-h-screen bg-hero">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-20">
        <div className="glass rounded-3xl p-10 shadow-card">
          <h1 className="text-4xl font-bold tracking-tight">Terms and Conditions</h1>
          <p className="mt-4 text-muted-foreground text-lg">
            Welcome to MatchMaker.ai. These terms and conditions outline the rules and regulations for using our website and services.
          </p>

          <section className="mt-10 space-y-8">
            <div>
              <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
              <p className="mt-3 text-muted-foreground">
                By accessing or using MatchMaker.ai, you agree to be bound by these terms and all applicable laws and regulations. If you do not agree with any of these terms, you must stop using the service immediately.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold">2. Use of the Service</h2>
              <p className="mt-3 text-muted-foreground">
                MatchMaker.ai provides resume analysis and job application support. You agree to use the service only for lawful purposes and not to submit any content that violates the rights of others.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold">3. Intellectual Property</h2>
              <p className="mt-3 text-muted-foreground">
                All content, design, and software on this website are owned by MatchMaker.ai or its licensors. You may not reproduce, distribute, or create derivative works without prior written consent.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold">4. Limitation of Liability</h2>
              <p className="mt-3 text-muted-foreground">
                MatchMaker.ai is provided "as is" without warranties of any kind. We are not responsible for any damages or losses resulting from your use of the service.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold">5. Changes to Terms</h2>
              <p className="mt-3 text-muted-foreground">
                We may update these terms at any time. Continued use of MatchMaker.ai after changes are posted constitutes acceptance of the revised terms.
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
