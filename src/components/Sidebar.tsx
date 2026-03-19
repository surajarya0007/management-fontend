'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { theme } from '@/lib/theme';
import { staggerContainer, staggerItem, springSnappy } from '@/lib/motion';

const navItems = [
  {
    href: '/Dashboard',
    label: 'Dashboard',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    href: '/ApiInventory',
    label: 'API Inventory',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    href: '/OwaspScan',
    label: 'OWASP Scans',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    href: '/UserManagement',
    label: 'User Management',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    href: '/Settings',
    label: 'Settings',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <motion.aside
      initial={{ x: -24, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={springSnappy}
      className="fixed left-0 top-0 h-full w-64 z-50 flex flex-col"
      style={{ background: theme.surface, borderRight: `1px solid ${theme.border}` }}
    >
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springSnappy, delay: 0.05 }}
        className="flex items-center gap-3 px-5 h-16 shrink-0"
        style={{ borderBottom: `1px solid ${theme.border}` }}
      >
        <motion.div
          whileHover={{ scale: 1.06, rotate: 3 }}
          whileTap={{ scale: 0.95 }}
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-lg"
          style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentHover})`, boxShadow: `0 8px 24px ${theme.accentGlow}` }}
        >
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </motion.div>
        <div>
          <p className="text-sm font-bold text-white leading-none">API Shield</p>
          <p className="text-xs mt-0.5" style={{ color: theme.accentSoft }}>Security Platform</p>
        </div>
      </motion.div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.12 }}
          className="px-3 py-1.5 text-xs font-semibold uppercase tracking-widest mb-2"
          style={{ color: theme.accent }}
        >
          Navigation
        </motion.p>
        <motion.div className="space-y-0.5" variants={staggerContainer} initial="hidden" animate="show">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <motion.div key={item.href} variants={staggerItem}>
                <Link href={item.href} className="block">
                  <motion.div
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium"
                    style={
                      isActive
                        ? {
                            background: theme.accentGlow,
                            color: theme.accentMuted,
                            border: `1px solid ${theme.accentBorder}`,
                          }
                        : { color: theme.textMuted, border: '1px solid transparent' }
                    }
                    whileHover={
                      isActive
                        ? { scale: 1.01 }
                        : { backgroundColor: 'rgba(13,148,136,0.07)', color: theme.textSecondary, x: 4 }
                    }
                    whileTap={{ scale: 0.98 }}
                    transition={springSnappy}
                  >
                    <motion.span
                      style={{ color: isActive ? theme.accentMuted : theme.accent }}
                      animate={isActive ? { scale: [1, 1.15, 1] } : {}}
                      transition={{ duration: 0.35 }}
                    >
                      {item.icon}
                    </motion.span>
                    {item.label}
                    {isActive && (
                      <motion.span
                        layoutId="navDot"
                        className="ml-auto w-1.5 h-1.5 rounded-full"
                        style={{ background: theme.accentSoft }}
                        transition={springSnappy}
                      />
                    )}
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </nav>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="px-3 py-4 shrink-0"
        style={{ borderTop: `1px solid ${theme.border}` }}
      >
        <div className="flex items-center gap-2.5 px-3 py-2">
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ background: theme.pulse }}
            animate={{ scale: [1, 1.25, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span className="text-xs" style={{ color: theme.accent }}>System Online</span>
        </div>
      </motion.div>
    </motion.aside>
  );
};

export default Sidebar;
