
import React, { useState, useEffect, useRef } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts";

interface DataItem {
  name: string;
  value: number;
  color: string;
  label: string;
}

interface RenderActiveShapeProps {
  cx: number;
  cy: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  fill: string;
  payload: DataItem;
  percent: number;
  value: number;
  midAngle: number;
}

const ResponsiveCustomPieChart = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [isMobile, setIsMobile] = useState(false);

  // Data for the chart - ordered clockwise from top
  const data: DataItem[] = [
    { name: "Facebook", value: 30, color: "#1877F2", label: "Facebook" }, // Blue
    { name: "Instagram", value: 25, color: "#A259FF", label: "Instagram" }, // Purple
    { name: "Other", value: 20, color: "#FFC857", label: "Other" }, // Yellow
    { name: "None", value: 15, color: "#4BD0A0", label: "None" }, // Green
    { name: "Google", value: 10, color: "#FF4655", label: "Google" }, // Red
  ];

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setContainerSize({ width, height });
        setIsMobile(width < 400);
      }
    };

    // Initial size check
    handleResize();

    // Add resize listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const renderMobileLegend = () => {
    return (
      <div className="mt-4 absolute grid grid-cols-4 gap-2 px-2 right-0 bottom-0">
        {data.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center">
            <div
              className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <div className="text-xs text-gray-700 truncate">{entry.name}</div>
            <div className="ml-auto text-xs font-semibold">{`${entry.value}%`}</div>
          </div>
        ))}
      </div>
    );
  };

  // Calculate dimensions based on container size
  const calculateDimensions = () => {
    const minDimension = Math.min(containerSize.width, containerSize.height);

    return {
      innerRadius: Math.max(minDimension * 0.15, 30),
      outerRadius: Math.max(minDimension * 0.25, 60),
      labelOffset: isMobile ? 15 : 30,
    };
  };

  const { innerRadius, outerRadius, labelOffset } = calculateDimensions();

  // Customize the appearance of the pie sectors
  const renderActiveShape = (props: RenderActiveShapeProps) => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      value,
    } = props;

    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);

    // Calculate positions for the connector line and label
    const sx = cx + (outerRadius + 5) * cos;
    const sy = cy + (outerRadius + 5) * sin;
    const mx = cx + (outerRadius + labelOffset) * cos;
    const my = cy + (outerRadius + labelOffset) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    // Create arc path with gap effect
    const gapDegrees = 5;
    const adjustedStartAngle = startAngle + gapDegrees / 2;
    const adjustedEndAngle = endAngle - gapDegrees / 2;

    const sectorEl = Sector({
      cx,
      cy,
      innerRadius: innerRadius,
      outerRadius,
      startAngle: adjustedStartAngle,
      endAngle: adjustedEndAngle,
      fill,
      cornerRadius: isMobile ? 8 : 16,
    }) as React.ReactElement;

    // Don't show connectors on very small screens
    if (containerSize.width < 300) {
      return sectorEl;
    }

    return (
      <g>
        {sectorEl}

        {/* Only show connector lines and labels if we have enough space */}
        {containerSize.width >= 250 && (
          <>
            <path
              d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
              stroke={fill}
              fill="none"
            />
            <text
              x={ex + (cos >= 0 ? 1 : -1) * 12}
              y={ey}
              textAnchor={textAnchor}
              fill="#333"
              fontSize={isMobile ? "10px" : "12px"}
              className="font-medium"
            >{`${value}% ${isMobile ? "" : payload.name}`}</text>
          </>
        )}
      </g>
    );
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center"
      style={{ minHeight: "200px" }}
    >
      {/* Background white circle with shadow */}
      <div
        className="absolute bg-white rounded-full"
        style={{
          width: `${
            Math.min(containerSize.width, containerSize.height) * 0.65
          }px`,
          height: `${
            Math.min(containerSize.width, containerSize.height) * 0.65
          }px`,
          boxShadow: "0 0 40px rgba(0, 0, 0, 0.09)",
        }}
      ></div>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
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

      {isMobile && renderMobileLegend()}
    </div>
  );
};

export default ResponsiveCustomPieChart;
