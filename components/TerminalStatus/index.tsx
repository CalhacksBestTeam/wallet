import React, {useState, useEffect, ReactElement} from "react";
import {Button} from "antd";
import {LoadingOutlined, UnlockOutlined} from "@ant-design/icons";
import Link from "next/link";
import {Card} from "../../styles/StyledComponents.styles";
import {useSelector} from "react-redux";
import {Modal} from "react-bootstrap";
import PinScreen from "../pin-screen/PinScreen";
import styles from "./TerminalStatus.module.css"
import {Command, IWebsocketMessage, Source} from "../../config/Types";

const RestoreAccount = (props: { socket: any | null }): ReactElement => {
    const [loading, setLoading] = useState<boolean>(false);
    const isScannerConnected = useSelector((state: any) => state.connected.isConnected)

    useEffect(() => {
        setLoading(false);
    }, []);

    const handleGetWallet = () => {
        tryConnect();
        setLoading(true);
    };


    const tryConnect = () => {
        if (!props.socket) return;
        const message: IWebsocketMessage = {
            source: Source.Wallet,
            command: Command.Connect
        }

        props.socket.emit('message', message);
    }

    const ConnectionModal = (props: any) => {
        return (
            <Modal
                {...props}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                animation={true}
            >
                <p className={`text-center p-2 ${styles.connectText}`}>Please Accept the Connection Request on your
                    Device</p>
                <LoadingOutlined style={{fontSize: 140}} spin className={"mb-5"}/>
                {/*<img src={"/download.png"}  alt={"checkmark"}/>*/}
            </Modal>
        );
    }

    return (
        <Card>
            <ConnectionModal show={loading && !isScannerConnected}/>
            <UnlockOutlined
                style={{fontSize: "3rem", margin: "2rem 0", display: "block"}}
            />
            <h2>Payment terminal status</h2>
            <p>
                This terminal is online and ready to process payments!
            </p>
            {!isScannerConnected ? <div className={"buttons"}>
                    {!loading && !isScannerConnected && (
                        <Button onClick={handleGetWallet}
                                style={{background: "#ba0023", color: "white", borderRadius: 4}}>DISCONNECTED</Button>
                    )}
                    {loading && (
                        <Button className={"disabledButton"} disabled>
                            <LoadingOutlined spin/>
                        </Button>
                    )}
                </div> :
                <div className={"buttons"}>
                    <p className={`text-center mb-0 ${styles.connectedText}`}
                       style={{background: "#097a27", borderRadius: 2}}>Scanner Connected</p>
                </div>
            }
        </Card>
    );
};

export default RestoreAccount;
