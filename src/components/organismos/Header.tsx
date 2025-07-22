import { User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/');
  };

  return (
    <header className="bg-gradient-to-r from-blue-950 to-indigo-900 shadow-md border-b border-blue-900 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo y nombre de la aplicación */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow">
            <span className="text-blue-800 font-bold text-lg">F</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">FATUS</h1>
            <p className="text-sm text-blue-200">Gestión de Facturas Electrónica</p>
          </div>
        </div>
        {/* Información del usuario y botón de logout */}
        <div className="flex items-center space-x-3 bg-blue-900/60 px-4 py-2 rounded-lg">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <User size={16} className="text-blue-800" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-white">Usuario</p>
            <p className="text-xs text-blue-200">Victor Manuel Ruiz</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center ml-4 px-3 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow"
            title="Cerrar sesión"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
