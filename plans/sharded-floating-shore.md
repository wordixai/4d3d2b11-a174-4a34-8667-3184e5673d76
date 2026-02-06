# AI 换衣应用 - 实现计划

## 产品概述

AI 虚拟换衣应用，用户上传人物照片和服装图片，AI 生成穿搭效果图。采用深色主题 + 青色/蓝绿色调，现代 AI 工具美学。

**核心流程：** 上传照片 → AI 处理 → 查看结果

---

## 功能模块

### 1. 主页 - 三步换衣工具
- 步骤指示器（上传 → 处理 → 结果）
- 人物照片上传（拖拽 + 点击）
- 服装图片上传（拖拽上传 + 预设服装库）
- "开始换衣" 按钮
- 处理中动画（进度条 + 状态文字）
- 结果展示（前后对比滑块 + 下载）

### 2. AI 后端
- Supabase Edge Function 调用 Replicate API（IDM-VTON 模型）
- 前端轮询获取结果

---

## 设计系统

**主题：** 深色背景 + 青蓝色主色调（teal/cyan）+ 金色强调色

### 颜色变量（HSL，定义在 index.css）
```
--background: 220 20% 6%        /* 深炭色 */
--foreground: 210 20% 92%       /* 柔白色 */
--card: 220 18% 10%
--primary: 174 72% 46%          /* 青蓝色 */
--primary-foreground: 220 20% 6%
--secondary: 220 16% 16%
--muted: 220 16% 14%
--muted-foreground: 215 15% 55%
--accent: 36 90% 55%            /* 金色 */
--border: 220 16% 18%
--ring: 174 72% 46%
--radius: 0.75rem
```

### 自定义动画（tailwind.config.ts）
- `shimmer` - 加载光泽效果
- `pulse-glow` - 脉冲发光
- `float` - 悬浮动画

### CSS 工具类（index.css）
- `.gradient-primary` - 青蓝渐变
- `.glass` - 毛玻璃效果
- `.glow-teal` - 青色发光
- `.text-gradient-primary` - 文字渐变

---

## 文件结构

### 需修改的文件
| 文件 | 变更 |
|------|------|
| `index.html` | 更新 title 和 meta |
| `src/index.css` | 添加 CSS 变量、工具类、基础重置 |
| `src/App.css` | 清空内容 |
| `src/App.tsx` | 添加 Sonner Toaster |
| `src/pages/Index.tsx` | 重写为主页面 |
| `tailwind.config.ts` | 添加自定义颜色、动画 |

### 需创建的文件

**状态管理**
- `src/stores/useTryOnStore.ts` - Zustand 状态（步骤、图片、处理状态、结果）

**工具库**
- `src/lib/constants.ts` - 常量配置（预设服装、处理消息等）
- `src/lib/image-utils.ts` - 图片处理工具（base64 转换、验证、下载）
- `src/lib/api.ts` - Supabase Edge Function API 调用

**Hooks**
- `src/hooks/useTryOnGeneration.ts` - React Query 生成 & 轮询 hooks

**布局组件**
- `src/components/layout/Header.tsx` - 顶部导航栏（毛玻璃背景）
- `src/components/layout/PageContainer.tsx` - 页面容器 + 背景动画

**上传组件**
- `src/components/upload/ImageDropZone.tsx` - 通用拖拽上传区域
- `src/components/upload/PersonUpload.tsx` - 人物照片上传
- `src/components/upload/ClothingUpload.tsx` - 服装上传（含 tabs：上传/服装库）
- `src/components/upload/ClothingGallery.tsx` - 预设服装网格
- `src/components/upload/UploadPanel.tsx` - 上传面板（组合人物 + 服装）

**处理组件**
- `src/components/processing/ProcessingView.tsx` - 处理中视图（进度 + 动画 + 状态文字）

**结果组件**
- `src/components/result/ResultView.tsx` - 结果展示容器
- `src/components/result/BeforeAfterSlider.tsx` - 前后对比滑块

**通用组件**
- `src/components/common/StepIndicator.tsx` - 三步指示器

**Edge Function**
- `supabase/functions/virtual-try-on/index.ts` - Replicate API 代理

---

## 实现顺序

### 阶段 1：基础设施
1. 设计系统（index.css + tailwind.config.ts + index.html）
2. 清空 App.css，更新 App.tsx（添加 Toaster）
3. 状态管理 store + 常量 + 工具函数

### 阶段 2：UI 组件
4. 布局组件（Header, PageContainer）
5. StepIndicator
6. ImageDropZone（核心上传组件）
7. PersonUpload + ClothingUpload + ClothingGallery
8. UploadPanel（组合上传区）

### 阶段 3：处理 & 结果
9. ProcessingView（处理动画）
10. BeforeAfterSlider + ResultView
11. 主页面 Index.tsx 组装所有步骤

### 阶段 4：AI 后端
12. Supabase 集成（使用 supabase-integration skill）
13. Edge Function 创建 & 部署
14. API 层 + React Query hooks
15. 端到端连通

---

## AI 集成方案

- **模型：** Replicate IDM-VTON（虚拟试穿专用模型）
- **架构：** 前端 → Supabase Edge Function → Replicate API
- **图片传输：** Base64 编码直传
- **状态轮询：** 每 3 秒轮询一次，直到完成或失败
- **环境变量：** `REPLICATE_API_TOKEN` 存储为 Supabase secret

---

## 验证方案

1. 启动 dev server（`pnpm run dev`）
2. 验证深色主题正确渲染
3. 测试拖拽上传和点击上传
4. 测试预设服装库选择
5. 验证步骤切换动画
6. 端到端测试：上传 → AI 处理 → 结果展示
7. 测试结果下载功能
8. 测试移动端响应式布局
9. 运行 `pnpm run build` 确保无构建错误
