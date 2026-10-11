import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Cpu,
  Boxes,
  CheckCircle2,
  Wrench,
  TrendingUp,
  FileText,
  Camera,
  QrCode,
  AlertTriangle,
  ArrowRight,
  Download,
  RefreshCw,
  Clock,
  Sparkles,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    activeObra,
    activeUser,
    filteredTags,
    filteredNfs,
    filteredFerramentas,
    filteredCautelas,
    filteredAtividades,
    setCurrentTab,
    openScanner,
    sincronizarAgora,
    isSyncing
  } = useApp();

  // Cálculos de métricas do projeto
  const totalTags = filteredTags.length;
  const tagsInstaladasOuComissionadas = filteredTags.filter(
    (t) => t.status === 'INSTALADO_CAMPO' || t.status === 'COMISSIONADO'
  ).length;
  const tagsComissionadas = filteredTags.filter((t) => t.status === 'COMISSIONADO').length;
  const percentualAvanco = totalTags > 0 ? Math.round((tagsInstaladasOuComissionadas / totalTags) * 100) : 0;

  // Itens em pátio por custódia
  const tagsEmEstoque = filteredTags.filter((t) => t.status === 'NO_ESTOQUE');
  const estoqueContratante = tagsEmEstoque.filter((t) => t.custodia === 'CONTRATANTE').length;
  const estoqueMontadora = tagsEmEstoque.filter((t) => t.custodia === 'MONTADORA').length;

  // Cautelas
  const cautelasAbertas = filteredCautelas.filter((c) => c.status === 'ABERTA' || c.status === 'ATRASADA');
  const cautelasAtrasadas = filteredCautelas.filter((c) => c.status === 'ATRASADA');

  // NFs pendentes de conferência
  const nfsPendentes = filteredNfs.filter((n) => n.statusConferencia === 'RECEBIDO_PENDENTE');

  // Progresso por subsistema
  const progressoPorSubsistema = useMemo(() => {
    return activeObra.subsistemas.map((sub) => {
      const tagsDoSub = filteredTags.filter((t) => t.subsistema === sub);
      const total = tagsDoSub.length;
      const concluidas = tagsDoSub.filter(
        (t) => t.status === 'INSTALADO_CAMPO' || t.status === 'COMISSIONADO'
      ).length;
      const pct = total > 0 ? Math.round((concluidas / total) * 100) : 0;
      return {
        subsistema: sub,
        total,
        concluidas,
        pct,
      };
    });
  }, [activeObra.subsistemas, filteredTags]);

  const hoje = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const hojeFormatado = hoje.charAt(0).toUpperCase() + hoje.slice(1);

  return (
    <div className="space-y-6">
      
      {/* 1. Card Superior de Boas-Vindas (Conforme o Banner da Imagem de Referência) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0d3b75] via-[#154c96] to-[#1e5eb4] p-6 text-white shadow-lg shadow-blue-950/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs font-semibold bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-blue-100">
                {hojeFormatado}
              </span>
              <span className="text-xs font-semibold bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                {activeObra.status === 'EM_ANDAMENTO' ? 'Montagem Ativa' : activeObra.status}
              </span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
              Bem-vindo, {activeUser.nome}
            </h2>
            <p className="text-sm text-blue-100/90 mt-1 max-w-xl">
              Painel de Gestão da <span className="font-semibold text-white">{activeObra.nome}</span>. Controle de custódia fiscal, TAGs ISA e cautelas de campo.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setCurrentTab('curva')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white transition-all backdrop-blur-sm"
            >
              <Download className="w-4 h-4" />
              <span>Exportar RDO</span>
            </button>
            <button
              onClick={() => sincronizarAgora()}
              disabled={isSyncing}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white text-blue-900 hover:bg-blue-50 text-xs font-bold transition-all shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Atualizando...' : 'Sincronizar'}</span>
            </button>
          </div>
        </div>

        {/* 4 Mini Métricas dentro do Header (Como no Mockup) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/15">
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
            <p className="text-[11px] text-blue-200 uppercase font-medium">Contrato</p>
            <p className="text-sm font-bold text-white truncate font-mono mt-0.5">{activeObra.contrato}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
            <p className="text-[11px] text-blue-200 uppercase font-medium">Cliente</p>
            <p className="text-sm font-bold text-white truncate mt-0.5">{activeObra.cliente}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
            <p className="text-[11px] text-blue-200 uppercase font-medium">Localização</p>
            <p className="text-sm font-bold text-white truncate mt-0.5">{activeObra.localizacao}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
            <p className="text-[11px] text-blue-200 uppercase font-medium">Avanço Físico Global</p>
            <p className="text-sm font-bold text-emerald-300 font-mono mt-0.5">{percentualAvanco}% Concluído</p>
          </div>
        </div>
      </div>

      {/* 2. Os 4 Cards de Indicadores de Topo (KPIs Rápidos) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Total de Tags do Projeto */}
        <div 
          onClick={() => setCurrentTab('tags')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Cpu className="w-5 h-5" />
            </span>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              Projeto ISA
            </span>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-4 font-mono tabular-nums">
            {totalTags}
          </p>
          <p className="text-xs font-semibold text-slate-500 mt-1">Total de TAGs Mapeadas</p>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>{activeObra.subsistemas.length} Subsistemas</span>
            <span className="text-blue-600 font-semibold group-hover:translate-x-0.5 transition-transform">Ver lista →</span>
          </div>
        </div>

        {/* KPI 2: Tags Instaladas / Comissionadas com Barra */}
        <div 
          onClick={() => setCurrentTab('curva')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-mono">
              {percentualAvanco}% Avanço
            </span>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-4 font-mono tabular-nums">
            {tagsInstaladasOuComissionadas} <span className="text-sm font-normal text-slate-400">/ {totalTags}</span>
          </p>
          <p className="text-xs font-semibold text-slate-500 mt-1">Instaladas & Comissionadas</p>
          <div className="mt-3">
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${percentualAvanco}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>{tagsComissionadas} Comissionadas</span>
              <span>Meta: 100%</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Itens no Pátio / Custódia Fiscal */}
        <div 
          onClick={() => setCurrentTab('almoxarifado')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Boxes className="w-5 h-5" />
            </span>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              Pátio & Almox.
            </span>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-4 font-mono tabular-nums">
            {tagsEmEstoque.length} <span className="text-xs font-medium text-slate-400">itens</span>
          </p>
          <p className="text-xs font-semibold text-slate-500 mt-1">Saldo Total Armazenado</p>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-blue-700 font-medium">Contratante: <strong className="font-mono">{estoqueContratante}</strong></span>
            <span className="text-emerald-700 font-medium">Montadora: <strong className="font-mono">{estoqueMontadora}</strong></span>
          </div>
        </div>

        {/* KPI 4: Ferramentas Cauteladas */}
        <div 
          onClick={() => setCurrentTab('ferramentas')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-purple-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Wrench className="w-5 h-5" />
            </span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full font-mono ${
              cautelasAtrasadas.length > 0
                ? 'bg-red-50 text-red-700 font-bold'
                : 'bg-purple-50 text-purple-700'
            }`}>
              {cautelasAtrasadas.length > 0 ? `${cautelasAtrasadas.length} Atrasadas` : 'Em dia'}
            </span>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-4 font-mono tabular-nums">
            {cautelasAbertas.length} <span className="text-sm font-normal text-slate-400">em campo</span>
          </p>
          <p className="text-xs font-semibold text-slate-500 mt-1">Ferramentas Cauteladas</p>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>{filteredFerramentas.length} no Inventário</span>
            <span className="text-purple-600 font-semibold group-hover:translate-x-0.5 transition-transform">Gerenciar →</span>
          </div>
        </div>

      </div>

      {/* 3. Seção de Ações Rápidas (Quick Actions) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Ações Rápidas Operacionais
          </h3>
          <span className="text-xs text-slate-400">Atalhos diretos para operações de campo e pátio</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          
          {/* Ação 1: Entrada de NF */}
          <button
            onClick={() => setCurrentTab('nfs')}
            className="flex items-center gap-3.5 p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Entrada de NF</p>
              <p className="text-[11px] text-blue-100/80">Guarda fiscal & fotos de palete</p>
            </div>
          </button>

          {/* Ação 2: Baixa de TAG em Campo */}
          <button
            onClick={() => openScanner()}
            className="flex items-center gap-3.5 p-4 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Bipar / Baixa de TAG</p>
              <p className="text-[11px] text-emerald-100/80">Scanner ou digitação de TAG</p>
            </div>
          </button>

          {/* Ação 3: Foto de Instalação */}
          <button
            onClick={() => setCurrentTab('tags')}
            className="flex items-center gap-3.5 p-4 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Foto de Instalação</p>
              <p className="text-[11px] text-amber-100/80">Evidência dupla & avanço físico</p>
            </div>
          </button>

          {/* Ação 4: Cautelar Ferramenta */}
          <button
            onClick={() => setCurrentTab('ferramentas')}
            className="flex items-center gap-3.5 p-4 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-800 text-white shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Cautelar Ferramenta</p>
              <p className="text-[11px] text-purple-100/80">Saída e controle de prazos</p>
            </div>
          </button>

        </div>
      </div>

      {/* 4. Grid Médio: Curva de Avanço por Subsistema (Esquerda) vs Feed de Atividades ao Vivo (Direita) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Lado Esquerdo: Avanço Físico dos Subsistemas da Obra (7 colunas) */}
        <div className="lg:col-span-7 bg-white p-5 lg:p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Avanço de Montagem por Subsistema
                </h3>
                <p className="text-xs text-slate-500">
                  Progresso físico das TAGs industriais cadastradas no projeto
                </p>
              </div>
              <button
                onClick={() => setCurrentTab('curva')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <span>Curva S Completa</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Lista de Barras de Progresso por Subsistema */}
            <div className="space-y-4">
              {progressoPorSubsistema.slice(0, 5).map((sub, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 truncate max-w-[260px] sm:max-w-xs">
                      {sub.subsistema}
                    </span>
                    <span className="font-mono font-bold text-slate-800">
                      {sub.concluidas} / {sub.total} ({sub.pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-500 ${
                        sub.pct === 100
                          ? 'bg-emerald-500'
                          : sub.pct > 50
                          ? 'bg-blue-600'
                          : sub.pct > 0
                          ? 'bg-amber-500'
                          : 'bg-slate-300'
                      }`}
                      style={{ width: `${Math.max(sub.pct, 2)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 bg-slate-50 rounded-xl">
              <p className="text-[10px] text-slate-400 font-semibold uppercase">No Estoque</p>
              <p className="text-base font-bold text-slate-700 font-mono mt-0.5">{tagsEmEstoque.length}</p>
            </div>
            <div className="p-2.5 bg-blue-50 rounded-xl">
              <p className="text-[10px] text-blue-600 font-semibold uppercase">Em Montagem</p>
              <p className="text-base font-bold text-blue-700 font-mono mt-0.5">
                {filteredTags.filter((t) => t.status === 'EM_MONTAGEM').length}
              </p>
            </div>
            <div className="p-2.5 bg-emerald-50 rounded-xl">
              <p className="text-[10px] text-emerald-600 font-semibold uppercase">Concluídas</p>
              <p className="text-base font-bold text-emerald-700 font-mono mt-0.5">{tagsInstaladasOuComissionadas}</p>
            </div>
          </div>
        </div>

        {/* Lado Direito: Feed de Atividades em Tempo Real (5 colunas) */}
        <div className="lg:col-span-5 bg-white p-5 lg:p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-base font-bold text-slate-900">Atividades em Tempo Real</h3>
              </div>
              <span className="text-xs text-slate-400">Feed da Obra</span>
            </div>

            <div className="space-y-3.5 max-h-[340px] overflow-y-auto pr-1">
              {filteredAtividades.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Nenhuma atividade recente registrada nesta obra.
                </div>
              ) : (
                filteredAtividades.slice(0, 6).map((act) => (
                  <div key={act.id} className="flex items-start gap-3 text-xs group">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                      {act.tipo.includes('TAG') ? (
                        <Cpu className="w-3.5 h-3.5" />
                      ) : act.tipo.includes('NF') ? (
                        <FileText className="w-3.5 h-3.5" />
                      ) : (
                        <Wrench className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div className="flex-1 truncate">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-slate-800 truncate">{act.titulo}</p>
                        <span className="text-[10px] text-slate-400 shrink-0 ml-2">{act.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{act.descricao}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Por <strong className="text-slate-600">{act.usuario}</strong>
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <button
              onClick={() => setCurrentTab('tags')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
            >
              <span>Ver histórico completo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* 5. Alertas & Pendências (Pending Actions) - Conforme Mockup com Cards Coloridos */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Alertas & Ações Pendentes
            </h3>
            <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-bold">
              {cautelasAtrasadas.length + nfsPendentes.length + 1} Pendências
            </span>
          </div>
          <span className="text-xs text-slate-400">Atenção imediata requerida</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1: Ferramentas Vencidas */}
          <div className="bg-red-50/70 border border-red-200 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-700 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  Cautela de Ferramentas
                </span>
                <span className="w-6 h-6 rounded-full bg-red-600 text-white font-mono font-bold text-xs flex items-center justify-center">
                  {cautelasAtrasadas.length}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mt-2">
                Equipamentos em Atraso de Devolução
              </h4>
              <p className="text-xs text-slate-600 mt-1">
                {cautelasAtrasadas.length > 0
                  ? `${cautelasAtrasadas[0].ferramentaNome} com prazo vencido com ${cautelasAtrasadas[0].solicitanteNome}.`
                  : 'Nenhuma ferramenta em atraso no momento.'}
              </p>
            </div>
            <button
              onClick={() => setCurrentTab('ferramentas')}
              className="mt-4 w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              Cobrar Devoluções →
            </button>
          </div>

          {/* Card 2: Conferência de NFs */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Notas Fiscais
                </span>
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-mono font-bold text-xs flex items-center justify-center">
                  {nfsPendentes.length}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mt-2">
                NFs Aguardando Conferência Física
              </h4>
              <p className="text-xs text-slate-600 mt-1">
                {nfsPendentes.length > 0
                  ? `NF ${nfsPendentes[0].numero} (${nfsPendentes[0].fornecedor}) necessita validação de itens no pátio.`
                  : 'Todas as notas fiscais foram conferidas e aprovadas.'}
              </p>
            </div>
            <button
              onClick={() => setCurrentTab('nfs')}
              className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              Conferir NFs Pendentes →
            </button>
          </div>

          {/* Card 3: Evidências Fotográficas Faltantes */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-amber-600" />
                  Auditoria de Campo
                </span>
                <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-mono font-bold text-xs flex items-center justify-center">
                  {filteredTags.filter((t) => t.status === 'EM_MONTAGEM').length}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mt-2">
                TAGs em Montagem sem Foto
              </h4>
              <p className="text-xs text-slate-600 mt-1">
                Instrumentos baixados do almoxarifado aguardando comprovação fotográfica de fixação para avançar a Curva S.
              </p>
            </div>
            <button
              onClick={() => setCurrentTab('tags')}
              className="mt-4 w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              Registrar Fotos de Campo →
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
