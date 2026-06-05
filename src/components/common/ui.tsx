import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

/** Labeled text input used throughout the section forms. */
export function Field({
  label,
  value,
  onChange,
  placeholder,
  optional,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  optional?: boolean;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-slate-600">
        {label}
        {optional && <span className="font-normal text-slate-400"> (optional)</span>}
      </span>
      <input
        type={type}
        className="mt-1 w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

const VARIANTS = {
  primary:
    'bg-indigo-600 text-white hover:bg-indigo-700 border border-transparent',
  default:
    'bg-white text-slate-700 hover:bg-slate-50 border border-slate-300',
  subtle:
    'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-transparent',
  danger:
    'bg-white text-red-600 hover:bg-red-50 border border-red-200',
  ghost:
    'bg-transparent text-slate-500 hover:bg-slate-100 border border-transparent',
} as const;

export function Button({
  variant = 'default',
  size = 'md',
  icon,
  children,
  className,
  ...rest
}: {
  variant?: keyof typeof VARIANTS;
  size?: 'sm' | 'md';
  icon?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded-md font-medium shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50',
        size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm',
        VARIANTS[variant],
        className,
      )}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}

/** Square icon-only button (delete, drag handle affordances, etc.). */
export function IconButton({
  icon,
  className,
  title,
  ...rest
}: { icon: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      className={cn(
        'inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700',
        className,
      )}
      {...rest}
    >
      {icon}
    </button>
  );
}
