# CLBButton

```vue
<template>
	<CLBButton>Click Me</CLBButton>
</template>
```

## Props

| Prop       | Type    | Default | Description                     |
| ---------- | ------- | ------- | ------------------------------- |
| link       | String  | null    | The link required.              |
| isDisabled | Boolean | false   | Whether the button is disabled. |
| type       | String  | ''      | The type of button.             |

### Available types

- Filled
- Outlined
- Large
- Small
- Fullwidth\*
- Contained\*

> - = not available on the skeleton version.

## Slots

| Slot    | Description      |
| ------- | ---------------- |
| default | The button text. |
| icon    | The button icon. |
