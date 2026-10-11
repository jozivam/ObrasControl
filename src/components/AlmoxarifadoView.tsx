import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { TagItem, CustodiaType } from '../types';
import {
  Boxes,
  Building,
  DollarSign,
  Search,
  Filter,
  ArrowRight,
  Package,
  Layers,
  AlertTriangle,
  CheckCircle2,
  Camera,
  MapPin
} from 'lucide-react';

export const AlmoxarifadoView: React.FC = () => {
  const { filteredTags, activeObra, darBaixaTag, setCurrentTab } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustodia, setSelectedCustodia] = useState<string>('ALL');
  const [selectedSubsistema, setSelectedSubsistema] = useState<string>('ALL');

  // Filtragem dos itens armazenados no estoque físico
  const itensEmEstoque = useMemo(() => {
    return filteredTags.filter((t) => {
      const matchStatus = t.status === 'NO_ESTOQUE';
      const matchSearch =
        t.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.subsistema.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCustodia = selectedCustodia === 'ALL' || t.custodia === selectedCustodia;
      const matchSub = selectedSubsistema === 'ALL' || t.subsistema === selectedSubsistema;

      return matchStatus && matchSearch && matchCustodia && matchSub;
    });
  }, [filteredTags, searchTerm, selectedCustodia, selectedSubsistema]);

  // Contagens
  const totalEmEstoque = filteredTags.filter((t) => t.status === 'NO_ESTOQUE');
  const itensContratante = totalEmEstoque.filter((t) => t.custodia === 'CONTRATANTE');
  const itensMontadora = totalEmEstoque.filter((t) => t.custodia === 'MONTADORA');

  return (
    <div className="space-y-6">
      
      {/* Topo do Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Almoxarifado Técnico & Pátio de Obras
          </h2>
          <p className="text-xs text-slate-500">
            Balanço físico em tempo real com separação contábil de custódia
          </p>
        </div>

        <button
          onClick={() => setCurrentTab('nfs')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition"
        >
          <Boxes className="w-4 h-4" />
          <span>Receber Novo Lote (NF)</span>
        </button>
      </div>

      {/* Cards de Balanço Físico de Custódia */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Total Armazenado */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider">Saldo Total no Pátio</span>
            <Boxes className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 font-mono mt-3 tabular-nums">
            {totalEmEstoque.length} <span className="text-xs font-normal text-slate-400">itens aguardando montagem</span>
          </p>
          <p className="text-xs text-slate-500 mt-1">Disponíveis para liberação às frentes de trabalho</p>
        </div>

        {/* Custódia Contratante */}
        <div className="bg-indigo-50/70 p-5 rounded-2xl border border-indigo-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-indigo-700">
            <span className="font-bold uppercase tracking-wider">Custódia da Contratante</span>
            <Building className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-3xl font-extrabold text-indigo-900 font-mono mt-3 tabular-nums">
            {itensContratante.length} <span className="text-xs font-normal text-indigo-600/70">instrumentos</span>
          </p>
          <p className="text-xs text-indigo-800/80 mt-1">
            ⚠️ Saldo sob custódia de montagem (não entra em ativo contábil da montadora).
          </p>
        </div>

        {/* Compra Montadora */}
        <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-emerald-700">
            <span className="font-bold uppercase tracking-wider">Adquiridos pela Montadora</span>
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-900 font-mono mt-3 tabular-nums">
            {itensMontadora.length} <span className="text-xs font-normal text-emerald-600/70">itens</span>
          </p>
          <p className="text-xs text-emerald-800/80 mt-1">
            Itens adquiridos com ordem de compra vinculada ao contrato.
          </p>
        </div>

      </div>

      {/* Barra de Filtros */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filtrar por TAG, descrição ou subsistema..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
          />
        </div>

        <div className="w-full md:w-56">
          <select
            value={selectedCustodia}
            onChange={(e) => setSelectedCustodia(e.target.value)}
            className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="ALL">Todas as Custódias</option>
            <option value="CONTRATANTE">Contratante (Votorantim)</option>
            <option value="MONTADORA">Montadora (Compra)</option>
          </select>
        </div>

        <div className="w-full md:w-60">
          <select
            value={selectedSubsistema}
            onChange={(e) => setSelectedSubsistema(e.target.value)}
            className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="ALL">Todos os Subsistemas</option>
            {activeObra.subsistemas.map((sub, i) => (
              <option key={i} value={sub}>{sub}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid de Itens em Estoque */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {itensEmEstoque.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
            Nenhum instrumento no estoque físico do pátio para os filtros selecionados.
          </div>
        ) : (
          itensEmEstoque.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="font-mono font-bold text-sm text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {item.tag}
                  </span>
                  {item.custodia === 'CONTRATANTE' ? (
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                      Custódia Contratante
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      Montadora
                    </span>
                  )}
                </div>

                <h4 className="text-xs font-bold text-slate-900 mt-2 line-clamp-1">{item.descricao}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{item.subsistema}</p>

                {/* Imagem de Armazenamento no Pátio */}
                {item.fotoEstoqueUrl && (
                  <div className="mt-3 relative h-28 rounded-xl overflow-hidden border border-slate-200">
                    <img src={item.fotoEstoqueUrl} alt="Estoque" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2 text-white text-[10px]">
                      Armazenado no Pátio / Almoxarifado
                    </div>
                  </div>
                )}

                <div className="mt-3 p-2 bg-slate-50 rounded-xl text-[11px] text-slate-600 space-y-0.5">
                  <p><strong>Destino de Projeto:</strong> {item.painelGaveta || 'Campo'}</p>
                  <p><strong>Recebido em:</strong> {item.dataRecebimento}</p>
                  {item.nfNumero && <p><strong>NF de Origem:</strong> nº {item.nfNumero}</p>}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  onClick={() => darBaixaTag(item.id)}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition shadow-xs flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <span>Liberar para Montagem (Baixa)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
