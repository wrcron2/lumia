import transactionsService from "../services/transactionsService";

type UtmSourceType =
  | "google"
  | "facebook"
  | "instagram"
  | "tiktok"
  | "twitter"
  | "pinterest"
  | "linkedin";

type GenderType = "male" | "female";
type DeviceType = "web" | "mobile";

export type AgeGroup =
  | "Under 15"
  | "15-19"
  | "20-29"
  | "30-39"
  | "40-49"
  | "50+";

export enum TimeRangeTab {
  Last7Days = 1,
  Last30Days,
  AllTime,
}

export const TimeRangeTabMap: Record<TimeRangeTab, string> = {
  [TimeRangeTab.Last7Days]: "Last 7 Days",
  [TimeRangeTab.Last30Days]: "Last 30 Days",
  [TimeRangeTab.AllTime]: "All Time",
};

export interface Transaction {
  transaction_id: string;
  revenue_usd: number;
  customer_id: string;
  transaction_time: number;
  utm_source: UtmSourceType;
  customer_metadata: {
    birthday_time: number;
    gender: GenderType;
    country: string;
    device: DeviceType;
  };
}

export interface EnrichedTransaction extends Transaction {
  age_group: AgeGroup;
}

export type UtmAgeDemographicNode = {
  id: string;
  name: string;
  color: string;
};

export type UtmAgeDemographicLink = {
  source: string;
  target: string;
  value: number;
  color: string;
};

export interface UtmAgeDemographicData {
  nodes: UtmAgeDemographicNode[];
  links: UtmAgeDemographicLink[];
}

export interface revenueTrendData {
  date: string;
  revenue: number;
}

export const utmColors: Record<
  string,
  { nodeColor: string; linkColor: string }
> = {
  google: { nodeColor: "#FF4545", linkColor: "rgba(227, 76, 79, 0.4)" },
  facebook: { nodeColor: "#4285F4", linkColor: "rgba(66, 103, 178, 0.4)" },
  instagram: { nodeColor: "#C13584", linkColor: "rgba(193, 53, 132, 0.4)" }, // Purple
  tiktok: { nodeColor: "#000000", linkColor: "rgba(0, 0, 0, 0.4)" }, // Black
  twitter: { nodeColor: "#1DA1F2", linkColor: "rgba(29, 161, 242, 0.4)" }, // Light blue
  pinterest: { nodeColor: "#E60073", linkColor: "rgba(230, 0, 35, 0.4)" }, // Red
  linkedin: { nodeColor: "#0A66C2", linkColor: "rgba(10, 102, 194, 0.4)" }, // Blue
};

const ageGroupsColors: Record<string, string> = {
  "Under 15": "#D3D3D3",
  "15-19": "#B0BEC5",
  "20-29": "#90A4AE",
  "30-39": "#78909C",
  "40-49": "#607D8B",
  "50+": "#455A64",
};

export interface TransactionsTabRange {
  totalRevenue: number;
  totalTransactions: number;
  uniqueCustomers: number;
  revenueChange: number;
  transactionsChange: number;
  // uniqueCustomersChange: number;
  utmAgeDemographics: UtmAgeDemographicData;
  revenueAttributionData: DataAttribution[];
  revenueTrendData: { date: string; revenue: number }[];
}

export interface DataAttribution {
  name: string;
  value: number;
  color: string;
  label: string;
}

export const ageObjectColors = [
  { id: "15-19", name: "15-19", color: "#D3D3D3" },
  { id: "20-29", name: "20-29", color: "#B0BEC5" },
  { id: "30-39", name: "30-39", color: "#90A4AE" },
  { id: "40-49", name: "40-49", color: "#78909C" },
  { id: "50+", name: "50+", color: "#37474F" },
];

class DashboardModel {
  transactions: Transaction[] = [];
  dateRange: number = 1;
  utm_sources: string[] = [];
  utm_Data: UtmAgeDemographicData = { nodes: [], links: [] };
  transactionsById: { [key: string]: Transaction } = {};
  transactionsTabRange: TransactionsTabRange = {
    totalRevenue: 0,
    totalTransactions: 0,
    uniqueCustomers: 0,
    revenueChange: 0,
    transactionsChange: 0,
    revenueAttributionData: [],
    revenueTrendData: [],
    // uniqueCustomersChange: 0,
    utmAgeDemographics: { nodes: [], links: [] },
  };

