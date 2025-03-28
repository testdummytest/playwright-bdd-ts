import * as fs from "fs";
import * as path from "path";

// Determine the correct test data path
const TEST_DATA_PATHS = [
    path.resolve(__dirname, "../TestData/testData.json"),  // Local execution
    path.resolve(process.cwd(), "playwright-automation/TestData/testData.json")  // GitHub Actions
];

// Find the correct test data file path
const TEST_DATA_PATH = TEST_DATA_PATHS.find(fs.existsSync) || TEST_DATA_PATHS[1];

console.log(`📂 Looking for test data at: ${TEST_DATA_PATH}`);

// Function to fetch test data
export function getTestDataValue(key: string): string {
    if (!fs.existsSync(TEST_DATA_PATH)) {
        console.error(`❌ Test data file NOT found at ${TEST_DATA_PATH}`);
        return "default_value";
    }

    try {
        const fileContent = fs.readFileSync(TEST_DATA_PATH, "utf8");

        if (!fileContent.trim()) {
            console.error(`⚠️ Test data file is EMPTY at ${TEST_DATA_PATH}`);
            return "default_value";
        }

        const testData = JSON.parse(fileContent);

        if (key.includes(":")) {
            const keys = key.split(":");
            let value: any = testData;
            for (const k of keys) {
                value = value?.[k];
                if (value === undefined) {
                    console.error(`❌ Key "${key}" NOT found in testData.json`);
                    return "default_value";
                }
            }
            return value;
        }

        return testData[key] !== undefined ? testData[key] : "default_value";
    } catch (error) {
        console.error(`❌ Error reading testData.json: ${error.message}`);
        return "default_value";
    }
}
