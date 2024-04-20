import ReactAudioPlayer from "react-audio-player";
import React from 'react';

export const Completionist = () =>
    <ReactAudioPlayer id={"audio-countdown"}
        src={process.env.PUBLIC_URL + "/BroMine_is_back.mp3"}
        controls
        volume={0.15}
    />

function print2digits(time) {
    if (time < 10) {
        return "0" + time;
    }
    return time;
}

// Renderer callback with condition
export const renderer = ({hours, minutes, seconds, completed}) => {
    if (completed) {
        // Render a completed state
        return <Completionist/>;
    } else {
        // Render a countdown
        return <span>{print2digits(hours)}:{print2digits(minutes)}:{print2digits(seconds)}</span>
    }
};
