import React, { useState, useEffect } from "react";
import { TimeRangeTab, TimeRangeTabMap } from "./models/DashboardModel";
import DashboardModel, { TransactionsTabRange } from "./models/DashboardModel";
import { useFetchTransactions } from "./hooks/fetchTransaction";
import LoadingPage from "./views/loadingPage";
import { useAppDispatch } from "./redux/hooks";
import { AppDispatch, RootState } from "./redux/store";
import { ageGroupActions } from "./redux/slices/ageGroupSlice";
import { LogoIcon } from "./components/icons";
import FilterPanel from "./components/Filters";
import { useSelector } from "react-redux";

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

const TABS_DAYS_RANGE = [
  TimeRangeTab.Last7Days,
  TimeRangeTab.Last30Days,
  TimeRangeTab.AllTime,
];

function EnhancedResponsiveApp() {
  const dispatch = useAppDispatch<AppDispatch>();
  const utms = useSelector((state: RootState) => state.filters.utms);
  const gender = useSelector((state: RootState) => state.filters.gender);
  const ageGroups = useSelector((state: RootState) => state.filters.ageGroups);
  const revenue = useSelector((state: RootState) => state.filters.revenue);

  const [selectedDaysTab, setSelectedDaysTab] = useState(
    TimeRangeTab.Last7Days
  );
  // const [isPending, startTransition] = useTransition();

  const { transactions, isLoading } = useFetchTransactions();

  const memoizedTransactions = React.useMemo(() => {
    const filters = {
      utms,
      gender,
      ageGroups,
      revenue,
    };
    return DashboardModel.processTransactions(transactions, selectedDaysTab, filters);
  }, [transactions, selectedDaysTab, utms, gender, ageGroups, revenue]);

  useEffect(() => {
    const t = memoizedTransactions;
    // setTransactionByTabRange(t);
    setTimeout(() => {
      requestAnimationFrame(() => {
        dispatch(ageGroupActions.updateGraph());
      });
    }, 50);
  }, [memoizedTransactions]);

  const renderRangeTabs = () => {
    return TABS_DAYS_RANGE.map((tab) => (
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

          <div className="hidden sm:flex items-center">
            <div className="ml-2 h-10 w-10 bg-white border border-gray-200 rounded-full flex items-center justify-center">
              <FilterPanel />
            </div>
          </div>
        </div>

        <React.Suspense fallback={<div>Loading components...</div>}>
          <MetricCards />
        </React.Suspense>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="min-h-[30rem] bg-white  rounded-lg relative">
            <React.Suspense fallback={<div>Loading components...</div>}>
              <SankeyDiagram />
            </React.Suspense>
          </div>

          <div className="flex flex-col h-[48rem] space-y-6  rounded-lg bg-purple-50 relative">
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
            {TABS_DAYS_RANGE.map((tab) => (
              <button
                key={tab}
                className={`flex-1 py-4 text-center ${
                  selectedDaysTab === tab
                    ? "text-blue-600 border-t-2 border-blue-600"
                    : "text-gray-500"
                }`}
                onClick={() => {
                  setSelectedDaysTab(tab);
                }}
              >
                {TimeRangeTabMap[tab]}
              </button>
            ))}
          </div>
        </div>
      </React.Fragment>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? renderLoading() : renderMainContent()}
      </div>
    </div>
  );
}

export default EnhancedResponsiveApp;