  calculateAgeGroup = (
    birthdayTimestamp: number,
    transactionTimestamp: number
  ): AgeGroup => {
    const ageAtTransaction =
      (transactionTimestamp - birthdayTimestamp) /
      (365.25 * 24 * 60 * 60 * 1000);

    if (ageAtTransaction < 15) return "Under 15";
    if (ageAtTransaction < 20) return "15-19";
    if (ageAtTransaction < 30) return "20-29";
    if (ageAtTransaction < 40) return "30-39";
    if (ageAtTransaction < 50) return "40-49";
    return "50+";
  };

  getDateRange = (
    range: number,
    currentTime = Date.now()
  ): { start: number; end: number; prevStart: number; prevEnd: number } => {
    const DAY_MS = 24 * 60 * 60 * 1000;

    const end = currentTime;
    let start: number;
    let prevEnd: number;
    let prevStart: number;

    switch (range) {
      case 1: {
        start = end - 7 * DAY_MS;
        prevEnd = start - 1;
        prevStart = prevEnd - 7 * DAY_MS;
        break;
      }
      case 2: {
        start = end - 30 * DAY_MS;
        prevEnd = start - 1;
        prevStart = prevEnd - 30 * DAY_MS;
        break;
      }
      case 3:
      default: {
        start = 0;
        prevStart = 0;
        prevEnd = 0;
      }
    }

    return {
      start,
      end,
      prevStart,
      prevEnd,
    };
  };

  generateRevenueAttributionData = (
    transactions: EnrichedTransaction[],
    utm_sources: string[]
  ): DataAttribution[] => {
    const totalRevenue = transactions.reduce(
      (sum, transaction) => sum + transaction.revenue_usd,
      0
    );
    const sourceGroup = transactions.reduce((acc, transaction) => {
      if (!acc[transaction.utm_source]) {
        acc[transaction.utm_source] = 0;
      }
      return {
        ...acc,
        [transaction.utm_source]:
          acc[transaction.utm_source] + transaction.revenue_usd,
      };
    }, {} as Record<string, number>);
    const revenueByUtmSource = utm_sources.map((utm_source: string) => {
      if (!utm_source) {
        console.log("No utm source");
      }
      return {
        name: utm_source,
        value:
          totalRevenue > 0
            ? Math.round(((sourceGroup[utm_source] || 0) / totalRevenue) * 100)
            : 0,
        color: utmColors[utm_source].nodeColor,
        label: utm_source.charAt(0).toUpperCase() + utm_source.slice(1),
      };
    });

    return revenueByUtmSource;
  };

  generateRevenueTrendData = (transactions: EnrichedTransaction[]) => {
    // Step 1: Create a map to store daily totals
    const dailyTotals = new Map<string, number>();

    // Step 2: Process each transaction and aggregate by date
    transactions.forEach((transaction) => {
      // Use transaction_time from your filter logic
      const txDate = new Date(transaction.transaction_time);
      const dateString = txDate.toISOString().split("T")[0]; // YYYY-MM-DD format

      // Get the current total for this date (or 0 if not existing yet)
      const currentTotal = dailyTotals.get(dateString) || 0;

      // Add the transaction amount to the daily total
      // Assuming transaction.amount represents revenue
      dailyTotals.set(dateString, currentTotal + transaction.revenue_usd);
    });

    // Step 3: Convert the map to an array of objects
    let result = Array.from(dailyTotals.entries()).map(([date, revenue]) => ({
      date,
      revenue,
    }));
    result.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Step 5: Ensure all dates in the range are included (fill gaps)
    if (transactions.length > 0) {
      // Get min and max dates from the filtered transactions
      const dates = transactions.map((tx) =>
        new Date(tx.transaction_time).getTime()
      );
      const minDate = new Date(Math.min(...dates));
      const maxDate = new Date(Math.max(...dates));

      // Format to YYYY-MM-DD for consistency
      const startDateStr = minDate.toISOString().split("T")[0];
      const endDateStr = maxDate.toISOString().split("T")[0];

      // Create complete array with all dates
      const completeResult: { date: string; revenue: number }[] = [];
      const startDate = new Date(startDateStr);
      const endDate = new Date(endDateStr);

      // Iterate through each day in the range
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const dateStr = currentDate.toISOString().split("T")[0];

        // Find if we have data for this date
        const existingData = result.find((item) => item.date === dateStr);

        if (existingData) {
          completeResult.push(existingData);
        } else {
          // If no data exists for this date, add with zero revenue
          completeResult.push({
            date: dateStr,
            revenue: 0,
          });
        }

        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
      }

      result = completeResult;
    }

