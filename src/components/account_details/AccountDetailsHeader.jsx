import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

const AccountDetailsHeader = ({ onNavigateBack, onNewTransaction, onEditAccount, itemVariants }) => {
  return (
    <motion.div variants={itemVariants} className="flex items-center justify-between">
      <Button variant="outline" onClick={onNavigateBack} className="flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" />
        Volver a Cuentas
      </Button>
      <div className="flex gap-2">
        <Button onClick={onNewTransaction} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nueva Transacción
        </Button>
        <Button variant="outline" onClick={onEditAccount} className="flex items-center gap-2">
          <Edit className="h-4 w-4" />
          Editar Cuenta
        </Button>
      </div>
    </motion.div>
  );
};

export default AccountDetailsHeader;