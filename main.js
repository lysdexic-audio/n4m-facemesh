const { app, BrowserWindow } = require("electron");

function createWindow() {
	console.log("hello");
	// Create the browser window.
	const win = new BrowserWindow({ width: 800, height: 600 });
	win.webContents.openDevTools();

	// and load the html of the app.
	win.loadFile("./camera.html");
}

app.on("ready", createWindow);