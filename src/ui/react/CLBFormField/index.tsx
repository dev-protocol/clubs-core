import React from 'react'

type FormFieldTypes = 'error' | 'raised'

interface CLBFormFieldProps {
	readonly label: string
	readonly helper?: string
	readonly type?: FormFieldTypes | string
	readonly inputType?: string
	readonly name?: string
	readonly placeholder?: string
	readonly rows?: number
	readonly isRequired?: boolean
	readonly isDisabled?: boolean
	readonly isReadonly?: boolean
}

const CLBFormField: React.FC<CLBFormFieldProps> = ({
	label,
	helper,
	type,
	inputType,
	name,
	placeholder,
	rows = 5,
	isRequired,
	isDisabled,
	isReadonly,
}) => {
	const _assertType = (type: string): string => {
		// eslint-disable-next-line functional/prefer-readonly-type
		const finalTypes: string[] = []
		// eslint-disable-next-line functional/no-expression-statement, functional/no-return-void
		type.split(' ').forEach((type) => {
			// eslint-disable-next-line functional/no-expression-statement, functional/immutable-data
			finalTypes.push('is-' + type)
		})
		return finalTypes.join(' ')
	}

	return (
		<label className={`hs-form-field${type ? ' ' + _assertType(type) : ''}`}>
			<span className="hs-form-field__label">{label}</span>
			{inputType !== 'textarea' && (
				<input
					required={isRequired}
					className="hs-form-field__input"
					name={name}
					type={inputType}
					placeholder={placeholder}
					disabled={isDisabled}
					readOnly={isReadonly}
				/>
			)}
			{inputType == 'textarea' && (
				<textarea
					className="hs-form-field__input"
					required={isRequired}
					rows={rows}
					name={name}
					placeholder={placeholder}
					disabled={isDisabled}
					readOnly={isReadonly}
				/>
			)}
			<span className="hs-form-field__helper">{helper}</span>
		</label>
	)
}

export default CLBFormField
