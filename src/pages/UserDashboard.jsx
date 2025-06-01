import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useBank } from "@/contexts/BankContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { 
  DollarSign, 
  CreditCard as CreditCardIcon, 
  Send, 
  KeyRound, 
  Smartphone, 
  FileText, 
  ShieldCheck, 
  QrCode,
  SmartphoneNfc,
  Newspaper
} from "lucide-react";

// Mock data for news - replace with actual data source if available
const newsItems = [
  { id: 1, title: "Nueva Banca Móvil Actualizada", description: "Descubre las nuevas funcionalidades de nuestra app.", image: "news_mobile_banking.jpg", date: "2025-05-20" },
  { id: 2, title: "Consejos de Seguridad para tus Cuentas", description: "Mantén tu información segura con estos tips.", image: "news_security.jpg", date: "2025-05-18" },
  { id: 3, title: "Promoción Especial: Tasas de Interés Bajas", description: "Aprovecha nuestras tasas promocionales en préstamos.", image: "news_promo.jpg", date: "2025-05-15" },
];

const UserDashboard = () => {
  const { user } = useAuth();
  const { getAccount, getAccountCredits, accounts } = useBank(); // getAccountCredits needs to be implemented in BankContext
  const [accountDetails, setAccountDetails] = useState(null);
  const [userCredits, setUserCredits] = useState([]);

  useEffect(() => {
    if (user && user.role === "client" && user.id) {
      const currentAccount = getAccount(user.id);
      setAccountDetails(currentAccount);
      if (currentAccount) {
        const credits = getAccountCredits(currentAccount.id);
        setUserCredits(credits.filter(c => c.status === 'approved'));
      }
    }
  }, [user, getAccount, getAccountCredits, accounts]); // Added accounts to dependencies

  const featuredServices = [
    { name: "Transferir", icon: <Send className="h-8 w-8 text-primary" />, action: () => console.log("Transferir") },
    { name: "Llaves Digitales", icon: <KeyRound className="h-8 w-8 text-primary" />, action: () => console.log("Llaves") },
    { name: "Recargas", icon: <Smartphone className="h-8 w-8 text-primary" />, action: () => console.log("Recargas") },
    { name: "Paz y Salvo", icon: <ShieldCheck className="h-8 w-8 text-primary" />, action: () => console.log("Paz y Salvo") },
    { name: "Certificados", icon: <FileText className="h-8 w-8 text-primary" />, action: () => console.log("Certificados") },
    { name: "Retirar sin Tarjeta", icon: <SmartphoneNfc className="h-8 w-8 text-primary" />, action: () => console.log("Retirar sin Tarjeta") },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
  };

  if (!accountDetails) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  const totalCreditAmount = userCredits.reduce((sum, credit) => sum + credit.amount, 0);

  return (
    <motion.div 
      className="space-y-8 p-1"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Saludo y Balance */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-r from-primary to-blue-600 text-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl">¡Hola, {user?.name}!</CardTitle>
            <CardDescription className="text-blue-200">Bienvenido a tu banca en línea.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-sm text-blue-200">Saldo Disponible</p>
              <p className="text-4xl font-bold">
                ${parseFloat(accountDetails.balance).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <Button variant="secondary" className="bg-white text-primary hover:bg-gray-100">Ver Movimientos</Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Novedades */}
      <motion.section variants={itemVariants} aria-labelledby="novedades-title">
        <h2 id="novedades-title" className="text-2xl font-semibold mb-4 text-gray-800">Novedades</h2>
        <ScrollArea className="w-full whitespace-nowrap rounded-md">
          <div className="flex gap-4 pb-4">
            {newsItems.map(item => (
              <Card key={item.id} className="w-[300px] min-w-[280px] shrink-0 overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
                <img  src={`/placeholder-images/${item.image}`} alt={item.title} className="w-full h-40 object-cover" src="https://images.unsplash.com/photo-1675023112817-52b789fd2ef0" />
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-1 truncate">{item.title}</h3>
                  <p className="text-sm text-muted-foreground truncate">{item.description}</p>
                  <Button variant="link" className="p-0 h-auto mt-2 text-primary">Leer más</Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </motion.section>

      {/* Mis Productos y Servicios Destacados */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Mis Productos */}
        <motion.section variants={itemVariants} aria-labelledby="productos-title">
          <h2 id="productos-title" className="text-2xl font-semibold mb-4 text-gray-800">Mis Productos</h2>
          <div className="space-y-4">
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">Saldo Disponible</CardTitle>
                <DollarSign className="h-6 w-6 text-green-500" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  ${parseFloat(accountDetails.balance).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-muted-foreground">Cuenta: {accountDetails.accountNumber}</p>
              </CardContent>
            </Card>
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">Mis Créditos Aprobados</CardTitle>
                <CreditCardIcon className="h-6 w-6 text-blue-500" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  ${parseFloat(totalCreditAmount).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-muted-foreground">Total de {userCredits.length} crédito(s) activo(s)</p>
                <Button variant="link" className="p-0 h-auto mt-1 text-primary">Ver detalles</Button>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* Servicios Destacados */}
        <motion.section variants={itemVariants} aria-labelledby="servicios-title">
          <h2 id="servicios-title" className="text-2xl font-semibold mb-4 text-gray-800">Servicios Destacados</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {featuredServices.map(service => (
              <Card 
                key={service.name} 
                className="flex flex-col items-center justify-center p-4 aspect-square text-center cursor-pointer hover:shadow-xl hover:border-primary transition-all duration-300 group"
                onClick={service.action}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => e.key === 'Enter' && service.action()}
              >
                <div className="p-3 bg-primary/10 rounded-full mb-2 group-hover:bg-primary/20 transition-colors">
                  {service.icon}
                </div>
                <p className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">{service.name}</p>
              </Card>
            ))}
          </div>
        </motion.section>
      </div>

      {/* Acciones Rápidas */}
      <motion.section variants={itemVariants} aria-labelledby="acciones-rapidas-title" className="pt-4">
        <h2 id="acciones-rapidas-title" className="text-2xl font-semibold mb-4 text-gray-800">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Button size="lg" className="py-8 text-lg bg-green-500 hover:bg-green-600 shadow-md">
            <DollarSign className="mr-2 h-6 w-6" /> Pagar Servicios
          </Button>
          <Button variant="outline" size="lg" className="py-8 text-lg border-primary text-primary hover:bg-primary/5 shadow-md">
            <QrCode className="mr-2 h-6 w-6" /> Pagar con QR
          </Button>
          <Button size="lg" className="py-8 text-lg bg-blue-500 hover:bg-blue-600 shadow-md">
            <Send className="mr-2 h-6 w-6" /> Realizar Transferencia
          </Button>
        </div>
      </motion.section>

    </motion.div>
  );
};

export default UserDashboard;