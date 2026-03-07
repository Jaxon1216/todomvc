import { useState } from "react"
import { demoVersions } from "../data/demoSnippets"
import type { DemoVersion } from "../data/demoSnippets"
import CodeBlock from "../components/CodeBlock"

function DirTreeBlock({ version }: { version: DemoVersion }) {
  return (
    <div className="mb-8">
      <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${version.color}`}>
        {version.label} 项目结构
      </div>
      <CodeBlock code={version.dirTree} language="bash" title="目录结构" />
      <p className="mt-3 text-sm text-gray-600 leading-relaxed">
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
      <div className="flex items-center gap-2 mb-1.5">
        <code className="text-sm font-mono font-semibold text-gray-800 bg-gray-100 px-2 py-0.5 rounded">
          {filename}
        </code>
        <span className="text-xs text-gray-400">{description}</span>
      </div>
      <CodeBlock code={code} language={language} title={filename} />
    </div>
  )
}

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState<string>("react")

  const activeVersion = demoVersions.find(v => v.id === activeTab)!

  return (
    <div>
      <div className="mb-8 pb-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          工程级 Todo List 完整实现
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">
          三个版本的完整工程代码，展示真实项目中的目录结构、组件拆分、状态管理和本地存储。
          React 版采用渐进式讲解：useState → useReducer → Zustand。
        </p>
      </div>

      {/* Tab 切换 */}
      <div className="flex border-b border-gray-200 mb-8 sticky top-0 bg-white z-10 -mx-6 px-6 md:-mx-10 md:px-10">
        {demoVersions.map(v => (
          <button
            key={v.id}
            onClick={() => setActiveTab(v.id)}
            className={`px-5 py-3 text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === v.id
                ? `${v.color} border-b-2`
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* 目录结构 */}
      <DirTreeBlock version={activeVersion} />

      {/* 按 section 展示代码 */}
      <div className="space-y-12">
        {activeVersion.sections.map((section, si) => (
          <section key={si}>
            <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <span className="text-xs font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded border border-gray-200">
                {si + 1}
              </span>
              {section.title}
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-5 whitespace-pre-line">
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

      {/* 底部导航 */}
      <div className="mt-14 pt-6 border-t border-gray-200">
        <div className="p-5 rounded-lg bg-gradient-to-r from-blue-50 to-green-50 border border-blue-100">
          <p className="text-sm font-semibold text-gray-800 mb-2">
            学习建议
          </p>
          <ul className="text-sm text-gray-600 space-y-1.5 list-disc pl-5">
            <li>先看 React 的 useState 版理解基础，再看 useReducer 理解重构思路，最后看 Zustand 理解最佳实践</li>
            <li>对比 Vue 和 React 同名组件（如 TodoItem），体会 v-model vs value+onChange、v-if vs 三元表达式的差异</li>
            <li>把代码复制到本地项目里跑一遍，改改参数看效果</li>
            <li>遇到不懂的语法，复制代码块直接问 AI</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
