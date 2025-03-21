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
        className="h-32 bg-white border-2 border-green-200 rounded-lg p-4 relative"
      >
        <div className="text-gray-500 mb-2">{title}</div>
        <div className="text-2xl font-bold">
          {formatNumberWithAffixes(value, "$", "")}
        </div>
        {change && (
          <div className="text-green-500 text-sm">
            ↑ {formatNumberWithAffixes(change, "", "%")}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {metricsData.map((item) =>
        renderMetricCard(item.title, item.value, item?.change)
      )}
    </div>
  );
};
