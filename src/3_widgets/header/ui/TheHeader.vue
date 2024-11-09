@@ -0,0 +1,101 @@
<template>
    <div class="root">
        <div class="headerContainer">
            <div class="headerLeft">
                <router-link to="/">
                    <img src="/images/logo/logo.svg" alt="logo">
                </router-link>
                <div class="headerLinks">
                    <router-link :to="{ name: AppPages.home }" v-slot="{ isExactActive }">
                        <div :class="[isExactActive && 'headerLinkActive' , 'headerLink']" class="headerLink">
                            Главная
                        </div> 
                    </router-link>
                    <router-link :to="{ name: AppPages.upload }"  v-slot="{ isExactActive }">
                        <div :class="[isExactActive && 'headerLinkActive' , 'headerLink']" >
                            Загрузка
                        </div>
                    </router-link>
                </div>
            </div>
            <div class="headerRight">
                <router-link class="headerLink text-muted-foreground" to="#">Руководство пользователя</router-link>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { AppPages } from '@/1_app/router';
</script>

<style lang="scss" scoped>
.root {
    border-radius: 24px;
    background-color: white;
}
.headerContainer {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    padding: 24px 48px;
}
.headerLeft,
.headerRight {
    display: flex;
    align-items: center;
    gap: 48px;
}
.headerLinks {
    display: flex;
    gap: 24px;
    align-items: center;
}
.headerLink {
    &:hover {
        color: hsl(var(--primary));
    }
}
.headerLinkActive {
    color: hsl(var(--primary));
}
</style>