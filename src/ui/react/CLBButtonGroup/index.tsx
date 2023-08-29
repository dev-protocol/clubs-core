import React from 'react';

interface CLBButtonGroupProps {
	children?: React.ReactNode | string;
}

interface CLBButtonGroupItemProps {
	id: string;
	name: string;
	value: string;
	isChecked?: boolean;
	isDisabled?: boolean;
	children?: React.ReactNode | string;
}

export const CLBButtonGroup: React.FC<CLBButtonGroupProps> = ({children}) => {
	return (
		<div className="hs-button-group">
			{children}
		</div>
	);
};

export const CLBButtonGroupItem: React.FC<CLBButtonGroupItemProps> = ({id, name, value, isChecked, isDisabled, children}) => {
	return (
		<>
			<input id={id} type="radio" name={name} value={value} checked={isChecked} disabled={isDisabled} />
			<label htmlFor={id} className={`hs-button is-outlined${isDisabled ? ' is-disabled' : ''}`}>
				<span className="hs-button__label">{children}</span>
			</label>
		</>
	);
}
