import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingButton = () => {
  const [isOpen, setIsOpen] = useState(true);
  const floater = useRef(null);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const socialLinks = [
    { name: 'WhatsApp', bg: 'bg-green-500', icon: '/icons/whatsapp.png' },
    { name: 'LinkedIn', bg: ' bg-blue-700', icon: '/icons/linkedIn.png' },
    { name: 'Twitter', bg: ' bg-black', icon: '/icons/twitter.png' },
    { name: 'Facebook', bg: 'bg-blue-600', icon: '/icons/facebook.svg' },
    // {
    //   name: 'Instagram',
    //   bg: 'bg-gradient-to-r from-purple-400 via-pink-500 to-red-500',
    //   icon: '/instagram.png',
    // },
  ];

  const handleShare = (platform: string) => {
    let shareUrl = '';
    let shareText = process.env.NEXT_PUBLIC_DESCRIPTION;
    let linkUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;

    switch (platform) {
      case 'WhatsApp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} : ${linkUrl}`)}`;
        break;
      case 'LinkedIn':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          linkUrl as string,
        )}`;
        break;
      case 'Twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          linkUrl as string,
        )}&text=${encodeURIComponent(shareText as string)}`;
        break;
      case 'Facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          linkUrl as string,
        )}`;
        break;
      // case 'Instagram':
      //   shareUrl = `https://www.instagram.com/`;
      //   break;
      default:
        return;
    }

    window.open(shareUrl, '_blank');
  };

  const sidebarVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.5,
        when: 'beforeChildren',
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="fixed bottom-3 right-0 [background:linear-gradient(65.92deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050_99.08%),_#fff] p-2 rounded-l-lg flex flex-col items-end space-y-2"
      ref={floater}
      variants={sidebarVariants}
    >
      <div className="mb-2">
        <p className="text-sm font-bold text-center text-white uppercase">Share</p>
        <p className="text-sm font-bold text-center text-white uppercase">It on</p>
      </div>
      {socialLinks.map((links, index) => (
        <motion.a
          key={index}
          onClick={() => handleShare(links?.name)}
          variants={itemVariants}
          className={`rounded-full h-10 w-10 ${links?.bg} text-white flex items-center justify-center cursor-pointer`}
        >
          <img src={links?.icon} alt={links?.name} className="object-center" />
        </motion.a>
      ))}
    </motion.div>
  );
};

export default FloatingButton;
