import React from 'react';
import './style.scss';

interface CLBWrapperProps {
  children: React.ReactNode;
}

const Index: React.FC<CLBWrapperProps> = ({children}) => {
  return (
    <>
			{children}
    </>
  );
};

export default Index;
