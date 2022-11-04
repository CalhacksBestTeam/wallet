import React, { useState, useEffect, ReactElement } from "react";
import { Button } from "antd";
import { LoadingOutlined, UnlockOutlined } from "@ant-design/icons";
import Link from "next/link";
import { Card } from "../../styles/StyledComponents.styles";
import styles from "../pin-screen/PinScreen.module.css";

const ScaleSwipeInput = (props: {value: string, setValue?: Function}) => {

    const updateValue = (value: any) => {
        if(props.setValue) props.setValue(value);
    }

    return (
        <input value={props.value} onInput={(value: any) => {
            updateValue(value.target.value)
        }} className={`w-100 mb-2 text-center`} autoFocus={true}/>
    );
};

export default ScaleSwipeInput;
