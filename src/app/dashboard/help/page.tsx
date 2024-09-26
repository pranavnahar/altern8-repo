"use client";
import React, { useState, useContext, useEffect } from "react";
import ChatBox from "../../../components/mui/Chatbox";
import { DashboardContext } from "../../../Contexts/DashboardContext";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { fetchWithAuth } from "../../../Utils/fetch-with-auth";
import Accordion from "../../../components/ui/accordion";
import { Button } from "../../../components/ui/button";

const page = () => {
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [faqs, setFaqs] = useState([]);
  const [loadingSpinner, setLoadingSpinner] = useState(true);

  const { setChatCount } = useContext(DashboardContext);
  useEffect(() => {
    const GetFaq = async () => {
      try {
        const response = await fetchWithAuth(`/user-dashboard-api/faq/`);

        if (response?.ok) {
          const responseData = await response.json();
          const newFaqs = responseData.map(
            (faq: {
              id: string;
              question: string;
              answer: string;
              image: string;
            }) => ({
              id: faq.id,
              question: faq.question,
              answer: faq.answer,
              image: faq.image,
            })
          );

          setFaqs(newFaqs);
        } else {
          console.error("Failed to fetch FAQs:", response?.status);
        }
      } catch (error) {
        console.log("Error fetching FAQs:", error);
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
      const response = await fetchWithAuth(`/chat/user/mark-read/`);

      if (response?.ok) {
        console.log("Unread messages set to zero successfully");
        setChatCount(0);
      } else {
        console.log("Error during setting unread messages to zero");
      }
    } catch (error) {
      console.log("Error during setting unread messages to zero:", error);
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
        <div className="w-4/5 pb-10 rounded-lg mt-15">
          <div className="py-5 text-3xl text-white font-semibold text-center text-white-font">
            FAQs
          </div>
          <div className="mx-6">
            <Accordion
              items={faqs.map((faq: { question: string; answer: string }) => ({
                title: faq.question,
                content: faq.answer,
                isOpenByDefault: false,
              }))}
            />
          </div>

          <div className="mt-10 text-center">
            <Button
              //Icon={SendHorizonal}
              //iconPlacement="right"
              className="mr-5 rounded-md animation bg-primary hover:bg-primary/90 text-neutral-100"
              onClick={handleChatClick}
            >
              Chat With Admin
            </Button>
            {showMessageBox && (
              <ChatBox
                onClose={handleCloseMessageBox}
                showMessageBox={showMessageBox}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default page;
