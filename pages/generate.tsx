import React, {useEffect, useState} from "react";
import {NextPage} from "next";
import {Button} from "antd";
import {LoadingOutlined} from "@ant-design/icons";
import {Modal} from "react-bootstrap";

const Phrase: NextPage = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState()

    const handleLoading = () => {
        setLoading(true)
    };


    const interval = setInterval(async() => {
        const res = await fetch("https://wallet-hazel.vercel.app/api/setNFCInfo")
        const after = await res;
        const json = await after.json();
        console.log(json);
        if(!json) return;

        console.log("PARSED")
        setData(json);
    } , 4000)

    useEffect(() => {
        console.log(data);
        if(!data) return;
        clearInterval(interval)
        // setLoading(false);

    }, [data, interval])


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
                        {data ? "Making your transaction" : "Please scan your card"}
                    </p>
                    <div className="d-flex flex-row justify-content-center">
                        <LoadingOutlined style={{fontSize: 140}} spin/>
                    </div>

                </Modal.Body>
            </Modal>
        );
    }

    return (
        <>
            <h1 className={"title"}>Connect Reader</h1>

            <p>Use our app to scan your wallet.</p>
            <MyVerticallyCenteredModal
                show={loading}
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
