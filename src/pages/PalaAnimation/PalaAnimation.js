import React, {useEffect, useRef, useState} from "react";
import fetchDataOnPublicURL from "../../FetchData";
import "./PalaAnimation.css";
import {question} from "plotly.js/src/fonts/ploticon";


const PalaAnimation = () => {
    // const [questionsList, setQuestionsList] = useState({});
    const myRef = useRef(null);
    // const [userReponse, setUserReponse] = useState([]);
    //
    //
    // function removeLastChar() {
    //     if (userReponse.length === 0) {
    //         return;
    //     }
    //     userReponse.pop();
    //     setUserReponse([...userReponse]);
    // }
    //
    // function clearUserAnswer() {
    //     userReponse.splice(0, userReponse.length);
    //     setUserReponse([...userReponse]);
    // }
    //
    // function handleKeyDown(event)
    // {
    //     function addNewChar(c) {
    //         const answer = localStorage.getItem("answer");
    //         let expectedChar = "";
    //         if (userReponse.length < answer.length) {
    //             expectedChar = answer[userReponse.length];
    //         } else {
    //             expectedChar = "_";
    //         }
    //
    //         console.log(answer, userReponse.length, expectedChar)
    //         if (c.toLowerCase() === expectedChar.toLowerCase()) {
    //             userReponse.push([c, "green"]);
    //         } else {
    //             userReponse.push([c, "red"]);
    //         }
    //         setUserReponse([...userReponse]);
    //     }
    //
    //     if (event.key === "Enter") {
    //
    //     } else if (event.key === "Backspace") {
    //         removeLastChar();
    //     } else if (event.key === "Escape") {
    //         clearUserAnswer();
    //     } else if ((event.key.length === 1 && event.key.match(/[a-zA-Z0-9]/) !== null) || event.key === " ") {
    //         addNewChar(event.key);
    //         if (event.key === " ") {
    //             event.preventDefault();
    //         }
    //     } else {
    //     }
    // }
    //
    // function reRoll() {
    //     clearUserAnswer();
    //     const [question, answer] = getRandomQuestion();
    //     localStorage.setItem("question", question);
    //     localStorage.setItem("answer", answer);
    // }
    //
    //
    // useEffect(() => {
    //     const fetchQuestions = async () => {
    //         var questions_answers = {}
    //         await fetchDataOnPublicURL("/Animation/dict_TOTO.json").then((data) => {
    //             // iterator over the key of data
    //             Object.keys(data).forEach((key) => {
    //                 // add the key to the questions_answers object
    //                 questions_answers[key] = data[key]
    //             })
    //         })
    //
    //         console.log(questions_answers)
    //         setQuestionsList(questions_answers)
    //     }
    //
    //     if (Object.keys(questionsList).length === 0) {
    //         fetchQuestions();
    //     }
    //
    //     document.addEventListener('keydown',handleKeyDown);
    //
    //     return () => {
    //         document.removeEventListener('keydown',handleKeyDown);
    //     }
    //
    //
    // }, []);
    //
    // const getRandomQuestion = () => {
    //     document.getElementById("user-answer").innerHTML = "";
    //     const keys = Object.keys(questionsList);
    //     const question = keys[keys.length * Math.random() << 0];
    //     const answer = questionsList[question];
    //     return [question, answer];
    // }
    //
    //
    // useEffect(() => {
    //     reRoll();
    //
    // }, [questionsList]);
    //
    // const question = localStorage.getItem("question");
    // const answer = localStorage.getItem("answer");
    return (
        <div ref={myRef} className={"App-header"} style={{
            backgroundImage: `url(${process.env.PUBLIC_URL}/background.png`,
            height: "calc(100vh - 91.4px)",
            justifyContent: ""
        }}>
            <h2>Il se prépare quelque choses ici 🤫</h2>
            <h4 style={{marginTop: "0px"}}>Working progress</h4>
            {/*<h2>{question}</h2>*/}
            {/*<h2>{answer}</h2>*/}
            {/*<div id={"user-answer"} contentEditable={false}>*/}
            {/*    {userReponse.map((c, index) => {*/}
            {/*        return <span key={index} style={{color: c[1]}}>{c[0]}</span>*/}
            {/*    })}*/}
            {/*</div>*/}
            {/*<div>*/}
            {/*    <button>Reveal*/}
            {/*    </button>*/}
            {/*    <button id={"reroll"} onClick={reRoll}>Reroll*/}
            {/*    </button>*/}
            {/*</div>*/}
        </div>
    );
}

export default PalaAnimation;