import { Router } from "express";
import auth from "../../middleware/auth";
import role from "../../middleware/role";
import { metricsController } from "./metrics.controller";

const router = Router();

router.get("/", auth, role("maintainer"), metricsController.getSystemMetrics);

export const metricsRouter = router;
