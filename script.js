// Word lists (expand these for stronger passwords)
const colours = ["Blue", "Red", "Green", "Purple", "Orange", "Yellow"];
const adjectives = ["Brave", "Swift", "Clever", "Calm", "Bold", "Happy"];
const animals = ["Tiger", "Otter", "Falcon", "Koala", "Panda", "Lion"];
const symbols = ["!", "@", "#", "$", "%", "&"];

// Secure random
function rand(max) {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] % max;
}

// Patterns
const patterns = [
  {
    name: "Colour + Animal + Number + Symbol",
    generate: () =>
      `${colours[rand(colours.length)]}${animals[rand(animals.length)]}${10 + rand(90)}${symbols[rand(symbols.length)]}`
  },
  {
    name: "Adjective + Animal + Year + Symbol",
    generate: () =>
      `${adjectives[rand(adjectives.length)]}${animals[rand(animals.length)]}${new Date().getFullYear()}${symbols[rand(symbols.length)]}`
  }
];

// Strength calculation
function calculateStrength(password) {
  let poolSize = 0;

  if (/[a-z]/.test(password)) poolSize += 26;
  if (/[A-Z]/.test(password)) poolSize += 26;
  if (/[0-9]/.test(password)) poolSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) poolSize += 20;

  const entropy = Math.log2(Math.pow(poolSize, password.length));
  return entropy;
}

// Update UI
function updateStrengthUI(password) {
  const strengthFill = document.getElementById("strengthFill");
  const strengthText = document.getElementById("strengthText");

  const entropy = calculateStrength(password);

  let label = "";
  let width = "";
  let color = "";

  if (entropy < 40) {
    label = "Weak";
    width = "25%";
    color = "#ef4444";
  } else if (entropy < 60) {
    label = "Moderate";
    width = "50%";
    color = "#f59e0b";
  } else if (entropy < 80) {
    label = "Strong";
    width = "75%";
    color = "#22c55e";
  } else {
    label = "Very Strong";
    width = "100%";
    color = "#10b981";
  }

  strengthFill.style.width = width;
  strengthFill.style.background = color;
  strengthText.textContent = `Strength: ${label}`;
}

// DOM
const output = document.getElementById("passwordOutput");
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const patternHint = document.getElementById("patternHint");

// Generate password
generateBtn.addEventListener("click", () => {
  const pattern = patterns[rand(patterns.length)];
  const password = pattern.generate();

  output.value = password;
  patternHint.textContent = pattern.name;

  updateStrengthUI(password);
});

// Copy
copyBtn.addEventListener("click", () => {
  if (!output.value) return;

  navigator.clipboard.writeText(output.value);

  copyBtn.textContent = "✅";
  setTimeout(() => (copyBtn.textContent = "📋"), 1200);
});
