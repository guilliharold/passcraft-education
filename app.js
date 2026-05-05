const role = localStorage.getItem("role");
document.getElementById("roleTitle").innerText =
  role === "staff" ? "Teaching Staff Generator" : "Student Generator";

const adjectives = ["Blue", "Red", "Green", "Fast", "Bright"];
const animals = ["Dingo", "Kangaroo", "Koala", "Emu", "Wombat"];
const symbols = "!@#$%^&*";

function generatePassword() {
  const length = role === "staff" ? 16 : 12;
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789" + symbols;

  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  document.getElementById("output").innerText = password;
}

function generatePassphrase() {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  const number = Math.floor(10 + Math.random() * 90);
  const symbol = symbols[Math.floor(Math.random() * symbols.length)];

  const phrase = `${adj}${animal}${number}${symbol}`;
  document.getElementById("output").innerText = phrase;
}
