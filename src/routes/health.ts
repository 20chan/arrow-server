import * as express from "express";
import { HealthCheck } from "../jobs/healthCheck";

const routes = express.Router();

export const check = new HealthCheck(10 * 1000, 30 * 1000);

const healthInfo = () => {
    return {
        interval: check.interval,
        lastCheck: check.lastCheck,
    };
};

routes.get("/", async (req, resp) => {
    resp.json(healthInfo());
});

routes.post("/", async (req, resp) => {
    await check.check();
    resp.json(healthInfo());
});


export default routes;