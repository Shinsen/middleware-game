import { useEffect, useRef, useState } from "react"
import clockfaceGraphic from "../../assets/clockface.svg";
import wallpaperGraphic from "../../assets/wallpaper.jpg";
import Confetti from 'react-confetti'
import "./Clock.css";

export const Clock = (props) => {

    const {callback} = props;

    const WIN_ANGLE_MAX = 358;
    const WIN_ANGLE_MIN = 2;

    const [angle, setAngle] = useState(180);
    const [buttonTick, setButtonTick] = useState();
    const [completeTick, setCompleteTick] = useState();
    const [completed, setCompleted] = useState(false);
    
    const heldButton = useRef(null);
    const buttonInterval = useRef();
    const completeInterval = useRef();
    
    useEffect(() => {
        window.addEventListener("keydown", keyDown);
        window.addEventListener("keyup", keyUp);

        completeInterval.current = setInterval(() => {
            console.log("Complete check...");
            setCompleteTick(Math.random());
        }, 500);

        return () => {
            window.removeEventListener("keydown", keyDown);
            window.removeEventListener("keyup", keyUp);

            clearInterval(completeInterval.current);
            clearInterval(buttonInterval.current);
        }
    }, []);

    useEffect(() => {
        buttonDidTick();
    }, [buttonTick]);

    useEffect(() => {
        checkCompletion();
    }, [completeTick]);

    useEffect(() => {
        if (callback) {
            callback(completed);
        }
    }, [completed]);

    function keyDown(event) {
        if (heldButton.current === null) {
            heldButton.current = event.code;

            buttonInterval.current = setInterval(() => {
                setButtonTick(Math.random());
            }, 16);
        }
    }

    function keyUp(event) {
        if (event.code == heldButton.current) {
            heldButton.current = null;
            clearInterval(buttonInterval.current);
        }
    }

    function buttonDidTick() {
        if (!completed) {
            let newAngle = angle;
            if (heldButton.current === "ArrowLeft" || heldButton.current === "ArrowDown") {
                newAngle -= 1
            } else if (heldButton.current === "ArrowRight" || heldButton.current === "ArrowUp") {
                newAngle += 1
            }

            if (newAngle < 0) {
                newAngle = 360 + newAngle
            } else if (newAngle > 360) {
                newAngle = Math.max(0, 360 - newAngle);
            }

            setAngle(newAngle);

            console.log(newAngle);
        }
    }

    function checkCompletion() {
        if (!completed && heldButton.current === null) {
            if (angle < WIN_ANGLE_MIN || angle > WIN_ANGLE_MAX) {
                setCompleted(true);
            }
        }
    }

    // RENDER

    let minuiteHandStyle = {
        transform : "rotate(" + angle + "deg)"
    };

    let confettiElem = [];
    if (completed) {
        confettiElem = <Confetti width={640} height={480} />
    }

    return (
        <div className="clock-game" style={{backgroundImage : "url(" + wallpaperGraphic + ")"}}>
            <div className="clockface" style={{backgroundImage : "url(" + clockfaceGraphic + ")"}}>
                <div className="clock-hand-container">
                    <div className="clock-hand" />
                </div>

                <div className="clock-hand-container" style={minuiteHandStyle}>
                    <div className="clock-hand small" />
                </div>

                <div className="clock-centre" />
            </div>

            <div className="game-announce">
                Set to midday!
                <div className="subtitle">Use arrow keys</div>
            </div>

            {confettiElem}
        </div>
    )

}