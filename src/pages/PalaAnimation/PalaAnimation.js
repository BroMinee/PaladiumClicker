import React, {useEffect, useRef, useState} from "react";
import fetchDataOnPublicURL from "../../FetchData";
import "./PalaAnimation.css";
import {question} from "plotly.js/src/fonts/ploticon";


const PalaAnimation = () => {
    return (
        <div className="App" style={{backgroundImage: `url(${process.env.PUBLIC_URL}/background.png)`, height: "calc(100vh - 91.4px)"}}>
            <header className="App-header">
                <div style={{flexDirection: "row", display: "flex"}}>
                    <h3 style={{marginBottom: "0px", zIndex: 1, position: "relative"}}>
                        Bienvenue dans la zone d'entraînement du&nbsp;
                    </h3>
                    <h3 style={{marginBottom: "0px", zIndex: 1, position: "relative"}}
                        className={"BroMine"}>
                        PalaAnimation
                    </h3>

                </div>
                <div style={{flexDirection: "row", display: "flex"}}>
                    <div>
                        Made by&nbsp;
                    </div>
                    <div className={"BroMine"}> BroMine__</div>
                </div>
            </header>
            <br/>
            <PalaAnimationBody/>
        </div>
    )
}


const PalaAnimationBody = () => {
    const [questionsList, setQuestionsList] = useState({});
    const [reroll, setReroll] = useState(false);


    function removeLastChar() {
        const user_response_length = document.getElementById("user-answer").childElementCount;
        if (user_response_length === 0) {
            return;
        }
        document.getElementById("user-answer").removeChild(document.getElementById("user-answer").lastChild);
    }

    function clearUserAnswer() {
        // remove all the child of the user-answer div
        document.getElementById("user-answer").innerHTML = "";
    }

    function checkAnswer(showTimer = true) {
        const answer = localStorage.getItem("answer");
        let user_answers = document.getElementById("user-answer").children;
        let correct = true;
        for (let i = 0; i < user_answers.length || i < answer.length; i++) {
            if (user_answers.length <= i) {
                if (answer[i] === " ") {
                    addNewChar(" ")
                } else {
                    addNewChar("_")
                }
                user_answers = document.getElementById("user-answer").children;
                user_answers[i].style.color = "red";
                correct = false;
            }
            if (i < user_answers.length && i < answer.length && user_answers[i].innerText.toLowerCase() === answer[i].toLowerCase()) {
                user_answers[i].style.color = "green";
            } else {
                user_answers[i].style.color = "red";
                correct = false;
            }
        }
        if (correct && user_answers.length === answer.length) {
            const date = new Date();
            const time = date - localStorage.getItem("startingTime");
            if (showTimer) {
                document.getElementById("timer").innerText = "Vous avez répondu en " + time / 1000 + " secondes !";

                setTimeout(() => {
                    setReroll(true);
                }, 2500);
            }
        } else {
            const newDestination = document.getElementById("old-response");
            const oldDestination = document.getElementById("user-answer");
            if (oldDestination.childElementCount > 0) {
                const newDiv = document.createElement("div");
                newDiv.classList.add("string-response");
                newDestination.insertBefore(newDiv, newDestination.firstChild);

                while (document.getElementById("user-answer").childElementCount > 0) {
                    newDiv.appendChild(document.getElementById("user-answer").firstChild);
                }
            }
        }
    }

    function addNewChar(c) {
        const newChild = document.createElement("span");
        newChild.innerText = c;
        document.getElementById("user-answer").appendChild(newChild);
    }

    function reveal() {
        const answer = localStorage.getItem("answer");
        clearUserAnswer();
        for (let i = 0; i < answer.length; i++) {
            addNewChar(answer[i]);
            // simulate a key press
        }
        checkAnswer(false);
    }

    function handleKeyDown(event) {

        if (event.key === "Enter") {
            checkAnswer();
            event.preventDefault();
        } else if (event.key === "Backspace") {
            removeLastChar();
        } else if (event.key === "Escape") {
            clearUserAnswer();
        } else if ((event.key.length === 1 && event.key.match(/[a-zA-Z0-9éèà]/) !== null) || event.key === " ") {
            addNewChar(event.key);
            if (event.key === " ") {
                event.preventDefault();
            }
        } else {
        }
    }

    function reRoll() {
        const [question, answer] = getRandomQuestion();
        localStorage.setItem("startingTime", new Date().getTime());
        localStorage.setItem("question", question);
        localStorage.setItem("answer", answer);
        document.getElementById("old-response").innerHTML = "";
        document.getElementById("user-answer").innerHTML = "";
        document.getElementById("timer").innerText = "";
    }

    useEffect(() => {
        if (reroll) {
            reRoll();
            setReroll(false);
        }
    }, [reroll]);


    useEffect(() => {
        const fetchQuestions = async () => {
            var questions_answers = {}
            await fetchDataOnPublicURL("/Animation/questions.json").then((data) => {
                // iterator over the key of data
                Object.keys(data).forEach((key) => {
                    // add the key to the questions_answers object
                    questions_answers[key] = data[key]
                })
            })

            setQuestionsList(questions_answers)
        }

        if (Object.keys(questionsList).length === 0) {
            fetchQuestions();
        }

        document.addEventListener('keydown', handleKeyDown);
        setReroll(true);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        }


    }, []);

    const getRandomQuestion = () => {
        document.getElementById("user-answer").innerHTML = "";
        const keys = Object.keys(questionsList);
        const question = keys[keys.length * Math.random() << 0];
        const answer = questionsList[question];
        return [question, answer];
    }


    useEffect(() => {
        setReroll(true);
    }, [questionsList]);

    const question = localStorage.getItem("question");
    const answer = localStorage.getItem("answer");

    return (
        <div className={"App-header"}>
            {/*<h2>Il se prépare quelque choses ici 🤫</h2>*/}
            {/*<h4 style={{marginTop: "0px"}}>Working progress</h4>*/}
            <h2 style={{letterSpacing: "2px"}}>{question}</h2>
            <div id={"user-answer"} contentEditable={false}></div>
            <div id={"timer"}></div>
            <div id={"old-response"} contentEditable={false}>
            </div>
            <div className={"bottom-button"}>
                <button onClick={reveal}>Révéler la solution</button>
                <button id={"reroll"} onClick={() => setReroll(true)}>Nouvelle question</button>
            </div>
        </div>
    );
}


export default PalaAnimation;