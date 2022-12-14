import React, { useState, useEffect, ReactElement } from "react";
// @ts-ignore
import { Button } from "antd";
import Link from "next/link";
import { BankOutlined, LoadingOutlined } from "@ant-design/icons";
import { Card } from "../../styles/StyledComponents.styles";

const CreateAccount = (): ReactElement => {
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleGenerate = () => {
    setLoading(true);
  };

  return (
    <Card>
      <BankOutlined
        style={{ fontSize: "3rem", margin: "2rem 0", display: "block" }}
      />
      <h2>Make a payment </h2>
      <p>
        Send Sol to an address of your choice.
      </p>

      <div className={"buttons"}>
        {!loading && (
          <Link href={`/generate`} passHref>
            <Button type="primary" onClick={handleGenerate}>
              Connect NFC
            </Button>
          </Link>
        )}
        {loading && (
          <Button className={"disabledButton"} disabled>
            <LoadingOutlined spin />
          </Button>
        )}
      </div>
    </Card>
  );
};

export default CreateAccount;
