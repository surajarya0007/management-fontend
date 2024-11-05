
// 'use client';
// import Layout from "@/components/Layout";
// import { useEffect, useState } from "react";
// import { Bar, Pie } from "react-chartjs-2"; 
// import 'chart.js/auto';
// import Link from 'next/link';
// import { jwtDecode } from "jwt-decode";

// interface Vulnerability {
//   status: string;
//   affectedApis: string[];
//   description: string;
//   cvss: number;
//   remediation: string;
//   affectedApiId: string[];
// }

// interface Incident {
//   type: string;
//   severity: string;
//   impact: string;
//   status: string;
//   timeline: string;
// }

// interface Api {
//   name: string;
//   description: string;
//   owner: string;
//   creationDate: string;
//   endpoint: string;
//   vulnerabilities?: Vulnerability[];
//   _id: string;
// }

// const Dashboard = () => {
//   const [apiInventory, setApiInventory] = useState<Api[]>([]);
//   const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
//   const [incidents, setIncidents] = useState<Incident[]>([
//     { type: "Data Breach", severity: "High", impact: "Customer Data", status: "Resolved", timeline: "2024-07-22" },
//     { type: "DDoS Attack", severity: "Medium", impact: "Service Disruption", status: "In Progress", timeline: "2024-08-01" },
//     { type: "Unauthorized Access", severity: "Critical", impact: "Sensitive Data", status: "Open", timeline: "2024-08-05" },
//   ]);

//   const [searchTerm, setSearchTerm] = useState<string>("");
//   const [sortKey, setSortKey] = useState<keyof Api>('name');
//   const [sortDirection, setSortDirection] = useState<'ascending' | 'descending'>('descending');

//   useEffect(() => {
//     const token = localStorage.getItem("token");
  
//     const fetchApiData = async () => {
//       try {
//           const decodedToken = jwtDecode(token);
//           const userRole = decodedToken.role;
//           const URL = `https://management-backend-api.vercel.app/api/${userRole}/api`;
//           const response = await fetch(URL, {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         const data: Api[] = await response.json();
//         console.log(data);

//         const filteredApiInventory = data.filter(api => 
//           api.vulnerabilities?.every(vuln => vuln.status === "Closed")
//         );

//         const allVulnerabilities = data.reduce<Vulnerability[]>((acc, api) => {
//           if (api.vulnerabilities) {
//             return acc.concat(
//               api.vulnerabilities.map(vuln => ({
//                 ...vuln,
//                 affectedApis: [api.name],
//                 affectedApiId: [api._id], 
//               }))
//             );
//           }
//           return acc;
//         }, []);

//         setApiInventory(filteredApiInventory);
//         setVulnerabilities(allVulnerabilities);
//       } catch (error) {
//         console.error("Error fetching API data:", error);
//       }
//     };
  
//     fetchApiData();
//   }, []);

//   const vulnerabilitiesByApi = vulnerabilities.reduce<Record<string, number>>((acc, vuln) => {
//     vuln.affectedApis.forEach(apiName => {
//       if (!acc[apiName]) {
//         acc[apiName] = 0;
//       }
//       acc[apiName]++;
//     });
//     return acc;
//   }, {});

//   const apiVulnerabilityData = {
//     labels: Object.keys(vulnerabilitiesByApi), 
//     datasets: [
//       {
//         label: 'Number of Vulnerabilities',
//         data: Object.values(vulnerabilitiesByApi),
//         backgroundColor: 'rgba(255, 99, 132, 0.6)',
//         borderColor: 'rgba(255, 99, 132, 1)',
//         borderWidth: 1,
//       },
//     ],
//   };

//   const apiIncidentData = {
//     labels: incidents.map(incident => incident.type),
//     datasets: [
//       {
//         label: 'Incidents',
//         data: incidents.map(incident => incident.severity === 'High' ? 3 : incident.severity === 'Medium' ? 2 : 1),
//         backgroundColor: 'rgba(54, 162, 235, 0.6)',
//         borderColor: 'rgba(54, 162, 235, 1)',
//         borderWidth: 1,
//       },
//     ],
//   };

