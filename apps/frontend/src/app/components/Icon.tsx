import { lazy, Suspense } from 'react';

const icons = {
  menu: lazy(() => import('lucide-react').then((m) => ({ default: m.Menu }))),
  x: lazy(() => import('lucide-react').then((m) => ({ default: m.X }))),
  loader: lazy(() =>
    import('lucide-react').then((m) => ({ default: m.Loader })),
  ),
  alertCircle: lazy(() =>
    import('lucide-react').then((m) => ({ default: m.AlertCircle })),
  ),
  checkCircle: lazy(() =>
    import('lucide-react').then((m) => ({ default: m.CheckCircle })),
  ),
  info: lazy(() => import('lucide-react').then((m) => ({ default: m.Info }))),
  triangleAlert: lazy(() =>
    import('lucide-react').then((m) => ({ default: m.TriangleAlert })),
  ),
  send: lazy(() => import('lucide-react').then((m) => ({ default: m.Send }))),
  logOut: lazy(() =>
    import('lucide-react').then((m) => ({ default: m.LogOut })),
  ),
  messageSquare: lazy(() =>
    import('lucide-react').then((m) => ({ default: m.MessageSquare })),
  ),
  plus: lazy(() => import('lucide-react').then((m) => ({ default: m.Plus }))),
  arrowLeft: lazy(() =>
    import('lucide-react').then((m) => ({ default: m.ArrowLeft })),
  ),
  userPlus: lazy(() =>
    import('lucide-react').then((m) => ({ default: m.UserPlus })),
  ),
  copy: lazy(() => import('lucide-react').then((m) => ({ default: m.Copy }))),
  check: lazy(() => import('lucide-react').then((m) => ({ default: m.Check }))),
  trash2: lazy(() =>
    import('lucide-react').then((m) => ({ default: m.Trash2 })),
  ),
  lock: lazy(() => import('lucide-react').then((m) => ({ default: m.Lock }))),
  eye: lazy(() => import('lucide-react').then((m) => ({ default: m.Eye }))),
  eyeOff: lazy(() =>
    import('lucide-react').then((m) => ({ default: m.EyeOff })),
  ),
  mail: lazy(() => import('lucide-react').then((m) => ({ default: m.Mail }))),
  user: lazy(() => import('lucide-react').then((m) => ({ default: m.User }))),
} as const;

export type IconSlug = keyof typeof icons;

const sizeClass: Record<NonNullable<Props['size']>, string> = {
  big: 'w-[30px] h-[30px]',
  medium: 'w-[15px] h-[15px]',
  small: 'w-[10px] h-[10px]',
};

interface Props {
  iconSlug: IconSlug;
  className?: string;
  wrapperClassName?: string;
  size?: 'small' | 'medium' | 'big';
  wrapped?: boolean;
  onClick?: () => void;
}

export function Icon({
  iconSlug,
  className = '',
  wrapperClassName = '',
  size,
  wrapped,
  onClick,
}: Props) {
  const LucideIcon = icons[iconSlug];

  const iconClasses = [
    'transition-all duration-150 hover:scale-110',
    size ? sizeClass[size] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const element = (
    <Suspense fallback={null}>
      <LucideIcon className={iconClasses} onClick={onClick} />
    </Suspense>
  );

  if (!wrapped) return element;

  return (
    <div className={`flex items-center justify-center ${wrapperClassName}`}>
      {element}
    </div>
  );
}

export default Icon;
