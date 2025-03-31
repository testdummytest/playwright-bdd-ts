import * as nodemailer from "nodemailer";
import * as fs from "fs";
import * as path from "path";

let testResults: { testName: string; status: string; failureReason?: string }[] = [];
let testPass = 0;
let testFail = 0;

/**
 * Records test results in a global variable (used in `hook.ts`).
 */
export function recordTestResult(testName: string, status: string, failureReason: string) {
    if (testResults.some(test => test.testName === testName)) return; // Prevent duplicates

    if (status === "Pass") testPass++;
    else testFail++;

    testResults.push({ testName, status, failureReason });
}

/**
 * Generates an HTML test execution report.
 */
function generateHtmlReport(): string {
    return `
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; font-size: 14px; }
        table { width: 80%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
        th { background-color: #2C3E50; color: white; font-weight: bold; }
        td { background-color: #f9f9f9; }
        .summary-table th, .summary-table td { text-align: left; padding: 10px; }
      </style>
    </head>
    <body>
      <h2>Automation Test Execution Report</h2>
      <table class="summary-table">
        <tr><th>Summary</th><th>Details</th></tr>
        <tr><td>Project Name</td><td>SauceDemo</td></tr>
        <tr><td>Test Type</td><td>Automation</td></tr>
        <tr><td>Browser Used</td><td>Chrome</td></tr>
        <tr><td>Test Pass</td><td>${testPass}</td></tr>
        <tr><td>Test Fail</td><td>${testFail}</td></tr>
        <tr><td>Total Test Cases</td><td>${testPass + testFail}</td></tr>
      </table>
    </body>
    </html>
    `;
}

/**
 * Sends an email with the test execution report.
 */
async function sendEmail() {
    console.log("🔄 Generating HTML Report...");
    const htmlReport = generateHtmlReport();
    const reportPath = path.join(__dirname, "../test-results/cucumber-report-smoke.html");

    if (!fs.existsSync(reportPath)) {
        console.error("❌ Report file not found:", reportPath);
    } else {
        console.log("✅ Report file found:", reportPath);
    }

    const attachments = fs.existsSync(reportPath) ? [{
        filename: "TestReport.html",
        path: reportPath,
        contentType: "text/html",
    }] : [];

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "automationreport477@gmail.com",
            pass: "jepgjwtiwkdblajf",
        },
    });

    const mailOptions = {
        from: "automationreport477@gmail.com",
        to: "shahyogesh0902@gmail.com",
        subject: "Automation Test Report",
        html: htmlReport,
        attachments: attachments,
    };

    try {
        console.log("🚀 Sending email...");
        await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully!");
        process.exit(0); // Force stop the script after sending the email
    } catch (error) {
        console.error(`❌ Failed to send email: ${error}`);
        process.exit(1);
    }
}


/**
 * Injects a Pie Chart into the Cucumber HTML Report
 */
function injectChartIntoReport() {
    console.log("test into chart function..");
    const reportPath = path.join(__dirname, "../test-results/cucumber-report-smoke.html");

    if (!fs.existsSync(reportPath)) {
        console.error("❌ Report file not found:", reportPath);
        return;
    }

    let reportHtml = fs.readFileSync(reportPath, "utf-8");

    // Chart.js script to be injected
    const chartScript = `
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.0.0"></script>
        <script>
            document.addEventListener("DOMContentLoaded", function () {
                console.log("✅ Injected Chart.js into Cucumber Report");

                var summarySection = document.querySelector("#content");
                if (!summarySection) {
                    console.error("❌ Summary section not found in report!");
                    return;
                }

                var chartContainer = document.createElement("div");
                chartContainer.style.display = "flex"; 
                chartContainer.style.justifyContent = "center";
                chartContainer.style.gap = "20px"; 
                chartContainer.innerHTML = \`
                    <canvas id="testResultsPieChart" width="300" height="300"></canvas>
                    <canvas id="testResultsDoughnutChart" width="300" height="300"></canvas>
                \`;
                summarySection.appendChild(chartContainer);

                var pieCtx = document.getElementById("testResultsPieChart").getContext("2d");
                var doughnutCtx = document.getElementById("testResultsDoughnutChart").getContext("2d");

                var chartData = {
                    labels: ["Passed", "Failed"],
                    datasets: [{
                        data: [${testPass}, ${testFail}],
                        backgroundColor: ["#28a745", "#dc3545"],
                    }],
                };

                Chart.register(ChartDataLabels); // Ensure the plugin is registered

                var chartOptions = {
                    responsive: false,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: "top"
                        },
                        datalabels: {
                            color: "white",
                            font: {
                                weight: "bold",
                                size: 14
                            },
                            formatter: (value) => value // Display actual count
                        }
                    }
                };

                new Chart(pieCtx, { type: "pie", data: chartData, options: chartOptions });
                new Chart(doughnutCtx, { type: "doughnut", data: chartData, options: chartOptions });

                console.log("✅ Pie and Doughnut Charts successfully added to report.");
            });
        </script>
    `;

    // Inject script before `</body>` tag
    reportHtml = reportHtml.replace("</body>", chartScript + "</body>");

    fs.writeFileSync(reportPath, reportHtml);
    console.log("✅ Pie and Doughnut Charts injected into Cucumber report successfully!");
}


/**
 * Automatically send the report when all tests are completed.
 */
process.once("beforeExit", async () => {
    if (testResults.length > 0) {
        injectChartIntoReport(); // Inject the Pie Chart
        await sendEmail(); // Send the email with the updated report
    }
});
