import React from "react";
import { Link } from "react-router-dom";
import { CreditCard } from "lucide-react";
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

const CreditsTab = ({ credits }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Créditos</CardTitle>
        <CardDescription>
          Créditos solicitados y aprobados para esta cuenta.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {credits && credits.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha Solicitud</TableHead>
                <TableHead>Monto Límite</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {credits.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).map((credit) => (
                <TableRow key={credit.id}>
                  <TableCell>{new Date(credit.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>${parseFloat(credit.amount).toLocaleString('es-ES', { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell>{credit.creditType}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      credit.status === 'approved' ? 'bg-green-100 text-green-700' : 
                      credit.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {credit.status === 'approved' ? 'Aprobado' : credit.status === 'pending' ? 'Pendiente' : 'Rechazado'}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            <CreditCard className="h-12 w-12 mx-auto mb-2 opacity-50" />
            No hay créditos asociados a esta cuenta.
            <Link to="/credits">
              <Button variant="link" className="mt-2">Solicitar crédito</Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CreditsTab;