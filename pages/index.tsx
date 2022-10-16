import React from "react";
import type {NextPage} from "next";
import Head from "next/head";
import MakePayment from "../components/MakePayment";
import TerminalStatus from "../components/TerminalStatus";
import styled from "styled-components";
import {Button, Form, Modal} from "react-bootstrap";
import PinScreen from "../components/pin-screen/PinScreen";
import {LoadingOutlined} from "@ant-design/icons";
import {useRouter} from "next/router";

const Home: NextPage = () => {
    const [show, setShow] = React.useState(false);
    const router = useRouter();

    const MyVerticallyCenteredModal = (props: any) => {
        return (
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                animation={false}
            >
                <Modal.Body>
                    <p className="text-center">Enter destination address</p>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Recipients Address</Form.Label>
                            <Form.Control type="email" placeholder="Enter Wallet Address" />
                        </Form.Group>
                        <Button variant="primary" type="submit" onClick={() => {router.push("/generate")}}>
                            Submit
                        </Button>
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

            <MyVerticallyCenteredModal
                show={show}
            />
            <HomeGrid>
                <MakePayment setShow={setShow}/>
                <TerminalStatus/>
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
