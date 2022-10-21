import React from 'react';
import './overrides.scss';

type ButtonVariant = 'outlined' | 'filled';
type ButtonState = 'success' | 'warning' | 'danger' | 'disabled';
type ButtonType = ButtonVariant | ButtonState | `${ButtonVariant} ${ButtonState}`;

interface CLBButtonProps {
	type?: ButtonType|string;
	icon?: React.ReactElement|string;
	link?: string;
	onClick?: () => React.MouseEventHandler|void;
	children?: React.ReactNode|string;
	isDisabled?: boolean;
}

// @ts-ignore
const CLBButton: React.FC<CLBButtonProps> = ({icon, type, link, isDisabled, onClick, children }) => {

	// @ts-ignore
	const ButtonBase: React.ReactNode = (
		<>
			{icon && <i className='hs-button__icon'>{icon}</i>}
			{<span className='hs-button__label'>{children}</span>}
		</>
	);

	const _assertType = (type: string): string => {
		const finalTypes: string[] = [];
		type.split(' ').forEach((type) => {
			finalTypes.push('is-' + type);
		});
		return finalTypes.join(' ');
	};

	if (!link || onClick) {
		return (
			<button
				className={`hs-button${type ? ' ' + _assertType(type) : ''}`}
				onClick={onClick}
				disabled={isDisabled}
			>
				{ButtonBase}
			</button>
		);
	}

	const isLinkExternal: boolean = !!(link.startsWith('http://') || link.startsWith('https://'));

	return (
		<a
			href={link}
			className={`hs-button${type ? ' ' + _assertType(type) : ''}`}
			target={isLinkExternal ? '_blank' : '_self'}
		>
			{ButtonBase}
		</a>
	);
};

export default CLBButton;
