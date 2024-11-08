<template>
  <AppLayout>
    <RouterView v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </RouterView>
  </AppLayout>
  <Toaster />
</template>

<script setup lang="ts">
import { provide } from "vue";
import { RouterView } from "vue-router";

import { AppLayout } from "@/1_app/layouts";
import { EAppProviders, AppPages } from "@/1_app/router";

import Toaster from "@/6_shared/ui/toast/Toaster.vue";
</script>
