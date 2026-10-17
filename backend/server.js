
const express = require("express");
const cors = require("cors");
const { execFile } = require("child_process");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const program = path.join(
  __dirname,
  "../c_program/shared_memory"
);

app.get("/", (req, res) => {
  res.json({
    project: "Shared Memory Based Data Exchange System",
    status: "Backend is running"
  });
});

app.post("/api/run-demo", (req, res) => {
  execFile(program, [], { timeout: 10000 }, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({
        success: false,
        error: stderr || error.message
      });
    }

    res.json({
      success: true,
      output: stdout
    });
  });
});

app.listen(PORT, "127.0.0.1", () => {
  console.log(`Backend running at http://127.0.0.1:${PORT}`);
});
