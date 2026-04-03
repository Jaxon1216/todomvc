import { useState } from "react"
import CodeBlock from "./CodeBlock"
import type { CodeSnippet } from "../data/codeSnippets"

interface CodeCompareProps {
  snippets: {
    vue: CodeSnippet
    react: CodeSnippet
  }
}

const tabs = [
  { key: "vue" as const, label: "Vue + Pinia", dotColor: "bg-emerald-500" },
  { key: "react" as const, label: "React + RTK", dotColor: "bg-sky-500" },
]

export default function CodeCompare({ snippets }: CodeCompareProps) {
  const [activeTab, setActiveTab] = useState<"vue" | "react">("vue")

  return (
    <div>
      <div className="flex md:hidden border-b border-[var(--color-line)] mb-0">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2.5 text-[13px] font-[var(--font-body)] font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === tab.key
                ? "text-[var(--color-ink)] border-b-2 border-[var(--color-ink)]"
                : "text-[var(--color-ink-faint)] hover:text-[var(--color-ink-light)]"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${tab.dotColor}`} />
            {tab.label}
          </button>
        ))}
      </div>
      <div className="md:hidden">
        <CodeBlock
          code={snippets[activeTab].code}
          language={snippets[activeTab].language}
          title={tabs.find((t) => t.key === activeTab)!.label}
        />
      </div>

      <div className="hidden md:grid md:grid-cols-2 gap-4">
        {tabs.map((tab) => (
          <CodeBlock
            key={tab.key}
            code={snippets[tab.key].code}
            language={snippets[tab.key].language}
            title={tab.label}
          />
        ))}
      </div>
    </div>
  )
}
