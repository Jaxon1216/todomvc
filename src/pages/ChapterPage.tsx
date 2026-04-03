import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { chapters } from "../data/codeSnippets"
import CodeCompare from "../components/CodeCompare"

function ThinkingGuide({ content }: { content: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="mb-5 rounded-lg border border-amber-200/80 bg-amber-50/50">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-[13px] font-[var(--font-body)] font-medium text-amber-800 hover:bg-amber-100/50 rounded-lg transition-colors cursor-pointer"
      >
        <span className="text-xs">{open ? "▾" : "▸"}</span>
        <span>动手前想一想</span>
        <span className="ml-auto text-[11px] text-amber-500/80 font-normal">
          {open ? "收起" : "展开思路引导"}
        </span>
      </button>
      {open && (
        <div className="px-4 pb-3.5 pt-0">
          <pre className="whitespace-pre-wrap text-[13px] text-amber-900/70 leading-relaxed font-mono bg-amber-100/30 rounded-md p-3.5">
            {content}
          </pre>
        </div>
      )}
    </div>
  )
}

export default function ChapterPage() {
  const { id } = useParams()
  const chapterIndex = chapters.findIndex((c) => c.id === id)
  const chapter = chapters[chapterIndex]

  if (!chapter) {
    return (
      <div className="text-center py-20">
        <h1 className="font-[var(--font-display)] text-2xl font-bold text-[var(--color-ink-faint)] mb-4">
          章节不存在
        </h1>
        <Link to="/" className="text-[var(--color-react)] hover:underline font-[var(--font-body)] text-sm">
          返回首页
        </Link>
      </div>
    )
  }

  const prevChapter = chapters[chapterIndex - 1]
  const nextChapter = chapters[chapterIndex + 1]

  return (
    <div>
      <div className="mb-10 pb-6 border-b border-[var(--color-line)]">
        <div className="text-[10px] font-[var(--font-body)] font-bold tracking-[0.15em] uppercase text-[var(--color-ink-faint)] mb-2">
          Chapter {chapterIndex + 1}
        </div>
        <h1 className="font-[var(--font-display)] text-3xl font-bold text-[var(--color-ink)] mb-2 tracking-tight">
          {chapter.title}
        </h1>
        <p className="text-[var(--color-ink-light)] font-[var(--font-body)] text-[15px]">
          {chapter.description}
        </p>
      </div>

      <div className="space-y-14">
        {chapter.sections.map((section, i) => (
          <section key={i}>
            <h2 className="font-[var(--font-display)] text-xl font-bold text-[var(--color-ink)] mb-2 flex items-center gap-2.5">
              <span className="text-[10px] font-[var(--font-body)] font-bold bg-[var(--color-parchment)] text-[var(--color-ink-faint)] px-2 py-0.5 rounded border border-[var(--color-line)] tracking-wider">
                {chapterIndex + 1}.{i + 1}
              </span>
              {section.title}
            </h2>
            <p className="text-[var(--color-ink-light)] font-[var(--font-body)] text-[14px] leading-[1.75] mb-5">
              {section.explanation}
            </p>
            {section.thinkingGuide && (
              <ThinkingGuide content={section.thinkingGuide} />
            )}
            <CodeCompare snippets={section.snippets} />
          </section>
        ))}
      </div>

      <div className="flex justify-between items-center mt-16 pt-6 border-t border-[var(--color-line)]">
        {prevChapter ? (
          <Link to={`/chapter/${prevChapter.id}`} className="group text-left no-underline">
            <div className="text-[10px] font-[var(--font-body)] tracking-[0.1em] uppercase text-[var(--color-ink-faint)] mb-1">
              上一章
            </div>
            <div className="text-[var(--color-accent)] group-hover:underline text-sm font-[var(--font-body)] font-medium">
              ← {prevChapter.title}
            </div>
          </Link>
        ) : (
          <div />
        )}
        {nextChapter ? (
          <Link to={`/chapter/${nextChapter.id}`} className="group text-right no-underline">
            <div className="text-[10px] font-[var(--font-body)] tracking-[0.1em] uppercase text-[var(--color-ink-faint)] mb-1">
              下一章
            </div>
            <div className="text-[var(--color-accent)] group-hover:underline text-sm font-[var(--font-body)] font-medium">
              {nextChapter.title} →
            </div>
          </Link>
        ) : (
          <Link to="/demo" className="group text-right no-underline">
            <div className="text-[10px] font-[var(--font-body)] tracking-[0.1em] uppercase text-[var(--color-ink-faint)] mb-1">
              下一步
            </div>
            <div className="text-[var(--color-accent)] group-hover:underline text-sm font-[var(--font-body)] font-medium">
              工程级 Demo →
            </div>
          </Link>
        )}
      </div>
    </div>
  )
}
