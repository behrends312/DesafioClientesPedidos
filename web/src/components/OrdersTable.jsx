import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function formatMoney(value) {
  const n = Number(value ?? 0);
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function parseApiDate(value) {
  if (!value) return null;

  if (typeof value === "string") {
    const hasTimezone = /Z$|[+-]\d{2}:\d{2}$/.test(value);
    return new Date(hasTimezone ? value : `${value}Z`);
  }

  return new Date(value);
}

function formatDate(value) {
  const d = parseApiDate(value);
  if (!d || Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("pt-BR");
}

export function OrdersTable({ mode, orders, onEdit, onDelete, titleClient }) {
  if (!titleClient && mode === "byClient") {
    return <div className="text-sm text-muted-foreground">Selecione um cliente para ver os pedidos.</div>;
  }

  if (!orders.length) {
    return <div className="text-sm text-muted-foreground">Nenhum pedido encontrado.</div>;
  }

  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Id</TableHead>
            <TableHead className="w-[100px]">ClienteId</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Data</TableHead>
            <TableHead className="w-[220px]">Ações</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {orders.map((o) => (
            <TableRow key={o.id}>
              <TableCell>{o.id}</TableCell>
              <TableCell>{o.clientId}</TableCell>
              <TableCell>{formatMoney(o.totalAmount)}</TableCell>
              <TableCell>{formatDate(o.orderedAt)}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(o)}>
                    Editar
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => onDelete(o.id)}>
                    Excluir
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
