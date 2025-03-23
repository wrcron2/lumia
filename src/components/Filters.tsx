import React, { useEffect, useState } from "react";
import { X, Check, RefreshCw } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { filtersActions } from "../redux/slices/filtersSlice";

const FilterPanel = () => {
  const dispatch = useDispatch();
  const utms = useSelector((state: RootState) => state.filters.utms);
  const gender = useSelector((state: RootState) => state.filters.gender);
  const ageGroups = useSelector((state: RootState) => state.filters.ageGroups);
  const revenue = useSelector((state: RootState) => state.filters.revenue);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<{
    utmSource: string[];
    ageGroup: string[];
    revenueRange: string[];
    gender: string[];
    dateRange: string;
  }>({
    utmSource: [],
    ageGroup: [],
    revenueRange: [],
    gender: [],
    dateRange: "last7",
  });

  const utmOptions = [
    "Instagram",
    "Facebook",
    "Google",
    "Twitter",
    "TikTok",
    "Pinterest",
    "LinkedIn",
    "Direct",
    "Email",
  ];
  const ageOptions = ["15-19", "20-29", "30-39", "40-49", "50+"];
  const revenueOptions = [
    "$0-$100",
    "$100-$500",
    "$500-$1000",
    "$1000-$5000",
    "$5000+",
  ];
  const genderOptions = ["Male", "Female", "Non-binary", "Not specified"];
  const dateOptions = [
    { id: "last7", label: "Last 7 Days" },
    { id: "last30", label: "Last 30 Days" },
    { id: "lastQuarter", label: "Last Quarter" },
    { id: "lastYear", label: "Last Year" },
    { id: "allTime", label: "All Time" },
    { id: "custom", label: "Custom Range" },
  ];

  const toggleFilter = (
    category: Exclude<keyof typeof selectedFilters, "dateRange">,
    value: string
  ) => {
    setSelectedFilters((prev) => {
      const newFilters = { ...prev };
      if (Array.isArray(newFilters[category])) {
        if (newFilters[category].includes(value)) {
          newFilters[category] = newFilters[category].filter(
            (item) => item !== value
          );
        } else {
          newFilters[category] = [...newFilters[category], value];
        }
      }
      return newFilters;
    });
    switch (category) {
      case "utmSource":
        // Toggle in redux state
        const newUtms = selectedFilters.utmSource.includes(value)
          ? selectedFilters.utmSource.filter((item) => item !== value)
          : [...selectedFilters.utmSource, value];
        dispatch(filtersActions.setUtmmFilter(newUtms));
        break;
      case "gender":
        const newGenders = selectedFilters.gender.includes(value)
          ? selectedFilters.gender.filter((item) => item !== value)
          : [...selectedFilters.gender, value];
        dispatch(filtersActions.setGenderFilter(newGenders));
        break;
      case "ageGroup":
        const newAgeGroups = selectedFilters.ageGroup.includes(value)
          ? selectedFilters.ageGroup.filter((item) => item !== value)
          : [...selectedFilters.ageGroup, value];
        dispatch(filtersActions.setAgeGroupFilter(newAgeGroups));
        break;
      case "revenueRange":
        const newRevenue = selectedFilters.revenueRange.includes(value)
          ? selectedFilters.revenueRange.filter((item) => item !== value)
          : [...selectedFilters.revenueRange, value];
        // Note: Your slice expects numbers, but your UI shows strings like "$0-$100"
        // You may need to convert these values or update your slice to accept strings
        dispatch(filtersActions.setRevenueFilter(newRevenue.map((range) => parseFloat(range.replace(/[^0-9]/g, '')))));
        break;
      default:
        break;
    }
  };

  const setDateRange = (value: string) => {
    setSelectedFilters((prev) => ({ ...prev, dateRange: value }));
  };

  const clearAllFilters = () => {
    setSelectedFilters({
      utmSource: [],
      ageGroup: [],
      revenueRange: [],
      gender: [],
      dateRange: "last7",
    });
    dispatch(filtersActions.setUtmmFilter([]));
    dispatch(filtersActions.setGenderFilter([]));
    dispatch(filtersActions.setAgeGroupFilter([]));
    dispatch(filtersActions.setRevenueFilter([]));
    setSelectedFilters((prev) => ({ ...prev, dateRange: "last7" }));
  };

  useEffect(() => {
    setSelectedFilters((prev) => ({
      ...prev,
      utmSource: utms || [],
      gender: gender || [],
    }));
  }, [utms, gender]);

  useEffect(() => {
    setSelectedFilters((prev) => ({
      ...prev,
      ageGroup: ageGroups || [],
      revenueRange: (revenue || []).map(String),
    }));
  }, [ageGroups, revenue]);

  const applyFilters = () => {
    console.log("Applying filters:", selectedFilters);
    setIsOpen(false);
    // Here you would typically pass these filters to a parent component or state management solution
  };

  const FilterSection = ({
    title,
    options,
    category,
  }: {
    title: string;
    options: string[];
    category: keyof typeof selectedFilters;
  }) => (
    <div className="mb-6">
      <h3 className="text-sm font-medium mb-3 text-gray-700">{title}</h3>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => (
          <div
            key={option}
            className={`flex items-center px-3 py-2 rounded-md text-sm cursor-pointer border ${
              selectedFilters[category].includes(option)
                ? "bg-blue-50 border-blue-200 text-blue-600"
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => {
              if (category !== "dateRange") toggleFilter(category, option);
            }}
          >
            <div
              className={`w-4 h-4 mr-2 flex items-center justify-center rounded-sm border ${
                selectedFilters[category].includes(option)
                  ? "bg-blue-500 border-blue-500"
                  : "border-gray-300"
              }`}
            >
              {selectedFilters[category].includes(option) && (
                <Check size={12} color="white" />
              )}
            </div>
            {option}
          </div>
        ))}
      </div>
    </div>
  );

  const DateRangeSection = () => (
    <div className="mb-6">
      <h3 className="text-sm font-medium mb-3 text-gray-700">Date Range</h3>
      <div className="grid grid-cols-2 gap-2">
        {dateOptions.map((option) => (
          <div
            key={option.id}
            className={`flex items-center px-3 py-2 rounded-md text-sm cursor-pointer border ${
              selectedFilters.dateRange === option.id
                ? "bg-blue-50 border-blue-200 text-blue-600"
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => setDateRange(option.id)}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <React.Fragment>
      <div className="z-30">
        <div onClick={() => setIsOpen(!isOpen)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
        </div>
      </div>
      <div className="flex flex-col h-screen">
        {/* Filter Panel */}
        <div
          className={`fixed inset-y-0 right-0 w-80 md:w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-medium">Advanced Filters</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
              <FilterSection
                title="UTM Source"
                options={utmOptions}
                category="utmSource"
              />
              <FilterSection
                title="Age Group"
                options={ageOptions}
                category="ageGroup"
              />
              <FilterSection
                title="Revenue Range"
                options={revenueOptions}
                category="revenueRange"
              />
              <FilterSection
                title="Gender"
                options={genderOptions}
                category="gender"
              />
              <DateRangeSection />
            </div>

            {/* Footer */}
            <div className="border-t p-4 flex justify-between">
              <button
                onClick={clearAllFilters}
                className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md"
              >
                <RefreshCw size={16} className="mr-2" />
                Reset All
              </button>
              <button
                onClick={applyFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default FilterPanel;
