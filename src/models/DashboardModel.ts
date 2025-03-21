import transactionsService from "../services/transactionsService"

type UtmSourceType = "google" | "facebook" | "instagram" | "tiktok" |
    "twitter" | "pinterest" | "linkedin"

type GenderType = "male" | "female"
type DeviceType =  "web" | "mobile"


export type AgeGroup = "Under 15" | "15-19" | "20-29" | "30-39" | "40-49" | "50+";


export interface Transaction {
    transaction_id: string,
    revenue_usd: number,
    customer_id: string,
    transaction_time: number,
    utm_source: UtmSourceType
    customer_metadata: {
    birthday_time: number,
    gender:GenderType
    country: string,
    device: DeviceType
    }
}



export interface EnrichedTransaction extends Transaction {
    age_group: AgeGroup;
  }

  export type UtmAgeDemographicNode = {
    id: string;
    name: string;
    color: string;   
  }

  export type UtmAgeDemographicLink = {
    source: string;
    target: string;
    value: number;
    color: string;
  }

export interface UtmAgeDemographicData {
    nodes: UtmAgeDemographicNode[];
    links: UtmAgeDemographicLink[];
  }  

type AgeGroupType = Record<number, Transaction>


const utmColors: Record<string, {nodeColor: string, linkColor: string}> = {
    google: {nodeColor: '#FF4545', linkColor: 'rgba(227, 76, 79, 0.4)'},   
    facebook:{ nodeColor: '#4285F4', linkColor: 'rgba(66, 103, 178, 0.4)'},
    instagram: {nodeColor: '#C13584', linkColor: "rgba(193, 53, 132, 0.4)"}, // Purple
    tiktok: {nodeColor: '#000000', linkColor: 'rgba(0, 0, 0, 0.4)'},   // Black
    twitter: {nodeColor: '#1DA1F2', linkColor: 'rgba(29, 161, 242, 0.4)'},  // Light blue
    pinterest: {nodeColor: '#E60023', linkColor: 'rgba(230, 0, 35, 0.4)'}, // Red
    linkedin: {nodeColor: '#0A66C2', linkColor: 'rgba(10, 102, 194, 0.4)'}  // Blue
 }

 const ageGroupsColors: Record<string, string> = {
    "Under 15": "#D3D3D3",
    "15-19": "#B0BEC5",
    "20-29": "#90A4AE",
    "30-39": "#78909C",
    "40-49": "#607D8B",
    "50+": "#455A64",
 }


 export interface TransactionsTabRange {
    totalRevenue: number;
    totalTransactions: number;
    uniqueCustomers: number;
    revenueChange: number;
    transactionsChange: number;
    // uniqueCustomersChange: number;
    utmAgeDemographics: UtmAgeDemographicData;
  } 
 


