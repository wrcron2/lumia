import React, {
  useState,
  useEffect,
  use,
  useLayoutEffect,
  useTransition,
} from "react";
import { TimeRangeTab, TimeRangeTabMap } from "./models/DashboardModel";
import DashboardModel, { TransactionsTabRange } from "./models/DashboardModel";
import { useFetchTransactions } from "./hooks/fetchTransaction";
import LoadingPage from "./views/loadingPage";
import { useAppSelector, useAppDispatch } from "./redux/hooks";
import { AppDispatch } from "./redux/store";
import { ageGroupActions } from "./redux/slices/ageGroupSlice";
import { LogoIcon } from "./components/icons";

// Lazy load components that should only load after loading is complete
const SankeyDiagram = React.lazy(() => import("./components/sankyDiagram"));
const CustomPieChart = React.lazy(
  () => import("./components/revenueAttributionGraph")
);
const MetricCards = React.lazy(() =>
  import("./components/metricCard").then((module) => ({
    default: module.MetricCards,
  }))
);
const DailyRevenueTrend = React.lazy(
  () => import("./components/revenueTrendChart")
);

// Tabs for mobile view
const tabs = ["Last 7 Days", "Last 30 Days", "All Time"];

function EnhancedResponsiveApp() {
  const dispatch = useAppDispatch<AppDispatch>();

  const [activeTab, setActiveTab] = useState("Dashboard");
  const [selectedDaysTab, setSelectedDaysTab] = useState(
    TimeRangeTab.Last7Days
  );
  // const [isPending, startTransition] = useTransition();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [breakpointIndicator, setBreakpointIndicator] = useState("");
  const { transactions, isLoading, error, reFetch } = useFetchTransactions();
  const [transactionsByTabRange, setTransactionByTabRange] =
    useState<TransactionsTabRange>();
  // Update window width state on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);

      // Update breakpoint indicator
      if (window.innerWidth < 640) {
        setBreakpointIndicator("xs (< 640px)");
      } else if (window.innerWidth < 768) {
        setBreakpointIndicator("sm (640px - 767px)");
      } else if (window.innerWidth < 1024) {
        setBreakpointIndicator("md (768px - 1023px)");
      } else if (window.innerWidth < 1280) {
        setBreakpointIndicator("lg (1024px - 1279px)");
      } else {
        setBreakpointIndicator("xl (≥ 1280px)");
      }
    };

    // Initial call
    handleResize();

    // Set up event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const memoizedTransactions = React.useMemo(() => {
    return DashboardModel.processTransactions(transactions, selectedDaysTab);
  }, [transactions, selectedDaysTab]);

  useEffect(() => {
    const t = memoizedTransactions;
    setTransactionByTabRange(t);
    setTimeout(() => {
      requestAnimationFrame(() => {
        dispatch(ageGroupActions.updateGraph());
      });
    }, 50);
  }, [memoizedTransactions]);

  const renderRangeTabs = () => {
    return [
      TimeRangeTab.Last7Days,
      TimeRangeTab.Last30Days,
      TimeRangeTab.AllTime,
    ].map((tab) => (
      <button
        key={tab}
        className={`
        px-4 py-2 h-[2.rem] w-[8.5rem] 
        cursor-pointer 
        rounded-full 
        relative 
        overflow-hidden
        transition-all duration-300 ease-in-out
        ${
          selectedDaysTab === tab
            ? "text-[#004385] font-bold"
            : "text-gray-500 font-medium hover:bg-gray-100/50"
        }
      `}
        onClick={() => {
          requestAnimationFrame(() => {
            setSelectedDaysTab(tab);
          });
        }}
      >
        {/* Background element that animates */}
        <span
          className={`
          absolute inset-0 
          bg-[#E6F0F9] 
          rounded-full 
          transition-transform duration-300 ease-in-out
          ${selectedDaysTab === tab ? "scale-100" : "scale-0"}
        `}
          aria-hidden="true"
        ></span>

        {/* Text content */}
        <span className="relative z-10 transition-all duration-100">
          {TimeRangeTabMap[tab]}
        </span>
      </button>
    ));
  };

  const renderLoading = () => {
    return <LoadingPage />;
  };

  const renderMainContent = () => {
    return (
      <React.Fragment>
        {/* Header area */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2  pt-6  p-2 rounded">
          <div className="flex items-center">
            <LogoIcon size={148} />
          </div>

          <div className="w-auto hidden sm:w-[26.75rem] h-[3.5rem] items-center sm:flex justify-center bg-white rounded-full">
            {renderRangeTabs()}
          </div>

          {/* Desktop filter controls - hidden on mobile */}
          <div className="hidden sm:flex items-center">
            {/* Filter button */}
            <div className="ml-2 h-10 w-10 bg-white border border-gray-200 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Render components only when not loading, using React.Suspense */}
        <React.Suspense fallback={<div>Loading components...</div>}>
          <MetricCards />
        </React.Suspense>

        {/* Visualization grid - changes layout based on screen size */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* UTM to Demographics flow - full width on mobile/tablet, half width on desktop */}
          <div className="min-h-[30rem] bg-white  rounded-lg relative">
            <React.Suspense fallback={<div>Loading components...</div>}>
              {/* <SankeyDiagram
                nodes={transactionsByTabRange?.utmAgeDemographics?.nodes || []}
                links={transactionsByTabRange?.utmAgeDemographics?.links || []}
              /> */}
              <SankeyDiagram />
            </React.Suspense>
          </div>

          {/* Right column charts - stacked on mobile, side by side in column on large screens */}
          <div className="flex flex-col h-[48rem] space-y-6  rounded-lg bg-purple-50 relative">
            {/* UTM Source Revenue Attribution */}
            <div className="flex-1 md:h-full bg-white border border-gray-200 rounded-lg p-4">
              <div className="h-7 text-gray-500 mb-2">
                UTM Source / Revenue Attribution
              </div>
              <div className="w-full h-6/7  flex items-center justify-center text-gray-400">
                <React.Suspense fallback={<div>Loading components...</div>}>
                  <CustomPieChart
                    data={
                      DashboardModel?.transactionsTabRange
                        ?.revenueAttributionData || []
                    }
                  />
                </React.Suspense>
              </div>
            </div>

            {/* Revenue Trend */}
            <div className="flex-1 md:h-full bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-gray-500 mb-2">Revenue Trend</div>
              <div className="w-full h-6/7  rounded flex items-center justify-center text-gray-400">
                <React.Suspense fallback={<div>Loading components...</div>}>
                  <DailyRevenueTrend
                    data={
                      DashboardModel.transactionsTabRange?.revenueTrendData ||
                      []
                    }
                    timeRange={selectedDaysTab}
                  />
                </React.Suspense>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-only navigation tabs fixed at bottom - only visible on small screens */}
        <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
          <div className="flex justify-around">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`flex-1 py-4 text-center ${
                  activeTab === tab
                    ? "text-blue-600 border-t-2 border-blue-600"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </React.Fragment>
    );
  };

  // const renderMainContent = () => {
  //   return (
  //     <React.Fragment>
  //       {/* Header area */}
  //       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 border border-blue-300 p-2 rounded bg-blue-50">
  //         <div className="flex items-center mb-4 sm:mb-0">
  //           <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
  //             W
  //           </div>
  //           <span className="ml-2 text-xl font-semibold">WalPulse</span>
  //         </div>

  //         {/* Mobile tabs selector - only visible on very small screens */}
  //         <div className="sm:hidden">
  //           <select
  //             className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500"
  //             value={activeTab}
  //             onChange={(e) => setActiveTab(e.target.value)}
  //           >
  //             {tabs.map((tab) => (
  //               <option key={tab} value={tab}>
  //                 {tab}
  //               </option>
  //             ))}
  //           </select>
  //         </div>

  //         <div className="w-auto sm:w-[26.75rem] h-[3.5rem] items-center flex justify-center bg-white rounded-full">
  //           {renderRangeTabs()}
  //         </div>

  //         {/* Desktop filter controls - hidden on mobile */}
  //         <div className="hidden sm:flex items-center">
  //           {/* Filter button */}
  //           <div className="ml-2 h-10 w-10 bg-white border border-gray-200 rounded-full flex items-center justify-center">
  //             <svg
  //               xmlns="http://www.w3.org/2000/svg"
  //               className="h-5 w-5 text-gray-500"
  //               fill="none"
  //               viewBox="0 0 24 24"
  //               stroke="currentColor"
  //             >
  //               <path
  //                 strokeLinecap="round"
  //                 strokeLinejoin="round"
  //                 strokeWidth={2}
  //                 d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
  //               />
  //             </svg>
  //           </div>
  //         </div>
  //       </div>
  //       {/* Metrics row - stack on mobile, row on tablet+ */}
  //       <MetricCards />

  //       {/* Visualization grid - changes layout based on screen size */}
  //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  //         {/* UTM to Demographics flow - full width on mobile/tablet, half width on desktop */}
  //         <div className="min-h-[30rem] bg-white border-2 border-orange-200 rounded-lg relative">
  //           {/* <div className="absolute top-0 right-0 bg-orange-100 text-xs px-2 py-1 rounded-bl-lg">
  //               col-span-1/1 on mobile, col-span-1/2 on lg+
  //             </div>
  //             <div className="text-gray-500 mb-2">UTM Source / Age Group</div>
  //             <div className="w-full h-5/6 border border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400 flex-col">
  //               <span className="text-xl mb-2">Flow Chart Placeholder</span>
  //               <span className="text-sm text-center px-4">
  //                 Full width on mobile and tablet, half width on desktop (lg+)
  //               </span>

  //             </div> */}
  //           <SankeyDiagram
  //             nodes={transactionsByTabRange?.utmAgeDemographics.nodes || []}
  //             links={transactionsByTabRange?.utmAgeDemographics.links || []}
  //           />
  //         </div>

  //         {/* Right column charts - stacked on mobile, side by side in column on large screens */}
  //         <div className="flex flex-col h-[48rem]  space-y-6 border-2 border-purple-200  rounded-lg bg-purple-50 relative">
  //           {/* UTM Source Revenue Attribution */}
  //           <div className="flex-1 md:h-full bg-white border border-gray-200 rounded-lg p-4">
  //             <div className="h-7 text-gray-500 mb-2">
  //               UTM Source / Revenue Attribution
  //             </div>
  //             <div className="w-full h-6/7 border border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400">
  //               <CustomPieChart
  //                 data={
  //                   DashboardModel?.transactionsTabRange
  //                     ?.revenueAttributionData || []
  //                 }
  //               />
  //             </div>
  //           </div>

  //           {/* Revenue Trend */}
  //           <div className="flex-1 md:h-full bg-white border border-gray-200 rounded-lg p-4">
  //             <div className="text-gray-500 mb-2">Revenue Trend</div>
  //             <div className="w-full h-6/7 border border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400">
  //               <DailyRevenueTrend
  //                 data={DashboardModel.transactionsTabRange.revenueTrendData}
  //                 timeRange={selectedDaysTab}
  //               />
  //             </div>
  //           </div>
  //         </div>
  //       </div>

  //       {/* Mobile-only navigation tabs fixed at bottom - only visible on small screens */}
  //       <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
  //         <div className="flex justify-around">
  //           {tabs.map((tab) => (
  //             <button
  //               key={tab}
  //               className={`flex-1 py-4 text-center ${
  //                 activeTab === tab
  //                   ? "text-blue-600 border-t-2 border-blue-600"
  //                   : "text-gray-500"
  //               }`}
  //               onClick={() => setActiveTab(tab)}
  //             >
  //               {tab}
  //             </button>
  //           ))}
  //         </div>
  //       </div>
  //     </React.Fragment>
  //   );
  // };

  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      {/* Floating breakpoint indicator */}
      {/* <div className="fixed top-0 left-0 right-0 bg-blue-600 text-white text-center text-sm py-1 z-50">
      Current width: {windowWidth}px | Breakpoint: {breakpointIndicator}
    </div> */}

      {/* Dashboard container with responsive padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? renderLoading() : renderMainContent()}
      </div>
    </div>
  );
}

export default EnhancedResponsiveApp;
