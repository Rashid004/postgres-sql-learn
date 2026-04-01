// ============================================================
// ROUTES FILE
// Yahan define karte hain ki kaunsa HTTP method + URL
// kis controller function ko call karega.
//
// Flow:
//   Postman Request
//     → Route match hota hai
//       → Controller function call hota hai
//         → Service (business logic)
//           → Repository (DB query)
// ============================================================

import { Router } from "express";
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controller/employee.controller";

const router = Router();

// GET    /employees          → saare employees (filter + pagination support)
// POST   /employees          → naya employee banao
router.get("/", getAllEmployees);
router.post("/", createEmployee);

// GET    /employees/:id      → ek employee ID se
// PUT    /employees/:id      → employee update karo
// DELETE /employees/:id      → employee delete karo
router.get("/:id", getEmployeeById);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);

export default router;
