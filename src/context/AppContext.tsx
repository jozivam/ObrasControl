import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Obra,
  TagItem,
  NotaFiscal,
  Ferramenta,
  CautelaFerramenta,
  AtividadeRecente,
  UserProfile,
  UserRole,
} from '../types';
import { INITIAL_USERS } from '../data/seedData';
import { StorageService } from '../services/storageService';

interface AppContextType {
  obras: Obra[];
  activeObra: Obra;
  setActiveObraId: (id: string) => void;
  addObra: (novaObra: Omit<Obra, 'id'>) => Obra;
  users: UserProfile[];
  activeUser: UserProfile;
  setActiveRole: (role: UserRole) => void;
  
  tags: TagItem[];
  filteredTags: TagItem[];
  nfs: NotaFiscal[];
  filteredNfs: NotaFiscal[];
  ferramentas: Ferramenta[];
  filteredFerramentas: Ferramenta[];
  cautelas: CautelaFerramenta[];
  filteredCautelas: CautelaFerramenta[];
  atividades: AtividadeRecente[];
  filteredAtividades: AtividadeRecente[];

  // Operações de TAG
  darBaixaTag: (tagId: string, observacao?: string) => void;
  registrarFotoInstalacao: (tagId: string, fotoUrl: string, localizacao?: string) => void;
  comissionarTag: (tagId: string, observacao?: string) => void;
  cadastrarTag: (tagData: Partial<TagItem>) => void;
  importarTagsEmLote: (novasTags: Partial<TagItem>[]) => number;

  // Operações de NF
  cadastrarNotaFiscal: (nfData: Omit<NotaFiscal, 'id' | 'obraId' | 'recebidoPor'>) => void;

  // Operações de Ferramentas / Cautela
  cadastrarFerramenta: (ferramentaData: Omit<Ferramenta, 'id' | 'obraId' | 'status'>) => void;
  criarCautela: (cautelaData: {
    ferramentaId: string;
    solicitanteNome: string;
    solicitanteMatricula: string;
    frenteServico: string;
    dataPrevistaDevolucao: string;
    fotoSaidaUrl?: string;
    observacoes?: string;
  }) => void;
  devolverCautela: (cautelaId: string, condicaoRetorno: string, fotoDevolucaoUrl?: string) => void;

  // Offline e Sincronização
  isOnline: boolean;
  isSimulatedOffline: boolean;
  toggleSimulatedOffline: () => void;
  pendingSyncCount: number;
  isSyncing: boolean;
  sincronizarAgora: () => Promise<void>;

  // Navegação
  currentTab: string;
  setCurrentTab: (tab: string) => void;

  // Modais Globais
  isScannerOpen: boolean;
  openScanner: (callback?: (tagCode: string) => void) => void;
  closeScanner: () => void;
  scannerCallback: ((tagCode: string) => void) | null;
  isNovaObraModalOpen: boolean;
  setIsNovaObraModalOpen: (open: boolean) => void;

  resetarDados: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [obras, setObras] = useState<Obra[]>(() => StorageService.getObras());
  const [activeObraId, setActiveObraIdState] = useState<string>(() => StorageService.getActiveObraId());
  
  const [activeRole, setActiveRoleState] = useState<UserRole>(() => {
    return (StorageService.getActiveRole() as UserRole) || 'ADMIN';
  });
  
  const [tags, setTags] = useState<TagItem[]>(() => StorageService.getTags());
  const [nfs, setNfs] = useState<NotaFiscal[]>(() => StorageService.getNfs());
  const [ferramentas, setFerramentas] = useState<Ferramenta[]>(() => StorageService.getFerramentas());
  const [cautelas, setCautelas] = useState<CautelaFerramenta[]>(() => StorageService.getCautelas());
  const [atividades, setAtividades] = useState<AtividadeRecente[]>(() => StorageService.getAtividades());

  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [scannerCallback, setScannerCallback] = useState<((tagCode: string) => void) | null>(null);
  const [isNovaObraModalOpen, setIsNovaObraModalOpen] = useState<boolean>(false);

