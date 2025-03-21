import React, { JSX } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Sector,
  SectorProps,
} from "recharts";

const CustomPieChart = () => {
  // Data for the chart - ordered clockwise from top
  const data = [
    { name: "Facebook", value: 30, color: "#1877F2", label: "Facebook" }, // Blue
    { name: "Instagram", value: 25, color: "#A259FF", label: "Instagram" }, // Purple
    { name: "Other", value: 20, color: "#FFC857", label: "Other" }, // Yellow
    { name: "None", value: 15, color: "#4BD0A0", label: "None" }, // Green
    { name: "Google", value: 10, color: "#FF4655", label: "Google" }, // Red
  ];

  interface RenderActiveShapeProps extends SectorProps {
    cx: number;
    cy: number;
    innerRadius: number;
    outerRadius: number;
    startAngle: number;
    endAngle: number;
    fill: string;
    payload: {
      value: number;
      label: string;
    };
    midAngle: number;
  }

  // Customize the appearance of the pie sectors
  const renderActiveShape = (props: RenderActiveShapeProps) => {
    const {
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      midAngle,
    } = props;

    // Calculate the position for the percentage and label
    const RADIAN = Math.PI / 180;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);

    // Calculate outer label position (percentages)
    const labelRadius = outerRadius * 1.3;
    const textX = cx + labelRadius * cos;
    const textY = cy + labelRadius * sin;

    // Calculate outer name label position (even further out)
    const nameRadius = outerRadius * 1.3;
    const nameX = cx + nameRadius * cos;
    const nameY = cy + nameRadius * sin + 16; // Position name directly below percentage

    // Create arc path with gap effect
    const gapDegrees = 5;
    const adjustedStartAngle = startAngle + gapDegrees / 2;
    const adjustedEndAngle = endAngle - gapDegrees / 2;

    const path = Sector({
      cx,
      cy,
      innerRadius: innerRadius,
      outerRadius,
      startAngle: adjustedStartAngle,
      endAngle: adjustedEndAngle,
      fill,
      cornerRadius: 16, // Large corner radius for pronounced rounding (matches image)
    }) as JSX.Element;

    return (
      <g>
        {path}

        {/* Percentage label */}
        <text
          x={textX}
          y={textY}
          fill={fill}
          fontSize={15}
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="central"
        >
          {`${payload.value}%`}
        </text>

        {/* Name label */}
        <text
          x={nameX}
          y={nameY}
          fill="#637381"
          fontSize={13}
          textAnchor="middle"
          dominantBaseline="central"
        >
          {payload.label}
        </text>
      </g>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          // label
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={5}
          startAngle={90}
          endAngle={-270}
          activeShape={renderActiveShape as any}
          activeIndex={[0, 1, 2, 3, 4]} // Make all sectors active to show labels
          isAnimationActive={false} // Disable animation for exact appearance
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CustomPieChart;
