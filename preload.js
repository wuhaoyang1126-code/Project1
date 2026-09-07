// 预加载脚本：向渲染进程安全暴露窗口控制能力（contextIsolation 开启）
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('neonAPI', {
  // opts: { width, height } 或 { fullscreen: boolean }
  setWindow: (opts) => ipcRenderer.send('neon:set-window', opts),
  getWindowState: () => ipcRenderer.invoke('neon:get-window-state'),
  onWindowState: (cb) => {
    const handler = (_e, state) => cb(state);
    ipcRenderer.on('neon:window-state', handler);
    return () => ipcRenderer.removeListener('neon:window-state', handler);
  }
});
