
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';

interface HeaderProps {
  showProfileIcon?: boolean;
  showLogoutIcon?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  showProfileIcon = true, 
  showLogoutIcon = true 
}) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.includes('admin');
  
  return (
    <header className="w-full py-4 px-6 border-b border-border bg-white mb-4">
      <div className="flex justify-between items-center">
        <Link to={isAdminRoute ? "/admin/dashboard" : "/dashboard"} className="logo-text">
          <span>Sistema </span>
          <span>de Fidelidade</span>
        </Link>
        
        <div className="flex items-center space-x-3">
          {showProfileIcon && (
            <Link to={isAdminRoute ? "/admin/perfil" : "/perfil"} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <User className="h-5 w-5 text-gray-700" />
            </Link>
          )}
          
          {showLogoutIcon && (
            <Link to="/" className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <LogOut className="h-5 w-5 text-gray-700" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
