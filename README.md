# 🎯 随机分组工具

一个有趣的 PWA（Progressive Web App）应用，可以将团队成员随机分成指定组数，并通过可视化连线展示分组结果。

## ✨ 功能特点

- 🎨 **可视化分组**：通过不同颜色和连线展示分组结果
- 👆 **触摸检测**：支持多点触摸，实时显示触摸位置
- 🌈 **多色显示**：使用 2-4 种不同颜色区分各组成员
- 🔗 **智能连线**：相同颜色的成员自动连线，直观展示分组
- 📱 **PWA 支持**：可添加到主屏幕，支持离线使用
- 🎯 **简单易用**：选择分组数量，触摸屏幕即可开始
- ⚛️ **React 构建**：使用现代 React 架构

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 运行开发服务器

```bash
npm start
```

应用将在 `http://localhost:3000` 启动

### 构建生产版本

```bash
npm run build
```

生产版本将生成在 `build/` 目录中

### 部署到 Vercel

#### 方法一：使用 Vercel CLI

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录 Vercel
vercel login

# 部署
vercel

# 生产部署
vercel --prod
```

#### 方法二：通过 Vercel 网站

1. 访问 [vercel.com](https://vercel.com)
2. 使用 GitHub 账号登录
3. 点击 "New Project"
4. 导入你的 GitHub 仓库
5. Vercel 会自动检测项目配置
6. 点击 "Deploy" 开始部署

首次部署完成后，每次推送到 GitHub 都会自动重新部署。

## 📱 使用步骤

1. **选择分组数量**：点击 "2组"、"3组" 或 "4组" 按钮
2. **开始触摸**：点击"开始触摸"按钮
3. **触摸屏幕**：让所有人在屏幕四周放置手指（或鼠标点击）
4. **自动分组**：当触摸点数达到分组数时，自动进行随机分组
5. **查看结果**：查看分组结果面板和屏幕上的连线效果

### 桌面使用

在桌面浏览器中，可以使用鼠标点击来模拟触摸点。这对于测试和演示非常有用。

## 📁 项目结构

```
team-grouping/
├── public/
│   ├── index.html           # HTML 模板
│   ├── manifest.json        # PWA 配置文件
│   └── service-worker.js    # Service Worker
├── src/
│   ├── components/
│   │   ├── ControlPanel.js  # 控制面板组件
│   │   ├── TouchCanvas.js   # 触摸画布组件
│   │   └── ResultPanel.js   # 结果面板组件
│   ├── App.js               # 主应用组件
│   ├── App.css              # 应用样式
│   ├── index.js             # 入口文件
│   └── index.css            # 全局样式
├── package.json             # 项目配置
└── README.md                # 说明文档
```

## 🎨 技术栈

- **React 18**：现代化的 React 架构
- **Canvas API**：HTML5 Canvas 进行可视化
- **触摸事件**：支持多点触摸和鼠标事件
- **响应式设计**：适配移动端和桌面端
- **PWA**：支持离线使用和安装

## 📱 PWA 功能

应用支持 PWA 特性：

- ✅ 可添加到主屏幕
- ✅ 支持离线使用
- ✅ Service Worker 缓存
- ✅ 移动端优化体验

### 添加到主屏幕

在支持的浏览器（如 Chrome、Safari）中：
1. 打开应用
2. 点击浏览器菜单
3. 选择"添加到主屏幕"

## 🎯 适用场景

- 团队活动分组
- 课堂分组
- 游戏分组
- 随机组队

## 🔧 浏览器支持

- Chrome/Edge（推荐）
- Safari
- Firefox
- 移动端浏览器

## 📝 开发说明

### 分组颜色

当前支持 4 种分组颜色，在 `src/App.js` 中定义：

```javascript
const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b'];
```

- 🔴 红色：`#ef4444`
- 🔵 蓝色：`#3b82f6`
- 🟢 绿色：`#10b981`
- 🟠 橙色：`#f59e0b`

### 核心组件

- **ControlPanel**：控制分组数量和启动
- **TouchCanvas**：处理触摸事件和可视化
- **ResultPanel**：显示分组结果

## 🛠️ 可用脚本

- `npm start`：启动开发服务器
- `npm run build`：构建生产版本
- `npm test`：运行测试

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

由 AI 助手使用 React 创建 🚀

