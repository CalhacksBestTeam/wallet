// Import any additional classes and/or functions needed from Solana's web3.js library as you go along:
import React, { ReactElement } from "react";
// @ts-ignore
import { message } from "antd";
import { useGlobalState } from "../context";
import { LAMPORTS_PER_SOL, Connection, clusterApiUrl, SystemProgram, PublicKey, Transaction, sendAndConfirmTransaction, Keypair } from "@solana/web3.js";
const converter = require("number-to-words");
import { LoadingOutlined } from "@ant-design/icons";
import { refreshBalance } from "../utils";
import {
  CheckContainer,
  CheckImage,
  CheckFrom,
  Processed,
  CheckDate,
  RecipientInput,
  AmountInput,
  SignatureInput,
  AmountText,
  RatioText,
} from "../styles/StyledComponents.styles";

type FormT = {
  from: string;
  to: string;
  amount: number;
  isSigned: boolean;
};

const defaultForm: FormT = {
  from: "",
  to: "",
  amount: 0,
  isSigned: false,
};

//const TransactionModal = (): ReactElement => {
export async function processTransfer(accountCreds:Keypair, receiver:String,  amount:number, globalStateIn: any ){
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { network, account, balance, setBalance } = globalStateIn;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  let form = defaultForm;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  let sending = false;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  let transactionSig = "";

    // *Step 5*: implement a function that transfer funds
    const transfer = async () => {
      // This line ensures the function returns before running if no account has been set
      if (!account) return;

      try {
        // (a) review the import guidance on line 1
        // (b) instantiate a connection using clusterApiUrl with the active network passed in as an argument
        // Documentation References:
        //   https://solana-labs.github.io/solana-web3.js/classes/Connection.html
        //   https://solana-labs.github.io/solana-web3.js/modules.html#clusterApiUrl
        //console.log("Sign and Send not yet implemented!");
        const connection = new Connection(clusterApiUrl(network), "confirmed");
        transactionSig = "";
        // (c) leverage the SystemProgram class to create transfer instructions that include your account's public key, the public key from your sender field in the form, and the amount from the form
        // Documentation Reference:
        //   https://solana-labs.github.io/solana-web3.js/classes/SystemProgram.html
        //   https://solana-labs.github.io/solana-web3.js/classes/SystemProgram.html#transfer
        const instructions = SystemProgram.transfer({
          fromPubkey: accountCreds.publicKey,
          toPubkey: new PublicKey(receiver),
          lamports: amount,
        });

        // (d) instantiate a transaction object and add the instructions
        // Documentation Reference:
        //   https://solana-labs.github.io/solana-web3.js/classes/Transaction.html
        //   https://solana-labs.github.io/solana-web3.js/classes/Transaction.html#add
        const transaction = new Transaction().add(instructions);

        // (e) use your account to create a signers interface
        // Documentation Reference:
        //   https://solana-labs.github.io/solana-web3.js/interfaces/Signer.html
        //   note: signers is an array with a single item - an object with two properties
        const signers = [{
          publicKey: accountCreds.publicKey,
          //Enter here into subroutine NFC polling
          secretKey: accountCreds.secretKey,
        }];

        sending = true;
        // (f) send the transaction and await its confirmation
        // Documentation Reference: https://solana-labs.github.io/solana-web3.js/modules.html#sendAndConfirmTransaction
        const confirmation = await sendAndConfirmTransaction(
          connection,
          transaction,
          signers
        );
        transactionSig = confirmation;
        sending = false;

        if (network) {
          const updatedBalance = await refreshBalance(network, account);
          setBalance(updatedBalance);
          message.success(`Transaction confirmed`);
        }
        // (g) You can now delete the console.log statement since the function is implemented!
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown Error";
        message.error(
          `Transaction failed, please check your inputs: ${errorMessage}`
        );
        sending = false;
      }
    };

    await transfer();
};