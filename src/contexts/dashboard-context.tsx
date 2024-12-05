'use client';

import { getAuthToken } from '@/utils/auth-actions';
import { jwtDecode } from 'jwt-decode';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface DashboardContextType {
  chatCount: number;
  setChatCount: (count: number) => void;
  newMessage: string;
  setNewMessage: (message: string) => void;
  messages: { text: string; sender: string; file?: string | null }[];
  setMessages: (messages: { text: string; sender: string; file?: string | null }[]) => void;
  uId: string;
  setUId: (id: string) => void;
}

// Create a default context value
const defaultDashboardContext: DashboardContextType = {
  chatCount: 0,
  setChatCount: () => {},
  newMessage: '',
  setNewMessage: () => {},
  messages: [{ text: 'How may I help you?', sender: 'admin' }],
  setMessages: () => {},
  uId: '',
  setUId: () => {},
};

export const DashboardContext = createContext<DashboardContextType>(defaultDashboardContext);

export const useDashboardContext = () => useContext(DashboardContext);

interface DashboardProviderProps {
  children: ReactNode;
}

export const DashboardProvider = ({ children }: DashboardProviderProps) => {
  const [chatCount, setChatCount] = useState(0);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([{ text: 'How may I help you?', sender: 'admin' }]);
  const [uId, setUId] = useState('');

  useEffect(() => {
    const fetchTokenAndSetUserId = async () => {
      try {

        const token = await getAuthToken();

        if (token) {
          // Decode the token to extract information
          const decodedToken: { uid: string } = jwtDecode(token);

          // Extract the user ID (assuming it's stored in the 'sub' claim)
          console.log(decodedToken.uid);

          const userId = decodedToken.uid;

          // Introduce a delay of 1000 milliseconds (1 second)
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Set the user ID in state after the delay
          setUId(userId);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchTokenAndSetUserId();
  }, []);

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
