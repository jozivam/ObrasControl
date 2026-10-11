import React from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  ShieldCheck,
  Users,
  Check,
  X,
  Lock,
  UserCheck,
  HardHat,
  Sliders,
  AlertCircle
} from 'lucide-react';

export const UsuariosPermissoesView: React.FC = () => {
  const { users, activeUser, setActiveRole } = useApp();

  const permissionMatrix: {
    modulo: string;
    acao: string;
    admin: boolean;
    gestorCampo: boolean;
    gestorAlmoxarifado: boolean;
    supervisorCampo: boolean;
    almoxarife: boolean;
  }[] = [
    {
      modulo: 'Configurações Globais & Obras',
      acao: 'Cadastrar nova obra e alterar parâmetros de projeto',
      admin: true,
      gestorCampo: false,
      gestorAlmoxarifado: false,
      supervisorCampo: false,
      almoxarife: false,
    },
    {
      modulo: 'Controle de Acessos (RBAC)',
      acao: 'Gerenciar perfis, atribuir permissões e ativar/desativar usuários',
      admin: true,
      gestorCampo: false,
      gestorAlmoxarifado: false,
      supervisorCampo: false,
      almoxarife: false,
    },
    {
      modulo: 'Notas Fiscais (RF-01)',
      acao: 'Auditoria fiscal, visualização de custos de compra e exclusão de NFs',
      admin: true,
      gestorCampo: false,
      gestorAlmoxarifado: true,
      supervisorCampo: false,
      almoxarife: false,
    },
    {
      modulo: 'Notas Fiscais (RF-01)',
      acao: 'Bipagem/conferência de entrada física e upload de fotos de palete',
      admin: true,
      gestorCampo: false,
      gestorAlmoxarifado: true,
      supervisorCampo: false,
      almoxarife: true,
    },
    {
      modulo: 'Rastreabilidade de TAGs (RF-02)',
      acao: 'Baixa física do estoque para frente de montagem',
      admin: true,
      gestorCampo: true,
      gestorAlmoxarifado: true,
      supervisorCampo: true,
      almoxarife: true,
    },
    {
      modulo: 'Evidência Fotográfica (RF-03)',
      acao: 'Registro de fotos de instalação em campo no smartphone/tablet',
      admin: true,
      gestorCampo: true,
      gestorAlmoxarifado: false,
      supervisorCampo: true,
      almoxarife: false,
    },
    {
      modulo: 'Comissionamento (RF-03)',
      acao: 'Validação técnica e aprovação de comissionamento de instrumento',
      admin: true,
      gestorCampo: true,
      gestorAlmoxarifado: false,
      supervisorCampo: false,
      almoxarife: false,
    },
    {
      modulo: 'Cautela de Ferramentas (RF-04)',
      acao: 'Emissão e baixa de cautela de instrumentos de teste e solda',
      admin: true,
      gestorCampo: false,
      gestorAlmoxarifado: true,
      supervisorCampo: false,
      almoxarife: true,
    },
    {
      modulo: 'Curva S e Relatórios (RF-05)',
      acao: 'Emissão e assinatura de Relatório Diário de Obra (RDO) e medições',
      admin: true,
      gestorCampo: true,
      gestorAlmoxarifado: true,
      supervisorCampo: false,
      almoxarife: false,
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Topo do Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Perfis de Usuários & Níveis de Acesso (RBAC)
          </h2>
          <p className="text-xs text-slate-500">
            Controle granular de permissões por tela e ação conforme os 5 perfis operacionais
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Perfil Simulado Atual:</span>
          <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl">
            {activeUser.cargo}
          </span>
        </div>
      </div>

      {/* Seletor Rápido de Perfis para Teste Imediato */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-600" />
          Alternar Perfil em Tempo Real para Avaliar Permissões
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {users.map((u) => {
            const isSelected = activeUser.role === u.role;
            return (
              <button
                key={u.role}
                onClick={() => setActiveRole(u.role)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-[1.02]'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    isSelected ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {u.role}
                  </span>
                  {isSelected && <Check className="w-4 h-4 text-white" />}
                </div>
                <p className="text-xs font-bold mt-2 truncate">{u.nome}</p>
                <p className={`text-[10px] mt-0.5 truncate ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                  {u.cargo}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Matriz de Permissões Granular */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Matriz de Permissões por Tela e Ação Operacional
          </h3>
          <span className="text-xs text-slate-400">PRD Seção 2</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Módulo do Sistema</th>
                <th className="py-3 px-4">Ação / Funcionalidade</th>
                <th className="py-3 px-2 text-center">Gerente Geral</th>
                <th className="py-3 px-2 text-center">Gestor Campo</th>
                <th className="py-3 px-2 text-center">Gestor Almox.</th>
                <th className="py-3 px-2 text-center">Supervisor</th>
                <th className="py-3 px-2 text-center">Almoxarife</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {permissionMatrix.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-800 whitespace-nowrap">
                    {item.modulo}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {item.acao}
                  </td>
                  <td className="py-3 px-2 text-center">
                    {item.admin ? (
                      <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-300 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-2 text-center">
                    {item.gestorCampo ? (
                      <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-300 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-2 text-center">
                    {item.gestorAlmoxarifado ? (
                      <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-300 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-2 text-center">
                    {item.supervisorCampo ? (
                      <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-300 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-2 text-center">
                    {item.almoxarife ? (
                      <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-300 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
