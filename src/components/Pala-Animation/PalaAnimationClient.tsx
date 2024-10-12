'use client';

import { FormEvent, useEffect, useState } from "react";
import { load } from "@fingerprintjs/botd";
import { KeyDownTimestampType, PalaAnimationLeaderboard, PalaAnimationScore, userAnswerType } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { adaptPlurial } from "@/lib/misc.ts";
import { toast } from "sonner";
import {
  getAnswerPalaAnimation,
  getLeaderboardPalaAnimation
} from "@/components/Pala-Animation/PalaAnimationActions.tsx";
import { AxiosError } from "axios";
import CanvasWithText from "@/components/ui/canvas.tsx";
import { Input } from "@/components/ui/input.tsx";
import { cn } from "@/lib/utils.ts";
import { useSessionContext } from "@/components/Pala-Animation/SessionContextProvider.tsx";
import { Button } from "@/components/ui/button.tsx";
import { checkAnswerPalaAnimation, getNewQuestionPalaAnimation } from "@/lib/cypher.ts";
import { useRouter } from "next/navigation";


export function TestBot() {
  const [bot, setBot] = useState(false);
  const router = useRouter();

  useEffect(() => {
    load()
      .then((botd) => botd.detect())
      .then((result) => setBot(result.bot))
      .catch((error) => console.error(error))
  }, []);

  if (bot) {
    router.push("/error?message=L'utilisation de bot est interdit ! 😡");
  }
  return null;
}


type PalaAnimationBodyType = {
  username: string
}

export function PalaAnimationBody({ username }: PalaAnimationBodyType) {

  const { sessionUuid, question, setQuestion, setSessionUuid } = useSessionContext();

  const [reroll, setReroll] = useState(false);
  const [oldAnswer, setOldAnswer] = useState([] as userAnswerType[][])
  const [timer, setTimer] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [keyPressTimestamp, setKeyPressTimestamp] = useState([] as KeyDownTimestampType[]);
  const [isChecking, setIsChecking] = useState(false);
  const [startingTime, setStartingTime] = useState(0);

  function clearUserAnswer() {
    // reset input field with id user_answer
    setInputValue("");
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    await checkAnswer(String(formData.get("user_answer")));
    return true;
  }


  // legitCheck = false if the button "Révéler la solution" is clicked
  async function checkAnswer(userAnswer = "", legitCheck = true) {
    if (isChecking)
      return;
    if (username === "") {
      console.error("No player info");
      return;
    }
    if (sessionUuid === undefined) {
      console.error("No session uuid");
      return;
    }


    let correct = false;

    let newEntryOldAnswer = [] as userAnswerType[];
    const currentTime = new Date().getTime();
    const time = currentTime - startingTime;
    const keyPressTimestampCopy = [...keyPressTimestamp, { key: " ", timestamp: new Date().getTime() }];

    if (legitCheck) {
      setIsChecking(true);
      await checkAnswerPalaAnimation(userAnswer, sessionUuid, keyPressTimestampCopy, time).then((data) => {
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
          console.error(error)
          const message = error instanceof AxiosError ?
            error.response?.data.message ?? error.message :
            typeof error === "string" ?
              error :
              "Une erreur est survenue dans l'enregistrement du temps";
          setTimeout(() => {
            setReroll(true);
          }, 500);
          setTimer(message);
        }).finally(() => {setIsChecking(false);})
    } else {
      newEntryOldAnswer = userAnswer.split("").map((c) => {
        return { c, color: "text-gray-400" }
      });
    }

    if (correct || !legitCheck) {
      setOldAnswer([newEntryOldAnswer, ...oldAnswer]);
      setTimeout(() => {
        setReroll(true);
      }, 500);
    } else {
      setOldAnswer([newEntryOldAnswer, ...oldAnswer]);
    }
    clearUserAnswer();
  }


  function reveal() {
    if (isChecking || sessionUuid === undefined)
      return;
    setIsChecking(true);
    document.getElementById("user_answer")?.focus();

    clearUserAnswer();
    getAnswerPalaAnimation(sessionUuid).then((r) => {
      checkAnswer(r.answer, false);
    }).catch((error) => {
      toast.error("Error while fetching answer", error);
    }).finally(() => {
      setIsChecking(false);
    });
  }

  useEffect(() => {
    if (username === "") {
      console.error("No player info");
      return;
    }

    if (!reroll)
      return
    getNewQuestionPalaAnimation(username, question).then(
      (data) => {
        setQuestion(data.question);
        setSessionUuid(data.session_uuid);
      }
    ).catch(
      (error) => {
        console.error("Error while fetching new question", error);
      }
    ).finally(() => {
      setIsChecking(false);
    });

  }, [reroll]);

  useEffect(() => {


    setTimer("");
    setReroll(false);
    setOldAnswer([]);
    setStartingTime(new Date().getTime());
  }, [question]);

  useEffect(() => {
    setKeyPressTimestamp([{ key: " ", timestamp: startingTime }]);
  }, [startingTime]);


  useEffect(() => {
    setReroll(true);
  }, []);

  useEffect(() => {

    const lastChar = inputValue.slice(-1);
    // reminder: keyPressTimestamp[0] is " " corresponding to the time at which the timer started
    if (inputValue.length === 0) {
      if (keyPressTimestamp.length !== 0) {
        setKeyPressTimestamp([keyPressTimestamp[0]]);
      }
      return;
    }


    if (keyPressTimestamp.length - 1 > inputValue.length) {
      setKeyPressTimestamp(keyPressTimestamp.slice(0, inputValue.length + 1));
    } else {
      setKeyPressTimestamp([...keyPressTimestamp, { key: lastChar, timestamp: new Date().getTime() }]);
    }
  }, [inputValue]);


  if (username === "")
    return null;

  return (
    <div className="flex flex-col gap-2 items-center">
      {question === undefined ? "Chargement de la question..." : <CanvasWithText text={question} height={50}/>}
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
      {timer === "" ? "" :
        <div className="flex flex-col items-center">
          <span>
            {timer.split(":")[0]}
            <span className={(timer.includes("lent") ? 'text-red-400' : 'text-green-400')}>{timer.split(":")[1]}</span>
          </span>

        </div>
      }
      <div className="flex flex-col items-center max-h-64 overflow-auto max-w-full">
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
        <Button onClick={reveal} variant="outline" disabled={isChecking}>Révéler la solution</Button>
        <Button onClick={() => {
          if (isChecking)
            return;
          setIsChecking(true);
          clearUserAnswer();
          document.getElementById("user_answer")?.focus();
          setReroll(true)
        }}
                disabled={isChecking}
        >Nouvelle question</Button>
      </div>
    </div>
  );
}

