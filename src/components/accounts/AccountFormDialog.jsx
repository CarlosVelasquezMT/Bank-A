import React, { useState, useEffect } from "react";
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
import { generateAccountNumber } from "@/lib/utils";

const AccountFormDialog = ({ isOpen, onClose, onSubmit, initialData, title, description }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    initialBalance: "0",
    accountNumber: "",
    password: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        fullName: initialData.fullName || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        address: initialData.address || "",
        initialBalance: initialData.balance?.toString() || "0",
        accountNumber: initialData.accountNumber || "",
        password: initialData.password || "", 
      });
    } else {
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        initialBalance: "0",
        accountNumber: generateAccountNumber(), 
        password: "",
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fullName" className="text-right col-span-1">Nombre</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Nombre completo del cliente"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right col-span-1">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right col-span-1">Teléfono</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Número de teléfono"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right col-span-1">Dirección</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Dirección del cliente"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="accountNumber" className="text-right col-span-1">Nº Cuenta</Label>
              <Input
                id="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                placeholder="Número de cuenta asignado"
                className="col-span-3"
                required
                disabled={!!initialData} 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right col-span-1">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={initialData ? "Dejar en blanco para no cambiar" : "Contraseña inicial"}
                className="col-span-3"
                required={!initialData} 
              />
            </div>
            {!initialData && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="initialBalance" className="text-right col-span-1">Saldo Inicial</Label>
                <Input
                  id="initialBalance"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.initialBalance}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="col-span-3"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {initialData ? "Guardar Cambios" : "Crear Cuenta"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AccountFormDialog;