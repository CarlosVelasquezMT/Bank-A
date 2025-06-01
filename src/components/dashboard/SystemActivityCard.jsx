import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SystemActivityCard = ({ accounts, loans, credits }) => {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const accountsCreatedLastMonth = accounts.filter(acc => {
    const createdDate = new Date(acc.createdAt);
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return createdDate > oneMonthAgo;
  }).length;

  const pendingLoans = loans.filter(loan => loan.status === "pending").length;
  const pendingCredits = credits.filter(credit => credit.status === "pending").length;

  const activityData = [
    { label: "Cuentas creadas (último mes)", value: accountsCreatedLastMonth, total: Math.max(1, accounts.length), colorClass: "bg-primary" },
    { label: "Préstamos pendientes", value: pendingLoans, total: Math.max(1, loans.length), colorClass: "bg-yellow-500" },
    { label: "Créditos pendientes", value: pendingCredits, total: Math.max(1, credits.length), colorClass: "bg-blue-500" },
  ];

  return (
    <motion.div variants={itemVariants}>
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Actividad del sistema</CardTitle>
          <CardDescription>
            Resumen de la actividad reciente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activityData.map((activity, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{activity.label}</p>
                  <p className="text-sm font-medium">{activity.value}</p>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${activity.colorClass}`}
                    style={{ width: `${Math.min(100, (activity.value / activity.total) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
            <div className="pt-4">
              <Link to="/admin/accounts">
                <Button variant="outline" className="w-full">
                  Ver todas las cuentas
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SystemActivityCard;