//   const filteredApiInventory = apiInventory.filter(api =>
//     api.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const filteredIncidents = incidents.filter(incident =>
//     incident.type.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const filteredVulnerabilities = vulnerabilities
//     .filter(vuln => vuln.status === "Open")
//     .filter(vuln =>
//       vuln.affectedApis.some(api =>
//         api.toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     );

//   const sortArray = <T,>(array: T[], key: keyof T, direction: 'ascending' | 'descending'): T[] => {
//     return [...array].sort((a, b) => {
//       if (a[key] < b[key]) {
//         return direction === 'ascending' ? -1 : 1;
//       }
//       if (a[key] > b[key]) {
//         return direction === 'ascending' ? 1 : -1;
//       }
//       return 0;
//     });
//   };

//   const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     const selectedSortKey = event.target.value as keyof Api;
//     const newDirection = (sortKey === selectedSortKey && sortDirection === 'ascending') ? 'descending' : 'ascending';
//     setSortKey(selectedSortKey);
//     setSortDirection(newDirection);
//   };

//   const sortedApiInventory = sortArray(filteredApiInventory, sortKey, sortDirection);

//   return (
//     <Layout>
//       <div className="container mx-auto p-6">
//         <h2 className="text-2xl font-bold text-blue-900 mb-4">Dashboard Overview</h2>

//         {/* Overview Widgets */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
//           <div className="bg-white p-6 shadow rounded-lg">
//             <h3 className="text-lg font-semibold text-blue-900">Total APIs</h3>
//             <p className="text-gray-700">Number of APIs: {apiInventory.length + vulnerabilities.length}</p>
//           </div>
//           <div className="bg-white p-6 shadow rounded-lg">
//             <h3 className="text-lg font-semibold text-blue-900">Vulnerable APIs</h3>
//             <p className="text-gray-700">Number of Vulnerable APIs: {vulnerabilities.length}</p>
//           </div>
//           <div className="bg-white p-6 shadow rounded-lg">
//             <h3 className="text-lg font-semibold text-blue-900">Security Incidents</h3>
//             <p className="text-gray-700">Number of Incidents: {incidents.length}</p>
//           </div>
//           <div className="bg-white p-6 shadow rounded-lg">
//             <h3 className="text-lg font-semibold text-blue-900">Compliance Status</h3>
//             <p className="text-gray-700">Compliance: In Progress</p>
//           </div>
//         </div>

//         {/* Data Visualization Section */}
//         <h3 className="text-xl font-bold text-blue-900 mb-4">Data Visualization</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//           <div className="bg-white p-6 shadow rounded-lg">
//             <h4 className="text-lg font-semibold text-blue-900 mb-2">API Vulnerabilities</h4>
//             <Bar data={apiVulnerabilityData} />
//           </div>
//           <div className="bg-white p-6 shadow rounded-lg">
//             <h4 className="text-lg font-semibold text-blue-900 mb-2">Security Incidents</h4>
//             <Pie data={apiIncidentData} />
//           </div>
//         </div>

//         {/* Search Bar and Sort Dropdown for API Inventory */}
//         <div className="mb-4 flex items-center space-x-4">
//           <input
//             type="text"
//             placeholder="Search APIs..."
//             className="p-2 border border-gray-300 rounded w-full"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           <select
//             value={sortKey}
//             onChange={handleSortChange}
//             className="p-2 border border-gray-300 rounded"
//           >
//             <option value="name">Sort by Name</option>
//             <option value="description">Sort by Description</option>
//             <option value="owner">Sort by Owner</option>
//             <option value="creationDate">Sort by Creation Date</option>
//             <option value="endpoints">Sort by Endpoints</option>
//           </select>
//         </div>
//         <h3 className="text-xl font-bold text-blue-900 mb-4">Secured API</h3>
//         {/* API Inventory Table */}
//         <div className="bg-white p-6 shadow rounded-lg mb-6">
//           <table className="w-full text-left border-separate border-spacing-0">
//             <thead>
//               <tr className="bg-gray-200 text-gray-800">
//                 <th className="p-3 border-b border-gray-300">Name</th>
//                 <th className="p-3 border-b border-gray-300">Description</th>
//                 <th className="p-3 border-b border-gray-300">Owner</th>
//                 <th className="p-3 border-b border-gray-300">Creation Date</th>
//                 <th className="p-3 border-b border-gray-300">Endpoints</th>
//               </tr>
//             </thead>
//             <tbody>
//               {sortedApiInventory.map((api, index) => (
//                 <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
//                   <td className="p-3 border-b border-gray-300"><Link href={`/${api._id}`}>{api.name}</Link></td>
//                   <td className="p-3 border-b border-gray-300">{api.description}</td>
//                   <td className="p-3 border-b border-gray-300">{api.owner}</td>
//                   <td className="p-3 border-b border-gray-300">{api.creationDate}</td>
//                   <td className="p-3 border-b border-gray-300">{api.endpoint}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Vulnerability Management Table */}
//         <h3 className="text-xl font-bold text-blue-900 mb-4">Vulnerability Management</h3>
//         <div className="bg-white p-6 shadow rounded-lg mb-6">
//           <table className="w-full text-left border-separate border-spacing-0">
//             <thead>
//               <tr className="bg-gray-200 text-gray-800">

