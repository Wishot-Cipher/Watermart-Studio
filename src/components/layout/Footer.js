import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { Heart, Github, Twitter, Mail, Sparkles } from 'lucide-react';
export default function Footer() {
    const currentYear = new Date().getFullYear();
    const socialLinks = [
        { icon: Github, href: '#', label: 'GitHub' },
        { icon: Twitter, href: '#', label: 'Twitter' },
        { icon: Mail, href: '#', label: 'Email' },
    ];
    const footerLinks = [
        {
            title: 'Product',
            links: ['Features', 'Pricing', 'Templates', 'API'],
        },
        {
            title: 'Company',
            links: ['About', 'Blog', 'Careers', 'Contact'],
        },
        {
            title: 'Resources',
            links: ['Documentation', 'Help Center', 'Community', 'Updates'],
        },
        {
            title: 'Legal',
            links: ['Privacy', 'Terms', 'Security', 'Cookies'],
        },
    ];
    return (_jsxs("footer", { className: "relative border-t border-white/5 bg-[#031B2F]/50 backdrop-blur-xl mt-20 lg:ml-24", children: [_jsx("div", { className: "absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#1A7CFF] to-transparent opacity-50" }), _jsxs("div", { className: "max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-12", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12", children: [_jsxs("div", { className: "lg:col-span-2", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, className: "flex items-center gap-3 mb-4", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-0 bg-linear-to-br from-[#1A7CFF] to-[#A24BFF] rounded-xl blur-lg opacity-50" }), _jsx("div", { className: "relative w-10 h-10 bg-linear-to-br from-[#1A7CFF] to-[#A24BFF] rounded-xl flex items-center justify-center", children: _jsx(Sparkles, { className: "w-5 h-5 text-white" }) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold text-[#F4F8FF]", children: "WaterMark Studio" }), _jsx("p", { className: "text-xs text-[#9FB2C8]", children: "Professional Edition" })] })] }), _jsx("p", { className: "text-sm text-[#9FB2C8] mb-4 max-w-xs", children: "Transform your images with professional watermarks. Fast, beautiful, and AI-powered." }), _jsx("div", { className: "flex items-center gap-3", children: socialLinks.map((social, index) => (_jsx(motion.a, { href: social.href, initial: { opacity: 0, scale: 0.8 }, whileInView: { opacity: 1, scale: 1 }, viewport: { once: true }, transition: { delay: index * 0.1 }, whileHover: { scale: 1.1, y: -2 }, className: "w-10 h-10 rounded-xl bg-[#0A2540]/50 hover:bg-[#0F2F50] border border-white/5 hover:border-[#1A7CFF]/30 flex items-center justify-center transition-all group", "aria-label": social.label, children: _jsx(social.icon, { className: "w-5 h-5 text-[#9FB2C8] group-hover:text-[#1A7CFF] transition-colors" }) }, social.label))) })] }), footerLinks.map((section, sectionIndex) => (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { delay: sectionIndex * 0.1 }, children: [_jsx("h4", { className: "text-sm font-semibold text-[#F4F8FF] mb-4", children: section.title }), _jsx("ul", { className: "space-y-2", children: section.links.map((link) => (_jsx("li", { children: _jsx("a", { href: "#", className: "text-sm text-[#9FB2C8] hover:text-[#1A7CFF] transition-colors inline-block", children: link }) }, link))) })] }, section.title)))] }), _jsx("div", { className: "pt-8 border-t border-white/5", children: _jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-between gap-4", children: [_jsxs("p", { className: "text-sm text-[#9FB2C8] text-center sm:text-left", children: ["\u00A9 ", currentYear, " WaterMark Studio. All rights reserved."] }), _jsxs("div", { className: "flex items-center gap-2 text-sm text-[#9FB2C8]", children: [_jsx("span", { children: "Made with" }), _jsx(Heart, { className: "w-4 h-4 text-red-500 fill-red-500 animate-pulse" }), _jsx("span", { children: "by the WaterMark Team" })] })] }) })] })] }));
}
