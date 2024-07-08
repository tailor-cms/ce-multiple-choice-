import baseManifest from '@tailor-cms/ce-multiple-choice-manifest';
import type { ElementManifest } from '@tailor-cms/ce-multiple-choice-manifest';

import Display from './components/Display.vue';

const manifest: ElementManifest = {
  ...baseManifest,
  Display,
};

export default manifest;
export { Display };
