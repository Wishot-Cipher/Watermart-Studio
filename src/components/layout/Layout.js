import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import GridBackground from '@/components/GridBackground';
export default function Layout({ children }) {
    return (_jsxs("div", { className: "min-h-screen bg-[#000913] text-[#F4F8FF]", children: [_jsx(GridBackground, {}), _jsx(Header, {}), _jsx(Sidebar, {}), _jsx("main", { className: "relative z-10 min-h-screen mt-1 pt-4", children: _jsx("div", { className: "lg:ml-24 pt-[72px] lg:pt-0", children: _jsx("div", { className: "max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-12 py-8 lg:py-10", children: children }) }) }), _jsx(Footer, {})] }));
}
