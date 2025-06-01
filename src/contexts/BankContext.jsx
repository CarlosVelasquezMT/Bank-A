import React, { createContext, useState, useContext, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { 
  createAccountLogic, 
  updateAccountLogic, 
  deleteAccountLogic, 
  getAccountLogic 
} from "@/lib/accountLogic";
import { 
  addTransactionLogic, 
  getAccountTransactionsLogic 
} from "@/lib/transactionLogic";
import { 
  createLoanLogic, 
  updateLoanLogic, 
  getAccountLoansLogic 
} from "@/lib/loanLogic";
import { 
  createCreditLogic, 
  updateCreditLogic, 
  getAccountCreditsLogic 
} from "@/lib/creditLogic";
import { loadFromLocalStorage, saveToLocalStorage } from "@/lib/localStorageUtils";

const BankContext = createContext();

export const useBank = () => useContext(BankContext);

export const BankProvider = ({ children }) => {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loans, setLoans] = useState([]);
  const [credits, setCredits] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    setAccounts(loadFromLocalStorage("bankAccounts", []));
    setTransactions(loadFromLocalStorage("bankTransactions", []));
    setLoans(loadFromLocalStorage("bankLoans", []));
    setCredits(loadFromLocalStorage("bankCredits", []));
  }, []);

  useEffect(() => {
    saveToLocalStorage("bankAccounts", accounts);
  }, [accounts]);

  useEffect(() => {
    saveToLocalStorage("bankTransactions", transactions);
  }, [transactions]);

  useEffect(() => {
    saveToLocalStorage("bankLoans", loans);
  }, [loans]);

  useEffect(() => {
    saveToLocalStorage("bankCredits", credits);
  }, [credits]);

  const createAccount = (accountData) => {
    // Add a default password for new client accounts, which is their account number
    const accountWithPassword = {
      ...accountData,
      password: accountData.password || generateAccountNumber(), // Use provided or generate new one
    };
    const { newAccount, updatedTransactions } = createAccountLogic(accountWithPassword, accounts, transactions, addTransaction);
    setAccounts(prev => [...prev, newAccount]);
    if (newAccount.balance > 0) {
       setTransactions(updatedTransactions);
    }
    toast({
      title: "Cuenta creada",
      description: `Cuenta ${newAccount.accountNumber} creada exitosamente. Contraseña inicial: ${newAccount.password}`
    });
    return newAccount;
  };

  const updateAccount = (id, updatedData) => {
    const { updatedAccount, updatedAccounts } = updateAccountLogic(id, updatedData, accounts);
    setAccounts(updatedAccounts);
    // Avoid showing toast if only balance is updated (happens with transactions)
    if(!Object.keys(updatedData).every(key => key === 'balance' && Object.keys(updatedData).length === 1)){
        toast({
          title: "Cuenta actualizada",
          description: "Los datos de la cuenta han sido actualizados"
        });
    }
    return updatedAccount;
  };

  const deleteAccount = (id) => {
    const { remainingAccounts, remainingTransactions } = deleteAccountLogic(id, accounts, transactions);
    setAccounts(remainingAccounts);
    setTransactions(remainingTransactions);
    toast({
      title: "Cuenta eliminada",
      description: "La cuenta ha sido eliminada permanentemente"
    });
  };

  const getAccount = (id) => getAccountLogic(id, accounts);

  const addTransaction = (transactionData) => {
    const { newTransaction, updatedAccounts } = addTransactionLogic(transactionData, transactions, accounts, updateAccount);
    setTransactions(prev => [...prev, newTransaction]);
    if (updatedAccounts) {
      setAccounts(updatedAccounts);
    }
    return newTransaction;
  };
  
  const getAccountTransactions = (accountId) => getAccountTransactionsLogic(accountId, transactions);

  const createLoan = (loanData) => {
    const newLoan = createLoanLogic(loanData, loans);
    setLoans(prev => [...prev, newLoan]);
    toast({
      title: "Préstamo solicitado",
      description: "La solicitud de préstamo ha sido registrada"
    });
    return newLoan;
  };

  const updateLoan = (id, updatedData) => {
    const { updatedLoan, updatedLoans, transactionToAdd } = updateLoanLogic(id, updatedData, loans);
    setLoans(updatedLoans);
    if (transactionToAdd) {
      addTransaction(transactionToAdd);
      toast({
        title: "Préstamo aprobado",
        description: `El préstamo por ${updatedLoan.amount} ha sido depositado en la cuenta`
      });
    } else if (updatedData.status === 'rejected') {
        toast({
            title: "Préstamo rechazado",
            description: `La solicitud de préstamo ha sido rechazada.`,
            variant: "destructive"
        });
    } else if (updatedData.status === 'pending' && updatedLoan.status !== 'pending') {
        toast({
            title: "Préstamo pendiente",
            description: `La solicitud de préstamo ahora está pendiente.`,
        });
    }
    return updatedLoan;
  };

  const getAccountLoans = (accountId) => getAccountLoansLogic(accountId, loans);

  const createCredit = (creditData) => {
    const newCredit = createCreditLogic(creditData, credits);
    setCredits(prev => [...prev, newCredit]);
    toast({
      title: "Crédito solicitado",
      description: "La solicitud de crédito ha sido registrada"
    });
    return newCredit;
  };

  const updateCredit = (id, updatedData) => {
    const { updatedCredit, updatedCreditsList, transactionToAdd } = updateCreditLogic(id, updatedData, credits);
    setCredits(updatedCreditsList);
    if (transactionToAdd) {
      addTransaction(transactionToAdd);
      toast({
        title: "Crédito aprobado",
        description: `El crédito por ${updatedCredit.amount} ha sido depositado en la cuenta`
      });
    } else if (updatedData.status === 'rejected') {
        toast({
            title: "Crédito rechazado",
            description: `La solicitud de crédito ha sido rechazada.`,
            variant: "destructive"
        });
    } else if (updatedData.status === 'pending' && updatedCredit.status !== 'pending') {
         toast({
            title: "Crédito pendiente",
            description: `La solicitud de crédito ahora está pendiente.`,
        });
    }
    return updatedCredit;
  };

  const getAccountCredits = (accountId) => getAccountCreditsLogic(accountId, credits);

  const value = {
    accounts,
    transactions,
    loans,
    credits,
    createAccount,
    updateAccount,
    deleteAccount,
    getAccount,
    addTransaction,
    getAccountTransactions,
    createLoan,
    updateLoan,
    getAccountLoans,
    createCredit,
    updateCredit,
    getAccountCredits
  };

  return <BankContext.Provider value={value}>{children}</BankContext.Provider>;
};

// Helper to generate account number for password if not provided
const generateAccountNumber = () => {
  return "TEMP" + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
};