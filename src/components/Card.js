import { jsx as _jsx } from "react/jsx-runtime";
import cn from 'clsx';
export default function Card({ variant = 'standard', className, children, ...rest }) {
    const classes = cn(className, {
        'card-standard': variant === 'standard',
        'card-glass': variant === 'glass',
        'bg-[var(--bg-elevated)] rounded-xl p-6 shadow-elevated': variant === 'elevated',
    });
    return (_jsx("div", { className: classes, ...rest, children: children }));
}
