import * as fs from "fs";
import * as path from "path";

const TEST_DATA_PATH = path.resolve(__dirname, "../TestData/testData.json");

// Function to fetch test data
export function getTestDataValue(key: string): string {
    if (!fs.existsSync(TEST_DATA_PATH)) {
        console.error(`❌ Test data file not found at ${TEST_DATA_PATH}`);
        return "default_value";
    }

    const testData = JSON.parse(fs.readFileSync(TEST_DATA_PATH, "utf8"));

    // 🔍 Check if key contains nested notation "testCredential:username"
    if (key.includes(":")) {
        const keys = key.split(":"); // Split the key by `:`
        let value: any = testData;

        for (const k of keys) {
            value = value?.[k]; // Access nested object
            if (value === undefined) {
                console.error(`❌ Key "${key}" not found in testData.json`);
                return "default_value";
            }
        }
        return value; // Return resolved value
    }

    // If key is not nested, return directly
    return testData[key] !== undefined ? testData[key] : "default_value";
}
