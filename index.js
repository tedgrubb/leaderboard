const fs = require("fs");
const express = require("express"); // Import the express module
const app = express(); // Create an Express application instance
const port = 3000;

// Define a basic GET route
app.get("/", (req, res) => {
  res.send("Hello World!"); // Send a response
});

app.get("/leaderboard", (_req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  fs.readFile("/var/data/leaderboard.json", "utf8", (err, data) => {
    const leaderboard = JSON.parse(data);
    leaderboard.sort((a, b) => b.score - a.score);
    res.json(leaderboard);
    console.log("Leaderboard was requested");
  });
});

app.post("/leaderboard", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const { name, score } = req.query;

  if (!name || !score) {
    res.sendStatus(400);
    return;
  }

  fs.readFile("/var/data/leaderboard.json", "utf8", (err, data) => {
    const leaderboard = JSON.parse(data);
    leaderboard.push({ name, score });
    leaderboard.sort((a, b) => b.score - a.score);
    fs.writeFile("/var/data/leaderboard.json", JSON.stringify(leaderboard), () => {
      console.log("New high score posted", { name, score });
    });
    res.json(leaderboard);
  });
});


// Start the server and listen on the defined port
app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
