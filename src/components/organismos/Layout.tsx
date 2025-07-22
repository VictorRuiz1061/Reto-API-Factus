import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  activeSidebarItem?: string;
  onSidebarItemClick?: (itemId: string) => void;
  onLogout?: () => void;
  onSettings?: () => void;
  userName?: string;
}

const SIDEBAR_WIDTH = 256; // w-64
const SIDEBAR_COLLAPSED = 64; // w-16
const HEADER_HEIGHT = 72; // px-6 py-4 aprox 72px

const Layout: React.FC<LayoutProps> = ({
  children,
  activeSidebarItem = 'facturas',
  onSidebarItemClick
}) => {
  // Estado para colapsar el sidebar
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Calcula el ancho del sidebar según el estado
  const sidebarWidth = isSidebarCollapsed ? SIDEBAR_COLLAPSED : SIDEBAR_WIDTH;

  return (
    <div className="">
      {/* Header fijo */}
      <div className="fixed top-0 left-0 right-0 z-30">
        <Header />
      </div>
      {/* Sidebar fijo */}
      <div
        className="fixed top-0 left-0 z-20 h-screen transition-all duration-300"
        style={{ width: sidebarWidth, marginTop: HEADER_HEIGHT }}
      >
        <Sidebar
          activeItem={activeSidebarItem}
          onItemClick={onSidebarItemClick}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />
      </div>
      {/* Contenido principal con margen */}
      <main
        className="transition-all duration-300"
        style={{
          marginLeft: sidebarWidth,
          paddingTop: HEADER_HEIGHT,
          minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`
        }}
      >
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout; 