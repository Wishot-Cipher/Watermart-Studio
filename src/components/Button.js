import { jsx as _jsx } from "react/jsx-runtime";
import cn from 'clsx';
export default function Button({ variant = 'primary', size = 'regular', className, children, ...rest }) {
    const base = 'btn-base font-semibold transition-transform disabled:opacity-50 disabled:cursor-not-allowed';
    const sizeClass = cn({
        'btn-lg': size === 'lg',
        'btn-regular': size === 'regular',
        'btn-sm': size === 'sm',
    });
    const variantClass = cn({
        // primary: gradient background, white text, hover scale + glow
        'text-white primary-gradient': variant === 'primary',
        // secondary: glass background, blue text
        'text-[var(--color-primary)] glass border border-[var(--border-bright)]': variant === 'secondary',
        // outline: transparent with bright border
        'bg-transparent border-2 border-[var(--border-bright)] text-[var(--color-primary)]': variant === 'outline',
        // ghost: transparent, subtle hover
        'bg-transparent text-[var(--color-primary)] hover:bg-[rgba(26,124,255,0.1)]': variant === 'ghost',
    });
    return (_jsx("button", { className: cn(base, sizeClass, variantClass, className), ...rest, children: children }));
}
