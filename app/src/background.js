"use strict";
/*eslint-disable */
import { app, protocol, BrowserWindow, ipcMain, nativeImage } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
// import SystemInfo from './utils/SystemInfo.js'
import ipc_provider from "./utils/ipc_provider.js";
const path = require("path");

const isDevelopment = process.env.NODE_ENV !== "production";

app.setAppUserModelId("Fontmin Desktop");

protocol.registerSchemesAsPrivileged([{ scheme: "app", privileges: { secure: true, standard: true } }]);
var mainWindow = null;
async function createWindow() {
    //去掉顶部菜单
    // if (!isDevelopment) Menu.setApplicationMenu(null);

    const cwd = isDevelopment ? null : path.join(__dirname, "..");
    const win = (mainWindow = new BrowserWindow({
        width: 1200,
        height: 750,
        minWidth: 1200,
        minHeight: 750,
        show: true,
        skipTaskbar: false,
        // icon: nativeImage.createFromPath(isDevelopment ? path.join("./public", "logo.ico") : path.join(cwd, "app.asar/logo.ico")),
        webPreferences: {
            // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            devTools: isDevelopment,
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: false,
            webSecurity: false,
        },
        maximizable: true,
        darkTheme: true,
        resizable: true,
        fullscreenable: false,

        alwaysOnTop: false,
        frame: isDevelopment,
    }));

    win.webContents.setZoomFactor(1.0);

    if (!process.env.isDevelopment) win.webContents.openDevTools();
    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    } else {
        createProtocol("app");
        // Load the index.html when not in development
        win.loadURL("app://./index.html");
    }
    // win.on("close", (event) => {
    //     event.preventDefault();
    //     win.hide();
    //     win.setSkipTaskbar(true);
    //     // app.quit();
    // });
    // win.on("focus", async () => {
    //     win.webContents.send("OnWindowFocus");
    //     hasNewMessage = false;
    // });
}
if (!isDevelopment) {
    app.setLoginItemSettings({
        //设置开机启动
        openAtLogin: false,
    });
}

// Quit when all windows are closed.
// app.on("window-all-closed", () => {
//     // On macOS it is common for applications and their menu bar
//     // to stay active until the user quits explicitly with Cmd + Q
//     if (process.platform !== "darwin") {
//         app.quit();
//     }
// });

app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

const additionalData = { myKey: "78350E37-7019-4BEA-9938-7155D3B382A1" };
const locker = app.requestSingleInstanceLock(additionalData);
if (!locker) {
    app.quit();
} else {
    app.on("second-instance", (event, commandLine, workingDirectory, additionalData) => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
            mainWindow.show();
        }
    });
    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.on("ready", async () => {
        if (isDevelopment && !process.env.IS_TEST) {
            // Install Vue Devtools
            try {
                await installExtension(VUEJS_DEVTOOLS);
            } catch (e) {
                console.error("Vue Devtools failed to install:", e.toString());
            }
        }
        createWindow();

        ipc_provider(mainWindow);
    });

    // console.log("操作系统类型", os.platform());
    // console.log("处理器架构", os.arch());
    // console.log("cpus", os.cpus());
    // console.log("release", os.release());
    // console.log("操作系统名称", os.type());
}

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === "win32") {
        process.on("message", (data) => {
            if (data === "graceful-exit") {
                app.quit();
            }
        });
    } else {
        process.on("SIGTERM", () => {
            app.quit();
        });
    }
}

ipcMain.on("CloseWindow", () => {
    mainWindow.hide();
});
ipcMain.on("Exit", () => {
    // app.quit();
    app.exit();
});
ipcMain.on("MinWindow", () => {
    mainWindow.minimize();
});
ipcMain.on("MaxWindow", () => {
    if (mainWindow.isMaximized()) mainWindow.unmaximize();
    else mainWindow.maximize();
});
