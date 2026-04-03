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
    <div className="relative rounded-lg overflow-hidden border border-stone-200/80 shadow-sm">
      {title && (
        <div className="flex items-center justify-between px-4 py-2 bg-[#1e1e1e] border-b border-stone-700/50">
          <span className="text-[11px] font-[var(--font-body)] font-semibold text-stone-400 uppercase tracking-wider">
            {title}
          </span>
          <button
            onClick={handleCopy}
            className="text-[11px] font-[var(--font-body)] px-2.5 py-0.5 rounded-md bg-white/10 text-stone-400 hover:bg-white/15 hover:text-stone-300 transition-colors cursor-pointer"
          >
            {copied ? "已复制 ✓" : "复制"}
          </button>
        </div>
      )}
      {!title && (
        <button
          onClick={handleCopy}
          className="absolute top-2.5 right-2.5 text-[11px] font-[var(--font-body)] px-2.5 py-0.5 rounded-md bg-stone-800/90 text-stone-400 hover:bg-stone-700 hover:text-stone-300 transition-colors cursor-pointer z-10"
        >
          {copied ? "已复制 ✓" : "复制"}
        </button>
      )}
      <Highlight theme={themes.vsDark} code={code.trim()} language={language}>
        {({ tokens, getLineProps, getTokenProps }) => (
          <pre className="p-4 overflow-x-auto text-[13px] leading-[1.7] m-0 bg-[#1e1e1e] font-mono">
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                <span className="inline-block w-7 text-right mr-4 text-stone-600 select-none text-[11px]">
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
