import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import DashboardModel, { revenueTrendData } from "../models/DashboardModel";
import { formatNumberWithAffixes } from "../utils/number";

interface DailyRevenueTrendProps {
  data: revenueTrendData[];
}

const DailyRevenueTrend: React.FC<DailyRevenueTrendProps> = ({ data = [] }) => {
  // Format currency for tooltips and axis
  const formatCurrency = (value: number) => {
    return `${formatNumberWithAffixes(value, "$", "")}`;
  };

  // Format date for the x-axis ticks
  const formatXAxis = (dateStr: string | number | Date) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    return `${day} ${month}`;

    // Only show a few dates to avoid overcrowding
    if (
      day === 1 ||
      day === 5 ||
      day === 10 ||
      day === 15 ||
      day === 20 ||
      day === 25 ||
      day === 31
    ) {
      return `${day} ${month}`;
    }
    return "";
  };

  // Custom tooltip
  const CustomTooltip: React.FC<{
    active?: boolean;
    payload?: any[];
    label?: string;
  }> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const formattedDate = label
        ? new Date(label).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        : "Invalid Date";

      return (
        <div className="bg-white p-2 border border-gray-200 shadow-md rounded">
          <p className="font-medium text-gray-800">{formattedDate}</p>
          <p className="text-blue-500 font-medium">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const calculateYAxisTicks = (data: revenueTrendData[]) => {
    // Find min and max values in your data
    const values = data.map((item) => item.revenue);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);

    // Round down min value and round up max value for nicer boundaries
    const min = Math.floor(minValue / 5000) * 500;
    const max = Math.ceil(maxValue / 5000) * 5000;

    // Determine an appropriate tick interval based on your data range
    const range = max - min;
    let tickInterval;

    if (range <= 20000) tickInterval = 5000; // Small range
    else if (range <= 50000) tickInterval = 10000; // Medium range
    else if (range <= 100000) tickInterval = 20000; // Larger range
    else tickInterval = 50000; // Very large range

    // Generate ticks from min to max using the interval
    const ticks = [];
    for (let tick = min; tick <= max; tick += tickInterval) {
      ticks.push(tick);
    }

    return ticks;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2196F3" stopOpacity={0.1} />
            <stop offset="95%" stopColor="#2196F3" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#f0f0f0"
        />

        <XAxis
          dataKey="date"
          tickFormatter={formatXAxis}
          axisLine={{ stroke: "#f0f0f0" }}
          tickLine={false}
          tick={{ fill: "#9CA3AF", fontSize: 12 }}
        />

        <YAxis
          tickFormatter={(value) =>
            `${formatNumberWithAffixes(value, "$", "")}`
          }
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#9CA3AF", fontSize: 12 }}
          domain={["dataMin - 10000", "dataMax + 10000"]}
          ticks={calculateYAxisTicks(data)}
        />

        <Tooltip
          content={
            <CustomTooltip
              active={undefined}
              payload={undefined}
              label={undefined}
            />
          }
        />

        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#2196F3"
          strokeWidth={2}
          fill="url(#colorRevenue)"
          dot={false}
          activeDot={{
            r: 6,
            fill: "#2196F3",
            stroke: "#FFF",
            strokeWidth: 2,
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default DailyRevenueTrend;
