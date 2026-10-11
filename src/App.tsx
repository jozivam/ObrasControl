import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { TagsView } from './components/TagsView';
import { AlmoxarifadoView } from './components/AlmoxarifadoView';
import { NotasFiscaisView } from './components/NotasFiscaisView';
import { CautelaFerramentasView } from './components/CautelaFerramentasView';
import { CurvaAvancoView } from './components/CurvaAvancoView';
import { UsuariosPermissoesView } from './components/UsuariosPermissoesView';
import { ObrasView } from './components/ObrasView';
import { ScannerModal } from './components/ScannerModal';
import { NovaObraModal } from './components/NovaObraModal';
import { MobileBottomNav } from './components/MobileBottomNav';

const MainLayout: React.FC = () => {
  const { currentTab } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderActiveView = () => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'tags':
        return <TagsView />;
      case 'almoxarifado':
        return <AlmoxarifadoView />;
      case 'nfs':
        return <NotasFiscaisView />;
      case 'ferramentas':
        return <CautelaFerramentasView />;
      case 'curva':
        return <CurvaAvancoView />;
      case 'usuarios':
        return <UsuariosPermissoesView />;
      case 'obras':
        return <ObrasView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Sidebar Lateral Fixa (Desktop) / Drawer (Mobile) */}
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Conteúdo Principal com compensação para a Sidebar */}
      <div className="flex-1 md:pl-64 flex flex-col min-w-0 pb-20 md:pb-8">
        
        {/* Top Header */}
        <Header onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

        {/* Viewport Principal */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Modais Globais */}
      <ScannerModal />
      <NovaObraModal />

      {/* Navegação Inferior para Smartphones */}
      <MobileBottomNav />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
