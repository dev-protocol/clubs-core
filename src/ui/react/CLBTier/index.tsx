import React from 'react';
import CLBSkeleton from './CLBSkeleton';
import './style.scss';

interface CLBTierProps {
	title: string;
	subtitle?: string;
	media?: string;
	children?: React.ReactNode|string;
}

const CLBTier: React.FC<CLBTierProps> = ({title, subtitle, media, children}) => {
	return (
		<div className="clb-tier">
			{media &&
				<img
					src="media"
					className="clb-tier__media"
					alt={`Media file of the ${ title } badge.`}
				/>
			}
			{!media &&
				<CLBSkeleton />
			}
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
