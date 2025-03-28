// import React from "react";
// import {
//   ResponsiveContainer,
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
// } from "recharts";
// import DashboardModel, { revenueTrendData } from "../models/DashboardModel";
// import { formatNumberWithAffixes } from "../utils/number";

// interface DailyRevenueTrendProps {
//   data: revenueTrendData[];
// }

// const DailyRevenueTrend: React.FC<DailyRevenueTrendProps> = ({ data = [] }) => {
//   // Format currency for tooltips and axis
//   const formatCurrency = (value: number) => {
//     return `${formatNumberWithAffixes(value, "$", "")}`;
//   };

//   // Format date for the x-axis ticks
//   const formatXAxis = (dateStr: string | number | Date) => {
//     const date = new Date(dateStr);
//     const day = date.getDate();
//     const month = date.toLocaleString("default", { month: "short" });
//     return `${day} ${month}`;

//     // Only show a few dates to avoid overcrowding
//     if (
//       day === 1 ||
//       day === 5 ||
//       day === 10 ||
//       day === 15 ||
//       day === 20 ||
//       day === 25 ||
//       day === 31
//     ) {
//       return `${day} ${month}`;
//     }
//     return "";
//   };

//   // Custom tooltip
//   const CustomTooltip: React.FC<{
//     active?: boolean;
//     payload?: any[];
//     label?: string;
//   }> = ({ active, payload, label }) => {
//     if (active && payload && payload.length) {
//       const formattedDate = label
//         ? new Date(label).toLocaleDateString("en-US", {
//             month: "short",
//             day: "numeric",
//           })
//         : "Invalid Date";

//       return (
//         <div className="bg-white p-2 border border-gray-200 shadow-md rounded">
//           <p className="font-medium text-gray-800">{formattedDate}</p>
//           <p className="text-blue-500 font-medium">
//             {formatCurrency(payload[0].value)}
//           </p>
//         </div>
//       );
//     }
//     return null;
//   };

//   const calculateYAxisTicks = (data: revenueTrendData[]) => {
//     // Find min and max values in your data
//     const values = data.map((item) => item.revenue);
//     const minValue = Math.min(...values);
//     const maxValue = Math.max(...values);

//     // Round down min value and round up max value for nicer boundaries
//     const min = Math.floor(minValue / 5000) * 500;
//     const max = Math.ceil(maxValue / 5000) * 5000;

//     // Determine an appropriate tick interval based on your data range
//     const range = max - min;
//     let tickInterval;

//     if (range <= 20000) tickInterval = 5000; // Small range
//     else if (range <= 50000) tickInterval = 10000; // Medium range
//     else if (range <= 100000) tickInterval = 20000; // Larger range
//     else tickInterval = 50000; // Very large range

//     // Generate ticks from min to max using the interval
//     const ticks = [];
//     for (let tick = min; tick <= max; tick += tickInterval) {
//       ticks.push(tick);
//     }

//     return ticks;
//   };

//   return (
//     <ResponsiveContainer width="100%" height="100%">
//       <AreaChart data={data} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
//         <defs>
//           <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
//             <stop offset="5%" stopColor="#2196F3" stopOpacity={0.1} />
//             <stop offset="95%" stopColor="#2196F3" stopOpacity={0} />
//           </linearGradient>
//         </defs>

//         <CartesianGrid
//           strokeDasharray="3 3"
//           vertical={false}
//           stroke="#f0f0f0"
//         />

//         <XAxis
//           dataKey="date"
//           tickFormatter={formatXAxis}
//           axisLine={{ stroke: "#f0f0f0" }}
//           tickLine={false}
//           tick={{ fill: "#9CA3AF", fontSize: 12 }}
//         />

//         <YAxis
//           tickFormatter={(value) =>
//             `${formatNumberWithAffixes(value, "$", "")}`
//           }
//           axisLine={false}
//           tickLine={false}
//           tick={{ fill: "#9CA3AF", fontSize: 12 }}
//           domain={["dataMin - 10000", "dataMax + 10000"]}
//           ticks={calculateYAxisTicks(data)}
//         />

//         <Tooltip
//           content={
//             <CustomTooltip
//               active={undefined}
//               payload={undefined}
//               label={undefined}
//             />
//           }
//         />

//         <Area
//           type="monotone"
//           dataKey="revenue"
//           stroke="#2196F3"
//           strokeWidth={2}
//           fill="url(#colorRevenue)"
//           dot={false}
//           activeDot={{
//             r: 6,
//             fill: "#2196F3",
//             stroke: "#FFF",
//             strokeWidth: 2,
//           }}
//         />
//       </AreaChart>
//     </ResponsiveContainer>
//   );
// };

// export default DailyRevenueTrend;

import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { formatNumberWithAffixes } from "../utils/number";

interface RevenueTrendData {
  date: string;
  revenue: number;
}

interface DailyRevenueTrendProps {
  data: RevenueTrendData[];
  timeRange: number; // 1: 7d, 2: 30d, 3: all time
}

