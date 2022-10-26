export interface IWebsocketMessage {
    source: Source;
    data?: string;
    command: Command;
}

export enum Source {
    Phone="Phone",
    Wallet="Wallet",
    Dapp="Dapp",
}

export enum Command {
    Scan="Scan",
    Connect="Connect",
    Ping="Ping",
    Disconnect="Disconnect",
}
