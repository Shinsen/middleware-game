import "./TitleScreen.css";

export const TitleScreen = (props) => {

    const {callback} = props;

    function startPressed() {
        if (callback) {
            callback();
        }
    }

    return (
        <div className="title-screen">
            <div className="spacer" />

            <div className="title">MiddleWare</div>
            <div className="button-container">
                <button className="button" onClick={startPressed}>
                    Start
                </button>
            </div>

            <div className="spacer" />

            <div className="copyright">
                &copy; 2024 - 50Hz
            </div>
        </div>
    )

}