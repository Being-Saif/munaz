import { Link } from 'react-router-dom';
import { cn } from '@utils/cn';

/**
 * Munaz brand logo — an SVG monogram mark + wordmark.
 *
 * Props:
 *  - variant: 'dark' (default, for light backgrounds) | 'light' (for dark backgrounds)
 *  - size: 'sm' | 'md' (default) | 'lg'
 *  - showMark: include the monogram icon (default true)
 *  - to: wrap in a Link to this path (default '/'); pass null to render plain
 *  - className: extra classes
 */
const SIZES = {
  sm: { mark: 26, text: 'text-lg' },
  md: { mark: 32, text: 'text-2xl' },
  lg: { mark: 44, text: 'text-3xl sm:text-4xl' },
};

const ACCENT = '#EC4899'; // theme secondary (pink)

const LogoMark = ({ size, variant }) => {
  // Wordmark color: purple on light bg, white on dark bg.
  const primary = variant === 'light' ? '#FFFFFF' : '#7E57C2';
  const gradId = `munaz-mark-${variant}`;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor={variant === 'light' ? '#FFFFFF' : '#7E57C2'} />
          <stop offset="1" stopColor={variant === 'light' ? '#F9A8D4' : '#EC4899'} />
        </linearGradient>
      </defs>
      {/* Rounded badge */}
      <rect x="1.5" y="1.5" width="45" height="45" rx="12" stroke={primary} strokeWidth="2.5" opacity="0.9" />
      {/* Stylized 'M' — two elegant strokes meeting in a soft valley, purple→pink gradient */}
      <path
        d="M12 34 V16 C12 14.5 13.8 13.8 14.9 14.9 L24 26 L33.1 14.9 C34.2 13.8 36 14.5 36 16 V34"
        stroke={`url(#${gradId})`}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Pink accent dot — the 'jewel' of the mark */}
      <circle cx="24" cy="30.5" r="2.6" fill={ACCENT} />
    </svg>
  );
};

const Logo = ({ variant = 'dark', size = 'md', showMark = true, to = '/', className }) => {
  const s = SIZES[size] || SIZES.md;
  const textColor = variant === 'light' ? 'text-white' : 'text-dark';

  const inner = (
    <span className={cn('inline-flex items-center gap-2 select-none', className)}>
      {showMark && <LogoMark size={s.mark} variant={variant} />}
      <span className={cn('font-heading font-bold tracking-tight leading-none', s.text, textColor)}>
        Muna
        {/* final 'z' tinted pink to match the theme accent */}
        <span style={{ color: ACCENT }}>z</span>
      </span>
    </span>
  );

  if (to === null) return inner;

  return (
    <Link to={to} className="flex-shrink-0" aria-label="Munaz — home">
      {inner}
    </Link>
  );
};

export default Logo;
