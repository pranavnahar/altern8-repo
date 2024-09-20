import React, { createContext, useContext, useState, ReactNode } from "react";

interface DashboardContextType {
  chatCount: number;
  setChatCount: (count: number) => void;
  newMessage: string;
  setNewMessage: (message: string) => void;
  messages: { text: string; sender: string }[];
  setMessages: (messages: { text: string; sender: string }[]) => void;
  uId: string;
  setUId: (id: string) => void;
}

// Create a default context value
const defaultDashboardContext: DashboardContextType = {
  chatCount: 0,
  setChatCount: () => {},
  newMessage: "",
  setNewMessage: () => {},
  messages: [{ text: "How may I help you?", sender: "admin" }],
  setMessages: () => {},
  uId: "",
  setUId: () => {},
};

export const DashboardContext = createContext<DashboardContextType>(
  defaultDashboardContext
);

export const useDashboardContext = () => useContext(DashboardContext);

interface DashboardProviderProps {
  children: ReactNode;
}

export const DashboardProvider = ({ children }: DashboardProviderProps) => {
  const [chatCount, setChatCount] = useState(0);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([
    { text: "How may I help you?", sender: "admin" },
  ]);
  const [uId, setUId] = useState("");

  return (
    <DashboardContext.Provider
      value={{
        chatCount,
        setChatCount,
        newMessage,
        setNewMessage,
        messages,
        setMessages,
        uId,
        setUId,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
