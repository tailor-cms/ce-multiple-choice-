<template>
  <VForm ref="form" class="tce-root" @submit.prevent="submit">
    <div class="px-2">{{ data.question }}</div>
    <VInput
      :rules="[requiredRule]"
      :validation-value="selectedAnswer.length"
      validate-on="submit"
    >
      <VList
        v-model:selected="selectedAnswer"
        bg-color="transparent"
        class="w-100"
        rounded="lg"
        select-strategy="leaf"
        @update:selected="selectedAnswer"
      >
        <VListItem
          v-for="(item, uuid, index) in data.answers"
          :key="uuid"
          :value="uuid"
          base-color="blue-grey"
          class="pa-3 mt-2"
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
          <template v-if="submitted" #append="{ isSelected }">
            <VIcon v-bind="iconProps(isSelected, uuid)" />
          </template>
          <VListItemTitle>{{ item }}</VListItemTitle>
        </VListItem>
      </VList>
    </VInput>
    <div v-if="!submitted" class="d-flex justify-end">
      <VBtn type="submit" variant="tonal">Submit</VBtn>
    </div>
  </VForm>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { ElementData } from 'tce-manifest';

const props = defineProps<{ id: number; data: ElementData; userState: any }>();
const emit = defineEmits(['interaction']);

const form = ref<HTMLFormElement>();
const selectedAnswer = ref<string[]>(props.userState?.state ?? []);

const submitted = computed(() => !!props.userState?.state);

const submit = async () => {
  const { valid } = await form.value?.validate();
  if (valid) {
    emit('interaction', { state: selectedAnswer.value });
  }
};

const requiredRule = (val: string | boolean | number) => {
  return !!val || 'You have to select an answer.';
};

const iconProps = (isSelected: boolean, uuid: string) => {
  const isAnswer = props.data.correct.includes(uuid);
  const isCorrect = (isSelected && isAnswer) || (!isSelected && !isAnswer);
  if (isCorrect) return { icon: 'mdi-check-circle', color: 'success' };
  return { icon: 'mdi-close-circle', color: 'error' };
};

watch(
  () => props.userState.state,
  (state) => (selectedAnswer.value = state),
);
</script>

<style scoped>
.tce-root {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1rem;
}
</style>
