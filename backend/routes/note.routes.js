import { Router } from "express";
import { getNotes, createNote, updateNote, deleteNote } from "../controllers/note.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(protect);


router.get("/", getNotes);
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;