import GradientText from "@/components/shared/GradientText";
import Layout from "@/components/shared/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FormEvent, useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import {
  checkAnswerPalaAnimation,
  getAnswerPalaAnimation,
  getGlobalLeaderboard,
  getLeaderboardPalaAnimation,
  getNewQuestionPalaAnimation,
} from "@/lib/apiPalaTracker.ts";

import { Button } from "@/components/ui/button.tsx";
import { usePlayerInfoStore } from "@/stores/use-player-info-store.ts";
import ImportProfil from "@/pages/OptimizerClicker/Components/ImportProfil.tsx";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Input } from "@/components/ui/input.tsx";
import { cn } from "@/lib/utils.ts";
import {
  KeyDownTimestampType,
  PalaAnimationLeaderboard,
  PalaAnimationLeaderboardGlobal,
  PalaAnimationScore,
  userAnswerType
} from "@/types";
import { adaptPlurial } from "@/lib/misc.ts";
import { useParams } from "react-router-dom";
import useLoadPlayerInfoMutation from "@/hooks/use-load-player-info-mutation.ts";
import PendingPage from "@/pages/UnknownUsername.tsx";


type PalaAnimationBodyType = {
  question: string | null,
  setQuestion: (question: string) => void
  setSessionUUID: (session_uuid: string) => void
  session_uuid: string
}

