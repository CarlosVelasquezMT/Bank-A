import React, { createContext, useState, useContext, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useBank } from "@/contexts/BankContext"; // Import useBank

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  // We need BankContext to be loaded before AuthContext, so we'll get it conditionally
  // This means BankProvider must wrap AuthProvider or AuthProvider's logic needs access to BankContext's state
  // For simplicity, we'll assume BankContext data is available.
  // This might require restructuring if BankContext depends on AuthContext or vice-versa in a circular way.
  // A common pattern is to have a top-level AppProvider that initializes both.
  // For now, we will proceed with the assumption that `accounts` can be accessed.

  useEffect(() => {
    const storedUser = localStorage.getItem("bankUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // This login function will be available after BankContext is initialized
  const login = (identifier, password, accounts) => { // Pass accounts from BankContext
    if (!accounts) {
      // This can happen if BankContext is not yet loaded.
      // Handle appropriately, perhaps by deferring login or showing an error.
      toast({
        variant: "destructive",
        title: "Error del sistema",
        description: "Los datos de las cuentas no están disponibles. Intente de nuevo.",
      });
      return false;
    }

    // Admin login
    if (identifier === "admin" && password === "admin123") {
      const adminUser = {
        id: "admin-001",
        username: "admin",
        name: "Administrador Principal",
        role: "admin",
      };
      setUser(adminUser);
      localStorage.setItem("bankUser", JSON.stringify(adminUser));
      toast({
        title: "Inicio de sesión de Admin exitoso",
        description: "Bienvenido al panel de administración.",
      });
      return { user: adminUser, success: true };
    }

    // Client login (using account number as identifier and password)
    const clientAccount = accounts.find(
      (acc) => acc.accountNumber === identifier && (acc.password || acc.accountNumber) === password
    );

    if (clientAccount) {
      const clientUser = {
        id: clientAccount.id,
        accountNumber: clientAccount.accountNumber,
        name: clientAccount.fullName,
        role: "client",
        email: clientAccount.email, // Add other relevant client info
      };
      setUser(clientUser);
      localStorage.setItem("bankUser", JSON.stringify(clientUser));
      toast({
        title: "Inicio de sesión de Cliente exitoso",
        description: `Bienvenido, ${clientUser.name}.`,
      });
      return { user: clientUser, success: true };
    }
    
    toast({
      variant: "destructive",
      title: "Error de inicio de sesión",
      description: "Credenciales incorrectas. Verifique su número de cuenta/usuario y contraseña.",
    });
    return { user: null, success: false };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("bankUser");
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente.",
    });
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};