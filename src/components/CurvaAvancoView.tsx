import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  Printer,
  Download,
  Calendar,
  Building2,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  HardHat,
  Cpu,
  Layers,
  BarChart2
} from 'lucide-react';

export const CurvaAvancoView: React.FC = () => {
  const { activeObra, filteredTags, filteredNfs, filteredFerramentas, filteredCautelas, activeUser } = useApp();

  const [visualizacaoMode, setVisualizacaoMode] = useState<'GRAFICO' | 'RDO_PREVIEW'>('GRAFICO');

  // Cálculos de Avanço Global e Ponderado por Subsistema
  const totalTags = filteredTags.length;
  const tagsInstaladasOuComissionadas = filteredTags.filter(
    (t) => t.status === 'INSTALADO_CAMPO' || t.status === 'COMISSIONADO'
  ).length;
  const tagsComissionadas = filteredTags.filter((t) => t.status === 'COMISSIONADO').length;
  const avancoGlobal = totalTags > 0 ? Math.round((tagsInstaladasOuComissionadas / totalTags) * 100) : 0;

  // Curva S semanal simulada com dados reais acumulados
  const semanasProgresso = [
    { semana: 'Sem 01 (Fev)', previsto: 8, realizado: 8 },
    { semana: 'Sem 04 (Fev)', previsto: 18, realizado: 16 },
    { semana: 'Sem 08 (Mar)', previsto: 35, realizado: 32 },
    { semana: 'Sem 12 (Abr)', previsto: 55, realizado: avancoGlobal },
    { semana: 'Sem 16 (Mai)', previsto: 72, realizado: null },
    { semana: 'Sem 20 (Jun)', previsto: 88, realizado: null },
    { semana: 'Sem 24 (Jul)', previsto: 100, realizado: null },
  ];

  // Dados detalhados por subsistema
  const subsistemasStats = useMemo(() => {
    return activeObra.subsistemas.map((sub) => {
      const tagsDoSub = filteredTags.filter((t) => t.subsistema === sub);
      const total = tagsDoSub.length;
      const emEstoque = tagsDoSub.filter((t) => t.status === 'NO_ESTOQUE').length;
      const emMontagem = tagsDoSub.filter((t) => t.status === 'EM_MONTAGEM').length;
      const instaladas = tagsDoSub.filter((t) => t.status === 'INSTALADO_CAMPO').length;
      const comissionadas = tagsDoSub.filter((t) => t.status === 'COMISSIONADO').length;
      const concluidas = instaladas + comissionadas;
      const pct = total > 0 ? Math.round((concluidas / total) * 100) : 0;

      return {
        subsistema: sub,
        total,
        emEstoque,
        emMontagem,
        instaladas,
        comissionadas,
        pct,
      };
    });
  }, [activeObra.subsistemas, filteredTags]);

  // Exportar CSV
  const handleExportarCsv = () => {
    const cabecalho = 'TAG;Descricao;Subsistema;PainelGaveta;Custodia;Status;DataRecebimento;DataInstalacao;InstaladoPor\n';
    const linhas = filteredTags
      .map(
        (t) =>
          `"${t.tag}";"${t.descricao}";"${t.subsistema}";"${t.painelGaveta || ''}";"${t.custodia}";"${t.status}";"${t.dataRecebimento}";"${t.dataInstalacao || ''}";"${t.instaladoPor || ''}"`
      )
      .join('\n');

    const blob = new Blob([cabecalho + linhas], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SiteStock_Avanco_${activeObra.codigo}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const hoje = new Date().toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="space-y-6">
      
      {/* Topo do Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Curva de Avanço Físico (Curva S) & Relatório RDO
          </h2>
          <p className="text-xs text-slate-500">
            Acompanhamento das medições físicas alimentadas por fotos de instalação e comissionamento
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setVisualizacaoMode(visualizacaoMode === 'GRAFICO' ? 'RDO_PREVIEW' : 'GRAFICO')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition ${
              visualizacaoMode === 'RDO_PREVIEW'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {visualizacaoMode === 'GRAFICO' ? 'Visualizar RDO Formatado' : 'Voltar ao Gráfico'}
          </button>
          <button
            onClick={handleExportarCsv}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Exportar CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir RDO</span>
          </button>
        </div>
      </div>

      {visualizacaoMode === 'GRAFICO' ? (
        <div className="space-y-6 no-print">
          
          {/* Card Resumo do Avanço */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Avanço Físico Ponderado da Obra</p>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-4xl font-extrabold text-slate-900 font-mono tabular-nums">{avancoGlobal}%</span>
                  <span className="text-xs text-slate-500 font-medium">
                    ({tagsInstaladasOuComissionadas} de {totalTags} instrumentos montados)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Previsto no Cronograma</span>
                  <span className="font-mono font-bold text-slate-700 text-base">55%</span>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div className="text-right">
                  <span className="text-[10px] text-emerald-600 block uppercase font-bold">Realizado em Campo</span>
                  <span className="font-mono font-bold text-emerald-700 text-base">{avancoGlobal}%</span>
                </div>
              </div>
            </div>

            {/* Simulação Visual da Curva S com SVG Interativo */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-bold text-slate-700 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-blue-600" />
                  Curva S de Montagem (Previsto vs. Realizado)
                </span>
                <div className="flex items-center gap-4 text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-slate-400"></span> Previsto
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-1 bg-blue-600 rounded"></span> Realizado
                  </span>
                </div>
              </div>

              <div className="h-44 w-full bg-slate-50/70 rounded-xl p-4 border border-slate-200/80 flex items-end justify-between gap-2">
                {semanasProgresso.map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="w-full flex items-end justify-center gap-1.5 h-32 relative">
                      {/* Barra Previsto */}
                      <div
                        className="w-3 bg-slate-300 rounded-t transition-all group-hover:bg-slate-400"
                        style={{ height: `${item.previsto}%` }}
                        title={`Previsto: ${item.previsto}%`}
                      />
                      {/* Barra Realizado */}
                      {item.realizado !== null && (
                        <div
                          className="w-3.5 bg-blue-600 rounded-t shadow-xs transition-all group-hover:bg-blue-700"
                          style={{ height: `${item.realizado}%` }}
                          title={`Realizado: ${item.realizado}%`}
                        />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium whitespace-nowrap">{item.semana}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabela de Avanço Físico por Subsistema */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Avanço Físico Ponderado por Subsistema do Projeto
              </h3>
              <span className="text-xs text-slate-400">Base: Diagramas ATMC Moagem Z3</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">Subsistema / Área de Montagem</th>
                    <th className="py-3 px-4 text-center">Total TAGs</th>
                    <th className="py-3 px-4 text-center">No Pátio</th>
                    <th className="py-3 px-4 text-center">Em Montagem</th>
                    <th className="py-3 px-4 text-center">Instaladas</th>
                    <th className="py-3 px-4 text-center">Comissionadas</th>
                    <th className="py-3 px-4 text-right">Progresso (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {subsistemasStats.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {item.subsistema}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-700">
                        {item.total}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-slate-500">
                        {item.emEstoque}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-blue-600 font-bold">
                        {item.emMontagem}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-amber-600 font-bold">
                        {item.instaladas}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-emerald-600 font-bold">
                        {item.comissionadas}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${item.pct}%` }}
                            />
                          </div>
                          <span className="font-mono font-bold text-slate-900 w-10 text-right">
                            {item.pct}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      ) : null}

      {/* RDO: Relatório Diário de Obra Formatado para Impressão */}
      <div className={visualizacaoMode === 'RDO_PREVIEW' ? 'block' : 'hidden print:block'}>
        <div className="bg-white p-8 rounded-2xl border-2 border-slate-300 shadow-lg text-slate-900 font-sans max-w-4xl mx-auto space-y-6">
          
          {/* Cabeçalho Oficial do RDO */}
          <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-blue-900 text-white font-extrabold text-sm px-2.5 py-1 rounded">
                  SITESTOCK
                </span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  RELATÓRIO DIÁRIO DE OBRA (RDO)
                </span>
              </div>
              <h1 className="text-xl font-black text-slate-900 mt-2">
                {activeObra.nome}
              </h1>
              <p className="text-xs text-slate-600">
                Cliente: <strong>{activeObra.cliente}</strong> · Local: <strong>{activeObra.localizacao}</strong>
              </p>
            </div>

            <div className="text-right text-xs space-y-0.5">
              <p><strong>Data de Emissão:</strong> {hoje}</p>
              <p><strong>Contrato:</strong> {activeObra.contrato}</p>
              <p><strong>Responsável:</strong> {activeObra.responsavelEngenheiro}</p>
            </div>
          </div>

          {/* Resumo de Indicadores Físicos */}
          <div className="grid grid-cols-4 gap-3 text-center border border-slate-300 p-3 rounded-lg bg-slate-50">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Avanço Físico Global</span>
              <strong className="text-lg font-mono text-blue-900">{avancoGlobal}%</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">TAGs Instaladas</span>
              <strong className="text-lg font-mono text-emerald-800">{tagsInstaladasOuComissionadas}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Saldo em Almoxarifado</span>
              <strong className="text-lg font-mono text-amber-800">{filteredTags.filter((t) => t.status === 'NO_ESTOQUE').length}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Ferramentas em Campo</span>
              <strong className="text-lg font-mono text-purple-800">{filteredCautelas.filter((c) => c.status === 'ABERTA').length}</strong>
            </div>
          </div>

          {/* TAGs Movimentadas e Concluídas com Evidência Fotográfica */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
              1. Instrumentos e TAGs com Evidência Fotográfica Registrada
            </h3>
            <table className="w-full text-[11px] text-left border border-slate-200">
              <thead className="bg-slate-100 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2">TAG</th>
                  <th className="p-2">Descrição</th>
                  <th className="p-2">Subsistema</th>
                  <th className="p-2">Custódia</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Responsável / Registro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTags
                  .filter((t) => t.status === 'INSTALADO_CAMPO' || t.status === 'COMISSIONADO')
                  .map((t) => (
                    <tr key={t.id}>
                      <td className="p-2 font-mono font-bold text-blue-800">{t.tag}</td>
                      <td className="p-2">{t.descricao}</td>
                      <td className="p-2">{t.subsistema}</td>
                      <td className="p-2">{t.custodia}</td>
                      <td className="p-2 font-semibold text-emerald-700">{t.status}</td>
                      <td className="p-2 text-slate-500">{t.instaladoPor || t.comissionadoPor || 'Em Campo'}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Notas Fiscais Recebidas no Período */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
              2. Guarda Fiscal e Notas Fiscais de Entrada
            </h3>
            <table className="w-full text-[11px] text-left border border-slate-200">
              <thead className="bg-slate-100 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2">NF nº</th>
                  <th className="p-2">Fornecedor</th>
                  <th className="p-2">Custódia Fiscal</th>
                  <th className="p-2">Valor Total</th>
                  <th className="p-2">Data Entrada</th>
                  <th className="p-2">Status Conferência</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredNfs.map((nf) => (
                  <tr key={nf.id}>
                    <td className="p-2 font-mono font-bold">{nf.numero}</td>
                    <td className="p-2">{nf.fornecedor}</td>
                    <td className="p-2 font-semibold">
                      {nf.tipoCustodia === 'CONTRATANTE' ? 'Custódia Contratante' : 'Compra Montadora'}
                    </td>
                    <td className="p-2 font-mono">R$ {nf.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td className="p-2">{nf.dataRecebimento}</td>
                    <td className="p-2 text-emerald-700 font-semibold">{nf.statusConferencia}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Assinaturas Formais */}
          <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs text-slate-700">
            <div className="border-t border-slate-400 pt-2">
              <p className="font-bold">{activeUser.nome}</p>
              <p className="text-[11px] text-slate-500">Engenharia / Gestão da Montadora</p>
            </div>
            <div className="border-t border-slate-400 pt-2">
              <p className="font-bold">Fiscalização da Contratante</p>
              <p className="text-[11px] text-slate-500">{activeObra.cliente}</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
