
export const renderSankeyDiagram = () => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 h-[360px]">
      <div className="w-full h-full flex">
        {/* Left labels */}
        <div className="w-1/6 h-full flex flex-col justify-between">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="w-full h-8 bg-gray-200 rounded"></div>
          ))}
        </div>

        {/* Middle part (lines) */}
        <div className="w-4/6 h-full bg-gray-100 rounded-lg"></div>

        <div className="w-1/6 h-full flex flex-col justify-between">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="w-full h-8 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

const LoadingPage: React.FC<{}> = () => {
  

  return (
    <div className="w-full animate-pulse h-full">
      <div className="flex items-center justify-between mb-6 bg-blue-50 p-3 rounded">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div className="ml-2 w-24 h-6 bg-gray-200 rounded"></div>
        </div>
        <div className="flex space-x-2">
          <div className="w-24 h-8 bg-blue-500 rounded-full"></div>
          <div className="w-24 h-8 bg-gray-200 rounded-full"></div>
          <div className="w-24 h-8 bg-gray-200 rounded-full"></div>
        </div>
        <div className="w-8 h-8 bg-gray-200 rounded"></div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-4">
            <div className="w-24 h-5 bg-gray-200 rounded mb-3"></div>
            <div className="w-32 h-8 bg-gray-300 rounded mb-2"></div>
            <div className="w-16 h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Sankey diagram skeleton */}
        {renderSankeyDiagram()}

        <div className="flex flex-col gap-4">
          {/* Source attribution pie chart skeleton */}

          {/* Revenue trend chart skeleton */}
          <div className="border border-gray-200 rounded-lg p-4 h-[170px]">
            <div className="w-32 h-5 bg-gray-200 rounded mb-3"></div>

            <div className="flex h-[calc(100%-2rem)]">
              {/* Y-axis labels */}
              <div className="w-16 flex flex-col justify-between">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-12 h-3 bg-gray-200 rounded"></div>
                ))}
              </div>

              {/* Graph area */}
              <div className="flex-1 flex flex-col">
                <div className="flex-1 relative">
                  {/* Horizontal grid lines */}
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="absolute w-full h-px bg-gray-100"
                      style={{ top: `${i * 20}%` }}
                    ></div>
                  ))}

                  {/* Fake trend line */}
                  <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-b from-gray-200 to-white rounded-lg"></div>
                </div>

                {/* X-axis labels */}
                <div className="h-6 flex justify-between mt-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="w-10 h-3 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
