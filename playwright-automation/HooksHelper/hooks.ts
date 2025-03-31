import { BeforeAll, AfterAll, Before, After, Status } from "@cucumber/cucumber";
import { Browser, BrowserContext, chromium } from "@playwright/test";
import { pageFixture } from "./pageFixture";
import { recordTestResult } from "../utils/emailSender"; // Store test results globally
import * as fs from "fs";
import * as path from "path";

let browser: Browser;
let context: BrowserContext;

BeforeAll(async () => {
  console.log("Launching browser before tests...");
  browser = await chromium.launch({ headless: true });
});

AfterAll(async () => {
  console.log("Closing browser after tests...");
  await browser.close();
});

Before(async () => {
  console.log("Setting up browser context before each test...");
  context = await browser.newContext();
  const page = await context.newPage();
  pageFixture.page = page;

  // 🔍 Debug step: Check if testData.json exists before starting the test
  const testDataPath = path.resolve(__dirname, "../TestData/testData.json");
  if (fs.existsSync(testDataPath)) {
    console.log(`✅ testData.json found at: ${testDataPath}`);
  } else {
    console.error(`❌ testData.json NOT FOUND at: ${testDataPath}`);
  }
});

After(async ({ pickle, result }) => {
  console.log("Cleaning up after scenario...");

  const testName = pickle.name;
  const status = result?.status == Status.PASSED ? "Pass" : "Fail";
  let failureReason = status === "Pass" ? "" : result?.message || "No specific failure message.";

  // Save test result globally in emailSender.ts
  recordTestResult(testName, status, failureReason);

  if (result?.status == Status.FAILED) {
    await pageFixture.page.screenshot({
      path: `./test-results/screenshots/${pickle.name}.png`,
      type: "png",
    });
  }

  await pageFixture.page.close();
  await context.close();
});
