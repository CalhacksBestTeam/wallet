import React, {useEffect, useRef, useState} from "react";
import type {NextPage} from "next";
import Head from "next/head";
import MakePayment from "../components/MakePayment";
import TerminalStatus from "../components/TerminalStatus";
import styled from "styled-components";
import {Button, Form, Modal} from "react-bootstrap";
import {useRouter} from "next/router";
import io from 'socket.io-client';
import {Command, IWebsocketMessage, Source} from "../config/Types";
import {useDispatch, useSelector} from "react-redux";
import {setConnected, setDisconnected} from "../store/features/connectedSlice";
import PinScreen from "../components/pin-screen/PinScreen";
import {LoadingOutlined} from "@ant-design/icons";
import {useGlobalState} from "../context";
import {processTransfer} from "../utils/transfer";
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
    const globalState = useGlobalState();

    const handleSubmit = (value : string) => {
        setPinNum(value)
    }

    const doTransfer = async () => {
        let plaintext = CryptoJS.AES.decrypt(dataLive,pinNum);
        const decrypedData = JSON.parse(plaintext.toString(CryptoJS.enc.Utf8));
        console.log(decrypedData);
        try {
            await processTransfer(decrypedData, "R4A43katTaGJqQHMMzUamTDhsCiRE2kQ8KKDbrbqg8S", 0.05, globalState);
            // await fetch("https://wallet-hazel.vercel.app/api/setNFCInfo", {method: "POST", body: JSON.stringify("")})
        } catch (e) {
            console.log(e);
            setTransferFinished(true);
            return;
        }
        setTransferFinished(true);
    }

    useEffect(() => {
        if(!pinNum) return;
        doTransfer()
    }, [pinNum, doTransfer])

    useEffect(() => {
        console.log(dataLive);
        if (!dataLive) return;
        console.log("GET PIN")
    }, [dataLive])

    useEffect(() => {
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

            socket.on('message', (data : IWebsocketMessage) => {
                console.log(data)
                if(data.source === Source.Phone) {
                    if(data.command === Command.Connect) {
                        dispatch(setConnected())
                    } else if (data.command === Command.Disconnect) {
                        dispatch(setDisconnected())
                    } else if (data.command === Command.Scan && data.data) {
                        console.log("RECIEVED SCAN DATA", data)
                        setDataLive(data.data)
                    }
                }
            })

            return () => {
                socket.off('connect');
                socket.off('disconnect');
                socket.off('pong');
            };
        })
    }, [dispatch]);

    const handleTransaction = () => {
        setShowInfoModal(false)
        setShowTransactionModal(true);
        requestNFCInfo();
    }

    const requestNFCInfo = async () => {
        if (!socket) return;
        const message: IWebsocketMessage = {
            source: Source.Wallet,
            command: Command.Scan
        }

        socket.emit('message', message);
    }

    const TransactionModal = (props: any) => {
        return (
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                animation={false}
            >
                {!transferFinished ? <Modal.Body>
                    <p className={"text-center"}>
                        {dataLive ? "Enter your Pin" : "Please scan your card"}
                    </p>
                    {dataLive ?
                        <div className="d-flex flex-row justify-content-center"><PinScreen handleInput={handleSubmit}/>
                        </div> : <div className="d-flex flex-row justify-content-center">
                            <LoadingOutlined style={{fontSize: 140}} spin/>
                        </div>}
                </Modal.Body> : <Modal.Body>
                    <p className="text-center">Transfer Completed Successfully!</p>
                    <div className="d-flex flex-row justify-content-center">
                        <img src={"/download.png"}  alt={"checkmark"}/>
                    </div>
                </Modal.Body>}
            </Modal>
        );
    }

    const InfoModal = (props: any) => {
        return (
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                animation={false}
                onHide={() => setShowInfoModal(false)}
            >
                <Modal.Body>
                    <p className="text-center">Enter destination address</p>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Recipients Address</Form.Label>
                            <Form.Control type="email" placeholder="Enter Wallet Address" />
                            <Form.Label>Amount</Form.Label>
                            <Form.Control type="email" placeholder="Enter Amount" />
                        </Form.Group>
                        <div className="d-flex flex-row justify-content-center">
                            <Button variant="primary" type="submit" onClick={() => {handleTransaction()}}>
                                Submit
                            </Button>
                        </div>

                    </Form>
                </Modal.Body>
            </Modal>
        );
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
                A simple, non-custodial crypto wallet for managing{" "}
                <a href="https://solana.com/">Solana</a> digital assets.
            </HomeTitle>

            <InfoModal
                show={showInfoModal}
            />
            <TransactionModal show={showTransactionModal}/>
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
  max-width: 800px;
  width: 100%;
`;

export default Home;
