const os = require("os");
const fs = require("fs");
const path = require("path");

const nets = os.networkInterfaces();
let localIP: string | null = null;

for (const name of Object.keys(nets)) {
  for (const net of nets[name]) {
    if (net.family === "IPv4" && !net.internal) {
      localIP = net.address;
    }
  }
}

if (!localIP) {
  console.error("No local IP found");
  process.exit(1);
}

console.log("Local IP:", localIP);

// target files to update
const files = [
  ".env.development",
  ".env.dev-prod",
  ".env.demo-prod",
];

files.forEach(file => {
  const filePath = path.join(__dirname, "..", file);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, "utf8");

  // replace FRONTEND_URL
  content = content.replace(
    /FRONTEND_URL=.*/g,
    `FRONTEND_URL=http://${localIP}:5173`
  );

  fs.writeFileSync(filePath, content, "utf8");

  console.log(`${file} updated`);
});

// optional: write a separate env-only file for backend CORS
const backendEnvPath = path.join(__dirname, "..", ".env.local-ip");
fs.writeFileSync(backendEnvPath, `LOCAL_IP=${localIP}\n`);

console.log(".env.local-ip updated");
