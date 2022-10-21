import React from 'react';
import CLBSkeleton from './CLBSkeleton';
import './style.scss';

interface CLBTierProps {
	title: string;
	subtitle?: string;
	id?: string;
	currency?: string;
	amount?: string;
	media?: string;
	children?: React.ReactNode|string;
}

// @ts-ignore
const CLBTier: React.FC<CLBTierProps> = ({title, subtitle, media, children}) => {
	return (
		// @ts-ignore
		<div className="clb-tier">
			{media &&
				<img
					src="media"
					className="clb-tier__media"
					alt={`Media file of the ${ title } badge.`}
				/>
			}
			{!media &&
				// @ts-ignore
				<CLBSkeleton />
			}
			{/* @ts-ignore */ }
			<div className="mb-2 grid">
				<div className="clb-tier__title">{title}</div>
				<div className="clb-tier__subtitle">{subtitle}</div>
			</div>
			{children &&
				<div className="clb-tier__actions">
					{children}
				</div>
			}
		</div>
  );
};

export default CLBTier;
