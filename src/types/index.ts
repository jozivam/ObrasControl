export type UserRole =
  | 'ADMIN'                 // Gerente Geral
  | 'GESTOR_CAMPO'          // Gestor de Campo
  | 'GESTOR_ALMOXARIFADO'   // Gestor de Almoxarifado
  | 'SUPERVISOR_CAMPO'      // Supervisor de Campo
  | 'ALMOXARIFE';           // Almoxarife

export interface UserProfile {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  role: UserRole;
  avatarUrl?: string;
}

export type CustodiaType = 'CONTRATANTE' | 'MONTADORA';

export type TagStatus =
  | 'NO_ESTOQUE'        // Recebido no pátio / almoxarifado
  | 'EM_MONTAGEM'       // Baixado para frente de montagem
  | 'INSTALADO_CAMPO'   // Fixado mecanicamente / eletricamente com foto
  | 'COMISSIONADO';     // Testado e comissionado com foto validada

export interface TagItem {
  id: string;
  obraId: string;
  tag: string;                    // ex: Z3M03M1, Z3P71_PT1, A1A01LT
  tipo: string;                   // ex: Motor de Indução, Transmissor de Pressão, Vigia de Velocidade
  descricao: string;
  subsistema: string;             // ex: Moagem Z3, Eletrocentro Z3SE1, Silos de Aditivos, Filtro de Mangas
  painelGaveta: string;           // ex: Z3-CCM01 / Gaveta 3A1, Painel Z3RM05
  custodia: CustodiaType;         // Fornecido pela Contratante vs Comprado pela Montadora
  nfNumero?: string;
  nfId?: string;
  status: TagStatus;
  dataRecebimento: string;
  fotoEstoqueUrl?: string;
  dataInstalacao?: string;
  fotoInstalacaoUrl?: string;
  instaladoPor?: string;
  geolocalizacao?: {
    lat: number;
    lng: number;
    localDescricao: string;
  };
  comissionadoPor?: string;
  dataComissionamento?: string;
  observacoes?: string;
  fabricante?: string;
  modelo?: string;
  tensaoPotencia?: string;
  cabosBornes?: string;
}

export interface NotaFiscal {
  id: string;
  obraId: string;
  numero: string;
  serie: string;
  fornecedor: string;
  cnpjFornecedor: string;
  dataEmissao: string;
  dataRecebimento: string;
  valorTotal: number;
  tipoCustodia: CustodiaType;
  chaveAcesso: string;
  anexoDocumentoNome?: string;
  fotoCargaPatioUrl?: string;
  recebidoPor: string;
  itensQtd: number;
  statusConferencia: 'RECEBIDO_PENDENTE' | 'CONFERIDO_APROVADO' | 'DIVERGENCIA';
  tagsVinculadas: string[]; // Lista de códigos de TAG
  observacoes?: string;
}

export interface Ferramenta {
  id: string;
  obraId: string;
  codigo: string;          // ex: FER-EL-001, FER-MC-042
  nome: string;
  categoria: 'Teste Elétrico' | 'Mecânica' | 'Solda' | 'Içamento' | 'Instrumentação';
  marcaModelo: string;
  numeroSerie: string;
  status: 'DISPONIVEL' | 'CAUTELADA' | 'MANUTENCAO';
  cautelaAtualId?: string;
  responsavelAtual?: string;
  frenteAtual?: string;
  dataPrevistaDevolucao?: string;
  localizacaoPadrao: string;
  validadeCalibracao?: string;
  fotoUrl?: string;
}

export interface CautelaFerramenta {
  id: string;
  obraId: string;
  ferramentaId: string;
  ferramentaNome: string;
  ferramentaCodigo: string;
  solicitanteNome: string;
  solicitanteMatricula: string;
  frenteServico: string;
  dataRetirada: string;
  dataPrevistaDevolucao: string;
  dataDevolucao?: string;
  status: 'ABERTA' | 'DEVOLVIDA' | 'ATRASADA';
  liberadoPor: string;
  fotoSaidaUrl?: string;
  fotoDevolucaoUrl?: string;
  observacoes?: string;
  checklistSaidaOk: boolean;
  checklistRetornoOk?: boolean;
}

export interface Obra {
  id: string;
  nome: string;
  codigo: string;
  cliente: string;
  localizacao: string;
  contrato: string;
  dataInicio: string;
  dataPrevisaoTermino: string;
  status: 'EM_ANDAMENTO' | 'PLANEJAMENTO' | 'CONCLUIDA';
  subsistemas: string[];
  responsavelEngenheiro: string;
}

export interface AtividadeRecente {
  id: string;
  obraId: string;
  tipo:
    | 'TAG_BAIXA'
    | 'TAG_INSTALADA'
    | 'TAG_COMISSIONADA'
    | 'NF_ENTRADA'
    | 'FERRAMENTA_CAUTELA'
    | 'FERRAMENTA_DEVOLUCAO'
    | 'OBRA_CRIADA';
  titulo: string;
  descricao: string;
  usuario: string;
  perfil: UserRole;
  timestamp: string;
  tag?: string;
  fotoUrl?: string;
}

export interface SyncQueueItem {
  id: string;
  tipo: 'TAG' | 'NF' | 'FERRAMENTA' | 'CAUTELA' | 'OBRA' | 'ATIVIDADE';
  acao: 'CREATE' | 'UPDATE' | 'DELETE';
  payload: any;
  timestamp: string;
  synced: boolean;
}
