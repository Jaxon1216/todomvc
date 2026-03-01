import { useParams, Link } from "react-router-dom"
import { chapters } from "../data/codeSnippets"
import CodeCompare from "../components/CodeCompare"

export default function ChapterPage() {
  const { id } = useParams()
  const chapterIndex = chapters.findIndex((c) => c.id === id)
  const chapter = chapters[chapterIndex]

  if (!chapter) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-gray-400 mb-4">章节不存在</h1>
        <Link to="/" className="text-blue-600 hover:underline">
          返回首页
        </Link>
      </div>
    )
  }

  const prevChapter = chapters[chapterIndex - 1]
  const nextChapter = chapters[chapterIndex + 1]

  return (
    <div>
      <div className="mb-8 pb-6 border-b border-gray-200">
        <div className="text-sm font-semibold text-blue-600 mb-1">
          第 {chapterIndex + 1} 章
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {chapter.title}
        </h1>
        <p className="text-gray-500">{chapter.description}</p>
      </div>

      <div className="space-y-12">
        {chapter.sections.map((section, i) => (
          <section key={i}>
            <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <span className="text-xs font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded border border-gray-200">
                {chapterIndex + 1}.{i + 1}
              </span>
              {section.title}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              {section.explanation}
            </p>
            <CodeCompare snippets={section.snippets} />
          </section>
        ))}
      </div>

      <div className="flex justify-between items-center mt-14 pt-6 border-t border-gray-200">
        {prevChapter ? (
          <Link
            to={`/chapter/${prevChapter.id}`}
            className="group text-left no-underline"
          >
            <div className="text-xs text-gray-400 mb-0.5">上一章</div>
            <div className="text-blue-600 group-hover:underline text-sm font-medium">
              ← {prevChapter.title}
            </div>
          </Link>
        ) : (
          <div />
        )}
        {nextChapter ? (
          <Link
            to={`/chapter/${nextChapter.id}`}
            className="group text-right no-underline"
          >
            <div className="text-xs text-gray-400 mb-0.5">下一章</div>
            <div className="text-blue-600 group-hover:underline text-sm font-medium">
              {nextChapter.title} →
            </div>
          </Link>
        ) : (
          <Link to="/" className="group text-right no-underline">
            <div className="text-xs text-gray-400 mb-0.5">完成</div>
            <div className="text-blue-600 group-hover:underline text-sm font-medium">
              返回首页 →
            </div>
          </Link>
        )}
      </div>
    </div>
  )
}
