const express = require("express");
const cors = require("cors");

const app = express();
console.log("SERVER FILE STARTED");
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Pantone Server Running");
});

app.get("/", (req, res) => {
    res.send("Pantone Server Running");
});

app.post("/api/pantone-search", (req, res) => {
    console.log("BODY:", req.body);

    res.json({
        c: 0,
        m: 100,
        y: 85,
        k: 2
    });
});
app.listen(3000, () => {
    console.log("Server running on port 3000");
});