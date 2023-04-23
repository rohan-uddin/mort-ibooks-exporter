
const books = require('./index');
createDropdown(books, "my-dropdown")

function generateId() {
  const randomString = Math.random().toString(36).substring(2, 8);
  const timestamp = Date.now().toString(36);
  return randomString + timestamp;
}

function createDropdown(data, dropdownId) {
  // Retrieve the dropdown element by its ID
  const dropdown = document.getElementById(dropdownId);

  // Create a default option
  const defaultOption = document.createElement("option");
  defaultOption.text = "Select an option";
  dropdown.add(defaultOption);

  // Loop through the data and create an option for each item
  for (const item of data) {
    const option = document.createElement("option");
    // option.value = item.value;
    option.value = generateId();
    option.text = item.title;
    dropdown.add(option);
  }
}