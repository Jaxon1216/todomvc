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
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen ${sidebarWidth} bg-gray-50 border-r border-gray-200 z-50 transform transition-all duration-200 overflow-y-auto overflow-x-hidden flex flex-col md:translate-x-0 md:sticky md:top-0 md:z-auto md:shrink-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Collapse toggle (desktop only) */}
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex items-center justify-center h-8 w-8 rounded-md hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer absolute top-3 right-2 z-10"
          title={collapsed ? "展开侧边栏" : "收起侧边栏"}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            className={`block font-bold text-gray-800 mb-6 hover:text-blue-600 transition-colors no-underline ${
              collapsed ? "text-center text-lg" : "text-base"
            }`}
            title="Todo 三框架对比"
          >
            {collapsed ? "T" : "Todo 三框架对比"}
          </NavLink>

          <nav className="space-y-0.5">
            {chapters.map((chapter, i) => (
              <NavLink
                key={chapter.id}
                to={`/chapter/${chapter.id}`}
                onClick={onClose}
                title={`${i + 1}. ${chapter.title}`}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-sm transition-colors no-underline whitespace-nowrap ${
                    isActive
                      ? "bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`
                }
              >
                {collapsed ? `${i + 1}` : `${i + 1}. ${chapter.title}`}
              </NavLink>
            ))}

            {/* 工程级 Demo 紧跟第五章后面 */}
            <NavLink
              to="/demo"
              onClick={onClose}
              title="工程级 Demo"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-sm font-semibold no-underline transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-blue-500 hover:bg-blue-50 hover:text-blue-700"
                }`
              }
            >
              {collapsed ? "🚀" : "🚀 工程级 Demo"}
            </NavLink>
          </nav>
        </div>

        <div className="p-5 border-t border-gray-200 space-y-1">
          <NavLink
            to="/guide"
            onClick={onClose}
            title="使用教程"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-sm font-semibold no-underline transition-colors whitespace-nowrap ${
                isActive
                  ? "bg-red-50 text-red-700"
                  : "text-red-500 hover:bg-red-50 hover:text-red-700"
              }`
            }
          >
            {collapsed ? "📖" : "📖 使用教程"}
          </NavLink>
          <NavLink
            to="/about"
            onClick={onClose}
            title="关于"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-sm font-semibold no-underline transition-colors whitespace-nowrap ${
                isActive
                  ? "bg-gray-200 text-gray-800"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              }`
            }
          >
            {collapsed ? "👤" : "👤 关于"}
          </NavLink>
        </div>
      </aside>
    </>
  )
}
