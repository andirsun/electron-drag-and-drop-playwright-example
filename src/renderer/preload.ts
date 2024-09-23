import { ipcRenderer } from "electron";

document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("new-window");
  button.ondragstart = (event) => {
    event.preventDefault();
    console.log("Electron: Drag started");
    ipcRenderer.send("start-drag");
  };
});

function getSyncronousData(): string {
  return "Synchronous Data";
}

function getAsynchronousData(): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Asynchronous Data");
    }, 1000);
  });
}

/**
 * ipcRenderer listeners do not usually return a value
 * but the e2e test will call this function to get the data
 */
ipcRenderer.addListener("get-synchronous-data", () => {
  return getSyncronousData();
});

ipcRenderer.addListener("get-asynchronous-data", async () => {
  return await getAsynchronousData();
});
