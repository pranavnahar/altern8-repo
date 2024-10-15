'use client';

import React, { useState, useContext, useEffect } from 'react';

import LoadingSpinner from '@/components/LoadingSpinner';
import { IconSend2 } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import ChatBox from '@/components/mui/Chatbox';
import { DashboardContext } from '@/contexts/DashboardContext';
import { fetchWithAuth } from '@/utils/fetch-with-auth';
import { Accordion } from '@/components/ui/accordion';

const dummyFaqs = [
  {
    id: 1,
    question: 'How do I set up my account?',
    answer:
      "To set up your account, click on the 'Sign Up' button and follow the instructions. You will need to provide your email and create a password.",
    image: null,
  },
  {
    id: 2,
    question: 'What are your business hours?',
    answer:
      'Our business hours are from 9:00 AM to 5:00 PM, Monday through Friday. We are closed on weekends and holidays.',
    image: null,
  },
  {
    id: 3,
    question: 'How do I contact support?',
    answer:
      "You can contact our support team by clicking on the 'Chat With Admin' button or by sending an email to support@example.com.",
    image: null,
  },
];

const Help = () => {
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [faqs, setFaqs] = useState(dummyFaqs);
  const [loadingSpinner, setLoadingSpinner] = useState(true);

  const { chatCount, setChatCount } = useContext(DashboardContext);
  useEffect(() => {
    const GetFaq = async () => {
      try {
        const response = await fetchWithAuth(`/user-dashboard-api/faq/`);

        if (response) {
          const responseData = await response.json();
          const newFaqs = responseData.map(
            (faq: { id: any; question: any; answer: any; image: any }) => ({
              id: faq.id,
              question: faq.question,
              answer: faq.answer,
              image: faq.image,
            }),
          );

          setFaqs(newFaqs);
        } else {
          console.error('Failed to fetch FAQs');
        }
      } catch (error) {
        console.log('Error fetching FAQs:', error);
      } finally {
        setLoadingSpinner(false);
      }
    };

    GetFaq();
  }, []);

  const handleChatClick = () => {
    setShowMessageBox(true);
    makeServerUnreadChatZero();
  };
  const handleCloseMessageBox = () => {
    setShowMessageBox(false);
  };

  const makeServerUnreadChatZero = async () => {
    try {
      const response = await fetchWithAuth(`/chat/user/read/`);

      if (response) {
        console.log('Unread messages set to zero successfully');
        setChatCount(0);
      } else {
        console.log('Error during setting unread messages to zero');
      }
    } catch (error) {
      console.log('Error during setting unread messages to zero:', error);
    }
  };

  return (
    <div className="min-h-screen mt-10">
      {loadingSpinner && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-gray-600 bg-opacity-50">
          <div className="relative">
            <LoadingSpinner />
          </div>
        </div>
      )}

      {!loadingSpinner && (
        <div className="w-4/5 mx-auto pb-10 rounded-lg mt-15">
          <div className="py-5 text-5xl font-semibold text-center text-white">FAQs</div>
          <div className="mx-6">
            <Accordion
              //@ts-expect-error items not compatible
              items={faqs.map(faq => ({
                title: faq.question,
                content: faq.answer,
                isOpenByDefault: false,
              }))}
            />
          </div>

          <div className="mt-10 text-center">
            <Button
              //@ts-expect-error variant type
              variant="expandIcon"
              Icon={IconSend2}
              iconPlacement="right"
              className="text-sm text-white bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700"
              onClick={handleChatClick}
            >
              Chat With Admin
            </Button>
            {showMessageBox && (
              <ChatBox onClose={handleCloseMessageBox} showMessageBox={showMessageBox} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Help;
