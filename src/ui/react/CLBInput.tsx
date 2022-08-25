import * as React from 'react'
import '../webcomponents/CLBInput'

type Props = {
	readonly disabled?: boolean
}

export const CLBInput = ({ disabled = false }: Props) => (
	<clb-input disabled={disabled}></clb-input>
)
