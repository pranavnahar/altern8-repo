"use client"

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ShareMessageDialog from '../shareInstaMessageDialog';

const FloatingButton = () => {
    const [isOpen, setIsOpen] = useState(true);
    const floater = useRef(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    const toggleDialog = () => {
        setIsDialogOpen(!isDialogOpen);
      };
    
    
    const redirectToInstagram = () => {
        window.open('https://www.instagram.com', '_blank');
  };

    const socialLinks = [
        { name: 'WhatsApp', bg: 'bg-green-500', icon: '/icons/whatsapp.png' },
        { name: 'LinkedIn', bg: 'bg-blue-700', icon: '/icons/linkedIn.png' },
        { name: 'Twitter', bg: 'bg-black', icon: '/icons/twitter.png' },
        { name: 'Facebook', bg: 'bg-blue-600', icon: '/icons/facebook.svg' },
        // { name: 'Mail', bg: 'bg-gray-400', icon: '/mail.png' },
        {
          name: 'Instagram',
          bg: 'bg-gradient-to-r from-purple-400 via-pink-500 to-red-500',
          icon: '/icons/instagram.png',
        },
        

    ];

    const handleShare = (platform: string) => {
        const shareText = "Check out this page!";
        const linkUrl = window.location.href; 
        let shareUrl = '';

        switch (platform) {
            case 'WhatsApp':
                shareUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${linkUrl}`)}`;
                window.open(shareUrl, '_blank');
                break;
            case 'LinkedIn':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(linkUrl)}`;
                window.open(shareUrl, '_blank');
                break;
            case 'Twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(linkUrl)}&text=${encodeURIComponent(shareText)}`;
                window.open(shareUrl, '_blank');
                break;
            case 'Facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(linkUrl)}`;
                window.open(shareUrl, '_blank');
                break;
            case 'Instagram':
              toggleDialog();
              break;
            // case 'Mail' : 
            //     shareUrl = 
            //       `mailto:?subject=Check this out!&body=${shareText}${encodeURIComponent(
            //         linkUrl as string,
            //     )}`
            //     break;
            default:
                return;
        }
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
                    onClick={() => handleShare(links.name)}
                    variants={itemVariants}
                    className={`rounded-full h-10 w-10 ${links.bg} text-white flex items-center justify-center cursor-pointer`}
                >
                    <img src={links?.icon} alt={links?.name} className={links?.name === "Mail" ? "object-cover w-7 h-7" : "object-center"} />
                </motion.a>
                
            ))}
            <ShareMessageDialog isOpen={isDialogOpen} onClose={toggleDialog} onRedirectToInstagram={redirectToInstagram} />
        </motion.div>
    );
};

export default FloatingButton;
