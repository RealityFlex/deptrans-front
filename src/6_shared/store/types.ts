import type { BaseDto } from '@/6_shared/api/types';

export type LoadingKeys = 'list' | 'item' | 'create' | 'update' | 'delete' | 'listMe' | 'itemMe';

export interface LoadingState {
  list: boolean;
  item: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

export interface SortProperty {
  name: string;
  value: boolean;
  title: string;
}

export interface CrudStore<T extends BaseDto> {
  items: T[];
  item: T | null;
  cursor: any | null;
  loading: LoadingState;
  fetchList(cursorValue?: any): Promise<void>;
  fetchItem(id: number): Promise<void>;
  createItem(payload: any): Promise<void>;
  updateItem(id: number, payload: any): Promise<void>;
  deleteItem(id: number): Promise<void>;
  resetList(): void;
  resetItem(): void;
  uploadFiles(files: File[], datasetName: string, version: string, callback?: () => void): Promise<void>;
  getDocument(payload: any): Promise<void>;
}