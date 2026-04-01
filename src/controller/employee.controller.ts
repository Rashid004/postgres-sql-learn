// ============================================================
// CONTROLLER LAYER
// Yahan HTTP request aati hai aur HTTP response jaati hai.
// Controller ka kaam sirf:
//   1. Request se data nikalna (params, body, query)
//   2. Service ko call karna
//   3. Response bhejna (success ya error)
// Business logic yahan nahi hoti — woh Service mein hoti hai
// ============================================================

import { Request, Response } from "express";
import { EmployeeService } from "../service/employee.service";

const service = new EmployeeService();

// ----------------------------------------------------------
// GET /employees
// Query params: ?department=IT&city=Delhi&page=1&limit=5
// ----------------------------------------------------------
export const getAllEmployees = async (req: Request, res: Response) => {
  try {
    const { department, city, page, limit } = req.query;

    const data = await service.getAllEmployees({
      department: department as string,
      city: city as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });

    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ----------------------------------------------------------
// GET /employees/:id
// URL param se id lo, ek employee fetch karo
// ----------------------------------------------------------
export const getEmployeeById = async (req: Request, res: Response) => {
  try {
    // req.params.id always a string hota hai — parseInt se number banao
    const id = parseInt(String(req.params.id));

    const data = await service.getEmployeeById(id);

    res.json({ success: true, data });
  } catch (err: any) {
    // Service "Employee not found" throw karta hai — 404 bhejo
    const status = err.message === "Employee not found" ? 404 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

// ----------------------------------------------------------
// POST /employees
// Body mein naya employee ka data aata hai
// ----------------------------------------------------------
export const createEmployee = async (req: Request, res: Response) => {
  try {
    // req.body = JSON body jo Postman/frontend ne bheja
    const data = await service.createEmployee(req.body);

    // 201 = "Created" — naya resource bana
    res.status(201).json({ success: true, data });
  } catch (err: any) {
    const status = err.message.includes("already exists") ? 409 : 400;
    res.status(status).json({ success: false, message: err.message });
  }
};

// ----------------------------------------------------------
// PUT /employees/:id
// Body mein sirf woh fields bhejo jo update karne hain
// ----------------------------------------------------------
export const updateEmployee = async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id));

    const data = await service.updateEmployee(id, req.body);

    res.json({ success: true, data });
  } catch (err: any) {
    const status = err.message === "Employee not found" ? 404 : 400;
    res.status(status).json({ success: false, message: err.message });
  }
};

// ----------------------------------------------------------
// DELETE /employees/:id
// Employee ko delete karo ID se
// ----------------------------------------------------------
export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id));

    await service.deleteEmployee(id);

    // 200 with message — ya 204 No Content bhi use kar sakte hain
    res.json({ success: true, message: `Employee ${id} deleted successfully` });
  } catch (err: any) {
    const status = err.message === "Employee not found" ? 404 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};
