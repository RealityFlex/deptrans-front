<template>
    <div class="root">
        <div class="left">
            <div class="line" v-if="isSelected"></div>
            <div class="info">
                <div class="name">
                    {{ name }}
                </div>
                <div class="date">
                    Версия от {{ parsedDate }}
                </div>
            </div>
        </div>
        <div class="right">
            <Button v-if="isSelected" variant="outline">
                Перейти к карте
                <IconMapUp class="icon text-primary ml-2"/>
            </Button>
            <Button v-else>Выбрать</Button>
            <Button size="icon" variant="ghost">
                <IconTrash class="icon text-primary"/>
            </Button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Button } from '@/6_shared/ui/button'
import IconTrash from '~icons/iconamoon/trash?width=48px&height=48px';
import IconMapUp from '~icons/tabler/map-up?width=48px&height=48px';
import { format, parse } from '@formkit/tempo'


const props = defineProps({
    name: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    isSelected: {
        type: Boolean,
        required: true
    }
})

const parsedDate = format(parse(props.date), 'medium')
</script>

<style lang="scss" scoped>
.root {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: hsl(var(--background));
    padding: 16px 24px;
    border-radius: 24px;
}
.left {
    display: flex;
    gap: 8px;
    align-items: center;
}
.right {
    display: flex;
    gap: 12px;
    align-items: center;
}
.line {
    width: 5px;
    border-radius: 99px;
    background-color: hsl(var(--primary));
    height: 32px;
}
.icon {
    width: 24px;
    height: 24px;
}
.date {
    @include caption();
    color: hsl(var(--muted-foreground));
}
.info {
    display: flex;
    flex-direction: column;
}
</style>