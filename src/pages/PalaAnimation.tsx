// @ts-nocheck - A RETIRER APRES AVOIR CORRIGE LE FICHIER
import GradientText from "@/components/shared/GradientText";
import Layout from "@/components/shared/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FormEvent, useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import {
  getGlobalLeaderboard,
  getLeaderboardPalaAnimation,
  getUsernameScorePalaAnimation,
  pushNewTimePalaAnimation
} from "@/lib/apiPalaTracker.ts";

import { Button } from "@/components/ui/button.tsx";
import { usePlayerInfoStore } from "@/stores/use-player-info-store.ts";
import ImportProfil from "@/pages/OptimizerClicker/Components/ImportProfil.tsx";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Input } from "@/components/ui/input.tsx";
import { cn } from "@/lib/utils.ts";
import { PalaAnimationLeaderboard, PalaAnimationScore } from "@/types";
import fetchLocal from "@/lib/apiPala.ts";
import { adaptPlurial } from "@/lib/misc.ts";


type userAnswerType =
  {
    c: string,
    color: string
  }

type questionListType = {
  question: string,
  answer: string
}

type PalaAnimationBodyType = {
  questionsList: questionListType[],
  setQuestionsList: (questionsList: questionListType[]) => void
}

const PalaAnimationBody = ({ questionsList, setQuestionsList }: PalaAnimationBodyType) => {
  const { data: playerInfo } = usePlayerInfoStore();


  const [reroll, setReroll] = useState(false);
  const [oldAnswer, setOldAnswer] = useState([] as userAnswerType[][])
  const [timer, setTimer] = useState(0);
  const [inputValue, setInputValue] = useState("");


  async function pushTime(time: number, username: string, question: string) {
    // pushNewTimePalaAnimation(time, username, question).then(
    //   () => {
    //     toast.success("Temps enregistré avec succès");
    //   }).catch(
    //   (error) => {
    //     const message = error instanceof AxiosError ?
    //       error.response?.data.message ?? error.message :
    //       typeof error === "string" ?
    //         error :
    //         "Une erreur est survenue dans l'enregistrement du temps";
    //     toast.error(message);
    //   }
    // );
  }

  function clearUserAnswer() {
    // reset input field with id user_answer
    setInputValue("");
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    checkAnswer(String(formData.get("user_answer")));
    return true;
  }


  function checkAnswer(userAnswer = "", showTimer = true) {
    if (!playerInfo) {
      console.error("No player info");
      return;
    }

    if (questionsList.length === 0) {
      console.error("Question List is empty");
      return;
    }

    const answer = questionsList[0].answer;
    let correct = true;

    const newEntryOldAnswer = [] as userAnswerType[];

    for (let i = 0; (i < userAnswer.length || i < answer.length); i++) {
      if (i < userAnswer.length && i < answer.length) {
        if (userAnswer[i].toLowerCase() === answer[i].toLowerCase()) {
          newEntryOldAnswer.push({ c: userAnswer[i], color: "text-green-700" });
        } else {
          newEntryOldAnswer.push({ c: userAnswer[i], color: "text-red-700" });
          correct = false;
        }
      } else if (i < userAnswer.length) {
        if (userAnswer[i] === ' ') {
          newEntryOldAnswer.push({ c: '_', color: "text-red-700" });
        } else {
          newEntryOldAnswer.push({ c: userAnswer[i], color: "text-red-700" });
        }

        correct = false;
      } else if (answer[i] === " ") {
        newEntryOldAnswer.push({ c: " ", color: "text-green-700" });
      } else {
        newEntryOldAnswer.push({ c: "_", color: "text-red-700" });
        correct = false;
      }
    }

    if (correct && userAnswer.length === answer.length) {
      const date = new Date();
      const time = date.getTime() - parseInt(localStorage.getItem("startingTime") || "0");

      if (showTimer) {
        pushTime(time, playerInfo.username, questionsList[0].question);
        setTimer(time / 1000);
        console.log("Time: " + time / 1000)
      }
      setOldAnswer([newEntryOldAnswer, ...oldAnswer]);

      setTimeout(() => {
        setReroll(true);
        setOldAnswer([]);
      }, 1500);


    } else {
      setOldAnswer([newEntryOldAnswer, ...oldAnswer]);
    }
    clearUserAnswer();
  }


  function reveal() {
    document.getElementById("user_answer")?.focus();

    clearUserAnswer();
    checkAnswer(questionsList[0].answer, false);
  }

  useEffect(() => {
    if (reroll) {
      // remove first element of questionList
      questionsList.shift()!;
      setQuestionsList([...questionsList]);
      setTimer(0);
      setReroll(false);
    }
  }, [reroll]);

  useEffect(() => {
    function setTimer() {
      if (Object.keys(questionsList).length === 0) {
        fetchAllQuestions();
      }
      localStorage.setItem("startingTime", new Date().getTime().toString());
    }

    setTimer();
  }, [questionsList]);


  const fetchAllQuestions = () => {
    fetchLocal<Record<string, string>>("/Animation/questions.json").then(
      (data) => {
        //random sort data
        setQuestionsList(
          Object.entries(data).map(([question, answer]) => {
            return { question, answer };
          }).sort(() => Math.random() - 0.5)
        );
      }
    ).catch(
      (error) => {
        console.error("Error while fetching questions list", error);
      }
    );
  }

  useEffect(() => {
    fetchAllQuestions();

    setReroll(true);
  }, []);


  if (!playerInfo)
    return null;

  return (
    <div className="flex flex-col gap-2 items-center">
      <p className="pb-4">{questionsList.length === 0 ? "Chargement de la question..." : questionsList[0].question}</p>
      <form onSubmit={onSubmit}>
        <div className="relative">
          <Input
            type="text"
            id="user_answer"
            name="user_answer"
            className={cn("bg-background", "border-destructive")}
            placeholder={"Entre ta réponse"}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onPaste={e => e.preventDefault()}
          />
        </div>
      </form>
      {timer === 0 ? "" : <div>Vous avez répondu en {timer} {adaptPlurial("seconde", timer)} !</div>}
      <div contentEditable={false} className="max-h-64 overflow-auto">
        {
          oldAnswer.map((old, i1) => {
            return (<div key={i1}>
              {old.map((e, i2) => {
                return <span key={i2} className={e.color}>{e.c}</span>
              })}
            </div>)
          })
        }
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        <Button onClick={reveal} variant="outline">Révéler la solution</Button>
        <Button onClick={() => {
          document.getElementById("user_answer")?.focus();
          setReroll(true)
        }}>Nouvelle question</Button>
      </div>
    </div>
  );
}


