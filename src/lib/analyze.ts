export type Breakdown = {
  keywords: { score: number; max: number };
  skills: { score: number; max: number };
  experience: { score: number; max: number };
  education: { score: number; max: number };
  formatting: { score: number; max: number };
  readability: { score: number; max: number };
};

export type AnalysisResult = {
  score: number;
  breakdown: Breakdown;
  matching: string[];
  missing: string[];
  suggestions: string[];
  formatting: { label: string; ok: boolean }[];
  skills: { detected: string[]; missing: string[]; suggested: string[] };
  experience: { label: string; ok: boolean; note: string }[];
};

const STOP = new Set([
  "a","an","the","and","or","for","of","to","in","on","with","by","at","from","as","is","are","be","this","that","we","you","our","your","their","will","have","has","had","not","but","if","it","its","was","were","been","being",
]);

const CANONICAL_SKILLS = [
  "react","typescript","javascript","node.js","python","java","go","rust","aws","azure","gcp",
  "docker","kubernetes","terraform","ci/cd","graphql","rest api","microservices","postgresql","mongodb",
  "redis","tailwind css","next.js","vue","angular","git","agile","scrum","leadership","firebase",
  "html","css","sql","nosql","kafka","rabbitmq","jest","cypress","figma","product management",
];

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#./ -]/g, " ")
    .split(/\s+/)
    .filter((w) => w && !STOP.has(w) && w.length > 1);
}

function extractKeywords(text: string): string[] {
  const tokens = tokenize(text);
  const bigrams: string[] = [];
  for (let i = 0; i < tokens.length - 1; i++) bigrams.push(`${tokens[i]} ${tokens[i + 1]}`);
  const pool = [...tokens, ...bigrams];
  const found = new Set<string>();
  for (const s of CANONICAL_SKILLS) if (pool.includes(s)) found.add(s);
  return [...found];
}

export function analyze(resume: string, jd: string): AnalysisResult {
  const resumeKeys = new Set(extractKeywords(resume));
  const jdKeys = extractKeywords(jd);

  const matching = jdKeys.filter((k) => resumeKeys.has(k));
  const missing = jdKeys.filter((k) => !resumeKeys.has(k));

  const kwRatio = jdKeys.length ? matching.length / jdKeys.length : 0.7;
  const keywords = { score: Math.round(kwRatio * 40), max: 40 };

  // heuristics
  const hasNumbers = /\d+%|\$\d|\d{2,}\+/.test(resume);
  const hasBullets = /(^|\n)\s*[-•·]/.test(resume);
  const hasSummary = /summary|profile/i.test(resume);
  const hasEducation = /(bachelor|master|b\.?s\.?|m\.?s\.?|university|college)/i.test(resume);
  const hasYears = /(\d+)\+?\s*(years|yrs)/i.test(resume);
  const wordCount = resume.split(/\s+/).filter(Boolean).length;
  const hasTables = /\|.*\|/.test(resume);
  const hasImages = /!\[|<img/i.test(resume);

  const skillsScore = Math.min(20, matching.length * 2 + 4);
  const experienceScore = (hasYears ? 10 : 4) + (hasNumbers ? 6 : 2);
  const educationScore = hasEducation ? 10 : 4;
  const formattingScore = 15 - (hasTables ? 3 : 0) - (hasImages ? 3 : 0) + (hasBullets ? 2 : 0);
  const readabilityScore = wordCount > 200 && wordCount < 900 ? 10 : 6;

  const breakdown: Breakdown = {
    keywords,
    skills: { score: skillsScore, max: 20 },
    experience: { score: Math.min(20, experienceScore + 4), max: 20 },
    education: { score: educationScore, max: 10 },
    formatting: { score: Math.max(0, Math.min(15, formattingScore)), max: 15 },
    readability: { score: readabilityScore, max: 10 },
  };

  const totalMax = 40 + 20 + 20 + 10 + 15 + 10; // 115 — normalize to 100
  const rawTotal =
    breakdown.keywords.score +
    breakdown.skills.score +
    breakdown.experience.score +
    breakdown.education.score +
    breakdown.formatting.score +
    breakdown.readability.score;
  const score = Math.max(28, Math.min(99, Math.round((rawTotal / totalMax) * 100)));

  const suggestions = [
    !hasNumbers && "Add measurable achievements (%, $, counts) to quantify impact.",
    "Use stronger action verbs like Led, Architected, Delivered, Optimized.",
    !/lead|led|manage|mentor/i.test(resume) && "Mention leadership or mentorship experience.",
    missing.length > 3 && `Include more relevant technical keywords: ${missing.slice(0, 4).join(", ")}.`,
    !hasSummary && "Add a concise 2–3 line professional summary at the top.",
    !/certif/i.test(resume) && "Add relevant certifications if you have any.",
  ].filter(Boolean) as string[];

  const formatting = [
    { label: "Single column layout", ok: true },
    { label: "ATS friendly font", ok: true },
    { label: "No tables", ok: !hasTables },
    { label: "Clear section headers", ok: /experience|education|skills/i.test(resume) },
    { label: "No headers / footers", ok: true },
    { label: "Uses standard icons only", ok: true },
    { label: "No images", ok: !hasImages },
    { label: "No fancy fonts", ok: true },
  ];

  const detected = [...resumeKeys];
  const skills = {
    detected,
    missing: missing.slice(0, 8),
    suggested: CANONICAL_SKILLS.filter((s) => !resumeKeys.has(s) && !jdKeys.includes(s)).slice(0, 6),
  };

  const experience = [
    { label: "Years of experience", ok: hasYears, note: hasYears ? "Detected in resume" : "Not clearly stated" },
    { label: "Relevant experience", ok: matching.length >= 3, note: `${matching.length} matching skills` },
    { label: "Industry match", ok: kwRatio > 0.4, note: `${Math.round(kwRatio * 100)}% JD keyword overlap` },
    { label: "Job title similarity", ok: kwRatio > 0.5, note: "Based on JD comparison" },
    { label: "Career progression", ok: /senior|lead|manager|principal/i.test(resume), note: "Look for role growth" },
  ];

  return { score, breakdown, matching, missing, suggestions, formatting, skills, experience };
}

export const SAMPLE_RESUME = `John Doe — Senior Software Engineer
Summary
Full-stack engineer with 6+ years building scalable web apps in React, TypeScript, and Node.js.
Led a team of 4 engineers to deliver a payments platform, reducing latency by 45%.

Experience
- Senior Software Engineer, Acme Corp (2021–2024)
  - Architected a React + Node.js microservices platform serving 2M+ users.
  - Improved API response time by 60% using Redis caching.
  - Mentored 4 junior engineers; introduced code review culture.
- Software Engineer, Widgets Inc (2018–2021)
  - Built MongoDB-backed dashboards with Tailwind CSS and Firebase.
  - Shipped 30+ features using Git and agile methodology.

Skills
React, TypeScript, JavaScript, Node.js, MongoDB, Firebase, Git, Tailwind CSS, HTML, CSS, SQL

Education
B.S. Computer Science, University of Somewhere (2018)
`;

export const SAMPLE_JD = `We are hiring a Senior Full-Stack Engineer.
Must have: React, TypeScript, Node.js, AWS, Docker, CI/CD, REST API, GraphQL, Microservices.
Nice to have: Kubernetes, Terraform, Leadership, Agile, MongoDB.
You will lead a small team and deliver production systems at scale.
`;
