import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useBank } from "@/contexts/BankContext";
import { useToast } from "@/components/ui/use-toast";
import AccountDetailsHeader from "@/components/account_details/AccountDetailsHeader";
import AccountInfoCard from "@/components/account_details/AccountInfoCard";
import ClientInfoCard from "@/components/account_details/ClientInfoCard";
import AccountTabs from "@/components/account_details/AccountTabs";
import TransactionDialog from "@/components/account_details/TransactionDialog";
import EditAccountDialog from "@/components/account_details/EditAccountDialog";

const AccountDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    getAccount, 
    getAccountTransactions, 
    addTransaction, 
    getAccountLoans, 
    getAccountCredits,
    updateAccount
  } = useBank();
  const { toast } = useToast();

  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loans, setLoans] = useState([]);
  const [credits, setCredits] = useState([]);
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAccountData, setEditingAccountData] = useState(null);

  const fetchAccountData = useCallback(() => {
    const currentAccount = getAccount(id);
    if (currentAccount) {
      setAccount(currentAccount);
      setTransactions(getAccountTransactions(id));
      setLoans(getAccountLoans(id));
      setCredits(getAccountCredits(id));
      setEditingAccountData({...currentAccount});
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Cuenta no encontrada.",
      });
      navigate("/accounts");
    }
  }, [id, getAccount, getAccountTransactions, getAccountLoans, getAccountCredits, toast, navigate]);

  useEffect(() => {
    fetchAccountData();
  }, [fetchAccountData]);

  const handleAddTransactionSubmit = (newTransactionData) => {
    try {
      addTransaction({
        accountId: id,
        ...newTransactionData,
        amount: parseFloat(newTransactionData.amount),
      });
      setIsTransactionDialogOpen(false);
      fetchAccountData(); 
      toast({
        title: "Transacción agregada",
        description: "La transacción se ha registrado exitosamente.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo agregar la transacción.",
      });
    }
  };
  
  const handleEditAccountSubmit = (updatedAccountData) => {
    if (!editingAccountData) return;
    try {
      updateAccount(editingAccountData.id, updatedAccountData);
      setIsEditDialogOpen(false);
      fetchAccountData();
      toast({
        title: "Cuenta actualizada",
        description: "Los datos de la cuenta han sido actualizados."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar la cuenta."
      });
    }
  };

  if (!account) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      <AccountDetailsHeader
        onNavigateBack={() => navigate("/accounts")}
        onNewTransaction={() => setIsTransactionDialogOpen(true)}
        onEditAccount={() => setIsEditDialogOpen(true)}
        itemVariants={itemVariants}
      />

      <motion.div variants={itemVariants}>
        <AccountInfoCard account={account} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <ClientInfoCard account={account} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <AccountTabs
          transactions={transactions}
          loans={loans}
          credits={credits}
        />
      </motion.div>

      <TransactionDialog
        isOpen={isTransactionDialogOpen}
        onClose={() => setIsTransactionDialogOpen(false)}
        onSubmit={handleAddTransactionSubmit}
        accountNumber={account.accountNumber}
      />

      {editingAccountData && (
        <EditAccountDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSubmit={handleEditAccountSubmit}
          account={editingAccountData}
        />
      )}
    </motion.div>
  );
};

export default AccountDetails;