<template>
  <VForm
    ref="form"
    class="tce-multiple-choice"
    validate-on="submit"
    @submit.prevent="save"
  >
    <RichTextEditor
      v-model="elementData.question"
      :readonly="isDisabled"
      :rules="[requiredRule]"
      class="my-3"
      label="Question"
      rows="3"
      variant="outlined"
      auto-grow
    />
    <div class="text-subtitle-2 mb-2">{{ title }}</div>
    <VInput
      :model-value="!!elementData.correct.length"
      :rules="[props.isGraded && requiredRule].filter(Boolean)"
    >
      <div class="d-flex flex-column w-100">
        <VSlideYTransition group>
          <VTextField
            v-for="(answer, index) in elementData.answers"
            :key="index"
            :model-value="answer"
            :placeholder="placeholder"
            :readonly="isDisabled"
            :rules="[requiredRule]"
            class="mt-2"
            variant="outlined"
            @update:model-value="updateAnswer(index, $event)"
          >
            <template #prepend>
              <VCheckbox
                v-if="isGraded"
                v-model="elementData.correct"
                :readonly="isDisabled"
                :rules="[requiredRule]"
                :validation-value="!!elementData.correct.length"
                :value="index"
                color="primary"
                hide-details
                multiple
              />
              <VAvatar
                v-else
                color="primary-darken-3"
                rounded="lg"
                variant="tonal"
              >
                {{ index + 1 }}
              </VAvatar>
            </template>
            <template #append>
              <VBtn
                v-if="!isDisabled && answersCount > 2"
                aria-label="Remove answer"
                color="primary-darken-4"
                density="comfortable"
                icon="mdi-close"
                variant="text"
                @click="removeAnswer(index)"
              />
            </template>
          </VTextField>
        </VSlideYTransition>
      </div>
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
    <VTextField
      v-model="elementData.hint"
      :readonly="isDisabled"
      placeholder="Optional hint..."
      variant="outlined"
      clearable
    />
    <QuestionFeedback
      :answers="elementData.answers"
      :feedback="elementData.feedback || {}"
      :is-editing="!isDisabled"
      :is-graded="isGraded"
      @update="Object.assign(elementData.feedback, $event)"
    />
    <div v-if="!isDisabled" class="d-flex justify-end">
      <VBtn
        :disabled="isDirty"
        color="primary-darken-4"
        variant="text"
        @click="cancel"
      >
        Cancel
      </VBtn>
      <VBtn
        :disabled="isDirty"
        class="ml-2"
        color="primary-darken-3"
        type="submit"
        variant="tonal"
      >
        Save
      </VBtn>
    </div>
  </VForm>
</template>

<script lang="ts" setup>
import { computed, defineEmits, defineProps, reactive, ref, watch } from 'vue';
import { Element, ElementData } from '@tailor-cms/ce-multiple-choice-manifest';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import { QuestionFeedback, RichTextEditor } from '@tailor-cms/core-components';

const emit = defineEmits(['save']);
const props = defineProps<{
  element: Element;
  isFocused: boolean;
  isDisabled: boolean;
  isGraded: boolean;
}>();

const form = ref<HTMLFormElement>();
const elementData = reactive<ElementData>(cloneDeep(props.element.data));

const answersCount = computed(() => elementData.answers.length);
const isDirty = computed(() => isEqual(elementData, props.element.data));

const title = computed(() =>
  props.isGraded ? 'Select correct answer(s)' : 'Options',
);
const placeholder = computed(() =>
  props.isGraded ? 'Answer...' : 'Option...',
);
const btnLabel = computed(() => (props.isGraded ? 'Add answer' : 'Add option'));

const addAnswer = () => elementData.answers.push('');
const removeAnswer = (answerIndex: number) => {
  elementData.answers.splice(answerIndex, 1);

  if (props.isGraded) {
    const index = elementData.correct.indexOf(answerIndex);
    if (index !== -1) elementData.correct.splice(index, 1);
    elementData.correct.forEach((it, i) => {
      if (it >= answerIndex) elementData.correct[i] = it - 1;
    });
  }
};
const updateAnswer = (index: number, value: string) =>
  (elementData.answers[index] = value);

const save = async () => {
  const { valid } = await form.value?.validate();
  if (valid) emit('save', elementData);
};

const cancel = () => {
  Object.assign(elementData, cloneDeep(props.element.data));
  form.value?.resetValidation();
};

const requiredRule = (val: string | boolean | number) => {
  if (val !== null && val !== undefined && val !== '') return true;
  return 'The field is required';
};

watch(
  () => props.element.data,
  (data) => Object.assign(elementData, cloneDeep(data)),
);
</script>

<style lang="scss" scoped>
.tce-multiple-choice {
  text-align: left;
}
</style>
