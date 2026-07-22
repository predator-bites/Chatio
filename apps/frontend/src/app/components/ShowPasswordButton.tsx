import React from 'react';
import { Icon } from './Icon';

export interface ShowPasswordButtonProps {
  showPassword: boolean;
  onToggle: () => void;
}

export const ShowPasswordButton: React.FC<ShowPasswordButtonProps> = ({
  showPassword,
  onToggle,
}) => (
  <button
    type="button"
    id="btn-toggle-password"
    aria-label={showPassword ? 'Hide password' : 'Show password'}
    onClick={onToggle}
    className="text-secondary/50 p-1 active:text-secondary transition-colors duration-150"
  >
    {showPassword ? (
      <Icon iconSlug="eyeOff" className="w-[18px] h-[18px]" />
    ) : (
      <Icon iconSlug="eye" className="w-[18px] h-[18px]" />
    )}
  </button>
);

export default ShowPasswordButton;
