import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { NotaFiscal, CustodiaType } from '../types';
import {
  FileText,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Eye,
  FileCheck,
  Building,
  DollarSign,
  PackageCheck,
  Calendar,
  Camera,
  ExternalLink
} from 'lucide-react';

export const NotasFiscaisView: React.FC = () => {
  const { filteredNfs, activeObra, activeUser, cadastrarNotaFiscal, filteredTags } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustodia, setSelectedCustodia] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [isNewNfModalOpen, setIsNewNfModalOpen] = useState(false);
  const [selectedNfForDetail, setSelectedNfForDetail] = useState<NotaFiscal | null>(null);

  // Formulário de nova NF
  const [nfForm, setNfForm] = useState({
    numero: '',
    serie: '001',
    fornecedor: '',
    cnpjFornecedor: '',
    dataEmissao: new Date().toISOString().split('T')[0],
    dataRecebimento: new Date().toISOString().split('T')[0],
    valorTotal: 0,
    tipoCustodia: 'CONTRATANTE' as CustodiaType,
    chaveAcesso: '',
    anexoDocumentoNome: '',
    fotoCargaPatioUrl: '',
    itensQtd: 1,
    statusConferencia: 'RECEBIDO_PENDENTE' as const,
    tagsVinculadasStr: '',
    observacoes: '',
  });

  const nfsFiltradas = useMemo(() => {
    return filteredNfs.filter((nf) => {
      const matchSearch =
        nf.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nf.fornecedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nf.chaveAcesso.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCustodia = selectedCustodia === 'ALL' || nf.tipoCustodia === selectedCustodia;
      const matchStatus = selectedStatus === 'ALL' || nf.statusConferencia === selectedStatus;

      return matchSearch && matchCustodia && matchStatus;
    });
  }, [filteredNfs, searchTerm, selectedCustodia, selectedStatus]);

  // Totais fiscais
  const totalValorContratante = filteredNfs
    .filter((n) => n.tipoCustodia === 'CONTRATANTE')
    .reduce((acc, curr) => acc + curr.valorTotal, 0);

  const totalValorMontadora = filteredNfs
    .filter((n) => n.tipoCustodia === 'MONTADORA')
    .reduce((acc, curr) => acc + curr.valorTotal, 0);

  const handleSubmitNf = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nfForm.numero || !nfForm.fornecedor) return;

    const tagsArray = nfForm.tagsVinculadasStr
      ? nfForm.tagsVinculadasStr.split(',').map((t) => t.trim().toUpperCase())
      : [];

    cadastrarNotaFiscal({
      numero: nfForm.numero,
      serie: nfForm.serie,
      fornecedor: nfForm.fornecedor,
      cnpjFornecedor: nfForm.cnpjFornecedor || '00.000.000/0001-00',
      dataEmissao: nfForm.dataEmissao,
      dataRecebimento: nfForm.dataRecebimento,
      valorTotal: Number(nfForm.valorTotal) || 0,
      tipoCustodia: nfForm.tipoCustodia,
      chaveAcesso: nfForm.chaveAcesso || `${Date.now()}`.padEnd(44, '0'),
      anexoDocumentoNome: nfForm.anexoDocumentoNome || `DANFE_NF${nfForm.numero}.pdf`,
      fotoCargaPatioUrl: nfForm.fotoCargaPatioUrl || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
      itensQtd: Number(nfForm.itensQtd) || 1,
      statusConferencia: nfForm.statusConferencia,
      tagsVinculadas: tagsArray,
      observacoes: nfForm.observacoes,
    });

    setIsNewNfModalOpen(false);
    setNfForm({
      numero: '',
      serie: '001',
      fornecedor: '',
      cnpjFornecedor: '',
      dataEmissao: new Date().toISOString().split('T')[0],
      dataRecebimento: new Date().toISOString().split('T')[0],
      valorTotal: 0,
      tipoCustodia: 'CONTRATANTE',
      chaveAcesso: '',
      anexoDocumentoNome: '',
      fotoCargaPatioUrl: '',
      itensQtd: 1,
      statusConferencia: 'RECEBIDO_PENDENTE',
      tagsVinculadasStr: '',
      observacoes: '',
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Topo do Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Controle de Entrada & Guarda Fiscal de NFs
          </h2>
          <p className="text-xs text-slate-500">
            Separação rigorosa entre saldo sob custódia da Contratante vs. compras diretas da Montadora
          </p>
        </div>

        <button
          onClick={() => setIsNewNfModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Dar Entrada em NF</span>
        </button>
      </div>

      {/* Cards de Balanço Fiscal de Custódia */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider">Total de Notas Fiscais</span>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono mt-2">{filteredNfs.length} NFs</p>
          <p className="text-xs text-slate-500 mt-1">Registradas na {activeObra.nome}</p>
        </div>

        <div className="bg-indigo-50/60 p-5 rounded-2xl border border-indigo-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-indigo-700">
            <span className="font-bold uppercase tracking-wider">Custódia da Contratante</span>
            <Building className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-indigo-900 font-mono mt-2">
            R$ {totalValorContratante.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-indigo-700/80 mt-1">Materiais e instrumentos fornecidos pelo cliente</p>
        </div>

        <div className="bg-emerald-50/60 p-5 rounded-2xl border border-emerald-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-emerald-700">
            <span className="font-bold uppercase tracking-wider">Aquisições da Montadora</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-900 font-mono mt-2">
            R$ {totalValorMontadora.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-emerald-700/80 mt-1">Ativo de compra da montadora com ordem de compra</p>
        </div>

      </div>

      {/* Barra de Busca e Filtros */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por número da NF, fornecedor ou chave de acesso..."
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
            <option value="CONTRATANTE">Fornecido p/ Contratante</option>
            <option value="MONTADORA">Comprado p/ Montadora</option>
          </select>
        </div>

        <div className="w-full md:w-56">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="ALL">Status de Conferência</option>
            <option value="CONFERIDO_APROVADO">Conferido e Aprovado</option>
            <option value="RECEBIDO_PENDENTE">Pendente de Conferência</option>
            <option value="DIVERGENCIA">Com Divergência</option>
          </select>
        </div>
      </div>

      {/* Lista de Notas Fiscais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {nfsFiltradas.length === 0 ? (
          <div className="col-span-2 bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
            Nenhuma Nota Fiscal encontrada para os filtros atuais.
          </div>
        ) : (
          nfsFiltradas.map((nf) => (
            <div
              key={nf.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-slate-900">
                          NF nº {nf.numero}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">Série {nf.serie}</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-600 line-clamp-1 mt-0.5">
                        {nf.fornecedor}
                      </p>
                    </div>
                  </div>

                  {nf.tipoCustodia === 'CONTRATANTE' ? (
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full shrink-0">
                      Custódia Contratante
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
                      Compra Montadora
                    </span>
                  )}
                </div>

                {/* Foto do Palete / Entrega Física no Pátio */}
                {nf.fotoCargaPatioUrl && (
                  <div className="mt-3.5 relative rounded-xl overflow-hidden border border-slate-200 h-28 group">
                    <img
                      src={nf.fotoCargaPatioUrl}
                      alt="Carga no Pátio"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2.5">
                      <p className="text-[11px] text-white font-medium flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5" />
                        Registro fotográfico de entrega física no pátio
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-3.5 grid grid-cols-2 gap-2 text-xs text-slate-600">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Valor da Nota:</span>
                    <strong className="font-mono text-slate-800">
                      R$ {nf.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </strong>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Status Físico:</span>
                    <strong className={`font-semibold ${
                      nf.statusConferencia === 'CONFERIDO_APROVADO' ? 'text-emerald-700' : 'text-amber-700'
                    }`}>
                      {nf.statusConferencia === 'CONFERIDO_APROVADO' ? 'Conferido & Aprovado' : 'Pendente de Vistoria'}
                    </strong>
                  </div>
                </div>

                {/* TAGs Vinculadas a esta NF */}
                {nf.tagsVinculadas && nf.tagsVinculadas.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      TAGs Vinculadas ({nf.tagsVinculadas.length})
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {nf.tagsVinculadas.map((t, idx) => (
                        <span key={idx} className="font-mono text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">Recebido em: {nf.dataRecebimento}</span>
                <button
                  onClick={() => setSelectedNfForDetail(nf)}
                  className="font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Ver DANFE & Itens</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL 1: Formulário de Entrada de Nova NF */}
      {isNewNfModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Entrada de Nota Fiscal & Guarda Fiscal</h3>
              <button onClick={() => setIsNewNfModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSubmitNf} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Número da NF *</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: 4082"
                    value={nfForm.numero}
                    onChange={(e) => setNfForm({ ...nfForm, numero: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Série</label>
                  <input
                    type="text"
                    value={nfForm.serie}
                    onChange={(e) => setNfForm({ ...nfForm, serie: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Razão Social do Fornecedor *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Votorantim Cimentos S.A. ou Fabricante"
                  value={nfForm.fornecedor}
                  onChange={(e) => setNfForm({ ...nfForm, fornecedor: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">CNPJ do Fornecedor</label>
                  <input
                    type="text"
                    placeholder="00.000.000/0000-00"
                    value={nfForm.cnpjFornecedor}
                    onChange={(e) => setNfForm({ ...nfForm, cnpjFornecedor: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Valor Total da Nota (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={nfForm.valorTotal || ''}
                    onChange={(e) => setNfForm({ ...nfForm, valorTotal: parseFloat(e.target.value) })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 font-mono font-bold"
                  />
                </div>
              </div>

              {/* Marcação Clara da Custódia (RF-01) */}
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 space-y-2">
                <label className="block font-bold text-blue-900">
                  Classificação de Custódia Fiscal do Item *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className={`p-2.5 rounded-lg border flex items-center gap-2 cursor-pointer transition ${
                    nfForm.tipoCustodia === 'CONTRATANTE' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-slate-200 text-slate-700'
                  }`}>
                    <input
                      type="radio"
                      name="tipoCustodia"
                      checked={nfForm.tipoCustodia === 'CONTRATANTE'}
                      onChange={() => setNfForm({ ...nfForm, tipoCustodia: 'CONTRATANTE' })}
                      className="hidden"
                    />
                    <div>
                      <p className="font-bold text-xs">Fornecido p/ Contratante</p>
                      <p className={`text-[10px] ${nfForm.tipoCustodia === 'CONTRATANTE' ? 'text-indigo-100' : 'text-slate-400'}`}>
                        Custódia de montagem
                      </p>
                    </div>
                  </label>

                  <label className={`p-2.5 rounded-lg border flex items-center gap-2 cursor-pointer transition ${
                    nfForm.tipoCustodia === 'MONTADORA' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-slate-200 text-slate-700'
                  }`}>
                    <input
                      type="radio"
                      name="tipoCustodia"
                      checked={nfForm.tipoCustodia === 'MONTADORA'}
                      onChange={() => setNfForm({ ...nfForm, tipoCustodia: 'MONTADORA' })}
                      className="hidden"
                    />
                    <div>
                      <p className="font-bold text-xs">Comprado p/ Montadora</p>
                      <p className={`text-[10px] ${nfForm.tipoCustodia === 'MONTADORA' ? 'text-emerald-100' : 'text-slate-400'}`}>
                        Ordem de compra própria
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  TAGs Industriais Vinculadas (Separadas por vírgula)
                </label>
                <input
                  type="text"
                  placeholder="ex: Z3M04M1, Z3M04Q2, Z3P81_PT1"
                  value={nfForm.tagsVinculadasStr}
                  onChange={(e) => setNfForm({ ...nfForm, tagsVinculadasStr: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 font-mono uppercase text-blue-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Foto das Embalagens / Paletes no Pátio (URL)
                </label>
                <input
                  type="text"
                  placeholder="Cole URL da foto da carga descarregada no canteiro..."
                  value={nfForm.fotoCargaPatioUrl}
                  onChange={(e) => setNfForm({ ...nfForm, fotoCargaPatioUrl: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Observações da Entrega</label>
                <textarea
                  rows={2}
                  placeholder="Informações sobre embalagens, lacres, conferência física..."
                  value={nfForm.observacoes}
                  onChange={(e) => setNfForm({ ...nfForm, observacoes: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewNfModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm"
                >
                  Salvar Entrada de NF
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Visualizador da Nota Fiscal e Documento */}
      {selectedNfForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-mono">DANFE NF-e nº {selectedNfForDetail.numero}</h3>
                <p className="text-xs text-slate-400">{selectedNfForDetail.fornecedor}</p>
              </div>
              <button onClick={() => setSelectedNfForDetail(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              
              {/* Documento DANFE Simulado */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono space-y-2">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span>CHAVE DE ACESSO:</span>
                  <span className="font-bold text-[10px] text-blue-700">{selectedNfForDetail.chaveAcesso}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400">EMISSÃO:</span> {selectedNfForDetail.dataEmissao}
                  </div>
                  <div>
                    <span className="text-slate-400">RECEBIMENTO:</span> {selectedNfForDetail.dataRecebimento}
                  </div>
                  <div>
                    <span className="text-slate-400">VALOR TOTAL:</span> R$ {selectedNfForDetail.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <div>
                    <span className="text-slate-400">CUSTÓDIA:</span> {selectedNfForDetail.tipoCustodia}
                  </div>
                </div>
              </div>

              {/* Foto de Recebimento no Pátio */}
              {selectedNfForDetail.fotoCargaPatioUrl && (
                <div>
                  <p className="font-bold text-slate-800 mb-1">Registro Fotográfico no Pátio</p>
                  <img
                    src={selectedNfForDetail.fotoCargaPatioUrl}
                    alt="Pátio"
                    className="w-full h-44 object-cover rounded-xl border border-slate-200"
                  />
                </div>
              )}

              {/* TAGs Vinculadas */}
              <div>
                <p className="font-bold text-slate-800 mb-1.5">Itens e TAGs Registrados sob esta NF</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedNfForDetail.tagsVinculadas.map((t, idx) => (
                    <span key={idx} className="font-mono font-bold text-xs text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600">
                <p><strong>Recebido por:</strong> {selectedNfForDetail.recebidoPor}</p>
                {selectedNfForDetail.observacoes && (
                  <p className="mt-1"><strong>Observações:</strong> {selectedNfForDetail.observacoes}</p>
                )}
              </div>

              <button
                onClick={() => setSelectedNfForDetail(null)}
                className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
              >
                Fechar Visualização
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
