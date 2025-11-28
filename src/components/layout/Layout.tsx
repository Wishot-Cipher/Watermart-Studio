import React from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'
import GridBackground from '@/components/GridBackground'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#000913] text-[#F4F8FF]">
      <GridBackground />
      <Header />
      <Sidebar />
       <main className="relative z-10 min-h-screen mt-1 pt-4">
         {/* Desktop: left margin for sidebar, Mobile: top padding for header */}
         <div className="lg:ml-24 pt-[72px] lg:pt-0">
          <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-12 py-8 lg:py-10">
             {children}
           </div>
         </div>
       </main>
      <Footer />
    </div>
  )
}
