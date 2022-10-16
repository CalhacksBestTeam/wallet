import React, {useEffect, useRef, useState} from "react";
import {NextPage} from "next";
// @ts-ignore
import {Button} from "antd";
import {LoadingOutlined} from "@ant-design/icons";
import {Modal} from "react-bootstrap";
import {processTransfer} from "../utils/transfer";
import PinScreen from "../components/pin-screen/PinScreen";
import {useGlobalState} from "../context";

let CryptoJS = require("crypto-js");

const Phrase: NextPage = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [transferFinished, setTransferFinished] = useState<boolean>(false);
    const data = useRef()
    const [dataLive, setDataLive] = useState();
    const [pinNum, setPinNum] = useState<string | undefined>(undefined);

    const globalState = useGlobalState();



    const handleLoading = () => {
        setLoading(true)
    };

    const handleSubmit = (value : string) => {
        setPinNum(value)
    }

    useEffect(() => {
        if (loading) return;
        setInterval(async () => {
            if (data.current) return;

            const res = await fetch("https://wallet-hazel.vercel.app/api/setNFCInfo")
            const after = await res;
            const json = await after.json();
            console.log(json);
            if (!json) return;

            console.log("PARSED")
            data.current = json;
            setDataLive(json);
        }, 4000)
    }, [loading])

    const doTransfer = async () => {
        let plaintext = CryptoJS.AES.decrypt(dataLive,pinNum);
        const decrypedData = JSON.parse(plaintext.toString(CryptoJS.enc.Utf8));
        console.log(decrypedData);
        try {
            await processTransfer(decrypedData, "5F1Z2Y3X4W5V6U7T8S9R", 0.05, globalState);
            await fetch("https://wallet-hazel.vercel.app/api/setNFCInfo", {method: "DELETE"});
        } catch (e) {
            console.log(e);
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

    const MyVerticallyCenteredModal = (props: any) => {
        return (
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Body>
                    <p className={"text-center"}>
                        {dataLive ? "Enter your Pin" : "Please scan your card"}
                    </p>
                    {dataLive ? <div className="d-flex flex-row justify-content-center"><PinScreen handleInput={handleSubmit} /></div> : <div className="d-flex flex-row justify-content-center">
                        <LoadingOutlined style={{fontSize: 140}} spin/>
                    </div>}
                </Modal.Body>
            </Modal>
        );
    }

    return (
        <>
            <h1 className={"title"}>Connect Reader</h1>

            <p>Use our app to scan your wallet.</p>
            <MyVerticallyCenteredModal
                show={(loading || dataLive) && !transferFinished}
            />
            {!loading && (
                <Button type="default" onClick={() => {
                    handleLoading();
                }}>
                    Scan NFC
                </Button>
            )}

            {loading && <LoadingOutlined style={{fontSize: 24}} spin/>}
        </>
    );
};

export default Phrase;
