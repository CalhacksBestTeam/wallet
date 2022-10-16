import React, {useState} from "react";
import {NextPage} from "next";
import {Button} from "antd";
import {LoadingOutlined} from "@ant-design/icons";
import {Modal} from "react-bootstrap";

const Phrase: NextPage = () => {
    const [loading, setLoading] = useState<boolean>(false);

    const handleLoading = () => {
        setLoading(true)
    };

    setInterval(async() => {
        const res = await fetch("https://wallet-hazel.vercel.app/api/setNFCInfo", { mode: 'no-cors'})
        console.log(res.body);
    } , 1000)

    function MyVerticallyCenteredModal(props: any) {
        return (
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Body>
                    <p className={"text-center"}>
                        Please scan your card
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
                <Button type="default" onClick={handleLoading}>
                    Scan NFC
                </Button>
            )}

            {loading && <LoadingOutlined style={{fontSize: 24}} spin/>}
        </>
    );
};

export default Phrase;
