const path = require('path');
const http = require('http');
const electron = require('electron');
const { 
	app,
	BrowserWindow,
	ipcMain,
	nativeImage,
	dialog,
	globalShortcut,
	Menu,
	MenuItem,
	powerSaveBlocker,
	protocol,
	Tray,
} = electron;

let win;
function createWindow() {
	// console.log('app ready.create window.');
	// 创建窗口并加载页面
	win = new BrowserWindow({
		x:1000,
		y:200,
		title:"123",
		autoHideMenuBar:true
	});
	win.loadURL(`file://${__dirname}/index.html`);

	// 打开窗口的调试工具
	win.webContents.openDevTools();
	var webContents = win.webContents;

	// 窗口关闭的监听
	win.on('closed', () => {
		win = null;
	});
}

app.on('ready', createWindow);
app.on('will-quit', function() {

});
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
