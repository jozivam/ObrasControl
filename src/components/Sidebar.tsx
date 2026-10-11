import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  LayoutDashboard,
  Users,
  Boxes,
  Cpu,
  FileText,
  Wrench,
  TrendingUp,
  Building2,
  X,
  Shield,
  Check,
  ChevronUp,
  Settings
} from 'lucide-react';

export const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { currentTab, setCurrentTab, activeUser, setActiveRole, users } = useApp();
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tags', label: 'Tags & Instrumentos', icon: Cpu },
    { id: 'almoxarifado', label: 'Almoxarifado & Pátio', icon: Boxes },
    { id: 'nfs', label: 'Notas Fiscais (NF)', icon: FileText },
    { id: 'ferramentas', label: 'Cautela de Ferramentas', icon: Wrench },
    { id: 'curva', label: 'Curva S & Relatórios', icon: TrendingUp },
    { id: 'usuarios', label: 'Perfis & Acessos (RBAC)', icon: Users },
    { id: 'obras', label: 'Gestão de Obras', icon: Building2 },
  ];

  const getRoleBadgeLabel = (role: UserRole) => {
    switch (role) {
      case 'ADMIN': return 'Gerente Geral (Admin)';
      case 'GESTOR_CAMPO': return 'Gestor de Campo';
      case 'GESTOR_ALMOXARIFADO': return 'Gestor Almoxarifado';
      case 'SUPERVISOR_CAMPO': return 'Supervisor de Campo';
      case 'ALMOXARIFE': return 'Almoxarife';
      default: return role;
    }
  };

  return (
    <>
      {/* Backdrop para mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0a3575] text-white flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Topo do Menu: Marca e Botão Fechar em Mobile */}
        <div className="p-5 border-b border-blue-800/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-white font-black text-xl shadow-inner">
              S
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-white leading-tight">
                SiteStock
              </h1>
              <p className="text-[11px] font-medium text-blue-200/80">
                Obras & Pátio Industrial
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-blue-800/50"
            aria-label="Fechar navegação"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links de Navegação */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30 font-bold'
                    : 'text-blue-100/80 hover:text-white hover:bg-blue-700/40'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-blue-300'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Rodapé da Sidebar: Perfil Ativo com Seletor Rápido de RBAC */}
        <div className="p-3 border-t border-blue-800/40 relative bg-[#08295b]">
          {/* Menu popup para alternar de perfil RBAC */}
          {isRoleMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setIsRoleMenuOpen(false)}
              />
              <div className="absolute bottom-full left-3 right-3 mb-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-30 divide-y divide-slate-800">
                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Trocar Perfil de Acesso (RBAC)
                </div>
                <div className="py-1 space-y-0.5">
                  {users.map((u) => (
                    <button
                      key={u.role}
                      onClick={() => {
                        setActiveRole(u.role);
                        setIsRoleMenuOpen(false);
                      }}
                      className={`w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        activeUser.role === u.role
                          ? 'bg-blue-600 text-white font-bold'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="truncate">
                        <p className="truncate font-semibold">{u.nome}</p>
                        <p className="text-[10px] text-blue-200/70 truncate">{getRoleBadgeLabel(u.role)}</p>
                      </div>
                      {activeUser.role === u.role && (
                        <Check className="w-3.5 h-3.5 shrink-0 ml-1 text-white" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div
            onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
            className="flex items-center justify-between p-2 rounded-xl hover:bg-blue-800/40 cursor-pointer transition-colors"
            title="Clique para alternar perfil de usuário (Simulação de RBAC)"
          >
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xs shrink-0 ring-2 ring-blue-300/30">
                {activeUser.nome.charAt(0)}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate leading-tight">
                  {activeUser.nome}
                </p>
                <p className="text-[10px] text-blue-200 truncate">
                  {getRoleBadgeLabel(activeUser.role)}
                </p>
              </div>
            </div>
            <ChevronUp className="w-4 h-4 text-blue-300 shrink-0" />
          </div>
        </div>
      </aside>
    </>
  );
};
