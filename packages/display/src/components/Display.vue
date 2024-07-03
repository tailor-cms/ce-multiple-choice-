<template>
  <VForm ref="form" class="tce-root" @submit.prevent="submit">
    <div class="px-2 my-4">{{ data.question }}</div>
    <VInput
      :rules="[requiredRule]"
      :validation-value="selectedAnswer.length != 0"
      hide-details="auto"
      validate-on="submit"
    >
      <VItemGroup
        v-model="selectedAnswer"
        class="w-100"
        selected-class="bg-blue-grey-lighten-4"
        multiple
      >
        <VItem
          v-for="(item, uuid, index) in data.answers"
          :key="uuid"
          v-slot="{ toggle, isSelected, selectedClass }"
          :value="uuid"
        >
          <VCard
            :class="selectedClass"
            :disabled="submitted"
            class="d-flex align-center px-4 py-3 mb-3"
            color="blue-grey-darken-2"
            rounded="lg"
            variant="outlined"
            @click="toggle"
          >
            <VAvatar
              :class="{ 'font-weight-bold': isSelected }"
              :variant="isSelected ? 'flat' : 'outlined'"
              class="mr-4"
              color="blue-grey-darken-2"
              rounded="lg"
              size="small"
            >
              {{ index + 1 }}
            </VAvatar>
            {{ item }}
            <VSpacer />
            <template v-if="submitted">
              <VIcon v-if="isSelected" v-bind="iconProps(uuid)" />
            </template>
          </VCard>
        </VItem>
      </VItemGroup>
    </VInput>
    <div v-if="!submitted" class="d-flex justify-end">
      <VBtn type="submit" variant="tonal">Submit</VBtn>
    </div>
    <VAlert
      v-else
      :text="userState?.isCorrect ? 'Correct' : 'Incorrect'"
      :type="userState?.isCorrect ? 'success' : 'error'"
      variant="tonal"
    />
  </VForm>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { ElementData } from 'tce-manifest';

const props = defineProps<{ id: number; data: ElementData; userState: any }>();
const emit = defineEmits(['interaction']);

const form = ref<HTMLFormElement>();
const selectedAnswer = ref<string[]>(props.userState?.response ?? []);

const submitted = computed(() => 'isCorrect' in (props.userState ?? {}));

const submit = async () => {
  const { valid } = await form.value?.validate();
  if (valid) {
    emit('interaction', { response: selectedAnswer.value });
  }
};

const requiredRule = (val: string | boolean | number) => {
  return !!val || 'You have to select an answer.';
};

const iconProps = (uuid: string) => {
  const isCorrect = props.userState?.correct.includes(uuid);
  if (isCorrect) return { icon: 'mdi-check-circle', color: 'success' };
  return { icon: 'mdi-close-circle', color: 'error' };
};

watch(
  () => props.userState?.response,
  (response) => (selectedAnswer.value = response || []),
);
</script>

<style scoped>
.tce-root {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1rem;
}
</style>
