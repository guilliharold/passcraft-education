// Word lists
const colours = ["Blue", "Red", "Green", "Purple", "Orange", "Yellow"];
const adjectives = ["Brave", "Swift", "Clever", "Calm", "Bold", "Happy"];
const animals = ["Tiger", "Otter", "Falcon", "Koala", "Panda", "Lion"];
const symbols = ["!", "@", "#", "$", "%", "&"];

// Secure random generator
function getSecureRandom(max) {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] % max;
}

// Generate password
function generatePassword(pattern) {
  const number = Math.floor(10 + getSecureRandom(90)); // 2-digit
  const year = new Date().getFullYear();
  const symbol = symbols[getSecureRandom(symbols.length)];

  if (pattern === "colour") {
    return `${colours[getSecureRandom(colours.length)]}${animals[getSecureRandom(animals.length)]}${number}${symbol}`;
  }

  if (pattern === "adjective") {
    return `${adjectives[getSecureRandom(adjectives.length)]}${animals[getSecureRandom(animals.length)]}${year}${symbol}`;
  }
}

// DOM elements
const output = document.getElementById("passwordOutput");
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const patternSelect = document.getElementById("patternSelect");

// Generate button event
generateBtn.addEventListener("click", () => {
  const pattern = patternSelect.value;
  const password = generatePassword(pattern);
  output.value = password;
});

// Copy button event
copyBtn.addEventListener("click", () => {
  if (!output.value) return;

  navigator.clipboard.writeText(output.value).then(() => {
    copyBtn.textContent = "Copied!";
    setTimeout(() => {
      copyBtn.textContent = "Copy";
    }, 1500);
  });
});
