import { Obra, TagItem, NotaFiscal, Ferramenta, CautelaFerramenta, AtividadeRecente, SyncQueueItem } from '../types';
import { INITIAL_OBRAS, INITIAL_TAGS, INITIAL_NFS, INITIAL_FERRAMENTAS, INITIAL_CAUTELAS, INITIAL_ATIVIDADES } from '../data/seedData';

const STORAGE_KEYS = {
  OBRAS: 'sitestock_obras',
  TAGS: 'sitestock_tags',
  NFS: 'sitestock_nfs',
  FERRAMENTAS: 'sitestock_ferramentas',
  CAUTELAS: 'sitestock_cautelas',
  ATIVIDADES: 'sitestock_atividades',
  SYNC_QUEUE: 'sitestock_sync_queue',
  ACTIVE_OBRA_ID: 'sitestock_active_obra_id',
  ACTIVE_ROLE: 'sitestock_active_role',
};

export const StorageService = {
  getObras(): Obra[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.OBRAS);
      return data ? JSON.parse(data) : INITIAL_OBRAS;
    } catch {
      return INITIAL_OBRAS;
    }
  },

  saveObras(obras: Obra[]): void {
    localStorage.setItem(STORAGE_KEYS.OBRAS, JSON.stringify(obras));
  },

  getTags(): TagItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TAGS);
      return data ? JSON.parse(data) : INITIAL_TAGS;
    } catch {
      return INITIAL_TAGS;
    }
  },

  saveTags(tags: TagItem[]): void {
    localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(tags));
  },

  getNfs(): NotaFiscal[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NFS);
      return data ? JSON.parse(data) : INITIAL_NFS;
    } catch {
      return INITIAL_NFS;
    }
  },

  saveNfs(nfs: NotaFiscal[]): void {
    localStorage.setItem(STORAGE_KEYS.NFS, JSON.stringify(nfs));
  },

  getFerramentas(): Ferramenta[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FERRAMENTAS);
      return data ? JSON.parse(data) : INITIAL_FERRAMENTAS;
    } catch {
      return INITIAL_FERRAMENTAS;
    }
  },

  saveFerramentas(ferramentas: Ferramenta[]): void {
    localStorage.setItem(STORAGE_KEYS.FERRAMENTAS, JSON.stringify(ferramentas));
  },

  getCautelas(): CautelaFerramenta[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CAUTELAS);
      return data ? JSON.parse(data) : INITIAL_CAUTELAS;
    } catch {
      return INITIAL_CAUTELAS;
    }
  },

  saveCautelas(cautelas: CautelaFerramenta[]): void {
    localStorage.setItem(STORAGE_KEYS.CAUTELAS, JSON.stringify(cautelas));
  },

  getAtividades(): AtividadeRecente[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ATIVIDADES);
      return data ? JSON.parse(data) : INITIAL_ATIVIDADES;
    } catch {
      return INITIAL_ATIVIDADES;
    }
  },

  saveAtividades(atividades: AtividadeRecente[]): void {
    localStorage.setItem(STORAGE_KEYS.ATIVIDADES, JSON.stringify(atividades));
  },

  getSyncQueue(): SyncQueueItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveSyncQueue(queue: SyncQueueItem[]): void {
    localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(queue));
  },

  addToSyncQueue(item: Omit<SyncQueueItem, 'id' | 'timestamp' | 'synced'>): void {
    const queue = this.getSyncQueue();
    const newItem: SyncQueueItem = {
      ...item,
      id: 'sync-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      timestamp: new Date().toISOString(),
      synced: false,
    };
    queue.push(newItem);
    this.saveSyncQueue(queue);
  },

  clearSyncQueue(): void {
    this.saveSyncQueue([]);
  },

  getActiveObraId(): string {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_OBRA_ID) || 'obra-z3-nobres';
  },

  saveActiveObraId(id: string): void {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_OBRA_ID, id);
  },

  getActiveRole(): string {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_ROLE) || 'ADMIN';
  },

  saveActiveRole(role: string): void {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, role);
  },

  resetAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.OBRAS);
    localStorage.removeItem(STORAGE_KEYS.TAGS);
    localStorage.removeItem(STORAGE_KEYS.NFS);
    localStorage.removeItem(STORAGE_KEYS.FERRAMENTAS);
    localStorage.removeItem(STORAGE_KEYS.CAUTELAS);
    localStorage.removeItem(STORAGE_KEYS.ATIVIDADES);
    localStorage.removeItem(STORAGE_KEYS.SYNC_QUEUE);
  },

  exportFullBackup(): string {
    const backup = {
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
      obras: this.getObras(),
      tags: this.getTags(),
      nfs: this.getNfs(),
      ferramentas: this.getFerramentas(),
      cautelas: this.getCautelas(),
      atividades: this.getAtividades(),
    };
    return JSON.stringify(backup, null, 2);
  },
};
