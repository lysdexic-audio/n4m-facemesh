const { app, BrowserWindow } = require("electron");
const Store =  require("electron-store");
Store.initRenderer();

function createWindow() {
	console.log("Loading n4m-handpose..");
	// Create the browser window.
	const win = new BrowserWindow({
		width: 622, 
		height: 542, 
		webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        } 
	});
	
	// uncomment for debug console:
	// win.webContents.openDevTools();

	// and load the html of the app.
	win.loadFile("./n4m-facemesh_camera.html");
}

app.on("ready", createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
});