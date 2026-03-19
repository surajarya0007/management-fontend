'use client';
import Layout from "@/components/Layout";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, staggerItem, springSnappy } from "@/lib/motion";

interface Api {
  _id: string;
  name: string;
  endpoint: string;
  owner: string;
  status: string;
  lastScanned: string;
  version: string;
  description: string;
  role: string;
}

interface NewApi {
  name: string;
  endpoint: string;
  description: string;
  owner: string;
  status: string;
  lastScanned: string;
  version: string;
  role: string;
}

const card = { background: '#0f1314', border: '1px solid #1f2e2d', borderRadius: '12px' };

const statusBadgeStyle = (status: string): React.CSSProperties => {
  const s = status.toLowerCase();
  if (s === 'active') return { background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' };
  if (s === 'inactive') return { background: 'rgba(13,148,136,0.08)', color: '#5a9e96', border: '1px solid rgba(13,148,136,0.15)' };
  return { background: 'rgba(245,158,11,0.1)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.2)' };
};

const inputStyle: React.CSSProperties = {
  background: '#0a0d0d',
  border: '1px solid #1f2e2d',
  color: '#f0fdfa',
  borderRadius: '8px',
  padding: '9px 12px',
  fontSize: '13px',
  outline: 'none',
  width: '100%',
  transition: 'border-color 0.15s',
};

const ApiInventory: React.FC = () => {
  const [userRole, setUserRole] = useState<string>('');
  const [apiList, setApiList] = useState<Api[]>([]);
  const [newApi, setNewApi] = useState<NewApi>({
    name: "", endpoint: "", owner: "", status: "Active",
    role: "", lastScanned: "", version: "", description: ""
  });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortKey, setSortKey] = useState<keyof Api>("name");
  const [sortDirection, setSortDirection] = useState<"ascending" | "descending">("ascending");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "/Login"; return; }
    try {
      const decoded: { role: string } = jwtDecode(token);
      setUserRole(decoded.role);
    } catch {
      window.location.href = "/Login";
    }
  }, []);

  useEffect(() => {
    const fetchApiData = async () => {
      try {
        const URL = `https://management-backend-api.vercel.app/api/${userRole}/api`;
        const response = await fetch(URL, {
          method: "GET",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const data: Api[] = await response.json();
        setApiList(data);
      } catch (error) {
        console.error("Error fetching API data:", error);
      }
    };
    if (userRole) fetchApiData();

  }, [userRole]);

  const filteredApiList = apiList.filter(api =>
    api.name && api.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortArray = (array: Api[], key: keyof Api, direction: "ascending" | "descending") =>
    [...array].sort((a, b) => {
      if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
      if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
      return 0;
    });

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const k = event.target.value as keyof Api;
    setSortDirection(sortKey === k && sortDirection === "ascending" ? "descending" : "ascending");
    setSortKey(k);
  };

  const sortedApiList = sortArray(filteredApiList, sortKey, sortDirection);

  const handleDeleteApi = (id: string) => setApiList(apiList.filter(api => api._id !== id));

  const handleAddApi = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMsg(null);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("https://management-backend-api.vercel.app/api/api/add", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...newApi, role: userRole }),
      });
      if (response.ok) {
        const body = await response.json();
        setApiList(prev => [...prev, body.api]);
        setNewApi({ name: "", endpoint: "", owner: "", status: "Active", role: userRole, lastScanned: "", version: "", description: "" });
        setSubmitMsg({ type: 'success', text: 'API added successfully!' });
        setTimeout(() => setSubmitMsg(null), 3000);
      } else {
        setSubmitMsg({ type: 'error', text: 'Failed to add API. Please try again.' });
      }
    } catch (error) {
      console.error("Error adding API:", error);
      setSubmitMsg({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    (e.target as HTMLElement).style.borderColor = '#14b8a6';
  };
  const fieldBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    (e.target as HTMLElement).style.borderColor = '#1f2e2d';
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page title */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={springSnappy}>
          <h2 className="text-lg font-bold text-white">API Inventory</h2>
          <motion.p
            className="text-sm mt-0.5"
            style={{ color: '#0d9488' }}
            key={apiList.length}
            initial={{ scale: 0.98 }}
            animate={{ scale: 1 }}
            transition={springSnappy}
          >
            {apiList.length} APIs registered
          </motion.p>
        </motion.div>

        {/* Add New API — always visible */}
        <motion.div
          style={card}
          className="overflow-hidden"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springSnappy, delay: 0.05 }}
          whileHover={{ boxShadow: '0 16px 48px rgba(0,0,0,0.35)' }}
        >
          <div className="flex items-center gap-2 px-5 py-4" style={{ borderBottom: '1px solid #1f2e2d' }}>
            <motion.div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(13,148,136,0.15)' }}
              whileHover={{ rotate: 90, scale: 1.05 }}
              transition={springSnappy}
            >
              <svg className="w-3.5 h-3.5" style={{ color: '#2dd4bf' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </motion.div>
            <h3 className="text-sm font-semibold text-white">Add New API</h3>
          </div>

          <form onSubmit={handleAddApi} className="p-5">
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              {[
                { placeholder: "API Name *", key: "name" },
                { placeholder: "API Endpoint *", key: "endpoint" },
                { placeholder: "Description *", key: "description" },
                { placeholder: "Owner *", key: "owner" },
                { placeholder: "Version (e.g. v1.0) *", key: "version" },
              ].map(field => (
                <motion.div key={field.key} variants={staggerItem}>
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    required
                    value={newApi[field.key as keyof NewApi]}
                    onChange={e => setNewApi({ ...newApi, [field.key]: e.target.value })}
                    style={{ ...inputStyle }}
                    onFocus={fieldFocus}
                    onBlur={fieldBlur}
                  />
                </motion.div>
              ))}
              <motion.div variants={staggerItem}>
                <select
                  value={newApi.status}
                  onChange={e => setNewApi({ ...newApi, status: e.target.value })}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  onFocus={fieldFocus}
                  onBlur={fieldBlur}
                >
                  <option value="Active" style={{ background: '#0a0d0d' }}>Status: Active</option>
                  <option value="Inactive" style={{ background: '#0a0d0d' }}>Status: Inactive</option>
                </select>
              </motion.div>
            </motion.div>

            <div className="flex items-center gap-3">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={isSubmitting ? {} : { scale: 1.02 }}
                whileTap={isSubmitting ? {} : { scale: 0.97 }}
                className="inline-flex items-center gap-2 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-all"
                style={{ background: isSubmitting ? '#115e59' : '#0d9488', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                onMouseEnter={e => { if (!isSubmitting) (e.currentTarget as HTMLElement).style.background = '#14b8a6'; }}
                onMouseLeave={e => { if (!isSubmitting) (e.currentTarget as HTMLElement).style.background = '#0d9488'; }}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Adding...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add API
                  </>
                )}
              </motion.button>

              <AnimatePresence mode="wait">
                {submitMsg && (
                  <motion.div
                    key={submitMsg.text}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
                    style={
                      submitMsg.type === 'success'
                        ? { background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' }
                        : { background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }
                    }
                  >
                    {submitMsg.text}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </form>
        </motion.div>

        {/* API List table */}
        <motion.div
          style={card}
          className="overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={springSnappy}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4" style={{ borderBottom: '1px solid #1f2e2d' }}>
            <p className="text-xs" style={{ color: '#0d9488' }}>{sortedApiList.length} APIs</p>
            <div className="flex items-center gap-2">
              <div className="relative">
                <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: '#0d9488' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text" placeholder="Search APIs..."
                  value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                  style={{ ...inputStyle, paddingLeft: '28px', paddingRight: '10px', paddingTop: '5px', paddingBottom: '5px', width: '180px', fontSize: '12px' }}
                />
              </div>
              <select value={sortKey} onChange={handleSortChange}
                style={{ ...inputStyle, padding: '5px 10px', fontSize: '12px', width: 'auto', cursor: 'pointer' }}>
                <option value="name" style={{ background: '#0a0d0d' }}>Name</option>
                <option value="endpoint" style={{ background: '#0a0d0d' }}>Endpoint</option>
                <option value="owner" style={{ background: '#0a0d0d' }}>Owner</option>
                <option value="status" style={{ background: '#0a0d0d' }}>Status</option>
                <option value="lastScanned" style={{ background: '#0a0d0d' }}>Last Scanned</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid #1f2e2d' }}>
                  {['API Name', 'Endpoint', 'Owner', 'Status', 'Last Scanned', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#0d9488' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedApiList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <motion.div
                          className="w-12 h-12 rounded-full flex items-center justify-center"
                          style={{ background: 'rgba(13,148,136,0.08)' }}
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2.5, repeat: Infinity }}
                        >
                          <svg className="w-6 h-6" style={{ color: '#0d9488' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </motion.div>
                        <p className="text-sm" style={{ color: '#0d9488' }}>No APIs found. Add your first API above.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  sortedApiList.map((api, index) => (
                    <motion.tr
                      key={api._id}
                      style={{ borderBottom: '1px solid rgba(31,46,46,0.5)', background: index % 2 === 0 ? 'transparent' : 'rgba(13,148,136,0.02)' }}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(index * 0.03, 0.45), ...springSnappy }}
                      whileHover={{ backgroundColor: 'rgba(13,148,136,0.08)' }}
                    >
                      <td className="px-5 py-3.5">
                        <Link href={`/${api._id}`} className="text-sm font-medium transition-colors" style={{ color: '#2dd4bf' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#5eead4'; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#2dd4bf'; }}>
                          {api.name}
                        </Link>
                      </td>
                      <td className="px-5 py-3.5 text-xs font-mono" style={{ color: '#0d9488' }}>{api.endpoint}</td>
                      <td className="px-5 py-3.5 text-sm" style={{ color: '#5a7d78' }}>{api.owner}</td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium" style={statusBadgeStyle(api.status)}>
                          {api.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-sm" style={{ color: '#0d9488' }}>{api.lastScanned || '—'}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1">
                          <button onClick={() => console.log("Scan", api._id)}
                            className="px-2.5 py-1 text-xs font-medium rounded transition-colors"
                            style={{ color: '#2dd4bf' }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(13,148,136,0.1)'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                            Scan
                          </button>
                          <button onClick={() => console.log("Edit", api._id)}
                            className="px-2.5 py-1 text-xs font-medium rounded transition-colors"
                            style={{ color: '#fbbf24' }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(245,158,11,0.08)'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                            Edit
                          </button>
                          <button onClick={() => handleDeleteApi(api._id)}
                            className="px-2.5 py-1 text-xs font-medium rounded transition-colors"
                            style={{ color: '#f87171' }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.08)'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default ApiInventory;
