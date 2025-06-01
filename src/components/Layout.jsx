import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Landmark, 
  LogOut, 
  Menu, 
  X,
  ChevronDown
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { path: "/admin/accounts", label: "Cuentas", icon: <Users className="h-5 w-5" /> },
    { path: "/admin/loans", label: "Préstamos", icon: <Landmark className="h-5 w-5" /> },
    { path: "/admin/credits", label: "Créditos", icon: <CreditCard className="h-5 w-5" /> },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 w-full bg-white border-b shadow-sm">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
              {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
            <Link to="/admin/dashboard" className="flex items-center gap-2">
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
                  {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline-block">{user?.name || 'Administrador'}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
            
            {isProfileOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
              >
                <div className="px-4 py-2 border-b">
                  <p className="text-sm font-medium">{user?.name || 'Administrador'}</p>
                  <p className="text-xs text-gray-500">{user?.role || 'admin'}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: isSidebarOpen ? 0 : (window.innerWidth < 768 ? -300 : 0) }}
          transition={{ duration: 0.3 }}
          className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r shadow-sm pt-16 md:static md:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <nav className="space-y-1 p-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  location.pathname.startsWith(item.path)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                onClick={() => { if (window.innerWidth < 768) setIsSidebarOpen(false);}}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </motion.aside>

        <main className="flex-1 p-4 md:p-6 pt-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;