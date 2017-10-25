const path = require('path');
const electron = require('electron');
const { app } = electron;
const { BrowserWindow } = electron;
const {ipcMain} = electron;
let win;
function createWindow() {
  // 创建窗口并加载页面
	win = new BrowserWindow({width: 800, height: 600});
	win.loadURL(`file://${__dirname}/index.html`);
	
	
	ipcMain.on('abc', function(event, arg) {
	  console.log(arg);  // prints "ping"
	  event.returnValue = 'bbb';
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
				console.log("button2 clicked"); 
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

	var txt = path.resolve(__dirname,'record.txt');
	console.log(txt);
	win.setRepresentedFilename(txt);
	win.setDocumentEdited(true);

	// app.addRecentDocument('file:\\\\C:\\Users\\viruser.v-desktop\\Desktop\\b.js');

	// 打开窗口的调试工具
	win.webContents.openDevTools();
	// 窗口关闭的监听
	win.on('closed', () => {
		win = null;
	});
}

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


