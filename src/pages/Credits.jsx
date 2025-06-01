import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CreditCard, Plus, Search, Filter, Edit, Trash2, CheckCircle, XCircle, Clock } from "lucide-react";
import { useBank } from "@/contexts/BankContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Credits = () => {
  const { credits, accounts, createCredit, updateCredit } = useBank();
  const { toast } = useToast();
  const [isCreditDialogOpen, setIsCreditDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [currentCredit, setCurrentCredit] = useState(null);
  const [newCredit, setNewCredit] = useState({
    accountId: "",
    amount: "", // Límite de crédito
    creditType: "", 
  });
  const [searchTerm, setSearchTerm] = useState("");

  const creditTypes = ["Personal", "Hipotecario", "Automotriz", "Empresarial"];

  const handleCreateCredit = () => {
    if (!newCredit.accountId || !newCredit.amount || !newCredit.creditType) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor, complete todos los campos.",
      });
      return;
    }
    createCredit({
      ...newCredit,
      amount: parseFloat(newCredit.amount),
    });
    setNewCredit({ accountId: "", amount: "", creditType: "" });
    setIsCreditDialogOpen(false);
  };

  const openStatusDialog = (credit) => {
    setCurrentCredit(credit);
    setIsStatusDialogOpen(true);
  };

  const handleUpdateCreditStatus = (status) => {
    if (currentCredit) {
      updateCredit(currentCredit.id, { ...currentCredit, status });
      setIsStatusDialogOpen(false);
      setCurrentCredit(null);
    }
  };

  const filteredCredits = credits.filter(credit => {
    const account = accounts.find(acc => acc.id === credit.accountId);
    return (
      credit.creditType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (account && account.accountNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (account && account.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Créditos</h1>
          <p className="text-muted-foreground">
            Administre las solicitudes y aprobaciones de créditos.
          </p>
        </div>
        <Dialog open={isCreditDialogOpen} onOpenChange={setIsCreditDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Nueva Solicitud de Crédito</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Solicitar Crédito</DialogTitle>
              <DialogDescription>
                Complete los datos para una nueva solicitud de crédito.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="credit-accountId">Cuenta Bancaria</Label>
                <Select
                  onValueChange={(value) => setNewCredit({ ...newCredit, accountId: value })}
                  value={newCredit.accountId}
                >
                  <SelectTrigger id="credit-accountId">
                    <SelectValue placeholder="Seleccione una cuenta" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.fullName} ({account.accountNumber})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="credit-amount">Límite de Crédito Solicitado</Label>
                <Input
                  id="credit-amount"
                  type="number"
                  min="1"
                  value={newCredit.amount}
                  onChange={(e) => setNewCredit({ ...newCredit, amount: e.target.value })}
                  placeholder="Ej: 10000"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="credit-type">Tipo de Crédito</Label>
                <Select
                  onValueChange={(value) => setNewCredit({ ...newCredit, creditType: value })}
                  value={newCredit.creditType}
                >
                  <SelectTrigger id="credit-type">
                    <SelectValue placeholder="Seleccione tipo de crédito" />
                  </SelectTrigger>
                  <SelectContent>
                    {creditTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateCredit}>Enviar Solicitud</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por tipo de crédito, número de cuenta o cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filtrar</span>
              </Button>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente / Cuenta</TableHead>
                    <TableHead>Límite Solicitado</TableHead>
                    <TableHead className="hidden md:table-cell">Tipo de Crédito</TableHead>
                    <TableHead className="hidden sm:table-cell">Fecha Solicitud</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCredits.length > 0 ? (
                    filteredCredits.map((credit) => {
                      const account = accounts.find(acc => acc.id === credit.accountId);
                      return (
                        <TableRow key={credit.id}>
                          <TableCell>
                            <div className="font-medium">{account?.fullName || "N/A"}</div>
                            <div className="text-xs text-muted-foreground">{account?.accountNumber || "N/A"}</div>
                          </TableCell>
                          <TableCell>${parseFloat(credit.amount).toLocaleString('es-ES', { minimumFractionDigits: 2 })}</TableCell>
                          <TableCell className="hidden md:table-cell">{credit.creditType}</TableCell>
                          <TableCell className="hidden sm:table-cell">{new Date(credit.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full w-fit ${
                              credit.status === 'approved' ? 'bg-green-100 text-green-700' : 
                              credit.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {credit.status === 'approved' ? <CheckCircle className="h-3 w-3"/> : credit.status === 'pending' ? <Clock className="h-3 w-3"/> : <XCircle className="h-3 w-3"/>}
                              {credit.status === 'approved' ? 'Aprobado' : credit.status === 'pending' ? 'Pendiente' : 'Rechazado'}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => openStatusDialog(credit)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No se encontraron solicitudes de crédito.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {currentCredit && (
        <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Actualizar Estado del Crédito</DialogTitle>
              <DialogDescription>
                Seleccione el nuevo estado para el crédito de {accounts.find(acc => acc.id === currentCredit.accountId)?.fullName}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Button onClick={() => handleUpdateCreditStatus("approved")} className="bg-green-600 hover:bg-green-700">
                Aprobar
              </Button>
              <Button onClick={() => handleUpdateCreditStatus("rejected")} className="bg-red-600 hover:bg-red-700">
                Rechazar
              </Button>
              <Button variant="outline" onClick={() => handleUpdateCreditStatus("pending")}>
                Marcar como Pendiente
              </Button>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
                Cancelar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </motion.div>
  );
};

export default Credits;