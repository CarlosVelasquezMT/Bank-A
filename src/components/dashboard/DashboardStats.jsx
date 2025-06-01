import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, DollarSign, Landmark, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DashboardStats = ({ accounts, loans, credits }) => {
  const [stats, setStats] = useState({
    totalAccounts: 0,
    totalBalance: 0,
    activeLoans: 0,
    activeCredits: 0,
  });

  useEffect(() => {
    const totalAccounts = accounts.length;
    const totalBalance = accounts.reduce((sum, account) => sum + (account.balance || 0), 0);
    const activeLoans = loans.filter(loan => loan.status === "approved").length;
    const activeCredits = credits.filter(credit => credit.status === "approved").length;
    
    setStats({
      totalAccounts,
      totalBalance,
      activeLoans,
      activeCredits,
    });
  }, [accounts, loans, credits]);

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const statItems = [
    { title: "Total de cuentas", value: stats.totalAccounts, icon: <Users className="h-4 w-4 text-muted-foreground" />, description: "Cuentas activas en el sistema" },
    { title: "Balance total", value: `$${stats.totalBalance.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`, icon: <DollarSign className="h-4 w-4 text-muted-foreground" />, description: "Suma de todas las cuentas" },
    { title: "Préstamos activos", value: stats.activeLoans, icon: <Landmark className="h-4 w-4 text-muted-foreground" />, description: "Préstamos aprobados" },
    { title: "Créditos activos", value: stats.activeCredits, icon: <CreditCard className="h-4 w-4 text-muted-foreground" />, description: "Créditos aprobados" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item, index) => (
        <motion.div key={index} variants={itemVariants}>
          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.title}
              </CardTitle>
              {item.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <p className="text-xs text-muted-foreground">
                {item.description}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStats;