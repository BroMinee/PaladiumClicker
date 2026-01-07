"use client";
import React, { createContext, useState } from "react";

export type SessionContextType = {
  sessionUuid: string | undefined;
  setSessionUuid: (session_uuid: string) => void;
  question: string | undefined;
  setQuestion: (question: string) => void;
}

const SessionContext = createContext({} as SessionContextType);

/**
 * Provides session-related state to the component tree via React Context.
 *
 * It exposes:
 * - `sessionUuid`: The current session unique identifier.
 * - `setSessionUuid`: Setter for updating the session UUID.
 * - `question`: The current question associated with the session.
 * - `setQuestion`: Setter for updating the question.
 *
 * @param children - The wrapped React nodes that will have access to the session context.
 */
const SessionContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [session_uuid, setSession_uuid] = useState("");
  const [question, setQuestion] = useState("");

  return (
    <SessionContext.Provider
      value={{ sessionUuid: session_uuid, setSessionUuid: setSession_uuid, question, setQuestion }}>
      {children}
    </SessionContext.Provider>
  );
};

/**
 * Custom hook to access the SessionContext.
 */
export const useSessionContext = () => {
  return React.useContext(SessionContext);
};

/**
 * Wraps the application with the SessionContextProvider.
 *
 * @param children - The React nodes to wrap with the session provider.
 */
export default function SessionProvider({ children }: { children: React.ReactNode }) {
  return <SessionContextProvider>
    {children}
  </SessionContextProvider>;
}
