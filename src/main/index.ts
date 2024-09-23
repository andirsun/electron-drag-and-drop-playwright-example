import {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  MenuItem,
  nativeImage,
} from "electron";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

const SVG_ICON = `data:image/png;base64,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`;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

let count = 0;

const createWindow = (): void => {
  count++;
  let x = 20;
  let y = 20;
  const frontWindow = BrowserWindow.getFocusedWindow();
  if (frontWindow) {
    const bounds = frontWindow.getBounds();
    x = bounds.x + 20;
    y = bounds.y + 20;
  }

  // are we running tests?
  const testing = process.env.CI === "e2e";

  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    x,
    y,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      additionalArguments: [`--window-id=${count}`],
      nodeIntegration: testing ? true : false,
      contextIsolation: testing ? false : true,
    },
    show: false,
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

function initMenu() {
  const menu = Menu.getApplicationMenu();
  // create the "New Window" MenuItem
  const newWindow = new MenuItem({
    label: "New Window",
    id: "new-window",
    accelerator: "CmdOrCtrl+N",
    click: () => {
      createWindow();
    },
  });
  // find the "File" MenuItem
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const filemenu = menu.items.find((item) => item.role === "filemenu");
  if (filemenu) {
    // add the "New Window" MenuItem to the beginning of the File menu
    filemenu.submenu.insert(0, newWindow);
  }
  // update the application menu
  Menu.setApplicationMenu(menu);
}

app.on("ready", () => {
  initMenu();
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

/**
 * Respond to IPC request for a new window
 */
ipcMain.on("new-window", () => {
  createWindow();
});

ipcMain.on("start-drag", (event) => {
  // Start native electron drag event
  event.sender.startDrag({
    file: "/path/to/file",
    icon: nativeImage.createFromDataURL(SVG_ICON),
  });
});

/**
 * Return the current number of windows (via IPC)
 */
ipcMain.handle("how-many-windows", () => {
  return count;
});

function mainSynchronousData() {
  return "Main Synchronous Data";
}

async function mainAsynchronousData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Main Asynchronous Data");
    }, 1000);
  });
}

ipcMain.on("main-synchronous-data", (event, arg) => {
  return mainSynchronousData();
});

ipcMain.on("main-asynchronous-data", async (event, arg) => {
  return await mainAsynchronousData();
});
