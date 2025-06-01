import { generateId } from "@/lib/utils";

export const addTransactionLogic = (transactionData, transactions, accounts, updateAccountFn) => {
  const newTransaction = {
    id: generateId(),
    date: new Date().toISOString(),
    ...transactionData
  };

  let updatedAccounts = null;
  if (transactionData.accountId) {
    const account = accounts.find(acc => acc.id === transactionData.accountId);
    if (account) {
      let newBalance = account.balance;
      if (transactionData.type === "deposit") {
        newBalance += parseFloat(transactionData.amount);
      } else if (transactionData.type === "withdrawal") {
        newBalance -= parseFloat(transactionData.amount);
      }
      const { updatedAccounts: modifiedAccounts } = updateAccountFn(account.id, { balance: newBalance });
      updatedAccounts = modifiedAccounts;
    }
  }
  return { newTransaction, updatedAccounts };
};

export const getAccountTransactionsLogic = (accountId, transactions) => {
  if (!transactions || !Array.isArray(transactions)) {
    return [];
  }
  return transactions.filter(transaction => transaction && transaction.accountId === accountId);
};