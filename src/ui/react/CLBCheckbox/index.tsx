import React from 'react';

interface CLBCheckboxProps {
	name?: string;
	value?: string;
	label: string;
	helper?: string;
	media?: string;
	mediaAlt?: string;
	isChecked?: boolean;
	onChange?: (() => void|any);
}

const CLBCheckbox: React.FC<CLBCheckboxProps> = ({value, name, label, helper, media, mediaAlt, isChecked, onChange}) => {
  return (
		<label className="hs-tick-field">
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
