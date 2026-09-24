import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";
import Lead from "./models/Lead.js";
import { Contact } from "./models/Contact.js";
import { Note } from "./models/Note.js";
import { Task } from "./models/Task.js";

const DAY = 24 * 60 * 60 * 1000;

const daysAgo = (n) => new Date(Date.now() - n * DAY);
const daysAhead = (n) => new Date(Date.now() + n * DAY);

const rand = (a, b) =>
  Math.floor(Math.random() * (b - a + 1)) + a;

const pick = (arr) =>
  arr[Math.floor(Math.random() * arr.length)];

const pickSome = (arr, n) =>
  [...arr].sort(() => Math.random() - 0.5).slice(0, n);

const weighted = (pairs) => {
  const total = pairs.reduce((s, [, w]) => s + w, 0);
  let r = Math.random() * total;

  for (const [v, w] of pairs) {
    if ((r -= w) <= 0) return v;
  }

  return pairs[0][0];
};

const slug = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]/g, "");

const COMPANIES = [
  ["Acme Corp", "acmecorp.com"],
  ["Globex", "globex.io"],
  ["Initech", "initech.com"],
  ["Umbrella Co", "umbrella.co"],
  ["Soylent", "soylent.io"],
  ["Hooli", "hooli.com"],
  ["Pied Piper", "piedpiper.com"],
  ["Vehement Capital", "vehement.io"],
  ["Massive Dynamic", "massivedynamic.com"],
  ["Wayne Enterprises", "wayne.com"],
  ["Stark Industries", "stark.io"],
  ["Wonka Industries", "wonka.co"],
  ["Cyberdyne", "cyberdyne.ai"],
  ["Tyrell Corp", "tyrell.com"],
  ["Aperture Labs", "aperture.io"],
  ["Black Mesa", "blackmesa.org"],
  ["Oscorp", "oscorp.com"],
  ["LexCorp", "lexcorp.com"],
  ["Nakatomi", "nakatomi.co"],
  ["Gekko & Co", "gekko.com"],
  ["Bluth Company", "bluth.com"],
  ["Dunder Mifflin", "dundermifflin.com"],
  ["Prestige Worldwide", "prestige.io"],
  ["Vandelay Industries", "vandelay.com"],
  ["Sterling Cooper", "sterlingcooper.com"],
  ["Wernham Hogg", "wernhamhogg.co"],
  ["Hanso Foundation", "hanso.org"],
  ["Rich Industries", "rich.io"],
  ["Pendant Publishing", "pendant.com"],
  ["Kruger Industrial", "kruger.com"],
  ["Genco Olive Oil", "genco.io"],
  ["Spacey Sprockets", "spacely.com"],
  ["Monsters Inc", "monsters.co"],
  ["Gringotts", "gringotts.bank"],
  ["Duff Brewing", "duff.com"],
  ["Planet Express", "planetexpress.com"],
  ["Soylent Green", "sgreen.io"],
  ["Cogswell Cogs", "cogswell.io"],
  ["Stark Labs", "starklabs.io"],
  ["Wayne Tech", "waynetech.io"],
];

const FIRST = [
  "Olivia",
  "Noah",
  "Emma",
  "Liam",
  "Ava",
  "Ethan",
  "Sophia",
  "Mason",
  "Isabella",
  "Lucas",
  "Mia",
  "Logan",
  "Amelia",
  "Jackson",
  "Harper",
  "Aiden",
  "Evelyn",
  "Caleb",
  "Abigail",
  "Henry",
  "Ella",
  "Owen",
  "Scarlett",
  "Wyatt",
  "Grace",
  "Julian",
  "Chloe",
  "Leo",
  "Nora",
  "Eli",
  "Zoe",
  "Adrian",
  "Lily",
  "Miles",
  "Hannah",
  "Aria",
  "Felix",
  "Ruby",
  "Hugo",
  "Maya",
];

const LAST = [
  "Bennett",
  "Carter",
  "Walsh",
  "Foster",
  "Mitchell",
  "Brooks",
  "Reed",
  "Hayes",
  "Coleman",
  "Patel",
  "Nguyen",
  "Okafor",
  "Rossi",
  "Kim",
  "Silva",
  "Park",
  "Diaz",
  "Murphy",
  "Khan",
  "Flores",
  "Bauer",
  "Cole",
  "Nash",
  "Webb",
  "Lowe",
  "Frost",
  "Ramos",
  "Bishop",
  "Greer",
  "Hale",
];

