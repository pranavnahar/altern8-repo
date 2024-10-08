"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import { parseCookies } from "nookies";
import LoadingSpinner from "../../../components/LoadingSpinner";
import AnimatedLogo from "../../../components/Header/AnimatedLogo";
import { IconChevronRight, IconSend2 } from "@tabler/icons-react";


const HelpPage = () => {

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [problem, setProblem] = useState<{
    [key: string]: string;
  }>({});
  const [loadingSpinner, setLoadingSpinner] = useState(true);

  const router = useRouter();

  let accessToken = parseCookies().altern8_useraccess;
  useEffect(() => {
    const GetFaq = async () => {
      try {
        setLoadingSpinner(true);
        let response = await fetch(`${apiUrl}/user-api/faq/`, {});

        if (response.ok) {
          const responseData = await response.json();

          let addProblem = {};
          for (let i = 0; i < responseData.length; i++) {
            const additionalData = {
              [responseData[i]["question"]]: responseData[i]["answer"],
            };
            addProblem = { ...addProblem, ...additionalData };
          }
          const newProblem = { ...problem, ...addProblem };
          setProblem(newProblem);
        } else {
          console.error("Failed to fetch faqs:", response.status);
        }
      } catch (error) {
        console.log("error during getting faqs");
      } finally {
        setLoadingSpinner(false);
      }
    };

    GetFaq();
  }, []);

  const handleClickLogo = () => {
    router.push("/");
  };

  const handleClickRegister = () => {
    router.push("/register");
  };

  return (
    <div className="relative flex flex-row items-center justify-center [background:linear-gradient(269.75deg,_#011049,_#19112f_25.75%,_#251431_51.79%,_#301941_64.24%,_#6e3050)] w-full">
      {/* <div className="relative [background:linear-gradient(269.75deg,_#011049,_#19112f_25.75%,_#251431_51.79%,_#301941_64.24%,_#6e3050)] w-full h-[5584px] overflow-hidden flex flex-col items-start justify-start py-[39px] px-[82px] box-border gap-[177px]"> */}

      {loadingSpinner && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center  bg-opacity-50 z-50   [background:linear-gradient(269.75deg,_#011049,_#19112f_25.75%,_#251431_51.79%,_#301941_64.24%,_#6e3050)]">
          <div className="relative">
            <LoadingSpinner />
          </div>
        </div>
      )}
      {!loadingSpinner && (
        <div className="justify-center  max-w-[1320px]">
          <div className="flex justify-center items-center pb-4 mt-10 text-5xl text-center sm:text-10xl lg:text-20xl text-white-font font-exo letter-spacing-2">
            <a href="#" onClick={handleClickLogo}>
              <AnimatedLogo />
            </a>
          </div>

          <div className="min-h-screen flex flex-row item-center justify-center  max-w-[1320px]">
            <div className="w-4/5 pb-10 rounded-lg ">
              <div className="flex items-center justify-between mx-6 ">
                {/* register button link  */}
                <div className="mt-5 text-center ">
                  {accessToken && (
                    <Button
                      style={{
                        backgroundColor: "#1565c0",
                        borderRadius: "25px", // Adjust the pixel value for the desired border radius
                      }}
                      variant="contained"
                      onClick={handleClickRegister}
                    >
                      Get Credit
                    </Button>
                  )}
                </div>
                {/* chat button  */}
                <div className="mt-5 ">
                  {accessToken && (
                    <Button
                      style={{
                        backgroundColor: "#1565c0",
                        borderRadius: "25px", // Adjust the pixel value for the desired border radius
                      }}
                      variant="contained"
                      startIcon={<IconSend2 />}
                    //onClick={handleChatClick}
                    >
                      Chat With Admin
                    </Button>
                  )}
                  {/* chatbox  */}

                  {/* <ChatBox
                    onClose={handleCloseMessageBox}
                    showMessageBox={showMessageBox}
                  /> */}
                </div>
              </div>

              {/* FAQs section  */}
              <div className="py-5 text-5xl font-semibold text-center text-white-font">
                FAQs
              </div>
              <div className="mx-6 ">
                {Object.entries(problem).map(([problem, solution], index) => (
                  <Accordion
                    key={index}
                    style={{
                      backgroundColor: "#C3E1EF",
                      borderRadius: "8px", // Adjust the pixel value for the desired border radius
                      marginBottom: "16px", // Adjust the pixel value for the desired margin
                      color: "#333",
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<IconChevronRight />}
                      aria-controls={`panel${index + 1}-content`}
                      id={`panel${index + 1}-header`}
                    >
                      <Typography>{problem}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>{solution}</Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </div>

              {/* chat button  */}
              <div className="mt-10 text-center ">
                {accessToken && (
                  <Button
                    style={{
                      backgroundColor: "#1565c0",
                      borderRadius: "25px",
                    }}
                    variant="contained"
                    startIcon={<IconSend2 />}
                  >
                    Chat With Admin
                  </Button>
                )}
              </div>

              <div className="flex flex-row justify-between pb-1 mx-6 text-sm text-gray-300 ">
                <div>
                  <a
                    href="#"
                    onClick={handleClickRegister}
                    className="mx-2 font-medium text-indigo-500"
                  >
                    Register Page
                  </a>
                </div>
                <div>
                  Already registered?
                  <Link
                    href="/login"
                    className="mx-2 font-medium text-indigo-600"
                  >
                    Login Here
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpPage;
