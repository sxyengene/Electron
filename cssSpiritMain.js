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

global.sumFlag = true;


let win;
function createWindow() {
	// console.log('app ready.create window.');
	// 创建窗口并加载页面
	win = new BrowserWindow({
		// width: 1000, 
		// height: 1000,
		x:1000,
		y:200,
		// maxWidth:1000,
		// resizable:false,
		// movable:false,
		// fullscreen:true,
		title:"123",
		webPreferences:
        {
            // nodeIntegration: false,
            // offscreen: true,
            // preload: path.resolve(__dirname,'ipcRenderer.js')
        }
	});
	win.loadURL(`file://${__dirname}/index.html`);
	registerGlobalShortCut();
	// 打开窗口的调试工具
	win.webContents.openDevTools();
	var webContents = win.webContents;
	ipcMainHandle();
	menuInit();
	thumbarButtonsInit();
	progressInit();
	powerSaveBlockerInit();
	protocolRegister();
	webContentsInit(win);
	TrayInit();
	// console.log(123)
	// return;
	// win.maximize();
	// console.log(process.version);
	// console.log(process.type);
	var image = nativeImage.createFromPath('./button1.png');
	win.setOverlayIcon(image, 'description')
	var winArr = BrowserWindow.getAllWindows();
	console.log(win.id);
	// win.setAutoHideMenuBar(true);
	win.setMenuBarVisibility(true);
	// console.log(winArr)
	// win.webContents.on('paint', (event, dirty, image) => {
 //    	// updateBitmap(dirty, image.getBitmap())
 //  	})
  	// win.webContents.setFrameRate(30);
	
	// 窗口关闭的监听
	win.on('closed', () => {
		clearInterval(pstimer);
		win = null;
	});
}

var _setImmediate = setImmediate;
var _clearImmediate = clearImmediate;
process.once('loaded', function() {
	// console.log('process loaded')
	global.setImmediate = _setImmediate;
	global.clearImmediate = _clearImmediate;
});

app.on('ready', createWindow);
app.on('will-quit', function() {
  // Unregister a shortcut.
  globalShortcut.unregister('ctrl+x');

  // Unregister all shortcuts.
  globalShortcut.unregisterAll();
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
