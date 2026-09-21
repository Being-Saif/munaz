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
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="8" y1="4" x2="40" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor={c1} />
          <stop offset="1" stopColor={c2} />
        </linearGradient>
      </defs>
      {/* Lotus / bloom motif — an ethnic-fashion emblem (distinct from any boxed letter) */}
      {/* Center petal */}
      <path d="M24 5 C27 12 27 20 24 27 C21 20 21 12 24 5 Z" fill={`url(#${gradId})`} />
      {/* Left inner petal */}
      <path d="M24 27 C18 22 13 16 12 9 C19 11 24 17 26 25 Z" fill={`url(#${gradId})`} opacity="0.85" />
      {/* Right inner petal */}
      <path d="M24 27 C30 22 35 16 36 9 C29 11 24 17 22 25 Z" fill={`url(#${gradId})`} opacity="0.85" />
      {/* Left outer petal */}
      <path d="M24 28 C16 27 8 24 4 18 C11 16 20 19 25 26 Z" fill={`url(#${gradId})`} opacity="0.65" />
      {/* Right outer petal */}
      <path d="M24 28 C32 27 40 24 44 18 C37 16 28 19 23 26 Z" fill={`url(#${gradId})`} opacity="0.65" />
      {/* Base curve — like a graceful drape / stem */}
      <path d="M14 32 C18 38 30 38 34 32" stroke={c2} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Accent center */}
      <circle cx="24" cy="26" r="2" fill={c2} />
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
