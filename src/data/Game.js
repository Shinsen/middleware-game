export const Game = {
    GIRDER : 1,
    CLOCK : 2,
    TETRIS : 3,
    MANAGER : 4,

    getTime : (gameId) => {
        switch (gameId) {
            case Game.GIRDER:
                return 6000;
            case Game.CLOCK:
                return 4000;
            case Game.TETRIS:
                return 5000;
            case Game.MANAGER:
                return 3000;
        }

        return 5000;
    }
}