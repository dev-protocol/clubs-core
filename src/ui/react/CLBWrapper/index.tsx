import React from 'react';
import './style.scss';

interface CLBWrapperProps {
  children: React.ReactNode;
}

// @ts-ignore
const CLBWrapper: React.FC<CLBWrapperProps> = ({children}) => {
  return (
    <>
			{children}
    </>
  );
};

export default CLBWrapper;
