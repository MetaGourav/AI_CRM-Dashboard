/* ─────────────────────────────────────────────────────────────────────────
   API service layer — UI-ONLY BOILERPLATE (mock mode).

   Every method currently resolves MOCK data from lib/mockData.js so the whole
   app runs without a backend. The real axios calls are kept commented right
   above each mock so that, once your backend is live, you:

     1. Enable the axios client in lib/api.js (uncomment it there).
     2. Uncomment the `import api` line below.
     3. In each method, swap the mock line for the commented real line.

   The shapes returned here match the real API exactly, so no page/component
   needs to change.
   ───────────────────────────────────────────────────────────────────────── */

import api from "./api";

/* ── Auth ───────────────────────────────────────────────────────────── */
export const authApi = {
  login: (data) => api.post("/auth/login", data),

  register: (data) => api.post("/auth/register", data),

  me: () => api.get("/auth/me"),

  updateProfile: (data) => api.put("/auth/profile", data),
};

/* ── Leads ──────────────────────────────────────────────────────────── */
export const leadsApi = {
  list: (params) => api.get("/leads", { params }),

  get: (id) => api.get(`/leads/${id}`),

  create: (data) => api.post("/leads", data),


  update: (id, data) => api.put(`/leads/${id}`, data),


  remove: (id) => api.delete(`/leads/${id}`),


  reorder: (updates) => api.patch("/leads/reorder", { updates }),

};
/* ── Contacts ───────────────────────────────────────────────────────── */
export const contactsApi = {
  list: (params) => api.get("/contacts", { params }),

  get: (id) => api.get(`/contacts/${id}`),

  create: (data) => api.post("/contacts", data),


  update: (id, data) => api.put(`/contacts/${id}`, data),

  remove: (id) => api.delete(`/contacts/${id}`),
};

/* ── Notes ──────────────────────────────────────────────────────────── */
export const notesApi = {
  list: (params) => api.get("/notes", { params }),


  create: (data) => api.post("/notes", data),


  update: (id, data) => api.put(`/notes/${id}`, data),


  remove: (id) => api.delete(`/notes/${id}`),

};

/* ── Tasks ──────────────────────────────────────────────────────────── */
export const tasksApi = {
  list: (params) => api.get("/tasks", { params }),

  create: (data) => api.post("/tasks", data),


  update: (id, data) => api.put(`/tasks/${id}`, data),


  remove: (id) => api.delete(`/tasks/${id}`),

};

/* ── AI (canned mock responses) ─────────────────────────────────────── */
export const aiApi = {
  status: () => api.get("/ai/status"),

  leadSummary: (data) => api.post("/ai/lead-summary", data),

  generateEmail: (data) => api.post("/ai/generate-email", data),

  salesInsights: (data) => api.post("/ai/sales-insights", data),
};

/* ── Analytics (computed from the in-memory leads, so the dashboard always
      matches the Leads/Pipeline pages) ──────────────────────────────────── */
export const analyticsApi = {
  overview: () => api.get("/analytics/overview"),
};

// function buildOverview() {
//   const stages = ["New", "Qualified", "Proposal", "Won", "Lost"];
//   const byStage = Object.fromEntries(stages.map((s) => [s, { count: 0, value: 0 }]));
//   let totalValue = 0;
//   let wonValue = 0;

//   for (const l of leads) {
//     const b = byStage[l.status] || (byStage[l.status] = { count: 0, value: 0 });
//     b.count += 1;
//     b.value += l.value || 0;
//     totalValue += l.value || 0;
//     if (l.status === "Won") wonValue += l.value || 0;
//   }
//   const won = byStage.Won.count;
//   const lost = byStage.Lost.count;
//   const closed = won + lost;
//   const conversionRate = closed ? Math.round((won / closed) * 100) : 0;

//   // Last 6 months trend from lead createdAt.
//   const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//   const now = new Date();
//   const months = [];
//   for (let i = 5; i >= 0; i--) {
//     const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
//     months.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: labels[d.getMonth()] });
//   }
//   const idx = Object.fromEntries(months.map((m, i) => [m.key, i]));
//   const trend = months.map((m) => ({ month: m.label, leads: 0, won: 0 }));
//   for (const l of leads) {
//     const d = new Date(l.createdAt);
//     const key = `${d.getFullYear()}-${d.getMonth()}`;
//     if (idx[key] !== undefined) {
//       trend[idx[key]].leads += 1;
//       if (l.status === "Won") trend[idx[key]].won += l.value || 0;
//     }
//   }

//   const recentLeads = [...leads]
//     .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
//     .slice(0, 6)
//     .map((l) => ({
//       id: l._id,
//       name: l.name,
//       company: l.company,
//       status: l.status,
//       value: l.value,
//       updatedAt: l.updatedAt,
//     }));

//   return {
//     success: true,
//     stats: {
//       revenueWon: wonValue,
//       pipelineValue: totalValue,
//       totalLeads: leads.length,
//       totalContacts: contacts.length,
//       openTasks: tasks.filter((t) => t.status !== "Completed").length,
//       conversionRate,
//     },
//     pipeline: stages.map((s) => ({ stage: s, count: byStage[s].count, value: byStage[s].value })),
//     trend,
//     recentLeads,
//   };
// }
