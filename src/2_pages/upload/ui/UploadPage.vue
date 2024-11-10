<template>
    <div class="root">
      <div class="section">
        <div class="sectionHeader">
          Загрузка файлов для версии
        </div>
          <Upload :selectedVersion="versionControlStore.currentVersion"/>
      </div>
      <div class="section">
        <div class="sectionHeader">
          Список версий
        </div>
        <Input placeholder="Поиск"></Input>
          <div class="versions">
            <Version :isSelected="versionControlStore.currentVersion === folder.version" @select="onSelect($event)" v-for="(folder, index) in folders" :key="index" :name="folder.version" :date="folder.created_at"/>
          </div>
      </div>
    </div>
  </template>

<script setup lang="ts">
import { computed } from "vue";
import { Input } from "@/6_shared/ui/input";
import { Upload } from "@/4_features/upload";
import { Version } from "@/5_entities/version";
import { useVersionControlStore, useVersionStore } from "@/5_entities/version/model";
import { useFilesStore } from "@/5_entities/files/model";

const versionStore = useVersionStore();
const filesStore = useFilesStore();
const versionControlStore = useVersionControlStore();

const fetch = async () => {
  await versionStore.fetchList('folders');
  versionControlStore.changeVersion(folders.value[0]?.version);
  
  const params = {
    version: folders.value[0]?.version
  }
  await filesStore.fetchList('', params);
}

const folders = computed<{ version: string; created_at: string }[]>(() => versionStore.items);


const onSelect = async (name: string) => {
  const params = {
    version: name
  }

  await filesStore.fetchList('', params);
  versionControlStore.changeVersion(name);
}

fetch();

</script>

<style scoped lang="scss">
@import './styles';

.root {
  display: flex;
  gap: 12px;
  height: 100%;
}
.section {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 100%;
  gap: 16px;
  @include adaptiveValue('padding', 32, 16);
  border-radius: 24px;
  background-color: white;
}
.sectionHeader {
  @include h2();
}
.group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.versions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  max-height: calc(100vh - 332px);
}
</style>