export function PalaAnimationClassement({ username }: {
  username: string
}) {

  const { sessionUuid } = useSessionContext();

  const [currentLeaderboard, setCurrentLeaderboard] = useState([] as PalaAnimationLeaderboard);
  const [userScore, setUserScore] = useState({ username: "" } as PalaAnimationScore);

  async function updateLeaderboardUI() {
    if (username === "" || sessionUuid === undefined || sessionUuid === "")
      return;


    getLeaderboardPalaAnimation(sessionUuid, username).then(
      (data) => {
        setCurrentLeaderboard(data.slice(0, 10));
        const userPosInfo = data.find((entry) => {
          if (entry.username === username) {
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
    if (sessionUuid === undefined)
      return;
    updateLeaderboardUI().catch((error) => toast.error("Error while updating leaderboard", error));
  }, [sessionUuid]);


  return (
    <Card className="md:col-span-1 md:col-start-3 col-span-2 col-start-1">
      <CardHeader className="flex">
        <CardTitle>Classement</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-2 flex-col">
        {currentLeaderboard.length === 0 ? "Aucun classement pour le moment" : ""}
        {currentLeaderboard.length > 0 ?
          <div>
            {currentLeaderboard.map((entry, i) => {
              return <p key={i}
                        className={entry.username === username ? "text-blue-400" : ""}>{i + 1}. {entry.username} - {entry.completion_time / 1000} {adaptPlurial("seconde", entry.completion_time / 1000)}</p>
            })}
          </div>
          : ""
        }
        {userScore.username === "" || userScore.rank_completion_time <= currentLeaderboard.length ? "" :
          <p
            className="text-blue-400">{userScore.rank_completion_time}. {username} - {userScore.completion_time / 1000} {adaptPlurial("seconde", userScore.completion_time / 1000)}</p>}
      </CardContent>
    </Card>)
}