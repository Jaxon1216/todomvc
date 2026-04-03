# TodoMVC — Vue vs React 对比教程

> 通过同一个 Todo List 项目，并排对比 **Vue + Pinia** 和 **React + Redux Toolkit** 两种实现方式，帮助开发者快速理解框架之间的异同。

## 在线访问

地址：[todo.jiangxu.net](https://todo.jiangxu.net)

## 项目亮点

| 层级 | 内容 | 核心对比点 |
|------|------|-----------|
| MVC 基础 | 增删改查（CRUD）| v-model vs 受控组件、v-if vs 三元、v-for vs map |
| 路由 + 状态管理 | URL 驱动筛选 | Vue Router vs React Router、Pinia vs Redux Toolkit |
| 数据持久化 | localStorage 自动同步 | useLocalStorage composable vs store.subscribe |

## 章节内容

| 章节 | 内容 | 核心对比点 |
|------|------|-----------|
| 1. 项目结构 & 入口 | 目录结构、入口文件、类型定义 | createApp vs createRoot、app.use vs Provider |
| 2. 组件拆分 & CRUD | 输入框、列表、TodoItem、筛选 | v-model vs value+onChange、:class vs className |
| 3. 状态管理 | 定义 Store、修改状态、派生计算 | defineStore vs createSlice、computed vs createSelector |
| 4. 路由集成 | 路由配置、URL 参数同步 | Vue Router vs React Router、watch vs useEffect |
| 5. 数据持久化 | localStorage 策略 | useLocalStorage composable vs store.subscribe |

## 快速开始

```bash
git clone https://github.com/Jaxon1216/todomvc.git
cd todomvc
npm install
npm run dev
```

浏览器打开 `http://localhost:5173` 即可。

## 技术栈

- React 19 + TypeScript（教程网站本身）
- Vite + Tailwind CSS
- Prism React Renderer（代码高亮）
- React Router（教程站内路由）

## 项目结构

```
src/
├── components/
│   ├── CodeBlock.tsx       # 代码高亮 + 复制按钮
│   ├── CodeCompare.tsx     # Vue / React 两栏对比
│   ├── Sidebar.tsx         # 左侧章节导航
│   └── Layout.tsx          # 整体布局
├── pages/
│   ├── Home.tsx            # 首页
│   ├── ChapterPage.tsx     # 章节详情页
│   ├── DemoPage.tsx        # 工程级完整 Demo
│   ├── Guide.tsx           # 使用教程
│   └── About.tsx           # 关于作者
├── data/
│   ├── codeSnippets.ts     # 章节数据：Vue vs React 代码片段
│   └── demoSnippets.ts     # 工程级 Demo 数据
├── App.tsx                 # 路由配置
└── main.tsx                # 入口
```

## 开源协议

MIT License
