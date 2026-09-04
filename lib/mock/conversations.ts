import type { Conversation, Message } from "@/types";

export const conversations: Conversation[] = [
  {
    id: "cnv_01",
    title: "Migrate Helio buttons to Aether tokens",
    preview:
      "Here is a codemod plan that covers the 41 button variants currently in the repo…",
    modelId: "aether-codex",
    projectId: "prj_04",
    messageCount: 14,
    tokensUsed: 48_200,
    pinned: true,
    createdAt: "2026-09-04T09:05:00.000Z",
    updatedAt: "2026-09-04T13:52:00.000Z",
  },
  {
    id: "cnv_02",
    title: "Q3 pipeline narrative — EMEA",
    preview:
      "EMEA closed 62% of forecast with two enterprise deals slipping into Q4…",
    modelId: "aether-nova-2",
    projectId: "prj_03",
    messageCount: 9,
    tokensUsed: 71_900,
    pinned: true,
    createdAt: "2026-09-04T08:12:00.000Z",
    updatedAt: "2026-09-04T10:41:00.000Z",
  },
  {
    id: "cnv_03",
    title: "DPA clause risk review — Vendor 118",
    preview:
      "Three clauses need attention before signature. The liability cap in §9.2…",
    modelId: "aether-nova-2",
    projectId: "prj_02",
    messageCount: 22,
    tokensUsed: 132_400,
    pinned: false,
    createdAt: "2026-09-03T15:20:00.000Z",
    updatedAt: "2026-09-04T07:18:00.000Z",
  },
  {
    id: "cnv_04",
    title: "Support macro rewrite — refunds",
    preview:
      "I've rewritten the eight refund macros in plain language and kept the policy links…",
    modelId: "aether-flux",
    projectId: "prj_01",
    messageCount: 11,
    tokensUsed: 26_700,
    pinned: false,
    createdAt: "2026-09-03T11:00:00.000Z",
    updatedAt: "2026-09-03T18:44:00.000Z",
  },
  {
    id: "cnv_05",
    title: "Postmortem draft — API latency spike",
    preview:
      "Contributing factors: connection pool exhaustion, a missing circuit breaker…",
    modelId: "aether-flux",
    projectId: "prj_06",
    messageCount: 7,
    tokensUsed: 33_100,
    pinned: false,
    createdAt: "2026-09-02T19:30:00.000Z",
    updatedAt: "2026-09-02T21:02:00.000Z",
  },
  {
    id: "cnv_06",
    title: "Accessibility audit of the settings pages",
    preview:
      "Twelve issues, four of them blocking: focus order in the billing modal…",
    modelId: "aether-codex",
    projectId: "prj_04",
    messageCount: 16,
    tokensUsed: 58_300,
    pinned: false,
    createdAt: "2026-08-31T13:15:00.000Z",
    updatedAt: "2026-09-01T09:26:00.000Z",
  },
  {
    id: "cnv_07",
    title: "Vendor screening checklist v3",
    preview:
      "Added the sanctions-list step and split the questionnaire by data residency…",
    modelId: "northwind-atlas-1",
    projectId: "prj_07",
    messageCount: 5,
    tokensUsed: 12_800,
    pinned: false,
    createdAt: "2026-08-29T10:40:00.000Z",
    updatedAt: "2026-08-29T12:10:00.000Z",
  },
  {
    id: "cnv_08",
    title: "Summarise the customer advisory board notes",
    preview:
      "Three themes came up in all six sessions: pricing predictability, SSO…",
    modelId: "aether-swift",
    messageCount: 4,
    tokensUsed: 9_450,
    pinned: false,
    createdAt: "2026-08-24T16:05:00.000Z",
    updatedAt: "2026-08-24T16:39:00.000Z",
  },
  {
    id: "cnv_09",
    title: "Onboarding email sequence — draft 2",
    preview:
      "Shortened each email to one idea and moved the setup checklist to email two…",
    modelId: "aether-flux",
    projectId: "prj_05",
    messageCount: 12,
    tokensUsed: 21_600,
    pinned: false,
    createdAt: "2026-08-11T08:50:00.000Z",
    updatedAt: "2026-08-11T11:12:00.000Z",
  },
  {
    id: "cnv_10",
    title: "Explain our retention query plan",
    preview:
      "The window function is scanning the whole events table because the partition key…",
    modelId: "aether-nova-2",
    messageCount: 8,
    tokensUsed: 44_050,
    pinned: false,
    createdAt: "2026-07-28T14:22:00.000Z",
    updatedAt: "2026-07-28T15:47:00.000Z",
  },
];

/**
 * Message threads. Only a subset of conversations is populated — the rest
 * resolve to an empty thread, which exercises the workspace empty state.
 */
