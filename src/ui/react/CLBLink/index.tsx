import React from 'react';

interface CLBLinkProps {
	link: string;
  	children?: React.ReactNode|string;
}

const CLBLink: React.FC<CLBLinkProps> = ({link, children}) => {

	const isLinkExternal: boolean = !!(link.startsWith('http://') || link.startsWith('https://'));

  return (
		<a href={link} className="hs-link" target={isLinkExternal ? '_blank' : '_self'}>
			{children}
		</a>
  );
};

export default CLBLink;
