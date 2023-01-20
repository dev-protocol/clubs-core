# CLBCheckbox

```vue
<template>
	<CLBCheckbox />
</template>
```

## Props

> `*`: Required

| Prop      | Type     | Default | Description                                                     |
| --------- | -------- | ------- | --------------------------------------------------------------- |
| name\*    | String   | null    | The component's name.                                           |
| value     | String   | null    | The component's default value.                                  |
| label\*   | String   | null    | The component's label.                                          |
| helper    | String   | null    | The component's helper text.                                    |
| media     | String   | null    | The sprite/icon for the left side of the component.             |
| mediaAlt  | String   | null    | The alt text for the media.                                     |
| isChecked | Boolean  | false   | Boolean toggle to set the checkbox to checked or not.           |
| onChange  | Function | null    | Function to execute when watching for changes to the component. |
