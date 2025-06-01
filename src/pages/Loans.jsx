import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Landmark, Plus, Search, Filter, Edit, Trash2, CheckCircle, XCircle, Clock } from "lucide-react";
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

const Loans = () => {
  const { loans, accounts, createLoan, updateLoan } = useBank();
  const { toast } = useToast();
  const [isLoanDialogOpen, setIsLoanDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [currentLoan, setCurrentLoan] = useState(null);
  const [newLoan, setNewLoan] = useState({
    accountId: "",
    amount: "",
    term: "", 
    purpose: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const handleCreateLoan = () => {
    if (!newLoan.accountId || !newLoan.amount || !newLoan.term || !newLoan.purpose) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor, complete todos los campos.",
      });
      return;
    }
    createLoan({
      ...newLoan,
      amount: parseFloat(newLoan.amount),
      term: parseInt(newLoan.term, 10),
    });
    setNewLoan({ accountId: "", amount: "", term: "", purpose: "" });
    setIsLoanDialogOpen(false);
  };

  const openStatusDialog = (loan) => {
    setCurrentLoan(loan);
    setIsStatusDialogOpen(true);
  };

  const handleUpdateLoanStatus = (status) => {
    if (currentLoan) {
      updateLoan(currentLoan.id, { ...currentLoan, status });
      setIsStatusDialogOpen(false);
      setCurrentLoan(null);
    }
  };
  
  const filteredLoans = loans.filter(loan => {
    const account = accounts.find(acc => acc.id === loan.accountId);
    return (
      loan.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
          <h1 className="text-3xl font-bold tracking-tight">Préstamos</h1>
          <p className="text-muted-foreground">
            Administre las solicitudes y aprobaciones de préstamos.
          </p>
        </div>
        <Dialog open={isLoanDialogOpen} onOpenChange={setIsLoanDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Nueva Solicitud de Préstamo</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Solicitar Préstamo</DialogTitle>
              <DialogDescription>
                Complete los datos para una nueva solicitud de préstamo.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="accountId">Cuenta Bancaria</Label>
                <Select
                  onValueChange={(value) => setNewLoan({ ...newLoan, accountId: value })}
                  value={newLoan.accountId}
                >
                  <SelectTrigger id="accountId">
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
                <Label htmlFor="amount">Monto Solicitado</Label>
                <Input
                  id="amount"
                  type="number"
                  min="1"
                  value={newLoan.amount}
                  onChange={(e) => setNewLoan({ ...newLoan, amount: e.target.value })}
                  placeholder="Ej: 5000"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="term">Plazo (meses)</Label>
                <Input
                  id="term"
                  type="number"
                  min="1"
                  value={newLoan.term}
                  onChange={(e) => setNewLoan({ ...newLoan, term: e.target.value })}
                  placeholder="Ej: 12"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="purpose">Propósito del Préstamo</Label>
                <Input
                  id="purpose"
                  value={newLoan.purpose}
                  onChange={(e) => setNewLoan({ ...newLoan, purpose: e.target.value })}
                  placeholder="Ej: Compra de vehículo"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsLoanDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateLoan}>Enviar Solicitud</Button>
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
                  placeholder="Buscar por propósito, número de cuenta o cliente..."
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
                    <TableHead>Monto</TableHead>
                    <TableHead className="hidden md:table-cell">Plazo</TableHead>
                    <TableHead className="hidden md:table-cell">Propósito</TableHead>
                    <TableHead className="hidden sm:table-cell">Fecha Solicitud</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLoans.length > 0 ? (
                    filteredLoans.map((loan) => {
                      const account = accounts.find(acc => acc.id === loan.accountId);
                      return (
                        <TableRow key={loan.id}>
                          <TableCell>
                            <div className="font-medium">{account?.fullName || "N/A"}</div>
                            <div className="text-xs text-muted-foreground">{account?.accountNumber || "N/A"}</div>
                          </TableCell>
                          <TableCell>${parseFloat(loan.amount).toLocaleString('es-ES', { minimumFractionDigits: 2 })}</TableCell>
                          <TableCell className="hidden md:table-cell">{loan.term} meses</TableCell>
                          <TableCell className="hidden md:table-cell">{loan.purpose}</TableCell>
                          <TableCell className="hidden sm:table-cell">{new Date(loan.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full w-fit ${
                              loan.status === 'approved' ? 'bg-green-100 text-green-700' : 
                              loan.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {loan.status === 'approved' ? <CheckCircle className="h-3 w-3"/> : loan.status === 'pending' ? <Clock className="h-3 w-3"/> : <XCircle className="h-3 w-3"/>}
                              {loan.status === 'approved' ? 'Aprobado' : loan.status === 'pending' ? 'Pendiente' : 'Rechazado'}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => openStatusDialog(loan)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No se encontraron solicitudes de préstamo.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {currentLoan && (
        <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Actualizar Estado del Préstamo</DialogTitle>
              <DialogDescription>
                Seleccione el nuevo estado para el préstamo de {accounts.find(acc => acc.id === currentLoan.accountId)?.fullName}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Button onClick={() => handleUpdateLoanStatus("approved")} className="bg-green-600 hover:bg-green-700">
                Aprobar
              </Button>
              <Button onClick={() => handleUpdateLoanStatus("rejected")} className="bg-red-600 hover:bg-red-700">
                Rechazar
              </Button>
              <Button variant="outline" onClick={() => handleUpdateLoanStatus("pending")}>
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

export default Loans;