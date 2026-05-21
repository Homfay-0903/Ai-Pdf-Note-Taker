## 📚 AI PDF Note Taker - 项目总结

### 🎯 项目概述

这是一个基于 **Next.js 16** 的全栈 Web 应用，利用 AI 技术帮助用户从 PDF 文档中提取信息、生成笔记，并提供智能问答功能。项目支持中英文双语界面。

---

### 🏗️ 技术栈

| 类别             | 技术                                     |
| ---------------- | ---------------------------------------- |
| **前端框架**     | Next.js 16 (App Router)                  |
| **UI 库**        | React 18, Tailwind CSS 4, Shadcn UI      |
| **后端/数据库**  | Convex (实时数据库 + 向量存储)           |
| **身份认证**     | Clerk                                    |
| **富文本编辑器** | Tiptap                                   |
| **PDF 处理**     | pdfjs-dist, LangChain PDF Loader         |
| **AI 能力**      | 智谱 AI (GLM-4 模型), LangChain          |
| **向量嵌入**     | ZhipuAI Embeddings + Convex Vector Store |
| **国际化**       | next-intl                                |

---

### 📁 项目架构

```
src/
├── app/
│   ├── (auth)/              # 认证页面 (登录/注册)
│   ├── api/                 # API 路由
│   │   ├── ai-chat/         # AI 对话接口
│   │   └── pdf-loader/      # PDF 解析接口
│   ├── dashboard/           # 用户仪表盘
│   │   ├── components/      # Header, SideBar, UploadPdfDialog
│   │   └── upgrate/         # 升级套餐页面
│   └── workspace/[fileId]/  # PDF 工作区
│       └── components/      # PdfViewer, TextEditor, EditorExtensions
├── components/ui/           # Shadcn UI 组件
├── configs/                 # AI 配置和提示词
└── i18n/                    # 国际化配置

convex/                      # Convex 后端
├── schema.ts               # 数据库模式定义
├── fileStorage.ts          # 文件存储操作
├── notes.ts                # 笔记 CRUD
├── user.ts                 # 用户管理
└── myAction.ts             # 向量嵌入与搜索
```

---

### 🗄️ 数据库模型

```typescript
// 用户表
users: {
  (userName, email, upgrate, imageUrl);
}

// PDF 文件表
pdfFiles: {
  (fileId, storageId, fileName, fileUrl, createdBy);
}

// 文档向量表 (用于 AI 搜索)
documents: {
  (embedding[1024], text, metadata);
}

// 笔记表
notes: {
  (fileId, notes, createdBy);
}
```

---

### ✨ 核心功能

#### 1. **用户认证与管理**

- 使用 Clerk 进行用户注册、登录
- 自动同步用户信息到 Convex 数据库
- 支持用户升级套餐（免费版 5 个 PDF / 无限版）

#### 2. **PDF 上传与处理**

- [UploadPdfDialog.tsx] 处理文件上传
- PDF 存储到 Convex Storage
- 使用 LangChain 的 `WebPDFLoader` 解析 PDF 内容
- 使用 `RecursiveCharacterTextSplitter` 分块 (chunkSize: 1000, overlap: 200)
- 将分块内容通过 ZhipuAI Embeddings 向量化存储

#### 3. **智能工作区**

- 左侧：Tiptap 富文本编辑器
- 右侧：PDF 预览
- 实时保存笔记到数据库

#### 4. **AI 智能问答**

- 用户选中文本后点击 AI 助手按钮
- 系统通过向量相似度搜索相关 PDF 内容
- 将搜索结果发送给 GLM-4 模型生成回答
- 回答以 HTML 格式插入到编辑器中

#### 5. **笔记导出**

- 支持将编辑器内容导出为 PDF

#### 6. **国际化**

- 支持中文 和英文
- AI 提示词根据语言动态调整

---

### 🔄 核心工作流程

```
PDF 上传流程:
1. 用户选择 PDF 文件
2. 上传到 Convex Storage
3. 调用 /api/pdf-loader 解析 PDF
4. 文本分块 → ZhipuAI Embeddings 向量化
5. 存储到 Convex Vector Store

AI 问答流程:
1. 用户在编辑器中选中文本
2. 点击 AI 助手按钮
3. 向量搜索相关 PDF 片段
4. 构建提示词 → 调用 GLM-4
5. 返回 HTML 格式答案并插入编辑器
```

---

### 📦 关键依赖

| 依赖                   | 用途                 |
| ---------------------- | -------------------- |
| `@clerk/nextjs`        | 用户认证             |
| `convex`               | 实时数据库与向量存储 |
| `@tiptap/*`            | 富文本编辑器         |
| `@langchain/community` | PDF 加载、向量存储   |
| `zhipuai`              | 智谱 AI SDK          |
| `next-intl`            | 国际化               |
| `sonner`               | Toast 通知           |

---

### 🎨 UI 特点

- 响应式设计，支持移动端
- 现代化的卡片式布局
- Shadcn UI 组件库
- Tailwind CSS 样式
- 暗色模式支持

---

### 💡 项目亮点

1. **RAG (检索增强生成)** 架构：结合向量搜索与大语言模型
2. **实时同步**：Convex 提供实时数据同步
3. **富文本编辑**：支持加粗、斜体、高亮等格式
4. **双语支持**：完整的国际化实现
5. **向量数据库**：使用 Convex 内置的向量索引功能

---

## Question

//convex-ctx, //pdf-url, //api-route, //api, //pdfview，//metadata,prompt, //'client', //querey,mutation,
