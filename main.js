const { app, BrowserWindow, Menu, globalShortcut, ipcMain, screen } = require('electron');
const path = require('path');

let win = null;

function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: '#08051b',
    autoHideMenuBar: true,
    title: '霓虹跑酷',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
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

  // 窗口状态变化（全屏/最大化）推送给渲染进程，设置面板同步显示
  const pushState = () => {
    if (win && !win.isDestroyed()) {
      win.webContents.send('neon:window-state', {
        fullscreen: win.isFullScreen(),
        maximized: win.isMaximized(),
      });
    }
  };
  win.on('enter-full-screen', pushState);
  win.on('leave-full-screen', pushState);
  win.on('maximize', pushState);
  win.on('unmaximize', pushState);

  return win;
}

// 窗口控制 IPC：渲染进程设置面板调用
ipcMain.on('neon:set-window', (event, opts) => {
  if (!win || win.isDestroyed()) return;
  if (opts && typeof opts === 'object') {
    if (opts.fullscreen === true) {
      win.setFullScreen(true);
    } else if (opts.fullscreen === false) {
      win.setFullScreen(false);
    }
    if (Number.isFinite(opts.width) && Number.isFinite(opts.height)) {
      win.setSize(Math.round(opts.width), Math.round(opts.height));
      // 缩放后确保窗口居中
      const wa = screen.getPrimaryDisplay().workArea;
      win.setPosition(
        wa.x + Math.round((wa.width - opts.width) / 2),
        wa.y + Math.round((wa.height - opts.height) / 2)
      );
    }
  }
});

ipcMain.handle('neon:get-window-state', () => {
  if (!win || win.isDestroyed()) return { fullscreen: false, maximized: false };
  return {
    fullscreen: win.isFullScreen(),
    maximized: win.isMaximized(),
  };
});

app.whenReady().then(() => {
  const w = createWindow();
  w.webContents.on('context-menu', () => {});
  w.webContents.on('will-navigate', (e) => e.preventDefault());

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
