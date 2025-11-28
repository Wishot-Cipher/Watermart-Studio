import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Layout from './components/layout/Layout'
import { ImagesProvider } from './contexts/ImagesContext'
// import Home from './pages/HomeClean'
import Editor from './pages/Editor'
import Templates from './pages/Templates'
import Settings from './pages/Settings'
import HomePage from './pages/Home'

export default function App() {
  return (
    <BrowserRouter>
      <ImagesProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
            <Route path="/editor" element={React.createElement(Editor as unknown as React.ComponentType)} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </ImagesProvider>
    </BrowserRouter>
  )
}
