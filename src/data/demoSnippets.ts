export interface DemoFile {
  filename: string
  code: string
  language: string
  description: string
}

export interface DemoVersion {
  id: string
  label: string
  color: string
  dirTree: string
  dirDescription: string
  sections: DemoSection[]
}

export interface DemoSection {
  title: string
  explanation: string
  files: DemoFile[]
}

// ============================================================
// 原生 JS 版（简洁版）
// ============================================================
const jsVersion: DemoVersion = {
  id: "js",
  label: "JS 原生",
  color: "text-yellow-600 border-yellow-500 bg-yellow-50",
  dirTree: `todo-js/
├── index.html        # 入口 HTML
├── style.css         # 样式
└── app.js            # 全部逻辑`,
  dirDescription:
    "原生 JS 不需要构建工具，三个文件搞定。逻辑全在 app.js 里，手动操作 DOM 完成增删改查和持久化。",
  sections: [
    {
      title: "完整实现",
      explanation:
        "原生版把所有逻辑放在一个文件里：数据存取用 localStorage，渲染用 innerHTML 拼接，事件用 addEventListener。没有组件概念，但逻辑清晰。",
      files: [
        {
          filename: "index.html",
          language: "html",
          description: "页面结构，引入 CSS 和 JS",
          code: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
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
        },
        {
          filename: "app.js",
          language: "javascript",
          description: "全部逻辑：增删改查 + 筛选 + localStorage",
          code: `const input = document.getElementById("input")
const addBtn = document.getElementById("addBtn")
const list = document.getElementById("list")
const empty = document.getElementById("empty")
const filterBtns = document.querySelectorAll("[data-filter]")

let todos = JSON.parse(localStorage.getItem("todos") || "[]")
let filter = "all"

function save() {
  localStorage.setItem("todos", JSON.stringify(todos))
}

function render() {
  const filtered = todos.filter(t =>
    filter === "all" ? true
      : filter === "active" ? !t.done
      : t.done
  )

  if (filtered.length === 0) {
    list.style.display = "none"
    empty.style.display = "block"
    return
  }
  list.style.display = "block"
  empty.style.display = "none"
  list.innerHTML = ""

  filtered.forEach(todo => {
    const li = document.createElement("li")
    li.className = todo.done ? "done" : ""
    li.innerHTML = \`
      <input type="checkbox" \${todo.done ? "checked" : ""} />
      <span class="text">\${todo.text}</span>
      <button class="del">✕</button>
    \`
    // 切换完成状态
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
      span.replaceWith(inp)
      inp.focus()
      const finish = () => {
        const val = inp.value.trim()
        todo.text = val || oldText
        save(); render()
      }
      inp.onblur = finish
      inp.onkeydown = (ev) => { if (ev.key === "Enter") finish() }
    }
    // 删除
    li.querySelector(".del").onclick = () => {
      todos = todos.filter(t => t !== todo)
      save(); render()
    }
    list.appendChild(li)
  })
}

addBtn.onclick = () => {
  if (!input.value.trim()) return
  todos.push({ text: input.value.trim(), done: false })
  input.value = ""
  save(); render()
}

input.onkeydown = (e) => {
  if (e.key === "Enter") addBtn.onclick()
}

filterBtns.forEach(btn => {
  btn.onclick = () => {
    filter = btn.dataset.filter
    filterBtns.forEach(b => b.classList.remove("active"))
    btn.classList.add("active")
    render()
  }
})

render()`,
        },
      ],
    },
  ],
}

