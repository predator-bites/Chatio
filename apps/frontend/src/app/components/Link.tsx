import React from 'react';
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from 'react-router-dom';

interface LinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  underline?: boolean;
  to?: RouterLinkProps['to'];
  href?: string;
}

export const Link: React.FC<LinkProps> = ({
  children,
  underline = true,
  className = '',
  to,
  href,
  ...rest
}) => {
  const classes = [
    'text-secondary font-semibold transition-opacity duration-150',
    'active:opacity-60',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-1 rounded',
    underline ? 'underline underline-offset-2' : 'no-underline',
    className,
  ].join(' ');

  if (to) {
    return (
      <RouterLink className={classes} to={to} {...(rest as any)}>
        {children}
      </RouterLink>
    );
  }

  return (
    <a className={classes} href={href} {...rest}>
      {children}
    </a>
  );
};

export default Link;
