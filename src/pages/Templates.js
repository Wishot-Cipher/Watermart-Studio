import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Card from '@/components/Card';
export default function Templates() {
    return (_jsxs("div", { className: "max-w-5xl mx-auto", children: [_jsx("h3", { className: "text-h3 mb-4", children: "Templates" }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4", children: [1, 2, 3, 4, 5, 6].map(i => (_jsx(Card, { variant: "standard", children: _jsxs("div", { className: "h-40 flex items-center justify-center", children: ["Template ", i] }) }, i))) })] }));
}
