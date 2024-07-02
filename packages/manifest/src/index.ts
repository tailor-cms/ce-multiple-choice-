import { v4 as uuid } from 'uuid';

import type {
  DataInitializer,
  ElementData,
  ElementManifest,
} from './interfaces';

const [uuid1, uuid2, uuid3] = Array.from({ length: 3 }, () => uuid());

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
  correct: [uuid1],
  answers: {
    [uuid1]: 'First answer',
    [uuid2]: 'Second answer',
    [uuid3]: 'Third answer',
  },
});

// Can be loaded from package.json
export const version = '1.0';

// UI configuration for Tailor CMS
const ui = {
  // Display icon, https://pictogrammers.com/library/mdi/
  icon: 'mdi-order-mool-ascending-variant',
  // Does element support only full width or can be used within layouts
  // (e.g. 50/50 layout)
  forceFullWidth: true,
};

export const mocks = {
  displayContexts: [
    { name: 'No selection', data: {} },
    { name: 'Two selected answers', data: { state: [uuid2, uuid3] } },
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
