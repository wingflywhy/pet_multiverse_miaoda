# My Pet's Multiverse

## 介绍

**My Pet's Multiverse** 是一个创意AI图片生成应用，让你为宠物创造荒诞有趣的平行宇宙形象！

### ✨ 核心功能

- 🐕 **8种宠物选择**：柴犬、橘猫、哈士奇、金毛、柯基、英国短毛猫、布偶猫、暹罗猫
- 🎭 **10种新身份**：国际特工、宇航员、摇滚明星、厨师、超级英雄、海盗船长、武士、魔法师、赛车手、探险家
- 🌍 **10种场景**：雪山顶、太空站、演唱会舞台、米其林餐厅、城市上空、加勒比海、古代战场、魔法森林、赛道、热带雨林
- 🎨 **8种艺术风格**：写实、卡通、油画、赛博朋克、水彩、像素艺术、素描、动漫
- 📚 **6个创意模板**：快速开始创作
- 🖼️ **图库展示**：浏览所有历史作品（无限滚动）
- 💾 **一键下载**：保存到本地
- 🔗 **分享功能**：分享给朋友

### 🚀 快速开始

1. 访问首页，点击"开始创造宠物宇宙"
2. 选择创意模板或自定义参数
3. 点击"开始生成"，等待30-60秒
4. 查看结果，下载或分享

详细使用指南请查看：[QUICK_START.md](./QUICK_START.md)

### 📚 项目文档

- [快速开始](./QUICK_START.md) - 使用指南和热门组合推荐
- [用户指南](./USER_GUIDE.md) - 详细的功能说明和常见问题
- [项目总结](./PROJECT_SUMMARY.md) - 技术架构和设计说明
- [部署清单](./DEPLOYMENT_CHECKLIST.md) - 部署前的检查清单
- [状态报告](./STATUS_REPORT.md) - 项目完成情况和统计数据
- [问题修复](./FIXES.md) - 已修复问题的详细记录

### 🛠️ 技术栈

- **前端**：React 18 + TypeScript + Vite
- **UI库**：shadcn/ui + Radix UI + Tailwind CSS
- **路由**：React Router v7
- **表单**：React Hook Form + Zod
- **后端**：Supabase (PostgreSQL + Storage)
- **AI服务**：百度文心AI作画-iRAG版

### 🎨 设计特色

- **配色方案**：温暖的橙色主题 + 深蓝色辅助色
- **视觉风格**：8px圆角、卡片式布局、柔和渐变阴影
- **响应式设计**：完美适配桌面和移动设备
- **用户体验**：流畅的动画、清晰的进度提示、友好的错误处理

### 📊 项目状态

- ✅ 所有功能100%完成
- ✅ 代码质量检查通过
- ✅ 数据库和存储配置完成
- ✅ 错误处理和降级方案完善
- ✅ 文档完整齐全
- ✅ 生产就绪，可立即部署

## 目录结构

```
├── README.md # 说明文档
├── components.json # 组件库配置
├── eslint.config.js # eslint 配置
├── index.html # 入口文件
├── package.json # 包管理
├── postcss.config.js # postcss 配置
├── public # 静态资源目录
│   ├── favicon.png # 图标
│   └── images # 图片资源
├── src # 源码目录
│   ├── App.tsx # 入口文件
│   ├── components # 组件目录
│   ├── context # 上下文目录
│   ├── db # 数据库配置目录
│   ├── hooks # 通用钩子函数目录
│   ├── index.css # 全局样式
│   ├── layout # 布局目录
│   ├── lib # 工具库目录
│   ├── main.tsx # 入口文件
│   ├── routes.tsx # 路由配置
│   ├── pages # 页面目录
│   ├── services  # 数据库交互目录
│   ├── types   # 类型定义目录
├── tsconfig.app.json  # ts 前端配置文件
├── tsconfig.json # ts 配置文件
├── tsconfig.node.json # ts node端配置文件
└── vite.config.ts # vite 配置文件
```

## 技术栈

Vite、TypeScript、React、Supabase

## 本地开发

### 如何在本地编辑代码？

您可以选择 [VSCode](https://code.visualstudio.com/Download) 或者您常用的任何 IDE 编辑器，唯一的要求是安装 Node.js 和 npm.

### 环境要求

```
# Node.js ≥ 20
# npm ≥ 10
例如：
# node -v   # v20.18.3
# npm -v    # 10.8.2
```

具体安装步骤如下：

### 在 Windows 上安装 Node.js

```
# Step 1: 访问Node.js官网：https://nodejs.org/，点击下载后，会根据你的系统自动选择合适的版本（32位或64位）。
# Step 2: 运行安装程序：下载完成后，双击运行安装程序。
# Step 3: 完成安装：按照安装向导完成安装过程。
# Step 4: 验证安装：在命令提示符（cmd）或IDE终端（terminal）中输入 node -v 和 npm -v 来检查 Node.js 和 npm 是否正确安装。
```

### 在 macOS 上安装 Node.js

```
# Step 1: 使用Homebrew安装（推荐方法）：打开终端。输入命令brew install node并回车。如果尚未安装Homebrew，需要先安装Homebrew，
可以通过在终端中运行如下命令来安装：
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
或者使用官网安装程序：访问Node.js官网。下载macOS的.pkg安装包。打开下载的.pkg文件，按照提示完成安装。
# Step 2: 验证安装：在命令提示符（cmd）或IDE终端（terminal）中输入 node -v 和 npm -v 来检查 Node.js 和 npm 是否正确安装。
```

### 安装完后按照如下步骤操作：

```
# Step 1: 下载代码包
# Step 2: 解压代码包
# Step 3: 用IDE打开代码包，进入代码目录
# Step 4: IDE终端输入命令行，安装依赖：npm i
# Step 5: IDE终端输入命令行，启动开发服务器：npm run dev -- --host 127.0.0.1
```

### 如何开发后端服务？

配置环境变量，安装相关依赖
如需使用数据库，请使用 supabase 官方版本或自行部署开源版本的 Supabase

### 如何配置应用中的三方 API？

具体三方 API 调用方法，请参考帮助文档：[源码导出](https://cloud.baidu.com/doc/MIAODA/s/Xmewgmsq7)，了解更多详细内容。

## 了解更多

您也可以查看帮助文档：[源码导出](https://cloud.baidu.com/doc/MIAODA/s/Xmewgmsq7)，了解更多详细内容。
