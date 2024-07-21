import { useEffect, useRef, useState } from "react";
import { Game } from "../../data/Game";
import { Girder } from "./Girder";
import { Clock } from "./Clock";
import { Tetris } from "./Tetris"
import { Manager } from "./Manager";

import bombGraphic from "../../assets/bomb.svg";
import fuseGrahic from "../../assets/bomb-fuse.svg";
import fireGraphic from "../../assets/bomb-fuse-fire.svg";

import "./GameContainer.css";

export const GameContainer = (props) => {

    const {gameId} = props;
    const {gameTime} = props;
    const {callback} = props;

    const [timerTicking, setTimerTicking] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(gameTime);
    const [timerTick, setTimerTick] = useState(0);
    const [completedSuccessfully, setCompletedSuccessfully] = useState(false);

    const timerInterval = useRef();
    const delayTimer = useRef();

    useEffect(() => {
        delayTimer.current = setTimeout(() => {
            setTimerTicking(true);
        }, 2000);

        timerInterval.current = setInterval(() => {
            setTimerTick(Math.random());
        }, 250);

        return () => {
            clearInterval(timerInterval.current);
            clearTimeout(delayTimer.current);
        }
    }, []);

    useEffect(() => {
        if (timerTicking && timeRemaining > 0) {
            let timeR = Math.max(0, timeRemaining - 250);
            setTimeRemaining(timeR);

            if (timeR === 0) {
                delayTimer.current = setTimeout(() => {
                    console.log("Call end callback");
                    if (callback) {
                        callback("end");
                    }
                }, 2000);
            }
        }
    }, [timerTick]);

    useEffect(() => {
        if (callback) {
            callback("success", completedSuccessfully);
        }
    }, [completedSuccessfully]);

    function gameDidCallback(success) {
        setCompletedSuccessfully(success);
    }

    // RENDER
    
    let fuseWidth = parseInt((timeRemaining / gameTime) * 100);
    
    let gameElem = [];
    switch (gameId) {
        case Game.GIRDER : gameElem = <Girder callback={gameDidCallback} />; break;
        case Game.CLOCK : gameElem = <Clock callback={gameDidCallback} />; break;
        case Game.TETRIS : gameElem = <Tetris callback={gameDidCallback} />; break;
        case Game.MANAGER : gameElem = <Manager callback={gameDidCallback} />; break;
        default : console.log("Unknown ID: ", gameId);
    }

    return (
        <div className="game-container">
            <div className="game-container">
                {gameElem}
            </div>

            <div className="timer-container">
                <div className="timer-bomb" style={{backgroundImage : "url(" + bombGraphic + ")"}} />

                <div className="timer-fuse-container">
                    <div className="timer-fuse" style={{width : fuseWidth + "%", backgroundImage : "url(" + fuseGrahic + ")"}}>
                        <div className="fire" style={{backgroundImage : "url(" + fireGraphic + ")"}} />
                    </div>
                </div>
            </div>
        </div>
    )

}