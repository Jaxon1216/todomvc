import { useState } from "react"
import CodeBlock from "./CodeBlock"
import type { CodeSnippet } from "../data/codeSnippets"

interface CodeCompareProps {
  snippets: {
    js: CodeSnippet
    vue: CodeSnippet
    react: CodeSnippet
  }
}

const tabs = [
  { key: "js" as const, label: "JS 原生", color: "text-yellow-600 border-yellow-500" },
  { key: "vue" as const, label: "Vue", color: "text-green-600 border-green-500" },
  { key: "react" as const, label: "React", color: "text-blue-600 border-blue-500" },
]

export default function CodeCompare({ snippets }: CodeCompareProps) {
  const [activeTab, setActiveTab] = useState<"js" | "vue" | "react">("js")

  return (
    <div>
      <div className="flex md:hidden border-b border-gray-200 mb-0">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === tab.key
                ? `${tab.color} border-b-2`
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
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

      <div className="hidden md:grid md:grid-cols-3 gap-4">
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
