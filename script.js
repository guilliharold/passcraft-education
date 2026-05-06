// Word lists
const colours = ["Blue","Red","Green","Purple","Orange","Yellow"];
const adjectives = ["Brave","Swift","Clever","Calm","Bold","Happy"];
const animals = ["Tiger","Otter","Falcon","Koala","Panda","Lion"];
const symbols = ["!","@","#","$","%","&"];

// Secure random
function rand(max){
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] % max;
}

// Patterns
const patterns = [
  {
    name: "Colour + Animal + Number + Symbol",
    generate: () =>
      `${colours[rand(colours.length)]}${animals[rand(animals.length)]}${10+rand(90)}${symbols[rand(symbols.length)]}`
  },
  {
    name: "Adjective + Animal + Year + Symbol",
    generate: () =>
      `${adjectives[rand(adjectives.length)]}${animals[rand(animals.length)]}${new Date().getFullYear()}${symbols[rand(symbols.length)]}`
  }
];

// Strength
function calculateStrength(password){
  let pool=0;
  if(/[a-z]/.test(password)) pool+=26;
  if(/[A-Z]/.test(password)) pool+=26;
  if(/[0-9]/.test(password)) pool+=10;
  if(/[^a-zA-Z0-9]/.test(password)) pool+=20;
  return Math.log2(Math.pow(pool,password.length));
}

function updateStrengthUI(password){
  const fill=document.getElementById("strengthFill");
  const text=document.getElementById("strengthText");

  const e=calculateStrength(password);

  let label,width,color;

  if(e<40){label="Weak";width="25%";color="#ef4444";}
  else if(e<60){label="Moderate";width="50%";color="#f59e0b";}
  else if(e<80){label="Strong";width="75%";color="#22c55e";}
  else{label="Very Strong";width="100%";color="#10b981";}

  fill.style.width=width;
  fill.style.background=color;
  text.textContent=`Strength: ${label}`;
}

// DOM
const output=document.getElementById("passwordOutput");
const generateBtn=document.getElementById("generateBtn");
const copyBtn=document.getElementById("copyBtn");
const patternHint=document.getElementById("patternHint");

// Single generate
generateBtn.onclick=()=>{
  const p=patterns[rand(patterns.length)];
  const pass=p.generate();
  output.value=pass;
  patternHint.textContent=p.name;
  updateStrengthUI(pass);
};

// Copy
copyBtn.onclick=()=>{
  if(!output.value) return;
  navigator.clipboard.writeText(output.value);
  copyBtn.textContent="✅";
  setTimeout(()=>copyBtn.textContent="📋",1000);
};

// Bulk
let bulkResults=[];
let importedData=[];

function generateBulk(count){
  bulkResults=[];
  for(let i=0;i<count;i++){
    const p=patterns[rand(patterns.length)];
    const pass=p.generate();
    const row=importedData[i]||{};
    bulkResults.push({
      name:row.name||"",
      username:row.username||"",
      password:pass
    });
  }
  console.log(bulkResults);
}

// CSV parse
function parseCSV(text){
  const lines=text.split("\n").filter(l=>l.trim());
  const headers=lines[0].split(",").map(h=>h.trim().toLowerCase());
  return lines.slice(1).map(line=>{
    const values=line.split(",");
    let obj={};
    headers.forEach((h,i)=>obj[h]=values[i]?.trim()||"");
    return obj;
  });
}

// CSV export
function exportCSV(){
  if(!bulkResults.length) return;
  const rows=bulkResults.map(r=>[r.name,r.username,r.password].join(","));
  const csv=["Name,Username,Password",...rows].join("\n");

  const blob=new Blob([csv],{type:"text/csv"});
  const url=URL.createObjectURL(blob);

  const a=document.createElement("a");
  a.href=url;
  a.download="passwords.csv";
  a.click();

  URL.revokeObjectURL(url);
}

// Events
document.getElementById("bulkGenerateBtn").onclick=()=>{
  const count=parseInt(document.getElementById("bulkCount").value)||0;
  if(count>0) generateBulk(count);
};

document.getElementById("csvInput").onchange=(e)=>{
  const file=e.target.files[0];
  if(!file) return;
  const reader=new FileReader();
  reader.onload=()=> importedData=parseCSV(reader.result);
  reader.readAsText(file);
};

document.getElementById("exportBtn").onclick=exportCSV;
