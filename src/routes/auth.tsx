import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — MatchMaker.ai" },
      { name: "description", content: "Sign in or create your MatchMaker.ai account." },
      { property: "og:title", content: "Sign in — MatchMaker.ai" },
      { property: "og:description", content: "Sign in to save your resume analyses and history." },
    ],
  }),
  component: Auth,
});

function Auth() {
  const [tab, setTab] = useState("signin");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Auth is a demo in this build — try the dashboard!");
  };
  return (
    <div className="min-h-screen bg-hero flex flex-col">
      <Navbar />
      <main className="flex-1 grid place-items-center px-6 py-16">
        <Card className="glass rounded-3xl p-8 w-full max-w-md shadow-card">
          <div className="text-center mb-6">
            <div className="mx-auto grid size-12 place-items-center rounded-xl bg-gradient-brand text-white shadow-glow">
              <Sparkles className="size-5" />
            </div>
            <h1 className="text-2xl font-semibold mt-3">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Sign in to sync your resumes across devices.</p>
          </div>

          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin" className="mt-4">
              <form onSubmit={submit} className="space-y-3">
                <Field id="email" label="Email" type="email" />
                <Field id="password" label="Password" type="password" />
                <div className="text-right text-xs"><Link to="/auth" className="text-primary hover:underline">Forgot password?</Link></div>
                <Button className="w-full bg-gradient-brand text-white shadow-glow rounded-xl">Sign in</Button>
              </form>
            </TabsContent>
            <TabsContent value="signup" className="mt-4">
              <form onSubmit={submit} className="space-y-3">
                <Field id="name" label="Full name" type="text" />
                <Field id="email2" label="Email" type="email" />
                <Field id="password2" label="Password" type="password" />
                <Button className="w-full bg-gradient-brand text-white shadow-glow rounded-xl">Create account</Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> OR <span className="h-px flex-1 bg-border" />
          </div>
          <Button variant="outline" className="w-full rounded-xl" onClick={() => toast.info("Google sign-in is a demo here")}>
            Continue with Google
          </Button>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

function Field({ id, label, type }: { id: string; label: string; type: string }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} required className="rounded-xl" />
    </div>
  );
}
