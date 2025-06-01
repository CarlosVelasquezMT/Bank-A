import { generateId } from "@/lib/utils";

export const createCreditLogic = (creditData, credits) => {
  const newCredit = {
    id: generateId(),
    status: "pending",
    createdAt: new Date().toISOString(),
    ...creditData
  };
  return newCredit;
};

export const updateCreditLogic = (id, updatedData, credits) => {
  const updatedCreditsList = credits.map(credit => 
    credit.id === id ? { ...credit, ...updatedData } : credit
  );
  const updatedCredit = updatedCreditsList.find(credit => credit.id === id);
  let transactionToAdd = null;

  if (updatedData.status === "approved" && updatedCredit && updatedCredit.accountId) {
    transactionToAdd = {
      accountId: updatedCredit.accountId,
      type: "deposit",
      amount: updatedCredit.amount,
      description: `Crédito aprobado #${id.substring(0, 8)}`,
      date: new Date().toISOString()
    };
  }
  return { updatedCredit, updatedCreditsList, transactionToAdd };
};

export const getAccountCreditsLogic = (accountId, credits) => {
  return credits.filter(credit => credit.accountId === accountId);
};