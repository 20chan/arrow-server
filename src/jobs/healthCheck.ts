import { hosts } from "../routes/arrow";

export const healthCheckServers = (deadTime: number) => {
    const now = new Date().getTime();
    for (let i = hosts.length - 1; i >= 0; i--) {
        if (deadTime < now - hosts[i].lastPing) {
            hosts.splice(i, 1);
        }
    }
};

export class HealthCheck {
    public interval: number;
    public deadTime: number;
    public lastCheck: Date;
    private i: NodeJS.Timeout;

    constructor(interval: number, deadTime: number) {
        this.setInterval(interval);
        this.deadTime = deadTime;
    }

    public setInterval = (interval: number) => {
        this.interval = interval;
        clearInterval(this.i);
        this.i = setInterval(this.check, interval);
    }

    public check = () => {
        healthCheckServers(this.deadTime);
        this.lastCheck = new Date();
    }
}