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
  // ============================================================
  // 第 1 章：项目结构 & 入口
  // ============================================================
  {
    id: "project-structure",
    title: "项目结构 & 入口",
    description: "三个 Todo 项目的目录结构和启动方式，理解框架项目的骨架。",
    sections: [
      {
        title: "项目目录结构",
        explanation:
          "原生 JS 只需要 3 个文件；Vue 和 React 都有标准的工程目录：types 定义类型、components 拆分组件、stores/hooks 管理状态。注意 Vue 的 composables 对应 React 的 hooks，Vue 的 stores(Pinia) 对应 React 的 store(Zustand)。",
        snippets: {
          js: {
            code: `todo-js/
├── index.html    # 入口 HTML，包含页面结构
├── style.css     # 样式
└── app.js        # 全部逻辑（增删改查 + 筛选 + 存储）

# 原生 JS 不需要构建工具
# 浏览器直接打开 index.html 就能跑`,
            language: "bash",
          },
          vue: {
            code: `todo-vue/src/
├── main.ts                 # 入口：创建 app + 挂载 Pinia
├── App.vue                 # 根组件：组合所有子组件
├── types/
│   └── todo.ts             # TypeScript 类型定义
├── composables/
│   └── useLocalStorage.ts  # 自定义 composable（≈ React 的自定义 Hook）
├── stores/
│   └── useTodoStore.ts     # Pinia Store（≈ React 的 Zustand）
└── components/
    ├── TodoInput.vue       # 输入框组件
    ├── TodoItem.vue        # 单条 todo（展示 + 编辑 + 删除）
    ├── TodoList.vue        # 列表组件
    └── TodoFilter.vue      # 筛选栏组件`,
            language: "bash",
          },
          react: {
            code: `todo-react/src/
├── main.tsx                  # 入口：createRoot 挂载
├── App.tsx                   # 根组件
├── types/
│   └── todo.ts               # TypeScript 类型定义
├── hooks/
│   └── useLocalStorage.ts    # 自定义 Hook（≈ Vue 的 composable）
├── store/
│   └── useTodoStore.ts       # Zustand Store（≈ Vue 的 Pinia）
└── components/
    ├── TodoInput.tsx          # 输入框组件
    ├── TodoItem.tsx           # 单条 todo
    ├── TodoList.tsx           # 列表组件
    └── TodoFilter.tsx         # 筛选栏组件`,
            language: "bash",
          },
        },
      },
      {
        title: "入口文件",
        explanation:
          "三者都需要一个入口把应用挂载到 DOM 上。原生 JS 直接操作 DOM；Vue 用 createApp + Pinia 插件；React 用 createRoot。注意 Vue 需要手动注册 Pinia，而 React 的 Zustand 不需要任何注册，import 就能用。",
        snippets: {
          js: {
            code: `<!-- index.html -->
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <title>Todo App</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div id="app">
    <h1>Todo List</h1>
    <div class="input-bar">
      <input id="input" placeholder="输入待办..." />
      <button id="addBtn">添加</button>
    </div>
    <div class="filters">
      <button data-filter="all" class="active">全部</button>
      <button data-filter="active">未完成</button>
      <button data-filter="completed">已完成</button>
    </div>
    <ul id="list"></ul>
    <p id="empty">暂无待办</p>
  </div>
  <script src="app.js"></script>
</body>
</html>`,
            language: "html",
          },
          vue: {
            code: `// main.ts
import { createApp } from "vue"
import { createPinia } from "pinia"
import App from "./App.vue"

const app = createApp(App)
app.use(createPinia())  // 注册 Pinia 插件
app.mount("#app")

// 对比 React：
// React 不需要 "注册" Zustand，直接 import store 就能用
// 但 Context 方案需要 <Provider> 包裹`,
            language: "typescript",
          },
          react: {
            code: `// main.tsx
import { createRoot } from "react-dom/client"
import App from "./App"

createRoot(
  document.getElementById("root")!
).render(<App />)

// React 的入口比 Vue 简单
// 不需要注册任何插件
// Zustand store 在组件里 import 就能直接用`,
            language: "tsx",
          },
        },
      },
      {
        title: "根组件 & 类型定义",
        explanation:
          "TypeScript 类型定义三个版本可以共用。根组件负责组合子组件——Vue 用 template 写 HTML 结构，React 用 JSX（本质是 JS）。注意 Vue 需要 storeToRefs 解构 store 保持响应式，React 直接从 store 选取数据。",
        snippets: {
          js: {
            code: `// 原生 JS 没有类型系统，也没有组件概念
// 数据结构靠约定：
// todo = { text: "买菜", done: false }

// 所有逻辑都在 app.js 一个文件里
// 没有组件拆分，靠函数组织代码`,
            language: "javascript",
          },
          vue: {
            code: `// types/todo.ts — 类型定义
export interface Todo {
  id: number
  text: string
  done: boolean
}

// App.vue — 根组件
<template>
  <div class="app">
    <h1>Todo List</h1>
    <TodoInput />
    <TodoFilter />
    <TodoList />
    <p class="count">{{ activeCount }} 项未完成</p>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia"
import { useTodoStore } from "./stores/useTodoStore"
import TodoInput from "./components/TodoInput.vue"
import TodoFilter from "./components/TodoFilter.vue"
import TodoList from "./components/TodoList.vue"

// storeToRefs：把 store 的 state/getter 解构为 ref
// 不能直接解构 store，否则会丢失响应式！
const { activeCount } = storeToRefs(useTodoStore())
</script>`,
            language: "html",
          },
          react: {
            code: `// types/todo.ts — 类型定义（和 Vue 版完全一样）
export interface Todo {
  id: number
  text: string
  done: boolean
}
export type FilterType = "all" | "active" | "completed"

// App.tsx — 根组件（Zustand 版）
import { useTodoStore } from "./store/useTodoStore"
import TodoInput from "./components/TodoInput"
import TodoList from "./components/TodoList"
import TodoFilter from "./components/TodoFilter"

export default function App() {
  const activeCount = useTodoStore(state => state.activeCount())

  return (
    <div className="app">
      <h1>Todo List</h1>
      <TodoInput />
      <TodoFilter />
      <TodoList />
      <p className="count">{activeCount} 项未完成</p>
    </div>
  )
}`,
            language: "tsx",
          },
        },
      },
    ],
  },

  // ============================================================
  // 第 2 章：状态管理 & 数据驱动
  // ============================================================
  {
    id: "state-management",
    title: "状态管理 & 数据驱动",
    description: "三种框架如何管理数据、如何让界面随数据变化自动更新。",
    sections: [
      {
        title: "声明状态 & 初始化",
        explanation:
          "原生 JS 用普通变量 + localStorage 手动读写。Vue 用 ref() 创建响应式变量，改了 .value 界面自动更新。React 用 useState()，必须通过 setter 函数更新。三个版本都从 localStorage 读取初始数据实现持久化。",
        snippets: {
          js: {
            code: `// app.js — 用普通变量 + localStorage
let todos = JSON.parse(
  localStorage.getItem("todos") || "[]"
)
let filter = "all"

function save() {
  localStorage.setItem("todos", JSON.stringify(todos))
}

// 改了 todos 之后，必须手动调 save() + render()
// 没有任何自动化机制`,
            language: "javascript",
          },
          vue: {
            code: `// composables/useLocalStorage.ts
import { ref, watch } from "vue"

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const stored = localStorage.getItem(key)
  const data = ref<T>(stored ? JSON.parse(stored) : defaultValue)

  // watch 监听变化，自动写入 localStorage
  // deep: true → 数组内部元素变化也能捕获
  watch(data, (newVal) => {
    localStorage.setItem(key, JSON.stringify(newVal))
  }, { deep: true })

  return data  // 返回一个 ref
}

// stores/useTodoStore.ts — 在 Pinia 中使用
const todos = useLocalStorage<Todo[]>("vue-todos", [])
const filter = ref<"all" | "active" | "completed">("all")
// 改 todos.value 就会自动存储 + 自动更新 UI`,
            language: "typescript",
          },
          react: {
            code: `// hooks/useLocalStorage.ts
import { useState, useEffect } from "react"

export function useLocalStorage<T>(key: string, defaultValue: T) {
  // useState 惰性初始化：函数只在首次渲染执行
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : defaultValue
  })

  // useEffect：value 变化时写入 localStorage
  // 依赖数组 [key, value] → 只在这两个值变化时执行
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue] as const  // 返回 [值, setter]
}

// 对比 Vue：
// Vue 返回一个 ref（可直接修改 .value）
// React 返回 [值, setter]（必须通过 setter 更新）`,
            language: "typescript",
          },
        },
      },
      {
        title: "修改状态（可变 vs 不可变）",
        explanation:
          "这是 Vue 和 React 最核心的差异！Vue 可以直接修改数据（push/splice/赋值），因为 Proxy 会拦截并触发更新。React 必须创建新数组/新对象（不可变更新），因为 React 通过引用比较（===）判断是否需要重新渲染。",
        snippets: {
          js: {
            code: `// 原生 JS — 直接修改，手动渲染
function addTodo() {
  todos.push({ text: input.value.trim(), done: false })
  save()    // 手动存储
  render()  // 手动重新渲染整个列表
}

function removeTodo(todo) {
  todos = todos.filter(t => t !== todo)
  save(); render()
}

function toggleTodo(todo) {
  todo.done = !todo.done  // 直接改属性
  save(); render()
}`,
            language: "javascript",
          },
          vue: {
            code: `// Pinia Store 中的 Actions
function addTodo(text: string) {
  if (!text.trim()) return
  todos.value.push({
    id: nextId++, text: text.trim(), done: false
  })
  // 直接 push！Vue 的 Proxy 会拦截 push 操作
  // 自动触发 UI 更新 + watch 自动存储
}

function removeTodo(id: number) {
  const idx = todos.value.findIndex(t => t.id === id)
  if (idx !== -1) todos.value.splice(idx, 1)
  // splice 直接修改数组，Vue 能检测到
}

function toggleTodo(id: number) {
  const todo = todos.value.find(t => t.id === id)
  if (todo) todo.done = !todo.done
  // 直接改对象属性，Proxy 会拦截
}`,
            language: "typescript",
          },
          react: {
            code: `// Zustand Store 中的 Actions
addTodo: (text) => {
  if (!text.trim()) return
  set(state => {
    const newTodos = [...state.todos, {
      id: Date.now(), text: text.trim(), done: false,
    }]
    // [...old, new] 展开运算符创建新数组
    localStorage.setItem("react-todos", JSON.stringify(newTodos))
    return { todos: newTodos }
  })
},

removeTodo: (id) => set(state => {
  // filter 返回新数组，不修改原数组
  const newTodos = state.todos.filter(t => t.id !== id)
  localStorage.setItem("react-todos", JSON.stringify(newTodos))
  return { todos: newTodos }
}),

toggleTodo: (id) => set(state => {
  // map + 展开运算符：创建新数组 + 新对象
  const newTodos = state.todos.map(t =>
    t.id === id ? { ...t, done: !t.done } : t
  )
  localStorage.setItem("react-todos", JSON.stringify(newTodos))
  return { todos: newTodos }
}),`,
            language: "typescript",
          },
        },
      },
      {
        title: "计算属性 / 派生状态",
        explanation:
          "筛选后的列表、未完成数量——这些都是从原始数据「算出来」的。Vue 用 computed（自动缓存，依赖不变就不重算）。React 在 Zustand 里用 getter 方法，或者直接在组件里算。原生 JS 在 render 函数里每次重新算。",
        snippets: {
          js: {
            code: `// app.js — 在 render 函数里直接算
function render() {
  const filtered = todos.filter(t =>
    filter === "all" ? true
      : filter === "active" ? !t.done
      : t.done
  )
  // 每次 render 都重新 filter
  // 没有缓存机制

  if (filtered.length === 0) {
    list.style.display = "none"
    empty.style.display = "block"
    return
  }
  // ... 渲染列表
}`,
            language: "javascript",
          },
          vue: {
            code: `// Pinia Store 中用 computed
import { computed, ref } from "vue"

const filteredTodos = computed(() => {
  switch (filter.value) {
    case "active":
      return todos.value.filter(t => !t.done)
    case "completed":
      return todos.value.filter(t => t.done)
    default:
      return todos.value
  }
})
// computed 会自动缓存：
// 只有 todos 或 filter 变化时才重新计算
// 多个组件读取 filteredTodos 不会重复计算

const activeCount = computed(() =>
  todos.value.filter(t => !t.done).length
)`,
            language: "typescript",
          },
          react: {
            code: `// Zustand Store 中用 getter 方法
filteredTodos: () => {
  const { todos, filter } = get()
  switch (filter) {
    case "active":
      return todos.filter(t => !t.done)
    case "completed":
      return todos.filter(t => t.done)
    default:
      return todos
  }
},

activeCount: () =>
  get().todos.filter(t => !t.done).length,

// 注意：Zustand 的 getter 是普通函数，每次调用都会重新计算
// 如果需要缓存，可以用 useMemo：
// const filtered = useMemo(
//   () => todos.filter(...),
//   [todos, filter]
// )`,
            language: "typescript",
          },
        },
      },
    ],
  },

  // ============================================================
  // 第 3 章：组件拆分 & Props 通信
  // ============================================================
  {
    id: "components-props",
    title: "组件拆分 & Props 通信",
    description: "如何把 UI 拆成独立组件，父子组件之间如何传递数据。",
    sections: [
      {
        title: "输入框组件（父传子 & 事件绑定）",
        explanation:
          "TodoInput 是最简单的组件：一个输入框 + 一个按钮。Vue 用 v-model 双向绑定输入框，React 必须手动写 value + onChange（受控组件）。两者都从 store 获取 addTodo 方法，不需要父组件传 props。",
        snippets: {
          js: {
            code: `// 原生 JS 没有组件，直接在 app.js 里绑定事件
const input = document.getElementById("input")
const addBtn = document.getElementById("addBtn")

addBtn.onclick = () => {
  if (!input.value.trim()) return
  todos.push({ text: input.value.trim(), done: false })
  input.value = ""
  save(); render()
}

// 回车也能添加
input.onkeydown = (e) => {
  if (e.key === "Enter") addBtn.onclick()
}`,
            language: "javascript",
          },
          vue: {
            code: `<!-- components/TodoInput.vue -->
<template>
  <div class="input-bar">
    <!--
      v-model 双向绑定：
      等价于 :value="text" + @input="text = $event.target.value"
      React 没有 v-model，必须手写这两行
    -->
    <input
      v-model="text"
      placeholder="输入待办..."
      @keydown.enter="handleAdd"
    />
    <!-- @keydown.enter 是 Vue 的事件修饰符，React 没有 -->
    <button @click="handleAdd">添加</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useTodoStore } from "../stores/useTodoStore"

const text = ref("")
const store = useTodoStore()

function handleAdd() {
  store.addTodo(text.value)
  text.value = ""  // 直接赋值清空
}
</script>`,
            language: "html",
          },
          react: {
            code: `// components/TodoInput.tsx
import { useState } from "react"
import { useTodoStore } from "../store/useTodoStore"

export default function TodoInput() {
  // 局部状态：只有这个组件关心输入框的文字
  const [text, setText] = useState("")
  const addTodo = useTodoStore(state => state.addTodo)

  const handleAdd = () => {
    addTodo(text)
    setText("")  // 通过 setter 清空
  }

  return (
    <div className="input-bar">
      {/*
        受控组件：value + onChange 必须配对
        Vue 的 v-model 一行搞定的事，React 要两个属性
      */}
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={e => e.key === "Enter" && handleAdd()}
        placeholder="输入待办..."
      />
      <button onClick={handleAdd}>添加</button>
    </div>
  )
}`,
            language: "tsx",
          },
        },
      },
      {
        title: "列表组件（条件渲染 & 列表渲染）",
        explanation:
          "TodoList 展示筛选后的 todo 列表。空列表时显示提示文字，否则渲染 TodoItem。Vue 用 v-if/v-else + v-for 指令，React 用 if 语句 + array.map()。两者都需要 key 来优化 DOM diff 算法。",
        snippets: {
          js: {
            code: `// app.js — render 函数中渲染列表
function render() {
  const filtered = todos.filter(t =>
    filter === "all" ? true
      : filter === "active" ? !t.done : t.done
  )

  if (filtered.length === 0) {
    list.style.display = "none"
    empty.style.display = "block"
    return
  }
  list.style.display = "block"
  empty.style.display = "none"
  list.innerHTML = ""  // 清空后重新渲染

  filtered.forEach(todo => {
    const li = document.createElement("li")
    li.className = todo.done ? "done" : ""
    li.innerHTML = \`
      <input type="checkbox" \${todo.done ? "checked" : ""} />
      <span class="text">\${todo.text}</span>
      <button class="del">✕</button>
    \`
    list.appendChild(li)
  })
}`,
            language: "javascript",
          },
          vue: {
            code: `<!-- components/TodoList.vue -->
<template>
  <!-- v-if / v-else：条件渲染 -->
  <p v-if="filteredTodos.length === 0" class="empty">
    暂无待办
  </p>
  <ul v-else>
    <!-- v-for：列表渲染，:key 是 diff 算法的依据 -->
    <TodoItem
      v-for="todo in filteredTodos"
      :key="todo.id"
      :todo="todo"
    />
    <!-- :todo="todo" 是父传子 props -->
  </ul>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia"
import { useTodoStore } from "../stores/useTodoStore"
import TodoItem from "./TodoItem.vue"

// storeToRefs 保持响应式解构
const { filteredTodos } = storeToRefs(useTodoStore())
</script>`,
            language: "html",
          },
          react: {
            code: `// components/TodoList.tsx
import { useTodoStore } from "../store/useTodoStore"
import TodoItem from "./TodoItem"

export default function TodoList() {
  const filteredTodos = useTodoStore(state => state.filteredTodos())

  // React 用 if 语句做条件渲染（Vue 用 v-if）
  if (filteredTodos.length === 0) {
    return <p className="empty">暂无待办</p>
  }

  return (
    <ul>
      {/* React 用 map 做列表渲染（Vue 用 v-for） */}
      {filteredTodos.map(todo => (
        // key 必须唯一且稳定，不要用 index
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  )
}

// 对比：
// Vue:  v-if → v-else → v-for :key
// React: if return → map() key={}
// Vue 用指令，React 用 JS 原生语法`,
            language: "tsx",
          },
        },
      },
      {
        title: "筛选组件（动态 class & 事件回调）",
        explanation:
          "TodoFilter 有三个按钮，当前选中的按钮高亮。Vue 用 :class 对象语法动态绑定 class，React 用三元表达式拼接 className 字符串。两者都从 store 读取当前 filter 并调用 setFilter。",
        snippets: {
          js: {
            code: `// app.js — 筛选按钮逻辑
const filterBtns = document.querySelectorAll("[data-filter]")

filterBtns.forEach(btn => {
  btn.onclick = () => {
    filter = btn.dataset.filter
    // 手动切换 active class
    filterBtns.forEach(b => b.classList.remove("active"))
    btn.classList.add("active")
    render()
  }
})`,
            language: "javascript",
          },
          vue: {
            code: `<!-- components/TodoFilter.vue -->
<template>
  <div class="filters">
    <button
      v-for="f in filters"
      :key="f.value"
      :class="{ active: filter === f.value }"
      @click="setFilter(f.value)"
    >
      {{ f.label }}
    </button>
    <!--
      :class="{ active: condition }"
      当 condition 为 true 时添加 active class
      这是 Vue 的对象语法，比手动拼字符串优雅
    -->
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia"
import { useTodoStore } from "../stores/useTodoStore"

const store = useTodoStore()
const { filter } = storeToRefs(store)
const { setFilter } = store

const filters = [
  { value: "all" as const, label: "全部" },
  { value: "active" as const, label: "未完成" },
  { value: "completed" as const, label: "已完成" },
]
</script>`,
            language: "html",
          },
          react: {
            code: `// components/TodoFilter.tsx
import { useTodoStore } from "../store/useTodoStore"
import type { FilterType } from "../types/todo"

const filters: { value: FilterType; label: string }[] = [
  { value: "all", label: "全部" },
  { value: "active", label: "未完成" },
  { value: "completed", label: "已完成" },
]

export default function TodoFilter() {
  const filter = useTodoStore(state => state.filter)
  const setFilter = useTodoStore(state => state.setFilter)

  return (
    <div className="filters">
      {filters.map(f => (
        <button
          key={f.value}
          className={filter === f.value ? "active" : ""}
          onClick={() => setFilter(f.value)}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}

// 动态 class 对比：
// Vue:  :class="{ active: filter === f.value }"  ← 对象语法
// React: className={condition ? "active" : ""}   ← 三元表达式`,
            language: "tsx",
          },
        },
      },
    ],
  },

  // ============================================================
  // 第 4 章：TodoItem 深入（编辑、Ref、生命周期）
  // ============================================================
  {
    id: "todoitem-deep",
    title: "TodoItem 深入",
    description: "双击编辑、DOM 引用、副作用——理解组件内部的高级模式。",
    sections: [
      {
        title: "TodoItem 完整实现",
        explanation:
          "TodoItem 是最复杂的组件：展示文字、勾选完成、双击进入编辑模式、失焦或回车保存。Vue 用 v-if/v-else 切换展示/编辑，React 用三元表达式。两者都需要「进入编辑时自动 focus 输入框」这个需求，引出了 ref 和副作用的概念。",
        snippets: {
          js: {
            code: `// app.js — 在 render 函数中给每个 li 绑定事件
filtered.forEach(todo => {
  const li = document.createElement("li")
  li.className = todo.done ? "done" : ""
  li.innerHTML = \`
    <input type="checkbox" \${todo.done ? "checked" : ""} />
    <span class="text">\${todo.text}</span>
    <button class="del">✕</button>
  \`

  // 勾选
  li.querySelector("input").onchange = () => {
    todo.done = !todo.done
    save(); render()
  }

  // 双击编辑
  li.querySelector(".text").ondblclick = (e) => {
    const span = e.target
    const oldText = span.textContent
    const inp = document.createElement("input")
    inp.value = oldText
    inp.className = "edit-input"
    span.replaceWith(inp)  // 直接替换 DOM
    inp.focus()
    const finish = () => {
      todo.text = inp.value.trim() || oldText
      save(); render()
    }
    inp.onblur = finish
    inp.onkeydown = (ev) => {
      if (ev.key === "Enter") finish()
    }
  }

  // 删除
  li.querySelector(".del").onclick = () => {
    todos = todos.filter(t => t !== todo)
    save(); render()
  }

  list.appendChild(li)
})`,
            language: "javascript",
          },
          vue: {
            code: `<!-- components/TodoItem.vue -->
<template>
  <li :class="{ done: todo.done }">
    <input
      type="checkbox"
      :checked="todo.done"
      @change="store.toggleTodo(todo.id)"
    />

    <!-- v-if/v-else 切换编辑/展示模式 -->
    <input
      v-if="isEditing"
      v-model="editText"
      class="edit-input"
      @blur="finishEdit"
      @keydown.enter="finishEdit"
      ref="editInputRef"
    />
    <span v-else class="text" @dblclick="startEdit">
      {{ todo.text }}
    </span>

    <button class="del" @click="store.removeTodo(todo.id)">✕</button>
  </li>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue"
import { useTodoStore } from "../stores/useTodoStore"
import type { Todo } from "../types/todo"

const props = defineProps<{ todo: Todo }>()
const store = useTodoStore()

const isEditing = ref(false)
const editText = ref("")
const editInputRef = ref<HTMLInputElement>()

function startEdit() {
  isEditing.value = true
  editText.value = props.todo.text
  // nextTick：等 DOM 更新后再 focus
  nextTick(() => editInputRef.value?.focus())
}

function finishEdit() {
  if (editText.value.trim()) {
    store.editTodo(props.todo.id, editText.value)
  }
  isEditing.value = false
}
</script>`,
            language: "html",
          },
          react: {
            code: `// components/TodoItem.tsx
import { useState, useRef, useEffect } from "react"
import { useTodoStore } from "../store/useTodoStore"
import type { Todo } from "../types/todo"

export default function TodoItem({ todo }: { todo: Todo }) {
  const { toggleTodo, removeTodo, editTodo } = useTodoStore()

  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState("")
  const editInputRef = useRef<HTMLInputElement>(null)

  // useEffect：isEditing 变为 true 时自动 focus
  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus()
    }
  }, [isEditing])

  const startEdit = () => {
    setIsEditing(true)
    setEditText(todo.text)
  }

  const finishEdit = () => {
    if (editText.trim()) {
      editTodo(todo.id, editText)
    }
    setIsEditing(false)
  }

  return (
    <li className={todo.done ? "done" : ""}>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => toggleTodo(todo.id)}
      />
      {/* 三元表达式切换编辑/展示（Vue 用 v-if/v-else） */}
      {isEditing ? (
        <input
          ref={editInputRef}
          className="edit-input"
          value={editText}
          onChange={e => setEditText(e.target.value)}
          onBlur={finishEdit}
          onKeyDown={e => e.key === "Enter" && finishEdit()}
        />
      ) : (
        <span className="text" onDoubleClick={startEdit}>
          {todo.text}
        </span>
      )}
      <button className="del" onClick={() => removeTodo(todo.id)}>
        ✕
      </button>
    </li>
  )
}`,
            language: "tsx",
          },
        },
      },
      {
        title: "Ref & 自动 Focus（DOM 引用）",
        explanation:
          "「进入编辑模式后自动 focus 输入框」——这个需求涉及直接操作 DOM。Vue 用 ref + nextTick，React 用 useRef + useEffect。核心区别：Vue 的 nextTick 是「等这一次 DOM 更新完」，React 的 useEffect 是「每次渲染后执行副作用」。",
        snippets: {
          js: {
            code: `// 原生 JS — 直接操作 DOM，最简单
const inp = document.createElement("input")
span.replaceWith(inp)
inp.focus()  // 元素已经在 DOM 里了，直接 focus

// 原生 JS 不需要 ref 或 nextTick
// 因为你手动创建元素、手动插入 DOM
// 操作的时候元素已经存在了`,
            language: "javascript",
          },
          vue: {
            code: `// Vue — ref 绑定 DOM + nextTick 等待更新
const editInputRef = ref<HTMLInputElement>()

function startEdit() {
  isEditing.value = true
  editText.value = props.todo.text

  // 为什么需要 nextTick？
  // isEditing 变为 true 后，v-if 的 input 还没渲染到 DOM
  // nextTick 等 DOM 更新完成后再执行回调
  nextTick(() => {
    editInputRef.value?.focus()
    // editInputRef.value 是 DOM 元素
    // 注意是 .value（ref 的值），不是 .current（React）
  })
}

// template 中用 ref="editInputRef" 绑定
// <input ref="editInputRef" ... />`,
            language: "typescript",
          },
          react: {
            code: `// React — useRef 绑定 DOM + useEffect 监听变化
const editInputRef = useRef<HTMLInputElement>(null)

// useEffect：每次 isEditing 变化后执行
// 这是 React 的「副作用」机制
useEffect(() => {
  if (isEditing) {
    editInputRef.current?.focus()
    // editInputRef.current 是 DOM 元素
    // 注意是 .current（React），不是 .value（Vue）
  }
}, [isEditing])  // 依赖数组：只在 isEditing 变化时执行

// JSX 中用 ref={editInputRef} 绑定
// <input ref={editInputRef} ... />

// 对比 Vue：
// Vue:   nextTick(() => ref.value?.focus())   ← 一次性
// React: useEffect(() => ref.current?.focus(), [dep])  ← 响应式`,
            language: "typescript",
          },
        },
      },
      {
        title: "Props 接收方式对比",
        explanation:
          "TodoItem 需要从父组件接收 todo 数据。Vue 用 defineProps 声明（返回 readonly 对象），React 用函数参数解构。两者都支持 TypeScript 类型约束。注意：Props 是只读的，子组件不能直接修改 props，要通过 store 或 emit 通知父组件。",
        snippets: {
          js: {
            code: `// 原生 JS — 函数参数就是 "props"
function createTodoItem(todo) {
  const li = document.createElement("li")
  li.textContent = todo.text
  // todo 就是从外部传入的数据
  // 没有类型约束，没有只读保护
  return li
}

// 调用时传参
const li = createTodoItem({ text: "买菜", done: false })
list.appendChild(li)`,
            language: "javascript",
          },
          vue: {
            code: `// Vue — defineProps 声明 props
<script setup lang="ts">
import type { Todo } from "../types/todo"

// 方式 1：泛型语法（推荐）
const props = defineProps<{ todo: Todo }>()

// 方式 2：运行时声明
// const props = defineProps({
//   todo: { type: Object as PropType<Todo>, required: true }
// })

// 使用：props.todo.text, props.todo.done
// props 是 readonly 的！不能 props.todo.done = true
// 要修改数据，通过 store.toggleTodo(props.todo.id)
</script>

<template>
  <!-- template 中直接用 todo，不需要 props. 前缀 -->
  <li>{{ todo.text }}</li>
</template>`,
            language: "html",
          },
          react: {
            code: `// React — 函数参数解构 props
import type { Todo } from "../types/todo"

// 方式 1：内联类型
function TodoItem({ todo }: { todo: Todo }) {
  return <li>{todo.text}</li>
}

// 方式 2：独立 interface（组件复杂时推荐）
interface TodoItemProps {
  todo: Todo
}
function TodoItem({ todo }: TodoItemProps) {
  return <li>{todo.text}</li>
}

// props 也是只读的（TypeScript 约束）
// 不能 todo.done = true
// 要修改数据，调用 store 的方法：
// const { toggleTodo } = useTodoStore()
// toggleTodo(todo.id)`,
            language: "tsx",
          },
        },
      },
    ],
  },

  // ============================================================
  // 第 5 章：全局状态管理（Pinia vs Zustand）
  // ============================================================
  {
    id: "global-state",
    title: "全局状态管理",
    description: "Pinia vs Zustand：为什么需要全局 Store，怎么用，有什么区别。",
    sections: [
      {
        title: "为什么需要全局状态管理",
        explanation:
          "当多个组件需要共享数据时，层层传 props（props drilling）会很痛苦。全局 Store 让任何组件都能直接读写共享状态。Vue 用 Pinia，React 用 Zustand——两者 API 非常相似，都是函数式定义 store，组件直接调用。",
        snippets: {
          js: {
            code: `// 原生 JS — 全局变量就是 "store"
let todos = JSON.parse(
  localStorage.getItem("todos") || "[]"
)
let filter = "all"

// 所有函数都直接访问这些全局变量
// 简单粗暴，但没有模块化、没有类型安全
// 大项目中全局变量会导致命名冲突和难以追踪的 bug`,
            language: "javascript",
          },
          vue: {
            code: `// Pinia — defineStore 定义 store
import { defineStore } from "pinia"
import { computed, ref } from "vue"

export const useTodoStore = defineStore("todo", () => {
  // State：用 ref 声明
  const todos = useLocalStorage<Todo[]>("vue-todos", [])
  const filter = ref<"all" | "active" | "completed">("all")

  // Getters：用 computed 声明
  const filteredTodos = computed(() => { /* ... */ })
  const activeCount = computed(() => { /* ... */ })

  // Actions：用普通函数声明
  function addTodo(text: string) { /* ... */ }
  function removeTodo(id: number) { /* ... */ }

  // 必须 return 暴露出去
  return {
    todos, filter, filteredTodos, activeCount,
    addTodo, removeTodo, /* ... */
  }
})

// 组件中使用：
// const store = useTodoStore()
// store.addTodo("买菜")
// const { filteredTodos } = storeToRefs(store)`,
            language: "typescript",
          },
          react: {
            code: `// Zustand — create 定义 store
import { create } from "zustand"

export const useTodoStore = create<TodoState>((set, get) => ({
  // State：直接声明属性
  todos: JSON.parse(localStorage.getItem("react-todos") || "[]"),
  filter: "all",

  // Getters：用方法 + get()
  filteredTodos: () => { /* ... */ },
  activeCount: () => get().todos.filter(t => !t.done).length,

  // Actions：用方法 + set()
  addTodo: (text) => set(state => ({
    todos: [...state.todos, { /* ... */ }]
  })),
  removeTodo: (id) => set(state => ({
    todos: state.todos.filter(t => t.id !== id)
  })),
}))

// 组件中使用：
// const addTodo = useTodoStore(state => state.addTodo)
// addTodo("买菜")
// const todos = useTodoStore(state => state.filteredTodos())`,
            language: "typescript",
          },
        },
      },
      {
        title: "Store 在组件中的使用方式",
        explanation:
          "Vue 用 useTodoStore() 获取 store 实例，解构 state 时必须用 storeToRefs 保持响应式。React 用 useTodoStore(selector) 选择性订阅——只有选中的数据变化时组件才重新渲染，这是 Zustand 的性能优化机制。",
        snippets: {
          js: {
            code: `// 原生 JS — 直接访问全局变量
// 任何地方都能读写 todos 和 filter
// 没有「订阅」机制，改了数据要手动 render()

function addTodo() {
  todos.push({ text: input.value.trim(), done: false })
  save()
  render()  // 必须手动调用！
}

// 问题：忘了调 render() 界面就不更新
// 问题：忘了调 save() 数据就不持久化`,
            language: "javascript",
          },
          vue: {
            code: `// Vue 组件中使用 Pinia Store
<script setup lang="ts">
import { storeToRefs } from "pinia"
import { useTodoStore } from "../stores/useTodoStore"

const store = useTodoStore()

// ❌ 错误：直接解构会丢失响应式
// const { filteredTodos } = useTodoStore()

// ✅ 正确：用 storeToRefs 解构 state/getter
const { filter, filteredTodos } = storeToRefs(store)

// actions 可以直接解构（函数不需要响应式）
const { setFilter, addTodo } = store

// 使用：
// template 中直接用 filteredTodos（自动解包 ref）
// script 中用 filteredTodos.value
</script>`,
            language: "html",
          },
          react: {
            code: `// React 组件中使用 Zustand Store

// 方式 1：选择性订阅（推荐，性能最优）
const filter = useTodoStore(state => state.filter)
const setFilter = useTodoStore(state => state.setFilter)
// 只有 filter 变化时，这个组件才重新渲染
// 其他 state（todos 等）变化不会触发重新渲染

// 方式 2：一次性取多个（简单但可能有多余渲染）
const { toggleTodo, removeTodo, editTodo } = useTodoStore()
// 解构取出的是函数引用，不会导致额外渲染

// 方式 3：取计算值
const filteredTodos = useTodoStore(state => state.filteredTodos())
// 注意 filteredTodos() 带括号——它是方法调用

// 对比 Vue：
// Vue 用 storeToRefs 保持响应式
// React 用 selector 函数选择性订阅
// 两者目的一样：避免不必要的重新渲染`,
            language: "tsx",
          },
        },
      },
      {
        title: "Pinia vs Zustand 核心差异总结",
        explanation:
          "两者的 API 设计非常相似，但底层原理完全不同。Pinia 基于 Vue 的 Proxy 响应式系统，可以直接修改数据。Zustand 基于 React 的不可变更新原则，必须通过 set() 返回新对象。理解这个差异是理解 Vue vs React 的关键。",
        snippets: {
          js: {
            code: `// 原生 JS 的 "状态管理" 总结
// 优点：简单直接，没有学习成本
// 缺点：
//   1. 没有响应式，改数据要手动更新 UI
//   2. 没有模块化，全局变量容易冲突
//   3. 没有类型安全
//   4. 没有 DevTools 调试

// 适合：小型项目、学习原理
// 不适合：中大型项目、团队协作`,
            language: "javascript",
          },
          vue: {
            code: `// Pinia 核心特点
// 1. 基于 Proxy 响应式 → 可以直接修改
todos.value.push(newTodo)      // ✅ 直接 push
todo.done = !todo.done         // ✅ 直接改属性
todos.value.splice(idx, 1)     // ✅ 直接 splice

// 2. computed 自动缓存
const filtered = computed(() => /* ... */)
// 依赖不变就不重算

// 3. 需要 storeToRefs 解构
const { todos } = storeToRefs(store)  // ✅
const { todos } = store               // ❌ 丢失响应式

// 4. 需要 app.use(createPinia()) 注册

// 5. DevTools 支持：Vue DevTools 可以查看 store 状态`,
            language: "typescript",
          },
          react: {
            code: `// Zustand 核心特点
// 1. 不可变更新 → 必须创建新对象
set(state => ({
  todos: [...state.todos, newTodo]  // 展开创建新数组
}))
set(state => ({
  todos: state.todos.map(t =>       // map 创建新数组
    t.id === id ? { ...t, done: !t.done } : t
  )
}))

// 2. selector 选择性订阅
const filter = useTodoStore(s => s.filter)
// 只有 filter 变才重新渲染

// 3. 不需要 Provider，import 就能用
// 4. 不需要注册，不需要包裹组件
// 5. 体积极小（~1KB），API 极简

// 面试加分：为什么 React 必须不可变更新？
// React 用 === 比较 state 是否变化
// push 不改变数组引用 → React 认为没变 → 不重新渲染
// 所以必须 [...old, new] 创建新引用`,
            language: "typescript",
          },
        },
      },
    ],
  },
]
