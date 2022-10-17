import React from 'react';

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
