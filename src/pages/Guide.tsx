export default function Guide() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">使用教程</h1>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          学习建议
        </h2>
        <ul className="space-y-2 text-gray-600 text-sm leading-relaxed list-disc pl-5">
          <li>先通读每章的文字说明，理解概念后再看代码</li>
          <li>三栏代码<b>横向对比</b>着看，关注同一个功能在不同框架中的写法差异</li>
          <li>不要只看不写——把代码复制到本地项目里跑一遍，改一改参数看效果</li>
          <li>按章节顺序学习，后面的章节依赖前面的知识</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          各框架语法重点
        </h2>
        <div className="space-y-4">
          <div className="p-4 rounded-lg border border-yellow-200 bg-yellow-50">
            <h3 className="font-semibold text-yellow-700 mb-2">
              JavaScript 原生
            </h3>
            <ul className="text-sm text-yellow-900/80 space-y-1 list-disc pl-5">
              <li>直接操作 DOM（createElement、appendChild、innerHTML）</li>
              <li>手动管理状态和渲染——改了数据要自己更新页面</li>
              <li>事件绑定用 addEventListener 或 onclick</li>
              <li>没有组件系统，代码组织靠函数拆分</li>
            </ul>
          </div>

          <div className="p-4 rounded-lg border border-green-200 bg-green-50">
            <h3 className="font-semibold text-green-700 mb-2">Vue</h3>
            <ul className="text-sm text-green-900/80 space-y-1 list-disc pl-5">
              <li>模板语法：v-if、v-for、v-model、@click</li>
              <li>响应式系统：ref() 创建响应式变量，改 .value 自动更新</li>
              <li>单文件组件：template + script + style 写在一个 .vue 文件</li>
              <li>provide/inject 实现跨组件通信</li>
            </ul>
          </div>

          <div className="p-4 rounded-lg border border-blue-200 bg-blue-50">
            <h3 className="font-semibold text-blue-700 mb-2">React</h3>
            <ul className="text-sm text-blue-900/80 space-y-1 list-disc pl-5">
              <li>JSX：一切都是 JS，用三元表达式替代 v-if，用 map 替代 v-for</li>
              <li>useState：state 变了组件函数重新执行，必须用 setter 修改</li>
              <li>不可变更新：永远创建新数组/对象，不直接 push/splice</li>
              <li>Context + useContext 实现跨组件通信</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="p-5 rounded-lg bg-red-50 border border-red-200">
        <p className="text-sm text-gray-700 leading-relaxed">
          看代码时遇到不理解、不会的语法？
        </p>
        <p className="text-base font-bold text-red-600 mt-2">
          复制代码块，直接问 AI！
        </p>
        <p className="text-sm text-gray-500 mt-1">
          把代码贴给 ChatGPT / Claude / Cursor，问「这段代码什么意思」，比查文档快 10 倍。
        </p>
      </section>
    </div>
  )
}
