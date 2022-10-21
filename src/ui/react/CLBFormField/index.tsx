import React from 'react';

interface CLBFormFieldProps {
	label: string;
	helper?: string;
	type?: string;
	name?: string;
	placeholder?: string;
	rows?: number;
	isRequired?: boolean;
	isDisabled?: boolean;
	isReadonly?: boolean;
}

// @ts-ignore
const CLBFormField: React.FC<CLBFormFieldProps> = ({label, helper, type, name, placeholder, rows, isRequired, isDisabled, isReadonly}) => {
	return (
		// @ts-ignore
		<label className="hs-form-field is-filled">
			<span className="hs-form-field__label">{label}</span>
			{type !== 'textarea' &&
				<input required={isRequired} className="hs-form-field__input" name={name} type={type} placeholder={placeholder} disabled={isDisabled} readOnly={isReadonly} />
			}
			{type == 'textarea' &&
				<textarea className="hs-form-field__input" required={isRequired} rows={rows} name={name} placeholder={placeholder} disabled={isDisabled} readOnly={isReadonly} />
			}
			<span className="hs-form-field__helper">{helper}</span>
		</label>
  );
};

export default CLBFormField;
