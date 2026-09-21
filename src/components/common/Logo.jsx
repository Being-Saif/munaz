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
  const gradId = `munaz-mark-${variant}`;
  const c1 = variant === 'light' ? '#FFFFFF' : '#7E57C2';
  const c2 = variant === 'light' ? '#F9A8D4' : '#EC4899';
  const mColor = variant === 'light' ? '#7E57C2' : '#FFFFFF';
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="10" y1="14" x2="40" y2="46" gradientUnits="userSpaceOnUse">
          <stop stopColor={c1} />
          <stop offset="1" stopColor={c2} />
        </linearGradient>
      </defs>
      {/* Shopping bag body (gradient fill) */}
      <path
        d="M11 16 H37 L38.6 42 C38.7 43.6 37.4 45 35.8 45 H12.2 C10.6 45 9.3 43.6 9.4 42 L11 16 Z"
        fill={`url(#${gradId})`}
      />
      {/* Bag handles */}
      <path
        d="M17 18 V13 C17 9.1 20.1 6 24 6 C27.9 6 31 9.1 31 13 V18"
        stroke={c1}
        strokeWidth="2.6"
        strokeLinecap="round"
        fill="none"
      />
      {/* 'M' embossed on the bag */}
      <path
        d="M17 38 V27 C17 26 18.2 25.6 18.9 26.4 L24 32 L29.1 26.4 C29.8 25.6 31 26 31 27 V38"
        stroke={mColor}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
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
