import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const RecentTransactionsCard = ({ transactions, accounts }) => {
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    const sortedTransactions = [...transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
    setRecentTransactions(sortedTransactions);
  }, [transactions]);

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <motion.div variants={itemVariants}>
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Transacciones recientes</CardTitle>
          <CardDescription>
            Últimas 5 transacciones realizadas en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => {
                const account = accounts.find(acc => acc.id === transaction.accountId);
                const isDeposit = transaction.type === "deposit";
                
                return (
                  <div key={transaction.id} className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${isDeposit ? 'bg-green-100' : 'bg-red-100'}`}>
                      {isDeposit ? (
                        <ArrowUpRight className={`h-4 w-4 ${isDeposit ? 'text-green-600' : 'text-red-600'}`} />
                      ) : (
                        <ArrowDownRight className={`h-4 w-4 ${isDeposit ? 'text-green-600' : 'text-red-600'}`} />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {transaction.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {account ? `Cuenta: ${account.accountNumber}` : 'Cuenta desconocida'} • {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={`text-sm font-medium ${isDeposit ? 'text-green-600' : 'text-red-600'}`}>
                      {isDeposit ? '+' : '-'}${parseFloat(transaction.amount).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Clock className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No hay transacciones recientes</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RecentTransactionsCard;