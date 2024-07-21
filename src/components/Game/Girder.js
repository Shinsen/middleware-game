import { useEffect, useRef, useState } from "react"
import girderGraphic from "../../assets/girder.svg";
import chainGraphic from "../../assets/chain.svg";
import skylineGraphic from "../../assets/city_skyline.svg";
import Confetti from 'react-confetti'
import "./Girder.css";

export const Girder = (props) => {

    const {callback} = props;

    const WIN_CONDITION_MIN = 41;
    const WIN_CONDITION_MAX = 45;

    const [progress, setProgress] = useState(10);
    const [keyTick, setKeyTick] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [completeTick, setCompleteTick] = useState(0);
    
    const heldKey = useRef(null);
    const keyInterval = useRef();
    const completionInterval = useRef()

    useEffect(() => {
        window.addEventListener("keydown", keyDown);
        window.addEventListener("keyup", keyUp);

        completionInterval.current = setInterval(() => {
            setCompleteTick(Math.random());
        }, 500);

        return () => {
            window.removeEventListener("keydown", keyDown);
            window.removeEventListener("keyup", keyUp);

            clearInterval(completionInterval.current);
            clearInterval(keyInterval.current);
        }
    }, []);

    useEffect(() => {
        tickKey();
    }, [keyTick]);

    useEffect(() => {
        checkIsComplete();
    }, [completeTick]);

    useEffect(() => {
        if (callback) {
            callback(completed);
        }
    }, [completed])

    function keyDown(event) {
        if (heldKey.current == null) {
            heldKey.current = event.code;

            keyInterval.current = setInterval(() => {
                setKeyTick(Math.random());
            }, 16);
        }
    }

    function keyUp(event) {
        if (heldKey.current == event.code) {
            heldKey.current = null;
            clearInterval(keyInterval.current);
        }
    }

    function tickKey() {
        if (!completed) {
            let currentProgress = progress;
            if (heldKey.current == "ArrowUp") {
                currentProgress -= 1;
            } else if (heldKey.current === "ArrowDown") {
                currentProgress += 1;
            }

            currentProgress = Math.max(0, currentProgress);
            currentProgress = Math.min(100, currentProgress);

            setProgress(currentProgress);
        }
    }

    function checkIsComplete() {
        if (!completed && heldKey.current === null) {
            if (progress >= WIN_CONDITION_MIN && progress <= WIN_CONDITION_MAX) {
                setCompleted(true);
            }
        }
    }

    // RENDER

    let girderMargin = (480 * (progress / 100)) - 720;

    let confettiElem = [];
    if (completed) {
        confettiElem = <Confetti width={640} height={480} />
    }

    return (
        <div className="girder-game" style={{backgroundImage : "url(" + skylineGraphic + ")"}}>
            <div className="decorative start">
                <div className="girder-main" style={{backgroundImage : "url(" + girderGraphic + ")"}}  />
            </div>

            <div className="decorative end">
                <div className="girder-main" style={{backgroundImage : "url(" + girderGraphic + ")"}}  />
            </div>

            <div className="girder-container" style={{marginTop : girderMargin + "px"}}>
                <div className="girder-chain" style={{backgroundImage : "url(" + chainGraphic + ")"}} />
                <div className="girder-main" style={{backgroundImage : "url(" + girderGraphic + ")"}}  />
            </div>

            <div className="girder-target" />

            <div className="game-announce">
                Align to the middle!
                <div className="announce-subtitle">Use arrow keys</div>
            </div>

            {confettiElem}
        </div>
    )

}