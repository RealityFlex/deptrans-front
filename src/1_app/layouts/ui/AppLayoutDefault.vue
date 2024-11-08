<template>
    <div class="defaultLayout">
        <main class="defaultLayoutMain">
            <TheHeader/>
            <slot />
        </main>
    </div>
</template>

<script setup lang="ts">
import TheHeader from "@/3_widgets/header";
</script>

<style scoped lang="scss">
@import './styles';
</style>