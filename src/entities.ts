export interface HostInfo {
    id: number;
    ip: string;
    port: number;
    name: string;
    password?: string;

    maxPlayers: number;
    currentPlayers: number;
    isPlaying: boolean;

    lastPing: number;
}