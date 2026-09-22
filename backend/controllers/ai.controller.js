import Lead from "../models/Lead.js";
import {
  isAiConfigured,
  generateLeadSummary,
  generateEmail,
  generateSalesInsights,
  generateText,
} from "../services/ai.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const resolveLead = async (req) => {
  if (req.body.leadId) {
    const lead = await Lead.findOne({
      _id: req.body.leadId,
      owner: req.user._id,
    });

    if (!lead) throw new ApiError(404, "Lead not found");

    return lead;
  }

  if (req.body.lead) return req.body.lead;

  throw new ApiError(400, "Provide a leadId or an inline lead object");
};

export const aiStatus = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    configured: isAiConfigured(),
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  });
});

export const leadSummary = asyncHandler(async (req, res) => {
  const lead = await resolveLead(req);
  const result = await generateLeadSummary(lead);

  if (req.body.leadId) {
    await Lead.updateOne(
      {
        _id: req.body.leadId,
        owner: req.user._id,
      },
      {
        $set: {
          aisummary: result.summary,
          aiRiskScore: result.riskScore,
        },
      }
    );
  }

  res.json({
    success: true,
    ...result,
  });
});

export const generateEmailDraft = asyncHandler(async (req, res) => {
  const lead = await resolveLead(req);
  const { purpose, tone } = req.body;

  const result = await generateEmail({
    lead,
    purpose,
    tone,
    sender: {
      name: req.user?.name || "",
      company: req.user?.company || "",
    },
  });

  res.json({
    success: true,
    ...result,
  });
});

export const salesInsights = asyncHandler(async (req, res) => {
  let stats = req.body.stats;

  if (!stats) {
    const leads = await Lead.find({
      owner: req.user._id,
    });

    stats = buildPipelineStats(leads);
  }

  const result = await generateSalesInsights(stats);

  res.json({
    success: true,
    ...result,
  });
});

const buildPipelineStats = (leads) => {
  const byStage = {};
  let totalValue = 0;

  for (const l of leads) {
    byStage[l.status] = byStage[l.status] || { count: 0, value: 0 };

    byStage[l.status].count += 1;
    byStage[l.status].value += l.value || 0;

    totalValue += l.value || 0;
  }

  const won = byStage.Won?.count || 0;
  const lost = byStage.Lost?.count || 0;
  const closed = won + lost;

  return {
    totalLeads: leads.length,
    totalPipelineValue: totalValue,
    winRate: closed ? Math.round((won / closed) * 100) : 0,
    stages: byStage,
  };
};