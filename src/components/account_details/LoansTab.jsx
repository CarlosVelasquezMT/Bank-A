import React from "react";
import { Link } from "react-router-dom";
import { Landmark } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const LoansTab = ({ loans }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Préstamos</CardTitle>
        <CardDescription>
          Préstamos solicitados y aprobados para esta cuenta.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loans && loans.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha Solicitud</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Plazo</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loans.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell>{new Date(loan.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>${parseFloat(loan.amount).toLocaleString('es-ES', { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell>{loan.term} meses</TableCell>
                  <TableCell>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      loan.status === 'approved' ? 'bg-green-100 text-green-700' : 
                      loan.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {loan.status === 'approved' ? 'Aprobado' : loan.status === 'pending' ? 'Pendiente' : 'Rechazado'}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            <Landmark className="h-12 w-12 mx-auto mb-2 opacity-50" />
            No hay préstamos asociados a esta cuenta.
            <Link to="/loans">
              <Button variant="link" className="mt-2">Solicitar préstamo</Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LoansTab;