'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Layout from "@/components/Layout";
import { jwtDecode } from 'jwt-decode';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { springSnappy, staggerContainer, staggerItem } from '@/lib/motion';

interface ApiDetails {
  name: string; description: string; owner: string; version: string;
  creationDate: string; lastUpdated: string; securityStatus: string;
  documentationUrl: string; vulnerabilities: Vulnerability[];
}

interface Vulnerability {
  description: string; severity: string; remediation: string;
  status: string; discoveredDate: string;
}

const card = { background: '#0f1314', border: '1px solid #1f2e2d', borderRadius: '12px' };
const cardHeader = { borderBottom: '1px solid #1f2e2d' };

const severityStyle = (severity: string): React.CSSProperties => {
  switch (severity.toLowerCase()) {
    case 'critical': return { background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' };
    case 'high': return { background: 'rgba(249,115,22,0.1)', color: '#fb923c', border: '1px solid rgba(249,115,22,0.2)' };
    case 'medium': return { background: 'rgba(245,158,11,0.1)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.2)' };
    case 'low': return { background: 'rgba(13,148,136,0.1)', color: '#5eead4', border: '1px solid rgba(13,148,136,0.2)' };
    default: return { background: 'rgba(13,148,136,0.08)', color: '#2dd4bf', border: '1px solid rgba(13,148,136,0.15)' };
  }
};

const statusStyle = (status: string): React.CSSProperties => {
  switch (status.toLowerCase()) {
    case 'closed': return { background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' };
    case 'open': return { background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' };
    default: return { background: 'rgba(245,158,11,0.1)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.2)' };
  }
};

const ApiDetails = () => {
  const params = useParams();
  const id = params.id as string;
  const [apiDetails, setApiDetails] = useState<ApiDetails | null>(null);
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "/Login"; return; }
    try {
      const decoded: { role: string } = jwtDecode(token as string);
      if (!decoded?.role) window.location.href = "/Login";
    } catch { window.location.href = "/Login"; }
  }, []);

  useEffect(() => {
    const fetchApiData = async () => {
      try {
        if (id) {
          setLoading(true);
          const token = localStorage.getItem("token");
          const res = await fetch(`https://management-backend-api.vercel.app/api/api/${id}`, {
            method: "GET", headers: { Authorization: `Bearer ${token}` },
          });
          const data: ApiDetails = await res.json();
          setApiDetails(data);
          if (data.vulnerabilities) setVulnerabilities(data.vulnerabilities);
        }
      } catch { window.location.href = "/Dashboard"; }
      finally { setLoading(false); }
    };
    fetchApiData();
  }, [id]);

  return (
    <Layout>
      <motion.div
        className="max-w-5xl mx-auto space-y-6"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={staggerItem}>
          <Link href="/ApiInventory"
            className="inline-flex items-center gap-1.5 text-sm transition-colors"
            style={{ color: '#0d9488' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#2dd4bf'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#0d9488'; }}
          >
            <motion.span whileHover={{ x: -3 }} transition={springSnappy}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </motion.span>
            Back to API Inventory
          </Link>
        </motion.div>

        {loading ? (
          <motion.div
            className="flex items-center justify-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex flex-col items-center gap-3">
              <motion.svg
                className="w-8 h-8"
                style={{ color: '#0d9488' }}
                fill="none"
                viewBox="0 0 24 24"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </motion.svg>
              <p className="text-sm" style={{ color: '#0d9488' }}>Loading API details...</p>
            </div>
          </motion.div>
        ) : apiDetails ? (
          <>
            {/* API overview */}
            <motion.div style={card} className="p-6" variants={staggerItem} whileHover={{ boxShadow: '0 16px 48px rgba(0,0,0,0.3)' }}>
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(13,148,136,0.12)', border: '1px solid rgba(13,148,136,0.2)' }}>
                    <svg className="w-5 h-5" style={{ color: '#2dd4bf' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">{apiDetails.name}</h2>
                    <p className="text-sm mt-0.5" style={{ color: '#0d9488' }}>v{apiDetails.version}</p>
                  </div>
                </div>
                {apiDetails.securityStatus && (
                  <span className="inline-flex px-2.5 py-1 rounded-lg text-xs font-medium"
                    style={apiDetails.securityStatus.toLowerCase() === 'secure'
                      ? { background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' }
                      : { background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
                    {apiDetails.securityStatus}
                  </span>
                )}
              </div>

              {apiDetails.description && (
                <p className="text-sm pb-6 mb-6" style={{ color: '#5a7d78', borderBottom: '1px solid #1f2e2d' }}>{apiDetails.description}</p>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-5">
                {[
                  { label: 'Owner', value: apiDetails.owner },
                  { label: 'Version', value: apiDetails.version },
                  { label: 'Created', value: apiDetails.creationDate },
                  { label: 'Last Updated', value: apiDetails.lastUpdated },
                ].map(f => (
                  <div key={f.label}>
                    <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: '#0d9488' }}>{f.label}</p>
                    <p className="text-sm text-white">{f.value}</p>
                  </div>
                ))}
                {apiDetails.documentationUrl && (
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: '#0d9488' }}>Documentation</p>
                    <a href={apiDetails.documentationUrl} target="_blank" rel="noopener noreferrer"
                      className="text-xs underline underline-offset-2 transition-colors" style={{ color: '#2dd4bf' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#5eead4'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#2dd4bf'; }}>
                      View Docs
                    </a>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Vulnerabilities */}
            <motion.div style={card} className="overflow-hidden" variants={staggerItem}>
              <div className="flex items-center justify-between px-5 py-4" style={cardHeader}>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-white">Vulnerabilities</h3>
                  {vulnerabilities.filter(v => v.status.toLowerCase() === 'open').length > 0 && (
                    <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium" style={{ background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
                      {vulnerabilities.filter(v => v.status.toLowerCase() === 'open').length} open
                    </span>
                  )}
                </div>
                <span className="text-xs" style={{ color: '#0d9488' }}>{vulnerabilities.length} total</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: '1px solid #1f2e2d' }}>
                      {['Description', 'Severity', 'Status', 'Remediation', 'Discovered'].map(h => (
                        <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#0d9488' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {vulnerabilities.length > 0 ? (
                      vulnerabilities.map((vuln, i) => (
                        <motion.tr
                          key={i}
                          style={{ borderBottom: '1px solid rgba(31,46,46,0.5)', background: i % 2 === 0 ? 'transparent' : 'rgba(13,148,136,0.02)' }}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: Math.min(i * 0.04, 0.35), ...springSnappy }}
                          whileHover={{ backgroundColor: 'rgba(13,148,136,0.08)' }}
                        >
                          <td className="px-5 py-3.5 text-sm max-w-[180px]" style={{ color: '#99f6e4' }}>{vuln.description}</td>
                          <td className="px-5 py-3.5"><span className="inline-flex px-2 py-0.5 rounded text-xs font-medium" style={severityStyle(vuln.severity)}>{vuln.severity}</span></td>
                          <td className="px-5 py-3.5"><span className="inline-flex px-2 py-0.5 rounded text-xs font-medium" style={statusStyle(vuln.status)}>{vuln.status}</span></td>
                          <td className="px-5 py-3.5 text-sm max-w-[180px]" style={{ color: '#5a7d78' }}>{vuln.remediation}</td>
                          <td className="px-5 py-3.5 text-sm" style={{ color: '#0d9488' }}>{vuln.discoveredDate}</td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-5 py-10 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.08)' }}>
                              <svg className="w-5 h-5" style={{ color: '#34d399' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                            </div>
                            <p className="text-sm" style={{ color: '#0d9488' }}>No vulnerabilities found</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </>
        ) : (
          <motion.div
            className="flex items-center justify-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-sm" style={{ color: '#0d9488' }}>API not found or you don&apos;t have permission to view it.</p>
          </motion.div>
        )}
      </motion.div>
    </Layout>
  );
};

export default ApiDetails;
