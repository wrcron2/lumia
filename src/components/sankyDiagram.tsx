import React from "react";
import { ResponsiveContainer } from "recharts";

interface Node {
  id: string;
  name: string;
  color: string;
  x0?: number;
  x1?: number;
  y0?: number;
  y1?: number;
}

interface Link {
  source: string;
  target: string;
  value: number;
  color: string;
  sourceX?: number;
  sourceY?: number;
  sourceHeight?: number;
  targetX?: number;
  targetY?: number;
  targetHeight?: number;
}

// Custom Sankey Diagram Implementation
const SankeyDiagram = () => {
  // Data for our diagram
  const data = {
    nodes: [
      { id: "google", name: "Google", color: "#E34C4F" },
      { id: "facebook", name: "Facebook", color: "#4267B2" },
      { id: "instagram", name: "Instagram", color: "#C13584" },
      { id: "15-19", name: "15-19", color: "#D3D3D3" },
      { id: "20-29", name: "20-29", color: "#B0BEC5" },
      { id: "30-39", name: "30-39", color: "#90A4AE" },
      { id: "40-49", name: "40-49", color: "#78909C" },
      { id: "50+", name: "50+", color: "#37474F" },
    ] as Node[],
    links: [
      // Google links
      {
        source: "google",
        target: "15-19",
        value: 22,
        color: "rgba(227, 76, 79, 0.4)",
      },
      {
        source: "google",
        target: "20-29",
        value: 28,
        color: "rgba(227, 76, 79, 0.4)",
      },
      {
        source: "google",
        target: "30-39",
        value: 25,
        color: "rgba(227, 76, 79, 0.4)",
      },
      {
        source: "google",
        target: "40-49",
        value: 15,
        color: "rgba(227, 76, 79, 0.4)",
      },
      {
        source: "google",
        target: "50+",
        value: 10,
        color: "rgba(227, 76, 79, 0.4)",
      },

      // Facebook links
      {
        source: "facebook",
        target: "15-19",
        value: 18,
        color: "rgba(66, 103, 178, 0.4)",
      },
      {
        source: "facebook",
        target: "20-29",
        value: 25,
        color: "rgba(66, 103, 178, 0.4)",
      },
      {
        source: "facebook",
        target: "30-39",
        value: 30,
        color: "rgba(66, 103, 178, 0.4)",
      },
      {
        source: "facebook",
        target: "40-49",
        value: 17,
        color: "rgba(66, 103, 178, 0.4)",
      },
      {
        source: "facebook",
        target: "50+",
        value: 10,
        color: "rgba(66, 103, 178, 0.4)",
      },

      // Instagram links
      {
        source: "instagram",
        target: "15-19",
        value: 35,
        color: "rgba(193, 53, 132, 0.4)",
      },
      {
        source: "instagram",
        target: "20-29",
        value: 30,
        color: "rgba(193, 53, 132, 0.4)",
      },
      {
        source: "instagram",
        target: "30-39",
        value: 20,
        color: "rgba(193, 53, 132, 0.4)",
      },
      {
        source: "instagram",
        target: "40-49",
        value: 10,
        color: "rgba(193, 53, 132, 0.4)",
      },
      {
        source: "instagram",
        target: "50+",
        value: 5,
        color: "rgba(193, 53, 132, 0.4)",
      },
    ],
  };

  // Calculate total values for scaling
  const totalSourceValue = data.links.reduce(
    (sum, link) => sum + link.value,
    0
  );

  // Define dimensions
  const width = 700;
  const height = 900;
  const margin = { top: 20, right: 80, bottom: 20, left: 80 };
  const nodeWidth = 25;
  const nodePadding = 12;

  // Calculate positions
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Calculate node positions
  const sourceNodes = data.nodes.slice(0, 3); // Google, Facebook, Instagram
  const targetNodes = data.nodes.slice(3); // Age groups

  // Source node positions (left side)
  sourceNodes.forEach((node, i) => {
    node.x0 = margin.left;
    node.x1 = margin.left + nodeWidth;

    // Calculate y position based on index
    const spacing = innerHeight / sourceNodes.length;
    node.y0 = margin.top + i * spacing;
    node.y1 = node.y0 + spacing - nodePadding;
  });

  // Target node positions (right side)
  targetNodes.forEach((node, i) => {
    node.x0 = width - margin.right - nodeWidth;
    node.x1 = width - margin.right;

    // Calculate y position based on index
    const spacing = innerHeight / targetNodes.length;
    node.y0 = margin.top + i * spacing;
    node.y1 = node.y0 + spacing - nodePadding;
  });

  // Prepare link paths using bezier curves
  const nodeMap: Record<string, Node> = {};
  data.nodes.forEach((node) => {
    nodeMap[node.id] = node;
  });

  // Calculate link positions and generate paths
  const linkPaths = data.links.map((link) => {
    const source = nodeMap[link.source];
    const target = nodeMap[link.target];

    // Calculate link width proportional to value
    const sourceLinks = data.links.filter((l) => l.source === link.source);
    const targetLinks = data.links.filter((l) => l.target === link.target);

    const sourceTotal = sourceLinks.reduce((sum, l) => sum + l.value, 0);
    const targetTotal = targetLinks.reduce((sum, l) => sum + l.value, 0);

    // Calculate vertical positioning for source side
    const sourceIndex = sourceLinks.findIndex((l) => l.target === link.target);
    let sourceOffset = 0;
    for (let i = 0; i < sourceIndex; i++) {
      sourceOffset +=
        (sourceLinks[i].value / sourceTotal) *
        ((source.y1 || 0) - (source.y0 || 0));
    }
    const sourcePosition = (source.y0 || 0) + sourceOffset;
    const sourceHeight =
      (link.value / sourceTotal) * ((source.y1 || 0) - (source.y0 || 0));

    // Calculate vertical positioning for target side
    const targetIndex = targetLinks.findIndex((l) => l.source === link.source);
    let targetOffset = 0;
    for (let i = 0; i < targetIndex; i++) {
      targetOffset +=
        (targetLinks[i].value / targetTotal) *
        ((target.y1 || 0) - (target.y0 || 0));
    }
    const targetPosition = (target.y0 || 0) + targetOffset;
    const targetHeight =
      (link.value / targetTotal) * ((target.y1 || 0) - (target.y0 || 0));

    // Create path data
    return {
      ...link,
      sourceX: source.x1,
      sourceY: sourcePosition,
      sourceHeight,
      targetX: target.x0,
      targetY: targetPosition,
      targetHeight,
    };
  });

  // Custom SVG path creator for the curved links
  const createLinkPath = (link: Link) => {
    const curvature = 0.5;

    // Calculate control points for the bezier curve
    const x0: number = link.sourceX ?? 0;
    const y0: number = (link.sourceY || 0) + (link.sourceHeight || 0) / 2;
    const x1: number = link.targetX ?? 0;
    const y1: number = (link.targetY || 0) + (link.targetHeight || 0) / 2;

    // Control points
    const cp1x = x0 + (x1 - x0) * curvature;
    const cp1y = y0;
    const cp2x = x1 - (x1 - x0) * curvature;
    const cp2y = y1;

    // Calculate path
    return `
      M ${x0},${link.sourceY}
      L ${x0},${(link.sourceY ?? 0) + (link.sourceHeight ?? 0)}
      C ${cp1x},${(link.sourceY ?? 0) + (link.sourceHeight ?? 0)} ${cp2x},${
      (link.targetY ?? 0) + (link.targetHeight ?? 0)
    } ${x1},${(link.targetY ?? 0) + (link.targetHeight ?? 0)}
      L ${x1},${link.targetY}
      C ${cp2x},${link.targetY} ${cp1x},${link.sourceY} ${x0},${link.sourceY}
      Z
    `;
  };

  return (
    <div className="flex items-center justify-center w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          {/* Render nodes */}
          {data.nodes.map((node) => (
            <g key={node.id}>
              <rect
                x={node.x0}
                y={node.y0}
                width={(node.x1 ?? 0) - (node.x0 ?? 0)}
                height={(node.y1 ?? 0) - (node.y0 ?? 0)}
                fill={node.color}
              />
              <text
                x={
                  node.id === "google" ||
                  node.id === "facebook" ||
                  node.id === "instagram"
                    ? (node.x0 ?? 0) - 10
                    : (node.x1 ?? 0) + 10
                }
                y={((node.y0 ?? 0) + (node.y1 ?? 0)) / 2}
                dy="0.35em"
                textAnchor={
                  node.id === "google" ||
                  node.id === "facebook" ||
                  node.id === "instagram"
                    ? "end"
                    : "start"
                }
                fill="#000"
                fontSize={12}
              >
                {node.name}
              </text>
            </g>
          ))}

          {/* Render links */}
          {linkPaths.map((link, i) => (
            <path
              key={`link-${i}`}
              d={createLinkPath(link)}
              fill={link.color}
              stroke="none"
            />
          ))}
        </svg>
      </ResponsiveContainer>
    </div>
  );
};

export default SankeyDiagram;
