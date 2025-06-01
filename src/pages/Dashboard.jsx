import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";
import { useBank } from "@/contexts/BankContext";
import { Button } from "@/components/ui/button";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentTransactionsCard from "@/components/dashboard/RecentTransactionsCard";
import SystemActivityCard from "@/components/dashboard/SystemActivityCard";

const AdminDashboard = () => {
  const { accounts, transactions, loans, credits } = useBank();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Administrador</h1>
          <p className="text-muted-foreground">
            Resumen general del sistema Bank of America.
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/accounts">
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              <span>Nueva cuenta cliente</span>
            </Button>
          </Link>
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <DashboardStats 
          accounts={accounts}
          loans={loans}
          credits={credits}
        />
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-4 md:grid-cols-2"
      >
        <RecentTransactionsCard transactions={transactions} accounts={accounts} />
        <SystemActivityCard accounts={accounts} loans={loans} credits={credits} />
      </motion.div>
    </div>
  );
};

export default AdminDashboard;