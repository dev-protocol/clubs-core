/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-mixed-types */
import React from 'react'
import './overrides.scss'

type ButtonVariant = 'outlined' | 'filled'
type ButtonState = 'success' | 'warning' | 'danger' | 'disabled'
type ButtonType =
	| ButtonVariant
	| ButtonState
	| `${ButtonVariant} ${ButtonState}`

interface CLBButtonProps {
	readonly type?: ButtonType | string
	readonly icon?: React.ReactElement | string
	readonly link?: string
	readonly onClick?: () => React.MouseEventHandler | void
	readonly children?: React.ReactNode | string
	readonly isDisabled?: boolean
}

const CLBButton: React.FC<CLBButtonProps> = ({
	icon,
	type,
	link,
	isDisabled,
	onClick,
	children,
}) => {
	const ButtonBase: React.ReactNode = (
		<>
			{icon && <i className="hs-button__icon">{icon}</i>}
			{<span className="hs-button__label">{children}</span>}
		</>
	)

	const _assertType = (type: string): string => {
		const finalTypes: string[] = []
		type.split(' ').forEach((type) => {
			// eslint-disable-next-line functional/immutable-data
			finalTypes.push('is-' + type)
		})
		return finalTypes.join(' ')
	}

	if (!link || onClick) {
		return (
			<button
				className={`hs-button${type ? ' ' + _assertType(type) : ''}`}
				onClick={onClick}
				disabled={isDisabled}
			>
				{ButtonBase}
			</button>
		)
	}

	const isLinkExternal = !!(
		link.startsWith('http://') || link.startsWith('https://')
	)

	return (
		<a
			href={link}
			className={`hs-button${type ? ' ' + _assertType(type) : ''}`}
			target={isLinkExternal ? '_blank' : '_self'}
		>
			{ButtonBase}
		</a>
	)
}

export default CLBButton
