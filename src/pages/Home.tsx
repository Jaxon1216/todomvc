import { Link } from "react-router-dom"
import { chapters } from "../data/codeSnippets"

export default function Home() {
  return (
    <div>
      <div className="mb-12 pb-8 border-b border-[var(--color-line)]">
        <h1 className="font-[var(--font-display)] text-4xl md:text-5xl font-bold mb-4 text-[var(--color-ink)] tracking-tight leading-tight">
          Todo List
          <br />
          <span className="text-[var(--color-ink-light)] text-3xl md:text-4xl">Vue vs React 对比教程</span>
        </h1>
        <p className="text-[15px] font-[var(--font-body)] text-[var(--color-ink-light)] leading-relaxed max-w-xl mt-4">
          围绕同一个 Todo List 工程项目，逐章拆解
          <span className="font-semibold text-[var(--color-vue)]"> Vue + Pinia </span>和
          <span className="font-semibold text-[var(--color-react)]"> React + Redux Toolkit </span>
          的核心差异。
        </p>
        <div className="flex gap-2.5 mt-5">
          <span className="px-3 py-1 rounded-full text-[11px] font-[var(--font-body)] font-medium bg-[var(--color-vue-light)] text-emerald-800 tracking-wide">
            Vue · Pinia · Vue Router
          </span>
          <span className="px-3 py-1 rounded-full text-[11px] font-[var(--font-body)] font-medium bg-[var(--color-react-light)] text-sky-800 tracking-wide">
            React · Redux Toolkit · React Router
          </span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {chapters.map((chapter, i) => (
          <Link
            key={chapter.id}
            to={`/chapter/${chapter.id}`}
            className="group block p-6 rounded-xl border border-[var(--color-line)] bg-[var(--color-card)] hover:border-stone-300 hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-200 no-underline"
          >
            <div className="text-[10px] font-[var(--font-body)] font-bold tracking-[0.15em] uppercase text-[var(--color-ink-faint)] mb-2">
              Chapter {i + 1}
            </div>
            <h3 className="font-[var(--font-display)] text-lg font-bold text-[var(--color-ink)] mb-2 group-hover:text-[var(--color-accent)] transition-colors">
              {chapter.title}
            </h3>
            <p className="text-[13px] font-[var(--font-body)] text-[var(--color-ink-light)] leading-relaxed">
              {chapter.description}
            </p>
            <div className="mt-4 flex items-center gap-2 text-[11px] font-[var(--font-body)] text-[var(--color-ink-faint)]">
              <span>{chapter.sections.length} 个小节</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
