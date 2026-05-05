import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogActions,
  DialogContent,
  Button,
  Input,
  Field,
  Dropdown,
  Option,
  SpinButton,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import type { SpinButtonOnChangeData } from "@fluentui/react-components";
import { DEPARTMENTS } from "../types";
import type { Department, Employee, EmployeeDraft } from "../types";

const useStyles = makeStyles({
  body: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: tokens.spacingHorizontalM,
  },
  full: { gridColumn: "1 / -1" },
});

interface Props {
  open: boolean;
  initial?: Employee;
  onClose: () => void;
  onSubmit: (draft: EmployeeDraft) => void;
}

const empty: EmployeeDraft = {
  firstName: "",
  lastName: "",
  email: "",
  department: "Engineering",
  salary: 1000,
  hiredAt: new Date().toISOString().slice(0, 10),
};

type Errors = Partial<Record<keyof EmployeeDraft, string>>;

function validate(d: EmployeeDraft): Errors {
  const errors: Errors = {};
  if (!d.firstName.trim()) errors.firstName = "Ime je obavezno";
  if (!d.lastName.trim()) errors.lastName = "Prezime je obavezno";
  if (!d.email.trim()) errors.email = "Email je obavezan";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email))
    errors.email = "Neispravan email";
  if (d.salary <= 0) errors.salary = "Plata mora biti veća od 0";
  if (!d.hiredAt) errors.hiredAt = "Datum je obavezan";
  return errors;
}

export function EmployeeDialog({ open, initial, onClose, onSubmit }: Props) {
  const styles = useStyles();
  const [draft, setDraft] = useState<EmployeeDraft>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (open) {
      setDraft(initial ? { ...initial } : empty);
      setErrors({});
      setTouched(false);
    }
  }, [open, initial]);

  const handleSubmit = () => {
    const e = validate(draft);
    setErrors(e);
    setTouched(true);
    if (Object.keys(e).length === 0) {
      onSubmit(draft);
    }
  };

  const set = <K extends keyof EmployeeDraft>(k: K, v: EmployeeDraft[K]) => {
    const next = { ...draft, [k]: v };
    setDraft(next);
    if (touched) setErrors(validate(next));
  };

  return (
    <Dialog open={open} onOpenChange={(_, d) => !d.open && onClose()}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>{initial ? "Izmena zaposlenog" : "Novi zaposleni"}</DialogTitle>
          <DialogContent>
            <div className={styles.body}>
              <Field label="Ime" validationMessage={errors.firstName} required>
                <Input
                  value={draft.firstName}
                  onChange={(_, d) => set("firstName", d.value)}
                />
              </Field>
              <Field label="Prezime" validationMessage={errors.lastName} required>
                <Input
                  value={draft.lastName}
                  onChange={(_, d) => set("lastName", d.value)}
                />
              </Field>
              <Field
                className={styles.full}
                label="Email"
                validationMessage={errors.email}
                required
              >
                <Input
                  type="email"
                  value={draft.email}
                  onChange={(_, d) => set("email", d.value)}
                />
              </Field>
              <Field label="Sektor" required>
                <Dropdown
                  value={draft.department}
                  selectedOptions={[draft.department]}
                  onOptionSelect={(_, d) =>
                    d.optionValue && set("department", d.optionValue as Department)
                  }
                >
                  {DEPARTMENTS.map((dep) => (
                    <Option key={dep} value={dep}>
                      {dep}
                    </Option>
                  ))}
                </Dropdown>
              </Field>
              <Field label="Plata (EUR)" validationMessage={errors.salary} required>
                <SpinButton
                  value={draft.salary}
                  min={0}
                  step={50}
                  onChange={(_, d: SpinButtonOnChangeData) => {
                    const v = d.value ?? Number(d.displayValue ?? 0);
                    if (!Number.isNaN(v)) set("salary", v as number);
                  }}
                />
              </Field>
              <Field
                className={styles.full}
                label="Datum zaposlenja"
                validationMessage={errors.hiredAt}
                required
              >
                <Input
                  type="date"
                  value={draft.hiredAt}
                  onChange={(_, d) => set("hiredAt", d.value)}
                />
              </Field>
            </div>
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="secondary" onClick={onClose}>
                Otkaži
              </Button>
            </DialogTrigger>
            <Button appearance="primary" onClick={handleSubmit}>
              {initial ? "Sačuvaj" : "Dodaj"}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}

