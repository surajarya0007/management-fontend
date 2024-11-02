'use client'
import { useState } from 'react';

interface Scan {
  api: string;
  date: string;
  result: string;
}

const ScanList = () => {
  const [scans, setScans] = useState<Scan[]>([
    { api: 'User API', date: '2024-08-12', result: 'Passed' },
    { api: 'Order API', date: '2024-08-11', result: 'Failed: SQL Injection' },
  ]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Scan Results</h3>
      <ul>
        {scans.map((scan, index) => (
          <li key={index} className="mb-2 p-4 bg-white shadow rounded">
            <h4 className="text-blue-900">API: {scan.api}</h4>
            <p>Date: {scan.date}</p>
            <p>Result: {scan.result}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScanList;
