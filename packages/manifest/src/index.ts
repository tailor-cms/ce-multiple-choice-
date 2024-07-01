import { v4 as uuidv4 } from 'uuid';

import type {
  DataInitializer,
  ElementData,
  ElementManifest,
} from './interfaces';

// Element unique id within the target system (e.g. Tailor)
export const type = 'ORG_CUSTOM_ELEMENT';

// Display name (e.g. shown to the author)
export const name = 'Custom element';

// Function which inits element state (data property on the Content Element
// entity)
// e.g. for simple counter component:
export const initState: DataInitializer = (): ElementData => ({
  question:
    'What is the answer to the Ultimate Question of Life, the Universe, and Everything?',
  correct: [],
  answers: [
    { id: uuidv4(), value: 'First answer' },
    { id: uuidv4(), value: 'Second answer' },
    { id: uuidv4(), value: 'Third answer' },
  ],
});

// Can be loaded from package.json
export const version = '1.0';

// UI configuration for Tailor CMS
const ui = {
  // Display icon, https://pictogrammers.com/library/mdi/
  icon: 'mdi-cube',
  // Does element support only full width or can be used within layouts
  // (e.g. 50/50 layout)
  forceFullWidth: true,
};

export const mocks = {
  displayContexts: [
    { name: 'Test preset 1', data: { state: 'I have a value' } },
    { name: 'Test preset 2', data: { state: 'I have a different value' } },
  ],
};

const manifest: ElementManifest = {
  type,
  version: '1.0',
  name,
  ssr: false,
  initState,
  ui,
  mocks,
};

export default manifest;
export * from './interfaces';
