import React from 'react';

interface CLBSelectFieldProps {
	label: string;
	helper?: string;
	name?: string;
	isRequired?: boolean;
	isDisabled?: boolean;
	children?: React.ReactNode|string;
}

// @ts-ignore
const CLBSelectField: React.FC<CLBSelectFieldProps> = ({label, helper, name, isRequired, isDisabled, children}) => {
  return (
		// @ts-ignore
		<label className="hs-select-field">
			<span className="hs-select-field__label">{label}</span>
			<select name={name} required={isRequired} className="hs-select-field__input" disabled={isDisabled}>
				{children}
			</select>
			<span className="hs-select-field__helper">{helper}</span>
		</label>
  );
};

export default CLBSelectField;
