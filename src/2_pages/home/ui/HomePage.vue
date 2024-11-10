<template>
    <div class="root">
        <div v-loading="routesStore.loading.list" ref="mapRef" class="map">
          <Button class="absolute top-4 right-4" @click="updateMapData()">
            <IconRefresh :class="[routesStore.loading.list ? 'animate-spin' : '', 'icon']"/>
          </Button>
          <div class="absolute flex gap-4 top-4 left-4 bg-white px-4 py-2 rounded-lg">
            <div class="text-xs flex gap-2 items-center">
              <IconlineCompass class="icon text-primary"/> {{ coordinates.lng }}, {{ coordinates.lat }}
            </div>
          </div>
          <div class="absolute flex flex-col gap-2 bottom-4 left-4 bg-white p-6 rounded-xl w-[300px]">
            Версия
            <Select v-model="version" @update:model-value="recalculate()">
            <SelectTrigger>
              <SelectValue :placeholder="version ? version : 'Выберите версию'" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                  <SelectLabel>Доступные версии</SelectLabel>
                  <SelectItem
                    v-for="version in versionStore.items"
                    :key="version.version"
                    :value="version.version"
                  >
                    {{ version.version }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div class="section">
          <div class="sectionHeader">
            <div class="flex justify-between items-center">
              Аналитика
              <Button :disabled="!version" :loading="raportStore.loading.list" @click="getRaport()">
                <IconFileDownload class="icon mr-2"/>
                Отчет
              </Button>
            </div>
          </div>
          <RatingChart :score="summary?.sytem_score || 0"/>
          <div class="grid grid-cols-2 gap-4">
            <CountBlock :count="summary?.num_bus_stops" desc="Кол-во автобусных остановок"/>
            <CountBlock :count="Math.round(summary?.total_people) || '?'" desc="Численность населения"/>
            <CountBlock :count="summary?.overloaded_edges_count" desc="Кол-во загруженных пешеходных зон"/>
            <CountBlock :count="summary?.longest_overloaded_edge_length" desc="Длина наиболее загруженного пути"/>
          </div>
        </div>
    </div>
  </template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from "vue";
import { Button } from "@/6_shared/ui/button";
import IconFileDownload from '~icons/tabler/file-download?width=48px&height=48px';
import IconRefresh from '~icons/flowbite/refresh-outline?width=48px&height=48px';
import mapboxgl from 'mapbox-gl';
import { RatingChart } from "@/4_features/charts/rating";
import { CountBlock } from "@/5_entities/analytic/count";
import { useRoutesStore } from "@/5_entities/routes/model";
import { useVersionControlStore, useVersionStore } from "@/5_entities/version/model";
import { router } from "@/1_app/router";
import IconlineCompass from '~icons/icon-park-outline/compass?width=48px&height=48px';
import { useRaportStore } from "@/5_entities/raport/model";
import { useToast } from "@/6_shared/ui/toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/6_shared/ui/select'

mapboxgl.accessToken = import.meta.env.VITE_APP_MAPBOX_PUBLIC_ACCESS_TOKEN;

const routesStore = useRoutesStore();
const versionControlStore = useVersionControlStore();
const versionStore = useVersionStore();
const raportStore = useRaportStore();
const { toast } = useToast();

const map = ref();
const mapRef = ref();
const coordinates = ref({
  lat: 37.495,
  lng: 55.555
});

const version = computed(() => versionControlStore.currentVersion);
const bus_stops = computed(() => routesStore.items.bus_stops);
const houses = computed(() => routesStore.items.houses);
const routes = computed(() => routesStore.items.routes);
const heatMapData = computed(() => routesStore.items.heat_map); 
const summary = computed(() => routesStore.items.summary);

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
function convertPointsToGeoJSON(points) {
    return {
        type: 'FeatureCollection',
        features: points.map(point => ({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [point.x, point.y]
            }
        }))
    };
}
function convertRoutesToGeoJSON(routes) {
    return {
        type: 'FeatureCollection',
        features: Object.values(routes || {})
            .filter(route => route !== null)
            .map(route => ({
                type: 'Feature',
                geometry: {
                    type: 'LineString',
                    coordinates: route.map(point => [point.x, point.y])
                }
            }))
    };
}
function convertHeatMapToGeoJSON(data) {
  const features = data?.flatMap((entry) => {
    const [startCoords, endCoords, intensity, color] = entry;
    const feature = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: startCoords,
      },
      properties: {
        intensity,
        color,
      },
    };
    return feature;
  });

  return {
    type: 'FeatureCollection',
    features,
  };
}
const removeMapData = () => {
  if (map.value.getLayer('bus_stops_layer')) map.value.removeLayer('bus_stops_layer');
  if (map.value.getSource('bus_stops')) map.value.removeSource('bus_stops');
  
  if (map.value.getLayer('houses_layer')) map.value.removeLayer('houses_layer');
  if (map.value.getSource('houses')) map.value.removeSource('houses');
  
  if (map.value.getLayer('routes_layer')) map.value.removeLayer('routes_layer');
  if (map.value.getSource('routes')) map.value.removeSource('routes');

  if (map.value.getLayer('heat_map_layer')) map.value.removeLayer('heat_map_layer');
  if (map.value.getSource('heat_map')) map.value.removeSource('heat_map');
};
const addMapData = () => {
  removeMapData();

  map.value.addSource('routes', {
    type: 'geojson',
    data: convertRoutesToGeoJSON(routes.value)
  })
  map.value.addLayer({
    id: 'routes_layer',
    type: 'line',
    source: 'routes',
    paint: {
      'line-width': 2,
      'line-color': '#E4000D'
    }
  })

  map.value.addSource('heat_map', {
    type: 'geojson',
    data: convertHeatMapToGeoJSON(heatMapData.value[1]),
  });
  map.value.addLayer({
    id: 'heat_map_layer',
    type: 'heatmap',
    source: 'heat_map',
    paint: {
      'heatmap-intensity': 1,
      'heatmap-radius': 25,
      'heatmap-opacity': 0.2,
      'heatmap-color': [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0, 'rgba(33,102,172,0)',
        0.2, 'rgb(103,169,207)',
        0.4, 'rgb(209,229,240)',
        0.6, 'rgb(253,219,199)',
        0.8, 'rgb(239,138,98)',
        1, 'rgb(255, 75, 0)'
      ],
    },
  });

  const busStopIcon = new Image()
  busStopIcon.src = '/images/map/bus.svg'
  busStopIcon.onload = () => {
    if (!map.value.hasImage('bus_station')) {
       map.value.addImage('bus_station', busStopIcon);
    }
  }
  map.value.addSource('bus_stops', {
    type: 'geojson',
    data: convertPointsToGeoJSON(bus_stops.value)
  });
  map.value.addLayer({
    id: 'bus_stops_layer',
    type: 'symbol',
    source: 'bus_stops',
    layout: {
      'icon-image': 'bus_station',
      'icon-size': 0.3,
      'icon-allow-overlap': true,
      'icon-ignore-placement': true,
    }
  });

  const housesIcon = new Image()
  housesIcon.src = '/images/map/building.svg'
  housesIcon.onload = () => {
    if (!map.value.hasImage('house')) {
      map.value.addImage('house', housesIcon);
    }
  }
  map.value.addSource('houses', {
    type: 'geojson',
    data: convertPointsToGeoJSON(houses.value)
  });
  map.value.addLayer({
      id: 'houses_layer',
      type: 'symbol',
      source: 'houses',
      layout: {
        'icon-image': 'house',
        'icon-size': 0.5,
        'icon-allow-overlap': true,
        'icon-ignore-placement': true,
      }
  });

  map.value.on('click', (event: any) => {
    const lngLat = event.lngLat;
    coordinates.value = {
      lng: lngLat.lng.toFixed(5),
      lat: lngLat.lat.toFixed(5),
    };

    updateMapData();

    map.value.zoomTo(16, {
      center: lngLat,
      duration: 500,
    });
    toast({
      title: 'Корректировка координат',
      description: `Обрабатываем новые координаты для пересчета: ${coordinates.value.lat}, ${coordinates.value.lng}`,
    })
  });
};
const updateMapData = async () => {
  const params = { 
    version: version.value, 
    lat: coordinates.value.lat,
    long: coordinates.value.lng, 
  };
  
  try {
    await routesStore.fetchList('', params, true);
  } catch (e) {
    await initVersion();
  }
}
const getRaport = async () => {
  const params = { 
    version: version.value, 
    lat: coordinates.value.lng,
    long: coordinates.value.lat, 
  };
  
  try {
    await raportStore.getDocument(params);
  }
  catch (e) {
    toast({
      variant: 'destructive',
      title: 'Ошибка',
      description: `Не удалось скачать отчёт`,
    })
  }
}

onMounted(async () => {
  const mapInstance = new mapboxgl.Map({
    container: mapRef.value,
    style: "mapbox://styles/mapbox/light-v11",
    center: [coordinates.value.lat, coordinates.value.lng],
    zoom: 14.5,
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
const recalculate = () => {
  versionControlStore.changeVersion(version.value);
  updateMapData();
}
watch([bus_stops, houses, routes, heatMapData], ([newBusStops, newHouses, newRoutes, newHeatMapData]) => {
  if (map.value) {
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
  max-height: calc(100vh - 150px);
  width: 75%;
  overflow: hidden;
  position: relative;
}
.sectionHeader {
  @include h2();
}
.icon {
  width: 24px;
  height: 24px;
}
</style>