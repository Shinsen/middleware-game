import { useEffect, useRef } from "react";
import heartGraphic from "../assets/heart.svg";
import "./GameIntro.css";

export const GameIntro = (props) => {

    const {gameNo} = props;
    const {lives} = props;
    const {callback} = props;

    const timer = useRef();

    useEffect(() => {
        timer.current = setTimeout(() => {
            if (callback) {
                callback();
            }
        }, 5000);

        return () => {
            clearTimeout(timer.current);
        }
    }, []);

    // RENDER

    // Work out how many lives to display
    const heartElems = [];
    for (let i = 0; i < lives; i++) {
        heartElems.push(
            <div className="heart" style={{backgroundImage : "url(" + heartGraphic + ")"}} />
        );
    }

    return (
        <div className="game-intro">
            <div className="spacer" />

            <div className="title">
                Game
            </div>

            <div className="number">
                {gameNo}
            </div>

            <div className="spacer" />

            <div className="title">
                Lives
            </div>

            <div className="heart-container">
                {heartElems}
            </div>

            <div className="spacer" />
        </div>
    )

}