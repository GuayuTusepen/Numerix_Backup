import type { SVGProps } from 'react';

const NumerixLogoIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width="48" height="48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="50" cy="50" r="45" fill="hsl(var(--primary))"/>
    <path d="M30 70L40 30L50 50L60 30L70 70" stroke="hsl(var(--primary-foreground))" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="30" cy="70" r="5" fill="hsl(var(--accent))"/>
    <circle cx="70" cy="70" r="5" fill="hsl(var(--accent))"/>
    <circle cx="40" cy="30" r="5" fill="hsl(var(--accent))"/>
    <circle cx="60" cy="30" r="5" fill="hsl(var(--accent))"/>
    <circle cx="50" cy="50" r="5" fill="hsl(var(--accent))"/>
  </svg>
);


export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
  };
  const iconSize = {
    sm: 32,
    md: 40,
    lg: 48,
  }

  return (
    <div className="flex items-center gap-2">
      <NumerixLogoIcon width={iconSize[size]} height={iconSize[size]} />
      <span className={`font-bold ${sizeClasses[size]} text-primary`}>
        Numerix
      </span>
    </div>
  );
}
