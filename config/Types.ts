export interface IWebsocketMessage {
    source: Source;
    data?: any;
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
    SendPublicKey="SendPublicKey",
    SignAndSendTransaction="SignAndSendTransaction",
    Ping="Ping",
    Disconnect="Disconnect",
}
