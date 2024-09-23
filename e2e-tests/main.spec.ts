/**
 * Example Playwright script for Electron
 * showing/testing various API features
 * in both renderer and main processes
 */

import { expect, test } from "@playwright/test";
import { findLatestBuild, parseElectronApp } from "electron-playwright-helpers";
import { ElectronApplication, Page, _electron as electron } from "playwright";

let electronApp: ElectronApplication;
let dragAndDropEventDispatched = false;

test.beforeAll(async () => {
  // find the latest build in the out directory
  const latestBuild = findLatestBuild();
  // parse the directory and find paths and other info
  const appInfo = parseElectronApp(latestBuild);
  // set the CI environment variable to true
  process.env.CI = "e2e";
  electronApp = await electron.launch({
    args: [appInfo.main],
    executablePath: appInfo.executable,
  });

  const firstPage = await electronApp.firstWindow();

  // capture console messages
  firstPage.on("console", (msg) => {
    console.log(msg.text());
    if (msg.text() === "Electron: Drag started") {
      dragAndDropEventDispatched = true;
    }
  });
});

test.afterAll(async () => {
  await electronApp.close();
});

let page: Page;

test("renders the first page", async () => {
  page = await electronApp.firstWindow();
  await page.waitForSelector("h1");
  const text = await page.$eval("h1", (el) => el.textContent);
  expect(text).toBe("Hello World!");
});

test("Test drag and drop", async () => {
  // const dropItem = page.getByRole("heading");
  const dragIem = page.getByRole("button");
  // dragIem.dragTo(dropItem);
  await dragIem.hover();
  await page.mouse.down();
  await page.mouse.move(10, 10, {
    steps: 100,
  });
  await page.mouse.up();
  // It should be true if the event was dispatched
  expect(dragAndDropEventDispatched).toBeTruthy();
});
