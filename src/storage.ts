import type { Employee, EmployeeDraft } from "./types";

const KEY = "employees-v1";

const seed: Employee[] = [
  {
    id: crypto.randomUUID(),
    firstName: "Ana",
    lastName: "Petrović",
    email: "ana.petrovic@example.com",
    department: "Engineering",
    salary: 2500,
    hiredAt: "2023-06-01",
  },
  {
    id: crypto.randomUUID(),
    firstName: "Marko",
    lastName: "Jovanović",
    email: "marko.j@example.com",
    department: "Sales",
    salary: 1800,
    hiredAt: "2022-11-15",
  },
  {
    id: crypto.randomUUID(),
    firstName: "Jelena",
    lastName: "Nikolić",
    email: "jelena.n@example.com",
    department: "Design",
    salary: 2100,
    hiredAt: "2024-02-20",
  },
];

export function loadAll(): Employee[] {
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    localStorage.setItem(KEY, JSON.stringify(seed));
    return seed;
  }
  try {
    return JSON.parse(raw) as Employee[];
  } catch {
    return [];
  }
}

function saveAll(items: Employee[]): void {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function create(draft: EmployeeDraft): Employee {
  const items = loadAll();
  const created: Employee = { ...draft, id: crypto.randomUUID() };
  saveAll([created, ...items]);
  return created;
}

export function update(id: string, draft: EmployeeDraft): Employee {
  const items = loadAll();
  const next = items.map((e) => (e.id === id ? { ...draft, id } : e));
  saveAll(next);
  return { ...draft, id };
}

export function remove(id: string): void {
  const items = loadAll().filter((e) => e.id !== id);
  saveAll(items);
}
