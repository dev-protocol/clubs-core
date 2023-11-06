# CLBFormField

Select fields lets the user pick an option from a finite set of choices, and validate the option in a context of a form,
or simple filtering.

![img.png](../_media/select-field.png)

```jsx
<CLBSelectField
	label="String"
	name="String"
	type="String"
	helper="String"
	isRequired
	isDisabled
>
	<option value="Option">Option</option>
	...
</CLBSelectField>
```

## Props

> `*` = required

| Prop        | Type    | Default | Description                        |
|-------------|---------|---------|------------------------------------|
| label*      | string  | null    | The component's label.             |
| name*       | string  | null    | The component's name.              |
| type        | string  | null    | The component's type.              |
| helper      | string  | null    | The component's helper text.       |
| isRequired  | boolean | false   | Whether the component is required. |
| isDisabled  | boolean | false   | Whether the component is disabled. |

## Slots
| Slot    | Description                          |
|---------|--------------------------------------|
| default | Entry point for `<option>` elements. |

## Detailed API Documentation

A detailed API documentation is available whenever you want to change something in the component manually--like using
the class names API, or CSS variables API. The documentation is located in
the [Hashi documentation](https://hashi-docs.netlify.app/docs/develop/select-field) of this component's base component.
