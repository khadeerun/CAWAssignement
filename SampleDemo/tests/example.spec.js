const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Path to the data.json file
const dataFilePath = path.join(__dirname, 'data.json');

// Initial test data for setup (if needed to reset the state)
const initialData = [
  { "name": "Bob", "age": 20 },
  { "name": "George", "age": 42 }
];

// Expected data after modification
const expectedData = [
  { "name": "Bob", "age": 20, "gender": "male" },
  { "name": "George", "age": 42, "gender": "male" },
  { "name": "Sara", "age": 42, "gender": "female" },
  { "name": "Conor", "age": 40, "gender": "male" },
  { "name": "Jennifer", "age": 42, "gender": "female" }
];

test.describe('Modify data.json and fill data into a website text box', () => {
  test.beforeEach(() => {
    // Write initial data to the JSON file to ensure test starts with known state
    fs.writeFileSync(dataFilePath, JSON.stringify(initialData, null, 2));
  });

  test('should modify the data.json file correctly and fill the data into a text box', async ({ page }) => {
    // Step 1: Read the initial data from the JSON file
    const rawData = fs.readFileSync(dataFilePath, 'utf8');
    const data = JSON.parse(rawData);

    // Verify the initial data is correct (optional)
    expect(data).toEqual(initialData);

    // Step 2: Modify the data
    const newData = [
      { "name": "Bob", "age": 20, "gender": "male" },
      { "name": "George", "age": 42, "gender": "male" },
      { "name": "Sara", "age": 42, "gender": "female" },
      { "name": "Conor", "age": 40, "gender": "male" },
      { "name": "Jennifer", "age": 42, "gender": "female" }
    ];

    // Step 3: Write the modified data back to the JSON file
    fs.writeFileSync(dataFilePath, JSON.stringify(newData, null, 2));

    // Step 4: Read the modified data and verify it
    const updatedRawData = fs.readFileSync(dataFilePath, 'utf8');
    const updatedData = JSON.parse(updatedRawData);

    // Verify the modified data is correct
    expect(updatedData).toEqual(expectedData);

    // Step 5: Navigate to the website
    const url = 'https://testpages.herokuapp.com/styled/tag/dynamic-table.html'; // Replace with your actual URL
    await page.goto(url);

    // Step 6: Fill the modified data into the text box
    await page.locator('#jsondata').fill(JSON.stringify(updatedData)); // Adjust selector as needed
    await page.locator('#refreshtable').click(); // Adjust selector as needed
    await page.waitForTimeout(5000);

    // Verify if necessary (depends on your webpage and requirements)
    // Example verification: Check if text box contains the modified data
    const filledValue = await page.inputValue('#jsondata'); // Adjust selector as needed
    expect(filledValue).toBe(JSON.stringify(updatedData));
  });
});
