'use client'
import React, { createContext, useState } from 'react';

export type SessionContextType = {
  sessionUuid: string | undefined;
  setSessionUuid: (session_uuid: string) => void;
  question: string | undefined;
  setQuestion: (question: string) => void;
}

const SessionContext = createContext({} as SessionContextType);

export const SessionContextProvider = ({ children } : {children: React.ReactNode}) => {
  const [session_uuid, setSession_uuid] = useState('');
  const [question, setQuestion] = useState('');

  return (
    <SessionContext.Provider
      value={{ sessionUuid: session_uuid, setSessionUuid: setSession_uuid, question, setQuestion }}>
      {children}
    </SessionContext.Provider>
  );
}

export const useSessionContext = () => {
  return React.useContext(SessionContext);
}

export default function SessionProvider({ children } : {children: React.ReactNode}) {
  return <SessionContextProvider>
    {children}
  </SessionContextProvider>
}