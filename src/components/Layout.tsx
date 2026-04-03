import { useState } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-[var(--color-cream)] text-[var(--color-ink)] flex">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(c => !c)}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="md:hidden sticky top-0 z-30 bg-[var(--color-cream)]/95 backdrop-blur-sm border-b border-[var(--color-line)] px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-[var(--color-ink-faint)] hover:text-[var(--color-ink)] cursor-pointer transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-[var(--font-display)] font-semibold text-sm text-[var(--color-ink)]">
            Vue vs React 对比
          </span>
        </header>

        <main className="flex-1 px-6 md:px-12 py-10  animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
