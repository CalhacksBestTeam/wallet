export interface IWebsocketMessage {
    source: Source;
    data?: any;
    command: Command;
    target?: Target;
}

export enum Source {
    Phone="Phone",
    Wallet="Wallet",
    Dapp="Dapp",
}


export enum Target {
    Wallet = 'Wallet',
    SolanaPay = 'SolanaPay',
}

export enum Command {
    Scan="Scan",
    Connect="Connect",
    SendPublicKey="SendPublicKey",
    SignAndSendTransaction="SignAndSendTransaction",
    Ping="Ping",
    Disconnect="Disconnect",
}
