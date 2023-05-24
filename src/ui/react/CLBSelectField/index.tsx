import React from 'react';

type SelectFieldTypes = 'error'|'raised';

interface CLBSelectFieldProps {
	label: string;
	helper?: string;
	name?: string;
	type?: SelectFieldTypes|string;
	isRequired?: boolean;
	isDisabled?: boolean;
	children?: React.ReactNode|string;
}

const CLBSelectField: React.FC<CLBSelectFieldProps> = ({label, helper, name, type, isRequired, isDisabled, children}) => {

	const _assertType = (type: string): string => {
		const finalTypes: string[] = [];
		type.split(' ').forEach((type) => {
			finalTypes.push('is-' + type);
		});
		return finalTypes.join(' ');
	}

  return (
		<label className={`hs-select-field${type ? ' ' + _assertType(type) : ''}`}>
			<span className="hs-select-field__label">{label}</span>
			<select name={name} required={isRequired} className="hs-select-field__input" disabled={isDisabled}>
				{children}
			</select>
			<span className="hs-select-field__helper">{helper}</span>
		</label>
  );
};

export default CLBSelectField;
