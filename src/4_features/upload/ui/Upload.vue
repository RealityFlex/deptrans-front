<template>
     <div class="group">
      <Label for="version">Наименование версии</Label>
      <Input v-model:modelValue="versionControlStore.currentVersion" id="version" placeholder="Введите наименование версии"></Input>
    </div>
    <div class="flex flex-col gap-6 h-full">
      <label for="file" class="upload-file__upload upload">
        <Input @change="onFileChange($event)" accept=".shp, .shx, .dbf, .prj, .qmd, .cpg, .png" id="file" type="file" multiple />
        <div class="upload__area">
          <IconFileUpload class="upload__icon"/>
          <div class="upload__body">
            <div class="upload__text">
              <span>Перетащите сюда файл(ы) или</span>
              <span>&nbsp;</span>
              <span class="cursor-pointer text-primary underline">загрузите</span>
            </div>
            <div class="upload__additional">Поддерживаемые форматы: .shp, .shx, .dbf, .prj, .qmd, .cpg</div>
          </div>
        </div>
      </label>
      <div class="upload__segment">
        <div class="upload__segment-header">
          <div>Файловый сегмент</div>
          <span class="upload__segment-caption">Максимальное кол-во файлов для сегмента: 6</span>
        </div>
        <Tabs default-value="street" v-model="currentTab">
          <TabsList class="w-full">
            <TabsTrigger class="w-full" value="streets">Улицы</TabsTrigger>
            <TabsTrigger class="w-full" value="buildings">Дома</TabsTrigger>
            <TabsTrigger class="w-full" value="metro">Станции метро</TabsTrigger>
            <TabsTrigger class="w-full" value="stations">Остановки</TabsTrigger>
          </TabsList>
          <TabsContent class="upload__uploaded-files" v-for="(files, tab) in fileSegments" :key="tab" :value="tab">
            <template v-if="fileSegments[tab].length">
                <UploadedFile 
                    v-for="(file, index) in files" 
                    :key="index" 
                    :name="file.name" 
                    :size="calculateFileSize(file.size)" 
                    @remove="removeFile(tab, index)"
                />
            </template>
            <div v-else class="upload__uploaded-files-empty">Отсутствуют загруженные файлы</div>
          </TabsContent>
        </Tabs>
        <Button :disabled="!fileSegments[currentTab].length" @click="uploadFile" :loading="uploadStore.loading.create">Обновить данные для сегмента</Button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, watch, onMounted } from 'vue';
  
  import { useToast } from '@/6_shared/ui/toast';
  import { Button } from '@/6_shared/ui/button';
  import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/6_shared/ui/tabs';
  import { Input } from '@/6_shared/ui/input';
  import { Label } from "@/6_shared/ui/label";
  import { UploadedFile } from '@/5_entities/uploaded-file';
  import IconFileUpload from '~icons/lucide/file-up?width=48px&height=48px';
  import { useUploadStore } from '@/5_entities/upload/model';

  import * as yup from 'yup';
import { useVersionControlStore, useVersionStore } from '@/5_entities/version/model';

  const props = defineProps({
      selectedVersion: {
        type: String,
        required: true
      },
    })

  const versionControlStore = useVersionControlStore();
  const uploadStore = useUploadStore();
  const versionStore = useVersionStore();

  const { toast } = useToast();

  const currentTab = ref('streets');
  const version = ref(props.selectedVersion)
  const fileSegments = ref({
    streets: [],
    buildings: [],
    metro: [],
    stations: [],
  });

  const versionSchema = yup.string().required();
  
  const onFileChange = (e: any) => {
    const maxFilesPerSegment = 6;
    const files = Array.from(e.target.files);
    const segment = currentTab.value;

    files.forEach((file) => {
      const existingFileIndex = fileSegments.value[segment].findIndex(
        (existingFile) => existingFile.name === file.name
      );

      if (existingFileIndex !== -1) {
        fileSegments.value[segment][existingFileIndex] = { name: file.name, isFetched: false, size: file.size };
        toast({
          variant: 'info',
          title: `Файл перезаписан`,
          description: `Файл "${file.name}" для сегмента "${segment}" был перезаписан.`,
        });
      } else {
        if (fileSegments.value[segment].length < maxFilesPerSegment) {
          fileSegments.value[segment].push({ name: file.name, isFetched: false, size: file.size });
        }
      }
    });

    if (fileSegments.value[segment].length > maxFilesPerSegment) {
        fileSegments.value[segment] = fileSegments.value[segment].slice(0, maxFilesPerSegment);
        fileSegments.value[segment] = fileSegments.value[segment].slice(0, maxFilesPerSegment);

      fileSegments.value[segment] = fileSegments.value[segment].slice(0, maxFilesPerSegment);

      toast({
        variant: 'destructive',
        title: `Превышено максимальное количество файлов`,
        description: `Для сегмента "${segment}" можно загрузить не более ${maxFilesPerSegment} файлов.`,
      });
    }

    e.target.value = '';
};
  const removeFile = (segment, index) => {
    fileSegments.value[segment].splice(index, 1);
  };
  const uploadFile = async () => {
    try {
      await versionSchema.validate(versionControlStore.currentVersion);
      
      const allFiles = Object.values(fileSegments.value).flat();  
      uploadStore.uploadFiles(allFiles, currentTab.value, version.value, () => versionStore.fetchList('folders'));

    } catch (error) {
      if (error instanceof yup.ValidationError) {
        toast({
          variant: 'destructive',
          title: 'Введите наименование версии',
          description: error.message,
        });
      }
    }
  };
  const calculateFileSize = (bytes: number) => {
    const sizes = ['Байт', 'КБ', 'МБ', 'ГБ', 'ТБ'];
    if (bytes === 0) {
      return '0 Байт';
    }
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
  };
  </script>
  
  <style scoped lang="scss">
  @import './styles';
  </style>
  