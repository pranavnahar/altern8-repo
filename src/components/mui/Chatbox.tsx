import React, { useState, useRef, useEffect } from 'react';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/navigation';
import { Paperclip, Send, X } from 'lucide-react';
import { useToast } from '../../utilities/show-toasts';
import { getAccessToken } from '../../utilities/auth';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { ScrollArea } from "../../components/ui/scroll-area";
import { IconSend, IconSend2 } from '@tabler/icons-react';

type Message = {
  text: string;
  file?: string | null;
  sender: string;
};

const ChatBox: React.FC<{
  open?: boolean;
  onClose: () => void;
  showMessageBox: boolean;
}> = ({ onClose, showMessageBox }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const { showToast } = useToast();

  const [messages, setMessages] = useState<Message[]>([
    { text: 'How may I help you?', sender: 'admin' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  let accessToken = parseCookies().altern8_useraccess;

  const ReplaceTokenOrRedirect = async () => {
    const token = await getAccessToken();
    if (!token) {
      router.push('/login');
    } else {
      accessToken = token;
    }
  };

  useEffect(() => {
    const GetMessage = async () => {
      try {
        if (!accessToken) {
          await ReplaceTokenOrRedirect();
        }

        let response = await fetch(`${apiUrl}/chat/user/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.status === 401) {
          await ReplaceTokenOrRedirect();
          response = await fetch(`${apiUrl}/chat/user/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
        }

        if (response.ok) {
          const responseData = await response.json();
          let addMessage: Message[] = [];
          for (let i = 0; i < responseData.length; i++) {
            addMessage.push({
              text: responseData[i]['content'],
              file: responseData[i]['file'],
              sender: responseData[i]['type_sender'] === 'User' ? 'user' : 'admin',
            });
          }
          setMessages(prevMessages => [...prevMessages, ...addMessage]);
        }
      } catch (error) {
        console.log('error during getting chats');
      }
    };

    GetMessage();
  }, [showMessageBox]);

  const handleSendMessage = async () => {
    if (newMessage.trim() || file) {
      try {
        const formData = new FormData();
        if (file) {
          formData.append('file', file);
        }
        formData.append('content', newMessage);

        let response = await fetch(`${apiUrl}/chat/user/`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        });

        if (response.status === 401) {
          await ReplaceTokenOrRedirect();
          response = await fetch(`${apiUrl}/chat/user/`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
          });
        }

        if (response.ok) {
          setMessages(prev => [...prev, {
            text: newMessage,
            file: file ? file.name : null,
            sender: 'user'
          }]);
          setNewMessage('');
          setFile(null);
        } else {
          showToast({
            message: "Message Failed!",
            type: "error",
          });
        }
      } catch (error) {
        showToast({
          message: "Message Failed!",
          type: "error",
        });
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = event.target;
    const selectedFile = fileInput.files?.[0];

    if (selectedFile) {
      if (
        selectedFile.type === 'application/pdf' ||
        selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        if (selectedFile.size <= 5 * 1024 * 1024) {
          setFile(selectedFile);
          fileInput.value = '';
        } else {
          showToast({
            message: "File size exceeds 5MB limit, Please choose a smaller file",
            type: "info",
          });
          fileInput.value = '';
        }
      } else {
        showToast({
          message: "Invalid file type, Please choose a PDF or Excel file",
          type: "info",
        });
        fileInput.value = '';
      }
    }
  };

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="bg-gradient-to-r from-[#011049] via-[#19112f] to-[#6e3050] text-white max-w-2xl border-none rounded-xl">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span className="text-white text-2xl font-medium">Chat with Admin</span>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4 mt-5">
          <div ref={chatContainerRef} className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex items-center ${message.sender === 'admin' ? '' : 'justify-end'}`}>
                {message.sender === 'admin' && (
                  <div className="bg-gray-700 mr-2 w-8 h-8 rounded-full flex items-center justify-center text-gray-300">
                    A
                  </div>
                )}

                <div className={`p-3 rounded-lg max-w-[300px] ${
                  message.sender === 'admin' ? 'bg-white/10 text-gray-300' : 'bg-blue-600 text-white'
                }`}>
                  <div>{message.text}</div>
                  {message.file && (
                    <div className="text-gray-400 text-sm mt-1">
                      {message.file.split('/').pop()}
                    </div>
                  )}
                </div>

                {message.sender === 'user' && (
                  <div className="bg-blue-600 ml-2 w-8 h-8 rounded-full flex items-center justify-center text-white">
                    U
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        {file && (
          <div className="text-gray-400 text-sm">
            Selected file: {file.name}
          </div>
        )}

        <div className="flex items-center gap-2 mt-4">
          <Input
            type="text"
            placeholder="Type your message..."
            className="flex-1 bg-gray-800/20 border-gray-500 text-gray-300 focus-visible:ring-blue-500"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />

          <Button
            variant="ghost"
            size="icon"
            className="text-gray-300 hover:text-gray-100"
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <Paperclip className="h-5 w-5" />
            <input
              id="file-input"
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </Button>

          <Button
            onClick={handleSendMessage}
            variant="expandIcon"
            Icon={IconSend2}
            iconPlacement='right'
            size="sm"
          >
            Send
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatBox;
