// @ts-nocheck - A RETIRER APRES AVOIR CORRIGE LE FICHIER


import GradientText from "@/components/shared/GradientText";
import Layout from "@/components/shared/Layout";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {useEffect, useState} from "react";
import {FaHeart, FaSearch} from "react-icons/fa";
import fetchLocal from "@/lib/api.ts";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {cn} from "@/lib/utils.ts";


const PalaAnimationBody = () => {
  const [questionsList, setQuestionsList] = useState({});
  const [reroll, setReroll] = useState(false);


  function removeLastChar() {
    const user_response_length = document.getElementById("user-answer")?.childElementCount;
    if (user_response_length === 0) {
      return;
    }
    const lastChild = document.getElementById("user-answer")?.lastChild;
    if (lastChild) {
      document.getElementById("user-answer")?.removeChild(lastChild);
    }
  }

  function clearUserAnswer() {
    // remove all the child of the user-answer div
    const user_answer = document.getElementById("user-answer");
    if (user_answer) {
      user_answer.innerHTML = "";
    }
  }

  function checkAnswer(showTimer = true) {
    const answer = localStorage.getItem("answer");
    let user_answers = document.getElementById("user-answer")?.children;
    let correct = true;
    for (let i = 0; user_answers !== undefined && answer != undefined && (i < user_answers.length || i < answer.length); i++) {
      if (user_answers.length <= i) {
        if (answer[i] === " ") {
          addNewChar(" ")
        } else {
          addNewChar("_")
        }
        user_answers = document.getElementById("user-answer")?.children;
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
      let questions_answers = {}
      const translateBuildingName = await fetchLocal<Record<string, string>>("/Animation/questions.json");

      Object.keys(translateBuildingName).forEach((key) => {
        // add the key to the questions_answers object
        questions_answers[key] = translateBuildingName[key]
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

  return (
      <div className="flex flex-col gap-2 items-center">
        <p className="pb-4">{question}</p>
        <div id={"user-answer"} contentEditable={false}></div>
        <div id={"timer"}></div>
        <div id={"old-response"} contentEditable={false}>
        </div>
        <div className="flex gap-2 center">
          <Button onClick={reveal} variant="outline">Révéler la solution</Button>
          <Button id={"reroll"} onClick={() => setReroll(true)}>Nouvelle question</Button>
        </div>
      </div>
  );
}

const PalaAnimationPage = () => {
  return (
      <>
        <Layout>
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                  Bienvenue dans la zone d'entraînement du{" "}
                  <GradientText className="font-extrabold">PalaAnimation</GradientText>
                </CardTitle>
                <CardDescription>
                  Made with <FaHeart className="text-primary inline-block"/> by <GradientText>BroMine__</GradientText>
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <PalaAnimationBody/>
              </CardHeader>
            </Card>

          </div>
        </Layout>
      </>);
  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <div style={{ flexDirection: "row", display: "flex" }}>
  //         <h3 style={{ marginBottom: "0px", zIndex: 1, position: "relative" }}>
  //           Bienvenue dans la zone d'entraînement du&nbsp;
  //         </h3>
  //         <h3 style={{ marginBottom: "0px", zIndex: 1, position: "relative" }}
  //           className={"BroMine"}>
  //           PalaAnimation
  //         </h3>
  //
  //       </div>
  //       <div style={{ flexDirection: "row", display: "flex" }}>
  //         <div>
  //           Made by&nbsp;
  //         </div>
  //         <div className={"BroMine"}> BroMine__</div>
  //       </div>
  //     </header>
  //     <br />
  //
  //   </div>
  // );
}

export default PalaAnimationPage;