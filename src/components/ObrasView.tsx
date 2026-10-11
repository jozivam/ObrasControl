import React from 'react';
import { useApp } from '../context/AppContext';
import { Building2, Plus, CheckCircle2, MapPin, Calendar, FileText, User } from 'lucide-react';

export const ObrasView: React.FC = () => {
  const { obras, activeObra, setActiveObraId, setIsNovaObraModalOpen, tags, nfs } = useApp();

  return (
    <div className="space-y-6">
      
      {/* Topo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Gestão Multi-Obra & Projetos Industriais
          </h2>
          <p className="text-xs text-slate-500">
            Cadastre novos canteiros, isole dados fiscais e gerencie montagens em múltiplos estados
          </p>
        </div>

        <button
          onClick={() => setIsNovaObraModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Obra / Projeto</span>
        </button>
      </div>

      {/* Grid de Obras */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {obras.map((obra) => {
          const isActive = obra.id === activeObra.id;
          const tagsDaObra = tags.filter((t) => t.obraId === obra.id);
          const nfsDaObra = nfs.filter((n) => n.obraId === obra.id);
          const concluidas = tagsDaObra.filter((t) => t.status === 'INSTALADO_CAMPO' || t.status === 'COMISSIONADO').length;
          const avanco = tagsDaObra.length > 0 ? Math.round((concluidas / tagsDaObra.length) * 100) : 0;

          return (
            <div
              key={obra.id}
              className={`bg-white rounded-2xl border p-5 shadow-xs transition-all flex flex-col justify-between ${
                isActive ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200/80 hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                      isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                    }`}>
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {obra.codigo}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-1">{obra.nome}</h3>
                    </div>
                  </div>

                  {isActive && (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Obra Ativa
                    </span>
                  )}
                </div>

                <div className="mt-4 p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-600">
                  <p className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Cliente: <strong className="text-slate-800">{obra.cliente}</strong></span>
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Local: <strong className="text-slate-800">{obra.localizacao}</strong></span>
                  </p>
                  <p className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Contrato: <strong className="text-slate-800 font-mono">{obra.contrato}</strong></span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Período: {obra.dataInicio} até {obra.dataPrevisaoTermino}</span>
                  </p>
                </div>

                {/* Resumo de Indicadores da Obra */}
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">TAGs</span>
                    <strong className="font-mono text-slate-800 text-sm">{tagsDaObra.length}</strong>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">NFs</span>
                    <strong className="font-mono text-slate-800 text-sm">{nfsDaObra.length}</strong>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Avanço</span>
                    <strong className="font-mono text-blue-700 text-sm">{avanco}%</strong>
                  </div>
                </div>

                {/* Subsistemas Cadastrados */}
                <div className="mt-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Subsistemas ({obra.subsistemas.length})
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {obra.subsistemas.slice(0, 4).map((sub, i) => (
                      <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        {sub}
                      </span>
                    ))}
                    {obra.subsistemas.length > 4 && (
                      <span className="text-[10px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded">
                        +{obra.subsistemas.length - 4} mais
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100">
                {!isActive ? (
                  <button
                    onClick={() => setActiveObraId(obra.id)}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition shadow-xs"
                  >
                    Ativar Esta Obra
                  </button>
                ) : (
                  <div className="text-center py-1.5 text-xs text-blue-700 font-semibold bg-blue-50 rounded-xl">
                    Painel Principal Operando Nesta Obra
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
