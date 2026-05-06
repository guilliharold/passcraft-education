const colours = ["Blue", "Red", "Green", "Purple", "Yellow", "Orange"];
const adjectives = ["Brave", "Happy", "Clever", "Swift", "Bright", "Calm"];
const animals = ["Tiger", "Otter", "Falcon", "Panda", "Lion", "Koala"];
const symbols = ["!", "@", "#", "$", "%", "&"];

// Secure random
function getRandomItem(arr) {
  const index = crypto.getRandomValues(new Uint32Array(1))[0] % arr.length;
  return arr[index];
}

// Generate password
function generate() {
  const pattern = document.getElementById("pattern").value;

  const number = crypto.getRandomValues(new Uint32Array(1))[0] % 900 + 100; // 3-digit
  const year = new Date().getFullYear();

  let password = "";

  if (pattern === "colour") {
    password = `${getRandomItem(colours)}${getRandomItem(animals)}${number}${getRandomItem(symbols)}`;
  }

  if (pattern === "adjective") {
    password = `${getRandomItem(adjectives)}${getRandomItem(animals)}${year}${getRandomItem(symbols)}`;
  }

  document.getElementById("password").value = password;
  updateStrength(password);
}

// Strength checker
function updateStrength(password) {
  let score = 0;

  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const bar = document.getElementById("strength-bar");
  const text = document.getElementById("strength-text");

  const levels = [
    { width: "25%", text: "Weak", color: "#ef4444" },
    { width: "50%", text: "Fair", color: "#f59e0b" },
    { width: "75%", text: "Strong", color: "#3b82f6" },
    { width: "100%", text: "Very Strong", color: "#22c55e" }
  ];

  const level = levels[Math.max(0, score - 1)];

  bar.style.width = level.width;
  bar.style.background = level.color;
  text.textContent = `Strength: ${level.text}`;
}

// Copy function
function copyPassword() {
  const field = document.getElementById("password");

  if (!field.value) return;

  navigator.clipboard.writeText(field.value);

  const feedback = document.getElementById("feedback");
  feedback.textContent = "Copied!";
  setTimeout(() => feedback.textContent = "", 1500);
}

// Generate one on load
generate();
