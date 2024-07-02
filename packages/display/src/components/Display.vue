<template>
  <div class="tce-root">
    <div class="px-2">{{ data.question }}</div>
    <VList bg-color="transparent" rounded="lg" select-strategy="leaf">
      <VListItem
        v-for="(item, uuid, index) in data.answers"
        :key="uuid"
        :value="uuid"
        base-color="blue-grey"
        class="pa-3 ma-2"
        rounded="lg"
        variant="tonal"
      >
        <template #prepend="{ isSelected }">
          <VAvatar
            :class="{ 'font-weight-bold': isSelected }"
            :variant="isSelected ? 'flat' : 'outlined'"
            color="blue-grey"
            rounded="lg"
            size="small"
          >
            {{ index + 1 }}
          </VAvatar>
        </template>
        <VListItemTitle>{{ item }}</VListItemTitle>
      </VListItem>
    </VList>
  </div>
</template>

<script setup lang="ts">
import { ElementData } from 'tce-manifest';

const props = defineProps<{ id: number; data: ElementData; userState: any }>();
const emit = defineEmits(['interaction']);

const submit = () => emit('interaction', { id: props.id });
</script>

<style scoped>
.tce-root {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1rem;
}
</style>
