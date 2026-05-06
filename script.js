const colours = ["Blue", "Red", "Green", "Purple", "Yellow", "Orange"];
const adjectives = ["Brave", "Happy", "Clever", "Swift", "Bright", "Calm"];
const animals = ["Tiger", "Otter", "Falcon", "Panda", "Lion", "Koala"];
const symbols = ["!", "@", "#", "$", "%", "&"];

// Secure random selection
function getRandomItem(arr) {
  const randomIndex = crypto.getRandomValues(new Uint32Array(1))[0] % arr.length;
  return arr[randomIndex];
}

// Generate password
function generate() {
  const pattern = document.getElementById("pattern").value;
  let password = "";

  const number = Math.floor(10 + Math.random() * 90); // 2-digit number
  const year = new Date().getFullYear();

  if (pattern === "colour") {
    password = `${getRandomItem(colours)}${getRandomItem(animals)}${number}${getRandomItem(symbols)}`;
  }

  if (pattern === "adjective") {
    password = `${getRandomItem(adjectives)}${getRandomItem(animals)}${year}${getRandomItem(symbols)}`;
  }

  document.getElementById("password").value = password;
  document.getElementById("feedback").textContent = "";
}

// Copy to clipboard
function copyPassword() {
  const passwordField = document.getElementById("password");

  if (!passwordField.value) return;

  passwordField.select();
  passwordField.setSelectionRange(0, 99999);

  navigator.clipboard.writeText(passwordField.value);

  document.getElementById("feedback").textContent = "Copied to clipboard!";
}
