import { NavLink } from "react-router-dom"
import { chapters } from "../data/codeSnippets"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  collapsed: boolean
  onToggleCollapse: () => void
}

export default function Sidebar({ isOpen, onClose, collapsed, onToggleCollapse }: SidebarProps) {
  const sidebarWidth = collapsed ? "w-14" : "w-64"

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen ${sidebarWidth} bg-[var(--color-sidebar)] z-50 transform transition-all duration-200 overflow-y-auto overflow-x-hidden flex flex-col md:translate-x-0 md:sticky md:top-0 md:z-auto md:shrink-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex items-center justify-center h-7 w-7 rounded-md hover:bg-white/10 text-stone-500 hover:text-stone-300 transition-colors cursor-pointer absolute top-4 right-2 z-10"
          title={collapsed ? "展开侧边栏" : "收起侧边栏"}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {collapsed ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            )}
          </svg>
        </button>

        <div className="p-5 flex-1">
          <NavLink
            to="/"
            onClick={onClose}
            className={`block font-[var(--font-display)] font-bold text-stone-200 mb-7 hover:text-white transition-colors no-underline ${
              collapsed ? "text-center text-lg" : "text-lg tracking-tight"
            }`}
            title="Vue vs React 对比"
          >
            {collapsed ? "T" : "Vue vs React"}
          </NavLink>

          <div className={`text-[10px] font-[var(--font-body)] font-semibold tracking-[0.15em] uppercase text-stone-500 mb-3 ${collapsed ? "hidden" : ""}`}>
            章节
          </div>

          <nav className="space-y-0.5">
            {chapters.map((chapter, i) => (
              <NavLink
                key={chapter.id}
                to={`/chapter/${chapter.id}`}
                onClick={onClose}
                title={`${i + 1}. ${chapter.title}`}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-[13px] font-[var(--font-body)] transition-colors no-underline whitespace-nowrap ${
                    isActive
                      ? "bg-white/10 text-white font-medium border-l-2 border-amber-500"
                      : "text-stone-400 hover:text-stone-200 hover:bg-white/5"
                  }`
                }
              >
                {collapsed ? `${i + 1}` : `${i + 1}. ${chapter.title}`}
              </NavLink>
            ))}

            <NavLink
              to="/demo"
              onClick={onClose}
              title="工程级 Demo"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-[13px] font-[var(--font-body)] font-semibold no-underline transition-colors whitespace-nowrap mt-2 ${
                  isActive
                    ? "bg-amber-500/15 text-amber-400"
                    : "text-amber-500/80 hover:bg-amber-500/10 hover:text-amber-400"
                }`
              }
            >
              {collapsed ? "◆" : "◆ 工程级 Demo"}
            </NavLink>
          </nav>
        </div>

        <div className="p-5 border-t border-white/10 space-y-1">
          <NavLink
            to="/guide"
            onClick={onClose}
            title="使用教程"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-[13px] font-[var(--font-body)] font-medium no-underline transition-colors whitespace-nowrap ${
                isActive
                  ? "bg-white/10 text-stone-200"
                  : "text-stone-500 hover:bg-white/5 hover:text-stone-300"
              }`
            }
          >
            {collapsed ? "?" : "使用教程"}
          </NavLink>
          <NavLink
            to="/about"
            onClick={onClose}
            title="关于"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-[13px] font-[var(--font-body)] font-medium no-underline transition-colors whitespace-nowrap ${
                isActive
                  ? "bg-white/10 text-stone-200"
                  : "text-stone-500 hover:bg-white/5 hover:text-stone-300"
              }`
            }
          >
            {collapsed ? "@" : "关于作者"}
          </NavLink>
        </div>
      </aside>
    </>
  )
}
