import React from 'react';
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

  return (
    <footer className="relative border-t border-white/5 bg-[#031B2F]/50 backdrop-blur-xl mt-20 lg:ml-24">
      {/* Decorative gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1A7CFF] to-transparent opacity-50" />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-4"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1A7CFF] to-[#A24BFF] rounded-xl blur-lg opacity-50" />
                <div className="relative w-10 h-10 bg-gradient-to-br from-[#1A7CFF] to-[#A24BFF] rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#F4F8FF]">WaterMark Studio</h3>
                <p className="text-xs text-[#9FB2C8]">Professional Edition</p>
              </div>
            </motion.div>
            <p className="text-sm text-[#9FB2C8] mb-4 max-w-xs">
              Transform your images with professional watermarks. Fast, beautiful, and AI-powered.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 rounded-xl bg-[#0A2540]/50 hover:bg-[#0F2F50] border border-white/5 hover:border-[#1A7CFF]/30 flex items-center justify-center transition-all group"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-[#9FB2C8] group-hover:text-[#1A7CFF] transition-colors" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {footerLinks.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: sectionIndex * 0.1 }}
            >
              <h4 className="text-sm font-semibold text-[#F4F8FF] mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-[#9FB2C8] hover:text-[#1A7CFF] transition-colors inline-block"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#9FB2C8] text-center sm:text-left">
              © {currentYear} WaterMark Studio. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm text-[#9FB2C8]">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
              <span>by the WaterMark Team</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}