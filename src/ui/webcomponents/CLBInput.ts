import type { TemplateResult } from 'lit'
import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('clb-input')
export class CLBInput extends LitElement {
	readonly value: number = 0

	@property({ type: Boolean })
	readonly disabled: boolean = false

	static readonly styles = css`
		/*_tailwind_*/
	`

	render(): TemplateResult {
		return html`<input
			type="number"
			?disabled=${this.disabled}
			class="p-4"
			value=${this.value}
		/>`
	}
}
