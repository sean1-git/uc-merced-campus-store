import { spawn } from "node:child_process";
const children = [
  spawn(process.execPath, ["--watch", "apps/api/src/local.mjs"], {
    stdio: "inherit",
    windowsHide: true,
  }),
  spawn(process.execPath, ["node_modules/vite/bin/vite.js"], {
    stdio: "inherit",
    windowsHide: true,
  }),
];
let stopping = false;
// Stop the pair together so an orphaned API or Vite process cannot keep its
// port occupied after the other process exits.
function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) child.kill();
  process.exitCode = code;
}
for (const child of children) {
  child.on("error", () => stop(1));
  child.on("exit", (code) => stop(code || 0));
}
process.on("SIGINT", () => stop());
process.on("SIGTERM", () => stop());
