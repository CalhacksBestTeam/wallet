import React, {useEffect, useRef, useState} from "react";
import {NextPage} from "next";
import {Button} from "antd";
import {LoadingOutlined} from "@ant-design/icons";
import {Modal} from "react-bootstrap";

const Phrase: NextPage = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const data = useRef()

    const handleLoading = () => {
        setLoading(true)
    };

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
            setLoading(true);
        }, 4000)
    }, [loading])

    useEffect(() => {
        console.log(data.current);
        if (!data.current) return;
        // setLoading(false);

    }, [])

    console.log(data)

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
                        {data.current ? "Making your transaction" : "Please scan your card"}
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
