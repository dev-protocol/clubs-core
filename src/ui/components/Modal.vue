<script setup lang="ts">
import { Component as VueComponent } from 'vue'

defineProps<{
	eoa?: string
	modalClose?: () => void
	isVisible: boolean
	modalContent: VueComponent
	attrs: { [key: string]: any }
}>()
</script>

<style>
.modal-container {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	display: flex;
	justify-content: center;
	align-items: flex-end;
	z-index: 10;
}

@media (min-width: 1024px) {
	.modal-container {
		align-items: center;
	}
}

.modal-overlay {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background: rgba(0, 0, 0, 0.6);
	z-index: -1;
}

.modal-content {
	display: flex;
	flex-direction: column;
	padding: 1rem;
	width: 100%;
	max-width: 64rem;
	background: white;
	border-top-left-radius: 0.5rem;
	border-top-right-radius: 0.5rem;
	border-bottom-left-radius: 0;
	border-bottom-right-radius: 0;
	box-shadow: 0 0 1rem rgba(0, 0, 0, 0.2);

	max-height: 80vh;
	overflow-y: auto;
}

@media (min-width: 1024px) {
	.modal-content {
		border-bottom-left-radius: 0.5rem;
		border-bottom-right-radius: 0.5rem;
	}
}

.v-enter-active {
	transition: transform 600ms cubic-bezier(0.07, 1.28, 0.5, 1);
}

.v-leave-active {
	transition: transform 600ms linear;
}

.v-enter-from {
	transform: translate(0, 100%);
}

.v-leave-to {
	transform: translate(0, 0);
}

html:has(#modal-container[data-active='true']) {
	overflow: hidden;
}
</style>

<template>
	<div>
		<Teleport to="body">
			<div
				id="modal-container"
				v-show="isVisible"
				class="modal-container"
				:data-active="isVisible"
			>
				<div class="modal-overlay"></div>
				<Transition>
					<component
						:eoa="eoa"
						:modalClose="modalClose"
						v-show="isVisible"
						class="modal-content"
						:is="modalContent"
						v-bind="attrs"
					>
						<template #after:description>
							<slot name="after:description" />
						</template>
					</component>
				</Transition>
			</div>
		</Teleport>
	</div>
</template>
