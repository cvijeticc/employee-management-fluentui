import { useMemo, useState } from "react";
import {
  FluentProvider,
  webLightTheme,
  webDarkTheme,
  Button,
  Input,
  Dropdown,
  Option,
  Title2,
  Body1,
  makeStyles,
  tokens,
  Switch,
} from "@fluentui/react-components";
import { AddRegular, SearchRegular } from "@fluentui/react-icons";
import { EmployeeTable } from "./components/EmployeeTable";
import type { SortDir, SortKey } from "./components/EmployeeTable";
import { EmployeeDialog } from "./components/EmployeeDialog";
import { DeleteDialog } from "./components/DeleteDialog";
import { DEPARTMENTS } from "./types";
import type { Department, Employee, EmployeeDraft } from "./types";
import * as storage from "./storage";

const useStyles = makeStyles({
  page: {
    minHeight: "100vh",
    background: tokens.colorNeutralBackground2,
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: tokens.spacingVerticalXL,
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: tokens.spacingVerticalL,
    flexWrap: "wrap",
    gap: tokens.spacingHorizontalM,
  },
  toolbar: {
    display: "flex",
    gap: tokens.spacingHorizontalM,
    alignItems: "end",
    marginBottom: tokens.spacingVerticalM,
    flexWrap: "wrap",
  },
  card: {
    background: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusLarge,
    boxShadow: tokens.shadow4,
    padding: tokens.spacingVerticalL,
  },
  search: { minWidth: "260px" },
  meta: {
    marginTop: tokens.spacingVerticalM,
    color: tokens.colorNeutralForeground3,
  },
  headerActions: {
    display: "flex",
    gap: tokens.spacingHorizontalM,
    alignItems: "center",
  },
});

type Filter = "All" | Department;

export default function App() {
  const styles = useStyles();
  const [items, setItems] = useState<Employee[]>(() => storage.loadAll());
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [sortKey, setSortKey] = useState<SortKey>("lastName");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [editing, setEditing] = useState<Employee | undefined>(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Employee | null>(null);
  const [dark, setDark] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items
      .filter((e) => filter === "All" || e.department === filter)
      .filter((e) => {
        if (!q) return true;
        return (
          e.firstName.toLowerCase().includes(q) ||
          e.lastName.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        const av = a[sortKey];
        const bv = b[sortKey];
        let cmp = 0;
        if (typeof av === "number" && typeof bv === "number") cmp = av - bv;
        else cmp = String(av).localeCompare(String(bv));
        return sortDir === "asc" ? cmp : -cmp;
      });
  }, [items, query, filter, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const openCreate = () => {
    setEditing(undefined);
    setDialogOpen(true);
  };

  const openEdit = (e: Employee) => {
    setEditing(e);
    setDialogOpen(true);
  };

  const handleSubmit = (draft: EmployeeDraft) => {
    if (editing) {
      const updated = storage.update(editing.id, draft);
      setItems((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
    } else {
      const created = storage.create(draft);
      setItems((prev) => [created, ...prev]);
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (!toDelete) return;
    storage.remove(toDelete.id);
    setItems((prev) => prev.filter((e) => e.id !== toDelete.id));
    setToDelete(null);
  };

  return (
    <FluentProvider theme={dark ? webDarkTheme : webLightTheme}>
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <Title2 as="h1" block>
                Upravljanje zaposlenima
              </Title2>
              <Body1 as="p" block>
                CRUD aplikacija - React + TypeScript + Fluent UI
              </Body1>
            </div>
            <div className={styles.headerActions}>
              <Switch
                label="Tamna tema"
                checked={dark}
                onChange={(_, d) => setDark(d.checked)}
              />
              <Button
                appearance="primary"
                icon={<AddRegular />}
                onClick={openCreate}
              >
                Dodaj zaposlenog
              </Button>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.toolbar}>
              <Input
                className={styles.search}
                placeholder="Pretraga po imenu, prezimenu ili email-u…"
                contentBefore={<SearchRegular />}
                value={query}
                onChange={(_, d) => setQuery(d.value)}
              />
              <Dropdown
                placeholder="Sektor"
                value={filter}
                selectedOptions={[filter]}
                onOptionSelect={(_, d) =>
                  d.optionValue && setFilter(d.optionValue as Filter)
                }
              >
                <Option value="All">Svi sektori</Option>
                {DEPARTMENTS.map((dep) => (
                  <Option key={dep} value={dep}>
                    {dep}
                  </Option>
                ))}
              </Dropdown>
            </div>

            <EmployeeTable
              items={filtered}
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={handleSort}
              onEdit={openEdit}
              onDelete={(e) => setToDelete(e)}
            />

            <div className={styles.meta}>
              Prikazano: <b>{filtered.length}</b> / Ukupno: <b>{items.length}</b>
            </div>
          </div>
        </div>

        <EmployeeDialog
          open={dialogOpen}
          initial={editing}
          onClose={() => setDialogOpen(false)}
          onSubmit={handleSubmit}
        />

        <DeleteDialog
          employee={toDelete}
          onCancel={() => setToDelete(null)}
          onConfirm={handleDelete}
        />
      </div>
    </FluentProvider>
  );
}
