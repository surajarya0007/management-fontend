"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { getLocalStorgeToken } from "@/components/getToken";
import { API_BASE } from "@/lib/api";

const LoginPage: React.FC = () => {
  const token = getLocalStorgeToken();

  useEffect(() => {
    if (token) {
      window.location.href = "/Dashboard";
    }
  }, [token]);

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    fullname: "",
    role: "",
  });

  const handleToggleForm = () => {
    setIsLogin(!isLogin);
    setError("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      let response;
      if (isLogin) {
        response = await axios.post(`${API_BASE}/login`, formData);
      } else {
        response = await axios.post(`${API_BASE}/user/signup`, formData);
      }
      const { token } = response.data;
      if (token && typeof window !== "undefined") {
        localStorage.setItem("token", token);
      }
      window.location.reload();
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError?.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    background: '#0f1314',
    border: '1px solid #1f2e2d',
    color: '#f0fdfa',
    width: '100%',
    borderRadius: '8px',
    padding: '10px 12px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.15s',
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#050708' }}>
      {/* Left panel — branding */}
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 30 }}
        className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #050708 0%, #052e2a 35%, #0a1f1c 65%, #050708 100%)' }}
      >
        {/* Background grid */}
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(13,148,136,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(13,148,136,0.4) 1px, transparent 1px)`,
            backgroundSize: '44px 44px',
          }}
          animate={{ opacity: [0.08, 0.14, 0.08] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Glow orbs */}
        <motion.div
          className="absolute top-1/4 left-1/3 w-72 h-72 rounded-full blur-3xl"
          style={{ background: 'rgba(13,148,136,0.12)' }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.85, 0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full blur-3xl"
          style={{ background: 'rgba(52,211,153,0.08)' }}
          animate={{ scale: [1, 1.12, 1], x: [0, 12, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative z-10">
          <motion.div
            className="flex items-center gap-3 mb-16"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <motion.div
              whileHover={{ scale: 1.08, rotate: 4 }}
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #0d9488, #14b8a6)' }}
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </motion.div>
            <span className="text-xl font-bold text-white">API Security Shield</span>
          </motion.div>

          <motion.h2
            className="text-4xl font-bold text-white leading-tight mb-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Protect your APIs.<br />
            <motion.span style={{ color: '#2dd4bf' }} animate={{ opacity: [0.85, 1, 0.85] }} transition={{ duration: 3, repeat: Infinity }}>Secure your future.</motion.span>
          </motion.h2>
          <motion.p
            className="text-base leading-relaxed max-w-sm"
            style={{ color: '#5a9e96' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.28 }}
          >
            A unified platform for API inventory management, vulnerability scanning, and security compliance.
          </motion.p>
        </div>

        <motion.div
          className="relative z-10 space-y-4"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.35 } } }}
        >
          {[
            { icon: '🛡️', text: 'Real-time vulnerability scanning' },
            { icon: '🔍', text: 'OWASP Top 10 compliance checks' },
            { icon: '📊', text: 'Security dashboards and reporting' },
          ].map((feature) => (
            <motion.div
              key={feature.text}
              className="flex items-center gap-3"
              variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0 } }}
              whileHover={{ x: 6 }}
            >
              <motion.span className="text-lg" whileHover={{ scale: 1.2 }}>{feature.icon}</motion.span>
              <span className="text-sm" style={{ color: '#5a9e96' }}>{feature.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Right panel — form */}
      <motion.div
        className="w-full lg:w-1/2 flex items-center justify-center p-8"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 28, delay: 0.05 }}
      >
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login" : "signup"}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
            >
              {/* Mobile logo */}
              <div className="flex items-center gap-2 mb-8 lg:hidden">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0d9488, #14b8a6)' }}>
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="font-bold text-white">API Security Shield</span>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white">{isLogin ? "Welcome back" : "Create account"}</h2>
                <p className="mt-1 text-sm" style={{ color: '#5a7d78' }}>
                  {isLogin ? "Sign in to your account to continue" : "Join the security platform today"}
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                {!isLogin && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: '#2dd4bf' }}>Username</label>
                      <input
                        type="text" name="username" value={formData.username} onChange={handleChange}
                        placeholder="johndoe" style={inputStyle}
                        onFocus={e => { e.target.style.borderColor = '#14b8a6'; }}
                        onBlur={e => { e.target.style.borderColor = '#1f2e2d'; }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: '#2dd4bf' }}>Full Name</label>
                      <input
                        type="text" name="fullname" value={formData.fullname} onChange={handleChange}
                        placeholder="John Doe" style={inputStyle}
                        onFocus={e => { e.target.style.borderColor = '#14b8a6'; }}
                        onBlur={e => { e.target.style.borderColor = '#1f2e2d'; }}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: '#2dd4bf' }}>Email address</label>
                  <input
                    type="email" name="email" value={formData.email} onChange={handleChange}
                    placeholder="you@example.com" required style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = '#14b8a6'; }}
                    onBlur={e => { e.target.style.borderColor = '#1f2e2d'; }}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-medium" style={{ color: '#2dd4bf' }}>Password</label>
                    {isLogin && (
                      <button type="button" className="text-xs transition-colors" style={{ color: '#14b8a6' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#2dd4bf'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#14b8a6'; }}
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <input
                    type="password" name="password" value={formData.password} onChange={handleChange}
                    placeholder="••••••••" required style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = '#14b8a6'; }}
                    onBlur={e => { e.target.style.borderColor = '#1f2e2d'; }}
                  />
                </div>

                {!isLogin && (
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: '#2dd4bf' }}>Role</label>
                    <select
                      name="role" value={formData.role} onChange={handleChange}
                      style={{ ...inputStyle, cursor: 'pointer' }}
                      onFocus={e => { e.target.style.borderColor = '#14b8a6'; }}
                      onBlur={e => { e.target.style.borderColor = '#1f2e2d'; }}
                    >
                      <option value="" disabled style={{ background: '#0f1314' }}>Select a role</option>
                      <option value="Admin" style={{ background: '#0f1314' }}>Admin</option>
                      <option value="Security Analyst" style={{ background: '#0f1314' }}>Security Analyst</option>
                      <option value="Developer" style={{ background: '#0f1314' }}>Developer</option>
                      <option value="Analyst" style={{ background: '#0f1314' }}>Analyst</option>
                      <option value="Tester" style={{ background: '#0f1314' }}>Tester</option>
                      <option value="Engineer" style={{ background: '#0f1314' }}>Engineer</option>
                    </select>
                  </div>
                )}

                {error && (
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                    <svg className="w-4 h-4 shrink-0" style={{ color: '#f87171' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xs" style={{ color: '#f87171' }}>{error}</p>
                  </div>
                )}

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={isLoading ? {} : { scale: 1.02, boxShadow: '0 12px 32px rgba(13,148,136,0.35)' }}
                  whileTap={isLoading ? {} : { scale: 0.98 }}
                  className="w-full font-medium px-4 py-2.5 rounded-lg text-sm transition-all flex items-center justify-center gap-2 mt-2 text-white"
                  style={{ background: isLoading ? '#115e59' : '#0d9488', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.8 : 1 }}
                  onMouseEnter={e => { if (!isLoading) (e.currentTarget as HTMLElement).style.background = '#14b8a6'; }}
                  onMouseLeave={e => { if (!isLoading) (e.currentTarget as HTMLElement).style.background = '#0d9488'; }}
                >
                  {isLoading && (
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  )}
                  {isLoading ? "Please wait..." : isLogin ? "Sign in" : "Create account"}
                </motion.button>
              </form>

              <p className="mt-6 text-center text-sm" style={{ color: '#5a7d78' }}>
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  type="button" onClick={handleToggleForm}
                  className="font-medium transition-colors" style={{ color: '#2dd4bf' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#5eead4'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#2dd4bf'; }}
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
