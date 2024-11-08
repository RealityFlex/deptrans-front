<template>
    <transition name="fade" mode="out-in">
      <component :is="route.meta.layoutComponent">
        <slot />
      </component>
    </transition>
</template>
    
<script setup lang="ts">
import { useRoute } from "vue-router";
const route = useRoute();
</script>