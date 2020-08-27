import express from "express";
import * as bodyParser from "body-parser";
import arrow from "./routes/arrow";

const app = express();
const PORT = process.env.PORT || 12000;

app.use(bodyParser.json());

app.get("/api/health", (req, res) => {
    res.send("healthy");
});

app.use("/api/arrow", arrow);

const server = app.listen(PORT, () => {
    console.log(`server started at localhost:${PORT}`);
});

