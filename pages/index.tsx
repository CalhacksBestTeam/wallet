import React, {useEffect, useState} from "react";
import type {NextPage} from "next";
import Head from "next/head";
import MakePayment from "../components/MakePayment";
import TerminalStatus from "../components/TerminalStatus";
import styled from "styled-components";
import {Button, Modal} from "react-bootstrap";
import {useRouter} from "next/router";
import io from 'socket.io-client';
import {Command, IWebsocketMessage, Source} from "../config/Types";
import {useDispatch} from "react-redux";
import {setConnected, setDisconnected} from "../store/features/connectedSlice";
import {LoadingOutlined} from "@ant-design/icons";
import {PublicKey, SystemProgram, Transaction} from "@solana/web3.js";
import ScaleSwipeInput from "../components/ScaleSwipeInput/ScaleSwipeInput";
import {signature} from "@solana/web3.js/src/layout";

let CryptoJS = require("crypto-js");

const Home: NextPage = () => {
    const [showInfoModal, setShowInfoModal] = React.useState(false);
    const [showTransactionModal, setShowTransactionModal] = React.useState(false);
    const router = useRouter();
    const [isConnected, setIsConnected] = useState(false);
    const [lastPong, setLastPong] = useState(null);
    const [socket, setSocket] = useState<any | null>(null);
    const dispatch = useDispatch()

    const [transferFinished, setTransferFinished] = useState<boolean>(false);
    const [dataLive, setDataLive] = useState<string | undefined>(undefined);
    const [pinNum, setPinNum] = useState<string | undefined>(undefined);
    const [transactionID, setTransactionID] = useState<string | undefined>("");
    const [pinNumRef, setPinNumRef] = useState<string>("")
    const [transaction, setTransaction] = useState<any | null>(null)

    const [recipientWallet, setRecipientWallet] = useState<string>("")
    const [amount, setAmount] = useState<string>("")

    const handleSubmit = (value: string) => {
        setPinNum(value)
    }

    const dec = CryptoJS.AES.decrypt('U2FsdGVkX1+gCR4IpmlsPKZz7ksqSmogQd7I39iIUoqiyCPna5cFCtDryNcWDO9PWSuTYtgWAnc7gQLajFOXoKmPKIVOy0pRf7GMlvrwj4gvJ1yXTzzGKbPImYXzjfDDxIjGTDBgONwxIOlMLV7rzvtLvki8XsdsY/YO3+i1xwKNlUhBE9qnfabilNhlTvkuVv8xPuFmXCYaVft10X1HjMQZW1xXSEpOWx7GZRgzqkSv71EqW2LforFwiwcrhp+Xxc9qqwTIYdcYuPMpxush5X+Y0znRVgG7++qDL6dKIAHbwSjLAUNgwFiH2WgQiIRuoomgk4R2WHlLAhRpLDLB+Q==', "2019")
    const buf = JSON.parse(dec.toString(CryptoJS.enc.Utf8));
    console.log(Buffer.from(buf))

    const resetEverything = () => {
        setDataLive(undefined);
        setPinNum(undefined);
        setTransaction(null);
        setTransactionID(undefined);
    }

    const doTransfer = async (transaction: any) => {
        if (!transaction) return;

        try {
            let plaintext = CryptoJS.AES.decrypt(dataLive, pinNum);
            const web3 = require("@solana/web3.js");

            const secret = Uint8Array.from(Buffer.from(JSON.parse(plaintext.toString(CryptoJS.enc.Utf8))));
            const tx = transaction;
            const signer = web3.Keypair.fromSecretKey(secret);

            const connection = new web3.Connection(
                web3.clusterApiUrl('devnet'),
                'confirmed',
            );


            const signature = await web3.sendAndConfirmTransaction(
                connection,
                tx,
                [signer],
            );


            setTransactionID(signature)
            console.log('SIGNATURE', signature);
        } catch (e) {
        }

        setTransferFinished(true);
    }

    useEffect(() => {
        if (!pinNum || !transaction || transactionID) return;
        doTransfer(transaction)
    }, [pinNum, transaction, transactionID])

    useEffect(() => {
        console.log(dataLive);
        if (!dataLive) return;
        console.log("GET PIN")
    }, [dataLive])

    useEffect(() => {
        const web3 = require("@solana/web3.js");


        fetch("/api/websocket").then((res) => {
            const socket = io();

            setSocket(socket);

            socket.on('connect', () => {
                setIsConnected(true);
            });

            socket.on('disconnect', () => {
                setIsConnected(false);
            });

            socket.on('pong', () => {
                // @ts-ignore
                setLastPong(new Date().toISOString());
            });

            socket.on('message', async (data: IWebsocketMessage) => {
                console.log(data)
                if (data.source === Source.Phone) {
                    if (data.command === Command.Connect) {
                        dispatch(setConnected())
                    } else if (data.command === Command.Disconnect) {
                        dispatch(setDisconnected())
                    } else if (data.command === Command.Scan && data.data) {
                        console.log("RECIEVED SCAN DATA", data)
                        setDataLive(data.data)
                    }
                }

                if (data.source === Source.Dapp) {
                    if (data.command === Command.Connect) {
                        const message: IWebsocketMessage = {
                            source: Source.Wallet,
                            command: Command.SendPublicKey,
                            data: "82nmirhEM86RXiyWkZb64Pkjpn4J7iVaYJmni4MueLcM"
                        }

                        console.log("DAPP CONNECTED", data)
                        socket.emit("message", message)
                    }

                    if (data.command === Command.SignAndSendTransaction) {
                        if (!data.data) return;
                        const transaction = JSON.parse(data.data).transaction
                        const tx = web3.Transaction.from(Buffer.from(transaction));
                        setTransaction(tx)

                        // const signer = web3.Keypair.fromSecretKey(Uint8Array.from(mykeypair));
                        //
                        // const connection = new web3.Connection(
                        //     web3.clusterApiUrl('devnet'),
                        //     'confirmed',
                        // );
                        //
                        // const signature = await web3.sendAndConfirmTransaction(
                        //     connection,
                        //     tx,
                        //     [signer],
                        // );
                        //
                        // console.log('SIGNATURE', signature);
                    }
                }
            })

            return () => {
                socket.off('connect');
                socket.off('disconnect');
                socket.off('pong');
                socket.off('message');
            };
        })
    }, [dispatch]);

    const handleTransaction = async () => {
        const web3 = require("@solana/web3.js");
        const connection = new web3.Connection(
            web3.clusterApiUrl('devnet'),
            'confirmed',
        );
        const lamports = await connection.getMinimumBalanceForRentExemption(0);


        console.log(lamports)
        const num = Number(amount) * web3.LAMPORTS_PER_SOL;


        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: new PublicKey('82nmirhEM86RXiyWkZb64Pkjpn4J7iVaYJmni4MueLcM'),
                toPubkey: new PublicKey(recipientWallet),
                lamports: num,            
            })
        );

        setTransaction(transaction)
        setShowInfoModal(false)
    }

    useEffect(() => {
        if (transaction) {
            setTransferFinished(false);
            setShowTransactionModal(true);
            requestNFCInfo();
        } else {
            setShowTransactionModal(false)
        }
    }, [transaction])

    const requestNFCInfo = async () => {
        if (!socket) return;
        const message: IWebsocketMessage = {
            source: Source.Wallet,
            command: Command.Scan
        }

        socket.emit('message', message);
    }

    return (
        <>
            <Head>
                <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
                <meta charSet="utf-8"/>
                <title>{process.env.NEXT_PUBLIC_BRAND_NAME} wallet</title>
                <meta name="description" content="Web3 tutorial for Solana crypto wallet."/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <HomeTitle>
                A stateless non-custodial crypto wallet making digital assets portable.
            </HomeTitle>

            <Modal
                show={showInfoModal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                animation={false}
                onHide={() => setShowInfoModal(false)}
            >
                <Modal.Body>
                    <p className="text-center">Enter destination address</p>
                    <div className="d-flex flex-row justify-content-center">
                        <ScaleSwipeInput value={recipientWallet} setValue={setRecipientWallet} autoFocus={true}/>
                    </div> 
                    <p className="text-center">Amount</p>
                    <div className="d-flex flex-row justify-content-center">
                        <ScaleSwipeInput value={amount} setValue={setAmount} autoFocus={false}/>
                    </div>
                    <div className="d-flex flex-row justify-content-center">
                        <Button variant="primary" type="submit" onClick={(event) => {
                            event.preventDefault()
                            handleTransaction()
                        }}>
                            Submit
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal
                show={showTransactionModal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                animation={false}
                onHide={() => {
                    setShowTransactionModal(false)
                    resetEverything()
                }}
            >
                {!transferFinished ? <Modal.Body style={{padding: 30}}>
                    <p className={"text-center"} style={{fontSize:20}}>
                        {dataLive ? "Enter your Pin" : "Please touch your NFC wallet on the reader"}
                    </p>
                    {dataLive ?
                        <div className="d-flex flex-row justify-content-center">
                            <ScaleSwipeInput value={pinNumRef} setValue={setPinNumRef} onSubmit={() => {
                                setPinNum(pinNumRef)
                            }} autoFocus={true} isHidden={true}/>
                        </div>
                        :
                        <div className="d-flex flex-row justify-content-center">
                            <LoadingOutlined style={{fontSize: 140}} spin/>
                        </div>}
                </Modal.Body> : <Modal.Body>
                    <div className="d-flex flex-row justify-content-center">
                        <img src={"/download.png"} alt={"checkmark"} style={{height: 70, width: 70}}/>
                    </div>
                    <p className="text-center" style={{fontSize: 40}}>Transfer Completed Successfully!</p>
                    <div className="d-flex flex-row justify-content-center">
                        <a href={`https://explorer.solana.com/tx/${transactionID}?cluster=devnet`} target={"_blank"} rel="noreferrer" style={{color: "green"}}>View Transaction</a>
                    </div>
                </Modal.Body>}
            </Modal>
            <HomeGrid>
                <MakePayment setShow={setShowInfoModal}/>
                <TerminalStatus socket={socket}/>
            </HomeGrid>
        </>
    );
};

const HomeTitle = styled.h1`
  padding: 0 3rem;
  margin: 3rem 1rem;
  line-height: 1.25;
  font-size: 1.5rem;
  font-weight: normal;
  text-align: center;

  & > a {
    color: #0070f3;
    text-decoration: none;

    &:hover,
    &:focus,
    &:active {
      text-decoration: underline;
    }
  }
`;

const HomeGrid = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
`;

export default Home;
