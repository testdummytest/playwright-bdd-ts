import { promises as fs } from 'fs';

export async function getTestDataValue(path: string): Promise<string | undefined> {
    try {
      // Read the test data JSON file
      const data = await fs.readFile('./TestData/testData.json', 'utf-8');
      const parsedData = JSON.parse(data);
  
      // Split the dynamic path (e.g., "credentialAutotst:username") by ":"
      const [objectKey, fieldKey] = path.split(':');
  
      // Retrieve the value from the nested object based on the path
      if (parsedData[objectKey] && parsedData[objectKey][fieldKey]) {
        return parsedData[objectKey][fieldKey];
      } else {
        throw new Error(`Invalid path: ${path}`);
      }
    } catch (error) {
      throw new Error(`Unable to read test data: ${error.message}`);
    }
  }