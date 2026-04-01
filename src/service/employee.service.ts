// ============================================================
// SERVICE LAYER
// Yahan business logic hoti hai.
// Controller se request aati hai → Service validate/process karta hai
// → Repository ko DB query ke liye call karta hai
// ============================================================

import {
  CreateEmployeeDto,
  EmployeeRepository,
} from "../repository/employee.repository";

const repo = new EmployeeRepository();

export class EmployeeService {
  // ----------------------------------------------------------
  // GET ALL with filters + pagination
  // ----------------------------------------------------------
  async getAllEmployees(filters: {
    department?: string;
    city?: string;
    page?: number;
    limit?: number;
  }) {
    const limit = filters.limit || 10; // default 10 records per page
    // page 1 → offset 0, page 2 → offset 10, page 3 → offset 20 ...
    const offset = ((filters.page || 1) - 1) * limit;

    return repo.findAll(filters.department, filters.city, limit, offset);
  }

  // ----------------------------------------------------------
  // GET BY ID — agar employee nahi mila toh error throw karo
  // Service mein error throw karte hain taaki controller clean rahe
  // ----------------------------------------------------------
  async getEmployeeById(id: number) {
    const emp = await repo.findById(id);

    if (!emp) {
      // Ye error controller mein catch hoga aur 404 response jayega
      throw new Error("Employee not found");
    }

    return emp;
  }

  // ----------------------------------------------------------
  // CREATE — basic validation phir repo ko pass karo
  // ----------------------------------------------------------
  async createEmployee(data: CreateEmployeeDto) {
    // Validation: email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error("Invalid email format");
    }

    // Validation: salary positive hona chahiye
    if (data.salary <= 0) {
      throw new Error("Salary must be greater than 0");
    }

    return repo.create(data);
  }

  // ----------------------------------------------------------
  // UPDATE — pehle check karo employee exists karta hai
  // phir update karo
  // ----------------------------------------------------------
  async updateEmployee(id: number, data: Partial<CreateEmployeeDto>) {
    // Agar employee nahi mila toh yahan Error throw hoga
    await this.getEmployeeById(id);

    // Agar salary di hai toh validate karo
    if (data.salary !== undefined && data.salary <= 0) {
      throw new Error("Salary must be greater than 0");
    }

    return repo.update(id, data);
  }

  // ----------------------------------------------------------
  // DELETE — pehle exist check, phir delete
  // ----------------------------------------------------------
  async deleteEmployee(id: number) {
    // Agar nahi mila toh Error throw hoga (404 jayega controller mein)
    await this.getEmployeeById(id);
    return repo.delete(id);
  }
}