// ============================================================
// Vue 版（ref/reactive → Pinia 渐进）
// ============================================================
const vueVersion: DemoVersion = {
  id: "vue",
  label: "Vue",
  color: "text-green-600 border-green-500 bg-green-50",
  dirTree: `todo-vue/
├── src/
│   ├── main.ts                 # 入口：创建 app + 挂载 Pinia
│   ├── App.vue                 # 根组件：组合所有子组件
│   ├── types/
│   │   └── todo.ts             # TypeScript 类型定义
│   ├── composables/
│   │   └── useLocalStorage.ts  # 自定义 composable：响应式 localStorage
│   ├── stores/
│   │   └── useTodoStore.ts     # Pinia Store：集中管理 todo 状态
│   └── components/
│       ├── TodoInput.vue       # 输入框组件
│       ├── TodoItem.vue        # 单条 todo 组件（展示 + 编辑 + 删除）
│       ├── TodoList.vue        # 列表组件：渲染 TodoItem
│       └── TodoFilter.vue      # 筛选栏组件
└── package.json`,
  dirDescription:
    "Vue 版采用标准工程结构：types 定义数据类型，composables 封装可复用逻辑（类似 React 的自定义 Hook），stores 用 Pinia 集中管理状态，components 拆分 UI 组件。",
  sections: [
    {
      title: "类型定义 & 自定义 Composable",
      explanation:
        "先定义 Todo 的 TypeScript 类型，再封装 useLocalStorage composable。composable 是 Vue 3 的核心模式——把可复用的响应式逻辑抽成函数，任何组件都能调用。和 React 的自定义 Hook 思路一样。",
      files: [
        {
          filename: "types/todo.ts",
          language: "typescript",
          description: "Todo 数据类型，Vue 和 React 可以共用",
          code: `export interface Todo {
  id: number
  text: string
  done: boolean
}`,
        },
        {
          filename: "composables/useLocalStorage.ts",
          language: "typescript",
          description: "自定义 composable：把 ref 和 localStorage 同步",
          code: `import { ref, watch } from "vue"

// 泛型函数：T 是存储的数据类型
export function useLocalStorage<T>(key: string, defaultValue: T) {
  // 1. 从 localStorage 读取初始值
  const stored = localStorage.getItem(key)
  const data = ref<T>(stored ? JSON.parse(stored) : defaultValue)

  // 2. watch 监听变化，自动写入 localStorage
  //    deep: true 表示深层监听（数组内部元素变化也能捕获）
  watch(data, (newVal) => {
    localStorage.setItem(key, JSON.stringify(newVal))
  }, { deep: true })

  return data
}

// 对比 React 的 useLocalStorage：
// - Vue 用 watch 自动同步，React 用 useEffect
// - Vue 的 ref 是响应式代理，React 的 state 是不可变快照
// - Vue 可以直接 data.value.push(...)，React 必须 setState([...old, new])`,
        },
      ],
    },
    {
      title: "Pinia Store（状态管理）",
      explanation:
        "Pinia 是 Vue 官方推荐的状态管理库，替代了 Vuex。核心概念：defineStore 定义 store，内部用 ref 声明 state，用普通函数声明 actions，用 computed 声明 getters。组件通过 useTodoStore() 获取 store 实例，直接调用方法。\n\n和 React 的 Zustand 非常像——都是函数式定义 store，都不需要 Provider 包裹。",
      files: [
        {
          filename: "stores/useTodoStore.ts",
          language: "typescript",
          description: "Pinia Store：todo 的所有状态和操作都在这里",
          code: `import { computed, ref } from "vue"
import { defineStore } from "pinia"
import { useLocalStorage } from "../composables/useLocalStorage"
import type { Todo } from "../types/todo"

// defineStore 第一个参数是 store 的唯一 ID
export const useTodoStore = defineStore("todo", () => {
  // ---- State ----
  // 用自定义 composable 替代普通 ref，自动持久化
  const todos = useLocalStorage<Todo[]>("vue-todos", [])
  const filter = ref<"all" | "active" | "completed">("all")
  let nextId = Date.now()

  // ---- Getters（computed）----
  const filteredTodos = computed(() => {
    switch (filter.value) {
      case "active":    return todos.value.filter(t => !t.done)
      case "completed": return todos.value.filter(t => t.done)
      default:          return todos.value
    }
  })

  const activeCount = computed(() =>
    todos.value.filter(t => !t.done).length
  )

  // ---- Actions（普通函数）----
  function addTodo(text: string) {
    if (!text.trim()) return
    todos.value.push({ id: nextId++, text: text.trim(), done: false })
    // Vue 的响应式系统会自动追踪 push 操作
    // React 里这样写不行！必须 setState([...old, newItem])
  }

  function removeTodo(id: number) {
    const idx = todos.value.findIndex(t => t.id === id)
    if (idx !== -1) todos.value.splice(idx, 1)
    // splice 直接修改数组，Vue 能检测到
    // React 里要用 filter 返回新数组
  }

  function toggleTodo(id: number) {
    const todo = todos.value.find(t => t.id === id)
    if (todo) todo.done = !todo.done
    // 直接修改对象属性，Vue 的 Proxy 会拦截
  }

  function editTodo(id: number, newText: string) {
    const todo = todos.value.find(t => t.id === id)
    if (todo) todo.text = newText.trim()
  }

  function setFilter(f: "all" | "active" | "completed") {
    filter.value = f
  }

  return {
    todos, filter, filteredTodos, activeCount,
    addTodo, removeTodo, toggleTodo, editTodo, setFilter,
  }
})`,
        },
      ],
    },
    {
      title: "组件实现",
      explanation:
        "Vue 组件用 .vue 单文件格式，template 写 HTML 模板，script setup 写逻辑。组件通过 useTodoStore() 直接访问 store，不需要层层传 props。\n\n注意和 React 的关键差异：\n- Vue 用 v-model 实现双向绑定，React 要手动 value + onChange\n- Vue 用 v-if/v-for 指令，React 用三元表达式和 map\n- Vue 用 @click 绑定事件，React 用 onClick\n- Vue 用 :class 动态绑定 class，React 用模板字符串拼接",
      files: [
        {
          filename: "main.ts",
          language: "typescript",
          description: "入口文件：创建 app 并挂载 Pinia",
          code: `import { createApp } from "vue"
import { createPinia } from "pinia"
import App from "./App.vue"

const app = createApp(App)
app.use(createPinia())  // 注册 Pinia 插件
app.mount("#app")

// 对比 React：
// React 不需要 "注册" Zustand，直接 import store 就能用
// 但 Context 方案需要 <Provider> 包裹`,
        },
        {
          filename: "App.vue",
          language: "html",
          description: "根组件：组合所有子组件",
          code: `<template>
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
        },
        {
          filename: "components/TodoInput.vue",
          language: "html",
          description: "输入框组件：v-model 双向绑定 + 回车/按钮添加",
          code: `<template>
  <div class="input-bar">
    <!--
      v-model 是 Vue 的双向绑定语法糖
      等价于 :value="text" + @input="text = $event.target.value"
      React 没有 v-model，必须手写 value + onChange
    -->
    <input
      v-model="text"
      placeholder="输入待办..."
      @keydown.enter="handleAdd"
    />
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
  text.value = ""
}
</script>`,
        },
        {
          filename: "components/TodoFilter.vue",
          language: "html",
          description: "筛选栏：三个按钮切换 all/active/completed",
          code: `<template>
  <div class="filters">
    <button
      v-for="f in filters"
      :key="f.value"
      :class="{ active: filter === f.value }"
      @click="setFilter(f.value)"
    >
      {{ f.label }}
    </button>
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
        },
        {
          filename: "components/TodoList.vue",
          language: "html",
          description: "列表组件：渲染筛选后的 todo 列表",
          code: `<template>
  <!--
    v-if / v-else：条件渲染
    React 里用三元表达式：{list.length === 0 ? <p>...</p> : <ul>...</ul>}
  -->
  <p v-if="filteredTodos.length === 0" class="empty">暂无待办</p>
  <ul v-else>
    <!--
      v-for：列表渲染，:key 是 diff 算法的依据
      React 里用 map：{list.map(todo => <TodoItem key={todo.id} />)}
    -->
    <TodoItem
      v-for="todo in filteredTodos"
      :key="todo.id"
      :todo="todo"
    />
  </ul>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia"
import { useTodoStore } from "../stores/useTodoStore"
import TodoItem from "./TodoItem.vue"

const { filteredTodos } = storeToRefs(useTodoStore())
</script>`,
        },
        {
          filename: "components/TodoItem.vue",
          language: "html",
          description: "单条 todo：展示、勾选、双击编辑、删除",
          code: `<template>
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

// defineProps 返回 readonly 的响应式对象
// React 里是函数参数：function TodoItem({ todo }: { todo: Todo })
const props = defineProps<{ todo: Todo }>()
const store = useTodoStore()

const isEditing = ref(false)
const editText = ref("")
const editInputRef = ref<HTMLInputElement>()

function startEdit() {
  isEditing.value = true
  editText.value = props.todo.text  // 通过 props.todo 访问
  // nextTick：等 DOM 更新后再 focus
  // React 里用 useEffect + useRef
  nextTick(() => editInputRef.value?.focus())
}

function finishEdit() {
  if (editText.value.trim()) {
    store.editTodo(props.todo.id, editText.value)
  }
  isEditing.value = false
}
</script>`,
        },
      ],
    },
  ],
}

