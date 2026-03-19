'use client';
import { useState, useEffect, ChangeEvent } from 'react';
import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { springSnappy, staggerContainer, staggerItem } from "@/lib/motion";

const API_BASE = "https://management-backend-api.vercel.app/api";

interface Scan {
  _id: string;
  scanDate: string;
  apiName: string;
  results: string;
  vulnerabilitiesDetected: number;
  frequency?: string;
}

interface ScanConfig { frequency: string; typesOfChecks: string[]; }

const card = { background: '#0f1314', border: '1px solid #1f2e2d', borderRadius: '12px' };
const cardHeader = { borderBottom: '1px solid #1f2e2d' };

const resultStyle = (result: string): React.CSSProperties => {
  const r = result.toLowerCase();
  if (r === 'success') return { background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' };
  if (r === 'failed') return { background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' };
  return { background: 'rgba(245,158,11,0.1)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.2)' };
};

const checkTypes = ['Vulnerability Scan', 'Performance Check', 'Compliance Check'];

const SecurityScans: React.FC = () => {
  const [scanHistory, setScanHistory] = useState<Scan[]>([]);
  const [scanConfig, setScanConfig] = useState<ScanConfig>({ frequency: "Weekly", typesOfChecks: [] });
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [scanMsg, setScanMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    const token = getToken();
    if (!token) { window.location.href = "/Login"; return; }
    fetchScans();
  }, []);

  const fetchScans = async () => {
    const token = getToken();
    try {
      const res = await fetch(`${API_BASE}/scans`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setScanHistory(data);
      }
    } catch (err) {
      console.error("Failed to load scans:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const initiateNewScan = async () => {
    setIsScanning(true);
    setScanMsg(null);
    const token = getToken();
    try {
      const res = await fetch(`${API_BASE}/scans`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          frequency: scanConfig.frequency,
          typesOfChecks: scanConfig.typesOfChecks,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setScanHistory(prev => [data.scan, ...prev]);
        setScanMsg({ type: 'success', text: 'Scan initiated successfully!' });
        setTimeout(() => {
          setScanMsg(null);
          fetchScans();
        }, 3000);
      } else {
        setScanMsg({ type: 'error', text: 'Failed to initiate scan. Please try again.' });
      }
    } catch {
      setScanMsg({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsScanning(false);
    }
  };

  const handleConfigChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setScanConfig(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleCheckType = (checkType: string) => {
    setScanConfig(prev => ({
      ...prev,
      typesOfChecks: prev.typesOfChecks.includes(checkType)
        ? prev.typesOfChecks.filter(t => t !== checkType)
        : [...prev.typesOfChecks, checkType],
    }));
  };

  const selectStyle: React.CSSProperties = {
    background: '#0a0d0d', border: '1px solid #1f2e2d',
    color: '#f0fdfa', borderRadius: '8px', padding: '10px 12px',
    fontSize: '13px', outline: 'none', width: '100%', cursor: 'pointer',
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={springSnappy}>
          <h2 className="text-lg font-bold text-white">OWASP Security Scans</h2>
          <p className="text-sm mt-0.5" style={{ color: '#0d9488' }}>Configure and monitor security scans across your API inventory</p>
        </motion.div>

        {/* Config */}
        <motion.div
          style={card}
          className="p-5"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springSnappy, delay: 0.06 }}
          whileHover={{ boxShadow: '0 12px 40px rgba(0,0,0,0.3)' }}
        >
          <div className="flex items-center gap-2 mb-5 pb-4" style={cardHeader}>
            <motion.div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(13,148,136,0.12)' }}
              whileHover={{ scale: 1.08, rotate: -6 }}
              transition={springSnappy}
            >
              <svg className="w-3.5 h-3.5" style={{ color: '#2dd4bf' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </motion.div>
            <h3 className="text-sm font-semibold text-white">Scan Configuration</h3>
          </div>

          <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-6" variants={staggerContainer} initial="hidden" animate="show">
            <motion.div variants={staggerItem}>
              <label className="block text-xs font-medium mb-2" style={{ color: '#2dd4bf' }}>Scan Frequency</label>
              <select name="frequency" value={scanConfig.frequency} onChange={handleConfigChange} style={selectStyle}>
                <option value="Daily" style={{ background: '#0a0d0d' }}>Daily</option>
                <option value="Weekly" style={{ background: '#0a0d0d' }}>Weekly</option>
                <option value="Monthly" style={{ background: '#0a0d0d' }}>Monthly</option>
                <option value="Manual" style={{ background: '#0a0d0d' }}>Manual</option>
              </select>
            </motion.div>
            <motion.div variants={staggerItem}>
              <label className="block text-xs font-medium mb-2" style={{ color: '#2dd4bf' }}>Check Types</label>
              <div className="space-y-2.5">
                {checkTypes.map(checkType => (
                  <label key={checkType} className="flex items-center gap-2.5 cursor-pointer">
                    <div
                      onClick={() => toggleCheckType(checkType)}
                      className="w-4 h-4 rounded flex items-center justify-center transition-all cursor-pointer shrink-0"
                      style={scanConfig.typesOfChecks.includes(checkType)
                        ? { background: '#0d9488', border: '1px solid #14b8a6' }
                        : { background: '#0a0d0d', border: '1px solid #1f2e2d' }}
                    >
                      {scanConfig.typesOfChecks.includes(checkType) && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm" style={{ color: '#99f6e4' }}>{checkType}</span>
                  </label>
                ))}
              </div>
            </motion.div>
          </motion.div>

          <div className="mt-6 pt-5 flex items-center gap-3 flex-wrap" style={{ borderTop: '1px solid #1f2e2d' }}>
            <motion.button
              onClick={initiateNewScan} disabled={isScanning}
              whileHover={isScanning ? {} : { scale: 1.03 }}
              whileTap={isScanning ? {} : { scale: 0.97 }}
              className="inline-flex items-center gap-2 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              style={{ background: isScanning ? '#115e59' : '#0d9488', cursor: isScanning ? 'not-allowed' : 'pointer' }}
              onMouseEnter={e => { if (!isScanning) (e.currentTarget as HTMLElement).style.background = '#14b8a6'; }}
              onMouseLeave={e => { if (!isScanning) (e.currentTarget as HTMLElement).style.background = '#0d9488'; }}
            >
              {isScanning ? (
                <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Scanning...</>
              ) : (
                <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>Initiate New Scan</>
              )}
            </motion.button>
            {scanConfig.typesOfChecks.length > 0 && (
              <span className="text-xs" style={{ color: '#0d9488' }}>{scanConfig.typesOfChecks.length} check type{scanConfig.typesOfChecks.length > 1 ? 's' : ''} selected</span>
            )}
            {scanMsg && (
              <motion.span
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xs px-3 py-2 rounded-lg"
                style={scanMsg.type === 'success'
                  ? { background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' }
                  : { background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}
              >
                {scanMsg.text}
              </motion.span>
            )}
          </div>
        </motion.div>

        {/* History */}
        <motion.div
          style={card}
          className="overflow-hidden"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={springSnappy}
        >
          <div className="flex items-center justify-between px-5 py-4" style={cardHeader}>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white">Scan History</h3>
              <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium" style={{ background: 'rgba(13,148,136,0.1)', color: '#2dd4bf', border: '1px solid rgba(13,148,136,0.2)' }}>
                {scanHistory.length}
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <motion.div
                  className="w-6 h-6 rounded-full border-2"
                  style={{ borderColor: '#1f2e2d', borderTopColor: '#0d9488' }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                />
              </div>
            ) : scanHistory.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-12">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(13,148,136,0.08)' }}>
                  <svg className="w-6 h-6" style={{ color: '#0d9488' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <p className="text-sm" style={{ color: '#0d9488' }}>No scans yet. Initiate your first scan above.</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid #1f2e2d' }}>
                    {['Scan Date', 'API Name', 'Result', 'Vulnerabilities'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#0d9488' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {scanHistory.map((scan, i) => (
                    <motion.tr
                      key={scan._id}
                      style={{ borderBottom: '1px solid rgba(31,46,46,0.5)', background: i % 2 === 0 ? 'transparent' : 'rgba(13,148,136,0.02)' }}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: Math.min(i * 0.04, 0.4), ...springSnappy }}
                      whileHover={{ backgroundColor: 'rgba(13,148,136,0.08)' }}
                    >
                      <td className="px-5 py-3.5 text-sm" style={{ color: '#5a7d78' }}>
                        {new Date(scan.scanDate).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3.5 text-sm font-medium text-white">{scan.apiName}</td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium" style={resultStyle(scan.results)}>{scan.results}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        {scan.vulnerabilitiesDetected > 0 ? (
                          <span className="inline-flex items-center gap-1 text-sm" style={{ color: '#f87171' }}>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            {scan.vulnerabilitiesDetected}
                          </span>
                        ) : <span className="text-sm" style={{ color: '#6b9e97' }}>—</span>}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default SecurityScans;
