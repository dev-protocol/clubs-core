import React from 'react';

type CheckboxTypes = 'raised';

interface CLBCheckboxProps {
	name?: string;
	type?: CheckboxTypes|string,
	value?: string;
	label: string;
	helper?: string;
	media?: string;
	mediaAlt?: string;
	isChecked?: boolean;
	onChange?: (() => void|any);
}

const CLBCheckbox: React.FC<CLBCheckboxProps> = ({value, name, label, type, helper, media, mediaAlt, isChecked, onChange}) => {

	const _assertType = (type: string): string => {
		const finalTypes: string[] = [];
		type.split(' ').forEach((type) => {
			finalTypes.push('is-' + type);
		});
		return finalTypes.join(' ');
	}

  return (
		<label className={`hs-tick-field${type ? ' ' + _assertType(type) : ''}`}>
			<input
				className="hs-tick-field__input"
				type="checkbox"
				id={value}
				name={name}
				value={value}
				onChange={onChange}
				checked={isChecked}
			/>
			{media &&
				<img
					className="hs-tick-field__sprite"
					src={media}
					width="32"
					height="32"
					alt={mediaAlt}
				/>
			}
			<div style={{display: 'flex', flexFlow: 'column nowrap', alignItems: 'start'}}>
				<span className="hs-tick-field__label">{label}</span>
				{helper && <span className="hs-tick-field__helper">{helper}</span>}
			</div>
		</label>
  );
};

export default CLBCheckbox;
