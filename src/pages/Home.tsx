import { Link } from "react-router-dom"
import { chapters } from "../data/codeSnippets"

export default function Home() {
  return (
    <div>
      <div className="mb-10 pb-8 border-b border-gray-200">
        <h1 className="text-3xl font-bold mb-3 text-gray-900">
          Todo List 三框架对比教程
        </h1>
        <p className="text-base text-gray-600 leading-relaxed max-w-2xl">
          通过同一个 Todo List 项目，对比学习
          <span className="font-semibold text-yellow-600"> JavaScript 原生</span>、
          <span className="font-semibold text-green-600"> Vue </span>和
          <span className="font-semibold text-blue-600"> React </span>
          的写法差异。每一章都有三种实现的代码并排对比，帮你快速理解框架之间的异同。
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {chapters.map((chapter, i) => (
          <Link
            key={chapter.id}
            to={`/chapter/${chapter.id}`}
            className="group block p-5 rounded-lg border border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm transition-all no-underline"
          >
            <div className="text-xs font-semibold text-blue-600 mb-1.5">
              第 {i + 1} 章
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1.5 group-hover:text-blue-600 transition-colors">
              {chapter.title}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              {chapter.description}
            </p>
            <div className="mt-3 text-xs text-gray-400">
              {chapter.sections.length} 个小节
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
