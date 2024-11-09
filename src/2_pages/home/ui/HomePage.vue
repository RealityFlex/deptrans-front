<template>
    <div class="root">
        <div ref="mapRef" class="map"></div>
        <div class="section">
          <div class="sectionHeader">
            <div class="flex justify-between items-center">
              Аналитика
              <Button>
                <IconFileDownload class="icon mr-2"/>
                Отчет
              </Button>
            </div>
          </div>
          <RatingChart/>
          <div class="grid grid-cols-2 gap-4">
            <CountBlock count="12" desc="Кол-во пешеходных потоков"/>
            <CountBlock count="1" desc="Кол-во загруженных зон"/>
            <CountBlock count="24" desc="Кол-во значимых объектов"/>
            <CountBlock count="17" desc="Кол-во пешеходных переходов"/>
          </div>
        </div>
    </div>
  </template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Button } from "@/6_shared/ui/button";
import IconFileDownload from '~icons/tabler/file-download?width=48px&height=48px';
import mapboxgl from 'mapbox-gl';
import { RatingChart } from "@/4_features/charts/rating";
import { CountBlock } from "@/5_entities/analytic/count";


const map = ref();
const mapRef = ref();
mapboxgl.accessToken = import.meta.env.VITE_APP_MAPBOX_PUBLIC_ACCESS_TOKEN;

onMounted(() => {
  const mapInstance = new mapboxgl.Map({
    container: mapRef.value,
    style: "mapbox://styles/mapbox/light-v11",
    center: [37.6156, 55.7522],
    zoom: 14,
  });

  map.value = mapInstance;
})
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
  width: 35%;
  max-height: 100%;
  gap: 16px;
  @include adaptiveValue('padding', 32, 16);
  border-radius: 24px;
  background-color: white;
}
.map {
  border-radius: 24px;
  height: 100%;
  max-height: calc(100vh - 200px);
  width: 75%;
}
.sectionHeader {
  @include h2();
}
.icon {
  width: 24px;
  height: 24px;
}
</style>