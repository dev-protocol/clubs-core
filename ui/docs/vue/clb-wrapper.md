# CLBWrapper

This component initializes the entire Clubs UI theme for the project. This component should be instantiated at the root
of the Vue application.

```vue
<template>
	<CLBWrapper>
		<div>
			<!-- Your application code here -->
		</div>
	</CLBWrapper>
</template>

<script>
import { CLBWrapper } from '@devprotocol/clubs-core/ui/vue'

export default {
	components: {
		CLBWrapper,
	},
}
</script>
```
