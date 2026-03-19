'use client';
import Link from "next/link";
import { useState, useEffect, useRef, MouseEvent } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { theme } from '@/lib/theme';
import { springSnappy, scaleIn } from '@/lib/motion';

const pageTitles: Record<string, string> = {
  '/Dashboard': 'Dashboard',
  '/ApiInventory': 'API Inventory',
  '/OwaspScan': 'OWASP Scans',
  '/UserManagement': 'User Management',
  '/Settings': 'Settings',
  '/Profile': 'Profile',
};

interface UserData {
  name: string;
  email: string;
}

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userData, setUserData] = useState<UserData>({ name: '', email: '' });
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: { username: string; email: string } = jwtDecode(token);
        setUserData({ name: decoded.username, email: decoded.email });
      } catch {
        router.push('/Login');
      }
    } else {
      router.push('/Login');
    }
  }, [router]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownOpen && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside as unknown as EventListener);
    return () => document.removeEventListener('mousedown', handleClickOutside as unknown as EventListener);
  }, [dropdownOpen]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setDropdownOpen(false);
    router.push('/Login');
  };

  const pageTitle = pageTitles[pathname] || 'API Security Shield';
  const initials = userData.name ? userData.name.slice(0, 2).toUpperCase() : 'U';

  return (
    <motion.header
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={springSnappy}
      className="fixed top-0 left-64 right-0 h-16 z-40 flex items-center px-6 justify-between"
      style={{ background: theme.surface, borderBottom: `1px solid ${theme.border}` }}
    >
      <div className="flex items-center gap-3">
        <motion.h1
          key={pageTitle}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={springSnappy}
          className="text-base font-semibold text-white"
        >
          {pageTitle}
        </motion.h1>
        <motion.span
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.08, ...springSnappy }}
          className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
          style={{
            background: theme.accentGlowSoft,
            color: theme.accentMuted,
            border: `1px solid ${theme.accentBorder}`,
          }}
        >
          Live
        </motion.span>
      </div>

      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.06, backgroundColor: theme.accentGlowSoft }}
          whileTap={{ scale: 0.94 }}
          className="relative w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ color: theme.accentSoft }}
        >
          <motion.svg
            fill="none" stroke="currentColor" viewBox="0 0 24 24" width={18} height={18}
            animate={{ rotate: [0, -8, 8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 4 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </motion.svg>
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ background: theme.accentSoft }} />
        </motion.button>

        <div className="relative" ref={dropdownRef}>
          <motion.button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            whileHover={{ backgroundColor: theme.accentGlowSoft }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg"
          >
            <motion.div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0"
              style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentHover})` }}
              whileHover={{ scale: 1.05 }}
            >
              {initials}
            </motion.div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-white leading-none">{userData.name || 'User'}</p>
            </div>
            <motion.svg
              className="w-3.5 h-3.5"
              style={{ color: theme.accent }}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
              animate={{ rotate: dropdownOpen ? 180 : 0 }}
              transition={springSnappy}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </motion.svg>
          </motion.button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                variants={scaleIn}
                initial="hidden"
                animate="show"
                exit="hidden"
                className="absolute right-0 top-12 w-56 rounded-xl z-50 overflow-hidden origin-top-right"
                style={{ background: theme.surface2, border: `1px solid ${theme.border}`, boxShadow: theme.shadow }}
              >
                <div className="px-4 py-3" style={{ background: theme.surface, borderBottom: `1px solid ${theme.border}` }}>
                  <p className="text-sm font-medium text-white">{userData.name}</p>
                  <p className="text-xs mt-0.5 truncate" style={{ color: theme.accentSoft }}>{userData.email}</p>
                </div>
                <div className="p-1.5">
                  <motion.div whileHover={{ x: 2 }} transition={springSnappy}>
                    <Link
                      href="/Profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm"
                      style={{ color: theme.textSecondary }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      View Profile
                    </Link>
                  </motion.div>
                  <motion.button
                    onClick={handleLogout}
                    whileHover={{ x: 2, backgroundColor: 'rgba(239,68,68,0.08)' }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm"
                    style={{ color: '#f87171' }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign out
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
