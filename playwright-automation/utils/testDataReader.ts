import * as fs from "fs";
import * as path from "path";

const TEST_DATA_PATH = path.resolve(process.cwd(), "playwright-automation/TestData/testData.json");

console.log(`📂 Looking for test data at: ${TEST_DATA_PATH}`);

export function getTestDataValue(key: string): string {
    if (!fs.existsSync(TEST_DATA_PATH)) {
        console.error(`❌ Test data file not found at ${TEST_DATA_PATH}`);
        return "default_value";
    }

    const testData = JSON.parse(fs.readFileSync(TEST_DATA_PATH, "utf8"));

    if (key.includes(":")) {
        const keys = key.split(":");
        let value: any = testData;
        for (const k of keys) {
            value = value?.[k];
            if (value === undefined) {
                console.error(`❌ Key "${key}" not found in testData.json`);
                return "default_value";
            }
        }
        return value;
    }

    return testData[key] !== undefined ? testData[key] : "default_value";
}
