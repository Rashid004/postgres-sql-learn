import { Router } from "express";

import { getDatabaseInfo } from "../controller/database.controller";
import { getHealth } from "../controller/health.controller";
import employeeRoutes from "./employee.routes"; // employee routes import karo

const router = Router();

router.get("/", getHealth);
router.get("/health", getHealth);
router.get("/api/database", getDatabaseInfo);

// /api/employees ke saare routes yahan mount ho jaate hain
router.use("/api/employees", employeeRoutes);

export { router };
