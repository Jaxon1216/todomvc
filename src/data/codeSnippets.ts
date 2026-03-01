export interface CodeSnippet {
  code: string
  language: string
}

export interface ChapterData {
  id: string
  title: string
  description: string
  sections: Section[]
}

export interface Section {
  title: string
  explanation: string
  snippets: {
    js: CodeSnippet
    vue: CodeSnippet
    react: CodeSnippet
  }
}

export const chapters: ChapterData[] = [
  {
    id: "project-init",
    title: "项目初始化",
    description: "三种方式创建项目，理解各自的项目结构。",
    sections: [
      {
        title: "创建项目",
        explanation:
          "原生 JS 只需要一个 HTML 文件；Vue 和 React 都推荐用脚手架工具创建项目，自带开发服务器和热更新。",
        snippets: {
          js: {
            code: `<!DOCTYPE html>
<html>
<head>
  <title>Todo App</title>
</head>
<body>
  <div id="app"></div>
  <script src="app.js"></script>
</body>
</html>`,
            language: "html",
          },
          vue: {
            code: `# 创建 Vue 项目
npm create vue@latest my-vue-app
cd my-vue-app
npm install
npm run dev`,
            language: "bash",
          },
          react: {
            code: `# 创建 React 项目
npm create vite@latest my-react-app
# 选择 React + TypeScript
cd my-react-app
npm install
npm run dev`,
            language: "bash",
          },
        },
      },
      {
        title: "入口文件",
        explanation:
          "三者都需要一个入口把应用挂载到 DOM 上。原生 JS 直接操作 DOM；Vue 用 createApp；React 用 createRoot。",
        snippets: {
          js: {
            code: `// app.js
const app = document.getElementById("app")
app.innerHTML = "<h1>Hello World</h1>"`,
            language: "javascript",
          },
          vue: {
            code: `// main.ts
import { createApp } from "vue"
import App from "./App.vue"

createApp(App).mount("#app")`,
            language: "typescript",
          },
          react: {
            code: `// main.tsx
import { createRoot } from "react-dom/client"
import App from "./App"

createRoot(
  document.getElementById("root")!
).render(<App />)`,
            language: "tsx",
          },
        },
      },
    ],
  },
  {
    id: "components",
    title: "组件与模板",
    description: "理解三种框架中「组件」的写法差异。",
    sections: [
      {
        title: "基础组件",
        explanation:
          "原生 JS 用函数返回 DOM 元素；Vue 用单文件组件（.vue）包含 template/script/style；React 用函数返回 JSX。核心区别：Vue 有模板语法，React 一切都是 JS。",
        snippets: {
          js: {
            code: `function Greeting(name) {
  const el = document.createElement("div")
  el.innerHTML = \`<h1>Hello, \${name}</h1>\`
  return el
}

document.getElementById("app")
  .appendChild(Greeting("World"))`,
            language: "javascript",
          },
          vue: {
            code: `<!-- Greeting.vue -->
<template>
  <h1>Hello, {{ name }}</h1>
</template>

<script setup lang="ts">
defineProps<{ name: string }>()
</script>`,
            language: "html",
          },
          react: {
            code: `// Greeting.tsx
function Greeting({ name }: { name: string }) {
  return <h1>Hello, {name}</h1>
}

export default Greeting`,
            language: "tsx",
          },
        },
      },
      {
        title: "条件渲染",
        explanation:
          "原生 JS 用 if/else 操作 DOM；Vue 用 v-if 指令；React 用三元表达式或 &&。React 没有模板指令，全靠 JS 表达式。",
        snippets: {
          js: {
            code: `const isLoggedIn = true

if (isLoggedIn) {
  app.innerHTML = "<p>欢迎回来</p>"
} else {
  app.innerHTML = "<p>请登录</p>"
}`,
            language: "javascript",
          },
          vue: {
            code: `<template>
  <p v-if="isLoggedIn">欢迎回来</p>
  <p v-else>请登录</p>
</template>

<script setup lang="ts">
import { ref } from "vue"
const isLoggedIn = ref(true)
</script>`,
            language: "html",
          },
          react: {
            code: `function App() {
  const [isLoggedIn] = useState(true)

  return isLoggedIn
    ? <p>欢迎回来</p>
    : <p>请登录</p>
}`,
            language: "tsx",
          },
        },
      },
      {
        title: "列表渲染",
        explanation:
          "原生 JS 用 forEach 拼接 HTML；Vue 用 v-for 指令；React 用 Array.map()。注意 Vue 和 React 都需要 key 来优化 DOM diff。",
        snippets: {
          js: {
            code: `const items = ["苹果", "香蕉", "橙子"]

const ul = document.createElement("ul")
items.forEach(item => {
  const li = document.createElement("li")
  li.textContent = item
  ul.appendChild(li)
})
app.appendChild(ul)`,
            language: "javascript",
          },
          vue: {
            code: `<template>
  <ul>
    <li v-for="(item, i) in items" :key="i">
      {{ item }}
    </li>
  </ul>
</template>

<script setup lang="ts">
const items = ["苹果", "香蕉", "橙子"]
</script>`,
            language: "html",
          },
          react: {
            code: `function App() {
  const items = ["苹果", "香蕉", "橙子"]

  return (
    <ul>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  )
}`,
            language: "tsx",
          },
        },
      },
    ],
  },
  {
    id: "state",
    title: "状态管理",
    description: "响应式数据：让界面随数据变化自动更新。",
    sections: [
      {
        title: "声明状态",
        explanation:
          "原生 JS 没有响应式，改了变量要手动更新 DOM。Vue 用 ref() 创建响应式变量，自动追踪依赖。React 用 useState()，state 变了组件函数重新执行。",
        snippets: {
          js: {
            code: `let count = 0

function render() {
  document.getElementById("count")
    .textContent = count
}

render() // 手动调用`,
            language: "javascript",
          },
          vue: {
            code: `<template>
  <p>{{ count }}</p>
</template>

<script setup lang="ts">
import { ref } from "vue"

const count = ref(0)
// 自动追踪，模板自动更新
</script>`,
            language: "html",
          },
          react: {
            code: `import { useState } from "react"

function App() {
  const [count, setCount] = useState(0)
  // state 变 → 函数重新执行 → UI 更新
  return <p>{count}</p>
}`,
            language: "tsx",
          },
        },
      },
      {
        title: "修改状态",
        explanation:
          "原生 JS 改变量后要手动调 render()。Vue 直接赋值 .value，响应式系统自动更新。React 必须用 setter 函数，不能直接赋值。",
        snippets: {
          js: {
            code: `let count = 0

function increment() {
  count++
  // 必须手动更新 DOM
  document.getElementById("count")
    .textContent = count
}

btn.addEventListener("click", increment)`,
            language: "javascript",
          },
          vue: {
            code: `<template>
  <p>{{ count }}</p>
  <button @click="count++">+1</button>
</template>

<script setup lang="ts">
import { ref } from "vue"
const count = ref(0)
// 直接改 count.value，模板自动更新
</script>`,
            language: "html",
          },
          react: {
            code: `function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>
        +1
      </button>
    </div>
  )
}`,
            language: "tsx",
          },
        },
      },
    ],
  },
  {
    id: "list-rendering",
    title: "列表与事件",
    description: "动态列表的增删操作，理解不可变更新。",
    sections: [
      {
        title: "添加列表项",
        explanation:
          "原生 JS 直接操作 DOM 添加元素。Vue 可以直接 push 数组（响应式代理了 push）。React 必须创建新数组，不能直接 push——这是不可变更新原则。",
        snippets: {
          js: {
            code: `const input = document.getElementById("input")
const ul = document.getElementById("list")

function addItem() {
  const li = document.createElement("li")
  li.textContent = input.value
  ul.appendChild(li)
  input.value = ""
}`,
            language: "javascript",
          },
          vue: {
            code: `<template>
  <input v-model="input" />
  <button @click="addItem">添加</button>
  <ul>
    <li v-for="(item, i) in items" :key="i">
      {{ item }}
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ref } from "vue"
const items = ref<string[]>([])
const input = ref("")

function addItem() {
  if (!input.value.trim()) return
  items.value.push(input.value) // 直接 push
  input.value = ""
}
</script>`,
            language: "html",
          },
          react: {
            code: `function App() {
  const [items, setItems] = useState<string[]>([])
  const [input, setInput] = useState("")

  const addItem = () => {
    if (!input.trim()) return
    setItems([...items, input]) // 创建新数组
    setInput("")
  }

  return (
    <div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      <button onClick={addItem}>添加</button>
      <ul>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  )
}`,
            language: "tsx",
          },
        },
      },
      {
        title: "删除列表项",
        explanation:
          "原生 JS 用 removeChild。Vue 用 splice 直接修改数组。React 用 filter 创建新数组——永远不直接修改 state。",
        snippets: {
          js: {
            code: `function removeItem(li) {
  li.parentNode.removeChild(li)
}

// 给每个 li 绑定点击事件
li.addEventListener("click", () => {
  removeItem(li)
})`,
            language: "javascript",
          },
          vue: {
            code: `<template>
  <ul>
    <li
      v-for="(item, i) in items"
      :key="i"
      @click="removeItem(i)"
    >
      {{ item }}
    </li>
  </ul>
</template>

<script setup lang="ts">
function removeItem(index: number) {
  items.value.splice(index, 1) // 直接修改
}
</script>`,
            language: "html",
          },
          react: {
            code: `function App() {
  const [items, setItems] = useState(["a", "b", "c"])

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
    // filter 返回新数组，不修改原数组
  }

  return (
    <ul>
      {items.map((item, i) => (
        <li key={i} onClick={() => removeItem(i)}>
          {item}
        </li>
      ))}
    </ul>
  )
}`,
            language: "tsx",
          },
        },
      },
    ],
  },
  {
    id: "component-communication",
    title: "组件通信",
    description: "父子组件传值、状态提升、跨组件共享。",
    sections: [
      {
        title: "父传子（Props）",
        explanation:
          "三种方式本质一样：父组件通过属性把数据传给子组件。Vue 用 defineProps，React 用函数参数解构。",
        snippets: {
          js: {
            code: `function TodoItem(text) {
  const li = document.createElement("li")
  li.textContent = text
  return li
}

// 父组件调用时传参
const item = TodoItem("买菜")
list.appendChild(item)`,
            language: "javascript",
          },
          vue: {
            code: `<!-- TodoItem.vue -->
<template>
  <li>{{ text }}</li>
</template>

<script setup lang="ts">
defineProps<{ text: string }>()
</script>

<!-- 父组件使用 -->
<!-- <TodoItem text="买菜" /> -->`,
            language: "html",
          },
          react: {
            code: `// 子组件：通过参数接收 props
function TodoItem({ text }: { text: string }) {
  return <li>{text}</li>
}

// 父组件使用
function App() {
  return <TodoItem text="买菜" />
}`,
            language: "tsx",
          },
        },
      },
      {
        title: "子传父（事件 / 回调）",
        explanation:
          "原生 JS 用回调函数。Vue 用 emit 触发自定义事件。React 直接把函数作为 props 传下去——本质都是回调。",
        snippets: {
          js: {
            code: `function TodoItem(text, onDelete) {
  const li = document.createElement("li")
  li.textContent = text
  li.onclick = () => onDelete()
  return li
}

// 父组件传入回调
TodoItem("买菜", () => {
  console.log("删除了")
})`,
            language: "javascript",
          },
          vue: {
            code: `<!-- TodoItem.vue -->
<template>
  <li @click="$emit('delete')">{{ text }}</li>
</template>

<script setup lang="ts">
defineProps<{ text: string }>()
defineEmits<{ delete: [] }>()
</script>

<!-- 父组件 -->
<!-- <TodoItem text="买菜" @delete="handleDelete" /> -->`,
            language: "html",
          },
          react: {
            code: `// 子组件：调用父组件传来的函数
function TodoItem({ text, onDelete }: {
  text: string
  onDelete: () => void
}) {
  return <li onClick={onDelete}>{text}</li>
}

// 父组件：把函数传下去
function App() {
  return (
    <TodoItem
      text="买菜"
      onDelete={() => console.log("删除了")}
    />
  )
}`,
            language: "tsx",
          },
        },
      },
      {
        title: "跨组件共享（Context / Provide）",
        explanation:
          "当组件层级很深时，层层传 props 太麻烦。Vue 用 provide/inject，React 用 Context。思路一样：祖先提供数据，后代直接取。",
        snippets: {
          js: {
            code: `// 原生 JS 没有内置方案
// 通常用全局变量或事件总线

const store = {
  todos: [],
  addTodo(text) {
    this.todos.push(text)
    // 手动通知所有监听者更新
  }
}`,
            language: "javascript",
          },
          vue: {
            code: `<!-- 祖先组件 -->
<script setup lang="ts">
import { provide, ref } from "vue"
const todos = ref<string[]>([])
provide("todos", todos)
</script>

<!-- 任意后代组件 -->
<script setup lang="ts">
import { inject } from "vue"
const todos = inject<Ref<string[]>>("todos")
</script>`,
            language: "html",
          },
          react: {
            code: `// 创建 Context
const TodoContext = createContext<string[]>([])

// 祖先组件提供数据
function App() {
  const [todos] = useState(["买菜"])
  return (
    <TodoContext.Provider value={todos}>
      <Child />
    </TodoContext.Provider>
  )
}

// 任意后代组件消费
function Child() {
  const todos = useContext(TodoContext)
  return <p>{todos.length} 条待办</p>
}`,
            language: "tsx",
          },
        },
      },
    ],
  },
  {
    id: "complete-todo",
    title: "完整 Todo List",
    description: "综合运用所有知识，构建一个完整的 Todo 应用。",
    sections: [
      {
        title: "完整实现",
        explanation:
          "把前面学的所有内容组合起来：组件拆分、状态管理、列表渲染、事件处理。对比三种实现方式的代码量和思维模式差异。",
        snippets: {
          js: {
            code: `// app.js
const input = document.getElementById("input")
const btn = document.getElementById("btn")
const list = document.getElementById("list")
const empty = document.getElementById("empty")

let todos = []

function render() {
  list.innerHTML = ""
  if (todos.length === 0) {
    empty.style.display = "block"
    list.style.display = "none"
    return
  }
  empty.style.display = "none"
  list.style.display = "block"

  todos.forEach((todo, i) => {
    const li = document.createElement("li")
    li.textContent = todo
    li.onclick = () => {
      todos.splice(i, 1)
      render()
    }
    list.appendChild(li)
  })
}

btn.onclick = () => {
  if (!input.value.trim()) return
  todos.push(input.value)
  input.value = ""
  render()
}

render()`,
            language: "javascript",
          },
          vue: {
            code: `<!-- App.vue -->
<template>
  <div>
    <h1>Todo List</h1>
    <input v-model="input" placeholder="输入待办" />
    <button @click="addTodo">添加</button>

    <p v-if="todos.length === 0">暂无待办</p>
    <ul v-else>
      <li
        v-for="(todo, i) in todos"
        :key="i"
        @click="removeTodo(i)"
      >
        {{ todo }}（点击删除）
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"

const todos = ref<string[]>([])
const input = ref("")

function addTodo() {
  if (!input.value.trim()) return
  todos.value.push(input.value)
  input.value = ""
}

function removeTodo(i: number) {
  todos.value.splice(i, 1)
}
</script>`,
            language: "html",
          },
          react: {
            code: `import { useState } from "react"

function TodoInput({ input, setInput, addTodo }: {
  input: string
  setInput: (v: string) => void
  addTodo: () => void
}) {
  return (
    <div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="输入待办"
      />
      <button onClick={addTodo}>添加</button>
    </div>
  )
}

function TodoItem({ todo, onRemove }: {
  todo: string
  onRemove: () => void
}) {
  return (
    <li onClick={onRemove}>
      {todo}（点击删除）
    </li>
  )
}

export default function App() {
  const [todos, setTodos] = useState<string[]>([])
  const [input, setInput] = useState("")

  const addTodo = () => {
    if (!input.trim()) return
    setTodos([...todos, input])
    setInput("")
  }

  const removeTodo = (i: number) => {
    setTodos(todos.filter((_, idx) => idx !== i))
  }

  return (
    <div>
      <h1>Todo List</h1>
      <TodoInput
        input={input}
        setInput={setInput}
        addTodo={addTodo}
      />
      {todos.length === 0 ? (
        <p>暂无待办</p>
      ) : (
        <ul>
          {todos.map((todo, i) => (
            <TodoItem
              key={i}
              todo={todo}
              onRemove={() => removeTodo(i)}
            />
          ))}
        </ul>
      )}
    </div>
  )
}`,
            language: "tsx",
          },
        },
      },
    ],
  },
]
