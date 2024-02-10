import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import style from "../../public/css/typing.module.css";

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {  } from "@fortawesome/free-brands-svg-icons";

function Typing(props) {
    const { onButtonClick } = props;
    const { timerm } = props;
    const { slength } = props;
    console.log(` timerm: ${slength}`);

    const [timer, setTimer] = useState(timerm);
    const [timerStarted, setTimerStarted] = useState(false);
    const [correct, setCorrect] = useState(0);
    const [mistake, setMistake] = useState(0);
    const [WPM, setWPM] = useState(0.0);
    const [CPM, setCPM] = useState(0.0);
    const [paragraph, setPara] = useState("");

    const navigate = useNavigate();

    function getParaprah() {
        fetch("/../public/data/para.json")
            .then((response) => response.json())
            .then((data) => {
                console.log(data); // This will log the fetched data to the console
                if (slength === "s") {
                    setPara(data.s[0]);
                } else if (slength === "m") {
                    setPara(data.m[0]);
                } else if (slength === "l") {
                    setPara(data.l[0]);
                }
            });
    }

    useEffect(() => {
        getParaprah();
    }, [slength]); 


    setParagraph(paragraph);

    function setParagraph(txt) {
        var content = $(".text-content");
        content.empty();
        txt.split("").forEach((char) => {
            let span = $(`<span>${char}</span>`);
            // console.log(str)

            content.append(span);
        });
        return;
    }

    function focusOnInput(e) {
        const content = $(".text-content").find("span");
        const input = $(".text-input");
        input.focus();
    }

    function handleKeyDown(e) {
        const content = $(".text-content").find("span");
        const input = $(".text-input");
        input.focus();
        var inputValue = input.val();
        var inputLength = inputValue.length;
        var inputIndex = inputLength - 1 || 0;
        console.log("split", e);

        if (e.nativeEvent.inputType === "deleteContentBackward") {
            // Backspace key was pressed
            console.log("Backspace key pressed", content[inputLength]);
            $(content[inputLength]).removeClass(style.incorrect).removeClass(style.correct);
        }

        console.log($(content[inputIndex]).html(), inputValue.split("")[inputValue.length - 1]);

        if ($(content[inputIndex]).html() === inputValue.split("")[inputValue.length - 1]) {
            console.log("correct");
            $(content[inputIndex]).addClass(style.correct);
        } else {
            console.log("incorrect");
            $(content[inputIndex]).addClass(style.incorrect);
        }

        console.log("key down");

        return;
    }

    const timerRef = useRef(timer);

    useEffect(() => {
        setTimer(timerm);
    }, [timerm]);

    useEffect(() => {
        timerRef.current = timer;
        if (timer === 0 && onButtonClick === 1) {
            setTimerStarted(false);
            navigate("/result");
        }
    }, [timer]);

    const decrementTimer = () => {
        setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    };

    const startTimer = () => {
        if (!timerStarted) {
            setTimerStarted(true);
            const countdown = setInterval(() => {
                decrementTimer();
                if (timerRef.current === 0) {
                    clearInterval(countdown);
                }
            }, 1000);
        }
    };

    useEffect(() => {
        getParaprah();
        window.addEventListener("keydown", focusOnInput);
        window.addEventListener("keydown", startTimer);
        // getLocations();
        // getPlaces();
        // getAccomodations();
        // getTransportations();
    }, []);
    return (
        <>
            <article>
                <div className={style.container}>
                    <div className={`${style.body} ${onButtonClick === 1 ? style.show : style.none}`}>
                        <p className={style.time} onChange={startTimer}>
                            {timer}
                        </p>
                        <div>
                            <input type='text' className='text-input' onChange={handleKeyDown} style={{ opacity: 0 }} />
                            <p className={`${style.typing} text-content`}></p>
                        </div>
                    </div>

                    <div className={`${style.body} ${onButtonClick === 2 ? style.show : style.none}`}>
                        <div>
                            <input type='text' className='text-input' onChange={handleKeyDown} style={{ opacity: 0 }} />
                            <p className={`${style.typing} text-content`}></p>
                        </div>
                    </div>

                    <div className={`${style.body} ${onButtonClick === 3 ? style.show : style.none}`}>
                        <div className={style.zen}>
                            <textarea className={`${style.typing}`} />
                        </div>
                    </div>
                </div>
            </article>
        </>
    );
}

export default Typing;
