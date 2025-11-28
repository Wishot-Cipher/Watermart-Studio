import { Bell } from 'lucide-react'
import Button from '@/components/Button'

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md mb-2">
      <div className="w-full">
        <div className="max-w-[1400px] w-full mx-auto flex items-center justify-between h-18 md:h-[72px] px-6 lg:px-10 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl primary-gradient flex items-center justify-center">
              <span className="text-white font-semibold">WM</span>
            </div>
            <div className="text-(--text-primary) font-semibold pl-1.5">WaterMark Studio</div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" aria-label="Upload">Upload</Button>
            <button className="relative p-2 rounded-md hover:bg-[rgba(255,255,255,0.02)]">
              <Bell className="w-5 h-5 text-(--text-primary)" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-(--color-secondary)" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
