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
import { onMounted, ref, computed, watch } from "vue";
import { Button } from "@/6_shared/ui/button";
import IconFileDownload from '~icons/tabler/file-download?width=48px&height=48px';
import mapboxgl from 'mapbox-gl';
import { RatingChart } from "@/4_features/charts/rating";
import { CountBlock } from "@/5_entities/analytic/count";
import { useRoutesStore } from "@/5_entities/routes/model";
import { useVersionControlStore, useVersionStore } from "@/5_entities/version/model";
import { router } from "@/1_app/router";

const routesStore = useRoutesStore();
const versionControlStore = useVersionControlStore();
const versionStore = useVersionStore();

const map = ref();
const mapRef = ref();

const version = computed(() => versionControlStore.currentVersion);

mapboxgl.accessToken = import.meta.env.VITE_APP_MAPBOX_PUBLIC_ACCESS_TOKEN;

const initVersion = async () => {
  await versionStore.fetchList('folders');
  const folders = computed<{ version: string; created_at: string }[]>(() => versionStore.items);
  if (folders.value.length) {
    versionControlStore.changeVersion(folders.value[0]?.version);
    const params = { version: version.value};
    await routesStore.fetchList('', params);
  }
  else {
    router.push({ name: 'UploadPage' });
  }
}

onMounted(async () => {
  const mapInstance = new mapboxgl.Map({
    container: mapRef.value,
    style: "mapbox://styles/mapbox/light-v11",
    center: [37.495, 55.555],
    zoom: 14,
  });

  map.value = mapInstance;

  map.value.on('load', () => {
    addMapData();
  });

  const params = { version: version.value};
  
  try {
    await routesStore.fetchList('', params, true);
  } catch (e) {
    await initVersion();
  }
})

const bus_stops = computed(() => routesStore.items.bus_stops);
const houses = computed(() => routesStore.items.houses);
const routes = computed(() => routesStore.items.routes);

function convertPointsToGeoJSON(points) {
    return {
        type: 'FeatureCollection',
        features: points.map(point => ({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [point.y, point.x]
            }
        }))
    };
}

// Преобразование маршрутов в формат GeoJSON
function convertRoutesToGeoJSON(routes) {
    return {
        type: 'FeatureCollection',
        features: Object.values(routes)
            .filter(route => route !== null) // Только маршруты, где есть данные
            .map(route => ({
                type: 'Feature',
                geometry: {
                    type: 'LineString',
                    coordinates: route.map(point => [point.x, point.y])
                }
            }))
    };
}

const removeMapData = () => {
  if (map.value.getLayer('bus_stops_layer')) map.value.removeLayer('bus_stops_layer');
  if (map.value.getSource('bus_stops')) map.value.removeSource('bus_stops');
  
  if (map.value.getLayer('houses_layer')) map.value.removeLayer('houses_layer');
  if (map.value.getSource('houses')) map.value.removeSource('houses');
  
  if (map.value.getLayer('routes_layer')) map.value.removeLayer('routes_layer');
  if (map.value.getSource('routes')) map.value.removeSource('routes');
};


const addMapData = () => {
  removeMapData();
  if (!bus_stops.value?.length || !houses.value?.length || !Object.keys(routes.value)?.length) return;

  // Добавление точек автобусных остановок
  map.value.addSource('bus_stops', {
    type: 'geojson',
    data: convertPointsToGeoJSON(bus_stops.value)
  });
  map.value.addLayer({
    id: 'bus_stops_layer',
    type: 'circle',
    source: 'bus_stops',
    paint: {
      'circle-radius': 1,
      'circle-color': '#E4000D'
    }
  });

  // Добавление точек домов
  map.value.addSource('houses', {
    type: 'geojson',
    data: convertPointsToGeoJSON(houses.value)
  });
  map.value.addLayer({
    id: 'houses_layer',
    type: 'circle',
    source: 'houses',
    paint: {
      'circle-radius': 6,
      'circle-color': '#E4000D'
    }
  });

  // Добавление маршрутов
  map.value.addSource('routes', {
    type: 'geojson',
    data: convertRoutesToGeoJSON(routes.value)
  });
  map.value.addLayer({
    id: 'routes_layer',
    type: 'line',
    source: 'routes',
    paint: {
      'line-width': 4,
      'line-color': '#E4000D'
    }
  });
};

watch([bus_stops, houses, routes], ([newBusStops, newHouses, newRoutes]) => {
  if (map.value && newBusStops.length && newHouses.length && Object.keys(newRoutes).length) {
    addMapData();
  }
});
</script>

<style lang="scss"  scoped>
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