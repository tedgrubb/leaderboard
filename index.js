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

  try {
    fs.readFile("/var/data/leaderboard.json", "utf8", (err, data) => {
      const leaderboard = JSON.parse(data);
      leaderboard.sort((a, b) => b.score - a.score);
      res.json(leaderboard);
      console.log("Leaderboard was requested");
    });
  } catch (e) {
    res.sendStatus(500);
    console.error("Failed to post high score", e);
  }
});

app.post("/leaderboard", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const { name, score } = req.query;

  if (!name || !score) {
    res.sendStatus(400);
    return;
  }

  fs.readFile("/var/data/leaderboard.json", "utf8", (err, data) => {
    try {
      const leaderboard = JSON.parse(data);
      leaderboard.push({ name, score });
      leaderboard.sort((a, b) => b.score - a.score);

      const newLeaderboard = JSON.stringify(leaderboard);
      if (newLeaderboard) {
        fs.writeFile("/var/data/leaderboard.json", newLeaderboard, () => {
          console.log("New high score posted", { name, score });
        });
      }
    
      res.json(newLeaderboard);
    } catch (e) {
      res.sendStatus(500);
      console.error("Failed to post high score", e);
    }
  });
});

// if we need to seed the leaderboard from a backup
// app.post("/seed", (_req, res) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");

//   fs.readFile("leaderboard.json", "utf8", (err, data) => {
//     const leaderboard = JSON.parse(data);
//     leaderboard.sort((a, b) => b.score - a.score);
//     fs.writeFile("/var/data/leaderboard.json", JSON.stringify(leaderboard), () => {
//       console.log("Data seeded at /var/data/leaderboard.json");
//     });
//     res.json(leaderboard);
//   });
// });

// Start the server and listen on the defined port
app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
