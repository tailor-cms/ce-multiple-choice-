<template>
  <VForm ref="form" class="tce-container" @submit.prevent="save">
    <VTextarea
      v-model="elementData.question"
      :disabled="!isEditing"
      :rules="[requiredRule]"
      class="my-2"
      label="Question"
      rows="3"
      variant="outlined"
      auto-grow
    />
    <VSlideYTransition group>
      <VTextField
        v-for="(answer, id, index) in elementData.answers"
        :key="id"
        :append-icon="answersCount > 2 ? 'mdi-close' : undefined"
        :disabled="!isEditing"
        :label="`Answer ${index + 1}`"
        :model-value="answer"
        :rules="[requiredRule]"
        class="my-2"
        variant="outlined"
        @click:append="removeAnswer(id)"
        @update:model-value="updateAnswer(id, $event)"
      >
        <template #prepend>
          <VCheckbox
            v-model="elementData.correct"
            :rules="[requiredRule]"
            :validation-value="!!elementData.correct.length!"
            :value="id"
            color="primary"
            hide-details
            multiple
          />
        </template>
      </VTextField>
    </VSlideYTransition>
    <div class="d-flex justify-center align-center mb-2">
      <VBtn
        :disabled="!isEditing"
        prepend-icon="mdi-plus"
        size="small"
        variant="text"
        rounded
        @click="addAnswer"
      >
        Add Answer
      </VBtn>
    </div>
    <div class="d-flex justify-end">
      <template v-if="isEditing">
        <VBtn variant="text" @click="cancel">Cancel</VBtn>
        <VBtn class="ml-2" type="submit" variant="tonal">Save</VBtn>
      </template>
      <VBtn v-else variant="tonal" @click="isEditing = true">Edit</VBtn>
    </div>
  </VForm>
</template>

<script lang="ts" setup>
import { computed, defineEmits, defineProps, reactive, ref, watch } from 'vue';
import { Element, ElementData } from '@tailor-cms/ce-multiple-choice-manifest';
import cloneDeep from 'lodash/cloneDeep';
import { v4 as uuid } from 'uuid';

const emit = defineEmits(['save']);
const props = defineProps<{ element: Element; isFocused: boolean }>();

const form = ref<HTMLFormElement>();
const isEditing = ref<boolean>(!props.element.id);
const elementData = reactive<ElementData>(cloneDeep(props.element.data));

const answersCount = computed(() => Object.keys(elementData.answers).length);

const addAnswer = () => (elementData.answers[uuid()] = '');
const removeAnswer = (id: string) => delete elementData.answers[id];
const updateAnswer = (id: string, value: string) =>
  (elementData.answers[id] = value);

const save = async () => {
  const { valid } = await form.value?.validate();
  if (valid) {
    emit('save', elementData);
    isEditing.value = false;
  }
};

const cancel = () => {
  Object.assign(elementData, cloneDeep(props.element.data));
  form.value?.resetValidation();
  isEditing.value = false;
};

const requiredRule = (val: string | boolean | number) => {
  return !!val || 'The field is required';
};

watch(
  () => props.element.data,
  (data) => Object.assign(elementData, cloneDeep(data)),
);
</script>

<style lang="scss" scoped>
.tce-container {
  text-align: left;
}
</style>
