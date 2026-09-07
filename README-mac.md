# 霓虹跑酷 · macOS 构建

在 **Mac** 上把本项目构建成可直接安装的 `.dmg`。

## 前置条件（一次性）
- Mac 上安装 [Node.js LTS](https://nodejs.org)（自带 npm）

## 步骤
1. 把整个 `NeonRunPC` 文件夹拷贝到 Mac（可用 U 盘 / 微信 / AirDrop，**无需 node_modules 和 dist**，到 Mac 后会自动装）
2. 打开「终端」，进入目录并运行：

```bash
cd 路径/NeonRunPC
chmod +x build-mac.sh
./build-mac.sh
```

国内网络如慢，先执行下面两行再跑脚本（脚本内已注释，去掉注释即可）：

```bash
export ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"
export ELECTRON_BUILDER_BINARIES_MIRROR="https://npmmirror.com/mirrors/electron-builder-binaries/"
```

3. 构建完成后，产物在 `dist/`：
   - `NeonRun-1.0.0-arm64.dmg` —— Apple 芯片 Mac（M1/M2/M3/M4）
   - `NeonRun-1.0.0-x64.dmg` —— Intel Mac
   - `.zip` 为免安装版（解压即用）

## 安装
- 双击 `.dmg`，把「霓虹跑酷」拖进「应用程序」
- 首次打开如提示「无法验证开发者」：**系统设置 → 隐私与安全性 → 仍要打开**

## 手动/单独构建某架构
```bash
npx electron-builder --mac dmg --arm64     # 只要 Apple 芯片版
npx electron-builder --mac dmg --x64       # 只要 Intel 版
```

## 目录说明
| 文件 | 作用 |
|---|---|
| `main.js` | Electron 主进程（窗口/快捷键） |
| `app/index.html` | 游戏本体（含疯狗追击机制） |
| `build-mac.sh` | 一键构建脚本 |
| `package.json` | 构建配置（mac target: dmg + zip, 双架构） |
