import { useEffect, useState } from "react";
import Confetti from 'react-confetti'
import "./Manager.css";

export const Manager = (props) => {

    const {approvalCount} = props;
    const {callback} = props;

    const approvalNames = [
        "Crescens Bodie", "Kavi Georgiev", "Murchadh De Santis",
        "Tahmina Stilo", "Ita Kollár", "Darshana Babak Kovac",
        "Somhairle Mulligan", "Dana Nicolescu", "Conchobhar Hubert",
        "Chasity Marga León", "Sara Kovacheva", "Lucasta Abdullayev",
        "Bisera Doris", "Annis Karina"
    ];

    const [approvalIds, setApprovalIds] = useState([]);
    const [approvals, setApprovals] = useState([]);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        let useApprovalCount = approvalCount;
        if (!useApprovalCount) {
            useApprovalCount = 2;
        }

        const approvalItems = [];
        const usedNameIndexes = [];
        for (let i = 0; i < useApprovalCount; i++) {
            let randomName = "";
            while (true) {
                let randomNameIndex = Math.floor(Math.random() * approvalNames.length);
                if (!usedNameIndexes.includes(randomNameIndex)) {
                    randomName = approvalNames[randomNameIndex];
                    usedNameIndexes.push(randomNameIndex);
                    break;
                }
            }

            approvalItems.push({
                id : i,
                name : randomName
            });
        }
        console.log(approvalItems);
        setApprovals(approvalItems);
    }, []);

    function approveItem(id) {
        if (!approvalIds.includes(id)) {
            const newApprovalIds = [...approvalIds];
            newApprovalIds.push(id);
            setApprovalIds(newApprovalIds);

            if (newApprovalIds.length >= approvals.length) {
                setCompleted(true);
                if (callback) {
                    callback(true);
                }
            }
        }
    }

    // RENDER

    let confettiElem = [];
    if (completed) {
        confettiElem = <Confetti width={640} height={480} />
    }

    return (
        <div className="manager-game">
            <div className="title">Middle Manager Simulator 2024</div>
            <div className="subtitle">Delegate your workload away!</div>

            {approvals.map((approval) => (
                <ManagerApprovalItem
                    name={approval.name}
                    active={!approvalIds.includes(approval.id)}
                    callback={() => {
                        approveItem(approval.id);
                    }} />
            ))}

            <div className="game-announce">
                Click the buttons!
                <div className="announce-subtitle">Use your mouse</div>
            </div>

            {confettiElem}
        </div>
    )

}

const ManagerApprovalItem = (props) => {

    const {name} = props;
    const {active} = props;
    const {callback} = props;

    let buttonExtraClass = "";
    if (!active) {
        buttonExtraClass = " disabled";
    }

    return (
        <div className="approve-item">
            <div className="approve-item-container">
                <div className="icon" />
                <div className="name">{name}</div>
                <button className={"button" + buttonExtraClass} onClick={callback}>
                    { active ? "Delegate" : "Delegated" }
                </button>
            </div>
        </div>
    );
}