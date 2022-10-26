import React from 'react';

type FormFieldTypes = 'danger';

interface CLBFormFieldProps {
	label: string;
	helper?: string;
	type?: FormFieldTypes|string;
	inputType?: string;
	name?: string;
	placeholder?: string;
	rows?: number;
	isRequired?: boolean;
	isDisabled?: boolean;
	isReadonly?: boolean;
}

const CLBFormField: React.FC<CLBFormFieldProps> = ({label, helper, type, inputType, name, placeholder, rows, isRequired, isDisabled, isReadonly}) => {

	const _assertType = (type: string): string => {
		const finalTypes: string[] = [];
		type.split(' ').forEach((type) => {
			finalTypes.push('is-' + type);
		});
		return finalTypes.join(' ');
	}

	return (
		<label className={`hs-form-field is-filled${type ? ' ' + _assertType(type) : ''}`}>
			<span className="hs-form-field__label">{label}</span>
			{inputType !== 'textarea' &&
				<input required={isRequired} className="hs-form-field__input" name={name} type={inputType} placeholder={placeholder} disabled={isDisabled} readOnly={isReadonly} />
			}
			{inputType == 'textarea' &&
				<textarea className="hs-form-field__input" required={isRequired} rows={rows} name={name} placeholder={placeholder} disabled={isDisabled} readOnly={isReadonly} />
			}
			<span className="hs-form-field__helper">{helper}</span>
		</label>
  );
};

export default CLBFormField;
