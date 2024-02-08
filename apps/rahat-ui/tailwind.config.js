const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');
const _ = require('lodash');
// const libConfig = require('../../libs/shadcn/tailwind.config');

/** @type {import('tailwindcss').Config} */

const config = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  // ...require('@rahat-ui/shadcn/tailwind.config.js'),
};

module.exports = _.merge(config);
