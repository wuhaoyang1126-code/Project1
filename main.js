const { app, BrowserWindow, Menu, globalShortcut } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: '#08051b',
    autoHideMenuBar: true,
    title: '霓虹跑酷',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      spellcheck: false,
    },
  });

  // 移除默认菜单，避免 Alt 弹出菜单干扰游戏
  Menu.setApplicationMenu(null);
  win.removeMenu();

  // 游戏会拦截空格/上下方向键，屏蔽刷新等系统快捷键，避免误触
  globalShortcut.register('F5', () => {});
  globalShortcut.register('CommandOrControl+R', () => {});
  globalShortcut.register('CommandOrControl+Shift+I', () => {});

  win.loadFile(path.join(__dirname, 'app', 'index.html'));
  win.webContents.on('before-input-event', (event, input) => {
    if (input.type === 'keyDown' && ['F5', 'F11'].includes(input.key)) {
      event.preventDefault();
    }
    // 允许方向键/空格正常传给页面；仅拦截刷新类
  });

  return win;
}

app.whenReady().then(() => {
  const win = createWindow();
  win.webContents.on('context-menu', () => {});
  win.webContents.on('will-navigate', (e) => e.preventDefault());

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  app.quit();   // 游戏应用：关闭窗口即退出（macOS 同样）
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
