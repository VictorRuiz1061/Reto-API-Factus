import React from 'react';
import { FileText,  ChevronLeft, ChevronRight } from 'lucide-react';
// import Button from '@heroui/button';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  isActive?: boolean;
}

interface SidebarProps {
  activeItem?: string;
  onItemClick?: (itemId: string) => void;
  onLogout?: () => void;
  isCollapsed?: boolean;
  setIsCollapsed?: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeItem = 'facturas',
  onItemClick,
  isCollapsed = false,
  setIsCollapsed
}) => {
  // Elimina el estado interno de colapso
  // const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems: SidebarItem[] = [
    {
      id: 'facturas',
      label: 'Facturas',
      icon: <FileText size={20} />,
      onClick: () => onItemClick?.('facturas'),
      isActive: activeItem === 'facturas'
    }
  ];

  return (
    <div className={`relative transition-all duration-300 h-full ${isCollapsed ? 'w-20' : 'w-64'} bg-gradient-to-b from-blue-950 shadow-lg`}> 
      {/* Botón para colapsar/expandir */}
      <div className="flex justify-end p-4 border-b border-blue-900">
        <button
          onClick={() => setIsCollapsed && setIsCollapsed(!isCollapsed)}
          className="p-2 text-blue-200 hover:text-white hover:bg-blue-700 rounded-lg transition-colors"
          title={isCollapsed ? 'Expandir menú' : 'Colapsar menú'}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Menú de navegación */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={item.onClick}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors
                  ${item.isActive
                    ? 'bg-blue-600 text-white shadow border border-blue-400'
                    : 'text-blue-100 hover:bg-blue-700 hover:text-white'}
                `}
                title={isCollapsed ? item.label : undefined}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!isCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
