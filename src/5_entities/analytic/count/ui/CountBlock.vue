<template>
    <div :class="$style.root">
        <div :class="$style.count">
            {{ count }}
        </div>
        <div :class="$style.desc">
            {{ desc }}
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps({
    count: String,
    desc: String
})
</script>

<style lang="scss" module>
.root {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 24px;
    border-radius: 12px;
    background-color: rgba(#E4000D, 0.05)
}
.count {
    @include h2();
    color: hsl(var(--primary));
}
.desc {
    @include caption();
}
</style>