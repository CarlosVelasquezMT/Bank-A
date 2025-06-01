import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

const TransactionDialog = ({ isOpen, onClose, onSubmit, accountNumber }) => {
  const [transactionData, setTransactionData] = useState({
    type: "deposit",
    amount: "",
    description: "",
  });
  const { toast } = useToast();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setTransactionData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!transactionData.amount || !transactionData.description) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor, complete todos los campos de la transacción.",
      });
      return;
    }
    onSubmit(transactionData);
    setTransactionData({ type: "deposit", amount: "", description: "" }); // Reset form
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva Transacción</DialogTitle>
          <DialogDescription>
            Registre un depósito o retiro para la cuenta {accountNumber}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Tipo de Transacción</Label>
              <select
                id="type"
                value={transactionData.type}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="deposit">Depósito</option>
                <option value="withdrawal">Retiro</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Monto</Label>
              <Input
                id="amount"
                type="number"
                min="0.01"
                step="0.01"
                value={transactionData.amount}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Input
                id="description"
                value={transactionData.description}
                onChange={handleChange}
                placeholder="Ej: Pago de servicios"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Agregar Transacción</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDialog;