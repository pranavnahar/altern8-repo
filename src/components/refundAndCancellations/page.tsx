'use client';
import React, { FC, useEffect, useState } from 'react';
import Header from '../Landing-page/Header';
import Footer from '../Landing-page/Footer';
import CTASection from '../Landing-page/GetStartedCTA';
import { ArrowLeftCircle } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ClothUnrollEffectProps {
  children: ReactNode;
}

const ClothUnrollEffect = ({ children }: ClothUnrollEffectProps) => {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{
        height: '100%',
        opacity: 1,
        transition: {
          duration: 2.5,
          ease: [0.45, 1, 0.59, 1], // Custom easing for smooth unroll
        },
      }}
      style={{
        overflow: 'hidden', // Prevents content from being visible until unrolled
        transformOrigin: 'top center',
      }}
    >
      <motion.div
        initial={{ y: -20 }}
        animate={{
          y: 0,
          transition: {
            duration: 0.7,
            ease: 'easeOut',
          },
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

const RefundAndCancellations: FC = () => {
  const headingClassName = 'mb-4 font-bold mt-4 ';
  const contentClassName = 'mb-6 ';

  const [domainName, setDomainName] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDomainName(window.location.hostname);
    }
  }, []);

  return (
    <div className="relative overflow-x-hidden [background:linear-gradient(269.75deg,_#011049,_#19112f_25.75%,_#251431_51.79%,_#301941_64.24%,_#6e3050)] w-full min-h-screen">
      <Header />
      <ClothUnrollEffect>
        <div className="flex items-center justify-start ml-14 mt-10 space-x-2">
          <Link href="/">
            <button className="flex items-center text-gray-400 text-[13.5px] font-medium hover:underline hover:text-purple-400">
              <ArrowLeftCircle className="w-4 h-4" /> {/* Adjusted icon size */}
              <span>&nbsp;back to home</span>
            </button>
          </Link>
        </div>

        <div className="flex flex-col items-center justify-center py-16">
          <ClothUnrollEffect>
            <h1 className="text-3xl font-bold text-gray-200 mb-8 mt-10">
              Refund and Cancellations - Altern8
            </h1>
          </ClothUnrollEffect>

          <div className="phone:w-[90%] md:w-[70%] xl:w-[60%] xxl:w-[55%] my-10 mx-auto text-background-black-font text-sm text-justify px-6">
            <p className={contentClassName}>
              The Terms and Conditions contained herein shall apply to any person (<strong>"User”</strong>) using the
              services of <strong>Ekarth Ventures Private Limited </strong> (<strong>"Altern8"</strong>) and its Affiliates for
              making payments through an online payment gateway service offered by various payment
              service providers (“Payment Service Provider(s)”), through the <strong>Altern8</strong> portal
              hosted at <strong> {domainName} </strong>.(“Website”). Each User is therefore deemed
              to have read and accepted these Terms and Conditions. Any notice, intimation or
              communication to be made to <strong>Altern8</strong> under this policy shall be made to{' '}
              <strong> blend@nahar.om </strong>.
            </p>

            {/* Section 3 */}
            <div className="my-10">
              <h2 className={headingClassName}>1. For Chargeback Transactions:</h2>
              <p className={contentClassName}>
                1.1 In these Terms and Conditions, the term “Chargeback” shall mean, approved and
                settled credit card or net banking purchase transaction(s) which are at any time
                refused, debited or charged back to merchant account (and shall also include similar
                debits to Payment Service Provider's accounts, if any) by the acquiring bank or
                credit card company for any reason whatsoever, together with the bank fees,
                penalties and other charges incidental thereto.
              </p>
              <p className={contentClassName}>
                1.2 In the event there is any claim for/ of charge back by the User for any reason
                whatsoever, such user shall immediately intimate <strong>Altern8</strong> of the same. Such
                refund (if any) shall be effected by <strong>Altern8</strong> via payment gateway or such other
                means as <strong>Altern8</strong>, deems appropriate. No claims for refund/chargeback shall be
                made by any User to the Payment Service Provider(s) and in the event such claim is
                made it shall not be entertained.
              </p>

              <div className="my-10">
                <h2 className={headingClassName}>
                  2. Refund for fraudulent/duplicate transaction(s):
                </h2>
                <p className={contentClassName}>
                  2.1 The User shall contact <strong>Altern8</strong> for any fraudulent transaction(s) on
                  account of misuse of card/ Bank details by a fraudulent individual/party and such
                  issues shall be suitably addressed by <strong>Altern8</strong> in line with their policies and
                  rules.
                </p>
                <p className={contentClassName}>
                  2.2 The time required to process a refund may vary depending on factors such as
                  the payment method, financial institution processing times, and the complexity of
                  the refund request. Provided that no refund request in respect of a transaction
                  settled by <strong>Altern8</strong> to the final beneficiary will be considered.
                </p>
                <p className={contentClassName}>
                  2.3 Subject to the above, <strong>Altern8</strong> will make reasonable efforts to process
                  refunds within 5-7 business days from the date on which the refund request was
                  initiated. Once the User's refund request is raised, <strong>Altern8</strong> will send an
                  email to notify the User of the approval or rejection of the refund request. If
                  the request is approved, then the User's refund will be processed within 5-7
                  business days from the date on which the request for refund was approved by us.
                </p>
              </div>

              <div className="my-10">
                <h2 className={headingClassName}>1. For Chargeback Transactions:</h2>
                <p className={contentClassName}>
                  1.1 In these Terms and Conditions, the term “Chargeback” shall mean, approved and
                  settled credit card or net banking purchase transaction(s) which are at any time
                  refused, debited or charged back to merchant account (and shall also include
                  similar debits to Payment Service Provider's accounts, if any) by the acquiring
                  bank or credit card company for any reason whatsoever, together with the bank
                  fees, penalties and other charges incidental thereto.
                </p>
                <p className={contentClassName}>
                  1.2 In the event there is any claim for/ of charge back by the User for any reason
                  whatsoever, such user shall immediately intimate <strong>Altern8</strong> of the same. Such
                  refund (if any) shall be effected by <strong>Altern8</strong> via payment gateway or such
                  other means as <strong>Altern8</strong>, deems appropriate. No claims for refund/chargeback
                  shall be made by any User to the Payment Service Provider(s) and in the event such
                  claim is made it shall not be entertained.
                </p>
              </div>

              <div className="my-10">
                <h2 className={headingClassName}>3. Server Slow Down/Session Timeout:</h2>
                <p className={contentClassName}>
                  3.1 In case the Website or Payment Service Provider's webpage, that is linked to
                  the Website, is experiencing any server related issues like 'slowdown' or
                  'failure' or 'session timeout', the User shall, before initiating the second
                  payment, check whether his/her bank account has been debited or not and
                  accordingly resort to one of the following options:
                </p>
                <ol className="list-[lower-alpha] ml-6 list-inside space-y-4">
                  <li className={`${contentClassName} ml-6`}>
                    1. In case the bank account appears to be debited, ensure that he/she does not
                    make the payment twice and immediately thereafter contact <strong>Altern8</strong> via
                    e-mail or any other mode of contact as provided by <strong>Altern8</strong> to confirm
                    payment.
                  </li>
                  <li className={`${contentClassName} ml-6`}>
                    2. In case the bank account is not debited, the User may initiate a fresh
                    transaction to make payment.
                  </li>
                </ol>
                <br />
                <p className={contentClassName}>
                  However, the User agrees that under no circumstances the Payment Service
                  Provider(s) shall be held responsible for such fraudulent/duplicate transactions
                  and hence no claims should be raised to Payment Service Provider(s).
                </p>
              </div>

              <div className="my-10">
                <h2 className={headingClassName}>4. Cancellation:</h2>
                <p className={contentClassName}>
                  4.1 Please contact <strong>Altern8</strong> via<strong> {domainName} </strong>, or call us
                  using the information provided on the Website.
                </p>
                <p className={contentClassName}>
                  4.2 <strong>Altern8</strong> will revert back to the User regarding Cancellation requests made
                  within 5 business days from the date of request.
                </p>
                <ol className="list-[lower-alpha] ml-6 list-inside space-y-4">
                  <li className={`${contentClassName} ml-6`}>
                    The fees paid towards account opening charges to enable the Patron’s accounts is
                    non-refundable. This fee is used towards initiation of an account by a Patron
                    and there are various charges involved even if the account is not completely
                    opened and activated as well. The initiation of an account includes charges for
                    electronic data entry & maintenance, KYC, e-signing, the printing of any
                    documents, and operational costs of the business
                  </li>
                  <li className={`${contentClassName} ml-6`}>
                    Pick up of the required documentation for account opening is subject to the
                    availability of our representatives at any particular time and location. This
                    service shall be separately chargeable to compensate for the effort undertaken
                    in this regard. These charges are non-refundable.
                  </li>
                  <li className={`${contentClassName} ml-6`}>
                    In case <strong>Altern8</strong> fails to open an account within 10 days of submission of
                    all the necessary supporting documentation and authorisations by the Patron,
                    such Patrons may request a full refund of all the charges paid towards account
                    opening.
                  </li>
                  <li className={`${contentClassName} ml-6`}>
                    In case a Patron has paid the charges relating to account opening multiple
                    times, such Patrons are requested to create a ticket via{' '}
                    <strong>blend@nahar.om</strong>. Upon being so intimated, <strong>Altern8</strong> shall
                    initiate the necessary procedure to refund these amounts to the Patron.
                  </li>
                  <li className={`${contentClassName} ml-6`}>
                    In case the account opening fee is paid, but the account has not been activated
                    (a Patron ID and password have not yet been generated), a request to initiate a
                    refund with a clear reason can be sent by the Patron to <strong>Altern8</strong>. As the
                    account opening fee includes various charges to initiate the account opening
                    process itself, as stated in the first point above, no charges are refunded
                    automatically. All refund requests will be considered by <strong>Altern8</strong> on a case
                    to case basis.
                    <br />
                    <br />
                    Patrons understand that completion of all refund procedures initiated by <strong>Altern8</strong>
                    is subject to fulfilment by the relevant third party agencies including
                    banks and payment gateways.
                  </li>
                </ol>
                <br />
              </div>
            </div>
          </div>
          
        </div>

        <CTASection />
        <Footer />
      </ClothUnrollEffect>
    </div>
  );
};

export default RefundAndCancellations;
