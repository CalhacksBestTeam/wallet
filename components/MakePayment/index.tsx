import React, {ReactElement, useEffect, useState} from "react";
import {Button} from "antd";
import {BankOutlined} from "@ant-design/icons";
import {Card} from "../../styles/StyledComponents.styles";
import {useRouter} from "next/router";

const CreateAccount = (props: { setShow: Function }): ReactElement => {
    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter();

    setInterval(async () => {
        const res = await fetch("https://wallet-hazel.vercel.app/api/createTransaction")
        const after = await res;
        const json = await after.json();
        console.log(json);
        if (!json) return;
        router.push("/generate");
    }, 4000)

    useEffect(() => {
        setLoading(false);
    }, []);

    const handleGenerate = () => {
        setLoading(true);
        props.setShow(true)
    };

    return (
        <Card>
            <BankOutlined
                style={{fontSize: "3rem", margin: "2rem 0", display: "block"}}
            />
            <h2>Make a payment </h2>
            <p>
                Send Sol to an address of your choice.
            </p>


            <div className={"buttons"}>
                <Button type="primary" onClick={handleGenerate}>
                    Connect NFC
                </Button>
            </div>
        </Card>
    );
};

export default CreateAccount;
