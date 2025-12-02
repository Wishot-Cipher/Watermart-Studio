import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Bell } from 'lucide-react';
import Button from '@/components/Button';
import { useLocation } from 'react-router-dom';
export default function Header() {
    const location = useLocation();
    // Hide global header on pages that render their own page-level header (e.g. /editor)
    if (location.pathname.startsWith('/editor'))
        return null;
    return (_jsx("header", { className: "fixed top-0 left-0 right-0 z-40 backdrop-blur-md mb-2", children: _jsx("div", { className: "w-full", children: _jsxs("div", { className: "max-w-[1400px] w-full mx-auto flex flex-wrap items-center justify-between h-[72px] px-4 sm:px-6 lg:px-10", children: [_jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [_jsx("div", { className: "w-10 h-10 rounded-xl primary-gradient flex items-center justify-center shrink-0", children: _jsx("span", { className: "text-white font-semibold", children: "WM" }) }), _jsxs("div", { className: "truncate", children: [_jsx("div", { className: "text-base font-semibold", children: "WaterMark Studio" }), _jsx("div", { className: "text-xs text-[#9FB2C8] leading-tight", children: "Create beautiful watermarks" })] })] }), _jsxs("div", { className: "flex items-center gap-3 ml-4", children: [_jsx(Button, { variant: "ghost", size: "sm", "aria-label": "Upload", children: "Upload" }), _jsxs("button", { "aria-label": "Notifications", className: "relative p-2 rounded-md hover:bg-[rgba(255,255,255,0.02)]", children: [_jsx(Bell, { className: "w-5 h-5 text-[#F4F8FF]" }), _jsx("span", { className: "absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#1A7CFF]" })] })] })] }) }) }));
}
