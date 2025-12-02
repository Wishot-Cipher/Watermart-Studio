import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Card from '@/components/Card';
export default function Settings() {
    return (_jsxs("div", { className: "max-w-5xl mx-auto", children: [_jsx("h3", { className: "text-h3 mb-4", children: "Settings" }), _jsx(Card, { variant: "glass", children: _jsxs("div", { className: "flex flex-col gap-4", children: [_jsx("div", { children: "General Settings" }), _jsx("div", { children: "Export Settings" }), _jsx("div", { children: "Appearance" })] }) })] }));
}
