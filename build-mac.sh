#!/bin/bash
# ============================================================
#  霓虹跑酷 (NeonRun) macOS 构建脚本
#  在 Mac 上运行：  chmod +x build-mac.sh && ./build-mac.sh
#  产出: dist/NeonRun-1.0.0-arm64.dmg  (Apple 芯片)
#        dist/NeonRun-1.0.0-x64.dmg    (Intel)
#        dist/NeonRun-1.0.0-*.zip      (免安装绿色包)
# ============================================================
set -e
cd "$(dirname "$0")"

echo "==> 1/4 检查 Node.js ..."
if ! command -v node >/dev/null 2>&1; then
  echo "未找到 Node.js，请先安装: https://nodejs.org (LTS 即可)"
  exit 1
fi
node -v

echo "==> 2/4 安装依赖 (electron + electron-builder)..."
# 国内网络可取消注释下行使用镜像加速
# export ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"
# export ELECTRON_BUILDER_BINARIES_MIRROR="https://npmmirror.com/mirrors/electron-builder-binaries/"
npm install --include=dev --no-omit

echo "==> 3/4 构建 macOS 应用 (.app / .dmg / .zip，含 arm64+x64)"
npx electron-builder --mac

echo "==> 4/4 完成！产物在 dist/ 目录:"
ls -lh dist/*.dmg dist/*.zip 2>/dev/null || ls -lh dist/
echo ""
echo "安装: 双击 .dmg 把 霓虹跑酷.app 拖入 应用程序 即可。"
echo "若提示‘无法打开，因为无法验证开发者’，在 系统设置→隐私与安全性 中点击‘仍要打开’。"
