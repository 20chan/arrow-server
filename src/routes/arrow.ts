import * as express from "express";
import { HostInfo } from "../entities";

const routes = express.Router();
const hosts: HostInfo[] = [];
let idCounter = 0;

const publicHostInfo = (host: HostInfo) => {
    return {
        id: host.id,
        name: host.name,
        public: host.password === undefined,
    };
};

const connectHostInfo = (host: HostInfo) => {
    return {
        id: host.id,
        ip: host.ip,
        port: host.port,
    };
};

routes.get("/server", (req, res) => {
    res.json(hosts.map(publicHostInfo));
});

routes.get("/server/raw", (req, res) => {
    res.json(hosts);
});

routes.post("/server/:id", (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        res.status(400);
        res.end();
        return;
    }
    const target = hosts.find(h => h.id === id);
    if (target === undefined) {
        res.status(404);
        res.end();
        return;
    }
    try {
        const password = req.body.password;
        if (target.password === password) {
            res.json(connectHostInfo(target));
        }
    } catch {
        res.status(400);
        res.end();
    }
});

routes.post("/server", (req, res) => {
    const info: HostInfo = {
        ...req.body,
        id: idCounter,
        ip: req.realIp,
        port: req.body.port || 7777,
    };

    if (info.name === undefined) {
        res.status(400);
        res.end();
        return;
    }

    idCounter += 1;
    hosts.push(info);
    res.json(info);
});

routes.put("/server", (req, res) => {
    const info = req.body as HostInfo;
    const index = hosts.findIndex(h => h.id === info.id && h.ip === req.realIp);
    if (index === -1) {
        res.status(400);
        res.end();
        return;
    }

    const infoUpdated: HostInfo = {
        ...info,
        ip: req.realIp,
    };
    hosts[index] = infoUpdated;
});

routes.delete("/server/:id", (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        res.status(400);
        res.end();
        return;
    }
    const info = req.body as HostInfo;
    const index = hosts.findIndex(h => h.id === info.id && h.ip === req.realIp);
    if (index === -1) {
        res.status(400);
        res.end();
        return;
    }

    hosts.splice(index, 1);
    res.status(200);
    res.end();
});

export default routes;