import { use, useEffect, useState } from "react";
import TransactionsService from "../services/transactionsService"; // Adjust the path as needed
import { Transaction } from "../models/DashboardModel";



export const useFetchTransactions =  () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);   
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [error, setError] = useState<string>("");
    const [reFetchKey, setReFetchKey] = useState<number>(0);
    
    
    const fetchTransactions = async () => {
        try {
            setIsLoading(true);
            const transaction = await TransactionsService.getTransactions();
            setTransactions(transaction);

            } catch(error) {
            if (error) {
                setError("Failed to fetch transactions:");
            }
            throw new Error("");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchTransactions();
    }, [reFetchKey])


    const reFetch = () => {
        setReFetchKey(prev => prev + 1)
    }
    
    
    return {
        transactions,
        isLoading,
        error,
        reFetch
    }

}
