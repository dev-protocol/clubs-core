# CLBFormField

Form fields take and validate inputs the user in a context of a form, or simple querying.

![img.png](../_media/form-field.png)

```vue
<template>
  <CLBFormField
      label="String"
      name="String"
      type="String"
      inputType="String"
      helper="String"
      placeholder="String"
      rows="Number"
      isRequired="Boolean"
      isDisabled="Boolean"
      isReadonly="Boolean"
  />
</template>

<script>
import {CLBFormField} from '@devprotocol/clubs-core/ui/vue';

export default {
  components: {CLBFormField}
}
</script>
```

## Props

> `*` = required

| Prop        | Type    | Default | Description                        |
|-------------|---------|---------|------------------------------------|
| label*      | String  | n/a     | The component's label.             |
| name*       | String  | n/a     | The component's name.              |
| type        | String  | null    | The component's type.              |
| inputType*  | String  | n/a     | The component's input type.        |
| helper      | String  | null    | The component's helper text.       |
| placeholder | String  | null    | The component's placeholder.       |
| rows        | Number  | 5       | The component's rows.              |
| isRequired  | Boolean | false   | Whether the component is required. |
| isDisabled  | Boolean | false   | Whether the component is disabled. |
| isReadonly  | Boolean | false   | Whether the component is readonly. |

## Detailed API Documentation

A detailed API documentation is available whenever you want to change something in the component manually--like using
the class names API, or CSS variables API. The documentation is located in
the [Hashi documentation](https://hashi-docs.netlify.app/docs/develop/form-field) of this component's base component.