    return result;
  };

  generateUtmAgeDemographicData(
    transactions: EnrichedTransaction[],
    utm_sources: string[]
  ): UtmAgeDemographicData {
    const utmSourcesNodes = utm_sources.map((item) => {
      return {
        id: item,
        name: item.charAt(0).toUpperCase() + item.slice(1),
        color: utmColors[item].nodeColor,
      };
    });

    const links: UtmAgeDemographicLink[] = transactions.map(
      (transaction: EnrichedTransaction) => {
        const ageGroup = this.calculateAgeGroup(
          transaction.customer_metadata.birthday_time,
          transaction.transaction_time
        );
        return {
          source: transaction.utm_source,
          target: ageGroup,
          value: transaction.revenue_usd,
          color: utmColors[transaction.utm_source].linkColor,
        };
      }
    );

    return {
      nodes: [...utmSourcesNodes, ...ageObjectColors],
      links,
    };
  }

  getUTMSources = (transactions: Transaction[]) => {
    return [
      ...new Set(transactions.map((transactions) => transactions.utm_source)),
    ];
  };

  getEnrichedTransactions = (transactions: Transaction[]) => {
    return transactions.map((transaction: Transaction) => {
      return {
        ...transaction,
        age_group: this.calculateAgeGroup(
          transaction.customer_metadata.birthday_time,
          transaction.transaction_time
        ),
      };
    });
  };

  processTransactions = (transactions: Transaction[], dateRang: number) => {
    this.transactions = transactions;
    this.dateRange = dateRang;
    const utm_sources = this.getUTMSources(transactions);
    // const enrichedTransaction: EnrichedTransaction[] = transactions.map(
    //   (transaction: Transaction) => {
    //     return {
    //       ...transaction,
    //       age_group: this.calculateAgeGroup(
    //         transaction.customer_metadata.birthday_time,
    //         transaction.transaction_time
    //       ),
    //     };
    //   }
    // );
    const enrichedTransaction: EnrichedTransaction[] =
      this.getEnrichedTransactions(transactions);

    const { end, start, prevEnd, prevStart } = this.getDateRange(dateRang);

    // Filter transactions for current period
    const currentTransactions = enrichedTransaction.filter(
      (transaction: EnrichedTransaction) => {
        return (
          transaction.transaction_time >= start &&
          transaction.transaction_time <= end
        );
      }
    );

    // Filter transactions for previous period
    const previousTransactions = enrichedTransaction.filter(
      (transaction: EnrichedTransaction) => {
        return (
          transaction.transaction_time >= prevStart &&
          transaction.transaction_time <= prevEnd
        );
      }
    );

    // Calculate current metrics
    const totalRevenue = currentTransactions.reduce(
      (sum, t) => sum + t.revenue_usd,
      0
    );
    const totalTransactions = currentTransactions.length;
    const uniqueCustomers = new Set(
      currentTransactions.map((t) => t.customer_id)
    ).size;

    // Calculate previous metrics (for change calculation)
    const prevRevenue = previousTransactions.reduce(
      (sum, t) => sum + t.revenue_usd,
      0
    );
    const prevTransactions = previousTransactions.length;
    // const prevUniqueCustomers = new Set(
    //   previousTransactions.map((t) => t.customer_id)
    // ).size;

    //calculate percentage change
    const revenueChange =
      prevRevenue === 0
        ? 0
        : ((totalRevenue - prevRevenue) / prevRevenue) * 100;
    const transactionsChange =
      prevTransactions === 0
        ? 0
        : ((totalTransactions - prevTransactions) / prevTransactions) * 100;
    // const uniqueCustomersChange = prevUniqueCustomers === 0 ? 0 : ((uniqueCustomers - prevUniqueCustomers) / prevUniqueCustomers) * 100

    const utmAgeDemographics = this.generateUtmAgeDemographicData(
      currentTransactions,
      utm_sources
    );
    const revenueAttributionData = this.generateRevenueAttributionData(
      currentTransactions,
      utm_sources
    );
    const revenueTrendData = this.generateRevenueTrendData(currentTransactions);
    this.transactionsTabRange = {
      totalRevenue,
      totalTransactions,
      uniqueCustomers,
      revenueChange,
      transactionsChange,
      // uniqueCustomersChange,
      utmAgeDemographics,
      revenueAttributionData,
      revenueTrendData,
    };
    return {
      totalRevenue,
      totalTransactions,
      uniqueCustomers,
      revenueChange,
      transactionsChange,
      // uniqueCustomersChange,
      utmAgeDemographics,
      revenueAttributionData,
      revenueTrendData,
    };
  };
}

export default new DashboardModel();
