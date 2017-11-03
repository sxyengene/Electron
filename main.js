const path = require('path');
const electron = require('electron');
const { app,BrowserWindow,ipcMain } = electron;


let win;
function createWindow() {
	// console.log('app ready.create window.');
	// 创建窗口并加载页面
	win = new BrowserWindow({
		width: 1000, 
		height: 1000,
		// x:0,
		// y:0,
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
	win.maximize();
	// console.log(process.version);
	// console.log(process.type);
	/*上下线*/
	ipcMain.on('onlineOrOffline', function(event, arg) {
		// console.log(arg);
		event.returnValue = '';
	});


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

	var appIcon = new Tray('./button1.png');
	
	win.setOverlayIcon(appIcon, 'description')
	var winArr = BrowserWindow.getAllWindows();
	console.log(win.id);
	

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
			win.setSkipTaskbar(true);
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


