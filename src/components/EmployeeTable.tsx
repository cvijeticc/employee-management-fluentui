import {
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Button,
  Badge,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import {
  EditRegular,
  DeleteRegular,
  ArrowSortRegular,
  ArrowSortUpRegular,
  ArrowSortDownRegular,
} from "@fluentui/react-icons";
import type { Employee } from "../types";

export type SortKey = keyof Employee;
export type SortDir = "asc" | "desc";

const useStyles = makeStyles({
  empty: {
    padding: tokens.spacingVerticalXXL,
    textAlign: "center",
    color: tokens.colorNeutralForeground3,
  },
  actions: { display: "flex", gap: tokens.spacingHorizontalXS },
  headerBtn: {
    background: "transparent",
    border: "none",
    padding: 0,
    cursor: "pointer",
    font: "inherit",
    color: "inherit",
    display: "inline-flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalXS,
  },
});

interface Props {
  items: Employee[];
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
  onEdit: (e: Employee) => void;
  onDelete: (e: Employee) => void;
}

const columns: { key: SortKey; label: string }[] = [
  { key: "firstName", label: "Ime" },
  { key: "lastName", label: "Prezime" },
  { key: "email", label: "Email" },
  { key: "department", label: "Sektor" },
  { key: "salary", label: "Plata" },
  { key: "hiredAt", label: "Zaposlen" },
];

const fmtSalary = new Intl.NumberFormat("sr-RS", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export function EmployeeTable({
  items,
  sortKey,
  sortDir,
  onSort,
  onEdit,
  onDelete,
}: Props) {
  const styles = useStyles();

  if (items.length === 0) {
    return <div className={styles.empty}>Nema rezultata.</div>;
  }

  const sortIcon = (key: SortKey) => {
    if (sortKey !== key) return <ArrowSortRegular />;
    return sortDir === "asc" ? <ArrowSortUpRegular /> : <ArrowSortDownRegular />;
  };

  return (
    <Table arial-label="Zaposleni" sortable>
      <TableHeader>
        <TableRow>
          {columns.map((c) => (
            <TableHeaderCell key={c.key}>
              <button className={styles.headerBtn} onClick={() => onSort(c.key)}>
                {c.label} {sortIcon(c.key)}
              </button>
            </TableHeaderCell>
          ))}
          <TableHeaderCell style={{ width: 120 }}>Akcije</TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((e) => (
          <TableRow key={e.id}>
            <TableCell>{e.firstName}</TableCell>
            <TableCell>{e.lastName}</TableCell>
            <TableCell>{e.email}</TableCell>
            <TableCell>
              <Badge appearance="tint" color="brand">
                {e.department}
              </Badge>
            </TableCell>
            <TableCell>{fmtSalary.format(e.salary)}</TableCell>
            <TableCell>{e.hiredAt}</TableCell>
            <TableCell>
              <div className={styles.actions}>
                <Button
                  size="small"
                  icon={<EditRegular />}
                  onClick={() => onEdit(e)}
                  aria-label="Izmeni"
                />
                <Button
                  size="small"
                  icon={<DeleteRegular />}
                  onClick={() => onDelete(e)}
                  aria-label="Obriši"
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
