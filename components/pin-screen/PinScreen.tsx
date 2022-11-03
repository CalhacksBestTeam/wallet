import React, {useEffect, useRef, useState} from "react";
import styles from "./PinScreen.module.css";

const pinPad = [[1, 2, 3], [4, 5, 6], [7, 8, 9], ["", 0, ""]];

const PinScreen = (props: { handleInput?: Function }) => {
    const [input, setInput] = useState("");

    const handleInput = (value: string) => {
        setInput(value);
    }

    return (
        <div>
            <div className={styles.pinDiv}>
                <input value={input} onInput={(value: any) => {
                    handleInput(value.target.value)
                }} className={`w-100 mb-2 text-center ${styles.input}`} autoFocus={true} onKeyDown={(key) => {
                    if (key.key === "Enter") {
                        if(props.handleInput) props.handleInput(input);
                    }
                }}/>
                {pinPad.map((row, rowIndex) => {
                        return <div className={`d-flex flex-row justify-content-between flex-fill mb-1 ${styles.pinRow}`} key={"row" + row}>
                            {row.map((pin, pinIndex) => {
                                if (pin === "") return <div className={`${styles.pinButton}`} style={{background: "none"}}/>
                                return <button className={`${styles.pinButton}`} key={"b" + pinIndex + rowIndex}
                                               onClick={() => {
                                                   pin !== "Enter" ? handleInput(input + pin) : handleInput("Enter")
                                               }}>{pin}</button>
                            })}
                        </div>
                    }
                )}
                <button className={"d-flex w-100 justify-content-center"} onClick={() => {
                    if (props.handleInput) props.handleInput(input)
                }}>Enter
                </button>
            </div>
        </div>
    );
};

export default PinScreen;
