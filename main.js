const path = require('path');
const electron = require('electron');
const { app } = electron;
const { BrowserWindow } = electron;
const {ipcMain} = electron;
let win;
function createWindow() {
	// console.log('app ready.create window.');
	// 创建窗口并加载页面
	win = new BrowserWindow({width: 800, height: 600});
	win.loadURL(`file://${__dirname}/index.html`);
	

	console.log(process.type);
	/*上下线*/
	ipcMain.on('onlineOrOffline', function(event, arg) {
		// console.log(arg);
		event.returnValue = '';
	});

	/*进度条*/
	var progressSpeed = 0;
	var pstimer = setInterval(()=>{
		if(progressSpeed > 100){
			clearInterval(pstimer);
		}else{
			progressSpeed += Math.random() * 10;
			win.setProgressBar(progressSpeed / 100);
		}
	}, 200)


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


