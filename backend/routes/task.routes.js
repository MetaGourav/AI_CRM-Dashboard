import { Router } from "express";
import { getTasks, createTask, updateTask, deleteTask } from "../controllers/task.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(protect);

router.get("/",getTasks);
router.post("/",createTask);
router.put("/:id",updateTask);
router.delete("/:id",deleteTask);


export default router;