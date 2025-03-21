import { Transaction } from "../models/DashboardModel";




    

const TransactionsURL = "https://walpulse-server.onrender.com/transactions"


class  TransactionsService {
    
    async getTransactions(): Promise<Transaction[]> {
        try {
            const response = await fetch(TransactionsURL)
            const data = await response.json()
            return data;
        } catch(error) {
            throw new Error("");
        }
    }

    

}

export default new TransactionsService()