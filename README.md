# Employee Management (React + Fluent UI v9)

A CRUD app for managing employees, built as an independent task during my frontend internship. It uses React 19, TypeScript, Vite and Microsoft Fluent UI v9, and keeps the data in the browser's localStorage (there is no backend).

- Create, edit and delete employees (first name, last name, email, department, salary, hire date)
- Search by first name, last name or email, filter by department, sort by any column
- Form validation: required fields, email format, salary greater than 0
- Light and dark theme

Run it with Node.js 20.19+: `npm install`, then `npm run dev` (http://localhost:5173).

The rest of this README is in Serbian.

---

## Upravljanje zaposlenima (opis na srpskom)

CRUD aplikacija razvijena kao zadatak za samostalan rad u sklopu prakse iz sektora za razvoj korisničkog interfejsa.

### Tehnologije

- **React 19** + **TypeScript**
- **Vite** kao build alat i dev server
- **Fluent UI v9** (`@fluentui/react-components`) — Microsoft-ov dizajn sistem
- **localStorage** za perzistenciju (bez backend-a)

### Funkcionalnosti

- **C**reate / **R**ead / **U**pdate / **D**elete zaposlenih
- Pretraga po imenu, prezimenu ili e-mail adresi
- Filtriranje po sektoru
- Sortiranje po svim kolonama (rastuće / opadajuće)
- Validacija forme (obavezna polja, regex za e-mail, plata > 0)
- Light / Dark tema
- Podaci preživljavaju refresh stranice (localStorage)

### Pokretanje

Potreban je Node.js 20.19+ (zahtev Vite-a).

```bash
npm install
npm run dev
```

Aplikacija će biti dostupna na `http://localhost:5173`.

Za produkcioni build:

```bash
npm run build
npm run preview
```

### Struktura projekta

```
src/
├── types.ts                       # Employee, Department, EmployeeDraft tipovi
├── storage.ts                     # CRUD nad localStorage-om
├── App.tsx                        # Glavna komponenta + state
├── main.tsx                       # Ulazna tačka
├── index.css                      # Globalni reset
└── components/
    ├── EmployeeTable.tsx          # Sortabilna tabela
    ├── EmployeeDialog.tsx         # Forma za create/edit (modal)
    └── DeleteDialog.tsx           # Potvrda brisanja
```

### Model podataka

```ts
interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: "Engineering" | "Design" | "HR" | "Sales" | "Finance";
  salary: number;
  hiredAt: string;
}
```

### Napomene

- Tip `EmployeeDraft = Omit<Employee, "id">` razdvaja podatke koje korisnik unosi od podataka koje sistem generiše.
- `useMemo` se koristi za filtriranu i sortiranu listu kako bi se izbegao recompute na svaki render.
- Sva ažuriranja stanja su immutabilna (`map`, `filter`, spread) zbog načina na koji React poredi reference.
- Fluent UI v9 koristi Griffel (CSS-in-JS) preko `makeStyles` — stilovi su tipovani i koriste theme tokene.
