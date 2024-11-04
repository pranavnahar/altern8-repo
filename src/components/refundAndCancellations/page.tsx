import React, { FC } from 'react';

const RefundAndCancellations: FC = () => {
  const headingClassName = 'mb-4 text-[14px] font-semibold text-white';
  const contentClassName = 'mb-6 text-[13px]';

  return (
    <div className="max-w-[95%] sm:max-w-[90%] lg:max-w-[1320px] mx-auto text-background-black-font rounded-lg p-8">
      <h1 className="text-xl font-bold mb-4 text-white">Refund and Cancellations - Ethyx</h1>
      <p className={contentClassName}>
        The Terms and Conditions contained herein shall apply to any person (“User”) using the
        services of Ekarth Ventures Private Limited (“Ethyx Club”) and its Affiliates for making
        payments through an online payment gateway service offered by various payment service
        providers (“Payment Service Provider(s)”), through the Ethyx Club portal hosted at{' '}
        <strong> http://ethyx.in/ </strong>.(“Website”). Each User is therefore deemed to have read
        and accepted these Terms and Conditions. Any notice, intimation or communication to be made
        to Ethyx Club under this policy shall be made to <strong> blend@nahar.om </strong>.
      </p>

      {/* Section 3 */}
      <div className="my-10">
        <h2 className={headingClassName}>1. For Chargeback Transactions:</h2>
        <p className={contentClassName}>
          1.1 In these Terms and Conditions, the term “Chargeback” shall mean, approved and settled
          credit card or net banking purchase transaction(s) which are at any time refused, debited
          or charged back to merchant account (and shall also include similar debits to Payment
          Service Provider's accounts, if any) by the acquiring bank or credit card company for any
          reason whatsoever, together with the bank fees, penalties and other charges incidental
          thereto.
        </p>
        <p className={contentClassName}>
          1.2 In the event there is any claim for/ of charge back by the User for any reason
          whatsoever, such user shall immediately intimate Ethyx Club of the same. Such refund (if
          any) shall be effected by Ethyx Club via payment gateway or such other means as Ethyx
          Club, deems appropriate. No claims for refund/chargeback shall be made by any User to the
          Payment Service Provider(s) and in the event such claim is made it shall not be
          entertained.
        </p>

        <div className="my-10">
          <h2 className={headingClassName}>2. Refund for fraudulent/duplicate transaction(s):</h2>
          <p className={contentClassName}>
            2.1 The User shall contact Ethyx Club for any fraudulent transaction(s) on account of
            misuse of card/ Bank details by a fraudulent individual/party and such issues shall be
            suitably addressed by Ethyx Club in line with their policies and rules.
          </p>
          <p className={contentClassName}>
            2.2 The time required to process a refund may vary depending on factors such as the
            payment method, financial institution processing times, and the complexity of the refund
            request. Provided that no refund request in respect of a transaction settled by Ethyx
            Club to the final beneficiary will be considered.
          </p>
          <p className={contentClassName}>
            2.3 Subject to the above, Ethyx Club will make reasonable efforts to process refunds
            within 5-7 business days from the date on which the refund request was initiated. Once
            the User’s refund request is raised, Ethyx Club will send an email to notify the User of
            the approval or rejection of the refund request. If the request is approved, then the
            User's refund will be processed within 5-7 business days from the date on which the
            request for refund was approved by us.
          </p>
        </div>

        <div className="my-10">
          <h2 className={headingClassName}>1. For Chargeback Transactions:</h2>
          <p className={contentClassName}>
            1.1 In these Terms and Conditions, the term “Chargeback” shall mean, approved and
            settled credit card or net banking purchase transaction(s) which are at any time
            refused, debited or charged back to merchant account (and shall also include similar
            debits to Payment Service Provider's accounts, if any) by the acquiring bank or credit
            card company for any reason whatsoever, together with the bank fees, penalties and other
            charges incidental thereto.
          </p>
          <p className={contentClassName}>
            1.2 In the event there is any claim for/ of charge back by the User for any reason
            whatsoever, such user shall immediately intimate Ethyx Club of the same. Such refund (if
            any) shall be effected by Ethyx Club via payment gateway or such other means as Ethyx
            Club, deems appropriate. No claims for refund/chargeback shall be made by any User to
            the Payment Service Provider(s) and in the event such claim is made it shall not be
            entertained.
          </p>
        </div>

        <div className="my-10">
          <h2 className={headingClassName}>3. Server Slow Down/Session Timeout:</h2>
          <p className={contentClassName}>
            3.1 In case the Website or Payment Service Provider's webpage, that is linked to the
            Website, is experiencing any server related issues like 'slowdown' or 'failure' or
            'session timeout', the User shall, before initiating the second payment, check whether
            his/her bank account has been debited or not and accordingly resort to one of the
            following options:
          </p>
          <ol className="list-[lower-alpha] ml-6 list-inside space-y-4">
            <li className={`${contentClassName} ml-6`}>
              1. In case the bank account appears to be debited, ensure that he/she does not make
              the payment twice and immediately thereafter contact Ethyx Club via e-mail or any
              other mode of contact as provided by Ethyx Club to confirm payment.
            </li>
            <li className={`${contentClassName} ml-6`}>
              2. In case the bank account is not debited, the User may initiate a fresh transaction
              to make payment.
            </li>
          </ol>
          <br />
          <p className={contentClassName}>
            However, the User agrees that under no circumstances the Payment Service Provider(s)
            shall be held responsible for such fraudulent/duplicate transactions and hence no claims
            should be raised to Payment Service Provider(s).
          </p>
        </div>

        <div className="my-10">
          <h2 className={headingClassName}>4. Cancellation:</h2>
          <p className={contentClassName}>
            4.1 Please contact Ethyx Club via<strong> http://ethyx.in/ </strong>, or call us using
            the information provided on the Website.
          </p>
          <p className={contentClassName}>
            4.2 Ethyx Club will revert back to the User regarding Cancellation requests made within
            5 business days from the date of request.
          </p>
          <ol className="list-[lower-alpha] ml-6 list-inside space-y-4">
            <li className={`${contentClassName} ml-6`}>
              The fees paid towards account opening charges to enable the Patron’s accounts is
              non-refundable. This fee is used towards initiation of an account by a Patron and
              there are various charges involved even if the account is not completely opened and
              activated as well. The initiation of an account includes charges for electronic data
              entry & maintenance, KYC, e-signing, the printing of any documents, and operational
              costs of the business
            </li>
            <li className={`${contentClassName} ml-6`}>
              Pick up of the required documentation for account opening is subject to the
              availability of our representatives at any particular time and location. This service
              shall be separately chargeable to compensate for the effort undertaken in this regard.
              These charges are non-refundable.
            </li>
            <li className={`${contentClassName} ml-6`}>
              In case Ethyx Club fails to open an account within 10 days of submission of all the
              necessary supporting documentation and authorisations by the Patron, such Patrons may
              request a full refund of all the charges paid towards account opening.
            </li>
            <li className={`${contentClassName} ml-6`}>
              In case a Patron has paid the charges relating to account opening multiple times, such
              Patrons are requested to create a ticket via <strong>blend@nahar.om</strong>. Upon
              being so intimated, Ethyx Club shall initiate the necessary procedure to refund these
              amounts to the Patron.
            </li>
            <li className={`${contentClassName} ml-6`}>
              In case the account opening fee is paid, but the account has not been activated (a
              Patron ID and password have not yet been generated), a request to initiate a refund
              with a clear reason can be sent by the Patron to Ethyx Club. As the account opening
              fee includes various charges to initiate the account opening process itself, as stated
              in the first point above, no charges are refunded automatically. All refund requests
              will be considered by Ethyx Club on a case to case basis.
              <br />
              <br />
              Patrons understand that completion of all refund procedures initiated by Ethyx Club is
              subject to fulfilment by the relevant third party agencies including banks and payment
              gateways.
            </li>
          </ol>
          <br />
        </div>
      </div>
    </div>
  );
}

export default RefundAndCancellations;
