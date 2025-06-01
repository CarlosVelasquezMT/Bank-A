import React from "react";
import { Landmark } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AccountInfoCard = ({ account }) => {
  return (
    <Card className="overflow-hidden shadow-lg credit-card text-white">
      <CardHeader className="p-6">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">{account.fullName}</CardTitle>
          <Landmark className="h-8 w-8 opacity-70" />
        </div>
        <CardDescription className="text-blue-200">{account.accountNumber}</CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="text-4xl font-semibold">
          ${parseFloat(account.balance).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
        </div>
        <p className="text-sm text-blue-200 mt-1">Saldo disponible</p>
      </CardContent>
    </Card>
  );
};

export default AccountInfoCard;