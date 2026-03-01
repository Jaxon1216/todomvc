import { NavLink } from "react-router-dom"
import { chapters } from "../data/codeSnippets"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-gray-50 border-r border-gray-200 z-50 transform transition-transform duration-200 overflow-y-auto flex flex-col md:translate-x-0 md:sticky md:top-0 md:z-auto md:shrink-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 flex-1">
          <NavLink
            to="/"
            onClick={onClose}
            className="block text-base font-bold text-gray-800 mb-6 hover:text-blue-600 transition-colors no-underline"
          >
            Todo 三框架对比
          </NavLink>

          <nav className="space-y-0.5">
            {chapters.map((chapter, i) => (
              <NavLink
                key={chapter.id}
                to={`/chapter/${chapter.id}`}
                onClick={onClose}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-sm transition-colors no-underline ${
                    isActive
                      ? "bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`
                }
              >
                {i + 1}. {chapter.title}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-5 border-t border-gray-200">
          <NavLink
            to="/guide"
            onClick={onClose}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-sm font-semibold no-underline transition-colors ${
                isActive
                  ? "bg-red-50 text-red-700"
                  : "text-red-500 hover:bg-red-50 hover:text-red-700"
              }`
            }
          >
            📖 使用教程
          </NavLink>
        </div>
      </aside>
    </>
  )
}
