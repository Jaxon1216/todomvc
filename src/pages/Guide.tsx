export default function Guide() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-[var(--font-display)] text-3xl font-bold text-[var(--color-ink)] mb-8 tracking-tight">
        使用教程
      </h1>

      <section className="mb-10">
        <h2 className="font-[var(--font-display)] text-xl font-bold text-[var(--color-ink)] mb-4">
          学习建议
        </h2>
        <ul className="space-y-2.5 font-[var(--font-body)] text-[var(--color-ink-light)] text-[14px] leading-relaxed list-disc pl-5">
          <li>先通读每章的文字说明，理解概念后再看代码</li>
          <li>两栏代码<b className="text-[var(--color-ink)]">横向对比</b>着看，关注同一功能在 Vue 和 React 中的写法差异</li>
          <li>不要只看不写——把代码复制到本地项目里跑一遍，改参数看效果</li>
          <li>按章节顺序学习：CRUD 基础 → 状态管理 → 路由 → 持久化</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="font-[var(--font-display)] text-xl font-bold text-[var(--color-ink)] mb-4">
          两个框架的语法重点
        </h2>
        <div className="space-y-4">
          <div className="p-5 rounded-xl border border-emerald-200/80 bg-emerald-50/40">
            <h3 className="font-[var(--font-display)] font-bold text-emerald-800 mb-3 text-[16px]">
              Vue + Pinia
            </h3>
            <ul className="text-[13px] font-[var(--font-body)] text-emerald-900/70 space-y-1.5 list-disc pl-5">
              <li>模板语法：v-if、v-for、v-model、@click、:class</li>
              <li>响应式系统：ref() 创建响应式变量，Proxy 拦截修改，自动更新 UI</li>
              <li>Pinia：defineStore + computed + 直接修改（push/splice）</li>
              <li>Vue Router：createRouter + watch route.params 同步状态</li>
              <li>持久化：useLocalStorage composable（替换 ref，零改动）</li>
            </ul>
          </div>

          <div className="p-5 rounded-xl border border-sky-200/80 bg-sky-50/40">
            <h3 className="font-[var(--font-display)] font-bold text-sky-800 mb-3 text-[16px]">
              React + Redux Toolkit
            </h3>
            <ul className="text-[13px] font-[var(--font-body)] text-sky-900/70 space-y-1.5 list-disc pl-5">
              <li>JSX：三元表达式替代 v-if，map 替代 v-for，className 替代 :class</li>
              <li>受控组件：value + onChange 配对（Vue 用 v-model 一行搞定）</li>
              <li>Redux Toolkit：createSlice + Immer「假装直接改」+ createSelector 缓存</li>
              <li>React Router：BrowserRouter + useParams + useEffect 同步</li>
              <li>持久化：store.subscribe 统一监听，或 reducer 内手动写入</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="p-6 rounded-xl bg-amber-50/60 border border-amber-200/80">
        <p className="text-[14px] font-[var(--font-body)] text-[var(--color-ink-light)] leading-relaxed">
          看代码时遇到不理解、不会的语法？
        </p>
        <p className="text-[18px] font-[var(--font-display)] font-bold text-[var(--color-accent)] mt-2">
          复制代码块，直接问 AI！
        </p>
        <p className="text-[13px] font-[var(--font-body)] text-[var(--color-ink-faint)] mt-1.5">
          把代码贴给 ChatGPT / Claude / Cursor，问「这段代码什么意思」，比查文档快 10 倍。
        </p>
      </section>
    </div>
  )
}
