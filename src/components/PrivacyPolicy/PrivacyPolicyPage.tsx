'use client';
import Header from '../Landing-page/Header';
import CTASection from '../Landing-page/GetStartedCTA';
import Footer from '../Landing-page/Footer';
import FloatingButton from '../Landing-page/FloatingButton';
import React, {useState, useEffect} from 'react';
import { ArrowLeftCircle } from 'lucide-react';
import Link from 'next/link';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';

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

const PrivacyPolicy = () => {
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
        <h1 className="text-3xl font-bold text-gray-200 mb-8 mt-10">Altern8 Privacy Policy</h1>
        </ClothUnrollEffect>

        {/* Text Area for Terms and Conditions */}
        <div className="phone:w-[90%] md:w-[70%] xl:w-[60%] xxl:w-[55%] my-10 mx-auto text-background-black-font text-sm px-6 text-justify">
          <br />
          <p>
            This document is an electronic record in terms of Information Technology Act, 2000 and
            rules there under as applicable and the amended provisions pertaining to electronic
            records in various statutes as amended by the Information Technology Act, 2000. This
            electronic record is generated by a computer system and does not require any physical or
            digital signature.
          </p>
          <br />
          <p>
            This document is published in accordance with the provisions of Rule 3 (1) of the
            Information Technology (Intermediaries guidelines) Rules, 2011 that require publishing
            the rules and regulations, privacy policy and Terms of Use for access or usage of domain
            name <strong>{domainName}</strong> including the related mobile site and mobile application (hereinafter
            referred to as “Platform”)
          </p>
          <br />
          <p>
            This Platform i.e. domain name <strong>{domainName}</strong> including the related mobile site and mobile
            application is owned by <strong>Ekarth Ventures (CIN: U62099TN2024PTC169251)</strong>, having its registered office
            at 46 College Road, Nungambakkam, Chennai, person(s)/entity(ies) associated/connected with it (hereinafter
            referred to as <strong>“Altern8”</strong>/ “We”/”Us”/Our/”), a technological service provider that
            collects, uses, discloses, and protects your information when you use our platform to
            facilitate real estate developers borrowing through the issuance of Non-Convertible
            Debentures (NCDs), OCDs, Structured Notes and other valid instruments. We are committed
            to protecting your privacy and ensuring that your information is handled responsibly and
            securely from real estate entities/users (hereinafter referred to as "You" "Your"
            "Yourself") accessing the Platform.{' '}
          </p>
          <br />
          <p>
            Please read the terms of the Policy carefully before using or registering on the
            Platform or accessing any material, information or Services through the Platform.
            Accessing, browsing or otherwise using the Platform indicates Your agreement to all the
            terms and conditions under this Policy and consent to Our collection, storage, use and
            disclosure of Your corporate and other Information as described in this Policy. The
            terms of this Policy should be considered part of the Terms of Use of Platform as
            provided separately in the Platform. You agree that Your sole and exclusive remedy is to
            discontinue using the Platform. Your compliance with these terms is a condition to Your
            right to access the Platform. Your breach of any provision of these terms will
            automatically, without the requirement of notice or other action, revoke and terminate
            Your right to access the Platform.
          </p>
          <br />
          <p>
            By using Platform and/or registering yourself on Platform You authorize <strong>Altern8</strong> to
            contact you via email, phone call or any other mode and offer You Our services,
            imparting product knowledge and offer promotional offers running on the Platform for
            which reasons Your information may be collected in the manner as detailed under this
            Policy. You hereby agree that You authorize <strong>Altern8</strong> to contact You for the
            above-mentioned purposes even if You have registered yourself under DND or DNC or NCPR
            service(s). Your authorization, in this regard, shall be valid as long as Your account
            is not deactivated by either You or Us.
          </p>
          <br />
          <h2 className="font-bold mt-4">• General</h2>
          <br />
          <p>
            The Privacy Policy (“Privacy Policy”) regulates the usage of the Website of the Platform
            (“Website,” “we,” “us”, “our”) and the Services (“Services”) offered on the Website.
            This Privacy Policy details how We utilize the information You supply during
            registration and the subsequent transaction carried out between the borrower, NBFC and
            the patron. This Privacy Policy pertains exclusively to data collected by <strong>Altern8.</strong>
            <br />
            The Company reserves the right to amend its Privacy Policy at any time. To protect Your
            interests, please revisit this page on a regular basis to review the updated Privacy
            Policy.You agree to accept posting of a revised Privacy Policy as described herein as
            actual notice to you of such revised Privacy Policy. By interacting with Our website,
            submitting forms, or using Our Services, You permit Us to use the information provided
            by you, including any company information and any data We collect from Your
            transactions.{' '}
          </p>
          <br />
          <h2 className="font-bold mt-4">• Scope of Policy </h2>
          <br />
          <p>
            This privacy policy applies to all the information collected through this platform from
            the users as well as services provided by <strong>Altern8</strong> but does not cover any third party
            information, websites or services that may be linked to the platform merely for
            advertisement purposes.{' '}
          </p>
          <br />
          <h2 className="font-bold mt-4">• Information we collect </h2>
          <br />
          <p>
            In order for you to access certain areas of the Website, we may require you to provide
            us with certain information ("Corporate Information").The scope of corporate
            information, as mentioned in this privacy policy, shall include, but not be limited to:
            <br />
            <br />
            • Your corporate name and registered address
            <br />
            • Your email and contact/other contact information
            <br />
            • Your date of incorporation
            <br />
            • Your PAN, GST Details, Account Aggregator Access, ITR, RERA data, Accounting software,
            MCA data , Bureau, all via APIs sometimes with consent (OTP) and sometimes without
            consent,
            <br />
            • Your financial records
            <br />
            • Information regarding your transactions on the website (including transaction history)
            <br />
            • Your financial information such as bank account information, accounts, audit reports,
            profit and loss accounts etc. <br />
            • IP address
            <br />
            • Any other additional elements of "Sensitive Personal Data or information" as defined
            in the Information Technology (Reasonable Security Practices and Procedures and
            Sensitive Personal Data and Information) Rules, 2011, enacted under the Information
            Technology Act, 2000
            <br />
            • Identification code of your communication device, used to access the Website/App or
            interact with any Company entity
            <br />
            • Any other information provided during your registration process, if applicable, on the
            website.
            <br />
            <br />
            In addition to this corporate information, we may collect some additional information
            while you interact with the website. This information typically includes the domain
            name. Other examples of information collected by our server are the Internet Protocol
            (IP) address used to connect your computer to the Internet, the operating system and
            platform, the average time spent on our Website, pages viewed, information searched for,
            access times, websites or applications visited before and after our Website, and other
            relevant statistics. The amount of information sent depends on your web browser
            settings. All such information will be used to assist us in providing an effective
            service on this Website.
            <br />
            <br />
            Moreover, in order to ensure the integrity and reliability of the investment transaction
            being carried out, we may collect some additional financial information such as credit
            rating, past financial transactions or other incidental information from you.
          </p>
          <br />
          <h2 className="font-bold mt-4">• Use of Information Collected </h2><br/>
          The data we gather on the platform will be utilized to operate and enhance the platform,
          ensure a smooth experience, facilitate debt funding for borrowers, analyze user behaviour
          and preferences, and for other legitimate business purposes. The aim of <strong>Altern8</strong> in
          acquiring corporate information is to identify real estate borrowers and send them timely
          updates and essential notifications by postal mail and/or email regarding the issue of
          their debt securities. In addition, We perform demographic and interest research on Our
          members using the information they supply upon registration to improve Our Services. You
          may opt out of receiving marketing communications from <strong>Altern8</strong> at any time by clicking the
          “Unsubscribe” link at the bottom of any marketing email. We are committed to protecting
          Your information and will not share or transfer it to other parties except in accordance
          with this Privacy Policy. <br/><br/>We retain the right to disclose or transfer Your information
          under the following conditions: <br/><br/>• With Your expressed consent. <br/>• When required to respond
          to claims. <br/>• When obligated to follow the law, legal procedures, or authorities. <br/>• When it
          is essential to defend the rights, property, interests, or safety of <strong>Altern8</strong>, its
          employees, users, or the general public. <br/>• In connection with the purchase, merger, or
          sale of all or a portion of Our business. <br/>• When required to be disclosed to the patrons
          or sister companies, NBFCs etc for facilitating the transaction. <strong>Altern8</strong> reserves the
          right, at its sole discretion, to delete or remove any information that you have provided
          or uploaded if it finds that such information violates the terms of this Privacy Policy.<br/><br/>
          <strong>Altern8</strong> will not be liable to you for any such deletion or removal. When registering on
          the Application/Website, You may choose to provide payment information such as credit
          rating, bank account details, and other financial information. We prioritize the security
          of sensitive data and only use approved payment gateways that are digitally encrypted and
          provide the highest level of care available with current technology. We will only use Your
          financial information to complete transactions with the NBFC and patrons.
          <br /><br/>
          <h2 className="font-bold mt-4">• COOKIES</h2><br/>
          Whenever You interact with Us or Our website, <strong>Altern8</strong> may place a “cookie” in Your
          computer's browser files. Cookies are data files that allow Your browser to communicate
          with the website. By default, most browsers accept cookies. However, You can refuse or
          block cookies by altering Your browser settings but Remember that refusing or blocking
          cookies may limit Your ability to use certain features of Our Website and Services
          entirely.
          <br /><br/>
          <h2 className="font-bold mt-4">• Disclosure of Information </h2><br/>
          <strong>Altern8</strong> reserves the right to disclose any information obtained in accordance with this
          policy to any third party patron or the NBFC for the purpose of facilitating the
          transaction for which the service of the platform is availed by the real estate borrower.
          We may share, disclose and in some cases transfer your information to such entities as
          required to provide Services to you, improve our Services, and to provide value added
          services or other third party services, to the extent permitted by applicable law. We
          reserve the right to disclose any information We may have about You if We determine that
          such disclosure is necessary in connection with any investigation or complaint regarding
          Your use of the Platform, or to identify, contact or bring legal action against someone
          who may be causing injury to or interference with (either intentionally or
          unintentionally) <strong>Altern8</strong>'s rights or property, or the rights or property of Users of the
          Platform. We can also disclose your information to any law enforcement agencies or
          regulatory bodies if requested by them due to any violation of the applicable rules and
          regulations by the user. <br/><br/>You acknowledge and agree that We may preserve any communication
          by You with Us through the Platform, and may also disclose such data if required to do so
          by law or if We determine that such preservation or disclosure is reasonably necessary to:<br/><br/>
          (1) comply with legal process; <br/>(2) enforce this Policy; <br/>(3) respond to claims that any
          such data violates the rights of others; or <br/>(4) protect the rights, property or personal
          safety of <strong>Altern8</strong>, its employees, users of, or visitors to, the Platform, and the public.
          We would use reasonable measures to inform You in the event of such disclosure. You
          consent to <strong>Altern8</strong> for verifying Your financial details via an Account Aggregator or any
          other means. The Account Aggregator data is fetched in partnership with <strong>Pee Dee Finvest Ltd.</strong> NBFC and You
          consent to NBFC for processing Your data.
          <br /><br/>
          <h2 className="font-bold mt-4">• Data Security and Data Retention </h2><br/>
          We implement appropriate technical and organizational measures to protect your information
          from unauthorized access, use, or disclosure. However, no method of transmission over the
          internet or method of electronic storage is 100% secure, and we cannot guarantee absolute
          security. We appreciate Your trust in Us by providing Your corporate information, and We
          strive to protect it using commercially acceptable measures. Our company has implemented
          reasonable security practices and procedures to prevent the loss, misuse, and alteration
          of information under Our control. In the event of a security breach, we will take the
          necessary precautions to prevent misuse and may attempt to notify You electronically so
          that You can take appropriate action. However, despite our security measures, third
          parties, such as hackers, may gain unauthorized access to information. By using Our
          Platform, You acknowledge and agree that We will not be held liable for any damages
          resulting from such unauthorized access. Moreover, the corporate information you provide
          is processed by <strong>Altern8</strong> and retained in a way that allows your identification only as long
          as necessary for the purposes for which it was processed. This data retention aligns with
          legal, regulatory, contractual, or statutory obligations. After these periods expire, your
          information will be deleted or archived to comply with legal or contractual retention
          requirements or according to applicable statutory limitation periods.
          <br /><br/>
          <h2 className="font-bold mt-4">• User Rights</h2><br/>
          <p>We take reasonable steps to ensure that your information is accurate, complete, and up to
          date. However, it is your sole responsibility to review the accuracy of the information
          you provide and to contact us if there are any discrepancies or if you wish to discontinue
          using our Services. <br/><br/>You have the following rights concerning your information: <br/><br/>• Right to
          access and update the information You provided. <br/>• To stop us from using your information,
          you may revoke or withdraw your consent by writing to us at <strong>blend@nahar.om</strong>. Please note that if you
          refuse to allow us to use information we deem necessary to provide our Services, we
          reserve the right to limit or refuse to provide our Services to you. <br/>• You have choices
          about the types of marketing communications you receive from us. You may opt out of
          receiving marketing emails by following the instructions in the email or by contacting us
          using the contact information provided at the end of this policy.</p>
          <br /><br/>
          <h2 className="font-bold mt-4">• Link to Third party sites </h2><br/>
          The Platform and any e-mail sent to You may also contain/display third-party
          advertisements and links to other websites or products and services. <strong>Altern8</strong> does not
          share any Information with these third-party websites or agents or advertisers. However,
          it reserves the right to share with You the advertisements on behalf of any other parties.
          The users may also use the third party sites via APIs or other interfaces. However, the
          Company is not responsible for the privacy practices, the content, the authentic nature or
          safety of such other websites. Our Website links to third party sites which we do not
          operate or endorse. These websites may use cookies and collect your personal or
          non-personal information in accordance with their own privacy policies. This Privacy
          Policy does not apply to third party websites and we are not responsible in any manner for
          third party websites. These Linked Sites are solely for advertisement purposes and Altern8
          is not responsible for any form of transmission, whatsoever, received by You from any
          Linked Site. Accordingly, <strong>Altern8</strong> does not make any representations concerning the privacy
          practices or policies of such third parties or terms of use of such websites, nor does it
          control or guarantee the accuracy, integrity, or quality of the information, data, text,
          software, music, sound, photographs, graphics, videos, messages or other materials
          available on such websites. You accept and agree that if you follow any links that direct
          you away from the Site, this privacy policy will not apply to your activity on the other
          websites you visit as we do not control the privacy policies or the privacy practices of
          any associate or third parties.
          <br /><br/>
          <h2 className="font-bold mt-4">• Phishing</h2><br/>
          <p>• Phishing is the name given to attempts to steal personal details and financial account
          details from a website user. <br/>"Phishers" use fake or "spoof" emails to lead users to
          counterfeit websites where the user is tricked into entering their details, such as card
          numbers, user names and passwords. <br/>• If you receive such an e-mail or are asked for your
          password by anyone claiming to work for us please forward the e-mail or report the
          incident by e-mail to our Data Protection Officer. <br/></p>
          <br />
          <h2 className="font-bold mt-4">• Opt-Out Options and Service Notifications</h2><br/>
          <p>As a courtesy to Your privacy, We provide the option to opt out of any
          Services offered on the Website. If You do not opt out of any service, You agree to
          receive information about those Services. We only send You information if You have
          consented to receive it. If You wish to discontinue any Services, You can do so by
          selecting the unsubscribe option in the emails You receive or by using the Website's tabs.
          However, please note that You will not be able to opt out of any service notification that
          may be necessary for the website's operation, or that may be important to You as a user of
          <strong>Altern8</strong>.</p>  <br />
          <h2 className="font-bold mt-4">• Changes to the Privacy policy</h2><br/>
          <p><strong>Altern8</strong> reserves the right to amend, modify or refine this Privacy Policy at its sole
          discretion from time to time, as required or in pursuance of changes in relevant laws. If
          <strong>Altern8</strong> decides to make any changes to this privacy policy, it will post those changes on
          this page so that you are always aware of what information we collect, how we use it, and
          under what circumstances we disclose it. However, the <strong>Altern8</strong> is not responsible for
          communicating you about any such changes and you are required to be informed yourself
          about any such changes made to this privacy policy. Your use of the Website's Services
          following a change in its Privacy Policy constitutes acceptance of the updated Privacy
          Policy.</p>
          <br /><br/>
          <h2 className="font-bold mt-4">• Governing Law and Dispute Resolution</h2><br/>
          <p>This Policy shall be governed by and construed in accordance with the applicable laws in
          India. Courts at <strong>Chennai, India</strong> shall have the exclusive jurisdiction over the subject
          matters of this Policy. Any disputes relating to this Policy shall be subject to the award
          of the sole arbitrator to be appointed by the <strong>President - Chennai Arbitration Centre</strong> in
          accordance with its rules and subject to the provisions of the Arbitration and
          Conciliation Act, 1996 as amended from time to time. The venue of such Arbitration shall
          be the city of <strong>Chennai, India</strong> and language of Arbitration shall be <strong>English</strong>.</p>
          
          <br /><br/>
          <h2 className="font-bold mt-4">• Contact </h2><br/>
          <p>For any queries related to privacy policy You can contact Us at <a href="mailto:blend@nahar.om">blend@nahar.om</a> if You have any
          feedback or comments, believe We are not following Our Privacy Policy, or wish to remove
          something that violates a specific regulation.</p>
        </div>
      </div>

      <CTASection />
      <Footer />
      <FloatingButton />
      </ClothUnrollEffect>
    </div>
  );
};

export default PrivacyPolicy;