// ============================================================
// React 版（useState → useReducer → Zustand 三级递进）
// ============================================================
const reactVersion: DemoVersion = {
  id: "react",
  label: "React",
  color: "text-blue-600 border-blue-500 bg-blue-50",
  dirTree: `todo-react/
├── src/
│   ├── main.tsx                  # 入口
│   ├── App.tsx                   # 根组件
│   ├── types/
│   │   └── todo.ts               # TypeScript 类型定义
│   ├── hooks/
│   │   └── useLocalStorage.ts    # 自定义 Hook：响应式 localStorage
│   ├── store/
│   │   └── useTodoStore.ts       # Zustand Store（最终版）
│   └── components/
│       ├── TodoInput.tsx          # 输入框组件
│       ├── TodoItem.tsx           # 单条 todo 组件
│       ├── TodoList.tsx           # 列表组件
│       └── TodoFilter.tsx         # 筛选栏组件
└── package.json`,
  dirDescription:
    "React 版结构和 Vue 版几乎一样：types 定义类型，hooks 封装可复用逻辑（对应 Vue 的 composables），store 用 Zustand 管理状态（对应 Vue 的 Pinia），components 拆分 UI。",
  sections: [
    {
      title: "类型定义 & 自定义 Hook",
      explanation:
        "自定义 Hook 是 React 的核心复用模式——把 useState + useEffect 组合成一个可复用的函数。命名必须以 use 开头。\n\n对比 Vue 的 composable：\n- React 用 useEffect 监听变化并同步 localStorage\n- Vue 用 watch 监听变化\n- React 的 state 是不可变的（每次 setState 创建新值）\n- Vue 的 ref 是可变的（直接改 .value）",
      files: [
        {
          filename: "types/todo.ts",
          language: "typescript",
          description: "和 Vue 版完全一样的类型定义",
          code: `export interface Todo {
  id: number
  text: string
  done: boolean
}

// 筛选类型
export type FilterType = "all" | "active" | "completed"`,
        },
        {
          filename: "hooks/useLocalStorage.ts",
          language: "typescript",
          description: "自定义 Hook：useState + useEffect 实现 localStorage 同步",
          code: `import { useState, useEffect } from "react"

export function useLocalStorage<T>(key: string, defaultValue: T) {
  // 1. 初始化：从 localStorage 读取，读不到就用默认值
  //    useState 的参数可以是函数（惰性初始化），只在首次渲染执行
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : defaultValue
  })

  // 2. 同步：value 变化时写入 localStorage
  //    useEffect 的依赖数组 [key, value] 表示：
  //    只有 key 或 value 变化时才执行
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  // 返回和 useState 一样的 [value, setter] 元组
  return [value, setValue] as const
}

// 对比 Vue 的 useLocalStorage：
//
// Vue 版：
//   const data = ref(stored ? JSON.parse(stored) : defaultValue)
//   watch(data, (val) => localStorage.setItem(key, JSON.stringify(val)), { deep: true })
//   return data  ← 返回一个 ref
//
// React 版：
//   const [value, setValue] = useState(...)
//   useEffect(() => localStorage.setItem(...), [value])
//   return [value, setValue]  ← 返回 [值, setter]
//
// 核心差异：
// - Vue 返回一个可直接修改的 ref（data.value = xxx）
// - React 返回 [值, setter]，必须通过 setter 更新
// - Vue 的 watch 能深层监听，React 的 useEffect 比较的是引用`,
        },
      ],
    },
    {
      title: "第一阶段：useState 基础版",
      explanation:
        "先用最基础的 useState 实现全部功能。所有状态放在 App 组件里，通过 props 层层传递给子组件。\n\n这是 React 初学者最直觉的写法，但问题是：当组件层级变深时，props 要一层层传（props drilling），代码会很啰嗦。",
      files: [
        {
          filename: "App.tsx（useState 版）",
          language: "tsx",
          description: "所有状态在 App 里，通过 props 传给子组件",
          code: `import { useState } from "react"
import { useLocalStorage } from "./hooks/useLocalStorage"
import type { Todo, FilterType } from "./types/todo"
import TodoInput from "./components/TodoInput"
import TodoList from "./components/TodoList"
import TodoFilter from "./components/TodoFilter"

export default function App() {
  // 用自定义 Hook 替代普通 useState，自动持久化
  const [todos, setTodos] = useLocalStorage<Todo[]>("react-todos", [])
  const [filter, setFilter] = useState<FilterType>("all")

  // ---- 操作函数 ----
  // 注意：每个函数都通过 setTodos 创建新数组/新对象
  // 这是 React 的「不可变更新」原则

  const addTodo = (text: string) => {
    if (!text.trim()) return
    // 展开运算符 [...old, new] 创建新数组
    setTodos(prev => [...prev, {
      id: Date.now(),
      text: text.trim(),
      done: false,
    }])
  }

  const removeTodo = (id: number) => {
    // filter 返回新数组，不修改原数组
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  const toggleTodo = (id: number) => {
    // map 返回新数组，内部用展开运算符创建新对象
    setTodos(prev => prev.map(t =>
      t.id === id ? { ...t, done: !t.done } : t
    ))
  }

  const editTodo = (id: number, newText: string) => {
    setTodos(prev => prev.map(t =>
      t.id === id ? { ...t, text: newText.trim() } : t
    ))
  }

  // 筛选逻辑
  const filteredTodos = todos.filter(t =>
    filter === "all" ? true
      : filter === "active" ? !t.done
      : t.done
  )

  const activeCount = todos.filter(t => !t.done).length

  return (
    <div className="app">
      <h1>Todo List</h1>
      {/* 每个子组件都需要通过 props 接收数据和回调 */}
      <TodoInput onAdd={addTodo} />
      <TodoFilter current={filter} onChange={setFilter} />
      <TodoList
        todos={filteredTodos}
        onToggle={toggleTodo}
        onRemove={removeTodo}
        onEdit={editTodo}
      />
      <p className="count">{activeCount} 项未完成</p>
    </div>
  )
}

// 问题：App 组件承担了太多职责
// 所有状态逻辑都在这里，子组件只是"展示组件"
// 如果再加功能（排序、分类、搜索...），App 会越来越臃肿
// → 解决方案：useReducer 或 Zustand`,
        },
      ],
    },
    {
      title: "第二阶段：useReducer 重构",
      explanation:
        "当 useState 的更新逻辑变复杂时，useReducer 是更好的选择。它把「状态如何变化」集中到一个 reducer 函数里，通过 dispatch(action) 触发更新。\n\n思路和 Redux 一样：\n- state：当前状态\n- action：描述「发生了什么」的对象 { type, payload }\n- reducer：根据 action 返回新 state 的纯函数\n\n好处：逻辑集中、易测试、action 可追踪。",
      files: [
        {
          filename: "App.tsx（useReducer 版）",
          language: "tsx",
          description: "用 reducer 集中管理状态变更逻辑",
          code: `import { useReducer, useState } from "react"
import { useLocalStorage } from "./hooks/useLocalStorage"
import type { Todo, FilterType } from "./types/todo"
import TodoInput from "./components/TodoInput"
import TodoList from "./components/TodoList"
import TodoFilter from "./components/TodoFilter"

// ---- Action 类型定义 ----
// 每个 action 描述一种操作，payload 是操作需要的数据
type TodoAction =
  | { type: "ADD";    payload: string }
  | { type: "REMOVE"; payload: number }
  | { type: "TOGGLE"; payload: number }
  | { type: "EDIT";   payload: { id: number; text: string } }

// ---- Reducer 函数 ----
// 纯函数：接收旧 state + action，返回新 state
// 注意：每个 case 都返回新数组/新对象，不修改原 state
function todoReducer(state: Todo[], action: TodoAction): Todo[] {
  switch (action.type) {
    case "ADD":
      return [...state, {
        id: Date.now(),
        text: action.payload.trim(),
        done: false,
      }]
    case "REMOVE":
      return state.filter(t => t.id !== action.payload)
    case "TOGGLE":
      return state.map(t =>
        t.id === action.payload ? { ...t, done: !t.done } : t
      )
    case "EDIT":
      return state.map(t =>
        t.id === action.payload.id
          ? { ...t, text: action.payload.text.trim() }
          : t
      )
    default:
      return state
  }
}

export default function App() {
  // useReducer(reducer函数, 初始值)
  // 返回 [当前state, dispatch函数]
  const [todos, dispatch] = useReducer(todoReducer, [], () => {
    const stored = localStorage.getItem("react-todos")
    return stored ? JSON.parse(stored) : []
  })
  const [filter, setFilter] = useState<FilterType>("all")

  // 同步到 localStorage（useReducer 不自带持久化）
  // 实际项目中可以用 useEffect 监听 todos 变化
  // useEffect(() => {
  //   localStorage.setItem("react-todos", JSON.stringify(todos))
  // }, [todos])

  const filteredTodos = todos.filter(t =>
    filter === "all" ? true
      : filter === "active" ? !t.done
      : t.done
  )

  return (
    <div className="app">
      <h1>Todo List</h1>
      <TodoInput onAdd={(text) => dispatch({ type: "ADD", payload: text })} />
      <TodoFilter current={filter} onChange={setFilter} />
      <TodoList
        todos={filteredTodos}
        onToggle={(id) => dispatch({ type: "TOGGLE", payload: id })}
        onRemove={(id) => dispatch({ type: "REMOVE", payload: id })}
        onEdit={(id, text) => dispatch({ type: "EDIT", payload: { id, text } })}
      />
      <p className="count">
        {todos.filter(t => !t.done).length} 项未完成
      </p>
    </div>
  )
}

// 对比 useState 版：
// - 状态更新逻辑从 App 组件里抽出来了，集中在 todoReducer
// - dispatch 替代了多个 setXxx 函数
// - 但 props drilling 问题还在——子组件还是要接收一堆 props
// → 最终方案：Zustand（彻底解决 props drilling）`,
        },
      ],
    },
    {
      title: "第三阶段：Zustand（最终版）",
      explanation:
        "Zustand 是 React 生态最流行的轻量状态管理库。核心思想：\n- create() 定义一个全局 store\n- 组件里直接 useTodoStore() 获取状态和方法\n- 不需要 Provider、不需要 Context、不需要 dispatch\n\n和 Vue 的 Pinia 非常像：都是函数式定义 store，组件直接调用。\n\n对比三种方案：\n- useState：简单但 props drilling\n- useReducer：逻辑集中但还是 props drilling\n- Zustand：逻辑集中 + 任何组件直接访问，最优解",
      files: [
        {
          filename: "store/useTodoStore.ts",
          language: "typescript",
          description: "Zustand Store：全局状态 + 操作方法",
          code: `import { create } from "zustand"
import type { Todo, FilterType } from "../types/todo"

interface TodoState {
  todos: Todo[]
  filter: FilterType
  // Getter 方法
  filteredTodos: () => Todo[]
  activeCount: () => number
  // Action 方法
  addTodo: (text: string) => void
  removeTodo: (id: number) => void
  toggleTodo: (id: number) => void
  editTodo: (id: number, text: string) => void
  setFilter: (filter: FilterType) => void
}

// create<TodoState>() 创建一个 store hook
// set 函数用于更新状态，get 函数用于读取当前状态
export const useTodoStore = create<TodoState>((set, get) => ({
  // ---- 初始状态 ----
  todos: JSON.parse(localStorage.getItem("react-todos") || "[]"),
  filter: "all",

  // ---- Getter ----
  filteredTodos: () => {
    const { todos, filter } = get()
    switch (filter) {
      case "active":    return todos.filter(t => !t.done)
      case "completed": return todos.filter(t => t.done)
      default:          return todos
    }
  },

  activeCount: () => get().todos.filter(t => !t.done).length,

  // ---- Actions ----
  // set() 接收一个函数，参数是当前 state，返回要更新的部分
  // Zustand 会自动浅合并（类似 setState 的对象形式）
  addTodo: (text) => {
    if (!text.trim()) return
    set(state => {
      const newTodos = [...state.todos, {
        id: Date.now(),
        text: text.trim(),
        done: false,
      }]
      localStorage.setItem("react-todos", JSON.stringify(newTodos))
      return { todos: newTodos }
    })
  },

  removeTodo: (id) => set(state => {
    const newTodos = state.todos.filter(t => t.id !== id)
    localStorage.setItem("react-todos", JSON.stringify(newTodos))
    return { todos: newTodos }
  }),

  toggleTodo: (id) => set(state => {
    const newTodos = state.todos.map(t =>
      t.id === id ? { ...t, done: !t.done } : t
    )
    localStorage.setItem("react-todos", JSON.stringify(newTodos))
    return { todos: newTodos }
  }),

  editTodo: (id, text) => set(state => {
    const newTodos = state.todos.map(t =>
      t.id === id ? { ...t, text: text.trim() } : t
    )
    localStorage.setItem("react-todos", JSON.stringify(newTodos))
    return { todos: newTodos }
  }),

  setFilter: (filter) => set({ filter }),
}))

// 对比 Vue 的 Pinia Store：
//
// Pinia:
//   const todos = ref<Todo[]>([])
//   function addTodo(text) { todos.value.push({...}) }  ← 直接 push
//
// Zustand:
//   addTodo: (text) => set(state => ({
//     todos: [...state.todos, {...}]  ← 必须创建新数组
//   }))
//
// 核心差异：Vue 可以直接修改（Proxy 拦截），React 必须不可变更新`,
        },
        {
          filename: "App.tsx（Zustand 版 — 最终版）",
          language: "tsx",
          description: "App 组件变得极其简洁，不再传递 props",
          code: `import { useTodoStore } from "./store/useTodoStore"
import TodoInput from "./components/TodoInput"
import TodoList from "./components/TodoList"
import TodoFilter from "./components/TodoFilter"

export default function App() {
  // 组件直接从 store 取需要的数据
  // Zustand 会自动追踪：只有 activeCount 变化时才重新渲染
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
}

// 对比 useState 版的 App：
// - 没有任何 state 声明
// - 没有任何操作函数
// - 没有任何 props 传递
// - 子组件自己从 store 取数据
// 这就是全局状态管理的威力！`,
        },
      ],
    },
    {
      title: "组件实现（Zustand 版）",
      explanation:
        "使用 Zustand 后，每个组件直接从 store 获取自己需要的数据和方法，不再依赖父组件传 props。这让组件更独立、更容易复用和测试。\n\n注意 React 组件的几个关键模式：\n- 受控组件：input 的 value 由 state 控制\n- 事件处理：onChange、onClick、onKeyDown\n- 条件渲染：三元表达式 ? :\n- 列表渲染：array.map() + key",
      files: [
        {
          filename: "components/TodoInput.tsx",
          language: "tsx",
          description: "输入框组件：受控 input + 回车/按钮添加",
          code: `import { useState } from "react"
import { useTodoStore } from "../store/useTodoStore"

export default function TodoInput() {
  // 输入框的文字是组件自己的局部状态
  // 不需要放到全局 store 里——只有这个组件关心它
  const [text, setText] = useState("")

  // 从 store 取 addTodo 方法
  const addTodo = useTodoStore(state => state.addTodo)

  const handleAdd = () => {
    addTodo(text)
    setText("")
  }

  return (
    <div className="input-bar">
      {/*
        受控组件：value 和 onChange 必须配对
        Vue 里一个 v-model 就搞定了
        React 必须手动：value={text} + onChange={e => setText(e.target.value)}
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
        },
        {
          filename: "components/TodoFilter.tsx",
          language: "tsx",
          description: "筛选栏组件：三个按钮切换筛选条件",
          code: `import { useTodoStore } from "../store/useTodoStore"
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

// 对比 Vue 版：
// Vue:  :class="{ active: filter === f.value }"  ← 对象语法
// React: className={filter === f.value ? "active" : ""}  ← 三元表达式
//
// Vue:  @click="setFilter(f.value)"
// React: onClick={() => setFilter(f.value)}  ← 箭头函数包裹`,
        },
        {
          filename: "components/TodoList.tsx",
          language: "tsx",
          description: "列表组件：渲染筛选后的 todo",
          code: `import { useTodoStore } from "../store/useTodoStore"
import TodoItem from "./TodoItem"

export default function TodoList() {
  // 从 store 取筛选后的列表
  const filteredTodos = useTodoStore(state => state.filteredTodos())

  if (filteredTodos.length === 0) {
    return <p className="empty">暂无待办</p>
  }

  return (
    <ul>
      {filteredTodos.map(todo => (
        // key 必须是唯一且稳定的值
        // 不要用数组 index 当 key（删除/排序时会出 bug）
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  )
}

// 对比 Vue 版：
// Vue:  <p v-if="list.length === 0">暂无</p>
//       <ul v-else>
//         <TodoItem v-for="todo in list" :key="todo.id" :todo="todo" />
//       </ul>
//
// React: if (...) return <p>暂无</p>
//        return <ul>{list.map(todo => <TodoItem key={todo.id} ... />)}</ul>
//
// Vue 用指令（v-if, v-for），React 用 JS 原生语法（if, map）`,
        },
        {
          filename: "components/TodoItem.tsx",
          language: "tsx",
          description: "单条 todo：展示、勾选、双击编辑、删除",
          code: `import { useState, useRef, useEffect } from "react"
import { useTodoStore } from "../store/useTodoStore"
import type { Todo } from "../types/todo"

interface TodoItemProps {
  todo: Todo
}

export default function TodoItem({ todo }: TodoItemProps) {
  const { toggleTodo, removeTodo, editTodo } = useTodoStore()

  // 编辑相关的局部状态
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState("")
  const editInputRef = useRef<HTMLInputElement>(null)

  // useEffect：当 isEditing 变为 true 时，自动 focus 输入框
  // 依赖数组 [isEditing] 表示只在 isEditing 变化时执行
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
}

// 对比 Vue 版的 TodoItem：
//
// 自动 focus：
//   Vue:   nextTick(() => editInputRef.value?.focus())
//   React: useEffect(() => { editInputRef.current?.focus() }, [isEditing])
//
// ref 访问 DOM：
//   Vue:   const editInputRef = ref<HTMLInputElement>()  → editInputRef.value
//   React: const editInputRef = useRef<HTMLInputElement>(null)  → editInputRef.current
//
// 双击事件：
//   Vue:   @dblclick="startEdit"
//   React: onDoubleClick={startEdit}  ← 注意大小写！`,
        },
      ],
    },
    {
      title: "三种方案对比总结",
      explanation:
        "最后总结一下 React 三种状态管理方案的适用场景，帮你面试时能说清楚「为什么选 Zustand」。",
      files: [
        {
          filename: "状态管理方案对比",
          language: "typescript",
          description: "三种方案的优劣对比",
          code: `// ============================================
// React 状态管理方案对比
// ============================================

// 1. useState
// 适用：简单组件、局部状态
// 优点：简单直观，零学习成本
// 缺点：复杂逻辑散落各处，props drilling
//
// const [todos, setTodos] = useState<Todo[]>([])
// setTodos(prev => [...prev, newTodo])

// 2. useReducer
// 适用：单组件内复杂状态逻辑
// 优点：逻辑集中在 reducer，action 可追踪，易测试
// 缺点：样板代码多，还是 props drilling
//
// const [todos, dispatch] = useReducer(reducer, [])
// dispatch({ type: "ADD", payload: "买菜" })

// 3. Zustand（推荐）
// 适用：跨组件共享状态，中大型项目
// 优点：极简 API，不需要 Provider，自动性能优化
// 缺点：引入第三方依赖
//
// const addTodo = useTodoStore(state => state.addTodo)
// addTodo("买菜")

// ============================================
// Vue 对应方案
// ============================================
// useState   →  ref() / reactive()
// useReducer →  没有直接对应（Vue 不需要，因为可以直接修改）
// Zustand    →  Pinia
// Context    →  provide / inject

// ============================================
// 面试常见问题
// ============================================
// Q: 为什么 React 需要不可变更新？
// A: React 通过比较引用（===）判断 state 是否变化。
//    如果直接 push，数组引用没变，React 不会重新渲染。
//    Vue 用 Proxy 拦截，所以可以直接修改。
//
// Q: Zustand vs Redux？
// A: Zustand 更轻量（1KB vs 7KB），API 更简单，
//    不需要 Provider/Action Creator/Middleware 等概念。
//    Redux 适合超大型项目需要严格规范的场景。
//
// Q: 什么时候用 Context vs Zustand？
// A: Context 适合低频更新的全局配置（主题、语言）。
//    频繁更新的数据（todo 列表）用 Zustand，
//    因为 Context 变化会导致所有消费组件重新渲染。`,
        },
      ],
    },
  ],
}

export const demoVersions: DemoVersion[] = [jsVersion, vueVersion, reactVersion]
