import React from "react";
import { User, Mail, Phone, MapPin, Calendar, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ClientInfoCard = ({ account }) => {
  const infoItems = [
    { icon: <User className="h-5 w-5 text-primary" />, label: "Nombre:", value: account.fullName },
    { icon: <Mail className="h-5 w-5 text-primary" />, label: "Email:", value: account.email },
    { icon: <Phone className="h-5 w-5 text-primary" />, label: "Teléfono:", value: account.phone },
    { icon: <MapPin className="h-5 w-5 text-primary" />, label: "Dirección:", value: account.address },
    { icon: <Calendar className="h-5 w-5 text-primary" />, label: "Fecha de creación:", value: new Date(account.createdAt).toLocaleDateString() },
    { 
      icon: <DollarSign className="h-5 w-5 text-primary" />, 
      label: "Estado:", 
      value: account.status === 'active' ? 'Activa' : 'Inactiva',
      className: `px-2 py-0.5 rounded-full text-xs font-medium ${
        account.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      }`
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información del Cliente</CardTitle>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-x-6 gap-y-4">
        {infoItems.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            {item.icon}
            <span className="text-muted-foreground min-w-[120px]">{item.label}</span>
            <span className={item.className || ""}>{item.value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ClientInfoCard;