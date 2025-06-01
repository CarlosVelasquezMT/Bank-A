import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Search, 
  UserPlus,
  Filter,
} from "lucide-react";
import { useBank } from "@/contexts/BankContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import AccountFormDialog from "@/components/accounts/AccountFormDialog";
import AccountsTable from "@/components/accounts/AccountsTable";

const Accounts = () => {
  const { accounts, createAccount, updateAccount, deleteAccount } = useBank();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "descending" });
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);

  const filteredAndSortedAccounts = useMemo(() => {
    let sortableAccounts = [...accounts];
    if (sortConfig !== null) {
      sortableAccounts.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableAccounts.filter(account => 
      account.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.accountNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [accounts, searchTerm, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleCreateAccount = (newAccountData) => {
    try {
      createAccount(newAccountData);
      setIsCreateDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear la cuenta. Inténtelo de nuevo.",
      });
    }
  };

  const handleEditAccount = (updatedAccountData) => {
    try {
      updateAccount(editingAccount.id, updatedAccountData);
      setIsEditDialogOpen(false);
      setEditingAccount(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar la cuenta. Inténtelo de nuevo.",
      });
    }
  };

  const handleDeleteAccount = (id) => {
    try {
      deleteAccount(id);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar la cuenta. Inténtelo de nuevo.",
      });
    }
  };

  const openEditDialog = (account) => {
    setEditingAccount({ ...account });
    setIsEditDialogOpen(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cuentas</h1>
          <p className="text-muted-foreground">
            Administre las cuentas bancarias de los clientes
          </p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => setIsCreateDialogOpen(true)}>
          <UserPlus className="h-4 w-4" />
          <span>Nueva cuenta</span>
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, número de cuenta o email..."
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

          <AccountsTable
            accounts={filteredAndSortedAccounts}
            onEdit={openEditDialog}
            onDelete={handleDeleteAccount}
            requestSort={requestSort}
            sortConfig={sortConfig}
            containerVariants={containerVariants}
          />
        </CardContent>
      </Card>

      <AccountFormDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateAccount}
        title="Crear nueva cuenta"
        description="Complete los datos para crear una nueva cuenta bancaria."
      />

      {editingAccount && (
        <AccountFormDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSubmit={handleEditAccount}
          initialData={editingAccount}
          title="Editar cuenta"
          description={`Modifique los datos de la cuenta ${editingAccount.accountNumber}.`}
        />
      )}
    </div>
  );
};

export default Accounts;