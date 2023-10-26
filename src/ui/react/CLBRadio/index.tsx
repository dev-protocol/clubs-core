import React from 'react'

// eslint-disable-next-line functional/no-mixed-type
interface CLBRadioProps {
	readonly name?: string
	readonly id?: string
	readonly value?: string
	readonly type?: string
	readonly label: string
	readonly helper?: string
	readonly media?: string
	readonly mediaAlt?: string
	readonly isChecked?: boolean
	readonly isDisabled?: boolean
	// eslint-disable-next-line functional/no-return-void
	readonly onChange?: () => void
}

const CLBRadio: React.FC<CLBRadioProps> = ({
	value,
	name,
	id = value,
	type,
	label,
	helper,
	media,
	mediaAlt,
	isChecked,
	isDisabled,
	onChange,
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
		<label
			className={`hs-tick-field${type ? ' ' + _assertType(type) : ''}${
				isDisabled ? ' is-disabled' : ''
			}`}
		>
			<input
				className="hs-tick-field__input"
				type="radio"
				id={id}
				name={name}
				value={value}
				onChange={onChange}
				checked={isChecked}
				disabled={isDisabled}
			/>
			{media && (
				<img
					className="hs-tick-field__sprite"
					src={media}
					width="32"
					height="32"
					alt={mediaAlt}
				/>
			)}
			<div
				style={{
					display: 'flex',
					flexFlow: 'column nowrap',
					alignItems: 'start',
				}}
			>
				<span className="hs-tick-field__label">{label}</span>
				{helper && <span className="hs-tick-field__helper">{helper}</span>}
			</div>
		</label>
	)
}

export default CLBRadio