//                 <th className="p-3 border-b border-gray-300">Affected APIs</th>
//                 <th className="p-3 border-b border-gray-300">Description</th>
//                 <th className="p-3 border-b border-gray-300">CVSS Score</th>
//                 <th className="p-3 border-b border-gray-300">Remediation</th>
//                 <th className="p-3 border-b border-gray-300">Status</th>
                
//               </tr>
//             </thead>
//             <tbody>
//               {filteredVulnerabilities.filter(vuln => 
//                 vuln.affectedApis.some(api => api.toLowerCase().includes(searchTerm.toLowerCase()))
//               ).map((vuln, index) => (
//                 <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
//                   <td className="p-3 border-b border-gray-300"><Link href={`/${vuln.affectedApiId}`}>{vuln.affectedApis.join(", ")}</Link></td>
//                   <td className="p-3 border-b border-gray-300">{vuln.description}</td>
//                   <td className="p-3 border-b border-gray-300">{vuln.cvss}</td>
//                   <td className="p-3 border-b border-gray-300">{vuln.remediation}</td>
//                   <td className="p-3 border-b border-gray-300">{vuln.status}</td>
                  
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Security Incidents Table */}
//         <h3 className="text-xl font-bold text-blue-900 mb-4">Security Incidents</h3>
//         <div className="bg-white p-6 shadow rounded-lg mb-6">
//           <table className="w-full text-left border-separate border-spacing-0">
//             <thead>
//               <tr className="bg-gray-200 text-gray-800">
//                 <th className="p-3 border-b border-gray-300">Type</th>
//                 <th className="p-3 border-b border-gray-300">Severity</th>
//                 <th className="p-3 border-b border-gray-300">Impact</th>
//                 <th className="p-3 border-b border-gray-300">Status</th>
//                 <th className="p-3 border-b border-gray-300">Timeline</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredIncidents.map((incident, index) => (
//                 <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
//                   <td className="p-3 border-b border-gray-300">{incident.type}</td>
//                   <td className="p-3 border-b border-gray-300">{incident.severity}</td>
//                   <td className="p-3 border-b border-gray-300">{incident.impact}</td>
//                   <td className="p-3 border-b border-gray-300">{incident.status}</td>
//                   <td className="p-3 border-b border-gray-300">{incident.timeline}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default Dashboard;




'use client';
import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2"; 
import 'chart.js/auto';
import Link from 'next/link';
import {jwtDecode} from "jwt-decode";

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

