import React from 'react';

interface LogoProps {
  /** Size of the logo image in pixels (square). Defaults to 56. */
  size?: number;
  /** Show the "ChatIO" wordmark below the image. Defaults to true. */
  showWordmark?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 56,
  showWordmark = true,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <img
        src="/logo.png"
        alt="ChatIO logo"
        width={size}
        height={size}
        className="object-contain drop-shadow-md"
        style={{ width: size, height: size }}
      />
    </div>
  );
};

export default Logo;
