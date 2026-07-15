# 构建与发布指南

## 当前状态

本地机器缺少完整构建环境：
- Android：缺少 Java Runtime / JDK、Android SDK
- iOS：缺少完整 Xcode（仅 Command Line Tools）

因此无法在本地直接生成 APK / IPA。已配置 GitHub Actions 自动构建流水线。

## 方式一：GitHub Actions 自动构建（推荐）

### 1. 在 GitHub 创建仓库

访问 https://github.com/new ，创建空仓库（例如 `yourname/nishiyoufang-app`）。

### 2. 推送本地代码

```bash
cd /Users/Projects/nishiyoufang-app
git remote add origin https://github.com/yourname/nishiyoufang-app.git
git branch -M main
git push -u origin main
```

### 3. 触发构建

推送后自动触发 `.github/workflows/build.yml`：
- Android Debug APK（ubuntu-latest）
- iOS Simulator Build（macos-latest）

构建产物会作为 Artifact 上传，可在 GitHub Actions 页面下载。

### 4. 导出 iOS IPA（可选）

需要 Apple Developer 证书。将以下 secrets 添加到 GitHub 仓库：
- `BUILD_CERTIFICATE_BASE64`：p12 证书 base64
- `P12_PASSWORD`：p12 密码
- `BUILD_PROVISION_PROFILE_BASE64`：mobileprovision base64
- `KEYCHAIN_PASSWORD`：临时钥匙串密码

然后取消 `.github/workflows/build.yml` 中 iOS 签名部分的注释。

## 方式二：本地构建

### Android APK

1. 安装 Android Studio
2. 配置 `ANDROID_HOME` 环境变量
3. 安装 JDK 17
4. 运行：

```bash
cd /Users/Projects/nishiyoufang-app
npm install
npm run build:data
npm run build:assets
npm run sync:android
npm run open:android
```

5. 在 Android Studio 中：Build → Generate Signed Bundle / APK → APK

### iOS IPA

1. 安装完整版 Xcode
2. 配置 Apple Developer 签名
3. 运行：

```bash
cd /Users/Projects/nishiyoufang-app
npm install
npm run build:data
npm run build:assets
npm run sync:ios
npm run open:ios
```

4. 在 Xcode 中：Product → Archive → Distribute App

## 产物路径

- Android Debug APK：`android/app/build/outputs/apk/debug/app-debug.apk`
- iOS Simulator Build：`ios/App/build/Build/Products/Debug-iphonesimulator/App.app`
