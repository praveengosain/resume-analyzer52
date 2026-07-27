import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback, useRef } from "react";
import { Upload, FileText, Sparkles, CheckCircle2, XCircle, Wand2, Mail, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { ScoreRing } from "@/components/site/ScoreRing";
import { analyze, SAMPLE_RESUME, SAMPLE_JD, type AnalysisResult } from "@/lib/analyze";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — MatchMaker.ai" },
      { name: "description", content: "Analyze your resume against any job description. Get an instant ATS score, matching keywords, and AI rewrites." },
      { property: "og:title", content: "Analyze your resume — MatchMaker.ai" },
      { property: "og:description", content: "Instant ATS score, missing keywords, and AI-powered rewrites." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [coverLetterOpen, setCoverLetterOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const readFile = useCallback(async (file: File) => {
    setFileName(file.name);
    const name = file.name.toLowerCase();
    try {
      let text = "";
      if (name.endsWith(".docx")) {
        const mammoth: any = await import("mammoth/mammoth.browser");
        const arrayBuffer = await file.arrayBuffer();
        const res = await mammoth.extractRawText({ arrayBuffer });
        text = res.value;
      } else if (name.endsWith(".pdf")) {
        const pdfjs: any = await import("pdfjs-dist");
        const workerSrc = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
        pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
        const parts: string[] = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          parts.push(content.items.map((it: any) => it.str).join(" "));
        }
        text = parts.join("\n");
      } else {
        text = await file.text();
      }
      const cleaned = text.replace(/\r/g, "").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
      setResume(cleaned || `[Could not extract text from ${file.name}. Try pasting the content directly.]`);
      toast.success(`Loaded ${file.name}`);
    } catch (err) {
      console.error(err);
      toast.error(`Could not read ${file.name}. Try pasting the text instead.`);
    }
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) readFile(f);
  };

  const loadDemo = () => {
    setResume(SAMPLE_RESUME);
    setJd(SAMPLE_JD);
    setFileName("sample-resume.txt");
    toast.info("Sample resume & JD loaded");
  };

  const runAnalyze = async () => {
    if (!resume.trim() || !jd.trim()) {
      toast.error("Add both a resume and a job description");
      return;
    }
    setLoading(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 900));
    setResult(analyze(resume, jd));
    setLoading(false);
    setTimeout(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const rewriteResume = (text: string) => {
    const verbs: Array<[RegExp, string]> = [
      [/\bmanage(?:d|r|ment)?\b/gi, "Managed"],
      [/\blead(?:s|ing|er)?\b/gi, "Led"],
      [/\bdevelop(?:ed|er|ing)?\b/gi, "Developed"],
      [/\bbuild(?:s|ing|er)?\b/gi, "Built"],
      [/\bdesign(?:ed|er|ing)?\b/gi, "Designed"],
      [/\bimplement(?:ed|ing)?\b/gi, "Implemented"],
      [/\boptimi[sz]e(?:d|r|ing)?\b/gi, "Optimized"],
      [/\bsupport(?:ed|s|ing)?\b/gi, "Supported"],
      [/\bcreate(?:d|s|ing)?\b/gi, "Created"],
      [/\bmaintain(?:ed|s|ing)?\b/gi, "Maintained"],
      [/\blaunch(?:ed|es|ing)?\b/gi, "Launched"],
      [/\bcoordinate(?:d|s|ing)?\b/gi, "Coordinated"],
      [/\bdrive(?:n|s|ing)?\b/gi, "Drove"],
    ];

    const lines = text.split(/\n+/).map((line) => {
      let updated = line;
      for (const [regex, replacement] of verbs) {
        updated = updated.replace(regex, replacement);
      }
      return updated;
    });

    if (!/summary|profile/i.test(text)) {
      lines.unshift(
        "Experienced professional with a proven record of delivering measurable results through scalable web applications, strong collaboration, and technical leadership."
      );
    }

    return lines.join("\n");
  };

  const createCoverLetter = (resumeText: string, jobDescription: string) => {
    const nameMatch = resumeText.match(/^([A-Za-z]+)\b/);
    const candidateName = nameMatch?.[1] ?? "Candidate";
    const keywords = analyze(resumeText, jobDescription).matching.slice(0, 5);
    const skillsLine = keywords.length ? keywords.join(", ") : "relevant technical skills";

    return `Dear Hiring Manager,

I am excited to apply for this opportunity. I bring experience working with ${skillsLine} and a strong history of delivering high-quality results for product teams.

My resume demonstrates my ability to match the role’s requirements and contribute immediately through effective collaboration, communication, and technical ownership. I am confident I can help drive success for your team by applying my experience to the responsibilities outlined in the job description.

Thank you for your time and consideration. I look forward to the opportunity to speak with you.

Sincerely,
${candidateName}`;
  };

  const handleImproveResume = () => {
    if (!resume.trim()) {
      toast.error("Add your resume first");
      return;
    }

    const improved = rewriteResume(resume);
    if (improved === resume) {
      toast(`No improvements were needed`);
      return;
    }

    setResume(improved);
    toast.success("Resume improved");
  };

  const handleGenerateCoverLetter = () => {
    if (!resume.trim() || !jd.trim()) {
      toast.error("Add both a resume and a job description");
      return;
    }

    const letter = createCoverLetter(resume, jd);
    setCoverLetter(letter);
    setCoverLetterOpen(true);
    toast.success("Cover letter draft ready");
  };

  const handleExportPdf = async () => {
    if (!result) {
      toast.error("Analyze a resume first to export a report");
      return;
    }
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "pt", format: "letter" });
      const lineHeight = 18;
      let y = 40;

      const addText = (text: string | string[], options?: { x?: number; fontSize?: number }) => {
        const x = options?.x ?? 40;
        const fontSize = options?.fontSize ?? 12;
        doc.setFontSize(fontSize);
        const lines = Array.isArray(text) ? text : doc.splitTextToSize(text, 520);
        lines.forEach((line) => {
          if (y > 730) {
            doc.addPage();
            y = 40;
          }
          doc.text(line, x, y);
          y += lineHeight;
        });
      };

      addText("MatchMaker.ai Resume Report", { fontSize: 18 });
      addText(`Score: ${result.score}`, { fontSize: 12 });
      addText("Matching Keywords:", { fontSize: 12 });
      addText(result.matching.length ? result.matching.join(", ") : "None", { x: 50 });
      addText("Missing Keywords:", { fontSize: 12 });
      addText(result.missing.length ? result.missing.join(", ") : "None", { x: 50 });
      addText("Recommendations:", { fontSize: 12 });
      addText(result.suggestions.length ? result.suggestions : ["No additional suggestions."], { x: 50 });
      addText("", {});
      addText("Section Scores:", { fontSize: 12 });
      addText(`- Keywords: ${result.breakdown.keywords.score}/${result.breakdown.keywords.max}`);
      addText(`- Skills: ${result.breakdown.skills.score}/${result.breakdown.skills.max}`);
      addText(`- Experience: ${result.breakdown.experience.score}/${result.breakdown.experience.max}`);
      addText(`- Education: ${result.breakdown.education.score}/${result.breakdown.education.max}`);
      addText(`- Formatting: ${result.breakdown.formatting.score}/${result.breakdown.formatting.max}`);
      addText(`- Readability: ${result.breakdown.readability.score}/${result.breakdown.readability.max}`);
      addText("", {});
      addText("Convert these notes into actionable resume updates to increase your ATS score.");

      doc.save("matchmaker-resume-report.pdf");
      toast.success("Report exported");
    } catch (err) {
      console.error(err);
      toast.error("Could not export PDF report");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-hero">
        <Navbar />
        <main className="mx-auto max-w-7xl px-6 py-10 space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Resume Analyzer</h1>
          <p className="text-muted-foreground">Upload your resume and paste the job description to get your ATS score.</p>
        </header>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="glass p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold flex items-center gap-2"><FileText className="size-4 text-primary" /> Your Resume</h2>
              <Button size="sm" variant="ghost" onClick={loadDemo}>Try Demo</Button>
            </div>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition ${
                dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
            >
              <div className="grid size-12 place-items-center mx-auto rounded-xl bg-gradient-brand text-white mb-3">
                <Upload className="size-5" />
              </div>
              <p className="font-medium">Drag & drop your resume</p>
              <p className="text-sm text-muted-foreground mt-1">PDF or DOCX — {fileName ?? "no file selected"}</p>
              <input
                ref={inputRef} type="file" accept=".pdf,.docx,.txt,.md" className="hidden"
                onChange={(e) => e.target.files?.[0] && readFile(e.target.files[0])}
              />
            </div>
            <Textarea
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              placeholder="…or paste your resume text here"
              className="mt-4 min-h-40 rounded-xl"
            />
          </Card>

          <Card className="glass p-6 rounded-2xl">
            <h2 className="font-semibold flex items-center gap-2 mb-4"><Sparkles className="size-4 text-primary" /> Job Description</h2>
            <Textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder="Paste the full job description here…"
              className="min-h-72 rounded-xl"
            />
            <p className="text-xs text-muted-foreground mt-2">Tip: include requirements, responsibilities, and preferred skills.</p>
          </Card>
        </div>

        <div className="flex justify-center">
          <Button
            size="lg" onClick={runAnalyze} disabled={loading}
            className="bg-gradient-brand text-white shadow-glow rounded-xl px-10 h-14 text-base"
          >
            {loading ? <><Loader2 className="size-5 animate-spin" /> Analyzing…</> : <><Sparkles className="size-5" /> Analyze Resume</>}
          </Button>
        </div>

        {result && (
          <Results
            result={result}
            coverLetterOpen={coverLetterOpen}
            coverLetter={coverLetter}
            onCoverLetterOpenChange={setCoverLetterOpen}
            onImproveResume={handleImproveResume}
            onGenerateCoverLetter={handleGenerateCoverLetter}
            onExportPdf={handleExportPdf}
          />
        )}
      </main>
      <Footer />
    </div>
  </>
  );
}

function Results({
  result,
  coverLetterOpen,
  coverLetter,
  onCoverLetterOpenChange,
  onImproveResume,
  onGenerateCoverLetter,
  onExportPdf,
}: {
  result: AnalysisResult;
  coverLetterOpen: boolean;
  coverLetter: string;
  onCoverLetterOpenChange: (open: boolean) => void;
  onImproveResume: () => void;
  onGenerateCoverLetter: () => void;
  onExportPdf: () => Promise<void>;
}) {
  const b = result.breakdown;
  const rows = [
    ["Keywords", b.keywords.score, b.keywords.max],
    ["Skills", b.skills.score, b.skills.max],
    ["Experience", b.experience.score, b.experience.max],
    ["Education", b.education.score, b.education.max],
    ["Formatting", b.formatting.score, b.formatting.max],
    ["Readability", b.readability.score, b.readability.max],
  ] as const;

  return (
    <>
      <div id="results" className="space-y-6 animate-in fade-in duration-500">
      <Card className="glass rounded-3xl p-8">
        <div className="grid md:grid-cols-[auto_1fr] gap-8 items-center">
          <ScoreRing score={result.score} size={200} />
          <div className="grid sm:grid-cols-2 gap-3 w-full">
            {rows.map(([label, v, max]) => (
              <div key={label} className="rounded-xl bg-muted/40 p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">{label}</span>
                  <span className="tabular-nums text-muted-foreground">{v}/{max}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-brand rounded-full transition-all duration-700"
                       style={{ width: `${(v / max) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="glass rounded-2xl p-6">
          <h3 className="font-semibold mb-3">Missing Keywords</h3>
          <div className="flex flex-wrap gap-1.5">
            {result.missing.length ? result.missing.map((k) => (
              <Badge key={k} variant="outline" className="border-destructive/40 text-destructive rounded-full">{k}</Badge>
            )) : <p className="text-sm text-muted-foreground">Great — no critical keywords missing.</p>}
          </div>
        </Card>
        <Card className="glass rounded-2xl p-6">
          <h3 className="font-semibold mb-3">Matching Keywords</h3>
          <div className="flex flex-wrap gap-1.5">
            {result.matching.length ? result.matching.map((k) => (
              <Badge key={k} className="bg-success/15 text-success border-0 rounded-full">{k}</Badge>
            )) : <p className="text-sm text-muted-foreground">No JD keywords matched — try adding relevant experience.</p>}
          </div>
        </Card>
      </div>

      <Tabs defaultValue="suggestions">
        <TabsList className="grid grid-cols-4 max-w-2xl">
          <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          <TabsTrigger value="formatting">Formatting</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
        </TabsList>

        <TabsContent value="suggestions" className="mt-4">
          <div className="grid md:grid-cols-2 gap-3">
            {result.suggestions.map((s) => (
              <Card key={s} className="glass rounded-xl p-4 flex gap-3">
                <CheckCircle2 className="size-5 text-success shrink-0 mt-0.5" />
                <p className="text-sm">{s}</p>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="formatting" className="mt-4">
          <div className="grid sm:grid-cols-2 gap-3">
            {result.formatting.map((f) => (
              <div key={f.label} className="glass rounded-xl p-4 flex items-center gap-3">
                {f.ok ? <CheckCircle2 className="size-5 text-success" /> : <XCircle className="size-5 text-destructive" />}
                <span className="text-sm">{f.label}</span>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="skills" className="mt-4 grid md:grid-cols-3 gap-4">
          {[
            ["Detected", result.skills.detected, "bg-success/15 text-success"],
            ["Missing", result.skills.missing, "bg-destructive/15 text-destructive"],
            ["Suggested", result.skills.suggested, "bg-primary/15 text-primary"],
          ].map(([title, list, cls]) => (
            <Card key={title as string} className="glass rounded-2xl p-6">
              <h4 className="font-semibold mb-3">{title as string}</h4>
              <div className="flex flex-wrap gap-1.5">
                {(list as string[]).length ? (list as string[]).map((s) => (
                  <Badge key={s} className={`border-0 rounded-full ${cls}`}>{s}</Badge>
                )) : <p className="text-xs text-muted-foreground">Nothing to show</p>}
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="experience" className="mt-4">
          <div className="grid md:grid-cols-2 gap-3">
            {result.experience.map((e) => (
              <div key={e.label} className="glass rounded-xl p-4 flex items-start gap-3">
                {e.ok ? <CheckCircle2 className="size-5 text-success mt-0.5" /> : <XCircle className="size-5 text-destructive mt-0.5" />}
                <div>
                  <p className="text-sm font-medium">{e.label}</p>
                  <p className="text-xs text-muted-foreground">{e.note}</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex flex-wrap gap-3 justify-center pt-4">
        <Button className="bg-gradient-brand text-white shadow-glow rounded-xl" onClick={handleImproveResume}>
          <Wand2 className="size-4" /> Improve Resume with AI
        </Button>
        <Button variant="outline" className="rounded-xl" onClick={handleGenerateCoverLetter}>
          <Mail className="size-4" /> Generate Cover Letter
        </Button>
        <Button variant="outline" className="rounded-xl" onClick={handleExportPdf}>
          <Download className="size-4" /> Export PDF Report
        </Button>
      </div>
    </div>

      <Dialog open={coverLetterOpen} onOpenChange={setCoverLetterOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cover Letter Draft</DialogTitle>
              <DialogDescription>Review and copy the generated cover letter below.</DialogDescription>
            </DialogHeader>
            <Textarea
              value={coverLetter}
              readOnly
              className="min-h-[260px] rounded-xl bg-slate-950/5"
            />
            <DialogFooter className="mt-4 gap-2">
              <Button
                type="button"
                onClick={async () => {
                  await navigator.clipboard.writeText(coverLetter);
                  toast.success("Copied cover letter to clipboard");
                }}
              >
                Copy to Clipboard
              </Button>
              <Button type="button" variant="secondary" onClick={() => onCoverLetterOpenChange(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </>
  );
}
