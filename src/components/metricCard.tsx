import React from "react";
import DashboardModel from "../models/DashboardModel";
import { formatNumberWithAffixes } from "../utils/number";

interface MetricCardsProps {
  // Define the props for the MetricCard component
}

export const MetricCards: React.FC<MetricCardsProps> = () => {
  const transactionsTabRange = DashboardModel.transactionsTabRange;

  const metricsData = [
    // Revenue
    {
      title: "Revenue",
      value: transactionsTabRange.totalRevenue,
      change: transactionsTabRange.revenueChange,
    },
    // Transactions
    {
      title: "Transactions",
      value: transactionsTabRange.totalTransactions,
      change: transactionsTabRange.transactionsChange,
    },
    // Unique Customers
    {
      title: "Unique Customers",
      value: transactionsTabRange.uniqueCustomers,
      change: null,
    },
  ];
  const renderMetricCard = (
    title: string,
    value: number,
    change: number | null
  ) => {
    return (
      <div
        key={title}
        className="h-32 bg-white  rounded-2xl p-4 relative shadow-xs flex flex-col gap-1 justify-center"
      >
        <div className="text-[#687D9C] font-medium font-inter text-[0.9rem]">
          {title}
        </div>
        <div className="flex items-center gap-3">
          <div className="font-medium font-inter text-[1.563rem]">
            {formatNumberWithAffixes(value, "$", "")}
          </div>
          {change !== null && (
            <div className="text-[#379F72] bg-[#EBF5F0] h-[31px] rounded-2xl text-sm px-2 flex items-center">
              ↑{formatNumberWithAffixes(change, "", "%")}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
      {metricsData.map((item) =>
        renderMetricCard(item.title, item.value, item?.change)
      )}
    </div>
  );
};
