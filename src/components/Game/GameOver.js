import { useEffect, useRef } from "react";
import "./GameOver.css";

export const GameOver = (props) => {

    const {score} = props;
    const {callback} = props;

    const timer = useRef();

    useEffect(() => {
        timer.current = setTimeout(() => {
            if (callback) {
                callback();
            }
        }, 8000);

        return () => {
            clearTimeout(timer.current);
        }
    }, []);

    return (
        <div className="game-over">
            <div className="spacer" />

            <div className="title">
                GAME OVER
            </div>

            <div className="title">
                SCORE: {score}
            </div>

            <div className="spacer" />
        </div>
    )

}