const Dashboard = () => {
  const [apiInventory, setApiInventory] = useState<Api[]>([]);
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([
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
          const userRole = decodedToken.role;
          const URL = `https://management-backend-api.vercel.app/api/${userRole}/api`;
          const response = await fetch(URL, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data: Api[] = await response.json();
          console.log(data);

          const filteredApiInventory = data.filter(api => 
            api.vulnerabilities?.every(vuln => vuln.status === "Closed")
          );

          const allVulnerabilities = data.reduce<Vulnerability[]>((acc, api) => {
            if (api.vulnerabilities) {
              return acc.concat(
                api.vulnerabilities.map(vuln => ({
                  ...vuln,
                  affectedApis: [api.name],
                  affectedApiId: [api._id], 
                }))
              );
            }
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
    vuln.affectedApis.forEach(apiName => {
      if (!acc[apiName]) {
        acc[apiName] = 0;
      }
      acc[apiName]++;
    });
    return acc;
  }, {});

  const apiVulnerabilityData = {
    labels: Object.keys(vulnerabilitiesByApi), 
    datasets: [
      {
        label: 'Number of Vulnerabilities',
        data: Object.values(vulnerabilitiesByApi),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const apiIncidentData = {
    labels: incidents.map(incident => incident.type),
    datasets: [
      {
        label: 'Incidents',
        data: incidents.map(incident => incident.severity === 'High' ? 3 : incident.severity === 'Medium' ? 2 : 1),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const filteredApiInventory = apiInventory.filter(api =>
    api.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredIncidents = incidents.filter(incident =>
    incident.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredVulnerabilities = vulnerabilities
    .filter(vuln => vuln.status === "Open")
    .filter(vuln =>
      vuln.affectedApis.some(api =>
        api.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

  const sortArray = <T,>(array: T[], key: keyof T, direction: 'ascending' | 'descending'): T[] => {
    return [...array].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSortKey = event.target.value as keyof Api;
    const newDirection = (sortKey === selectedSortKey && sortDirection === 'ascending') ? 'descending' : 'ascending';
    setSortKey(selectedSortKey);
    setSortDirection(newDirection);
  };

  const sortedApiInventory = sortArray(filteredApiInventory, sortKey, sortDirection);

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">Dashboard Overview</h2>

        {/* Overview Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 shadow rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900">Total APIs</h3>
            <p className="text-gray-700">Number of APIs: {apiInventory.length}</p>
          </div>
          <div className="bg-white p-6 shadow rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900">Vulnerable APIs</h3>
            <p className="text-gray-700">Number of Vulnerable APIs: {vulnerabilities.length}</p>
          </div>
          <div className="bg-white p-6 shadow rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900">Security Incidents</h3>
            <p className="text-gray-700">Number of Incidents: {incidents.length}</p>
          </div>
          <div className="bg-white p-6 shadow rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900">Compliance Status</h3>
            <p className="text-gray-700">Compliance: In Progress</p>
          </div>
        </div>

        {/* Data Visualization Section */}
        <h3 className="text-xl font-bold text-blue-900 mb-4">Data Visualization</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 shadow rounded-lg">
            <h4 className="text-lg font-semibold text-blue-900 mb-2">API Vulnerabilities</h4>
            <Bar data={apiVulnerabilityData} />
          </div>
          <div className="bg-white p-6 shadow rounded-lg">
            <h4 className="text-lg font-semibold text-blue-900 mb-2">Security Incidents</h4>
            <Pie data={apiIncidentData} />
          </div>
        </div>

        {/* Search Bar and Sort Dropdown for API Inventory */}
        <div className="mb-4 flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search APIs..."
            className="p-2 border border-gray-300 rounded w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={sortKey}
            onChange={handleSortChange}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="name">Sort by Name</option>
            <option value="description">Sort by Description</option>
            <option value="owner">Sort by Owner</option>
            <option value="creationDate">Sort by Creation Date</option>
            <option value="endpoint">Sort by Endpoints</option>
          </select>
        </div>
        <h3 className="text-xl font-bold text-blue-900 mb-4">Secured API</h3>
        {/* API Inventory Table */}
        <div className="bg-white p-6 shadow rounded-lg mb-6">
          <table className="w-full">
            <thead>
              <tr>
                <th className="border-b p-4 text-left">API Name</th>
                <th className="border-b p-4 text-left">Description</th>
                <th className="border-b p-4 text-left">Owner</th>
                <th className="border-b p-4 text-left">Creation Date</th>
                <th className="border-b p-4 text-left">Endpoints</th>
              </tr>
            </thead>
            <tbody>
              {sortedApiInventory.map(api => (
                <tr key={api._id}>
                  <td className="border-b p-4">
                    <Link href={`/api/${api._id}`} className="text-blue-500 hover:underline">
                      {api.name}
                    </Link>
                  </td>
                  <td className="border-b p-4">{api.description}</td>
                  <td className="border-b p-4">{api.owner}</td>
                  <td className="border-b p-4">{api.creationDate}</td>
                  <td className="border-b p-4">{api.endpoint}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
