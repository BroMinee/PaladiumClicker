import React from "react";

import "./RPS.css"

const RPS = ({RPS, estimatedRPS}) => {
    return <div className={"RPS"}>
        Current coins per second: <div className={"RPSValue"}>{RPS}</div>
        Estimated after upgrade:
        <div className={"RPSValue"}> {estimatedRPS} (+{RPS/(estimatedRPS-RPS) * 100}%)</div>
    </div>
}



export default RPS;
