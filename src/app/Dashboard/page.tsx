'use client';
import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bar, Pie } from "react-chartjs-2";
import 'chart.js/auto';
import Link from 'next/link';
import { jwtDecode } from "jwt-decode";
import { staggerContainer, staggerItem, springSnappy } from "@/lib/motion";

interface Vulnerability {
  status: string;
  affectedApis: string[];
  description: string;
  cvss: number;
  remediation: string;
  affectedApiId: string[];
}

interface Incident {
  type: string;
  severity: string;
  impact: string;
  status: string;
  timeline: string;
}

interface Api {
  name: string;
  description: string;
  owner: string;
  creationDate: string;
  endpoint: string;
  vulnerabilities?: Vulnerability[];
  _id: string;
}

const card = { background: '#0f1314', border: '1px solid #1f2e2d', borderRadius: '12px' };
const cardHeader = { borderBottom: '1px solid #1f2e2d' };

const severityBadgeStyle = (severity: string): React.CSSProperties => {
  switch (severity.toLowerCase()) {
    case 'critical': return { background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' };
    case 'high': return { background: 'rgba(249,115,22,0.1)', color: '#fb923c', border: '1px solid rgba(249,115,22,0.2)' };
    case 'medium': return { background: 'rgba(245,158,11,0.1)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.2)' };
    default: return { background: 'rgba(13,148,136,0.1)', color: '#5eead4', border: '1px solid rgba(13,148,136,0.2)' };
  }
};

const statusBadgeStyle = (status: string): React.CSSProperties => {
  switch (status.toLowerCase()) {
    case 'resolved': return { background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' };
    case 'in progress': return { background: 'rgba(13,148,136,0.1)', color: '#5eead4', border: '1px solid rgba(13,148,136,0.2)' };
    case 'open': return { background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' };
    default: return { background: 'rgba(13,148,136,0.1)', color: '#5eead4', border: '1px solid rgba(13,148,136,0.2)' };
  }
};

const StatCard = ({ title, value, subtitle, icon, accentColor }: {
  title: string; value: string | number; subtitle: string; icon: React.ReactNode; accentColor: string;
}) => (
  <motion.div
    style={card}
    className="p-5"
    variants={staggerItem}
    whileHover={{ y: -4, borderColor: 'rgba(13,148,136,0.45)', boxShadow: '0 12px 40px rgba(0,0,0,0.35)' }}
    whileTap={{ scale: 0.99 }}
    transition={springSnappy}
  >
    <motion.div
      className="flex items-start justify-between mb-4"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={springSnappy}
    >
      <motion.div
        className="w-10 h-10 rounded-lg flex items-center justify-center"
        style={{ background: accentColor }}
        whileHover={{ rotate: [0, -6, 6, 0] }}
        transition={{ duration: 0.5 }}
      >
        {icon}
      </motion.div>
    </motion.div>
    <motion.p className="text-2xl font-bold text-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}>{value}</motion.p>
    <p className="text-sm font-medium mt-0.5" style={{ color: '#99f6e4' }}>{title}</p>
    <p className="text-xs mt-1" style={{ color: '#0d9488' }}>{subtitle}</p>
  </motion.div>
);

const Dashboard = () => {
  const [apiInventory, setApiInventory] = useState<Api[]>([]);
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [incidents] = useState<Incident[]>([
    { type: "Data Breach", severity: "High", impact: "Customer Data", status: "Resolved", timeline: "2024-07-22" },
    { type: "DDoS Attack", severity: "Medium", impact: "Service Disruption", status: "In Progress", timeline: "2024-08-01" },
    { type: "Unauthorized Access", severity: "Critical", impact: "Sensitive Data", status: "Open", timeline: "2024-08-05" },
  ]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortKey, setSortKey] = useState<keyof Api>('name');
  const [sortDirection, setSortDirection] = useState<'ascending' | 'descending'>('descending');

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchApiData = async () => {
      if (token) {
        try {
          const decodedToken: { role: string } = jwtDecode(token);
          const URL = `https://management-backend-api.vercel.app/api/${decodedToken.role}/api`;
          const response = await fetch(URL, { method: "GET", headers: { Authorization: `Bearer ${token}` } });
          const data: Api[] = await response.json();
          const filteredApiInventory = data.filter(api => api.vulnerabilities?.every(v => v.status === "Closed"));
          const allVulnerabilities = data.reduce<Vulnerability[]>((acc, api) => {
            if (api.vulnerabilities) return acc.concat(api.vulnerabilities.map(v => ({ ...v, affectedApis: [api.name], affectedApiId: [api._id] })));
            return acc;
          }, []);
          setApiInventory(filteredApiInventory);
          setVulnerabilities(allVulnerabilities);
        } catch (error) {
          console.error("Error fetching API data:", error);
        }
      }
    };
    fetchApiData();
  }, []);

  const vulnerabilitiesByApi = vulnerabilities.reduce<Record<string, number>>((acc, vuln) => {
    vuln.affectedApis.forEach(n => { acc[n] = (acc[n] || 0) + 1; });
    return acc;
  }, {});

  const barData = {
    labels: Object.keys(vulnerabilitiesByApi),
    datasets: [{
      label: 'Vulnerabilities',
      data: Object.values(vulnerabilitiesByApi),
      backgroundColor: 'rgba(13, 148, 136, 0.55)',
      borderColor: 'rgba(20, 184, 166, 0.95)',
      borderWidth: 1,
      borderRadius: 6,
    }],
  };

  const pieData = {
    labels: incidents.map(i => i.type),
    datasets: [{
      data: incidents.map(i => i.severity === 'High' ? 3 : i.severity === 'Medium' ? 2 : 1),
      backgroundColor: ['rgba(239,68,68,0.75)', 'rgba(245,158,11,0.75)', 'rgba(13,148,136,0.75)'],
      borderColor: ['#ef4444', '#f59e0b', '#14b8a6'],
      borderWidth: 1,
    }],
  };

  const chartOpts = {
    responsive: true,
    plugins: { legend: { labels: { color: '#2dd4bf', font: { size: 11 } } } },
    scales: {
      x: { ticks: { color: '#0d9488' }, grid: { color: 'rgba(31,46,46,0.8)' } },
      y: { ticks: { color: '#0d9488' }, grid: { color: 'rgba(31,46,46,0.8)' } },
    },
  };

  const pieOpts = { responsive: true, plugins: { legend: { labels: { color: '#2dd4bf', font: { size: 11 } } } } };

  const filteredApiInventory = apiInventory.filter(api => api.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const sortArray = <T,>(arr: T[], key: keyof T, dir: 'ascending' | 'descending'): T[] =>
    [...arr].sort((a, b) => {
      if (a[key] < b[key]) return dir === 'ascending' ? -1 : 1;
      if (a[key] > b[key]) return dir === 'ascending' ? 1 : -1;
      return 0;
    });

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const k = e.target.value as keyof Api;
    setSortDirection(sortKey === k && sortDirection === 'ascending' ? 'descending' : 'ascending');
    setSortKey(k);
  };

  const sortedApiInventory = sortArray(filteredApiInventory, sortKey, sortDirection);

  const inputStyle = {
    background: '#0a0d0d',
    border: '1px solid #1f2e2d',
    color: '#99f6e4',
    borderRadius: '8px',
    outline: 'none',
    fontSize: '12px',
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-5">
        {/* Stat cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <StatCard title="Total APIs" value={apiInventory.length} subtitle="Across all environments" accentColor="rgba(13,148,136,0.15)"
            icon={<svg className="w-5 h-5" style={{ color: '#2dd4bf' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
          />
          <StatCard title="Vulnerable APIs" value={vulnerabilities.length} subtitle="Require attention" accentColor="rgba(239,68,68,0.1)"
            icon={<svg className="w-5 h-5" style={{ color: '#f87171' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
          />
          <StatCard title="Security Incidents" value={incidents.length} subtitle="Active events" accentColor="rgba(245,158,11,0.1)"
            icon={<svg className="w-5 h-5" style={{ color: '#fbbf24' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
          />
          <StatCard title="Compliance Status" value="In Progress" subtitle="OWASP Top 10" accentColor="rgba(16,185,129,0.1)"
            icon={<svg className="w-5 h-5" style={{ color: '#34d399' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
          />
        </motion.div>

        {/* Charts */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
        >
          <motion.div style={card} className="p-5" variants={staggerItem}>
            <div className="flex items-center justify-between mb-4" style={cardHeader}>
              <h3 className="text-sm font-semibold text-white pb-4">API Vulnerabilities</h3>
            </div>
            <Bar data={barData} options={chartOpts} />
          </motion.div>
          <motion.div style={card} className="p-5" variants={staggerItem}>
            <div className="flex items-center justify-between mb-4" style={cardHeader}>
              <h3 className="text-sm font-semibold text-white pb-4">Security Incidents</h3>
            </div>
            <div className="flex justify-center">
              <div style={{ maxWidth: 260 }}>
                <Pie data={pieData} options={pieOpts} />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Secured APIs table */}
        <motion.div
          style={card}
          className="overflow-hidden"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={springSnappy}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5" style={cardHeader}>
            <h3 className="text-sm font-semibold text-white">Secured APIs</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: '#0d9488' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text" placeholder="Search APIs..."
                  value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                  style={{ ...inputStyle, paddingLeft: '28px', paddingRight: '12px', paddingTop: '6px', paddingBottom: '6px', width: '180px' }}
                />
              </div>
              <select value={sortKey} onChange={handleSortChange}
                style={{ ...inputStyle, padding: '6px 10px', cursor: 'pointer' }}>
                <option value="name" style={{ background: '#0a0d0d' }}>Sort: Name</option>
                <option value="owner" style={{ background: '#0a0d0d' }}>Sort: Owner</option>
                <option value="creationDate" style={{ background: '#0a0d0d' }}>Sort: Date</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid #1f2e2d' }}>
                  {['API Name', 'Description', 'Owner', 'Created', 'Endpoint'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#0d9488' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedApiInventory.length === 0 ? (
                  <tr><td colSpan={5} className="px-5 py-10 text-center text-sm" style={{ color: '#6b9e97' }}>No secured APIs found</td></tr>
                ) : sortedApiInventory.map((api, i) => (
                  <motion.tr
                    key={api._id}
                    style={{ borderBottom: '1px solid rgba(31,46,46,0.5)', background: i % 2 === 0 ? 'transparent' : 'rgba(13,148,136,0.02)' }}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Math.min(i * 0.04, 0.4), ...springSnappy }}
                    whileHover={{ backgroundColor: 'rgba(13,148,136,0.08)' }}
                  >
                    <td className="px-5 py-3.5">
                      <Link href={`/${api._id}`} className="text-sm font-medium transition-colors" style={{ color: '#2dd4bf' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#5eead4'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#2dd4bf'; }}>
                        {api.name}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 text-sm max-w-[180px] truncate" style={{ color: '#5a7d78' }}>{api.description}</td>
                    <td className="px-5 py-3.5 text-sm" style={{ color: '#5a7d78' }}>{api.owner}</td>
                    <td className="px-5 py-3.5 text-sm" style={{ color: '#0d9488' }}>{api.creationDate}</td>
                    <td className="px-5 py-3.5 text-xs font-mono" style={{ color: '#0d9488' }}>{api.endpoint}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Incidents table */}
        <motion.div
          style={card}
          className="overflow-hidden"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={springSnappy}
        >
          <div className="px-5 py-4" style={cardHeader}>
            <h3 className="text-sm font-semibold text-white">Security Incidents</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid #1f2e2d' }}>
                  {['Type', 'Severity', 'Impact', 'Status', 'Timeline'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#0d9488' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {incidents.map((incident, i) => (
                  <motion.tr
                    key={i}
                    style={{ borderBottom: '1px solid rgba(31,46,46,0.5)' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.06 * i }}
                    whileHover={{ backgroundColor: 'rgba(13,148,136,0.06)' }}
                  >
                    <td className="px-5 py-3.5 text-sm text-white">{incident.type}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium" style={severityBadgeStyle(incident.severity)}>{incident.severity}</span>
                    </td>
                    <td className="px-5 py-3.5 text-sm" style={{ color: '#5a7d78' }}>{incident.impact}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium" style={statusBadgeStyle(incident.status)}>{incident.status}</span>
                    </td>
                    <td className="px-5 py-3.5 text-sm" style={{ color: '#0d9488' }}>{incident.timeline}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Dashboard;
