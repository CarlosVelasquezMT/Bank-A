import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Landmark, User, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useBank } from "@/contexts/BankContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch"; 

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { accounts } = useBank();
  const navigate = useNavigate();
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const effectiveIdentifier = isAdminLogin ? "admin" : identifier;
      const effectivePassword = isAdminLogin ? password : password;

      const { user: loggedInUser, success } = login(effectiveIdentifier, effectivePassword, accounts);
      
      if (success && loggedInUser) {
        if (loggedInUser.role === 'admin') {
          navigate("/admin/dashboard");
        } else if (loggedInUser.role === 'client') {
          navigate("/client/dashboard");
        } else {
          navigate("/login");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-700 via-blue-800 to-gray-900">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring", stiffness: 120 }}
        className="w-full max-w-md"
      >
        <div className="flex justify-center mb-8">
          <img  
            alt="Bank of America Logo" 
            className="h-12"
           src="https://images.unsplash.com/photo-1649734929640-d0c0f79da545" />
        </div>
        
        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-xl overflow-hidden">
          <CardHeader className="text-center p-6 bg-white/50">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <img  
                alt="Bank of America Icon" 
                className="h-20 w-auto mx-auto mb-4"
               src="https://images.unsplash.com/photo-1649734929640-d0c0f79da545" />
            </motion.div>
            <CardTitle className="text-3xl font-bold text-gray-800">Bienvenido</CardTitle>
            <CardDescription className="text-gray-600">
              {isAdminLogin ? "Acceso para Administradores" : "Acceso para Clientes"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="identifier" className="text-gray-700 font-medium">
                  {isAdminLogin ? "Usuario Administrador" : "Número de Cuenta"}
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="identifier"
                    placeholder={isAdminLogin ? "admin" : "Ingrese su número de cuenta"}
                    className="pl-10 pr-3 py-3 text-lg border-gray-300 focus:border-primary focus:ring-primary rounded-md shadow-sm"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder={isAdminLogin ? "admin123" : "Ingrese su contraseña"}
                    className="pl-10 pr-3 py-3 text-lg border-gray-300 focus:border-primary focus:ring-primary rounded-md shadow-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="admin-mode"
                    checked={isAdminLogin}
                    onCheckedChange={setIsAdminLogin}
                    aria-label="Modo Administrador"
                  />
                  <Label htmlFor="admin-mode" className="text-sm text-gray-600 cursor-pointer">
                    Soy Administrador
                  </Label>
                </div>
                {!isAdminLogin && (
                  <a href="#" className="text-sm text-primary hover:underline">
                    ¿Olvidó su contraseña?
                  </a>
                )}
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  className="w-full py-3 text-lg font-semibold bg-primary hover:bg-primary/90 text-white rounded-md shadow-lg transition-transform transform hover:scale-105" 
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <span className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                      Ingresando...
                    </span>
                  ) : (
                    "Iniciar Sesión"
                  )}
                </Button>
              </motion.div>
            </form>
          </CardContent>
          <div className="p-6 bg-gray-50 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              ¿No tiene una cuenta? <a href="#" className="font-medium text-primary hover:underline">Regístrese aquí</a>
            </p>
            <img  
              alt="Merrill Lynch Logo" 
              className="h-8 mt-4 mx-auto"
             src="https://images.unsplash.com/photo-1647116114294-4cae90b944df" />
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;