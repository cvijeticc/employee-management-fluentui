export type Department = "Engineering" | "Design" | "HR" | "Sales" | "Finance";

export const DEPARTMENTS: Department[] = [
  "Engineering",
  "Design",
  "HR",
  "Sales",
  "Finance",
];

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: Department;
  salary: number;
  hiredAt: string;
}

export type EmployeeDraft = Omit<Employee, "id">;
