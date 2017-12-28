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




function registerGlobalShortCut(){
	/*键盘组合键*/
	function globalShortcutAll(){
		globalShortcut.register('ctrl+x', function() {
			console.log('ctrl+x');
		});

		globalShortcut.register('F5', function() {
			win.webContents.reload();
		});
	}

	/*计数器*/
	function sum(){
		globalShortcut.register('1', function() {
			win.webContents.send('webcontent-add', 'whoooooooh!')
		});

		globalShortcut.register('2', function() {
			win.webContents.send('webcontent-minus', 'whoooooooh!')
		});
	}

	

	function switchFunc(){
		globalShortcut.register('F7', function() {
			global.sumFlag = !global.sumFlag;
			if(global.sumFlag){
				sum();
			}else{
				globalShortcut.unregister('1');
				globalShortcut.unregister('2');
			}
		});
	}
	sum();
	switchFunc();

	// win.on('blur',()=>{
	// 	globalShortcut.unregisterAll();
	// });

	// win.on('focus',()=>{
	// 	globalShortcutAll();
	// });
}

// ipcMain
function ipcMainHandle(){
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
}

/*菜单*/
function menuInit(){
	var template = [
	  {
	    label: 'Edit',
	    submenu: [
	      {
	        label: 'Undo',
	        accelerator: 'CmdOrCtrl+Z',
	        role: 'undo'
	      },
	      {
	        label: 'Redo',
	        accelerator: 'Shift+CmdOrCtrl+Z',
	        role: 'redo'
	      },
	      {
	        type: 'separator'
	      },
	      {
	        label: 'Cut',
	        accelerator: 'CmdOrCtrl+X',
	        role: 'cut'
	      },
	      {
	        label: 'Copy',
	        accelerator: 'CmdOrCtrl+C',
	        role: 'copy'
	      },
	      {
	        label: 'Paste',
	        accelerator: 'CmdOrCtrl+V',
	        role: 'paste'
	      },
	      {
	        label: 'Select All',
	        accelerator: 'CmdOrCtrl+A',
	        role: 'selectall'
	      },
	    ]
	  },
	  {
	    label: 'View',
	    submenu: [
	      {
	        label: 'Reload',
	        accelerator: 'CmdOrCtrl+R',
	        click: function(item, focusedWindow) {
	          if (focusedWindow)
	            focusedWindow.reload();
	        }
	      },
	      {
	        label: 'Toggle Full Screen',
	        accelerator: (function() {
	          if (process.platform == 'darwin')
	            return 'Ctrl+Command+F';
	          else
	            return 'F11';
	        })(),
	        click: function(item, focusedWindow) {
	          if (focusedWindow)
	            focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
	        }
	      },
	      {
	        label: 'Toggle Developer Tools',
	        accelerator: (function() {
	          if (process.platform == 'darwin')
	            return 'Alt+Command+I';
	          else
	            return 'Ctrl+Shift+I';
	        })(),
	        click: function(item, focusedWindow) {
	          if (focusedWindow)
	            focusedWindow.toggleDevTools();
	        }
	      },
	    ]
	  },
	  {
	    label: 'Window',
	    role: 'window',
	    submenu: [
	      {
	        label: 'Minimize',
	        accelerator: 'CmdOrCtrl+M',
	        role: 'minimize'
	      },
	      {
	        label: 'Close',
	        accelerator: 'CmdOrCtrl+W',
	        role: 'close'
	      },
	    ]
	  },
	  {
	    label: 'Help',
	    role: 'help',
	    submenu: [
	      {
	        label: 'Learn123 More',
	        click: function() { require('electron').shell.openExternal('http://electron.atom.io') }
	      },
	    ]
	  },
	];

	console.log(process.platform);

	var menu = Menu.buildFromTemplate(template);
	Menu.setApplicationMenu(menu);
}


/*缩略图 初始化*/
function thumbarButtonsInit(){
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
}

/*进度条*/
function progressInit(){
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
}

/*保证 电源*/
function powerSaveBlockerInit(){
	var id = powerSaveBlocker.start('prevent-display-sleep');
	console.log(powerSaveBlocker.isStarted(id));

	powerSaveBlocker.stop(id);

}

/*注册 protocol*/
function protocolRegister(){
	/*拦截协议*/
	protocol.interceptHttpProtocol('http', function(req,callback){
		// console.log(callback)

	
		var html='123';
		callback({mimeType: 'application/text', data: Buffer.from(html,'utf-8')});
	});
	/*注册协议*/
	protocol.registerHttpProtocol('abc', function(req){
		// console.log(req);
	});

}
/*webContents 初始化*/
function webContentsInit(win){
	var webContents = win.webContents;
	webContents.on('dom-ready',()=>{
		console.log('webContents dom-ready');
		// console.log( webContents.getURL());
		// var agent = webContents.getUserAgent()
		// console.log(agent);
		// webContents.insertCSS('div{background:yellow !important;}')
		var result = webContents.findInPage('div');
		console.log('result='+result)
	});



	/*findInPage 查询到之后 的操作*/
	webContents.on('found-in-page',(event,result)=>{
		return;
		console.log('start found-in-page:');
		console.log(result.requestId);
		console.log(result.finalUpdate);
		console.log(result.matches);
		console.log(result.selectionArea);
	});

	webContents.on('did-navigate',()=>{
		console.log('webContents will-navigate');
		// console.log( webContents.getURL());
	})
	
}
/*TrayInit*/
function TrayInit(){
	appIcon = new Tray('./button2.png');
	appIcon.setToolTip('This is my application.');
	var contextMenu = Menu.buildFromTemplate([
		{ label: 'Item1', type: 'radio' },
		{ label: 'Item2', type: 'radio' },
		{ label: 'Item3', type: 'radio', checked: true },
		{ label: 'Item4', type: 'radio' }
	]);
	appIcon.setContextMenu(contextMenu);
}