export const messagesByConversation: Record<string, Message[]> = {
  cnv_01: [
    {
      id: "msg_0101",
      conversationId: "cnv_01",
      role: "user",
      content:
        "We're migrating from Helio v2 to the Aether design tokens. I've attached the current button component and the token map. Can you give me a codemod plan that we can run repo-wide without breaking the 41 existing variants?",
      status: "complete",
      createdAt: "2026-09-04T09:05:00.000Z",
      tokens: 412,
      attachments: [
        {
          id: "att_01",
          name: "Button.tsx",
          size: 18_432,
          mimeType: "text/typescript",
        },
        {
          id: "att_02",
          name: "token-map.json",
          size: 6_144,
          mimeType: "application/json",
        },
      ],
    },
    {
      id: "msg_0102",
      conversationId: "cnv_01",
      role: "assistant",
      modelId: "aether-codex",
      content: `Here's a codemod plan that covers all 41 button variants in three passes, each independently revertible.

**Pass 1 — mechanical token rename**
Swap the flat Helio colour props for Aether semantic tokens. This is a pure find-and-replace over \`className\` strings and is safe to land on its own:

\`\`\`ts
// codemods/01-token-rename.ts
const TOKEN_MAP = {
  "bg-helio-primary": "bg-primary",
  "text-helio-onPrimary": "text-primary-fg",
  "border-helio-divider": "border-border",
} as const;
\`\`\`

**Pass 2 — variant consolidation**
Nineteen of the 41 variants differ only by padding. Collapse them into a \`size\` prop with three values and keep a temporary \`legacySize\` shim so downstream teams are not blocked.

**Pass 3 — remove the shim**
Delete \`legacySize\` once the four consuming apps have upgraded. I'd hold this for a release rather than bundling it with pass 2.

**What I would watch**
- Six variants set \`box-shadow\` inline; those need manual review because Aether uses a ring instead of a shadow for focus.
- The icon-only variant has no accessible name in 11 call sites. Worth fixing in the same PR.`,
      status: "complete",
      createdAt: "2026-09-04T09:06:20.000Z",
      tokens: 1_284,
    },
    {
      id: "msg_0103",
      conversationId: "cnv_01",
      role: "user",
      content:
        "Good. For pass 2, how do you suggest we handle the six variants with inline box-shadow? I'd rather not hand-edit them.",
      status: "complete",
      createdAt: "2026-09-04T13:48:00.000Z",
      tokens: 64,
    },
    {
      id: "msg_0104",
      conversationId: "cnv_01",
      role: "assistant",
      modelId: "aether-codex",
      content: `Don't hand-edit them — make the codemod fail loudly instead.

Add a detection step that throws on any \`box-shadow\` inside a button variant and prints the file and line. You get a list of exactly six sites in one run, and CI keeps you honest if someone adds a seventh while the migration is in flight.

Then handle them as a small, separate PR: five map cleanly onto \`ring-2 ring-ring\`, and the "elevated" variant genuinely needs a shadow, so it should opt out with an explicit \`elevated\` prop rather than an inline style.`,
      status: "complete",
      createdAt: "2026-09-04T13:52:00.000Z",
      tokens: 742,
    },
  ],
  cnv_02: [
    {
      id: "msg_0201",
      conversationId: "cnv_02",
      role: "user",
      content:
        "Attached is the Q3 pipeline export for EMEA. Write the narrative section for the board deck. Keep it to 250 words, lead with the number, and be direct about what slipped.",
      status: "complete",
      createdAt: "2026-09-04T08:12:00.000Z",
      tokens: 88,
      attachments: [
        {
          id: "att_03",
          name: "emea-pipeline-q3.csv",
          size: 249_856,
          mimeType: "text/csv",
        },
      ],
    },
    {
      id: "msg_0202",
      conversationId: "cnv_02",
      role: "assistant",
      modelId: "aether-nova-2",
      content: `**EMEA closed 62% of forecast in Q3 — £14.2M against a £22.9M plan.**

The gap is concentrated, not systemic. Two enterprise deals worth a combined £6.1M moved to Q4: one waiting on a security review that started late, the other on a procurement freeze that lifts in October. Both remain in stage 4 with signed business cases, so I'd treat them as timing rather than loss.

Excluding those two, EMEA landed at 94% of plan. Mid-market was the bright spot at 108%, driven by the self-serve upgrade path that shipped in July — 41% of mid-market closed-won started as a self-serve trial, up from 18% in Q2.

Two things worth the board's attention. First, average enterprise cycle length grew from 94 to 121 days, and security review is where the extra time went. Second, DACH is now 38% of regional pipeline on 22% of headcount, which is a coverage risk if we lose either of the two AEs carrying it.

For Q4 the ask is unchanged: pull the security review forward into stage 2, and add one AE in DACH.`,
      status: "complete",
      createdAt: "2026-09-04T08:14:10.000Z",
      tokens: 2_140,
    },
    {
      id: "msg_0203",
      conversationId: "cnv_02",
      role: "user",
      content: "Can you add a one-line version I can put on the summary slide?",
      status: "complete",
      createdAt: "2026-09-04T10:40:00.000Z",
      tokens: 22,
    },
    {
      id: "msg_0204",
      conversationId: "cnv_02",
      role: "assistant",
      modelId: "aether-nova-2",
      content:
        "**EMEA delivered £14.2M of a £22.9M plan; excluding two enterprise deals that slipped to Q4 on external timing, the region landed at 94%.**",
      status: "complete",
      createdAt: "2026-09-04T10:41:00.000Z",
      tokens: 96,
    },
  ],
  cnv_03: [
    {
      id: "msg_0301",
      conversationId: "cnv_03",
      role: "user",
      content:
        "Review the attached DPA for Vendor 118 against our standard positions. Flag anything that needs legal sign-off before we counter-sign.",
      status: "complete",
      createdAt: "2026-09-03T15:20:00.000Z",
      tokens: 71,
      attachments: [
        {
          id: "att_04",
          name: "vendor-118-dpa-v4.pdf",
          size: 1_884_160,
          mimeType: "application/pdf",
        },
      ],
    },
    {
      id: "msg_0302",
      conversationId: "cnv_03",
      role: "assistant",
      modelId: "aether-nova-2",
      content: `Three clauses need attention before signature. I've ordered them by how much they'd cost us to get wrong.

**1. §9.2 — Liability cap (blocking)**
The cap is set at 6 months of fees and explicitly includes data-breach liability. Our standard position carves breach liability out of the cap entirely. As drafted, our maximum recovery on a breach of 40,000 customer records would be roughly £48,000.

**2. §4.1 — Sub-processor notice (blocking)**
Vendor 118 may add sub-processors with 5 days' notice and no objection right. Our standard is 30 days with a right to object and terminate. This also conflicts with commitments we've made to three of our own enterprise customers.

**3. §11.4 — Audit rights (negotiable)**
Audits are limited to one per year with 60 days' notice, and the vendor charges for staff time. The annual limit is acceptable; the charge-back should come out.

**Not a problem:** the deletion timelines in §7, the SCC module 2 attachment, and the breach-notification window in §8.3 (72 hours) all match our standard.

This is a first-pass review and is not legal advice — §9.2 and §4.1 should go to Elena before you respond.`,
      status: "complete",
      createdAt: "2026-09-03T15:23:40.000Z",
      tokens: 3_180,
    },
  ],
  cnv_05: [
    {
      id: "msg_0501",
      conversationId: "cnv_05",
      role: "user",
      content:
        "Here's the on-call timeline from last night's latency incident. Draft the postmortem — contributing factors, timeline, and action items with owners left blank.",
      status: "complete",
      createdAt: "2026-09-02T19:30:00.000Z",
      tokens: 96,
    },
    {
      id: "msg_0502",
      conversationId: "cnv_05",
      role: "assistant",
      modelId: "aether-flux",
      content: `# Postmortem — API latency spike, 2 Sep 2026

**Impact:** p99 latency on \`/v1/completions\` rose from 340ms to 11.4s for 38 minutes. 4,120 requests exceeded the 10s client timeout. No data loss.

## Contributing factors

1. **Connection pool exhaustion.** The pool is sized at 40 per instance and was tuned when the average request held a connection for 90ms. The new streaming path holds one for the life of the stream.
2. **No circuit breaker on the metadata service.** When metadata slowed, every request queued behind it rather than degrading.
3. **The alert fired on error rate, not latency.** Nothing paged until timeouts became errors, 19 minutes in.

## Timeline (UTC)

| Time | Event |
|---|---|
| 18:42 | Metadata service p99 rises to 2.1s |
| 18:47 | Completion latency begins climbing |
| 19:06 | Error-rate alert fires; on-call paged |
| 19:14 | Pool exhaustion identified from saturation dashboard |
| 19:20 | Pool size raised to 200; latency recovers |

## Action items

- [ ] Add a latency SLO alert on \`/v1/completions\` p99 — owner TBD
- [ ] Circuit breaker around metadata calls with a cached fallback — owner TBD
- [ ] Re-derive pool sizing from streaming hold time — owner TBD`,
      status: "complete",
      createdAt: "2026-09-02T19:32:00.000Z",
      tokens: 2_460,
    },
    {
      id: "msg_0503",
      conversationId: "cnv_05",
      role: "user",
      content:
        "Now generate the customer-facing status page update for the same incident.",
      status: "complete",
      createdAt: "2026-09-02T21:01:00.000Z",
      tokens: 20,
    },
    {
      id: "msg_0504",
      conversationId: "cnv_05",
      role: "assistant",
      modelId: "aether-flux",
      content: "",
      status: "error",
      createdAt: "2026-09-02T21:02:00.000Z",
      errorMessage:
        "Request stopped: this workspace's data-loss prevention policy blocks generating customer-facing content from an internal incident document. Ask a workspace admin for the `external-comms` role.",
    },
  ],
};

export function messagesFor(conversationId: string): Message[] {
  return messagesByConversation[conversationId] ?? [];
}
