import * as fs from "fs";
import * as path from "path";

// Dynamically resolve path based on environment
const TEST_DATA_DIR = fs.existsSync(path.resolve(process.cwd(), "TestData"))
    ? path.resolve(process.cwd(), "TestData")
    : path.resolve(process.cwd(), "playwright-automation/TestData");

const TEST_DATA_PATH = path.join(TEST_DATA_DIR, "testData.json");

console.log(`📂 Looking for test data at: ${TEST_DATA_PATH}`);

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