const DailyRevenueTrend: React.FC<DailyRevenueTrendProps> = ({
  data = [],
  timeRange = 1,
}) => {
  // Format currency for tooltips and axis
  const formatCurrency = (value: number) => {
    return `${formatNumberWithAffixes(value, "$", "")}`;
  };

  // Dynamically determine which dates to show on X-axis based on timeRange
  const formatXAxis = (dateStr: string | number | Date) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });

    // Different tick strategies based on time range
    switch (timeRange) {
      case 1:
        // Show every day for a week view
        return `${day} ${month}`;

      case 2:
        // For a month view, show every 5th day
        return `${day} ${month}`;
        if (
          day === 1 ||
          day === 5 ||
          day === 10 ||
          day === 15 ||
          day === 20 ||
          day === 25 ||
          day === 30
        ) {
          return `${day} ${month}`;
        }
        return "";

      case 3:
        return `${day} ${month}`;
        // For all-time view, show only the 1st of each month
        if (day === 1) {
          return `${day} ${month}`;
        }
        return "";

      default:
        return `${day} ${month}`;
    }
  };

  // Calculate optimal ticks for X-axis based on timeRange
  const getXAxisTickInterval = () => {
    switch (timeRange) {
      case 1:
        return 1; // Every day
      case 2:
        return 5; // Every 5 days
      case 3:
        // For all-time, we'll use dynamic calculation based on data size
        const totalDays = data.length;
        if (totalDays <= 30) return 5;
        if (totalDays <= 90) return 15;
        if (totalDays <= 180) return 30;
        return Math.ceil(totalDays / 10); // Aim for roughly 10 ticks across the chart
      default:
        return 1;
    }
  };

  // Optimize Y-axis ticks based on the actual data range and the selected time period
  const calculateYAxisTicks = useMemo(() => {
    if (!data.length) return [];

    // Find min and max values in the data
    const values = data.map((item) => item.revenue);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);

    // We aim to have 5-7 ticks on the Y-axis for optimal readability
    const targetTickCount = 6;

    // Determine base tick interval based on data range and time period
    let tickInterval;
    let min;
    let max;

    // Adjust based on time period (daily revenues can be higher for week/month views)
    if (timeRange === 1) {
      // 7d
      // For weekly view, we know from analysis daily revenues can be up to ~$4,500
      if (maxValue < 1000) {
        tickInterval = 200;
      } else if (maxValue < 2500) {
        tickInterval = 500;
      } else if (maxValue < 5000) {
        tickInterval = 1000;
      } else {
        tickInterval = Math.ceil(maxValue / targetTickCount / 1000) * 1000;
      }
    } else if (timeRange === 2) {
      // 30d
      // For monthly view, we know from analysis daily revenues can be up to ~$5,400
      if (maxValue < 1000) {
        tickInterval = 200;
      } else if (maxValue < 3000) {
        tickInterval = 500;
      } else if (maxValue < 6000) {
        tickInterval = 1000;
      } else {
        tickInterval = Math.ceil(maxValue / targetTickCount / 1000) * 1000;
      }
    } else {
      // 3: all time
      // All-time view - our analysis shows daily revenues up to ~$5,500
      if (maxValue < 1000) {
        tickInterval = 200;
      } else if (maxValue < 3000) {
        tickInterval = 500;
      } else if (maxValue < 6000) {
        tickInterval = 1000;
      } else {
        tickInterval = Math.ceil(maxValue / targetTickCount / 1000) * 1000;
      }
    }

    // Ensure we always start from 0 for revenue charts
    min = 0;

    // Calculate max by rounding up to the nearest interval
    max = Math.ceil(maxValue / tickInterval) * tickInterval;

    // Add extra headroom if max is close to the data max
    if (max - maxValue < tickInterval * 0.2) {
      max += tickInterval;
    }

    // Generate the tick values
    const ticks = [];
    for (let tick = min; tick <= max; tick += tickInterval) {
      ticks.push(tick);
    }

    return ticks;
  }, [data, timeRange]);

  // Calculate domain padding for Y-axis
  const yAxisDomain = useMemo(() => {
    if (!data.length || !calculateYAxisTicks.length) {
      return [0, "auto"];
    }

    const minTick = calculateYAxisTicks[0];
    const maxTick = calculateYAxisTicks[calculateYAxisTicks.length - 1];

    // Add a small padding above the highest tick for visual appeal
    const topPadding = (maxTick - minTick) * 0.1; // 10% padding
    return [
      Math.max(0, minTick), // Never go below zero for revenue
      maxTick + topPadding,
    ];
  }, [calculateYAxisTicks, data]);

  // Custom tooltip
  const CustomTooltip: React.FC<{
    active?: boolean;
    payload?: any[];
    label?: string;
  }> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Determine date formatting options based on time range
      let dateOptions: Intl.DateTimeFormatOptions = {
        month: "short",
        day: "numeric",
      };

      // For all-time view, always include the year
      if (timeRange === 3) {
        // all time
        dateOptions.year = "numeric";
      }

      const formattedDate = label
        ? new Date(label).toLocaleDateString("en-US", dateOptions)
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

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
      >
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
          // ticks={getXAxisTicks}
          padding={{ left: 10, right: 10 }}
        />

        <YAxis
          tickFormatter={(value) => formatCurrency(value)}
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#9CA3AF", fontSize: 12 }}
          //@ts-ignore
          domain={yAxisDomain}
          ticks={calculateYAxisTicks}
          width={60}
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
