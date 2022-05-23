import express from "express";
import * as db from "../handler/database.js";

const app = express();
const port = 28883;

app.listen(port, () => {
    console.log(`[ 🔧 ] API listening to port : ${port}`);
});

app.get("/", (req, res) => {
    res.send("root");
});

app.get("/user/:userID", (req, res) => {
    db.getUser(req.params.userID).then(data => {
        db.getLevelTable().then(dataTable => { 

            // Calculate togo xp for next level and add it to the progress array
            data.progress.togo = dataTable[data.progress.level]["xp"] - data.progress.xp || 0;

            if (data != null) {
                res.json(data);
            } else {
                res.status(404).json({ error: "User not found" });
            }
        });
    });
});