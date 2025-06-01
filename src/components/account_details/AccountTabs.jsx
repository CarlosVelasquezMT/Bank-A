import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransactionsTab from "@/components/account_details/TransactionsTab";
import LoansTab from "@/components/account_details/LoansTab";
import CreditsTab from "@/components/account_details/CreditsTab";

const AccountTabs = ({ transactions, loans, credits }) => {
  return (
    <Tabs defaultValue="transactions" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="transactions">Movimientos</TabsTrigger>
        <TabsTrigger value="loans">Préstamos</TabsTrigger>
        <TabsTrigger value="credits">Créditos</TabsTrigger>
      </TabsList>
      
      <TabsContent value="transactions">
        <TransactionsTab transactions={transactions} />
      </TabsContent>

      <TabsContent value="loans">
        <LoansTab loans={loans} />
      </TabsContent>

      <TabsContent value="credits">
        <CreditsTab credits={credits} />
      </TabsContent>
    </Tabs>
  );
};

export default AccountTabs;