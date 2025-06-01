import { generateId } from "@/lib/utils";

export const createLoanLogic = (loanData, loans) => {
  const newLoan = {
    id: generateId(),
    status: "pending",
    createdAt: new Date().toISOString(),
    ...loanData
  };
  return newLoan;
};

export const updateLoanLogic = (id, updatedData, loans) => {
  const updatedLoans = loans.map(loan => 
    loan.id === id ? { ...loan, ...updatedData } : loan
  );
  const updatedLoan = updatedLoans.find(loan => loan.id === id);
  let transactionToAdd = null;

  if (updatedData.status === "approved" && updatedLoan && updatedLoan.accountId) {
    transactionToAdd = {
      accountId: updatedLoan.accountId,
      type: "deposit",
      amount: updatedLoan.amount,
      description: `Préstamo aprobado #${id.substring(0, 8)}`,
      date: new Date().toISOString()
    };
  }
  return { updatedLoan, updatedLoans, transactionToAdd };
};

export const getAccountLoansLogic = (accountId, loans) => {
  return loans.filter(loan => loan.accountId === accountId);
};