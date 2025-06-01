import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Edit, Trash2, Eye, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const AccountsTable = ({ accounts, onEdit, onDelete, requestSort, sortConfig, containerVariants }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? '▲' : '▼';
    }
    return <ArrowUpDown className="h-3 w-3 opacity-50" />;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">
              <Button
                variant="ghost"
                onClick={() => requestSort("fullName")}
                className="flex items-center gap-1 p-0 h-auto font-medium"
              >
                Nombre {getSortIndicator("fullName")}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => requestSort("accountNumber")}
                className="flex items-center gap-1 p-0 h-auto font-medium"
              >
                Número de cuenta {getSortIndicator("accountNumber")}
              </Button>
            </TableHead>
            <TableHead className="hidden md:table-cell">
              <Button
                variant="ghost"
                onClick={() => requestSort("balance")}
                className="flex items-center gap-1 p-0 h-auto font-medium"
              >
                Saldo {getSortIndicator("balance")}
              </Button>
            </TableHead>
            <TableHead className="hidden md:table-cell">
              <Button
                variant="ghost"
                onClick={() => requestSort("createdAt")}
                className="flex items-center gap-1 p-0 h-auto font-medium"
              >
                Fecha de creación {getSortIndicator("createdAt")}
              </Button>
            </TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <motion.tbody
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {accounts.length > 0 ? (
            accounts.map((account) => (
              <motion.tr key={account.id} variants={itemVariants}>
                <TableCell className="font-medium">{account.fullName}</TableCell>
                <TableCell>{account.accountNumber}</TableCell>
                <TableCell className="hidden md:table-cell">
                  ${parseFloat(account.balance).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {new Date(account.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1 sm:gap-2">
                    <Link to={`/accounts/${account.id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-auto sm:w-auto">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(account)}
                      className="h-8 w-8 sm:h-auto sm:w-auto"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-auto sm:w-auto">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción eliminará permanentemente la cuenta {account.accountNumber} y todos sus datos asociados.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDelete(account.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </motion.tr>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No se encontraron cuentas.
              </TableCell>
            </TableRow>
          )}
        </motion.tbody>
      </Table>
    </div>
  );
};

export default AccountsTable;