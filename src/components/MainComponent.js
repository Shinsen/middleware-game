import React, { useEffect, useRef, useState } from 'react';
import { GameMode } from '../data/GameMode';
import { GameContainer } from './Game/GameContainer';
import { TitleScreen } from './TitleScreen';
import { GameIntro } from './GameIntro';
import { Game } from '../data/Game';
import { GameOver } from './Game/GameOver';

import bg_static from "../assets/static.gif";
import { Clock } from './Game/Clock';
import { Tetris } from './Game/Tetris';

export const MainComponent = (props) => {

    const [mode, setMode] = useState(GameMode.TITLE);
    const [lives, setLives] = useState(3);
    const [gameCount, setGameCount] = useState(1);
    const [transitionShown, setTransitionShown] = useState(false);

    const [gameId, setGameId] = useState(null);
    const [gameTime, setGameTime] = useState(null);
    const [gameWasSuccess, setGameWasSuccess] = useState(false);
    const [lastGameResult, setLastGameResult] = useState(null);

    const gameIds = [
        Game.GIRDER, Game.CLOCK, 
        Game.TETRIS, Game.MANAGER
    ];
    
    const transitionTimer = useRef();

    useEffect(() => {
        return () => {
            clearTimeout(transitionTimer.current);
        }
    }, []);

    useEffect(() => {
        if (transitionShown) {
            transitionTimer.current = setTimeout(() => {
                setTransitionShown(false);
            }, 600);
        }
    }, [transitionShown]);

    useEffect(() => {
        setTransitionShown(true);

        if (mode === GameMode.TITLE) {
            // Make sure the game is reset when landing on title
            reset();
        } else if (mode === GameMode.GAME_INTRO) {
            // Tick game logic here
            setLastGameResult(gameWasSuccess);
            if (gameId !== null) {
                if (gameWasSuccess) {
                    setGameCount(gameCount + 1);
                } else {
                    const newLives = Math.max(0, lives - 1);
                    setLives(newLives);
                    if (newLives === 0) {
                        // The game is over
                        setMode(GameMode.GAME_OVER);
                    }
                }
            }

            // If we are in GAME INTRO, select the next game to play
            while (true) {
                const randomIndex = parseInt(Math.floor(Math.random() * gameIds.length));
                const randomGame = gameIds[randomIndex];
                if (randomGame !== gameId) {
                    setGameId(randomGame);
                    setGameTime(Game.getTime(randomGame));
                    setGameWasSuccess(false);
                    break;
                }
            }
        }
    }, [mode])

    function reset() {
        setLives(3);
        setGameCount(1);
        setGameId(null);
    }

    function titleScreenDidCallback() {
        setMode(GameMode.GAME_INTRO);
    }

    function gameIntroDidCallback() {
        setMode(GameMode.GAME_PLAY);
    }

    function gameDidCallback(action, data) {
        if (action === "success") {
            setGameWasSuccess(data);
        } else if (action === "end") {
            // Once done, move to Game Intro
            setMode(GameMode.GAME_INTRO);
        }
    }

    function gameOverDidCallback() {
        setMode(GameMode.TITLE);
    }

    // RENDER

    let mainContent = [];

    switch (mode) {
        case GameMode.TITLE:
            mainContent = (
                <TitleScreen callback={titleScreenDidCallback} />
            );
            break;
        case GameMode.GAME_INTRO:
            mainContent = (
                <GameIntro 
                    lives={lives}
                    gameNo={gameCount}
                    lastResult={lastGameResult}
                    callback={gameIntroDidCallback} />
            );
            break;
        case GameMode.GAME_PLAY:
            mainContent = (
                <GameContainer
                    gameId={gameId}
                    gameTime={gameTime}
                    callback={gameDidCallback} />
            );
            break;
        case GameMode.GAME_OVER:
            mainContent = (
                <GameOver 
                    score={gameCount}
                    callback={gameOverDidCallback} />
            );
            break;
    }

    let transitionElem = [];

    if (transitionShown) {
        transitionElem = (
            <div className='transition-overlay' style={{backgroundImage : "url(" + bg_static + ")"}} />
        )
    }

    return (
        <div className="wrapper">
            <div className="screen-container">
                {mainContent}
                {transitionElem}
            </div>
        </div>
    )

}