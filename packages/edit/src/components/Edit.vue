<template>
  <QuestionContainer
    v-bind="{
      allowedEmbedTypes,
      elementData,
      isDirty,
      isDisabled,
      isGradeable,
    }"
    show-feedback
    @cancel="updateData(element.data)"
    @save="save"
    @update="updateData($event)"
  >
    <div class="text-subtitle-2 mb-2">{{ title }}</div>
    <VInput
      v-slot="{ isValid }"
      :model-value="elementData.correct"
      :rules="validation.correct"
    >
      <VSlideYTransition group>
        <VTextField
          v-for="(answer, index) in elementData.answers"
          :key="index"
          :model-value="answer"
          :placeholder="placeholder"
          :readonly="isDisabled"
          :rules="validation.answer"
          class="my-2 w-100"
          variant="outlined"
          @update:model-value="updateAnswer(index, $event)"
        >
          <template #prepend>
            <VCheckbox
              v-if="isGradeable"
              v-model="elementData.correct"
              :error="isValid.value === false"
              :readonly="isDisabled"
              :value="index"
              color="primary"
              hide-details
              multiple
            />
            <VAvatar
              v-else
              class="font-weight-bold ma-1"
              color="primary-darken-3"
              rounded="lg"
              size="small"
            >
              {{ index + 1 }}
            </VAvatar>
          </template>
          <template v-if="!isDisabled && answersCount > 2" #append>
            <VBtn
              aria-label="Remove answer"
              color="primary-darken-4"
              size="x-small"
              variant="text"
              icon
              @click="removeAnswer(index)"
            >
              <VIcon icon="mdi-close" size="large" />
            </VBtn>
          </template>
        </VTextField>
      </VSlideYTransition>
    </VInput>
    <div class="d-flex justify-end mb-12">
      <VBtn
        v-if="!isDisabled"
        color="primary-darken-4"
        prepend-icon="mdi-plus"
        variant="text"
        rounded
        @click="addAnswer"
      >
        {{ btnLabel }}
      </VBtn>
    </div>
  </QuestionContainer>
</template>

<script lang="ts" setup>
import { computed, defineEmits, defineProps, reactive, watch } from 'vue';
import { Element, ElementData } from '@tailor-cms/ce-multiple-choice-manifest';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import { QuestionContainer } from '@tailor-cms/core-components';

const props = defineProps<{
  allowedEmbedTypes: string[];
  element: Element;
  isFocused: boolean;
  isDisabled: boolean;
  isGradeable: boolean;
}>();
const emit = defineEmits(['save']);

const elementData = reactive<ElementData>(cloneDeep(props.element.data));

const answersCount = computed(() => elementData.answers.length);
const isDirty = computed(() => !isEqual(elementData, props.element.data));

const title = computed(() =>
  props.isGradeable ? 'Select correct answer(s)' : 'Options',
);
const placeholder = computed(() =>
  props.isGradeable ? 'Answer...' : 'Option...',
);
const btnLabel = computed(() =>
  props.isGradeable ? 'Add answer' : 'Add option',
);

const validation = computed(() => ({
  answer: [(val: string) => !!val || 'Answer is required'],
  correct: props.isGradeable
    ? [(val?: number[]) => val?.length || 'Please choose the correct answer(s)']
    : [],
}));

const addAnswer = () => elementData.answers.push('');
const removeAnswer = (answerIndex: number) => {
  elementData.answers.splice(answerIndex, 1);

  if (props.isGradeable) {
    const index = elementData.correct!.indexOf(answerIndex);
    if (index !== -1) elementData.correct!.splice(index, 1);
    elementData.correct!.forEach((it, i) => {
      if (it >= answerIndex && elementData.correct) {
        elementData.correct[i] = it - 1;
      }
    });
  }
};

const updateAnswer = (index: number, value: string) =>
  (elementData.answers[index] = value);

const save = () => emit('save', elementData);

const updateData = (data: ElementData) => {
  Object.assign(elementData, cloneDeep(data));
};

watch(() => props.element.data, updateData);
</script>
