import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Building2, X, Plus, Check } from 'lucide-react';

export const NovaObraModal: React.FC = () => {
  const { isNovaObraModalOpen, setIsNovaObraModalOpen, addObra } = useApp();

  const [nome, setNome] = useState('');
  const [codigo, setCodigo] = useState('');
  const [cliente, setCliente] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [contrato, setContrato] = useState('');
  const [dataInicio, setDataInicio] = useState(new Date().toISOString().split('T')[0]);
  const [dataPrevisaoTermino, setDataPrevisaoTermino] = useState(
    new Date(Date.now() + 86400000 * 180).toISOString().split('T')[0]
  );
  const [responsavelEngenheiro, setResponsavelEngenheiro] = useState('');
  const [subsistemasStr, setSubsistemasStr] = useState(
    'Subestação Principal, Casa de Controle, CCM Central, Área de Processo'
  );

  if (!isNovaObraModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !cliente) return;

    const subsistemas = subsistemasStr
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    addObra({
      nome,
      codigo: codigo.toUpperCase().trim() || `OBR-${Date.now().toString().slice(-4)}`,
      cliente,
      localizacao,
      contrato: contrato || `CTR-${new Date().getFullYear()}/01`,
      dataInicio,
      dataPrevisaoTermino,
      status: 'EM_ANDAMENTO',
      responsavelEngenheiro: responsavelEngenheiro || 'Engenheiro Responsável',
      subsistemas: subsistemas.length > 0 ? subsistemas : ['Área Geral de Montagem'],
    });

    setIsNovaObraModalOpen(false);
    setNome('');
    setCodigo('');
    setCliente('');
    setLocalizacao('');
    setContrato('');
    setResponsavelEngenheiro('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Cadastrar Nova Obra / Projeto</h3>
              <p className="text-xs text-slate-500">Adicione um novo canteiro de montagem industrial</p>
            </div>
          </div>
          <button
            onClick={() => setIsNovaObraModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Nome do Projeto / Obra *</label>
            <input
              type="text"
              required
              placeholder="ex: Obra Nobres - Moagem Z3 ou Expansão Silos"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Código da Obra *</label>
              <input
                type="text"
                required
                placeholder="ex: VC-NOBRES-Z3"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 font-mono uppercase font-bold text-blue-700"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Cliente Contratante *</label>
              <input
                type="text"
                required
                placeholder="ex: Votorantim Cimentos / Vale"
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Localização (Cidade - UF)</label>
              <input
                type="text"
                placeholder="ex: Nobres - MT"
                value={localizacao}
                onChange={(e) => setLocalizacao(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nº do Contrato</label>
              <input
                type="text"
                placeholder="ex: CTR-2026/04"
                value={contrato}
                onChange={(e) => setContrato(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Data Início</label>
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Previsão Término</label>
              <input
                type="date"
                value={dataPrevisaoTermino}
                onChange={(e) => setDataPrevisaoTermino(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Engenheiro / Responsável Técnico</label>
            <input
              type="text"
              placeholder="ex: Eng. Carlos Andrade (CREA-MT 48.910)"
              value={responsavelEngenheiro}
              onChange={(e) => setResponsavelEngenheiro(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Subsistemas do Projeto (Separados por vírgula)
            </label>
            <textarea
              rows={2}
              placeholder="ex: Moagem Z3, Eletrocentro 01, Silos de Clínquer, Filtro de Mangas"
              value={subsistemasStr}
              onChange={(e) => setSubsistemasStr(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 font-medium"
            />
          </div>

          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-[11px] text-blue-800">
            ℹ️ Ao salvar, a nova obra ficará ativa imediatamente no cabeçalho e você poderá cadastrar ou importar sua própria lista de TAGs ISA e Notas Fiscais.
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsNovaObraModalOpen(false)}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm"
            >
              Criar Obra & Ativar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
