import express from "express";
import * as bodyParser from "body-parser";
import { getIp } from "./middlewares/ip";
import { defaultContentTypeMiddleware } from "./middlewares/defaultContentType";
import arrow from "./routes/arrow";
import health from "./routes/health";

const app = express();
const PORT = process.env.PORT || 12000;

app.use(defaultContentTypeMiddleware);
app.use(bodyParser.json());

app.get("/api/health", (req, res) => {
    res.send("healthy");
});

app.use("/api/healthcheck", health);
app.use("/api/arrow", getIp, arrow);

const server = app.listen(PORT, () => {
    console.log(`server started at localhost:${PORT}`);
});

