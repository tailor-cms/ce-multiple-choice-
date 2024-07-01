<template>
  <div class="tce-container">
    <VTextarea
      v-model="elementData.question"
      :disabled="!isEditing"
      label="Question"
      rows="3"
      variant="outlined"
      auto-grow
    />
    <VTextField
      v-for="(answer, index) in elementData.answers"
      :key="answer.id"
      :disabled="!isEditing"
      :label="`Answer ${index + 1}`"
      :model-value="answer.value"
      append-icon="mdi-close"
      variant="outlined"
      @click:append="removeAnswer(index)"
      @update:model-value="updateAnswer($event, index)"
    >
      <template #prepend>
        <VCheckboxBtn />
      </template>
    </VTextField>
    <VBtn
      :disabled="!isEditing"
      prepend-icon="mdi-plus"
      variant="text"
      rounded
      @click="addAnswer"
    >
      Add Answer
    </VBtn>
    <div class="d-flex justify-end">
      <template v-if="isEditing">
        <VBtn variant="text" @click="cancel">Cancel</VBtn>
        <VBtn variant="tonal" @click="save">Save</VBtn>
      </template>
      <VBtn v-else variant="tonal" @click="isEditing = true">Edit</VBtn>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, ref } from 'vue';
import { Element, ElementData } from 'tce-manifest';
import cloneDeep from 'lodash/cloneDeep';
import { v4 as uuidv4 } from 'uuid';

const emit = defineEmits(['save']);
const props = defineProps<{ element: Element; isFocused: boolean }>();

const elementData = ref<ElementData>(cloneDeep(props.element.data));
const isEditing = ref<boolean>(!props.element.id);

const updateAnswer = (value: string, index: number) => {
  Object.assign(elementData.value.answers[index], { value });
};

const removeAnswer = (index: number) => {
  elementData.value.answers.splice(index, 1);
};

const addAnswer = () => {
  elementData.value.answers.push({ id: uuidv4(), value: '' });
};

const save = () => {
  emit('save', elementData.value);
  isEditing.value = false;
};

const cancel = () => {
  elementData.value = cloneDeep(props.element.data);
  isEditing.value = false;
};
</script>
