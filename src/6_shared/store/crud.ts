import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useToast } from '@/6_shared/ui/toast/use-toast';
import { StatusCodes } from 'http-status-codes';
import type { BaseDto } from '../api/types';
import type { LoadingKeys, LoadingState } from './types';
import { downloadBlob } from '../lib/downloadBlob';

export function createCrudStore<T extends BaseDto>(storeId: string, httpService: any, withCursor: boolean = true) {
  return defineStore(storeId, () => {
    const { toast } = useToast();

    const items = ref<T[]>([]);
    const item = ref<T>();
    const loading = ref<LoadingState>({
      list: false,
      item: false,
      create: false,
      update: false,
      delete: false,
    });

    const setLoading = (key: LoadingKeys, value: boolean) => {
      loading.value[key] = value;
    };

    const fetchList = async (getter?: string, params?: any, noErrorToast?: boolean) => {
      setLoading('list', true);
      try {
        const { data, status } = await httpService.list(params);
        if (status !== StatusCodes.OK) {
          return;
        }
        items.value = getter && data[getter] || data;
      } catch (e) {
        console.error('Error on fetching list:', e);
        if (!noErrorToast) {
          toast({
            variant: 'destructive',
            title: 'Ошибка',
            description: `Не удалось загрузить данные`,
          })
        }
        throw e;
      } finally {
        setLoading('list', false);
      }
    };

    const fetchItem = async (id: number) => {
      setLoading('item', true);
      try {
        const { data, status } = await httpService.get(id);
        if (status !== StatusCodes.OK) {
          return;
        }
        item.value = data;
      } catch (e) {
        console.error('Error on fetching item:', e);
        toast({
          variant: 'destructive',
          title: 'Ошибка',
          description: `Не удалось загрузить данные`,
        })
      } finally {
        setLoading('item', false);
      }
    };


    const createItem = async (payload: any) => {
      setLoading('create', true);
      try {
        const { data, status } = await httpService.post(payload);
        if (status === StatusCodes.CREATED) {
          items.value.push(data);
        }
      } catch (e) {
        console.error('Error on creating item:', e);
        toast({
          variant: 'destructive',
          title: 'Ошибка',
          description: `Не удалось выполнить операцию. Попробуйте позже.`,
        });
      } finally {
        setLoading('create', false);
      }
    };

    const updateItem = async (id: number, payload?: any) => {
      setLoading('update', true);
      try {
        const { status } = await httpService.put(id, payload);
        if (status !== StatusCodes.OK) {
          return;
        }
        fetchItem(id);
      } catch (e) {
        console.error('Error on updating item:', e);
        toast({
          variant: 'destructive',
          title: 'Ошибка',
          description: `Не удалось выполнить операцию. Попробуйте позже.`,
        });
      } finally {
        setLoading('update', false);
      }
    };

    const deleteItem = async (id: number) => {
      setLoading('delete', true);
      try {
        const { status } = await httpService.delete(id);
        if (status === StatusCodes.OK) {
          items.value = items.value.filter((item) => item.id !== id);
        }
      } catch (e) {
        console.error('Error on deleting item:', e);
        toast({
          variant: 'destructive',
          title: 'Ошибка',
          description: `Не удалось выполнить операцию. Попробуйте позже.`,
        });
      } finally {
        setLoading('delete', false);
      }
    };

    const resetList = async () => {
      items.value = [];

    };

    const resetItem = async () => {
      item.value = {} as T;
    };

    const uploadFiles = async (
      files: File[], 
      datasetName: string, 
      version: string, 
      callback?: () => void
  ) => {
      setLoading('create', true);  
          try {

              const params = {
                  dataset_name: datasetName,
                  version: version
              }
              const formData = new FormData();
              files.forEach((file) => {
                  formData.append('files', file);
              });

              const response = await httpService.sendFiles(formData, params);
      
              if (response?.status === StatusCodes.OK) {
                  toast({
                      variant: 'success',
                      title: 'Файлы успешно загружены!'
                  });
                  callback?.();
              }
          } catch (error) {
              console.error(error);
              toast({
                  variant: 'destructive',
                  title: 'Ошибка загрузки',
                  description: 'Произошла ошибка при загрузке файлов. Попробуйте снова.'
              });
          } finally {
              setLoading('create', false);
          }
      };
  
      const getDocument = async (params: any) => {
        setLoading('item', true);
        try {
          await httpService
            .getDocument(params)
            .then((response: any) => {
              let name = `${'Отчет'}`;
              name = name + '.pdf';
              downloadBlob(response.data, name);
            });
        } catch (e) {
          console.error('Error on downloading document:', e);
        } finally {
          setLoading('item', false);
        }
      };
  

    return {
      items,
      item,
      loading,
      fetchList,
      fetchItem,
      createItem,
      updateItem,
      deleteItem,
      resetList,
      resetItem,
      uploadFiles,
      getDocument,
    };
  });
}