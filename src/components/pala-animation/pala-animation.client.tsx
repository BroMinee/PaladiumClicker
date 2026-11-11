"use client";

import { FormEvent, useEffect, useState } from "react";
import { load } from "@fingerprintjs/botd";
import {
  KeyDownTimestampType,
  userAnswerType
} from "@/types";
import { toast } from "sonner";
import { CanvasWithText } from "@/components/ui/canvas";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useSessionContext } from "@/components/pala-animation/session-context-provider.client";
import { Button } from "@/components/ui/button";
// TODO(story-5): These functions were server-only and are now stubbed.
// They will be replaced with local client-side logic in story 5.
import type { checkAnswerPalaAnimationType } from "@/types";
const checkAnswerPalaAnimation = async (_answer: string, _session_uuid: string, _keyPressTimestamp: KeyDownTimestampType[], _user_time: number): Promise<checkAnswerPalaAnimationType> => {
  throw new Error("Backend unavailable");
};
const getNewQuestionPalaAnimation = async (_lastQuestion: string | undefined): Promise<{ question: string; session_uuid: string }> => {
  throw new Error("Backend unavailable");
};
import { useRouter } from "next/navigation";

/**
 * Detects if the current user is using a bot using @fingerprintjs/botd and redirect if it's the case.
 */
export function TestBot() {
  const [bot, setBot] = useState(false);
  const router = useRouter();

  useEffect(() => {
    load()
      .then((botd) => botd.detect())
      .then((result) => setBot(result.bot))
      .catch((error) => console.error(error));
  }, []);

  if (bot) {
    router.push("/error?message=L'utilisation de bot est interdit ! 😡");
  }
  return null;
}

/**
 * Component that fetch a question, listen for the answer and check the user response.
 */
export function PalaAnimationBody() {

  const { sessionUuid, question, setQuestion, setSessionUuid } = useSessionContext();

  const [reroll, setReroll] = useState(false);
  const [oldAnswer, setOldAnswer] = useState([] as userAnswerType[][]);
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
    if (isChecking) {
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
          console.error(error);
          const message = error instanceof Error ? error.message :
            typeof error === "string" ? error :
              "Une erreur est survenue";
          setTimeout(() => {
            setReroll(true);
          }, 500);
          setTimer(message);
        }).finally(() => {
        setIsChecking(false);
      });
    } else {
      newEntryOldAnswer = userAnswer.split("").map((c) => {
        return { c, color: "text-card-foreground" };
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
    if (isChecking || sessionUuid === undefined || !question) {
      return;
    }
    checkAnswer(question, false);
  }

  useEffect(() => {
    if (!reroll) {
      return;
    }
    getNewQuestionPalaAnimation(question).then(
      (data) => {
        setQuestion(data.question);
        setSessionUuid(data.session_uuid);
      }
    ).catch(
      (error) => {
        console.error("Error while fetching new question", error);
        toast.error("Erreur lors de la récupération de la question.");
      }
    ).finally(() => {
      setIsChecking(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps -- question is modified in setQuestion
  }, [reroll, setQuestion, setSessionUuid]);

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
    setKeyPressTimestamp((prev) => {
      if (inputValue.length === 0) {
        if (prev.length > 1) {
          return [prev[0]];
        }
        return prev;
      }

      if (prev.length - 1 > inputValue.length) {
        return prev.slice(0, inputValue.length + 1);
      }

      if (prev.length - 1 < inputValue.length) {
        const lastChar = inputValue.slice(-1);
        return [...prev, { key: lastChar, timestamp: new Date().getTime() }];
      }

      return prev;
    });
  }, [inputValue, setKeyPressTimestamp]);

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
            <span className={(timer.includes("lent") ? "text-red-400" : "text-green-400")}>{timer.split(":")[1]}</span>
          </span>

        </div>
      }
      <div className="flex flex-col items-center max-h-64 overflow-auto max-w-full">
        {
          oldAnswer.map((old, i1) => {
            return (<div key={i1}>
              {old.map((e, i2) => {
                if (e.color === "text-green-700") {
                  return <span key={i2} className="text-green-700">{e.c}</span>;
                } else if (e.color === "text-red-700") {
                  return <span key={i2} className="text-red-700">{e.c}</span>;
                } else if (e.color === "text-card-foreground") {
                  return <span key={i2} className="text-card-foreground">{e.c}</span>;
                } else {
                  return <span key={i2} className={e.color.toString()}>{e.c}</span>;
                }
              })}
            </div>);
          })
        }
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        <Button onClick={reveal} variant="outline" disabled={isChecking}>Révéler la solution</Button>
        <Button onClick={() => {
          if (isChecking) {
            return;
          }
          setIsChecking(true);
          clearUserAnswer();
          document.getElementById("user_answer")?.focus();
          setReroll(true);
        }}
        disabled={isChecking}
        >Nouvelle question</Button>
      </div>
    </div>
  );
}

