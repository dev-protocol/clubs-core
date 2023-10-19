# @devprotocol/clubs-core

## Development

### Debug general Clubs on local

Start your local Astro server with the following command:

```bash
yarn astro --root planned-structure/ dev
```

And you can debug your local plugin by editing the files under the 'example' folder.

### UI Development

1. Run `yarn preview`
2. Define/upgrade WebComponents on src/ui/webcomponents
3. Edit ui-preview/src/pages/index.astro if needed

### Exporting functions

1. Add your function and tests in `./src`
2. Export your function in `./src/index.ts`
3. Add your function to the `exports` section in `package.json`
4. Add function types to the `files` section in `package.json`
5. Add your function to `majorCoreAPIs` in `./rollup.config.mjs`
