import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Ferramenta, CautelaFerramenta } from '../types';
import {
  Wrench,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  MapPin,
  Calendar,
  RotateCcw,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export const CautelaFerramentasView: React.FC = () => {
  const {
    filteredFerramentas,
    filteredCautelas,
    activeObra,
    activeUser,
    cadastrarFerramenta,
    criarCautela,
    devolverCautela
  } = useApp();

  const [activeTab, setActiveTab] = useState<'CAUTELAS' | 'FERRAMENTAS'>('CAUTELAS');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Modais
  const [isNovaCautelaModalOpen, setIsNovaCautelaModalOpen] = useState(false);
  const [isNovaFerramentaModalOpen, setIsNovaFerramentaModalOpen] = useState(false);
  const [selectedCautelaForReturn, setSelectedCautelaForReturn] = useState<CautelaFerramenta | null>(null);

  // Formulário Nova Cautela
  const [novaCautelaForm, setNovaCautelaForm] = useState({
    ferramentaId: '',
    solicitanteNome: '',
    solicitanteMatricula: '',
    frenteServico: 'Moagem Z3 - Sala de Painéis',
    dataPrevistaDevolucao: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    observacoes: '',
  });

  // Formulário Devolução
  const [devolucaoCondicao, setDevolucaoCondicao] = useState('Equipamento íntegro e limpo após inspeção');

  // Formulário Nova Ferramenta
  const [novaFerramentaForm, setNovaFerramentaForm] = useState<Partial<Ferramenta>>({
    codigo: '',
    nome: '',
    categoria: 'Teste Elétrico',
    marcaModelo: '',
    numeroSerie: '',
    localizacaoPadrao: 'Armário A-01',
    validadeCalibracao: '',
  });

  // Ferramentas disponíveis para cautela
  const ferramentasDisponiveis = useMemo(() => {
    return filteredFerramentas.filter((f) => f.status === 'DISPONIVEL');
  }, [filteredFerramentas]);

  // Cautelas filtradas
  const cautelasFiltradas = useMemo(() => {
    return filteredCautelas.filter((c) => {
      const matchSearch =
        c.ferramentaNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.ferramentaCodigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.solicitanteNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.frenteServico.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = selectedStatus === 'ALL' || c.status === selectedStatus;
      return matchSearch && matchStatus;
    });
  }, [filteredCautelas, searchTerm, selectedStatus]);

  // Handler Nova Cautela
  const handleCriarCautela = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaCautelaForm.ferramentaId || !novaCautelaForm.solicitanteNome) return;

    criarCautela({
      ferramentaId: novaCautelaForm.ferramentaId,
      solicitanteNome: novaCautelaForm.solicitanteNome,
      solicitanteMatricula: novaCautelaForm.solicitanteMatricula || 'N/A',
      frenteServico: novaCautelaForm.frenteServico,
      dataPrevistaDevolucao: novaCautelaForm.dataPrevistaDevolucao,
      observacoes: novaCautelaForm.observacoes,
    });

    setIsNovaCautelaModalOpen(false);
    setNovaCautelaForm({
      ferramentaId: '',
      solicitanteNome: '',
      solicitanteMatricula: '',
      frenteServico: 'Moagem Z3 - Sala de Painéis',
      dataPrevistaDevolucao: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      observacoes: '',
    });
  };

  // Handler Devolução
  const handleConfirmarDevolucao = () => {
    if (!selectedCautelaForReturn) return;
    devolverCautela(selectedCautelaForReturn.id, devolucaoCondicao);
    setSelectedCautelaForReturn(null);
  };

  // Handler Nova Ferramenta
  const handleSalvarFerramenta = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaFerramentaForm.codigo || !novaFerramentaForm.nome) return;

    cadastrarFerramenta({
      codigo: novaFerramentaForm.codigo.toUpperCase().trim(),
      nome: novaFerramentaForm.nome,
      categoria: novaFerramentaForm.categoria as any || 'Teste Elétrico',
      marcaModelo: novaFerramentaForm.marcaModelo || 'Geral',
      numeroSerie: novaFerramentaForm.numeroSerie || 'SN-PADRAO',
      localizacaoPadrao: novaFerramentaForm.localizacaoPadrao || 'Almoxarifado',
      validadeCalibracao: novaFerramentaForm.validadeCalibracao,
    });

    setIsNovaFerramentaModalOpen(false);
    setNovaFerramentaForm({
      codigo: '',
      nome: '',
      categoria: 'Teste Elétrico',
      marcaModelo: '',
      numeroSerie: '',
      localizacaoPadrao: 'Armário A-01',
      validadeCalibracao: '',
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Topo do Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Cautela de Ferramentas & Equipamentos de Teste
          </h2>
          <p className="text-xs text-slate-500">
            Controle rigoroso de empréstimos, encarregados responsáveis e prevenção de perdas
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsNovaFerramentaModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
          >
            <Plus className="w-3.5 h-3.5 text-slate-500" />
            <span>Cadastrar Ferramenta</span>
          </button>
          <button
            onClick={() => setIsNovaCautelaModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition active:scale-95"
          >
            <Wrench className="w-4 h-4" />
            <span>Nova Cautela</span>
          </button>
        </div>
      </div>

      {/* Navegação entre Cautelas Ativas e Catálogo de Ferramentas */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('CAUTELAS')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'CAUTELAS'
                ? 'border-purple-600 text-purple-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Termos de Cautela ({filteredCautelas.length})
          </button>
          <button
            onClick={() => setActiveTab('FERRAMENTAS')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'FERRAMENTAS'
                ? 'border-purple-600 text-purple-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Catálogo & Inventário ({filteredFerramentas.length})
          </button>
        </div>
      </div>

      {/* ABA 1: Cautelas */}
      {activeTab === 'CAUTELAS' && (
        <div className="space-y-4">
          
          {/* Busca e Filtros de Cautela */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por ferramenta, encarregado ou frente de serviço..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 font-medium"
              />
            </div>

            <div className="w-full md:w-56">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="ALL">Todos os Status</option>
                <option value="ABERTA">Em Aberto (Campo)</option>
                <option value="ATRASADA">Vencida / Atrasada</option>
                <option value="DEVOLVIDA">Devolvida ao Almoxarifado</option>
              </select>
            </div>
          </div>

          {/* Cards de Cautela */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cautelasFiltradas.length === 0 ? (
              <div className="col-span-full bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
                Nenhuma cautela encontrada para os filtros atuais.
              </div>
            ) : (
              cautelasFiltradas.map((cautela) => {
                const isAtrasada = cautela.status === 'ATRASADA';
                const isDevolvida = cautela.status === 'DEVOLVIDA';

                return (
                  <div
                    key={cautela.id}
                    className={`bg-white rounded-2xl border shadow-xs p-4 flex flex-col justify-between transition-all ${
                      isAtrasada ? 'border-red-300 ring-1 ring-red-200' : 'border-slate-200/80 hover:shadow-md'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-mono font-bold text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-200">
                          {cautela.ferramentaCodigo}
                        </span>

                        {isAtrasada ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                            <AlertTriangle className="w-3 h-3 text-red-600" />
                            Atrasada
                          </span>
                        ) : isDevolvida ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Devolvida
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                            <Clock className="w-3 h-3 text-blue-600" />
                            Em Campo
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 mt-2 line-clamp-1">
                        {cautela.ferramentaNome}
                      </h4>

                      <div className="mt-3 p-3 bg-slate-50 rounded-xl space-y-1.5 text-[11px] text-slate-600">
                        <p className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>Responsável: <strong className="text-slate-800">{cautela.solicitanteNome}</strong> (Matrícula: {cautela.solicitanteMatricula})</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>Frente: <strong className="text-slate-800">{cautela.frenteServico}</strong></span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>Devolução Prevista: <strong className={isAtrasada ? 'text-red-600 font-bold' : 'text-slate-800'}>{cautela.dataPrevistaDevolucao}</strong></span>
                        </p>
                      </div>

                      {cautela.observacoes && (
                        <p className="text-[11px] text-slate-500 mt-2 italic">
                          "{cautela.observacoes}"
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-slate-400">Liberado por {cautela.liberadoPor}</span>
                      
                      {!isDevolvida && (
                        <button
                          onClick={() => setSelectedCautelaForReturn(cautela)}
                          className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition active:scale-95 flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Dar Baixa (Devolver)</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      )}

      {/* ABA 2: Catálogo de Ferramentas */}
      {activeTab === 'FERRAMENTAS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFerramentas.map((fer) => (
            <div key={fer.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    {fer.codigo}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    fer.status === 'DISPONIVEL'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-purple-50 text-purple-700 border border-purple-200'
                  }`}>
                    {fer.status === 'DISPONIVEL' ? 'Disponível no Almoxarifado' : 'Em Campo (Cautelada)'}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 mt-2">{fer.nome}</h4>
                <p className="text-[11px] text-slate-500">{fer.categoria} · {fer.marcaModelo}</p>

                <div className="mt-3 p-2.5 bg-slate-50 rounded-xl text-[11px] text-slate-600 space-y-1">
                  <p><strong>Nº Série:</strong> {fer.numeroSerie}</p>
                  <p><strong>Localização:</strong> {fer.localizacaoPadrao}</p>
                  {fer.validadeCalibracao && (
                    <p><strong>Calibração Válida até:</strong> {fer.validadeCalibracao}</p>
                  )}
                  {fer.status === 'CAUTELADA' && fer.responsavelAtual && (
                    <p className="text-purple-700 font-semibold pt-1 border-t border-slate-200 mt-1">
                      Em uso com {fer.responsavelAtual} ({fer.frenteAtual})
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                {fer.status === 'DISPONIVEL' ? (
                  <button
                    onClick={() => {
                      setNovaCautelaForm((prev) => ({ ...prev, ferramentaId: fer.id }));
                      setIsNovaCautelaModalOpen(true);
                    }}
                    className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs transition shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Emitir Cautela</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      const cautela = filteredCautelas.find((c) => c.id === fer.cautelaAtualId);
                      if (cautela) setSelectedCautelaForReturn(cautela);
                    }}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition"
                  >
                    Ver Cautela Ativa
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL 1: Nova Cautela */}
      {isNovaCautelaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Emissão de Cautela de Ferramenta</h3>
              <button onClick={() => setIsNovaCautelaModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCriarCautela} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Selecione o Equipamento Disponível *</label>
                <select
                  required
                  value={novaCautelaForm.ferramentaId}
                  onChange={(e) => setNovaCautelaForm({ ...novaCautelaForm, ferramentaId: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-white font-medium"
                >
                  <option value="">Selecione...</option>
                  {ferramentasDisponiveis.map((f) => (
                    <option key={f.id} value={f.id}>
                      [{f.codigo}] {f.nome} - {f.marcaModelo}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nome do Encarregado / Técnico *</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: João Silva"
                    value={novaCautelaForm.solicitanteNome}
                    onChange={(e) => setNovaCautelaForm({ ...novaCautelaForm, solicitanteNome: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Matrícula</label>
                  <input
                    type="text"
                    placeholder="MT-1029"
                    value={novaCautelaForm.solicitanteMatricula}
                    onChange={(e) => setNovaCautelaForm({ ...novaCautelaForm, solicitanteMatricula: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Frente de Serviço / Local na Obra *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Moagem Z3 - Acoplamento do Moinho"
                  value={novaCautelaForm.frenteServico}
                  onChange={(e) => setNovaCautelaForm({ ...novaCautelaForm, frenteServico: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Data Prevista de Devolução *</label>
                <input
                  type="date"
                  required
                  value={novaCautelaForm.dataPrevistaDevolucao}
                  onChange={(e) => setNovaCautelaForm({ ...novaCautelaForm, dataPrevistaDevolucao: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Observações da Saída</label>
                <textarea
                  rows={2}
                  placeholder="Estado do equipamento, pontas de teste, maleta inclusa..."
                  value={novaCautelaForm.observacoes}
                  onChange={(e) => setNovaCautelaForm({ ...novaCautelaForm, observacoes: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNovaCautelaModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-sm"
                >
                  Liberar Cautela
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Devolução de Cautela */}
      {selectedCautelaForReturn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Checklist de Devolução ao Almoxarifado</h3>
              <button onClick={() => setSelectedCautelaForReturn(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                <p className="font-bold text-purple-900">{selectedCautelaForReturn.ferramentaNome}</p>
                <p className="text-[11px] text-purple-700 mt-0.5">
                  Código: {selectedCautelaForReturn.ferramentaCodigo} | Solicitante: {selectedCautelaForReturn.solicitanteNome}
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Condição Física no Retorno *</label>
                <select
                  value={devolucaoCondicao}
                  onChange={(e) => setDevolucaoCondicao(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-white"
                >
                  <option value="Equipamento íntegro e limpo após inspeção">Equipamento íntegro e limpo após inspeção (100% OK)</option>
                  <option value="Com marcas normais de uso no canteiro">Com marcas normais de uso no canteiro (Operacional)</option>
                  <option value="Necessita limpeza ou calibração preventiva">Necessita limpeza ou calibração preventiva</option>
                  <option value="Apresenta avaria física / cabo danificado">Apresenta avaria física / cabo danificado (Manutenção)</option>
                </select>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600 space-y-1">
                <p>✔️ Acessórios e cabos de teste conferidos na maleta.</p>
                <p>✔️ Liberação imediata no estoque para novos empréstimos.</p>
                <p>✔️ Registro arquivado no histórico de auditoria da obra.</p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setSelectedCautelaForReturn(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmarDevolucao}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm"
                >
                  Confirmar Recebimento
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Cadastrar Ferramenta */}
      {isNovaFerramentaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Novo Equipamento no Inventário</h3>
              <button onClick={() => setIsNovaFerramentaModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSalvarFerramenta} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Código de Patrimônio *</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: FER-EL-010"
                    value={novaFerramentaForm.codigo}
                    onChange={(e) => setNovaFerramentaForm({ ...novaFerramentaForm, codigo: e.target.value.toUpperCase() })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Categoria</label>
                  <select
                    value={novaFerramentaForm.categoria}
                    onChange={(e) => setNovaFerramentaForm({ ...novaFerramentaForm, categoria: e.target.value as any })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-white"
                  >
                    <option value="Teste Elétrico">Teste Elétrico</option>
                    <option value="Instrumentação">Instrumentação</option>
                    <option value="Mecânica">Mecânica</option>
                    <option value="Solda">Solda</option>
                    <option value="Içamento">Içamento</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nome / Descrição *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Alicate Terrômetro de Loop"
                  value={novaFerramentaForm.nome}
                  onChange={(e) => setNovaFerramentaForm({ ...novaFerramentaForm, nome: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Marca / Modelo</label>
                  <input
                    type="text"
                    placeholder="Fluke 1630-2 FC"
                    value={novaFerramentaForm.marcaModelo}
                    onChange={(e) => setNovaFerramentaForm({ ...novaFerramentaForm, marcaModelo: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nº de Série</label>
                  <input
                    type="text"
                    placeholder="SN-998877"
                    value={novaFerramentaForm.numeroSerie}
                    onChange={(e) => setNovaFerramentaForm({ ...novaFerramentaForm, numeroSerie: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNovaFerramentaModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-sm"
                >
                  Salvar Equipamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
