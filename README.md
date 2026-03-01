# TodoMVC — 三框架对比教程

> 通过同一个 Todo List 项目，并排对比 **JavaScript 原生**、**Vue** 和 **React** 三种实现方式，帮助开发者快速理解框架之间的异同。

![难度](https://img.shields.io/badge/难度-零基础友好-green) ![技术栈](https://img.shields.io/badge/对比-JS%20%7C%20Vue%20%7C%20React-blue) ![部署](https://img.shields.io/badge/部署-Vercel-black)

## 在线访问

地址：[todo.jiangxu.net](https://todo.jiangxu.net)

## 这是什么项目？

这是一个**教学型项目**，专为前端学习者设计。

每一章都将同一个功能点用三种方式实现，代码并排展示，让你一眼看出差异：

- **JavaScript 原生** — 直接操作 DOM，理解底层原理
- **Vue** — 模板语法 + 响应式系统，声明式开发
- **React** — JSX + 函数组件，一切都是 JS

## 章节内容

| 章节 | 内容 | 核心对比点 |
|------|------|-----------|
| 1. 项目初始化 | 创建项目、入口文件 | HTML vs createApp vs createRoot |
| 2. 组件与模板 | 基础组件、条件渲染、列表渲染 | v-if vs 三元表达式、v-for vs map |
| 3. 状态管理 | 声明状态、修改状态 | 手动更新 vs ref() vs useState() |
| 4. 列表与事件 | 添加列表项、删除列表项 | push vs splice vs filter（不可变更新） |
| 5. 组件通信 | 父传子、子传父、跨组件共享 | 回调 vs emit vs props、provide vs Context |
| 6. 完整 Todo List | 综合实现对比 | 三种完整实现的代码量和思维模式差异 |

## 快速开始

```bash
git clone https://github.com/Jaxon1216/todomvc.git
cd todomvc
npm install
npm run dev
```

浏览器打开 `http://localhost:5173` 即可。

## 构建部署

```bash
npm run build
```

构建产物在 `dist/` 目录，可直接部署到 Vercel、GitHub Pages 等静态托管平台。

## 技术栈

- React 19 + TypeScript
- Vite
- React Router
- Tailwind CSS
- Prism React Renderer（代码高亮）

## 项目结构

```
src/
├── components/
│   ├── CodeBlock.tsx       # 代码高亮 + 复制按钮
│   ├── CodeCompare.tsx     # JS/Vue/React 三栏对比
│   ├── Sidebar.tsx         # 左侧章节导航
│   └── Layout.tsx          # 整体布局
├── pages/
│   ├── Home.tsx            # 首页
│   ├── ChapterPage.tsx     # 章节详情页
│   └── Guide.tsx           # 使用教程
├── data/
│   └── codeSnippets.ts     # 所有章节数据和代码片段
├── App.tsx                 # 路由配置
└── main.tsx                # 入口
```

## 学习建议

1. **先通读文字说明，再看代码** — 理解概念后对比三栏代码，效果最好
2. **不要只看，要动手** — 把代码复制到本地项目跑一遍，改参数看效果
3. **横向对比着看** — 关注同一功能在不同框架中的写法差异
4. **遇到不懂的，复制代码块问 AI** — 比查文档快 10 倍
5. **按顺序学习** — 后面的章节依赖前面的知识
6. **多用 console.log 调试** — 在代码中加 `console.log(变量名)` 查看执行过程

## VS Code 常用快捷键

| 快捷键 | 功能 |
|--------|------|
| `Cmd + S` | 保存文件 |
| `Cmd + /` | 注释/取消注释 |
| `Alt + ↑/↓` | 上下移动当前行 |
| `Cmd + D` | 选中下一个相同的词 |
| `Cmd + Shift + K` | 删除当前行 |
| `F12` | 打开浏览器开发者工具 |

## 开源协议

MIT License
