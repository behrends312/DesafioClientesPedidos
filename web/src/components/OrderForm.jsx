import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function validate({ clientId, totalAmount }) {
  if (!clientId) return "Cliente é obrigatório.";
  const n = Number(totalAmount);
  if (Number.isNaN(n) || n < 0) return "Valor total inválido.";
  return "";
}

export function OrderForm({ clients, initialValue, defaultClientId, onSubmit, onCancel }) {
  const initial = useMemo(() => {
    const clientId = initialValue?.clientId ?? defaultClientId ?? "";
    const totalAmount = initialValue?.totalAmount ?? "";
    return { clientId, totalAmount };
  }, [initialValue, defaultClientId]);

  const [clientId, setClientId] = useState(initial.clientId ? String(initial.clientId) : "");
  const [totalAmount, setTotalAmount] = useState(String(initial.totalAmount ?? ""));
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const canSelectClient = !initialValue;

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = initialValue
      ? { totalAmount: Number(totalAmount) }
      : { clientId: Number(clientId), totalAmount: Number(totalAmount) };

    const msg = validate({ clientId: payload.clientId ?? Number(clientId), totalAmount });
    if (msg) {
      setFormError(msg);
      return;
    }

    setFormError("");
    setSubmitting(true);

    try {
      await onSubmit(payload);
      if (!initialValue) setTotalAmount("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {formError && (
        <div className="rounded border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {formError}
        </div>
      )}

      <div className="space-y-2">
        <Label>Cliente</Label>
        <Select
          value={clientId}
          onValueChange={setClientId}
          disabled={!canSelectClient}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            {clients.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>
                {c.id} - {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="order-total">Valor total</Label>
        <Input
          id="order-total"
          value={totalAmount}
          onChange={(e) => setTotalAmount(e.target.value)}
          inputMode="decimal"
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={submitting}>
          Salvar
        </Button>

        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}
