import { BeforeAll, AfterAll, Before, After, Status } from "@cucumber/cucumber";
import { Browser, BrowserContext, chromium } from "@playwright/test";
import { pageFixture } from "./pageFixture";
import { sendEmail } from "../utils/emailSender";
import * as fs from "fs";
import * as path from "path";

let browser: Browser;
let context: BrowserContext;
let testResults: { testName: string; summary: string; status: string; failureReason?: string }[] = [];
let testPass = 0;
let testFail = 0;

BeforeAll(async () => {
  console.log("Launching browser before tests...");
  browser = await chromium.launch({ headless: false });
});

AfterAll(async () => {
  console.log("Closing browser after tests...");

  // Get browser version
  const browserVersion = browser.version();

  // Generate HTML Table
  const htmlTable = generateHtmlReport(testPass, testFail, testResults, browserVersion);

  // Prepare attachments
  const reportPaths = [
    path.join(__dirname, "../test-results/cucumber-report-smoke.html"),
  ];

  // Check if reports exist
  const attachments = reportPaths
    .filter(report => fs.existsSync(report))
    .map(report => ({
      filename: path.basename(report),
      path: report,
    }));

  // Send Email with Table
  await sendEmail("Automation Test Report", htmlTable, attachments);

  await browser.close();
});

Before(async () => {
  console.log("Setting up browser context before each test...");
  context = await browser.newContext();
  const page = await context.newPage();
  pageFixture.page = page;
});

After(async ({ pickle, result }) => {
  console.log("Cleaning up after scenario...");

  const testName = pickle.name;
  const status = result?.status == Status.PASSED ? "Pass" : "Fail";

  let failureReason = ""; // Initialize failure reason

  if (status === "Pass") {
    testPass++;
  } else {
    testFail++;
    failureReason = result?.message || "No specific failure message."; // Capture failure reason
  }

  testResults.push({
    testName: testName,
    summary: `Verify ${testName.replace(/_/g, " ")}`,
    status: status,
    failureReason: failureReason, // Now this will work!
  });

  // Take a screenshot if test failed
  if (result?.status == Status.FAILED) {
    await pageFixture.page.screenshot({
      path: `./test-results/screenshots/${pickle.name}.png`,
      type: "png",
    });
  }

  await pageFixture.page.close();
  await context.close();
});


/**
 * Generates an HTML table for the test execution summary.
 */
function generateHtmlReport(passed: number, failed: number, results: any[], browserVersion: string): string {
  const failedTests = results.filter(test => test.status === "Fail"); // Extract only failed tests

  return `
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          font-size: 14px;
        }
        table {
          width: 80%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        th, td {
          border: 1px solid #ccc;
          padding: 8px;
          text-align: left; /* Left-aligned text */
        }
        th {
          background-color: #2C3E50;
          color: white;
          font-weight: bold;
        }
        td {
          background-color: #f9f9f9;
        }
        .summary-table th, .summary-table td {
          text-align: left; /* Ensure summary content is left-aligned */
          padding: 10px;
        }
        .green {
          background-color: #D4EDDA;
          color: #155724;
          font-weight: bold;
        }
        .red {
          background-color: #F8D7DA;
          color: #721C24;
          font-weight: bold;
        }
      .failed-testcases {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
      }
      </style>
    </head>
    <body>
      <h2>Automation Test Execution Report</h2>

      <table class="summary-table">
        <tr><th><b>Summary</b></th><th><b>Details</b></th></tr>
        <tr><td>Project Name</td><td>SauceDemo</td></tr>
        <tr><td>Test Type</td><td>Automation</td></tr>
        <tr><td>Browser Used</td><td>Chrome</td></tr>
        <tr><td>Browser Version</td><td>${browserVersion}</td></tr>
        <tr><td>Test Pass</td><td>${passed}</td></tr>
        <tr><td>Test Fail</td><td>${failed}</td></tr>
        <tr><td>Total Test Cases</td><td>${passed + failed}</td></tr>
      </table>

      
    </body>
    </html>
  `;
}
