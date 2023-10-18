# CLBTier
Tiers are a Clubs exclusive UI component. This is used for the rewards tier section of your DAO.

## Usage
```vue
<template>
  <CLBTier title="CLBTier" subtitle="500 DEV">
    <CLBButton type="filled">Select</CLBButton>
  </CLBTier>
</template>

<script>
import {CLBTier} from '@devprotocol/clubs-core/ui/vue';

export default {
  components: {CLBTier}
}
</script>
```

## Props
| Prop     | Type    | Default | Description                 |
|----------|---------|---------|-----------------------------|
| title    | String  | null    | The component's title.      |
| subtitle | String  | null    | The component's subtitle.   |
| media    | String  | null    | The component's media file. |

## Slots
| Slot    | Description                                                         |
|---------|---------------------------------------------------------------------|
| default | The component's action slot. This is where buttons usually live in. |
