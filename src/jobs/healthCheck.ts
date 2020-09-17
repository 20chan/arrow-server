import * as net from "net";
import { hosts } from "../routes/arrow";

export const healthCheck = (host: string, port: number): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        const sock = net.connect(port, host);
        sock.on("error", () => resolve(false));
        sock.on("timeout", () => resolve(false));
        sock.on("data", buf => {
            resolve(buf.readBigInt64BE() === BigInt("0x0000001f33761a00"));
        });
    });
};

export const healthCheckServers = async () => {
    for (let i = hosts.length - 1; i >= 0; i--) {
        if (!await healthCheck(hosts[i].ip, hosts[i].port)) {
            hosts.splice(i, 1);
        }
    }
};

export class HealthCheck {
    public interval: number;
    public lastCheck: Date;
    private i: NodeJS.Timeout;

    constructor(interval: number) {
        this.setInterval(interval);
    }

    public setInterval = (interval: number) => {
        this.interval = interval;
        clearInterval(this.i);
        this.i = setInterval(async () => await this.check(), interval);
    }

    public check = async () => {
        await healthCheckServers();
        this.lastCheck = new Date();
    }
}