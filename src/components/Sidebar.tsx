'use client'
import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const sidebarVariants = {
    open: {
      width: '350px', // Adjust the width of the open sidebar
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      width: '0px', // Sidebar width when closed
      x: '-100%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
  };

  return (
    <div className=''>
      <button 
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 text-white px-4 py-2 rounded "
      >
        {isOpen ? 
        <Image
        src="/cross.svg"
        width={50}
        height={50}
        alt="Picture of the author"
      />
       : 
       <Image
       src="/menu.svg"
       width={40}
       height={40}
       alt="Picture of the author"
     />
       }
      </button>
      <motion.div
        className="fixed top-0 left-0 h-full text-white p-4 shadow-lg z-40 overflow-hidden bg-blue-300"
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
        style={{ width: isOpen ? '350px' : '0px' }}
      >
        <ul className='flex flex-col gap-y-12 text-2xl pt-20'>
          <li className="">
            <a href="/ApiInventory" className="hover:underline">API Inventory</a>
          </li>
          <li className="">
            <a href="/OwaspScan" className="hover:underline">OWASP Scans</a>
          </li>
          <li className="">
            <a href="/Dashboard" className="hover:underline">Dashboard</a>
          </li>
          <li className="">
            <a href="/UserManagement" className="hover:underline">User Management</a>
          </li>
          <li className="">
            <a href="/Settings" className="hover:underline">Settings</a>
          </li>
        </ul>
      </motion.div>
    </div>
  );
};

export default Sidebar;
