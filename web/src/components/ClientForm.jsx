import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function validate({ name, email }) {
  if (!name.trim()) return "Nome é obrigatório.";
  if (!email.trim()) return "Email é obrigatório.";
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  if (!ok) return "Email inválido.";
  return "";
}

export function ClientForm({ initialValue, onSubmit, onCancel }) {
  const initial = useMemo(
    () => ({
      name: initialValue?.name ?? "",
      email: initialValue?.email ?? "",
    }),
    [initialValue]
  );

  const [name, setName] = useState(initial.name);
  const [email, setEmail] = useState(initial.email);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = { name: name.trim(), email: email.trim() };
    const msg = validate(payload);
    if (msg) {
      setFormError(msg);
      return;
    }

    setFormError("");
    setSubmitting(true);

    try {
      await onSubmit(payload);
      setName("");
      setEmail("");
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
        <Label htmlFor="client-name">Nome</Label>
        <Input id="client-name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="client-email">Email</Label>
        <Input id="client-email" value={email} onChange={(e) => setEmail(e.target.value)} />
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
