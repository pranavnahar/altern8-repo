import Link from "next/link";
import { FC } from "react";
import AnimatedLogo from "../Header/AnimatedLogo";

const Header: FC = () => {
    return (
        <header className="max-w-[1320px] flex flex-row items-center mx-auto px-5 2xl:px-0 pt-8 justify-between text-left text-5xl sm:text-21xl lg:text-29xl text-white-font">
            {/* logo or website name */}
            {/* <a
                className="[text-decoration:none] font-exo relative font-semibold text-[inherit]"
                href="/"
            > */}
            <AnimatedLogo />
            {/* </a> */}

            {/* register button link */}
            <Link
                href="/register"
                className="relative inline-flex items-center h-[40px] w-[130px] sm:h-[50px] sm:w-[200px] justify-center p-4 px-6 py-3 overflow-hidden font-medium text-white-font transition duration-300 ease-out rounded-full group"
            >
                <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white-font duration-300 -translate-x-full bg-[#1565c0] group-hover:translate-x-0 ease">
                    <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                        ></path>
                    </svg>
                </span>
                <span className="absolute flex items-center font-normal justify-center h-full w-full text-base2 sm:text-xl lg:text-5xl text-white-font bg-[#1565c0] transition-all duration-300 transform group-hover:translate-x-full ease">
                    Get Credit
                </span>
                <span className="relative invisible">Get Credit</span>
            </Link>
        </header>
    );
};

export default Header;
