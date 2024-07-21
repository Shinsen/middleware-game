import { useEffect, useRef, useState } from "react";
import "./Tetris.css";
import Confetti from 'react-confetti'

export const Tetris = (props) => {

    const {callback} = props;

    const [displayPlayfield, setDisplayPlayfield] = useState(true);
    const [pieceProgress, setPieceProgress] = useState(0)
    const [completed, setCompleted] = useState(false);

    const [buttonTick, setButtonTick] = useState();
    const [fallTick, setFallTick] = useState();
    const [flashTick, setFlashTick] = useState();

    const heldButton = useRef();
    const buttonInterval = useRef();
    const fallInterval = useRef();
    const flashInterval = useRef();

    useEffect(() => {
        window.addEventListener("keydown", keyDown);
        window.addEventListener("keyup", keyUp);

        fallInterval.current = setInterval(() => {
            setFallTick(Math.random());
        }, 1800);

        return () => {
            window.removeEventListener("keydown", keyDown);
            window.removeEventListener("keyup", keyUp);

            clearInterval(buttonInterval.current);
            clearInterval(fallInterval.current);
            clearInterval(flashInterval.current);
        }
    }, []);

    useEffect(() => {
        if (buttonTick !== undefined) {
            tickButton();
        }
    }, [buttonTick]);

    useEffect(() => {
        if (fallTick !== undefined) {
            tickFall();
        }
    }, [fallTick]);

    useEffect(() => {
        if (flashTick !== undefined) {
            tickFlash();
        }
    }, [flashTick]);

    function keyDown(event) {
        if (!completed) {
            heldButton.current = event.code;

            clearInterval(buttonInterval.current);
            buttonInterval.current = setInterval(() => {
                setButtonTick(Math.random());
            }, 16);
        }
    }

    function keyUp(event) {
        if (event.code === heldButton.current) {
            heldButton.current = null;
            clearInterval(buttonInterval.current);
        }
    }

    function tickButton() {
        if (!completed) {
            console.log("HELD BUTTON: ", heldButton.current);
            if (heldButton.current === "ArrowDown") {
                let newProgress = pieceProgress + 1;
                newProgress = Math.min(100, newProgress);
                setPieceProgress(newProgress);

                checkCompletion(newProgress);
            }
        }
    }

    function tickFall() {
        if (!completed && !heldButton.current) {
            let progress = pieceProgress + 10;
            progress = Math.min(100, progress);
            setPieceProgress(progress);

            checkCompletion(progress);
        }
    }

    function checkCompletion(newProgress) {
        if (newProgress >= 100) {
            setCompleted(true);

            if (callback) {
                callback(true);
            }

            setDisplayPlayfield(false);
            flashInterval.current = setInterval(() => {
                setFlashTick(Math.random());
            }, 600);
        }
    }

    function tickFlash() {
        if (completed) {
            setDisplayPlayfield(!displayPlayfield);
        }
    }

    // RENDER

    let playfield = [];
    let linePiece = [];

    if (displayPlayfield) {
        playfield = [
            <TetrisRow index={0} />,
            <TetrisRow index={1} />,
            <TetrisRow index={2} />,
            <TetrisRow index={3} />
        ];

        let pieceMarginTop = 270 * (pieceProgress / 100);

        linePiece = (
            <div className="linepiece" style={{marginTop : pieceMarginTop + "px"}}>
                <div className="block purple" />
                <div className="block purple" />
                <div className="block purple" />
                <div className="block purple" />
            </div>
        )
    }

    let confettiElem = [];
    if (completed) {
        confettiElem = (
            <Confetti width="640" height="480" />
        )
    }

    return (
        <div className="tetris-game">
            <div className="playfield">
                <div className="spacer" />

                {playfield}
                {linePiece}
            </div>

            <div className="sidepane">
                <div className="scorebox">
                    <div className="line">
                        Top
                    </div>
                    <div className="line">
                        01234567
                    </div>

                    <div className="line">
                        Score
                    </div>
                    <div className="line">
                        00001337
                    </div>
                </div>

                <div className="scorebox">
                    <div className="line">
                        Level
                    </div>
                    <div className="line">
                        4
                    </div>
                </div>
            </div>

            <div className="game-announce">
                Clear the blocks!
                <div className="announce-subtitle">Use arrow keys</div>
            </div>

            {confettiElem}
            
        </div>
    )

}

const TetrisRow = (props) => {

    const {index} = props;

    const colours = [
        ["red", "red", "blue", "yellow", "blank", "green", "green", "blue", "blue", "yellow"],
        ["red", "red", "blue", "blue", "blank", "green", "red", "red", "blue", "yellow"],
        ["yellow", "green", "green", "green", "blank", "green", "red", "red", "blue", "yellow"],
        ["yellow", "yellow", "yellow", "green", "blank", "yellow", "purple", "purple", "purple", "purple"],
    ]

    const blocks = colours[index].map((colour) => (
        <div className={"block " + colour}  />
    ))

    return (
        <div className="row">
            {blocks}
        </div>
    )
}