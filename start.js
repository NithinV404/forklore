const { spawn } = require("child_process");

let commands = [
  "npm --prefix ./client install",
  "npm --prefix ./server install",
  "npm --prefix ./client run start-react",
  "npm --prefix ./server run start-server",
];

commands.forEach((command) => {
  let ps = spawn(command, { shell: true });

  ps.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  ps.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  ps.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });
});
