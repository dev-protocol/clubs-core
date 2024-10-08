/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
import React from 'react'

type SelectFieldTypes = 'error' | 'raised'

interface CLBSelectFieldProps {
	readonly label: string
	readonly helper?: string
	readonly name?: string
	readonly type?: SelectFieldTypes | string
	readonly isRequired?: boolean
	readonly isDisabled?: boolean
	readonly children?: React.ReactNode | string
}

const CLBSelectField: React.FC<CLBSelectFieldProps> = ({
	label,
	helper,
	name,
	type,
	isRequired,
	isDisabled,
	children,
}) => {
	const _assertType = (type: string): string => {
		const finalTypes: string[] = []
		type.split(' ').forEach((type) => {
			// eslint-disable-next-line functional/immutable-data
			finalTypes.push('is-' + type)
		})
		return finalTypes.join(' ')
	}

	return (
		<label className={`hs-select-field${type ? ' ' + _assertType(type) : ''}`}>
			<span className="hs-select-field__label">{label}</span>
			<select
				name={name}
				required={isRequired}
				className="hs-select-field__input"
				disabled={isDisabled}
			>
				{children}
			</select>
			<span className="hs-select-field__helper">{helper}</span>
		</label>
	)
}

export default CLBSelectField
