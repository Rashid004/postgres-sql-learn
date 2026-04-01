import { Router } from "express";

import { getDatabaseInfo } from "../controller/database.controller";
import { getHealth } from "../controller/health.controller";

const router = Router();

router.get("/", getHealth);
router.get("/health", getHealth);
router.get("/api/database", getDatabaseInfo);

export { router };
