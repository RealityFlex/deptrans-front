<template>
    <div class="root">
        <div class="left">
            <IconFileUploaded class="icon"/>
            <div class="info">
                <div class="name">
                    {{ name }}
                </div>
                <div class="size">
                    {{ size }}
                </div>
            </div>
        </div>
        <div class="right">
            <IconXmark @click="remove" :class="['icon', 'iconRemove']"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import IconFileUploaded from '~icons/lucide/file-text?width=48px&height=48px';
import IconXmark from '~icons/heroicons/x-mark-20-solid?width=48px&height=48px';

const emits = defineEmits(['remove'])
defineProps({
    name: String,
    size: String
})

const remove = () => {
    emits('remove')
}
</script>

<style lang="scss" scoped>
.root {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: hsl(var(--background));
    width: 100%;
    border-radius: 8px;
    padding: 8px 12px;
}
.left {
    display: flex;
    gap: 12px;
    align-items: center;
}
.icon {
    width: 24px;
    height: 24px;
}
.iconRemove {
    cursor: pointer;
}
.info {
    display: flex;
    flex-direction: column;

    @include body($font-size: 14, $line-height: 14);
}
.size {
    @include caption();
    color: hsl(var(--muted-foreground));
}
</style>