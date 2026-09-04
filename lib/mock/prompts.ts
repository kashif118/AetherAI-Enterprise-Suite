import type { Prompt } from "@/types";

export const prompts: Prompt[] = [
  {
    id: "pmt_01",
    title: "Pull request reviewer",
    description:
      "Reviews a diff for correctness, then for clarity. Refuses to nitpick style the linter already covers.",
    body: `You are reviewing a pull request for the {{repo}} repository.

Review in two passes and keep them separate:

1. Correctness — logic errors, unhandled cases, race conditions, security issues.
2. Clarity — naming, structure, and anything a new team member would misread.

Do not comment on formatting or import order; the linter owns those.
For each finding give the file, the line, what breaks, and the smallest fix.
If the diff is correct, say so in one line rather than inventing feedback.

Diff:
{{diff}}`,
    category: "engineering",
    visibility: "organization",
    tags: ["code-review", "engineering", "quality"],
    variables: [
      { key: "repo", label: "Repository", placeholder: "northwind/web-platform" },
      { key: "diff", label: "Diff", placeholder: "Paste the unified diff" },
    ],
    author: { id: "usr_04", name: "Marcus Bello", initials: "MB" },
    favorite: true,
    usageCount: 1_284,
    createdAt: "2026-02-19T10:00:00.000Z",
    updatedAt: "2026-08-28T14:12:00.000Z",
  },
  {
    id: "pmt_02",
    title: "Incident postmortem draft",
    description:
      "Turns an on-call timeline into a blameless postmortem with contributing factors and action items.",
    body: `Write a blameless postmortem from the timeline below.

Structure: impact, contributing factors (numbered, most significant first),
timeline table in UTC, and action items as an unchecked list with owners left blank.

Rules:
- Never name an individual as a cause. Name the system that allowed it.
- Quantify impact in requests and minutes, not adjectives.
- If the timeline is missing detection or mitigation times, say which are missing.

Timeline:
{{timeline}}`,
    category: "operations",
    visibility: "organization",
    tags: ["sre", "incident", "writing"],
    variables: [
      { key: "timeline", label: "On-call timeline", placeholder: "Paste the incident timeline" },
    ],
    author: { id: "usr_09", name: "Wei Chen", initials: "WC" },
    favorite: true,
    usageCount: 642,
    createdAt: "2026-01-30T09:30:00.000Z",
    updatedAt: "2026-07-14T11:40:00.000Z",
  },
  {
    id: "pmt_03",
    title: "Contract clause risk flagger",
    description:
      "First-pass commercial review against Northwind standard positions. Always ends with a legal sign-off note.",
    body: `Compare the attached agreement against our standard positions.

For each deviation, output:
- Clause reference
- What it says
- What our standard position is
- Severity: blocking / negotiable / acceptable
- The commercial consequence in concrete terms

List blocking items first. End by naming which clauses require legal sign-off.
State clearly that this is a first-pass review and not legal advice.

Agreement type: {{agreement_type}}
Counterparty: {{counterparty}}`,
    category: "legal",
    visibility: "team",
    tags: ["legal", "contracts", "risk"],
    variables: [
      { key: "agreement_type", label: "Agreement type", placeholder: "DPA, MSA, NDA…" },
      { key: "counterparty", label: "Counterparty", placeholder: "Vendor name" },
    ],
    author: { id: "usr_07", name: "Elena Moreau", initials: "EM" },
    favorite: false,
    usageCount: 318,
    createdAt: "2026-05-06T13:00:00.000Z",
    updatedAt: "2026-08-30T08:55:00.000Z",
  },
  {
    id: "pmt_04",
    title: "Support macro rewriter",
    description:
      "Rewrites canned responses in plain language while preserving every policy link and legal caveat.",
    body: `Rewrite the support macro below.

Keep: every policy link, refund window, and legal caveat, word for word where they are quoted.
Change: sentence length, jargon, and any phrasing that sounds like a form letter.

Target: a reader who is already frustrated and skimming.
Aim for under 120 words. Lead with what happens next, not with an apology.

Macro:
{{macro}}`,
    category: "support",
    visibility: "organization",
    tags: ["support", "writing", "tone"],
    variables: [{ key: "macro", label: "Existing macro", placeholder: "Paste the macro text" }],
    author: { id: "usr_11", name: "Noah Feldman", initials: "NF" },
    favorite: true,
    usageCount: 907,
    createdAt: "2026-03-25T15:20:00.000Z",
    updatedAt: "2026-09-01T09:10:00.000Z",
  },
  {
    id: "pmt_05",
    title: "Competitive teardown",
    description:
      "Structured comparison of a competitor's product against ours, sourced only from what the user supplies.",
    body: `Produce a competitive teardown of {{competitor}}.

Sections: positioning, pricing model, three genuine strengths, three genuine weaknesses,
and where we win and lose head to head.

Constraints:
- Use only the material provided. Do not infer pricing or roadmap.
- Mark anything you could not verify as "unverified" rather than omitting it.
- No marketing language. A skeptical reader should find nothing to argue with.

Material:
{{material}}`,
    category: "marketing",
    visibility: "team",
    tags: ["competitive", "research", "positioning"],
    variables: [
      { key: "competitor", label: "Competitor", placeholder: "Company name" },
      { key: "material", label: "Source material", placeholder: "Paste notes, pages, transcripts" },
    ],
    author: { id: "usr_10", name: "Grace Whitfield", initials: "GW" },
    favorite: false,
    usageCount: 214,
    createdAt: "2026-04-11T12:45:00.000Z",
    updatedAt: "2026-06-22T16:30:00.000Z",
  },
  {
    id: "pmt_06",
    title: "Discovery call summariser",
    description:
      "Condenses a call transcript into pain, budget, timeline and next step — flags what was never asked.",
    body: `Summarise this discovery call transcript.

Output four short sections: pain, budget signals, timeline, agreed next step.
Then a fifth section, "Not covered", listing qualification questions that were never asked.

Quote the prospect directly where their wording matters. Do not soften objections.

Transcript:
{{transcript}}`,
    category: "sales",
    visibility: "organization",
    tags: ["sales", "discovery", "summarisation"],
    variables: [{ key: "transcript", label: "Transcript", placeholder: "Paste the call transcript" }],
    author: { id: "usr_02", name: "Daniel Kovač", initials: "DK" },
    favorite: false,
    usageCount: 486,
    createdAt: "2026-02-02T08:15:00.000Z",
    updatedAt: "2026-08-05T10:20:00.000Z",
  },
  {
    id: "pmt_07",
    title: "SQL query explainer",
    description:
      "Explains what a query does and why the plan is slow, in terms a product engineer can act on.",
    body: `Explain the query below to an engineer who knows the schema but not the planner.

Cover: what the query returns, which step dominates the cost, and why.
Then give one change that would help most, with the expected effect.

Skip generic advice like "add an index" unless you name the exact index.

Query:
{{query}}

Plan:
{{plan}}`,
    category: "engineering",
    visibility: "organization",
    tags: ["sql", "performance", "engineering"],
    variables: [
      { key: "query", label: "Query", placeholder: "SELECT …" },
      { key: "plan", label: "Query plan", placeholder: "EXPLAIN ANALYZE output" },
    ],
    author: { id: "usr_06", name: "Hiroshi Tanaka", initials: "HT" },
    favorite: true,
    usageCount: 731,
    createdAt: "2026-01-18T14:10:00.000Z",
    updatedAt: "2026-07-30T13:05:00.000Z",
  },
  {
    id: "pmt_08",
    title: "Research synthesis",
    description:
      "Synthesises multiple user interviews into themes, with the evidence count for each.",
    body: `Synthesise the interviews below into themes.

For each theme: a one-sentence claim, the number of participants who expressed it,
and two verbatim quotes. Order by participant count.

Then list every claim made by only one participant under "Single sources" —
do not promote them into themes.

Interviews:
{{interviews}}`,
    category: "research",
    visibility: "team",
    tags: ["research", "synthesis", "ux"],
    variables: [{ key: "interviews", label: "Interview notes", placeholder: "Paste interview notes" }],
    author: { id: "usr_05", name: "Sofia Lindqvist", initials: "SL" },
    favorite: false,
    usageCount: 289,
    createdAt: "2026-06-04T11:30:00.000Z",
    updatedAt: "2026-08-18T15:45:00.000Z",
  },
  {
    id: "pmt_09",
    title: "Vendor security questionnaire",
    description:
      "Generates a residency-aware security questionnaire scoped to the data the vendor will touch.",
    body: `Draft a security questionnaire for a vendor that will process {{data_class}} data
in {{regions}}.

Scope the questions to that data class only — do not ask about capabilities the vendor
will never touch. Group by: access control, encryption, sub-processors, incident response,
and data residency.

Mark each question as required or informational.`,
    category: "operations",
    visibility: "team",
    tags: ["security", "procurement", "compliance"],
    variables: [
      { key: "data_class", label: "Data class", placeholder: "Personal, pseudonymised, public…" },
      { key: "regions", label: "Regions", placeholder: "EU, UK, US" },
    ],
    author: { id: "usr_12", name: "Aisha Rahman", initials: "AR" },
    favorite: false,
    usageCount: 156,
    createdAt: "2026-07-16T09:00:00.000Z",
    updatedAt: "2026-08-27T12:00:00.000Z",
  },
  {
    id: "pmt_10",
    title: "Release notes from commits",
    description:
      "Turns a commit range into user-facing release notes, dropping anything the user cannot observe.",
    body: `Write release notes from the commit log below.

Group into: new, improved, fixed. Write from the user's point of view —
if a change is invisible to them, leave it out entirely rather than listing it as internal.

One line per item, no ticket numbers, no commit hashes.

Commits:
{{commits}}`,
    category: "engineering",
    visibility: "organization",
    tags: ["release", "writing", "changelog"],
    variables: [{ key: "commits", label: "Commit log", placeholder: "git log --oneline output" }],
    author: { id: "usr_11", name: "Noah Feldman", initials: "NF" },
    favorite: true,
    usageCount: 553,
    createdAt: "2026-03-08T10:25:00.000Z",
    updatedAt: "2026-08-21T17:15:00.000Z",
  },
  {
    id: "pmt_11",
    title: "Meeting notes to decisions",
    description:
      "Extracts only decisions and owners from a meeting transcript. Discards discussion.",
    body: `From the transcript below, extract only:

1. Decisions made — what was decided and by whom.
2. Open questions — what was raised and left unresolved.
3. Actions — who committed to what, by when.

Discard everything else, including discussion that led to a decision.
If no decision was made, say "No decisions recorded" rather than summarising the discussion.

Transcript:
{{transcript}}`,
    category: "operations",
    visibility: "organization",
    tags: ["meetings", "summarisation"],
    variables: [{ key: "transcript", label: "Transcript", placeholder: "Paste the transcript" }],
    author: { id: "usr_01", name: "Muhammad Kashif", initials: "MK" },
    favorite: false,
    usageCount: 1_042,
    createdAt: "2026-02-27T16:40:00.000Z",
    updatedAt: "2026-09-02T08:30:00.000Z",
  },
  {
    id: "pmt_12",
    title: "Accessibility review",
    description:
      "Audits a component against WCAG 2.2 AA and reports only issues that would fail an audit.",
    body: `Audit the component below against WCAG 2.2 AA.

Report only issues that would fail a real audit. For each: the success criterion,
what fails, and the fix as a code change.

Check specifically: keyboard operability, focus visibility and order, accessible names,
colour contrast, and whether state changes are announced.

Component:
{{component}}`,
    category: "engineering",
    visibility: "organization",
    tags: ["accessibility", "frontend", "wcag"],
    variables: [{ key: "component", label: "Component source", placeholder: "Paste the component" }],
    author: { id: "usr_05", name: "Sofia Lindqvist", initials: "SL" },
    favorite: true,
    usageCount: 398,
    createdAt: "2026-05-19T13:50:00.000Z",
    updatedAt: "2026-08-31T10:05:00.000Z",
  },
];
