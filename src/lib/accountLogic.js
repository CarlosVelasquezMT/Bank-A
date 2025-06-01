import { generateId } from "@/lib/utils";

export const createAccountLogic = (accountData, accounts, transactions, addTransactionFn) => {
  const newAccount = {
    id: generateId(),
    accountNumber: accountData.accountNumber, // Use provided account number
    balance: parseFloat(accountData.initialBalance) || 0,
    createdAt: new Date().toISOString(),
    status: "active",
    password: accountData.password, // Use provided password
    ...accountData
  };

  let updatedTransactions = [...transactions];
  if (newAccount.balance > 0 && typeof addTransactionFn === 'function') {
    const initialDeposit = {
      accountId: newAccount.id,
      type: "deposit",
      amount: newAccount.balance,
      description: "Depósito inicial",
      date: new Date().toISOString()
    };
    const result = addTransactionFn(initialDeposit); 
    if (result && result.newTransaction) {
      updatedTransactions.push(result.newTransaction);
    }
  }
  
  return { newAccount, updatedTransactions };
};

export const updateAccountLogic = (id, updatedData, accounts) => {
  const updatedAccounts = accounts.map(account => 
    account.id === id ? { ...account, ...updatedData } : account
  );
  return { updatedAccount: updatedAccounts.find(acc => acc.id === id), updatedAccounts };
};

export const deleteAccountLogic = (id, accounts, transactions) => {
  const remainingAccounts = accounts.filter(account => account.id !== id);
  const remainingTransactions = transactions.filter(transaction => transaction.accountId !== id);
  return { remainingAccounts, remainingTransactions };
};

export const getAccountLogic = (id, accounts) => {
  return accounts.find(account => account.id === id || account.accountNumber === id);
};