const TITLES = [
  "VP of Sales",
  "CTO",
  "CEO",
  "Founder",
  "Head of Operations",
  "Product Lead",
  "Procurement Manager",
  "Marketing Director",
  "Engineering Manager",
  "COO",
  "CFO",
  "Head of Growth",
  "Account Executive",
  "Solutions Architect",
  "Director of IT",
];

const TAGS = [
  "decision-maker",
  "champion",
  "technical",
  "finance",
  "executive",
  "warm",
  "vip",
  "influencer",
  "saas",
  "enterprise",
];

const SOURCES = [
  "Website",
  "Referral",
  "Social Media",
  "Advertisement",
  "Other",
];

const NOTE_TEMPLATES = [
  (c) => `Discovery call with ${c} went well — strong interest in the analytics module. Loop in a solutions engineer for the technical deep-dive.`,
  (c) => `${c} flagged budget concerns on the Enterprise tier. Prepare an ROI one-pager before the next call.`,
  (c) => `Champion at ${c} is pushing internally; legal review is the main blocker right now.`,
  (c) => `Left a voicemail for ${c}. Follow up by email if no response within 48 hours.`,
  (c) => `${c} wants SSO + SCIM provisioning. Confirm timeline with product before committing.`,
  (c) => `Great demo with ${c}. Two stakeholders engaged, decision expected end of quarter.`,
  (c) => `${c} comparing us against a competitor on price. Emphasise support SLA and onboarding.`,
  (c) => `Renewal conversation with ${c} — likely to expand seats next quarter.`,
  (c) => `${c} requested a security questionnaire and SOC 2 report. Sent to the trust center.`,
  (c) => `Procurement at ${c} confirmed budget. Moving to contract redlines this week.`,
];

const TASK_TEMPLATES = [
  (c) => `Send proposal follow-up to ${c}`,
  (c) => `Schedule technical deep-dive with ${c}`,
  (c) => `Quarterly check-in with ${c}`,
  (c) => `Draft ROI one-pager for ${c}`,
  (c) => `Share case study with ${c}`,
  (c) => `Confirm contract redlines with ${c}`,
  (c) => `Book discovery call with ${c}`,
  (c) => `Send security docs to ${c}`,
  (c) => `Negotiate pricing with ${c}`,
  (c) => `Re-engage stalled deal at ${c}`,
];

const personName = () => `${pick(FIRST)} ${pick(LAST)}`;

const emailFor = (name, domain) =>
  `${slug(name.replace(/\s+/g, "."))}@${domain}`;

