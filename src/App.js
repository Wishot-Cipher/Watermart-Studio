import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Layout from './components/layout/Layout';
import { ImagesProvider } from './contexts/ImagesContext';
// import Home from './pages/HomeClean'
import Editor from './pages/Editor';
import Templates from './pages/Templates';
import Settings from './pages/Settings';
import HomePage from './pages/Home';
export default function App() {
    return (_jsx(BrowserRouter, { children: _jsx(ImagesProvider, { children: _jsx(Layout, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(HomePage, {}) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) }), _jsx(Route, { path: "/editor", element: React.createElement(Editor) }), _jsx(Route, { path: "/templates", element: _jsx(Templates, {}) }), _jsx(Route, { path: "/settings", element: _jsx(Settings, {}) }), _jsx(Route, { path: "/settings", element: _jsx(Settings, {}) })] }) }) }) }));
}
