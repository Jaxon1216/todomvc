import { useState } from "react"
import { demoVersions } from "../data/demoSnippets"
import type { DemoVersion } from "../data/demoSnippets"
import CodeBlock from "../components/CodeBlock"

function DirTreeBlock({ version }: { version: DemoVersion }) {
  return (
    <div className="mb-8">
      <div className={`inline-block px-3 py-1 rounded-full text-[11px] font-[var(--font-body)] font-bold mb-3 ${version.color}`}>
        {version.label} 项目结构
      </div>
      <CodeBlock code={version.dirTree} language="bash" title="目录结构" />
      <p className="mt-3 text-[13px] font-[var(--font-body)] text-[var(--color-ink-light)] leading-relaxed">
        {version.dirDescription}
      </p>
    </div>
  )
}

function FileBlock({ filename, code, language, description }: {
  filename: string
  code: string
  language: string
  description: string
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <code className="text-[13px] font-mono font-semibold text-[var(--color-ink)] bg-[var(--color-parchment)] px-2 py-0.5 rounded border border-[var(--color-line)]">
          {filename}
        </code>
        <span className="text-[11px] font-[var(--font-body)] text-[var(--color-ink-faint)]">{description}</span>
      </div>
      <CodeBlock code={code} language={language} title={filename} />
    </div>
  )
}

const dotColors: Record<string, string> = {
  vue: "bg-emerald-500",
  react: "bg-sky-500",
}

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState<string>("vue")

  const activeVersion = demoVersions.find(v => v.id === activeTab)!

  return (
    <div>
      <div className="mb-10 pb-6 border-b border-[var(--color-line)]">
        <div className="text-[10px] font-[var(--font-body)] font-bold tracking-[0.15em] uppercase text-[var(--color-ink-faint)] mb-2">
          Full Demo
        </div>
        <h1 className="font-[var(--font-display)] text-3xl font-bold text-[var(--color-ink)] mb-2 tracking-tight">
          工程级 Todo List 完整实现
        </h1>
        <p className="text-[var(--color-ink-light)] font-[var(--font-body)] text-[14px] leading-relaxed max-w-2xl">
          两个版本的完整工程代码，展示真实项目中的目录结构、组件拆分、状态管理、路由集成和数据持久化。
          Vue 版用 Pinia + Vue Router，React 版用 Redux Toolkit + React Router。
        </p>
      </div>

      <div className="flex border-b border-[var(--color-line)] mb-8 sticky top-0 bg-[var(--color-cream)]/95 backdrop-blur-sm z-10 -mx-6 px-6 md:-mx-12 md:px-12">
        {demoVersions.map(v => (
          <button
            key={v.id}
            onClick={() => setActiveTab(v.id)}
            className={`px-5 py-3 text-[13px] font-[var(--font-body)] font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === v.id
                ? "text-[var(--color-ink)] border-b-2 border-[var(--color-ink)]"
                : "text-[var(--color-ink-faint)] hover:text-[var(--color-ink-light)]"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${dotColors[v.id] ?? "bg-gray-400"}`} />
            {v.label}
          </button>
        ))}
      </div>

      <DirTreeBlock version={activeVersion} />

      <div className="space-y-14">
        {activeVersion.sections.map((section, si) => (
          <section key={si}>
            <h2 className="font-[var(--font-display)] text-xl font-bold text-[var(--color-ink)] mb-2 flex items-center gap-2.5">
              <span className="text-[10px] font-[var(--font-body)] font-bold bg-[var(--color-parchment)] text-[var(--color-ink-faint)] px-2 py-0.5 rounded border border-[var(--color-line)] tracking-wider">
                {si + 1}
              </span>
              {section.title}
            </h2>
            <p className="text-[var(--color-ink-light)] font-[var(--font-body)] text-[14px] leading-[1.75] mb-5 whitespace-pre-line">
              {section.explanation}
            </p>
            <div className="space-y-6">
              {section.files.map((file, fi) => (
                <FileBlock
                  key={fi}
                  filename={file.filename}
                  code={file.code}
                  language={file.language}
                  description={file.description}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-14 pt-6 border-t border-[var(--color-line)]">
        <div className="p-6 rounded-xl bg-[var(--color-card)] border border-[var(--color-line)] shadow-sm">
          <p className="text-[14px] font-[var(--font-display)] font-bold text-[var(--color-ink)] mb-3">
            学习建议
          </p>
          <ul className="text-[13px] font-[var(--font-body)] text-[var(--color-ink-light)] space-y-2 list-disc pl-5">
            <li>对比 Vue 和 React 同名组件（如 TodoItem），体会 v-model vs value+onChange、v-if vs 三元表达式的差异</li>
            <li>关注状态管理差异：Pinia 的 defineStore vs Redux Toolkit 的 createSlice</li>
            <li>对比持久化策略：Vue 的 useLocalStorage composable vs React 的 store.subscribe</li>
            <li>把代码复制到本地项目里跑一遍，改改参数看效果</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