const PalaAnimationPage = () => {

  const { data: playerInfo } = usePlayerInfoStore();
  const [questionsList, setQuestionsList] = useState([] as questionListType[]);

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
                Made with <FaHeart
                className="text-primary inline-block"/> by <GradientText>BroMine__</GradientText>
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex flex-col gap-2 items-start">
              <CardDescription>Entre ton pseudo pour que celui-ci soit affiché dans le
                classement</CardDescription>
              <ImportProfil showResetButton/>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-red-500">Message</CardTitle>
            </CardHeader>
            <CardContent>
              Malheureusement quand il y a un classement il y a de la triche, j'aurais du m'en douter avant ...<br/>
              Etant donné qu'il y a eu de la triche les leaderboards vont être réinitialisés et un anti-cheat est en train
              d'être développé, il devrait voir le jour d'ici la fin du mois.<br/>
              Je suis désolé si cela impacte votre expérience, mais je préfère que tout le monde soit sur un pied
              d'égalité.<br/>
              De plus, le logiciel de triche a été mis à disposition à tous, il est presque impossible dans
              l'état actuelle de détecter correctement les records trichés.
            </CardContent>
          </Card>

          {!playerInfo ? "" :
            <div className="">
              {/*grid grid-cols-2 md:grid-cols-3 grid-rows-1 gap-4*/}
              <Card className="col-span-2">
                <CardHeader>
                  <PalaAnimationBody questionsList={questionsList}
                                     setQuestionsList={setQuestionsList}/>
                </CardHeader>
              </Card>
          {/*    <PalaAnimationClassement questionsList={questionsList}/>*/}
            </div>}
          {/*<PalaAnimationClassementGlobal/>*/}
        </div>
      </Layout>
    </>
  );
}

type PalaAnimationClassementType = {
  questionsList: questionListType[]
}

