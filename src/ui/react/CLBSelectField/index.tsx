import React from 'react';

type SelectFieldTypes = 'danger';

interface CLBSelectFieldProps {
	label: string;
	helper?: string;
	name?: string;
	type?: SelectFieldTypes|string;
	isRequired?: boolean;
	isDisabled?: boolean;
	children?: React.ReactNode|string;
}

// @ts-ignore
const CLBSelectField: React.FC<CLBSelectFieldProps> = ({label, helper, name, type, isRequired, isDisabled, children}) => {

	const _assertType = (type: string): string => {
		const finalTypes: string[] = [];
		type.split(' ').forEach((type) => {
			finalTypes.push('is-' + type);
		});
		return finalTypes.join(' ');
	}

  return (
		// @ts-ignore
		<label className={`hs-select-field is-filled${type ? ' ' + _assertType(type) : ''}`}>
			<span className="hs-select-field__label">{label}</span>
			<select name={name} required={isRequired} className="hs-select-field__input" disabled={isDisabled}>
				{children}
			</select>
			<span className="hs-select-field__helper">{helper}</span>
		</label>
  );
};

export default CLBSelectField;
