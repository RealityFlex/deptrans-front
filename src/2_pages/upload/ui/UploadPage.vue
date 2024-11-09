<template>
    <div class="root">
      <div class="section">
        <div class="sectionHeader">
          Загрузка файлов для версии
        </div>
          <Upload/>
      </div>
      <div class="section">
        <div class="sectionHeader">
          Список версий
        </div>
        <Input placeholder="Поиск"></Input>
          <div class="versions">
            <Version :isSelected="true"/>
            <Version />
            <Version />
            <Version />
            <Version />
            <Version />
            <Version />
            <Version />
            <Version />
          </div>
      </div>
    </div>
  </template>

<script setup lang="ts">
import { ref } from "vue";
import { Input } from "@/6_shared/ui/input";
import { Upload } from "@/4_features/upload";
import { ScrollArea } from '@/6_shared/ui/scroll-area'
import { Version } from "@/5_entities/version";

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
  gap: 24px;
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