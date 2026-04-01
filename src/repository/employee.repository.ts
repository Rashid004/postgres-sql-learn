// ============================================================
// REPOSITORY LAYER
// Yahan sirf PostgreSQL queries likhte hain.
// Baaki koi logic nahi — bas DB se baat karo.
// ============================================================

import { pool } from "../db/pool"; // hamara PostgreSQL connection pool (env.ts se DATABASE_URL leta hai)
import { Pool } from "pg";

// pool null hoga jab DATABASE_URL missing ho.
// Har query se pehle ye function call karo — agar null hai toh clear error milega.
function getPool(): Pool {
  if (!pool) {
    throw new Error("Database not connected. DATABASE_URL is missing in .env");
  }
  return pool;
}

// ------------------------------------------------------------
// DTO (Data Transfer Object) — ek type jo batata hai
// "create" karte waqt kya kya fields chahiye
// ------------------------------------------------------------
export interface CreateEmployeeDto {
  name: string;
  email: string;
  salary: number;
  city?: string;
}

export class EmployeeRepository {
  // ----------------------------------------------------------
  // GET ALL — saare employees fetch karo
  // Optional filters: department name, city
  // Pagination: limit (kitne records) & offset (kahan se shuru)
  // ----------------------------------------------------------
  async findAll(department?: string, city?: string, limit = 10, offset = 0) {
    // Hum dynamically query banate hain taki sirf wahi filters
    // lagein jo user ne diye hain
    const conditions: string[] = [];
    const values: any[] = [];

    if (department) {
      // $1, $2 — ye PostgreSQL ke parameterized placeholders hain
      // Directly string likhna unsafe hota hai (SQL Injection risk)
      values.push(`%${department}%`);
      // employees JOIN departments — taaki department name se filter ho sake
      conditions.push(
        `d.name ILIKE $${values.length}`, // ILIKE = case-insensitive LIKE
      );
    }

    if (city) {
      values.push(`%${city}%`);
      conditions.push(`e.city ILIKE $${values.length}`);
    }

    // WHERE clause banao agar koi filter hai toh
    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // LIMIT aur OFFSET pagination ke liye
    values.push(limit); // e.g. $2 ya $3
    values.push(offset); // e.g. $3 ya $4

    const query = `
      SELECT
        e.id,
        e.name,
        e.email,
        e.salary,
        e.city,
        e.created_at,
        d.name AS department_name   -- department ka naam bhi saath laate hain
      FROM employees e
      ${whereClause}
      ORDER BY e.created_at DESC
      LIMIT $${values.length - 1}    -- limit placeholder
      OFFSET $${values.length}       -- offset placeholder
    `;

    const result = await getPool().query(query, values);
    return result.rows; // rows = array of employee objects
  }

  // ----------------------------------------------------------
  // GET BY ID — ek employee ID se dhundo
  // ----------------------------------------------------------
  async findById(id: number) {
    const query = `
      SELECT
        e.id,
        e.name,
        e.email,
        e.salary,
        e.city,
        e.created_at,
        d.name AS department_name
      FROM employees e
      WHERE e.id = $1
    `;

    const result = await getPool().query(query, [id]);

    // result.rows[0] = pehla (aur yahan sirf ek hi hoga) record
    // agar nahi mila toh undefined return hoga
    return result.rows[0];
  }

  // ----------------------------------------------------------
  // CREATE — naya employee DB mein daalo
  // RETURNING * matlab INSERT ke baad turant woh record wapas do
  // ----------------------------------------------------------
  async create(data: CreateEmployeeDto) {
    const query = `
      INSERT INTO employees (name, email, salary, city)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const values = [
      data.name,
      data.email,
      data.salary,
      data.city ?? null, // agar city nahi diya toh null daalo
    ];

    const result = await getPool().query(query, values);
    return result.rows[0]; // naya bana hua employee return karo
  }

  // ----------------------------------------------------------
  // UPDATE — existing employee update karo (sirf jo fields aaye)
  // Partial update support: user sirf salary bheje toh sirf woh update ho
  // ----------------------------------------------------------
  async update(id: number, data: Partial<CreateEmployeeDto>) {
    // Dynamically SET clause banate hain
    // e.g. agar { name, salary } aaya toh: SET name=$1, salary=$2
    const fields: string[] = [];
    const values: any[] = [];

    // Har field check karo — agar diya hai toh hi update karo
    if (data.name !== undefined) {
      values.push(data.name);
      fields.push(`name = $${values.length}`);
    }
    if (data.email !== undefined) {
      values.push(data.email);
      fields.push(`email = $${values.length}`);
    }
    if (data.salary !== undefined) {
      values.push(data.salary);
      fields.push(`salary = $${values.length}`);
    }
    if (data.city !== undefined) {
      values.push(data.city);
      fields.push(`city = $${values.length}`);
    }

    // id ko last mein push karo — WHERE id = $N
    values.push(id);

    const query = `
      UPDATE employees
      SET ${fields.join(", ")}
      WHERE id = $${values.length}
      RETURNING *
    `;

    const result = await getPool().query(query, values);
    return result.rows[0]; // updated employee return karo
  }

  // ----------------------------------------------------------
  // DELETE — employee ko DB se hatao
  // ----------------------------------------------------------
  async delete(id: number) {
    const query = `
      DELETE FROM employees
      WHERE id = $1
      RETURNING id  -- confirm karo ki delete hua
    `;

    const result = await getPool().query(query, [id]);
    return result.rows[0]; // { id: deletedId }
  }
}
