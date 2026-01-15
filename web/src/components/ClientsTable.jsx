import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function ClientsTable({ clients, selectedClientId, onSelect, onEdit, onDelete }) {
  if (!clients.length) {
    return <div className="text-sm text-muted-foreground">Nenhum cliente cadastrado.</div>;
  }

  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Id</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="w-[220px]">Ações</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {clients.map((c) => {
            const active = c.id === selectedClientId;

            return (
              <TableRow key={c.id} className={active ? "bg-muted/50" : ""}>
                <TableCell>{c.id}</TableCell>
                <TableCell>
                  <Button variant="link" className="px-0" onClick={() => onSelect(c.id)}>
                    {c.name}
                  </Button>
                </TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => onEdit(c)}>
                      Editar
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => onDelete(c.id)}>
                      Excluir
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