const run = async () => {
  await connectDB();

  let user = await User.findOne({ email: "alex@timetoprogram.com" });

  if (user) {
    await Promise.all([
      Lead.deleteMany({ owner: user._id }),
      Contact.deleteMany({ owner: user._id }),
      Note.deleteMany({ owner: user._id }),
      Task.deleteMany({ owner: user._id }),
    ]);
  } else {
    user = await User.create({
      name: "Alex Carter",
      email: "alex@timetoprogram.com",
      password: "Test@1234",
      company: "Time To Program",
    });
  }

  const owner = user._id;

  const stageOrder = {
    New: 0,
    Qualified: 0,
    Proposal: 0,
    Won: 0,
    Lost: 0,
  };

  const leadDocs = [];
  const usedCompanies = pickSome(COMPANIES, 40);

  for (let i = 0; i < 40; i++) {
    const [company, domain] = usedCompanies[i] || pick(COMPANIES);
    const name = personName();

    const status = weighted([
      ["New", 28],
      ["Qualified", 24],
      ["Proposal", 20],
      ["Won", 16],
      ["Lost", 12],
    ]);

    const ageDays =
      status === "Won" || status === "Lost"
        ? rand(20, 175)
        : rand(0, 120);

    leadDocs.push({
      owner,
      name,
      email: emailFor(name, domain),
      phone: `+1 555 ${rand(100, 999)}`,
      company,
      status,
      priority: weighted([
        ["High", 35],
        ["Medium", 45],
        ["Low", 20],
      ]),
      source: pick(SOURCES),
      value: rand(8, 220) * 1000,
      notes: pick([
        "Inbound from website demo request.",
        "Referred by an existing customer.",
        "Met at conference — strong technical fit.",
        "Cold outreach, early stage.",
        "Trial active, multiple stakeholders engaged.",
        "",
      ]),
      tags: pickSome(
        ["saas", "enterprise", "smb", "priority"],
        rand(0, 2)
      ),
      order: stageOrder[status]++,
      createdAt: daysAgo(ageDays),
      updatedAt: daysAgo(rand(0, Math.min(ageDays, 14))),
    });
  }

  const leads = await Lead.insertMany(leadDocs);

  const contactDocs = [];
  const usedContactEmails = new Set();

  for (let i = 0; i < 26; i++) {
    const [company, domain] = pick(COMPANIES);
    const name = personName();
    let email = emailFor(name, domain);
    let attempts = 0;
    while (usedContactEmails.has(email) && attempts < 10) {
      email = `${slug(name)}${rand(1, 99)}@${domain}`;
      attempts++;
    }
    usedContactEmails.add(email);

    contactDocs.push({
      owner,
      name,
      title: pick(TITLES),
      company,
      email,
      phone: `+1 555 ${rand(100, 999)}`,
      tags: pickSome(TAGS, rand(1, 3)),
      favorite: Math.random() < 0.2,
      notes: Math.random() < 0.5
        ? pick([
            "Primary point of contact.",
            "Prefers email over calls.",
            "Met at SaaSTr 2025.",
            "Key technical evaluator.",
            "",
          ])
        : "",
      createdAt: daysAgo(rand(0, 160)),
    });
  }

  await Contact.insertMany(contactDocs);

  const noteDocs = [];

  for (let i = 0; i < 22; i++) {
    const lead = pick(leads);

    noteDocs.push({
      owner,
      content: pick(NOTE_TEMPLATES)(lead.company),
      lead: lead._id,
      pinned: Math.random() < 0.25,
      createdAt: daysAgo(rand(0, 90)),
    });
  }

  await Note.insertMany(noteDocs);

  const taskDocs = [];

  for (let i = 0; i < 28; i++) {
    const lead = pick(leads);

    const bucket = weighted([
      ["overdue", 22],
      ["today", 12],
      ["upcoming", 46],
      ["completed", 20],
    ]);

    let dueDate, status, completedAt = null;

    if (bucket === "overdue") {
      dueDate = daysAgo(rand(1, 18));
      status = weighted([
        ["Pending", 60],
        ["In Progress", 40],
      ]);
    } else if (bucket === "today") {
      dueDate = new Date();
      status = weighted([
        ["Pending", 50],
        ["In Progress", 50],
      ]);
    } else if (bucket === "upcoming") {
      dueDate = daysAhead(rand(1, 30));
      status = weighted([
        ["Pending", 65],
        ["In Progress", 35],
      ]);
    } else {
      dueDate = daysAgo(rand(1, 20));
      status = "Completed";
      completedAt = daysAgo(rand(0, 10));
    }

    taskDocs.push({
      owner,
      title: pick(TASK_TEMPLATES)(lead.company),
      description:
        Math.random() < 0.5
          ? pick([
              "Reference the latest proposal and pricing.",
              "Coordinate with the solutions engineering team.",
              "Confirm the next steps and decision timeline.",
              "",
            ])
          : "",
      dueDate,
      status,
      priority: weighted([
        ["High", 35],
        ["Medium", 45],
        ["Low", 20],
      ]),
      relatedLead: lead._id,
      completedAt,
      createdAt: daysAgo(rand(0, 40)),
    });
  }

  await Task.insertMany(taskDocs);

  console.log("✅ Seed complete for Alex Carter's workspace:");
  console.log(`   ${leads.length} leads`);
  console.log(`   ${contactDocs.length} contacts`);
  console.log(`   ${noteDocs.length} notes`);
  console.log(`   ${taskDocs.length} tasks`);
  console.log("   Login → alex@timetoprogram.com / Test@1234");

  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});