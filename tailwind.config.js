const {clubs} = require('./dist/src/tailwind/index.js')

module.exports = {
	presets: [clubs],
  mode: 'jit',
  content: [
    './{planned-structure,src,example}/**/*.{astro,js,jsx,svelte,ts,tsx,vue}',
  ],
}
