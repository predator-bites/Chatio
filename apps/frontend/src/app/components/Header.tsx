import React from 'react';
import { Logo } from './Logo';

interface HeaderProps {
  logoSize?: number;
  className?: string;
  children?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  logoSize = 64,
  className = 'flex flex-col items-center',
  children,
}) => {
  return (
    <header className={`w-full ${className}`}>
      {children ? children : <Logo size={logoSize} />}
    </header>
  );
};

export default Header;
