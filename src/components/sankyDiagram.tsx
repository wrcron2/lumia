import React, { useEffect, useMemo, useState } from "react";
import { ResponsiveContainer } from "recharts";
import DashboardModel, {
  UtmAgeDemographicLink,
  UtmAgeDemographicNode,
} from "../models/DashboardModel";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface Node extends UtmAgeDemographicNode {
  id: string;
  name: string;
  color: string;
  x0?: number;
  x1?: number;
  y0?: number;
  y1?: number;
}

interface Link extends UtmAgeDemographicLink {
  sourceX?: number;
  sourceY?: number;
  sourceHeight?: number;
  targetX?: number;
  targetY?: number;
  targetHeight?: number;
}

interface SankeyDiagramProps {
  // isPending: boolean;
}

const SankeyDiagram: React.FC<SankeyDiagramProps> = React.memo(() => {
  const [dataGroup, setData] = useState<{ nodes: Node[]; links: Link[] }>({
    nodes: [],
    links: [],
  });

  const updateKey = useSelector((s: RootState) => s.ageGroup.updateKey);

  useEffect(() => {
    if (updateKey) {
      setData(DashboardModel.transactionsTabRange.utmAgeDemographics);
    }
  }, [updateKey]);

  const data = dataGroup as { nodes: Node[]; links: Link[] };

  // if (data.nodes.length === 0) {
  //   return <div>Loading...</div>;
  // }
  console.log("rendering SankeyDiagram");

  // Define dimensions - these don't need memoization as they're static values
  const width = 820;
  const height = 1200;
  const margin = { top: 20, right: 80, bottom: 20, left: 80 };
  const nodeWidth = 25;
  const nodePadding = 12;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Memoize the filtered nodes
  const { sourceNodes, targetNodes } = useMemo(() => {
    // Create deep clones to avoid modifying Redux state
    const sourceNodes = JSON.parse(
      JSON.stringify(data.nodes.filter((node) => /^[a-zA-Z]+$/.test(node.id)))
    );

    const targetNodes = JSON.parse(
      JSON.stringify(data.nodes.filter((node) => !/^[a-zA-Z]+$/.test(node.id)))
    );

    // Position calculations moved inside the memo
    sourceNodes.forEach(
      (node: { x0: number; x1: number; y0: number; y1: number }, i: number) => {
        node.x0 = margin.left;
        node.x1 = margin.left + nodeWidth;
        const spacing = innerHeight / sourceNodes.length;
        node.y0 = margin.top + i * spacing;
        node.y1 = node.y0 + spacing - nodePadding;
      }
    );

    targetNodes.forEach(
      (node: { x0: number; x1: number; y0: number; y1: number }, i: number) => {
        node.x0 = width - margin.right - nodeWidth;
        node.x1 = width - margin.right;
        const spacing = innerHeight / targetNodes.length;
        node.y0 = margin.top + i * spacing;
        node.y1 = node.y0 + spacing - nodePadding;
      }
    );

    return { sourceNodes, targetNodes };
  }, [data.nodes, margin, innerHeight, nodeWidth, nodePadding]);

  // Memoize the node map
  const nodeMap = useMemo(() => {
    const map: Record<string, Node> = {};
    // Combine both arrays to create the complete node map
    [...sourceNodes, ...targetNodes].forEach((node) => {
      map[node.id] = node;
    });
    return map;
  }, [sourceNodes, targetNodes]);

  // Memoize the link paths calculation
  const linkPaths = useMemo(() => {
    return data.links.map((link) => {
      const source = nodeMap[link.source];
      const target = nodeMap[link.target];

      // Calculate link width proportional to value
      const sourceLinks = data.links.filter((l) => l.source === link.source);
      const targetLinks = data.links.filter((l) => l.target === link.target);

      const sourceTotal = sourceLinks.reduce((sum, l) => sum + l.value, 0);
      const targetTotal = targetLinks.reduce((sum, l) => sum + l.value, 0);

      // Calculate vertical positioning for source side
      const sourceIndex = sourceLinks.findIndex(
        (l) => l.target === link.target
      );
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
      const targetIndex = targetLinks.findIndex(
        (l) => l.source === link.source
      );
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
  }, [data.links, nodeMap]);

  // Memoize the createLinkPath function
  const createLinkPath = useMemo(() => {
    return (link: Link) => {
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
  }, []);

  return (
    <div className="flex flex-col justify-center w-full h-full">
      <React.Fragment>
        <p className="text-gray-500 m-2 pl-3 mt-5">
          UTM Source / Revenue Attribution
        </p>
        <ResponsiveContainer width="100%" height="100%">
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            {/* Render all nodes from both arrays */}
            {[...sourceNodes, ...targetNodes].map((node) => (
              <g key={node.id}>
                <rect
                  x={node.x0}
                  y={node.y0}
                  width={(node.x1 ?? 0) - (node.x0 ?? 0)}
                  height={(node.y1 ?? 0) - (node.y0 ?? 0)}
                  fill={node.color}
                />
                <text
                  className="text-[1.9rem] sm:text-[1rem]"
                  x={
                    sourceNodes.find((sn: { id: any }) => sn.id === node.id)
                      ? (node.x0 ?? 0) - 10
                      : (node.x1 ?? 0) + 10
                  }
                  y={((node.y0 ?? 0) + (node.y1 ?? 0)) / 2}
                  dy="0.35em"
                  textAnchor={
                    sourceNodes.find((sn: { id: any }) => sn.id === node.id)
                      ? "end"
                      : "start"
                  }
                  fill="#000"
                  fontSize={"2rem"}
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
        </ResponsiveContainer>{" "}
      </React.Fragment>
    </div>
  );
});

export default SankeyDiagram;

// const SankeyDiagram: React.FC<SankeyDiagramProps> = React.memo(() => {
//   const [dataGroup, setData] = useState<SankeyDiagramProps>({
//     nodes: [],
//     links: [],
//   });
//   // const deferredData = useDeferredValue(dataGroup)

//   const updateKey = useSelector((s: RootState) => s.ageGroup.updateKey);

//   const isLoading = useSelector((s: RootState) => s.ageGroup.processLoading);
//   console.log("rendering SankeyDiagram");

//   useEffect(() => {
//     if (!isLoading && updateKey) {
//       setData(DashboardModel.transactionsTabRange.utmAgeDemographics);
//     }
//   }, [isLoading, updateKey]);

//   const data = dataGroup as { nodes: Node[]; links: Link[] };

//   if (data.nodes.length === 0) {
//     return <div>Loading...</div>;
//   }

//   // Define dimensions
//   const width = 820;
//   const height = 1200;
//   const margin = { top: 20, right: 80, bottom: 20, left: 80 };
//   const nodeWidth = 25;
//   const nodePadding = 12;

//   // Calculate positions
//   const innerWidth = width - margin.left - margin.right;
//   const innerHeight = height - margin.top - margin.bottom;

//   // Calculate node positions
//   // filter out items with string id that includes numbers  use regex
//   const sourceNodes = data.nodes.filter((node) => /^[a-zA-Z]+$/.test(node.id)); // Google, Facebook, Instagram
//   // filter out items  with string id that not  includes names
//   const targetNodes = data.nodes.filter((node) => !/^[a-zA-Z]+$/.test(node.id)); // 15-19, 20-29, 30-39, 40-49, 50+

//   // Source node positions (left side)
//   sourceNodes.forEach((node, i) => {
//     node.x0 = margin.left;
//     node.x1 = margin.left + nodeWidth;

//     // Calculate y position based on index
//     const spacing = innerHeight / sourceNodes.length;
//     node.y0 = margin.top + i * spacing;
//     node.y1 = node.y0 + spacing - nodePadding;
//   });

//   // Target node positions (right side)
//   targetNodes.forEach((node, i) => {
//     node.x0 = width - margin.right - nodeWidth;
//     node.x1 = width - margin.right;

//     // Calculate y position based on index
//     const spacing = innerHeight / targetNodes.length;
//     node.y0 = margin.top + i * spacing;
//     node.y1 = node.y0 + spacing - nodePadding;
//   });

//   // Prepare link paths using bezier curves
//   const nodeMap: Record<string, Node> = {};
//   data.nodes.forEach((node) => {
//     nodeMap[node.id] = node;
//   });

//   // Calculate link positions and generate paths
//   const linkPaths = data.links.map((link) => {
//     const source = nodeMap[link.source];
//     const target = nodeMap[link.target];

//     // Calculate link width proportional to value
//     const sourceLinks = data.links.filter((l) => l.source === link.source);
//     const targetLinks = data.links.filter((l) => l.target === link.target);

//     const sourceTotal = sourceLinks.reduce((sum, l) => sum + l.value, 0);
//     const targetTotal = targetLinks.reduce((sum, l) => sum + l.value, 0);

//     // Calculate vertical positioning for source side
//     const sourceIndex = sourceLinks.findIndex((l) => l.target === link.target);
//     let sourceOffset = 0;
//     for (let i = 0; i < sourceIndex; i++) {
//       sourceOffset +=
//         (sourceLinks[i].value / sourceTotal) *
//         ((source.y1 || 0) - (source.y0 || 0));
//     }
//     const sourcePosition = (source.y0 || 0) + sourceOffset;
//     const sourceHeight =
//       (link.value / sourceTotal) * ((source.y1 || 0) - (source.y0 || 0));

//     // Calculate vertical positioning for target side
//     const targetIndex = targetLinks.findIndex((l) => l.source === link.source);
//     let targetOffset = 0;
//     for (let i = 0; i < targetIndex; i++) {
//       targetOffset +=
//         (targetLinks[i].value / targetTotal) *
//         ((target.y1 || 0) - (target.y0 || 0));
//     }
//     const targetPosition = (target.y0 || 0) + targetOffset;
//     const targetHeight =
//       (link.value / targetTotal) * ((target.y1 || 0) - (target.y0 || 0));

//     // Create path data
//     return {
//       ...link,
//       sourceX: source.x1,
//       sourceY: sourcePosition,
//       sourceHeight,
//       targetX: target.x0,
//       targetY: targetPosition,
//       targetHeight,
//     };
//   });

//   // Custom SVG path creator for the curved links
//   const createLinkPath = (link: Link) => {
//     const curvature = 0.5;

//     // Calculate control points for the bezier curve
//     const x0: number = link.sourceX ?? 0;
//     const y0: number = (link.sourceY || 0) + (link.sourceHeight || 0) / 2;
//     const x1: number = link.targetX ?? 0;
//     const y1: number = (link.targetY || 0) + (link.targetHeight || 0) / 2;

//     // Control points
//     const cp1x = x0 + (x1 - x0) * curvature;
//     const cp1y = y0;
//     const cp2x = x1 - (x1 - x0) * curvature;
//     const cp2y = y1;

//     // Calculate path
//     return `
//       M ${x0},${link.sourceY}
//       L ${x0},${(link.sourceY ?? 0) + (link.sourceHeight ?? 0)}
//       C ${cp1x},${(link.sourceY ?? 0) + (link.sourceHeight ?? 0)} ${cp2x},${
//       (link.targetY ?? 0) + (link.targetHeight ?? 0)
//     } ${x1},${(link.targetY ?? 0) + (link.targetHeight ?? 0)}
//       L ${x1},${link.targetY}
//       C ${cp2x},${link.targetY} ${cp1x},${link.sourceY} ${x0},${link.sourceY}
//       Z
//     `;
//   };

//   return (
//     <div className="flex flex-col  justify-center w-full h-full">
//       <p className="text-gray-500 m-2 pl-3 mt-5">
//         UTM Source / Revenue Attribution
//       </p>
//       <ResponsiveContainer width="100%" height="100%">
//         <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
//           {/* Render nodes */}
//           {data.nodes.map((node) => (
//             <g key={node.id}>
//               <rect
//                 x={node.x0}
//                 y={node.y0}
//                 width={(node.x1 ?? 0) - (node.x0 ?? 0)}
//                 height={(node.y1 ?? 0) - (node.y0 ?? 0)}
//                 fill={node.color}
//               />
//               <text
//                 className="text-[1.9rem] sm:text-[1rem]"
//                 x={
//                   sourceNodes.find((sn) => sn.id === node.id)
//                     ? (node.x0 ?? 0) - 10
//                     : (node.x1 ?? 0) + 10
//                 }
//                 y={((node.y0 ?? 0) + (node.y1 ?? 0)) / 2}
//                 dy="0.35em"
//                 textAnchor={
//                   sourceNodes.find((sn) => sn.id === node.id) ? "end" : "start"
//                 }
//                 fill="#000"
//                 fontSize={"2rem"}
//               >
//                 {node.name}
//               </text>
//             </g>
//           ))}

//           {/* Render links */}
//           {linkPaths.map((link, i) => (
//             <path
//               key={`link-${i}`}
//               d={createLinkPath(link)}
//               fill={link.color}
//               stroke="none"
//             />
//           ))}
//         </svg>
//       </ResponsiveContainer>
//     </div>
//   );
// });

// export default SankeyDiagram;
