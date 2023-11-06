# CLBTier
Tiers are a Clubs exclusive UI component. This is used for the rewards tier section of your DAO.

## Usage
```jsx
<CLBTier title="CLBTier" subtitle="500 DEV">
	<CLBButton type="filled">Select</CLBButton>
</CLBTier>
```

## Props
| Prop     | Type   | Default | Description                 |
|----------|--------|---------|-----------------------------|
| title    | string | null    | The component's title.      |
| subtitle | string | null    | The component's subtitle.   |
| media    | string | null    | The component's media file. |

## Slots
| Slot    | Description                                                         |
|---------|---------------------------------------------------------------------|
| default | The component's action slot. This is where buttons usually live in. |
