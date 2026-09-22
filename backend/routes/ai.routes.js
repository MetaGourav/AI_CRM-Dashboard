import { Router } from "express";
import {
  aiStatus,
  leadSummary,
  generateEmailDraft,
  salesInsights,
} from "../controllers/ai.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(protect);

router.route("/status").get(aiStatus);
router.route("/lead-summary").post(leadSummary);
router.route("/generate-email").post(generateEmailDraft);
router.route("/email-draft").post(generateEmailDraft);
router.route("/sales-insights").post(salesInsights);

export default router;