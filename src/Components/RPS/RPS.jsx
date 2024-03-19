import React from "react";

import "./RPS.css"

const RPS = ({RPS, estimatedRPS}) => {
    return <div>
        <div className={"RPS"}>
            Current coins per second: <div className={"RPSValue"}>{RPS.toFixed(2)}</div>
            Estimated after upgrade:
            <div className={"RPSValue"}> {estimatedRPS.toFixed(2)} ({estimatedRPS > RPS ? "+" : ""}{(((estimatedRPS - RPS) / (RPS) * 100)).toFixed(0)}%)</div>
        </div>
    </div>
}


export default RPS;
