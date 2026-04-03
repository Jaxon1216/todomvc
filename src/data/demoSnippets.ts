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
// Vue 版（Pinia + Vue Router + useLocalStorage）
// ============================================================
const vueVersion: DemoVersion = {
  id: "vue",
  label: "Vue + Pinia",
  color: "text-emerald-600 border-emerald-500 bg-emerald-50",
  dirTree: `todo-vue/src/
├── main.ts                 # 入口：createApp + Pinia + Router
├── App.vue                 # 根组件：<RouterView />
├── types/
│   └── todo.ts             # TypeScript 类型定义
├── composables/
│   └── useLocalStorage.ts  # 自定义 composable：响应式 localStorage
├── stores/
│   └── useTodoStore.ts     # Pinia Store：状态管理
├── router/
│   └── index.ts            # Vue Router：路由配置
├── pages/
│   └── TodoPage.vue        # 主页面
└── components/
    ├── TodoInput.vue       # 输入框
    ├── TodoItem.vue        # 单条 todo（展示 + 编辑 + 删除）
    ├── TodoList.vue        # 列表
    └── TodoFilter.vue      # 筛选栏`,
  dirDescription:
    "Vue 版采用标准工程结构：types 定义类型，composables 封装可复用逻辑（对应 React 的 hooks），stores 用 Pinia 管理状态，router 配置路由，components 拆分 UI。",
  sections: [
    {
      title: "类型定义 & localStorage Composable",
      explanation:
        "先定义 Todo 的 TypeScript 类型，再封装 useLocalStorage composable——把 ref 和 localStorage 同步，任何组件都能调用。",
      files: [
        {
          filename: "types/todo.ts",
          language: "typescript",
          description: "Todo 数据类型，Vue 和 React 可以共用",
          code: `export interface Todo {
  id: string
  text: string
  done: boolean
  createdAt: number
}

export type FilterType = "all" | "active" | "completed"`,
        },
        {
          filename: "composables/useLocalStorage.ts",
          language: "typescript",
          description: "自定义 composable：ref + watch 自动同步 localStorage",
          code: `import { ref, watch, type Ref } from "vue"

export function useLocalStorage<T>(key: string, defaultValue: T): Ref<T> {
  let initial: T = defaultValue
  try {
    const raw = localStorage.getItem(key)
    if (raw) initial = JSON.parse(raw) as T
  } catch { /* use default */ }

  const data = ref<T>(initial) as Ref<T>

  watch(data, (val) => {
    localStorage.setItem(key, JSON.stringify(val))
  }, { deep: true })

  return data
}`,
        },
      ],
    },
    {
      title: "Pinia Store（状态管理）",
      explanation:
        "Pinia 是 Vue 官方推荐的状态管理库。defineStore 内部用 ref 声明 state，computed 声明 getters，普通函数声明 actions。和 Redux Toolkit 的 createSlice 思路类似，但 API 更自然。",
      files: [
        {
          filename: "stores/useTodoStore.ts",
          language: "typescript",
          description: "Pinia Store：todo 的所有状态和操作",
          code: `import { computed, ref } from "vue"
import { defineStore } from "pinia"
import { useLocalStorage } from "../composables/useLocalStorage"
import type { Todo, FilterType } from "../types/todo"

export const useTodoStore = defineStore("todo", () => {
  const todos = useLocalStorage<Todo[]>("vue-todos", [])
  const filter = ref<FilterType>("all")

  const filteredTodos = computed<Todo[]>(() => {
    switch (filter.value) {
      case "active":    return todos.value.filter(t => !t.done)
      case "completed": return todos.value.filter(t => t.done)
      default:          return todos.value
    }
  })

  const activeCount = computed(() =>
    todos.value.filter(t => !t.done).length
  )

  function addTodo(text: string): void {
    const trimmed = text.trim()
    if (!trimmed) return
    todos.value.push({
      id: crypto.randomUUID(), text: trimmed,
      done: false, createdAt: Date.now(),
    })
  }

  function removeTodo(id: string): void {
    const idx = todos.value.findIndex(t => t.id === id)
    if (idx !== -1) todos.value.splice(idx, 1)
  }

  function toggleTodo(id: string): void {
    const todo = todos.value.find(t => t.id === id)
    if (todo) todo.done = !todo.done
  }

  function editTodo(id: string, newText: string): void {
    const todo = todos.value.find(t => t.id === id)
    if (todo) todo.text = newText.trim()
  }

  function setFilter(f: FilterType): void {
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
      title: "路由 & 页面",
      explanation:
        "Vue Router 配置 /:filter 动态路由，TodoPage 用 watch 监听路由参数变化，自动同步到 Pinia store 的 filter 状态。",
      files: [
        {
          filename: "router/index.ts",
          language: "typescript",
          description: "Vue Router 配置",
          code: `import { createRouter, createWebHistory } from "vue-router"
import type { RouteRecordRaw } from "vue-router"
import TodoPage from "../pages/TodoPage.vue"

const routes: RouteRecordRaw[] = [
  { path: "/", component: TodoPage },
  { path: "/:filter(all|active|completed)", component: TodoPage },
  { path: "/:pathMatch(.*)*", redirect: "/" },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})`,
        },
        {
          filename: "main.ts",
          language: "typescript",
          description: "入口：注册 Pinia + Router",
          code: `import { createApp } from "vue"
import { createPinia } from "pinia"
import router from "./router"
import App from "./App.vue"

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount("#app")`,
        },
      ],
    },
    {
      title: "组件实现",
      explanation:
        "Vue 组件用 .vue 单文件格式。组件通过 useTodoStore() 直接访问 store，不需要层层传 props。",
      files: [
        {
          filename: "components/TodoInput.vue",
          language: "html",
          description: "输入框：v-model 双向绑定 + 回车/按钮添加",
          code: `<template>
  <div class="input-bar">
    <input v-model="text" placeholder="输入待办..."
      @keydown.enter="handleAdd" />
    <button @click="handleAdd">添加</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useTodoStore } from "../stores/useTodoStore"

const text = ref("")
const store = useTodoStore()

function handleAdd(): void {
  store.addTodo(text.value)
  text.value = ""
}
</script>`,
        },
        {
          filename: "components/TodoItem.vue",
          language: "html",
          description: "单条 todo：展示、勾选、双击编辑、删除",
          code: `<template>
  <li :class="{ done: todo.done }">
    <input type="checkbox" :checked="todo.done"
      @change="store.toggleTodo(todo.id)" />
    <input v-if="isEditing" v-model="editText" ref="editInputRef"
      @blur="finishEdit" @keydown.enter="finishEdit" />
    <span v-else @dblclick="startEdit">{{ todo.text }}</span>
    <button @click="store.removeTodo(todo.id)">✕</button>
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

function startEdit(): void {
  isEditing.value = true
  editText.value = props.todo.text
  nextTick(() => editInputRef.value?.focus())
}

function finishEdit(): void {
  if (editText.value.trim()) {
    store.editTodo(props.todo.id, editText.value)
  }
  isEditing.value = false
}
</script>`,
        },
        {
          filename: "components/TodoList.vue",
          language: "html",
          description: "列表组件",
          code: `<template>
  <p v-if="filteredTodos.length === 0" class="empty">暂无待办</p>
  <ul v-else>
    <TodoItem v-for="todo in filteredTodos" :key="todo.id" :todo="todo" />
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
          filename: "components/TodoFilter.vue",
          language: "html",
          description: "筛选栏：三个按钮切换 all/active/completed",
          code: `<template>
  <div class="filters">
    <button v-for="f in filters" :key="f.value"
      :class="{ active: filter === f.value }"
      @click="setFilter(f.value)">
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
      ],
    },
  ],
}

// ============================================================
// React 版（Redux Toolkit + React Router）
// ============================================================
const reactVersion: DemoVersion = {
  id: "react",
  label: "React + RTK",
  color: "text-sky-600 border-sky-500 bg-sky-50",
  dirTree: `todo-react/src/
├── main.tsx                  # 入口：Provider + StrictMode
├── App.tsx                   # 根组件：BrowserRouter + Routes
├── types/
│   └── todo.ts               # TypeScript 类型定义
├── store/
│   ├── store.ts              # configureStore + subscribe 持久化
│   ├── todoSlice.ts          # createSlice（state + reducers）
│   ├── selectors.ts          # createSelector（派生状态）
│   └── hooks.ts              # typed useDispatch / useSelector
├── pages/
│   └── TodoPage.tsx          # 主页面 + 路由参数同步
└── components/
    ├── TodoInput.tsx          # 输入框
    ├── TodoItem.tsx           # 单条 todo
    ├── TodoList.tsx           # 列表
    └── TodoFilter.tsx         # 筛选栏`,
  dirDescription:
    "React 版用 Redux Toolkit 管理状态：createSlice 定义 state + reducers，createSelector 缓存派生状态，typed hooks 提供类型安全。store.subscribe 实现全局持久化。",
  sections: [
    {
      title: "Redux Toolkit Store",
      explanation:
        "Redux Toolkit 的核心是 createSlice —— 一个配置对象定义 state、reducers，自动生成 action creators。configureStore 组装 store，store.subscribe 实现统一持久化。",
      files: [
        {
          filename: "types/todo.ts",
          language: "typescript",
          description: "和 Vue 版完全一样的类型定义",
          code: `export interface Todo {
  id: string
  text: string
  done: boolean
  createdAt: number
}

export type FilterType = "all" | "active" | "completed"`,
        },
        {
          filename: "store/todoSlice.ts",
          language: "typescript",
          description: "createSlice：state + reducers + 自动生成 actions",
          code: `import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Todo, FilterType } from "../types/todo"

interface TodoState {
  todos: Todo[]
  filter: FilterType
}

function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem("react-todos")
    return raw ? (JSON.parse(raw) as Todo[]) : []
  } catch { return [] }
}

const initialState: TodoState = {
  todos: loadTodos(),
  filter: "all",
}

export const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    addTodo(state, action: PayloadAction<string>) {
      const text = action.payload.trim()
      if (!text) return
      state.todos.push({
        id: crypto.randomUUID(), text,
        done: false, createdAt: Date.now(),
      })
    },
    removeTodo(state, action: PayloadAction<string>) {
      state.todos = state.todos.filter(t => t.id !== action.payload)
    },
    toggleTodo(state, action: PayloadAction<string>) {
      const todo = state.todos.find(t => t.id === action.payload)
      if (todo) todo.done = !todo.done
    },
    editTodo(state, action: PayloadAction<{ id: string; text: string }>) {
      const todo = state.todos.find(t => t.id === action.payload.id)
      if (todo) todo.text = action.payload.text.trim()
    },
    setFilter(state, action: PayloadAction<FilterType>) {
      state.filter = action.payload
    },
  },
})

export const { addTodo, removeTodo, toggleTodo, editTodo, setFilter } =
  todoSlice.actions
export default todoSlice.reducer`,
        },
        {
          filename: "store/store.ts",
          language: "typescript",
          description: "configureStore + subscribe 持久化",
          code: `import { configureStore } from "@reduxjs/toolkit"
import todoReducer from "./todoSlice"

export const store = configureStore({
  reducer: { todo: todoReducer },
})

// 统一持久化：store 变化 → 自动写入 localStorage
store.subscribe(() => {
  const { todos } = store.getState().todo
  localStorage.setItem("react-todos", JSON.stringify(todos))
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch`,
        },
        {
          filename: "store/selectors.ts",
          language: "typescript",
          description: "createSelector 缓存派生状态",
          code: `import { createSelector } from "@reduxjs/toolkit"
import type { RootState } from "./store"

const selectTodos = (state: RootState) => state.todo.todos
const selectFilter = (state: RootState) => state.todo.filter

export const selectFilteredTodos = createSelector(
  [selectTodos, selectFilter],
  (todos, filter) => {
    switch (filter) {
      case "active":    return todos.filter(t => !t.done)
      case "completed": return todos.filter(t => t.done)
      default:          return todos
    }
  }
)

export const selectActiveCount = createSelector(
  [selectTodos],
  (todos) => todos.filter(t => !t.done).length
)

export { selectFilter }`,
        },
        {
          filename: "store/hooks.ts",
          language: "typescript",
          description: "typed hooks：类型安全的 dispatch / selector",
          code: `import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "./store"

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()`,
        },
      ],
    },
    {
      title: "路由 & 页面",
      explanation:
        "React Router 配置 /:filter 动态路由。TodoPage 用 useEffect 监听路由参数，同步到 Redux store 的 filter。Provider 在 main.tsx 中包裹整个应用。",
      files: [
        {
          filename: "main.tsx",
          language: "tsx",
          description: "入口：Provider 注入 Redux store",
          code: `import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import { store } from "./store/store"
import App from "./App"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
)`,
        },
        {
          filename: "App.tsx",
          language: "tsx",
          description: "路由配置",
          code: `import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import TodoPage from "./pages/TodoPage"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TodoPage />} />
        <Route path="/:filter" element={<TodoPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}`,
        },
      ],
    },
    {
      title: "组件实现",
      explanation:
        "每个组件通过 typed hooks 访问 Redux store。useAppSelector 读状态，useAppDispatch 发 action。无需 Provider 以外的额外配置。",
      files: [
        {
          filename: "components/TodoInput.tsx",
          language: "tsx",
          description: "输入框：受控 input + dispatch(addTodo)",
          code: `import { useState, type KeyboardEvent } from "react"
import { useAppDispatch } from "../store/hooks"
import { addTodo } from "../store/todoSlice"

export default function TodoInput() {
  const [text, setText] = useState("")
  const dispatch = useAppDispatch()

  const handleAdd = () => {
    if (!text.trim()) return
    dispatch(addTodo(text))
    setText("")
  }

  return (
    <div className="input-bar">
      <input value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={(e: KeyboardEvent) => e.key === "Enter" && handleAdd()}
        placeholder="输入待办..." />
      <button onClick={handleAdd}>添加</button>
    </div>
  )
}`,
        },
        {
          filename: "components/TodoItem.tsx",
          language: "tsx",
          description: "单条 todo：展示、勾选、双击编辑、删除",
          code: `import { useState, useRef, useEffect } from "react"
import { useAppDispatch } from "../store/hooks"
import { toggleTodo, removeTodo, editTodo } from "../store/todoSlice"
import type { Todo } from "../types/todo"

export default function TodoItem({ todo }: { todo: Todo }) {
  const dispatch = useAppDispatch()
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState("")
  const editRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing) editRef.current?.focus()
  }, [isEditing])

  const startEdit = () => {
    setIsEditing(true)
    setEditText(todo.text)
  }
  const finishEdit = () => {
    if (editText.trim()) {
      dispatch(editTodo({ id: todo.id, text: editText }))
    }
    setIsEditing(false)
  }

  return (
    <li className={todo.done ? "done" : ""}>
      <input type="checkbox" checked={todo.done}
        onChange={() => dispatch(toggleTodo(todo.id))} />
      {isEditing ? (
        <input ref={editRef} value={editText}
          onChange={e => setEditText(e.target.value)}
          onBlur={finishEdit}
          onKeyDown={e => e.key === "Enter" && finishEdit()} />
      ) : (
        <span onDoubleClick={startEdit}>{todo.text}</span>
      )}
      <button onClick={() => dispatch(removeTodo(todo.id))}>✕</button>
    </li>
  )
}`,
        },
        {
          filename: "components/TodoList.tsx",
          language: "tsx",
          description: "列表组件",
          code: `import { useAppSelector } from "../store/hooks"
import { selectFilteredTodos } from "../store/selectors"
import TodoItem from "./TodoItem"

export default function TodoList() {
  const filteredTodos = useAppSelector(selectFilteredTodos)

  if (filteredTodos.length === 0) {
    return <p className="empty">暂无待办</p>
  }

  return (
    <ul>
      {filteredTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  )
}`,
        },
        {
          filename: "components/TodoFilter.tsx",
          language: "tsx",
          description: "筛选栏",
          code: `import { useAppDispatch, useAppSelector } from "../store/hooks"
import { setFilter } from "../store/todoSlice"
import { selectFilter, selectActiveCount } from "../store/selectors"
import type { FilterType } from "../types/todo"

const filters: { value: FilterType; label: string }[] = [
  { value: "all", label: "全部" },
  { value: "active", label: "未完成" },
  { value: "completed", label: "已完成" },
]

export default function TodoFilter() {
  const dispatch = useAppDispatch()
  const current = useAppSelector(selectFilter)
  const activeCount = useAppSelector(selectActiveCount)

  return (
    <div className="filters">
      {filters.map(f => (
        <button key={f.value}
          className={current === f.value ? "active" : ""}
          onClick={() => dispatch(setFilter(f.value))}>
          {f.label}
        </button>
      ))}
      <span className="count">{activeCount} 项未完成</span>
    </div>
  )
}`,
        },
      ],
    },
  ],
}

export const demoVersions: DemoVersion[] = [vueVersion, reactVersion]
