import { useState } from "react"
import { Highlight, themes } from "prism-react-renderer"

interface CodeBlockProps {
  code: string
  language: string
  title?: string
}

export default function CodeBlock({ code, language, title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative rounded-md overflow-hidden border border-gray-200">
      {title && (
        <div className="flex items-center justify-between px-4 py-2 bg-[#2d333b] border-b border-gray-700">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            {title}
          </span>
          <button
            onClick={handleCopy}
            className="text-xs px-2 py-0.5 rounded bg-gray-600 text-gray-300 hover:bg-gray-500 transition-colors cursor-pointer"
          >
            {copied ? "已复制 ✓" : "复制"}
          </button>
        </div>
      )}
      {!title && (
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded bg-gray-700/80 text-gray-300 hover:bg-gray-600 transition-colors cursor-pointer z-10"
        >
          {copied ? "已复制 ✓" : "复制"}
        </button>
      )}
      <Highlight theme={themes.vsDark} code={code.trim()} language={language}>
        {({ tokens, getLineProps, getTokenProps }) => (
          <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed m-0 bg-[#1e1e1e]">
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                <span className="inline-block w-7 text-right mr-3 text-gray-600 select-none text-xs">
                  {i + 1}
                </span>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  )
}
