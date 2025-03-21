// import React, { useState } from 'react';

// // Tabs for mobile view
// const tabs = ['Dashboard', 'Analytics', 'Settings'];

// function ResponsiveApp() {
//   const [activeTab, setActiveTab] = useState('Dashboard');

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Dashboard container with responsive padding */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

//         {/* Header area */}
//         <div className="flex justify-between items-center mb-6">
//           <div className="flex items-center">
//             <div className="h-8 w-8 bg-blue-500 rounded-full"></div>
//             <span className="ml-2 text-xl font-semibold">WalPulse</span>
//           </div>

//           {/* Mobile tabs - only visible on mobile */}
//           <div className="md:hidden">
//             <select
//               className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//               value={activeTab}
//               onChange={(e) => setActiveTab(e.target.value)}
//             >
//               {tabs.map(tab => (
//                 <option key={tab} value={tab}>{tab}</option>
//               ))}
//             </select>
//           </div>

//           {/* Desktop filter controls - hidden on mobile */}
//           <div className="hidden md:block">
//             <div className="h-10 w-64 bg-white border border-gray-200 rounded-full"></div>
//           </div>

//           {/* Filter button always visible */}
//           <div className="ml-2">
//             <div className="h-10 w-10 bg-white border border-gray-200 rounded-full"></div>
//           </div>
//         </div>

//         {/* Metrics row - stack on mobile, row on tablet+ */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//           <div className="h-32 bg-white border border-gray-200 rounded-lg p-4">
//             <div className="text-gray-500 mb-2">Revenue</div>
//             <div className="text-2xl font-bold">$128M</div>
//           </div>

//           <div className="h-32 bg-white border border-gray-200 rounded-lg p-4">
//             <div className="text-gray-500 mb-2">Transactions</div>
//             <div className="text-2xl font-bold">1.4M</div>
//           </div>

//           <div className="h-32 bg-white border border-gray-200 rounded-lg p-4">
//             <div className="text-gray-500 mb-2">Unique Customers</div>
//             <div className="text-2xl font-bold">824K</div>
//           </div>
//         </div>

//         {/* Visualization grid - changes layout based on screen size */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* UTM to Demographics flow - full width on mobile, half width on large screens */}
//           <div className="h-96 bg-white border border-gray-200 rounded-lg p-4">
//             <div className="text-gray-500 mb-2">UTM Source / Age Group</div>
//             <div className="w-full h-5/6 border border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400">
//               Flow Chart Placeholder
//             </div>
//           </div>

//           {/* Right column charts - stacked on mobile, side by side in column on large screens */}
//           <div className="flex flex-col space-y-6">
//             {/* UTM Source Revenue Attribution */}
//             <div className="h-44 md:h-[240px] bg-white border border-gray-200 rounded-lg p-4">
//               <div className="text-gray-500 mb-2">UTM Source / Revenue Attribution</div>
//               <div className="w-full h-5/6 border border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400">
//                 Donut Chart Placeholder
//               </div>
//             </div>

//             {/* Revenue Trend */}
//             <div className="h-44 md:h-[240px] bg-white border border-gray-200 rounded-lg p-4">
//               <div className="text-gray-500 mb-2">Revenue Trend</div>
//               <div className="w-full h-5/6 border border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400">
//                 Line Chart Placeholder
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Mobile-only navigation tabs fixed at bottom - only visible on mobile */}
//         <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
//           <div className="flex justify-around">
//             {tabs.map(tab => (
//               <button
//                 key={tab}
//                 className={`flex-1 py-4 text-center ${activeTab === tab ? 'text-blue-600 border-t-2 border-blue-600' : 'text-gray-500'}`}
//                 onClick={() => setActiveTab(tab)}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ResponsiveApp;

import React from "react";
import EnhancedResponsiveApp from "./EnhancedResponsiveApp";
function App() {
  return <EnhancedResponsiveApp />;
}

export default App;
