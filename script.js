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

// DOM
const output = document.getElementById("passwordOutput");
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const patternHint = document.getElementById("patternHint");

// Generate
generateBtn.addEventListener("click", () => {
  const pattern = patterns[rand(patterns.length)];
  const password = pattern.generate();

  output.value = password;
  patternHint.textContent = pattern.name;
});

// Copy
copyBtn.addEventListener("click", () => {
  if (!output.value) return;

  navigator.clipboard.writeText(output.value);

  copyBtn.textContent = "✅";
  setTimeout(() => (copyBtn.textContent = "📋"), 1200);
});
