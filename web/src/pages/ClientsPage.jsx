import { useEffect, useMemo, useState } from "react";
import { api } from "../api";
import { ClientsTable } from "../components/ClientsTable";
import { ClientForm } from "../components/ClientForm";
import { OrdersTable } from "../components/OrdersTable";
import { OrderForm } from "../components/OrderForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

function normalizeApiError(err, fallback) {
  const msg = err?.response?.data?.error;
  if (typeof msg === "string" && msg.trim()) return msg;
  return fallback;
}

export function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [orders, setOrders] = useState([]);
  const [clientsWithOrders, setClientsWithOrders] = useState([]);

  const [selectedClientId, setSelectedClientId] = useState(null);

  const [clientEditing, setClientEditing] = useState(null);
  const [orderEditing, setOrderEditing] = useState(null);

  const [loading, setLoading] = useState({
    clients: true,
    orders: true,
    join: true,
  });

  const [error, setError] = useState("");

  const [confirm, setConfirm] = useState({
    open: false,
    title: "",
    description: "",
    confirmText: "Excluir",
    cancelText: "Cancelar",
    action: null,
  });

  function openConfirm({ title, description, action, confirmText = "Excluir" }) {
    setConfirm({
      open: true,
      title,
      description,
      confirmText,
      cancelText: "Cancelar",
      action,
    });
  }

  function closeConfirm() {
    setConfirm((s) => ({ ...s, open: false, action: null }));
  }

  const selectedClient = useMemo(
    () => clients.find((c) => c.id === selectedClientId) ?? null,
    [clients, selectedClientId]
  );

  const selectedClientOrders = useMemo(() => {
    if (!selectedClientId) return [];
    const found = clientsWithOrders.find((c) => c.id === selectedClientId);
    return Array.isArray(found?.orders) ? found.orders : [];
  }, [clientsWithOrders, selectedClientId]);

  async function loadClients() {
    setLoading((s) => ({ ...s, clients: true }));
    const { data } = await api.get("/clients");
    setClients(Array.isArray(data) ? data : []);
    setLoading((s) => ({ ...s, clients: false }));
  }

  async function loadOrders() {
    setLoading((s) => ({ ...s, orders: true }));
    const { data } = await api.get("/orders");
    setOrders(Array.isArray(data) ? data : []);
    setLoading((s) => ({ ...s, orders: false }));
  }

  async function loadJoin() {
    setLoading((s) => ({ ...s, join: true }));
    const { data } = await api.get("/clients/with-orders");
    setClientsWithOrders(Array.isArray(data) ? data : []);
    setLoading((s) => ({ ...s, join: false }));
  }

  async function refreshAll() {
    await Promise.all([loadClients(), loadOrders(), loadJoin()]);
  }

  useEffect(() => {
    (async () => {
      setError("");
      try {
        await refreshAll();
      } catch (e) {
        const msg = normalizeApiError(e, "Falha ao carregar dados.");
        setError(msg);
        toast.error(msg);
        setLoading({ clients: false, orders: false, join: false });
      }
    })();
  }, []);

  async function createClient(payload) {
    setError("");
    try {
      await api.post("/clients", payload);
      await refreshAll();
      toast.success("Cliente criado com sucesso.");
    } catch (e) {
      const msg = normalizeApiError(e, "Falha ao criar cliente.");
      setError(msg);
      toast.error(msg);
      throw e;
    }
  }

  async function updateClient(id, payload) {
    setError("");
    try {
      await api.put(`/clients/${id}`, payload);
      setClientEditing(null);
      await refreshAll();
      toast.success("Cliente atualizado com sucesso.");
    } catch (e) {
      const msg = normalizeApiError(e, "Falha ao atualizar cliente.");
      setError(msg);
      toast.error(msg);
      throw e;
    }
  }

  async function deleteClient(id) {
    setError("");
    try {
      await api.delete(`/clients/${id}`);
      if (selectedClientId === id) setSelectedClientId(null);
      await refreshAll();
      toast.success("Cliente excluído com sucesso.");
    } catch (e) {
      const msg = normalizeApiError(e, "Falha ao excluir cliente.");
      setError(msg);
      toast.error(msg);
      throw e;
    }
  }

  async function createOrder(payload) {
    setError("");
    try {
      await api.post("/orders", payload);
      await refreshAll();
      toast.success("Pedido criado com sucesso.");
    } catch (e) {
      const msg = normalizeApiError(e, "Falha ao criar pedido.");
      setError(msg);
      toast.error(msg);
      throw e;
    }
  }

  async function updateOrder(id, payload) {
    setError("");
    try {
      await api.put(`/orders/${id}`, payload);
      setOrderEditing(null);
      await refreshAll();
      toast.success("Pedido atualizado com sucesso.");
    } catch (e) {
      const msg = normalizeApiError(e, "Falha ao atualizar pedido.");
      setError(msg);
      toast.error(msg);
      throw e;
    }
  }

  async function deleteOrder(id) {
    setError("");
    try {
      await api.delete(`/orders/${id}`);
      await refreshAll();
      toast.success("Pedido excluído com sucesso.");
    } catch (e) {
      const msg = normalizeApiError(e, "Falha ao excluir pedido.");
      setError(msg);
      toast.error(msg);
      throw e;
    }
  }

  const isClientEditOpen = Boolean(clientEditing);
  const isOrderEditOpen = Boolean(orderEditing);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Clientes e Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              CRUD completo via frontend consumindo API REST.
            </p>
          </CardContent>
        </Card>

        {error && (
          <Card className="border-destructive/40 bg-destructive/10">
            <CardContent className="p-4 text-sm text-destructive">
              {error}
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 lg:grid-cols-2">
          <section className="space-y-6">

            <Card className="h-[300px]">
              <CardHeader>
                <CardTitle>Novo cliente</CardTitle>
              </CardHeader>
              <CardContent className="h-[calc(100%-64px)] overflow-y-auto">
                <ClientForm
                  key="new-client"
                  initialValue={null}
                  onCancel={null}
                  onSubmit={async (payload) => createClient(payload)}
                />
              </CardContent>
            </Card>
            
            <Card className="h-[300px]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Clientes</CardTitle>
                {loading.clients && (
                  <span className="text-sm text-muted-foreground">
                    Carregando...
                  </span>
                )}
              </CardHeader>
              <CardContent className="h-[calc(100%-64px)] overflow-y-auto">
                <ClientsTable
                  clients={clients}
                  selectedClientId={selectedClientId}
                  onSelect={(id) => setSelectedClientId(id)}
                  onEdit={(client) => setClientEditing(client)}
                  onDelete={(id) =>
                    openConfirm({
                      title: "Excluir cliente",
                      description:
                        "Essa ação não pode ser desfeita. O cliente será removido permanentemente.",
                      action: () => deleteClient(id),
                    })
                  }
                />
              </CardContent>
            </Card>

            
          </section>

          <section className="space-y-6">

            <Card className="h-[300px]">
              <CardHeader>
                <CardTitle>Novo pedido</CardTitle>
              </CardHeader>
              <CardContent className="h-[calc(100%-64px)] overflow-y-auto">
                <OrderForm
                  key="new-order"
                  clients={clients}
                  initialValue={null}
                  defaultClientId={selectedClientId}
                  onCancel={null}
                  onSubmit={async (payload) => createOrder(payload)}
                />
              </CardContent>
            </Card>

            <Card className="h-[300px]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Pedidos do cliente</CardTitle>
                {loading.join && (
                  <span className="text-sm text-muted-foreground">
                    Carregando...
                  </span>
                )}
              </CardHeader>
              <CardContent className="h-[calc(100%-64px)] overflow-y-auto">
                <OrdersTable
                  mode="byClient"
                  titleClient={selectedClient?.name ?? null}
                  orders={selectedClientOrders}
                  onEdit={(order) => setOrderEditing(order)}
                  onDelete={(id) =>
                    openConfirm({
                      title: "Excluir pedido",
                      description:
                        "Essa ação não pode ser desfeita. O pedido será removido permanentemente.",
                      action: () => deleteOrder(id),
                    })
                  }
                />
              </CardContent>
            </Card>

            

            <Card className="h-[300px]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Todos os pedidos</CardTitle>
                {loading.orders && (
                  <span className="text-sm text-muted-foreground">
                    Carregando...
                  </span>
                )}
              </CardHeader>
              <CardContent className="h-[calc(100%-64px)] overflow-y-auto">
                <OrdersTable
                  mode="all"
                  orders={orders}
                  onEdit={(order) => setOrderEditing(order)}
                  onDelete={(id) =>
                    openConfirm({
                      title: "Excluir pedido",
                      description:
                        "Essa ação não pode ser desfeita. O pedido será removido permanentemente.",
                      action: () => deleteOrder(id),
                    })
                  }
                />
              </CardContent>
            </Card>
          </section>
        </div>

        <Dialog
          open={isClientEditOpen}
          onOpenChange={(open) => !open && setClientEditing(null)}
        >
          <DialogContent className="sm:max-w-[520px]">
            <DialogHeader>
              <DialogTitle>Editar cliente</DialogTitle>
            </DialogHeader>

            <ClientForm
              key={clientEditing?.id ?? "edit-client"}
              initialValue={clientEditing}
              onCancel={() => setClientEditing(null)}
              onSubmit={async (payload) => updateClient(clientEditing.id, payload)}
            />
          </DialogContent>
        </Dialog>

        <Dialog
          open={isOrderEditOpen}
          onOpenChange={(open) => !open && setOrderEditing(null)}
        >
          <DialogContent className="sm:max-w-[520px]">
            <DialogHeader>
              <DialogTitle>Editar pedido</DialogTitle>
            </DialogHeader>

            <OrderForm
              key={orderEditing?.id ?? "edit-order"}
              clients={clients}
              initialValue={orderEditing}
              defaultClientId={selectedClientId}
              onCancel={() => setOrderEditing(null)}
              onSubmit={async (payload) => updateOrder(orderEditing.id, payload)}
            />
          </DialogContent>
        </Dialog>

        <AlertDialog
          open={confirm.open}
          onOpenChange={(open) => !open && closeConfirm()}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{confirm.title}</AlertDialogTitle>
              <AlertDialogDescription>
                {confirm.description}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel onClick={closeConfirm}>
                {confirm.cancelText}
              </AlertDialogCancel>

              <AlertDialogAction
                onClick={async () => {
                  const action = confirm.action;
                  closeConfirm();
                  if (action) await action();
                }}
              >
                {confirm.confirmText}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
