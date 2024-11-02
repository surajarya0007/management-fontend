
'use client';
import { useState } from 'react';
import Layout from "@/components/Layout";

const SecurityScans = () => {
  // Dummy data for scan history
  const [scanHistory, setScanHistory] = useState([
    {
      id: 1,
      scanDate: "2024-08-01",
      apiName: "API 1",
      results: "Success",
      vulnerabilitiesDetected: 2,
    },
    {
      id: 2,
      scanDate: "2024-07-15",
      apiName: "API 2",
      results: "Success",
      vulnerabilitiesDetected: 1,
    },
    {
      id: 3,
      scanDate: "2024-06-20",
      apiName: "API 1",
      results: "Failed",
      vulnerabilitiesDetected: 3,
    },
  ]);

  // State to manage scan configurations
  const [scanConfig, setScanConfig] = useState({
    frequency: "Weekly",
    typesOfChecks: [],
  });

  // Dummy function to initiate a new scan
  const initiateNewScan = () => {
    // Here you would typically call your API to start a scan
    const newScan = {
      id: scanHistory.length + 1,
      scanDate: new Date().toISOString().split('T')[0],
      apiName: "API 1", // This would be dynamic based on user selection
      results: "In Progress",
      vulnerabilitiesDetected: 0,
    };
    setScanHistory([...scanHistory, newScan]);
  };

  // Function to handle configuration changes
  const handleConfigChange = (e) => {
    const { name, value } = e.target;
    setScanConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Function to toggle types of checks
  const toggleCheckType = (checkType) => {
    setScanConfig(prev => {
      const typesOfChecks = prev.typesOfChecks.includes(checkType)
        ? prev.typesOfChecks.filter(type => type !== checkType)
        : [...prev.typesOfChecks, checkType];
      return { ...prev, typesOfChecks };
    });
  };

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">Security Scans</h2>

        {/* Scan Configuration Section */}
        <div className="bg-white p-6 shadow rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Scan Configuration</h3>
          <div className="mb-4">
            <label className="block mb-2">
              Frequency:
              <select
                name="frequency"
                value={scanConfig.frequency}
                onChange={handleConfigChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
            </label>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Types of Checks:</h4>
            <label className="inline-flex items-center mb-2">
              <input
                type="checkbox"
                checked={scanConfig.typesOfChecks.includes("Vulnerability Scan")}
                onChange={() => toggleCheckType("Vulnerability Scan")}
                className="form-checkbox"
              />
              <span className="ml-2">Vulnerability Scan</span>
            </label>
            <label className="inline-flex items-center mb-2">
              <input
                type="checkbox"
                checked={scanConfig.typesOfChecks.includes("Performance Check")}
                onChange={() => toggleCheckType("Performance Check")}
                className="form-checkbox"
              />
              <span className="ml-2">Performance Check</span>
            </label>
            <label className="inline-flex items-center mb-2">
              <input
                type="checkbox"
                checked={scanConfig.typesOfChecks.includes("Compliance Check")}
                onChange={() => toggleCheckType("Compliance Check")}
                className="form-checkbox"
              />
              <span className="ml-2">Compliance Check</span>
            </label>
          </div>
          <button
            onClick={initiateNewScan}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Initiate New Scan
          </button>
        </div>

        {/* Scan History Section */}
        <h3 className="text-xl font-bold text-blue-900 mb-4">Scan History</h3>
        <div className="bg-white p-6 shadow rounded-lg mb-6">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-gray-200 text-gray-800">
                <th className="p-3 border-b border-gray-300">Scan Date</th>
                <th className="p-3 border-b border-gray-300">API Name</th>
                <th className="p-3 border-b border-gray-300">Results</th>
                <th className="p-3 border-b border-gray-300">Vulnerabilities Detected</th>
              </tr>
            </thead>
            <tbody>
              {scanHistory.map((scan) => (
                <tr key={scan.id} className={scan.id % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="p-3 border-b border-gray-300">{scan.scanDate}</td>
                  <td className="p-3 border-b border-gray-300">{scan.apiName}</td>
                  <td className="p-3 border-b border-gray-300">{scan.results}</td>
                  <td className="p-3 border-b border-gray-300">{scan.vulnerabilitiesDetected}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default SecurityScans;
