import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { TagItem, TagStatus, CustodiaType } from '../types';
import {
  Search,
  Filter,
  Plus,
  QrCode,
  Camera,
  CheckCircle2,
  Clock,
  ArrowRight,
  Eye,
  MapPin,
  FileSpreadsheet,
  Printer,
  ChevronDown,
  Upload,
  AlertCircle
} from 'lucide-react';

export const TagsView: React.FC = () => {
  const {
    filteredTags,
    activeObra,
    activeUser,
    darBaixaTag,
    registrarFotoInstalacao,
    comissionarTag,
    cadastrarTag,
    openScanner,
    importarTagsEmLote
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedSubsistema, setSelectedSubsistema] = useState<string>('ALL');
  const [selectedCustodia, setSelectedCustodia] = useState<string>('ALL');

  // Modais locais
  const [selectedTagForDetail, setSelectedTagForDetail] = useState<TagItem | null>(null);
  const [selectedTagForPhoto, setSelectedTagForPhoto] = useState<TagItem | null>(null);
  const [selectedTagForQr, setSelectedTagForQr] = useState<TagItem | null>(null);
  const [isNewTagModalOpen, setIsNewTagModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Estados dos formulários dos modais
  const [photoInputUrl, setPhotoInputUrl] = useState('');
  const [photoLocalizacao, setPhotoLocalizacao] = useState('');
  const [baixaObservacao, setBaixaObservacao] = useState('');

  // Formulário de nova TAG
  const [newTagForm, setNewTagForm] = useState<Partial<TagItem>>({
    tag: '',
    tipo: 'Instrumento Industrial',
    descricao: '',
    subsistema: activeObra.subsistemas[0] || 'Moagem Z3',
    painelGaveta: '',
    custodia: 'CONTRATANTE',
    status: 'NO_ESTOQUE',
    observacoes: '',
    fabricante: '',
    modelo: '',
    tensaoPotencia: '',
  });

  // Filtros aplicados
  const tagsFiltradas = useMemo(() => {
    return filteredTags.filter((t) => {
      const matchSearch =
        t.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.subsistema.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.painelGaveta && t.painelGaveta.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchStatus = selectedStatus === 'ALL' || t.status === selectedStatus;
      const matchSub = selectedSubsistema === 'ALL' || t.subsistema === selectedSubsistema;
      const matchCustodia = selectedCustodia === 'ALL' || t.custodia === selectedCustodia;

      return matchSearch && matchStatus && matchSub && matchCustodia;
    });
  }, [filteredTags, searchTerm, selectedStatus, selectedSubsistema, selectedCustodia]);

  // Ações de formulário
  const handleSalvarFotoInstalacao = () => {
    if (!selectedTagForPhoto) return;
    const finalUrl = photoInputUrl.trim() || 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80';
    registrarFotoInstalacao(selectedTagForPhoto.id, finalUrl, photoLocalizacao);
    setSelectedTagForPhoto(null);
    setPhotoInputUrl('');
    setPhotoLocalizacao('');
  };

  const handleCriarTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagForm.tag || !newTagForm.descricao) return;
    cadastrarTag(newTagForm);
    setIsNewTagModalOpen(false);
    setNewTagForm({
      tag: '',
      tipo: 'Instrumento Industrial',
      descricao: '',
      subsistema: activeObra.subsistemas[0] || 'Moagem Z3',
      painelGaveta: '',
      custodia: 'CONTRATANTE',
      status: 'NO_ESTOQUE',
      observacoes: '',
      fabricante: '',
      modelo: '',
      tensaoPotencia: '',
    });
  };

  // Status Badge Helper
  const renderStatusBadge = (status: TagStatus) => {
    switch (status) {
      case 'NO_ESTOQUE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            No Estoque / Pátio
          </span>
        );
      case 'EM_MONTAGEM':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            Em Montagem
          </span>
        );
      case 'INSTALADO_CAMPO':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
            Instalado em Campo
          </span>
        );
      case 'COMISSIONADO':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            Comissionado
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Topo do Módulo: Título e Ações Principais */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Rastreabilidade de Instrumentos por TAG ISA
          </h2>
          <p className="text-xs text-slate-500">
            Mapeamento desde o pátio até o comissionamento em campo com auditoria fotográfica
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => openScanner((code) => setSearchTerm(code))}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold border border-blue-200 transition"
          >
            <QrCode className="w-4 h-4 text-blue-600" />
            <span>Escanear TAG</span>
          </button>
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
          >
            <Upload className="w-4 h-4 text-slate-500" />
            <span>Importar CSV</span>
          </button>
          <button
            onClick={() => setIsNewTagModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar TAG</span>
          </button>
        </div>
      </div>

      {/* Barra de Filtros e Busca Rápida */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          
          {/* Busca Textual */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por TAG (ex: Z3M03M1), descrição, gaveta CCM ou subsistema..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent font-medium"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Filtro de Subsistema */}
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

          {/* Filtro de Custódia */}
          <div className="w-full md:w-48">
            <select
              value={selectedCustodia}
              onChange={(e) => setSelectedCustodia(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="ALL">Custódia: Todas</option>
              <option value="CONTRATANTE">Contratante (Cliente)</option>
              <option value="MONTADORA">Montadora (Compra)</option>
            </select>
          </div>
        </div>

        {/* Abas Segmentadas de Status */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-xs scrollbar-none">
          {[
            { id: 'ALL', label: 'Todas as TAGs', count: filteredTags.length },
            { id: 'NO_ESTOQUE', label: 'No Estoque', count: filteredTags.filter((t) => t.status === 'NO_ESTOQUE').length },
            { id: 'EM_MONTAGEM', label: 'Em Montagem', count: filteredTags.filter((t) => t.status === 'EM_MONTAGEM').length },
            { id: 'INSTALADO_CAMPO', label: 'Instalado em Campo', count: filteredTags.filter((t) => t.status === 'INSTALADO_CAMPO').length },
            { id: 'COMISSIONADO', label: 'Comissionado', count: filteredTags.filter((t) => t.status === 'COMISSIONADO').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                selectedStatus === tab.id
                  ? 'bg-blue-600 text-white shadow-xs font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedStatus === tab.id ? 'bg-blue-800 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Tabela de Instrumentos e TAGs */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">TAG ISA & Equipamento</th>
                <th className="py-3 px-4">Subsistema & Painel</th>
                <th className="py-3 px-4">Custódia Fiscal</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Evidências (Dupla Foto)</th>
                <th className="py-3 px-4 text-right">Ações Operacionais</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tagsFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-600">Nenhum instrumento encontrado com os filtros selecionados.</p>
                    <p className="text-[11px] mt-1">Tente ajustar a busca ou cadastrar uma nova TAG.</p>
                  </td>
                </tr>
              ) : (
                tagsFiltradas.map((tag) => (
                  <tr key={tag.id} className="hover:bg-slate-50/80 transition-colors group">
                    
                    {/* TAG e Descrição */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {tag.tag}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase">
                          {tag.tipo}
                        </span>
                      </div>
                      <p className="font-semibold text-slate-900 mt-1 line-clamp-1">{tag.descricao}</p>
                      {tag.fabricante && (
                        <p className="text-[10px] text-slate-400">
                          {tag.fabricante} {tag.modelo ? `· ${tag.modelo}` : ''}
                        </p>
                      )}
                    </td>

                    {/* Subsistema e Painel/Gaveta */}
                    <td className="py-3.5 px-4 text-slate-600">
                      <p className="font-semibold text-slate-800 line-clamp-1">{tag.subsistema}</p>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">{tag.painelGaveta || 'Local em campo'}</p>
                    </td>

                    {/* Custódia Fiscal */}
                    <td className="py-3.5 px-4">
                      {tag.custodia === 'CONTRATANTE' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
                          Contratante
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                          Montadora
                        </span>
                      )}
                      {tag.nfNumero && (
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">NF {tag.nfNumero}</p>
                      )}
                    </td>

                    {/* Status de Montagem */}
                    <td className="py-3.5 px-4">
                      {renderStatusBadge(tag.status)}
                    </td>

                    {/* Registro Fotográfico Duplo (Estoque vs Instalação Campo) */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200">
                        {/* Foto 1: Estoque */}
                        <div
                          onClick={() => setSelectedTagForDetail(tag)}
                          className="relative w-8 h-8 rounded-lg overflow-hidden border border-slate-300 cursor-pointer hover:opacity-80 transition group/img"
                          title="Foto 1: Armazenamento no Almoxarifado/Pátio"
                        >
                          {tag.fotoEstoqueUrl ? (
                            <img src={tag.fotoEstoqueUrl} alt="Estoque" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-slate-200 flex items-center justify-center text-[9px] text-slate-500 font-bold">
                              Pátio
                            </div>
                          )}
                        </div>

                        <span className="text-slate-300 font-bold">/</span>

                        {/* Foto 2: Campo */}
                        <div
                          onClick={() => {
                            if (tag.fotoInstalacaoUrl) {
                              setSelectedTagForDetail(tag);
                            } else {
                              setSelectedTagForPhoto(tag);
                            }
                          }}
                          className={`relative w-8 h-8 rounded-lg overflow-hidden border cursor-pointer hover:opacity-80 transition ${
                            tag.fotoInstalacaoUrl ? 'border-emerald-400' : 'border-dashed border-slate-300 bg-amber-50/50'
                          }`}
                          title={tag.fotoInstalacaoUrl ? "Foto 2: Instalado em Campo" : "Pendente: Clique para anexar foto de campo"}
                        >
                          {tag.fotoInstalacaoUrl ? (
                            <img src={tag.fotoInstalacaoUrl} alt="Campo" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-amber-600">
                              <Camera className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Ações */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Ação 1: Baixa p/ Montagem se NO_ESTOQUE */}
                        {tag.status === 'NO_ESTOQUE' && (
                          <button
                            onClick={() => darBaixaTag(tag.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition active:scale-95"
                            title="Dar Baixa Física para Frente de Montagem"
                          >
                            Baixar p/ Campo
                          </button>
                        )}

                        {/* Ação 2: Tirar Foto se EM_MONTAGEM */}
                        {tag.status === 'EM_MONTAGEM' && (
                          <button
                            onClick={() => setSelectedTagForPhoto(tag)}
                            className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs shadow-xs transition flex items-center gap-1 active:scale-95"
                            title="Registrar Foto do Instrumento Fixado em Campo"
                          >
                            <Camera className="w-3 h-3" />
                            <span>Foto Campo</span>
                          </button>
                        )}

                        {/* Ação 3: Comissionar se INSTALADO_CAMPO */}
                        {tag.status === 'INSTALADO_CAMPO' && (
                          <button
                            onClick={() => comissionarTag(tag.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition flex items-center gap-1 active:scale-95"
                            title="Aprovar e Comissionar Instrumento"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Comissionar</span>
                          </button>
                        )}

                        {/* Botão Ver Detalhes */}
                        <button
                          onClick={() => setSelectedTagForDetail(tag)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
                          title="Ver ficha técnica e metadados"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Botão QR Code */}
                        <button
                          onClick={() => setSelectedTagForQr(tag)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition"
                          title="Gerar etiqueta industrial de identificação"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Upload de Foto de Instalação em Campo */}
      {selectedTagForPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Camera className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Registro Fotográfico em Campo
                  </h3>
                  <p className="text-[11px] font-mono text-blue-600">TAG: {selectedTagForPhoto.tag}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTagForPhoto(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <p className="font-semibold text-slate-800">{selectedTagForPhoto.descricao}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Subsistema: {selectedTagForPhoto.subsistema}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Foto do Instrumento Montado no Suporte/Linha
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Cole a URL da foto ou use a câmera..."
                    value={photoInputUrl}
                    onChange={(e) => setPhotoInputUrl(e.target.value)}
                    className="flex-1 text-xs border border-slate-200 rounded-xl px-3 py-2 font-mono"
                  />
                  <button
                    onClick={() => setPhotoInputUrl('https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80')}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
                  >
                    Exemplo
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Localização / Referência Física em Campo
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="ex: Plataforma 12m - Flange de Entrada Moagem Z3"
                    value={photoLocalizacao}
                    onChange={(e) => setPhotoLocalizacao(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-xl pl-9 pr-3 py-2"
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 text-[11px] text-blue-800 space-y-1">
                <p>📍 <strong>Metadados Gravados:</strong></p>
                <p>• Responsável: {activeUser.nome} ({activeUser.cargo})</p>
                <p>• Data e Hora: {new Date().toLocaleString('pt-BR')}</p>
                <p>• GPS: -14.2483, -56.2531 (Canteiro Nobres MT)</p>
                <p>• Impacto: Avança a conclusão física do subsistema na Curva S.</p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedTagForPhoto(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSalvarFotoInstalacao}
                  className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm"
                >
                  Confirmar Instalação
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Ficha Técnica e Detalhes da TAG */}
      {selectedTagForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-base text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                  {selectedTagForDetail.tag}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{selectedTagForDetail.descricao}</h3>
                  <p className="text-[10px] text-slate-400">{selectedTagForDetail.subsistema}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTagForDetail(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4">
              
              {/* Status e Custódia */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Status Atual</p>
                  <div className="mt-1">{renderStatusBadge(selectedTagForDetail.status)}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Custódia Fiscal</p>
                  <p className="text-xs font-bold text-slate-800 mt-1">
                    {selectedTagForDetail.custodia === 'CONTRATANTE' ? 'Fornecido pela Contratante' : 'Adquirido pela Montadora'}
                  </p>
                </div>
              </div>

              {/* Registro Fotográfico Duplo */}
              <div>
                <p className="text-xs font-bold text-slate-800 mb-2">Auditoria Fotográfica Dupla</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-slate-200 rounded-xl p-2 text-center bg-slate-50">
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">1. Estoque / Recebimento</p>
                    {selectedTagForDetail.fotoEstoqueUrl ? (
                      <img
                        src={selectedTagForDetail.fotoEstoqueUrl}
                        alt="Foto Estoque"
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                    ) : (
                      <div className="w-full h-32 bg-slate-200 rounded-lg flex items-center justify-center text-xs text-slate-400">
                        Sem foto no estoque
                      </div>
                    )}
                    <p className="text-[9px] text-slate-400 mt-1">Recebido em: {selectedTagForDetail.dataRecebimento}</p>
                  </div>

                  <div className="border border-slate-200 rounded-xl p-2 text-center bg-slate-50">
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">2. Instalação em Campo</p>
                    {selectedTagForDetail.fotoInstalacaoUrl ? (
                      <img
                        src={selectedTagForDetail.fotoInstalacaoUrl}
                        alt="Foto Instalação"
                        className="w-full h-32 object-cover rounded-lg border border-emerald-400"
                      />
                    ) : (
                      <div className="w-full h-32 bg-amber-50/50 border border-dashed border-amber-300 rounded-lg flex flex-col items-center justify-center text-xs text-amber-700 p-2">
                        <Camera className="w-5 h-5 mb-1" />
                        <span>Pendente em Campo</span>
                      </div>
                    )}
                    <p className="text-[9px] text-slate-400 mt-1">
                      {selectedTagForDetail.dataInstalacao || 'Aguardando montagem'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dados Técnicos dos Diagramas de Engenharia */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <p className="font-bold text-slate-800">Especificações do Projeto (Diagrama ATMC/Votorantim)</p>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div>
                    <span className="text-slate-400">Painel / Gaveta:</span>
                    <p className="font-mono font-medium text-slate-800">{selectedTagForDetail.painelGaveta || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Fabricante / Modelo:</span>
                    <p className="font-medium text-slate-800">{selectedTagForDetail.fabricante || 'Conforme projeto'} {selectedTagForDetail.modelo || ''}</p>
                  </div>
                  {selectedTagForDetail.tensaoPotencia && (
                    <div>
                      <span className="text-slate-400">Tensão / Potência:</span>
                      <p className="font-mono text-slate-800">{selectedTagForDetail.tensaoPotencia}</p>
                    </div>
                  )}
                  {selectedTagForDetail.cabosBornes && (
                    <div>
                      <span className="text-slate-400">Cabos e Bornes:</span>
                      <p className="font-mono text-slate-800">{selectedTagForDetail.cabosBornes}</p>
                    </div>
                  )}
                </div>
                {selectedTagForDetail.observacoes && (
                  <p className="text-[11px] text-slate-600 pt-1 border-t border-slate-200 mt-1">
                    <strong>Notas de Engenharia:</strong> {selectedTagForDetail.observacoes}
                  </p>
                )}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setSelectedTagForDetail(null)}
                  className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
                >
                  Fechar Ficha
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Gerador de Etiqueta Industrial com QR Code */}
      {selectedTagForQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Etiqueta de Identificação Industrial
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Pronta para impressão térmica e fixação na carcaça do equipamento
            </p>

            {/* Simulação da Etiqueta Térmica */}
            <div className="bg-white border-2 border-black p-4 rounded-lg shadow-inner text-left font-mono text-black space-y-2">
              <div className="border-b border-black pb-1 flex justify-between items-center text-[10px]">
                <strong className="tracking-widest">SITESTOCK</strong>
                <span>{activeObra.codigo}</span>
              </div>
              <div className="flex items-center justify-between gap-3 pt-1">
                <div>
                  <p className="text-xl font-black">{selectedTagForQr.tag}</p>
                  <p className="text-[9px] uppercase line-clamp-1">{selectedTagForQr.descricao}</p>
                  <p className="text-[8px] text-slate-600">{selectedTagForQr.subsistema}</p>
                  <p className="text-[8px] font-bold mt-1">
                    CUSTÓDIA: {selectedTagForQr.custodia}
                  </p>
                </div>
                {/* QR Code SVG Visual */}
                <div className="w-16 h-16 bg-black p-1 rounded shrink-0 flex items-center justify-center">
                  <div className="w-14 h-14 bg-white p-1 grid grid-cols-4 gap-0.5">
                    <div className="bg-black col-span-2 row-span-2"></div>
                    <div className="bg-black"></div>
                    <div className="bg-black"></div>
                    <div className="bg-black"></div>
                    <div className="bg-black"></div>
                    <div className="bg-black col-span-2 row-span-2"></div>
                    <div className="bg-black"></div>
                    <div className="bg-black"></div>
                  </div>
                </div>
              </div>
              <div className="border-t border-black pt-1 text-[8px] text-center text-slate-500">
                LIGAÇÃO CONFORME PROJETO NB.I.Z3001.505
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setSelectedTagForQr(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Fechar
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Cadastrar Nova TAG */}
      {isNewTagModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Cadastrar Nova TAG de Projeto</h3>
              <button onClick={() => setIsNewTagModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCriarTag} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Código da TAG (ISA) *</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Z3M04M1"
                    value={newTagForm.tag}
                    onChange={(e) => setNewTagForm({ ...newTagForm, tag: e.target.value.toUpperCase() })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 font-mono font-bold text-blue-700 uppercase"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tipo de Equipamento</label>
                  <input
                    type="text"
                    placeholder="ex: Motor, Transmissor, Válvula"
                    value={newTagForm.tipo}
                    onChange={(e) => setNewTagForm({ ...newTagForm, tipo: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Descrição Funcional *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Motor do Giro Lento do Moinho de Bolas"
                  value={newTagForm.descricao}
                  onChange={(e) => setNewTagForm({ ...newTagForm, descricao: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subsistema / Área</label>
                  <select
                    value={newTagForm.subsistema}
                    onChange={(e) => setNewTagForm({ ...newTagForm, subsistema: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-white"
                  >
                    {activeObra.subsistemas.map((sub, i) => (
                      <option key={i} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Custódia Fiscal *</label>
                  <select
                    value={newTagForm.custodia}
                    onChange={(e) => setNewTagForm({ ...newTagForm, custodia: e.target.value as CustodiaType })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-white font-semibold text-slate-800"
                  >
                    <option value="CONTRATANTE">Contratante (Cliente)</option>
                    <option value="MONTADORA">Montadora (Compra Própria)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Painel / Gaveta CCM</label>
                  <input
                    type="text"
                    placeholder="ex: CCM Z3-CCM01 / Gaveta 2G"
                    value={newTagForm.painelGaveta}
                    onChange={(e) => setNewTagForm({ ...newTagForm, painelGaveta: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Fabricante & Modelo</label>
                  <input
                    type="text"
                    placeholder="ex: WEG W22 / Fluke"
                    value={newTagForm.fabricante}
                    onChange={(e) => setNewTagForm({ ...newTagForm, fabricante: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">URL da Foto de Recebimento no Pátio (Opcional)</label>
                <input
                  type="text"
                  placeholder="Cole URL da foto do palete / etiqueta..."
                  value={newTagForm.fotoEstoqueUrl || ''}
                  onChange={(e) => setNewTagForm({ ...newTagForm, fotoEstoqueUrl: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 font-mono text-[11px]"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsNewTagModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm"
                >
                  Salvar TAG
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: Importação em Lote CSV/JSON */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-900 mb-2">Importar TAGs de Outro Projeto</h3>
            <p className="text-xs text-slate-500 mb-4">
              Cole abaixo uma lista de TAGs ou carregue um arquivo CSV para a obra <strong className="text-slate-700">{activeObra.nome}</strong>.
            </p>

            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <p className="font-semibold text-slate-700 mb-1">Formato suportado (Linha por linha):</p>
                <code className="text-[10px] text-blue-700 block font-mono bg-white p-2 rounded border border-slate-200">
                  TAG, Descrição, Subsistema, Custodia(CONTRATANTE/MONTADORA)<br />
                  Z3P81_PSL, Pressostato Filtro Z3, Filtro de Mangas, CONTRATANTE<br />
                  Z3S07M1, Bomba de Graxa Separador, Moagem Z3, MONTADORA
                </code>
              </div>

              <button
                onClick={() => {
                  const exemploTags: Partial<TagItem>[] = [
                    { tag: 'Z3P81_PSL', descricao: 'Pressostato Filtro Z3P81', subsistema: 'Filtro de Mangas Secundário Z3P71', custodia: 'CONTRATANTE' },
                    { tag: 'Z3S07M1', descricao: 'Bomba de Graxa do Separador', subsistema: 'Moagem Z3 - Moinho de Bolas', custodia: 'MONTADORA' },
                    { tag: 'Z3M03R1', descricao: 'Resistência Aquecimento Motor', subsistema: 'Moagem Z3 - Moinho de Bolas', custodia: 'CONTRATANTE' },
                  ];
                  importarTagsEmLote(exemploTags);
                  setIsImportModalOpen(false);
                }}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                Carregar Lote de Demonstração (3 TAGs)
              </button>

              <button
                onClick={() => setIsImportModalOpen(false)}
                className="w-full py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
