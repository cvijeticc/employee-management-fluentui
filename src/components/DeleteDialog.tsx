import {
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@fluentui/react-components";
import type { Employee } from "../types";

interface Props {
  employee: Employee | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteDialog({ employee, onCancel, onConfirm }: Props) {
  return (
    <Dialog open={employee !== null} onOpenChange={(_, d) => !d.open && onCancel()}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Brisanje zaposlenog</DialogTitle>
          <DialogContent>
            Da li ste sigurni da želite da obrišete{" "}
            <b>
              {employee?.firstName} {employee?.lastName}
            </b>
            ? Ova akcija se ne može poništiti.
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={onCancel}>
              Otkaži
            </Button>
            <Button appearance="primary" onClick={onConfirm}>
              Obriši
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
