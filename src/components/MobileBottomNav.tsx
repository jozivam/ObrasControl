import React from 'react';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, Cpu, QrCode, Boxes, Wrench } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { currentTab, setCurrentTab, openScanner } = useApp();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-1.5 shadow-lg pb-safe">
      <div className="grid grid-cols-5 items-center justify-between text-center">
        
        {/* Tab 1: Dashboard */}
        <button
          onClick={() => setCurrentTab('dashboard')}
          className={`min-h-[44px] flex flex-col items-center justify-center py-1 transition-colors ${
            currentTab === 'dashboard' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight">Painel</span>
        </button>

        {/* Tab 2: TAGs */}
        <button
          onClick={() => setCurrentTab('tags')}
          className={`min-h-[44px] flex flex-col items-center justify-center py-1 transition-colors ${
            currentTab === 'tags' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Cpu className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight">TAGs</span>
        </button>

        {/* Tab Central: Bipar TAG (Scanner) */}
        <div className="flex justify-center -mt-4">
          <button
            onClick={() => openScanner()}
            className="w-13 h-13 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 ring-4 ring-white active:scale-90 transition-transform"
            aria-label="Abrir Scanner de Câmera"
          >
            <QrCode className="w-6 h-6" />
          </button>
        </div>

        {/* Tab 4: Almoxarifado */}
        <button
          onClick={() => setCurrentTab('almoxarifado')}
          className={`min-h-[44px] flex flex-col items-center justify-center py-1 transition-colors ${
            currentTab === 'almoxarifado' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Boxes className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight">Pátio</span>
        </button>

        {/* Tab 5: Cautela */}
        <button
          onClick={() => setCurrentTab('ferramentas')}
          className={`min-h-[44px] flex flex-col items-center justify-center py-1 transition-colors ${
            currentTab === 'ferramentas' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Wrench className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight">Cautela</span>
        </button>

      </div>
    </nav>
  );
};
