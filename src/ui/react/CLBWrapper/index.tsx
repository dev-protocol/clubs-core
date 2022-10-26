import React from 'react';
import './style.scss';

interface CLBWrapperProps {
  children: React.ReactNode;
}

const CLBWrapper: React.FC<CLBWrapperProps> = ({children}) => {
  return (
    <>
			{children}
    </>
  );
};

export default CLBWrapper;
