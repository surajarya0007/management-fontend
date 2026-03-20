'use client';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Sidebar from './Sidebar';
import { theme } from '@/lib/theme';
import { fadeUp } from '@/lib/motion';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  return (
    <div className="flex h-screen" style={{ background: theme.app }}>
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64 min-w-0">
        <Header />
        <motion.main
          key={pathname}
          className="flex-1 p-6 overflow-y-auto mt-16"
          variants={fadeUp}
          initial="hidden"
          animate="show"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
};

export default Layout;