  // Status de rede
  const [networkOnline, setNetworkOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(() => StorageService.getSyncQueue().length);

  useEffect(() => {
    const handleOnline = () => setNetworkOnline(true);
    const handleOffline = () => setNetworkOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const isOnline = networkOnline && !isSimulatedOffline;

  const toggleSimulatedOffline = () => {
    setIsSimulatedOffline((prev) => !prev);
  };

  const activeObra = useMemo(() => {
    const found = obras.find((o) => o.id === activeObraId);
    return found || obras[0];
  }, [obras, activeObraId]);

  const activeUser = useMemo(() => {
    return INITIAL_USERS.find((u) => u.role === activeRole) || INITIAL_USERS[0];
  }, [activeRole]);

  const setActiveObraId = (id: string) => {
    setActiveObraIdState(id);
    StorageService.saveActiveObraId(id);
  };

  const setActiveRole = (role: UserRole) => {
    setActiveRoleState(role);
    StorageService.saveActiveRole(role);
  };

  // Filtragem por obra ativa
  const filteredTags = useMemo(() => tags.filter((t) => t.obraId === activeObra.id), [tags, activeObra.id]);
  const filteredNfs = useMemo(() => nfs.filter((n) => n.obraId === activeObra.id), [nfs, activeObra.id]);
  const filteredFerramentas = useMemo(() => ferramentas.filter((f) => f.obraId === activeObra.id), [ferramentas, activeObra.id]);
  const filteredCautelas = useMemo(() => cautelas.filter((c) => c.obraId === activeObra.id), [cautelas, activeObra.id]);
  const filteredAtividades = useMemo(() => atividades.filter((a) => a.obraId === activeObra.id), [atividades, activeObra.id]);

  // Função auxiliar de auditoria / atividade
  const registrarAtividade = (
    tipo: AtividadeRecente['tipo'],
    titulo: string,
    descricao: string,
    tag?: string,
    fotoUrl?: string
  ) => {
    const novaAtividade: AtividadeRecente = {
      id: 'act-' + Date.now(),
      obraId: activeObra.id,
      tipo,
      titulo,
      descricao,
      usuario: activeUser.nome,
      perfil: activeUser.role,
      timestamp: 'Agora mesmo',
      tag,
      fotoUrl,
    };
    const updated = [novaAtividade, ...atividades];
    setAtividades(updated);
    StorageService.saveAtividades(updated);
    StorageService.addToSyncQueue({ tipo: 'ATIVIDADE', acao: 'CREATE', payload: novaAtividade });
    setPendingSyncCount(StorageService.getSyncQueue().length);
  };

  // 1. Baixa de TAG para campo
  const darBaixaTag = (tagId: string, observacao?: string) => {
    const updated = tags.map((t) => {
      if (t.id === tagId) {
        return {
          ...t,
          status: 'EM_MONTAGEM' as const,
          observacoes: observacao ? `${t.observacoes || ''} [Baixa: ${observacao}]` : t.observacoes,
        };
      }
      return t;
    });
    setTags(updated);
    StorageService.saveTags(updated);

    const tagItem = tags.find((t) => t.id === tagId);
    if (tagItem) {
      registrarAtividade(
        'TAG_BAIXA',
        `TAG ${tagItem.tag} Baixada para Campo`,
        `Instrumento ${tagItem.descricao} liberado do almoxarifado para montagem no ${tagItem.subsistema}.`,
        tagItem.tag
      );
      StorageService.addToSyncQueue({ tipo: 'TAG', acao: 'UPDATE', payload: { id: tagId, status: 'EM_MONTAGEM' } });
      setPendingSyncCount(StorageService.getSyncQueue().length);
    }
  };

  // 2. Registro de Foto de Instalação em Campo
  const registrarFotoInstalacao = (tagId: string, fotoUrl: string, localizacao?: string) => {
    const agora = new Date().toLocaleString('pt-BR');
    const updated = tags.map((t) => {
      if (t.id === tagId) {
        return {
          ...t,
          status: 'INSTALADO_CAMPO' as const,
          fotoInstalacaoUrl: fotoUrl,
          dataInstalacao: agora,
          instaladoPor: `${activeUser.nome} (${activeUser.cargo})`,
          geolocalizacao: {
            lat: -14.2483 + (Math.random() - 0.5) * 0.005,
            lng: -56.2531 + (Math.random() - 0.5) * 0.005,
            localDescricao: localizacao || `${t.subsistema} - Posição de Montagem`,
          },
        };
      }
      return t;
    });
    setTags(updated);
    StorageService.saveTags(updated);

    const tagItem = tags.find((t) => t.id === tagId);
    if (tagItem) {
      registrarAtividade(
        'TAG_INSTALADA',
        `Foto de Instalação: ${tagItem.tag}`,
        `Instrumento fixado na estrutura. Evidência fotográfica registrada por ${activeUser.nome}.`,
        tagItem.tag,
        fotoUrl
      );
      StorageService.addToSyncQueue({ tipo: 'TAG', acao: 'UPDATE', payload: { id: tagId, status: 'INSTALADO_CAMPO', fotoUrl } });
      setPendingSyncCount(StorageService.getSyncQueue().length);
    }
  };

  // 3. Comissionamento de TAG
  const comissionarTag = (tagId: string, observacao?: string) => {
    const agora = new Date().toLocaleString('pt-BR');
    const updated = tags.map((t) => {
      if (t.id === tagId) {
        return {
          ...t,
          status: 'COMISSIONADO' as const,
          comissionadoPor: `${activeUser.nome} (${activeUser.cargo})`,
          dataComissionamento: agora,
          observacoes: observacao ? `${t.observacoes || ''} [Comissionamento: ${observacao}]` : t.observacoes,
        };
      }
      return t;
    });
    setTags(updated);
    StorageService.saveTags(updated);

    const tagItem = tags.find((t) => t.id === tagId);
    if (tagItem) {
      registrarAtividade(
        'TAG_COMISSIONADA',
        `TAG ${tagItem.tag} Comissionada`,
        `Testes de malha e energização concluídos com sucesso no ${tagItem.subsistema}.`,
        tagItem.tag
      );
      StorageService.addToSyncQueue({ tipo: 'TAG', acao: 'UPDATE', payload: { id: tagId, status: 'COMISSIONADO' } });
      setPendingSyncCount(StorageService.getSyncQueue().length);
    }
  };

  // 4. Cadastrar nova TAG individual
  const cadastrarTag = (tagData: Partial<TagItem>) => {
    const novaTag: TagItem = {
      id: 'tag-' + Date.now(),
      obraId: activeObra.id,
      tag: (tagData.tag || 'TAG-NOVA').toUpperCase().trim(),
      tipo: tagData.tipo || 'Instrumento Geral',
      descricao: tagData.descricao || 'Item sem descrição',
      subsistema: tagData.subsistema || activeObra.subsistemas[0] || 'Área Geral',
      painelGaveta: tagData.painelGaveta || 'A Definir',
      custodia: tagData.custodia || 'CONTRATANTE',
      status: tagData.status || 'NO_ESTOQUE',
      dataRecebimento: new Date().toISOString().split('T')[0],
      observacoes: tagData.observacoes,
      fabricante: tagData.fabricante,
      modelo: tagData.modelo,
      tensaoPotencia: tagData.tensaoPotencia,
      cabosBornes: tagData.cabosBornes,
      fotoEstoqueUrl: tagData.fotoEstoqueUrl,
    };

    const updated = [novaTag, ...tags];
    setTags(updated);
    StorageService.saveTags(updated);
    registrarAtividade('TAG_BAIXA', `Nova TAG Cadastrada: ${novaTag.tag}`, `Item cadastrado no subsistema ${novaTag.subsistema}.`, novaTag.tag);
    StorageService.addToSyncQueue({ tipo: 'TAG', acao: 'CREATE', payload: novaTag });
    setPendingSyncCount(StorageService.getSyncQueue().length);
  };

  // 5. Importação de TAGs em Lote (CSV/JSON de novos projetos)
  const importarTagsEmLote = (novasTagsData: Partial<TagItem>[]): number => {
    let count = 0;
    const itemsParaAdicionar: TagItem[] = [];

    novasTagsData.forEach((t) => {
      if (!t.tag) return;
      itemsParaAdicionar.push({
        id: 'tag-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
        obraId: activeObra.id,
        tag: t.tag.toUpperCase().trim(),
        tipo: t.tipo || 'Instrumento Industrial',
        descricao: t.descricao || 'Item importado do projeto',
        subsistema: t.subsistema || activeObra.subsistemas[0] || 'Geral',
        painelGaveta: t.painelGaveta || 'N/A',
        custodia: t.custodia || 'CONTRATANTE',
        status: t.status || 'NO_ESTOQUE',
        dataRecebimento: new Date().toISOString().split('T')[0],
        observacoes: t.observacoes,
        fabricante: t.fabricante,
        modelo: t.modelo,
      });
      count++;
    });

    if (itemsParaAdicionar.length > 0) {
      const updated = [...itemsParaAdicionar, ...tags];
      setTags(updated);
      StorageService.saveTags(updated);
      registrarAtividade(
        'TAG_BAIXA',
        `Importação de ${count} TAGs`,
        `${count} novos instrumentos incorporados à obra ${activeObra.nome}.`
      );
    }
    return count;
  };

  // 6. Cadastrar Nota Fiscal
  const cadastrarNotaFiscal = (nfData: Omit<NotaFiscal, 'id' | 'obraId' | 'recebidoPor'>) => {
    const novaNf: NotaFiscal = {
      ...nfData,
      id: 'nf-' + Date.now(),
      obraId: activeObra.id,
      recebidoPor: `${activeUser.nome} (${activeUser.cargo})`,
    };

    const updated = [novaNf, ...nfs];
    setNfs(updated);
    StorageService.saveNfs(updated);
    registrarAtividade(
      'NF_ENTRADA',
      `NF ${novaNf.numero} Recebida no Pátio`,
      `Fornecedor: ${novaNf.fornecedor} | Custódia: ${novaNf.tipoCustodia === 'CONTRATANTE' ? 'Contratante' : 'Montadora'} | R$ ${novaNf.valorTotal.toLocaleString('pt-BR')}`
    );
    StorageService.addToSyncQueue({ tipo: 'NF', acao: 'CREATE', payload: novaNf });
    setPendingSyncCount(StorageService.getSyncQueue().length);
  };

  // 7. Cadastrar Ferramenta
  const cadastrarFerramenta = (ferramentaData: Omit<Ferramenta, 'id' | 'obraId' | 'status'>) => {
    const novaFerramenta: Ferramenta = {
      ...ferramentaData,
      id: 'fer-' + Date.now(),
      obraId: activeObra.id,
      status: 'DISPONIVEL',
    };
    const updated = [novaFerramenta, ...ferramentas];
    setFerramentas(updated);
    StorageService.saveFerramentas(updated);
    StorageService.addToSyncQueue({ tipo: 'FERRAMENTA', acao: 'CREATE', payload: novaFerramenta });
    setPendingSyncCount(StorageService.getSyncQueue().length);
  };

  // 8. Cautelar Ferramenta
  const criarCautela = (cautelaData: {
    ferramentaId: string;
    solicitanteNome: string;
    solicitanteMatricula: string;
    frenteServico: string;
    dataPrevistaDevolucao: string;
    fotoSaidaUrl?: string;
    observacoes?: string;
  }) => {
    const ferramenta = ferramentas.find((f) => f.id === cautelaData.ferramentaId);
    if (!ferramenta) return;

    const novaCautelaId = 'caut-' + Date.now();
    const novaCautela: CautelaFerramenta = {
      id: novaCautelaId,
      obraId: activeObra.id,
      ferramentaId: ferramenta.id,
      ferramentaNome: ferramenta.nome,
      ferramentaCodigo: ferramenta.codigo,
      solicitanteNome: cautelaData.solicitanteNome,
      solicitanteMatricula: cautelaData.solicitanteMatricula,
      frenteServico: cautelaData.frenteServico,
      dataRetirada: new Date().toLocaleString('pt-BR'),
      dataPrevistaDevolucao: cautelaData.dataPrevistaDevolucao,
      status: 'ABERTA',
      liberadoPor: activeUser.nome,
      checklistSaidaOk: true,
      fotoSaidaUrl: cautelaData.fotoSaidaUrl,
      observacoes: cautelaData.observacoes,
    };

    const updatedCautelas = [novaCautela, ...cautelas];
    setCautelas(updatedCautelas);
    StorageService.saveCautelas(updatedCautelas);

    // Atualiza status da ferramenta para CAUTELADA
    const updatedFerramentas = ferramentas.map((f) => {
      if (f.id === ferramenta.id) {
        return {
          ...f,
          status: 'CAUTELADA' as const,
          cautelaAtualId: novaCautelaId,
          responsavelAtual: cautelaData.solicitanteNome,
          frenteAtual: cautelaData.frenteServico,
          dataPrevistaDevolucao: cautelaData.dataPrevistaDevolucao,
        };
      }
      return f;
    });
    setFerramentas(updatedFerramentas);
    StorageService.saveFerramentas(updatedFerramentas);

    registrarAtividade(
      'FERRAMENTA_CAUTELA',
      `Cautela: ${ferramenta.codigo}`,
      `${ferramenta.nome} entregue para ${cautelaData.solicitanteNome} (${cautelaData.frenteServico}). Devolução prevista: ${cautelaData.dataPrevistaDevolucao}.`
    );
    StorageService.addToSyncQueue({ tipo: 'CAUTELA', acao: 'CREATE', payload: novaCautela });
    setPendingSyncCount(StorageService.getSyncQueue().length);
  };

  // 9. Devolver Cautela
  const devolverCautela = (cautelaId: string, condicaoRetorno: string, fotoDevolucaoUrl?: string) => {
    const cautela = cautelas.find((c) => c.id === cautelaId);
    if (!cautela) return;

    const agora = new Date().toLocaleString('pt-BR');
    const updatedCautelas = cautelas.map((c) => {
      if (c.id === cautelaId) {
        return {
          ...c,
          status: 'DEVOLVIDA' as const,
          dataDevolucao: agora,
          checklistRetornoOk: true,
          condicaoRetorno,
          fotoDevolucaoUrl,
        };
      }
      return c;
    });
    setCautelas(updatedCautelas);
    StorageService.saveCautelas(updatedCautelas);

    // Libera a ferramenta
    const updatedFerramentas = ferramentas.map((f) => {
      if (f.id === cautela.ferramentaId) {
        return {
          ...f,
          status: 'DISPONIVEL' as const,
          cautelaAtualId: undefined,
          responsavelAtual: undefined,
          frenteAtual: undefined,
          dataPrevistaDevolucao: undefined,
        };
      }
      return f;
    });
    setFerramentas(updatedFerramentas);
    StorageService.saveFerramentas(updatedFerramentas);

    registrarAtividade(
      'FERRAMENTA_DEVOLUCAO',
      `Devolução: ${cautela.ferramentaCodigo}`,
      `${cautela.ferramentaNome} devolvida ao almoxarifado por ${cautela.solicitanteNome}. Condição: ${condicaoRetorno}.`
    );
    StorageService.addToSyncQueue({ tipo: 'CAUTELA', acao: 'UPDATE', payload: { id: cautelaId, status: 'DEVOLVIDA' } });
    setPendingSyncCount(StorageService.getSyncQueue().length);
  };

  // 10. Criar Nova Obra
  const addObra = (novaObraData: Omit<Obra, 'id'>): Obra => {
    const novaObra: Obra = {
      ...novaObraData,
      id: 'obra-' + Date.now(),
    };
    const updated = [...obras, novaObra];
    setObras(updated);
    StorageService.saveObras(updated);
    setActiveObraId(novaObra.id);

    registrarAtividade(
      'OBRA_CRIADA',
      `Nova Obra Cadastrada`,
      `Obra ${novaObra.nome} (${novaObra.cliente}) adicionada ao sistema.`
    );
    StorageService.addToSyncQueue({ tipo: 'OBRA', acao: 'CREATE', payload: novaObra });
    setPendingSyncCount(StorageService.getSyncQueue().length);
    return novaObra;
  };

  // 11. Sincronizar Fila com Servidor Online
  const sincronizarAgora = async () => {
    setIsSyncing(true);
    try {
      // Simula transmissão com tolerância a rede móvel
      await new Promise((res) => setTimeout(res, 1200));
      StorageService.clearSyncQueue();
      setPendingSyncCount(0);
    } finally {
      setIsSyncing(false);
    }
  };

  // 12. Scanner
  const openScanner = (callback?: (tagCode: string) => void) => {
    if (callback) {
      setScannerCallback(() => callback);
    } else {
      setScannerCallback(null);
    }
    setIsScannerOpen(true);
  };

  const closeScanner = () => {
    setIsScannerOpen(false);
    setScannerCallback(null);
  };

  // 13. Reset
  const resetarDados = () => {
    StorageService.resetAllData();
    window.location.reload();
  };

  return (
    <AppContext.Provider
      value={{
        obras,
        activeObra,
        setActiveObraId,
        addObra,
        users: INITIAL_USERS,
        activeUser,
        setActiveRole,
        tags,
        filteredTags,
        nfs,
        filteredNfs,
        ferramentas,
        filteredFerramentas,
        cautelas,
        filteredCautelas,
        atividades,
        filteredAtividades,
        darBaixaTag,
        registrarFotoInstalacao,
        comissionarTag,
        cadastrarTag,
        importarTagsEmLote,
        cadastrarNotaFiscal,
        cadastrarFerramenta,
        criarCautela,
        devolverCautela,
        isOnline,
        isSimulatedOffline,
        toggleSimulatedOffline,
        pendingSyncCount,
        isSyncing,
        sincronizarAgora,
        currentTab,
        setCurrentTab,
        isScannerOpen,
        openScanner,
        closeScanner,
        scannerCallback,
        isNovaObraModalOpen,
        setIsNovaObraModalOpen,
        resetarDados,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser utilizado dentro de um AppProvider');
  }
  return context;
};
