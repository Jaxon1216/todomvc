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
  thinkingGuide?: string
  snippets: {
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
    description: "两个 Todo 项目的目录结构和启动方式，理解框架项目的骨架。",
    sections: [
      {
        title: "项目目录结构",
        explanation:
          "Vue 和 React 都有标准的工程目录：types 定义类型、components 拆分组件、stores/store 管理状态。注意 Vue 的 composables 对应 React 的 hooks，Vue 的 stores(Pinia) 对应 React 的 store(Redux Toolkit)。",
        thinkingGuide: `场景：从零搭建一个 Todo 应用，需要组织文件结构。

思路：当组件变多、逻辑变复杂时，需要按职责拆分：类型定义、UI 组件、状态管理、可复用逻辑各归各的目录。

伪代码：
  项目结构 = {
    入口文件:  启动应用、挂载到 DOM,
    types/:   数据类型定义（Todo 长什么样）,
    components/: UI 组件（输入框、列表、筛选栏）,
    stores/:  状态管理（数据的增删改查）,
    hooks/:   可复用逻辑（localStorage 读写）,
    router/:  路由配置（URL 与页面的映射）
  }`,
        snippets: {
          vue: {
            code: `todo-vue/src/
├── main.ts                 # 入口：创建 app + 挂载 Pinia + Router
├── App.vue                 # 根组件：<RouterView />
├── types/
│   └── todo.ts             # TypeScript 类型定义
├── composables/
│   └── useLocalStorage.ts  # 自定义 composable（≈ React 的自定义 Hook）
├── stores/
│   └── useTodoStore.ts     # Pinia Store（状态管理）
├── router/
│   └── index.ts            # Vue Router 路由配置
├── pages/
│   └── TodoPage.vue        # 主页面
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
├── App.tsx                   # 根组件：Provider + Router
├── types/
│   └── todo.ts               # TypeScript 类型定义
├── store/
│   ├── store.ts              # configureStore（Redux Toolkit）
│   ├── todoSlice.ts          # createSlice（状态 + reducers）
│   ├── selectors.ts          # createSelector（派生状态）
│   └── hooks.ts              # typed useDispatch / useSelector
├── pages/
│   └── TodoPage.tsx          # 主页面
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
          "两者都需要一个入口把应用挂载到 DOM 上。Vue 用 createApp + Pinia + Router 插件注册；React 用 createRoot + Provider 包裹 + BrowserRouter。注意 Vue 需要 app.use() 注册插件，而 React 用组件嵌套（Provider / BrowserRouter）。",
        thinkingGuide: `场景：浏览器只认识 HTML，框架代码需要一个入口来启动应用。

思路：HTML 里放一个空容器 <div id="app">，入口 JS 找到它，把整个应用挂载上去。

伪代码：
  const 容器 = document.getElementById("app")
  const 应用 = 创建应用(根组件)
  应用.use(状态管理插件)
  应用.use(路由插件)
  应用.挂载到(容器)`,
        snippets: {
          vue: {
            code: `// main.ts
import { createApp } from "vue"
import { createPinia } from "pinia"
import router from "./router"
import App from "./App.vue"

const app = createApp(App)
app.use(createPinia())  // 注册 Pinia（状态管理）
app.use(router)          // 注册 Vue Router
app.mount("#app")`,
            language: "typescript",
          },
          react: {
            code: `// main.tsx
import { StrictMode } from "react"
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
)

// Vue 用 app.use() 注册插件
// React 用组件包裹：<Provider> 提供 Redux store`,
            language: "tsx",
          },
        },
      },
      {
        title: "类型定义 & 根组件",
        explanation:
          "TypeScript 类型定义两个版本可以共用。根组件负责放置路由出口——Vue 用 <RouterView />，React 用 <BrowserRouter> + <Routes>。",
        snippets: {
          vue: {
            code: `// types/todo.ts — 类型定义
export interface Todo {
  id: string
  text: string
  done: boolean
  createdAt: number
}
export type FilterType = "all" | "active" | "completed"

// App.vue — 根组件
<template>
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from "vue-router"
</script>`,
            language: "html",
          },
          react: {
            code: `// types/todo.ts — 类型定义（和 Vue 版完全一样）
export interface Todo {
  id: string
  text: string
  done: boolean
  createdAt: number
}
export type FilterType = "all" | "active" | "completed"

// App.tsx — 根组件
import { BrowserRouter, Routes, Route } from "react-router-dom"
import TodoPage from "./pages/TodoPage"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TodoPage />} />
        <Route path="/:filter" element={<TodoPage />} />
      </Routes>
    </BrowserRouter>
  )
}`,
            language: "tsx",
          },
        },
      },
    ],
  },

  // ============================================================
  // 第 2 章：组件拆分 & CRUD
  // ============================================================
  {
    id: "components-crud",
    title: "组件拆分 & CRUD",
    description: "如何把 UI 拆成独立组件，实现增删改查四个核心操作。",
    sections: [
      {
        title: "输入框组件（添加 Todo）",
        explanation:
          "TodoInput 负责输入和添加。Vue 用 v-model 双向绑定输入框，React 必须手动写 value + onChange（受控组件）。Vue 从 store 调用 addTodo，React 通过 dispatch(addTodo(text)) 触发 action。",
        thinkingGuide: `场景：用户在输入框打字，点击添加或按回车，新 todo 入列表，输入框清空。

伪代码：
  function 输入框组件() {
    let text = ""
    function 处理添加() {
      if (text为空) return
      store.addTodo(text)  // Vue
      dispatch(addTodo(text))  // React
      text = ""
    }
    return (
      <input 值={text} 回车时={处理添加} />
      <button 点击时={处理添加}>添加</button>
    )
  }`,
        snippets: {
          vue: {
            code: `<!-- components/TodoInput.vue -->
<template>
  <div class="input-bar">
    <!-- v-model 双向绑定：React 没有，必须手写 value + onChange -->
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
  store.addTodo(text.value)  // 直接调用 store 方法
  text.value = ""            // 直接赋值清空
}
</script>`,
            language: "html",
          },
          react: {
            code: `// components/TodoInput.tsx
import { useState, type KeyboardEvent } from "react"
import { useAppDispatch } from "../store/hooks"
import { addTodo } from "../store/todoSlice"

export default function TodoInput() {
  const [text, setText] = useState("")
  const dispatch = useAppDispatch()

  const handleAdd = () => {
    if (!text.trim()) return
    dispatch(addTodo(text))  // dispatch action
    setText("")              // 通过 setter 清空
  }

  return (
    <div className="input-bar">
      {/* 受控组件：value + onChange 必须配对 */}
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={(e: KeyboardEvent) =>
          e.key === "Enter" && handleAdd()
        }
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
          "TodoList 展示筛选后的 todo 列表。空列表时显示提示文字，否则渲染 TodoItem。Vue 用 v-if/v-else + v-for，React 用 if 语句 + array.map()。两者都需要 key 来优化 diff 算法。",
        snippets: {
          vue: {
            code: `<!-- components/TodoList.vue -->
<template>
  <p v-if="filteredTodos.length === 0" class="empty">暂无待办</p>
  <ul v-else>
    <!-- v-for + :key：列表渲染 -->
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

// storeToRefs 保持响应式解构
const { filteredTodos } = storeToRefs(useTodoStore())
</script>`,
            language: "html",
          },
          react: {
            code: `// components/TodoList.tsx
import { useAppSelector } from "../store/hooks"
import { selectFilteredTodos } from "../store/selectors"
import TodoItem from "./TodoItem"

export default function TodoList() {
  // createSelector 缓存：只有 todos/filter 变化才重新计算
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
        title: "TodoItem（勾选 + 双击编辑 + 删除）",
        explanation:
          "TodoItem 是最复杂的组件：展示文字、勾选完成、双击进入编辑模式、失焦或回车保存、删除。Vue 用 v-if/v-else 切换展示/编辑，React 用三元表达式。「进入编辑时自动 focus」——Vue 用 nextTick，React 用 useEffect。",
        thinkingGuide: `场景：TodoItem 支持勾选完成、双击编辑、回车/失焦保存、删除四种交互。

伪代码：
  function TodoItem({ todo }) {
    let isEditing = false
    let editText = ""

    function 开始编辑() {
      isEditing = true
      editText = todo.text
      等DOM更新后(() => inputRef.focus())
    }
    function 完成编辑() {
      if (editText不为空) store.editTodo(todo.id, editText)
      isEditing = false
    }
  }`,
        snippets: {
          vue: {
            code: `<!-- components/TodoItem.vue -->
<template>
  <li :class="{ done: todo.done }">
    <input type="checkbox" :checked="todo.done"
      @change="store.toggleTodo(todo.id)" />

    <!-- v-if/v-else 切换编辑/展示模式 -->
    <input v-if="isEditing" v-model="editText"
      ref="editInputRef"
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

function startEdit() {
  isEditing.value = true
  editText.value = props.todo.text
  // nextTick：等 DOM 更新完再 focus
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
import { useAppDispatch } from "../store/hooks"
import { toggleTodo, removeTodo, editTodo } from "../store/todoSlice"
import type { Todo } from "../types/todo"

export default function TodoItem({ todo }: { todo: Todo }) {
  const dispatch = useAppDispatch()
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState("")
  const editRef = useRef<HTMLInputElement>(null)

  // useEffect：isEditing 变为 true 时自动 focus
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
      <button onClick={() => dispatch(removeTodo(todo.id))}>
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
        title: "筛选组件（动态 class & 事件）",
        explanation:
          "TodoFilter 有三个按钮，当前选中的高亮。Vue 用 :class 对象语法，React 用三元表达式拼 className。Vue 从 store 调 setFilter，React dispatch(setFilter(f))。",
        snippets: {
          vue: {
            code: `<!-- components/TodoFilter.vue -->
<template>
  <div class="filters">
    <button
      v-for="f in filters" :key="f.value"
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
            language: "html",
          },
          react: {
            code: `// components/TodoFilter.tsx
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { setFilter } from "../store/todoSlice"
import { selectFilter } from "../store/selectors"
import type { FilterType } from "../types/todo"

const filters: { value: FilterType; label: string }[] = [
  { value: "all", label: "全部" },
  { value: "active", label: "未完成" },
  { value: "completed", label: "已完成" },
]

export default function TodoFilter() {
  const dispatch = useAppDispatch()
  const currentFilter = useAppSelector(selectFilter)

  return (
    <div className="filters">
      {filters.map(f => (
        <button
          key={f.value}
          className={currentFilter === f.value ? "active" : ""}
          onClick={() => dispatch(setFilter(f.value))}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}

// 动态 class 对比：
// Vue:  :class="{ active: filter === f.value }"
// React: className={condition ? "active" : ""}`,
            language: "tsx",
          },
        },
      },
    ],
  },

  // ============================================================
  // 第 3 章：状态管理（Pinia vs Redux Toolkit）
  // ============================================================
  {
    id: "state-management",
    title: "状态管理",
    description: "Pinia vs Redux Toolkit：定义 Store、修改状态、派生计算。",
    sections: [
      {
        title: "定义 Store（全局状态容器）",
        explanation:
          "Vue 用 Pinia 的 defineStore 定义 store，内部用 ref 声明 state、computed 声明 getters、普通函数声明 actions。React 用 Redux Toolkit 的 createSlice 定义 slice，state + reducers 写在一起，configureStore 组装。",
        thinkingGuide: `场景：多个组件共享 todo 数据，需要一个集中管理的 Store。

对比：
  Pinia:  defineStore("id", () => { ... return { state, getters, actions } })
  RTK:    createSlice({ name, initialState, reducers: { ... } })
          configureStore({ reducer: { todo: todoSlice.reducer } })

  Pinia 像一个函数，return 暴露 API
  RTK 像一个配置对象，自动生成 action creators`,
        snippets: {
          vue: {
            code: `// stores/useTodoStore.ts — Pinia Store
import { computed, ref } from "vue"
import { defineStore } from "pinia"
import { useLocalStorage } from "../composables/useLocalStorage"
import type { Todo, FilterType } from "../types/todo"

export const useTodoStore = defineStore("todo", () => {
  // ---- State（用 ref 声明）----
  const todos = useLocalStorage<Todo[]>("vue-todos", [])
  const filter = ref<FilterType>("all")

  // ---- Getters（用 computed 声明，自动缓存）----
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
    todos.value.push({
      id: crypto.randomUUID(),
      text: text.trim(), done: false,
      createdAt: Date.now(),
    })
  }

  // 必须 return 暴露出去
  return { todos, filter, filteredTodos, activeCount, addTodo, /* ... */ }
})`,
            language: "typescript",
          },
          react: {
            code: `// store/todoSlice.ts — Redux Toolkit Slice
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Todo, FilterType } from "../types/todo"

interface TodoState {
  todos: Todo[]
  filter: FilterType
}

const initialState: TodoState = {
  todos: JSON.parse(localStorage.getItem("react-todos") || "[]"),
  filter: "all",
}

export const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    addTodo(state, action: PayloadAction<string>) {
      const text = action.payload.trim()
      if (!text) return
      // RTK 内部用 Immer，可以"直接修改"（实际生成新对象）
      state.todos.push({
        id: crypto.randomUUID(),
        text, done: false,
        createdAt: Date.now(),
      })
    },
    setFilter(state, action: PayloadAction<FilterType>) {
      state.filter = action.payload
    },
    // ... 其他 reducers
  },
})

// 自动生成 action creators
export const { addTodo, setFilter } = todoSlice.actions

// store/store.ts — 组装 Store
import { configureStore } from "@reduxjs/toolkit"
import todoReducer from "./todoSlice"

export const store = configureStore({
  reducer: { todo: todoReducer },
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch`,
            language: "typescript",
          },
        },
      },
      {
        title: "修改状态（可变 vs Immer）",
        explanation:
          "这是 Vue 和 React 最核心的差异！Vue 用 Proxy 拦截修改，可以直接 push/splice。普通 React 必须不可变更新，但 Redux Toolkit 内置 Immer，在 reducer 里也可以「直接修改」（Immer 在底层生成新对象）。注意：只有在 createSlice 的 reducers 内部才能这样写！",
        thinkingGuide: `场景：用户点添加按钮，新 todo 加到列表；点删除，从列表移除。

两种更新哲学：
  Vue / Pinia：  直接改，Proxy 自动追踪
    todos.value.push(newTodo)
    todo.done = !todo.done

  React / RTK：  在 reducer 里"假装直接改"，Immer 生成新对象
    state.todos.push(newTodo)   // 看起来一样，底层不同！
    todo.done = !todo.done

  ⚠️ 在 React 组件里不能直接改 state
  必须 dispatch(action) → reducer 处理`,
        snippets: {
          vue: {
            code: `// Pinia Store 中的 Actions — 直接修改
function addTodo(text: string) {
  if (!text.trim()) return
  todos.value.push({
    id: crypto.randomUUID(), text: text.trim(),
    done: false, createdAt: Date.now(),
  })
  // 直接 push！Vue 的 Proxy 自动拦截 → 触发 UI 更新
}

function removeTodo(id: string) {
  const idx = todos.value.findIndex(t => t.id === id)
  if (idx !== -1) todos.value.splice(idx, 1)
  // splice 直接修改数组，Vue 能检测到
}

function toggleTodo(id: string) {
  const todo = todos.value.find(t => t.id === id)
  if (todo) todo.done = !todo.done
  // 直接改属性，Proxy 自动拦截
}

function editTodo(id: string, newText: string) {
  const todo = todos.value.find(t => t.id === id)
  if (todo) todo.text = newText.trim()
}`,
            language: "typescript",
          },
          react: {
            code: `// Redux Toolkit Slice 的 Reducers — Immer "假装直接改"
reducers: {
  addTodo(state, action: PayloadAction<string>) {
    const text = action.payload.trim()
    if (!text) return
    state.todos.push({
      id: crypto.randomUUID(), text,
      done: false, createdAt: Date.now(),
    })
    // 看起来和 Vue 一样是 push，但底层完全不同：
    // Immer 会拦截这个操作，生成一个新的 state 对象
    // 只有在 createSlice 的 reducers 内部才能这样写！
  },

  removeTodo(state, action: PayloadAction<string>) {
    state.todos = state.todos.filter(t => t.id !== action.payload)
  },

  toggleTodo(state, action: PayloadAction<string>) {
    const todo = state.todos.find(t => t.id === action.payload)
    if (todo) todo.done = !todo.done
    // 在 reducer 里可以直接改（Immer 处理）
    // 在组件里不行！必须 dispatch(toggleTodo(id))
  },

  editTodo(state, action: PayloadAction<{ id: string; text: string }>) {
    const todo = state.todos.find(t => t.id === action.payload.id)
    if (todo) todo.text = action.payload.text.trim()
  },
}`,
            language: "typescript",
          },
        },
      },
      {
        title: "派生状态（computed vs createSelector）",
        explanation:
          "筛选后的列表、未完成数量——从原始数据「算出来」的派生数据。Vue 用 computed（自动缓存）。React 用 Redux Toolkit 的 createSelector（Reselect，手动声明依赖进行 memoize）。",
        snippets: {
          vue: {
            code: `// Pinia Store 中用 computed
const filteredTodos = computed(() => {
  switch (filter.value) {
    case "active":    return todos.value.filter(t => !t.done)
    case "completed": return todos.value.filter(t => t.done)
    default:          return todos.value
  }
})
// computed 自动缓存：依赖（todos / filter）不变就不重算

const activeCount = computed(() =>
  todos.value.filter(t => !t.done).length
)`,
            language: "typescript",
          },
          react: {
            code: `// store/selectors.ts — createSelector 缓存派生状态
import { createSelector } from "@reduxjs/toolkit"
import type { RootState } from "./store"

const selectTodos = (state: RootState) => state.todo.todos
const selectFilter = (state: RootState) => state.todo.filter

// createSelector：只有 selectTodos / selectFilter 的返回值变了
// 才重新执行 filter 计算，否则返回上次的缓存结果
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

// 对比 Vue：
// Vue 的 computed 自动追踪依赖
// RTK 的 createSelector 手动声明输入 selectors`,
            language: "typescript",
          },
        },
      },
      {
        title: "组件中使用 Store",
        explanation:
          "Vue 用 useTodoStore() 获取实例，解构 state 用 storeToRefs 保持响应式，actions 直接解构。React 用 useAppSelector(selector) 读状态、useAppDispatch() 发 action。RTK 推荐用 typed hooks 包装。",
        snippets: {
          vue: {
            code: `// Vue 组件中使用 Pinia Store
<script setup lang="ts">
import { storeToRefs } from "pinia"
import { useTodoStore } from "../stores/useTodoStore"

const store = useTodoStore()

// ❌ 错误：直接解构会丢失响应式
// const { filteredTodos } = useTodoStore()

// ✅ 正确：用 storeToRefs 解构 state/getter
const { filter, filteredTodos, activeCount } = storeToRefs(store)

// actions 可以直接解构（函数不需要响应式）
const { setFilter, addTodo } = store
</script>`,
            language: "html",
          },
          react: {
            code: `// store/hooks.ts — typed hooks（推荐）
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "./store"

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()

// 组件中使用 Redux Store
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { setFilter, addTodo } from "../store/todoSlice"
import { selectFilter, selectActiveCount } from "../store/selectors"

function MyComponent() {
  const dispatch = useAppDispatch()
  const filter = useAppSelector(selectFilter)
  const count = useAppSelector(selectActiveCount)

  // 读状态：useAppSelector(selector)
  // 发 action：dispatch(actionCreator(payload))
  dispatch(setFilter("active"))
  dispatch(addTodo("买菜"))
}

// 对比 Vue：
// Vue: storeToRefs(store) 解构状态，直接调用方法
// React: useAppSelector 读状态，dispatch(action) 改状态`,
            language: "tsx",
          },
        },
      },
    ],
  },

  // ============================================================
  // 第 4 章：路由集成
  // ============================================================
  {
    id: "routing",
    title: "路由集成",
    description: "Vue Router vs React Router：URL 驱动筛选状态，实现 /all、/active、/completed 路由。",
    sections: [
      {
        title: "路由配置",
        explanation:
          "两者都支持动态路由参数。Vue Router 用 createRouter + routes 数组配置，React Router 用 <Routes> + <Route> JSX 声明式配置。两者都通过 URL 参数 :filter 驱动筛选。",
        snippets: {
          vue: {
            code: `// router/index.ts — Vue Router 配置
import { createRouter, createWebHistory } from "vue-router"
import type { RouteRecordRaw } from "vue-router"
import TodoPage from "../pages/TodoPage.vue"

const routes: RouteRecordRaw[] = [
  { path: "/", component: TodoPage },
  {
    path: "/:filter(all|active|completed)",
    component: TodoPage,
  },
  // 正则约束：只匹配 all / active / completed
  { path: "/:pathMatch(.*)*", redirect: "/" },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router`,
            language: "typescript",
          },
          react: {
            code: `// App.tsx — React Router 配置
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
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
}

// 对比：
// Vue:  createRouter({ routes: [...] })  配置式
// React: <Routes><Route path="..." />    声明式 JSX
// Vue 用正则约束参数，React 通常在组件里校验`,
            language: "tsx",
          },
        },
      },
      {
        title: "URL 参数同步到 Store",
        explanation:
          "关键：URL 变化时自动更新 Store 的 filter 值。Vue 用 watch 监听 route.params，React 用 useEffect 监听 useParams。两者思路一样——监听路由参数变化，同步到全局状态。",
        snippets: {
          vue: {
            code: `<!-- pages/TodoPage.vue -->
<script setup lang="ts">
import { watch } from "vue"
import { useRoute } from "vue-router"
import { useTodoStore } from "../stores/useTodoStore"
import type { FilterType } from "../types/todo"

const store = useTodoStore()
const route = useRoute()

const VALID: FilterType[] = ["all", "active", "completed"]

// watch 路由参数 → 同步到 store
watch(
  () => route.params.filter as string | undefined,
  (filter) => {
    const f = (filter ?? "all") as FilterType
    if (VALID.includes(f)) store.setFilter(f)
  },
  { immediate: true }  // 首次加载也执行
)
</script>`,
            language: "html",
          },
          react: {
            code: `// pages/TodoPage.tsx
import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useAppDispatch } from "../store/hooks"
import { setFilter } from "../store/todoSlice"
import type { FilterType } from "../types/todo"

const VALID: FilterType[] = ["all", "active", "completed"]

export default function TodoPage() {
  const { filter } = useParams<{ filter: string }>()
  const dispatch = useAppDispatch()

  // useEffect 监听路由参数 → 同步到 store
  useEffect(() => {
    const f = (filter ?? "all") as FilterType
    if (VALID.includes(f)) dispatch(setFilter(f))
  }, [filter, dispatch])

  return (/* ... */)
}

// 对比：
// Vue:  watch(() => route.params.filter, cb, { immediate })
// React: useEffect(() => { ... }, [filter])
// 思路完全一样，只是 API 不同`,
            language: "tsx",
          },
        },
      },
    ],
  },

  // ============================================================
  // 第 5 章：数据持久化
  // ============================================================
  {
    id: "persistence",
    title: "数据持久化",
    description: "localStorage 持久化策略：Vue 用 watch 深度监听，React 用 store.subscribe 或 middleware。",
    sections: [
      {
        title: "Vue：useLocalStorage composable",
        explanation:
          "Vue 版封装一个 useLocalStorage composable：初始化时从 localStorage 读取，watch 监听 ref 变化后自动写入。deep: true 确保数组内部元素变化也能捕获。这个 composable 替代普通 ref，自动具备持久化能力。",
        snippets: {
          vue: {
            code: `// composables/useLocalStorage.ts
import { ref, watch, type Ref } from "vue"

export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): Ref<T> {
  // 1. 初始化：从 localStorage 读取
  let initial: T = defaultValue
  try {
    const raw = localStorage.getItem(key)
    if (raw) initial = JSON.parse(raw) as T
  } catch { /* 用默认值 */ }

  const data = ref<T>(initial) as Ref<T>

  // 2. 自动同步：数据变化 → 写入 localStorage
  watch(data, (val) => {
    localStorage.setItem(key, JSON.stringify(val))
  }, { deep: true })
  // deep: true → 数组 push/splice、对象属性修改都能捕获

  return data
}

// 使用：直接替代 ref
// const todos = ref<Todo[]>([])
// ↓ 换成 ↓
// const todos = useLocalStorage<Todo[]>("vue-todos", [])
// 其他代码完全不变！`,
            language: "typescript",
          },
          react: {
            code: `// React 持久化方案 1：在 Slice 里手动读写
const initialState: TodoState = {
  // 初始化时从 localStorage 读取
  todos: JSON.parse(
    localStorage.getItem("react-todos") || "[]"
  ),
  filter: "all",
}

// 每个修改 todos 的 reducer 末尾写入
addTodo(state, action: PayloadAction<string>) {
  state.todos.push({ /* ... */ })
  // ⚠️ Immer 的 draft 不能直接 JSON.stringify
  // 需要用 current() 获取普通对象
  localStorage.setItem(
    "react-todos",
    JSON.stringify(current(state.todos))
  )
},

// React 持久化方案 2：store.subscribe（更优雅）
// store/store.ts
export const store = configureStore({
  reducer: { todo: todoReducer },
})

// 订阅 store 变化，自动写入 localStorage
store.subscribe(() => {
  const { todos } = store.getState().todo
  localStorage.setItem("react-todos", JSON.stringify(todos))
})`,
            language: "typescript",
          },
        },
      },
      {
        title: "持久化策略对比",
        explanation:
          "Vue 版持久化几乎「无痛」——换个 ref 就搞定，业务代码零改动。React 版需要额外一步 subscribe 或在每个 reducer 里手动写入。这体现了 Vue 响应式系统的优势：watch 可以深度监听任何数据变化。",
        snippets: {
          vue: {
            code: `// ✅ Vue 持久化 — 一行搞定

// stores/useTodoStore.ts
export const useTodoStore = defineStore("todo", () => {
  // 把 ref 换成 useLocalStorage，其他代码不动
  const todos = useLocalStorage<Todo[]>("vue-todos", [])

  // 以下所有 push / splice / 赋值操作
  // 自动被 watch + deep 监听
  // 自动同步到 localStorage
  function addTodo(text: string) {
    todos.value.push({ /* ... */ })
    // 不需要任何额外操作！
  }

  function removeTodo(id: string) {
    const idx = todos.value.findIndex(t => t.id === id)
    if (idx !== -1) todos.value.splice(idx, 1)
    // 不需要任何额外操作！
  }

  return { todos, addTodo, removeTodo, /* ... */ }
})`,
            language: "typescript",
          },
          react: {
            code: `// ✅ React 持久化 — store.subscribe 方案

// store/store.ts
import { configureStore } from "@reduxjs/toolkit"
import todoReducer from "./todoSlice"

export const store = configureStore({
  reducer: { todo: todoReducer },
})

// 统一在一个地方订阅变化
store.subscribe(() => {
  const { todos } = store.getState().todo
  localStorage.setItem(
    "react-todos",
    JSON.stringify(todos)
  )
})
// 所有 reducer 都不需要单独写 localStorage 逻辑

// 对比总结：
// Vue:  useLocalStorage 替换 ref → 自动完成
// React: store.subscribe → 统一监听
//
// Vue 的优势：watch({ deep: true }) 可以追踪任意深层变化
// React 的优势：subscribe 集中管理，不污染 reducer 逻辑
// 两者都是「在一个地方配置，全局生效」`,
            language: "typescript",
          },
        },
      },
    ],
  },
]
