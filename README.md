# 倪师有方 · 口袋经方中医 AI

> 把倪海厦 3.5M 字讲义、849 个医案装进手机。

## 项目说明

本项目基于 [jangviktor-web/nihaixia](https://github.com/jangviktor-web/nihaixia) 开源知识库，使用 **Capacitor** 重新包装为跨平台手机 APP，并赋予独立品牌「倪师有方」。

- **品牌名**：倪师有方
- **Slogan**：不舒服？倪师有方。
- **包名**：`com.nishiyoufang.app`
- **版本**：v1.0.0

## 已完成功能

- [x] 首页搜索入口 + 快捷导航
- [x] 六经辨证快速问诊
- [x] 经方 / 本草速查（内置 8 首常用经方 + 8 味常用本草）
- [x] 知识库浏览（伤寒论、金匮、黄帝内经、针灸本草等 9 大模块）
- [x] 医案分类浏览（癌症、心血管、代谢病等 6 类）
- [x] 离线数据包集成（Markdown 原文本地加载）
- [x] APP 图标、启动图生成
- [x] Android 平台配置完成

## 目录结构

```
nishiyoufang-app/
├── android/              # Capacitor Android 原生工程
├── assets/               # 图标、启动图
├── scripts/              # 数据/资源构建脚本
│   ├── build-data.js     # 从 nihaixia-src 提取知识库
│   ├── generate-assets.py       # 生成图标和启动图
│   └── setup-android-assets.py  # 替换 Android 图标和启动图
├── www/                  # Web 应用（APP 主体）
│   ├── index.html
│   ├── css/style.css
│   ├── js/app.js
│   └── data/             # 离线知识库
├── BRAND.md              # 品牌说明
└── README.md             # 本文件
```

## 本地预览

```bash
cd /Users/Projects/nishiyoufang-app
npm run dev
```

然后在浏览器打开 http://localhost:5173 （建议用手机模拟器或真实手机访问）。

## 构建 Android APK

### 前置条件

1. 安装 Android Studio
2. 配置 `ANDROID_HOME` 环境变量
3. 安装 Android SDK（推荐 API 34+）

### 构建步骤

```bash
cd /Users/Projects/nishiyoufang-app

# 1. 同步 web 资源到 Android 工程
npm run sync:android

# 2. 用 Android Studio 打开工程
npm run open:android

# 3. 在 Android Studio 中
#    Build → Generate Signed Bundle / APK → APK
#    选择 release 签名后即可生成 APK
```

## 重新生成资源

如果修改了 `nihaixia-src` 中的知识库：

```bash
npm run build:data        # 重新生成知识库索引
npm run build:assets      # 重新生成图标和启动图
npm run sync:android      # 同步到 Android 工程
```

## 数据来源

- 倪海厦人纪系列（伤寒论、金匮要略、黄帝内经、神农本草经、针灸）
- 倪海厦天纪系列
- 849 个临床医案
- 梁冬对话录音稿

仅供中医学习与研究参考，不能替代专业医师诊疗。

## 免责声明

本 APP 为学习参考工具，所提供信息不构成医疗建议。身体不适请及时就医。
