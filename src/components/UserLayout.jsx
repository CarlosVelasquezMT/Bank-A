import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  CreditCard, 
  Landmark, 
  LogOut, 
  Menu, 
  X,
  ChevronDown,
  UserCircle,
  Settings,
  HelpCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const UserLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Define navigation items for client dashboard
  const navItems = [
    { path: "/client/dashboard", label: "Inicio", icon: <LayoutDashboard className="h-5 w-5" /> },
    { path: "/client/products", label: "Mis Productos", icon: <CreditCard className="h-5 w-5" /> }, // Example
    { path: "/client/transfer", label: "Transferencias", icon: <Landmark className="h-5 w-5" /> }, // Example
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full bg-white border-b shadow-sm">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
              {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
            <Link to="/client/dashboard" className="flex items-center gap-2">
              <div className="bg-primary text-white p-1 rounded">
                <Landmark className="h-6 w-6" />
              </div>
              <span className="font-bold text-xl hidden sm:inline-block">Bank of America</span>
            </Link>
          </div>
          
          <div className="relative">
            <Button 
              variant="ghost" 
              className="flex items-center gap-2"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-white">
                  {user?.name?.charAt(0)?.toUpperCase() || 'C'}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline-block">{user?.name || 'Cliente'}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
            
            {isProfileOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50"
              >
                <div className="px-4 py-3 border-b">
                  <p className="text-sm font-semibold text-gray-800">{user?.name || 'Cliente'}</p>
                  <p className="text-xs text-gray-500">{user?.email || user?.accountNumber}</p>
                </div>
                <Link
                  to="/client/profile"
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <UserCircle className="mr-2 h-4 w-4" />
                  Mi Perfil
                </Link>
                <Link
                  to="/client/settings"
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Configuración
                </Link>
                <Link
                  to="/client/help"
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Ayuda y Soporte
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar sesión
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar for Client - can be simplified or different from admin */}
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: isSidebarOpen ? 0 : (window.innerWidth < 768 ? -300 : 0) }}
          transition={{ duration: 0.3 }}
          className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r shadow-sm pt-16 md:static md:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          } client-sidebar`} 
        >
          <nav className="space-y-1 p-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all text-sm font-medium ${
                  location.pathname.startsWith(item.path)
                    ? "bg-primary/90 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
                onClick={() => { if (window.innerWidth < 768) setIsSidebarOpen(false);}}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </motion.aside>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 pt-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default UserLayout;