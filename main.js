const path = require('path');
const electron = require('electron');
const { app,BrowserWindow,ipcMain,nativeImage,dialog,globalShortcut } = electron;


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
            nodeIntegration: false,
            // offscreen: true,
            preload: path.resolve(__dirname,'ipcRenderer.js')
        }
	});
	win.loadURL(`file://${__dirname}/index.html`);
	// win.maximize();
	// console.log(process.version);
	// console.log(process.type);
	/*上下线*/
	ipcMain.on('onlineOrOffline', function(event, arg) {
		// console.log(arg);
		event.returnValue = '';
	});

	/*打开文件*/
	ipcMain.on('showOpenDialog', function(event, arg) {
		console.log('showOpenDialog')
		var callback = function(args){
			console.log(args);
		};
		dialog.showOpenDialog({
			/*选择图片和选择文件夹不一样*/
			properties: [ 'openFile'/*, 'openDirectory', 'multiSelections'*/ ]
		},callback);
		event.returnValue = '';
	});
	/*保存文件*/
	ipcMain.on('showSaveDialog', function(event, arg) {
		console.log('showSaveDialog')
		var callback = function(args){
			console.log(args);
		};
		dialog.showSaveDialog({
			/*选择图片和选择文件夹不一样*/
			properties: [ 'openFile'/*, 'openDirectory', 'multiSelections'*/ ],
			defaultPath:"abc.txt"
		},callback);

		event.returnValue = '';
	});
	/*alert*/
	ipcMain.on('showMessageBox', function(event, arg) {
		console.log('showMessageBox')
		var callback = function(args){
			console.log(args);
		};
		dialog.showMessageBox({
			message:'123',
			type:'error'
		},callback);

		event.returnValue = '';
	});
	/* error */
	ipcMain.on('showErrorBox', function(event, arg) {
		var callback = function(args){
			console.log(args);
		};
		dialog.showErrorBox('title', 'content');

		event.returnValue = '';
	});


	/*新增窗口*/
	ipcMain.on('openWindow', function(event, arg) {
		// console.log(arg);
		if(!!arg[0]){
			var newwin = new BrowserWindow({
				width: 800, 
				height: 600,
				// x:0,
				// y:0,
				maxWidth:1000,
				webPreferences:
		        {
		            nodeIntegration: false,
		            // offscreen: true,
		            preload: path.resolve(__dirname,'ipcRenderer.js')
		        }
			});
			newwin.loadURL('http://www.baidu.com/');
			console.log(win.id);
		}
		event.returnValue = '';
	});

	var image = nativeImage.createFromPath('./button1.png');
	win.setOverlayIcon(image, 'description')
	var winArr = BrowserWindow.getAllWindows();
	console.log(win.id);

	/*键盘组合键*/
	function globalShortcutAll(){
		globalShortcut.register('ctrl+x', function() {
			console.log('ctrl+x');
		});
	}
	
	win.on('blur',()=>{
		globalShortcut.unregisterAll();
	});

	win.on('focus',()=>{
		globalShortcutAll();
	});
	
	// win.setAutoHideMenuBar(true);
	win.setMenuBarVisibility(true);
	

	// console.log(winArr)

	// win.webContents.on('paint', (event, dirty, image) => {
 //    	// updateBitmap(dirty, image.getBitmap())
 //  	})
  	// win.webContents.setFrameRate(30);

	/*进度条*/
	var progressSpeed = 0;
	var pstimer;
	var p = new Promise((resolve,reject)=>{
		pstimer = setInterval(()=>{
			if(progressSpeed > 100){
				clearInterval(pstimer);
				resolve();
			}else{
				progressSpeed += Math.random() * 30;
				win.setProgressBar(progressSpeed / 100);
			}
		}, 200);
	});

	p.then(()=>{
		new Promise((resolve,reject)=>{
			win.flashFrame(true);
			setTimeout(()=>{
				resolve();
			}, 200);
		});
	}).then(()=>{
		new Promise((res,rej)=>{
			win.setSkipTaskbar(false);
			res();
		});
	}).then(()=>{
		// win.setDocumentEdited(true);
	})


	

	/*缩略图 图标*/
	win.setThumbarButtons([
		{
			tooltip: "button1",
			icon: path.join(__dirname, 'button1.png'),
			flags:['disabled'],
			click: function() { 
				// console.log("button2 clicked"); 
			}
		},
		{
			tooltip: "button2",
			icon: path.join(__dirname, 'button2.png'),
			flags:['dismissonclick'],
			click: function() {
				console.log("button2 clicked."); 
			}
		}
	]);

	// 打开窗口的调试工具
	win.webContents.openDevTools();
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