const PalaAnimationBody = ({ question, setQuestion, session_uuid, setSessionUUID }: PalaAnimationBodyType) => {
  const { data: playerInfo } = usePlayerInfoStore();


  const [reroll, setReroll] = useState(false);
  const [oldAnswer, setOldAnswer] = useState([] as userAnswerType[][])
  const [timer, setTimer] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [keyPressTimestamp, setKeyPressTimestamp] = useState([] as KeyDownTimestampType[]);


  function saveKeyPressTimestamp(event: React.KeyboardEvent<HTMLInputElement>) {
    const key = event.key;
    const timestamp = new Date().getTime();
    setKeyPressTimestamp([...keyPressTimestamp, { key, timestamp }]);
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


  // legitCheck = false if the button "Révéler la solution" is clicked
  async function checkAnswer(userAnswer = "", legitCheck = true) {
    if (!playerInfo) {
      console.error("No player info");
      return;
    }
    if (session_uuid === "") {
      console.error("No session uuid");
      return;
    }


    let correct = false;

    let newEntryOldAnswer = [] as userAnswerType[];
    const time = new Date().getTime() - parseInt(localStorage.getItem("startingTime") || "0");
    if (legitCheck) {
      await checkAnswerPalaAnimation(userAnswer, session_uuid, keyPressTimestamp, time).then((data) => {
        newEntryOldAnswer = data.text;
        if (data.valid) {
          correct = true;
          if (legitCheck) {
            setTimer(data.message);
          }
        } else {
          console.error(data.message);
        }
      }).catch(
        (error) => {
          const message = error instanceof AxiosError ?
            error.response?.data.message ?? error.message :
            typeof error === "string" ?
              error :
              "Une erreur est survenue dans l'enregistrement du temps";
          console.error(message);
        }).finally(() => {
        setKeyPressTimestamp([{ key: " ", timestamp: new Date().getTime() }]);
      })
    } else {
      newEntryOldAnswer = userAnswer.split("").map((c) => {
        return { c, color: "text-gray-400" }
      });
    }

    if (correct || !legitCheck) {
      setOldAnswer([newEntryOldAnswer, ...oldAnswer]);
      setTimeout(() => {
        setReroll(true);
      }, 1500);
    } else {
      setOldAnswer([newEntryOldAnswer, ...oldAnswer]);
    }
    clearUserAnswer();
  }


  function reveal() {
    document.getElementById("user_answer")?.focus();

    clearUserAnswer();
    getAnswerPalaAnimation(session_uuid).then((r) => {
      checkAnswer(r.answer, false);
    }).catch((error) => {
      toast.error("Error while fetching answer", error);
    });
  }

  useEffect(() => {
    if (!playerInfo) {
      console.error("No player info");
      return;
    }

    if (!reroll)
      return
    const interval = setInterval(() => {
      getNewQuestionPalaAnimation(playerInfo.username).then(
        (data) => {

          if (data.question !== question)
            clearInterval(interval);
          setQuestion(data.question);
          setSessionUUID(data.session_uuid);
        }
      ).catch(
        (error) => {
          console.error("Error while fetching new question", error);
        }
      );
    }, 1000);


  }, [reroll]);

  useEffect(() => {
    function setTimerLS() {
      localStorage.setItem("startingTime", new Date().getTime().toString());
    }

    setTimer("");
    setReroll(false);
    setOldAnswer([]);
    setKeyPressTimestamp([{ key: " ", timestamp: new Date().getTime() }]);

    setTimerLS();
  }, [question]);


  useEffect(() => {
    setReroll(true);
  }, []);


  if (!playerInfo)
    return null;

  return (
    <div className="flex flex-col gap-2 items-center">
      <p className="pb-4">{question === null ? "Chargement de la question..." : question}</p>
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
            onKeyDown={e => saveKeyPressTimestamp(e)}
            onPaste={e => e.preventDefault()}
          />
        </div>
      </form>
      {timer === "" ? "" :
        <div className="flex flex-col items-center">
          <span>
            {timer.split(":")[0]}
            <span className={(timer.includes("lent") ? 'text-red-400' : 'text-green-400')}>{timer.split(":")[1]}</span>
          </span>

        </div>
      }
      <div contentEditable={false} className="max-h-64 overflow-auto">
        {
          oldAnswer.map((old, i1) => {
            return (<div key={i1}>
              {old.map((e, i2) => {
                if (e.color === "text-green-700")
                  return <span key={i2} className="text-green-700">{e.c}</span>
                else if (e.color === "text-red-700")
                  return <span key={i2} className="text-red-700">{e.c}</span>
                else if (e.color === "text-gray-400")
                  return <span key={i2} className="text-gray-400">{e.c}</span>
                else
                  return <span key={i2} className={e.color.toString()}>{e.c}</span>
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
  const { pseudoParams } = useParams();
  const { mutate: loadPlayerInfo, isError } = useLoadPlayerInfoMutation();

  const { data: playerInfo } = usePlayerInfoStore();

  const [question, setQuestion] = useState(null as string | null);
  const [session_uuid, setSessionUUID] = useState("");

  useEffect(() => {
    if (!pseudoParams && playerInfo) {
      window.location.href = `/optimizer-clicker/${playerInfo.username}`;
      return;
    }
    // load playerInfo using pseudoParams only if the username is different from the one in the store or if it has been 5 minutes since the last load
    if (pseudoParams && playerInfo && (playerInfo.username.toLowerCase() !== pseudoParams.toLowerCase() || new Date().getTime() - playerInfo.last_fetch > 5 * 60 * 1000)) {
      loadPlayerInfo(pseudoParams as string, {
        onSuccess: () => {
          toast.success("Profil importé avec succès");
        },
        onError: (error) => {
          const message = error instanceof AxiosError ?
            error.response?.data.message ?? error.message :
            typeof error === "string" ?
              error :
              "Une erreur est survenue dans l'importation du profil";
          toast.error(message);
        }
      })
    }
  }, []);

  if (isError) {
    return (
      <Layout>
        <PendingPage/>
      </Layout>
    )
  }


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


          {!playerInfo ? "" :
            <div className="grid grid-cols-2 md:grid-cols-3 grid-rows-1 gap-4">
              <Card className="col-span-2">
                <CardHeader>
                  <PalaAnimationBody question={question} setQuestion={setQuestion} session_uuid={session_uuid}
                                     setSessionUUID={setSessionUUID}/>
                </CardHeader>
              </Card>
              <PalaAnimationClassement question={question} session_uuid={session_uuid}/>
            </div>}
          <PalaAnimationClassementGlobal/>
        </div>
      </Layout>
    </>
  );
}

const PalaAnimationClassementGlobal = () => {
  const { data: playerInfo } = usePlayerInfoStore();
  const [globalLeaderboard, setGlobalLeaderboard] = useState([] as PalaAnimationLeaderboardGlobal)

  async function updateLeaderboardGlobalUI() {
    getGlobalLeaderboard().then(
      (data) => {
        setGlobalLeaderboard(data);
      }
    ).catch(
      (error) => {
        console.error("Error while fetching global leaderboard", error);
      }
    );
  }

  useEffect(() => {
    updateLeaderboardGlobalUI().catch((error) => toast.error("Error while updating global leaderboard", error));
  }, []);

  const userPosition = globalLeaderboard.findIndex((entry) => entry.username === playerInfo?.username);
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
        {globalLeaderboard.length === 0 ? "Aucun classement pour le moment" : ""}
        {globalLeaderboard.length > 0 ?
          <div>
            {globalLeaderboard.slice(0, 10).map((entry, i) => {
              return <p key={i}
                        className={entry.username === playerInfo.username ? "text-blue-400" : ""}>{i + 1}. {entry.username} - {Math.round(entry.avg_completion_time) / 1000} {adaptPlurial("seconde", Math.round(entry.avg_completion_time) / 1000)}</p>
            })}
          </div>
          : ""
        }
        {userPosition > 10 ? <p
          className="text-blue-400">{userPosition + 1}. {playerInfo.username} - {Math.round(globalLeaderboard[userPosition].avg_completion_time) / 1000} {adaptPlurial("seconde", Math.round(globalLeaderboard[userPosition].avg_completion_time) / 1000)}</p> : ""}
      </CardContent>
    </Card>)
}

const PalaAnimationClassement = ({ question, session_uuid }: { question: string | null, session_uuid: string }) => {

  const [currentLeaderboard, setCurrentLeaderboard] = useState([] as PalaAnimationLeaderboard);
  const [userScore, setUserScore] = useState({ username: "" } as PalaAnimationScore);
  const { data: playerInfo } = usePlayerInfoStore();

  async function updateLeaderboardUI() {
    if (!playerInfo || question === null || session_uuid === "")
      return;

    getLeaderboardPalaAnimation(session_uuid, playerInfo.username).then(
      (data) => {

        setCurrentLeaderboard(data.slice(0, 10));
        const userPosInfo = data.find((entry) => {
          if (entry.username === playerInfo.username) {
            return entry;
          }
        })
        if (userPosInfo)
          setUserScore(userPosInfo);
        else
          setUserScore({ username: "" } as PalaAnimationScore)
      }
    ).catch(
      (error) => {
        console.error("Error while fetching leaderboard", error);
      }
    );
  }

  useEffect(() => {
    if (question === null)
      return;
    updateLeaderboardUI().catch((error) => toast.error("Error while updating leaderboard", error));
  }, [question]);

  if (!playerInfo)
    return null;

  return (
    <Card className="md:col-span-1 md:col-start-3 col-span-2 col-start-1">
      <CardHeader className="flex">
        <CardTitle>Classement</CardTitle>
        <CardDescription>{question === null ? "" : question}</CardDescription>
      </CardHeader>
      <CardContent className="flex gap-2 flex-col">
        {currentLeaderboard.length === 0 ? "Aucun classement pour le moment" : ""}
        {currentLeaderboard.length > 0 ?
          <div>
            {currentLeaderboard.map((entry, i) => {
              return <p key={i}
                        className={entry.username === playerInfo.username ? "text-blue-400" : ""}>{i + 1}. {entry.username} - {entry.completion_time / 1000} {adaptPlurial("seconde", entry.completion_time / 1000)}</p>
            })}
          </div>
          : ""
        }
        {userScore.username === "" || userScore.rank_completion_time <= currentLeaderboard.length ? "" :
          <p
            className="text-blue-400">{userScore.rank_completion_time}. {playerInfo.username} - {userScore.completion_time / 1000} {adaptPlurial("seconde", userScore.completion_time / 1000)}</p>}
      </CardContent>
    </Card>)
}

export default PalaAnimationPage;