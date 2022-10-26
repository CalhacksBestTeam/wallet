import { Badge, Dropdown, Menu, Divider } from "antd";
import React, { BaseSyntheticEvent, ReactElement } from "react";
import {
  DownOutlined,
  UserOutlined,
  ArrowLeftOutlined,
  LogoutOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import styles from "./index.module.css";
import { useGlobalState } from "../../context";
import { useRouter } from "next/router";
import { Cluster } from "@solana/web3.js";
import {useSelector} from "react-redux";

type DomEvent = {
  domEvent: BaseSyntheticEvent;
  key: string;
  keyPath: Array<string>;
};

const Layout = ({ children }: { children: JSX.Element }): ReactElement => {
  const { network, setNetwork, account, setAccount, setBalance, setMnemonic } =
    useGlobalState();
  const isScannerConnected = useSelector((state : any) => state.connected.isConnected)


  const router = useRouter();

  const selectNetwork = (e: DomEvent) => {
    const networks: Array<Cluster> = ["mainnet-beta", "devnet", "testnet"];
    const selectedNetwork = networks[parseInt(e.key) - 1];
    setNetwork(selectedNetwork);
  };

  const menu = (
    <div className="d-flex flex-row justify-content-center">
      <p className={isScannerConnected ? "text-success" : "text-danger"}>{isScannerConnected ? "Scanner Connected" : "Scanner Disconnected"}</p>
    </div>
  );

  const handleLogout = () => {
    setAccount(null);
    setNetwork("devnet");
    setBalance(0);
    setMnemonic("");
    router.push("/");
  };

  const profile = (
    <Menu>
      <Menu.Item key="/wallet" icon={<CreditCardOutlined />}>
        <Link href="/wallet" passHref>
          Wallet
        </Link>
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <header className={styles.header}>
          <Link href={`/`} passHref>
            <div className={`${styles.top} ${styles.logo}`}>{process.env.NEXT_PUBLIC_BRAND_NAME}</div>
          </Link>
          <div className="d-flex flex-row justify-content-center align-items-center">
            <p className="mb-0">{isScannerConnected ? "Scanner Connected" : "Scanner Disconnected"}</p>
            <div className={`${styles.dot} ${!isScannerConnected ? styles.red : styles.green}`} />
          </div>
        </header>

        {children}

        {router.pathname !== "/" && (
          <Link href="/" passHref>
            <a className={styles.back}>
              <ArrowLeftOutlined /> Back Home
            </a>
          </Link>
        )}

        <Divider style={{ marginTop: "3rem" }} />

      </main>
    </div>
  );
};

export default Layout;
