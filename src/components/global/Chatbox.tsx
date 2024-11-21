import React, { useState, useRef, useEffect } from 'react';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/navigation';
import { Paperclip, Send, X } from 'lucide-react';
import { useToast } from '../../utils/show-toasts';
import { getAccessToken } from '../../utils/auth';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { IconSend, IconSend2 } from '@tabler/icons-react';

type Message = {
  id: number;
  text: string;
  file?: string | null;
  sender: string;
  timestamp?: string;
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
    { id: 0, text: 'How may I help you?', sender: 'admin', timestamp: new Date().toISOString() },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  let accessToken = parseCookies().altern8_useraccess;

  const formatTimestamp = (timestamp: string | undefined) => {
    if (!timestamp) return ''; // Handle undefined case

    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (timestamp: string | undefined) => {
    if (!timestamp) return ''; // Handle undefined case

    const date = new Date(timestamp);
    const today = new Date();

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }

    return date.toLocaleDateString();
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    messages.forEach(message => {
      const date = formatDate(message.timestamp);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  };

  const ReplaceTokenOrRedirect = async () => {
    const token = await getAccessToken();
    if (!token) {
      router.push('/login');
    } else {
      accessToken = token;
    }
  };

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
        console.log('the messages received are set to this: ', responseData);
        let addMessage: Message[] = responseData.map((msg: any) => ({
          id: msg.id,
          text: msg.content,
          file: msg.file,
          sender: msg.type_sender.toLowerCase(),
          timestamp: msg.timestamp,
        }));
        setMessages(prevMessages => {
          // Filter out the initial welcome message if we have actual messages
          const filteredPrev =
            prevMessages.length === 1 && prevMessages[0].id === 0 ? [] : prevMessages;
          return [...filteredPrev, ...addMessage];
        });
      }
    } catch (error) {
      console.log('error during getting chats');
    }
  };

  useEffect(() => {
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
          setMessages(prev => [
            ...prev,
            {
              id: prev.length, // You might want to use a better id generation strategy
              text: newMessage,
              file: file ? file.name : null,
              sender: 'user',
              timestamp: new Date().toISOString(), // Adding the required timestamp
            },
          ]);
          setNewMessage('');
          setFile(null);
          await GetMessage();
        } else {
          showToast({
            message: 'Message Failed!',
            type: 'error',
          });
        }
      } catch (error) {
        showToast({
          message: 'Message Failed!',
          type: 'error',
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
            message: 'File size exceeds 5MB limit, Please choose a smaller file',
            type: 'info',
          });
          fileInput.value = '';
        }
      } else {
        showToast({
          message: 'Invalid file type, Please choose a PDF or Excel file',
          type: 'info',
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
            {Object.entries(groupMessagesByDate(messages)).map(([date, dateMessages]) => (
              <div key={date} className="space-y-4">
                <div className="relative w-full py-2 text-center mt-5">
                  <div className="absolute inset-y-0 left-0 top-1/2 transform -translate-y-1/5 bg-gray-700/70 h-[0.9px] w-full"></div>
                  <span className="relative bg-gradient-to-r from-[#090c19] via-[#19112f] to-[#6e3050] px-2 text-sm text-gray-400 rounded-lg">
                    {date}
                  </span>
                </div>

                {dateMessages.map(message => (
                  <div
                    key={message.id}
                    className={`flex items-center ${
                      message.sender === 'admin' ? '' : 'justify-end'
                    }`}
                  >
                    {message.sender === 'admin' && (
                      <div className="bg-gray-700 mr-2 w-8 h-8 rounded-full flex items-center justify-center text-gray-300">
                        A
                      </div>
                    )}

                    <div
                      className={`relative p-4 rounded-lg max-w-[300px] min-w-[70px] ${
                        message.sender === 'admin'
                          ? 'bg-white/10 text-gray-300'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      <div className="">{message.text}</div>
                      {message.file
                      
                      && (
                        <div className="text-gray-400 text-sm mt-1">
                          <a
                            href={apiUrl+message.file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline text-blue-400"
                          >
                            {message.file.split('/').pop()}
                          </a>
                        </div>
                      )}
                      <div className='pb-2'>
                      <div className="absolute bottom-1 right-2 text-xs text-gray-400">
                        {formatTimestamp(message.timestamp)}
                      </div>
                      </div>
                      
                    </div>

                    {message.sender === 'user' && (
                      <div className="bg-blue-600 ml-2 w-8 h-8 rounded-full flex items-center justify-center text-white">
                        U
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Your existing input area code remains the same */}
        {file && <div className="text-gray-400 text-sm">Selected file: {file.name}</div>}

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
            <input id="file-input" type="file" className="hidden" onChange={handleFileChange} />
          </Button>

          <Button
            onClick={handleSendMessage}
            variant="expandIcon"
            Icon={IconSend2}
            iconPlacement="right"
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
