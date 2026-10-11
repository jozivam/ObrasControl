import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Download, 
  QrCode, 
  Plus, 
  ChevronDown, 
  HardHat, 
  Smartphone,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const Header: React.FC<{ onOpenMobileMenu?: () => void }> = ({ onOpenMobileMenu }) => {
  const { 
    activeObra, 
    obras, 
    setActiveObraId, 
    activeUser, 
    isOnline, 
    isSimulatedOffline, 
    toggleSimulatedOffline, 
    pendingSyncCount, 
    sincronizarAgora, 
    isSyncing,
    openScanner,
    setIsNovaObraModalOpen,
    setCurrentTab
  } = useApp();

  const [isObraDropdownOpen, setIsObraDropdownOpen] = useState(false);
  const [showPwaInstallAlert, setShowPwaInstallAlert] = useState(false);

  // Data formatada em português
  const hoje = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const hojeCapitalizado = hoje.charAt(0).toUpperCase() + hoje.slice(1);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20 px-4 lg:px-8 py-3.5 transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Lado Esquerdo: Identificação & Seletor de Obra Ativa */}
        <div className="flex items-center gap-3">
          {/* Botão Mobile Menu */}
          <button 
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Abrir menu lateral"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="relative">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider">
                Obra Ativa
              </span>
              <button
                onClick={() => setIsObraDropdownOpen(!isObraDropdownOpen)}
                className="flex items-center gap-2 text-sm md:text-base font-bold text-slate-800 hover:text-blue-700 transition-colors py-1 px-1.5 rounded-md hover:bg-slate-100"
              >
                <Building2 className="w-4 h-4 text-slate-500" />
                <span className="truncate max-w-[220px] sm:max-w-[340px]">{activeObra.nome}</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Dropdown de Troca de Obra / Cadastro de Novo Projeto */}
            {isObraDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-30" 
                  onClick={() => setIsObraDropdownOpen(false)} 
                />
                <div className="absolute left-0 top-full mt-1.5 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-40 divide-y divide-slate-100">
                  <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Selecione o Projeto / Canteiro
                  </div>
                  <div className="py-1 max-h-60 overflow-y-auto">
                    {obras.map((obra) => (
                      <button
                        key={obra.id}
                        onClick={() => {
                          setActiveObraId(obra.id);
                          setIsObraDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 flex items-center justify-between text-sm transition-colors ${
                          obra.id === activeObra.id
                            ? 'bg-blue-50 text-blue-700 font-semibold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="truncate">
                          <p className="truncate font-medium">{obra.nome}</p>
                          <p className="text-xs text-slate-400 truncate">{obra.cliente} · {obra.localizacao}</p>
                        </div>
                        {obra.id === activeObra.id && (
                          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 ml-2" />
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="pt-1.5 px-2">
                    <button
                      onClick={() => {
                        setIsObraDropdownOpen(false);
                        setIsNovaObraModalOpen(true);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Cadastrar Nova Obra / Projeto
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Lado Direito: Scanner Câmera, Sincronização Offline, Exportação e PWA */}
        <div className="flex items-center flex-wrap gap-2 md:gap-3 justify-end">
          
          {/* Botão de Bipagem Rápida / Câmera */}
          <button
            onClick={() => openScanner()}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
            title="Abrir leitor de TAG por câmera"
          >
            <QrCode className="w-4 h-4" />
            <span className="hidden sm:inline">Bipar TAG</span>
          </button>

          {/* Toggle de Modo Offline / Online para simulação em campo */}
          <button
            onClick={toggleSimulatedOffline}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isOnline
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
            }`}
            title={isOnline ? "Conectado. Clique para simular modo sem sinal (offline)" : "Desconectado. Clique para reconectar"}
          >
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                <span>Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                <span>Offline (Campo)</span>
                {pendingSyncCount > 0 && (
                  <span className="bg-amber-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                    {pendingSyncCount}
                  </span>
                )}
              </>
            )}
          </button>

          {/* Botão Sincronizar Fila */}
          <button
            onClick={() => sincronizarAgora()}
            disabled={isSyncing || pendingSyncCount === 0}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              pendingSyncCount > 0
                ? 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800 shadow-sm'
                : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
            }`}
            title="Sincronizar dados coletados em campo com o servidor"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-blue-400' : ''}`} />
            <span className="hidden sm:inline">
              {isSyncing ? 'Sincronizando...' : pendingSyncCount > 0 ? `Subir (${pendingSyncCount})` : 'Sincronizado'}
            </span>
          </button>

          {/* Botão Exportar RDO */}
          <button
            onClick={() => setCurrentTab('curva')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
            title="Visualizar e exportar Relatório Diário de Obra (RDO)"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>RDO / Curva S</span>
          </button>

          {/* Botão PWA Instalador no Celular */}
          <button
            onClick={() => setShowPwaInstallAlert(true)}
            className="flex items-center gap-1 p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-xs transition-colors"
            title="Instalar SiteStock como aplicativo PWA no dispositivo"
          >
            <Smartphone className="w-4 h-4 text-blue-600" />
          </button>
        </div>
      </div>

      {/* Modal Guia PWA */}
      {showPwaInstallAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Instalar SiteStock no Celular</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              O SiteStock funciona como um aplicativo completo (PWA) direto no navegador do smartphone dos técnicos:
            </p>
            <div className="mt-4 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2">
              <p>📱 <strong>No Android (Chrome):</strong> Toque nos 3 pontos do navegador e selecione <em>"Instalar aplicativo"</em> ou <em>"Adicionar à tela inicial"</em>.</p>
              <p>🍎 <strong>No iPhone (Safari):</strong> Toque no botão de <em>Compartilhar</em> e escolha <em>"Adicionar à Tela de Início"</em>.</p>
              <p>⚡ <strong>Modo Offline:</strong> Funciona mesmo sem internet no canteiro, gravando TAGs e fotos localmente!</p>
            </div>
            <button
              onClick={() => setShowPwaInstallAlert(false)}
              className="mt-5 w-full py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
