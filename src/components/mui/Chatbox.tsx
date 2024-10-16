import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, Button, IconButton } from '@mui/material';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/navigation';
import { IconPaperclip, IconSend2, IconX } from '@tabler/icons-react';
import { useToast } from '@/utils/show-toasts';
import { getAccessToken } from '@/utils/auth';

type Message = {
  text: string;
  file?: string | null;
  sender: string;
};

// main function
const ChatBox: React.FC<{
  open?: boolean;
  onClose: () => void;
  showMessageBox: boolean;
}> = ({ onClose, showMessageBox }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const { showToast } = useToast();

  const [messages, setMessages] = useState<Message[]>([
    // initial messages for the chat
    { text: 'How may I help you?', sender: 'admin' },
  ]);
  const [newMessage, setNewMessage] = useState(''); // to handle new message
  const [file, setFile] = useState<File | null>(null); // for file attachment

  const chatContainerRef = useRef<HTMLDivElement>(null); // for chat modal scrolling

  const ReplaceTokenOrRedirect = async () => {
    const token = await getAccessToken();
    if (!token) {
      router.push('/login');
    } else {
      accessToken = token;
    }
  };

  // Handle token
  let accessToken = parseCookies().altern8_useraccessForRegister; // access token from cookies

  // get all Messages from backend
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
          // Again try to fetch the data
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
            const additionalMessage = [
              {
                text: responseData[i]['content'],
                file: responseData[i]['file'],
                sender: responseData[i]['type_sender'] === 'User' ? 'user' : 'admin',
              },
            ];

            addMessage = [...addMessage, ...additionalMessage];
          }

          const newMsg = [...messages, ...addMessage];
          setMessages(newMsg);
        } else {
          console.log('error during getting chats');
        }
      } catch (error) {
        console.log('error during getting chats');
      }
    };

    GetMessage();
  }, [showMessageBox]);

  // send new message to backend
  const handleSendMessage = async () => {
    if (newMessage.trim() || file) {
      // send message to backend
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
          // Again try to fetch the data
          response = await fetch(`${apiUrl}/chat/user/`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
          });
        }

        if (response.ok) {
          setMessages([
            ...messages,
            { text: newMessage, file: file ? file.name : null, sender: 'user' },
          ]);
          setNewMessage('');
          setFile(null);
        } else {
          console.log('message send failed!');
          showToast(`Message Failed!`, 'info');
        }
      } catch (error) {
        console.log('send message failed', error);
        showToast(`Message Failed!`, 'info');
      }
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length) {
      chatContainerRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
  }, [messages.length]);

  // scroll to bottom everytime when message box Opened.
  useEffect(() => {
    // Scroll to bottom after a short delay
    setTimeout(() => {
      chatContainerRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }, 100); // Adjust the delay as needed
  }, [showMessageBox]);

  // handle file attachment
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = event.target;
    const selectedFile = fileInput.files?.[0];

    if (selectedFile) {
      // Check if the selected file is a PDF
      if (
        selectedFile.type === 'application/pdf' ||
        selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        // Check if the file size is below 5MB
        if (selectedFile.size <= 5 * 1024 * 1024) {
          setFile(selectedFile);
          fileInput.value = ''; // Clear the input to allow selecting a new file
        } else {
          alert('File size exceeds 5MB limit. Please choose a smaller file.');
          fileInput.value = ''; // Clear the input to allow selecting a new file
        }
      } else {
        alert('Please choose a PDF or Excel file.');
        fileInput.value = ''; // Clear the input to allow selecting a new file
      }
    }
  };

  return (
    <Dialog
      open
      onClose={onClose}
      PaperProps={{
        style: {
          background:
            'linear-gradient(269.75deg, #011049, #19112f 25.75%, #251431 51.79%, #301941 64.24%, #6e3050)',
          borderRadius: '10px',
          color: 'white', // Ensure text is visible on the gradient background
        },
      }}
    >
      <DialogTitle style={{ color: 'white' }}>
        <span className="text-white">Chat with Admin</span>
        <IconButton
          aria-label="close"
          onClick={onClose}
          style={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: '#ffffff',
          }}
        >
          <IconX />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ width: 600, marginY: '0px' }}>
        <div
          ref={chatContainerRef}
          // ref for scroll
          className="[background:linear-gradient(269.75deg,_#011049,_#19112f_25.75%,_#251431_51.79%,_#301941_64.24%,_#6e3050)] p-4 rounded-lg"
        >
          {/* showing all the messages */}
          {messages.map((message, index) => (
            <div key={index}>
              {message.sender === 'admin' ? (
                // if sender is admin
                <div className="flex items-center pb-5 ">
                  <div className="bg-gray-700 mr-2 w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-gray-300">
                    A
                  </div>
                  <div className="text-gray-300 p-2 bg-gray-700 rounded-lg max-w-[300px]">
                    {message.file ? (
                      <div>
                        <div>{message.text}</div>
                        <div className="text-gray-400">{message.file.split('/').pop()}</div>
                      </div>
                    ) : (
                      <div>{message.text}</div>
                    )}
                  </div>
                </div>
              ) : (
                // if sender is user
                <div className="flex flex-grow items-center justify-end pb-5">
                  <div className="text-gray-200 py-1 p-2 overflow-hidden bg-[#1565c0] rounded-lg max-w-[300px]">
                    {message.file ? (
                      <div>
                        <div>{message.text}</div>
                        <div className="text-gray-400">{message.file.split('/').pop()}</div>
                      </div>
                    ) : (
                      <div>{message.text}</div>
                    )}
                  </div>
                  <div className="bg-[#1565c0] ml-2 w-8 h-8 rounded-full flex items-center justify-center text-gray-200">
                    U
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* show selected file */}
          {file && <div className="text-gray-400 mb-4">Selected file: {file.name}</div>}

          {/* input and button section */}
          <div className="flex items-center mt-4">
            {/* message input section */}
            <input
              type="text"
              placeholder="Type your message..."
              className="w-full px-3 py-2 rounded-full bg-gray-800 border border-gray-500 text-gray-300 focus:outline-none focus:ring focus:border-blue-500"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
            />

            {/* file attachment icon */}
            <div className="relative fill-gray-300">
              <IconButton className="h-8" style={{ color: '#cbd5e0' }} component="label">
                <input
                  type="file"
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                />
                <IconPaperclip />
              </IconButton>
            </div>

            {/* message send button */}
            <Button
              onClick={handleSendMessage}
              variant="contained"
              endIcon={<IconSend2 />}
              style={{
                backgroundColor: '#1565c0',
                borderRadius: '25px', // Adjust the pixel value for the desired border radius
                padding: '7px 30px',
              }}
            >
              Send
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatBox;