const PalaAnimationClassementGlobal = () => {
  const { data: playerInfo } = usePlayerInfoStore();
  const [globalLeaderboard, setGlobalLeaderboard] = useState({ data: [], length: -1 } as PalaAnimationLeaderboard)

  async function updateLeaderboardGlobalUI() {
    getGlobalLeaderboard().then(
      (data) => {
        console.log(data);
        setGlobalLeaderboard(data);
      }
    ).catch(
      (error) => {
        console.error("Error while fetching global leaderboard", error);
      }
    );
  }

  useEffect(() => {
    updateLeaderboardGlobalUI();
  }, []);

  const userPosition = globalLeaderboard.data.findIndex((entry) => entry.username === playerInfo?.username);

  if (!playerInfo)
    return null;

  return (
    <Card>
      <CardHeader className="flex">
        <CardTitle>Classement Général</CardTitle>
        <CardDescription>Vous devez faire un minimum de 20 réponses différentes pour apparaître dans le
          classement.<br/> Recharge la page pour actualiser le classement</CardDescription>
      </CardHeader>
      <CardContent className="flex gap-2 flex-col">
        {globalLeaderboard.length === -1 ? "Chargement du classement..." : ""}
        {globalLeaderboard.length === 0 ? "Aucun classement pour le moment" : ""}
        {globalLeaderboard.length > 0 ?
          <div>
            {globalLeaderboard.data.slice(0, 10).map((entry, i) => {
              return <p key={i}
                        className={entry.username === playerInfo.username ? "text-blue-400" : ""}>{i + 1}. {entry.username} - {Math.round(entry.score) / 1000} {adaptPlurial("seconde", Math.round(entry.score) / 1000)}</p>
            })}
          </div>
          : ""
        }
        {userPosition > 10 ? <p
          className="text-blue-400">{userPosition + 1}. {playerInfo.username} - {Math.round(globalLeaderboard.data[userPosition].score) / 1000} {adaptPlurial("seconde", Math.round(globalLeaderboard.data[userPosition].score) / 1000)}</p> : ""}
      </CardContent>
    </Card>)
}

const PalaAnimationClassement = ({ questionsList }: PalaAnimationClassementType) => {

  const [currentLeaderboard, setCurrentLeaderboard] = useState({ data: [], length: -1 } as PalaAnimationLeaderboard);
  const [userScore, setUserScore] = useState({ position: -1, score: -1 } as PalaAnimationScore);
  const { data: playerInfo } = usePlayerInfoStore();

  async function updateLeaderboardUI(leaderboard_name: string) {
    getLeaderboardPalaAnimation(leaderboard_name).then(
      (data) => {
        console.log(data);
        setCurrentLeaderboard(data);
      }
    ).catch(
      (error) => {
        console.error("Error while fetching leaderboard", error);
      }
    );

    if (playerInfo) {
      getUsernameScorePalaAnimation(leaderboard_name, playerInfo.username).then(
        (data) => {
          setUserScore(data);
        }
      ).catch(
        (error) => {
          console.error("Error while fetching user position", error);
        }
      );
    }

  }

  useEffect(() => {
    if (questionsList.length === 0)
      return;
    updateLeaderboardUI(questionsList[0].question);
  }, [questionsList]);

  if (!playerInfo)
    return null;

  return (
    <Card className="md:col-span-1 md:col-start-3 col-span-2 col-start-1">
      <CardHeader className="flex">
        <CardTitle>Classement</CardTitle>
        <CardDescription>{questionsList.length === 0 ? "" : questionsList[0].question}</CardDescription>
      </CardHeader>
      <CardContent className="flex gap-2 flex-col">
        {currentLeaderboard.length === -1 ? "Chargement du classement..." : ""}
        {currentLeaderboard.length === 0 ? "Aucun classement pour le moment" : ""}
        {currentLeaderboard.length > 0 ?
          <div>
            {currentLeaderboard.data.map((entry, i) => {
              return <p key={i}
                        className={entry.username === playerInfo.username ? "text-blue-400" : ""}>{i + 1}. {entry.username} - {entry.score / 1000} {adaptPlurial("seconde", entry.score / 1000)}</p>
            })}
          </div>
          : ""
        }
        {userScore.position === -1 || userScore.position < currentLeaderboard.length ? "" :
          <p
            className="text-blue-400">{userScore.position + 1}. {playerInfo.username} - {userScore.score / 1000} {adaptPlurial("seconde", userScore.score / 1000)}</p>}
      </CardContent>
    </Card>)
}

export default PalaAnimationPage;