const ageObjectColors = [
    { id: '15-19', name: '15-19', color: '#D3D3D3' },
    { id: '20-29', name: '20-29', color: '#B0BEC5' },
    { id: '30-39', name: '30-39', color: '#90A4AE' },
    { id: '40-49', name: '40-49', color: '#78909C' },
    { id: '50+', name: '50+', color: '#37474F' }
]




 class DashboardModel {
    transactions: Transaction[] = [];
    utm_Data: UtmAgeDemographicData = { nodes: [], links: [] };
    transactionsById: { [key: string]: Transaction } = {}
    transactionsTabRange: TransactionsTabRange = {
        totalRevenue: 0,
        totalTransactions: 0,
        uniqueCustomers: 0,
        revenueChange: 0,
        transactionsChange: 0,
        // uniqueCustomersChange: 0,
        utmAgeDemographics: { nodes: [], links: [] },
      };




    calculateAgeGroup = (birthdayTimestamp: number, transactionTimestamp: number): AgeGroup => {
        const ageAtTransaction = (transactionTimestamp - birthdayTimestamp) / (365.25 * 24 * 60 * 60 * 1000);
        
        if (ageAtTransaction < 15) return "Under 15";
        if (ageAtTransaction < 20) return "15-19";
        if (ageAtTransaction < 30) return "20-29";
        if (ageAtTransaction < 40) return "30-39";
        if (ageAtTransaction < 50) return "40-49";
        return "50+";
      };


      

    getDateRange = (range: string, currentTime = Date.now()): { start: number, end: number, prevStart: number, prevEnd: number } => {
            const DAY_MS = 24 * 60 * 60  * 1000

            const end = currentTime 
            let start:number 
            let prevEnd: number
            let prevStart: number
        
        switch(range) {
            case "7d": {

                start = end -( 7 * DAY_MS)
                prevEnd = start - 1
                prevStart = prevEnd - (7 * DAY_MS)
                break;

            }
            case "30d": {
                start = end - (30 * DAY_MS)
                prevEnd = start - 1
                prevStart = prevEnd - (30 * DAY_MS)
                break;
            }
            case "all":

            default: {
                start = 0
                prevStart  = 0
                prevEnd = 0
            } 
        }

        return {
            start,
            end,
            prevStart,
            prevEnd
        }
      }

    generateUtmAgeDemographicData(transactions: EnrichedTransaction[]): UtmAgeDemographicData {
        const utm_sources = [...new Set(transactions.map(transactions => transactions.utm_source))] 
        // ["Under 15", "15-19", "20-29", "30-39", "40-49"] 
        const utmSourcesNodes =  utm_sources.map(item => {
            return {
                id: item,
                name: item.charAt(0).toUpperCase() + item.slice(1),
                color: utmColors[item].nodeColor
            }
        })


        const links:UtmAgeDemographicLink[]  = transactions.map((transaction: EnrichedTransaction) => {
            
            const ageGroup = this.calculateAgeGroup(transaction.customer_metadata.birthday_time, transaction.transaction_time)
            return {
                source: transaction.utm_source,
                target: ageGroup,
                value: transaction.revenue_usd,
                color: utmColors[transaction.utm_source].linkColor
            }
        })
    
        return {
            nodes: [...utmSourcesNodes, ...ageObjectColors],
            links
        }
    }
    processTransactions = (transactions: Transaction[], dateRang:string) => {
            const enrichedTransaction: EnrichedTransaction[]  = transactions.map((transaction: Transaction) => {
                
                return {
                    ...transaction,
                    age_group: this.calculateAgeGroup(transaction.customer_metadata.birthday_time, transaction.transaction_time)
                }

            })

            const { end, start, prevEnd, prevStart } = this.getDateRange(dateRang)


              // Filter transactions for current period
            const currentTransactions = enrichedTransaction.filter((transaction: EnrichedTransaction) => {
                return transaction.transaction_time >= start && transaction.transaction_time <= end;
            })

            // Filter transactions for previous period
            const previousTransactions = enrichedTransaction.filter((transaction: EnrichedTransaction) => {
                return transaction.transaction_time >= prevStart && transaction.transaction_time <= prevEnd;
            });

            // Calculate current metrics
            const totalRevenue = currentTransactions.reduce((sum, t) => sum + t.revenue_usd, 0);
            const totalTransactions = currentTransactions.length;
            const uniqueCustomers = new Set(currentTransactions.map(t => t.customer_id)).size;
  

            // Calculate previous metrics (for change calculation)
            const prevRevenue = previousTransactions.reduce((sum, t) => sum + t.revenue_usd, 0);
            const prevTransactions = previousTransactions.length;
            const prevUniqueCustomers = new Set(previousTransactions.map(t => t.customer_id)).size;


            //calculate percentage change
            const revenueChange = prevRevenue === 0 ? 0 : ((totalRevenue - prevRevenue) / prevRevenue) * 100;
            const transactionsChange = prevTransactions === 0 ? 0 : ((totalTransactions - prevTransactions) / prevTransactions) * 100;
            // const uniqueCustomersChange = prevUniqueCustomers === 0 ? 0 : ((uniqueCustomers - prevUniqueCustomers) / prevUniqueCustomers) * 100
            
            const utmAgeDemographics = this.generateUtmAgeDemographicData(currentTransactions);
            this.transactionsTabRange = {
                totalRevenue,
                totalTransactions,
                uniqueCustomers,
                revenueChange,
                transactionsChange,
                // uniqueCustomersChange,
                utmAgeDemographics
            }
            return {
                totalRevenue,
                totalTransactions,
                uniqueCustomers,
                revenueChange,
                transactionsChange,
                // uniqueCustomersChange,
                utmAgeDemographics
            }
      }
}



export default new DashboardModel()