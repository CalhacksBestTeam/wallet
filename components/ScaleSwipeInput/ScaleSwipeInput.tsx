import React from "react";
import styles from "./ScaleSwipeInput.module.css";

const ScaleSwipeInput = (props: { value: string, setValue?: Function, onSubmit?: Function, autoFocus?: boolean, isHidden?: boolean }) => {

    const updateValue = (value: any) => {
        if (props.setValue) props.setValue(value);
    }

    return (
        <input value={props.value} onInput={(value: any) => {
            updateValue(value.target.value)
        }} className={`w-100 mb-2 text-center ${styles.inputField}`} autoFocus={props.autoFocus} onKeyDown={(key) => {
            if (key.key === "Enter") {
                if (props.onSubmit) props.onSubmit();
            }
        }} type={props.isHidden ? "password" : undefined} />
    );
};

export default ScaleSwipeInput;
