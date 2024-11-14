"use client"
import AdvisorsSection from '../components/Landing-page/AdvisorsSection'
import CounterSection from '../components/Landing-page/CounterSection'
import Header from '../components/Landing-page/Header'
import HeroSection from '../components/Landing-page/Hero'
import OurOfferingsSection from '../components/Landing-page/OurOfferingsSection'
import ShortTermDebt from '../components/Landing-page/ShortTermDebtSection'
import React from 'react'
import { transactions } from '../../data/transactions'
import ComplaintRegulated from '../components/Landing-page/ComplaintRegulatedSection'
import ReviewSection from '../components/Landing-page/ReviewSection'
import ContactUsForm from '../components/Landing-page/ContactUsForm'
import JoinUsSection from '../components/Landing-page/JoinUsSection'
import Footer from '../components/Landing-page/Footer'
import FloatingButton from '../components/Landing-page/FloatingButton'
import { useRouter } from "next/navigation";


const Page = () => {
  const router = useRouter();
  return (
    <div className="relative overflow-x-hidden [background:linear-gradient(269.75deg,_#011049,_#19112f_25.75%,_#251431_51.79%,_#301941_64.24%,_#6e3050)] w-full min-h-screen">
      <Header />
      <HeroSection />
      <CounterSection />
      <AdvisorsSection />
      <OurOfferingsSection />
      <ShortTermDebt
        header=" Bill Discounting Transactions"
        data={transactions}
        buttonText={"Load All Transcations"}
      />
      <ComplaintRegulated />
      <ReviewSection />
      <ContactUsForm />
      <JoinUsSection />
      <Footer />
      <FloatingButton />
    </div>
  )
}

export default Page
